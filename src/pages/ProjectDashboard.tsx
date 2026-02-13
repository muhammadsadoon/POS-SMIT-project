import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useProject } from "@/hooks/useProject";
import { Package, ShoppingCart, DollarSign, Users } from "lucide-react";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { format, subDays } from "date-fns";

const ProjectDashboard = () => {
  const { projectId } = useProject();
  const [stats, setStats] = useState({ products: 0, sales: 0, revenue: 0, members: 0 });
  const [salesData, setSalesData] = useState<{ name: string; total: number }[]>([]);

  useEffect(() => {
    if (!projectId) return;
    const fetchStats = async () => {
      const [products, salesResult, members] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }).eq("project_id", projectId),
        supabase.from("sales").select("id, total, created_at").eq("project_id", projectId),
        supabase.from("project_members").select("id", { count: "exact", head: true }).eq("project_id", projectId),
      ]);

      const sales = salesResult.data || [];
      const revenue = sales.reduce((sum, s) => sum + Number(s.total), 0);

      setStats({
        products: products.count || 0,
        sales: sales.length,
        revenue,
        members: members.count || 0,
      });

      // Process sales data for the chart (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        return date;
      });

      const chartData = last7Days.map((date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        const daySales = sales.filter((s) => {
          const saleDate = new Date(s.created_at);
          return format(saleDate, "yyyy-MM-dd") === dateStr;
        });
        const total = daySales.reduce((sum, s) => sum + Number(s.total), 0);
        return { name: format(date, "MMM dd"), total };
      });

      setSalesData(chartData);
    };
    fetchStats();
  }, [projectId]);

  const cards = [
    { title: "Total Products", value: stats.products, icon: Package, color: "text-primary" },
    { title: "Total Sales", value: stats.sales, icon: ShoppingCart, color: "text-[hsl(var(--success))]" },
    { title: "Revenue", value: `Rs ${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-[hsl(var(--warning))]" },
    { title: "Members", value: stats.members, icon: Users, color: "text-[hsl(var(--chart-5))]" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Project overview and statistics</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <SalesChart data={salesData} />
    </div>
  );
};

export default ProjectDashboard;
