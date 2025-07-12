import { Request, Response } from "express";
import uploadQueue from "../jobs/queue/uploadQueue";
import path from "path";
import fetch from "node-fetch";
import { TokenPayload } from "../types/tokenPayload";
import {
  getJobProgressByGoogleId,
  updateJobProgress,
} from "../services/progressService";
import { getDriveStorageQuota } from "../services/driveService";

type uploadControllerType = {
  upload: (req: Request, res: Response) => void;
  progress: (req: Request, res: Response) => void;
};

const uploadController: uploadControllerType = {
  upload: async (req: Request, res: Response) => {
    if (!req.body || !req.body.url) {
      res.status(400).json({ message: "url is required in request body" });
      return;
    }

    const url = req.body.url;
    const { accessToken, refreshToken, googleId } = req.user as TokenPayload;

    try {
      // Fetch URL to check if it's accessible and get content-length
      const controller = new AbortController();
      const signal = controller.signal;
      const response = await fetch(url, { signal });
      if (!response.ok || !response.headers.get("content-length")) {
        controller.abort();
        res
          .status(400)
          .json({ message: "URL is not accessible or size unknown" });
        return;
      }

      const contentLength = parseInt(
        response.headers.get("content-length") || "0",
        10
      );
      if (isNaN(contentLength) || contentLength <= 0) {
        controller.abort();
        res.status(400).json({ message: "Invalid content length from URL" });
        return;
      }

      controller.abort();

      //Get Google Drive quota
      const { free } = await getDriveStorageQuota(accessToken, refreshToken);

      //Compare if there's enough space
      if (contentLength > free) {
        res.status(400).json({
          message: "Insufficient Google Drive storage for this file",
          fileSize: contentLength,
          freeSpace: free,
        });
        return;
      }

      // Proceed to queue the upload job
      const filename = path.basename(new URL(url).pathname);

      const job = await uploadQueue.add(
        "upload",
        {
          googleId,
          url,
          filename,
          accessToken,
          refreshToken,
        },
        {
          removeOnComplete: true,
          removeOnFail: true,
        }
      );

      updateJobProgress(job.id as string, googleId, filename, 0, "pending");

      res
        .status(200)
        .json({ message: "Upload started", jobId: job.id, file: url });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(400).json({ message: "Failed to upload file" });
    }
  },

  progress: async (req: Request, res: Response) => {
    const { googleId } = req.user as TokenPayload;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.flushHeaders();

    res.write("event: ping\ndata: connected\n\n");

    const interval = setInterval(async () => {
      try {
        const progress = await getJobProgressByGoogleId(googleId);
        res.write(`data: ${JSON.stringify(progress)}\n\n`);
      } catch (error) {
        res.write(
          `data: ${JSON.stringify({
            message: "Failed to get progress",
          })}\n\n`
        );
      }
    }, 5000);

    req.on("close", () => {
      clearInterval(interval);
      res.end();
    });
  },
};

export default uploadController;
