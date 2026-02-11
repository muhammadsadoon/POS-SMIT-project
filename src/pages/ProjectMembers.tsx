import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProject } from "@/hooks/useProject";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Trash2, Users, Search } from "lucide-react";
import { Navigate } from "react-router-dom";
import PaginationControls from "@/components/PaginationControls";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface SearchResult {
  user_id: string;
  full_name: string | null;
  email: string;
}

const ITEMS_PER_PAGE = 10;

const ProjectMembers = () => {
  const { projectId, isAdminOrManager, role } = useProject();
  const { toast } = useToast();
  const [members, setMembers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedUser, setSelectedUser] = useState<SearchResult | null>(null);
  const [memberRole, setMemberRole] = useState<AppRole>("cashier");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMembers = async () => {
    if (!projectId) return;
    const { data } = await supabase
      .from("project_members")
      .select("*, profiles(full_name)")
      .eq("project_id", projectId)
      .order("created_at");
    setMembers(data || []);
  };

  useEffect(() => { fetchMembers(); }, [projectId]);

  if (!isAdminOrManager) return <Navigate to={`/project/${projectId}/pos`} replace />;

  const handleSearch = async () => {
    if (!searchTerm.trim() || searchTerm.trim().length < 2) return;
    setSearching(true);
    const { data, error } = await supabase.rpc("search_users_for_project", { search_term: searchTerm.trim() });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      const memberIds = new Set(members.map((m: any) => m.user_id));
      setSearchResults((data || []).filter((u: SearchResult) => !memberIds.has(u.user_id)));
    }
    setSearching(false);
  };

  const addMember = async () => {
    if (!projectId || !selectedUser) return;
    setLoading(true);
    if (members.length >= 10) {
      toast({ title: "Limit reached", description: "Maximum 10 members per project", variant: "destructive" });
      setLoading(false);
      return;
    }
    const { error } = await supabase.from("project_members").insert({
      project_id: projectId, user_id: selectedUser.user_id, role: memberRole,
    });
    if (error) {
      toast({ title: "Error", description: error.message.includes("duplicate") ? "User already a member" : error.message, variant: "destructive" });
    } else {
      toast({ title: "Member added!" });
      setOpen(false); setSearchTerm(""); setSearchResults([]); setSelectedUser(null); setMemberRole("cashier");
      fetchMembers();
    }
    setLoading(false);
  };

  const removeMember = async (memberId: string) => {
    const { error } = await supabase.from("project_members").delete().eq("id", memberId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else fetchMembers();
  };

  const updateMemberRole = async (memberId: string, newRole: AppRole) => {
    const { error } = await supabase.from("project_members").update({ role: newRole }).eq("id", memberId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else fetchMembers();
  };

  const totalPages = Math.ceil(members.length / ITEMS_PER_PAGE);
  const paginated = members.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground mt-1">{members.length} / 10 members</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setSearchTerm(""); setSearchResults([]); setSelectedUser(null); } }}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={members.length >= 10}><UserPlus className="w-4 h-4" /> Add Member</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Team Member</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Search by Name or Email</Label>
                <div className="flex gap-2">
                  <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Enter name or email..." onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
                  <Button variant="secondary" onClick={handleSearch} disabled={searching} size="icon" className="shrink-0"><Search className="w-4 h-4" /></Button>
                </div>
              </div>
              {searchResults.length > 0 && (
                <div className="border rounded-lg divide-y max-h-48 overflow-auto">
                  {searchResults.map((u) => (
                    <button key={u.user_id} onClick={() => setSelectedUser(u)} className={`w-full text-left p-3 hover:bg-muted/50 transition-colors ${selectedUser?.user_id === u.user_id ? "bg-primary/10" : ""}`}>
                      <p className="font-medium text-sm">{u.full_name || "No name"}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </button>
                  ))}
                </div>
              )}
              {searchResults.length === 0 && searchTerm && !searching && (
                <p className="text-sm text-muted-foreground text-center py-2">No users found</p>
              )}
              {selectedUser && (
                <div className="space-y-3 p-3 rounded-lg bg-muted/50">
                  <p className="text-sm"><strong>Selected:</strong> {selectedUser.full_name || selectedUser.email}</p>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={memberRole} onValueChange={(v) => setMemberRole(v as AppRole)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cashier">Cashier</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={addMember} className="w-full" disabled={loading}>{loading ? "Adding..." : "Add Member"}</Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-0 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />No members yet
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{m.profiles?.full_name || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground font-mono">{m.user_id.slice(0, 8)}...</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {role === "admin" ? (
                        <Select value={m.role} onValueChange={(v) => updateMemberRole(m.id, v as AppRole)}>
                          <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cashier">Cashier</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant="outline" className="capitalize">{m.role}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {role === "admin" && (
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeMember(m.id)}><Trash2 className="w-4 h-4" /></Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={members.length} itemsPerPage={ITEMS_PER_PAGE} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectMembers;
