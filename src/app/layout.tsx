import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DappelleCallButton } from "@/components/DappelleCallButton";
import "./globals.css";

const logoProalarmeSrc = "/images/logo_proalarme.png" as const;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.proalarme.ci"),
  title: {
    default: "Pro Alarme | Sécurité professionnelle 24/7 à Abidjan",
    template: "%s | Pro Alarme",
  },
  description:
    "Système d'alarme professionnel Pro Alarme : installation, télésurveillance et intervention express 24/7 partout à Abidjan.",
  keywords: [
    "pro alarme",
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
      "Installation de systèmes d'alarme, télésurveillance et intervention express 24/7 partout à Abidjan.",
    url: "/",
    siteName: "Pro Alarme",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/images/agent-securite.png",
        width: 1200,
        height: 630,
        alt: "Agent de sécurité Pro Alarme supervisant un centre de contrôle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pro Alarme | Sécurité professionnelle 24/7 à Abidjan",
    description:
      "Installation de systèmes d'alarme, télésurveillance et intervention express 24/7 partout à Abidjan.",
    images: ["/images/agent-securite.png"],
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3 text-white md:py-4">
            <Link href="/" className="flex items-center" aria-label="Accueil Pro Alarme">
              <Image
                src={logoProalarmeSrc}
                alt="Logo Pro Alarme"
                width={160}
                height={48}
                className="h-10 w-auto md:h-12"
                priority
              />
            </Link>
            <div className="flex items-center gap-4">
              <DappelleCallButton />
            </div>
          </div>
        </header>
        <main className="pt-20 md:pt-24">{children}</main>
      </body>
    </html>
  );
}
