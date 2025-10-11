import { Router } from "express";
import todoRoutes from "../modules/todo/todo.routes";

const globalRoutes = Router();

globalRoutes.use("/todo", todoRoutes);

export default globalRoutes;
