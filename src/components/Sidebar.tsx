
import { Home, Users, Calendar, QrCode, Settings, LogOut, BookOpen, UserPlus } from "lucide-react";
import { Sidebar as SidebarComponent, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
  { title: "Dashboard", icon: Home, path: "/" },
  { title: "Users", icon: Users, path: "/users" },
  { title: "Attendance", icon: Calendar, path: "/attendance" },
  { title: "Student Credential Center", icon: QrCode, path: "/credentials" },
  { title: "Routine Management", icon: BookOpen, path: "/routine" },
  { title: "Student Registration", icon: UserPlus, path: "/registration" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

const Sidebar = () => {
  return (
    <SidebarComponent>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold">John Doe</span>
              <span className="text-sm text-gray-500">Super Admin</span>
            </div>
          </div>
        </div>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.path} className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <div className="mt-auto p-4 border-t">
          <button className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </SidebarComponent>
  );
};

export default Sidebar;
