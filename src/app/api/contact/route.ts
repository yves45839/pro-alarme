import { NextResponse } from "next/server";
import nodemailer, { type Transporter } from "nodemailer";

const REQUIRED_ENV_VARS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
];

const REQUIRED_WHATSAPP_ENV_VARS = [
  "WHATSAPP_PHONE_NUMBER_ID",
  "WHATSAPP_ACCESS_TOKEN",
  "WHATSAPP_RECIPIENT",
];

type EmailConfig = {
  transporter: Transporter;
  recipient: string;
};

type WhatsAppConfig = {
  phoneNumberId: string;
  accessToken: string;
  recipient: string;
};

type ConfigResult<T> = { ok: true; value: T } | { ok: false; error: string };

let cachedEmailConfig: EmailConfig | null = null;
let cachedWhatsAppConfig: WhatsAppConfig | null = null;

const createEmailConfig = (): ConfigResult<EmailConfig> => {
  if (cachedEmailConfig) {
    return { ok: true, value: cachedEmailConfig };
  }

  const missingEnvVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missingEnvVars.length > 0) {
    return {
      ok: false,
      error: `Missing required SMTP environment variables: ${missingEnvVars.join(", ")}`,
    };
  }

  const smtpPort = Number.parseInt(process.env.SMTP_PORT as string, 10);

  if (Number.isNaN(smtpPort)) {
    return { ok: false, error: "SMTP_PORT must be a valid number" };
  }

  const smtpSecure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE.toLowerCase() === "true"
    : smtpPort === 465;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const recipient = process.env.TO_EMAIL ?? (process.env.SMTP_USER as string);

  cachedEmailConfig = { transporter, recipient };

  return { ok: true, value: cachedEmailConfig };
};

const createWhatsAppConfig = (): ConfigResult<WhatsAppConfig> => {
  if (cachedWhatsAppConfig) {
    return { ok: true, value: cachedWhatsAppConfig };
  }

  const missingEnvVars = REQUIRED_WHATSAPP_ENV_VARS.filter(
    (key) => !process.env[key],
  );

  if (missingEnvVars.length > 0) {
    return {
      ok: false,
      error: `Missing required WhatsApp environment variables: ${missingEnvVars.join(", ")}`,
    };
  }

  cachedWhatsAppConfig = {
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID as string,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN as string,
    recipient: process.env.WHATSAPP_RECIPIENT as string,
  };

  return { ok: true, value: cachedWhatsAppConfig };
};

const sanitizeString = (value: unknown) => {
  return typeof value === "string" ? value.trim() : "";
};

type ContactPayload = {
  buildingType?: unknown;
  location?: unknown;
  phone?: unknown;
  email?: unknown;
};

type SanitizedPayload = {
  buildingType: string;
  location: string;
  phone: string;
  email?: string;
};

const sanitizeAndValidatePayload = (
  payload: ContactPayload,
): { data: SanitizedPayload | null; errors: string[] } => {
  const buildingType = sanitizeString(payload.buildingType);
  const location = sanitizeString(payload.location);
  const phone = sanitizeString(payload.phone);
  const email = sanitizeString(payload.email);

  const errors: string[] = [];

  if (buildingType.length === 0) {
    errors.push("Le type de bâtiment est obligatoire.");
  }

  if (location.length === 0) {
    errors.push("La localisation est obligatoire.");
  }

  if (phone.length === 0) {
    errors.push("Le numéro de téléphone est obligatoire.");
  } else {
    const phoneRegex = /^\+?[0-9\s.-]{6,}$/;
    if (!phoneRegex.test(phone)) {
      errors.push("Le numéro de téléphone indiqué est invalide.");
    }
  }

  if (email.length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("L'adresse e-mail indiquée est invalide.");
    }
  }

  if (errors.length > 0) {
    return { data: null, errors };
  }

  return {
    data: {
      buildingType,
      location,
      phone,
      email: email.length > 0 ? email : undefined,
    },
    errors,
  };
};

const formatField = (label: string, value?: string) => {
  if (!value) {
    return `${label}: —`;
  }

  return `${label}: ${value}`;
};

const sendWhatsAppMessage = async (
  message: string,
  config: WhatsAppConfig,
) => {
  const response = await fetch(
    `https://graph.facebook.com/v20.0/${config.phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: config.recipient,
        type: "text",
        text: {
          preview_url: false,
          body: message,
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `WhatsApp API error (${response.status}): ${response.statusText}${
        errorText ? ` - ${errorText}` : ""
      }`,
    );
  }
};

export async function POST(request: Request) {
  try {
    const emailConfigResult = createEmailConfig();

    if (!emailConfigResult.ok) {
      console.error(emailConfigResult.error);
      return NextResponse.json(
        { error: "Configuration d'envoi d'e-mails invalide." },
        { status: 500 },
      );
    }

    const whatsappConfigResult = createWhatsAppConfig();

    if (!whatsappConfigResult.ok) {
      console.error(whatsappConfigResult.error);
      return NextResponse.json(
        { error: "Configuration WhatsApp invalide." },
        { status: 500 },
      );
    }

    const { transporter, recipient: emailRecipient } = emailConfigResult.value;
    const whatsappConfig = whatsappConfigResult.value;

    const body = (await request.json()) as ContactPayload;

    const { data, errors } = sanitizeAndValidatePayload(body);

    if (!data) {
      return NextResponse.json(
        {
          error: "Les informations fournies sont invalides.",
          details: errors,
        },
        { status: 400 },
      );
    }

    const textContent = [
      "Nouvelle demande reçue depuis le formulaire Pro Alarme.",
      formatField("Type de bâtiment", data.buildingType),
      formatField("Localisation", data.location),
      formatField("Téléphone", data.phone),
      formatField("E-mail", data.email),
    ].join("\n");

    const htmlContent = `
      <h2>Nouvelle demande reçue depuis le site Pro Alarme</h2>
      <p>Voici les informations transmises :</p>
      <ul>
        <li><strong>Type de bâtiment :</strong> ${data.buildingType}</li>
        <li><strong>Localisation :</strong> ${data.location}</li>
        <li><strong>Téléphone :</strong> ${data.phone}</li>
        <li><strong>E-mail :</strong> ${data.email ?? "—"}</li>
      </ul>
    `;

    await Promise.all([
      transporter.sendMail({
        from: `Pro Alarme <${process.env.SMTP_USER}>`,
        to: emailRecipient,
        subject: "Nouvelle demande de formulaire Pro Alarme",
        text: textContent,
        html: htmlContent,
      }),
      sendWhatsAppMessage(textContent, whatsappConfig),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de l'envoi de la demande", error);
    return NextResponse.json(
      { error: "Impossible d'envoyer la demande actuellement." },
      { status: 500 },
    );
  }
}
