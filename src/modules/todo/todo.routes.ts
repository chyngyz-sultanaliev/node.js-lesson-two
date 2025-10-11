import { Router } from "express";
import todoControllers from "./todo.controllers";
import { signin, signup } from "../auth/auth.controllers";
import { authMiddleware } from "../auth/auth.middleware";

const todoRoutes = Router();
todoRoutes.post("/signup", signup);
todoRoutes.post("/signin", signin);

todoRoutes.get("/list",  authMiddleware, todoControllers.getData);
todoRoutes.get("/list/search", authMiddleware,  todoControllers.searchData);
todoRoutes.get("/list/excel", authMiddleware,  todoControllers.downloadExcel);
todoRoutes.post("/list", authMiddleware,  todoControllers.addData);
todoRoutes.put("/list/:id", authMiddleware,  todoControllers.updateData);
todoRoutes.patch("/list/:id", authMiddleware,  todoControllers.updateData);
todoRoutes.delete("/list/:id", authMiddleware,  todoControllers.deleteData);
export default todoRoutes;
