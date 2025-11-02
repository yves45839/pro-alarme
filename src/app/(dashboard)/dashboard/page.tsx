import prisma from '@/lib/db';
import {
  CreateProspectForm,
  CreateCustomerForm,
  CreateSubscriptionForm,
  ScheduleVisitForm,
  InitiatePawaPayDepositForm,
  SendCustomMessageForm,
} from '@/components/dashboard/ActionForms';

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

async function getDashboardData() {
  const now = new Date();
  const inSevenDays = new Date(now);
  inSevenDays.setDate(now.getDate() + 7);

  const inTwoDays = new Date(now);
  inTwoDays.setDate(now.getDate() + 2);

  const [totalProspects, newProspects, qualifiedProspects, totalCustomers, activeSubscriptions] =
    await Promise.all([
      prisma.prospect.count(),
      prisma.prospect.count({
        where: { status: { in: ['NEW', 'CONTACTED'] } },
      }),
      prisma.prospect.count({
        where: { status: 'QUALIFIED' },
      }),
      prisma.customer.count(),
      prisma.subscription.count({
        where: { status: 'ACTIVE' },
      }),
    ]);

  const [expiringSubscriptions, upcomingVisits, recentMessages] = await Promise.all([
    prisma.subscription.findMany({
      where: {
        renewalDate: {
          gte: now,
          lte: inSevenDays,
        },
        status: { in: ['ACTIVE', 'PAST_DUE'] },
      },
      orderBy: { renewalDate: 'asc' },
      include: {
        customer: true,
      },
      take: 5,
    }),
    prisma.technicianVisit.findMany({
      where: {
        scheduledFor: {
          gte: now,
        },
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
      },
      orderBy: { scheduledFor: 'asc' },
      include: {
        customer: true,
        device: true,
      },
      take: 5,
    }),
    prisma.messageLog.findMany({
      orderBy: { sentAt: 'desc' },
      take: 6,
    }),
  ]);

  const remindersDue = await prisma.subscription.count({
    where: {
      status: { in: ['ACTIVE', 'PAST_DUE'] },
      renewalDate: {
        gte: now,
        lte: inTwoDays,
      },
    },
  });

  return {
    totals: {
      totalProspects,
      newProspects,
      qualifiedProspects,
      totalCustomers,
      activeSubscriptions,
      remindersDue,
    },
    expiringSubscriptions,
    upcomingVisits,
    recentMessages,
  };
}

export default async function DashboardPage() {
  const { totals, expiringSubscriptions, upcomingVisits, recentMessages } = await getDashboardData();

  return (
    <div className="space-y-10">
      <section
        className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3"
        id="actions"
        aria-labelledby="quick-actions"
      >
        <div className="lg:col-span-2 2xl:col-span-3">
          <h2 id="quick-actions" className="text-xl font-semibold text-white">
            Actions rapides
          </h2>
          <p className="mt-1 text-sm text-white/60">
            Créez des prospects, clients, abonnements et interventions sans quitter le tableau de bord.
          </p>
        </div>
        <CreateProspectForm />
        <CreateCustomerForm />
        <CreateSubscriptionForm />
        <InitiatePawaPayDepositForm />
        <ScheduleVisitForm />
        <SendCustomMessageForm />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" id="overview">
        <DashboardStatCard
          title="Prospects totaux"
          value={totals.totalProspects}
          description={`${totals.newProspects} à traiter`}
        />
        <DashboardStatCard
          title="Prospects qualifiés"
          value={totals.qualifiedProspects}
          description={`${totals.totalCustomers} clients convertis`}
        />
        <DashboardStatCard
          title="Abonnements actifs"
          value={totals.activeSubscriptions}
          description={`${totals.remindersDue} rappels à envoyer`}
        />
      </section>

      <section
        className="grid gap-6 lg:grid-cols-2"
        id="prospects"
        aria-labelledby="expiring-subscriptions"
      >
        <div className="rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <h2 id="expiring-subscriptions" className="text-lg font-semibold text-white">
              Abonnements à renouveler (7 jours)
            </h2>
            <span className="text-xs uppercase tracking-[0.4em] text-red-400">
              Urgent
            </span>
          </div>
          <p className="mt-1 text-sm text-white/60">
            Priorité: contacter le client puis déclencher la séquence SMS (J-5, J-2, J0).
          </p>

          <ul className="mt-6 space-y-4">
            {expiringSubscriptions.length === 0 ? (
              <EmptyState label="Aucun abonnement n'expire dans les 7 prochains jours." />
            ) : (
              expiringSubscriptions.map((subscription) => (
                <li
                  key={subscription.id}
                  className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-white/80"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">
                        {subscription.customer?.fullName ?? 'Client sans nom'}
                      </p>
                      <p className="text-xs text-white/60">
                        {subscription.customer?.phoneNumber ?? 'Numéro inconnu'}
                      </p>
                    </div>
                    <div className="text-right text-xs text-white/60">
                      <p className="font-semibold text-white">
                        {subscription.productName}
                      </p>
                      <p>Renouvellement: {subscription.renewalDate ? dateFormatter.format(subscription.renewalDate) : 'Date non définie'}</p>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur" id="operations">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Installations & interventions</h2>
            <span className="text-xs uppercase tracking-[0.4em] text-red-400">Terrain</span>
          </div>
          <p className="mt-1 text-sm text-white/60">
            Planifiez les SMS de confirmation la veille et à l&apos;arrivée du technicien.
          </p>

          <ul className="mt-6 space-y-4">
            {upcomingVisits.length === 0 ? (
              <EmptyState label="Aucune installation ou intervention programmée." />
            ) : (
              upcomingVisits.map((visit) => (
                <li
                  key={visit.id}
                  className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-white/80"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">
                        {visit.customer?.fullName ?? 'Client non renseigné'}
                      </p>
                      <p className="text-xs text-white/60">
                        {visit.customer?.phoneNumber ?? 'Numéro inconnu'}
                      </p>
                      <p className="mt-1 text-xs text-white/50">
                        Centrale: {visit.device?.serialNumber ?? 'Non défini'}
                      </p>
                    </div>
                    <div className="text-right text-xs text-white/60">
                      <p className="font-semibold text-white">
                        {visit.technicianName ?? 'Technicien à assigner'}
                      </p>
                      <p>{dateFormatter.format(visit.scheduledFor)}</p>
                      <p>Statut: {visit.status}</p>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      <section
        className="rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur"
        id="messaging"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Historique des messages</h2>
          <span className="text-xs uppercase tracking-[0.4em] text-red-400">
            Communication
          </span>
        </div>
        <p className="mt-1 text-sm text-white/60">
          Vérifiez que les SMS (accueil, installation, rappels, confirmation) sont bien envoyés.
        </p>

        <ul className="mt-6 space-y-3 text-sm text-white/80">
          {recentMessages.length === 0 ? (
            <EmptyState label="Aucun message envoyé pour l'instant." />
          ) : (
            recentMessages.map((message) => (
              <li
                key={message.id}
                className="rounded-xl border border-white/5 bg-white/5 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-4 text-xs text-white/60">
                  <span>{dateFormatter.format(message.sentAt)}</span>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.25em] text-white">
                    {message.category.replaceAll('_', ' ')}
                  </span>
                  <span>{message.direction}</span>
                </div>
                <p className="mt-2 text-sm text-white">{message.content}</p>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

interface DashboardStatCardProps {
  title: string;
  value: number;
  description: string;
}

function DashboardStatCard({ title, value, description }: DashboardStatCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.45em] text-red-400">
        {title}
      </p>
      <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-white/60">{description}</p>
    </article>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <li className="rounded-xl border border-dashed border-white/10 bg-transparent px-4 py-6 text-center text-sm text-white/60">
      {label}
    </li>
  );
}
