import express from "express";
import uploadController from "../controllers/uploadController";

const uploadRouter = express.Router();
const { upload, progress } = uploadController;

uploadRouter.get(
  "/progress",

  progress
);

uploadRouter.post(
  "/",

  upload
);

export default uploadRouter;
