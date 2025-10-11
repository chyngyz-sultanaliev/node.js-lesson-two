import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { users } from "./../models/userModel";
import { v4 as uuidv4 } from "uuid";

export const signup = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username и пароль обязательны" });

  const existing = users.find((u) => u.username === username);
  if (existing)
    return res.status(400).json({ message: "Пользователь уже существует" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: uuidv4(), username, password: hashedPassword };
  users.push(newUser);

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET не задан в .env");

  const token = jwt.sign({ id: newUser.id, username }, secret, { expiresIn: "1h" });
  res.status(201).json({ success: true, token });
};

export const signin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) return res.status(404).json({ message: "Пользователь не найден" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Неверный пароль" });

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET не задан в .env");

  const token = jwt.sign({ id: user.id, username }, secret, { expiresIn: "1h" });
  res.status(200).json({ success: true, token });
};
