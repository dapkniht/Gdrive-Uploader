import express from "express";
import authController from "../controllers/authController";
import passport from "passport";
import authenticateToken from "../middlewares/authenticateToken";

const authRouter = express.Router();

const { callback, saveToken, me, logout } = authController;

authRouter.get(
  "/login",
  passport.authenticate("google", {
    scope: ["profile", "https://www.googleapis.com/auth/drive"],
    session: false,
    accessType: "offline",
    prompt: "consent",
  })
);
authRouter.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: false,
  }),
  callback
);
authRouter.post("/save-token", saveToken);
authRouter.get(
  "/me",

  authenticateToken,
  me
);
authRouter.get("/logout", logout);

export default authRouter;
