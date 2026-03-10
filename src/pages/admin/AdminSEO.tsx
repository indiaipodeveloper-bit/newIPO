import AdminLayout from "@/components/AdminLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

const AdminSEO = () => {
  const [seo, setSeo] = useState({
    metaTitle: "IndiaIPO - India's Leading IPO Consultancy Platform",
    metaDescription: "Expert advisory for SME IPO, Mainline IPO, FPO, and Pre-IPO funding. Navigate Indian capital markets with confidence.",
    ogImage: "",
    keywords: "IPO, SME IPO, Mainline IPO, FPO, Pre-IPO, Indian Stock Market, SEBI, IPO Consultancy",
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">SEO Settings</h1>
          <p className="text-sm text-muted-foreground">Manage global SEO metadata for the website</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4 max-w-2xl">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Meta Title</label>
            <Input value={seo.metaTitle} onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })} />
            <p className="text-xs text-muted-foreground mt-1">{seo.metaTitle.length}/60 characters</p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Meta Description</label>
            <Textarea value={seo.metaDescription} onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })} rows={3} />
            <p className="text-xs text-muted-foreground mt-1">{seo.metaDescription.length}/160 characters</p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Keywords</label>
            <Input value={seo.keywords} onChange={(e) => setSeo({ ...seo, keywords: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">OG Image URL</label>
            <Input value={seo.ogImage} onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })} placeholder="https://..." />
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-gold-light font-semibold" onClick={() => toast.success("SEO settings saved!")}>
            Save Settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSEO;
