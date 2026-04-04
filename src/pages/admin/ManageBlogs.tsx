import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import RichEditor from "@/components/ui/RichEditor";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  status: string;
  author: string;
  tags: string;
  image_url: string | null;
  created_at: string;
}

const emptyForm = { title: "", slug: "", excerpt: "", content: "", category: "", status: "draft", author: "Admin", tags: "", image_url: "" };

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/blogs");
      if (res.ok) setBlogs(await res.json());
    } catch (err) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleSave = async () => {
    if (!form.title) { toast.error("Title required"); return; }
    setSaving(true);
    try {
      const url = editingId ? `/api/blogs/${editingId}` : "/api/blogs";
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
      toast.success(editingId ? "Blog updated!" : "Blog created!");
      setForm(emptyForm);
      setEditingId(null);
      setDialogOpen(false);
      fetchBlogs();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (b: Blog) => {
    setForm({
      title: b.title, slug: b.slug, excerpt: b.excerpt || "",
      content: b.content || "", category: b.category || "",
      status: b.status, author: b.author || "Admin",
      tags: b.tags || "", image_url: b.image_url || "",
    });
    setEditingId(b.id);
    setDialogOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("folder", "blogs");
    formData.append("file", file);

    const tId = toast.loading("Uploading image...");
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setForm({ ...form, image_url: data.url });
      toast.success("Image uploaded successfully!", { id: tId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image", { id: tId });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog?")) return;
    try {
      await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      toast.success("Blog deleted");
      fetchBlogs();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage Blogs</h1>
            <p className="text-sm text-muted-foreground">{blogs.length} posts in database</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setForm(emptyForm); setEditingId(null); } }}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-gold-light font-semibold"><Plus className="h-4 w-4 mr-2" /> New Post</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editingId ? "Edit Post" : "Create New Post"}</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Title *</label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Blog title" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Slug (URL)</label>
                  <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated-from-title" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Category</label>
                    <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. IPO Guide" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Status</label>
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Author</label>
                    <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Author name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Tags (comma separated)</label>
                    <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="IPO, SME, Finance" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Image URL / Upload</label>
                  <div className="flex gap-2">
                    <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="flex-1" />
                    <div className="relative">
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" title="Upload Image" />
                      <Button type="button" variant="outline" className="shrink-0 flex items-center gap-2 pointer-events-none">
                        <ImageIcon className="w-4 h-4" /> Upload
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Excerpt / Summary</label>
                  <Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} placeholder="Short description shown in blog list" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Content *</label>
                  <RichEditor value={form.content} onChange={(val) => setForm({ ...form, content: val })} placeholder="Full blog content here..." />
                </div>
                <Button onClick={handleSave} disabled={saving} className="w-full bg-accent text-accent-foreground hover:bg-gold-light font-semibold">
                  {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : editingId ? "Update Post" : "Create Post"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />Loading blogs...</div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-3 px-4 font-semibold">Title</th>
                  <th className="text-left py-3 px-4 font-semibold hidden md:table-cell">Category</th>
                  <th className="text-left py-3 px-4 font-semibold hidden md:table-cell">Author</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr></thead>
                <tbody>
                  {blogs.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No blogs yet. Create your first post!</td></tr>
                  ) : blogs.map((b) => (
                    <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium max-w-xs">
                        <div className="truncate">{b.title}</div>
                        <div className="text-xs text-muted-foreground truncate">/{b.slug}</div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{b.category || "—"}</td>
                      <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{b.author || "—"}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={b.status === "published" ? "bg-success/15 text-success border-success/30" : "bg-muted text-muted-foreground"}>
                          {b.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{new Date(b.created_at).toLocaleDateString("en-IN")}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(b)}><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(b.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageBlogs;
