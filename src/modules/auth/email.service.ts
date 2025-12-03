import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  to: string,
  subject: string,
  text: string
) => {
  try {
    const response = await resend.emails.send({
      from: "Your App <no-reply@resend.dev>",
      to,
      subject,
      text,
    });

    console.log("Email sent:", response);
    return response;
  } catch (error: any) {
    console.error("Email send error:", error);
    throw new Error("Не удалось отправить email");
  }
};
