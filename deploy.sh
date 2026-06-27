#!/usr/bin/env bash
# Déploiement automatisé d'Aura News (AlphaLens Daily) sur le VPS.
#   build standalone (local) -> upload -> swap atomique -> restart -> healthcheck
#   -> rollback automatique si le healthcheck échoue.
# Ne touche PAS aux secrets (/opt/aura-news/.env reste en place) ni aux autres
# services du VPS (rebondpro, backend, Caddy existant).
#
# Usage:  ./deploy.sh            (build + déploie)
#         ./deploy.sh --no-build (réutilise le build local existant)
#         ./deploy.sh --dry-run  (montre les étapes sans rien envoyer)
set -euo pipefail

# ── Config (surchargeable par variables d'env) ──
HOST="${DEPLOY_HOST:-root@204.168.138.243}"
SSH_KEY="${DEPLOY_SSH_KEY:-$HOME/.ssh/rebondpro_deploy}"
DOMAIN="${DEPLOY_DOMAIN:-auranews.optiquant-ia.com}"
REMOTE_DIR="${DEPLOY_REMOTE_DIR:-/opt/aura-news}"
SERVICE="${DEPLOY_SERVICE:-aura-news}"
APP_URL="${DEPLOY_APP_URL:-https://$DOMAIN}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$SCRIPT_DIR/app"
SSH=(ssh -i "$SSH_KEY" -o BatchMode=yes -o ConnectTimeout=20 -o StrictHostKeyChecking=accept-new)
SCP=(scp -i "$SSH_KEY" -o BatchMode=yes -o StrictHostKeyChecking=accept-new)

NO_BUILD=0; DRY=0
for a in "$@"; do
  case "$a" in
    --no-build) NO_BUILD=1 ;;
    --dry-run)  DRY=1 ;;
    *) echo "option inconnue: $a"; exit 2 ;;
  esac
done

c() { printf '\033[1;36m▸ %s\033[0m\n' "$*"; }   # log étape
ok() { printf '\033[1;32m✓ %s\033[0m\n' "$*"; }
die() { printf '\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

[ -f "$SSH_KEY" ] || die "Clé SSH introuvable: $SSH_KEY (définir DEPLOY_SSH_KEY)"

# ── 0. Préflight ──
c "Préflight: test SSH $HOST"
[ "$DRY" = 1 ] || "${SSH[@]}" "$HOST" 'echo ok >/dev/null' || die "Connexion SSH impossible"
ok "SSH OK"

# ── 1. Build standalone ──
if [ "$NO_BUILD" = 0 ]; then
  c "Build Next (output standalone) avec NEXT_PUBLIC_APP_URL=$APP_URL"
  if [ "$DRY" = 0 ]; then
    ( cd "$APP_DIR" && NEXT_PUBLIC_APP_URL="$APP_URL" npm run build >/dev/null ) || die "Build échoué"
  fi
  ok "Build OK"
else
  c "Build sauté (--no-build)"
fi

[ -f "$APP_DIR/.next/standalone/server.js" ] || die "Artefact standalone absent — lance un build d'abord"

# ── 2. Assemble (standalone + static + public) + tar ──
c "Assemblage de l'artefact"
TAR="$(mktemp -t aura-news.XXXXXX).tar.gz"
if [ "$DRY" = 0 ]; then
  cp -r "$APP_DIR/.next/static" "$APP_DIR/.next/standalone/.next/static"
  [ -d "$APP_DIR/public" ] && cp -r "$APP_DIR/public" "$APP_DIR/.next/standalone/public" || true
  tar -czf "$TAR" -C "$APP_DIR/.next/standalone" .
  ok "Artefact: $(du -h "$TAR" | cut -f1)"
fi

if [ "$DRY" = 1 ]; then c "[dry-run] upload + swap + restart + healthcheck"; ok "Dry-run terminé"; exit 0; fi

# ── 3. Upload ──
c "Upload vers $HOST:$REMOTE_DIR/app.new.tar.gz"
"${SCP[@]}" "$TAR" "$HOST:$REMOTE_DIR/app.new.tar.gz"
rm -f "$TAR"
ok "Upload OK"

# ── 4. Swap atomique + restart + healthcheck + rollback ──
c "Swap atomique + restart + healthcheck (rollback auto si KO)"
"${SSH[@]}" "$HOST" "REMOTE_DIR='$REMOTE_DIR' SERVICE='$SERVICE' bash -s" <<'REMOTE'
set -euo pipefail
cd "$REMOTE_DIR"
rm -rf app.new && mkdir -p app.new
tar -xzf app.new.tar.gz -C app.new && rm -f app.new.tar.gz
[ -f app.new/server.js ] || { echo "✗ artefact invalide"; exit 1; }
# swap : garde l'ancienne version pour rollback
rm -rf app.old 2>/dev/null || true
[ -d app ] && mv app app.old
mv app.new app
systemctl restart "$SERVICE"
# healthcheck local (10 tentatives)
ok=0
for i in $(seq 1 10); do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 http://127.0.0.1:3001/api/news || true)
  [ "$code" = "200" ] && { ok=1; break; }
  sleep 2
done
if [ "$ok" = 1 ]; then
  echo "✓ healthcheck local OK (api/news 200)"
  rm -rf app.old
else
  echo "✗ healthcheck KO -> ROLLBACK"
  rm -rf app
  mv app.old app
  systemctl restart "$SERVICE"
  echo "↩ version précédente restaurée"
  exit 1
fi
REMOTE
ok "Déploiement appliqué"

# ── 5. Healthcheck public ──
c "Healthcheck public $APP_URL"
code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 25 "$APP_URL/api/news" || true)
[ "$code" = "200" ] && ok "EN LIGNE: $APP_URL (HTTP $code)" || die "Public KO (HTTP $code) — vérifier Caddy/DNS"
