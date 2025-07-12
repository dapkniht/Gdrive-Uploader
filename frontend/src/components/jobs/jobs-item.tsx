import type { Job, JobStatus } from "@/types/job";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";

const JobsItem = ({ filename, progress, status, updated_at }: Job) => {
  const getColorStyle = (status: JobStatus) => {
    switch (status) {
      case "running":
        return "border-blue-500";
      case "pending":
        return "border-amber-500";
      case "success":
        return "border-green-500";
      case "failed":
        return "border-red-500";
      default:
        return "border-gray-300";
    }
  };

  const getStatusLabelColor = (status: JobStatus) => {
    switch (status) {
      case "running":
        return "bg-sky-100 text-sky-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "success":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  function formatReadableDate(isoString: string, locale = "id-ID") {
    const date = new Date(isoString);

    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }

  return (
    <div
      className={cn(
        "py-4 px-4 border-2 rounded-xl shadow-sm w-full overflow-hidden",
        getColorStyle(status)
      )}
    >
      <div className="space-y-3 w-full">
        <div className="flex justify-between items-center gap-2">
          <p className="font-semibold text-sm truncate w-4/5">{filename}</p>
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap shrink-0",
              getStatusLabelColor(status)
            )}
          >
            {status}
          </span>
        </div>

        <Progress
          value={parseInt(progress)}
          max={100}
          className="h-2 bg-muted"
        />

        <div className="flex justify-between items-center text-xs text-muted-foreground flex-wrap">
          <p>{progress}%</p>
          <p className="text-right truncate">
            {formatReadableDate(updated_at)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobsItem;
