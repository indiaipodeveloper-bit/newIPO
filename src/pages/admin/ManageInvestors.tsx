import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Eye, Copy, Mail, Phone, Trash2, Loader2, Search, Download, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface InvestorEnquiry {
  id: number;
  name: string;
  mobile: string;
  email: string;
  ticket_size: string;
  industry: string;
  roi: string;
  tenure: string;
  inv_type: string;
  buss_type: string;
  vintage: string;
  query: string;
  created_at: string;
}

const ManageInvestors = () => {
  const [enquiries, setEnquiries] = useState<InvestorEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [selectedEnquiry, setSelectedEnquiry] = useState<InvestorEnquiry | null>(null);

  const fetchEnquiries = async (p = page, s = search) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/investor?page=${p}&limit=10&search=${s}`);
      if (res.ok) {
        const result = await res.json();
        setEnquiries(result.data || []);
        setTotalPages(result.totalPages || 1);
        setTotalCount(result.total || 0);
        setPage(result.page || 1);
      } else {
        throw new Error("Failed to load enquiries");
      }
    } catch (err) {
      toast.error("Failed to load investor enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEnquiries(1, search);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const res = await fetch(`/api/investor/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Enquiry deleted successfully");
      fetchEnquiries(page, search);
    } catch (err) {
      toast.error("Failed to delete enquiry");
    }
  };

  const copyToClipboard = (enquiry: InvestorEnquiry) => {
    const text = `Name: ${enquiry.name}\nEmail: ${enquiry.email}\nMobile: ${enquiry.mobile}\nTicket Size: ${enquiry.ticket_size || 'N/A'}\nIndustry: ${enquiry.industry || 'N/A'}\nInvestment Type: ${enquiry.inv_type || 'N/A'}\nROI: ${enquiry.roi || 'N/A'}\nTenure: ${enquiry.tenure || 'N/A'}\nVintage: ${enquiry.vintage || 'N/A'}\nMessage: ${enquiry.query || 'No query provided.'}\nDate: ${new Date(enquiry.created_at).toLocaleString()}`;
    navigator.clipboard.writeText(text);
    toast.success("Investor details copied");
  };

  const handleExport = async () => {
    try {
      const res = await fetch(`/api/investor?limit=1000&search=${search}`);
      const result = await res.json();
      const allData = result.data || [];
      const headers = "ID,Name,Email,Mobile,Ticket Size,Industry,ROI,Tenure,Inv Type,Biz Type,Vintage,Query,Date\\n";
      const csvContent = allData.map((e: any) => 
        `"${e.id}","${e.name}","${e.email}","${e.mobile}","${e.ticket_size || ""}","${e.industry || ""}","${e.roi || ""}","${e.tenure || ""}","${e.inv_type || ""}","${e.buss_type || ""}","${e.vintage || ""}","${(e.query || "").replace(/"/g, '""')}","${new Date(e.created_at).toLocaleString()}"`
      ).join("\\n");
      const blob = new Blob([headers + csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `investor-enquiries-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Enquiries exported!");
    } catch (err) {
      toast.error("Export failed");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-heading">Investor Enquiries</h1>
            <p className="text-sm text-muted-foreground">{totalCount} total submissions found</p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" size="sm" onClick={() => fetchEnquiries(1, search)} disabled={loading} className="rounded-xl h-10">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
             </Button>
             <Button size="sm" onClick={handleExport} className="rounded-xl h-10 bg-primary text-white hover:bg-primary/90">
                <Download className="w-4 h-4 mr-2" /> Export CSV
             </Button>
          </div>
        </div>

        <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or mobile..." 
              className="pl-10 h-11 rounded-xl bg-card border-border shadow-sm focus-visible:ring-primary"
            />
        </div>

        {loading ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
            <p className="text-muted-foreground font-medium">Loading enquiries...</p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-card border-border shadow-sm">
            <Search className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p className="text-muted-foreground">No enquiries match your search.</p>
          </div>
        ) : (
          <>
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left font-bold py-4 px-4 text-muted-foreground uppercase tracking-wider text-[9px]">Submission</th>
                    <th className="text-left font-bold py-4 px-4 text-muted-foreground uppercase tracking-wider text-[9px]">Name & Contact</th>
                    <th className="text-left font-bold py-4 px-4 text-muted-foreground uppercase tracking-wider text-[9px]">Ticket Size</th>
                    <th className="text-left font-bold py-4 px-4 text-muted-foreground uppercase tracking-wider text-[9px]">ROI & Tenure</th>
                    <th className="text-left font-bold py-4 px-4 text-muted-foreground uppercase tracking-wider text-[9px]">Industry</th>
                    <th className="text-left font-bold py-4 px-4 text-muted-foreground uppercase tracking-wider text-[9px]">Type</th>
                    <th className="text-left font-bold py-4 px-4 text-muted-foreground uppercase tracking-wider text-[9px]">Query</th>
                    <th className="text-right py-4 px-4 font-bold text-muted-foreground uppercase tracking-wider text-[9px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {enquiries.map((e) => (
                    <tr key={e.id} className="hover:bg-muted/10 transition-all">
                      <td className="py-4 px-4 text-[10px] whitespace-nowrap align-middle">
                        <div className="font-bold text-foreground">{new Date(e.created_at).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        <div className="opacity-60">{new Date(e.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      </td>
                      <td className="py-4 px-4 align-middle">
                        <div className="font-bold text-foreground text-xs">{e.name}</div>
                        <div className="text-[10px] flex flex-col mt-0.5 opacity-80">
                          <span className="flex items-center gap-1 leading-none"><Mail className="w-2.5 h-2.5" /> {e.email}</span>
                          <span className="flex items-center gap-1 font-bold leading-none mt-1"><Phone className="w-2.5 h-2.5" /> {e.mobile}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-middle">
                        {e.ticket_size && (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px] px-1.5 py-0">
                            {e.ticket_size}
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 px-4 align-middle">
                        <div className="text-[10px] space-y-0.5">
                           <div><span className="opacity-60 uppercase font-bold text-[8px]">ROI:</span> {e.roi || 'N/A'}</div>
                           <div><span className="opacity-60 uppercase font-bold text-[8px]">TEN:</span> {e.tenure || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-middle">
                         <div className="text-[10px] max-w-[100px] truncate font-medium" title={e.industry}>{e.industry || 'N/A'}</div>
                      </td>
                      <td className="py-4 px-4 align-middle">
                         <div className="text-[9px] font-bold text-primary uppercase whitespace-nowrap">{e.inv_type || 'N/A'}</div>
                         {e.vintage && <div className="text-[8px] opacity-60">V: {e.vintage}</div>}
                      </td>
                      <td className="py-4 px-4 max-w-[150px] align-middle">
                        <p className="text-[11px] truncate text-muted-foreground" title={e.query}>{e.query || "No queries"}</p>
                      </td>
                      <td className="py-4 px-4 text-right align-middle">
                        <div className="flex justify-end gap-0.5">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-primary hover:bg-primary/10"
                            onClick={() => setSelectedEnquiry(e)}
                            title="View Details"
                          >
                             <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                            onClick={() => copyToClipboard(e)}
                            title="Copy details"
                          >
                             <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:bg-destructive/10" 
                            onClick={() => handleDelete(e.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {enquiries.map((enquiry) => (
              <div key={enquiry.id} className="bg-card border rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start border-b pb-4 border-border">
                  <div>
                    <h4 className="font-bold text-lg leading-none mb-1.5">{enquiry.name}</h4>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">{new Date(enquiry.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-primary/10 text-primary" onClick={() => setSelectedEnquiry(enquiry)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-destructive/10 text-destructive" onClick={() => handleDelete(enquiry.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-3 bg-muted/30 p-2.5 rounded-xl text-xs"><Mail className="w-4 h-4 text-primary" /> {enquiry.email}</div>
                  <div className="flex items-center gap-3 bg-muted/30 p-2.5 rounded-xl text-xs font-bold"><Phone className="w-4 h-4 text-primary" /> {enquiry.mobile}</div>
                </div>

                <div className="bg-muted/10 p-4 rounded-2xl grid grid-cols-2 gap-3 text-xs">
                  <div className="col-span-2">
                     <span className="text-muted-foreground text-[9px] uppercase font-bold">Ticket:</span>
                     <Badge className="ml-2 bg-emerald-50 text-emerald-700">{enquiry.ticket_size}</Badge>
                  </div>
                  <div><span className="text-muted-foreground text-[9px] uppercase font-bold block">Industry</span><span className="font-bold">{enquiry.industry}</span></div>
                  <div><span className="text-muted-foreground text-[9px] uppercase font-bold block">ROI</span><span className="font-bold">{enquiry.roi}</span></div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 bg-card p-4 rounded-xl border border-border">
              <div className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
                Page <span className="text-primary">{page}</span> of {totalPages}
              </div>
              <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 rounded-xl text-xs font-bold"
                    disabled={page <= 1}
                    onClick={() => {
                        window.scrollTo(0,0);
                        fetchEnquiries(page - 1);
                    }}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                        let pageNum = i + 1;
                        if (totalPages > 5 && page > 3) {
                            pageNum = page - 3 + i;
                            if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? "default" : "ghost"}
                            className="h-9 w-9 p-0 text-xs font-bold rounded-xl"
                            onClick={() => {
                                window.scrollTo(0,0);
                                fetchEnquiries(pageNum);
                            }}
                          >
                            {pageNum}
                          </Button>
                        );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 rounded-xl text-xs font-bold"
                    disabled={page >= totalPages}
                    onClick={() => {
                        window.scrollTo(0,0);
                        fetchEnquiries(page + 1);
                    }}
                  >
                    Next
                  </Button>
                </div>
            </div>
          )}
          </>
        )}

        <Dialog open={!!selectedEnquiry} onOpenChange={(open) => !open && setSelectedEnquiry(null)}>
           <DialogContent className="max-w-2xl bg-white border-primary/20">
              <DialogHeader>
                 <div className="flex items-center gap-3 mb-2">
                    <DialogTitle className="text-xl font-bold text-foreground">Investor Details</DialogTitle>
                    {selectedEnquiry?.ticket_size && (
                       <Badge className="bg-emerald-50 text-emerald-700 border-none px-3 font-bold uppercase text-[11px]">
                          {selectedEnquiry.ticket_size}
                       </Badge>
                    )}
                 </div>
                 <DialogDescription className="text-muted-foreground font-medium">
                    Submission Date: {selectedEnquiry && new Date(selectedEnquiry.created_at).toLocaleString("en-IN", { 
                      day: "numeric", month: "long", year: "numeric", hour: '2-digit', minute: '2-digit' 
                    })}
                 </DialogDescription>
              </DialogHeader>

              {selectedEnquiry && (
                <div className="space-y-6 pt-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4 border-y border-border/50">
                      <div className="space-y-1">
                         <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">Client Name</p>
                         <p className="text-sm font-bold text-foreground">{selectedEnquiry.name}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">Industry Focus</p>
                         <p className="text-sm font-semibold">{selectedEnquiry.industry || "General"}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">Investment Type</p>
                         <p className="text-sm font-semibold">{selectedEnquiry.inv_type || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">Business Type</p>
                         <p className="text-sm font-semibold">{selectedEnquiry.buss_type || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">ROI Expectation</p>
                         <p className="text-sm font-semibold text-emerald-600 font-bold">{selectedEnquiry.roi || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">Tenure & Vintage</p>
                         <p className="text-sm font-semibold">T: {selectedEnquiry.tenure || 'N/A'} · V: {selectedEnquiry.vintage || 'N/A'}</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                         <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">Email Address</p>
                         <a href={`mailto:${selectedEnquiry.email}`} className="text-sm font-bold text-primary hover:underline flex items-center gap-2">
                           <Mail className="w-3.5 h-3.5" /> {selectedEnquiry.email}
                         </a>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">Contact Phone</p>
                         <a href={`tel:${selectedEnquiry.mobile}`} className="text-sm font-bold text-foreground flex items-center gap-2 underline underline-offset-4 decoration-primary/30">
                           <Phone className="w-3.5 h-3.5 text-primary" /> {selectedEnquiry.mobile}
                         </a>
                      </div>
                   </div>

                   <div className="space-y-2 pt-4 border-t border-dashed border-border/60">
                      <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Message Content / Query</p>
                      <div className="bg-slate-50 p-5 rounded-2xl border border-border/40 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap shadow-inner min-h-[100px]">
                        "{selectedEnquiry.query || "No specific query provided."}"
                      </div>
                   </div>

                   <div className="flex justify-end gap-3 pt-6 border-t border-border">
                      <Button variant="ghost" className="font-bold text-xs" onClick={() => copyToClipboard(selectedEnquiry)}>
                         <Copy className="h-3.5 w-3.5 mr-2" /> Copy All
                      </Button>
                      <Button className="bg-primary hover:bg-primary/90 text-white font-bold px-8 rounded-xl" onClick={() => setSelectedEnquiry(null)}>
                         Dismiss
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

export default ManageInvestors;
