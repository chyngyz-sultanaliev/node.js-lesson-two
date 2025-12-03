// email.service.ts
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

// Используем named export
export const sendEmail = async ({ to, subject, text, html }: EmailOptions) => {
  const payload: any = {
    from: "onboarding@resend.dev",
    to,
    subject,
    text,
  };
  if (html) payload.html = html;

  return await resend.emails.send(payload);
};
