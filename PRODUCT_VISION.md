# AlphaLens Daily — Vision produit (repositionnée)

> **Statut** : document de référence. Décrit la promesse de valeur cible, le
> moteur qui la sert, sa faisabilité, ses garde-fous et son plan de mise en
> œuvre. À corriger/valider avant d'attaquer le code.

---

## 1. La promesse, repositionnée

**Avant (promesse fragile)** :
> « Turn headlines into implied probabilities » — on price *l'événement exact*.

Problème : quand aucun marché de prédiction n'existe pour l'événement précis
(le cas le plus fréquent en finance), le produit **fabrique** une probabilité
via le LLM. Le différenciateur « Crowd vs AlphaLens » devient alors deux chiffres
inventés → non défendable.

**Après (promesse honnête et plus vendeuse)** :
> **« Pour chaque news, on te montre sur quoi le marché parie déjà et ce que ça
> implique concrètement pour ton portefeuille. »**

On ne price plus l'événement exact à tout prix. On **relie** la news à :
1. les **marchés de prédiction réels liés** (même indirects),
2. les **actifs concernés** (et, si l'utilisateur les déclare, **ses** positions),
3. une **synthèse actionnable** : ce qui est déjà pricé, ce qui ne l'est pas,
   quoi surveiller.

Mission : **faire le pont news → portefeuille**, ancré sur des marchés réels.

---

## 2. Le principe directeur

**Récupérer et relier — jamais fabriquer.**

- Une probabilité affichée vient **toujours** d'un marché réel (Polymarket /
  Kalshi / bookmaker / FedWatch).
- Tout jugement propre au produit (thèse directionnelle, « AlphaLens read ») est
  **étiqueté comme tel**, jamais attribué à un tiers, jamais déguisé en donnée.
- Quand il n'y a pas de marché : on n'affiche pas un faux « crowd 68% ». La
  couche **actifs/portefeuille** porte la valeur, le marché est marqué absent.

> Ce principe existe déjà dans le code : le **drawer World Cup** (marchés
> Polymarket réels) et le **garde-fou anti-hallucination du digest**
> (`digest-prompt.ts`). Il s'agit de le **généraliser** à la verticale actu.

---

## 3. Le moteur — pipeline A / B / C

```
news ─┬─► [A] RETRIEVAL Polymarket (RAG)
      │        embed(question marché) + embed(news) → top-K cosine
      │        → re-rank LLM (« pertinent ? lien causal ? »)
      │        → 0..N marchés liés, avec leur % réel + volume + lien
      │
      ├─► [B] MAPPING ACTIFS / PORTEFEUILLE
      │        LLM (actifs touchés, direction, raison)
      │        + watchlist utilisateur (« touche TES positions : X, Y »)
      │        + données réelles (move récent du ticker, corrélations)
      │
      └─► [C] SYNTHÈSE ACTIONNABLE
               grounded sur A + B uniquement :
               - ce qui est déjà pricé (depuis A)
               - ce qui ne l'est pas / l'angle manquant
               - actifs & directions (depuis B)
               - quoi surveiller / prochains catalyseurs

   Dégradation gracieuse :
     marchés liés si dispo → sinon la couche [B] tourne seule, marché marqué absent.
```

### A — RAG sur Polymarket
- Index sémantique des marchés actifs (questions + tags + volume).
- Récupération : top-K par similarité, puis **re-rank LLM** pour ne garder que les
  marchés *réellement* liés à la news (et expliquer *en quoi*).
- Rafraîchissement périodique (les marchés naissent/meurent).

### B — News → actifs / portefeuille
- Identifie les actifs concernés et la direction (1er et **2ᵉ ordre** : « cut Fed
  → TLT ↑, banques régionales ↑, USD ↓, ton exposition EM en profite »).
- Personnalise via la **watchlist** déjà présente dans le store.
- Ancre la thèse sur des **données réelles** (prix/move récents, corrélations
  historiques) plutôt que sur la seule opinion LLM.

### C — Synthèse
- Le LLM devient **synthétiseur sur contexte récupéré**, plus inventeur.
- Sortie structurée réutilisant le schéma existant (`output-schema.ts`), mais
  chaque chiffre tracé à sa source.

---

## 4. Faisabilité

| Brique | Faisable ? | Déjà en place | Le vrai défi |
|---|---|---|---|
| **A. RAG Polymarket** | ✅ Standard | Accès gamma par tag, parsing marchés/events | Qualité du re-rank (anti-bruit) + rafraîchissement de l'index |
| **B. Actifs / portefeuille** | ✅ Différenciant | `watchlist` (store), tickers réels (Twelve Data / CoinGecko) | Rester non-générique + **grounder** la thèse (corrélations, event-study) |
| **C. Synthèse** | ✅ Facile | Moteur de génération SSE + schéma | Discipline du grounding (zéro proba inventée) |
| **D. Positionnement** | ⚠️ Contrainte | Mention « research & education only » | Rester côté info/éducation, pas conseil |

**Briques déjà construites réutilisables** : récupération Polymarket par tag
(`polymarket-wc.ts`, `polymarket.ts`), watchlist, tickers réels, génération
OpenAI + streaming + compteur de tokens, garde-fou anti-hallucination (digest).
→ ~80% des fondations existent. Le manque principal : **la couche embeddings +
re-rank (A)** et le **grounding des actifs (B)**.

---

## 5. Garde-fous (non négociables)

1. **Honnêteté de la donnée** : une proba = un marché réel. Sinon, « modèle
   AlphaLens » explicite ou « pas de marché ».
2. **Traçabilité** : chaque marché lié affiche son `question`, son `%`, son
   volume et son lien Polymarket.
3. **Compliance** : ton informationnel/éducatif. Pas de « achète / vends ».
   Disclaimer persistant. (Décision business à confirmer selon juridiction.)
4. **Pertinence > exhaustivité** : mieux vaut 2 marchés vraiment liés que 10
   bruités. Le re-rank doit pouvoir renvoyer « aucun marché pertinent ».

---

## 6. Plan de mise en œuvre (phasé)

**Phase 0 — Repositionnement (doc + UI copy)**
- Mettre à jour le pitch/tagline pour refléter « news → marchés liés →
  portefeuille » (et arrêter de promettre le point-estimate exact).

**Phase 1 — RAG Polymarket (brique A)**
- Index embeddings des marchés actifs + récupération top-K + re-rank LLM.
- Afficher, sous chaque article/section, les **marchés liés réels** (% + lien).
- Dégradation : « aucun marché pertinent » au lieu d'un faux chiffre.

**Phase 2 — Pont portefeuille (brique B)**
- Saisie watchlist/holdings (déjà amorcée).
- Surligner les actifs touchés **dans le book de l'utilisateur** + move réel.

**Phase 3 — Synthèse actionnable (brique C)**
- Régénérer l'article comme synthèse grounded sur A+B (pricé / non pricé /
  actifs / catalyseurs).

**Phase 4 — Produit**
- Auth + persistance + Stripe (modules M2/M8/M9 du plan technique) pour passer
  de prototype à produit.

---

## 7. Plafond connu & honnêteté

- **Couverture Polymarket** : biaisée (politique, crypto, sport, pop-culture).
  Pour beaucoup de news macro/equity, les marchés liés seront minces → la valeur
  repose alors sur la brique B. **Assumé, pas masqué.**
- Élargir l'ancrage au-delà de Polymarket (Kalshi, odds bookmakers, CME
  FedWatch) augmente la couverture — à prioriser selon les verticales visées.

---

## 8. Métriques de succès (proposées)

- **Taux d'ancrage** : % d'articles avec ≥1 marché réel lié pertinent.
- **Pertinence du re-rank** : précision sur un échantillon annoté.
- **Activation portefeuille** : % d'utilisateurs déclarant une watchlist.
- **Engagement** : clics vers les marchés liés / actifs.
- **Honnêteté** : 0 proba affichée sans source (audit automatisable).

---

## 9. Décisions ouvertes

1. Sources d'ancrage : Polymarket seul, ou + Kalshi / FedWatch / bookmakers ?
2. Positionnement réglementaire : info/éducation strict, ou conseil (→ compliance) ?
3. Verticale prioritaire : macro, equity, crypto — laquelle a la meilleure
   couverture marchés pour démarrer ?
4. Embeddings : OpenAI (simple, coût) vs local (gratuit, infra) ?
