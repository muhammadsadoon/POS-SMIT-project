import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, Check, Store, Zap, BarChart3, Users, Shield, ShoppingCart, Layers, Smartphone } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Use IntersectionObserver for scroll animations instead of GSAP
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".scroll-animate").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: Zap, title: "Lightning POS", desc: "Real-time billing with product search, cart, and instant checkout. Under 2 seconds per sale." },
    { icon: Users, title: "Team Roles", desc: "Role-based access for Admin, Manager, and Cashier with project-level isolation." },
    { icon: BarChart3, title: "Live Analytics", desc: "Track revenue, top products, and team performance with real-time dashboards." },
    { icon: Shield, title: "Bank-Grade Security", desc: "Row-level security policies ensure complete data isolation per store." },
    { icon: Layers, title: "Multi-Store", desc: "Run multiple stores from one account. Separate inventories, unified control." },
    { icon: Smartphone, title: "Mobile Ready", desc: "Fully responsive design works perfectly on tablets and phones." },
  ];

  const steps = [
    { num: "01", title: "Create Account", desc: "Sign up in seconds with email verification" },
    { num: "02", title: "Setup Your Store", desc: "Add products, categories, and team members" },
    { num: "03", title: "Start Selling", desc: "Process sales instantly with our powerful POS" },
  ];

  const plans = [
    { name: "Starter", projects: 3, price: "Free", desc: "Perfect for trying out", popular: false },
    { name: "Professional", projects: 5, price: "Rs2,999/mo", desc: "For growing businesses", popular: true },
    { name: "Enterprise", projects: 10, price: "Rs7,999/mo", desc: "For large operations", popular: false },
  ];

  const stats = [
    { value: "10K+", label: "Transactions" },
    { value: "500+", label: "Active Stores" },
    { value: "99.9%", label: "Uptime" },
    { value: "< 2s", label: "Checkout Speed" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="SalePOS" className="w-9 h-9 rounded-xl object-contain" />
            <span className="font-bold text-xl tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              SalePOS
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <Button onClick={() => navigate("/projects")} className="gap-2">
                Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/auth")} className="hidden sm:inline-flex">Sign In</Button>
                <Button onClick={() => navigate("/auth?mode=signup")} className="gap-1">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/15" />
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[150px]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Floating SVGs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <svg className="absolute top-16 right-8 md:right-24 w-28 h-28 md:w-44 md:h-44 opacity-15" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.8" strokeDasharray="6 8">
              <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="25s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="50" r="28" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" strokeDasharray="3 6">
              <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="18s" repeatCount="indefinite" />
            </circle>
          </svg>
          <svg className="absolute bottom-32 left-6 md:left-20 w-20 h-20 opacity-10" viewBox="0 0 100 100">
            <polygon points="50,5 93,25 93,75 50,95 7,75 7,25" fill="none" stroke="hsl(var(--primary))" strokeWidth="1">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="30s" repeatCount="indefinite" />
            </polygon>
          </svg>
          <svg className="absolute top-40 left-1/3 w-40 h-40 opacity-15 hidden md:block" viewBox="0 0 100 100">
            <circle cx="20" cy="80" r="2" fill="hsl(var(--primary))">
              <animate attributeName="cy" values="80;20;80" dur="6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;1;0.3" dur="6s" repeatCount="indefinite" />
            </circle>
            <circle cx="60" cy="20" r="1.5" fill="hsl(var(--primary))">
              <animate attributeName="cy" values="20;70;20" dur="5s" repeatCount="indefinite" />
            </circle>
            <circle cx="85" cy="50" r="2.5" fill="hsl(var(--primary))">
              <animate attributeName="cy" values="50;10;50" dur="7s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 relative z-10 text-center">
          <div className="hero-badge inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs font-medium text-primary mb-5">
            <Zap className="w-3 h-3" />
            <span>Next-Gen POS Platform</span>
          </div>
          <h1 className="hero-title text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Run Your Store
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-accent-foreground bg-clip-text text-transparent">
              Like a Pro
            </span>
          </h1>
          <p className="hero-subtitle text-sm sm:text-base md:text-lg text-muted-foreground mt-5 max-w-2xl mx-auto leading-relaxed">
            The all-in-one POS system that helps you manage inventory, track sales, 
            and empower your team — across multiple stores.
          </p>
          <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Button size="lg" className="gap-2 h-11 px-8 text-sm shadow-lg shadow-primary/25 relative overflow-hidden group" onClick={() => navigate("/auth?mode=signup")}>
              <span className="relative z-10 flex items-center gap-2">Start Free Trial <ArrowRight className="w-4 h-4" /></span>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 h-11 px-8 text-sm" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
              Learn More
            </Button>
          </div>

          <div className="hero-trust flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-10 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Check className="w-3.5 h-3.5 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Check className="w-3.5 h-3.5 text-primary" />
              <span>Setup in 2 minutes</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Check className="w-3.5 h-3.5 text-primary" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="scroll-animate text-center">
                <div className="text-2xl md:text-3xl font-bold tracking-tight text-primary" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-10 scroll-animate">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs font-medium text-primary mb-3">
            <Layers className="w-3 h-3" />
            <span>Powerful Features</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Everything You Need
          </h2>
          <p className="text-muted-foreground mt-2 text-base max-w-xl mx-auto">Built for speed, designed for simplicity</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="scroll-animate group border-0 shadow-md hover:shadow-xl transition-all hover:-translate-y-1.5 duration-300 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 scroll-animate">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs font-medium text-primary mb-3">
              <ShoppingCart className="w-3 h-3" />
              <span>Simple Process</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              How It Works
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="scroll-animate text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-primary" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{step.num}</span>
                </div>
                <h3 className="font-semibold text-base mb-1.5">{step.title}</h3>
                <p className="text-muted-foreground text-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="scroll-animate relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-6 md:p-10 text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />
          </div>
          <div className="relative z-10">
            <h2 className="text-xl md:text-2xl font-bold text-primary-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Ready to Transform Your Business?
            </h2>
            <p className="text-primary-foreground/80 mt-2 max-w-lg mx-auto text-sm">
              Join hundreds of businesses already using SalePOS to streamline operations.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="mt-6 gap-2 h-12 px-8"
              onClick={() => navigate("/auth?mode=signup")}
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 scroll-animate">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs font-medium text-primary mb-3">
              <Zap className="w-3 h-3" />
              <span>Pricing Plans</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground mt-2 text-base">Start free, scale as you grow</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.name} className={`scroll-animate border-0 shadow-md relative hover:-translate-y-1.5 transition-all duration-300 ${plan.popular ? "ring-2 ring-primary shadow-xl shadow-primary/10 md:scale-105" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-5 text-center">
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                  <p className="text-muted-foreground text-xs mt-1">{plan.desc}</p>
                  <div className="my-5">
                    <span className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{plan.price}</span>
                  </div>
                  <ul className="space-y-3 text-sm text-left mb-6">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Up to {plan.projects} store projects</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> 10 team members per project</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Full POS & inventory</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Sales analytics</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Priority support</li>
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => navigate("/auth?mode=signup")}
                  >
                    {plan.price === "Free" ? "Start Free" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Store className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>SalePOS</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 SalePOS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
