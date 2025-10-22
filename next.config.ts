import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Les visuels du site sont tous hébergés localement dans /public/images.
    // Désactiver l'optimisation à la volée de Next.js évite de consommer les
    // crédits Image Optimization de Vercel tout en servant les fichiers statiques
    // tels quels depuis le CDN.
    unoptimized: true,
  },
};

export default nextConfig;
