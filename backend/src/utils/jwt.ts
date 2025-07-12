import { TokenPayload } from "../types/tokenPayload";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";

const jwtSecretKey = process.env.JWT_SECRET!;
const tokenEncryptSecret = process.env.TOKEN_ENCRYPT_SECRET!;

export const generateToken = (payload: TokenPayload): string => {
  const token = jwt.sign(payload, jwtSecretKey, {
    expiresIn: "24h",
  });

  return token;
};

export const verifyToken = (token: string): jwt.JwtPayload | string => {
  const decoded = jwt.verify(token, jwtSecretKey);
  return decoded;
};

export function encryptToken(token: string): string {
  return CryptoJS.AES.encrypt(token, tokenEncryptSecret).toString();
}

export function decryptToken(encrypted: string): string {
  const bytes = CryptoJS.AES.decrypt(encrypted, tokenEncryptSecret);
  return bytes.toString(CryptoJS.enc.Utf8);
}
