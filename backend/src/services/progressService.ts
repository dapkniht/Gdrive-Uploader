import { db } from "../config/db";
import redis from "../config/redis";

type JobProgressRow = {
  id: string;
  google_id: string;
  filename: string;
  progress: number;
  status: string;
  updated_at: string;
};

export const updateJobProgress = async (
  jobId: string,
  googleId: string,
  filename: string,
  progress: number,
  status: string
) => {
  const now = new Date().toISOString();

  // save to redis
  const redisKey = `job_progress:${googleId}:${jobId}`;
  await redis.hmset(redisKey, {
    id: jobId,
    google_id: googleId,
    filename,
    progress: progress.toString(),
    status,
    updated_at: now,
  });

  await redis.sadd(`job_progress_list:${googleId}`, redisKey);

  // save to sqlite
  db.prepare(
    `
    INSERT OR REPLACE INTO job_progress (id, google_id, filename, progress, status, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `
  ).run(jobId, googleId, filename, progress, status, now);
};

export const getJobProgressByGoogleId = async (googleId: string) => {
  const redisListKey = `job_progress_list:${googleId}`;
  const keys = await redis.smembers(redisListKey);
  const jobs: JobProgressRow[] = [];

  if (keys.length > 0) {
    for (const key of keys) {
      const job = await redis.hgetall(key);
      if (Object.keys(job).length > 0) {
        jobs.push({
          id: job.id,
          google_id: job.google_id,
          filename: job.filename,
          progress: Number(job.progress),
          status: job.status,
          updated_at: job.updated_at,
        });
      }
    }

    return jobs;
  }

  // get from sqlite
  const rows = db
    .prepare("SELECT * FROM job_progress WHERE google_id = ?")
    .all(googleId) as JobProgressRow[];

  for (const row of rows) {
    const redisKey = `job_progress:${googleId}:${row.id}`;
    await redis.hmset(redisKey, {
      id: row.id,
      google_id: row.google_id,
      filename: row.filename,
      progress: row.progress.toString(),
      status: row.status,
      updated_at: row.updated_at,
    });

    await redis.sadd(redisListKey, redisKey);
    jobs.push(row);
  }

  return jobs;
};
