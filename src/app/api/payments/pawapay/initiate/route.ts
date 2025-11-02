import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { initiatePawaPayDeposit } from '@/services/payments';

const initiatePaymentSchema = z.object({
  msisdn: z.string().min(6, 'Le numéro de téléphone est requis.'),
  amount: z.number().positive('Le montant doit être positif.'),
  currency: z.string().length(3).optional(),
  subscriptionId: z.string().optional(),
  description: z.string().max(255).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = initiatePaymentSchema.safeParse({
      ...body,
      amount: typeof body.amount === 'string' ? Number.parseFloat(body.amount) : body.amount,
    });

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Paramètres invalides', details: parseResult.error.flatten() },
        { status: 400 },
      );
    }

    const data = parseResult.data;
    const result = await initiatePawaPayDeposit(data);

    return NextResponse.json(
      {
        transactionId: result.transactionId,
        customerReference: result.customerReference,
        status: result.status,
        providerReference: result.providerReference,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Erreur lors de la création de paiement PawaPay', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
