'use server';

import { revalidatePath } from 'next/cache';
import {
  Prisma,
  ProspectStatus,
  SubscriptionStatus,
  MessageDirection,
  $Enums,
} from '@prisma/client';
import prisma from '@/lib/db';
import { initiatePawaPayDeposit } from '@/services/payments';

export type ActionState =
  | { status: 'idle' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string };

const normalizePhoneNumber = (value: string) => value.replace(/\s+/g, '').trim();

const parseNullableDate = (value: string | null | undefined) => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date;
};

export async function createProspectAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const phoneInput = (formData.get('phoneNumber') as string | null) ?? '';
  const phoneNumber = normalizePhoneNumber(phoneInput);

  if (!phoneNumber) {
    return { status: 'error', message: 'Le numéro de téléphone est obligatoire.' };
  }

  try {
    const fullName = (formData.get('fullName') as string | null)?.trim() || null;
    const email = (formData.get('email') as string | null)?.trim() || null;
    const location = (formData.get('location') as string | null)?.trim() || null;
    const source = (formData.get('source') as string | null)?.trim() || null;
    const notes = (formData.get('notes') as string | null)?.trim() || null;
    const statusInput = (formData.get('status') as string | null)?.trim().toUpperCase();
    const status = statusInput && Object.values(ProspectStatus).includes(statusInput as ProspectStatus)
      ? (statusInput as ProspectStatus)
      : ProspectStatus.NEW;

    const convertedAt = status === ProspectStatus.CONVERTED ? new Date() : undefined;

    await prisma.prospect.upsert({
      where: { phoneNumber },
      update: {
        fullName,
        email,
        location,
        source,
        notes,
        status,
        convertedAt,
      },
      create: {
        phoneNumber,
        fullName,
        email,
        location,
        source,
        notes,
        status,
        convertedAt,
      },
    });

    revalidatePath('/dashboard');
    return { status: 'success', message: 'Prospect enregistré avec succès.' };
  } catch (error) {
    console.error('Erreur creation prospect', error);
    return {
      status: 'error',
      message: "Impossible d'enregistrer ce prospect. Vérifiez les informations et réessayez.",
    };
  }
}

export async function createCustomerAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const phoneInput = (formData.get('phoneNumber') as string | null) ?? '';
  const phoneNumber = normalizePhoneNumber(phoneInput);

  if (!phoneNumber) {
    return { status: 'error', message: 'Le numéro de téléphone est obligatoire.' };
  }

  try {
    const fullName = (formData.get('fullName') as string | null)?.trim() || null;
    const email = (formData.get('email') as string | null)?.trim() || null;
    const location = (formData.get('location') as string | null)?.trim() || null;
    const notes = (formData.get('notes') as string | null)?.trim() || null;
    const firstSubscriptionAt = parseNullableDate(formData.get('firstSubscriptionAt') as string | null);

    await prisma.customer.upsert({
      where: { phoneNumber },
      update: {
        fullName,
        email,
        location,
        notes,
        firstSubscriptionAt,
      },
      create: {
        phoneNumber,
        fullName,
        email,
        location,
        notes,
        firstSubscriptionAt,
      },
    });

    await prisma.prospect
      .update({
        where: { phoneNumber },
        data: {
          status: ProspectStatus.CONVERTED,
          convertedAt: new Date(),
          customerPhoneNumber: phoneNumber,
        },
      })
      .catch(() => undefined);

    revalidatePath('/dashboard');
    return { status: 'success', message: 'Client enregistré avec succès.' };
  } catch (error) {
    console.error('Erreur creation client', error);
    return {
      status: 'error',
      message: "Impossible d'enregistrer ce client. Vérifiez les informations et réessayez.",
    };
  }
}

export async function initiatePawaPayDepositAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const msisdn = ((formData.get('msisdn') as string | null) ?? '').trim();
  const amountValue = (formData.get('amount') as string | null)?.trim();
  const currency = (formData.get('currency') as string | null)?.trim();
  const description = (formData.get('description') as string | null)?.trim() || undefined;
  const subscriptionId = (formData.get('subscriptionId') as string | null)?.trim() || undefined;

  if (!msisdn) {
    return { status: 'error', message: 'Le numéro de téléphone est obligatoire.' };
  }

  const amount = amountValue ? Number.parseFloat(amountValue.replace(',', '.')) : Number.NaN;

  if (!Number.isFinite(amount) || amount <= 0) {
    return { status: 'error', message: 'Le montant doit être un nombre positif.' };
  }

  try {
    const result = await initiatePawaPayDeposit({
      msisdn,
      amount,
      currency,
      subscriptionId,
      description,
    });

    revalidatePath('/dashboard');

    return {
      status: 'success',
      message: `Paiement initié (${result.status}) — référence ${result.customerReference}`,
    };
  } catch (error) {
    console.error('Erreur initiation paiement PawaPay', error);
    return {
      status: 'error',
      message:
        error instanceof Error
          ? `Impossible d'initier le paiement : ${error.message}`
          : "Erreur lors de l'initiation du paiement.",
    };
  }
}

export async function createSubscriptionAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const phoneInput = (formData.get('customerPhoneNumber') as string | null) ?? '';
  const customerPhoneNumber = normalizePhoneNumber(phoneInput);

  if (!customerPhoneNumber) {
    return { status: 'error', message: 'Le numéro du client est obligatoire.' };
  }

  const productName = (formData.get('productName') as string | null)?.trim();
  if (!productName) {
    return { status: 'error', message: 'Le nom du produit est obligatoire.' };
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: { phoneNumber: customerPhoneNumber },
    });

    if (!customer) {
      return {
        status: 'error',
        message: "Ce numéro n'est pas associé à un client. Créez d'abord la fiche client.",
      };
    }

    const planName = (formData.get('planName') as string | null)?.trim() || null;
    const statusInput = (formData.get('status') as string | null)?.trim().toUpperCase();
    const status = statusInput && Object.values(SubscriptionStatus).includes(statusInput as SubscriptionStatus)
      ? (statusInput as SubscriptionStatus)
      : SubscriptionStatus.ACTIVE;
    const startDate = parseNullableDate(formData.get('startDate') as string | null) ?? new Date();
    const renewalDate = parseNullableDate(formData.get('renewalDate') as string | null);
    const endDate = parseNullableDate(formData.get('endDate') as string | null);
    const amountInput = (formData.get('amount') as string | null)?.trim();
    const alarmCentralSerial = (formData.get('alarmCentralSerial') as string | null)?.trim() || null;
    const amount = amountInput ? new Prisma.Decimal(amountInput) : undefined;

    await prisma.subscription.create({
      data: {
        customerPhoneNumber,
        productName,
        planName,
        status,
        startDate,
        renewalDate,
        endDate,
        amount,
        alarmCentralSerial,
      },
    });

    if (!customer.firstSubscriptionAt) {
      await prisma.customer
        .update({
          where: { phoneNumber: customerPhoneNumber },
          data: { firstSubscriptionAt: startDate },
        })
        .catch(() => undefined);
    }

    revalidatePath('/dashboard');
    return { status: 'success', message: 'Abonnement enregistré avec succès.' };
  } catch (error) {
    console.error('Erreur creation abonnement', error);
    return {
      status: 'error',
      message: "Impossible d'enregistrer cet abonnement. Vérifiez les informations et réessayez.",
    };
  }
}

export async function scheduleTechnicianVisitAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const phoneInput = (formData.get('customerPhoneNumber') as string | null) ?? '';
  const customerPhoneNumber = normalizePhoneNumber(phoneInput);

  if (!customerPhoneNumber) {
    return { status: 'error', message: 'Le numéro du client est obligatoire.' };
  }

  const scheduledFor = parseNullableDate(formData.get('scheduledFor') as string | null);

  if (!scheduledFor) {
    return { status: 'error', message: "La date d'intervention est obligatoire." };
  }

  try {
    const customer = await prisma.customer.findUnique({ where: { phoneNumber: customerPhoneNumber } });

    if (!customer) {
      return {
        status: 'error',
        message: "Ce numéro n'est pas associé à un client. Créez d'abord la fiche client.",
      };
    }

    const technicianName = (formData.get('technicianName') as string | null)?.trim() || null;
    const notes = (formData.get('notes') as string | null)?.trim() || null;
    const deviceSerial = (formData.get('deviceSerial') as string | null)?.trim() || null;

    const device = deviceSerial
      ? await prisma.alarmDevice.findUnique({ where: { serialNumber: deviceSerial } })
      : null;

    await prisma.technicianVisit.create({
      data: {
        customerPhoneNumber,
        scheduledFor,
        technicianName,
        notes,
        alarmDeviceId: device?.id,
      },
    });

    revalidatePath('/dashboard');
    return { status: 'success', message: 'Intervention planifiée avec succès.' };
  } catch (error) {
    console.error('Erreur creation visite technicien', error);
    return {
      status: 'error',
      message: "Impossible de planifier cette intervention. Vérifiez les informations et réessayez.",
    };
  }
}

export async function sendCustomMessageAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const phoneInput = (formData.get('phoneNumber') as string | null) ?? '';
  const phoneNumber = normalizePhoneNumber(phoneInput);

  if (!phoneNumber) {
    return { status: 'error', message: 'Le numéro de téléphone est obligatoire.' };
  }

  const content = (formData.get('content') as string | null)?.trim();

  if (!content) {
    return { status: 'error', message: 'Le message à envoyer est obligatoire.' };
  }

  try {
    const customer = await prisma.customer.findUnique({ where: { phoneNumber } });
    const prospect = await prisma.prospect.findUnique({ where: { phoneNumber } });

    await prisma.messageLog.create({
      data: {
        phoneNumber,
        direction: MessageDirection.OUTBOUND,
        category: $Enums.MessageCategory.CUSTOM,
        channel: 'SMS',
        content,
        status: 'QUEUED',
        customerPhoneNumber: customer ? customer.phoneNumber : undefined,
        prospectId: prospect ? prospect.id : undefined,
      },
    });

    revalidatePath('/dashboard');
    return { status: 'success', message: 'Message ajouté à la file SMS.' };
  } catch (error) {
    console.error('Erreur envoi message personnalisé', error);
    return {
      status: 'error',
      message: "Impossible d'enregistrer ce message. Vérifiez les informations et réessayez.",
    };
  }
}
