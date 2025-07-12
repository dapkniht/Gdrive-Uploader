"use client";

import JobsFilterButton from "@/components/jobs/jobs-filter-button";
import JobsList from "@/components/jobs/jobs-list";
import { Button } from "@/components/ui/button";
import useEventSource from "@/hooks/useEventSource";
import type { JobsFilter } from "@/types/filter";
import type { JobStatus, SortedJobs } from "@/types/job";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

const Jobs = (): React.ReactNode => {
  const { jobs, error } = useEventSource("/api/upload/progress");
  const [jobsFilter, setJobsFilter] = useState<JobsFilter>({
    status: ["running", "pending", "success", "failed"],
  });

  const reloadPage = () => {
    window.location.reload();
  };

  const sortedJobs = useMemo(() => {
    return jobs.reduce<SortedJobs>(
      (sorted, job) => {
        if (job.status in sorted) {
          sorted[job.status as keyof typeof sorted].push(job);
        }
        return sorted;
      },
      {
        running: [],
        pending: [],
        success: [],
        failed: [],
      }
    );
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return Object.entries(sortedJobs).reduce<Partial<SortedJobs>>(
      (acc, [status, jobs]) => {
        if (
          jobsFilter.status.includes(status as JobStatus) &&
          sortedJobs[status as JobStatus].length > 0
        ) {
          acc[status as JobStatus] = jobs;
        }
        return acc;
      },
      {}
    );
  }, [sortedJobs, jobsFilter.status]);

  if (error) {
    toast.error("Failed to get Jobs Data");
    return (
      <div className="p-4 flex  flex-col items-center gap-5">
        <CircleAlert className="w-20 h-20 text-red-500" />
        <p className="font-bold text-2xl">Failed to get Jobs Data</p>
        <p className="max-w-xl text-center">
          an issue occurs when retrieving jobs data from the backend, reloading
          this page might solve the problem.
        </p>
        <Button className="cursor-pointer" onClick={reloadPage}>
          Reload Page
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {jobs.length === 0 ? (
        <div className="mt-20 flex flex-col items-center justify-center gap-3">
          <LoaderCircle className="w-16 h-16 animate-spin" />
          <p className="font-bold text-xl">Loading...</p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Upload Jobs</h1>
            <JobsFilterButton
              jobsFilter={jobsFilter}
              setJobsFilter={setJobsFilter}
            />
          </div>
          <JobsList filteredJobs={filteredJobs} />
        </div>
      )}
    </div>
  );
};

export default Jobs;
