import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Shield, Clock, CheckCircle, XCircle, Send } from "lucide-react";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [request, setRequest] = useState<any>(null);
  const [limit, setLimit] = useState<number>(0);
  const [isCompanyAdmin, setIsCompanyAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasAnyAdmin, setHasAnyAdmin] = useState(true);
  const [settingUp, setSettingUp] = useState(false);
  const [showAdminConfirm, setShowAdminConfirm] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [reqRes, limRes, caRes, allAdminsRes] = await Promise.all([
        supabase.from("admin_requests").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("user_project_limits").select("max_projects").eq("user_id", user.id).maybeSingle(),
        supabase.from("company_admins").select("id").eq("user_id", user.id).maybeSingle(),
        supabase.from("company_admins").select("id").limit(1),
      ]);
      setRequest(reqRes.data);
      setLimit(limRes.data?.max_projects || 0);
      setIsCompanyAdmin(!!caRes.data);
      // If user is not admin and query returned empty (no admins exist or RLS blocks), check via count
      setHasAnyAdmin(!!caRes.data || (allAdminsRes.data && allAdminsRes.data.length > 0) || false);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const setupCompanyAdmin = async () => {
    setSettingUp(true);
    try {
      const { error } = await supabase.rpc("become_company_admin");
      if (error) throw error;
      toast({ title: "Success!", description: "Aap ab Company Admin hain. Company Panel access kar sakte hain." });
      setShowAdminConfirm(false);
      const { data: caRes } = await supabase.from("company_admins").select("id").eq("user_id", user!.id).maybeSingle();
      setIsCompanyAdmin(!!caRes);
      setHasAnyAdmin(true);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setSettingUp(false);
  };

  const submitRequest = async () => {
    if (!user) return;
    setSubmitting(true);
    const { error } = await supabase.from("admin_requests").insert({
      user_id: user.id,
      full_name: user.user_metadata?.full_name || "",
      email: user.email || "",
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Request submitted!", description: "Company admin will review your request." });
      const { data } = await supabase.from("admin_requests").select("*").eq("user_id", user.id).maybeSingle();
      setRequest(data);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
    pending: { icon: Clock, color: "text-yellow-500", label: "Pending Review" },
    approved: { icon: CheckCircle, color: "text-green-500", label: "Approved" },
    rejected: { icon: XCircle, color: "text-destructive", label: "Rejected" },
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and admin access</p>
      </div>


      {!isCompanyAdmin && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Admin Activation
            </CardTitle>
            <CardDescription>
              Request admin access to create and manage store projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {limit > 0 && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <CheckCircle className="w-5 h-5" />
                  Active Admin
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  You can create up to <strong>{limit}</strong> projects.
                </p>
              </div>
            )}

            {request ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  {(() => {
                    const cfg = statusConfig[request.status] || statusConfig.pending;
                    const Icon = cfg.icon;
                    return (
                      <Badge variant="outline" className={`gap-1 ${cfg.color}`}>
                        <Icon className="w-3 h-3" /> {cfg.label}
                      </Badge>
                    );
                  })()}
                </div>
                {request.status === "approved" && (
                  <p className="text-sm text-muted-foreground">
                    Project limit: <strong>{request.project_limit}</strong>
                  </p>
                )}
              </div>
            ) : limit === 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Submit a request to become an admin. A company administrator will review and approve your request with a project creation limit.
                </p>
                <Button onClick={submitRequest} disabled={submitting} className="gap-2">
                  <Send className="w-4 h-4" />
                  {submitting ? "Submitting..." : "Request Admin Access"}
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Account Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name</span>
            <span>{user?.user_metadata?.full_name || "—"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Your User ID (share with project admins)</span>
            <code className="text-xs bg-muted px-2 py-1.5 rounded font-mono select-all break-all">{user?.id}</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
