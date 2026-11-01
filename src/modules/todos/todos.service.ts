import db from "../../config/database";

interface CreateTodoInput {
  title: string;
  description?: string;
  category?: string;
  completed?: boolean;
}

export function createTodo(
  userId: number,
  input: CreateTodoInput
) {
  const result = db
    .prepare(`
      INSERT INTO todos (
        title,
        description,
        category,
        completed,
        user_id
      )
      VALUES (?, ?, ?, ?, ?)
    `)
    .run(
      input.title,
      input.description ?? null,
      input.category ?? null,
      input.completed ? 1 : 0,
      userId
    );

  const todo = db
    .prepare("SELECT * FROM todos WHERE id = ?")
    .get(result.lastInsertRowid);

  return todo;
}

interface GetTodosFilters {
  search?: string;
  category?: string;
  completed?: string;
}

export function getAllTodos(filters: GetTodosFilters) {
  let query = `
    SELECT
      id,
      title,
      description,
      category,
      completed,
      user_id,
      created_at,
      updated_at
    FROM todos
  `;

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (filters.search) {
    conditions.push("(title LIKE ? OR description LIKE ?)");
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm);
  }

  if (filters.category) {
    conditions.push("category = ?");
    params.push(filters.category);
  }

  if (filters.completed !== undefined) {
    conditions.push("completed = ?");
    params.push(filters.completed === "true" ? 1 : 0);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query += " ORDER BY created_at DESC";

  return db.prepare(query).all(...params);
}

interface UpdateTodoInput {
  title?: string;
  description?: string | null;
  category?: string | null;
  completed?: boolean;
}

export function updateTodo(
  todoId: number,
  userId: number,
  input: UpdateTodoInput
) {
  const fields: string[] = [];
  const params: (string | number | null)[] = [];

  if (input.title !== undefined) {
    fields.push("title = ?");
    params.push(input.title);
  }

  if (input.description !== undefined) {
    fields.push("description = ?");
    params.push(input.description);
  }

  if (input.category !== undefined) {
    fields.push("category = ?");
    params.push(input.category);
  }

  if (input.completed !== undefined) {
    fields.push("completed = ?");
    params.push(input.completed ? 1 : 0);
  }

  fields.push("updated_at = CURRENT_TIMESTAMP");

  params.push(todoId, userId);

  const result = db
    .prepare(`
      UPDATE todos
      SET ${fields.join(", ")}
      WHERE id = ? AND user_id = ?
    `)
    .run(...params);

  if (result.changes === 0) {
    return null;
  }

  return db
    .prepare("SELECT * FROM todos WHERE id = ?")
    .get(todoId);
}

export function deleteTodo(
  todoId: number,
  userId: number
): boolean {
  const result = db
    .prepare(`
      DELETE FROM todos
      WHERE id = ? AND user_id = ?
    `)
    .run(todoId, userId);

  return result.changes > 0;
}