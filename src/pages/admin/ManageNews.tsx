import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import RichEditor from "@/components/ui/RichEditor";

interface NewsItem {
  id: number;
  title: string;
  description: string;
  content: string;
  published_at: string;
  image: string;
  category: string;
  status?: string;
  created_at?: string;
  slug?: string;
}

const CATEGORIES = ["IPO", "Equity", "NSE", "BSE", "SEBI", "Economy"];
const emptyForm = { title: "", description: "", content: "", published_at: new Date().toISOString().split('T')[0], image: "", category: "IPO" };

const ManageNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Filters
  const [filterCategory, setFilterCategory] = useState("All");

  const fetchNews = async () => {
    try {
      setLoading(true);
      const url = filterCategory !== "All" ? `/api/news?category=${filterCategory}` : "/api/news";
      const res = await fetch(url);
      if (res.ok) setNews(await res.json());
    } catch (err) {
      toast.error("Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNews(); }, [filterCategory]);

  const handleSave = async () => {
    if (!form.title) { toast.error("Title required"); return; }
    setSaving(true);
    try {
      const url = editingId ? `/api/news/${editingId}` : "/api/news";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save failed");
      }
      toast.success(editingId ? "News updated!" : "News created!");
      setForm(emptyForm);
      setEditingId(null);
      setDialogOpen(false);
      fetchNews();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (n: NewsItem) => {
    setForm({
      title: n.title, description: n.description || "", content: n.content || "",
      published_at: (n.published_at || "").split('T')[0] || emptyForm.published_at, image: n.image || "",
      category: n.category || "IPO"
    });
    setEditingId(n.id);
    setDialogOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("folder", "news");
    formData.append("file", file);

    const tId = toast.loading("Uploading image...");
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setForm({ ...form, image: data.url });
      toast.success("Image uploaded successfully!", { id: tId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image", { id: tId });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this news article?")) return;
    try {
      await fetch(`/api/news/${id}`, { method: "DELETE" });
      toast.success("News deleted");
      fetchNews();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-heading">Manage News & Updates</h1>
            <p className="text-sm text-muted-foreground">{news.length} articles found</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>

            <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setForm(emptyForm); setEditingId(null); } }}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground font-semibold"><Plus className="h-4 w-4 mr-2" /> Add News</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>{editingId ? "Edit News Article" : "Create News Article"}</DialogTitle></DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Headline / Title *</label>
                    <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="News Headline" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Category</label>
                      <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Date</label>
                      <Input type="date" value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Image URL / Upload</label>
                    <div className="flex gap-2">
                        <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="flex-1" />
                        <div className="relative">
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" title="Upload Image" />
                            <Button type="button" variant="outline" className="shrink-0 flex items-center gap-2 pointer-events-none">
                              <ImageIcon className="w-4 h-4" /> Upload
                            </Button>
                        </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Short Description</label>
                    <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Brief summary of the news" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full Content *</label>
                    <RichEditor value={form.content} onChange={(val) => setForm({ ...form, content: val })} placeholder="Full HTML or text content here..." />
                  </div>
                  <Button onClick={handleSave} disabled={saving} className="w-full bg-primary text-primary-foreground font-semibold">
                    {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : editingId ? "Update News" : "Publish News"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />Loading news...</div>
        ) : (
          <div className="bg-card border border-border rounded-xl hidden md:block overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/50">
                  <th className="text-left font-semibold py-3 px-4 w-12">Image</th>
                  <th className="text-left py-3 px-4 font-semibold max-w-[300px]">Headline</th>
                  <th className="text-left py-3 px-4 font-semibold">Category</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr></thead>
                <tbody>
                  {news.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No news found in this category.</td></tr>
                  ) : news.map((n) => (
                    <tr key={n.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-2 px-4">
                        {n.image ? (
                            <img src={getImageUrl(n.image)} alt="" className="w-10 h-10 rounded object-cover" />
                        ) : (
                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center"><ImageIcon className="h-4 w-4 text-muted-foreground" /></div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium max-w-[300px]">
                        <div className="truncate">{n.title}</div>
                        <div className="text-xs text-muted-foreground truncate font-normal">{n.description}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{n.category}</Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{(n.published_at || "").split('T')[0]}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={n.status === "published" ? "bg-success/15 text-success border-success/30" : "bg-muted text-muted-foreground"}>
                          {n.status || "published"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(n)}><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(n.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Mobile View */}
        {!loading && (
            <div className="grid grid-cols-1 gap-4 md:hidden">
                 {news.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground border rounded-xl bg-card">No news found.</div>
                  ) : news.map(n => (
                    <div key={n.id} className="bg-card border rounded-xl p-4 flex gap-4">
                        {n.image && <img src={getImageUrl(n.image)} alt="" className="w-16 h-16 rounded object-cover shrink-0" />}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{n.category}</Badge>
                                <span className="text-[10px] text-muted-foreground">{(n.published_at||"").split('T')[0]}</span>
                            </div>
                            <h4 className="font-semibold text-sm line-clamp-2 leading-tight mb-2">{n.title}</h4>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="h-7 text-xs flex-1" onClick={() => handleEdit(n)}>Edit</Button>
                                <Button variant="outline" size="sm" className="h-7 text-xs flex-1 text-destructive" onClick={() => handleDelete(n.id)}>Delete</Button>
                            </div>
                        </div>
                    </div>
                  ))}
            </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageNews;
