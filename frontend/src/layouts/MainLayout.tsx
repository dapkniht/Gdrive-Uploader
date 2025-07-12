import { AppSidebar } from "@/components/layout/app-sidebar";
import Navbar from "@/components/layout/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";

const MainLayout = () => {
  return (
    <div className="w-full h-screen">
      <div className="grid-cols-4">
        <SidebarProvider>
          {/* left side */}
          {/* sidebar */}
          <div className="grid-cols-1">
            <AppSidebar />
          </div>

          {/* right side */}
          <div className="grid-cols-3 w-full  flex flex-col">
            {/* navbar */}
            <div className="bg-sidebar  border-b-sidebar-border">
              <Navbar />
            </div>

            {/* content */}
            <div className="py-4 px-3 flex-1 overflow-scroll ">
              <Outlet />
            </div>
          </div>
        </SidebarProvider>
      </div>
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
