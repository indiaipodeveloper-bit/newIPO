import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Video, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VideoItem {
  id: string;
  title: string;
  youtube_id: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
}

const ManageVideos = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [form, setForm] = useState({ title: "", youtube_id: "", description: "", sort_order: 0, is_active: true });

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/videos");
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVideos(); }, []);

  const extractYoutubeId = (input: string): string => {
    // Support full URLs or just IDs
    const match = input.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
    if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();
    return input.trim();
  };

  const handleSave = async () => {
    if (!form.title || !form.youtube_id) {
      toast.error("Title aur YouTube ID/URL dalna zaroori hai");
      return;
    }

    const youtubeId = extractYoutubeId(form.youtube_id);
    const payload = { ...form, youtube_id: youtubeId };

    try {
      if (editingVideo) {
        const res = await fetch(`/api/videos/${editingVideo.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Update failed");
        toast.success("Video updated!");
      } else {
        const res = await fetch("/api/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Insert failed");
        toast.success("Video added!");
      }
    } catch (err: any) {
      toast.error(err.message);
      return;
    }

    setDialogOpen(false);
    setEditingVideo(null);
    setForm({ title: "", youtube_id: "", description: "", sort_order: 0, is_active: true });
    fetchVideos();
  };

  const handleEdit = (v: VideoItem) => {
    setEditingVideo(v);
    setForm({ title: v.title, youtube_id: v.youtube_id, description: v.description || "", sort_order: v.sort_order, is_active: v.is_active });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Kya aap ye video delete karna chahte hain?")) return;
    await fetch(`/api/videos/${id}`, { method: "DELETE" });
    toast.success("Video deleted");
    fetchVideos();
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    await fetch(`/api/videos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: active })
    });
    fetchVideos();
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold font-heading text-foreground">Manage IPO Videos</h1>
            <p className="text-sm text-muted-foreground">YouTube videos add/edit karein — homepage pe dikhenge</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingVideo(null); setForm({ title: "", youtube_id: "", description: "", sort_order: 0, is_active: true }); } }}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground"><Plus className="h-4 w-4 mr-2" />Add Video</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingVideo ? "Edit Video" : "Add New Video"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Title *</label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. SEDEMAC Mechatronics IPO" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">YouTube URL or Video ID *</label>
                  <Input value={form.youtube_id} onChange={(e) => setForm({ ...form, youtube_id: e.target.value })} placeholder="e.g. https://youtube.com/watch?v=abc123 or abc123" />
                  <p className="text-xs text-muted-foreground mt-1">Full URL ya sirf Video ID paste karein</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description" rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Sort Order</label>
                    <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                    <span className="text-sm">Active</span>
                  </div>
                </div>
                <Button onClick={handleSave} className="w-full bg-primary text-primary-foreground">{editingVideo ? "Update" : "Add"} Video</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : videos.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Video className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Koi video nahi hai. "Add Video" button se shuru karein.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((v) => (
              <div key={v.id} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="relative aspect-video">
                  <img
                    src={`https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`}
                    alt={v.title}
                    className="w-full h-full object-cover"
                  />
                  {!v.is_active && (
                    <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                      <span className="bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded">INACTIVE</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-1">{v.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">ID: {v.youtube_id} • Order: {v.sort_order}</p>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(v)}>
                      <Pencil className="h-3 w-3 mr-1" />Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDelete(v.id)}>
                      <Trash2 className="h-3 w-3 mr-1" />Delete
                    </Button>
                    <div className="ml-auto flex items-center gap-2">
                      <Switch checked={v.is_active} onCheckedChange={(val) => handleToggleActive(v.id, val)} />
                    </div>
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

export default ManageVideos;
