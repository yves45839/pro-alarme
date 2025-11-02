import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyPawaPaySignature } from '@/lib/pawapay';
import { mapProviderStatus } from '@/services/payments';
import { PaymentStatus, Prisma } from '@prisma/client';

type CallbackPayload = {
  status?: string;
  type?: string;
  customer_reference?: string;
  customerReference?: string;
  provider_transaction_id?: string;
  providerTransactionId?: string;
  error_message?: string;
  errorMessage?: string;
  [key: string]: unknown;
};

export async function POST(request: NextRequest) {
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch (error) {
    console.error('PawaPay callback: impossible de lire le corps', error);
    return NextResponse.json({ error: 'Corps invalide' }, { status: 400 });
  }

  if (!verifyPawaPaySignature(rawBody, request.headers.get('x-pawapay-signature'))) {
    return NextResponse.json({ error: 'Signature invalide' }, { status: 401 });
  }

  let payload: CallbackPayload;
  try {
    payload = JSON.parse(rawBody) as CallbackPayload;
  } catch (error) {
    console.error('PawaPay callback: JSON invalide', error);
    return NextResponse.json({ error: 'Payload JSON invalide' }, { status: 400 });
  }

  const customerReference = payload.customer_reference ?? payload.customerReference;
  if (!customerReference) {
    return NextResponse.json({ error: 'Référence client manquante' }, { status: 400 });
  }

  const transaction = await prisma.paymentTransaction.findUnique({
    where: { customerReference },
  });

  if (!transaction) {
    console.warn(`PawaPay callback: transaction introuvable pour ${customerReference}`);
    return NextResponse.json({ error: 'Transaction introuvable' }, { status: 404 });
  }

  const providerStatus = mapProviderStatus(payload.status);
  const providerReference = payload.provider_transaction_id ?? payload.providerTransactionId;
  const errorMessage = payload.error_message ?? payload.errorMessage;

  const updatedTransaction = await prisma.paymentTransaction.update({
    where: { id: transaction.id },
    data: {
      status: providerStatus,
      providerReference: providerReference ?? transaction.providerReference,
      rawPayload: payload as Prisma.InputJsonValue,
      errorMessage: errorMessage ?? null,
    },
  });

  if (updatedTransaction.subscriptionId && providerStatus === PaymentStatus.SUCCESS) {
    await prisma.subscription.update({
      where: { id: updatedTransaction.subscriptionId },
      data: {
        status: 'ACTIVE',
        lastRenewedAt: new Date(),
      },
    });
  }

  return NextResponse.json({ ok: true });
}
