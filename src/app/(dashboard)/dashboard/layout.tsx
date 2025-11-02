import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { SignOutButton } from '@/components/SignOutButton';

const navigationLinks = [
  { href: '/dashboard', label: "Vue d'ensemble" },
  { href: '/dashboard#prospects', label: 'Prospects' },
  { href: '/dashboard#subscriptions', label: 'Abonnements' },
  { href: '/dashboard#operations', label: 'Installations' },
  { href: '/dashboard#messaging', label: 'Messagerie' },
];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-black/60 px-6 py-8 backdrop-blur lg:flex lg:flex-col">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-red-400">
            Pro Alarme
          </p>
          <p className="mt-2 text-sm text-white/60">
            Gestion des opérations
          </p>
        </div>
        <nav className="flex-1 space-y-1">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-lg px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 space-y-2 border-t border-white/10 pt-6 text-xs text-white/60">
          <p>
            Connecté en tant que{' '}
            <span className="font-semibold text-white">
              {session.user?.email ?? 'opérateur'}
            </span>
          </p>
          <p>Rôle: {session.user?.role ?? 'Non défini'}</p>
          <SignOutButton className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-white/20 px-4 py-2 font-medium text-white transition hover:border-red-400 hover:text-red-300" />
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/10 bg-black/70 px-6 py-4 backdrop-blur">
          <div>
            <h1 className="text-xl font-semibold text-white">Tableau de bord Pro Alarme</h1>
            <p className="text-sm text-white/60">
              Pilotez les prospects, installations et abonnements en temps réel.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/70 lg:hidden">
            <span>{session.user?.email}</span>
            <SignOutButton className="rounded-lg border border-white/20 px-3 py-1 transition hover:border-red-400 hover:text-red-300" />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-neutral-950 px-4 py-8 sm:px-6 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
