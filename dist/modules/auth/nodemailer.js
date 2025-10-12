"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
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
    }
    else {
        console.log("✅ SMTP server ready to send emails");
    }
});
const sendEmail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: `"Ваше Приложение" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        });
        console.log("✅ Email sent:", info.messageId);
        return info;
    }
    catch (err) {
        console.error("❌ Ошибка при отправке email:", err);
        throw new Error("Не удалось отправить email");
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=nodemailer.js.map