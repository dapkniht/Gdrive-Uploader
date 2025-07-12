import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { TokenPayload } from "../types/tokenPayload";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ loggedIn: false });
    return;
  }
  try {
    const decoded = verifyToken(token);
    req.user = decoded as TokenPayload;
    next();
  } catch {
    res.status(401).json({ loggedIn: false });
    return;
  }
};

export default authenticateToken;
