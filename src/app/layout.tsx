import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pro Alarme | Sécurité professionnelle 24/7 à Abidjan",
  description:
    "Système d'alarme professionnel Pro Alarme : installation, télésurveillance et intervention express 24/7 partout à Abidjan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
