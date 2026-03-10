import AdminLayout from "@/components/AdminLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Navigation, ChevronRight, Edit, Trash2, Plus, GripVertical, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface NavMenuItem {
  id: number;
  label: string;
  href: string;
  visible: boolean;
  type: "link" | "dropdown" | "mega-menu";
  children?: { label: string; href: string }[];
}

const initialNavItems: NavMenuItem[] = [
  { id: 1, label: "Home", href: "/", visible: true, type: "link" },
  { id: 2, label: "About", href: "/about", visible: true, type: "dropdown", children: [
    { label: "About IndiaIPO", href: "/about" },
    { label: "Our Team", href: "/about#team" },
    { label: "Our Vision", href: "/about#vision" },
  ]},
  { id: 3, label: "Services", href: "/services", visible: true, type: "mega-menu", children: [
    { label: "Initial Public Offering (IPO)", href: "/services#ipo" },
    { label: "SME IPO Consultation", href: "/services#sme-ipo" },
    { label: "Mainline IPO Consultation", href: "/services#mainline-ipo" },
    { label: "Follow-On Public Offer (FPO)", href: "/services#fpo" },
    { label: "Pre-IPO Funding", href: "/services#pre-ipo" },
  ]},
  { id: 4, label: "Investors", href: "/investors", visible: true, type: "link" },
  { id: 5, label: "Merchant Bankers", href: "#", visible: true, type: "mega-menu", children: [
    { label: "SME Merchant Bankers", href: "/merchant-bankers/sme" },
    { label: "Mainboard Merchant Bankers", href: "/merchant-bankers/mainboard" },
  ]},
  { id: 6, label: "Resources", href: "#", visible: true, type: "mega-menu", children: [
    { label: "IPO Calendar", href: "/ipo-calendar" },
    { label: "IPO Reports", href: "/reports" },
    { label: "IPO Knowledge", href: "/ipo-knowledge" },
  ]},
  { id: 7, label: "News/Updates", href: "/news-updates", visible: true, type: "dropdown", children: [
    { label: "Markets & Money Update", href: "/news-updates#markets" },
    { label: "IPO & Market Snaps", href: "/news-updates#snaps" },
  ]},
  { id: 8, label: "Contact Us", href: "/contact", visible: true, type: "link" },
];

const footerSections = [
  { title: "Quick Links", items: ["Home", "About Us", "Services", "IPO Calendar", "Blog", "Contact"] },
  { title: "Services", items: ["SME IPO", "Mainline IPO", "FPO Advisory", "Pre-IPO Funding", "Business Valuation"] },
  { title: "Contact Info", items: ["Mumbai, Maharashtra, India", "+91 98765 43210", "info@indiaipo.in"] },
];

const ManageNavigation = () => {
  const [navItems, setNavItems] = useState(initialNavItems);

  const toggleVisibility = (id: number) => {
    setNavItems((items) =>
      items.map((item) => item.id === id ? { ...item, visible: !item.visible } : item)
    );
    toast.success("Navigation updated! Connect your backend to persist changes.");
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Navigation</h1>
          <p className="text-sm text-muted-foreground">Control header menu, submenus, and footer links</p>
        </div>

        {/* Header Navigation */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              Header Navigation
            </h2>
            <Button size="sm" className="bg-primary text-primary-foreground" onClick={() => toast.info("Connect backend to add new menu items.")}>
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </div>

          <div className="space-y-2">
            {navItems.map((item) => (
              <div key={item.id} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{item.label}</span>
                      <Badge variant="outline" className="text-[10px]">{item.type}</Badge>
                      <span className="text-xs text-muted-foreground font-mono">{item.href}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {item.visible ? <Eye className="h-3.5 w-3.5 text-brand-green" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
                      <Switch checked={item.visible} onCheckedChange={() => toggleVisibility(item.id)} />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => toast.info("Connect backend to edit menu items.")}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                {item.children && item.children.length > 0 && (
                  <div className="border-t border-border bg-muted/30 px-4 py-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Sub Items</p>
                    <div className="space-y-1">
                      {item.children.map((child, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-foreground/70 pl-6">
                          <ChevronRight className="h-3 w-3 text-primary" />
                          <span>{child.label}</span>
                          <span className="text-xs text-muted-foreground font-mono ml-auto">{child.href}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Footer Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {footerSections.map((section) => (
              <div key={section.title} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground text-sm">{section.title}</h3>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary"
                    onClick={() => toast.info("Connect backend to edit footer.")}>
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <p key={item} className="text-xs text-muted-foreground">{item}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
          <p className="text-sm text-foreground font-medium">💡 Connect your Express + MongoDB backend to enable live editing of navigation, pages, and footer content.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageNavigation;
