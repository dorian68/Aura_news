# Boucle SELF-CHECKING — a + b + c jusqu'à 100% PROD-READY

> Exigeant. On ne s'arrête PAS tant que tout n'est pas prod-ready et déployé.
> Protocole chaque tour : PLAN → DO → VERIFY (1-10, brutal) → DECIDE (FINAL si
> TOUS les critères ≥ 8 ET build OK ET déployé). Pas de questions : hypothèses
> notées. Vérif **visuelle réelle** (Chrome headless) + **build** + **deploy.sh**
> + healthcheck public à chaque itération qui touche l'UI.

## Prod en place
- App live : https://auranews.optiquant-ia.com (Node+systemd, Caddy, deploy.sh).
- Vérif visuelle : `chrome --headless ... --screenshot` puis crop `sharp` (dans app/).
- Snapshot statique d'un report : `/trade?snapshot=<newsId>`.

## TASK — 3 chantiers
### (a) AG-UI complet (agent applicatif connecté au réel) — cf. AG_UI_IMPLEMENTATION_GUIDE.md
Endpoint SSE `/api/ag-ui/run`, client streaming, AgentDock global, événements
(lifecycle/text/tool/state/activity/custom), registre d'outils backend (≥3 réels
connectés à l'app : news, marchés Polymarket, signal, watchlist…), registre
d'actions frontend (≥3 : navigate, openSignal, setWatchlist…), state sync,
human-in-the-loop pour actions sensibles, sanitation des secrets, UIBlockRenderer
allowlisté, modèle `gpt-4o-mini`, docs `AG_UI_APP_MAP.md` + `AG_UI_LOCAL_DOC.md`,
tests, build OK. Chatbot moderne (landing intelligente, bulles, thinking,
streaming, UIBlocks) cohérent DA NYT.

### (b) Polish landing (résiduels)
Chip « Play the animation » réglé ; consolidation/clarté des points d'entrée chat ;
nits visuels restants ; responsive vérifié. Tout vérifié à l'écran.

### (c) SnapTrade (intégration technique)
Flux de connexion d'un compte (SnapTrade Connection Portal), récupération
**read-only** des holdings, affichage dans le pont portefeuille des Signaux,
gestion sécurisée (clés serveur, jamais au client), dégradation gracieuse si clés
absentes. Dépendance : `SNAPTRADE_CLIENT_ID` + `SNAPTRADE_CONSUMER_KEY`.

## SUCCESS CRITERIA (stricts, 1-10, cible ≥ 8 partout)
- **A1 — AG-UI backend** : endpoint SSE conforme (RunStarted→…→RunFinished),
  ≥3 outils réels, sanitation secrets, approvals, build OK.
- **A2 — AG-UI chatbot UX** : dock/landing moderne, streaming+thinking, UIBlocks,
  DA NYT, fonctionnel de bout en bout (vérif écran).
- **B1 — Landing polish** : résiduels traités, cohérent, responsive (vérif écran).
- **C1 — SnapTrade** : flux connexion + holdings read-only affichés ; sécurisé ;
  dégradation propre sans clés ; (actif si clés fournies, sinon « prêt, gated »).
- **G — Prod** : `npm run build` OK, déployé via deploy.sh, healthcheck public 200,
  aucun service VPS cassé, 0 secret committé, 0 donnée fabriquée.

> « si cela fait sens » : un critère gated par une dépendance externe (clés
> SnapTrade) est validé au niveau « code prêt + déployé + dégradation propre », la
> partie live étant cochée quand l'utilisateur fournit les clés. Noté explicitement.

## Ordre conseillé (dépendances)
1. (b) Polish landing — rapide, termine un chantier commencé.
2. (a) AG-UI — gros bloc, plusieurs itérations (backend → chatbot → outils → UIBlocks → docs/tests).
3. (c) SnapTrade — scaffolding sécurisé + gating sur clés.

## Journal
### Itération 0 — cadrage
- Playbook créé. Prochain pas : (b) résiduels landing (chip animation + entrées chat).
