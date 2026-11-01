import { Router } from "express";
import { authenticateToken } from "../../middleware/auth.middleware";
import {createTodoController, getAllTodosController} from "./todos.controller";

const router = Router();

router.post("/", authenticateToken, createTodoController);
router.get("/", getAllTodosController);

export default router;