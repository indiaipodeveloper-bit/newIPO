import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, Building2, Search, Link as LinkIcon, Info, Users, ArrowRight } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";
import RichEditor from "@/components/ui/RichEditor";

interface MainboardBanker {
  id: number;
  name: string;
  category: string;
  location: string;
  sebi_registration: string;
  website: string;
  services: string;
  total_ipos: number;
  established_year: number | null;
  description: string;
  logo_url: string;
  is_active: boolean;
  sort_order: number;
  total_raised: number;
  avg_size: number;
  avg_subscription: number;
  created_at?: string;
  updated_at?: string;
}

const emptyForm: Omit<MainboardBanker, 'id' | 'created_at' | 'updated_at'> = {
  name: "",
  category: "Mainboard",
  location: "",
  sebi_registration: "",
  website: "",
  services: "",
  total_ipos: 0,
  established_year: null,
  description: "",
  logo_url: "",
  is_active: true,
  sort_order: 0,
  total_raised: 0,
  avg_size: 0,
  avg_subscription: 0,
};

const ManageMainboardBankers = () => {
  const [bankers, setBankers] = useState<MainboardBanker[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); 
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchBankers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/mainboard-bankers?page=${page}&limit=${limit}&search=${encodeURIComponent(debouncedSearch)}`);
      if (res.ok) {
        const body = await res.json();
        setBankers(body.data || []);
        setTotal(body.pagination?.total || 0);
      }
    } catch (err) {
      toast.error("Failed to load Mainboard Bankers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBankers(); }, [page, limit, debouncedSearch]);

  const handleSave = async () => {
    if (!form.name) { toast.error("Banker Name is required"); return; }
    
    setSaving(true);
    try {
      const url = editingId ? `/api/mainboard-bankers/${editingId}` : "/api/mainboard-bankers";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      if (!res.ok) { throw new Error("Save failed"); }
      
      toast.success(editingId ? "Banker updated!" : "Banker created!");
      setForm(emptyForm);
      setEditingId(null);
      setDialogOpen(false);
      fetchBankers();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (b: MainboardBanker) => {
    setForm({
      name: b.name || "",
      category: b.category || "Mainboard",
      location: b.location || "",
      sebi_registration: b.sebi_registration || "",
      website: b.website || "",
      services: b.services || "",
      total_ipos: b.total_ipos || 0,
      established_year: b.established_year || null,
      description: b.description || "",
      logo_url: b.logo_url || "",
      is_active: b.is_active,
      sort_order: b.sort_order || 0,
      total_raised: b.total_raised || 0,
      avg_size: b.avg_size || 0,
      avg_subscription: b.avg_subscription || 0,
    });
    setEditingId(b.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this Banker permanently?")) return;
    try {
      await fetch(`/api/mainboard-bankers/${id}`, { method: "DELETE" });
      toast.success("Deleted successfully");
      fetchBankers();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("folder", "mainboard");
    formData.append("file", file);

    const tId = toast.loading("Uploading logo...");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setForm({ ...form, logo_url: data.url });
      toast.success("Logo uploaded!", { id: tId });
    } catch (err) {
      toast.error("Failed to upload image", { id: tId });
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading text-primary">Mainboard Merchant Bankers</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage top tier Mainboard IPO Lead Managers</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search bankers..." 
                className="pl-9 bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={(o) => { 
              setDialogOpen(o); 
              if (!o) { setForm(emptyForm); setEditingId(null); } 
            }}>
              <DialogTrigger asChild>
                <Button className="bg-primary shrink-0 text-primary-foreground font-semibold">
                  <Plus className="h-4 w-4 mr-2" /> Add Banker
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl">{editingId ? "Edit Mainboard Banker" : "Add Mainboard Banker"}</DialogTitle>
                </DialogHeader>
                
                <Tabs defaultValue="general" className="mt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general">General Info</TabsTrigger>
                    <TabsTrigger value="stats">Analytics & Stats</TabsTrigger>
                    <TabsTrigger value="contact">Details & SEBI</TabsTrigger>
                  </TabsList>
                  
                  {/* General Tab */}
                  <TabsContent value="general" className="space-y-4 py-4 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Banker Name *</label>
                        <Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="e.g. ICICI Securities" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Company Logo</label>
                        <div className="flex gap-2">
                          <Input value={form.logo_url} onChange={(e) => setForm({...form, logo_url: e.target.value})} placeholder="URL..." className="flex-1" />
                          <div className="relative shrink-0">
                            <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                            <Button type="button" variant="outline" disabled={uploading} className="pointer-events-none">
                              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Short Description</label>
                      <RichEditor 
                        value={form.description} 
                        onChange={(val) => setForm({...form, description: val})} 
                        placeholder="About the merchant banker..." 
                        className="min-h-[300px]"
                      />
                    </div>
                  </TabsContent>

                  {/* Stats Tab */}
                  <TabsContent value="stats" className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Total IPOs Managed</label>
                        <Input type="number" value={form.total_ipos} onChange={(e) => setForm({...form, total_ipos: parseInt(e.target.value) || 0})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Total Raised (Cr)</label>
                        <Input type="number" step="0.01" value={form.total_raised} onChange={(e) => setForm({...form, total_raised: parseFloat(e.target.value) || 0})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Average IPO Size (Cr)</label>
                        <Input type="number" step="0.01" value={form.avg_size} onChange={(e) => setForm({...form, avg_size: parseFloat(e.target.value) || 0})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Average Subscription (x)</label>
                        <Input type="number" step="0.01" value={form.avg_subscription} onChange={(e) => setForm({...form, avg_subscription: parseFloat(e.target.value) || 0})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Established Year</label>
                        <Input type="number" value={form.established_year || ''} onChange={(e) => setForm({...form, established_year: parseInt(e.target.value) || null})} />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Contact Tab */}
                  <TabsContent value="contact" className="space-y-4 pt-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Location / Head Office</label>
                        <Input value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} placeholder="e.g. Mumbai, Maharashtra" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Official Website</label>
                        <Input value={form.website} onChange={(e) => setForm({...form, website: e.target.value})} placeholder="https://..." />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">SEBI Registration No.</label>
                      <Input value={form.sebi_registration} onChange={(e) => setForm({...form, sebi_registration: e.target.value})} placeholder="INM0000..." />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Other Services Offered</label>
                      <Textarea value={form.services} onChange={(e) => setForm({...form, services: e.target.value})} rows={3} placeholder="M&A, Valuations, Corporate Advisory..." />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground min-w-[120px]">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Banker"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Content Table Area */}
        {loading && bankers.length === 0 ? (
          <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : bankers.length === 0 ? (
          <div className="text-center py-24 bg-card border border-border rounded-xl">
            <Building2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-foreground">No Mainboard Bankers Found</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1">There are currently no mainboard merchants added or matching your search.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="py-4 px-5 text-left font-semibold text-foreground w-16">Logo</th>
                    <th className="py-4 px-5 text-left font-semibold text-foreground min-w-[200px]">Banker Details</th>
                    <th className="py-4 px-5 text-left font-semibold text-foreground">SEBI No.</th>
                    <th className="py-4 px-5 text-left font-semibold text-foreground">Total IPOs</th>
                    <th className="py-4 px-5 text-right font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bankers.map((b) => (
                    <tr key={b.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-5">
                        {b.logo_url ? (
                          <div className="w-10 h-10 rounded border border-border overflow-hidden bg-white shadow-sm shrink-0">
                            <img src={getImageUrl(b.logo_url)} alt={b.name} className="w-full h-full object-contain p-1" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded border border-border border-dashed flex items-center justify-center bg-secondary/50 shrink-0">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-5">
                        <div className="font-semibold text-foreground text-base mb-1">{b.name}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {b.location && <span><span className="font-medium text-primary/70">HQ:</span> {b.location}</span>}
                          {b.website && (
                            <a href={b.website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-primary transition-colors">
                              <LinkIcon className="w-3 h-3 mr-1" /> Website
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        {b.sebi_registration ? (
                          <Badge variant="outline" className="font-mono text-[10px] bg-secondary/50 text-foreground">
                            {b.sebi_registration}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">N/A</span>
                        )}
                      </td>
                      <td className="py-3 px-5">
                        <div className="font-bold text-lg text-primary">{b.total_ipos || 0}</div>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(b)} className="h-8">
                            <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(b.id)} className="h-8 text-destructive border-destructive/30 hover:bg-destructive/10">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {total > limit && (
              <div className="flex items-center justify-between p-4 border-t border-border bg-secondary/10">
                <span className="text-sm text-muted-foreground">
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page * limit >= total}>
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageMainboardBankers;
