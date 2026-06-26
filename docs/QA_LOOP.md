# Boucle QA — AlphaLens Daily / Aura News

> Artefact **durable et auto-mis-à-jour** de la boucle qualité. Chaque itération
> de `/loop` LIT ce fichier, exécute UN tour du **protocole self-checking**
> (PLAN → DO → VERIFY → DECIDE), met à jour « Journal » + « Backlog » + les
> **scores 1-10** des critères, puis commit/push. La boucle s'arrête à `FINAL`
> (tous les critères ≥ 8). Objectif : **meilleure UX** + **reports conformes à la
> vision** + produit **techniquement full-fonctionnel**.

## Rôles que tu incarnes (à chaque itération)
- **Lead technique** — le produit doit marcher de bout en bout. Debugging
  **backend-first** obligatoire (voir `backend_first_debugging_paradigm.md`) :
  CLI/scripts + logs structurés AVANT l'UI. Jamais de secret en clair.
- **Product Manager** — garant de la **vision** (`../PRODUCT_VISION.md`,
  `../ETAT_DES_LIEUX.md`) : « relier chaque news aux marchés réels + au
  portefeuille, **sans jamais fabriquer de probabilité** ». Qualité et sens des
  reports = priorité métier n°1.
- **Expert UX** — parcours réel, clarté, friction, états vides/chargement/erreur,
  cohérence visuelle, confiance.

## Périmètre prioritaire (la colonne vertébrale)
Flux cœur **Feed (news réelles) → Signal `/trade` (news → marchés + book) →
Library**. Briefings = digest de Signals (même moteur). World Cup = parqué.
Article legacy (`/api/generate`, % fabriqués) = à neutraliser, hors-vision.

## TASK (ce que la boucle doit produire)
Amener le **flux cœur Feed → Signal `/trade` → Library** d'AlphaLens Daily à un
niveau « produit » : techniquement full-fonctionnel, des reports qui font sens
selon la vision (0 proba fabriquée, pont portefeuille réel), et la **meilleure UX**
possible pour un trader.

## PROTOCOLE SELF-CHECKING (à chaque tour, sans poser de questions)
> Source : template « SELF-CHECKING LOOP ». Pas de soft pass.
1. **PLAN** — énoncer LE prochain pas unique (le point le plus faible du dernier VERIFY).
2. **DO** — produire / améliorer le travail. **Méthode imposée = backend-first**
   (scripts CLI `app/scripts/` + logs structurés AVANT l'UI ; jamais de secret en
   clair). ⚠️ Backend-first est la *méthode*, PAS un critère de sortie. À chaque
   tour, vérifier si le paradigme (`backend_first_debugging_paradigm.md`) doit être
   ajusté au fil des updates ; si oui, l'ajuster.
3. **VERIFY** — noter le résultat **1-10 sur CHAQUE critère** ci-dessous. Être
   brutalement honnête. Lister exactement ce qui reste faible.
4. **DECIDE** — si **tous les critères sont ≥ 8** → écrire **`FINAL`** et arrêter
   (ne pas reprogrammer la boucle). Sinon → écrire **`ITERATING`** et recommencer
   en corrigeant d'abord le score le plus bas.

RÈGLES : jamais « done » tant qu'un critère est < 8 · chaque passe corrige le plus
faible · ne pas poser de questions (faire une hypothèse raisonnable, la noter,
continuer).

## SUCCESS CRITERIA (stricts, notés 1-10 — cible ≥ 8 partout)
- **C1 — Technique / full-fonctionnel** : flux cœur e2e sans erreur (Feed charge,
  Signal se génère via `/api/news-trade`, Library persiste/relit), `npm run build`
  OK, intégrations couvertes par des scripts CLI qui passent.
- **C2 — Métier / qualité des reports** : conformité vision — **0 proba
  fabriquée** (chaque % tracé à un marché réel), pont news→portefeuille présent et
  pertinent, ton info/éducatif, le report « fait sens » pour un trader.
- **C3 — UX** : parcours Feed → Signal → Library fluide et clair ; états
  vides/chargement/erreur gérés ; cohérence visuelle ; confiance (sources visibles).

---

## Backlog (priorisé) — mis à jour à chaque itération
> Statut : 🔴 bloquant · 🟠 majeur · 🟡 mineur · ✅ résolu

- 🟠 [UX] Parcours navigateur non exécuté en live (extension Claude-in-Chrome non
  connectée) — audit fait sur code+HTML. À refaire en live quand l'extension est
  dispo (interactions réelles, responsive).
- 🟡 [UX] Library : contrôles morts « Export PDF » / « Share link » (onClick vide)
  — soit les brancher, soit les retirer.
- 🟡 [UX] Surface article legacy encore mise en avant dans la Library (au-dessus
  des Signals) alors qu'elle est hors-vision (à neutraliser/reléguer).
- 🟡 [TECH] Library : persistance Save → relecture non encore vérifiée e2e (live).
- ✅ [UX/PRODUIT] Library : **données fabriquées supprimées** — stats trompeuses
  (3× la même valeur) → 4 stats réelles distinctes ; fausses alertes en dur
  (« SPY breaks 500 »…) → état honnête « coming soon » ; « {3} cr. » en dur retiré.
- ✅ [UX] Section assets du report : état vide ajouté (cohérence avec marchés).
- 🟡 [TECH] Scripts CLI restants : market-data + Supabase en script dédié (déjà
  exercés indirectement via `debug:signal`). OpenAI couvert par `debug:signal`.
- ✅ [TECH] Flux Signal e2e (`/api/news-trade`) validé : news→RAG→actifs→synthèse,
  via `debug:signal` (scripts CLI). Grounding conforme (0 proba fabriquée).
- ✅ [PRODUIT] Pont news→portefeuille vide pour certaines news → **corrigé** :
  prompt renforcé (≥2-3 actifs liquides même hors watchlist). Vérifié (ARKQ/BOTZ/
  ROBO sur news robotique).
- 🟡 [TECH] (rétrogradé de 🟠) Fetch Polymarket > 2MB au cache Next.js : **isolé
  au World Cup** (`/events?tag_id=102232`, surface PARQUÉE), pas au flux cœur. Le
  cœur (`/markets`) plafonne à ~0.7MB/page (validé par `debug:polymarket`).
  Avertissement non bloquant ; fix = `cache:'no-store'` sur les fetch WC.
- 🟡 [PRODUIT] 4 moteurs de génération parallèles → converger sur le flux cœur ;
  neutraliser l'article legacy à % fabriqués (anti-vision).
- 🟡 [PRODUIT] Nav avec onglets décoratifs morts (Markets/Macro/FX/...) pointant
  tous vers `/`.
- ✅ [TECH] `npm run build` passe (21 routes, 0 erreur) — itération 1.

## Journal des itérations
> (append-only) — une entrée par itération : date, ce qui a été audité, écarts
> trouvés, corrections faites, état des critères de sortie.

### Itération 0 — 2026-06-26 — Mise en place
- Boucle QA initialisée. Paradigme backend-first installé. Recon faite.
- Écarts seed reportés dans le Backlog ci-dessus. Aucun fix code encore.
- Critères de sortie : non atteints (audit non démarré).

### Itération 1 — 2026-06-26 — Validation backend des sources cœur (Technique)
- **Fait** : créé `app/scripts/_log.mjs` (logs structurés + masquage secrets),
  `debug-polymarket.mjs`, `debug-news.mjs` + scripts npm `debug:polymarket`,
  `debug:news`.
- **Résultats CLI** :
  - `debug:news` ✅ 313 items réels (Finnhub general 100 / crypto 98 / merger 55 ;
    RSS CNBC 30 / MarketWatch 10 / Fed 20). Clé Finnhub présente et valide.
  - `debug:polymarket` ✅ 600 marchés réels, 600 avec % réel, page max ~0.71MB
    (aucun risque cache sur le flux cœur).
- **Diagnostic** : la matière première du Signal (news + marchés réels) est
  saine. Le bug cache >2MB est isolé au World Cup (parqué) → rétrogradé mineur.
- **Build** : `npm run build` ✅ (21 routes, 0 erreur).
- **Pas encore validé** : flux Signal e2e (`/api/news-trade` : embeddings+re-rank+
  actifs+synthèse), persistance Library, audit qualité reports (0 proba
  fabriquée), pass UX. Scripts CLI restants : market-data, OpenAI, Supabase,
  signal-flow.
- **Critères de sortie** : NON atteints → la boucle continue. Prochaine itération :
  `debug-signal-flow` + audit qualité d'un report réel (passe Métier).

### Itération 2 — 2026-06-26 — Flux Signal e2e + grounding + protocole self-checking
- **PLAN** : valider le flux Signal de bout en bout backend-first + auditer la
  qualité métier d'un report réel.
- **DO** :
  - Reformaté la boucle au template **SELF-CHECKING LOOP** (PLAN/DO/VERIFY/DECIDE,
    scores 1-10, stop à `FINAL` quand tout ≥8). Backend-first repositionné comme
    *méthode* (pas critère), avec check d'ajustement du paradigme à chaque tour.
  - Créé `scripts/debug-signal-flow.mjs` (+ `npm run debug:signal`) : exécute le
    vrai flux via l'API (GET /api/news → POST /api/news-trade SSE) et audite le
    grounding. Indépendant de l'UI.
  - Lancé sur 3 news réelles : flux OK, **0 proba fabriquée** (chaque % tracé à
    un marché réel ; dégradation gracieuse « 0 marché » sur l'IPO robotique).
  - **Fix produit** : `trade-prompt.ts` renforcé → le pont news→portefeuille
    renvoie désormais ≥2-3 actifs liquides même hors watchlist (vérifié).
- **VERIFY (scores 1-10, brutalement honnête)** :
  - **C1 Technique = 7/10** — Feed OK, Signal e2e OK, build OK, scripts CLI
    news/polymarket/signal OK. Manque : persistance Library non vérifiée e2e,
    pas de script dédié market-data/Supabase.
  - **C2 Métier = 8/10** — 0 proba fabriquée confirmé, grounding structurel solide,
    pont portefeuille corrigé. Faible : audit de pertinence du re-rank encore
    superficiel (3 news seulement).
  - **C3 UX = 3/10** — AUCUNE pass UX réelle encore (pas de parcours navigateur).
    C'est le point le plus faible.
- **DECIDE** : `ITERATING` (C1=7, C3=3 < 8). Prochain pas = corriger le plus
  faible → **pass UX navigateur** (Feed → Signal → Library) + vérifier la
  persistance Library.

### Itération 3 — 2026-06-26 — Pass UX + honnêteté de la Library
- **PLAN** : corriger le plus faible (C3 UX=3) → pass UX réelle du flux cœur.
- **Hypothèse notée** (règle « ne pas poser de questions ») : extension
  Claude-in-Chrome NON connectée → pass UX faite via **code des composants +
  HTML rendu** au lieu d'interactions live. À refaire en live plus tard.
- **DO** (audit `/trade`, `/library`) :
  - `/trade` jugé solide (états loading/error, marché vide géré, sources visibles,
    disclaimer). Ajout d'un **état vide** à la section assets (cohérence).
  - `/library` : **données fabriquées détectées et supprimées** (contraire à la
    vision « ne jamais fabriquer ») → (1) stats : 3 libellés affichaient la même
    valeur sur le store legacy → remplacés par 4 stats réelles (signals, reports,
    watchlist, crédits) ; (2) AlertsCard : fausses alertes en dur → état honnête
    « coming soon » ; (3) « {3} cr. » en dur retiré de la watchlist.
  - Paradigme backend-first : RAS à ajuster ce tour (ces fixes sont pur affichage,
    sans dépendance backend — noté).
  - `npm run build` ✅ (0 erreur, 21 routes).
- **VERIFY (1-10, honnête)** :
  - **C1 Technique = 7/10** — inchangé (build OK) ; persistance Library pas encore
    vérifiée en live ; pas de CLI dédié market-data/Supabase.
  - **C2 Métier = 8/10** — renforcé par la suppression des données fabriquées de
    l'UI (cohérence vision honnêteté).
  - **C3 UX = 6/10** — gros défauts d'honnêteté corrigés, `/trade` solide. Reste :
    pas de vérif live navigateur, contrôles morts « Export PDF/Share link »,
    legacy encore en avant, responsive non vérifié, Feed/home pas encore audité.
- **DECIDE** : `ITERATING` (C3=6, C1=7 < 8). Prochain pas = poursuivre C3 (audit
  home/Feed + retirer/brancher les contrôles morts) puis C1 (persistance Library
  live + CLI market-data/Supabase).
