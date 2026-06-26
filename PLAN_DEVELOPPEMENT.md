# AlphaLens Daily — Plan de développement complet

## Ce que contient le prototype

Le prototype est une single-file React app (dc-runtime custom) avec :
- 6 articles de news avec données financières complètes (scenarios, assets, pred market, levels, risks)
- 10 angles d'analyse
- 2 pipelines de génération (news + World Cup)
- 3 systèmes de chat (mini-chat, AD-UI composer, general)
- 1 système de crédits avec 4 tiers de pricing
- 8 matchs World Cup avec live tracker

Tout est hardcodé — aucun backend.

---

## Architecture cible

```
┌─────────────────────────────────────────────────────────────┐
│                    ALPHALENS DAILY                          │
├──────────────┬──────────────────┬───────────────────────────┤
│   M1 Shell   │  M2 Auth/Users   │     M9 Payments           │
│  Next.js 14  │  Supabase Auth   │     Stripe                │
├──────────────┴──────────────────┴───────────────────────────┤
│                     FRONTEND MODULES                        │
├───────────┬──────────┬──────────┬──────────┬────────────────┤
│  M3 Feed  │ M4 Gen   │ M5 Price │ M6 Data  │  M7 Chat       │
│  Home     │ Article  │ Snapshot │ Markets  │  Mini + AD-UI  │
├───────────┴──────────┴──────────┴──────────┴────────────────┤
│                    M8 Library                               │
├─────────────────────────────────────────────────────────────┤
│                     BACKEND (API Routes)                    │
├───────────────┬─────────────────┬───────────────────────────┤
│ News Ingestion│  AI Generation  │  Prediction Market        │
│  RSS + APIs   │  Claude Sonnet  │  Polymarket/Kalshi        │
└───────────────┴─────────────────┴───────────────────────────┘
```

---

## Stack technique

| Couche | Choix | Pourquoi |
|---|---|---|
| Framework | Next.js 14 App Router + TypeScript | SSR natif, API routes intégrées, streaming |
| UI | Tailwind CSS + design tokens custom | Reproduire l'existant fidèlement |
| Composants | Radix UI (headless) | Accessibilité, sans imposer de style |
| State | Zustand | Léger, parfait pour credits/view state |
| Server state | TanStack Query | Cache news, reports, market data |
| Animations | Framer Motion | Reproduire al-rise, al-bubble, etc. |
| Base de données | Supabase (PostgreSQL) | Auth + DB + realtime en un |
| Auth | Supabase Auth | Intégré à la DB |
| Paiements | Stripe | Credits + subscriptions |
| LLM | Claude Sonnet 4.6 (Anthropic) | Génération + structured outputs |
| Market data | Polygon.io | Prices, OHLCV, news |
| Pred markets | Polymarket API | Probabilités crowd |
| Hosting | Vercel | Natif Next.js, edge functions |
| Storage | Cloudflare R2 | PDFs, snapshots 9:16 |

---

## Les 10 modules

### M1 — Core Shell
**Ce que c'est** : Fondation, routing, design system

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── article/[id]/page.tsx
│   ├── library/page.tsx
│   └── composer/page.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   └── primitives/
└── lib/
    ├── design-tokens.ts
    └── animations.ts
```

**Dépendances** : aucune
**Durée estimée** : 1 semaine

---

### M2 — Auth & Gestion utilisateur
**Ce que c'est** : Login, profil, compteur de crédits

```
src/
├── app/auth/
├── lib/
│   ├── supabase.ts
│   └── credits.ts
└── components/credits/
    ├── CreditsBadge.tsx
    └── CreditsModal.tsx
```

**Tables Supabase** :
```sql
users (id, email, credits, plan, created_at)
credit_transactions (id, user_id, amount, type, report_id)
```

**Dépendances** : M1
**Durée estimée** : 3-4 jours

---

### M3 — News Feed & Home
**Ce que c'est** : Ingestion news, mosaic, ticker, AI Desk

```
src/
├── app/page.tsx
├── components/home/
│   ├── TickerTape.tsx
│   ├── HeroArticle.tsx
│   ├── Mosaic.tsx
│   ├── AiDeskWidget.tsx
│   └── AiVsCrowd.tsx
└── lib/
    ├── news-fetcher.ts
    └── news-ranker.ts
```

**API Routes** :
```
GET /api/news
GET /api/news/[id]
GET /api/ticker
```

**Pipeline data** :
```
News API → news-fetcher → score → Supabase cache → feed
```

**Dépendances** : M1, M2
**Durée estimée** : 1 semaine

---

### M4 — Moteur de génération de rapports
**Ce que c'est** : Cœur du produit — angle → LLM → article structuré

```
src/
├── components/article/
│   ├── AngleModal.tsx
│   ├── GeneratingScreen.tsx
│   ├── ArticlePage.tsx
│   └── blocks/
│       ├── PricingSnapshot.tsx
│       ├── CrowdVsAlpha.tsx
│       ├── ScenarioPricing.tsx
│       ├── AssetImpact.tsx
│       ├── PricedIn.tsx
│       ├── WhatWouldBreak.tsx
│       └── AlphaTake.tsx
└── lib/generation/
    ├── pipeline.ts
    ├── prompts/
    │   ├── macro.ts
    │   ├── fx.ts
    │   ├── commodities.ts
    │   └── ...
    └── output-schema.ts
```

**API Route** :
```
POST /api/generate
Body: { newsId, angleId, userId }
Response: SSE stream → structured article JSON
```

**Schéma de sortie LLM** :
```typescript
const ArticleSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  snapshot: z.object({
    event: z.string(),
    impact: z.string(),
  }),
  pred: z.object({
    yes: z.number(),
    alpha: z.number(),
    gap: z.string(),
    compareNote: z.string(),
  }),
  pricedIn: z.array(z.string()),
  notPricedIn: z.array(z.string()),
  scenarios: z.array(ScenarioSchema),
  risks: z.array(RiskSchema),
  confReasons: z.array(z.string()),
  finalTake: z.string(),
})
```

**Dépendances** : M1, M2, M3
**Durée estimée** : 2 semaines

---

### M5 — Pricing Intelligence
**Ce que c'est** : Connexion aux marchés de prédiction

```
src/
├── lib/
│   ├── polymarket.ts
│   ├── kalshi.ts
│   └── pricing-engine.ts
└── components/article/blocks/
    ├── MarketBeliefWidget.tsx
    └── CrowdVsAlpha.tsx
```

**API Route** :
```
GET /api/prediction-market?event=...
```

**Logique centrale** :
```typescript
async function computeGap(newsId: string, alphaProb: number) {
  const crowd = await fetchPolymarketOdds(newsId)
  return {
    crowdYes: crowd.yes,
    alphaYes: alphaProb,
    gap: crowd.yes - alphaProb,
    direction: gap > 0 ? 'crowd-overprices' : 'crowd-underprices'
  }
}
```

**Dépendances** : M4
**Durée estimée** : 1 semaine

---

### M6 — Market Data (temps réel)
**Ce que c'est** : Prix live, sparklines, watchlist

```
src/
├── lib/
│   ├── polygon.ts
│   └── market-store.ts
└── components/
    ├── market/
    │   ├── Sparkline.tsx
    │   ├── AssetChip.tsx
    │   └── Watchlist.tsx
    └── ticker/
        └── TickerTape.tsx
```

**Dépendances** : M1, M2
**Durée estimée** : 3-4 jours

---

### M7 — Chat & AD-UI Composer
**Ce que c'est** : Mini-chat flottant + composer adaptatif

```
src/
├── components/chat/
│   ├── ChatBubble.tsx
│   ├── ChatPanel.tsx
│   └── messages/
│       ├── TextMessage.tsx
│       ├── AngleButtons.tsx
│       ├── NewsCards.tsx
│       └── ExpandButton.tsx
├── components/composer/
│   ├── AdaptiveCanvas.tsx
│   ├── ChatRail.tsx
│   └── blocks/
└── lib/
    └── chat-engine.ts
```

**API Route** :
```
POST /api/chat
Body: { message, context, mode }
Response: SSE stream
```

**Dépendances** : M4, M5
**Durée estimée** : 1.5 semaines

---

### M8 — Library & Persistance
**Ce que c'est** : Sauvegarde des rapports, export, partage

```
src/
├── app/library/page.tsx
├── components/library/
│   ├── SavedReports.tsx
│   ├── Watchlist.tsx
│   └── AlertsPanel.tsx
└── lib/
    ├── report-store.ts
    └── pdf-generator.ts
```

**Tables Supabase** :
```sql
reports (id, user_id, news_id, angle_id, content jsonb, created_at)
watchlist (id, user_id, sym, alert_price)
```

**Dépendances** : M2, M4
**Durée estimée** : 4-5 jours

---

### M9 — Paiements & Crédits
**Ce que c'est** : Stripe, packs de crédits, subscriptions

```
src/
├── app/
│   ├── pricing/page.tsx
│   └── api/stripe/
│       ├── webhook/route.ts
│       └── checkout/route.ts
└── lib/
    └── stripe.ts
```

**Flux** :
```
User → Stripe Checkout → Webhook → credits += N → Supabase → UI
```

**Tiers** :
- Starter : €10 → 50 crédits
- Pro : €39 → 300 crédits
- Power User : €79/mois → illimité
- Research Desk : custom

**Dépendances** : M2
**Durée estimée** : 3-4 jours

---

### M10 — World Cup / Sports (optionnel)
**Ce que c'est** : Section secondaire — peut être shippée plus tard

```
src/
├── app/warmup/
│   ├── page.tsx
│   └── [matchId]/page.tsx
├── components/worldcup/
│   ├── MatchCard.tsx
│   ├── LiveTracker.tsx
│   ├── ShareCard.tsx
│   └── GoalAlert.tsx
└── lib/
    └── sports-api.ts
```

**Dépendances** : M4, M5
**Durée estimée** : 1.5 semaines

---

## Roadmap phasée

```
PHASE 1 — MVP (6-7 semaines)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Week 1   : M1 Shell + Design System
Week 2   : M2 Auth + M9 Payments (basique)
Week 3-4 : M4 Génération (le cœur)
Week 5   : M3 Feed + M6 Market Data
Week 6   : Tests, polish, deployment

→ Livrable : Login → Lire news → Choisir angle → Générer rapport → Payer

PHASE 2 — Différenciation (3-4 semaines)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Week 7-8 : M5 Pricing Intelligence (Polymarket)
Week 9   : M8 Library + Export

→ Livrable : Event Pricing Snapshot + Crowd vs AlphaLens en live

PHASE 3 — Rétention (3 semaines)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Week 10-11 : M7 Chat + AD-UI Composer
Week 12    : Alertes, watchlist avancée

→ Livrable : Le chat complet, composer fonctionnel

PHASE 4 — Croissance (selon priorités)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         : M10 Sports / API publique / Embedding
```

---

## Points de décision critiques

1. **Génération synchrone vs streaming** : Claude supporte le streaming SSE natif. L'UX "console verte" dans la page Generating est parfaite pour ça.

2. **Données prediction market** : Polymarket couvre rarement les événements financiers précis. Fallback : AlphaLens génère une probabilité implicite depuis le LLM si aucun marché existant.

3. **News ingestion** : Job cron toutes les 15 min. Score d'intensité marché calculé par le LLM (coût minimal) ou par heuristiques (gratuit).

4. **Débit de crédits** : Écrire la transaction AVANT d'appeler le LLM (débit optimiste), avec rollback si la génération échoue.
