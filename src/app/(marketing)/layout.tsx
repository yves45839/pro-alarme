import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { DappelleCallButton } from "@/components/DappelleCallButton";

const logoProalarmeSrc = "/images/logo_proalarme.png" as const;

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur">
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
    </>
  );
}
