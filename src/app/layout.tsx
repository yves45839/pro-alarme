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
    "Entreprise ivoirienne experte en systèmes d'alarme professionnels, télésurveillance et intervention rapide 24/7 partout à Abidjan.",
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3 text-white md:py-4">
            <Link href="/" className="flex items-center" aria-label="Accueil Pro Alarme">
              <Image
                src={logoProalarmeSrc}
                alt="Logo Pro Alarme"
                width={220}
                height={66}
                className="h-12 w-auto md:h-16"
                priority
              />
            </Link>
            <div className="flex items-center gap-4">
              <a
                href="#audit-form"
                data-analytics-id="cta-header-audit"
                className="hidden items-center justify-center rounded-full bg-red-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex"
              >
                Demander un audit
              </a>
              <DappelleCallButton />
            </div>
          </div>
        </header>
        <main className="pt-20 md:pt-24">{children}</main>
      </body>
    </html>
  );
}
