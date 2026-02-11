import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProject } from "@/hooks/useProject";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Search } from "lucide-react";
import PaginationControls from "@/components/PaginationControls";
import type { Tables } from "@/integrations/supabase/types";

const ITEMS_PER_PAGE = 10;

const ProjectSales = () => {
  const { projectId } = useProject();
  const [sales, setSales] = useState<Tables<"sales">[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!projectId) return;
    supabase.from("sales").select("*").eq("project_id", projectId).order("created_at", { ascending: false }).then(({ data }) => {
      setSales(data || []);
    });
  }, [projectId]);

  const filtered = sales.filter((s) =>
    s.payment_method.toLowerCase().includes(search.toLowerCase()) ||
    format(new Date(s.created_at), "dd MMM yyyy").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Sales History</h1>
        <p className="text-muted-foreground mt-1">Track sales and revenue ({sales.length} total)</p>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by payment method or date..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No sales found</TableCell></TableRow>
              ) : (
                paginated.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{format(new Date(s.created_at), "dd MMM yyyy, hh:mm a")}</TableCell>
                    <TableCell><Badge variant={s.payment_method === "cash" ? "default" : "secondary"}>{s.payment_method}</Badge></TableCell>
                    <TableCell className="text-right font-medium">Rs {Number(s.total).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectSales;
