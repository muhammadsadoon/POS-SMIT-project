import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderTree,
  Receipt,
  Users,
  ArrowLeft,
  Store,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useProject } from "@/hooks/useProject";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function ProjectSidebar() {
  const { projectId, project, role, isAdminOrManager } = useProject();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  const menuItems = [
    { title: "Dashboard", url: `/project/${projectId}/dashboard`, icon: LayoutDashboard, show: isAdminOrManager },
    { title: "POS", url: `/project/${projectId}/pos`, icon: ShoppingCart, show: true },
    { title: "Products", url: `/project/${projectId}/products`, icon: Package, show: isAdminOrManager },
    { title: "Categories", url: `/project/${projectId}/categories`, icon: FolderTree, show: isAdminOrManager },
    { title: "Sales", url: `/project/${projectId}/sales`, icon: Receipt, show: true },
    { title: "Members", url: `/project/${projectId}/members`, icon: Users, show: isAdminOrManager },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="SalePOS" className="w-9 h-9 rounded-xl object-contain shrink-0" />
          {!collapsed && (
            <div className="min-w-0">
              <h2 className="font-bold text-sm text-sidebar-foreground tracking-tight truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {project?.name || "Project"}
              </h2>
              <p className="text-xs text-sidebar-foreground/60 capitalize">{role || "member"}</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 uppercase text-[10px] tracking-widest">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.filter(i => i.show).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all"
                      activeClassName="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/20"
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span className="font-medium">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-2">
        {!collapsed && <ThemeToggle className="w-full justify-start" />}
        <Button
          variant="ghost"
          onClick={() => navigate("/projects")}
          className="w-full justify-start gap-3 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <ArrowLeft className="w-5 h-5 shrink-0" />
          {!collapsed && <span>All Projects</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
