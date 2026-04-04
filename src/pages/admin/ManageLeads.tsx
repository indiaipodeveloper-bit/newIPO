import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Download, Mail, Phone, Trash2, Eye, EyeOff, Loader2, Building2, Calendar, MessageSquare, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

const ManageLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  const fetchLeads = async (p = page) => {
    try {
      const res = await fetch(`/api/leads?page=${p}&limit=10`);
      if (res.ok) {
        const result = await res.json();
        setLeads(result.data || []);
        setTotalPages(result.totalPages || 1);
        setTotalLeads(result.total || 0);
        setPage(result.page || 1);
      } else {
        toast.error("Failed to load leads");
      }
    } catch (err: any) {
      toast.error("Failed to load leads");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(1);
    const interval = setInterval(() => fetchLeads(page), 30000); // Poll less frequently for pagination
    return () => clearInterval(interval);
  }, []);

  const toggleRead = async (lead: Lead) => {
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: !lead.is_read })
      });
      if (!res.ok) throw new Error("Failed to update");
      setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, is_read: !l.is_read } : l));
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setDetailsOpen(true);
    if (!lead.is_read) {
      toggleRead(lead);
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setLeads((prev) => prev.filter((l) => l.id !== id));
      toast.success("Lead deleted");
      if (selectedLead?.id === id) setDetailsOpen(false);
      fetchLeads(page); // Refresh current page
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch("/api/leads?limit=1000"); // Get all for export
      if (!res.ok) throw new Error("Export failed");
      const result = await res.json();
      const allLeads = result.data || [];
      
      const csv = "Name,Email,Phone,Company,Message,Date,Read\n" +
      allLeads.map((l: any) => `"${l.name}","${l.email}","${l.phone || ""}","${l.company || ""}","${l.message.replace(/"/g, '""')}","${new Date(l.created_at).toLocaleDateString()}","${l.is_read}"`).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      toast.success("Leads exported successfully");
    } catch (err) {
      toast.error("No leads to export");
    }
  };

  const unreadCount = leads.filter((l) => !l.is_read).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Leads Management</h1>
            <p className="text-sm text-muted-foreground">
              {totalLeads} total submissions · <span className="text-accent font-semibold">{unreadCount} unread</span>
            </p>
          </div>
          <Button variant="outline" className="border-accent/30 text-accent hover:bg-accent/5 font-semibold" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p>No leads found. Contact form submissions will appear here.</p>
            </div>
          ) : (
            <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold text-muted-foreground w-10 text-center">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-muted-foreground">Sender</th>
                    <th className="py-3.5 px-4 font-semibold text-muted-foreground">Company</th>
                    <th className="py-3.5 px-4 font-semibold text-muted-foreground">Contact</th>
                    <th className="py-3.5 px-4 font-semibold text-muted-foreground">Date</th>
                    <th className="py-3.5 px-4 font-semibold text-muted-foreground text-right px-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {leads.map((lead) => (
                    <tr key={lead.id} className={`hover:bg-muted/30 transition-colors ${!lead.is_read ? "bg-accent/5" : ""}`}>
                      <td className="py-4 px-4 text-center">
                        {!lead.is_read && <div className="w-2.5 h-2.5 rounded-full bg-accent mx-auto animate-pulse" title="Unread" />}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-foreground">{lead.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 max-w-[200px] truncate">
                           {lead.message.length > 40 ? lead.message.substring(0, 40) + "..." : lead.message}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {lead.company || "—"}
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-xs font-semibold text-foreground">{lead.email}</div>
                        <div className="text-[10px] text-muted-foreground">{lead.phone || "—"}</div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <Badge variant="outline" className="font-medium text-[10px]">
                          {new Date(lead.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-right px-6">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-accent hover:text-accent hover:bg-accent/10" 
                            onClick={() => handleViewDetails(lead)} 
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" 
                            onClick={() => deleteLead(lead.id)} 
                            title="Delete"
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

            {/* --- Pagination Controls --- */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
                <div className="text-xs text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{leads.length}</span> of <span className="font-semibold text-foreground">{totalLeads}</span> leads
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-semibold"
                    disabled={page <= 1}
                    onClick={() => {
                        window.scrollTo(0,0);
                        fetchLeads(page - 1);
                    }}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1 mx-1">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <Button
                        key={i + 1}
                        variant={page === i + 1 ? "secondary" : "ghost"}
                        className={`h-8 w-8 p-0 text-[10px] rounded-md transition-all ${page === i + 1 ? "bg-accent text-accent-foreground shadow-sm" : ""}`}
                        onClick={() => {
                            window.scrollTo(0,0);
                            fetchLeads(i + 1);
                        }}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-semibold"
                    disabled={page >= totalPages}
                    onClick={() => {
                        window.scrollTo(0,0);
                        fetchLeads(page + 1);
                    }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
            </>
          )}
        </div>

        {/* --- Lead Details Modal --- */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-xl p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="p-6 bg-gradient-to-br from-[#001529] to-[#003380] text-white">
              <DialogTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-white/10 rounded-lg">
                  <User className="h-5 w-5 text-accent" />
                </div>
                Enquiry Details
              </DialogTitle>
            </DialogHeader>
            
            {selectedLead && (
              <div className="p-6 space-y-6 bg-white">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Sender Name</p>
                    <p className="text-sm font-bold text-foreground">{selectedLead.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Organisation</p>
                    <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-accent" />
                      {selectedLead.company || "Not provided"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Email Address</p>
                    <p className="text-sm font-bold text-foreground flex items-center gap-1.5 underline decoration-accent/30 decoration-2">
                       <Mail className="h-3.5 w-3.5 text-accent" />
                       {selectedLead.email}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Phone Number</p>
                    <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                       <Phone className="h-3.5 w-3.5 text-accent" />
                       {selectedLead.phone || "Not provided"}
                    </p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Submission Date</p>
                    <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                       <Calendar className="h-3.5 w-3.5 text-accent" />
                       {new Date(selectedLead.created_at).toLocaleString("en-IN", { 
                         day: "numeric", month: "long", year: "numeric", 
                         hour: "2-digit", minute: "2-digit" 
                       })}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                   <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2">Message</p>
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap italic">
                      "{selectedLead.message}"
                   </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setDetailsOpen(false)} className="rounded-xl px-6">Close</Button>
                  <Button 
                    variant="ghost" 
                    className="text-destructive hover:bg-destructive/10 rounded-xl"
                    onClick={() => {
                       if(selectedLead) deleteLead(selectedLead.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Lead
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

export default ManageLeads;

