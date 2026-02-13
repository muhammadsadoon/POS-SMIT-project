import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogOut, FolderKanban, Settings, Shield, Store, MessageCircle } from "lucide-react";
import { ADMIN_EMAIL } from "@/config/admin";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCompanyAdmin, setIsCompanyAdmin] = useState(false);
  const [autoPromoted, setAutoPromoted] = useState(false);

  useEffect(() => {
    if (!user) return;

    const checkAndPromote = async () => {
      // Check if already company admin
      const { data: caData } = await supabase.from("company_admins").select("id").eq("user_id", user.id).maybeSingle();

      if (caData) {
        setIsCompanyAdmin(true);
        return;
      }

      // Check if user email matches global admin email OR is in admin_emails table
      const isGlobalAdmin = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      const { data: dbEmail } = await supabase.from("admin_emails").select("id").eq("email", user.email || "").maybeSingle();

      if (isGlobalAdmin || dbEmail) {
        // Auto-promote to company admin
        const { error } = await supabase.rpc("become_company_admin");
        if (!error) {
          setIsCompanyAdmin(true);
          setAutoPromoted(true);
        }
      }
    };

    checkAndPromote();
  }, [user]);

  // Auto-redirect to company panel if just promoted
  useEffect(() => {
    if (autoPromoted && isCompanyAdmin) {
      navigate("/company", { replace: true });
    }
  }, [autoPromoted, isCompanyAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const navItems = [
    ...(isCompanyAdmin ? [] : [{ label: "Projects", path: "/projects", icon: FolderKanban }]),
    { label: "Settings", path: "/settings", icon: Settings },
    { label: "Contact", path: "/contact", icon: MessageCircle },
    ...(isCompanyAdmin ? [{ label: "Company", path: "/company", icon: Shield }] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="SalePOS" className="w-8 h-8 rounded-lg object-contain" />
            <span className="font-bold text-lg tracking-tight hidden sm:inline" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              SalePOS
            </span>
          </div>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className="gap-2"
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            ))}
            <ThemeToggle className="ml-1" />
            <Button variant="ghost" size="sm" onClick={signOut} className="gap-2 text-muted-foreground ml-1">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4 md:p-6">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
