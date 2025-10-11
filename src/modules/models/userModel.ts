import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

interface User {
  id: string;
  username: string;
  password: string; // хеш
}

export const users: User[] = [];

export const createUser = async (username: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = { id: uuidv4(), username, password: hashedPassword };
  users.push(newUser);
  return newUser;
};
