import express from "express";
import authRouter from "./authRouter";
import authenticateToken from "../middlewares/authenticateToken";
import uploadRouter from "./uploadRouter";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/upload", authenticateToken, uploadRouter);

export default router;
