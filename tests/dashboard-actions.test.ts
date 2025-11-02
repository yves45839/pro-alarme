import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Prisma, ProspectStatus, MessageCategory, MessageDirection } from '@prisma/client';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

type MockedFn = ReturnType<typeof vi.fn>;

type PrismaMock = {
  prospect: {
    upsert: MockedFn;
    update: MockedFn;
    findUnique: MockedFn;
  };
  customer: {
    upsert: MockedFn;
    findUnique: MockedFn;
    update: MockedFn;
  };
  subscription: {
    create: MockedFn;
  };
  technicianVisit: {
    create: MockedFn;
  };
  alarmDevice: {
    findUnique: MockedFn;
  };
  messageLog: {
    create: MockedFn;
  };
};

function createPrismaMock(): PrismaMock {
  return {
    prospect: {
      upsert: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
    },
    customer: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    subscription: {
      create: vi.fn(),
    },
    technicianVisit: {
      create: vi.fn(),
    },
    alarmDevice: {
      findUnique: vi.fn(),
    },
    messageLog: {
      create: vi.fn(),
    },
  };
}

vi.mock('@/lib/db', () => ({
  default: createPrismaMock(),
}));

vi.mock('@/services/payments', () => ({
  initiatePawaPayDeposit: vi.fn(),
  mapProviderStatus: () => "PENDING",
}));

import { revalidatePath } from 'next/cache';
import {
  createProspectAction,
  createCustomerAction,
  createSubscriptionAction,
  scheduleTechnicianVisitAction,
  sendCustomMessageAction,
  initiatePawaPayDepositAction,
} from '@/actions/dashboard';
import prisma from '@/lib/db';
import { initiatePawaPayDeposit } from '@/services/payments';

const PROSPECT_STATUS_CONVERTED = 'CONVERTED' as ProspectStatus;

const mockedRevalidatePath = revalidatePath as unknown as MockedFn;
const prismaMock = prisma as unknown as PrismaMock;
const initiateDepositMock = initiatePawaPayDeposit as unknown as MockedFn;

const resetMockTree = (object: Record<string, unknown>) => {
  Object.values(object).forEach((value) => {
    if (value && typeof value === 'object' && !('mockReset' in value)) {
      resetMockTree(value as Record<string, unknown>);
    } else if (typeof value === 'function' && 'mockReset' in value) {
      (value as MockedFn).mockReset();
    }
  });
};

beforeEach(() => {
  resetMockTree(prismaMock as unknown as Record<string, unknown>);
  mockedRevalidatePath.mockReset();
  initiateDepositMock.mockReset();
});

describe('createProspectAction', () => {
  it('enregistre un prospect converti et invalide le cache', async () => {
    const db = prismaMock;
    db.prospect.upsert.mockResolvedValue({ id: 'prospect-1' });
    db.prospect.update.mockRejectedValue(new Error('Prospect inexistant'));

    const formData = new FormData();
    formData.set('phoneNumber', ' 07 00 00 00 00 ');
    formData.set('fullName', 'Jean Dupont');
    formData.set('email', 'jean@example.com');
    formData.set('status', 'CONVERTED');

    const result = await createProspectAction({ status: 'idle' }, formData);

    expect(result).toEqual({
      status: 'success',
      message: 'Prospect enregistré avec succès.',
    });

    expect(db.prospect.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { phoneNumber: '0700000000' },
        create: expect.objectContaining({
          status: PROSPECT_STATUS_CONVERTED,
          convertedAt: expect.any(Date),
        }),
        update: expect.objectContaining({
          fullName: 'Jean Dupont',
          email: 'jean@example.com',
        }),
      }),
    );

    expect(mockedRevalidatePath).toHaveBeenCalledWith('/dashboard');
  });

  it("retourne une erreur quand le numéro n'est pas fourni", async () => {
    const result = await createProspectAction({ status: 'idle' }, new FormData());

    expect(result).toEqual({
      status: 'error',
      message: 'Le numéro de téléphone est obligatoire.',
    });
  });
});

describe('createCustomerAction', () => {
  it('synchronise le prospect et crée le client', async () => {
    const db = prismaMock;
    db.customer.upsert.mockResolvedValue({ phoneNumber: '0700000000' });
    db.prospect.update.mockResolvedValue({ id: 'prospect-1' });

    const formData = new FormData();
    formData.set('phoneNumber', '0700000000');
    formData.set('fullName', 'Client Pro Alarme');
    formData.set('firstSubscriptionAt', '2025-01-01');

    const result = await createCustomerAction({ status: 'idle' }, formData);

    expect(result).toEqual({
      status: 'success',
      message: 'Client enregistré avec succès.',
    });

    expect(db.customer.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { phoneNumber: '0700000000' },
        create: expect.objectContaining({
          fullName: 'Client Pro Alarme',
          firstSubscriptionAt: expect.any(Date),
        }),
      }),
    );

    expect(db.prospect.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { phoneNumber: '0700000000' },
        data: expect.objectContaining({
          status: PROSPECT_STATUS_CONVERTED,
          convertedAt: expect.any(Date),
        }),
      }),
    );
    expect(mockedRevalidatePath).toHaveBeenCalledWith('/dashboard');
  });
});

describe('createSubscriptionAction', () => {
  it("refuse la création si le client n'existe pas", async () => {
    const db = prismaMock;
    db.customer.findUnique.mockResolvedValue(null);

    const formData = new FormData();
    formData.set('customerPhoneNumber', '0700000000');
    formData.set('productName', 'Pack Pro');

    const result = await createSubscriptionAction({ status: 'idle' }, formData);

    expect(result).toEqual({
      status: 'error',
      message: "Ce numéro n'est pas associé à un client. Créez d'abord la fiche client.",
    });
    expect(db.subscription.create).not.toHaveBeenCalled();
  });

  it('crée un abonnement et initialise la première souscription', async () => {
    const db = prismaMock;
    db.customer.findUnique.mockResolvedValue({
      phoneNumber: '0700000000',
      firstSubscriptionAt: null,
    });
    db.subscription.create.mockResolvedValue({ id: 'sub-1' });
    db.customer.update.mockResolvedValue({ phoneNumber: '0700000000' });

    const formData = new FormData();
    formData.set('customerPhoneNumber', '0700000000');
    formData.set('productName', 'Pack Pro Alarme');
    formData.set('planName', 'Mensuel');
    formData.set('amount', '50000');
    formData.set('startDate', '2025-01-01');
    formData.set('renewalDate', '2025-02-01');

    const result = await createSubscriptionAction({ status: 'idle' }, formData);

    expect(result).toEqual({
      status: 'success',
      message: 'Abonnement enregistré avec succès.',
    });

    expect(db.subscription.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          customerPhoneNumber: '0700000000',
          productName: 'Pack Pro Alarme',
          amount: new Prisma.Decimal('50000'),
        }),
      }),
    );

    expect(db.customer.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { phoneNumber: '0700000000' },
        data: { firstSubscriptionAt: expect.any(Date) },
      }),
    );

    expect(mockedRevalidatePath).toHaveBeenCalledWith('/dashboard');
  });
});

describe('scheduleTechnicianVisitAction', () => {
  it("retourne une erreur si le client n'existe pas", async () => {
    const db = prismaMock;
    db.customer.findUnique.mockResolvedValue(null);

    const formData = new FormData();
    formData.set('customerPhoneNumber', '0700000000');
    formData.set('scheduledFor', '2025-01-15T09:30');

    const result = await scheduleTechnicianVisitAction({ status: 'idle' }, formData);

    expect(result).toEqual({
      status: 'error',
      message: "Ce numéro n'est pas associé à un client. Créez d'abord la fiche client.",
    });
  });

  it('planifie une intervention liée à un appareil existant', async () => {
    const db = prismaMock;
    db.customer.findUnique.mockResolvedValue({ phoneNumber: '0700000000' });
    db.alarmDevice.findUnique.mockResolvedValue({ id: 'device-1' });
    db.technicianVisit.create.mockResolvedValue({ id: 'visit-1' });

    const formData = new FormData();
    formData.set('customerPhoneNumber', '0700000000');
    formData.set('scheduledFor', '2025-01-20T10:00');
    formData.set('technicianName', 'Technicien Koffi');
    formData.set('deviceSerial', 'SN-123');

    const result = await scheduleTechnicianVisitAction({ status: 'idle' }, formData);

    expect(result).toEqual({
      status: 'success',
      message: 'Intervention planifiée avec succès.',
    });

    expect(db.technicianVisit.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          customerPhoneNumber: '0700000000',
          technicianName: 'Technicien Koffi',
          alarmDeviceId: 'device-1',
          scheduledFor: expect.any(Date),
        }),
      }),
    );
    expect(mockedRevalidatePath).toHaveBeenCalledWith('/dashboard');
  });
});

describe('sendCustomMessageAction', () => {
  it('archive un message personnalisé et cible prospect ou client', async () => {
    const db = prismaMock;
    db.customer.findUnique.mockResolvedValue({ phoneNumber: '0700000000' });
    db.prospect.findUnique.mockResolvedValue({ id: 'prospect-1' });
    db.messageLog.create.mockResolvedValue({ id: 'message-1' });

    const formData = new FormData();
    formData.set('phoneNumber', '0700000000');
    formData.set('content', 'Votre installation est prévue demain à 10h.');

    const result = await sendCustomMessageAction({ status: 'idle' }, formData);

    expect(result).toEqual({
      status: 'success',
      message: 'Message ajouté à la file SMS.',
    });

    expect(db.messageLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          phoneNumber: '0700000000',
          direction: MessageDirection.OUTBOUND,
          category: MessageCategory.CUSTOM,
          content: 'Votre installation est prévue demain à 10h.',
          status: 'QUEUED',
          customerPhoneNumber: '0700000000',
          prospectId: 'prospect-1',
        }),
      }),
    );
    expect(mockedRevalidatePath).toHaveBeenCalledWith('/dashboard');
  });

  it("retourne une erreur si le message n'est pas renseigné", async () => {
    const formData = new FormData();
    formData.set('phoneNumber', '0700000000');

    const result = await sendCustomMessageAction({ status: 'idle' }, formData);

    expect(result).toEqual({
      status: 'error',
      message: 'Le message à envoyer est obligatoire.',
    });
  });
});

describe('initiatePawaPayDepositAction', () => {
  it('appelle le service puis invalide le cache', async () => {
    initiateDepositMock.mockResolvedValue({
      transactionId: 'pay_1',
      customerReference: 'proalarme-123',
      status: 'PENDING',
      providerReference: 'provider-abc',
    });

    const formData = new FormData();
    formData.set('msisdn', '+2250700000000');
    formData.set('amount', '45000');
    formData.set('currency', 'XOF');
    formData.set('subscriptionId', 'sub_1');
    formData.set('description', 'Paiement test');

    const result = await initiatePawaPayDepositAction({ status: 'idle' }, formData);

    expect(initiateDepositMock).toHaveBeenCalledWith({
      msisdn: '+2250700000000',
      amount: 45000,
      currency: 'XOF',
      subscriptionId: 'sub_1',
      description: 'Paiement test',
    });

    expect(mockedRevalidatePath).toHaveBeenCalledWith('/dashboard');
    expect(result.status).toBe('success');
  });

  it('retourne une erreur si le service échoue', async () => {
    initiateDepositMock.mockRejectedValue(new Error('Refusé par l\'opérateur'));

    const formData = new FormData();
    formData.set('msisdn', '0700000000');
    formData.set('amount', '5000');

    const result = await initiatePawaPayDepositAction({ status: 'idle' }, formData);

    expect(result.status).toBe('error');
    expect(result.message).toContain('Refusé par l\'opérateur');
  });
});


