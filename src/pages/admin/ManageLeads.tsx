import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Download, Mail, Phone, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";

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

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        setLeads(await res.json());
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
    fetchLeads();
    // Simulate realtime with polling every 10s since MongoDB Change Streams require Replica Sets 
    const interval = setInterval(fetchLeads, 10000);
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
      toast.error("Failed to update");
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setLeads((prev) => prev.filter((l) => l.id !== id));
      toast.success("Lead deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleExport = () => {
    if (leads.length === 0) return toast.error("No leads to export");
    const csv = "Name,Email,Phone,Company,Message,Date,Read\n" +
      leads.map((l) => `"${l.name}","${l.email}","${l.phone || ""}","${l.company || ""}","${l.message}","${new Date(l.created_at).toLocaleDateString()}","${l.is_read}"`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads-export.csv";
    a.click();
    toast.success("Leads exported!");
  };

  const unreadCount = leads.filter((l) => !l.is_read).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Leads</h1>
            <p className="text-sm text-muted-foreground">
              {leads.length} total submissions · {unreadCount} unread
            </p>
          </div>
          <Button variant="outline" className="border-accent/30 text-accent hover:bg-accent/5" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No leads yet. Submissions from the Contact page will appear here.</div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className={`bg-card border rounded-xl p-5 transition-colors ${lead.is_read ? "border-border" : "border-accent/40 bg-accent/5"}`}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    {!lead.is_read && <span className="w-2.5 h-2.5 rounded-full bg-accent shrink-0" />}
                    <div>
                      <h3 className="font-semibold text-foreground">{lead.name}</h3>
                      {lead.company && <p className="text-sm text-muted-foreground">{lead.company}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs shrink-0">
                      {new Date(lead.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleRead(lead)} title={lead.is_read ? "Mark as unread" : "Mark as read"}>
                      {lead.is_read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteLead(lead.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{lead.message}</p>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email}</span>
                  {lead.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageLeads;
