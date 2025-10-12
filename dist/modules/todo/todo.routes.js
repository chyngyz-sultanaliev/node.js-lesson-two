"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todo_controllers_1 = __importDefault(require("./todo.controllers"));
const auth_controllers_1 = require("../auth/auth.controllers");
const auth_middleware_1 = require("../auth/auth.middleware");
const todoRoutes = (0, express_1.Router)();
todoRoutes.post("/signup", auth_controllers_1.signup);
todoRoutes.post("/signin", auth_controllers_1.signin);
todoRoutes.post("/request-reset-password", auth_controllers_1.requestResetPassword);
todoRoutes.post("/verify-reset-code", auth_controllers_1.verifyResetCode);
todoRoutes.post("/reset-password", auth_controllers_1.resetPassword);
todoRoutes.get("/list", auth_middleware_1.authMiddleware, todo_controllers_1.default.getData);
todoRoutes.get("/list/search", auth_middleware_1.authMiddleware, todo_controllers_1.default.searchData);
todoRoutes.get("/list/excel", auth_middleware_1.authMiddleware, todo_controllers_1.default.downloadExcel);
todoRoutes.post("/list", auth_middleware_1.authMiddleware, todo_controllers_1.default.addData);
todoRoutes.put("/list/:id", auth_middleware_1.authMiddleware, todo_controllers_1.default.updateData);
todoRoutes.patch("/list/:id", auth_middleware_1.authMiddleware, todo_controllers_1.default.updateData);
todoRoutes.delete("/list/:id", auth_middleware_1.authMiddleware, todo_controllers_1.default.deleteData);
exports.default = todoRoutes;
//# sourceMappingURL=todo.routes.js.map