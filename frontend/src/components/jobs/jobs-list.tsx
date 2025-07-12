import type { JobStatus, SortedJobs } from "@/types/job";
import { cn } from "@/lib/utils";
import JobsItem from "./jobs-item";

type JobsListProps = {
  filteredJobs: Partial<SortedJobs>;
};

const JobsList = ({ filteredJobs }: JobsListProps) => {
  const getColorStyle = (status: JobStatus) => {
    switch (status) {
      case "running":
        return "text-sky-500";
      case "pending":
        return "text-amber-500";
      case "success":
        return "text-green-500";
      case "failed":
        return "text-red-500";
      default:
        break;
    }
  };

  return (
    <div>
      {Object.entries(filteredJobs).map(([status, jobs]) => (
        <div key={status} className="space-y-3 mb-6">
          <h2
            className={cn(
              "text-xl font-semibold capitalize",
              getColorStyle(status as JobStatus)
            )}
          >
            {status}
          </h2>
          <hr className="border" />
          {jobs.map((job) => {
            return <JobsItem {...job} />;
          })}
        </div>
      ))}
    </div>
  );
};

export default JobsList;
