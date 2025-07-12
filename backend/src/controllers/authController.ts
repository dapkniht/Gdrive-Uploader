import { Request, Response } from "express";
import {
  decryptToken,
  encryptToken,
  generateToken,
  verifyToken,
} from "../utils/jwt";
import { TokenPayload } from "../types/tokenPayload";

type authControllerType = {
  callback: (req: Request, res: Response) => void;
  saveToken: (req: Request, res: Response) => void;
  me: (req: Request, res: Response) => void;
  logout: (req: Request, res: Response) => void;
};

const authController: authControllerType = {
  callback: (req: Request, res: Response) => {
    const payload = req.user as TokenPayload;
    const token = generateToken(payload);
    const encrypted = encryptToken(token);

    res.redirect(
      `${process.env.FRONTEND}/auth/callback?token=${encodeURIComponent(
        encrypted
      )}`
    );
  },

  saveToken: (req: Request, res: Response) => {
    const { token: encryptedToken } = req.body;

    try {
      const token = decryptToken(encryptedToken);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24,
      });

      res.status(200).json({ message: "success" });
    } catch (err) {
      res.status(400).json({ error: "Invalid token" });
    }
  },

  me: (req: Request, res: Response) => {
    res.json({ loggedIn: true, user: req.user });
  },

  logout: (req: Request, res: Response) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.status(200).json({ message: "Logged out" });
  },
};

export default authController;
