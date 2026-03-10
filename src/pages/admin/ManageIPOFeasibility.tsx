import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Building, Eye } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FeasibilityEnquiry {
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
  const [enquiries, setEnquiries] = useState<FeasibilityEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<FeasibilityEnquiry | null>(null);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ipo_feasibility");
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data);
      } else {
        throw new Error("Failed to load enquiries");
      }
    } catch (err) {
      toast.error("Failed to load IPO Feasibility enquiries");
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
      const res = await fetch(`/api/ipo_feasibility/${id}`, { method: "DELETE" });
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-heading">IPO Feasibility Enquiries</h1>
            <p className="text-sm text-muted-foreground">Manage and review 'Check IPO Feasibility' submissions</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            Loading enquiries...
          </div>
        ) : enquiries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border rounded-xl bg-card shadow-sm flex flex-col items-center">
            <Building className="h-12 w-12 mb-4 opacity-20" />
            <p>No IPO feasibility enquiries found yet.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Contact Info</th>
                    <th className="px-6 py-4 font-semibold">Company Details</th>
                    <th className="px-6 py-4 font-semibold">Financials</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {enquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{enquiry.name}</div>
                        <div className="text-xs text-muted-foreground">{enquiry.email}</div>
                        <div className="text-xs text-muted-foreground">{enquiry.mobile}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{enquiry.company_name || 'N/A'}</div>
                        <div className="text-xs text-muted-foreground">{enquiry.industry || 'N/A'}</div>
                        <div className="text-xs text-muted-foreground min-w-[120px]">
                          <span className="inline-block px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 capitalize text-[10px] mt-1">
                            {enquiry.business_type || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs"><span className="text-muted-foreground">Turnover:</span> {enquiry.current_turn_over || 'N/A'}</div>
                        <div className="text-xs"><span className="text-muted-foreground">PAT:</span> {enquiry.current_pat || 'N/A'}</div>
                        <div className="text-xs"><span className="text-muted-foreground">Networth:</span> {enquiry.networth || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs whitespace-nowrap">
                        {format(new Date(enquiry.created_at), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                           <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 text-primary"
                            onClick={() => setSelectedEnquiry(enquiry)}
                            title="View Full Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDelete(enquiry.id)}
                            title="Delete Enquiry"
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
        )}

        {/* View Details Dialog */}
        <Dialog open={!!selectedEnquiry} onOpenChange={(open) => !open && setSelectedEnquiry(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-heading flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                IPO Feasibility Details
              </DialogTitle>
            </DialogHeader>
            {selectedEnquiry && (
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border border-border">
                   <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Applicant Name</p>
                      <p className="text-sm font-medium">{selectedEnquiry.name}</p>
                   </div>
                   <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Company Name</p>
                      <p className="text-sm font-medium">{selectedEnquiry.company_name || 'N/A'}</p>
                   </div>
                   <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Email ID</p>
                      <p className="text-sm">{selectedEnquiry.email}</p>
                   </div>
                   <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Phone Number</p>
                      <p className="text-sm">{selectedEnquiry.mobile}</p>
                   </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold border-b pb-2 text-sm text-primary uppercase tracking-wider">Business Information</h4>
                  <div className="grid grid-cols-2 gap-y-3">
                    <div>
                        <p className="text-xs text-muted-foreground">Industry</p>
                        <p className="text-sm font-medium">{selectedEnquiry.industry || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Business Type</p>
                        <p className="text-sm font-medium capitalize">{selectedEnquiry.business_type || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Company Vintage</p>
                        <p className="text-sm font-medium">{selectedEnquiry.vintage || 'N/A'} Years</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Submission Date</p>
                        <p className="text-sm font-medium">{format(new Date(selectedEnquiry.created_at), "PPp")}</p>
                    </div>
                  </div>
                </div>

                 <div className="space-y-3">
                  <h4 className="font-semibold border-b pb-2 text-sm text-primary uppercase tracking-wider">Financial Highlights</h4>
                  <div className="grid grid-cols-2 gap-y-3">
                    <div>
                        <p className="text-xs text-muted-foreground">Current Turnover</p>
                        <p className="text-sm font-medium">₹ {selectedEnquiry.current_turn_over || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Current PAT</p>
                        <p className="text-sm font-medium">₹ {selectedEnquiry.current_pat || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Networth</p>
                        <p className="text-sm font-medium">₹ {selectedEnquiry.networth || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Profit</p>
                        <p className="text-sm font-medium">₹ {selectedEnquiry.profit || 'N/A'}</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedEnquiry(null)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ManageIPOFeasibility;
