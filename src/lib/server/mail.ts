import nodemailer, { type Transporter } from 'nodemailer';
import { env } from '$env/dynamic/private';

let transporter: Transporter | null | undefined;

function getTransporter(): Transporter | null {
  if (transporter !== undefined) return transporter;
  if (!env.SMTP_HOST) {
    console.warn('[mail] SMTP_HOST is not set, alerts are only logged');
    return (transporter = null);
  }
  // Internal SMTP servers with a private CA: point NODE_EXTRA_CA_CERTS at the CA file.
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT ?? 25),
    secure: env.SMTP_SECURE === 'true',
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined
  });
  return transporter;
}

/** Sends an alert to ALERT_RECIPIENTS. Never throws, so callers in timers stay alive. */
export async function sendAlert(subject: string, text: string): Promise<void> {
  console.warn(`[alert] ${subject}`);
  const mailer = getTransporter();
  const recipients = env.ALERT_RECIPIENTS;
  if (!mailer || !recipients) return;

  try {
    await mailer.sendMail({
      from: env.MAIL_FROM ?? 'authlock@localhost',
      to: recipients,
      subject: `[AuthLock] ${subject}`,
      text
    });
  } catch (err) {
    console.error(`[mail] Failed to send alert "${subject}":`, err);
  }
}
