import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Store, Eye, EyeOff, ArrowLeft, ShoppingCart, BarChart3, Users, Shield } from "lucide-react";

const Auth = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup" | "reset">(
    searchParams.get("mode") === "signup" ? "signup" : "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) navigate("/projects", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/auth?mode=login`,
        });
        if (error) throw error;
        toast({ title: "Reset email sent!", description: "Check your email for the password reset link." });
        setMode("login");
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        navigate("/projects");
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: fullName.trim() },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        // Auto sign-in after signup since email confirmation is disabled
        if (data.session) {
          toast({ title: "Account created!", description: "Welcome to SalePOS!" });
          navigate("/projects");
        } else {
          // Fallback: manually sign in
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
          if (signInError) throw signInError;
          toast({ title: "Account created!", description: "Welcome to SalePOS!" });
          navigate("/projects");
        }
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const titles: Record<string, { title: string; desc: string }> = {
    login: { title: "Welcome Back", desc: "Sign in to your POS system" },
    signup: { title: "Create Account", desc: "Get started with your store" },
    reset: { title: "Reset Password", desc: "Enter your email to receive a reset link" },
  };

  const features = [
    { icon: ShoppingCart, title: "Lightning POS", desc: "Real-time billing under 2 seconds per sale" },
    { icon: BarChart3, title: "Live Analytics", desc: "Track revenue & team performance in real-time" },
    { icon: Users, title: "Team Management", desc: "Role-based access for Admin, Manager & Cashier" },
    { icon: Shield, title: "Bank-Grade Security", desc: "Complete data isolation per store with RLS" },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
        
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <svg className="absolute top-10 right-10 w-64 h-64 opacity-10" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary-foreground">
              <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="25s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-primary-foreground">
              <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="18s" repeatCount="indefinite" />
            </circle>
          </svg>
          <svg className="absolute bottom-20 left-10 w-48 h-48 opacity-10" viewBox="0 0 100 100">
            <polygon points="50,5 93,25 93,75 50,95 7,75 7,25" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-primary-foreground">
              <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="30s" repeatCount="indefinite" />
            </polygon>
          </svg>
          <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary-foreground/20 animate-pulse" />
          <div className="absolute top-2/3 right-1/3 w-3 h-3 rounded-full bg-primary-foreground/15 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-2/3 w-1.5 h-1.5 rounded-full bg-primary-foreground/25 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 w-full">
          <div className="flex items-center gap-3 mb-12">
            <img src="/logo.png" alt="SalePOS" className="w-12 h-12 rounded-2xl object-contain" />
            <span className="text-xl font-bold text-primary-foreground tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              SalePOS
            </span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-bold text-primary-foreground leading-tight mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Run Your Store
            <br />
            <span className="text-primary-foreground/80">Like a Pro</span>
          </h2>
          <p className="text-primary-foreground/70 text-base mb-8 max-w-md leading-relaxed">
            The all-in-one POS system that helps you manage inventory, track sales, 
            and empower your team across multiple stores.
          </p>

          <div className="space-y-5">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center shrink-0 border border-primary-foreground/10 group-hover:bg-primary-foreground/20 transition-colors">
                  <f.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-foreground text-sm">{f.title}</h3>
                  <p className="text-primary-foreground/60 text-sm mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-6 mt-10 pt-6 border-t border-primary-foreground/10">
            <div>
              <p className="text-xl font-bold text-primary-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>500+</p>
              <p className="text-primary-foreground/50 text-xs">Active Stores</p>
            </div>
            <div>
              <p className="text-xl font-bold text-primary-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>99.9%</p>
              <p className="text-primary-foreground/50 text-xs">Uptime</p>
            </div>
            <div>
              <p className="text-xl font-bold text-primary-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>&lt;2s</p>
              <p className="text-primary-foreground/50 text-xs">Checkout Speed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/5" />
        
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1">
            <ArrowLeft className="w-4 h-4" /> Home
          </Button>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden flex items-center gap-2 mb-6 justify-center">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Store className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              SalePOS
            </span>
          </div>

          <div className="text-center mb-6">
            <div className="mx-auto w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <Store className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {titles[mode].title}
            </h1>
            <p className="text-muted-foreground mt-1 text-xs">{titles[mode].desc}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-xs">Full Name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" required maxLength={100} className="h-9 text-sm" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required maxLength={255} className="h-9 text-sm" />
            </div>
            {(mode === "login" || mode === "signup") && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="h-9 text-sm" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="auth-btn w-full h-9 rounded-lg bg-primary text-primary-foreground font-semibold text-xs disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group"
            >
              <span className="relative z-10">
                {loading ? "Please wait..." : mode === "login" ? "Sign In" : mode === "signup" ? "Sign Up" : "Send Reset Link"}
              </span>
              <div className="auth-btn-shine absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          </form>


          {mode === "login" && (
            <button onClick={() => setMode("reset")} className="w-full text-center mt-3 text-sm text-muted-foreground hover:text-primary transition-colors">
              Forgot password?
            </button>
          )}

          <div className="mt-6 text-center">
            {mode === "reset" ? (
              <button onClick={() => setMode("login")} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Back to sign in
              </button>
            ) : (
              <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;