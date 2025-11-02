import crypto from 'node:crypto';
import { PaymentDirection, PaymentStatus, PaymentType, Prisma } from '@prisma/client';
import prisma from '@/lib/db';
import { createPawaPayDeposit, getPawaPayConfig, normalizeMsisdn } from '@/lib/pawapay';

type InitiateDepositInput = {
  msisdn: string;
  amount: number;
  currency?: string;
  subscriptionId?: string;
  description?: string;
};

type ProviderStatus = keyof typeof PROVIDER_STATUS_MAP;

const PROVIDER_STATUS_MAP = {
  PENDING: PaymentStatus.PENDING,
  PROCESSING: PaymentStatus.PROCESSING,
  ACCEPTED: PaymentStatus.PROCESSING,
  SUCCESSFUL: PaymentStatus.SUCCESS,
  SUCCESS: PaymentStatus.SUCCESS,
  COMPLETED: PaymentStatus.SUCCESS,
  FAILED: PaymentStatus.FAILED,
  DECLINED: PaymentStatus.FAILED,
  CANCELLED: PaymentStatus.CANCELLED,
  CANCELED: PaymentStatus.CANCELLED,
} satisfies Record<string, PaymentStatus>;

export type InitiateDepositResult = {
  transactionId: string;
  customerReference: string;
  status: PaymentStatus;
  providerReference?: string | null;
};

export async function initiatePawaPayDeposit(input: InitiateDepositInput): Promise<InitiateDepositResult> {
  const { defaultCurrency } = getPawaPayConfig();
  const normalizedMsisdn = normalizeMsisdn(input.msisdn);
  const currency = (input.currency ?? defaultCurrency).toUpperCase();
  const amountDecimal = new Prisma.Decimal(input.amount);
  const customerReference = `proalarme-${crypto.randomUUID()}`;

  const transaction = await prisma.paymentTransaction.create({
    data: {
      type: PaymentType.DEPOSIT,
      direction: PaymentDirection.INBOUND,
      status: PaymentStatus.PENDING,
      amount: amountDecimal,
      currency,
      msisdn: normalizedMsisdn,
      customerReference,
      description: input.description,
      subscriptionId: input.subscriptionId ?? null,
    },
  });

  try {
    const pawapayResponse = await createPawaPayDeposit({
      amount: input.amount,
      currency,
      msisdn: normalizedMsisdn,
      customerReference,
      description: input.description,
    });

    const providerStatus = mapProviderStatus(pawapayResponse.status);

    const updated = await prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: {
        status: providerStatus,
        providerReference:
          (pawapayResponse.provider_transaction_id as string | undefined) ??
          (pawapayResponse.id as string | undefined) ??
          null,
        rawPayload: pawapayResponse as Prisma.InputJsonValue,
      },
    });

    return {
      transactionId: updated.id,
      customerReference: updated.customerReference,
      status: updated.status,
      providerReference: updated.providerReference,
    };
  } catch (error) {
    await prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: {
        status: PaymentStatus.FAILED,
        errorMessage: error instanceof Error ? error.message : 'Erreur inconnue du fournisseur',
      },
    });

    throw error;
  }
}

export function mapProviderStatus(status: unknown): PaymentStatus {
  if (!status) {
    return PaymentStatus.PENDING;
  }

  const normalized = String(status).toUpperCase() as ProviderStatus;
  return PROVIDER_STATUS_MAP[normalized] ?? PaymentStatus.PENDING;
}
