import AdminLayout from "@/components/AdminLayout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Trash2, GripVertical, Image, Eye, EyeOff, Upload, FileText, Lock, Unlock, Globe } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/utils";

interface Magazine {
  id: string;
  title: string;
  pdf: string;
  language: string;
  pdf_lock: boolean | number;
  report_images: string;
  created_at?: string;
  updated_at?: string;
}

const ManageMagazines = () => {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  
  const [form, setForm] = useState({ 
    title: "", 
    pdf: "", 
    language: "english", 
    pdf_lock: 1, 
    report_images: ""
  });

  const fetchMagazines = async () => {
    try {
      const res = await fetch("/api/magazines");
      if (res.ok) setMagazines(await res.json());
      setLoading(false);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchMagazines(); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (type === 'image') setUploadingImage(true);
    else setUploadingPdf(true);

    const formData = new FormData();
    formData.append("folder", "magzine/" + (type === 'image' ? 'images' : 'pdf'));
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      
      if (type === 'image') {
        setForm({ ...form, report_images: url });
        setUploadingImage(false);
        toast.success("Cover image uploaded!");
      } else {
        setForm({ ...form, pdf: url });
        setUploadingPdf(false);
        toast.success("PDF uploaded!");
      }
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
      if (type === 'image') setUploadingImage(false);
      else setUploadingPdf(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Please enter a title"); return; }
    if (!form.report_images) { toast.error("Please upload a cover image"); return; }
    if (!form.pdf) { toast.error("Please upload a PDF file"); return; }
    
    try {
      const url = editingId ? `/api/magazines/${editingId}` : "/api/magazines";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save magazine");
      }
      
      toast.success(editingId ? "Magazine updated!" : "Magazine added!");
      setForm({ title: "", pdf: "", language: "english", pdf_lock: 1, report_images: "" });
      setShowForm(false);
      setEditingId(null);
      fetchMagazines();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleEdit = (mag: Magazine) => {
    setForm({
      title: mag.title,
      pdf: mag.pdf,
      language: mag.language,
      pdf_lock: Number(mag.pdf_lock),
      report_images: mag.report_images
    });
    setEditingId(mag.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteMagazine = async (id: string) => {
    if (!confirm("Are you sure you want to delete this magazine?")) return;
    try {
      const res = await fetch(`/api/magazines/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Magazine deleted");
        fetchMagazines();
      } else {
        throw new Error("Failed to delete");
      }
    } catch (err) { toast.error("Delete failed"); }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage IPO World Magazine</h1>
            <p className="text-sm text-muted-foreground">Add, edit, and delete monthly magazine editions</p>
          </div>
          <Button className="bg-primary text-primary-foreground" onClick={() => {
            setForm({ title: "", pdf: "", language: "english", pdf_lock: 1, report_images: "" });
            setEditingId(null);
            setShowForm(!showForm);
          }}>
            <Plus className="h-4 w-4 mr-1" />
            Add New Edition
          </Button>
        </div>

        {showForm && (
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-foreground">{editingId ? "Edit Edition" : "New Edition"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Magazine Title</label>
                <Input placeholder="e.g. IPO World - Volume 10" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <select 
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value })}
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Access Type</label>
                <div className="flex items-center gap-4 h-10">
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={form.pdf_lock === 1} 
                      onCheckedChange={(checked) => setForm({ ...form, pdf_lock: checked ? 1 : 0 })} 
                    />
                    <span className="text-sm">{form.pdf_lock === 1 ? "Locked (Premium)" : "Free Access"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cover Image</label>
                <label className="flex items-center h-10 gap-2 cursor-pointer border border-dashed border-border rounded-lg px-4 hover:border-primary transition-colors">
                  <Image className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground truncate">
                    {uploadingImage ? "Uploading..." : form.report_images ? "Image uploaded ✓" : "Upload Cover Image"}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} disabled={uploadingImage} />
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">PDF File</label>
                <label className="flex items-center h-10 gap-2 cursor-pointer border border-dashed border-border rounded-lg px-4 hover:border-primary transition-colors">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground truncate">
                    {uploadingPdf ? "Uploading..." : form.pdf ? "PDF uploaded ✓" : "Upload Magazine PDF"}
                  </span>
                  <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileUpload(e, 'pdf')} disabled={uploadingPdf} />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {form.report_images && (
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Cover Preview</label>
                  <img src={getImageUrl(form.report_images)} alt="Preview" className="h-40 w-auto object-contain rounded-lg border border-border" />
                </div>
              )}
              {form.pdf && (
                 <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">PDF Link</label>
                  <div className="p-3 bg-muted rounded-lg text-xs truncate max-w-full">
                    {form.pdf}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-primary text-primary-foreground">{editingId ? "Update Edition" : "Save Edition"}</Button>
              <Button variant="outline" onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setForm({ title: "", pdf: "", language: "english", pdf_lock: 1, report_images: "" });
              }}>Cancel</Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">Loading magazines…</div>
          ) : magazines.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">No magazines found.</div>
          ) : (
            magazines.map((mag) => (
              <div key={mag.id} className="bg-card border border-border rounded-xl overflow-hidden group hover:shadow-lg transition-all">
                <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                  <img src={getImageUrl(mag.report_images)} alt={mag.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <Badge className={mag.language === 'hindi' ? "bg-orange-500" : "bg-blue-500"}>
                      {mag.language.toUpperCase()}
                    </Badge>
                    <Badge variant={Number(mag.pdf_lock) === 1 ? "destructive" : "secondary"}>
                      {Number(mag.pdf_lock) === 1 ? <Lock className="h-3 w-3 mr-1" /> : <Unlock className="h-3 w-3 mr-1" />}
                      {Number(mag.pdf_lock) === 1 ? "Locked" : "Free"}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-foreground mb-1 line-clamp-1">{mag.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <Globe className="h-3 w-3" />
                    <span>{mag.language}</span>
                    <span className="mx-1">•</span>
                    <span>{mag.created_at ? new Date(mag.created_at).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(mag)}>Edit</Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => deleteMagazine(mag.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageMagazines;
