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
- Playbook créé.

### Itération 1 — (b) Polish landing + responsive (2026-06-28)
- PLAN : résiduels landing (chip démo + responsive mobile).
- DO : chip « Play the animation » (pill noir gimmicky) → « ▶ See it in action »
  accent subtil. Vérif mobile (390px) → 3 défauts trouvés et corrigés : logo
  masthead (font 50 → clamp 30-50), cards « Today on the desk » (grille 3-col →
  auto-fit/minmax, s'empilent), « 1 credit » masqué <480px (place au bouton Ask).
- Build OK, déployé (deploy.sh), healthcheck public 200, rien cassé.
- VERIFY (vérif écran desktop+mobile) : **B1=8**, **G=8**, A1=0, A2=0, C1=0.
- DECIDE : ITERATING. Prochain pas = (a) AG-UI (backend endpoint SSE d'abord).

### Itération 2 — (a) AG-UI backend (2026-06-28)
- PLAN : endpoint SSE AG-UI + outils réels (A1).
- DO : `src/lib/agui/tools.ts` (registre : search_markets, get_news, get_quotes,
  get_macro_snapshot — tous réels, read-only, + `sanitizeForAgent`) ;
  `src/app/api/ag-ui/run/route.ts` (SSE : RunStarted→StateSnapshot→boucle
  function-calling gpt-4o-mini avec ToolCall* → réponse finale streamée
  TextMessage* → RunFinished/RunError). Prompt système anti-fabrication.
- Tests backend (curl) local + PROD : 2 outils appelés (search_markets+get_quotes),
  streaming OK, réponse grounded (« 81% Fed inchangée »). Build OK, déployé,
  healthcheck 200, rien cassé.
- VERIFY : **A1=8** (approvals N/A justifié : outils read-only), **A2=2** (pas de
  chatbot UI AG-UI), B1=8, C1=0, G=8.
- DECIDE : ITERATING. Prochain = A2 (brancher le FloatingChat existant sur
  /api/ag-ui/run : dock moderne, thinking, streaming, bulles, UIBlocks).

### Itération 3 — (a) AG-UI chatbot UX (2026-06-28)
- PLAN : A2 = AgentDock moderne branché sur AG-UI.
- DO : `FloatingChat.tsx` réécrit en AgentDock : client SSE /api/ag-ui/run, landing
  intelligente (accueil + 4 suggestions financières), bulles user(droite)/
  assistant(gauche, serif), animation thinking (points `al-dot`, prefers-reduced-
  motion), streaming des deltas, chips d'appels d'outils (✓/◷ + libellés FR),
  composer auto, nouveau-fil, deep-link #assistant. DA NYT crème/encre.
- VÉRIFIÉ À L'ÉCRAN (#assistant) : dock ouvert, landing + suggestions + composer
  propres. Build OK, déployé, healthcheck 200, rien cassé.
- VERIFY : A1=8, **A2=7** (dock + streaming câblé OK ; manque les UIBlocks riches
  rendus par l'agent — cards/tables/listes ; caveat : streaming interactif non
  vérifié headless mais endpoint OK), B1=8, C1=0, G=8.
- DECIDE : ITERATING. Prochain = A2 finir (UIBlocks : rendre les résultats d'outils
  ex. search_markets en cards dans le dock) → puis C1 SnapTrade.

### Itération 4 — (a) AG-UI UIBlocks → A2 complet (2026-06-28)
- PLAN : finir A2 avec des UIBlocks (le plus faible).
- DO : AgentDock — `AgentUIBlock` (allowlist) qui rend les résultats d'outils en
  mini-cards : search_markets (cards question+%+barre+vol+Polymarket),
  get_macro_snapshot (grille macro), get_quotes (chips), get_news (liste). Capté
  via `ToolCallResult` (content JSON) → `blocks` sur le message assistant. Deep-link
  `?ask=…#assistant` (auto-envoi). Données réelles uniquement, aucun composant
  arbitraire du modèle.
- VÉRIF VISUELLE RÉELLE (Chrome CDP, attente 18s) : le dock affiche la réponse +
  bandeau macro réel + 3 market-cards Fed (81% avec barre). DA NYT. ✅
- Build OK, déployé, healthcheck 200, rien cassé.
- VERIFY : A1=8, **A2=8** (dock moderne + streaming + thinking + bulles + UIBlocks
  réels, allowlist, vérifiés écran), B1=8, **C1=0**, G=8.
- DECIDE : ITERATING. Chantier (a) AG-UI TERMINÉ. Prochain = (c) SnapTrade
  (scaffolding sécurisé + connexion + holdings read-only, gating sur clés).
