import express, { Request, Response } from "express";
import "dotenv/config";
import "./config/google";
import router from "./routes";
import cookieParser from "cookie-parser";
import { setupDatabase } from "../src/config/db";
import "../src/jobs/worker/uploadWorker";
import cors from "cors";

setupDatabase();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
