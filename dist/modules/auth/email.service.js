"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
// email.service.ts
const resend_1 = require("resend");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
// Используем named export
const sendEmail = async ({ to, subject, text, html }) => {
    const payload = {
        from: "onboarding@resend.dev",
        to,
        subject,
        text,
    };
    if (html)
        payload.html = html;
    return await resend.emails.send(payload);
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=email.service.js.map