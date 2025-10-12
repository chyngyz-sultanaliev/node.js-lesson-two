"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.users = void 0;
// src/modules/auth/userModel.ts
const uuid_1 = require("uuid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.users = [];
// Функция для создания нового пользователя
const createUser = async (username, email, password) => {
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const newUser = { id: (0, uuid_1.v4)(), username, email, password: hashedPassword };
    exports.users.push(newUser);
    return newUser;
};
exports.createUser = createUser;
//# sourceMappingURL=userModel.js.map