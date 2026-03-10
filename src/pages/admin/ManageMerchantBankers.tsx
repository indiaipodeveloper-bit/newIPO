import AdminLayout from "@/components/AdminLayout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Upload } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface Banker {
  id: string;
  name: string;
  category: string;
  location: string | null;
  sebi_registration: string | null;
  website: string | null;
  services: string | null;
  total_ipos: number | null;
  established_year: number | null;
  description: string | null;
  logo_url: string | null;
  is_active: boolean;
  sort_order: number;
  total_raised: number | null;
  avg_size: number | null;
  avg_subscription: number | null;
}

const emptyForm = {
  name: "", category: "sme", location: "", sebi_registration: "",
  website: "", services: "", total_ipos: "", established_year: "", description: "",
  total_raised: "", avg_size: "", avg_subscription: "", logo_url: "",
};

const ManageMerchantBankers = () => {
  const [bankers, setBankers] = useState<Banker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "sme" | "mainboard">("all");
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/bankers");
      if (res.ok) setBankers(await res.json());
      setLoading(false);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "banners");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setForm({ ...form, logo_url: url });
      toast.success("Logo uploaded!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name) { toast.error("Name is required"); return; }
    const payload = {
      name: form.name,
      category: form.category,
      location: form.location || null,
      sebi_registration: form.sebi_registration || null,
      website: form.website || null,
      services: form.services || null,
      total_ipos: form.total_ipos ? parseInt(form.total_ipos) : null,
      established_year: form.established_year ? parseInt(form.established_year) : null,
      description: form.description || null,
      logo_url: form.logo_url || null,
      total_raised: form.total_raised ? parseFloat(form.total_raised) : null,
      avg_size: form.avg_size ? parseFloat(form.avg_size) : null,
      avg_subscription: form.avg_subscription ? parseFloat(form.avg_subscription) : null,
      sort_order: bankers.length + 1,
    };

    try {
      if (editId) {
        const res = await fetch(`/api/bankers/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Update failed");
        toast.success("Updated!");
      } else {
        const res = await fetch("/api/bankers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Insert failed");
        toast.success("Added!");
      }
      setForm(emptyForm);
      setShowForm(false);
      setEditId(null);
      fetchData();
    } catch (err: any) { toast.error(err.message); }
  };

  const startEdit = (b: Banker) => {
    setForm({
      name: b.name, category: b.category, location: b.location || "",
      sebi_registration: b.sebi_registration || "", website: b.website || "",
      services: b.services || "", total_ipos: b.total_ipos?.toString() || "",
      established_year: b.established_year?.toString() || "", description: b.description || "",
      total_raised: b.total_raised?.toString() || "", avg_size: b.avg_size?.toString() || "",
      avg_subscription: b.avg_subscription?.toString() || "", logo_url: b.logo_url || "",
    });
    setEditId(b.id);
    setShowForm(true);
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/bankers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !current })
      });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const deleteBanker = async (id: string) => {
    if (!confirm("Delete this merchant banker?")) return;
    try {
      await fetch(`/api/bankers/${id}`, { method: "DELETE" });
      toast.success("Deleted");
      fetchData();
    } catch (err) { console.error(err); }
  };

  const filtered = filter === "all" ? bankers : bankers.filter(b => b.category === filter);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage Merchant Bankers</h1>
            <p className="text-sm text-muted-foreground">Add and manage SEBI-registered merchant bankers with stats, logo, and details</p>
          </div>
          <Button className="bg-primary text-primary-foreground" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}>
            <Plus className="h-4 w-4 mr-1" /> Add Banker
          </Button>
        </div>

        <div className="flex gap-2">
          {(["all", "sme", "mainboard"] as const).map((f) => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">
              {f === "all" ? "All" : f.toUpperCase()} ({f === "all" ? bankers.length : bankers.filter(b => b.category === f).length})
            </Button>
          ))}
        </div>

        {showForm && (
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-foreground">{editId ? "Edit" : "Add"} Merchant Banker</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input placeholder="Banker Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="sme">SME</option>
                <option value="mainboard">Mainboard</option>
              </select>
              <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <Input placeholder="SEBI Registration No." value={form.sebi_registration} onChange={(e) => setForm({ ...form, sebi_registration: e.target.value })} />
              <Input placeholder="Website URL" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              <Input placeholder="Total IPOs" type="number" value={form.total_ipos} onChange={(e) => setForm({ ...form, total_ipos: e.target.value })} />
              <Input placeholder="Total Raised (Cr)" type="number" value={form.total_raised} onChange={(e) => setForm({ ...form, total_raised: e.target.value })} />
              <Input placeholder="Avg Size (Cr)" type="number" value={form.avg_size} onChange={(e) => setForm({ ...form, avg_size: e.target.value })} />
              <Input placeholder="Avg Subscription (x)" type="number" value={form.avg_subscription} onChange={(e) => setForm({ ...form, avg_subscription: e.target.value })} />
              <Input placeholder="Established Year" type="number" value={form.established_year} onChange={(e) => setForm({ ...form, established_year: e.target.value })} />
              <Input placeholder="Services (comma separated)" value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })} />
              <div>
                <label className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-lg px-4 py-2 hover:border-primary transition-colors h-10">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground truncate">{uploading ? "Uploading..." : form.logo_url ? "Logo uploaded ✓" : "Upload Logo"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
                </label>
              </div>
            </div>
            <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            {form.logo_url && <img src={form.logo_url} alt="Logo" className="h-16 w-16 rounded-lg object-contain border border-border" />}
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-primary text-primary-foreground">{editId ? "Update" : "Save"}</Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }}>Cancel</Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No bankers found.</div>
          ) : (
            filtered.map((b) => (
              <div key={b.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0 overflow-hidden">
                  {b.logo_url ? <img src={b.logo_url} alt="" className="w-full h-full object-contain" /> : b.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground truncate">{b.name}</span>
                    <Badge variant="outline" className={`text-[10px] ${b.category === "sme" ? "bg-brand-green/15 text-brand-green border-brand-green/30" : "bg-primary/15 text-primary border-primary/30"}`}>
                      {b.category.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {b.location} • {b.total_ipos || 0} IPOs • ₹{b.total_raised || 0} Cr raised • {b.avg_subscription || 0}x avg sub
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch checked={b.is_active} onCheckedChange={() => toggleActive(b.id, b.is_active)} />
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(b)}><Edit className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteBanker(b.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageMerchantBankers;
