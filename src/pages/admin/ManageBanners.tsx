import AdminLayout from "@/components/AdminLayout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, GripVertical, Image, Eye, EyeOff, Upload } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/utils";

interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  cta_text: string | null;
  cta_link: string | null;
  badge_text: string | null;
  cta2_text: string | null;
  cta2_link: string | null;
  sort_order: number;
  is_active: boolean;
  page_path: string | null;
  created_at?: string;
}

const PAGES = [
  { label: "Home Page (Slider)", value: "home" },
  { label: "News & Updates", value: "/news-updates" },
  { label: "Contact Us", value: "/contact" },
  { label: "Consultants", value: "/consultants" },
  { label: "Blog", value: "/blog" },
];

const ManageBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ 
    title: "", 
    subtitle: "", 
    image_url: "", 
    cta_text: "", 
    cta_link: "", 
    badge_text: "", 
    cta2_text: "", 
    cta2_link: "",
    page_path: "home"
  });

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

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Please enter a banner title"); return; }
    if (!form.image_url) { toast.error("Please upload an image"); return; }
    try {
      const url = editingId ? `/api/banners/${editingId}` : "/api/banners";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title || null,
          subtitle: form.subtitle || null,
          image_url: form.image_url,
          cta_text: form.cta_text || null,
          cta_link: form.cta_link || null,
          badge_text: form.badge_text || null,
          cta2_text: form.cta2_text || null,
          cta2_link: form.cta2_link || null,
          page_path: form.page_path === "home" ? null : form.page_path,
          ...(editingId ? {} : { sort_order: banners.length + 1 })
        })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save banner");
      }
      toast.success(editingId ? "Banner updated!" : "Banner added!");
      setForm({ title: "", subtitle: "", image_url: "", cta_text: "", cta_link: "", badge_text: "", cta2_text: "", cta2_link: "", page_path: "home" });
      setShowForm(false);
      setEditingId(null);
      fetchBanners();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleEdit = (banner: Banner) => {
    setForm({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      image_url: banner.image_url || "",
      cta_text: banner.cta_text || "",
      cta_link: banner.cta_link || "",
      badge_text: banner.badge_text || "",
      cta2_text: banner.cta2_text || "",
      cta2_link: banner.cta2_link || "",
      page_path: banner.page_path || "home"
    });
    setEditingId(banner.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            <p className="text-sm text-muted-foreground">Add, reorder, and manage banners for various pages</p>
          </div>
          <Button className="bg-primary text-primary-foreground" onClick={() => {
            setForm({ title: "", subtitle: "", image_url: "", cta_text: "", cta_link: "", badge_text: "", cta2_text: "", cta2_link: "", page_path: "home" });
            setEditingId(null);
            setShowForm(!showForm);
          }}>
            <Plus className="h-4 w-4 mr-1" />
            Add Banner
          </Button>
        </div>

        {showForm && (
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-foreground">{editingId ? "Edit Banner" : "New Banner"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Page</label>
                <select 
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.page_path}
                  onChange={(e) => setForm({ ...form, page_path: e.target.value })}
                >
                  {PAGES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Banner Title</label>
                <Input placeholder="Banner Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              
              <Input placeholder="Badge Text (Optional)" value={form.badge_text} onChange={(e) => setForm({ ...form, badge_text: e.target.value })} />
              <Input placeholder="Primary CTA Text" value={form.cta_text} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} />
              
              <Input placeholder="Primary CTA Link (e.g. /services)" value={form.cta_link} onChange={(e) => setForm({ ...form, cta_link: e.target.value })} />
              <Input placeholder="Secondary CTA Text (Optional)" value={form.cta2_text} onChange={(e) => setForm({ ...form, cta2_text: e.target.value })} />
              
              <Input placeholder="Secondary CTA Link (Optional)" value={form.cta2_link} onChange={(e) => setForm({ ...form, cta2_link: e.target.value })} />
              
              <div className="md:col-span-1">
                <label className="flex items-center h-10 gap-2 cursor-pointer border border-dashed border-border rounded-lg px-4 hover:border-primary transition-colors">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{uploading ? "Uploading..." : form.image_url ? "Image uploaded ✓" : "Upload Banner Image"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              </div>
            </div>
            <Textarea placeholder="Subtitle / Description" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
            {form.image_url && (
              <img src={getImageUrl(form.image_url)} alt="Preview" className="h-32 w-full object-cover rounded-lg" />
            )}
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-primary text-primary-foreground">{editingId ? "Update Banner" : "Save Banner"}</Button>
              <Button variant="outline" onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setForm({ title: "", subtitle: "", image_url: "", cta_text: "", cta_link: "", badge_text: "", cta2_text: "", cta2_link: "", page_path: "home" });
              }}>Cancel</Button>
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
                    <img src={getImageUrl(banner.image_url)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Image className="h-6 w-6 text-muted-foreground" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground truncate">{banner.title || "Untitled Banner"}</h3>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {PAGES.find(p => p.value === (banner.page_path || "home"))?.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{banner.subtitle || "No description"}</p>
                  <p className="text-xs text-primary mt-1">{banner.cta_text} → {banner.cta_link}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    {banner.is_active ? <Eye className="h-4 w-4 text-brand-green" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                    <Switch checked={banner.is_active} onCheckedChange={() => toggleActive(banner.id, banner.is_active)} />
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(banner)}>
                    Edit
                  </Button>
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
