import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Download, Mail, Phone, Trash2, Eye, EyeOff, Loader2, Building2, Copy, Check, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface MerchantEnquiry {
  id: string;
  ipo_type: string;
  name: string;
  email: string;
  mobile: string | null;
  company: string | null;
  message: string;
  is_read: boolean | number;
  created_at: string;
}

const ManageMerchantEnquiries = () => {
  const [enquiries, setEnquiries] = useState<MerchantEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<MerchantEnquiry | null>(null);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch("/api/merchant-contact-enquiries");
      if (res.ok) {
        setEnquiries(await res.json());
      } else {
        toast.error("Failed to load enquiries");
      }
    } catch (err: any) {
      toast.error("Failed to load enquiries");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
    const interval = setInterval(fetchEnquiries, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const toggleRead = async (enquiry: MerchantEnquiry) => {
    try {
      const res = await fetch(`/api/merchant-contact-enquiries/${enquiry.id}/read`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Failed to update");
      setEnquiries((prev) => prev.map((e) => e.id === enquiry.id ? { ...e, is_read: 1 } : e));
      toast.success("Marked as read");
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const res = await fetch(`/api/merchant-contact-enquiries/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      toast.success("Enquiry deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleExport = () => {
    if (enquiries.length === 0) return toast.error("No enquiries to export");
    const csv = "IPO Type,Name,Email,Mobile,Company,Message,Date,Read\n" +
      enquiries.map((e) => `"${e.ipo_type}","${e.name}","${e.email}","${e.mobile || ""}","${e.company || ""}","${e.message.replace(/"/g, '""')}","${new Date(e.created_at).toLocaleString()}","${e.is_read}"`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "merchant-enquiries-export.csv";
    a.click();
    toast.success("Enquiries exported!");
  };

  const copyToClipboard = (enquiry: MerchantEnquiry) => {
    const text = `Name: ${enquiry.name}\nCompany: ${enquiry.company || 'N/A'}\nIPO Type: ${enquiry.ipo_type}\nEmail: ${enquiry.email}\nMobile: ${enquiry.mobile || 'N/A'}\nMessage: ${enquiry.message}\nDate: ${new Date(enquiry.created_at).toLocaleString()}`;
    navigator.clipboard.writeText(text);
    toast.success("Details copied to clipboard");
  };

  const unreadCount = enquiries.filter((e) => !e.is_read).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Merchant Banker Enquiries</h1>
            <p className="text-sm text-muted-foreground">
              {enquiries.length} total submissions · {unreadCount} unread
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
        ) : enquiries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-card border border-dashed rounded-xl">No enquiries received yet. Submissions from the merchant contact form will appear here.</div>
        ) : (
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead className="font-bold text-foreground">Date</TableHead>
                  <TableHead className="font-bold text-foreground">Name & Company</TableHead>
                  <TableHead className="font-bold text-foreground">Contact Details</TableHead>
                  <TableHead className="font-bold text-foreground">IPO Type</TableHead>
                  <TableHead className="font-bold text-foreground">Message</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enquiries.map((enquiry) => (
                  <TableRow key={enquiry.id} className={`${!enquiry.is_read ? "bg-accent/5 font-medium" : "text-muted-foreground"}`}>
                    <TableCell>
                      {!enquiry.is_read && <div className="w-2 h-2 rounded-full bg-accent animate-pulse mx-auto" />}
                    </TableCell>
                    <TableCell className="text-xs whitespace-nowrap">
                      {new Date(enquiry.created_at).toLocaleDateString("en-IN", { 
                        day: "numeric", 
                        month: "short",
                        year: "numeric"
                      })}
                      <div className="text-[10px] opacity-60">
                        {new Date(enquiry.created_at).toLocaleTimeString("en-IN", { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-bold text-foreground">{enquiry.name}</div>
                      {enquiry.company && (
                        <div className="text-[11px] flex items-center gap-1 opacity-70">
                          <Building2 className="h-3 w-3" /> {enquiry.company}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <a href={`mailto:${enquiry.email}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {enquiry.email}
                        </a>
                        {enquiry.mobile && (
                          <a href={`tel:${enquiry.mobile}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {enquiry.mobile}
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase font-bold">
                        {enquiry.ipo_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <p className="text-xs truncate" title={enquiry.message}>
                        {enquiry.message}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          onClick={() => setSelectedEnquiry(enquiry)}
                          title="View full details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          onClick={() => copyToClipboard(enquiry)}
                          title="Copy details"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        {!enquiry.is_read ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-accent hover:bg-accent/10"
                            onClick={() => toggleRead(enquiry)}
                            title="Mark as read"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                        ) : (
                          <div className="h-8 w-8 flex items-center justify-center opacity-30 text-muted-foreground">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => deleteEnquiry(enquiry.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={!!selectedEnquiry} onOpenChange={(open) => !open && setSelectedEnquiry(null)}>
          <DialogContent className="max-w-2xl bg-white border-primary/20">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <DialogTitle className="text-xl font-bold text-foreground">Enquiry Details</DialogTitle>
                {selectedEnquiry && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[11px] uppercase font-bold">
                    {selectedEnquiry.ipo_type}
                  </Badge>
                )}
              </div>
              <DialogDescription className="text-muted-foreground font-medium">
                Submitted on {selectedEnquiry && new Date(selectedEnquiry.created_at).toLocaleString("en-IN", { 
                  day: "numeric", month: "long", year: "numeric", hour: '2-digit', minute: '2-digit' 
                })}
              </DialogDescription>
            </DialogHeader>

            {selectedEnquiry && (
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Client Name</p>
                    <p className="text-sm font-semibold text-foreground">{selectedEnquiry.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Company / Entity</p>
                    <p className="text-sm font-semibold text-foreground">{selectedEnquiry.company || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Email Address</p>
                    <a href={`mailto:${selectedEnquiry.email}`} className="text-sm font-semibold text-primary hover:underline flex items-center gap-2">
                       <Mail className="h-3.5 w-3.5" /> {selectedEnquiry.email}
                    </a>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Contact Number</p>
                    <a href={`tel:${selectedEnquiry.mobile}`} className="text-sm font-semibold text-primary hover:underline flex items-center gap-2">
                       <Phone className="h-3.5 w-3.5" /> {selectedEnquiry.mobile || "N/A"}
                    </a>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-dashed border-border">
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                     Message Content / Requirements
                  </p>
                  <div className="bg-muted/30 p-5 rounded-xl border border-border/50 text-sm leading-relaxed text-foreground whitespace-pre-wrap shadow-inner">
                    {selectedEnquiry.message}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                   <Button variant="outline" className="border-border hover:bg-muted font-semibold" onClick={() => copyToClipboard(selectedEnquiry)}>
                      <Copy className="h-4 w-4 mr-2" /> Copy All Details
                   </Button>
                   <Button className="bg-primary text-white hover:bg-primary/90 px-8 font-semibold" onClick={() => setSelectedEnquiry(null)}>
                      Close
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

export default ManageMerchantEnquiries;
