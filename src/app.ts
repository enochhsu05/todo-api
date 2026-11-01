import express from "express";
import authRoutes from "./modules/auth/auth.routes";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/test", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Todo API is running",
  });
});

export default app;