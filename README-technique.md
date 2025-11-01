# README technique

## Base de données Prisma

1. Installez les dépendances :
   ```bash
   npm install
   ```
2. Créez un fichier `.env.local` à la racine du projet en définissant l'URL de la base :
   ```env
   DATABASE_URL="file:./dev.db"
   ```
   > Adaptez l'URL si vous utilisez un autre moteur (PostgreSQL, MySQL, etc.).
3. Initialisez le client Prisma (optionnel si vous utilisez SQLite) :
   ```bash
   npx prisma generate
   ```
4. Exécutez les migrations pour créer le schéma :
   ```bash
   npx prisma migrate dev --name init
   ```
   La commande applique la migration située dans `prisma/migrations` et crée (ou met à jour) la base pointée par `DATABASE_URL`.
5. Démarrez ensuite l'application Next.js :
   ```bash
   npm run dev
   ```

## Schéma de données

Le fichier `prisma/schema.prisma` décrit les entités métier principales :

- `Prospect` : suivi des prospects qualifiés par numéro de téléphone et statut.
- `Customer` : clients confirmés reliés aux prospects par le numéro de téléphone.
- `Subscription` : abonnements des clients avec dates de début, de renouvellement et statut.
- `AlarmDevice` : équipements d'alarme associés à un client et à un état opérationnel.
- `MessageLog` : journalisation des messages entrants/sortants, liés aux prospects et clients via le numéro de téléphone.

Les migrations SQL générées sont disponibles dans `prisma/migrations/*/migration.sql` pour inspection ou exécution manuelle.
