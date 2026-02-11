import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, sales: 0, revenue: 0, categories: 0 });

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const [products, sales, categories] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("sales").select("id, total").eq("user_id", user.id),
        supabase.from("categories").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      const revenue = (sales.data || []).reduce((sum, s) => sum + Number(s.total), 0);
      setStats({
        products: products.count || 0,
        sales: (sales.data || []).length,
        revenue,
        categories: categories.count || 0,
      });
    };
    fetchStats();
  }, [user]);

  const cards = [
    { title: "Total Products", value: stats.products, icon: Package, color: "text-primary" },
    { title: "Total Sales", value: stats.sales, icon: ShoppingCart, color: "text-[hsl(var(--success))]" },
    { title: "Revenue", value: `Rs ${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-[hsl(var(--warning))]" },
    { title: "Categories", value: stats.categories, icon: TrendingUp, color: "text-[hsl(var(--chart-5))]" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to your POS Store Management System</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
    </div>
  );
};

export default Dashboard;
