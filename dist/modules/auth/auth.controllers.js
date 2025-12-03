"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyResetCode = exports.requestResetPassword = exports.signin = exports.signup = exports.resetTokens = exports.users = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const email_service_1 = require("./email.service");
dotenv_1.default.config();
// ---------------- Временное хранилище ----------------
exports.users = [];
exports.resetTokens = [];
// ---------------- SIGNUP ----------------
const signup = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
        return res
            .status(400)
            .json({ message: "Username, email и пароль обязательны" });
    const existing = exports.users.find((u) => u.email === email);
    if (existing)
        return res
            .status(400)
            .json({ message: "Пользователь с таким email уже существует" });
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const newUser = {
        id: (0, uuid_1.v4)(),
        username,
        email,
        password: hashedPassword,
    };
    exports.users.push(newUser);
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET)
        return res.status(500).json({ message: "JWT_SECRET не задан" });
    const token = jsonwebtoken_1.default.sign({ id: newUser.id, email }, JWT_SECRET, {
        expiresIn: "1h",
    });
    res.status(201).json({ success: true, token });
};
exports.signup = signup;
// ---------------- SIGNIN ----------------
const signin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: "Email и пароль обязательны" });
    const user = exports.users.find((u) => u.email === email);
    if (!user)
        return res.status(404).json({ message: "Пользователь не найден" });
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        return res.status(400).json({ message: "Неверный пароль" });
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET)
        return res.status(500).json({ message: "JWT_SECRET не задан" });
    const token = jsonwebtoken_1.default.sign({ id: user.id, email }, JWT_SECRET, {
        expiresIn: "1h",
    });
    res.status(200).json({ success: true, token });
};
exports.signin = signin;
// ---------------- RESET PASSWORD ----------------
// 1️⃣ Запрос кода
const requestResetPassword = async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ message: "Email обязателен" });
    const user = exports.users.find(u => u.email === email);
    if (!user)
        return res.status(404).json({ message: "Пользователь не найден" });
    const token = (0, uuid_1.v4)().slice(0, 6); // 6-значный код
    const expires = Date.now() + 15 * 60 * 1000; // 15 минут
    exports.resetTokens.push({ token, userId: user.id, expires });
    const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f7;">
      <div style="max-width: 500px; margin: 0 auto; background: #fff; border-radius: 10px; padding: 30px;">
        <h2 style="text-align:center; color:#333;">Сброс пароля</h2>
        <p style="color:#555; font-size:15px;">Вы запросили сброс пароля. Используйте код ниже:</p>
        <div style="text-align:center; margin:20px 0;">
          <span style="font-size:28px; font-weight:bold; letter-spacing:6px; background:#f0f0f0; padding:15px 25px; border-radius:8px;">${token}</span>
        </div>
        <p style="color:#555; font-size:14px;">Код действителен <strong>15 минут</strong>.<br>Если вы не запрашивали сброс пароля — проигнорируйте письмо.</p>
        <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />
        <p style="color:#888; font-size:12px; text-align:center;">Это письмо отправлено автоматически. Не отвечайте на него.</p>
      </div>
    </div>
  `;
    await (0, email_service_1.sendEmail)({
        to: email,
        subject: "Код для сброса пароля",
        text: `Ваш код: ${token}`,
        html,
    });
    res.status(200).json({ message: "Код отправлен на email" });
};
exports.requestResetPassword = requestResetPassword;
// ---------------- Проверка кода ----------------
const verifyResetCode = (req, res) => {
    const { email, token } = req.body;
    if (!email || !token)
        return res.status(400).json({ message: "Email и код обязательны" });
    const user = exports.users.find(u => u.email === email);
    if (!user)
        return res.status(404).json({ message: "Пользователь не найден" });
    const stored = exports.resetTokens.find(rt => rt.userId === user.id && rt.token === token);
    if (!stored || stored.expires < Date.now())
        return res.status(400).json({ message: "Неверный или просроченный код" });
    res.status(200).json({ message: "Код верный" });
};
exports.verifyResetCode = verifyResetCode;
// ---------------- Сброс пароля ----------------
const resetPassword = async (req, res) => {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword)
        return res.status(400).json({ message: "Все поля обязательны" });
    const user = exports.users.find(u => u.email === email);
    if (!user)
        return res.status(404).json({ message: "Пользователь не найден" });
    const stored = exports.resetTokens.find(rt => rt.userId === user.id && rt.token === token);
    if (!stored || stored.expires < Date.now())
        return res.status(400).json({ message: "Неверный или просроченный код" });
    user.password = await bcryptjs_1.default.hash(newPassword, 10);
    // Удаляем использованный токен
    const index = exports.resetTokens.findIndex(rt => rt.userId === user.id && rt.token === token);
    if (index !== -1)
        exports.resetTokens.splice(index, 1);
    res.status(200).json({ message: "Пароль успешно обновлён" });
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=auth.controllers.js.map