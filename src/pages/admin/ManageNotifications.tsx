import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Save, X, Upload, FileText, Eye, EyeOff, ExternalLink } from "lucide-react";

interface NotifPdf {
  id: string; title: string; slug: string; pdf_url: string | null;
  description: string | null; sort_order: number; is_active: boolean;
}

const ManageNotifications = () => {
  const [pdfs, setPdfs] = useState<NotifPdf[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [newData, setNewData] = useState({ title: "", slug: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<NotifPdf>>({});
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) setPdfs(await res.json());
    } catch (err) { console.error(err); }
  };

  const add = async () => {
    if (!newData.title) return toast.error("Title required");
    const slug = newData.slug || newData.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newData.title, slug, description: newData.description || null, sort_order: pdfs.length
        })
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Added!"); setNewData({ title: "", slug: "", description: "" }); setShowNew(false); fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    await fetch(`/api/notifications/${id}`, { method: "DELETE" });
    toast.success("Deleted!"); fetchData();
  };

  const toggle = async (p: NotifPdf) => {
    await fetch(`/api/notifications/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !p.is_active })
    });
    fetchData();
  };

  const startEdit = (p: NotifPdf) => { setEditingId(p.id); setEditData({ ...p }); };

  const saveEdit = async () => {
    if (!editingId) return;
    await fetch(`/api/notifications/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editData.title, description: editData.description
      })
    });
    toast.success("Updated!"); setEditingId(null); fetchData();
  };

  const uploadPdf = async (id: string, file: File) => {
    setUploading(id);
    const formData = new FormData();
    formData.append("folder", "notifications");
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();

      await fetch(`/api/notifications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdf_url: url })
      });
      toast.success("PDF uploaded!");
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notifications & Circulars</h1>
            <p className="text-sm text-muted-foreground">{pdfs.length} notifications — Upload PDFs for each</p>
          </div>
          <Button onClick={() => setShowNew(true)} className="bg-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" /> Add Notification
          </Button>
        </div>

        {showNew && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <h3 className="font-semibold">New Notification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Title *" value={newData.title} onChange={(e) => setNewData({ ...newData, title: e.target.value })} />
              <Input placeholder="Slug (auto)" value={newData.slug} onChange={(e) => setNewData({ ...newData, slug: e.target.value })} />
              <Input placeholder="Description" value={newData.description} onChange={(e) => setNewData({ ...newData, description: e.target.value })} className="md:col-span-2" />
            </div>
            <div className="flex gap-2">
              <Button onClick={add} className="bg-primary text-primary-foreground"><Save className="h-4 w-4 mr-1" /> Save</Button>
              <Button variant="ghost" onClick={() => setShowNew(false)}><X className="h-4 w-4 mr-1" /> Cancel</Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {pdfs.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-xl p-5">
              {editingId === p.id ? (
                <div className="space-y-3">
                  <Input value={editData.title || ""} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
                  <Input value={editData.description || ""} onChange={(e) => setEditData({ ...editData, description: e.target.value })} placeholder="Description" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveEdit} className="bg-primary text-primary-foreground"><Save className="h-3.5 w-3.5 mr-1" /> Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="h-3.5 w-3.5 mr-1" /> Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-5 w-5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground">{p.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px]">{p.slug}</Badge>
                        {p.pdf_url ? (
                          <Badge className="bg-green-100 text-green-700 text-[10px]">PDF Uploaded</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">No PDF</Badge>
                        )}
                        {!p.is_active && <Badge variant="secondary" className="text-[10px]">Hidden</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Upload PDF */}
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadPdf(p.id, file);
                        }}
                      />
                      <Button size="sm" variant="outline" asChild disabled={uploading === p.id}>
                        <span>
                          <Upload className="h-3.5 w-3.5 mr-1" />
                          {uploading === p.id ? "Uploading..." : "Upload PDF"}
                        </span>
                      </Button>
                    </label>
                    {p.pdf_url && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={p.pdf_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5 mr-1" /> View
                        </a>
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => startEdit(p)}><Edit2 className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => toggle(p)}>
                      {p.is_active ? <Eye className="h-3.5 w-3.5 text-green-600" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => del(p.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageNotifications;
