import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Plus, Trash2, Edit2, Save, X, ChevronDown, ChevronRight,
  FolderPlus, FileText, Eye, EyeOff
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
}

interface ReportItem {
  id: string;
  category_id: string;
  title: string;
  logo_url: string | null;
  last_updated: string | null;
  status: string | null;
  status_color: string | null;
  estimated_amount: string | null;
  exchange: string | null;
  sector: string | null;
  description: string | null;
  drhp_link: string | null;
  sort_order: number;
  is_active: boolean;
}

const ManageReports = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Record<string, ReportItem[]>>({});
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [newCat, setNewCat] = useState({ name: "", slug: "", description: "", icon: "FileText" });
  const [showNewCat, setShowNewCat] = useState(false);
  const [showNewItem, setShowNewItem] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    title: "", status: "Upcoming", status_color: "blue",
    estimated_amount: "", exchange: "", sector: "", description: "", drhp_link: "", logo_url: ""
  });
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editItemData, setEditItemData] = useState<Partial<ReportItem>>({});

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/reports/categories");
      if (res.ok) setCategories(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchItems = async (catId: string) => {
    try {
      const res = await fetch(`/api/reports/items?category_id=${catId}`);
      if (res.ok) {
        const data = await res.json();
        setItems((prev) => ({ ...prev, [catId]: data }));
      }
    } catch (err) { console.error(err); }
  };

  const toggleExpand = (catId: string) => {
    if (expandedCat === catId) {
      setExpandedCat(null);
    } else {
      setExpandedCat(catId);
      if (!items[catId]) fetchItems(catId);
    }
  };

  const addCategory = async () => {
    if (!newCat.name) return toast.error("Name required");
    const slug = newCat.slug || newCat.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    try {
      const res = await fetch("/api/reports/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCat.name, slug, description: newCat.description || null,
          icon: newCat.icon || "FileText", sort_order: categories.length
        })
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Category added!");
      setNewCat({ name: "", slug: "", description: "", icon: "FileText" });
      setShowNewCat(false);
      fetchCategories();
    } catch (err: any) { toast.error(err.message); }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this category and all its items?")) return;
    try {
      await fetch(`/api/reports/categories/${id}`, { method: "DELETE" });
      toast.success("Deleted!");
      fetchCategories();
    } catch (err: any) { toast.error(err.message); }
  };

  const toggleCategoryActive = async (cat: Category) => {
    try {
      await fetch(`/api/reports/categories/${cat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !cat.is_active })
      });
      fetchCategories();
    } catch (err) { console.error(err); }
  };

  const addItem = async (catId: string) => {
    if (!newItem.title) return toast.error("Title required");
    const catItems = items[catId] || [];
    try {
      const res = await fetch("/api/reports/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: catId, title: newItem.title, status: newItem.status,
          status_color: newItem.status_color, estimated_amount: newItem.estimated_amount || null,
          exchange: newItem.exchange || null, sector: newItem.sector || null,
          description: newItem.description || null, drhp_link: newItem.drhp_link || null,
          logo_url: newItem.logo_url || null, sort_order: catItems.length
        })
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Item added!");
      setNewItem({ title: "", status: "Upcoming", status_color: "blue", estimated_amount: "", exchange: "", sector: "", description: "", drhp_link: "", logo_url: "" });
      setShowNewItem(null);
      fetchItems(catId);
    } catch (err: any) { toast.error(err.message); }
  };

  const deleteItem = async (catId: string, itemId: string) => {
    try {
      await fetch(`/api/reports/items/${itemId}`, { method: "DELETE" });
      toast.success("Deleted!");
      fetchItems(catId);
    } catch (err: any) { toast.error(err.message); }
  };

  const toggleItemActive = async (catId: string, item: ReportItem) => {
    try {
      await fetch(`/api/reports/items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !item.is_active })
      });
      fetchItems(catId);
    } catch (err) { console.error(err); }
  };

  const startEditItem = (item: ReportItem) => {
    setEditingItem(item.id);
    setEditItemData({ ...item });
  };

  const saveEditItem = async (catId: string) => {
    if (!editingItem) return;
    try {
      const res = await fetch(`/api/reports/items/${editingItem}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editItemData.title, status: editItemData.status,
          status_color: editItemData.status_color, estimated_amount: editItemData.estimated_amount,
          exchange: editItemData.exchange, sector: editItemData.sector,
          description: editItemData.description, drhp_link: editItemData.drhp_link,
          logo_url: editItemData.logo_url,
        })
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Updated!");
      setEditingItem(null);
      fetchItems(catId);
    } catch (err: any) { toast.error(err.message); }
  };

  const statusColors = ["blue", "red", "green", "yellow", "orange", "purple", "gray"];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports Management</h1>
            <p className="text-sm text-muted-foreground">{categories.length} categories</p>
          </div>
          <Button onClick={() => setShowNewCat(true)} className="bg-primary text-primary-foreground">
            <FolderPlus className="h-4 w-4 mr-2" /> Add Category
          </Button>
        </div>

        {/* New Category Form */}
        {showNewCat && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-foreground">New Report Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Category Name" value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} />
              <Input placeholder="Slug (auto-generated)" value={newCat.slug} onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })} />
              <Input placeholder="Description" value={newCat.description} onChange={(e) => setNewCat({ ...newCat, description: e.target.value })} className="md:col-span-2" />
              <select value={newCat.icon} onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })} className="border border-border rounded-md px-3 py-2 text-sm bg-background">
                <option value="FileText">📄 FileText</option>
                <option value="Calendar">📅 Calendar</option>
                <option value="BarChart3">📊 BarChart</option>
                <option value="TrendingUp">📈 TrendingUp</option>
                <option value="PieChart">🥧 PieChart</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={addCategory} className="bg-primary text-primary-foreground"><Save className="h-4 w-4 mr-1" /> Save</Button>
              <Button variant="ghost" onClick={() => setShowNewCat(false)}><X className="h-4 w-4 mr-1" /> Cancel</Button>
            </div>
          </div>
        )}

        {/* Categories List */}
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-card border border-border rounded-xl overflow-hidden">
              {/* Category Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
                onClick={() => toggleExpand(cat.id)}
              >
                <div className="flex items-center gap-3">
                  {expandedCat === cat.id ? <ChevronDown className="h-4 w-4 text-primary" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">{cat.name}</span>
                  <Badge variant="outline" className="text-[10px]">{cat.slug}</Badge>
                  {!cat.is_active && <Badge variant="secondary" className="text-[10px]">Hidden</Badge>}
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" onClick={() => toggleCategoryActive(cat)}>
                    {cat.is_active ? <Eye className="h-3.5 w-3.5 text-green-600" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteCategory(cat.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Expanded Items */}
              {expandedCat === cat.id && (
                <div className="border-t border-border">
                  <div className="p-4 bg-secondary/10">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-muted-foreground">
                        {(items[cat.id] || []).length} items in this category
                      </p>
                      <Button size="sm" onClick={() => setShowNewItem(cat.id)} className="bg-primary text-primary-foreground">
                        <Plus className="h-3.5 w-3.5 mr-1" /> Add Item
                      </Button>
                    </div>

                    {/* New Item Form */}
                    {showNewItem === cat.id && (
                      <div className="bg-card border border-border rounded-lg p-4 mb-4 space-y-3">
                        <h4 className="text-sm font-semibold">Add New Report Item</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          <Input placeholder="Company/Title *" value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} />
                          <Input placeholder="Status (e.g. Filed with SEBI)" value={newItem.status} onChange={(e) => setNewItem({ ...newItem, status: e.target.value })} />
                          <select value={newItem.status_color} onChange={(e) => setNewItem({ ...newItem, status_color: e.target.value })} className="border border-border rounded-md px-3 py-2 text-sm bg-background">
                            {statusColors.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <Input placeholder="Estimated Amount (Rs.Cr.)" value={newItem.estimated_amount} onChange={(e) => setNewItem({ ...newItem, estimated_amount: e.target.value })} />
                          <Input placeholder="Exchange (e.g. BSE, NSE)" value={newItem.exchange} onChange={(e) => setNewItem({ ...newItem, exchange: e.target.value })} />
                          <Input placeholder="Sector" value={newItem.sector} onChange={(e) => setNewItem({ ...newItem, sector: e.target.value })} />
                          <Input placeholder="DRHP Link" value={newItem.drhp_link} onChange={(e) => setNewItem({ ...newItem, drhp_link: e.target.value })} />
                          <Input placeholder="Logo URL" value={newItem.logo_url} onChange={(e) => setNewItem({ ...newItem, logo_url: e.target.value })} />
                          <Input placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => addItem(cat.id)} className="bg-primary text-primary-foreground"><Save className="h-3.5 w-3.5 mr-1" /> Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setShowNewItem(null)}><X className="h-3.5 w-3.5 mr-1" /> Cancel</Button>
                        </div>
                      </div>
                    )}

                    {/* Items Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-primary/10 text-xs text-foreground uppercase">
                            <th className="px-3 py-2 text-left">Title</th>
                            <th className="px-3 py-2 text-left">Status</th>
                            <th className="px-3 py-2 text-left">Amount</th>
                            <th className="px-3 py-2 text-left">Exchange</th>
                            <th className="px-3 py-2 text-left">Sector</th>
                            <th className="px-3 py-2 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(items[cat.id] || []).map((item) => (
                            <tr key={item.id} className="border-b border-border hover:bg-secondary/20">
                              {editingItem === item.id ? (
                                <>
                                  <td className="px-3 py-2"><Input className="h-8 text-xs" value={editItemData.title || ""} onChange={(e) => setEditItemData({ ...editItemData, title: e.target.value })} /></td>
                                  <td className="px-3 py-2"><Input className="h-8 text-xs" value={editItemData.status || ""} onChange={(e) => setEditItemData({ ...editItemData, status: e.target.value })} /></td>
                                  <td className="px-3 py-2"><Input className="h-8 text-xs" value={editItemData.estimated_amount || ""} onChange={(e) => setEditItemData({ ...editItemData, estimated_amount: e.target.value })} /></td>
                                  <td className="px-3 py-2"><Input className="h-8 text-xs" value={editItemData.exchange || ""} onChange={(e) => setEditItemData({ ...editItemData, exchange: e.target.value })} /></td>
                                  <td className="px-3 py-2"><Input className="h-8 text-xs" value={editItemData.sector || ""} onChange={(e) => setEditItemData({ ...editItemData, sector: e.target.value })} /></td>
                                  <td className="px-3 py-2 text-right">
                                    <Button size="sm" variant="ghost" onClick={() => saveEditItem(cat.id)}><Save className="h-3 w-3" /></Button>
                                    <Button size="sm" variant="ghost" onClick={() => setEditingItem(null)}><X className="h-3 w-3" /></Button>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="px-3 py-2 font-medium">{item.title}</td>
                                  <td className="px-3 py-2"><Badge className="text-[10px]">{item.status}</Badge></td>
                                  <td className="px-3 py-2">{item.estimated_amount || "—"}</td>
                                  <td className="px-3 py-2">{item.exchange || "—"}</td>
                                  <td className="px-3 py-2">{item.sector || "—"}</td>
                                  <td className="px-3 py-2 text-right">
                                    <Button size="sm" variant="ghost" onClick={() => startEditItem(item)}><Edit2 className="h-3 w-3" /></Button>
                                    <Button size="sm" variant="ghost" onClick={() => toggleItemActive(cat.id, item)}>
                                      {item.is_active ? <Eye className="h-3 w-3 text-green-600" /> : <EyeOff className="h-3 w-3" />}
                                    </Button>
                                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteItem(cat.id, item.id)}>
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                          {(items[cat.id] || []).length === 0 && (
                            <tr>
                              <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                                No items yet. Click "Add Item" to add content.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageReports;
