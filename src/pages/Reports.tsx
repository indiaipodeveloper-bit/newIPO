import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home, ChevronRight, TrendingUp, Search, FileText, Calendar,
  BarChart3, PieChart, Download, ExternalLink, Filter
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  FileText, Calendar, BarChart3, TrendingUp, PieChart,
};

interface ReportCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
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
}

const statusColorMap: Record<string, string> = {
  red: "bg-red-600 text-white",
  green: "bg-green-600 text-white",
  blue: "bg-blue-600 text-white",
  yellow: "bg-yellow-500 text-white",
  orange: "bg-orange-500 text-white",
  purple: "bg-purple-600 text-white",
  gray: "bg-gray-500 text-white",
};

const Reports = () => {
  const { slug } = useParams();
  const [categories, setCategories] = useState<ReportCategory[]>([]);
  const [items, setItems] = useState<ReportItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<ReportCategory | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<"all" | "mainline" | "sme">("all");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const found = slug
        ? categories.find((c) => c.slug === slug)
        : categories[0];
      if (found) {
        setActiveCategory(found);
        fetchItems(found.id);
      }
    }
  }, [categories, slug]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/reports/categories");
      if (res.ok) setCategories(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchItems = async (categoryId: string) => {
    try {
      const res = await fetch(`/api/reports/items?category_id=${categoryId}`);
      if (res.ok) setItems(await res.json());
    } catch (err) { console.error(err); }
  };

  const filteredItems = items.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.sector?.toLowerCase().includes(search.toLowerCase()));
    if (filterTab === "all") return matchSearch;
    if (filterTab === "mainline") return matchSearch && item.exchange?.toLowerCase().includes("nse");
    if (filterTab === "sme") return matchSearch && item.exchange?.toLowerCase().includes("sme");
    return matchSearch;
  });

  const IconComponent = activeCategory?.icon ? iconMap[activeCategory.icon] || TrendingUp : TrendingUp;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={activeCategory ? `${activeCategory.name} - IndiaIPO` : "Reports - IndiaIPO"}
        description={activeCategory?.description || "IPO Reports and Analysis"}
      />
      <Header />
      <main>
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 py-12 md:py-16">
          <div className="container mx-auto px-4">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-white/70 mb-6">
              <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
                <Home className="h-4 w-4" />
                Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white font-medium">
                {activeCategory?.name || "Reports"}
              </span>
            </div>
            <div className="border-t border-white/20 pt-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-4xl font-bold text-white flex items-center gap-3"
              >
                <IconComponent className="h-8 w-8" />
                {activeCategory?.name || "Reports Dashboard"}
              </motion.h1>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Category Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {categories.map((cat) => {
              const CatIcon = iconMap[cat.icon || "FileText"] || FileText;
              const isActive = activeCategory?.id === cat.id;
              return (
                <Link
                  key={cat.id}
                  to={`/reports/${cat.slug}`}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all border-2 text-center justify-center
                    ${isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg"
                      : "bg-card text-foreground border-border hover:border-primary/40 hover:shadow-md"
                    }`}
                >
                  <CatIcon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{cat.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Description */}
          {activeCategory?.description && (
            <div className="bg-card border border-border rounded-xl p-5 mb-8">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {activeCategory.description}
              </p>
            </div>
          )}

          {/* Filter Tabs + Search */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border flex-wrap gap-4">
              <h2 className="text-lg font-bold text-foreground">
                {activeCategory?.name} List
              </h2>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-48 md:w-64"
                />
                <Button size="icon" className="bg-primary text-primary-foreground">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Sub-filter tabs */}
            <div className="flex border-b border-border">
              {[
                { key: "all" as const, label: "All IPOs" },
                { key: "mainline" as const, label: "Mainline IPOs" },
                { key: "sme" as const, label: "SME IPOs" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilterTab(tab.key)}
                  className={`flex-1 py-3 text-sm font-semibold transition-all border-b-2
                    ${filterTab === tab.key
                      ? "text-primary border-primary bg-primary/5"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-900 to-purple-900 text-white text-xs uppercase">
                    <th className="px-4 py-3 text-left font-semibold">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Company
                      </span>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Last Updated
                      </span>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Status
                      </span>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      <span className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        Estimated Issue Amount (Rs.Cr.)
                      </span>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      <span className="flex items-center gap-1">
                        <Filter className="h-3 w-3" />
                        Exchange
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, idx) => (
                      <tr
                        key={item.id}
                        className={`border-b border-border hover:bg-secondary/50 transition-colors ${idx % 2 === 0 ? "bg-background" : "bg-secondary/20"
                          }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {item.logo_url && (
                              <img src={item.logo_url} alt="" className="w-8 h-8 rounded object-contain border border-border" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-foreground">{item.title}</p>
                              {item.sector && (
                                <p className="text-xs text-muted-foreground">{item.sector}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {item.last_updated || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {item.status && (
                            <Badge className={`text-[10px] font-bold ${statusColorMap[item.status_color || "blue"]}`}>
                              {item.status}
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-foreground font-medium">
                            {item.estimated_amount || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {item.exchange && (
                            <div className="flex gap-1 flex-wrap">
                              {item.exchange.split(",").map((ex) => (
                                <Badge
                                  key={ex.trim()}
                                  variant="outline"
                                  className="text-[10px] font-bold border-primary/30 text-primary"
                                >
                                  {ex.trim()}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <FileText className="h-12 w-12 text-muted-foreground/30" />
                          <p className="text-muted-foreground">
                            {loading ? "Loading..." : "No data available yet. Admin will add content soon."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom info section */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                About This Report
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Keep track of upcoming Mainboard and SME IPOs in India, along with insightful inputs and facts at your fingertips.
                Our exclusive section offers access to downloadable DRHPs submitted by companies to SEBI, BSE, NSE.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Key Features
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li>• Sector classification & city of origin</li>
                <li>• Revenue performance & PAT details</li>
                <li>• Stock exchange listing information</li>
                <li>• Appointed merchant bankers</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary to-purple-700 rounded-xl p-5 text-white">
              <h3 className="font-bold mb-2">Check IPO Feasibility</h3>
              <p className="text-sm text-white/80 mb-4">
                Want to check if your company is eligible for IPO? Get a free feasibility check.
              </p>
              <Button asChild className="bg-white text-primary hover:bg-white/90 font-semibold">
                <Link to="/contact">Get Started →</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Reports;
