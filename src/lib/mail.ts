import nodemailer from "nodemailer";

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendLeadNotificationEmail(payload: {
  to: string;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  estimateTnd?: number;
}): Promise<{ sent: boolean; reason?: string }> {
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
  const transport = getTransport();
  if (!transport || !from) {
    return { sent: false, reason: "SMTP not configured" };
  }

  const subject = `[EBM] Nouveau lead simulateur — ${payload.leadName}`;
  const text = [
    `Nom : ${payload.leadName}`,
    `Email : ${payload.leadEmail}`,
    `Téléphone : ${payload.leadPhone}`,
    payload.estimateTnd != null
      ? `Estimation indicative : ${payload.estimateTnd.toLocaleString("fr-TN")} TND`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  await transport.sendMail({
    from,
    to: payload.to,
    subject,
    text,
  });

  return { sent: true };
}
