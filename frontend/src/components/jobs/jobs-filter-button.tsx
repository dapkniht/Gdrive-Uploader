import type { JobsFilter } from "@/types/filter";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ListFilter } from "lucide-react";
import type { JobStatus } from "@/types/job";

type JobsFilterButtonProps = {
  jobsFilter: JobsFilter;
  setJobsFilter: React.Dispatch<React.SetStateAction<JobsFilter>>;
};

const JobsFilterButton = ({
  jobsFilter,
  setJobsFilter,
}: JobsFilterButtonProps) => {
  const isFilterActive = (status: JobStatus) => {
    return jobsFilter.status.includes(status);
  };

  const toggleFilter = (status: JobStatus, checked: boolean) => {
    setJobsFilter((prev) => ({
      ...prev,
      status: checked
        ? [...prev.status, status]
        : prev.status.filter((s) => s !== status),
    }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <ListFilter />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Status Filter</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={isFilterActive("running")}
          onCheckedChange={(checked) => toggleFilter("running", checked)}
        >
          Running
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={isFilterActive("pending")}
          onCheckedChange={(checked) => toggleFilter("pending", checked)}
        >
          Pending
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={isFilterActive("success")}
          onCheckedChange={(checked) => toggleFilter("success", checked)}
        >
          Success
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={isFilterActive("failed")}
          onCheckedChange={(checked) => toggleFilter("failed", checked)}
        >
          Failed
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default JobsFilterButton;
