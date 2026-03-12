import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { ipoListApi } from "@/services/api";

interface IPO {
  id: number;
  logo: string | number;
  issuer_company: string | number;
  date_declared: string | number;
  open_date: string | number;
  close_date: string | number;
  listing_date: string | number;
  merchant_bankers: string | number;
  issue_lowest_price: string | number;
  issue_highest_price: string | number;
  issue_size: string | number;
  lot_size: string | number;
  exchange: string | number;
  gmp: string | number;
  issue_category: string | number;
  sector_id: string | number;
  merchant_banker: string | number;
  current_price: string | number;
  ipo_pe_ratio: string | number;
  listing_day_close_bse: string | number;
  listing_day_close_nse: string | number;
  status: string | number;
  upcoming: string | number;
  confidential: string | number;
  upcoming_ipo_status: string | number;
  admin_blog_id: string | number;
}

const statusColor: Record<string, string> = {
  active: "bg-success/15 text-success border-success/30",
  upcoming: "bg-info/15 text-info border-info/30",
  closed: "bg-destructive/15 text-destructive border-destructive/30",
  listed: "bg-accent/15 text-accent border-accent/30",
  Active: "bg-success/15 text-success border-success/30",
  Inactive: "bg-destructive/15 text-destructive border-destructive/30",
};

const emptyIPO: Omit<IPO, "id"> = {
  logo: "", issuer_company: "", date_declared: "", open_date: "", close_date: "",
  listing_date: "", merchant_bankers: "", issue_lowest_price: 0, issue_highest_price: 0,
  issue_size: 0, lot_size: 0, exchange: "", gmp: 0, issue_category: "", sector_id: 0,
  merchant_banker: "", current_price: 0, ipo_pe_ratio: 0, listing_day_close_bse: 0,
  listing_day_close_nse: 0, status: "Active", upcoming: "0", confidential: "0",
  upcoming_ipo_status: "", admin_blog_id: 0
};

const ManageIPOs = () => {
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectors, setSectors] = useState<{id: number, sector_name: string}[]>([]);
  const [form, setForm] = useState<Omit<IPO, "id">>(emptyIPO);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  useEffect(() => {
    fetchIPOs();
    fetchSectors();
  }, [pagination.page, searchTerm]);

  const fetchSectors = async () => {
    try {
      const data = await ipoListApi.getSectors();
      setSectors(data);
    } catch (e) {}
  };

  const fetchIPOs = async () => {
    try {
      setLoading(true);
      const res = await ipoListApi.getAll({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: searchTerm
      });
      setIpos(res.data);
      setPagination(prev => ({ ...prev, total: res.pagination.total, totalPages: res.pagination.totalPages }));
    } catch (error) {
      toast.error("Failed to fetch IPOs");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.issuer_company) { toast.error("Company name is required"); return; }
    try {
      if (editingId) {
        await ipoListApi.update(editingId.toString(), form);
        toast.success("IPO updated!");
      } else {
        await ipoListApi.create(form);
        toast.success("IPO added!");
      }
      setForm(emptyIPO);
      setEditingId(null);
      setDialogOpen(false);
      fetchIPOs();
    } catch (error) {
      toast.error("Failed to save IPO");
    }
  };

  const handleEdit = (ipo: IPO) => {
    const { id, ...rest } = ipo;
    setForm(rest);
    setEditingId(id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this IPO?")) return;
    try {
      await ipoListApi.delete(id.toString());
      toast.success("IPO deleted!");
      fetchIPOs();
    } catch (error) {
      toast.error("Failed to delete IPO");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage IPO Master List</h1>
            <p className="text-sm text-muted-foreground">{pagination.total} IPOs total in database</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search company..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
              />
            </div>
            <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setForm(emptyIPO); setEditingId(null); } }}>
              <DialogTrigger asChild>
                <Button className="bg-accent text-accent-foreground hover:bg-gold-light font-semibold">
                  <Plus className="h-4 w-4 mr-2" /> Add IPO
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Edit IPO" : "Add New IPO"}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <div className="col-span-full">
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Company Name *</label>
                    <Input value={form.issuer_company} onChange={(e) => setForm({ ...form, issuer_company: e.target.value })} />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Logo URL</label>
                    <Input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Issue Category</label>
                    <Select value={String(form.issue_category)} onValueChange={(v) => setForm({ ...form, issue_category: v })}>
                      <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mainline">Mainline</SelectItem>
                        <SelectItem value="sme">SME</SelectItem>
                        <SelectItem value="mainboard">Mainboard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Exchange</label>
                    <Input value={form.exchange} onChange={(e) => setForm({ ...form, exchange: e.target.value })} placeholder="BSE, NSE" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Open Date</label>
                    <Input type="date" value={String(form.open_date).split('T')[0]} onChange={(e) => setForm({ ...form, open_date: e.target.value })} />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Close Date</label>
                    <Input type="date" value={String(form.close_date).split('T')[0]} onChange={(e) => setForm({ ...form, close_date: e.target.value })} />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Listing Date</label>
                    <Input type="date" value={String(form.listing_date).split('T')[0]} onChange={(e) => setForm({ ...form, listing_date: e.target.value })} />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Sector</label>
                    <Select value={String(form.sector_id)} onValueChange={(v) => setForm({ ...form, sector_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Select Sector" /></SelectTrigger>
                      <SelectContent>
                        {sectors.map(s => (
                          <SelectItem key={s.id} value={String(s.id)}>{s.sector_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Issue Size (Cr)</label>
                    <Input type="number" value={form.issue_size} onChange={(e) => setForm({ ...form, issue_size: e.target.value })} />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Lot Size</label>
                    <Input type="number" value={form.lot_size} onChange={(e) => setForm({ ...form, lot_size: e.target.value })} />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Price Band (Low)</label>
                    <Input type="number" value={form.issue_lowest_price} onChange={(e) => setForm({ ...form, issue_lowest_price: e.target.value })} />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Price Band (High)</label>
                    <Input type="number" value={form.issue_highest_price} onChange={(e) => setForm({ ...form, issue_highest_price: e.target.value })} />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">GMP</label>
                    <Input type="number" value={form.gmp} onChange={(e) => setForm({ ...form, gmp: e.target.value })} />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Status</label>
                    <Select value={String(form.status)} onValueChange={(v) => setForm({ ...form, status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Upcoming</label>
                    <Select value={String(form.upcoming)} onValueChange={(v) => setForm({ ...form, upcoming: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No</SelectItem>
                        <SelectItem value="1">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Confidential</label>
                    <Select value={String(form.confidential)} onValueChange={(v) => setForm({ ...form, confidential: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No</SelectItem>
                        <SelectItem value="1">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-full">
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Merchant Bankers</label>
                    <Textarea value={form.merchant_bankers} onChange={(e) => setForm({ ...form, merchant_bankers: e.target.value })} rows={2} />
                  </div>

                  <Button onClick={handleSave} className="col-span-full bg-accent text-accent-foreground hover:bg-gold-light font-semibold h-12">
                    {editingId ? "Update IPO Data" : "Save New IPO"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 font-semibold">Company</th>
                <th className="text-left py-3 px-4 font-semibold">Category</th>
                <th className="text-left py-3 px-4 font-semibold">Size (Cr)</th>
                <th className="text-left py-3 px-4 font-semibold">Dates</th>
                <th className="text-left py-3 px-4 font-semibold">GMP</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr></thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-accent" />
                        <p className="text-muted-foreground">Loading IPO data...</p>
                      </div>
                    </td>
                  </tr>
                ) : ipos.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center text-muted-foreground">No IPOs found</td>
                  </tr>
                ) : ipos.map((ipo) => (
                  <tr key={ipo.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{ipo.issuer_company}</td>
                    <td className="py-3 px-4 capitalize">{ipo.issue_category}</td>
                    <td className="py-3 px-4">₹{ipo.issue_size}</td>
                    <td className="py-3 px-4 text-xs">
                      {ipo.open_date ? String(ipo.open_date).split('T')[0] : 'N/A'} to {ipo.close_date ? String(ipo.close_date).split('T')[0] : 'N/A'}
                    </td>
                    <td className="py-3 px-4">₹{ipo.gmp}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={statusColor[String(ipo.status)] || ""}>{String(ipo.status)}</Badge>
                      {ipo.upcoming === "1" && <Badge className="ml-1 bg-blue-500/10 text-blue-500 border-blue-500/30">Upcoming</Badge>}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(ipo)}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(ipo.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <div className="text-xs text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-xs font-medium px-2">Page {pagination.page} of {pagination.totalPages}</div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageIPOs;
