'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import {
  createProspectAction,
  createCustomerAction,
  createSubscriptionAction,
  scheduleTechnicianVisitAction,
  sendCustomMessageAction,
  initiatePawaPayDepositAction,
  type ActionState,
} from '@/actions/dashboard';

const initialActionState: ActionState = { status: 'idle' };

function FormStatusMessage({ state }: { state: ActionState }) {
  if (state.status === 'success') {
    return <p className="text-sm font-medium text-emerald-400">{state.message}</p>;
  }

  if (state.status === 'error') {
    return <p className="text-sm font-medium text-red-400">{state.message}</p>;
  }

  return null;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="inline-flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 disabled:cursor-not-allowed disabled:bg-red-800/60"
      disabled={pending}
    >
      {pending ? 'Enregistrement…' : label}
    </button>
  );
}

function useResetOnSuccess(state: ActionState, formRef: React.RefObject<HTMLFormElement | null>) {
  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset();
    }
  }, [state, formRef]);
}

export function CreateProspectForm() {
  const [state, action] = useActionState(createProspectAction, initialActionState);
  const formRef = useRef<HTMLFormElement | null>(null);
  useResetOnSuccess(state, formRef);

  return (
    <form
      ref={formRef}
      action={action}
      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur"
    >
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-400">
          Prospects
        </p>
        <h3 className="mt-2 text-lg font-semibold text-white">Ajouter un prospect</h3>
        <p className="mt-1 text-sm text-white/60">
          Enregistrez un nouveau contact et déclenchez la séquence d&apos;accueil.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Numéro de téléphone*
          </label>
          <input
            name="phoneNumber"
            type="tel"
            required
            placeholder="+2250700000000"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Nom complet
          </label>
          <input
            name="fullName"
            type="text"
            placeholder="Nom & prénom"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="contact@exemple.ci"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Localisation
          </label>
          <input
            name="location"
            type="text"
            placeholder="Commune, ville"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Source
          </label>
          <input
            name="source"
            type="text"
            placeholder="Campagne, recommandation, etc."
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Statut
          </label>
          <select
            name="status"
            defaultValue="NEW"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          >
            <option value="NEW">Nouveau</option>
            <option value="CONTACTED">Contacté</option>
            <option value="QUALIFIED">Qualifié</option>
            <option value="CONVERTED">Converti</option>
            <option value="LOST">Perdu</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Notes
          </label>
          <textarea
            name="notes"
            rows={3}
            placeholder="Détails sur le besoin, rappeler le client avant 18h..."
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        <SubmitButton label="Enregistrer le prospect" />
        <FormStatusMessage state={state} />
      </div>
    </form>
  );
}

export function CreateCustomerForm() {
  const [state, action] = useActionState(createCustomerAction, initialActionState);
  const formRef = useRef<HTMLFormElement | null>(null);
  useResetOnSuccess(state, formRef);

  return (
    <form
      ref={formRef}
      action={action}
      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur"
    >
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-400">
          Clients
        </p>
        <h3 className="mt-2 text-lg font-semibold text-white">Créer/mettre à jour un client</h3>
        <p className="mt-1 text-sm text-white/60">
          Alimentez la base client et reliez automatiquement le prospect correspondant.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Numéro de téléphone*
          </label>
          <input
            name="phoneNumber"
            type="tel"
            required
            placeholder="+2250700000000"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Nom complet
          </label>
          <input
            name="fullName"
            type="text"
            placeholder="Nom & prénom"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="client@exemple.ci"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Localisation
          </label>
          <input
            name="location"
            type="text"
            placeholder="Quartier, ville"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Première souscription
          </label>
          <input
            name="firstSubscriptionAt"
            type="date"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Notes
          </label>
          <textarea
            name="notes"
            rows={3}
            placeholder="Informations complémentaires, exigences spécifiques..."
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        <SubmitButton label="Sauvegarder le client" />
        <FormStatusMessage state={state} />
      </div>
    </form>
  );
}

export function CreateSubscriptionForm() {
  const [state, action] = useActionState(createSubscriptionAction, initialActionState);
  const formRef = useRef<HTMLFormElement | null>(null);
  useResetOnSuccess(state, formRef);

  return (
    <form
      ref={formRef}
      action={action}
      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur"
    >
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-400">
          Abonnements
        </p>
        <h3 className="mt-2 text-lg font-semibold text-white">Créer un abonnement</h3>
        <p className="mt-1 text-sm text-white/60">
          Ajoutez un contrat et activez le suivi automatisé des rappels.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Numéro du client*
          </label>
          <input
            name="customerPhoneNumber"
            type="tel"
            required
            placeholder="+2250700000000"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Produit*
          </label>
          <input
            name="productName"
            type="text"
            required
            placeholder="Pack Pro 24/7"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Offre / plan
          </label>
          <input
            name="planName"
            type="text"
            placeholder="Mensuel, annuel..."
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Date de début
          </label>
          <input
            name="startDate"
            type="date"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Renouvellement
          </label>
          <input
            name="renewalDate"
            type="date"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Expiration
          </label>
          <input
            name="endDate"
            type="date"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Montant (FCFA)
          </label>
          <input
            name="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            placeholder="50000"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            N° centrale alarme
          </label>
          <input
            name="alarmCentralSerial"
            type="text"
            placeholder="S/N centrale"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Statut
          </label>
          <select
            name="status"
            defaultValue="ACTIVE"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          >
            <option value="TRIAL">Période d&apos;essai</option>
            <option value="ACTIVE">Actif</option>
            <option value="PAST_DUE">Retard</option>
            <option value="CANCELED">Résilié</option>
            <option value="EXPIRED">Expiré</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <SubmitButton label="Créer l'abonnement" />
        <FormStatusMessage state={state} />
      </div>
    </form>
  );
}

export function ScheduleVisitForm() {
  const [state, action] = useActionState(scheduleTechnicianVisitAction, initialActionState);
  const formRef = useRef<HTMLFormElement | null>(null);
  useResetOnSuccess(state, formRef);

  return (
    <form
      ref={formRef}
      action={action}
      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur"
    >
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-400">
          Installations
        </p>
        <h3 className="mt-2 text-lg font-semibold text-white">Planifier une intervention</h3>
        <p className="mt-1 text-sm text-white/60">
          Bloquez une visite et assurez-vous que le client reçoit les SMS de confirmation.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Numéro du client*
          </label>
          <input
            name="customerPhoneNumber"
            type="tel"
            required
            placeholder="+2250700000000"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Date & heure*
          </label>
          <input
            name="scheduledFor"
            type="datetime-local"
            required
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Technicien
          </label>
          <input
            name="technicianName"
            type="text"
            placeholder="Nom du technicien"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            N° centrale (optionnel)
          </label>
          <input
            name="deviceSerial"
            type="text"
            placeholder="S/N centrale"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Notes
          </label>
          <textarea
            name="notes"
            rows={3}
            placeholder="Instructions pour le client ou le technicien..."
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        <SubmitButton label="Planifier l'intervention" />
        <FormStatusMessage state={state} />
      </div>
    </form>
  );
}

export function InitiatePawaPayDepositForm() {
  const [state, action] = useActionState(initiatePawaPayDepositAction, initialActionState);
  const formRef = useRef<HTMLFormElement | null>(null);
  useResetOnSuccess(state, formRef);

  return (
    <form
      ref={formRef}
      action={action}
      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur"
    >
      <header>
        <p className="text-xsФ font-semibold uppercase tracking-[0.35em] text-red-400">
          Paiements
        </p>
        <h3 className="mt-2 text-lg font-semibold text-white">Initier un paiement (pawaPay)</h3>
        <p className="mt-1 text-sm text-white/60">
          Envoie une demande de dépôt mobile money et suit son statut via les callbacks.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Numéro mobile money*
          </label>
          <input
            name="msisdn"
            type="tel"
            required
            placeholder="+2250700000000"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Montant (FCFA)*
          </label>
          <input
            name="amount"
            type="number"
            required
            step="0.01"
            min="0"
            placeholder="50000"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Devise
          </label>
          <input
            name="currency"
            type="text"
            placeholder="XOF"
            maxLength={3}
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white uppercase outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Abonnement lié
          </label>
          <input
            name="subscriptionId"
            type="text"
            placeholder="ID abonnement (optionnel)"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Paiement abonnement Pro Alarme"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        <SubmitButton label="Lancer le paiement" />
        <FormStatusMessage state={state} />
      </div>
    </form>
  );
}

export function SendCustomMessageForm() {
  const [state, action] = useActionState(sendCustomMessageAction, initialActionState);
  const formRef = useRef<HTMLFormElement | null>(null);
  useResetOnSuccess(state, formRef);

  return (
    <form
      ref={formRef}
      action={action}
      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur"
    >
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-400">
          Communication
        </p>
        <h3 className="mt-2 text-lg font-semibold text-white">Envoyer un message personnalisé</h3>
        <p className="mt-1 text-sm text-white/60">
          Archivez vos SMS manuels pour garder un historique complet du client.
        </p>
      </header>

      <div className="grid gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Numéro de téléphone*
          </label>
          <input
            name="phoneNumber"
            type="tel"
            required
            placeholder="+2250700000000"
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Message*
          </label>
          <textarea
            name="content"
            required
            rows={4}
            placeholder="Votre centrale sera installée demain à 10h. Merci de confirmer votre présence."
            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        <SubmitButton label="Enregistrer le message" />
        <FormStatusMessage state={state} />
      </div>
    </form>
  );
}
