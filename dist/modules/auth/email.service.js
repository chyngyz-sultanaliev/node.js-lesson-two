"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const resend_1 = require("resend");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const sendEmail = async (to, subject, text) => {
    try {
        const response = await resend.emails.send({
            from: "Your App <no-reply@resend.dev>",
            to,
            subject,
            text,
        });
        console.log("Email sent:", response);
        return response;
    }
    catch (error) {
        console.error("Email send error:", error);
        throw new Error("Не удалось отправить email");
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=email.service.js.map