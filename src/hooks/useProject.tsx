import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ProjectContextType {
  projectId: string | null;
  project: any | null;
  role: "admin" | "manager" | "cashier" | null;
  loading: boolean;
  isAdminOrManager: boolean;
}

const ProjectContext = createContext<ProjectContextType>({
  projectId: null,
  project: null,
  role: null,
  loading: true,
  isAdminOrManager: false,
});

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [role, setRole] = useState<"admin" | "manager" | "cashier" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId || !user) {
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      setLoading(true);
      const [projectRes, memberRes] = await Promise.all([
        supabase.from("projects").select("*").eq("id", projectId).maybeSingle(),
        supabase.from("project_members").select("role").eq("project_id", projectId).eq("user_id", user.id).maybeSingle(),
      ]);

      setProject(projectRes.data);
      setRole(memberRes.data?.role as any || null);
      setLoading(false);
    };

    fetchProject();
  }, [projectId, user]);

  const isAdminOrManager = role === "admin" || role === "manager";

  return (
    <ProjectContext.Provider value={{ projectId: projectId || null, project, role, loading, isAdminOrManager }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
