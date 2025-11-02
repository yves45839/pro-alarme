# README technique

## Préparation du projet

1. Installez les dépendances du projet :
   ```bash
   npm install
   ```
2. Créez un fichier `.env.local` à la racine du projet avec les variables minimum suivantes :
   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="générez_une_clé_32_caractères"
   SMTP_HOST="smtp.exemple.ci"
   SMTP_PORT="587"
   SMTP_USER="no-reply@proalarme.ci"
   SMTP_PASS="mot_de_passe"
   PAWAPAY_BASE_URL="https://api.sandbox.pawapay.cloud"
   # Authentification : fournissez soit un token, soit un duo username/password.
   PAWAPAY_API_TOKEN="token_api"
   PAWAPAY_API_USERNAME=""
   PAWAPAY_API_PASSWORD=""
   PAWAPAY_CALLBACK_SECRET="signature_fourni_par_pawapay"
   PAWAPAY_DEFAULT_CURRENCY="XOF"
   ```
   *Utilisez `openssl rand -base64 32` ou `npx auth secret` pour générer `NEXTAUTH_SECRET`.*

3. Mettez la base de données à jour :
   ```bash
   npx prisma migrate dev
   ```
4. Générez le client Prisma (déjà inclus dans `migrate`, mais exécutable séparément) :
   ```bash
   npx prisma generate
   ```
5. Démarrez l’application Next.js :
   ```bash
   npm run dev
   ```

## Authentification du tableau de bord

1. Créez un compte administrateur sécurisé en exportant les variables nécessaires puis en lançant le script :
   ```bash
   ADMIN_EMAIL="admin@proalarme.ci" \
   ADMIN_PASSWORD="mot_de_passe_solide" \
   ADMIN_NAME="Administrateur" \
   npm run admin:create
   ```
   Le mot de passe est chiffré via `bcrypt`. Relancez le script avec d’autres variables pour créer des opérateurs supplémentaires.

2. Les routes `/dashboard` sont protégées par NextAuth (session JWT + middleware). Les utilisateurs non authentifiés sont redirigés vers `/login`.

3. Pour modifier la liste des rôles, ajustez l’énumération `UserRole` dans `prisma/schema.prisma`.

## Schéma de données métier

Les tables principales (définies dans `prisma/schema.prisma`) couvrent l’ensemble du processus opérationnel :

- `Prospect` : capture et qualification des prospects, liens avec le client final.
- `Customer` : fiche client (identifiant = numéro de téléphone) et liens vers abonnements/équipements.
- `Subscription` : suivi des offres souscrites, dates de renouvellement et horodatage des rappels SMS.
- `AlarmDevice` : gestion du matériel installé avec statut et historique des visites techniques.
- `TechnicianVisit` : planification et suivi des interventions / installations.
- `PaymentTransaction` : journal des dépôts/payouts pawaPay et liaison optionnelle avec un abonnement.
- `MessageLog` : journal complet des SMS envoyés et reçus (formulaire, installation, rappels, confirmation, messages personnalisés).
- `User`, `Account`, `Session`, `VerificationToken` : structure NextAuth pour l’authentification back-office.

Consultez `prisma/migrations/*/migration.sql` pour le SQL détaillé (création d’énumérations, index, contraintes).

## Roadmap fonctionnelle du dashboard interne

- **Vue d’ensemble** : indicateurs clés (prospects à traiter, abonnements actifs, rappels urgents).
- **Prospects** : qualification et conversion en client avec déclenchement du SMS d’accueil.
- **Installations** : planification technicien + envoi des SMS d’installation (API Orange CI).
- **Abonnements** : séquence de rappels (J-5, J-2, J0), confirmation de renouvellement et suivi des paiements pawaPay.
- **Messagerie** : interface pour envoyer des messages personnalisés et vérifier l’historique.

Les points d’intégration SMS devront utiliser les API opérateur (ex. Orange CI) depuis des routes `app/api/*` en s’appuyant sur `MessageLog` pour conserver un audit complet.

## Intégration pawaPay

1. **Configurer les callbacks**  
   Déclarez `https://<votre-domaine>/api/pawapay/callback` (ou l’URL fournie par votre tunnel ngrok/cloudflared en local) dans le dashboard pawaPay pour les dépôts, payouts et refunds. Les notifications porteront l’en-tête `X-PawaPay-Signature`.
2. **Clés API & secrets**  
   - Si vous utilisez un **API token** (`Bearer`), renseignez `PAWAPAY_API_TOKEN` uniquement.  
   - Si vous préférez l’authentification **Basic**, renseignez `PAWAPAY_API_USERNAME` et `PAWAPAY_API_PASSWORD`.  
   Dans tous les cas, stockez la clé de signature fournie par pawaPay dans `PAWAPAY_CALLBACK_SECRET`.
3. **Création d’un paiement**  
   Depuis le tableau de bord (`/dashboard`), le formulaire « Initier un paiement (pawaPay) » crée une entrée `PaymentTransaction` et appelle `POST /v1/deposits` côté pawaPay. La réponse renvoie une référence client à partager avec l’abonné.
4. **Réception des callbacks**  
   L’endpoint `app/api/pawapay/callback` vérifie la signature HMAC, met à jour la transaction (statut, référence opérateur, message d’erreur) et réactive l’abonnement associé lorsque le paiement est `SUCCESS`.
5. **Audit & supervision**  
   Toutes les transactions restent consultables via la table `PaymentTransaction`. Les formulaires utilisent `revalidatePath('/dashboard')` pour rafraîchir la vue administrateur après chaque action.
