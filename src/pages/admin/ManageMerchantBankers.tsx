import AdminLayout from "@/components/AdminLayout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Upload, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichEditor from "@/components/ui/RichEditor";

interface Banker {
  id: string;
  title: string;
  sub_title: string;
  slug: string;
  mcat_id: string | number;
  image: string;
  description: string;
  meta_title: string;
  meta_desc: string;
  meta_keywords: string;
  noOfiposofar: string;
  ipos: string;
  totalfundraised: string;
  avgiposize: string;
  avglisting_gain: string;
  avgsubscription: string;
  faqs: string;
  nseemer: string;
  bsesme: string;
  yearwise_ipolisting: string;
  sme_ipos_by_size: string;
  sme_ipos_by_subscription: string;
  cemail: string;
  cmobile: string;
  caddress: string;
  cweblink: string;
  created_at?: string;
}

const emptyForm: Omit<Banker, 'id' | 'created_at'> = {
  title: "", sub_title: "", slug: "", mcat_id: 0, image: "", description: "",
  meta_title: "", meta_desc: "", meta_keywords: "", noOfiposofar: "", ipos: "",
  totalfundraised: "", avgiposize: "", avglisting_gain: "", avgsubscription: "",
  faqs: "", nseemer: "", bsesme: "", yearwise_ipolisting: "", sme_ipos_by_size: "",
  sme_ipos_by_subscription: "", cemail: "", cmobile: "", caddress: "", cweblink: ""
};

// Reusable Dynamic JSON Array Editor
const JsonArrayEditor = ({ value, onChange, template, placeholder }: any) => {
  const safeParse = (str: string) => {
    try { return JSON.parse(str || "[]"); } catch { return []; }
  };
  const items = Array.isArray(safeParse(value)) ? safeParse(value) : [];

  const updateItem = (index: number, key: string, val: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: val };
    onChange(JSON.stringify(newItems));
  };

  const addItem = () => {
    const newItems = [...items, { ...template }];
    onChange(JSON.stringify(newItems));
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(JSON.stringify(newItems));
  };

  return (
    <div className="space-y-3 border border-border p-3 rounded-md bg-background/50">
      {items.map((item: any, i: number) => (
        <div key={i} className="flex flex-col sm:flex-row items-center gap-2">
          {Object.keys(template).map(key => (
            <Input
              key={key}
              placeholder={placeholder[key] || key}
              value={item[key] || ''}
              onChange={e => updateItem(i, key, e.target.value)}
              className="flex-1"
            />
          ))}
          <Button variant="ghost" size="icon" onClick={() => removeItem(i)} className="text-destructive h-9 w-9 shrink-0 outline outline-1 outline-destructive/20 hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addItem} className="w-full border-dashed border-2 hover:border-primary hover:text-primary transition-colors mt-2">
        <Plus className="h-4 w-4 mr-1" /> Add Row
      </Button>
    </div>
  );
};

const ManageMerchantBankers = () => {
  const [bankers, setBankers] = useState<Banker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);

  // Pagination & Search States
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bankers?page=${page}&limit=${limit}&search=${encodeURIComponent(debouncedSearch)}`);
      if (res.ok) {
        const body = await res.json();
        setBankers(body.data || []);
        setTotal(body.pagination?.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when page or search changes
  useEffect(() => {
    fetchData();
  }, [page, limit, debouncedSearch]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("folder", "bankers");
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setForm({ ...form, image: url });
      toast.success("Logo uploaded!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title) {
      toast.error("Title/Name is required");
      return;
    }
    const payload = { ...form };

    try {
      if (editId) {
        const res = await fetch(`/api/bankers/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Update failed");
        toast.success("Updated Successfully!");
      } else {
        const res = await fetch("/api/bankers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Insert failed");
        toast.success("Added Successfully!");
      }
      setForm(emptyForm);
      setShowForm(false);
      setEditId(null);
      fetchData(); // Refresh list to show changes
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const startEdit = (b: Banker) => {
    setForm({
      title: b.title || "", sub_title: b.sub_title || "", slug: b.slug || "",
      mcat_id: b.mcat_id || 0, image: b.image || "", description: b.description || "",
      meta_title: b.meta_title || "", meta_desc: b.meta_desc || "", meta_keywords: b.meta_keywords || "",
      noOfiposofar: b.noOfiposofar || "", ipos: b.ipos || "", totalfundraised: b.totalfundraised || "",
      avgiposize: b.avgiposize || "", avglisting_gain: b.avglisting_gain || "", avgsubscription: b.avgsubscription || "",
      faqs: b.faqs || "", nseemer: b.nseemer || "", bsesme: b.bsesme || "",
      yearwise_ipolisting: b.yearwise_ipolisting || "", sme_ipos_by_size: b.sme_ipos_by_size || "",
      sme_ipos_by_subscription: b.sme_ipos_by_subscription || "", cemail: b.cemail || "",
      cmobile: b.cmobile || "", caddress: b.caddress || "", cweblink: b.cweblink || ""
    });
    setEditId(b.id);
    setShowForm(true);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteBanker = async (id: string) => {
    if (!confirm("Are you sure you want to completely delete this merchant banker?")) return;
    try {
      await fetch(`/api/bankers/${id}`, { method: "DELETE" });
      toast.success("Deleted Successfully");
      // If we deleted the last item on the page, go back one page
      if (bankers.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <AdminLayout>
      <div className="space-y-6 pb-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Manage Merchant Bankers
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{total} Total</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Add, update, and manage expansive analytics data</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bankers..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-8 bg-card shadow-sm border-border hover:border-primary/30 transition-colors"
                autoComplete="off"
              />
            </div>
            <Button
              className="bg-primary text-primary-foreground shrink-0 shadow-sm hover:scale-105 transition-transform"
              onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Banker
            </Button>
          </div>
        </div>

        {showForm && (
          <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Soft background decor */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50"></div>

            <h3 className="font-semibold text-foreground text-xl mb-4 flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" />
              {editId ? `Edit Banker: ${form.title}` : "Create New Merchant Banker"}
            </h3>

            <Tabs defaultValue="general" className="w-full">
              <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-start border-b border-border mb-6 pb-3">
                <TabsTrigger value="general" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">General Details</TabsTrigger>
                <TabsTrigger value="stats" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">Statistics</TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all border-dashed border border-transparent data-[state=active]:border-primary/20 bg-secondary/30">Analytics Arrays</TabsTrigger>
                <TabsTrigger value="contact" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">Contact Info</TabsTrigger>
                <TabsTrigger value="seo" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">SEO & Meta</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold">Banker Title/Name *</label>
                    <Input placeholder="Enter title..." value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="shadow-sm" />
                  </div>
                  {/* <div className="space-y-3">
                    <label className="text-sm font-semibold">Category / Sub-title</label>
                    <Input placeholder="e.g. SME, Mainboard..." value={form.sub_title} onChange={(e) => setForm({ ...form, sub_title: e.target.value })} className="shadow-sm" />
                  </div> */}
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-sm font-semibold">Description (HTML supported)</label>
                    <RichEditor
                      value={form.description}
                      onChange={(val) => setForm({ ...form, description: val })}
                      placeholder="Full comprehensive description..."
                      className="min-h-[300px]"
                    />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-sm font-semibold">Banker Logo</label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {form.image && (
                        <div className="w-24 h-24 rounded-lg border border-border bg-white shadow-sm flex items-center justify-center p-2 shrink-0">
                          <img src={getImageUrl(form.image)} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                      )}
                      <label className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-primary/20 bg-primary/5 rounded-xl px-4 py-8 hover:border-primary hover:bg-primary/10 transition-colors w-full h-24 gap-2">
                        <Upload className="h-6 w-6 text-primary" />
                        <span className="text-sm font-medium text-primary">
                          {uploading ? "Uploading format..." : "Click to Upload Company Logo"}
                        </span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                      </label>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stats" className="space-y-4 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3"><label className="text-sm font-semibold">Total IPOs Managed</label><Input placeholder="e.g. 50+" value={form.noOfiposofar} onChange={(e) => setForm({ ...form, noOfiposofar: e.target.value })} className="shadow-sm" /></div>
                  <div className="space-y-3"><label className="text-sm font-semibold">Total Fund Raised</label><Input placeholder="e.g. ₹5,000 Cr" value={form.totalfundraised} onChange={(e) => setForm({ ...form, totalfundraised: e.target.value })} className="shadow-sm" /></div>
                  <div className="space-y-3"><label className="text-sm font-semibold">Avg IPO Size</label><Input placeholder="e.g. ₹100 Cr" value={form.avgiposize} onChange={(e) => setForm({ ...form, avgiposize: e.target.value })} className="shadow-sm" /></div>
                  {/* <div className="space-y-3"><label className="text-sm font-semibold">Avg Listing Gain</label><Input placeholder="e.g. 20%" value={form.avglisting_gain} onChange={(e) => setForm({ ...form, avglisting_gain: e.target.value })} className="shadow-sm" /></div> */}
                  <div className="space-y-3"><label className="text-sm font-semibold">Avg Subscription</label><Input placeholder="e.g. 45x" value={form.avgsubscription} onChange={(e) => setForm({ ...form, avgsubscription: e.target.value })} className="shadow-sm" /></div>
                  <div className="space-y-3"><label className="text-sm font-semibold">NSE Emerge count</label><Input placeholder="0" value={form.nseemer} onChange={(e) => setForm({ ...form, nseemer: e.target.value })} className="shadow-sm" /></div>
                  <div className="space-y-3"><label className="text-sm font-semibold">BSE SME count</label><Input placeholder="0" value={form.bsesme} onChange={(e) => setForm({ ...form, bsesme: e.target.value })} className="shadow-sm" /></div>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-accent/5 p-4 rounded-xl border border-accent/20 mb-4">
                  <p className="text-sm text-foreground/80 font-medium leading-relaxed">
                    <span className="font-bold text-primary">Dynamic Row Builders:</span> You no longer need to write raw JSON manually!
                    Just click <span className="text-xs bg-background border px-1.5 py-0.5 rounded shadow">Add Row</span> and fill in the boxes mapping correctly to the frontend charts. The system will encode it automatically behind the scenes for the database.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold flex items-center justify-between">
                      <span>Year-wise IPO Listing</span>
                    </label>
                    <p className="text-xs text-muted-foreground mb-2">Build timeline series data for visual line charts.</p>
                    <JsonArrayEditor
                      value={form.yearwise_ipolisting}
                      onChange={(v: string) => setForm({ ...form, yearwise_ipolisting: v })}
                      template={{ year: "", no_of_ipos: "" }}
                      placeholder={{ year: "Year (e.g. FY25)", no_of_ipos: "Count (e.g. 2)" }}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold flex items-center justify-between">
                      <span>SME IPOs by Size</span>
                    </label>
                    <p className="text-xs text-muted-foreground mb-2">Build categorized volume data for visual bar charts.</p>
                    <JsonArrayEditor
                      value={form.sme_ipos_by_size}
                      onChange={(v: string) => setForm({ ...form, sme_ipos_by_size: v })}
                      template={{ title: "", size: "" }}
                      placeholder={{ title: "Size (e.g. Above 50Cr)", size: "Total Count (e.g. 3 (10%))" }}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold flex items-center justify-between">
                      <span>IPOs by Subscription Level</span>
                    </label>
                    <p className="text-xs text-muted-foreground mb-2">Build specific segment multiplier logic for pie charts.</p>
                    <JsonArrayEditor
                      value={form.sme_ipos_by_subscription}
                      onChange={(v: string) => setForm({ ...form, sme_ipos_by_subscription: v })}
                      template={{ title: "", subscription: "" }}
                      placeholder={{ title: "Group (e.g. Subscribed 5 times)", subscription: "Value (e.g. 1 (50%))" }}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold flex items-center justify-between">
                      <span>Frequently Asked Questions</span>
                    </label>
                    <p className="text-xs text-muted-foreground mb-2">Compile an FAQ block specifically tailored to this banker.</p>
                    <JsonArrayEditor
                      value={form.faqs}
                      onChange={(v: string) => setForm({ ...form, faqs: v })}
                      template={{ question: "", answer: "" }}
                      placeholder={{ question: "Question", answer: "Answer text..." }}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3"><label className="text-sm font-semibold">Associated Email Address</label><Input type="email" placeholder="contact@example.com" value={form.cemail} onChange={(e) => setForm({ ...form, cemail: e.target.value })} className="shadow-sm" /></div>
                  <div className="space-y-3"><label className="text-sm font-semibold">Support Mobile/Phone Number</label><Input placeholder="+91..." value={form.cmobile} onChange={(e) => setForm({ ...form, cmobile: e.target.value })} className="shadow-sm" /></div>
                  <div className="space-y-3"><label className="text-sm font-semibold">Official Website Link</label><Input placeholder="https://..." value={form.cweblink} onChange={(e) => setForm({ ...form, cweblink: e.target.value })} className="shadow-sm" /></div>
                  <div className="space-y-3 md:col-span-2"><label className="text-sm font-semibold">Registered Office Address</label><Textarea placeholder="123 Financial District..." value={form.caddress} onChange={(e) => setForm({ ...form, caddress: e.target.value })} rows={3} className="shadow-sm" /></div>
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3"><label className="text-sm font-semibold">URL Slug</label><Input placeholder="e.g. abc-capital-limited" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="shadow-sm" /></div>
                  <div className="space-y-3"><label className="text-sm font-semibold">MCAT Category ID</label><Input type="number" placeholder="0" value={form.mcat_id} onChange={(e) => setForm({ ...form, mcat_id: e.target.value })} className="shadow-sm" /></div>
                  <div className="space-y-3"><label className="text-sm font-semibold">Meta Target Title</label><Input placeholder="Title for SEO..." value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} className="shadow-sm" /></div>
                  <div className="space-y-3"><label className="text-sm font-semibold">Meta Exact Keywords</label><Input placeholder="keywords, comma, separated" value={form.meta_keywords} onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })} className="shadow-sm" /></div>
                  <div className="space-y-3 md:col-span-2"><label className="text-sm font-semibold">Meta Description Node</label><Textarea placeholder="Description snippet for search engines..." value={form.meta_desc} onChange={(e) => setForm({ ...form, meta_desc: e.target.value })} rows={2} className="shadow-sm" /></div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 pt-6 border-t border-border mt-6">
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[200px] font-bold shadow-md h-11 text-base transition-transform active:scale-95">
                {editId ? "Save Banker Updates" : "Commit to Database"}
              </Button>
              <Button variant="outline" className="h-11 shadow-sm" onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }}>
                Cancel Operations
              </Button>
            </div>
          </div>
        )}

        {/* Data Grid with Pagination */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-muted-foreground text-sm font-medium">Fetching Records...</p>
              </div>
            ) : bankers.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground flex flex-col items-center">
                <Search className="w-12 h-12 mb-3 opacity-20 text-primary" />
                <p className="text-lg font-medium text-foreground">No merchant bankers matches found.</p>
                <p className="text-sm">Try tweaking your search terms or add a new banker.</p>
              </div>
            ) : (
              <div className="divide-y divide-border flex-1">
                {bankers.map((b) => (
                  <div key={b.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-secondary/10 transition-colors group">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-14 h-14 rounded-xl bg-white border border-border flex items-center justify-center shrink-0 p-1.5 shadow-sm group-hover:border-primary/50 transition-colors">
                        {b.image ? (
                          <img src={getImageUrl(b.image)} alt="" className="max-w-full max-h-full object-contain" />
                        ) : (
                          <span className="text-2xl font-bold text-primary">{b.title?.[0] || "?"}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-foreground truncate text-base group-hover:text-primary transition-colors pr-4">
                          {b.title}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {b.sub_title ? `${b.sub_title} · ` : ""}<span className="font-medium text-foreground">{b.noOfiposofar || "0"}</span> IPOs · <span className="font-medium text-foreground">{b.totalfundraised || "₹0"}</span> Raised
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 sm:opacity-70 group-hover:opacity-100 transition-opacity w-full sm:w-auto mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-border">
                      <Button variant="outline" size="sm" className="h-9 flex-1 sm:flex-auto border-border hover:bg-primary hover:text-primary-foreground hover:border-primary" onClick={() => startEdit(b)}>
                        <Edit className="h-4 w-4 mr-1.5" /> Edit
                      </Button>
                      <Button variant="outline" size="icon" className="h-9 w-9 text-destructive border-border hover:border-destructive hover:bg-destructive hover:text-white" onClick={() => deleteBanker(b.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Massive Pagination Controls Segment */}
            {!loading && totalPages > 0 && (
              <div className="p-4 border-t border-border bg-gradient-to-r from-secondary/5 via-secondary/10 to-transparent flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground font-medium">
                  Showing <span className="font-bold text-foreground mx-1">{(page - 1) * limit + 1}-{Math.min(page * limit, total)}</span> of <span className="font-bold text-foreground ml-1">{total}</span> total entries
                </p>

                <div className="flex items-center gap-1.5 bg-background p-1.5 rounded-lg border border-border shadow-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-foreground font-medium"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                  </Button>

                  <div className="h-4 w-[1px] bg-border mx-1"></div>

                  <span className="text-sm font-semibold px-3 py-1 bg-primary text-primary-foreground rounded-md">
                    {page}
                  </span>
                  <span className="text-sm text-muted-foreground px-1 font-medium">of</span>
                  <span className="text-sm font-semibold px-2">
                    {totalPages}
                  </span>

                  <div className="h-4 w-[1px] bg-border mx-1"></div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-foreground font-medium"
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageMerchantBankers;
