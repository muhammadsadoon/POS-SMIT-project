import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

const Sales = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState<Tables<"sales">[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("sales").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => {
      setSales(data || []);
    });
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales History</h1>
        <p className="text-muted-foreground mt-1">Track your sales and revenue</p>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.length === 0 ? (
                <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No sales yet</TableCell></TableRow>
              ) : (
                sales.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{format(new Date(s.created_at), "dd MMM yyyy, hh:mm a")}</TableCell>
                    <TableCell>
                      <Badge variant={s.payment_method === "cash" ? "default" : "secondary"}>
                        {s.payment_method}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">Rs {Number(s.total).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;
