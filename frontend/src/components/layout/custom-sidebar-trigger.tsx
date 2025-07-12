import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

const CustomSidebarTrigger = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const { toggleSidebar, state } = useSidebar();

  return (
    <div
      onClick={toggleSidebar}
      className={cn(
        "border  shadow-xs hover:bg-accent hover:text-accent-foreground  dark:border-input dark:hover:bg-input/50",
        className
      )}
      {...props}
    >
      {state === "expanded" ? (
        <ChevronsLeft className="w-5 h-5" />
      ) : (
        <ChevronsRight className="w-5 h-5" />
      )}
    </div>
  );
};

export default CustomSidebarTrigger;
