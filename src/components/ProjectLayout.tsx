import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ProjectSidebar } from "@/components/ProjectSidebar";
import { ProjectProvider, useProject } from "@/hooks/useProject";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const ProjectInner = ({ children }: { children: ReactNode }) => {
  const { loading: projectLoading, role } = useProject();
  const { user, loading: authLoading } = useAuth();

  if (authLoading || projectLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!role) return <Navigate to="/projects" replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ProjectSidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b flex items-center px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger />
          </header>
          <div className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

const ProjectLayout = ({ children }: { children: ReactNode }) => (
  <ProjectProvider>
    <ProjectInner>{children}</ProjectInner>
  </ProjectProvider>
);

export default ProjectLayout;
