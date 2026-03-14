import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Save, X, Upload, FileText, Eye, ExternalLink, Image as ImageIcon, Loader2 } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface DailyDigest {
  id: number;
  title: string;
  image: string | null;
  pdf: string | null;
  created_at: string;
  updated_at: string;
}

const ManageDailyDigests = () => {
  const [digests, setDigests] = useState<DailyDigest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newData, setNewData] = useState({ title: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<DailyDigest>>({});
  const [uploading, setUploading] = useState<{ id: number; type: 'image' | 'pdf' } | null>(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { fetchData(page); }, [page]);

  const fetchData = async (currentPage: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/daily-digests?page=${currentPage}&limit=10`);
      if (res.ok) {
        const result = await res.json();
        setDigests(result.data);
        setTotalPages(result.pagination.totalPages);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const add = async () => {
    if (!newData.title) return toast.error("Title required");

    try {
      const res = await fetch("/api/daily-digests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newData.title })
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Added!"); 
      setNewData({ title: "" }); 
      setShowNew(false); 
      fetchData(page);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Are you sure you want to delete this digest?")) return;
    try {
      const res = await fetch(`/api/daily-digests/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Deleted!"); 
      fetchData(page);
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const startEdit = (d: DailyDigest) => { 
    setEditingId(d.id); 
    setEditData({ ...d }); 
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const res = await fetch(`/api/daily-digests/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData)
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Updated!"); 
      setEditingId(null); 
      fetchData(page);
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  const handleUpload = async (id: number, file: File, type: 'image' | 'pdf') => {
    setUploading({ id, type });
    const formData = new FormData();
    formData.append("folder", "dailydigest/" + type);
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();

      // Update the digest with the new URL
      const updateRes = await fetch(`/api/daily-digests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [type]: url })
      });
      
      if (!updateRes.ok) throw new Error("Failed to update digest record");
      
      toast.success(`${type === 'image' ? 'Image' : 'PDF'} uploaded!`);
      fetchData(page);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Daily Reporter (Daily Digests)</h1>
            <p className="text-sm text-muted-foreground">Manage daily market reports and updates</p>
          </div>
          <Button onClick={() => setShowNew(true)} className="bg-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" /> Add New Digest
          </Button>
        </div>

        {showNew && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm animate-in fade-in slide-in-from-top-2">
            <h3 className="font-semibold">New Daily Digest</h3>
            <div className="grid grid-cols-1 gap-3">
              <Input 
                placeholder="Title/Headline *" 
                value={newData.title} 
                onChange={(e) => setNewData({ ...newData, title: e.target.value })} 
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={add} className="bg-primary text-primary-foreground"><Save className="h-4 w-4 mr-1" /> Save</Button>
              <Button variant="ghost" onClick={() => setShowNew(false)}><X className="h-4 w-4 mr-1" /> Cancel</Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading digests...</p>
          </div>
        ) : digests.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center">
            <p className="text-muted-foreground">No daily digests found. Click "Add New Digest" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {digests.map((d) => (
              <div key={d.id} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                {editingId === d.id ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Title</label>
                      <Input 
                        value={editData.title || ""} 
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })} 
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveEdit} className="bg-primary text-primary-foreground"><Save className="h-3.5 w-3.5 mr-1" /> Save Changes</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="h-3.5 w-3.5 mr-1" /> Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border">
                        {d.image ? (
                          <img src={getImageUrl(d.image)} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-foreground text-lg truncate">{d.title}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {new Date(d.created_at).toLocaleDateString()}
                          </span>
                          {d.pdf ? (
                            <Badge className="bg-green-100 text-green-700 text-[10px] hover:bg-green-100 border-green-200">PDF Ready</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px]">No PDF</Badge>
                          )}
                          {!d.image && <Badge variant="secondary" className="text-[10px]">No Image</Badge>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap md:flex-nowrap justify-end w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-border/50">
                      {/* Upload Image */}
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUpload(d.id, file, 'image');
                          }}
                        />
                        <Button size="sm" variant="outline" asChild disabled={!!uploading}>
                          <span>
                            <Upload className="h-3.5 w-3.5 mr-1" />
                            {uploading?.id === d.id && uploading?.type === 'image' ? "..." : "Image"}
                          </span>
                        </Button>
                      </label>

                      {/* Upload PDF */}
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUpload(d.id, file, 'pdf');
                          }}
                        />
                        <Button size="sm" variant="outline" asChild disabled={!!uploading}>
                          <span>
                            <Upload className="h-3.5 w-3.5 mr-1" />
                            {uploading?.id === d.id && uploading?.type === 'pdf' ? "..." : "PDF"}
                          </span>
                        </Button>
                      </label>

                      <div className="h-8 w-px bg-border mx-1 hidden md:block"></div>

                      {d.pdf && (
                        <Button size="sm" variant="ghost" asChild>
                          <a href={getImageUrl(d.pdf)} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      
                      <Button size="sm" variant="ghost" onClick={() => startEdit(d)}>
                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      
                      <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => del(d.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
            <span className="text-sm font-medium px-4">Page {page} of {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageDailyDigests;
