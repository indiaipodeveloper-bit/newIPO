import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface IPO {
  id: string;
  companyName: string;
  sector: string;
  issueSize: string;
  openDate: string;
  closeDate: string;
  priceBand: string;
  lotSize: number;
  status: string;
  gmp: string;
  description: string;
}

const initialIPOs: IPO[] = [
  { id: "1", companyName: "TechVista Solutions Ltd", sector: "Technology", issueSize: "₹850 Cr", openDate: "2026-03-10", closeDate: "2026-03-13", priceBand: "₹320-340", lotSize: 44, status: "upcoming", gmp: "+45", description: "Leading IT services company." },
  { id: "2", companyName: "GreenEnergy Power Ltd", sector: "Energy", issueSize: "₹1,200 Cr", openDate: "2026-03-05", closeDate: "2026-03-08", priceBand: "₹550-580", lotSize: 25, status: "open", gmp: "+82", description: "Renewable energy company." },
  { id: "3", companyName: "MedPharma Healthcare", sector: "Healthcare", issueSize: "₹650 Cr", openDate: "2026-02-25", closeDate: "2026-02-28", priceBand: "₹410-430", lotSize: 34, status: "listed", gmp: "+28", description: "Pharma company." },
];

const statusColor: Record<string, string> = {
  open: "bg-success/15 text-success border-success/30",
  upcoming: "bg-info/15 text-info border-info/30",
  closed: "bg-destructive/15 text-destructive border-destructive/30",
  listed: "bg-accent/15 text-accent border-accent/30",
};

const emptyIPO: Omit<IPO, "id"> = { companyName: "", sector: "", issueSize: "", openDate: "", closeDate: "", priceBand: "", lotSize: 0, status: "upcoming", gmp: "", description: "" };

const ManageIPOs = () => {
  const [ipos, setIpos] = useState<IPO[]>(initialIPOs);
  const [form, setForm] = useState<Omit<IPO, "id">>(emptyIPO);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSave = () => {
    if (!form.companyName) { toast.error("Company name is required"); return; }
    if (editingId) {
      setIpos(ipos.map((i) => (i.id === editingId ? { ...form, id: editingId } : i)));
      toast.success("IPO updated!");
    } else {
      setIpos([...ipos, { ...form, id: Date.now().toString() }]);
      toast.success("IPO added!");
    }
    setForm(emptyIPO);
    setEditingId(null);
    setDialogOpen(false);
  };

  const handleEdit = (ipo: IPO) => {
    const { id, ...rest } = ipo;
    setForm(rest);
    setEditingId(id);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setIpos(ipos.filter((i) => i.id !== id));
    toast.success("IPO deleted!");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage IPOs</h1>
            <p className="text-sm text-muted-foreground">{ipos.length} IPOs total</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setForm(emptyIPO); setEditingId(null); } }}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-gold-light font-semibold">
                <Plus className="h-4 w-4 mr-2" /> Add IPO
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit IPO" : "Add New IPO"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div><label className="text-sm font-medium text-foreground mb-1.5 block">Company Name *</label>
                  <Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium text-foreground mb-1.5 block">Sector</label>
                    <Input value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} /></div>
                  <div><label className="text-sm font-medium text-foreground mb-1.5 block">Issue Size</label>
                    <Input value={form.issueSize} onChange={(e) => setForm({ ...form, issueSize: e.target.value })} placeholder="₹850 Cr" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium text-foreground mb-1.5 block">Open Date</label>
                    <Input type="date" value={form.openDate} onChange={(e) => setForm({ ...form, openDate: e.target.value })} /></div>
                  <div><label className="text-sm font-medium text-foreground mb-1.5 block">Close Date</label>
                    <Input type="date" value={form.closeDate} onChange={(e) => setForm({ ...form, closeDate: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium text-foreground mb-1.5 block">Price Band</label>
                    <Input value={form.priceBand} onChange={(e) => setForm({ ...form, priceBand: e.target.value })} placeholder="₹320-340" /></div>
                  <div><label className="text-sm font-medium text-foreground mb-1.5 block">Lot Size</label>
                    <Input type="number" value={form.lotSize || ""} onChange={(e) => setForm({ ...form, lotSize: parseInt(e.target.value) || 0 })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium text-foreground mb-1.5 block">Status</label>
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="listed">Listed</SelectItem>
                      </SelectContent>
                    </Select></div>
                  <div><label className="text-sm font-medium text-foreground mb-1.5 block">GMP</label>
                    <Input value={form.gmp} onChange={(e) => setForm({ ...form, gmp: e.target.value })} placeholder="+45" /></div>
                </div>
                <div><label className="text-sm font-medium text-foreground mb-1.5 block">Description</label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
                <Button onClick={handleSave} className="w-full bg-accent text-accent-foreground hover:bg-gold-light font-semibold">
                  {editingId ? "Update IPO" : "Add IPO"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 font-semibold">Company</th>
                <th className="text-left py-3 px-4 font-semibold hidden md:table-cell">Sector</th>
                <th className="text-left py-3 px-4 font-semibold">Issue Size</th>
                <th className="text-left py-3 px-4 font-semibold hidden lg:table-cell">Dates</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr></thead>
              <tbody>
                {ipos.map((ipo) => (
                  <tr key={ipo.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{ipo.companyName}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{ipo.sector}</td>
                    <td className="py-3 px-4">{ipo.issueSize}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell text-xs">{ipo.openDate} → {ipo.closeDate}</td>
                    <td className="py-3 px-4"><Badge variant="outline" className={statusColor[ipo.status]}>{ipo.status}</Badge></td>
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
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageIPOs;
