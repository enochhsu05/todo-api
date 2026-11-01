import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../config/database";

interface User {
  id: number;
  email: string;
  password_hash: string;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
}

export async function registerUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(normalizedEmail);

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const result = db
    .prepare(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)"
    )
    .run(normalizedEmail, passwordHash);

  return {
    id: Number(result.lastInsertRowid),
    email: normalizedEmail,
  };
}

export async function loginUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(normalizedEmail) as User | undefined;

  if (!user) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!passwordMatches) {
    return null;
  }

  const token = jwt.sign(
    { userId: user.id },
    getJwtSecret(),
    { expiresIn: "1h" }
  );

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    token,
  };
}