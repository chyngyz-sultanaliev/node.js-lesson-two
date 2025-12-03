"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyResetCode = exports.requestResetPassword = exports.signin = exports.signup = exports.users = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = require("./nodemailer");
const auth_resetTokens_1 = require("./auth.resetTokens");
dotenv_1.default.config();
exports.users = [];
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
const requestResetPassword = async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ message: "Email обязателен" });
    const user = exports.users.find(u => u.email === email);
    if (!user)
        return res.status(404).json({ message: "Пользователь не найден" });
    const token = (0, uuid_1.v4)().slice(0, 6);
    const expires = Date.now() + 15 * 60 * 1000;
    auth_resetTokens_1.resetTokens.push({ token, userId: user.id, expires });
    await (0, nodemailer_1.sendEmail)(email, "Код для сброса пароля", `Ваш код: ${token}`);
    res.status(200).json({ message: "Код отправлен на email" });
};
exports.requestResetPassword = requestResetPassword;
// 2️⃣ Проверка кода
const verifyResetCode = (req, res) => {
    const { email, token } = req.body;
    if (!email || !token)
        return res.status(400).json({ message: "Email и код обязательны" });
    const user = exports.users.find(u => u.email === email);
    if (!user)
        return res.status(404).json({ message: "Пользователь не найден" });
    const stored = auth_resetTokens_1.resetTokens.find(rt => rt.userId === user.id && rt.token === token);
    if (!stored || stored.expires < Date.now())
        return res.status(400).json({ message: "Неверный или просроченный код" });
    res.status(200).json({ message: "Код верный" });
};
exports.verifyResetCode = verifyResetCode;
// 3️⃣ Сброс пароля
const resetPassword = async (req, res) => {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword)
        return res.status(400).json({ message: "Все поля обязательны" });
    const user = exports.users.find(u => u.email === email);
    if (!user)
        return res.status(404).json({ message: "Пользователь не найден" });
    const stored = auth_resetTokens_1.resetTokens.find(rt => rt.userId === user.id && rt.token === token);
    if (!stored || stored.expires < Date.now())
        return res.status(400).json({ message: "Неверный или просроченный код" });
    user.password = await bcryptjs_1.default.hash(newPassword, 10);
    const index = auth_resetTokens_1.resetTokens.findIndex(rt => rt.userId === user.id && rt.token === token);
    if (index !== -1)
        auth_resetTokens_1.resetTokens.splice(index, 1);
    res.status(200).json({ message: "Пароль успешно обновлён" });
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=auth.controllers.js.map