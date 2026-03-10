import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Plus, Trash2, Edit2, Save, X, ChevronDown, ChevronRight,
  FolderPlus, BookOpen, Eye, EyeOff
} from "lucide-react";

interface Category {
  id: string; name: string; slug: string; description: string | null;
  icon: string | null; sort_order: number; is_active: boolean;
}

interface KnowledgeItem {
  id: string; category_id: string; title: string; subtitle: string | null;
  col1: string | null; col2: string | null; col3: string | null;
  col4: string | null; col5: string | null; col6: string | null;
  link: string | null; location: string | null; sort_order: number; is_active: boolean;
}

const ManageKnowledge = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Record<string, KnowledgeItem[]>>({});
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [showNewCat, setShowNewCat] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", slug: "", description: "", icon: "BookOpen" });
  const [showNewItem, setShowNewItem] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ title: "", subtitle: "", col1: "", col2: "", col3: "", col4: "", link: "", location: "" });
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<KnowledgeItem>>({});

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/knowledge/categories");
      if (res.ok) setCategories(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchItems = async (catId: string) => {
    try {
      const res = await fetch(`/api/knowledge/items?category_id=${catId}`);
      if (res.ok) {
        const data = await res.json();
        setItems((prev) => ({ ...prev, [catId]: data }));
      }
    } catch (err) { console.error(err); }
  };

  const toggleExpand = (catId: string) => {
    if (expandedCat === catId) { setExpandedCat(null); return; }
    setExpandedCat(catId);
    if (!items[catId]) fetchItems(catId);
  };

  const addCategory = async () => {
    if (!newCat.name) return toast.error("Name required");
    const slug = newCat.slug || newCat.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    try {
      const res = await fetch("/api/knowledge/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCat.name, slug, description: newCat.description || null, icon: newCat.icon, sort_order: categories.length })
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Category added!");
      setNewCat({ name: "", slug: "", description: "", icon: "BookOpen" }); setShowNewCat(false); fetchCategories();
    } catch (err: any) { toast.error(err.message); }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this category and all items?")) return;
    try {
      await fetch(`/api/knowledge/categories/${id}`, { method: "DELETE" });
      toast.success("Deleted!"); fetchCategories();
    } catch (err) { console.error(err); }
  };

  const toggleCatActive = async (cat: Category) => {
    try {
      await fetch(`/api/knowledge/categories/${cat.id}`, {
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
      const res = await fetch("/api/knowledge/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: catId, title: newItem.title, subtitle: newItem.subtitle || null,
          col1: newItem.col1 || null, col2: newItem.col2 || null, col3: newItem.col3 || null,
          col4: newItem.col4 || null, link: newItem.link || null, location: newItem.location || null,
          sort_order: catItems.length
        })
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Item added!");
      setNewItem({ title: "", subtitle: "", col1: "", col2: "", col3: "", col4: "", link: "", location: "" }); setShowNewItem(null); fetchItems(catId);
    } catch (err: any) { toast.error(err.message); }
  };

  const deleteItem = async (catId: string, itemId: string) => {
    try {
      await fetch(`/api/knowledge/items/${itemId}`, { method: "DELETE" });
      toast.success("Deleted!"); fetchItems(catId);
    } catch (err) { console.error(err); }
  };

  const toggleItemActive = async (catId: string, item: KnowledgeItem) => {
    try {
      await fetch(`/api/knowledge/items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !item.is_active })
      });
      fetchItems(catId);
    } catch (err) { console.error(err); }
  };

  const startEdit = (item: KnowledgeItem) => { setEditingItem(item.id); setEditData({ ...item }); };

  const saveEdit = async (catId: string) => {
    if (!editingItem) return;
    try {
      await fetch(`/api/knowledge/items/${editingItem}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editData.title, subtitle: editData.subtitle, col1: editData.col1, col2: editData.col2,
          col3: editData.col3, col4: editData.col4, link: editData.link, location: editData.location,
        })
      });
      toast.success("Updated!"); setEditingItem(null); fetchItems(catId);
    } catch (err) { console.error(err); }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">IPO Knowledge Management</h1>
            <p className="text-sm text-muted-foreground">{categories.length} categories</p>
          </div>
          <Button onClick={() => setShowNewCat(true)} className="bg-primary text-primary-foreground">
            <FolderPlus className="h-4 w-4 mr-2" /> Add Category
          </Button>
        </div>

        {showNewCat && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <h3 className="font-semibold">New Knowledge Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Category Name" value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} />
              <Input placeholder="Slug (auto)" value={newCat.slug} onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })} />
              <Input placeholder="Description" value={newCat.description} onChange={(e) => setNewCat({ ...newCat, description: e.target.value })} className="md:col-span-2" />
              <select value={newCat.icon} onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })} className="border border-border rounded-md px-3 py-2 text-sm bg-background">
                <option value="BookOpen">📖 BookOpen</option>
                <option value="FileText">📄 FileText</option>
                <option value="Scale">⚖️ Scale</option>
                <option value="BarChart3">📊 BarChart</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={addCategory} className="bg-primary text-primary-foreground"><Save className="h-4 w-4 mr-1" /> Save</Button>
              <Button variant="ghost" onClick={() => setShowNewCat(false)}><X className="h-4 w-4 mr-1" /> Cancel</Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/30 transition-colors" onClick={() => toggleExpand(cat.id)}>
                <div className="flex items-center gap-3">
                  {expandedCat === cat.id ? <ChevronDown className="h-4 w-4 text-primary" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">{cat.name}</span>
                  <Badge variant="outline" className="text-[10px]">{cat.slug}</Badge>
                  {!cat.is_active && <Badge variant="secondary" className="text-[10px]">Hidden</Badge>}
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" onClick={() => toggleCatActive(cat)}>
                    {cat.is_active ? <Eye className="h-3.5 w-3.5 text-green-600" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteCategory(cat.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {expandedCat === cat.id && (
                <div className="border-t border-border p-4 bg-secondary/10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-muted-foreground">{(items[cat.id] || []).length} items</p>
                    <Button size="sm" onClick={() => setShowNewItem(cat.id)} className="bg-primary text-primary-foreground">
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Item
                    </Button>
                  </div>

                  {showNewItem === cat.id && (
                    <div className="bg-card border border-border rounded-lg p-4 mb-4 space-y-3">
                      <h4 className="text-sm font-semibold">Add New Item</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <Input placeholder="Title *" value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} />
                        <Input placeholder="Subtitle" value={newItem.subtitle} onChange={(e) => setNewItem({ ...newItem, subtitle: e.target.value })} />
                        <Input placeholder="Column 1 value" value={newItem.col1} onChange={(e) => setNewItem({ ...newItem, col1: e.target.value })} />
                        <Input placeholder="Column 2 value" value={newItem.col2} onChange={(e) => setNewItem({ ...newItem, col2: e.target.value })} />
                        <Input placeholder="Column 3 value" value={newItem.col3} onChange={(e) => setNewItem({ ...newItem, col3: e.target.value })} />
                        <Input placeholder="Column 4 value" value={newItem.col4} onChange={(e) => setNewItem({ ...newItem, col4: e.target.value })} />
                        <Input placeholder="Link URL" value={newItem.link} onChange={(e) => setNewItem({ ...newItem, link: e.target.value })} />
                        <Input placeholder="Location" value={newItem.location} onChange={(e) => setNewItem({ ...newItem, location: e.target.value })} />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => addItem(cat.id)} className="bg-primary text-primary-foreground"><Save className="h-3.5 w-3.5 mr-1" /> Save</Button>
                        <Button size="sm" variant="ghost" onClick={() => setShowNewItem(null)}><X className="h-3.5 w-3.5 mr-1" /> Cancel</Button>
                      </div>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-primary/10 text-xs text-foreground uppercase">
                          <th className="px-3 py-2 text-left">Title</th>
                          <th className="px-3 py-2 text-left">Col 1</th>
                          <th className="px-3 py-2 text-left">Col 2</th>
                          <th className="px-3 py-2 text-left">Col 3</th>
                          <th className="px-3 py-2 text-left">Col 4</th>
                          <th className="px-3 py-2 text-left">Location</th>
                          <th className="px-3 py-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(items[cat.id] || []).map((item) => (
                          <tr key={item.id} className="border-b border-border hover:bg-secondary/20">
                            {editingItem === item.id ? (
                              <>
                                <td className="px-3 py-2"><Input className="h-8 text-xs" value={editData.title || ""} onChange={(e) => setEditData({ ...editData, title: e.target.value })} /></td>
                                <td className="px-3 py-2"><Input className="h-8 text-xs" value={editData.col1 || ""} onChange={(e) => setEditData({ ...editData, col1: e.target.value })} /></td>
                                <td className="px-3 py-2"><Input className="h-8 text-xs" value={editData.col2 || ""} onChange={(e) => setEditData({ ...editData, col2: e.target.value })} /></td>
                                <td className="px-3 py-2"><Input className="h-8 text-xs" value={editData.col3 || ""} onChange={(e) => setEditData({ ...editData, col3: e.target.value })} /></td>
                                <td className="px-3 py-2"><Input className="h-8 text-xs" value={editData.col4 || ""} onChange={(e) => setEditData({ ...editData, col4: e.target.value })} /></td>
                                <td className="px-3 py-2"><Input className="h-8 text-xs" value={editData.location || ""} onChange={(e) => setEditData({ ...editData, location: e.target.value })} /></td>
                                <td className="px-3 py-2 text-right">
                                  <Button size="sm" variant="ghost" onClick={() => saveEdit(cat.id)}><Save className="h-3 w-3" /></Button>
                                  <Button size="sm" variant="ghost" onClick={() => setEditingItem(null)}><X className="h-3 w-3" /></Button>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="px-3 py-2 font-medium">{item.title}</td>
                                <td className="px-3 py-2">{item.col1 || "—"}</td>
                                <td className="px-3 py-2">{item.col2 || "—"}</td>
                                <td className="px-3 py-2">{item.col3 || "—"}</td>
                                <td className="px-3 py-2">{item.col4 || "—"}</td>
                                <td className="px-3 py-2">{item.location || "—"}</td>
                                <td className="px-3 py-2 text-right">
                                  <Button size="sm" variant="ghost" onClick={() => startEdit(item)}><Edit2 className="h-3 w-3" /></Button>
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
                          <tr><td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">No items yet.</td></tr>
                        )}
                      </tbody>
                    </table>
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

export default ManageKnowledge;
