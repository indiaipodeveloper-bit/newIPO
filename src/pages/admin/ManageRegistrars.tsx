import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, Search, Link as LinkIcon, Building2, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { getImageUrl, cn } from "@/lib/utils";
import RichEditor from "@/components/ui/RichEditor";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge as UIByadge } from "@/components/ui/badge";

interface Registrar {
  id: number;
  name: string;
  image: string;
  meta_title: string;
  meta_desc: string;
  meta_keywords: string;
  slug: string;
  sme_ipo: string;
  mainboard_ipo: string;
  sme_ipo_parentage: string;
  mainboard_ipo_parentage: string;
  avgsubscription_sme: string;
  avgsubscription_mainboard: string;
  location: string;
  dic: string;
  registrar_year: string;
  latest_sme: string;
  latest_mainbord: string;
  faqs: string;
  status: string;
  created_at?: string;
  update_at?: string;
}

const emptyForm: Omit<Registrar, 'id' | 'created_at' | 'update_at'> = {
  name: "",
  image: "",
  meta_title: "",
  meta_desc: "",
  meta_keywords: "",
  slug: "",
  sme_ipo: "",
  mainboard_ipo: "",
  sme_ipo_parentage: "",
  mainboard_ipo_parentage: "",
  avgsubscription_sme: "",
  avgsubscription_mainboard: "",
  location: "",
  dic: "",
  registrar_year: "",
  latest_sme: "",
  latest_mainbord: "",
  faqs: "",
  status: "Active",
};

const ManageRegistrars = () => {
  const [registrars, setRegistrars] = useState<Registrar[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [faqItems, setFaqItems] = useState<{question: string, answer: string}[]>([]);
  const [allIpos, setAllIpos] = useState<any[]>([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchRegistrars = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/registrars?page=${page}&limit=${limit}`);
      if (res.ok) {
        const body = await res.json();
        setRegistrars(body.data || []);
        setTotal(body.pagination?.total || 0);
      }
    } catch (err) {
      toast.error("Failed to load Registrars");
    } finally {
      setLoading(false);
    }
  };

  const fetchIPOs = async () => {
    try {
      const res = await fetch("/api/ipo-lists?limit=1000");
      if (res.ok) {
        const body = await res.json();
        setAllIpos(body.data || []);
      }
    } catch (err) {
      console.error("Failed to load IPOs", err);
    }
  };

  useEffect(() => { 
    fetchRegistrars(); 
    fetchIPOs();
  }, [page, limit]);

  const handleSave = async () => {
    if (!form.name) { toast.error("Registrar Name is required"); return; }
    if (!form.slug) { toast.error("Slug is required"); return; }

    setSaving(true);
    try {
      const url = editingId ? `/api/registrars/${editingId}` : "/api/registrars";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          faqs: JSON.stringify(faqItems)
        }),
      });

      if (!res.ok) { throw new Error("Save failed"); }

      toast.success(editingId ? "Registrar updated!" : "Registrar created!");
      setForm(emptyForm);
      setEditingId(null);
      setDialogOpen(false);
      fetchRegistrars();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (r: Registrar) => {
    setForm({
      name: r.name || "",
      image: r.image || "",
      meta_title: r.meta_title || "",
      meta_desc: r.meta_desc || "",
      meta_keywords: r.meta_keywords || "",
      slug: r.slug || "",
      sme_ipo: r.sme_ipo || "",
      mainboard_ipo: r.mainboard_ipo || "",
      sme_ipo_parentage: r.sme_ipo_parentage || "",
      mainboard_ipo_parentage: r.mainboard_ipo_parentage || "",
      avgsubscription_sme: r.avgsubscription_sme || "",
      avgsubscription_mainboard: r.avgsubscription_mainboard || "",
      location: r.location || "",
      dic: r.dic || "",
      registrar_year: r.registrar_year || "",
      latest_sme: r.latest_sme || "",
      latest_mainbord: r.latest_mainbord || "",
      faqs: r.faqs || "",
      status: r.status || "Active",
    });

    try {
      const parsed = r.faqs ? JSON.parse(r.faqs) : [];
      setFaqItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setFaqItems([]);
    }

    setEditingId(r.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this Registrar permanently?")) return;
    try {
      const res = await fetch(`/api/registrars/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted successfully");
        fetchRegistrars();
      } else {
        throw new Error("Delete failed");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("folder", "registrars");
    formData.append("file", file);

    const tId = toast.loading("Uploading logo...");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setForm({ ...form, image: data.url });
      toast.success("Logo uploaded!", { id: tId });
    } catch (err) {
      toast.error("Failed to upload image", { id: tId });
    } finally {
      setUploading(false);
    }
  };

  const generateSlug = () => {
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm({ ...form, slug });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading text-primary">IPO Registrars</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage official IPO Registrars and their details</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={(o) => {
            setDialogOpen(o);
            if (!o) { 
              setForm(emptyForm); 
              setEditingId(null); 
              setFaqItems([]);
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground font-semibold">
                <Plus className="h-4 w-4 mr-2" /> Add Registrar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Registrar" : "Add Registrar"}</DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="general" className="mt-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="stats">IPO Stats</TabsTrigger>
                  <TabsTrigger value="description">Description & FAQ</TabsTrigger>
                  <TabsTrigger value="seo">SEO Settings</TabsTrigger>
                </TabsList>

                {/* General Tab */}
                <TabsContent value="general" className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Registrar Name *</label>
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} onBlur={generateSlug} placeholder="e.g. Link Intime India" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Slug *</label>
                      <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="link-intime-india" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Logo Image</label>
                      <div className="flex gap-2">
                        <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="flex-1" />
                        <div className="relative shrink-0">
                          <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                          <Button type="button" variant="outline" disabled={uploading}>
                            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Location</label>
                      <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Mumbai" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Established Year</label>
                      <Input value={form.registrar_year} onChange={(e) => setForm({ ...form, registrar_year: e.target.value })} placeholder="e.g. 1999" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Status</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </TabsContent>

                {/* Stats Tab */}
                <TabsContent value="stats" className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                      <h3 className="font-bold text-primary border-b pb-2">SME IPO Stats</h3>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold">Total SME IPOs</label>
                        <Input value={form.sme_ipo} onChange={(e) => setForm({ ...form, sme_ipo: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold">SME Parentage (%)</label>
                        <Input value={form.sme_ipo_parentage} onChange={(e) => setForm({ ...form, sme_ipo_parentage: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold">Avg. SME Subscription</label>
                        <Input value={form.avgsubscription_sme} onChange={(e) => setForm({ ...form, avgsubscription_sme: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold">Latest SME IPO</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between h-auto min-h-10 py-2"
                            >
                              <div className="flex flex-wrap gap-1 text-left">
                                {form.latest_sme ? (
                                  form.latest_sme.split(",").map((id) => {
                                    const ipo = allIpos.find((i) => String(i.id) === id.trim());
                                    return ipo ? (
                                      <Badge key={id} variant="secondary" className="mr-1 mb-1 bg-primary/10 text-primary border-primary/20">
                                        {ipo.issuer_company}
                                      </Badge>
                                    ) : null;
                                  })
                                ) : (
                                  <span className="text-muted-foreground">Select SME IPOs...</span>
                                )}
                              </div>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search SME IPOs..." />
                              <CommandList>
                                <CommandEmpty>No IPO found.</CommandEmpty>
                                <CommandGroup>
                                  {allIpos
                                    .filter((i) => String(i.issue_category).toLowerCase() === "sme")
                                    .map((ipo) => {
                                      const isSelected = form.latest_sme?.split(",").map(id => id.trim()).includes(String(ipo.id));
                                      return (
                                        <CommandItem
                                          key={ipo.id}
                                          onSelect={() => {
                                            const currentIds = form.latest_sme ? form.latest_sme.split(",").map(id => id.trim()).filter(Boolean) : [];
                                            const newIds = isSelected
                                              ? currentIds.filter((id) => id !== String(ipo.id))
                                              : [...currentIds, String(ipo.id)];
                                            setForm({ ...form, latest_sme: newIds.join(",") });
                                          }}
                                        >
                                          <div className={cn(
                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                            isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                                          )}>
                                            <Check className="h-4 w-4" />
                                          </div>
                                          {ipo.issuer_company}
                                        </CommandItem>
                                      );
                                    })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                      <h3 className="font-bold text-orange-500 border-b pb-2">Mainboard IPO Stats</h3>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold">Total Mainboard IPOs</label>
                        <Input value={form.mainboard_ipo} onChange={(e) => setForm({ ...form, mainboard_ipo: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold">Mainboard Parentage (%)</label>
                        <Input value={form.mainboard_ipo_parentage} onChange={(e) => setForm({ ...form, mainboard_ipo_parentage: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold">Avg. Mainboard Subscription</label>
                        <Input value={form.avgsubscription_mainboard} onChange={(e) => setForm({ ...form, avgsubscription_mainboard: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold">Latest Mainboard IPO</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between h-auto min-h-10 py-2"
                            >
                              <div className="flex flex-wrap gap-1 text-left">
                                {form.latest_mainbord ? (
                                  form.latest_mainbord.split(",").map((id) => {
                                    const ipo = allIpos.find((i) => String(i.id) === id.trim());
                                    return ipo ? (
                                      <Badge key={id} variant="secondary" className="mr-1 mb-1 bg-orange-500/10 text-orange-600 border-orange-500/20">
                                        {ipo.issuer_company}
                                      </Badge>
                                    ) : null;
                                  })
                                ) : (
                                  <span className="text-muted-foreground">Select Mainboard IPOs...</span>
                                )}
                              </div>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search Mainboard IPOs..." />
                              <CommandList>
                                <CommandEmpty>No IPO found.</CommandEmpty>
                                <CommandGroup>
                                  {allIpos
                                    .filter((i) => {
                                      const cat = String(i.issue_category).toLowerCase();
                                      return cat === "mainline" || cat === "mainboard";
                                    })
                                    .map((ipo) => {
                                      const isSelected = form.latest_mainbord?.split(",").map(id => id.trim()).includes(String(ipo.id));
                                      return (
                                        <CommandItem
                                          key={ipo.id}
                                          onSelect={() => {
                                            const currentIds = form.latest_mainbord ? form.latest_mainbord.split(",").map(id => id.trim()).filter(Boolean) : [];
                                            const newIds = isSelected
                                              ? currentIds.filter((id) => id !== String(ipo.id))
                                              : [...currentIds, String(ipo.id)];
                                            setForm({ ...form, latest_mainbord: newIds.join(",") });
                                          }}
                                        >
                                          <div className={cn(
                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                            isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                                          )}>
                                            <Check className="h-4 w-4" />
                                          </div>
                                          {ipo.issuer_company}
                                        </CommandItem>
                                      );
                                    })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Description & FAQ Tab */}
                <TabsContent value="description" className="space-y-6 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Main Description</label>
                    <RichEditor
                      value={form.dic}
                      onChange={(content) => setForm({ ...form, dic: content })}
                      placeholder="Enter registrar description here..."
                      className="min-h-[400px]"
                    />
                  </div>

                  <div className="space-y-4 border-t pt-6">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold">Frequently Asked Questions (FAQs)</label>
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setFaqItems([...faqItems, { question: "", answer: "" }])}
                        className="h-8"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" /> Add Question
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {faqItems.length === 0 ? (
                        <div className="text-center py-6 bg-muted/20 rounded-lg border-2 border-dashed">
                          <p className="text-xs text-muted-foreground">No FAQs added yet. Click 'Add Question' to begin.</p>
                        </div>
                      ) : (
                        faqItems.map((item, idx) => (
                          <div key={idx} className="bg-muted/30 p-4 rounded-xl space-y-3 relative group border border-border">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => setFaqItems(faqItems.filter((_, i) => i !== idx))}
                              className="absolute top-2 right-2 h-7 w-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                            
                            <div className="space-y-1.5">
                              <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Question {idx + 1}</label>
                              <Input 
                                value={item.question} 
                                onChange={(e) => {
                                  const newItems = [...faqItems];
                                  newItems[idx].question = e.target.value;
                                  setFaqItems(newItems);
                                }} 
                                placeholder="Enter question..." 
                                className="bg-background h-9 text-sm"
                              />
                            </div>
                            
                            <div className="space-y-1.5">
                              <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Answer</label>
                              <Textarea 
                                value={item.answer} 
                                onChange={(e) => {
                                  const newItems = [...faqItems];
                                  newItems[idx].answer = e.target.value;
                                  setFaqItems(newItems);
                                }} 
                                placeholder="Enter answer..." 
                                rows={2}
                                className="bg-background text-sm min-h-[60px]"
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* SEO Tab */}
                <TabsContent value="seo" className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Meta Title</label>
                    <Input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Meta Description</label>
                    <Textarea value={form.meta_desc} onChange={(e) => setForm({ ...form, meta_desc: e.target.value })} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Meta Keywords</label>
                    <Input value={form.meta_keywords} onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })} />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground min-w-[120px]">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Registrar"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* List Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/30">
                <tr className="border-b border-border">
                  <th className="py-4 px-5 text-left font-semibold">Registrar</th>
                  <th className="py-4 px-5 text-left font-semibold">SME / Mainboard</th>
                  <th className="py-4 px-5 text-left font-semibold">Status</th>
                  <th className="py-4 px-5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr><td colSpan={4} className="py-10 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></td></tr>
                ) : registrars.length === 0 ? (
                  <tr><td colSpan={4} className="py-10 text-center text-muted-foreground">No registrars found.</td></tr>
                ) : registrars.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded border bg-white p-1 overflow-hidden">
                          <img
                            src={getImageUrl(r.image || '/placeholder.png')}
                            alt=""
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{r.name}</p>
                          <p className="text-xs text-muted-foreground">{r.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="w-fit text-primary border-primary/20">SME: {r.sme_ipo}</Badge>
                        <Badge variant="outline" className="w-fit text-orange-500 border-orange-500/20">Main: {r.mainboard_ipo}</Badge>
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      <Badge className={r.status === 'Active' ? 'bg-brand-green' : 'bg-muted text-muted-foreground'}>{r.status}</Badge>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(r)}><Pencil className="h-3.5 w-3.5 mr-1" /> Edit</Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(r.id)} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {total > limit && (
            <div className="flex items-center justify-between p-4 border-t border-border bg-secondary/10">
              <span className="text-sm text-muted-foreground">Page {page} of {Math.ceil(total / limit)}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page * limit >= total}>Next</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageRegistrars;
