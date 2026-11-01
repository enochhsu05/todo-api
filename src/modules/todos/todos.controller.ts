import { Request, Response } from "express";
import { createTodo } from "./todos.service";
import { getAllTodos } from "./todos.service";
import { createTodoSchema, getTodosSchema } from "./todos.schema";

export function createTodoController(
  req: Request,
  res: Response
): void {
  const validation = createTodoSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      error: "Invalid request",
      details: validation.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const todo = createTodo(req.user!.id, validation.data);

    res.status(201).json({
      message: "Todo created successfully",
      todo,
    });
  } catch (error) {
    console.error("Todo creation error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}

export function getAllTodosController(
  req: Request,
  res: Response
): void {
  const validation = getTodosSchema.safeParse(req.query);

  if (!validation.success) {
    res.status(400).json({
      error: "Invalid query parameters",
      details: validation.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const todos = getAllTodos(validation.data);

    res.status(200).json({
      count: todos.length,
      todos,
    });
  } catch (error) {
    console.error("Fetching todos error:", error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
}