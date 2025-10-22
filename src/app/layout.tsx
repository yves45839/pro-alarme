import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pro Alarme | Sécurité professionnelle 24/7 à Abidjan",
  description:
    "Système d'alarme professionnel Pro Alarme : installation, télésurveillance et intervention express 24/7 partout à Abidjan.",
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
        {children}
      </body>
    </html>
  );
}
