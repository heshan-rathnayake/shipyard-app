import nodemailer from "nodemailer";
import { Resend } from "resend";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (process.env.NODE_ENV === "development") {
    // Dev: route through MailHog (localhost:1025, no auth needed)
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST ?? "localhost",
      port: Number(process.env.EMAIL_PORT ?? 1025),
      secure: false,
    });
    await transport.sendMail({
      from: process.env.EMAIL_FROM ?? "noreply@shipyard.dev",
      to,
      subject,
      html,
    });
  } else {
    // Prod: Resend API
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "noreply@shipyard.dev",
      to,
      subject,
      html,
    });
    if (error) throw new Error(`Resend error: ${error.message}`);
  }
}
