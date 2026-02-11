import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Store, Users, ArrowRight, AlertCircle } from "lucide-react";

const Projects = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [memberProjects, setMemberProjects] = useState<any[]>([]);
  const [limit, setLimit] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    const [ownedRes, memberRes, limitRes] = await Promise.all([
      supabase.from("projects").select("*").eq("owner_id", user.id).order("created_at", { ascending: false }),
      supabase.from("project_members").select("project_id, role, projects(*)").eq("user_id", user.id),
      supabase.from("user_project_limits").select("max_projects").eq("user_id", user.id).maybeSingle(),
    ]);

    setProjects(ownedRes.data || []);
    setLimit(limitRes.data?.max_projects || 0);

    // Filter member projects (not owned)
    const owned = new Set((ownedRes.data || []).map((p: any) => p.id));
    const members = (memberRes.data || [])
      .filter((m: any) => !owned.has(m.project_id) && m.projects)
      .map((m: any) => ({ ...m.projects, memberRole: m.role }));
    setMemberProjects(members);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [user]);

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { data, error } = await supabase
      .from("projects")
      .insert({ name: name.trim(), description: description.trim() || null, owner_id: user.id })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message.includes("count") ? "Project limit reached!" : error.message, variant: "destructive" });
      return;
    }

    // Add owner as admin member
    await supabase.from("project_members").insert({ project_id: data.id, user_id: user.id, role: "admin" });

    toast({ title: "Project created!" });
    setOpen(false);
    setName("");
    setDescription("");
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
          <p className="text-muted-foreground mt-1">
            {limit > 0 ? `${projects.length} / ${limit} projects used` : "Request admin access to create projects"}
          </p>
        </div>
        {limit > 0 && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" disabled={projects.length >= limit}>
                <Plus className="w-4 h-4" /> New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <form onSubmit={createProject} className="space-y-4">
                <div className="space-y-2">
                  <Label>Store Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="My Store" required maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" maxLength={255} />
                </div>
                <Button type="submit" className="w-full">Create Project</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {limit === 0 && (
        <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
          <CardContent className="flex items-center gap-4 p-6">
            <AlertCircle className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h3 className="font-semibold">Admin Access Required</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Go to Settings and request admin activation to create projects.
              </p>
              <Button variant="link" className="p-0 h-auto mt-2" onClick={() => navigate("/settings")}>
                Go to Settings →
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Owned Projects */}
      {projects.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Your Projects</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Card
                key={p.id}
                className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => navigate(`/project/${p.id}/dashboard`)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Store className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{p.name}</h3>
                        {p.description && <p className="text-sm text-muted-foreground mt-0.5">{p.description}</p>}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Member Projects */}
      {memberProjects.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Shared With Me</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {memberProjects.map((p: any) => (
              <Card
                key={p.id}
                className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => navigate(`/project/${p.id}/${p.memberRole === "cashier" ? "pos" : "dashboard"}`)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                        <Users className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{p.name}</h3>
                        <p className="text-xs text-muted-foreground capitalize mt-0.5">{p.memberRole}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {projects.length === 0 && memberProjects.length === 0 && limit > 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Store className="w-12 h-12 mb-4 opacity-50" />
            <p>No projects yet. Create your first project!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Projects;
