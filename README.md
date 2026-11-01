# Todo API

A RESTful Todo API built with Node.js, Express, TypeScript, and SQLite.

## Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Create, read, update, and delete todos
- Public access to read todos
- Authenticated users can create todos
- Only todo owners can update or delete their todos
- Search and filter todos by title, description, category, and completion status
- Request validation with Zod
- SQLite database with foreign key constraints

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| TypeScript | Type safety |
| Express | HTTP server and routing |
| SQLite | Database |
| better-sqlite3 | SQLite database access |
| JWT | Authentication |
| bcrypt | Password hashing |
| Zod | Request validation |

## API Endpoints

Base URL: `http://localhost:3000`

### Authentication

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Not required |
| POST | `/api/auth/login` | Log in and receive a JWT | Not required |
| GET | `/api/auth/me` | Get the authenticated user's ID | Required |

### Todos

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/api/todos` | Retrieve all todos | Not required |
| POST | `/api/todos` | Create a todo | Required |
| PATCH | `/api/todos/:id` | Update a todo | Required, owner only |
| DELETE | `/api/todos/:id` | Delete a todo | Required, owner only |

## Example Requests

### Register a user

`POST /api/auth/register`

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

### Log in

`POST /api/auth/login`

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

### Create a todo

`POST /api/todos`

Requires authentication.

```json
{
  "title": "Complete backend assignment",
  "description": "Finish the Todo API",
  "category": "Work",
  "completed": false
}
```

### Retrieve todos

`GET /api/todos`

All todos are publicly readable.

### Search and filter todos

Search by title or description:

```text
GET /api/todos?search=assignment
```

Filter by category:

```text
GET /api/todos?category=Work
```

Filter by completion status:

```text
GET /api/todos?completed=false
```

Combine multiple filters:

```text
GET /api/todos?search=assignment&category=Work&completed=false
```

### Update a todo

`PATCH /api/todos/1`

Requires authentication and ownership.

```json
{
  "completed": true
}
```

### Delete a todo

`DELETE /api/todos/1`

Requires authentication and ownership.

## Error Handling

The API uses appropriate HTTP status codes, including:

| Status | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 400 | Invalid request or input |
| 401 | Authentication required or invalid |
| 404 | Resource not found or not owned by the user |
| 409 | Email already registered |
| 500 | Internal server error |

## Design Decisions

- SQLite: Chosen for simplicity and easy local setup without requiring a separate database server.
- Raw SQL: Used through `better-sqlite3` to keep database interactions explicit and straightforward.
- JWT: Provides stateless authentication for protected endpoints.
- Modular architecture: Separates routing, request handling, core logic, and validation to improve readability and maintainability.
- Ownership-based authorization: Ensures users can only modify or delete their own resources.