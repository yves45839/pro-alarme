import crypto from 'node:crypto';

const DEFAULT_BASE_URL = 'https://api.sandbox.pawapay.cloud';
const DEFAULT_CURRENCY = 'XOF';

type DepositParams = {
  amount: number;
  currency?: string;
  msisdn: string;
  customerReference: string;
  description?: string;
};

export type PawaPayDepositResponse = {
  id: string;
  status: string;
  customer_reference: string;
  provider_transaction_id?: string;
  [key: string]: unknown;
};

export function getPawaPayConfig() {
  const baseUrl = process.env.PAWAPAY_BASE_URL ?? DEFAULT_BASE_URL;
  const username = process.env.PAWAPAY_API_USERNAME;
  const password = process.env.PAWAPAY_API_PASSWORD;
  const bearerToken = process.env.PAWAPAY_API_TOKEN;
  const defaultCurrency = process.env.PAWAPAY_DEFAULT_CURRENCY ?? DEFAULT_CURRENCY;

  if (!bearerToken && (!username || !password)) {
    throw new Error(
      'PawaPay API credentials missing. Set PAWAPAY_API_TOKEN or the PAWAPAY_API_USERNAME/PAWAPAY_API_PASSWORD pair.',
    );
  }

  return {
    baseUrl,
    username,
    password,
    bearerToken,
    defaultCurrency,
  };
}

export function getPawaPayCallbackSecret() {
  const callbackSecret = process.env.PAWAPAY_CALLBACK_SECRET;
  if (!callbackSecret) {
    throw new Error('PawaPay callback secret missing. Set PAWAPAY_CALLBACK_SECRET.');
  }
  return callbackSecret;
}

export async function createPawaPayDeposit(params: DepositParams): Promise<PawaPayDepositResponse> {
  const config = getPawaPayConfig();

  const payload = {
    customer_reference: params.customerReference,
    amount: {
      amount: params.amount,
      currency: params.currency ?? config.defaultCurrency,
    },
    credit_party: [
      {
        key: 'msisdn',
        value: normalizeMsisdn(params.msisdn),
      },
    ],
    description: params.description ?? 'Pro Alarme subscription payment',
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: buildAuthorizationHeader(config),
  };

  const response = await fetch(`${config.baseUrl.replace(/\/$/, '')}/v1/deposits`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`PawaPay deposit failed with status ${response.status}: ${errorBody}`);
  }

  return response.json() as Promise<PawaPayDepositResponse>;
}

export function verifyPawaPaySignature(rawBody: string, signatureHeader: string | null): boolean {
  const callbackSecret = getPawaPayCallbackSecret();

  if (!signatureHeader) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', callbackSecret)
    .update(rawBody)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(expectedSignature));
}

export function normalizeMsisdn(value: string): string {
  return value.replace(/[^\d+]/g, '');
}

function buildAuthorizationHeader(config: ReturnType<typeof getPawaPayConfig>): string {
  if (config.bearerToken) {
    return `Bearer ${config.bearerToken}`;
  }

  if (config.username && config.password) {
    return `Basic ${Buffer.from(`${config.username}:${config.password}`).toString('base64')}`;
  }

  throw new Error('Aucun identifiant pawaPay disponible. Vérifiez vos variables d’environnement.');
}
