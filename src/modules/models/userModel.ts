// src/modules/auth/userModel.ts
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

export const users: User[] = [];

// Функция для создания нового пользователя
export const createUser = async (username: string, email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = { id: uuidv4(), username, email, password: hashedPassword };
  users.push(newUser);
  return newUser;
};
