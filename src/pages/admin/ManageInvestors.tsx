import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Mail, Phone, Building } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

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

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/investor");
      if (res.ok) {
        setEnquiries(await res.json());
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
    fetchEnquiries();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const res = await fetch(`/api/investor/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Enquiry deleted successfully");
      fetchEnquiries();
    } catch (err) {
      toast.error("Failed to delete enquiry");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-heading">Investor Enquiries</h1>
            <p className="text-sm text-muted-foreground">{enquiries.length} total enquiries</p>
          </div>
          <Button variant="outline" onClick={fetchEnquiries} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Refresh"}
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            Loading enquiries...
          </div>
        ) : enquiries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border rounded-xl bg-card shadow-sm">
            No investor enquiries found yet.
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left font-semibold py-3 px-4">Contact Detail</th>
                    <th className="text-left py-3 px-4 font-semibold">Investment Goal</th>
                    <th className="text-left py-3 px-4 font-semibold">Message</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4 align-top">
                        <div className="font-semibold text-foreground text-base mb-1">{enquiry.name}</div>
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {enquiry.email}</span>
                          <span className="flex items-center gap-1.5 text-foreground"><Phone className="w-3 h-3 text-muted-foreground" /> {enquiry.mobile}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="flex flex-col gap-1.5">
                          {enquiry.ticket_size && <Badge variant="secondary" className="bg-accent/10 w-fit text-accent font-semibold text-xs whitespace-nowrap">{enquiry.ticket_size}</Badge>}
                          {enquiry.industry && <span className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Industry:</span> {enquiry.industry}</span>}
                          {enquiry.inv_type && <span className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Type:</span> {enquiry.inv_type}</span>}
                          {enquiry.buss_type && <span className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Biz Type:</span> {enquiry.buss_type}</span>}
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top max-w-[300px]">
                        <div className="text-xs text-muted-foreground mb-2 flex flex-wrap gap-x-3 gap-y-1">
                          {enquiry.roi && <span><strong className="text-foreground">ROI:</strong> {enquiry.roi}</span>}
                          {enquiry.tenure && <span><strong className="text-foreground">Tenure:</strong> {enquiry.tenure}</span>}
                          {enquiry.vintage && <span><strong className="text-foreground">Vintage:</strong> {enquiry.vintage}</span>}
                        </div>
                        <p className="text-muted-foreground whitespace-pre-wrap break-words">{enquiry.query || "No query provided."}</p>
                      </td>
                      <td className="py-4 px-4 align-top whitespace-nowrap text-muted-foreground">
                        {new Date(enquiry.created_at).toLocaleDateString()}
                        <div className="text-xs">{new Date(enquiry.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      </td>
                      <td className="py-4 px-4 align-top text-right">
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(enquiry.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mobile View */}
        {!loading && (
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {enquiries.map((enquiry) => (
              <div key={enquiry.id} className="bg-card border rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg leading-none mb-1">{enquiry.name}</h4>
                    <p className="text-xs text-muted-foreground">{new Date(enquiry.created_at).toLocaleString()}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0" onClick={() => handleDelete(enquiry.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2 text-sm bg-muted/30 p-3 rounded-lg">
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" /> <a href={`mailto:${enquiry.email}`} className="text-primary">{enquiry.email}</a></div>
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /> <a href={`tel:${enquiry.mobile}`} className="font-medium text-foreground">{enquiry.mobile}</a></div>
                </div>

                <div className="bg-muted/10 border p-3 rounded-lg grid grid-cols-2 gap-2 text-xs">
                  {enquiry.ticket_size && <div><span className="text-muted-foreground block">Ticket Size</span><span className="font-medium">{enquiry.ticket_size}</span></div>}
                  {enquiry.industry && <div><span className="text-muted-foreground block">Industry</span><span className="font-medium">{enquiry.industry}</span></div>}
                  {enquiry.roi && <div><span className="text-muted-foreground block">ROI</span><span className="font-medium">{enquiry.roi}</span></div>}
                  {enquiry.tenure && <div><span className="text-muted-foreground block">Tenure</span><span className="font-medium">{enquiry.tenure}</span></div>}
                  {enquiry.inv_type && <div><span className="text-muted-foreground block">Inv. Type</span><span className="font-medium">{enquiry.inv_type}</span></div>}
                  {enquiry.buss_type && <div><span className="text-muted-foreground block">Biz. Type</span><span className="font-medium">{enquiry.buss_type}</span></div>}
                  {enquiry.vintage && <div><span className="text-muted-foreground block">Vintage</span><span className="font-medium">{enquiry.vintage}</span></div>}
                </div>
                
                {enquiry.query && (
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Query</span>
                    <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg">{enquiry.query}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageInvestors;
