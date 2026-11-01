import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  // Check whether the Authorization header exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      error: "Authentication required",
    });
    return;
  }

  // Extract the token
  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({
      error: "Authentication required",
    });
    return;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET is not configured");
    res.status(500).json({
      error: "Internal server error",
    });
    return;
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, secret);

    // Make sure the token contains a valid user ID
    if (
      typeof decoded === "string" ||
      typeof decoded.userId !== "number"
    ) {
      res.status(401).json({
        error: "Invalid token",
      });
      return;
    }

    // Attach the authenticated user's ID to the request
    req.user = {
      id: decoded.userId,
    };

    next();
  } catch {
    res.status(401).json({
      error: "Invalid or expired token",
    });
  }
}