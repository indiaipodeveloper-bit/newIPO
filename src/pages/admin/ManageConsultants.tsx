import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Save, X, Upload, Users, Eye, EyeOff, Image as ImageIcon } from "lucide-react";

interface Consultant {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  experience_years: number;
  specialization: string | null;
  office_location: string | null;
  success_stories: string | null;
  tags: string | null;
}

const ManageConsultants = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [newData, setNewData] = useState({ 
    name: "", 
    description: "", 
    sort_order: 0,
    experience_years: 0,
    specialization: "",
    office_location: "",
    success_stories: "",
    tags: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Consultant>>({});
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/consultants");
      if (res.ok) setConsultants(await res.json());
    } catch (err) { console.error(err); }
  };

  const add = async () => {
    if (!newData.name) return toast.error("Name required");

    try {
      const res = await fetch("/api/consultants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newData,
          sort_order: newData.sort_order || consultants.length
        })
      });
      if (!res.ok) throw new Error("Failed to add consultant");
      toast.success("Added successfully!"); 
      setNewData({ 
        name: "", description: "", sort_order: 0,
        experience_years: 0, specialization: "", office_location: "",
        success_stories: "", tags: ""
      }); 
      setShowNew(false); 
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this consultant? This will also delete their enquiries.")) return;
    try {
      const res = await fetch(`/api/consultants/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted!");
        fetchData();
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      toast.error("Error deleting");
    }
  };

  const toggle = async (c: Consultant) => {
    await fetch(`/api/consultants/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !c.is_active ? 1 : 0 })
    });
    fetchData();
  };

  const startEdit = (c: Consultant) => { 
    setEditingId(c.id); 
    setEditData({ ...c }); 
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const res = await fetch(`/api/consultants/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData)
      });
      if (res.ok) {
        toast.success("Updated!"); 
        setEditingId(null); 
        fetchData();
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Failed to update");
      }
    } catch (err) {
      toast.error("Error updating");
    }
  };

  const uploadImage = async (id: string, file: File) => {
    setUploading(id);
    const formData = new FormData();
    formData.append("folder", "consultant");
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();

      const updateRes = await fetch(`/api/consultants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: url })
      });
      
      if (updateRes.ok) {
        toast.success("Image uploaded and updated!");
        fetchData();
      } else {
        throw new Error("Failed to link image to consultant");
      }
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
            <h1 className="text-2xl font-bold text-foreground font-heading">Manage Consultants</h1>
            <p className="text-sm text-muted-foreground">{consultants.length} IPO consultants listed</p>
          </div>
          <Button onClick={() => setShowNew(true)} className="bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4 mr-2" /> Add Consultant
          </Button>
        </div>

        {showNew && (
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-xl shadow-primary/5">
            <h3 className="font-bold text-lg flex items-center gap-2 text-primary">
              <Plus className="h-5 w-5" /> New Consultant Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Consultant Name*</label>
                <Input placeholder="e.g. IPO Advisory in Kolkata..." value={newData.name} onChange={(e) => setNewData({ ...newData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Expertise / Specialization</label>
                <Input placeholder="e.g. Manufacturing, Tech, SME" value={newData.specialization} onChange={(e) => setNewData({ ...newData, specialization: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Office Location</label>
                <Input placeholder="e.g. Delhi, Mumbai" value={newData.office_location} onChange={(e) => setNewData({ ...newData, office_location: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Experience (Years)</label>
                <Input type="number" value={newData.experience_years} onChange={(e) => setNewData({ ...newData, experience_years: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sort Order</label>
                <Input type="number" value={newData.sort_order} onChange={(e) => setNewData({ ...newData, sort_order: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tags (comma separated)</label>
                <Input placeholder="IPO, Listing, Strategy" value={newData.tags} onChange={(e) => setNewData({ ...newData, tags: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-3">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Company Description / Intro</label>
                <textarea 
                  className="w-full min-h-[80px] px-3 py-2 rounded-xl border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Tell us about this service..." 
                  value={newData.description} 
                  onChange={(e) => setNewData({ ...newData, description: e.target.value })} 
                />
              </div>
              <div className="space-y-2 md:col-span-3">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Success Stories / Achievements</label>
                <textarea 
                  className="w-full min-h-[100px] px-3 py-2 rounded-xl border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="List some major IPOs handled or successes..." 
                  value={newData.success_stories} 
                  onChange={(e) => setNewData({ ...newData, success_stories: e.target.value })} 
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={add} className="bg-primary text-primary-foreground"><Save className="h-4 w-4 mr-2" /> Save Profile</Button>
              <Button variant="ghost" onClick={() => setShowNew(false)}><X className="h-4 w-4 mr-2" /> Cancel</Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {consultants.map((c) => (
            <div key={c.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              {editingId === c.id ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Name</label>
                      <Input value={editData.name || ""} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Specialization</label>
                      <Input value={editData.specialization || ""} onChange={(e) => setEditData({ ...editData, specialization: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Location</label>
                      <Input value={editData.office_location || ""} onChange={(e) => setEditData({ ...editData, office_location: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Exp (Yrs)</label>
                      <Input type="number" value={editData.experience_years || 0} onChange={(e) => setEditData({ ...editData, experience_years: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Sort Order</label>
                      <Input type="number" value={editData.sort_order || 0} onChange={(e) => setEditData({ ...editData, sort_order: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Tags</label>
                      <Input value={editData.tags || ""} onChange={(e) => setEditData({ ...editData, tags: e.target.value })} />
                    </div>
                    <div className="space-y-2 md:col-span-3">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Description</label>
                      <textarea 
                        className="w-full min-h-[80px] px-3 py-2 rounded-xl border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={editData.description || ""} 
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })} 
                      />
                    </div>
                    <div className="space-y-2 md:col-span-3">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Success Stories</label>
                      <textarea 
                        className="w-full min-h-[100px] px-3 py-2 rounded-xl border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={editData.success_stories || ""} 
                        onChange={(e) => setEditData({ ...editData, success_stories: e.target.value })} 
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button size="sm" onClick={saveEdit} className="bg-primary text-primary-foreground px-6"><Save className="h-4 w-4 mr-2" /> Save Changes</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="h-4 w-4 mr-2" /> Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    <div className="w-20 h-20 rounded-2xl bg-primary/5 flex items-center justify-center overflow-hidden shrink-0 border border-primary/10 shadow-inner group relative">
                      {c.image_url ? (
                        <img src={`/${c.image_url}`} alt={c.name} className="w-full h-full object-cover" />
                      ) : (
                        <Users className="h-10 w-10 text-primary/20" />
                      )}
                      {uploading === c.id && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-foreground text-lg leading-tight truncate">{c.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{c.description || "No description provided."}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-[10px] font-mono">Order: {c.sort_order}</Badge>
                        {!c.is_active && <Badge variant="secondary" className="text-[10px]">Hidden</Badge>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadImage(c.id, file);
                        }}
                      />
                      <Button size="sm" variant="outline" asChild disabled={uploading === c.id} className="h-9">
                        <span>
                          <Upload className="h-3.5 w-3.5 mr-1.5" />
                          {uploading === c.id ? "Uploading..." : "Upload Image"}
                        </span>
                      </Button>
                    </label>
                    <Button size="sm" variant="ghost" onClick={() => startEdit(c)} className="h-9 w-9 p-0">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => toggle(c)} className="h-9 w-9 p-0">
                      {c.is_active ? <Eye className="h-4 w-4 text-green-600" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive h-9 w-9 p-0" onClick={() => del(c.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {consultants.length === 0 && (
            <div className="text-center py-12 bg-card border border-dashed border-border rounded-xl">
              <Users className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />

              <h3 className="text-lg font-medium text-foreground">No Consultants Yet</h3>
              <p className="text-sm text-muted-foreground">Add your first IPO consultant to get started.</p>
              <Button onClick={() => setShowNew(true)} variant="outline" className="mt-4">
                <Plus className="h-4 w-4 mr-2" /> Add Consultant
              </Button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageConsultants;
