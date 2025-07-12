import { type LucideProps } from "lucide-react";

export type NavigationItem = {
  title: string;
  path: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  element: () => React.ReactNode;
};
