import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().max(1000).optional(),
  category: z.string().max(100).optional(),
  completed: z.boolean().optional(),
});

export const getTodosSchema = z.object({
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  completed: z.enum(["true", "false"]).optional(),
});

export const updateTodoSchema = z
  .object({
    title: z.string().trim().min(1).max(255).optional(),
    description: z.string().max(1000).nullable().optional(),
    category: z.string().max(100).nullable().optional(),
    completed: z.boolean().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided",
    }
  );