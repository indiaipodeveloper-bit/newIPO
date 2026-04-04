import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { getImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichEditor from "@/components/ui/RichEditor";
import {
  Trash2,
  Plus,
  Loader2,
  Image as ImageIcon,
  Edit,
  Globe,
  CheckCircle,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CSREntry {
  id: number;
  title: string;
  image: string;
  dsc: string;
  status: string;
  create_at: string;
}

const DESC_LIMIT = 700;

const ManageCSR = () => {
  const [entries, setEntries] = useState<CSREntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CSREntry | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    dsc: "",
    status: "published",
  });

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/csr");
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (err) {
      toast.error("Failed to load CSR entries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append("folder", "csr");
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();
      if (res.ok) {
        setFormData({ ...formData, image: data.url });
        toast.success("Image uploaded successfully");
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check limit (strip HTML to check plain text length or total length?)
    // Usually user means total length in editor or plain text. Let's check plain text for logical limit.
    const plainText = formData.dsc.replace(/<[^>]*>/g, "");
    if (plainText.length > DESC_LIMIT) {
      return toast.error(`Description cannot exceed ${DESC_LIMIT} characters`);
    }

    try {
      const url = editingEntry ? `/api/csr/${editingEntry.id}` : "/api/csr";
      const method = editingEntry ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(editingEntry ? "Entry updated" : "Entry created");
        setIsDialogOpen(false);
        setEditingEntry(null);
        setFormData({
          title: "",
          image: "",
          dsc: "",
          status: "published",
        });
        fetchEntries();
      } else {
        const data = await res.json();
        toast.error(data.error || "Operation failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this CSR entry?")) return;
    try {
      const res = await fetch(`/api/csr/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Entry deleted");
        fetchEntries();
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (entry: CSREntry) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title,
      image: entry.image,
      dsc: entry.dsc,
      status: entry.status,
    });
    setIsDialogOpen(true);
  };

  const currentLength = formData.dsc.replace(/<[^>]*>/g, "").length;
  const isOverLimit = currentLength > DESC_LIMIT;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-heading">
              Manage Corporate Social Responsibility (CSR)
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage CSR activities with rich text descriptions (Max {DESC_LIMIT} chars)
            </p>
          </div>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditingEntry(null);
                setFormData({
                  title: "",
                  image: "",
                  dsc: "",
                  status: "published",
                });
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add CSR Initiative
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingEntry
                    ? "Edit CSR Initiative"
                    : "Add New CSR Initiative"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Title *</label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. Education for All"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Image</label>
                  <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-xl border border-dashed border-border/60">
                    {formData.image && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden border bg-card shrink-0 shadow-sm">
                        <img
                          src={getImageUrl(formData.image)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <label className="flex-1">
                      <div className="border border-border bg-card rounded-lg p-4 text-center cursor-pointer hover:bg-muted/10 transition-all group">
                        {uploading ? (
                          <Loader2 className="w-6 h-6 animate-spin mx-auto text-accent" />
                        ) : (
                          <>
                            <ImageIcon className="w-6 h-6 mx-auto text-muted-foreground mb-2 group-hover:text-accent group-hover:scale-110 transition-all" />
                            <span className="text-xs text-muted-foreground font-medium">
                              Click to upload image
                            </span>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  <Input
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    placeholder="Or paste image URL"
                    className="h-10 text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-foreground">Description *</label>
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isOverLimit ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent"}`}>
                      {currentLength} / {DESC_LIMIT}
                    </div>
                  </div>
                  <div className={`rounded-lg border overflow-hidden ${isOverLimit ? "border-destructive ring-1 ring-destructive/20" : "border-border"}`}>
                    <RichEditor
                      value={formData.dsc}
                      onChange={(val) => setFormData({ ...formData, dsc: val })}
                    />
                  </div>
                  {isOverLimit && (
                    <p className="text-[10px] text-destructive flex items-center gap-1 font-medium">
                       <AlertCircle className="w-3 h-3" /> Please shorten the description to {DESC_LIMIT} characters.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Status</label>
                  <select
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <Button type="submit" className="w-full h-12 text-base font-bold bg-accent text-accent-foreground hover:bg-accent/90" disabled={uploading || isOverLimit}>
                  {editingEntry ? "Update Initiative" : "Create Initiative"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            Loading entries...
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-card">
            <Globe className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">
              No CSR initiatives found. Start by adding one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="aspect-video relative bg-muted overflow-hidden">
                  {entry.image ? (
                    <img
                      src={getImageUrl(entry.image)}
                      alt={entry.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-10 h-10 text-muted-foreground/20" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${entry.status === "published" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"}`}
                    >
                      {entry.status}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-1">
                    {entry.title}
                  </h3>
                  <div 
                    className="text-sm text-muted-foreground line-clamp-3 mb-6 min-h-[60px]" 
                    dangerouslySetInnerHTML={{ __html: entry.dsc || "No description provided." }} 
                  />
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-primary"
                        onClick={() => handleEdit(entry)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDelete(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Updated {entry.create_at ? new Date(entry.create_at).toLocaleDateString() : 'N/A'}
                    </span>
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

export default ManageCSR;
