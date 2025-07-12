import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "../theme-provider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import CustomSidebarTrigger from "./custom-sidebar-trigger";
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { handleLogout, user } = useAuthContext();
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    switch (theme) {
      case "light":
        setTheme("dark");
        break;
      case "dark":
        setTheme("light");
        break;
      default:
        setTheme("system");
        break;
    }
  };

  const logoutAction = async () => {
    await handleLogout();
    navigate("/auth/login");
  };

  return (
    <div className="py-4 px-3 flex justify-between items-center">
      {/* sidebar trigger */}
      <CustomSidebarTrigger className="p-2 rounded-sm cursor-pointer" />

      <div className="flex gap-4 items-center">
        {/* profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={`${user!.picture}`} />
              <AvatarFallback>{user!.displayName[0]}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{user!.displayName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer"
              onClick={logoutAction}
            >
              <LogOut /> <p>Logout</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* dark mode toggle */}
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={toggleDarkMode}
        >
          {theme == "dark" ? <Moon /> : <Sun />}
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
