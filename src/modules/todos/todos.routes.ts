import { Router } from "express";
import { authenticateToken } from "../../middleware/auth.middleware";
import {createTodoController, getAllTodosController, updateTodoController } from "./todos.controller";

const router = Router();

router.post("/", authenticateToken, createTodoController);
router.get("/", getAllTodosController);
router.patch("/:id", authenticateToken, updateTodoController);

export default router;