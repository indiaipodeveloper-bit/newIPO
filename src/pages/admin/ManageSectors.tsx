import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { sectorApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  LayoutGrid,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Sector {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  mainline_count: number;
  sme_count: number;
  total_count: number;
}

const ManageSectors = () => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active"
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchSectors = () => {
    setLoading(true);
    sectorApi.getAdminAll()
      .then(setSectors)
      .catch((e) => toast.error("Failed to fetch sectors"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSectors();
  }, []);

  const handleOpenModal = (sector?: Sector) => {
    if (sector) {
      setEditingSector(sector);
      setFormData({
        name: sector.name,
        description: sector.description || "",
        status: sector.status
      });
    } else {
      setEditingSector(null);
      setFormData({
        name: "",
        description: "",
        status: "Active"
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return toast.error("Sector name is required");
    
    setSubmitting(true);
    try {
      if (editingSector) {
        await sectorApi.update(editingSector.id, formData);
        toast.success("Sector updated successfully");
      } else {
        await sectorApi.create(formData);
        toast.success("Sector created successfully");
      }
      setIsModalOpen(false);
      fetchSectors();
    } catch (e: any) {
      toast.error(e.message || "Failed to save sector");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this sector?")) return;
    
    try {
      await sectorApi.delete(id);
      toast.success("Sector deleted successfully");
      fetchSectors();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete sector");
    }
  };

  const filteredSectors = sectors.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage Sectors</h1>
            <p className="text-sm text-muted-foreground">Add and manage industry sectors for IPO classification</p>
          </div>
          <Button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> Add New Sector
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search sectors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Sector Name</TableHead>
                <TableHead>IPOs (Mainline/SME)</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary opacity-20" />
                  </TableCell>
                </TableRow>
              ) : filteredSectors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                    No sectors found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSectors.map((sector) => (
                  <TableRow key={sector.id} className="hover:bg-muted/30">
                    <TableCell className="font-semibold">{sector.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] py-0 px-1 border-blue-200 text-blue-700 bg-blue-50">
                            Mainline: {sector.mainline_count || 0}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] py-0 px-1 border-purple-200 text-purple-700 bg-purple-50">
                            SME: {sector.sme_count || 0}
                          </Badge>
                        </div>
                        <span className="text-[10px] text-muted-foreground">Total: {sector.total_count || 0} IPOs</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate opacity-70">
                      {sector.description || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={sector.status === "Active" ? "secondary" : "outline"} className={`flex w-fit items-center gap-1 ${sector.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}`}>
                        {sector.status === "Active" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {sector.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(sector)} className="h-8 w-8 text-blue-600">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(sector.id)} className="h-8 w-8 text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add/Edit Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingSector ? "Edit Sector" : "Add New Sector"}</DialogTitle>
              {editingSector && (
                <div className="mt-4 border rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="px-3 py-2 font-medium">Category</th>
                        <th className="px-3 py-2 font-medium text-right">IPO Count</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="px-3 py-2">Mainline / Mainboard</td>
                        <td className="px-3 py-2 text-right font-semibold text-blue-600">{editingSector.mainline_count || 0}</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">SME IPOs</td>
                        <td className="px-3 py-2 text-right font-semibold text-purple-600">{editingSector.sme_count || 0}</td>
                      </tr>
                      <tr className="bg-muted/20">
                        <td className="px-3 py-2 font-medium">Total IPOs</td>
                        <td className="px-3 py-2 text-right font-bold">{editingSector.total_count || 0}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sector Name</label>
                <Input 
                  placeholder="e.g. Technology, Infrastructure" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter sector details..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Sector"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ManageSectors;
