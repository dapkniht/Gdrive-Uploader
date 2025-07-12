import { db } from "../../config/db";
import redisConnection from "../../config/redis";
import { Worker, Job } from "bullmq";
import { uploadFromUrlToDrive } from "../../services/driveService";
import { updateJobProgress } from "../../services/progressService";

export const uploadWorker = new Worker(
  "upload",
  async (job) => {
    try {
      const { googleId, filename, url, accessToken, refreshToken } = job.data;

      // Status: running
      updateJobProgress(job.id as string, googleId, filename, 0, "running");

      await uploadFromUrlToDrive(
        url,
        filename,
        accessToken,
        refreshToken,
        (progress: number) => {
          updateJobProgress(
            job.id as string,
            googleId,
            filename,
            progress,
            "running"
          );
          job.updateProgress(progress);
        }
      );

      // Status: success
      updateJobProgress(job.id as string, googleId, filename, 100, "success");

      return "Upload complete";
    } catch (error) {
      throw error;
    }
  },
  { connection: redisConnection }
);

// Completed job event
uploadWorker.on("completed", (job: Job, returnvalue: any) => {
  const { googleId } = job.data;
  const successMessage = {
    id: job.id,
    google_id: googleId,
    status: "completed",
    message: returnvalue,
  };
});

// Failed job event
uploadWorker.on("failed", (job: Job | undefined, error: Error) => {
  if (!job) {
    console.error("Failed job is undefined:", error);
    return;
  }

  const { filename, googleId } = job.data;
  const numericProgress = typeof job.progress === "number" ? job.progress : 0;
  updateJobProgress(
    job.id as string,
    googleId,
    filename,
    numericProgress,
    "failed"
  );
  const failedMessage = {
    id: job.id,
    google_id: googleId,
    status: "failed",
    message: error.message,
  };
});

// Progress job event
uploadWorker.on("progress", (job: Job, progress: any) => {
  const { googleId } = job.data;
  const progressMessage = {
    id: job.id,
    google_id: googleId,
    status: "progress",
    message: `${progress}%`,
  };
});
