import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Mail, Phone, Building, Search, Download, RefreshCw, Landmark, Eye } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FeasibilityEntry {
  id: number;
  name: string;
  mobile: string;
  email: string;
  company_name: string;
  current_turn_over: string;
  current_pat: string;
  industry: string;
  business_type: string;
  networth: string;
  profit: string;
  vintage: string;
  eligibility: string;
  created_at: string;
}

const ManageIPOFeasibility = () => {
  const [entries, setEntries] = useState<FeasibilityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState<FeasibilityEntry | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchEntries = async (p = page, s = search) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/ipo_feasibility?page=${p}&limit=10&search=${s}`);
      if (res.ok) {
        const result = await res.json();
        setEntries(result.data || []);
        setTotalPages(result.totalPages || 1);
        setTotalCount(result.total || 0);
        setPage(result.page || 1);
      }
    } catch (err) {
      toast.error("Failed to load entries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEntries(1, search);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      const res = await fetch(`/api/ipo_feasibility/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Entry deleted");
        fetchEntries(page, search);
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch(`/api/ipo_feasibility?limit=1000&search=${search}`);
      const result = await res.json();
      const allData = result.data || [];

      const headers = "ID,Name,Email,Mobile,Company,Turnover,PAT,Industry,Biz Type,Networth,Profit,Vintage,Date\n";
      const csv = allData.map((e: any) =>
        `"${e.id}","${e.name}","${e.email}","${e.mobile}","${e.company_name || ""}","${e.current_turn_over || ""}","${e.current_pat || ""}","${e.industry || ""}","${e.business_type || ""}","${e.networth || ""}","${e.profit || ""}","${e.vintage || ""}","${new Date(e.created_at).toLocaleString()}"`
      ).join("\n");

      const blob = new Blob([headers + csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ipo-feasibility-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      toast.success("Export successful!");
    } catch (err) {
      toast.error("Export failed");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-heading">IPO Feasibility Enquiries</h1>
            <p className="text-sm text-muted-foreground">{totalCount} submissions found · Review eligibility queries</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => fetchEntries(1, search)} disabled={loading} className="rounded-xl h-10">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
            <Button size="sm" onClick={handleExport} className="rounded-xl h-10 bg-accent text-accent-foreground hover:bg-accent/90">
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>
          </div>
        </div>

        {/* --- Toolbar --- */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, company..."
            className="pl-10 h-11 rounded-xl bg-card border-border shadow-sm"
          />
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground bg-card/30 rounded-2xl border border-dashed border-border">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-accent" />
            <p>Loading feasibility submissions...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-2xl bg-card">
            <Landmark className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p>No feasibility enquiries match your current search.</p>
          </div>
        ) : (
          <>
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left font-bold py-4 px-6 text-muted-foreground uppercase tracking-widest text-[9px]">Contact Info</th>
                      <th className="text-left py-4 px-6 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Company Details</th>
                      <th className="text-left py-4 px-6 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Financials</th>
                      <th className="text-left py-4 px-6 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Date</th>
                      <th className="text-left py-4 px-6 font-bold text-muted-foreground uppercase tracking-widest text-[9px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {entries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-muted/30 transition-all group">
                        <td className="py-5 px-6 align-top">
                          <div className="font-bold text-foreground mb-1">{entry.name}</div>
                          <div className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1.5 truncate"><Mail className="w-3 h-3" /> {entry.email}</span>
                            <span className="flex items-center gap-1.5 font-bold"><Phone className="w-3 h-3 text-accent" /> {entry.mobile}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6 align-top">
                          <div className="font-bold text-foreground mb-1">{entry.company_name}</div>
                          <div className="text-[11px] text-muted-foreground opacity-70 mb-2">{entry.industry || "N/A"}</div>
                          <Badge variant="secondary" className="bg-accent/10 text-accent border-none rounded-lg text-[9px] font-bold px-2 py-0.5 uppercase tracking-tighter">
                            {entry.business_type || "Private"}
                          </Badge>
                        </td>
                        <td className="py-5 px-6 align-top">
                          <div className="space-y-1.5">
                            <div className="text-[11px]"><span className="text-muted-foreground font-semibold uppercase text-[9px] mr-2">Turnover:</span> <span className="font-bold">{entry.current_turn_over}</span></div>
                            <div className="text-[11px]"><span className="text-muted-foreground font-semibold uppercase text-[9px] mr-2">PAT:</span> <span className="font-bold">{entry.current_pat}</span></div>
                            <div className="text-[11px]"><span className="text-muted-foreground font-semibold uppercase text-[9px] mr-2">Networth:</span> <span className="font-bold">{entry.networth}</span></div>
                          </div>
                        </td>
                        <td className="py-5 px-6 align-top whitespace-nowrap text-muted-foreground font-medium">
                          {new Date(entry.created_at).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-5 px-6 align-top text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 ">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-accent hover:bg-accent/10"
                              onClick={() => { setSelectedEntry(entry); setDetailsOpen(true); }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(entry.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {entries.map((entry) => (
                <div key={entry.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{entry.name}</h3>
                      <p className="text-[11px] text-muted-foreground font-medium">{new Date(entry.created_at).toLocaleString()}</p>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 border-none rounded-lg text-[9px] font-bold">FEASIBILITY</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs bg-muted/20 p-4 rounded-xl border">
                    <div>
                      <span className="block text-[9px] text-muted-foreground font-bold uppercase mb-0.5">Company</span>
                      <span className="font-bold block truncate">{entry.company_name}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-muted-foreground font-bold uppercase mb-0.5">Eligibility</span>
                      <span className="font-bold block text-accent uppercase">{entry.eligibility}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <Button variant="ghost" size="sm" className="text-accent underline font-bold px-0" onClick={() => { setSelectedEntry(entry); setDetailsOpen(true); }}>View Report</Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(entry.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>

            {/* --- Pagination --- */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 bg-card p-4 rounded-2xl border border-border shadow-sm">
                <div className="text-xs text-muted-foreground font-bold">
                  PAGE {page} OF {totalPages} <span className="mx-2 opacity-30">|</span> {totalCount} TOTAL
                </div>
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" size="sm" disabled={page === 1} className="rounded-xl h-9" onClick={() => { window.scrollTo(0, 0); fetchEntries(page - 1); }}>Previous</Button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
                      <Button
                        key={i + 1}
                        variant={page === i + 1 ? "secondary" : "ghost"}
                        className={`h-9 w-9 rounded-xl text-xs font-bold ${page === i + 1 ? 'bg-accent text-accent-foreground shadow-sm' : ''}`}
                        onClick={() => { window.scrollTo(0, 0); fetchEntries(i + 1); }}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" disabled={page === totalPages} className="rounded-xl h-9" onClick={() => { window.scrollTo(0, 0); fetchEntries(page + 1); }}>Next</Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* --- Details Dialog --- */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-[700px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
            {selectedEntry && (
              <div className="flex flex-col">
                <div className="bg-accent p-8 text-accent-foreground relative">
                  <Landmark className="absolute right-6 top-6 h-12 w-12 opacity-10" />
                  <div className="space-y-1">
                    <h2 className="text-3xl font-bold">{selectedEntry.company_name}</h2>
                    <p className="text-accent-foreground/80 font-medium">IPO Feasibility Assessment Details</p>
                  </div>
                </div>
                <div className="p-8 space-y-8 bg-card max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b pb-2">Contact Person</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-accent">{selectedEntry.name.charAt(0)}</div>
                          <div className="font-bold">{selectedEntry.name}</div>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground pl-1">
                          <Mail className="h-4 w-4" /> {selectedEntry.email}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground pl-1">
                          <Phone className="h-4 w-4 text-accent" /> {selectedEntry.mobile}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b pb-2">Company info</h4>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="text-sm"><span className="text-muted-foreground mr-2">Industry:</span> <span className="font-bold">{selectedEntry.industry || "Not Specified"}</span></div>
                        <div className="text-sm"><span className="text-muted-foreground mr-2">Structure:</span> <span className="font-bold uppercase text-[10px] bg-slate-100 px-2 py-0.5 rounded-md">{selectedEntry.business_type}</span></div>
                        <div className="text-sm"><span className="text-muted-foreground mr-2">Vintage:</span> <span className="font-bold">{selectedEntry.vintage} Years</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b pb-2">Financial Snapshot</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Turnover</span>
                        <span className="text-sm font-bold text-foreground">{selectedEntry.current_turn_over}</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">PAT (Profit)</span>
                        <span className="text-sm font-bold text-foreground">{selectedEntry.current_pat}</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Networth</span>
                        <span className="text-sm font-bold text-foreground">{selectedEntry.networth}</span>
                      </div>
                      <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                        <span className="text-[9px] font-bold text-emerald-600 uppercase block mb-1">Eligibility</span>
                        <span className="text-sm font-bold text-emerald-700 uppercase tracking-tight">{selectedEntry.eligibility}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-slate-50 border-t flex justify-end gap-3">
                  <Button variant="outline" className="rounded-xl font-bold" onClick={() => setDetailsOpen(false)}>Close Window</Button>
                  <Button
                    variant="destructive"
                    className="rounded-xl font-bold"
                    onClick={() => {
                      if (confirm("Are you sure?")) {
                        handleDelete(selectedEntry.id);
                        setDetailsOpen(false);
                      }
                    }}
                  >
                    Delete Record
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ManageIPOFeasibility;
