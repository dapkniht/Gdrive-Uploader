export type Job = {
  id: string;
  filename: string;
  progress: string;
  status: JobStatus;
  updated_at: string;
};

export type SortedJobs = {
  running: Job[];
  pending: Job[];
  success: Job[];
  failed: Job[];
};

export type JobStatus = "running" | "pending" | "success" | "failed";
