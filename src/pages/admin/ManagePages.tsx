import AdminLayout from "@/components/AdminLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Layout, Edit, Eye, Trash2, Plus, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const initialPages = [
  { id: 1, title: "Home", slug: "/", status: "Published", lastModified: "2026-03-04" },
  { id: 2, title: "About Us", slug: "/about", status: "Published", lastModified: "2026-03-02" },
  { id: 3, title: "Services", slug: "/services", status: "Published", lastModified: "2026-03-01" },
  { id: 4, title: "IPO Calendar", slug: "/ipo-calendar", status: "Published", lastModified: "2026-03-04" },
  { id: 5, title: "IPO Calculator", slug: "/ipo-calculator", status: "Published", lastModified: "2026-02-28" },
  { id: 6, title: "IPO Feasibility", slug: "/ipo-feasibility", status: "Published", lastModified: "2026-03-04" },
  { id: 7, title: "Investors", slug: "/investors", status: "Published", lastModified: "2026-03-04" },
  { id: 8, title: "Merchant Bankers — SME", slug: "/merchant-bankers/sme", status: "Published", lastModified: "2026-03-04" },
  { id: 9, title: "Merchant Bankers — Mainboard", slug: "/merchant-bankers/mainboard", status: "Published", lastModified: "2026-03-04" },
  { id: 10, title: "Reports", slug: "/reports", status: "Published", lastModified: "2026-03-04" },
  { id: 11, title: "IPO Knowledge", slug: "/ipo-knowledge", status: "Published", lastModified: "2026-03-04" },
  { id: 12, title: "News & Updates", slug: "/news-updates", status: "Published", lastModified: "2026-03-04" },
  { id: 13, title: "Blog", slug: "/blog", status: "Published", lastModified: "2026-03-01" },
  { id: 14, title: "Contact", slug: "/contact", status: "Published", lastModified: "2026-02-28" },
];

const ManagePages = () => {
  const [pages] = useState(initialPages);
  const [search, setSearch] = useState("");

  const filtered = pages.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage Pages</h1>
            <p className="text-sm text-muted-foreground">View and manage all website pages</p>
          </div>
          <Button className="bg-primary text-primary-foreground" onClick={() => toast.info("Page editor coming soon — connect your backend to enable this.")}>
            <Plus className="h-4 w-4 mr-1" />
            New Page
          </Button>
        </div>

        <Input
          placeholder="Search pages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Page Title</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground hidden sm:table-cell">Slug</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground hidden md:table-cell">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground hidden lg:table-cell">Last Modified</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((page) => (
                <tr key={page.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Layout className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{page.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell font-mono text-xs">{page.slug}</td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <Badge variant="outline" className="bg-brand-green/15 text-brand-green border-brand-green/30 text-[10px]">
                      {page.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell text-xs">{page.lastModified}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => window.open(page.slug, "_blank")}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => toast.info("Page editor — connect backend to enable editing.")}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManagePages;
