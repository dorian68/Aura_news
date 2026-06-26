# AlphaLens Daily — État des lieux & carte de convergence

> Objectif : voir tout ce qu'on a réellement construit, où ça se chevauche, et
> décider **la colonne vertébrale** avant de retoucher une ligne de code.
> Aucune nouvelle feature ici — c'est une carte pour **converger**.

---

## 0. La thèse (la colonne vertébrale)

D'après `PRODUCT_VISION.md` :
> **Relier chaque news aux vrais marchés + au portefeuille de l'utilisateur, sans
> jamais fabriquer de probabilité.**

Tout doit servir ça. Le test simple pour chaque morceau : *est-ce qu'il fait
avancer « news → ce que ça veut dire pour mon book » ?*

---

## 1. Inventaire réel (ce qui existe)

**4 moteurs de génération parallèles** (le cœur du problème) :

| Surface | Routes / libs | Ce qu'elle fait | Données |
|---|---|---|---|
| **Signals** `/trade` | `/api/news-trade`, `polymarket-index.ts` (RAG), `trade-prompt.ts` | News → marchés Polymarket liés + actifs/watchlist + synthèse | **réel** (RAG + quotes) |
| **Briefings** `/briefings` | `/api/generate-digest`, `digest-prompt.ts`, `polymarket.ts` | Digest éditorial multi-sections + edge par section | réel (partiel) |
| **World Cup** `/warmup`, `/warmup/generate`, `/article/match/[id]` | `/api/matches`, `/api/generate-match`, `matches-feed.ts`, `score-model.ts`, `polymarket-wc.ts`, football-data/thesportsdb/api-football, `MatchdayWidget`, `ProbabilityDrawer` | Sous-app sport : live, modèle de score, drawer marché | réel |
| **Article (legacy)** `/article/generate`, `/article/[id]` | `/api/generate`, `prompts.ts`, `output-schema.ts` | Le flux d'origine : news → article « pricé » | **% fabriqués** |

**Surfaces de support :**
- **Home** `/` — feed news/ticker réel ; **route déjà vers `/trade`** au clic. ✅
- **Library** `/library` — persistance (mix : `savedReports` *article legacy* + `savedTradeReports` *signals*).

---

## 2. Les chevauchements (la dispersion, factuelle)

**Le même concept « marché vs modèle / edge / marchés liés » est codé 3 fois :**
- WC → `score-model.ts` (Poisson) + `polymarket-wc.ts` (crowdScores) → drawer.
- Briefings → `polymarket.ts` (matchMarket) + `alphaProb` LLM → edge par section.
- Signals → `polymarket-index.ts` (RAG embeddings) → marchés liés + actifs.

**3 libs Polymarket** qui se recouvrent : `polymarket.ts`, `polymarket-wc.ts`, `polymarket-index.ts`.
**2 chemins news** : `news.ts` (actif) vs `news-fetcher.ts` (RSS, **mort**).
**2 schémas de génération** : `output-schema.ts` (article legacy) vs `trade-prompt.ts`.

**Nav (9 entrées)** : `Markets / Macro / FX / Commodities / Crypto` pointent **tous vers `/`** (onglets décoratifs morts) + `World Cup / Briefings / Signals / Library`. → 4 vraies destinations, dont 3 moteurs concurrents.

**Verdict** : pas un produit avec un flux phare, mais **3-4 démos parallèles** qui partagent des bouts de code et se disputent la nav.

---

## 3. Classement (cœur / secondaire / à couper)

### 🟢 CŒUR — la colonne vertébrale
- **Home (feed) → Signals `/trade` → Library**.
- C'est *exactement* la thèse : lire une news → voir ce que ça implique (marchés réels + portefeuille) → sauver.
- `polymarket-index.ts` (RAG), `trade-prompt.ts`, `news.ts`, `ticker.ts`, `market-data.fetchQuotes`, `store`.

### 🟡 SECONDAIRE — défendable mais hors-spine
- **World Cup.** Ironie : c'est la verticale qui tient *le mieux* la thèse (marchés WC réels). **Mais** c'est une **autre audience** (parieurs sport ≠ traders), le **plus gros footprint code**, et ça **dilue** le produit cœur. → À **parquer** derrière une entrée unique, ou à **spin-off** comme produit séparé. Ne doit plus peser autant que le cœur dans la nav.

### 🟠 À FUSIONNER dans le cœur
- **Briefings.** Même concept que Signals, forme différente. Devrait devenir *« le digest quotidien de tes Signals »* (construit **par le moteur `/trade`**, N signals assemblés), **pas un moteur parallèle**. Sinon : couper.

### 🔴 À COUPER / NETTOYER
- **Flux article legacy** : `/api/generate`, `/article/generate`, `/article/[id]`, `prompts.ts`, `output-schema.ts` — l'ancien moteur à **% fabriqués**, déjà court-circuité (la home route vers `/trade`). Le garder = pourrissement + incohérence avec la thèse.
- **`news-fetcher.ts`** (RSS mort), **5 onglets de nav décoratifs**, **3 libs Polymarket → 1** (ou un layering clair), `savedReports` legacy dans la Library.

---

## 4. La forme cible (converger)

**Un seul flux phare :**
```
        ┌──────────────────────────────────────────────┐
        │                 LE PRODUIT                     │
        │   Feed (news réelles)                          │
        │      └─clic─► SIGNAL  (news → marchés + book)  │
        │                  └─Save─► Library              │
        │   Briefings = digest de N Signals (même moteur)│
        └──────────────────────────────────────────────┘
   À côté, séparé : World Cup (verticale parquée / spin-off)
   Supprimé : article legacy, libs/nav en double
```

- **Le `/trade` devient l'expérience principale** (voire : la home *est* le feed de signals).
- **Un seul moteur** « news → marchés + portefeuille ». Briefings le réutilise. WC vit à part.
- **Une seule lib** d'accès Polymarket. Un seul chemin news. Une Library cohérente.

---

## 5. Les décisions à prendre (avant de coder)

1. **World Cup** : parquer (garder mais démoter) · spin-off séparé · ou couper ?
2. **Briefings** : fusionner en « digest de Signals » (même moteur) · ou couper ?
3. **Flux article legacy** : couper ? (recommandé)
4. **Home** : la transformer en **feed de Signals** (fusionner home + `/trade`) · ou garder home éditoriale qui *mène* à `/trade` ?
5. **Dette technique** : unifier les 3 libs Polymarket + les 2 chemins news — quand (maintenant / après cadrage produit) ?

→ Une fois ces 5 points tranchés, on a **un produit**, et toute l'énergie suivante approfondit *le cœur* au lieu d'ajouter des surfaces.
