import { Router } from "express";
import { login, register } from "./auth.controller";
import { authenticateToken } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authenticateToken, (req, res) => {
  res.status(200).json({
    userId: req.user!.id,
  });
});

export default router;