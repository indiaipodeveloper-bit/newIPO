import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, HelpCircle } from "lucide-react";
import { toast } from "sonner";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  status: string;
  created_at: string;
}

const emptyForm = { question: "", answer: "", status: "Active" };

const ManageRegistrarFaqs = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/registrar-faqs");
      if (res.ok) {
        const data = await res.json();
        setFaqs(data);
      }
    } catch (err) {
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFaqs(); }, []);

  const handleSave = async () => {
    if (!form.question || !form.answer) { 
      toast.error("Question and Answer are required"); 
      return; 
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/registrar-faqs/${editingId}` : "/api/registrar-faqs";
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
      toast.success(editingId ? "FAQ updated!" : "FAQ created!");
      setForm(emptyForm);
      setEditingId(null);
      setDialogOpen(false);
      fetchFaqs();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (f: FAQ) => {
    setForm({
      question: f.question,
      answer: f.answer,
      status: f.status,
    });
    setEditingId(f.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      const res = await fetch(`/api/registrar-faqs/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("FAQ deleted successfully");
        fetchFaqs();
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      toast.error("Failed to delete FAQ");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage Registrar FAQs</h1>
            <p className="text-sm text-muted-foreground">{faqs.length} FAQs in database</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setForm(emptyForm); setEditingId(null); } }}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white hover:bg-primary/90 font-semibold">
                <Plus className="h-4 w-4 mr-2" /> New FAQ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit FAQ" : "Create New FAQ"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Question *</label>
                  <Input 
                    value={form.question} 
                    onChange={(e) => setForm({ ...form, question: e.target.value })} 
                    placeholder="Enter the question" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Answer *</label>
                  <Textarea 
                    value={form.answer} 
                    onChange={(e) => setForm({ ...form, answer: e.target.value })} 
                    rows={5} 
                    placeholder="Enter the answer" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Status</label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleSave} 
                  disabled={saving} 
                  className="w-full bg-primary text-white hover:bg-primary/90 font-semibold"
                >
                  {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : editingId ? "Update FAQ" : "Create FAQ"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            Loading FAQs...
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-poppins">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-4 px-6 font-semibold">Question</th>
                    <th className="text-left py-4 px-6 font-semibold">Status</th>
                    <th className="text-left py-4 px-6 font-semibold">Created At</th>
                    <th className="text-left py-4 px-6 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faqs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-muted-foreground">
                        No FAQs yet. Create your first FAQ!
                      </td>
                    </tr>
                  ) : (
                    faqs.map((f) => (
                      <tr key={f.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-6 font-medium max-w-md">
                          <div className="truncate" title={f.question}>{f.question}</div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant="outline" className={f.status === "Active" ? "bg-brand-green/10 text-brand-green border-brand-green/20" : "bg-muted text-muted-foreground"}>
                            {f.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-muted-foreground">
                          {new Date(f.created_at).toLocaleDateString("en-IN")}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(f)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(f.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageRegistrarFaqs;
