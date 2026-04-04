import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, ChevronLeft, ChevronRight, Layout, BarChart, Info, List, Link as LinkIcon, Database, HelpCircle, Bold, Italic, Type, Palette, RemoveFormatting, Code, Heading1, Heading2, Heading3, Download, FileText, Search } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn, formatIndianNumber } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import RichEditor from "@/components/ui/RichEditor";

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
  user_id?: string | number;
  created_at: string;
}

const emptyForm: Partial<AdminBlog> = {
  title: "", new_slug: "", slug: "", category: "ipo_updates", status: "1", upcoming: "0", image: "",
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
  const { user } = useAuth();
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
    let displayStr = s;
    if (s.startsWith('[') && s.endsWith(']')) {
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) {
          const items = parsed.filter(i => i !== null && i !== undefined && !BAD_VALUES.has(String(i).toLowerCase().trim()));
          if (items.length === 0) return '—';
          displayStr = items[0] !== undefined ? String(items[0]) : '—';
        }
      } catch (e) { }
    }
    return formatIndianNumber(fixUnicode(displayStr));
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
  const [total, setTotal] = useState(0);
  const [activeTab, setActiveTab] = useState("0"); // "0" for Current, "1" for Upcoming
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  // States for table-wise data
  const [lotRows, setLotRows] = useState<{ app: string; lots: string; shares: string; amount: string }[]>([]);
  const [timelineRows, setTimelineRows] = useState<{ label: string; date: string }[]>([]);
  const [kpiRows, setKpiRows] = useState<{ name: string; value: string }[]>([]);
  const [additionalDetailsRows, setAdditionalDetailsRows] = useState<{ label: string; value: string }[]>([]);
  const [financialRows, setFinancialRows] = useState<{ ended: string; assets: string; revenue: string; profit: string; networth: string; reserves: string; borrowing: string }[]>([]);
  const [strengthRows, setStrengthRows] = useState<string[]>([]);
  const [faqRows, setFaqRows] = useState<{ question: string; answer: string }[]>([]);

  const splitValue = (val: any): string[] => {
    if (val === null || val === undefined) return [];
    if (Array.isArray(val)) {
      return val.map(v => {
        const s = String(v).trim();
        return (v === null || v === undefined || s.toLowerCase() === 'null') ? '' : s;
      });
    }
    const s = String(val).trim();
    if (s.startsWith('[') && s.endsWith(']')) {
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) {
          return parsed.map(v => {
            const sv = String(v).trim();
            return (v === null || v === undefined || sv.toLowerCase() === 'null') ? '' : sv;
          });
        }
      } catch (e) { }
    }
    return s.split(',').map(v => v.trim()).filter(v => v.toLowerCase() !== 'null');
  };

  const fetchBlogs = async (p = 1, upcomingTab = activeTab, searchTerm = search, cat = activeCategory) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: p.toString(),
        limit: "20",
        summary: "1",
        upcoming: upcomingTab,
        search: searchTerm
      });
      if (cat !== "all") {
        queryParams.append("category", cat);
      }
      const res = await fetch(`/api/admin-blogs?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.data || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
        setPage(data.page || 1);
      }
    } catch (err) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(1, activeTab, search, activeCategory);
  }, [activeTab, activeCategory]);

  useEffect(() => {
    if (search === "") {
        fetchBlogs(1, activeTab, "");
        return;
    }
    const timer = setTimeout(() => {
      fetchBlogs(1, activeTab, search, activeCategory);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);



  const safeJSONStringify = (val: any) => {
    if (typeof val === "string") {
      try {
        JSON.parse(val);
        return val;
      } catch {
        return JSON.stringify(val);
      }
    }
    return JSON.stringify(val);
  };


  const cleanNumber = (val: string) => {
    if (!val) return 0;
    return Number(
      val.replace(/[^0-9]/g, "") // remove ₹ , etc
    );
  };



  const toJSONArray = (val: any) => {
    if (val === null || val === undefined || val === "") return JSON.stringify([]);
    return JSON.stringify([val]);
  };

  const toJSONString = (val: any) => {
    if (val === null || val === undefined || val === "") return JSON.stringify("");
    return JSON.stringify(val);
  };

  const handleSave = async () => {
    if (!form.title) {
      toast.error("Title required");
      return;
    }

    setSaving(true);

    try {
      const updatedForm: any = { ...form };

      delete updatedForm.id;
      delete updatedForm.created_at;
      delete updatedForm.updated_at;


      if (!editingId && !updatedForm.user_id) {
        updatedForm.user_id = Number(user?.id) || 1;
      }


      updatedForm.status = Number(form.status || 1);
      updatedForm.upcoming = Number(form.upcoming || 0);



      updatedForm.gmp = toJSONArray(form.gmp);
      updatedForm.gmp_date = toJSONArray(form.gmp_date);
      updatedForm.gmp_ipo_price = toJSONArray(form.gmp_ipo_price);
      updatedForm.gmp_last_updated = toJSONArray(form.gmp_last_updated);



      updatedForm.ipo_lots_application = JSON.stringify(
        lotRows.map(r => r.app?.toString().trim()).filter(Boolean)
      );

      updatedForm.ipo_lots = JSON.stringify(
        lotRows.map(r => Number(r.lots) || 0)
      );

      updatedForm.ipo_lots_share = JSON.stringify(
        lotRows.map(r => cleanNumber(r.shares))
      );

      updatedForm.ipo_lots_amount = JSON.stringify(
        lotRows.map(r => cleanNumber(r.amount))
      );


      updatedForm.ipo_timeline_details = JSON.stringify(
        timelineRows.map(r => r.label)
      );

      updatedForm.ipo_timeline_description = JSON.stringify(
        timelineRows.map(r => r.date)
      );

      updatedForm.ipo_details = JSON.stringify(
        additionalDetailsRows.map(r => r.label)
      );

      updatedForm.ipo_description = JSON.stringify(
        additionalDetailsRows.map(r => r.value)
      );



      updatedForm.key_kpi = JSON.stringify(
        kpiRows.map(r => r.name)
      );

      updatedForm.key_value = JSON.stringify(
        kpiRows.map(r => r.value)
      );

      // =========================
      // ✅ FINANCIALS
      // =========================

      updatedForm.finantial_information_ended = JSON.stringify(
        financialRows.map(r => r.ended)
      );

      updatedForm.finantial_information_assets = JSON.stringify(
        financialRows.map(r => r.assets)
      );

      updatedForm.finantial_information_revenue = JSON.stringify(
        financialRows.map(r => r.revenue)
      );

      updatedForm.finantial_information_profit_tax = JSON.stringify(
        financialRows.map(r => r.profit)
      );

      updatedForm.finantial_information_networth = JSON.stringify(
        financialRows.map(r => r.networth)
      );

      updatedForm.financial_info_reserves_surplus = JSON.stringify(
        financialRows.map(r => r.reserves)
      );

      updatedForm.finantial_information_borrowing = JSON.stringify(
        financialRows.map(r => r.borrowing)
      );

      // =========================
      // ✅ CONTENT
      // =========================

      updatedForm.competative_strenght = JSON.stringify(
        strengthRows.filter(s => s.trim())
      );

      updatedForm.faqs = JSON.stringify(
        faqRows.filter(f => f.question.trim())
      );

      // =========================
      // ⚠️ IMPORTANT EXTRA FIXES
      // =========================

      // ये भी JSON constraints me aa sakte hain
      updatedForm.key_pri_ipo_eps = toJSONString(form.key_pri_ipo_eps);
      updatedForm.key_pos_ipo_eps = toJSONString(form.key_pos_ipo_eps);
      updatedForm.key_pre_ipo_pe = toJSONString(form.key_pre_ipo_pe);
      updatedForm.key_post_ipo_pe = toJSONString(form.key_post_ipo_pe);

      // =========================

      console.log("FINAL DATA GOING TO API 👉", updatedForm);

      const url = editingId
        ? `/api/admin-blogs/${editingId}`
        : "/api/admin-blogs";

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedForm),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save failed");
      }

      toast.success(editingId ? "Blog updated!" : "Blog created!");

      setForm(emptyForm);
      setEditingId(null);
      setDialogOpen(false);
      fetchBlogs(page, activeTab, search, activeCategory);

    } catch (err: any) {
      console.error(err);
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

        // Populate table states
        const apps = splitValue(fullData.ipo_lots_application);
        const lots = splitValue(fullData.ipo_lots);
        const shares = splitValue(fullData.ipo_lots_share);
        const amounts = splitValue(fullData.ipo_lots_amount);
        const maxLots = Math.max(apps.length, lots.length, shares.length, amounts.length);
        const newLotRows = [];
        for (let i = 0; i < maxLots; i++) {
          newLotRows.push({ app: apps[i] || '', lots: lots[i] || '', shares: shares[i] || '', amount: amounts[i] || '' });
        }
        setLotRows(newLotRows);

        const timelineLabels = splitValue(fullData.ipo_timeline_details);
        const timelineDates = splitValue(fullData.ipo_timeline_description);
        const maxTimelines = Math.max(timelineLabels.length, timelineDates.length);
        const newTimelineRows = [];
        for (let i = 0; i < maxTimelines; i++) {
          newTimelineRows.push({ label: timelineLabels[i] || '', date: timelineDates[i] || '' });
        }
        setTimelineRows(newTimelineRows);

        const kpiNames = splitValue(fullData.key_kpi);
        const kpiValues = splitValue(fullData.key_value);
        const maxKpis = Math.max(kpiNames.length, kpiValues.length);
        const newKpiRows = [];
        for (let i = 0; i < maxKpis; i++) {
          newKpiRows.push({ name: kpiNames[i] || '', value: kpiValues[i] || '' });
        }
        setKpiRows(newKpiRows);

        // Additional Details
        const detailLabels = splitValue(fullData.ipo_details);
        const detailValues = splitValue(fullData.ipo_description);
        const maxDetails = Math.max(detailLabels.length, detailValues.length);
        const newDetailRows = [];
        for (let i = 0; i < maxDetails; i++) {
          newDetailRows.push({ label: detailLabels[i] || '', value: detailValues[i] || '' });
        }
        setAdditionalDetailsRows(newDetailRows);

        // Financials
        const finEnded = splitValue(fullData.finantial_information_ended);
        const finAssets = splitValue(fullData.finantial_information_assets);
        const finRev = splitValue(fullData.finantial_information_revenue);
        const finProfit = splitValue(fullData.finantial_information_profit_tax);
        const finNet = splitValue(fullData.finantial_information_networth);
        const finRes = splitValue(fullData.financial_info_reserves_surplus);
        const finBor = splitValue(fullData.finantial_information_borrowing);
        const maxFin = Math.max(finEnded.length, finAssets.length, finRev.length, finProfit.length, finNet.length, finRes.length, finBor.length);
        const newFinRows = [];
        for (let i = 0; i < maxFin; i++) {
          newFinRows.push({
            ended: finEnded[i] || '',
            assets: finAssets[i] || '',
            revenue: finRev[i] || '',
            profit: finProfit[i] || '',
            networth: finNet[i] || '',
            reserves: finRes[i] || '',
            borrowing: finBor[i] || ''
          });
        }
        setFinancialRows(newFinRows);

        // Content extras
        setStrengthRows(splitValue(fullData.competative_strenght));
        let parsedFaqs = [];
        try {
          const rawFaqs = fullData.faqs;
          if (rawFaqs) {
            parsedFaqs = typeof rawFaqs === 'string' ? JSON.parse(rawFaqs) : rawFaqs;
          }
        } catch { parsedFaqs = []; }
        setFaqRows(Array.isArray(parsedFaqs) ? parsedFaqs.map((f: any) => ({ question: f.question || '', answer: f.answer || '' })) : []);

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

  const handleAddNew = () => {
    setForm({ ...emptyForm, upcoming: activeTab });
    setEditingId(null);
    setLotRows([
      { app: 'Individual investors (Retail) (Min)', lots: '', shares: '', amount: '' },
      { app: 'Individual investors (Retail) (Max)', lots: '', shares: '', amount: '' },
      { app: 'S-HNI (Min)', lots: '', shares: '', amount: '' },
      { app: 'S-HNI (Max)', lots: '', shares: '', amount: '' },
      { app: 'B-HNI (Min)', lots: '', shares: '', amount: '' }
    ]);
    setTimelineRows([
      { label: 'IPO Open Date', date: '' },
      { label: 'IPO Close Date', date: '' },
      { label: 'Basis of Allotment', date: '' },
      { label: 'Initiation of Refunds', date: '' },
      { label: 'Credit of Shares to Demat', date: '' },
      { label: 'Listing Date', date: '' },
      { label: 'Cut-off time for UPI mandate confirmation', date: '' }
    ]);
    setKpiRows([
      { name: 'ROE', value: '' },
      { name: 'ROCE', value: '' },
      { name: 'Debt/Equity', value: '' },
      { name: 'RoNW', value: '' },
      { name: 'PAT Margin', value: '' },
      { name: 'EBITDA Margin', value: '' },
      { name: 'Price to Book Value', value: '' }
    ]);
    setAdditionalDetailsRows([
      { label: 'IPO Date', value: '' },
      { label: 'Listing Date', value: '' },
      { label: 'Face Value', value: '₹10 Per Equity Share' },
      { label: 'Issue Price Band', value: '' },
      { label: 'Lot Size', value: '' },
      { label: 'Sale Type', value: 'Fresh Issue + Offer For Sale' },
      { label: 'Total Issue Size', value: '' },
      { label: 'Reserved for Market Maker', value: '' },
      { label: 'Fresh Issue(Ex Market Maker)', value: '' },
      { label: 'Offer for Sale', value: '' },
      { label: 'Net Offered to Public', value: '' },
      { label: 'Issue Type', value: 'Book Built Issue' },
      { label: 'Listing At', value: 'BSESME / NSESME' },
      { label: 'Share Holding Pre Issue', value: '' },
      { label: 'Share Holding Post Issue', value: '' }
    ]);
    setFinancialRows([
      { ended: '31 Mar 2024', assets: '', revenue: '', profit: '', networth: '', reserves: '', borrowing: '' },
      { ended: '31 Mar 2023', assets: '', revenue: '', profit: '', networth: '', reserves: '', borrowing: '' },
      { ended: '31 Mar 2022', assets: '', revenue: '', profit: '', networth: '', reserves: '', borrowing: '' }
    ]);
    setStrengthRows(['', '', '']);
    setFaqRows([{ question: '', answer: '' }]);
    setDialogOpen(true);
  };

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  };

  const getAutoValues = () => {
    const lotSizeRow = additionalDetailsRows.find(r => r.label.toLowerCase().includes('lot size'));
    const priceBandRow = additionalDetailsRows.find(r => r.label.toLowerCase().includes('price band'));

    let lotSize = 0;
    if (lotSizeRow) {
      const match = lotSizeRow.value.match(/(\d+[,]*\d*)/);
      if (match) lotSize = parseInt(match[1].replace(/,/g, ''));
    }

    let maxPrice = 0;
    if (priceBandRow) {
      const prices = priceBandRow.value.match(/(\d+)/g);
      if (prices && prices.length > 0) {
        maxPrice = Math.max(...prices.map(p => parseInt(p)));
      }
    }

    return { lotSize, maxPrice };
  };

  const calculateLotLine = (lotsStr: string, index: number) => {
    const { lotSize, maxPrice } = getAutoValues();
    const lots = parseInt(lotsStr) || 0;
    const shares = lots * lotSize;
    const amountNum = shares * maxPrice;

    const newRows = [...lotRows];
    newRows[index].lots = lotsStr;
    newRows[index].shares = shares > 0 ? formatIndianNumber(shares) : '';
    newRows[index].amount = amountNum > 0 ? `₹${formatIndianNumber(amountNum)}` : '';
    setLotRows(newRows);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, folder = "admin_blogs", isPdf = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isPdf && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error("Please upload a PDF file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Max file size is 10MB");
      return;
    }

    const formData = new FormData();
    formData.append("folder", folder);
    formData.append("file", file);

    const tId = toast.loading(`Uploading ${fieldName}...`);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setForm((prev) => ({ ...prev, [fieldName]: data.url }));
      toast.success(`${fieldName} uploaded successfully!`, { id: tId });
    } catch (err) {
      console.error(err);
      toast.error(`Failed to upload ${fieldName}`, { id: tId });
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
            <p className="text-sm text-muted-foreground">Extensive DB of {total} IPOs (Page {page} of {totalPages})</p>
          </div>

          <div className="flex-1 max-w-lg mx-4 flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Search IPOs by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 bg-card border-border/50 focus-visible:ring-primary/20 transition-all hover:border-primary/50"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search className="w-4 h-4" />
              </div>
            </div>
            <Select value={activeCategory} onValueChange={setActiveCategory}>
              <SelectTrigger className="w-[180px] h-10 bg-card border-border/50">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="ipo_updates">IPO Updates</SelectItem>
                <SelectItem value="ipo_blogs">IPO Blogs</SelectItem>
                <SelectItem value="city_blogs">City Blogs</SelectItem>
                <SelectItem value="news">News</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setForm(emptyForm); setEditingId(null); } }}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground font-semibold" onClick={handleAddNew}><Plus className="h-4 w-4 mr-2" /> Add IPO Blog</Button>
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
                        <Input
                          value={form.title || ''}
                          onChange={(e) => {
                            const newTitle = e.target.value;
                            const newSlug = slugify(newTitle);
                            setForm({
                              ...form,
                              title: newTitle,
                              slug: editingId ? (form.slug || newSlug) : newSlug,
                              new_slug: editingId ? (form.new_slug || form.slug || newSlug) : newSlug
                            });
                          }}
                        />
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
                        <label className="text-sm font-medium mb-1.5 block">Upcoming Status</label>
                        <Select value={String(form.upcoming || '0')} onValueChange={(v) => setForm({ ...form, upcoming: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Current IPO</SelectItem>
                            <SelectItem value="1">Upcoming IPO</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Blog Category</label>
                        <Select value={form.category || 'ipo_updates'} onValueChange={(v) => setForm({ ...form, category: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ipo_updates">IPO Updates</SelectItem>
                            <SelectItem value="ipo_blogs">IPO Blogs</SelectItem>
                            <SelectItem value="city_blogs">City Blogs</SelectItem>
                            <SelectItem value="news">News</SelectItem>
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
                    </div>
                  </TabsContent>

                  <TabsContent value="gmp" className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">GMP Date</label>
                        <div className="flex gap-2">
                          <Input value={form.gmp_date || ''} onChange={(e) => setForm({ ...form, gmp_date: e.target.value })} className="flex-1" />
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="shrink-0 w-10 p-0 h-10"><CalendarIcon className="h-4 w-4 text-muted-foreground" /></Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                              <Calendar
                                mode="single"
                                onSelect={(date) => {
                                  if (date) setForm({ ...form, gmp_date: format(date, "dd MMM, yyyy") });
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">IPO Price Band</label>
                        <Input
                          value={form.gmp_ipo_price || ''}
                          onChange={(e) => setForm({ ...form, gmp_ipo_price: e.target.value })}
                          onBlur={(e) => setForm({ ...form, gmp_ipo_price: formatIndianNumber(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Latest GMP</label>
                        <Input
                          value={form.gmp || ''}
                          onChange={(e) => setForm({ ...form, gmp: e.target.value })}
                          onBlur={(e) => setForm({ ...form, gmp: formatIndianNumber(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">GMP Last Updated</label>
                        <div className="flex gap-2">
                          <Input value={form.gmp_last_updated || ''} onChange={(e) => setForm({ ...form, gmp_last_updated: e.target.value })} className="flex-1" />
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="shrink-0 w-10 p-0 h-10"><CalendarIcon className="h-4 w-4 text-muted-foreground" /></Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                              <Calendar
                                mode="single"
                                onSelect={(date) => {
                                  if (date) setForm({ ...form, gmp_last_updated: format(date, "dd MMM, yyyy HH:mm") });
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold">Additional IPO Details (Summary)</h4>
                        <Button type="button" variant="outline" size="sm" onClick={() => setAdditionalDetailsRows([...additionalDetailsRows, { label: '', value: '' }])}>
                          <Plus className="w-3 h-3 mr-1" /> Add Detail
                        </Button>
                      </div>
                      <div className="overflow-x-auto border rounded-lg">
                        <table className="w-full text-xs">
                          <thead className="bg-muted/50 border-b">
                            <tr>
                              <th className="p-2 text-left font-semibold w-2/5">Detail Label</th>
                              <th className="p-2 text-left font-semibold w-2/5">Description/Value</th>
                              <th className="p-2 text-center font-semibold w-10"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {additionalDetailsRows.map((row, idx) => (
                              <tr key={idx} className="border-b last:border-0 hover:bg-muted/30">
                                <td className="p-2"><Input className="h-8 text-xs" value={row.label} onChange={(e) => { const newRows = [...additionalDetailsRows]; newRows[idx].label = e.target.value; setAdditionalDetailsRows(newRows); }} placeholder="Detail Label" /></td>
                                <td className="p-2">
                                  <div className="flex gap-1">
                                    <Input
                                      className="h-8 text-xs flex-1"
                                      value={row.value}
                                      onChange={(e) => { const newRows = [...additionalDetailsRows]; newRows[idx].value = e.target.value; setAdditionalDetailsRows(newRows); }}
                                      onBlur={(e) => { const newRows = [...additionalDetailsRows]; newRows[idx].value = formatIndianNumber(e.target.value); setAdditionalDetailsRows(newRows); }}
                                      placeholder="Value"
                                    />
                                    {(row.label.toLowerCase().includes('date')) && (
                                      <div className="flex gap-1">
                                        {row.label.toLowerCase().includes('ipo date') ? (
                                          <>
                                            <Popover>
                                              <PopoverTrigger asChild>
                                                <Button variant="outline" className="h-8 w-8 p-0 shrink-0" title="IPO Start Date">
                                                  <CalendarIcon className="h-3 w-3 text-blue-500" />
                                                </Button>
                                              </PopoverTrigger>
                                              <PopoverContent className="w-auto p-0" align="end">
                                                <Calendar
                                                  mode="single"
                                                  onSelect={(date) => {
                                                    if (date) {
                                                      const n = [...additionalDetailsRows];
                                                      const currentVal = n[idx].value || "";
                                                      const hasRange = currentVal.includes(' to ');
                                                      const parts = hasRange ? currentVal.split(' to ') : [currentVal, ""];

                                                      const startDay = format(date, "d");
                                                      const endPart = parts[1] || parts[0]; // If was single date, it becomes the end part

                                                      if (endPart && endPart.includes(',') && !hasRange) {
                                                        n[idx].value = `${startDay} to ${endPart}`;
                                                      } else if (hasRange) {
                                                        n[idx].value = `${startDay} to ${parts[1]}`;
                                                      } else {
                                                        n[idx].value = format(date, "d MMM, yyyy");
                                                      }
                                                      setAdditionalDetailsRows(n);
                                                    }
                                                  }}
                                                  initialFocus
                                                />
                                              </PopoverContent>
                                            </Popover>
                                            <Popover>
                                              <PopoverTrigger asChild>
                                                <Button variant="outline" className="h-8 w-8 p-0 shrink-0" title="IPO End Date">
                                                  <CalendarIcon className="h-3 w-3 text-green-500" />
                                                </Button>
                                              </PopoverTrigger>
                                              <PopoverContent className="w-auto p-0" align="end">
                                                <Calendar
                                                  mode="single"
                                                  onSelect={(date) => {
                                                    if (date) {
                                                      const n = [...additionalDetailsRows];
                                                      const currentVal = n[idx].value || "";
                                                      const hasRange = currentVal.includes(' to ');
                                                      const parts = hasRange ? currentVal.split(' to ') : [currentVal, ""];

                                                      const startPart = parts[0] || "";
                                                      const startDay = startPart.split(' ')[0]; // Extract numeric day if it was "5 Mar, 2026"
                                                      const endValue = format(date, "d MMM, yyyy");

                                                      if (startDay && !isNaN(parseInt(startDay))) {
                                                        n[idx].value = `${startDay} to ${endValue}`;
                                                      } else {
                                                        n[idx].value = endValue;
                                                      }
                                                      setAdditionalDetailsRows(n);
                                                    }
                                                  }}
                                                  initialFocus
                                                />
                                              </PopoverContent>
                                            </Popover>
                                          </>
                                        ) : (
                                          <Popover>
                                            <PopoverTrigger asChild>
                                              <Button variant="outline" className="h-8 w-8 p-0 shrink-0"><CalendarIcon className="h-3 w-3" /></Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="end">
                                              <Calendar
                                                mode="single"
                                                onSelect={(date) => {
                                                  if (date) {
                                                    const n = [...additionalDetailsRows];
                                                    n[idx].value = format(date, "dd MMM yyyy");
                                                    setAdditionalDetailsRows(n);
                                                  }
                                                }}
                                                initialFocus
                                              />
                                            </PopoverContent>
                                          </Popover>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="p-2 text-center">
                                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => setAdditionalDetailsRows(additionalDetailsRows.filter((_, i) => i !== idx))}>
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                            {additionalDetailsRows.length === 0 && (
                              <tr><td colSpan={3} className="p-4 text-center text-muted-foreground italic">No additional details added.</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold">Lot Size Information</h4>
                        <Button type="button" variant="outline" size="sm" onClick={() => setLotRows([...lotRows, { app: '', lots: '', shares: '', amount: '' }])}>
                          <Plus className="w-3 h-3 mr-1" /> Add Category
                        </Button>
                      </div>
                      <div className="overflow-x-auto border rounded-lg">
                        <table className="w-full text-xs">
                          <thead className="bg-muted/50 border-b">
                            <tr>
                              <th className="p-2 text-left font-semibold">Application Info</th>
                              <th className="p-2 text-left font-semibold">Lots</th>
                              <th className="p-2 text-left font-semibold">Shares</th>
                              <th className="p-2 text-left font-semibold">Amount</th>
                              <th className="p-2 text-center font-semibold w-10"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {lotRows.map((row, idx) => (
                              <tr key={idx} className="border-b last:border-0 hover:bg-muted/30">
                                <td className="p-2 w-1/3"><Input className="h-8 text-xs font-medium" value={row.app} onChange={(e) => { const n = [...lotRows]; n[idx].app = e.target.value; setLotRows(n); }} placeholder="e.g. Retail Individual" /></td>
                                <td className="p-2 w-1/6"><Input className="h-8 text-xs text-center" value={row.lots} onChange={(e) => calculateLotLine(e.target.value, idx)} placeholder="0" /></td>
                                <td className="p-2 w-1/4"><Input className="h-8 text-xs text-center" value={row.shares} onChange={(e) => { const n = [...lotRows]; n[idx].shares = e.target.value; setLotRows(n); }} onBlur={(e) => { const n = [...lotRows]; n[idx].shares = formatIndianNumber(e.target.value); setLotRows(n); }} placeholder="0" /></td>
                                <td className="p-2 w-1/4"><Input className="h-8 text-xs" value={row.amount} onChange={(e) => { const n = [...lotRows]; n[idx].amount = e.target.value; setLotRows(n); }} onBlur={(e) => { const n = [...lotRows]; n[idx].amount = formatIndianNumber(e.target.value); setLotRows(n); }} placeholder="₹0" /></td>
                                <td className="p-2 text-center">
                                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => setLotRows(lotRows.filter((_, i) => i !== idx))}>
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                            {lotRows.length === 0 && (
                              <tr><td colSpan={5} className="p-4 text-center text-muted-foreground italic">No lot information added. Click "Add Row" to start.</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="timelines" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">IPO Timelines</h4>
                      <Button type="button" variant="outline" size="sm" onClick={() => setTimelineRows([...timelineRows, { label: '', date: '' }])}>
                        <Plus className="w-3 h-3 mr-1" /> Add Row
                      </Button>
                    </div>
                    <div className="overflow-x-auto border rounded-lg">
                      <table className="w-full text-xs">
                        <thead className="bg-muted/50 border-b">
                          <tr>
                            <th className="p-2 text-left font-semibold">Timeline Event Label</th>
                            <th className="p-2 text-left font-semibold">Date/Details</th>
                            <th className="p-2 text-center font-semibold w-10"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {timelineRows.map((row, idx) => (
                            <tr key={idx} className="border-b last:border-0 hover:bg-muted/30">
                              <td className="p-2 w-1/2"><Input className="h-8 text-xs" value={row.label} onChange={(e) => { const newRows = [...timelineRows]; newRows[idx].label = e.target.value; setTimelineRows(newRows); }} placeholder="IPO Open Date" /></td>
                              <td className="p-2 w-1/2">
                                <div className="flex gap-1">
                                  <Input
                                    className="h-8 text-xs flex-1"
                                    value={row.date}
                                    onChange={(e) => { const newRows = [...timelineRows]; newRows[idx].date = e.target.value; setTimelineRows(newRows); }}
                                    placeholder="Mar 19, 2025"
                                  />
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="outline" className={cn("h-8 w-8 p-0 text-muted-foreground")}>
                                        <CalendarIcon className="h-3 w-3" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="end">
                                      <Calendar
                                        mode="single"
                                        onSelect={(date) => {
                                          if (date) {
                                            const newRows = [...timelineRows];
                                            newRows[idx].date = format(date, "EEE, MMM d, yyyy");
                                            setTimelineRows(newRows);
                                          }
                                        }}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </td>
                              <td className="p-2 text-center">
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => setTimelineRows(timelineRows.filter((_, i) => i !== idx))}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                          {timelineRows.length === 0 && (
                            <tr><td colSpan={3} className="p-4 text-center text-muted-foreground italic">No timeline entries added.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  <TabsContent value="financials" className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold">Financial Summary (Values in ₹ Crore)</h4>
                        <Button type="button" variant="outline" size="sm" onClick={() => setFinancialRows([...financialRows, { ended: '', assets: '', revenue: '', profit: '', networth: '', reserves: '', borrowing: '' }])}>
                          <Plus className="w-3 h-3 mr-1" /> Add Year
                        </Button>
                      </div>
                      <div className="overflow-x-auto border rounded-xl shadow-sm">
                        <table className="w-full text-[11px]">
                          <thead className="bg-muted/50 border-b">
                            <tr>
                              <th className="p-2 text-left font-bold w-24">Period Ended</th>
                              <th className="p-2 text-left font-bold">Assets</th>
                              <th className="p-2 text-left font-bold">Revenue</th>
                              <th className="p-2 text-left font-bold">Profit (PAT)</th>
                              <th className="p-2 text-left font-bold">Net Worth</th>
                              <th className="p-2 text-left font-bold">Reserves</th>
                              <th className="p-2 text-left font-bold">Borrowing</th>
                              <th className="p-2 text-center font-bold w-10"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {financialRows.map((row, idx) => (
                              <tr key={idx} className="border-b last:border-0 hover:bg-muted/30">
                                <td className="p-1">
                                  <div className="flex gap-1 items-center">
                                    <Input className="h-8 text-[11px] px-2 flex-1 min-w-[80px]" value={row.ended} onChange={(e) => { const n = [...financialRows]; n[idx].ended = e.target.value; setFinancialRows(n); }} placeholder="31 Mar 2024" />
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button variant="outline" className="h-7 w-7 p-0 shrink-0"><CalendarIcon className="h-3 w-3" /></Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                          mode="single"
                                          onSelect={(date) => {
                                            if (date) {
                                              const n = [...financialRows];
                                              n[idx].ended = format(date, "dd MMM yyyy");
                                              setFinancialRows(n);
                                            }
                                          }}
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                </td>
                                <td className="p-1"><Input className="h-8 text-[11px] px-2" value={row.assets} onChange={(e) => { const n = [...financialRows]; n[idx].assets = e.target.value; setFinancialRows(n); }} onBlur={(e) => { const n = [...financialRows]; n[idx].assets = formatIndianNumber(e.target.value); setFinancialRows(n); }} placeholder="56.67" /></td>
                                <td className="p-1"><Input className="h-8 text-[11px] px-2" value={row.revenue} onChange={(e) => { const n = [...financialRows]; n[idx].revenue = e.target.value; setFinancialRows(n); }} onBlur={(e) => { const n = [...financialRows]; n[idx].revenue = formatIndianNumber(e.target.value); setFinancialRows(n); }} placeholder="45.63" /></td>
                                <td className="p-1"><Input className="h-8 text-[11px] px-2" value={row.profit} onChange={(e) => { const n = [...financialRows]; n[idx].profit = e.target.value; setFinancialRows(n); }} onBlur={(e) => { const n = [...financialRows]; n[idx].profit = formatIndianNumber(e.target.value); setFinancialRows(n); }} placeholder="4.11" /></td>
                                <td className="p-1"><Input className="h-8 text-[11px] px-2" value={row.networth} onChange={(e) => { const n = [...financialRows]; n[idx].networth = e.target.value; setFinancialRows(n); }} onBlur={(e) => { const n = [...financialRows]; n[idx].networth = formatIndianNumber(e.target.value); setFinancialRows(n); }} placeholder="22.01" /></td>
                                <td className="p-1"><Input className="h-8 text-[11px] px-2" value={row.reserves} onChange={(e) => { const n = [...financialRows]; n[idx].reserves = e.target.value; setFinancialRows(n); }} onBlur={(e) => { const n = [...financialRows]; n[idx].reserves = formatIndianNumber(e.target.value); setFinancialRows(n); }} placeholder="10.50" /></td>
                                <td className="p-1"><Input className="h-8 text-[11px] px-2" value={row.borrowing} onChange={(e) => { const n = [...financialRows]; n[idx].borrowing = e.target.value; setFinancialRows(n); }} onBlur={(e) => { const n = [...financialRows]; n[idx].borrowing = formatIndianNumber(e.target.value); setFinancialRows(n); }} placeholder="17.17" /></td>
                                <td className="p-1 text-center">
                                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => setFinancialRows(financialRows.filter((_, i) => i !== idx))}>
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                            {financialRows.length === 0 && (
                              <tr><td colSpan={8} className="p-4 text-center text-muted-foreground italic">No financial data added.</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Promoter Holding</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium mb-1 block">Pre-Issue %</label>
                            <Input
                              value={form.promotor_hold_pre_issue || ''}
                              onChange={(e) => setForm({ ...form, promotor_hold_pre_issue: e.target.value })}
                              onBlur={(e) => setForm({ ...form, promotor_hold_pre_issue: formatIndianNumber(e.target.value) })}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium mb-1 block">Post-Issue %</label>
                            <Input
                              value={form.promotor_hold_post_issue || ''}
                              onChange={(e) => setForm({ ...form, promotor_hold_post_issue: e.target.value })}
                              onBlur={(e) => setForm({ ...form, promotor_hold_post_issue: formatIndianNumber(e.target.value) })}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold">Key KPIs</h4>
                          <Button type="button" variant="outline" size="sm" onClick={() => setKpiRows([...kpiRows, { name: '', value: '' }])}>
                            <Plus className="w-3 h-3 mr-1" /> Add Row
                          </Button>
                        </div>
                        <div className="overflow-x-auto border rounded-lg">
                          <table className="w-full text-xs">
                            <thead className="bg-muted/50 border-b">
                              <tr>
                                <th className="p-2 text-left font-semibold">KPI Name</th>
                                <th className="p-2 text-left font-semibold">Value</th>
                                <th className="p-2 text-center font-semibold w-10"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {kpiRows.map((row, idx) => (
                                <tr key={idx} className="border-b last:border-0 hover:bg-muted/30">
                                  <td className="p-2"><Input className="h-8 text-xs" value={row.name} onChange={(e) => { const newRows = [...kpiRows]; newRows[idx].name = e.target.value; setKpiRows(newRows); }} placeholder="ROE" /></td>
                                  <td className="p-2"><Input className="h-8 text-xs" value={row.value} onChange={(e) => { const newRows = [...kpiRows]; newRows[idx].value = e.target.value; setKpiRows(newRows); }} onBlur={(e) => { const newRows = [...kpiRows]; newRows[idx].value = formatIndianNumber(e.target.value); setKpiRows(newRows); }} placeholder="15%" /></td>
                                  <td className="p-2 text-center">
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => setKpiRows(kpiRows.filter((_, i) => i !== idx))}>
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                              {kpiRows.length === 0 && (
                                <tr><td colSpan={3} className="p-4 text-center text-muted-foreground italic">No KPIs added.</td></tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-semibold mb-3">Valuation Metrics Table</h4>
                      <div className="overflow-hidden border rounded-lg max-w-2xl">
                        <table className="w-full text-xs">
                          <thead className="bg-muted/50 border-b">
                            <tr>
                              <th className="p-2 text-left font-bold w-32 border-r">KPI Metric</th>
                              <th className="p-2 text-left font-bold">Pre-IPO</th>
                              <th className="p-2 text-left font-bold border-l">Post-IPO</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b hover:bg-muted/30">
                              <td className="p-2 font-bold border-r bg-muted/20">EPS</td>
                              <td className="p-1 px-2"><Input className="h-8 text-xs border-0 shadow-none focus-visible:ring-0" value={form.key_pri_ipo_eps || ''} onChange={(e) => setForm({ ...form, key_pri_ipo_eps: e.target.value })} onBlur={(e) => setForm({ ...form, key_pri_ipo_eps: formatIndianNumber(e.target.value) })} placeholder="Pre EPS" /></td>
                              <td className="p-1 px-2 border-l"><Input className="h-8 text-xs border-0 shadow-none focus-visible:ring-0" value={form.key_pos_ipo_eps || ''} onChange={(e) => setForm({ ...form, key_pos_ipo_eps: e.target.value })} onBlur={(e) => setForm({ ...form, key_pos_ipo_eps: formatIndianNumber(e.target.value) })} placeholder="Post EPS" /></td>
                            </tr>
                            <tr className="hover:bg-muted/30">
                              <td className="p-2 font-bold border-r bg-muted/20">P/E Ratio</td>
                              <td className="p-1 px-2"><Input className="h-8 text-xs border-0 shadow-none focus-visible:ring-0" value={form.key_pre_ipo_pe || ''} onChange={(e) => setForm({ ...form, key_pre_ipo_pe: e.target.value })} onBlur={(e) => setForm({ ...form, key_pre_ipo_pe: formatIndianNumber(e.target.value) })} placeholder="Pre P/E" /></td>
                              <td className="p-1 px-2 border-l"><Input className="h-8 text-xs border-0 shadow-none focus-visible:ring-0" value={form.key_post_ipo_pe || ''} onChange={(e) => setForm({ ...form, key_post_ipo_pe: e.target.value })} onBlur={(e) => setForm({ ...form, key_post_ipo_pe: formatIndianNumber(e.target.value) })} placeholder="Post P/E" /></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="content" className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Main Long Content (Rich Text)</label>
                      <RichEditor
                        value={form.content || ''}
                        onChange={(val) => setForm({ ...form, content: val })}
                        placeholder="Write your beautiful blog post here..."
                        className="bg-card shadow-sm"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Competitive Strengths</label>
                        <Button type="button" variant="outline" size="sm" onClick={() => setStrengthRows([...strengthRows, ''])}>
                          <Plus className="w-3 h-3 mr-1" /> Add Strength
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {strengthRows.map((s, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input className="h-9 text-sm" value={s} onChange={(e) => { const n = [...strengthRows]; n[idx] = e.target.value; setStrengthRows(n); }} placeholder="e.g. Established leader presence" />
                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-destructive" onClick={() => setStrengthRows(strengthRows.filter((_, i) => i !== idx))}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-medium">Frequently Asked Questions (FAQs)</label>
                        <Button type="button" variant="outline" size="sm" onClick={() => setFaqRows([...faqRows, { question: '', answer: '' }])}>
                          <Plus className="w-3 h-3 mr-1" /> Add FAQ
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {faqRows.map((f, idx) => (
                          <div key={idx} className="p-4 border rounded-xl bg-card/50 space-y-3 relative group shadow-sm transition-all hover:shadow-md">
                            <Button variant="ghost" size="sm" className="absolute top-2 right-2 h-7 w-7 p-0 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setFaqRows(faqRows.filter((_, i) => i !== idx))}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">Question {idx + 1}</label>
                              <Input className="h-8 text-xs font-semibold" value={f.question} onChange={(e) => { const n = [...faqRows]; n[idx].question = e.target.value; setFaqRows(n); }} placeholder="e.g. What is the business model?" />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">Answer</label>
                              <Textarea className="text-xs min-h-[60px]" value={f.answer} onChange={(e) => { const n = [...faqRows]; n[idx].answer = e.target.value; setFaqRows(n); }} placeholder="Provide a helpful answer here..." />
                            </div>
                          </div>
                        ))}
                        {faqRows.length === 0 && (
                          <div className="text-center p-8 border border-dashed rounded-xl text-muted-foreground text-sm italic">
                            No FAQs added yet. Click "Add FAQ" to start.
                          </div>
                        )}
                      </div>
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
                          <div className="flex gap-1">
                            <Input className="h-9 text-xs" value={form.rhp || ''} onChange={(e) => setForm({ ...form, rhp: e.target.value })} placeholder="Path to RHP (PDF preferred)" />
                            <div className="relative">
                              <input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e, 'rhp', 'companyblog/rhp', true)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                              <Button type="button" variant="outline" className="h-9 w-9 p-0 flex items-center justify-center pointer-events-none">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block">DRHP Link/Path</label>
                          <div className="flex gap-1">
                            <Input className="h-9 text-xs" value={form.drhp || ''} onChange={(e) => setForm({ ...form, drhp: e.target.value })} placeholder="Path to DRHP (PDF preferred)" />
                            <div className="relative">
                              <input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e, 'drhp', 'companyblog/drhp', true)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                              <Button type="button" variant="outline" className="h-9 w-9 p-0 flex items-center justify-center pointer-events-none">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block">Confidential DRHP</label>
                          <div className="flex gap-1">
                            <Input className="h-9 text-xs" value={form.confidential_drhp || ''} onChange={(e) => setForm({ ...form, confidential_drhp: e.target.value })} placeholder="Path to Confidential DRHP (PDF preferred)" />
                            <div className="relative">
                              <input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e, 'confidential_drhp', 'companyblog/confidential', true)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                              <Button type="button" variant="outline" className="h-9 w-9 p-0 flex items-center justify-center pointer-events-none">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
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

        <div className="bg-card border border-border rounded-xl shadow-sm mb-6">
          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); fetchBlogs(1, v); }} className="w-full">
            <div className="px-4 py-2 border-b">
              <TabsList className="bg-muted/50 p-1">
                <TabsTrigger value="0" className="px-8 font-semibold data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all">
                  Current IPOs
                </TabsTrigger>
                <TabsTrigger value="1" className="px-8 font-semibold data-[state=active]:bg-amber-500 data-[state=active]:text-white transition-all">
                  Upcoming IPOs
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
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
