import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash2, CheckCircle, Mail, Phone, Building2, User, Clock, MessageSquareText } from "lucide-react";
import { format } from "date-fns";

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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Consultant Enquiries</h1>
          <p className="text-sm text-muted-foreground">{enquiries.length} enquiries received from the Consultant pages</p>
        </div>

        <div className="space-y-4">
          {enquiries.map((e) => (
            <div key={e.id} className={`bg-card border rounded-xl p-6 shadow-sm transition-all ${!e.is_read ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20" : "border-border"}`}>
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-foreground">{e.name}</h3>
                        {!e.is_read && <Badge className="bg-primary text-primary-foreground animate-pulse">New</Badge>}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        <span>{e.organisation || "Individual"}</span>
                        <span className="mx-1">•</span>
                        <Clock className="h-3.5 w-3.5" />
                        <span>{format(new Date(e.created_at), "PPP p")}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-background/50 border-primary/20 text-primary self-start px-3 py-1">
                      Target: {e.consultant_name}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4 border-b border-border/50">
                    <div className="flex items-center gap-2.5 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <a href={`mailto:${e.email}`} className="hover:underline font-medium">{e.email}</a>
                    </div>
                    {e.phone && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center">
                          <Phone className="h-4 w-4 text-primary" />
                        </div>
                        <a href={`tel:${e.phone}`} className="hover:underline font-medium">{e.phone}</a>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <MessageSquareText className="h-3.5 w-3.5" />
                      Message
                    </div>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap bg-muted/30 p-4 rounded-lg border border-border/50">
                      {e.message}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-2 shrink-0 md:border-l md:border-border md:pl-6 md:justify-center">
                  {!e.is_read && (
                    <Button onClick={() => markAsRead(e.id)} className="flex-1 md:flex-none bg-primary text-primary-foreground">
                      <CheckCircle className="h-4 w-4 mr-2" /> Mark Read
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1 md:flex-none text-destructive hover:bg-destructive/10" onClick={() => del(e.id)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {enquiries.length === 0 && !loading && (
            <div className="text-center py-20 bg-card border border-dashed border-border rounded-xl">
              <Mail className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground">No Enquiries Yet</h3>
              <p className="text-sm text-muted-foreground">Wait for users to contact your consultants.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageConsultantEnquiries;
