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
  Home, ChevronRight, Search, BookOpen, FileText, Scale,
  BarChart3, Filter, ArrowRight, ExternalLink
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  BookOpen, FileText, Scale, BarChart3,
};

interface KnowledgeCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
}

interface KnowledgeItem {
  id: string;
  category_id: string;
  title: string;
  subtitle: string | null;
  col1: string | null;
  col2: string | null;
  col3: string | null;
  col4: string | null;
  col5: string | null;
  col6: string | null;
  link: string | null;
  location: string | null;
}

const IPOKnowledge = () => {
  const { slug } = useParams();
  const [categories, setCategories] = useState<KnowledgeCategory[]>([]);
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<KnowledgeCategory | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const found = slug ? categories.find((c) => c.slug === slug) : categories[0];
      if (found) {
        setActiveCategory(found);
        fetchItems(found.id);
      }
    }
  }, [categories, slug]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/knowledge/categories");
      if (res.ok) setCategories(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchItems = async (categoryId: string) => {
    try {
      const res = await fetch(`/api/knowledge/items?category_id=${categoryId}`);
      if (res.ok) setItems(await res.json());
    } catch (err) { console.error(err); }
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    (item.subtitle?.toLowerCase().includes(search.toLowerCase())) ||
    (item.location?.toLowerCase().includes(search.toLowerCase()))
  );

  const IconComponent = activeCategory?.icon ? iconMap[activeCategory.icon] || BookOpen : BookOpen;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={activeCategory ? `${activeCategory.name} - IndiaIPO` : "IPO Knowledge - IndiaIPO"}
        description={activeCategory?.description || "IPO Knowledge Center"}
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-white/70 mb-6">
              <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
                <Home className="h-4 w-4" /> Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white font-medium">{activeCategory?.name || "IPO Knowledge"}</span>
            </div>
            <div className="border-t border-white/20 pt-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-4xl font-bold text-white flex items-center gap-3"
              >
                <IconComponent className="h-8 w-8" />
                {activeCategory?.name || "IPO Knowledge Center"}
              </motion.h1>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Description Card */}
              {activeCategory?.description && (
                <div className="border-2 border-primary/20 rounded-xl p-6 mb-8 text-center">
                  <h2 className="text-xl md:text-2xl font-bold text-primary mb-3">{activeCategory.name}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                    {activeCategory.description}
                  </p>
                </div>
              )}

              {/* Count Bar */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 mb-4 text-center">
                <p className="text-sm text-foreground">
                  <FileText className="h-4 w-4 inline mr-1" />
                  Showing <span className="font-bold text-primary">{filteredItems.length}</span> of{" "}
                  <span className="font-bold">{items.length}</span> entries
                </p>
              </div>

              {/* Table */}
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-700 to-blue-900 text-white text-xs uppercase">
                        <th className="px-4 py-3 text-left font-semibold">Title</th>
                        <th className="px-4 py-3 text-center font-semibold">Col 1</th>
                        <th className="px-4 py-3 text-center font-semibold">Col 2</th>
                        <th className="px-4 py-3 text-center font-semibold">Col 3</th>
                        <th className="px-4 py-3 text-center font-semibold">Col 4</th>
                        <th className="px-4 py-3 text-center font-semibold">Location</th>
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
                              {item.link ? (
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                                  {item.title}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : (
                                <span className="text-sm font-medium text-primary">{item.title}</span>
                              )}
                              {item.subtitle && <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>}
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-foreground">{item.col1 || "—"}</td>
                            <td className="px-4 py-3 text-center text-sm text-foreground">{item.col2 || "—"}</td>
                            <td className="px-4 py-3 text-center text-sm text-foreground">{item.col3 || "—"}</td>
                            <td className="px-4 py-3 text-center text-sm text-foreground">{item.col4 || "—"}</td>
                            <td className="px-4 py-3 text-center">
                              {item.location ? (
                                <Badge className="bg-primary text-primary-foreground text-[10px]">{item.location}</Badge>
                              ) : "—"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-4 py-12 text-center">
                            <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground">
                              {loading ? "Loading..." : "No data available yet. Admin will add content soon."}
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
              {/* Search & Filter */}
              <div className="border-2 border-primary/20 rounded-xl p-5">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  Search & Filter
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block flex items-center gap-1">
                      <Search className="h-3.5 w-3.5" /> Search
                    </label>
                    <Input
                      placeholder="Search companies..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Categories Nav */}
              <div className="border border-border rounded-xl p-5">
                <h3 className="font-bold text-foreground mb-3">Categories</h3>
                <div className="space-y-1">
                  {categories.map((cat) => {
                    const CatIcon = iconMap[cat.icon || "BookOpen"] || BookOpen;
                    return (
                      <Link
                        key={cat.id}
                        to={(cat.name.toLowerCase() === "list of ipo registrar" || cat.name.toLowerCase() === "registrar") 
                          ? "/list-of-ipo-registrar" 
                          : `/ipo-knowledge/${cat.slug}`}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${activeCategory?.id === cat.id
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "text-foreground/70 hover:bg-secondary hover:text-primary"
                          }`}
                      >
                        <CatIcon className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{cat.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-bold text-foreground text-lg mb-2">
                  Ready to Make the Big Leap? Go Public with a Mainboard IPO!
                </h3>
                <p className="text-sm text-muted-foreground mb-4">We can Help!</p>
                <Button asChild className="w-full bg-primary text-primary-foreground font-semibold">
                  <Link to="/contact">
                    CONTACT US <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default IPOKnowledge;
