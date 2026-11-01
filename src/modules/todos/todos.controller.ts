import { Request, Response } from "express";
import { createTodoSchema, getTodosSchema, updateTodoSchema } from "./todos.schema";
import { createTodo, getAllTodos, updateTodo } from "./todos.service";

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

export function updateTodoController(
  req: Request,
  res: Response
): void {
  const validation = updateTodoSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      error: "Invalid request",
      details: validation.error.flatten().fieldErrors,
    });
    return;
  }

  const todoId = Number(req.params.id);

  if (!Number.isInteger(todoId) || todoId <= 0) {
    res.status(400).json({
      error: "Invalid todo ID",
    });
    return;
  }

  try {
    const todo = updateTodo(
      todoId,
      req.user!.id,
      validation.data
    );

    if (!todo) {
      res.status(404).json({
        error: "Todo not found",
      });
      return;
    }

    res.status(200).json({
      message: "Todo updated successfully",
      todo,
    });
  } catch (error) {
    console.error("Todo update error:", error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
}