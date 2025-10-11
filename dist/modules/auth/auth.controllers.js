"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = require("./../models/userModel");
const uuid_1 = require("uuid");
const signup = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ message: "Username и пароль обязательны" });
    const existing = userModel_1.users.find((u) => u.username === username);
    if (existing)
        return res.status(400).json({ message: "Пользователь уже существует" });
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const newUser = { id: (0, uuid_1.v4)(), username, password: hashedPassword };
    userModel_1.users.push(newUser);
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new Error("JWT_SECRET не задан в .env");
    const token = jsonwebtoken_1.default.sign({ id: newUser.id, username }, secret, { expiresIn: "1h" });
    res.status(201).json({ success: true, token });
};
exports.signup = signup;
const signin = async (req, res) => {
    const { username, password } = req.body;
    const user = userModel_1.users.find((u) => u.username === username);
    if (!user)
        return res.status(404).json({ message: "Пользователь не найден" });
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        return res.status(400).json({ message: "Неверный пароль" });
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new Error("JWT_SECRET не задан в .env");
    const token = jsonwebtoken_1.default.sign({ id: user.id, username }, secret, { expiresIn: "1h" });
    res.status(200).json({ success: true, token });
};
exports.signin = signin;
//# sourceMappingURL=auth.controllers.js.map