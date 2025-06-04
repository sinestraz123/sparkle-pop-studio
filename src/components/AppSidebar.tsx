
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, Settings, Megaphone, BarChart3, CheckSquare } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Announcements",
    url: "/builder",
    icon: Megaphone,
  },
  {
    title: "Surveys",
    url: "/surveys",
    icon: BarChart3,
  },
  {
    title: "Checklists",
    url: "/checklist",
    icon: CheckSquare,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const location = useLocation()
  const { signOut } = useAuth()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url || 
                             (item.url === "/builder" && location.pathname.startsWith("/builder")) ||
                             (item.url === "/surveys" && (location.pathname.startsWith("/surveys") || location.pathname.startsWith("/survey-builder"))) ||
                             (item.url === "/checklist" && location.pathname.startsWith("/checklist"))}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={signOut}
          >
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
