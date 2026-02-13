import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import MainLayout from "@/components/MainLayout";
import ProjectLayout from "@/components/ProjectLayout";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Projects from "@/pages/Projects";
import Settings from "@/pages/Settings";
import CompanyPanel from "@/pages/CompanyPanel";
import ProjectDashboard from "@/pages/ProjectDashboard";
import ProjectPOS from "@/pages/ProjectPOS";
import ProjectProducts from "@/pages/ProjectProducts";
import ProjectCategories from "@/pages/ProjectCategories";
import ProjectSales from "@/pages/ProjectSales";
import ProjectMembers from "@/pages/ProjectMembers";
import Contact from "@/pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/projects" element={<MainLayout><Projects /></MainLayout>} />
              <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
              <Route path="/company" element={<MainLayout><CompanyPanel /></MainLayout>} />
              <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />

              {/* Project-scoped routes */}
              <Route path="/project/:projectId/dashboard" element={<ProjectLayout><ProjectDashboard /></ProjectLayout>} />
              <Route path="/project/:projectId/pos" element={<ProjectLayout><ProjectPOS /></ProjectLayout>} />
              <Route path="/project/:projectId/products" element={<ProjectLayout><ProjectProducts /></ProjectLayout>} />
              <Route path="/project/:projectId/categories" element={<ProjectLayout><ProjectCategories /></ProjectLayout>} />
              <Route path="/project/:projectId/sales" element={<ProjectLayout><ProjectSales /></ProjectLayout>} />
              <Route path="/project/:projectId/members" element={<ProjectLayout><ProjectMembers /></ProjectLayout>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
