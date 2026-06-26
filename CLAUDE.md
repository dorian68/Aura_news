# AlphaLens Daily / Aura News — Contexte projet

Produit : relier chaque news financière aux **marchés de prédiction réels**
(Polymarket / Kalshi / FedWatch) et au **portefeuille de l'utilisateur**, sans
jamais fabriquer de probabilité. Voir `PRODUCT_VISION.md` et `ETAT_DES_LIEUX.md`.

L'application Next.js vit dans `app/` (voir `app/AGENTS.md` pour les règles Next.js).

## Paradigme de debugging — OBLIGATOIRE

Tout travail sur une feature dépendant d'une API externe, OAuth, base de données,
webhook, provider de paiement, ou intégration tierce **doit** suivre le paradigme
backend-first décrit ici :

@docs/backend_first_debugging_paradigm.md

Résumé : déboguer le backend d'abord (CLI/scripts de debug + logs structurés),
jamais l'UI en premier. L'UI n'est que le dernier maillon. Ne jamais logger de
secret en clair. Ne demander à l'utilisateur que pour une authentification
humaine ou une credential manquante.
