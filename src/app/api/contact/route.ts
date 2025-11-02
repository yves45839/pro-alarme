import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const REQUIRED_ENV_VARS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
];

let cachedTransporter: nodemailer.Transporter | null = null;
let transporterInitError: Error | null = null;

const initializeTransporter = () => {
  if (cachedTransporter || transporterInitError) {
    return {
      transporter: cachedTransporter,
      error: transporterInitError,
      recipient: cachedTransporter ? process.env.TO_EMAIL ?? process.env.SMTP_USER : undefined,
    } as const;
  }

  const missingEnvVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missingEnvVars.length > 0) {
    transporterInitError = new Error(
      `Missing required SMTP environment variables: ${missingEnvVars.join(", ")}`,
    );

    return { transporter: null, error: transporterInitError, recipient: undefined } as const;
  }

  const smtpPort = Number.parseInt(process.env.SMTP_PORT as string, 10);

  if (Number.isNaN(smtpPort)) {
    transporterInitError = new Error("SMTP_PORT must be a valid number");

    return { transporter: null, error: transporterInitError, recipient: undefined } as const;
  }

  const smtpSecure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE.toLowerCase() === "true"
    : smtpPort === 465;

  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return {
    transporter: cachedTransporter,
    error: null,
    recipient: process.env.TO_EMAIL ?? process.env.SMTP_USER,
  } as const;
};

const formatField = (label: string, value?: string) => {
  if (!value) {
    return `${label}: —`;
  }

  return `${label}: ${value}`;
};

export async function POST(request: Request) {
  const { transporter, error, recipient } = initializeTransporter();

  if (!transporter || !recipient) {
    console.error("SMTP configuration error", error);
    return NextResponse.json(
      { error: "Le service d'envoi d'e-mails est momentanément indisponible." },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();

    const { siteType, siteCount, location, phone, email, notes } = body as Record<
      string,
      string | undefined
    >;

    const textContent = [
      "Nouvelle demande reçue depuis le formulaire Pro Alarme.",
      formatField("Type de site", siteType),
      formatField("Nombre de sites", siteCount),
      formatField("Localisation", location),
      formatField("Téléphone", phone),
      formatField("E-mail", email),
      formatField("Notes", notes),
    ].join("\n");

    const htmlContent = `
      <h2>Nouvelle demande reçue depuis le site Pro Alarme</h2>
      <p>Voici les informations transmises :</p>
      <ul>
        <li><strong>Type de site :</strong> ${siteType || "—"}</li>
        <li><strong>Nombre de sites :</strong> ${siteCount || "—"}</li>
        <li><strong>Localisation :</strong> ${location || "—"}</li>
        <li><strong>Téléphone :</strong> ${phone || "—"}</li>
        <li><strong>E-mail :</strong> ${email || "—"}</li>
        <li><strong>Notes :</strong> ${notes || "—"}</li>
      </ul>
    `;

    await transporter.sendMail({
      from: `Pro Alarme <${process.env.SMTP_USER}>`,
      to: recipient,
      subject: "Nouvelle demande de formulaire Pro Alarme",
      text: textContent,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email", error);
    return NextResponse.json(
      { error: "Impossible d'envoyer l'email actuellement." },
      { status: 500 },
    );
  }
}
