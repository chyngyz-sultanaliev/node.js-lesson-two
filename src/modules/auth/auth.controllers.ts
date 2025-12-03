import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { sendEmail } from "./nodemailer";
import { resetTokens } from "./auth.resetTokens";

dotenv.config();

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

export const users: User[] = [];

// ---------------- SIGNUP ----------------
export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res
      .status(400)
      .json({ message: "Username, email и пароль обязательны" });

  const existing = users.find((u) => u.email === email);
  if (existing)
    return res
      .status(400)
      .json({ message: "Пользователь с таким email уже существует" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: uuidv4(),
    username,
    email,
    password: hashedPassword,
  };
  users.push(newUser);

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET)
    return res.status(500).json({ message: "JWT_SECRET не задан" });

  const token = jwt.sign({ id: newUser.id, email }, JWT_SECRET, {
    expiresIn: "1h",
  });
  res.status(201).json({ success: true, token });
};

// ---------------- SIGNIN ----------------
export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email и пароль обязательны" });

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(404).json({ message: "Пользователь не найден" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Неверный пароль" });

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET)
    return res.status(500).json({ message: "JWT_SECRET не задан" });

  const token = jwt.sign({ id: user.id, email }, JWT_SECRET, {
    expiresIn: "1h",
  });
  res.status(200).json({ success: true, token });
};

export const requestResetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email обязателен" });

  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ message: "Пользователь не найден" });

  const token = uuidv4().slice(0, 6);
  const expires = Date.now() + 15 * 60 * 1000;

  resetTokens.push({ token, userId: user.id, expires });

  await sendEmail(email, "Код для сброса пароля", `Ваш код: ${token}`);

  res.status(200).json({ message: "Код отправлен на email" });
};


// 2️⃣ Проверка кода
export const verifyResetCode = (req: Request, res: Response) => {
  const { email, token } = req.body;

  if (!email || !token)
    return res.status(400).json({ message: "Email и код обязательны" });

  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ message: "Пользователь не найден" });

  const stored = resetTokens.find(
    rt => rt.userId === user.id && rt.token === token
  );

  if (!stored || stored.expires < Date.now())
    return res.status(400).json({ message: "Неверный или просроченный код" });

  res.status(200).json({ message: "Код верный" });
};


// 3️⃣ Сброс пароля
export const resetPassword = async (req: Request, res: Response) => {
  const { email, token, newPassword } = req.body;
  if (!email || !token || !newPassword)
    return res.status(400).json({ message: "Все поля обязательны" });

  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ message: "Пользователь не найден" });

  const stored = resetTokens.find(
    rt => rt.userId === user.id && rt.token === token
  );

  if (!stored || stored.expires < Date.now())
    return res.status(400).json({ message: "Неверный или просроченный код" });

  user.password = await bcrypt.hash(newPassword, 10);

  const index = resetTokens.findIndex(
    rt => rt.userId === user.id && rt.token === token
  );
  if (index !== -1) resetTokens.splice(index, 1);

  res.status(200).json({ message: "Пароль успешно обновлён" });
};
