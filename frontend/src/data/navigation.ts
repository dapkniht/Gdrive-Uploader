import Jobs from "@/pages/Jobs";
import Uploader from "@/pages/Uploader";
import type { NavigationItem } from "@/types/navigation";
import { Upload, Workflow } from "lucide-react";

const navigationItems: NavigationItem[] = [
  {
    title: "Uploader",
    path: "upload",
    icon: Upload,
    element: Uploader,
  },
  {
    title: "Jobs",
    path: "jobs",
    icon: Workflow,
    element: Jobs,
  },
];

export default navigationItems;
