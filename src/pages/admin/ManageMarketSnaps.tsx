import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit, Loader2, PlayCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SocialMedia {
  id: number;
  title: string;
  url: string;
  img_url: string;
  status: string;
  created_at: string;
}

const ManageMarketSnaps = () => {
  const [videos, setVideos] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: "", url: "", img_url: "", status: "published" });

  const fetchVideos = async (currentPage = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/social_media?page=${currentPage}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        setVideos(data.data);
        setTotalPages(data.pagination.totalPages || 1);
        setPage(data.pagination.page);
      } else {
        throw new Error("Failed to load videos");
      }
    } catch (err) {
      toast.error("Failed to load market snaps videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(page);
  }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = editingId !== null;
      const url = isEdit ? `/api/social_media/${editingId}` : "/api/social_media";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Operation failed");
      
      toast.success(isEdit ? "Video updated successfully" : "Video added successfully");
      setIsDialogOpen(false);
      setFormData({ title: "", url: "", img_url: "", status: "published" });
      setEditingId(null);
      fetchVideos(page);
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    try {
      const res = await fetch(`/api/social_media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Video deleted successfully");
      fetchVideos(page);
    } catch (err) {
      toast.error("Failed to delete video");
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({ title: "", url: "", img_url: "", status: "published" });
    setIsDialogOpen(true);
  };

  const openEdit = (video: SocialMedia) => {
    setEditingId(video.id);
    setFormData({ title: video.title, url: video.url, img_url: video.img_url || "", status: video.status });
    setIsDialogOpen(true);
  };

  const extractYoutubeId = (url: string) => {
    if (!url) return null;
    if (!url.includes('/')) {
        const potentialId = url.split('?')[0];
        if (potentialId.length === 11) return potentialId;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getVideoLink = (url: string) => {
    if (!url) return "#";
    if (!url.includes('/')) {
        const id = url.split('?')[0];
        if (id.length === 11) return `https://www.youtube.com/watch?v=${id}`;
    }
    return url;
  };

  const getThumbnail = (video: SocialMedia) => {
    if (video.img_url && video.img_url.startsWith('http')) return video.img_url;
    
    let yId = extractYoutubeId(video.url);
    if (!yId && video.img_url && !video.img_url.startsWith('http')) {
        const fallbackId = video.img_url.split('?')[0];
        if (fallbackId.length === 11) yId = fallbackId;
    }

    if (yId && yId.length === 11) return `https://img.youtube.com/vi/${yId}/hqdefault.jpg`;
    return "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-heading">Market Snaps (Social Media)</h1>
            <p className="text-sm text-muted-foreground">Manage IPO Video Updates</p>
          </div>
          <Button onClick={openAdd} className="bg-primary text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" /> Add Video
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            Loading videos...
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border rounded-xl bg-card shadow-sm">
            No videos found yet. Add one to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col group">
                <div className="relative aspect-video bg-muted overflow-hidden">
                  <img src={getThumbnail(video)} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full text-white ${video.status === 'published' ? 'bg-green-500/90' : 'bg-gray-500/90'}`}>
                      {video.status}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={getVideoLink(video.url)} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-colors text-white">
                      <PlayCircle className="w-8 h-8" />
                    </a>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-foreground line-clamp-2 mb-2">{video.title}</h3>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
                    <span className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(video.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(video)} className="h-8 w-8 p-0 text-muted-foreground hover:text-primary">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(video.id)} className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Details Admin */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
            <span className="text-sm font-medium px-4">Page {page} of {totalPages}</span>
            <Button variant="outline" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Video" : "Add New Video"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Video Title *</label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="IPO Analysis..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Video URL (YouTube/Other) *</label>
                <Input required value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} placeholder="https://youtube.com/watch?v=..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Custom Thumbnail URL (Optional)</label>
                <Input value={formData.img_url} onChange={e => setFormData({...formData, img_url: e.target.value})} placeholder="Leaves blank for auto YouTube thumbnail" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingId ? "Update" : "Add"} Video</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ManageMarketSnaps;
