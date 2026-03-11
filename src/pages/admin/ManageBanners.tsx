import AdminLayout from "@/components/AdminLayout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, GripVertical, Image, Eye, EyeOff, Upload } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  cta_text: string | null;
  cta_link: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

const ManageBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", subtitle: "", image_url: "", cta_text: "", cta_link: "" });

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/banners");
      if (res.ok) setBanners(await res.json());
      setLoading(false);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("folder", "banners");
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setForm({ ...form, image_url: url });
      setUploading(false);
      toast.success("Image uploaded!");
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
      setUploading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.image_url) { toast.error("Please upload an image"); return; }
    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title || null,
          subtitle: form.subtitle || null,
          image_url: form.image_url,
          cta_text: form.cta_text || null,
          cta_link: form.cta_link || null,
          sort_order: banners.length + 1,
        })
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Banner added!");
      setForm({ title: "", subtitle: "", image_url: "", cta_text: "", cta_link: "" });
      setShowForm(false);
      fetchBanners();
    } catch (err: any) { toast.error(err.message); }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/banners/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !current })
      });
      fetchBanners();
    } catch (err) { console.error(err); }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    try {
      await fetch(`/api/banners/${id}`, { method: "DELETE" });
      toast.success("Banner deleted");
      fetchBanners();
    } catch (err) { console.error(err); }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage Hero Banners</h1>
            <p className="text-sm text-muted-foreground">Add, reorder, and manage homepage hero slider images</p>
          </div>
          <Button className="bg-primary text-primary-foreground" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Banner
          </Button>
        </div>

        {showForm && (
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-foreground">New Banner</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Banner Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Input placeholder="CTA Button Text" value={form.cta_text} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} />
              <Input placeholder="CTA Link (e.g. /services)" value={form.cta_link} onChange={(e) => setForm({ ...form, cta_link: e.target.value })} />
              <div>
                <label className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-lg px-4 py-2 hover:border-primary transition-colors">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{uploading ? "Uploading..." : form.image_url ? "Image uploaded ✓" : "Upload Banner Image"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              </div>
            </div>
            <Textarea placeholder="Subtitle / Description" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
            {form.image_url && (
              <img src={form.image_url} alt="Preview" className="h-32 w-full object-cover rounded-lg" />
            )}
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="bg-primary text-primary-foreground">Save Banner</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading banners…</div>
          ) : banners.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No banners yet. Add your first one above.</div>
          ) : (
            banners.map((banner) => (
              <div key={banner.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                <GripVertical className="h-5 w-5 text-muted-foreground shrink-0 cursor-grab" />
                <div className="w-32 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                  {banner.image_url ? (
                    <img src={banner.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Image className="h-6 w-6 text-muted-foreground" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{banner.title || "Untitled Banner"}</h3>
                  <p className="text-xs text-muted-foreground truncate">{banner.subtitle || "No description"}</p>
                  <p className="text-xs text-primary mt-1">{banner.cta_text} → {banner.cta_link}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    {banner.is_active ? <Eye className="h-4 w-4 text-brand-green" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                    <Switch checked={banner.is_active} onCheckedChange={() => toggleActive(banner.id, banner.is_active)} />
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteBanner(banner.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageBanners;
