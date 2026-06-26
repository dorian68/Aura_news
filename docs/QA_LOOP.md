# Boucle QA — AlphaLens Daily / Aura News

> Artefact **durable et auto-mis-à-jour** de la boucle qualité. Chaque itération
> de `/loop` LIT ce fichier, exécute UNE itération du cycle, met à jour les
> sections « Journal » et « Backlog » + la checklist de sortie, puis commit/push.
> Objectif : garantir la **meilleure UX** et des **reports conformes à la vision**
> produit, avec un produit **techniquement full-fonctionnel**.

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

## Cycle d'UNE itération (4 passes, backend-first)
1. **Technique** — lancer `app` (`npm run dev`), créer/lancer les scripts CLI de
   debug manquants dans `app/scripts/` (`debug-polymarket`, `debug-news`,
   `debug-market-data`, `debug-openai`, `debug-supabase`, `debug-signal-flow`).
   Logs structurés `[STEP][STATUS][REQUEST][OUTPUT][ERROR][NEXT]`. Identifier le
   point d'échec exact. Ne pas toucher l'UI tant que le backend n'est pas validé.
2. **Métier / qualité des reports** — générer de vrais Signals/Briefings et
   vérifier la conformité vision : **0 proba fabriquée**, chaque % tracé à un
   marché réel (question + % + volume + lien), pont news→portefeuille pertinent,
   ton informationnel/éducatif (pas de « achète/vends »).
3. **UX** — parcourir Feed → Signal → Library dans le navigateur, captures,
   relever frictions / incohérences / états manquants.
4. **Synthèse + Fix + Commit** — prioriser les écarts (Bloquant > Majeur >
   Mineur), corriger backend-first, re-vérifier, mettre à jour ce fichier,
   commit + push.

## Critères de sortie (la boucle s'arrête quand TOUT est ✅)
**Critère 1 — Flux cœur full-fonctionnel**
- [ ] Feed charge des news réelles sans erreur
- [ ] Clic news → `/trade` génère un Signal de bout en bout (pas d'erreur backend)
- [ ] Marchés liés Polymarket réels affichés (ou « aucun marché pertinent », pas de faux %)
- [ ] Pont actifs/portefeuille présent et pertinent
- [ ] Save → Library persiste et relit correctement
- [~] Chaque intégration a un script CLI debug qui passe — **Polymarket ✅, news ✅** ; market-data, OpenAI, Supabase, signal-flow ❌ (à faire)

**Critère 2 — Zéro défaut bloquant/majeur**
- [ ] 0 défaut bloquant ou majeur ouvert (UX) — *pass UX pas encore faite*
- [ ] 0 défaut bloquant ou majeur ouvert (métier/qualité reports) — *audit reports pas encore fait*
- [ ] 0 défaut bloquant ou majeur ouvert (technique) — *flux Signal e2e pas encore validé*
- [x] `npm run build` passe sans erreur — **validé itération 1**
- [ ] 0 proba fabriquée détectable (audit vision) — *audit pas encore fait*

> « si cela fait sens » : si un critère ne s'applique pas (ex. surface parquée),
> le noter explicitement comme N/A justifié plutôt que de le forcer.

---

## Backlog (priorisé) — mis à jour à chaque itération
> Statut : 🔴 bloquant · 🟠 majeur · 🟡 mineur · ✅ résolu

- 🟠 [TECH] Scripts CLI de debug : ✅ créés pour news + Polymarket ; **reste à
  faire** : market-data, OpenAI, Supabase, et `debug-signal-flow` (flux complet
  news→RAG→actifs→synthèse).
- 🟠 [TECH] Flux Signal de bout en bout (`/api/news-trade`) non encore validé
  backend (embeddings OpenAI + re-rank + actifs + synthèse) — prochaine priorité.
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
