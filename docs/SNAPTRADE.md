# SnapTrade — connexion de courtier (lecture seule)

Relie un compte courtier de l'utilisateur en **lecture seule** (positions/holdings)
pour personnaliser le pont news→portefeuille. Aucune capacité de trade/retrait.

## État
Code **prêt et déployé**, mais **inactif** tant que les clés ne sont pas fournies
(dégradation propre : la carte « Your brokerage » affiche « 🔒 Bientôt disponible »).

## Activer (quand tu as les clés SnapTrade)
1. Récupère `clientId` + `consumerKey` sur le dashboard SnapTrade (nécessite les
   pages légales publiques — déjà en ligne : /contact, /privacy, /terms).
2. Ajoute au `.env` du serveur (`/opt/aura-news/.env`), **jamais committées** :
   ```
   SNAPTRADE_CLIENT_ID=...
   SNAPTRADE_CONSUMER_KEY=...
   ```
3. Applique la table Supabase (`alphalens_snaptrade_users`, voir `app/supabase/schema.sql`).
4. `systemctl restart aura-news`. La carte devient active dans la Library.

## Architecture (sécurisée)
- `src/lib/snaptrade.ts` : appels signés (HMAC-SHA256) — **clés côté serveur uniquement**.
  `isConfigured()`, `registerUser`, `connectionPortalUrl`, `listHoldings` (read-only).
- Routes : `GET /api/snaptrade/status` (configuré ?), `POST /api/snaptrade/connect`
  (enregistre l'utilisateur, stocke le `userSecret` côté serveur, renvoie l'URL du
  Connection Portal), `GET /api/snaptrade/holdings?userId=` (positions read-only).
- Le `userSecret` SnapTrade n'est **jamais** renvoyé au client ; stocké en base.
- UI : `BrokerageConnect.tsx` (Library) — bouton « Connecter un courtier » ou état
  « bientôt » si non configuré.

## À valider avec les vraies clés
La signature des requêtes suit le schéma documenté (`{content, path, query}` →
HMAC-SHA256 base64). À confronter au SDK officiel `snaptrade-typescript-sdk` lors
de l'activation ; basculer dessus si nécessaire (l'interface de la lib reste stable).
Aucune requête n'est émise sans clés, donc zéro risque en l'état.
