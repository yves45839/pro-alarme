import type { Metadata } from "next";
import Providers from "@/components/Providers";
import { geistMono, geistSans } from "@/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.proalarme.ci"),
  title: {
    default: "Pro Alarme | Sécurité professionnelle 24/7 à Abidjan",
    template: "%s | Pro Alarme",
  },
  description:
    "Entreprise ivoirienne experte en systèmes d'alarme professionnels, télésurveillance et intervention rapide 24/7 partout à Abidjan.",
  keywords: [
    "pro alarme",
    "proalarme",
    "alarme",
    "anti-intrusion",
    "protection de maison",
    "protéger son magasin",
    "entreprise de surveillance",
    "système d'alarme",
    "télésurveillance Abidjan",
    "sécurité entreprise Côte d'Ivoire",
    "installation alarme professionnelle",
    "intervention sécurité 24/7",
  ],
  category: "Security Service",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Pro Alarme | Sécurité professionnelle 24/7 à Abidjan",
    description:
      "Entreprise ivoirienne experte en systèmes d'alarme professionnels, télésurveillance et intervention rapide 24/7 partout à Abidjan.",
    url: "/",
    siteName: "Pro Alarme",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/images/logo_proalarme.png",
        width: 800,
        height: 800,
        alt: "Logo Pro Alarme Côte d'Ivoire",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pro Alarme | Sécurité professionnelle 24/7 à Abidjan",
    description:
      "Entreprise ivoirienne experte en systèmes d'alarme professionnels, télésurveillance et intervention rapide 24/7 partout à Abidjan.",
    images: ["/images/logo_proalarme.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/images/favicon.ico", type: "image/x-icon" },
      { url: "/images/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/images/favicon.svg", type: "image/svg+xml" }
    ],
    shortcut: [{ url: "/images/favicon.ico" }],
    apple: [{ url: "/images/apple-touch-icon.png", type: "image/png", sizes: "180x180" }]
  },
  manifest: "/images/site.webmanifest"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-neutral-950 text-white antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
