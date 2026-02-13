import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import * as XLSX from "xlsx";
import {
  Shield, CheckCircle, XCircle, Users, Pencil, Trash2, Ban,
  BarChart3, Database, FolderKanban, Package,
  TrendingUp, HardDrive, UserCheck, Activity, Wifi, WifiOff,
  RefreshCw, Eye, Search, Download, Receipt
} from "lucide-react";
import PaginationControls from "@/components/PaginationControls";

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const CompanyPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCompanyAdmin, setIsCompanyAdmin] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [limits, setLimits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const [editDialog, setEditDialog] = useState<{ open: boolean; limit: any | null }>({ open: false, limit: null });
  const [editMaxProjects, setEditMaxProjects] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; limit: any | null }>({ open: false, limit: null });
  const [dealerSearch, setDealerSearch] = useState("");
  const [dealerPage, setDealerPage] = useState(1);
  const DEALERS_PER_PAGE = 3;
  const [manageSearch, setManageSearch] = useState("");

  const refreshData = async () => {
    const [reqRes, limRes] = await Promise.all([
      supabase.from("admin_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("user_project_limits").select("*").order("created_at", { ascending: false }),
    ]);
    setRequests(reqRes.data || []);
    setLimits(limRes.data || []);
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("company-stats", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (res.data) setStats(res.data);
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
    setStatsLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    const check = async () => {
      const { data } = await supabase.from("company_admins").select("id").eq("user_id", user.id).maybeSingle();
      setIsCompanyAdmin(!!data);
      if (data) {
        await refreshData();
        fetchStats();
      }
      setLoading(false);
    };
    check();
  }, [user]);

  const handleApprove = async (requestId: string, projectLimit: number) => {
    const { error } = await supabase.rpc("approve_admin_request", { _request_id: requestId, _project_limit: projectLimit });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Request approved!" }); await refreshData(); fetchStats(); }
  };

  const handleReject = async (requestId: string) => {
    const { error } = await supabase.from("admin_requests").update({ status: "rejected" }).eq("id", requestId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Request rejected" }); await refreshData(); }
  };

  const handleEditSave = async () => {
    if (!editDialog.limit) return;
    const newLimit = parseInt(editMaxProjects);
    if (isNaN(newLimit) || newLimit < 0) { toast({ title: "Invalid limit", variant: "destructive" }); return; }
    const { error } = await supabase.from("user_project_limits").update({ max_projects: newLimit }).eq("user_id", editDialog.limit.user_id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Limit updated!" }); setEditDialog({ open: false, limit: null }); await refreshData(); fetchStats(); }
  };

  const handleExpire = async (userId: string) => {
    const { error } = await supabase.from("user_project_limits").update({ max_projects: 0 }).eq("user_id", userId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Admin expired!" }); await refreshData(); fetchStats(); }
  };

  const handleReactivate = async (userId: string) => {
    const { error } = await supabase.from("user_project_limits").update({ max_projects: 3 }).eq("user_id", userId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Admin reactivated with 3 projects!" }); await refreshData(); fetchStats(); }
  };

  const handleDelete = async () => {
    if (!deleteDialog.limit) return;
    const userId = deleteDialog.limit.user_id;
    const [limErr, reqErr] = await Promise.all([
      supabase.from("user_project_limits").delete().eq("user_id", userId),
      supabase.from("admin_requests").update({ status: "rejected" }).eq("user_id", userId),
    ]);
    if (limErr.error || reqErr.error) toast({ title: "Error", description: (limErr.error || reqErr.error)?.message, variant: "destructive" });
    else { toast({ title: "Admin removed!" }); setDeleteDialog({ open: false, limit: null }); await refreshData(); fetchStats(); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isCompanyAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Shield className="w-16 h-16 mb-4 opacity-30" />
        <h2 className="text-xl font-semibold text-foreground">Access Denied</h2>
        <p className="mt-2">You are not a company administrator.</p>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === "pending");
  const processedRequests = requests.filter(r => r.status !== "pending");
  const overview = stats?.overview;

  // Calculate live stats
  const totalUsers = stats?.userStats?.length || 0;
  const activeUsers = stats?.userStats?.filter((u: any) => u.max_projects > 0 && u.projects_count > 0).length || 0;
  const inactiveUsers = totalUsers - activeUsers;
  const totalProjects = overview?.total_projects || 0;
  const activeProjects = stats?.projectStats?.length || 0;
  const expiredUsers = limits.filter(l => l.max_projects === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Company Admin Panel</h1>
          <p className="text-muted-foreground mt-1">Manage all dealers, projects & platform operations</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => { refreshData(); fetchStats(); }} disabled={statsLoading}>
          <RefreshCw className={`w-4 h-4 ${statsLoading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      {/* Live Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-primary">{activeUsers}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10"><Wifi className="w-5 h-5 text-primary" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Inactive Users</p>
                <p className="text-2xl font-bold">{inactiveUsers}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted"><WifiOff className="w-5 h-5 text-muted-foreground" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-500/5 to-emerald-500/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Live Projects</p>
                <p className="text-2xl font-bold text-emerald-600">{activeProjects}</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10"><FolderKanban className="w-5 h-5 text-emerald-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-destructive/5 to-destructive/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Expired Users</p>
                <p className="text-2xl font-bold text-destructive">{expiredUsers}</p>
              </div>
              <div className="p-2 rounded-lg bg-destructive/10"><Ban className="w-5 h-5 text-destructive" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex flex-wrap w-full h-auto gap-1 p-1">
          <TabsTrigger value="overview" className="gap-1.5 text-xs sm:text-sm flex-1 min-w-[80px]"><BarChart3 className="w-3.5 h-3.5 hidden sm:block" /> Overview</TabsTrigger>
          <TabsTrigger value="sales" className="gap-1.5 text-xs sm:text-sm flex-1 min-w-[70px]"><Receipt className="w-3.5 h-3.5 hidden sm:block" /> Sales</TabsTrigger>
          <TabsTrigger value="dealers" className="gap-1.5 text-xs sm:text-sm flex-1 min-w-[70px]"><Users className="w-3.5 h-3.5 hidden sm:block" /> Dealers</TabsTrigger>
          <TabsTrigger value="requests" className="gap-1.5 text-xs sm:text-sm flex-1 min-w-[80px]"><UserCheck className="w-3.5 h-3.5 hidden sm:block" /> Requests</TabsTrigger>
          <TabsTrigger value="management" className="gap-1.5 text-xs sm:text-sm flex-1 min-w-[90px]"><Shield className="w-3.5 h-3.5 hidden sm:block" /> Manage</TabsTrigger>
        </TabsList>

        {/* ===== OVERVIEW TAB ===== */}
        <TabsContent value="overview" className="space-y-6">
          {statsLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : overview ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={FolderKanban} label="Total Projects" value={overview.total_projects} />
                <StatCard icon={Users} label="Total Users" value={overview.total_users} />
                <StatCard icon={Package} label="Total Products" value={overview.total_products} />
                <StatCard icon={TrendingUp} label="Total Revenue" value={`Rs ${Number(overview.total_revenue).toLocaleString()}`} />
                <StatCard icon={Activity} label="Items Sold" value={overview.total_items_sold} />
                <StatCard icon={Users} label="Total Members" value={overview.total_members} />
                <StatCard icon={Database} label="Categories" value={overview.total_categories} />
                <StatCard icon={HardDrive} label="Est. Total Data" value={formatBytes(
                  (stats?.projectStats || []).reduce((a: number, p: any) => a + (p.estimated_data_bytes || 0), 0)
                )} />
              </div>

              {/* Project Data Table */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-primary" />
                    Project-wise Data & Storage
                  </CardTitle>
                  <CardDescription>All dealer projects with data usage</CardDescription>
                </CardHeader>
                <CardContent className="p-0 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead className="text-center">Products</TableHead>
                        <TableHead className="text-center">Members</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                        <TableHead className="text-right">Data Size</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(stats?.projectStats || []).map((p: any) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell className="text-muted-foreground">{p.owner_name}</TableCell>
                          <TableCell className="text-center">{p.products_count}</TableCell>
                          <TableCell className="text-center"><Badge variant="outline">{p.members_count}</Badge></TableCell>
                          <TableCell className="text-right font-mono text-sm">Rs {Number(p.revenue).toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="secondary" className="font-mono text-xs">{formatBytes(p.estimated_data_bytes)}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(stats?.projectStats || []).length === 0 && (
                        <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No projects yet</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-0 shadow-md p-8 text-center text-muted-foreground">
              Failed to load analytics. Try refreshing.
            </Card>
          )}
        </TabsContent>

        {/* ===== SALES TAB ===== */}
        <TabsContent value="sales" className="space-y-6">
          <CompanySalesTab stats={stats} statsLoading={statsLoading} />
        </TabsContent>

        {/* ===== DEALERS TAB ===== */}
        <TabsContent value="dealers" className="space-y-6">
          {/* Dealer Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search dealers by name..."
              className="pl-9"
              value={dealerSearch}
              onChange={(e) => { setDealerSearch(e.target.value); setDealerPage(1); }}
            />
          </div>

          {statsLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (() => {
            const allDealers = stats?.userStats || [];
            const filteredDealers = dealerSearch.trim()
              ? allDealers.filter((u: any) => u.name?.toLowerCase().includes(dealerSearch.toLowerCase()))
              : allDealers;
            const totalDealerPages = Math.ceil(filteredDealers.length / DEALERS_PER_PAGE);
            const paginatedDealers = filteredDealers.slice((dealerPage - 1) * DEALERS_PER_PAGE, dealerPage * DEALERS_PER_PAGE);

            return (
              <div className="space-y-4">
                {!dealerSearch.trim() && allDealers.length > DEALERS_PER_PAGE && (
                  <p className="text-sm text-muted-foreground">
                    Showing {paginatedDealers.length} of {allDealers.length} dealers. Search to find specific dealers.
                  </p>
                )}
                {paginatedDealers.map((u: any) => {
                  const isActive = u.max_projects > 0 && u.projects_count > 0;
                  const isExpired = u.max_projects === 0;
                  return (
                    <Card key={u.user_id} className="border-0 shadow-md">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${isExpired ? 'bg-destructive' : isActive ? 'bg-emerald-500' : 'bg-muted-foreground/50'}`} />
                            <div>
                              <CardTitle className="text-lg">{u.name}</CardTitle>
                              <CardDescription className="font-mono text-xs mt-0.5">{u.user_id.slice(0, 12)}...</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={isExpired ? "destructive" : isActive ? "default" : "outline"}>
                              {isExpired ? "Expired" : isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline">{u.projects_count} / {u.max_projects} Projects</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Project Usage</span>
                            <span>{u.max_projects > 0 ? Math.round((u.projects_count / u.max_projects) * 100) : 0}%</span>
                          </div>
                          <Progress value={u.max_projects > 0 ? (u.projects_count / u.max_projects) * 100 : 0} className="h-2" />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                          <div className="bg-muted/50 rounded-lg p-3 text-center">
                            <p className="text-muted-foreground text-xs">Products</p>
                            <p className="font-bold text-lg">{u.products_count}</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3 text-center">
                            <p className="text-muted-foreground text-xs">Revenue</p>
                            <p className="font-bold text-lg">Rs {Number(u.revenue).toLocaleString()}</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3 text-center">
                            <p className="text-muted-foreground text-xs">Data Size</p>
                            <p className="font-bold text-lg">{formatBytes(u.estimated_data_bytes)}</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3 text-center">
                            <p className="text-muted-foreground text-xs">Projects</p>
                            <p className="font-bold text-lg">{u.projects_count}</p>
                          </div>
                        </div>
                        {u.projects.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Dealer Projects:</p>
                            <div className="flex flex-wrap gap-2">
                              {u.projects.map((proj: any) => (
                                <Badge key={proj.id} variant="secondary" className="text-xs gap-1">
                                  <Eye className="w-3 h-3" /> {proj.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {isExpired && (
                          <div className="pt-2 border-t flex gap-2">
                            <Button size="sm" variant="outline" className="gap-1" onClick={() => handleReactivate(u.user_id)}>
                              <RefreshCw className="w-3 h-3" /> Reactivate
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1" onClick={() => {
                              setEditMaxProjects("3");
                              const limit = limits.find(l => l.user_id === u.user_id);
                              if (limit) setEditDialog({ open: true, limit });
                            }}>
                              <Pencil className="w-3 h-3" /> Set Custom Limit
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
                {paginatedDealers.length === 0 && (
                  <Card className="border-0 shadow-md p-8 text-center text-muted-foreground">
                    {dealerSearch.trim() ? "No dealers match your search" : "No dealers found"}
                  </Card>
                )}
                <PaginationControls currentPage={dealerPage} totalPages={totalDealerPages} onPageChange={setDealerPage} totalItems={filteredDealers.length} itemsPerPage={DEALERS_PER_PAGE} />
              </div>
            );
          })()}
        </TabsContent>

        {/* ===== REQUESTS TAB ===== */}
        <TabsContent value="requests" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                Pending Requests ({pendingRequests.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Limit</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No pending requests</TableCell></TableRow>
                  ) : (
                    pendingRequests.map((r) => (
                      <PendingRow key={r.id} request={r} onApprove={handleApprove} onReject={handleReject} />
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {processedRequests.length > 0 && (
            <Card className="border-0 shadow-md">
              <CardHeader><CardTitle>Request History</CardTitle></CardHeader>
              <CardContent className="p-0 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processedRequests.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.full_name || "—"}</TableCell>
                        <TableCell>{r.email}</TableCell>
                        <TableCell><Badge variant={r.status === "approved" ? "default" : "destructive"}>{r.status}</Badge></TableCell>
                        <TableCell>{format(new Date(r.created_at), "dd MMM yyyy")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ===== MANAGEMENT TAB ===== */}
        <TabsContent value="management" className="space-y-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or ID..."
              className="pl-9"
              value={manageSearch}
              onChange={(e) => setManageSearch(e.target.value)}
            />
          </div>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Dealer Limits & Access Control</CardTitle>
              <CardDescription>Edit, expire, reactivate, or remove dealer access</CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dealer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Limit</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    const filteredLimits = limits.filter(l => {
                      const u = stats?.userStats?.find((u: any) => u.user_id === l.user_id);
                      const name = u?.name || "";
                      const term = manageSearch.toLowerCase();
                      return name.toLowerCase().includes(term) || l.user_id.toLowerCase().includes(term);
                    });

                    if (filteredLimits.length === 0) {
                      return (
                        <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          {manageSearch ? "No dealers match your search" : "No dealers found"}
                        </TableCell></TableRow>
                      );
                    }

                    return filteredLimits.map((l) => {
                      const userName = stats?.userStats?.find((u: any) => u.user_id === l.user_id)?.name || l.user_id.slice(0, 8) + "...";
                      const isExpired = l.max_projects === 0;
                      return (
                        <TableRow key={l.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${isExpired ? 'bg-destructive' : 'bg-emerald-500'}`} />
                              <div>
                                <p className="font-medium">{userName}</p>
                                <p className="text-xs text-muted-foreground font-mono">{l.user_id.slice(0, 12)}...</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={isExpired ? "destructive" : "default"}>
                              {isExpired ? "Expired" : "Active"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{l.max_projects} projects</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1 flex-wrap">
                              <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => { setEditMaxProjects(String(l.max_projects)); setEditDialog({ open: true, limit: l }); }}>
                                <Pencil className="w-3 h-3" /> <span className="hidden sm:inline">Edit</span>
                              </Button>
                              {isExpired ? (
                                <Button size="sm" variant="outline" className="gap-1 text-xs text-emerald-600" onClick={() => handleReactivate(l.user_id)}>
                                  <RefreshCw className="w-3 h-3" /> <span className="hidden sm:inline">Reactivate</span>
                                </Button>
                              ) : (
                                <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => handleExpire(l.user_id)}>
                                  <Ban className="w-3 h-3" /> <span className="hidden sm:inline">Expire</span>
                                </Button>
                              )}
                              <Button size="sm" variant="destructive" className="gap-1 text-xs" onClick={() => setDeleteDialog({ open: true, limit: l })}>
                                <Trash2 className="w-3 h-3" /> <span className="hidden sm:inline">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    });
                  })()}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open, limit: open ? editDialog.limit : null })}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Dealer Limit</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Max Projects</Label>
              <Input type="number" min="0" value={editMaxProjects} onChange={(e) => setEditMaxProjects(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog({ open: false, limit: null })}>Cancel</Button>
            <Button onClick={handleEditSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, limit: open ? deleteDialog.limit : null })}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Dealer Access</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground py-2">Are you sure? Their project limit will be removed and request set to rejected.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, limit: null })}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) => (
  <Card className="border-0 shadow-sm">
    <CardContent className="p-4 flex items-center gap-3">
      <div className="p-2 rounded-lg bg-primary/10">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const PendingRow = ({ request, onApprove, onReject }: { request: any; onApprove: (id: string, limit: number) => void; onReject: (id: string) => void }) => {
  const [selectedLimit, setSelectedLimit] = useState("3");
  return (
    <TableRow>
      <TableCell className="font-medium">{request.full_name || "—"}</TableCell>
      <TableCell>{request.email}</TableCell>
      <TableCell>{format(new Date(request.created_at), "dd MMM yyyy")}</TableCell>
      <TableCell>
        <Select value={selectedLimit} onValueChange={setSelectedLimit}>
          <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="text-right space-x-2">
        <Button size="sm" className="gap-1" onClick={() => onApprove(request.id, parseInt(selectedLimit))}><CheckCircle className="w-3 h-3" /> Approve</Button>
        <Button size="sm" variant="destructive" className="gap-1" onClick={() => onReject(request.id)}><XCircle className="w-3 h-3" /> Reject</Button>
      </TableCell>
    </TableRow>
  );
};

const SALES_PER_PAGE = 10;

const CompanySalesTab = ({ stats, statsLoading }: { stats: any; statsLoading: boolean }) => {
  const [monthFilter, setMonthFilter] = useState("all");
  const [salesPage, setSalesPage] = useState(1);

  // Build all sales from projectStats
  const allSales: any[] = [];
  if (stats?.projectStats) {
    // We need raw sales data - fetch from stats or reconstruct
    // Since company-stats doesn't return individual sales, we use overview data
  }

  // Generate month options (last 12 months)
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const d = subMonths(new Date(), i);
    return { value: format(d, "yyyy-MM"), label: format(d, "MMMM yyyy") };
  });

  // We need actual sales data from edge function - let's fetch it
  const [sales, setSales] = useState<any[]>([]);
  const [salesLoading, setSalesLoading] = useState(false);

  useEffect(() => {
    if (!stats) return;
    const fetchSales = async () => {
      setSalesLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("company-stats", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
        body: { includeSales: true },
      });
      if (res.data?.allSales) setSales(res.data.allSales);
      setSalesLoading(false);
    };
    fetchSales();
  }, [stats]);

  const filtered = monthFilter === "all"
    ? sales
    : sales.filter((s: any) => format(new Date(s.created_at), "yyyy-MM") === monthFilter);

  const totalRevenue = filtered.reduce((sum: number, s: any) => sum + Number(s.total), 0);
  const totalSalesPages = Math.ceil(filtered.length / SALES_PER_PAGE);
  const paginatedSales = filtered.slice((salesPage - 1) * SALES_PER_PAGE, salesPage * SALES_PER_PAGE);

  // Calculate Specific Period Stats
  const now = new Date();
  const todaySales = sales.filter((s: any) => format(new Date(s.created_at), "yyyy-MM-dd") === format(now, "yyyy-MM-dd"));
  const todayRevenue = todaySales.reduce((sum: number, s: any) => sum + Number(s.total), 0);

  const lastMonth = subMonths(now, 1);
  const lastMonthSales = sales.filter((s: any) => format(new Date(s.created_at), "yyyy-MM") === format(lastMonth, "yyyy-MM"));
  const lastMonthRevenue = lastMonthSales.reduce((sum: number, s: any) => sum + Number(s.total), 0);

  useEffect(() => { setSalesPage(1); }, [monthFilter]);

  const exportToExcel = () => {
    const exportData = filtered.map((s: any) => ({
      Date: format(new Date(s.created_at), "dd MMM yyyy, hh:mm a"),
      Project: s.project_name || "—",
      "Payment Method": s.payment_method,
      Total: Number(s.total),
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales");
    XLSX.writeFile(wb, `sales_${monthFilter === "all" ? "all" : monthFilter}.xlsx`);
  };

  if (statsLoading || salesLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <Card className="border-0 shadow-sm col-span-1 sm:col-span-1">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Filtered Sales</p>
            <p className="text-2xl font-bold">{filtered.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm col-span-1 sm:col-span-1">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Filtered Revenue</p>
            <p className="text-2xl font-bold text-primary">Rs {totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm col-span-1 sm:col-span-1">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Today's Revenue</p>
            <p className="text-2xl font-bold text-emerald-600">Rs {todayRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{todaySales.length} sales</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm col-span-1 sm:col-span-1">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Last Month's Revenue</p>
            <p className="text-2xl font-bold text-blue-600">Rs {lastMonthRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{lastMonthSales.length} sales</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm col-span-1 sm:col-span-1">
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
            {monthOptions.map((m) => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2" onClick={exportToExcel} disabled={filtered.length === 0}>
          <Download className="w-4 h-4" /> Export Excel
        </Button>
      </div>

      {/* Sales Table */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-0 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSales.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No sales found</TableCell></TableRow>
              ) : (
                paginatedSales.map((s: any) => (
                  <TableRow key={s.id}>
                    <TableCell>{format(new Date(s.created_at), "dd MMM yyyy, hh:mm a")}</TableCell>
                    <TableCell>{s.project_name || "—"}</TableCell>
                    <TableCell><Badge variant={s.payment_method === "cash" ? "default" : "secondary"}>{s.payment_method}</Badge></TableCell>
                    <TableCell className="text-right font-medium">Rs {Number(s.total).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <PaginationControls currentPage={salesPage} totalPages={totalSalesPages} onPageChange={setSalesPage} totalItems={filtered.length} itemsPerPage={SALES_PER_PAGE} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyPanel;
