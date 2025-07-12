import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import navigationItems from "@/data/navigation";
import { Link, useLocation } from "react-router";

export function AppSidebar() {
  const { pathname } = useLocation();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-5 px-3 overflow-hidden flex items-center justify-center relative border-b mb-2">
        {/* Logo text when expanded */}
        <div className="text-lg font-bold group-data-[state=collapsed]:hidden">
          Gdrive Uploader
        </div>

        {/* Avatar/icon when collapsed */}
        <div className="hidden group-data-[state=collapsed]:flex items-center justify-center w-10 h-10 rounded-full border-2  text-sm font-semibold ">
          G
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent className="space-y-3 ">
              {navigationItems.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="py-5 px-3 mx-auto"
                      isActive={pathname === item.path}
                    >
                      <Link to={item.path}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
