# Boucle SELF-CHECKING — Layout « equity research » des exhibits

> On ne touche QUE les UI blocks / le layout de l'article (la génération de texte
> est validée). Cible = `Downloads/ChatGPT Image 27 juin 2026, 02_06_25.png`.
> Protocole : PLAN → DO → VERIFY (1-10, brutal) → DECIDE (FINAL si tous ≥8, sinon
> ITERATING en corrigeant le plus faible). Pas de questions : hypothèses notées.

## TASK
Rendre les blocs de l'article au niveau de la maquette de référence : des
**exhibits plein-largeur, bordés, façon equity research** —
- graphique **line multi-séries normalisé** (axes, légende, titre/sous-titre) + panneau **Key Insight** à droite + source ;
- **grille comparative** d'entreprises (logo, nom, Market Cap, P/E, Revenue Growth) avec séparateurs + source ;
- **bar chart** avec labels de valeur + panneau latéral (thèse/insight) ;
- **table de risques** colorée (Facteur | Impact | Likelihood) + checklist Key Risks ;
- panneau **verdict** (Overall View + horizon) ;
- checklists bull/bear à puces colorées.
Le LLM est l'**éditeur** : il choisit quel exhibit par section. Données **réelles**
(Yahoo/Finnhub), zéro fabrication.

## SUCCESS CRITERIA (stricts, 1-10, cible ≥8)
- **C1 — Taxonomie des exhibits** : les types de blocs de la référence existent et
  rendent (linechart+insight, metricgrid, barchart, risktable, checklist bull/bear,
  verdict, source caption). Pas juste des sparklines.
- **C2 — Fidélité de disposition** : plein-largeur bordé ; sous-disposition à 2-3
  colonnes (chart ~70% + insight ~30% ; grille N colonnes ; risques | table) ;
  typo serif/mono, palette crème/encre, séparateurs, légendes — fidèle à l'image.
  Responsive (collapse mobile).
- **C3 — Intégrité des données** : chaque chiffre vient d'une source réelle
  (Yahoo/Finnhub), logos réels, sources citées ; le LLM ne pilote que le placement
  + le texte qualitatif. 0 fabrication.

> VERIFY visuel : extension navigateur indisponible → score sur fidélité
> STRUCTURELLE au template + données réelles (pas pixel). À revalider à l'œil.

## Journal
### Itération 0 — 2026-06-27 — Cadrage + faisabilité data
- Données confirmées dispo (Finnhub profile2/metric + logo, Yahoo multi-séries).
- Manque : composants exhibit + système piloté LLM. Scores cible non atteints.
- C1≈2 C2≈2 C3 n/a → ITERATING.

### Itération 1 — 2026-06-27 — Système d'exhibits end-to-end
- DO : data layer (fetchNormalizedSeries, fetchFundamentals+logo), schéma Exhibit
  (5 types), prompt Phase A (exhibits) + Phase B ([[EXHIBIT:id]]), enrichissement
  à l'hydratation (séries/fondamentaux, cache 30min), composants
  `Exhibits.tsx` (line chart multi-séries+Key Insight, metric grid, bar chart,
  risk table, verdict), parsing + rendu plein-largeur + leftovers + responsive.
- RÉSULTAT (génération réelle) : 5 exhibits, tous référencés. linechart 3 séries×54
  pts réels ✅, risktable 3/3 ✅, verdict ✅. **metricgrid & barchart vides** car
  tickers = ETF (Finnhub n'a pas P/E/revenue pour ETF).
- VERIFY : **C1=7** (types OK, 2 sans data) · **C2=7** (structure fidèle, pixel non
  vérifiable) · **C3=6** (2 exhibits sans données ; logos/fondamentaux pas encore
  affichés). 0 fabrication (vide → null).
- DECIDE : ITERATING. Plus faible = C3 → faire piloter des ACTIONS (pas ETF) pour
  metricgrid/barchart afin que fondamentaux+logos remontent.
