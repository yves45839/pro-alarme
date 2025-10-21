This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Déployer sur Vercel

1. Créez un projet sur [Vercel](https://vercel.com/new) en connectant le dépôt Git qui contient cette application.
2. Lorsque Vercel détecte le framework **Next.js**, laissez les valeurs par défaut :
   - **Install Command** : `npm install`
   - **Build Command** : `npm run build`
   - **Output Directory** : `.next`
3. Définissez les variables d'environnement nécessaires le cas échéant dans l'onglet **Settings → Environment Variables**.
4. Lancez le déploiement. À la fin du processus, Vercel fournira une URL de préproduction ainsi qu'un domaine de production configurable.

> Grâce à la commande `npm run build` (désormais sans l'option expérimentale `--turbopack`), la compilation utilise la configuration supportée par Vercel, ce qui garantit la réussite du déploiement.
