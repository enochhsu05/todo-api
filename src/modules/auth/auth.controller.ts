import { Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.schema";
import { loginUser, registerUser } from "./auth.service";

export async function register(req: Request, res: Response): Promise<void> {
  const validation = registerSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      error: "Invalid request",
      details: validation.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const user = await registerUser(
      validation.data.email,
      validation.data.password
    );

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      res.status(409).json({ error: "Email is already registered" });
      return;
    }

    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      error: "Invalid request",
      details: validation.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const result = await loginUser(
      validation.data.email,
      validation.data.password
    );

    if (!result) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}