import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { getImageUrl } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home, ChevronRight, Search, BookOpen, FileText, Scale,
  BarChart3, ArrowRight, ExternalLink, Phone, Mail,
} from "lucide-react";
import React from "react";

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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45 } }),
};

const IPOKnowledge = () => {
  const { slug } = useParams();
  const [categories, setCategories] = useState<KnowledgeCategory[]>([]);
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<KnowledgeCategory | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [bannerVideo, setBannerVideo] = useState<string | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`/api/banners?page=${encodeURIComponent(pathname)}`);
        if (res.ok) {
          const data = await res.json();
          const videoBanner = data.find((b: any) => b.video_url);
          if (videoBanner) setBannerVideo(videoBanner.video_url);
        }
      } catch (err) { console.error(err); }
    };
    fetchBanners();
  }, [pathname]);

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => {
    if (categories.length > 0) {
      const found = slug ? categories.find((c) => c.slug === slug) : categories[0];
      if (found) { setActiveCategory(found); fetchItems(found.id); }
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
    <div className="min-h-screen bg-[#F8FAFC]">
      <SEOHead
        title={activeCategory ? `${activeCategory.name} | IndiaIPO Knowledge Center` : "IPO Knowledge Center | IndiaIPO"}
        description={activeCategory?.description || "Complete IPO knowledge center — IPO process, registrars, sector lists, and regulatory guidance for Indian capital markets."}
        keywords={`${activeCategory?.name || "IPO Knowledge"}, IPO registrar list India, sector wise IPO list, SEBI regulations, IPO knowledge base`}
      />
      <Header />

      <main>
        {/* ── HERO ── */}
        <section className="bg-[#001529] py-14 relative overflow-hidden">
          {/* Background Video */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-30"
              src={getImageUrl(bannerVideo || "/uploads/video/ccvindia1.mp4")}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#001529]/80 via-[#001529]/40 to-[#001529]" />
          </div>

          <div className="absolute inset-0 pointer-events-none z-1">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
              style={{ background: "#f59e08", filter: "blur(80px)", transform: "translate(25%,-25%)" }} />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-6 flex-wrap">
              <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/90 font-semibold">{activeCategory?.name || "IPO Knowledge"}</span>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 bg-[#f59e08]/20 border border-[#f59e08]/30 rounded-full px-4 py-1.5 mb-5">
                <div className="w-2 h-2 rounded-full bg-[#f59e08]" />
                <span className="text-[#f59e08] text-xs font-black uppercase tracking-widest">Knowledge Center</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#f59e08]/20 flex items-center justify-center shrink-0">
                  <IconComponent className="h-7 w-7 text-[#f59e08]" />
                </div>
                {activeCategory?.name || "IPO Knowledge Center"}
              </h1>
              {activeCategory?.description && (
                <p className="text-white/65 max-w-3xl font-medium leading-relaxed">{activeCategory.description}</p>
              )}
            </motion.div>
          </div>
        </section>

        {/* ── MAIN ── */}
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Count + Search bar */}
              <div className="flex items-center gap-4 mb-5 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-7 rounded-full bg-[#f59e08]" />
                  <span className="font-black text-[#001529] text-sm">
                    Showing <span className="text-[#f59e08]">{filteredItems.length}</span> of {items.length} entries
                  </span>
                </div>
                <div className="relative flex-1 max-w-sm ml-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search entries…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#001529]/20 font-medium"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: "#001529" }}>
                        <th className="px-5 py-4 text-left text-[#f59e08] font-black text-xs uppercase tracking-widest">Title</th>
                        <th className="px-5 py-4 text-center text-[#f59e08] font-black text-xs uppercase tracking-widest">Col 1</th>
                        <th className="px-5 py-4 text-center text-[#f59e08] font-black text-xs uppercase tracking-widest">Col 2</th>
                        <th className="px-5 py-4 text-center text-[#f59e08] font-black text-xs uppercase tracking-widest">Col 3</th>
                        <th className="px-5 py-4 text-center text-[#f59e08] font-black text-xs uppercase tracking-widest">Col 4</th>
                        <th className="px-5 py-4 text-center text-[#f59e08] font-black text-xs uppercase tracking-widest">Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredItems.length > 0 ? (
                        filteredItems.map((item, idx) => (
                          <tr key={item.id}
                            className={`hover:bg-[#f59e08]/05 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}`}>
                            <td className="px-5 py-3.5">
                              {item.link ? (
                                <a href={item.link} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#001529] hover:text-[#f59e08] transition-colors">
                                  {item.title} <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : (
                                <span className="text-sm font-bold text-[#001529]">{item.title}</span>
                              )}
                              {item.subtitle && <p className="text-xs text-slate-400 mt-0.5 font-medium">{item.subtitle}</p>}
                            </td>
                            {[item.col1, item.col2, item.col3, item.col4].map((col, ci) => (
                              <td key={ci} className="px-5 py-3.5 text-center text-sm text-slate-600 font-medium">{col || "—"}</td>
                            ))}
                            <td className="px-5 py-3.5 text-center">
                              {item.location ? (
                                <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase"
                                  style={{ background: "rgba(245,158,8,0.1)", color: "#d97706", border: "1px solid rgba(245,158,8,0.25)" }}>
                                  {item.location}
                                </span>
                              ) : "—"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-16 text-center">
                            <FileText className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                            <p className="text-slate-400 font-semibold">
                              {loading ? "Loading…" : "No data available yet."}
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
            <div className="w-full lg:w-72 shrink-0 space-y-5">

              {/* Categories */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-slate-100" style={{ background: "#001529" }}>
                  <h3 className="font-black text-white text-sm uppercase tracking-widest flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#f59e08]" /> Categories
                  </h3>
                </div>
                <div className="p-3 space-y-1">
                  {categories.map((cat) => {
                    const CatIcon = iconMap[cat.icon || "BookOpen"] || BookOpen;
                    return (
                      <Link key={cat.id}
                        to={
                          cat.name.toLowerCase() === "list of ipo registrar" || cat.name.toLowerCase() === "registrar"
                            ? "/list-of-ipo-registrar"
                            : cat.name.toLowerCase() === "sector wise ipo list in india" || cat.slug === "sector-wise-ipo-list"
                              ? "/sector-wise-ipo"
                              : `/ipo-knowledge/${cat.slug}`
                        }
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          activeCategory?.id === cat.id
                            ? "text-[#001529] font-black"
                            : "text-slate-500 hover:text-[#001529] hover:bg-slate-50"
                        }`}
                        style={activeCategory?.id === cat.id
                          ? { background: "rgba(245,158,8,0.1)", border: "1px solid rgba(245,158,8,0.25)" }
                          : {}}>
                        <CatIcon className={`h-3.5 w-3.5 shrink-0 ${activeCategory?.id === cat.id ? "text-[#f59e08]" : "text-slate-400"}`} />
                        <span className="truncate">{cat.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* CTA Card */}
              <div className="bg-[#001529] rounded-2xl p-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
                  style={{ background: "#f59e08", filter: "blur(30px)", transform: "translate(30%,-30%)" }} />
                <h3 className="font-black text-white text-base mb-2 leading-tight">
                  Ready to Go Public?
                </h3>
                <p className="text-white/55 text-xs mb-5 leading-relaxed">
                  Our SEBI-registered advisors are ready to guide you through every step of your IPO journey.
                </p>
                <Link to="/contact"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-black text-[#001529] transition-all hover:scale-105 mb-3"
                  style={{ background: "linear-gradient(135deg, #f59e08, #d97706)", boxShadow: "0 4px 16px rgba(245,158,8,0.4)" }}>
                  CONTACT US <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="space-y-2 pt-3 border-t border-white/10">
                  <a href="mailto:info@indiaipo.in" className="flex items-center gap-2 text-white/60 text-xs hover:text-white transition-colors">
                    <Mail className="h-3.5 w-3.5 text-[#f59e08]" /> info@indiaipo.in
                  </a>
                  <a href="tel:+917428337280" className="flex items-center gap-2 text-white/60 text-xs hover:text-white transition-colors">
                    <Phone className="h-3.5 w-3.5 text-[#f59e08]" /> +91-74283-37280
                  </a>
                </div>
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
