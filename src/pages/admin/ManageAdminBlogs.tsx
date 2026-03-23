import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, ChevronLeft, ChevronRight, Layout, BarChart, Info, List, Link as LinkIcon, Database, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminBlog {
  id: string; title: string; new_slug: string; slug: string;
  image: string; content: string; faqs: string; status: string;
  confidential: string; upcoming: string; category: string;
  new_highlight_text: string; gmp_date: string; gmp_ipo_price: string;
  gmp: string; gmp_last_updated: string;
  ipo_details: string; ipo_description: string;
  ipo_timeline_details: string; ipo_timeline_description: string;
  ipo_lots_application: string; ipo_lots: string;
  ipo_lots_share: string; ipo_lots_amount: string;
  promotor_hold_pre_issue: string; promotor_hold_post_issue: string;
  finantial_information_ended: string; finantial_information_assets: string;
  finantial_information_revenue: string; finantial_information_profit_tax: string;
  financial_info_reserves_surplus: string; finantial_information_networth: string;
  finantial_information_borrowing: string;
  key_kpi: string; key_value: string; key_pri_ipo_eps: string;
  key_pos_ipo_eps: string; key_pre_ipo_pe: string; key_post_ipo_pe: string;
  competative_strenght: string;
  meta_title: string; description: string; keyword: string;
  rhp: string; drhp: string; confidential_drhp: string;
  created_at: string;
}

const emptyForm: Partial<AdminBlog> = {
  title: "", new_slug: "", slug: "", category: "ipo_blogs", status: "1", upcoming: "0", image: "",
  content: "", faqs: "", new_highlight_text: "",
  gmp_date: "", gmp_ipo_price: "", gmp: "", gmp_last_updated: "",
  ipo_details: "", ipo_description: "",
  ipo_timeline_details: "", ipo_timeline_description: "",
  ipo_lots_application: "", ipo_lots: "", ipo_lots_share: "", ipo_lots_amount: "",
  promotor_hold_pre_issue: "", promotor_hold_post_issue: "",
  finantial_information_ended: "", finantial_information_assets: "",
  finantial_information_revenue: "", finantial_information_profit_tax: "",
  financial_info_reserves_surplus: "", finantial_information_networth: "",
  finantial_information_borrowing: "",
  key_kpi: "", key_value: "", key_pri_ipo_eps: "",
  key_pos_ipo_eps: "", key_pre_ipo_pe: "", key_post_ipo_pe: "",
  competative_strenght: "",
  meta_title: "", description: "", keyword: "",
  rhp: "", drhp: "", confidential_drhp: "",
  confidential: "0"
};

const ManageAdminBlogs = () => {
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const BAD_VALUES = new Set(['null', '[null]', 'undefined', '[]', '["null"]', '']);

  const fixUnicode = (s: string) =>
    s.replace(/\\u20b9/g, '₹').replace(/\\u20b5/g, '₹').replace(/\\u0026/g, '&').replace(/\\u2019/g, "'");

  const formatDisplayValue = (val: any) => {
    if (val === null || val === undefined) return '—';
    const s = String(val).trim();
    if (BAD_VALUES.has(s.toLowerCase())) return '—';
    // If it's a JSON array, flatten to text for display
    if (s.startsWith('[') && s.endsWith(']')) {
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) {
          const items = parsed.filter(i => i !== null && i !== undefined && !BAD_VALUES.has(String(i).toLowerCase().trim()));
          if (items.length === 0) return '—';
          return fixUnicode(items[0] !== undefined ? String(items[0]) : '—');
        }
      } catch (e) {}
    }
    return fixUnicode(s);
  };

  // Convert DB JSON value to editable form string
  const cleanFormValue = (val: any, isFaqField = false) => {
    if (val === null || val === undefined) return '';
    const s = String(val).trim();
    if (BAD_VALUES.has(s.toLowerCase())) return '';

    if (s.startsWith('[') && s.endsWith(']')) {
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) {
          // Keep FAQs as raw JSON string for editing
          if (isFaqField) return s;
          const cleaned = parsed
            .filter(item => item !== null && item !== undefined && !BAD_VALUES.has(String(item).toLowerCase().trim()))
            .map(item => {
              if (typeof item === 'object') return JSON.stringify(item);
              return fixUnicode(String(item).trim());
            })
            .filter(item => item !== '');
          return cleaned.join(', ');
        }
      } catch (e) { /* Not valid JSON */ }
    }

    return fixUnicode(s);
  };

  const [form, setForm] = useState<Record<string, any>>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBlogs = async (p = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin-blogs?page=${p}&limit=20&summary=1`);
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.data || []);
        setTotalPages(data.totalPages || 1);
        setPage(data.page || 1);
      }
    } catch (err) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(1); }, []);

  const handleSave = async () => {
    if (!form.title) { toast.error("Title required"); return; }
    setSaving(true);
    try {
      const url = editingId ? `/api/admin-blogs/${editingId}` : "/api/admin-blogs";
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
      toast.success(editingId ? "Blog updated!" : "Blog created!");
      setForm(emptyForm);
      setEditingId(null);
      setDialogOpen(false);
      fetchBlogs(page);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (b: AdminBlog) => {
    try {
      setSaving(true);
      const res = await fetch(`/api/admin-blogs/id/${b.id}`);
      if (res.ok) {
        const fullData = await res.json();
        // Clean all fields before putting into form
        const cleanedData: Record<string, any> = {};
        for (const [key, val] of Object.entries(fullData)) {
          if (key === 'content') {
            // Keep HTML content raw for editing
            cleanedData[key] = val ?? '';
          } else if (key === 'faqs') {
            cleanedData[key] = cleanFormValue(val, true);
          } else if (typeof val === 'string' || val === null) {
            cleanedData[key] = cleanFormValue(val);
          } else {
            cleanedData[key] = val;
          }
        }
        setForm(cleanedData);
        setEditingId(b.id);
        setDialogOpen(true);
      } else {
        toast.error("Failed to load full details");
      }
    } catch {
      toast.error("Error fetching full details");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("folder", "admin_blogs");
    formData.append("file", file);

    const tId = toast.loading("Uploading image...");
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setForm({ ...form, [fieldName]: data.url });
      toast.success("Image uploaded successfully!", { id: tId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image", { id: tId });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog?")) return;
    try {
      await fetch(`/api/admin-blogs/${id}`, { method: "DELETE" });
      toast.success("Blog deleted");
      fetchBlogs(page);
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage IPO Blogs</h1>
            <p className="text-sm text-muted-foreground">Extensive DB of {blogs.length} IPOs (Page {page} of {totalPages})</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setForm(emptyForm); setEditingId(null); } }}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground font-semibold"><Plus className="h-4 w-4 mr-2" /> Add IPO Blog</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-full">
              <DialogHeader><DialogTitle>{editingId ? "Edit IPO Blog" : "Add New IPO Blog"}</DialogTitle></DialogHeader>
              <div className="mt-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-6">
                    <TabsTrigger value="basic" className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Basic</TabsTrigger>
                    <TabsTrigger value="gmp" className="flex items-center gap-1.5"><BarChart className="w-3.5 h-3.5" /> GMP/Lots</TabsTrigger>
                    <TabsTrigger value="timelines" className="flex items-center gap-1.5"><List className="w-3.5 h-3.5" /> Timelines</TabsTrigger>
                    <TabsTrigger value="financials" className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Financials</TabsTrigger>
                    <TabsTrigger value="content" className="flex items-center gap-1.5"><Layout className="w-3.5 h-3.5" /> Content</TabsTrigger>
                    <TabsTrigger value="seo" className="flex items-center gap-1.5"><LinkIcon className="w-3.5 h-3.5" /> SEO/Docs</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Title *</label>
                        <Input value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">URL Slug</label>
                        <Input
                          value={form.new_slug || form.slug || ''}
                          onChange={(e) => setForm({ ...form, new_slug: e.target.value, slug: e.target.value })}
                          placeholder="e.g. my-awesome-ipo"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Category</label>
                        <Select value={String(form.category || 'ipo_blogs')} onValueChange={(v) => setForm({ ...form, category: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ipo_blogs">IPO Blogs</SelectItem>
                            <SelectItem value="sme_ipo">SME IPO</SelectItem>
                            <SelectItem value="buyback">Buyback</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Upcoming Status</label>
                        <Select value={String(form.upcoming || '0')} onValueChange={(v) => setForm({ ...form, upcoming: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Current IPO</SelectItem>
                            <SelectItem value="1">Upcoming IPO</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Image URL / Upload</label>
                      <div className="flex gap-2">
                        <Input value={form.image || ''} onChange={(e) => setForm({ ...form, image: e.target.value })} className="flex-1" />
                        <div className="relative">
                          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                          <Button type="button" variant="outline" className="pointer-events-none shrink-0 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> Upload
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Highlight Text (Optional)</label>
                        <Input value={form.new_highlight_text || ''} onChange={(e) => setForm({ ...form, new_highlight_text: e.target.value })} placeholder="e.g. Subscribe Now" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Confidential Label</label>
                        <Select value={String(form.confidential || '0')} onValueChange={(v) => setForm({ ...form, confidential: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Normal</SelectItem>
                            <SelectItem value="1">Confidential</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="gmp" className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">GMP Date</label>
                        <Input value={form.gmp_date || ''} onChange={(e) => setForm({ ...form, gmp_date: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">IPO Price Band</label>
                        <Input value={form.gmp_ipo_price || ''} onChange={(e) => setForm({ ...form, gmp_ipo_price: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Latest GMP</label>
                        <Input value={form.gmp || ''} onChange={(e) => setForm({ ...form, gmp: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">GMP Last Updated</label>
                        <Input value={form.gmp_last_updated || ''} onChange={(e) => setForm({ ...form, gmp_last_updated: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="text-sm font-semibold">Lot Size Information (Comma separated)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-medium mb-1 block">Lots (e.g. Retail Min, Retail Max)</label>
                          <Input value={form.ipo_lots || ''} onChange={(e) => setForm({ ...form, ipo_lots: e.target.value })} placeholder="Retail Min, Retail Max..." />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block">Shares (e.g. 15, 195)</label>
                          <Input value={form.ipo_lots_share || ''} onChange={(e) => setForm({ ...form, ipo_lots_share: e.target.value })} placeholder="15, 195..." />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block">Amounts (e.g. ₹14,850, ₹1,93,050)</label>
                          <Input value={form.ipo_lots_amount || ''} onChange={(e) => setForm({ ...form, ipo_lots_amount: e.target.value })} placeholder="₹14,850, ₹1,93,050..." />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Lots Application Info (Optional)</label>
                        <Input value={form.ipo_lots_application || ''} onChange={(e) => setForm({ ...form, ipo_lots_application: e.target.value })} placeholder="e.g. 1 Lot, 13 Lots..." />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="timelines" className="space-y-6">
                    <h4 className="text-sm font-semibold">IPO Timelines (Comma separated)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium mb-1 block">Timeline Labels</label>
                        <Textarea
                          value={form.ipo_timeline_details || ''}
                          onChange={(e) => setForm({ ...form, ipo_timeline_details: e.target.value })}
                          placeholder="IPO Open Date, IPO Close Date, Allotment Date..."
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Timeline Dates</label>
                        <Textarea
                          value={form.ipo_timeline_description || ''}
                          onChange={(e) => setForm({ ...form, ipo_timeline_description: e.target.value })}
                          placeholder="Mar 19, 2025, Mar 21, 2025, Mar 24, 2025..."
                          rows={4}
                        />
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <label className="text-sm font-medium mb-1.5 block">Additional IPO Details (Summary)</label>
                      <Textarea value={form.ipo_details || ''} onChange={(e) => setForm({ ...form, ipo_details: e.target.value })} rows={3} />
                    </div>
                  </TabsContent>

                  <TabsContent value="financials" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Promoter Holding</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium mb-1 block">Pre-Issue %</label>
                            <Input value={form.promotor_hold_pre_issue || ''} onChange={(e) => setForm({ ...form, promotor_hold_pre_issue: e.target.value })} />
                          </div>
                          <div>
                            <label className="text-xs font-medium mb-1 block">Post-Issue %</label>
                            <Input value={form.promotor_hold_post_issue || ''} onChange={(e) => setForm({ ...form, promotor_hold_post_issue: e.target.value })} />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Key KPIs (Comma separated)</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium mb-1 block">KPI Names</label>
                            <Input value={form.key_kpi || ''} onChange={(e) => setForm({ ...form, key_kpi: e.target.value })} placeholder="ROE, ROCE, Debt/Equity..." />
                          </div>
                          <div>
                            <label className="text-xs font-medium mb-1 block">KPI Values</label>
                            <Input value={form.key_value || ''} onChange={(e) => setForm({ ...form, key_value: e.target.value })} placeholder="15%, 20%, 0.5..." />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="text-sm font-semibold">Financial Summary Table (HTML)</h4>
                      <Textarea
                        value={form.finantial_information_assets || ''}
                        onChange={(e) => setForm({ ...form, finantial_information_assets: e.target.value })}
                        rows={6}
                        placeholder="Paste your HTML table here for financial assets/summary..."
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                      <div>
                        <label className="text-xs font-medium mb-1 block">Total Revenue</label>
                        <Input value={form.finantial_information_revenue || ''} onChange={(e) => setForm({ ...form, finantial_information_revenue: e.target.value })} placeholder="e.g. ₹4,500 Cr" />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Profit After Tax</label>
                        <Input value={form.finantial_information_profit_tax || ''} onChange={(e) => setForm({ ...form, finantial_information_profit_tax: e.target.value })} placeholder="e.g. ₹800 Cr" />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Net Worth</label>
                        <Input value={form.finantial_information_networth || ''} onChange={(e) => setForm({ ...form, finantial_information_networth: e.target.value })} placeholder="e.g. ₹2,100 Cr" />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Total Borrowing</label>
                        <Input value={form.finantial_information_borrowing || ''} onChange={(e) => setForm({ ...form, finantial_information_borrowing: e.target.value })} placeholder="e.g. ₹150 Cr" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">KPI EPS (Pre/Post)</label>
                        <div className="flex gap-2">
                          <Input value={form.key_pri_ipo_eps || ''} onChange={(e) => setForm({ ...form, key_pri_ipo_eps: e.target.value })} placeholder="Pre EPS" />
                          <Input value={form.key_pos_ipo_eps || ''} onChange={(e) => setForm({ ...form, key_pos_ipo_eps: e.target.value })} placeholder="Post EPS" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">KPI P/E (Pre/Post)</label>
                        <div className="flex gap-2">
                          <Input value={form.key_pre_ipo_pe || ''} onChange={(e) => setForm({ ...form, key_pre_ipo_pe: e.target.value })} placeholder="Pre P/E" />
                          <Input value={form.key_post_ipo_pe || ''} onChange={(e) => setForm({ ...form, key_post_ipo_pe: e.target.value })} placeholder="Post P/E" />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="content" className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Main Long Content (HTML)</label>
                      <Textarea value={form.content || ''} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">IPO Short Description</label>
                      <Textarea value={form.ipo_description || ''} onChange={(e) => setForm({ ...form, ipo_description: e.target.value })} rows={3} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Competitive Strengths (Comma separated)</label>
                      <Textarea value={form.competative_strenght || ''} onChange={(e) => setForm({ ...form, competative_strenght: e.target.value })} rows={3} placeholder="Strong management, High growth, etc..." />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">FAQs (JSON or Text format)</label>
                      <Textarea value={form.faqs || ''} onChange={(e) => setForm({ ...form, faqs: e.target.value })} rows={4} placeholder='[{"question": "What is...", "answer": "..."}]' />
                    </div>
                  </TabsContent>

                  <TabsContent value="seo" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Meta Title</label>
                        <Input value={form.meta_title || ''} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Meta Keywords</label>
                        <Input value={form.keyword || ''} onChange={(e) => setForm({ ...form, keyword: e.target.value })} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-1.5 block">Meta Description</label>
                        <Textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
                      </div>
                    </div>
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="text-sm font-semibold flex items-center gap-2"><HelpCircle className="w-4 h-4" /> Official Documents</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-medium mb-1 block">RHP Link/Path</label>
                          <Input value={form.rhp || ''} onChange={(e) => setForm({ ...form, rhp: e.target.value })} placeholder="rhp-file.pdf" />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block">DRHP Link/Path</label>
                          <Input value={form.drhp || ''} onChange={(e) => setForm({ ...form, drhp: e.target.value })} placeholder="drhp-file.pdf" />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block">Confidential DRHP</label>
                          <Input value={form.confidential_drhp || ''} onChange={(e) => setForm({ ...form, confidential_drhp: e.target.value })} placeholder="confidential-drhp.pdf" />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="pt-6">
                  <Button onClick={handleSave} disabled={saving} className="w-full bg-primary text-primary-foreground font-semibold h-12 text-lg">
                    {saving ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Saving...</> : editingId ? "Save All Changes" : "Create New IPO Record"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />Loading database...</div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-3 px-4 font-semibold">IPO Title</th>
                  <th className="text-left py-3 px-4 font-semibold hidden md:table-cell">Category</th>
                  <th className="text-left py-3 px-4 font-semibold">Status/Type</th>
                  <th className="text-left py-3 px-4 font-semibold hidden lg:table-cell">GMP</th>
                  <th className="text-left py-3 px-4 font-semibold hidden lg:table-cell">Price</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr></thead>
                <tbody>
                  {blogs.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No entries found.</td></tr>
                  ) : blogs.map((b) => (
                    <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium max-w-[200px] md:max-w-xs">
                        <div className="truncate">{b.title}</div>
                        <div className="text-xs text-muted-foreground truncate font-mono">/{b.slug}</div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground hidden md:table-cell capitalize">{(b.category || "—").replace('_', ' ')}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={b.upcoming == "1" ? "bg-amber-100/50 text-amber-700 border-amber-300" : "bg-emerald-100/50 text-emerald-700 border-emerald-300"}>
                          {b.upcoming == "1" ? "Upcoming" : "Current"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{formatDisplayValue(b.gmp)}</td>
                      <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{formatDisplayValue(b.gmp_ipo_price)}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(b)} disabled={saving}><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(b.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchBlogs(page - 1)}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <span className="text-sm font-medium text-muted-foreground">Page {page} of {totalPages}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchBlogs(page + 1)}
                  disabled={page >= totalPages}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageAdminBlogs;
