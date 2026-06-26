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
- [ ] Chaque intégration a un script CLI debug qui passe (Polymarket, news, market-data, OpenAI, Supabase)

**Critère 2 — Zéro défaut bloquant/majeur**
- [ ] 0 défaut bloquant ou majeur ouvert (UX)
- [ ] 0 défaut bloquant ou majeur ouvert (métier/qualité reports)
- [ ] 0 défaut bloquant ou majeur ouvert (technique)
- [ ] `npm run build` passe sans erreur
- [ ] 0 proba fabriquée détectable (audit vision)

> « si cela fait sens » : si un critère ne s'applique pas (ex. surface parquée),
> le noter explicitement comme N/A justifié plutôt que de le forcer.

---

## Backlog (priorisé) — mis à jour à chaque itération
> Statut : 🔴 bloquant · 🟠 majeur · 🟡 mineur · ✅ résolu

- 🟠 [TECH] Aucun script CLI de debug (`app/scripts/`) — requis par le paradigme.
- 🟠 [TECH] Fetch Polymarket > 2MB échoue au cache Next.js (`tag_id=102232`,
  `gamma-api.polymarket.com/events`) — voir `dev-server.log`. Limiter le volume /
  désactiver le cache pour ces requêtes / paginer-réduire les champs.
- 🟡 [PRODUIT] 4 moteurs de génération parallèles → converger sur le flux cœur ;
  neutraliser l'article legacy à % fabriqués (anti-vision).
- 🟡 [PRODUIT] Nav avec onglets décoratifs morts (Markets/Macro/FX/...) pointant
  tous vers `/`.

## Journal des itérations
> (append-only) — une entrée par itération : date, ce qui a été audité, écarts
> trouvés, corrections faites, état des critères de sortie.

### Itération 0 — 2026-06-26 — Mise en place
- Boucle QA initialisée. Paradigme backend-first installé. Recon faite.
- Écarts seed reportés dans le Backlog ci-dessus. Aucun fix code encore.
- Critères de sortie : non atteints (audit non démarré).
