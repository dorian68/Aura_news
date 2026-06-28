# Boucle SELF-CHECKING — UX Landing (chatbar + cards éditoriales NYT)

> Product designer. On ne touche QUE la page d'atterrissage : la **chatbar**
> (point d'entrée agentique) et la **disposition des cards d'articles / non-articles**.
> Rendu cible : **éditorial New York Times**, UIBlocks, équilibre articles / non-articles.
> Vérif **visuelle réelle** (Chrome headless). Protocole : PLAN → DO → VERIFY (1-10,
> brutal) → DECIDE (FINAL si tous ≥8). Pas de questions : hypothèses notées.

## Hypothèse notée
Le guide AG-UI complet (endpoint SSE, tool registry, approvals, state sync) est un
chantier backend séparé. On priorise l'ACCENT demandé : l'UX visible de la landing.
La chatbar existante (`LiveSearch`) est traitée comme le point d'entrée agentique et
améliorée comme un assistant moderne (ChatGPT/Claude-grade), connectée au réel.

## TASK
Rendre la landing au niveau d'un produit éditorial premium type NYT :
1. une **chatbar** proéminente, élégante, moderne, on-brand, fonctionnelle, qui
   donne envie de l'utiliser comme entrée principale ;
2. une **mosaïque de cards** à forte hiérarchie éditoriale (lead / feature /
   standard), avec un **équilibre soigné entre cards-articles et cards-UIBlocks**
   (marchés, AI desk, watchlist, etc.) — rien de mort/filler ;
3. une cohérence d'ensemble (typo, espacements, rythme) digne du NYT, responsive.

## SUCCESS CRITERIA (stricts, 1-10, cible ≥8)
- **C1 — Chatbar** : proéminente et élégante (niveau ChatGPT/Claude), placement
  clair sur la landing, suggestions contextuelles, branding cohérent, fonctionnelle
  (pas un input mort). Donne l'impression d'un vrai assistant intégré.
- **C2 — Disposition des cards** : mosaïque éditoriale NYT, hiérarchie nette
  (une vraie une), équilibre articles / non-articles maîtrisé, alignements et
  gouttières propres, aucun bloc bancal, responsive (collapse mobile).
- **C3 — Polish éditorial global** : typographie serif/mono cohérente, rythme
  vertical, densité maîtrisée, UIBlocks intégrés avec goût, zéro élément qui fait
  « faux » ou « démo ». L'ensemble lit comme un quotidien financier premium.

> VERIFY = capture headless de la home, lue et notée honnêtement.

## Journal
### Itération 0 — cadrage
- Boucle définie.

### Itération 1 — VERIFY initial (capture réelle)
- C1=6 (chatbar OK mais suggestions World Cup, 3 entrées chat redondantes) ·
  C2=6 (cards « TODAY ON THE DESK » = paris sport 100%/1%/0%, CTAs incohérents
  « Price this event »/« Generate »/« Signal ») · C3=6 (sport dilue l'éditorial).

### Itération 2 — financial-first + CTAs unifiés + retrait World Cup
- market-search : trending = catégories FINANCE d'abord + exclusion des marchés
  quasi-résolus (5-95%). → cards = BTC 6%/30%, Fed 81% (crédibles, financiers).
- Suggestions chatbar désormais financières (BTC, Fed).
- CTAs unifiés en « ✦ Signal » partout (hero, mosaïque, AI desk, news).
- Widget World Cup retiré du haut de la landing (reste via la nav).
- VERIFY : C1=7 C2=7 C3=8 → ITERATING.

### Itération 3 — AI Desk distinct (anti-redite)
- HeroSection « What the desk is watching » : news.slice(8,12) au lieu de (1,5)
  → contenu distinct de la mosaïque (qui utilise news[1..5]).
- VERIFY (capture réelle) : **C1=8 · C2=8 · C3=8** → **FINAL**.

## 🏁 FINAL — landing éditoriale financière (chatbar + cards)
Suivis non bloquants : retirer/affiner le chip « Play the animation », consolider
les 3 points d'entrée chat, et le chantier AG-UI complet (endpoint SSE, tool
registry, approvals, state sync) si on veut l'agent applicatif complet.
