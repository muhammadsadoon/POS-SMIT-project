import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProject } from "@/hooks/useProject";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Search, ScanBarcode } from "lucide-react";
import { Navigate } from "react-router-dom";
import PaginationControls from "@/components/PaginationControls";
import BarcodeScanner from "@/components/BarcodeScanner";
import type { Tables } from "@/integrations/supabase/types";

const ITEMS_PER_PAGE = 10;

const ProjectProducts = () => {
  const { user } = useAuth();
  const { projectId, isAdminOrManager, role } = useProject();
  const { toast } = useToast();
  const [products, setProducts] = useState<Tables<"products">[]>([]);
  const [categories, setCategories] = useState<Tables<"categories">[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", price: "", stock: "", category_id: "", barcode: "", description: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [barcodeScanOpen, setBarcodeScanOpen] = useState(false);

  const fetchData = async () => {
    if (!projectId) return;
    const [p, c] = await Promise.all([
      supabase.from("products").select("*").eq("project_id", projectId).order("created_at", { ascending: false }),
      supabase.from("categories").select("*").eq("project_id", projectId),
    ]);
    setProducts(p.data || []);
    setCategories(c.data || []);
  };

  useEffect(() => { fetchData(); }, [projectId]);
  useEffect(() => { fetchData(); }, [projectId]);
  useEffect(() => { setCurrentPage(1); }, [search]);

  // Global Barcode Scanner Listener
  useEffect(() => {
    let buffer = "";
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      // If focus is on an input, we generally want to let it handle input,
      // UNLESS we are in the dialog and want to capture scanner input for the barcode field?
      // For now, let's stick to the safe "ProjectPOS" logic: ignore if input is focused.
      // This means user must click away (blur) or just not focus an input to scan.
      // However, if the dialog auto-focuses "Name", this might be annoying.
      // Let's try to be smart: if `open` is true, we might want to override?
      // No, that's risky. Let's start with standard behavior.
      if ((e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).tagName === "TEXTAREA") {
        return;
      }

      const currentTime = Date.now();
      if (currentTime - lastKeyTime > 100) {
        buffer = "";
      }
      lastKeyTime = currentTime;

      if (e.key === "Enter") {
        if (buffer.length > 1) {
          if (open) {
            setForm(prev => ({ ...prev, barcode: buffer }));
            toast({ title: "Barcode Scanned", description: buffer });
          } else {
            setSearch(buffer);
            toast({ title: "Searching Product", description: buffer });
          }
          buffer = "";
        }
      } else if (e.key.length === 1) {
        buffer += e.key;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]); // Re-attach when dialog state changes

  if (!isAdminOrManager) return <Navigate to={`/project/${projectId}/pos`} replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !projectId) return;
    if (!form.barcode.trim()) {
      toast({ title: "Barcode required", description: "Please enter or scan a barcode", variant: "destructive" });
      return;
    }
    const data = {
      name: form.name.trim(), price: parseFloat(form.price) || 0, stock: parseInt(form.stock) || 0,
      category_id: form.category_id || null, barcode: form.barcode.trim(), description: form.description.trim() || null,
      user_id: user.id, project_id: projectId,
    };
    const { error } = editingId
      ? await supabase.from("products").update(data).eq("id", editingId)
      : await supabase.from("products").insert(data);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else {
      toast({ title: editingId ? "Product updated" : "Product added" });
      setOpen(false); setEditingId(null);
      setForm({ name: "", price: "", stock: "", category_id: "", barcode: "", description: "" });
      fetchData();
    }
  };

  const handleEdit = (p: Tables<"products">) => {
    setEditingId(p.id);
    setForm({ name: p.name, price: String(p.price), stock: String(p.stock), category_id: p.category_id || "", barcode: p.barcode || "", description: p.description || "" });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else fetchData();
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || (p.barcode && p.barcode.includes(search))
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);



  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">Manage inventory and stock ({products.length} total)</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditingId(null); setForm({ name: "", price: "", stock: "", category_id: "", barcode: "", description: "" }); } }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingId ? "Edit Product" : "Add Product"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={200} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Price (Rs)</Label><Input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Stock</Label><Input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required /></div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Barcode <span className="text-destructive">*</span></Label>
                <div className="flex gap-2">
                  <Input value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} placeholder="Enter or scan barcode" maxLength={100} required />
                  <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={() => {
                    const code = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join("");
                    const sum = code.split("").reduce((acc, d, i) => acc + parseInt(d) * (i % 2 === 0 ? 1 : 3), 0);
                    const checkDigit = (10 - (sum % 10)) % 10;
                    setForm({ ...form, barcode: code + checkDigit });
                  }}>Generate</Button>
                  <Button type="button" variant="outline" size="icon" className="shrink-0" onClick={() => setBarcodeScanOpen(true)}>
                    <ScanBarcode className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full">{editingId ? "Update" : "Add"} Product</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name or barcode..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="hidden md:table-cell">Barcode</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No products found</TableCell></TableRow>
              ) : (
                paginated.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>Rs {Number(p.price).toLocaleString()}</TableCell>
                    <TableCell>{p.stock}</TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell font-mono text-xs">{p.barcode || "—"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}><Pencil className="w-4 h-4" /></Button>
                      {role === "admin" && (
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} />
        </CardContent>
      </Card>
      <BarcodeScanner open={barcodeScanOpen} onClose={() => setBarcodeScanOpen(false)} onScan={(code) => setForm({ ...form, barcode: code })} />
    </div>
  );
};

export default ProjectProducts;
