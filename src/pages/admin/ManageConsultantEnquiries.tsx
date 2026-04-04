import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash2, CheckCircle, Mail, Phone, Building2, User, Clock, MessageSquareText, Copy, EyeOff, Eye } from "lucide-react";
import { format } from "date-fns";
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

interface Enquiry {
  id: string;
  consultant_id: string;
  consultant_name: string;
  name: string;
  email: string;
  phone: string;
  organisation: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const ManageConsultantEnquiries = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/consultant-enquiries");
      if (res.ok) setEnquiries(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/consultant-enquiries/${id}/read`, { method: "PATCH" });
      if (res.ok) {
        toast.success("Marked as read");
        fetchData();
      }
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    try {
      const res = await fetch(`/api/consultant-enquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted!");
        fetchData();
      }
    } catch (err) {
      toast.error("Error deleting");
    }
  };

  const copyToClipboard = (enquiry: Enquiry) => {
    const text = `Name: ${enquiry.name}\nOrganisation: ${enquiry.organisation || 'N/A'}\nTarget Consultant: ${enquiry.consultant_name}\nEmail: ${enquiry.email}\nPhone: ${enquiry.phone || 'N/A'}\nMessage: ${enquiry.message}\nDate: ${format(new Date(enquiry.created_at), "PPP p")}`;
    navigator.clipboard.writeText(text);
    toast.success("Details copied to clipboard");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Consultant Enquiries</h1>
          <p className="text-sm text-muted-foreground">{enquiries.length} enquiries received from the Consultant pages</p>
        </div>

        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="font-bold text-foreground">Date</TableHead>
                <TableHead className="font-bold text-foreground">Name & Org</TableHead>
                <TableHead className="font-bold text-foreground">Contact</TableHead>
                <TableHead className="font-bold text-foreground">Target</TableHead>
                <TableHead className="font-bold text-foreground">Message</TableHead>
                <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enquiries.map((e) => (
                <TableRow key={e.id} className={`${!e.is_read ? "bg-primary/5 font-medium" : "text-muted-foreground"}`}>
                  <TableCell>
                    {!e.is_read && <div className="w-2 h-2 rounded-full bg-primary animate-pulse mx-auto" />}
                  </TableCell>
                  <TableCell className="text-xs whitespace-nowrap">
                    {format(new Date(e.created_at), "dd MMM yyyy")}
                    <div className="text-[10px] opacity-60">
                      {format(new Date(e.created_at), "p")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-bold text-foreground">{e.name}</div>
                    {e.organisation && (
                      <div className="text-[11px] flex items-center gap-1 opacity-70">
                        <Building2 className="h-3 w-3" /> {e.organisation}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <a href={`mailto:${e.email}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {e.email}
                      </a>
                      {e.phone && (
                        <a href={`tel:${e.phone}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {e.phone}
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-background/50 border-primary/20 text-primary text-[10px] whitespace-nowrap">
                      {e.consultant_name}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <p className="text-xs truncate" title={e.message}>
                      {e.message}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        onClick={() => setSelectedEnquiry(e)}
                        title="View full details"
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
                      {!e.is_read ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-primary hover:bg-primary/10"
                          onClick={() => markAsRead(e.id)}
                          title="Mark as read"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                        </Button>
                      ) : (
                        <div className="h-8 w-8 flex items-center justify-center opacity-30 text-muted-foreground">
                          <CheckCircle className="h-3.5 w-3.5" />
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => del(e.id)}
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

          {enquiries.length === 0 && !loading && (
            <div className="text-center py-20 bg-card border border-dashed rounded-xl">
              <Mail className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground">No Enquiries Yet</h3>
              <p className="text-sm text-muted-foreground">Wait for users to contact your consultants.</p>
            </div>
          )}
        </div>

        <Dialog open={!!selectedEnquiry} onOpenChange={(open) => !open && setSelectedEnquiry(null)}>
          <DialogContent className="max-w-2xl bg-white border-primary/20">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <DialogTitle className="text-xl font-bold text-foreground">Consultant Enquiry Details</DialogTitle>
                {selectedEnquiry && (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[11px] uppercase font-bold whitespace-nowrap">
                    Target: {selectedEnquiry.consultant_name}
                  </Badge>
                )}
              </div>
              <DialogDescription className="text-muted-foreground font-medium">
                Submitted on {selectedEnquiry && format(new Date(selectedEnquiry.created_at), "PPP p")}
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
                    <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Organisation</p>
                    <p className="text-sm font-semibold text-foreground">{selectedEnquiry.organisation || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Email Address</p>
                    <a href={`mailto:${selectedEnquiry.email}`} className="text-sm font-semibold text-primary hover:underline flex items-center gap-2">
                       <Mail className="h-3.5 w-3.5" /> {selectedEnquiry.email}
                    </a>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Phone Number</p>
                    <a href={`tel:${selectedEnquiry.phone}`} className="text-sm font-semibold text-primary hover:underline flex items-center gap-2">
                       <Phone className="h-3.5 w-3.5" /> {selectedEnquiry.phone || "N/A"}
                    </a>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-dashed border-border">
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                     Message Content / Enquiry
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

export default ManageConsultantEnquiries;
