import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // Используйте 'service' вместо host/port
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Это ДОЛЖЕН быть App Password!
  },
  connectionTimeout: 10000, // 10 секунд
  greetingTimeout: 5000,
  socketTimeout: 10000,
});

// Проверка подключения при запуске
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP connection error:", error);
  } else {
    console.log("✅ SMTP server ready to send emails");
  }
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Ваше Приложение" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Ошибка при отправке email:", err);
    throw new Error("Не удалось отправить email");
  }
};