import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProject } from "@/hooks/useProject";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { format, subMonths } from "date-fns";
import { Download, Lock, Eye, EyeOff } from "lucide-react";
import * as XLSX from "xlsx";
import PaginationControls from "@/components/PaginationControls";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 10;

interface SaleWithDetails {
  id: string;
  created_at: string;
  payment_method: string;
  total: number;
  user_id: string;
  seller_name: string;
  items: { product_id: string | null; product_name: string; quantity: number; price: number; subtotal: number }[];
}

const ProjectSales = () => {
  const { projectId, isAdminOrManager } = useProject();
  const { toast } = useToast();
  const [sales, setSales] = useState<SaleWithDetails[]>([]);
  const [monthFilter, setMonthFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Password feature
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [salePassword, setSalePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState<string | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    fetchSalesData();
    fetchSalePassword();
  }, [projectId]);

  const fetchSalePassword = async () => {
    if (!projectId) return;
    const { data } = await supabase.from("projects").select("sale_password").eq("id", projectId).single();
    if (data) setCurrentPassword(data.sale_password);
  };

  const fetchSalesData = async () => {
    if (!projectId) return;
    setLoading(true);

    // Fetch sales
    const { data: salesData } = await supabase
      .from("sales")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (!salesData || salesData.length === 0) {
      setSales([]);
      setLoading(false);
      return;
    }

    // Fetch sale items for all sales
    const saleIds = salesData.map(s => s.id);
    const { data: itemsData } = await supabase
      .from("sale_items")
      .select("sale_id, product_id, product_name, quantity, price, subtotal")
      .in("sale_id", saleIds);

    // Fetch seller profiles
    const userIds = [...new Set(salesData.map(s => s.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", userIds);

    const profileMap: Record<string, string> = {};
    (profiles || []).forEach(p => { profileMap[p.user_id] = p.full_name || "Unknown"; });

    const itemsMap: Record<string, typeof itemsData> = {};
    (itemsData || []).forEach(item => {
      if (!itemsMap[item.sale_id]) itemsMap[item.sale_id] = [];
      itemsMap[item.sale_id].push(item);
    });

    const enriched: SaleWithDetails[] = salesData.map(s => ({
      id: s.id,
      created_at: s.created_at,
      payment_method: s.payment_method,
      total: Number(s.total),
      user_id: s.user_id,
      seller_name: profileMap[s.user_id] || "Unknown",
      items: (itemsMap[s.id] || []).map(i => ({
        product_id: i.product_id,
        product_name: i.product_name,
        quantity: i.quantity,
        price: Number(i.price),
        subtotal: Number(i.subtotal),
      })),
    }));

    setSales(enriched);
    setLoading(false);
  };

  const handleSavePassword = async () => {
    if (!projectId) return;
    setSavingPassword(true);
    const { error } = await supabase
      .from("projects")
      .update({ sale_password: salePassword.trim() || null })
      .eq("id", projectId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: salePassword.trim() ? "Password set!" : "Password removed!" });
      setCurrentPassword(salePassword.trim() || null);
      setPasswordDialog(false);
      setSalePassword("");
    }
    setSavingPassword(false);
  };

  // Month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const d = subMonths(new Date(), i);
    return { value: format(d, "yyyy-MM"), label: format(d, "MMMM yyyy") };
  });

  const filtered = monthFilter === "all"
    ? sales
    : sales.filter(s => format(new Date(s.created_at), "yyyy-MM") === monthFilter);

  const totalRevenue = filtered.reduce((sum, s) => sum + s.total, 0);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [monthFilter]);

  const exportToExcel = () => {
    const rows: any[] = [];
    filtered.forEach(s => {
      if (s.items.length === 0) {
        rows.push({
          "Transaction ID": s.id.slice(0, 8),
          "Date": format(new Date(s.created_at), "dd MMM yyyy, hh:mm a"),
          "Seller Name": s.seller_name,
          "Seller ID": s.user_id.slice(0, 8),
          "Product Name": "—",
          "Product ID": "—",
          "Qty": "",
          "Price": "",
          "Subtotal": "",
          "Payment Method": s.payment_method,
          "Total": s.total,
        });
      } else {
        s.items.forEach((item, idx) => {
          rows.push({
            "Transaction ID": s.id.slice(0, 8),
            "Date": idx === 0 ? format(new Date(s.created_at), "dd MMM yyyy, hh:mm a") : "",
            "Seller Name": idx === 0 ? s.seller_name : "",
            "Seller ID": idx === 0 ? s.user_id.slice(0, 8) : "",
            "Product Name": item.product_name,
            "Product ID": item.product_id?.slice(0, 8) || "—",
            "Qty": item.quantity,
            "Price": item.price,
            "Subtotal": item.subtotal,
            "Payment Method": idx === 0 ? s.payment_method : "",
            "Total": idx === 0 ? s.total : "",
          });
        });
      }
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales");
    XLSX.writeFile(wb, `sales_${monthFilter === "all" ? "all" : monthFilter}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Sales History</h1>
          <p className="text-muted-foreground mt-1">Track sales and revenue ({sales.length} total)</p>
        </div>
        {isAdminOrManager && (
          <Button variant="outline" className="gap-2" onClick={() => { setSalePassword(currentPassword || ""); setPasswordDialog(true); }}>
            <Lock className="w-4 h-4" /> {currentPassword ? "Change Sale Password" : "Set Sale Password"}
          </Button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Filtered Sales</p>
            <p className="text-2xl font-bold">{filtered.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold text-primary">Rs {totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Avg per Sale</p>
            <p className="text-2xl font-bold">{filtered.length > 0 ? `Rs ${Math.round(totalRevenue / filtered.length).toLocaleString()}` : "—"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Select value={monthFilter} onValueChange={setMonthFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            {monthOptions.map(m => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2" onClick={exportToExcel} disabled={filtered.length === 0}>
          <Download className="w-4 h-4" /> Export Excel
        </Button>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-0 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No sales found</TableCell></TableRow>
              ) : (
                paginated.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs">{s.id.slice(0, 8)}</TableCell>
                    <TableCell className="whitespace-nowrap">{format(new Date(s.created_at), "dd MMM yyyy, hh:mm a")}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{s.seller_name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{s.user_id.slice(0, 8)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5 max-w-[200px]">
                        {s.items.length === 0 ? (
                          <span className="text-muted-foreground text-xs">—</span>
                        ) : (
                          s.items.map((item, idx) => (
                            <p key={idx} className="text-xs truncate">
                              {item.product_name} × {item.quantity}
                            </p>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell><Badge variant={s.payment_method === "cash" ? "default" : "secondary"}>{s.payment_method}</Badge></TableCell>
                    <TableCell className="text-right font-medium">Rs {s.total.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} />
        </CardContent>
      </Card>

      {/* Password Dialog */}
      <Dialog open={passwordDialog} onOpenChange={setPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sale Confirmation Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Set a password that cashiers must enter to confirm each sale. Leave empty to remove password requirement.
            </p>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={salePassword}
                  onChange={e => setSalePassword(e.target.value)}
                  placeholder="Enter sale password..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full w-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            {currentPassword && (
              <p className="text-xs text-muted-foreground">Current password is set. Enter new password or clear to remove.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialog(false)}>Cancel</Button>
            <Button onClick={handleSavePassword} disabled={savingPassword}>
              {savingPassword ? "Saving..." : salePassword.trim() ? "Set Password" : "Remove Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectSales;
