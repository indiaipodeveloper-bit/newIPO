import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import {
  ExternalLink, MapPin, Search, TrendingUp, ArrowRight, Shield,
  Building2, Phone, CheckCircle, Award, Users, Globe, MessageSquare,
  Mail, X, ChevronLeft, ChevronRight, BarChart3, PieChart, LineChart,
  Home, Star, Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getImageUrl } from "@/lib/utils";

interface Banker {
  id: string;
  title: string;
  sub_title: string;
  slug: string;
  mcat_id: string | number;
  image: string;
  description: string;
  meta_title: string;
  meta_desc: string;
  meta_keywords: string;
  noOfiposofar: string;
  ipos: string;
  totalfundraised: string;
  avgiposize: string;
  avglisting_gain: string;
  avgsubscription: string;
  faqs: string;
  nseemer: string;
  bsesme: string;
  yearwise_ipolisting: string;
  sme_ipos_by_size: string;
  sme_ipos_by_subscription: string;
  cemail: string;
  cmobile: string;
  caddress: string;
  cweblink: string;
  created_at?: string;
  // Extra mapped fields from API
  logo_url?: string;
  name?: string;
  website?: string;
  location?: string;
  email?: string;
  phone?: string;
  total_ipos?: string | number;
  total_raised?: string | number;
  avg_size?: string | number;
  avg_subscription?: string | number;
  avg_listing_gain?: string | number;
}

const safeParseJSON = (str: string) => {
  if (!str) return [];
  try { return JSON.parse(str); } catch { return []; }
};

const N = "#001529";
const G = "#f59e08";
const G2 = "#d97706";

/* ─────── Connect Modal ─────── */
const ConnectModal = ({ banker, onClose }: { banker: Banker; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: 20 }}
      className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
      <div className="p-6 text-white relative" style={{ background: `linear-gradient(135deg, ${N}, #003380)` }}>
        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${N}, ${G}, ${N})` }} />
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/25 flex items-center justify-center hover:bg-white/10 transition-colors">
          <X className="w-4 h-4 text-white" />
        </button>
        <div className="w-16 h-16 rounded-xl bg-white mb-4 p-2 shadow-xl overflow-hidden">
          {banker.image ? (
            <img src={getImageUrl(banker.image)} alt={banker.title} className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-black text-2xl" style={{ color: N }}>
              {banker.title?.[0]}
            </div>
          )}
        </div>
        <h2 className="text-xl font-black mb-1">Connect with {banker.title}</h2>
        <p className="text-white/65 text-sm">Use the details below to reach out regarding your IPO journey.</p>
      </div>
      <div className="p-6 space-y-4">
        {[
          { icon: Mail, label: "Email Address", val: banker.cemail, href: `mailto:${banker.cemail}` },
          { icon: Phone, label: "Mobile Number", val: banker.cmobile, href: `tel:${banker.cmobile}` },
          { icon: MapPin, label: "Office Address", val: banker.caddress, href: null },
          { icon: Globe, label: "Website", val: banker.cweblink, href: banker.cweblink?.startsWith("http") ? banker.cweblink : banker.cweblink ? `https://${banker.cweblink}` : null },
        ].filter((item) => item.val).map((item, idx) => (
          <div key={idx} className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(0,21,41,0.06)" }}>
              <item.icon className="w-4 h-4" style={{ color: N }} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</p>
              {item.href ? (
                <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer" className="text-sm font-bold hover:text-[#f59e08] transition-colors" style={{ color: N }}>
                  {item.val}
                </a>
              ) : (
                <p className="text-sm font-medium text-slate-600 leading-relaxed">{item.val}</p>
              )}
            </div>
          </div>
        ))}
        <div className="pt-5 border-t border-slate-100">
          <Link to={`/merchant-contact?ipo_type=${banker.mcat_id === "SME" ? "SME IPO" : "Mainboard IPO"}&banker=${encodeURIComponent(banker.title)}`} className="block">
            <button className="w-full h-12 rounded-xl font-black transition-all hover:scale-105 shadow-lg text-sm"
              style={{ background: `linear-gradient(135deg, ${G}, ${G2})`, color: N, boxShadow: "0 4px 16px rgba(245,158,8,0.35)" }}>
              Contact Now
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
═══════════════════════════════════════════════════════════════ */
const MerchantBankersPage = ({ type }: { type: "SME" | "Mainboard" }) => {
  const isSME = type.toLowerCase() === "sme";
  const [bankers, setBankers] = useState<Banker[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 9;
  const [hasMore, setHasMore] = useState(false);
  const [detailBanker, setDetailBanker] = useState<Banker | null>(null);
  const [connectBanker, setConnectBanker] = useState<Banker | null>(null);
  const [bannerVideo, setBannerVideo] = useState<string | null>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`/api/banners?page=${encodeURIComponent(pathname)}`);
        if (res.ok) {
          const data = await res.json();
          // Find first banner that has a video_url
          const videoBanner = data.find((b: any) => b.video_url);
          if (videoBanner) setBannerVideo(videoBanner.video_url);
        }
      } catch (err) { console.error(err); }
    };
    fetchBanners();
  }, [pathname]);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 500);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (page === 1) setLoading(true); else setLoadingMore(true);
    const api = isSME ? "/api/bankers" : "/api/mainboard-bankers";
    fetch(`${api}?page=${page}&limit=${limit}&search=${encodeURIComponent(debouncedSearch)}`)
      .then((r) => r.json())
      .then((body) => {
        const data = body.data || [];
        if (page === 1) setBankers(data); else setBankers((p) => [...p, ...data]);
        setHasMore(body.pagination ? page < body.pagination.totalPages : false);
      })
      .catch(console.error)
      .finally(() => { setLoading(false); setLoadingMore(false); });
  }, [type, page, debouncedSearch]);

  const pageTitle = isSME ? "List of SME Merchant Bankers" : "List of Mainboard Merchant Bankers";

  /* ─── Fetch full detail by ID ─── */
  const fetchDetailBanker = async (bankerId: string | number) => {
    try {
      const api = isSME ? "/api/bankers" : "/api/mainboard-bankers";
      const res = await fetch(`${api}/${bankerId}`);
      if (res.ok) {
        const data = await res.json();
        setDetailBanker(data);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (e) { console.error(e); }
  };

  /* ══════════════════════════════════════════════════════
     DETAIL VIEW
  ══════════════════════════════════════════════════════ */
  if (detailBanker) {
    const yearwise = safeParseJSON(detailBanker.yearwise_ipolisting);
    const sizeData = safeParseJSON(detailBanker.sme_ipos_by_size);
    const subData = safeParseJSON(detailBanker.sme_ipos_by_subscription);
    const faqsData = safeParseJSON(detailBanker.faqs);
    const iposData = safeParseJSON(detailBanker.ipos);

    const hasDesc = detailBanker.description && detailBanker.description.trim().length > 10;

    const imgSrc = detailBanker.image
      ? (detailBanker.image.startsWith("http") ? detailBanker.image : (window.location.origin + (detailBanker.image.startsWith("/") ? "" : "/") + detailBanker.image))
      : detailBanker.logo_url
        ? (detailBanker.logo_url.startsWith("http") ? detailBanker.logo_url : window.location.origin + detailBanker.logo_url)
        : null;

    const webUrl = (w: string | undefined) => !w ? "#" : w.startsWith("http") ? w : `https://${w}`;

    const SecHdr = ({ icon: Icon, label }: { icon: any; label: string }) => (
      <div className="flex items-center gap-3 px-5 py-4" style={{ background: N }}>
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
          <Icon className="w-4 h-4" style={{ color: G }} />
        </div>
        <h3 className="font-black text-sm uppercase tracking-widest text-white">{label}</h3>
      </div>
    );

    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#F8FAFC" }}>
        <style>{`
          .bd p{margin-bottom:1rem;color:#475569;line-height:1.8;font-size:.95rem;font-weight:500}
          .bd h2,.bd h3,.bd h4{color:#001529;font-weight:900;margin:1.2rem 0 .5rem}
          .bd h2{font-size:1.3rem;border-bottom:2px solid #f59e08;padding-bottom:.4rem}
          .bd ul{list-style:none;padding:0;margin:.8rem 0}
          .bd ul li{display:flex;align-items:flex-start;gap:.5rem;margin-bottom:.4rem;color:#475569;font-size:.9rem}
          .bd ul li::before{content:'';width:6px;height:6px;border-radius:50%;background:#f59e08;flex-shrink:0;margin-top:.4rem}
          .bd a{color:#001529;text-decoration:underline;text-decoration-color:#f59e08;font-weight:600}
          .bd strong,.bd b{color:#001529;font-weight:700}
          .bd img{max-width:100%;border-radius:1rem;margin:1rem 0;box-shadow:0 4px 20px rgba(0,0,0,.1)}
          .bd table{width:100%;border-collapse:collapse;margin:1rem 0}
          .bd th{background:#001529;color:#f59e08;padding:.5rem 1rem;text-align:left;font-size:.8rem;font-weight:800}
          .bd td{border:1px solid #e2e8f0;padding:.5rem 1rem;color:#475569;font-size:.85rem}
        `}</style>

        <SEOHead
          title={`${detailBanker.meta_title || detailBanker.title} | IndiaIPO Merchant Banker`}
          description={detailBanker.meta_desc || detailBanker.description?.replace(/<[^>]*>?/gm, "").substring(0, 160)}
          keywords={detailBanker.meta_keywords || "Merchant Banker, SME IPO, BRLM India"}
        />
        <Header />
        <main className="flex-1">

          {/* ── HERO ── */}
          <div className="pt-14 pb-28 px-4 relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${N} 0%, #002147 55%, #003380 100%)` }}>
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-5"
                style={{ background: G, filter: "blur(100px)", transform: "translate(25%,-25%)" }} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1"
              style={{ background: `linear-gradient(90deg, ${N}, ${G}, ${N})` }} />

            <div className="container mx-auto px-4 relative z-10">
              <button onClick={() => setDetailBanker(null)}
                className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors group">
                <div className="w-8 h-8 rounded-full border border-white/25 flex items-center justify-center group-hover:bg-white/10">
                  <ChevronLeft className="h-4 w-4" />
                </div>
                Back to Directory
              </button>

              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-2xl bg-white flex items-center justify-center p-3 shadow-2xl shrink-0 border-4 border-white/10 overflow-hidden">
                  {imgSrc ? (
                    <img src={imgSrc} alt={detailBanker.title} className="w-full h-full object-contain"
                      onError={(e: any) => { e.target.style.display = "none"; }} />
                  ) : (
                    <span className="text-5xl font-black" style={{ color: N }}>{detailBanker.title?.[0]}</span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 text-xs font-black uppercase tracking-widest"
                    style={{ background: "rgba(245,158,8,0.2)", color: G, border: "1px solid rgba(245,158,8,0.35)" }}>
                    <Shield className="h-3 w-3" /> SEBI Registered Merchant Banker
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight">{detailBanker.title}</h1>
                  {detailBanker.sub_title && (
                    <p className="text-white/65 text-base font-semibold mb-5">{detailBanker.sub_title}</p>
                  )}
                  <div className="flex gap-3 flex-wrap">
                    <button onClick={() => setConnectBanker(detailBanker)}
                      className="flex items-center gap-2 px-6 h-11 rounded-xl font-black text-sm transition-all hover:scale-105 shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${G}, ${G2})`, color: N }}>
                      <Mail className="w-4 h-4" /> Connect Now
                    </button>
                    {(detailBanker.cweblink || detailBanker.website) && (
                      <a href={webUrl(detailBanker.cweblink || detailBanker.website)}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 h-11 rounded-xl font-black text-sm text-white border border-white/25 hover:bg-white/10 transition-all">
                        <Globe className="w-4 h-4" /> Visit Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 -mt-14 relative z-20 pb-20">

            {/* ── STATS STRIP ── */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 mb-8 overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                {[
                  { label: "Total IPOs", value: detailBanker.noOfiposofar || detailBanker.total_ipos || "—" },
                  { label: "Total Fund Raised(CR)", value: detailBanker.totalfundraised || detailBanker.total_raised || "—" },
                  { label: "Avg IPO Size(CR)", value: detailBanker.avgiposize || detailBanker.avg_size || "—" },
                  { label: "Avg Subscription", value: detailBanker.avgsubscription + "x" || detailBanker.avg_subscription || "—" },
                ].map((s, i) => (
                  <div key={i} className="flex flex-col items-center text-center py-6 px-4">
                    <p className="text-2xl md:text-3xl font-black mb-1" style={{ color: i % 2 === 0 ? N : G2 }}>{s.value}</p>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* ── LEFT MAIN (2/3) ── */}
              <div className="lg:col-span-2 space-y-6">

                {/* About / Description */}
                {hasDesc && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <SecHdr icon={Building2} label="About this Merchant Banker" />
                    <div className="p-6 bd" dangerouslySetInnerHTML={{ __html: detailBanker.description }} />
                  </div>
                )}

                {/* Exchange Distribution */}
                {(detailBanker.nseemer || detailBanker.bsesme) && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <SecHdr icon={Building2} label="IPO Listing by Exchange" />
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl p-6 text-center" style={{ background: "rgba(0,21,41,0.05)", border: "1px solid rgba(0,21,41,0.1)" }}>
                          <p className="text-4xl font-black mb-1" style={{ color: N }}>{detailBanker.nseemer || "—"}</p>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">NSE Emerge</p>
                        </div>
                        <div className="rounded-xl p-6 text-center" style={{ background: "rgba(245,158,8,0.08)", border: "1px solid rgba(245,158,8,0.2)" }}>
                          <p className="text-4xl font-black mb-1" style={{ color: G2 }}>{detailBanker.bsesme || "—"}</p>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">BSE SME</p>
                        </div>
                      </div>
                      {detailBanker.avglisting_gain && (
                        <div className="mt-4 p-4 rounded-xl text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
                          <p className="text-2xl font-black" style={{ color: "#16a34a" }}>{detailBanker.avglisting_gain}</p>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Avg Listing Gain</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Year-wise Table */}
                {yearwise.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <SecHdr icon={LineChart} label="Year-wise IPO Listing" />
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr style={{ background: "#F8FAFC" }}>
                            <th className="px-5 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-500">Year</th>
                            <th className="px-5 py-3 text-center text-xs font-black uppercase tracking-widest text-slate-500">IPOs</th>
                            {yearwise[0]?.amount !== undefined && <th className="px-5 py-3 text-right text-xs font-black uppercase tracking-widest text-slate-500">Amount</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {yearwise.map((item: any, idx: number) => (
                            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}>
                              <td className="px-5 py-3 font-black text-sm" style={{ color: N }}>
                                {item.year || item.label || `Year ${idx + 1}`}
                              </td>
                              <td className="px-5 py-3 text-center">
                                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-black"
                                  style={{ background: "rgba(245,158,8,0.12)", color: G2 }}>
                                  {item.count || item.value || item.ipos || item.no_of_ipos || 0} IPOs
                                </span>
                              </td>
                              {item.amount !== undefined && (
                                <td className="px-5 py-3 text-right font-bold text-sm text-slate-600">{item.amount}</td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Subscription Table */}
                {subData.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <SecHdr icon={PieChart} label="IPOs by Subscription Rate" />
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr style={{ background: "#F8FAFC" }}>
                            <th className="px-5 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-500">Category</th>
                            <th className="px-5 py-3 text-right text-xs font-black uppercase tracking-widest text-slate-500">Count / Rate</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {subData.map((item: any, idx: number) => {
                            const colors = [N, G2, "#0369a1", "#15803d", "#7c3aed", "#dc2626"];
                            return (
                              <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}>
                                <td className="px-5 py-3 font-semibold text-sm text-slate-700">
                                  {item.title || item.category || item.label || `Category ${idx + 1}`}
                                </td>
                                <td className="px-5 py-3 text-right">
                                  <span className="font-black text-sm" style={{ color: colors[idx % colors.length] }}>
                                    {item.subscription || item.count || item.value || "—"}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Size Table */}
                {sizeData.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <SecHdr icon={BarChart3} label="IPOs by Size Category" />
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr style={{ background: "#F8FAFC" }}>
                            <th className="px-5 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-500">Size Range</th>
                            <th className="px-5 py-3 text-right text-xs font-black uppercase tracking-widest text-slate-500">No. of IPOs</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {sizeData.map((item: any, idx: number) => (
                            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}>
                              <td className="px-5 py-3 font-semibold text-sm text-slate-700">
                                {item.title || item.label || item.category || `Range ${idx + 1}`}
                              </td>
                              <td className="px-5 py-3 text-right">
                                <span className="font-black text-sm" style={{ color: N }}>
                                  {item.size || item.count || item.value || "—"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Recent IPOs */}
                {iposData.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <SecHdr icon={Star} label="Recent / Notable IPOs Managed" />
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr style={{ background: "#F8FAFC" }}>
                            <th className="px-5 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-500">#</th>
                            <th className="px-5 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-500">Company / IPO</th>
                            {iposData[0]?.year && <th className="px-5 py-3 text-center text-xs font-black uppercase tracking-widest text-slate-500">Year</th>}
                            {iposData[0]?.size && <th className="px-5 py-3 text-right text-xs font-black uppercase tracking-widest text-slate-500">Size</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {iposData.slice(0, 15).map((ipo: any, idx: number) => (
                            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}>
                              <td className="px-5 py-3 text-xs font-black text-slate-400">{idx + 1}</td>
                              <td className="px-5 py-3 font-semibold text-sm" style={{ color: N }}>
                                {ipo.company || ipo.name || ipo.title || `IPO ${idx + 1}`}
                              </td>
                              {ipo.year && <td className="px-5 py-3 text-center text-xs text-slate-500 font-semibold">{ipo.year}</td>}
                              {ipo.size && <td className="px-5 py-3 text-right font-black text-sm" style={{ color: G2 }}>{ipo.size}</td>}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* FAQs */}
                {faqsData.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <SecHdr icon={MessageSquare} label="Frequently Asked Questions" />
                    <div className="p-2">
                      <Accordion type="single" collapsible className="w-full">
                        {faqsData.map((faq: any, idx: number) => (
                          <AccordionItem key={idx} value={`faq-${idx}`} className="border-b border-slate-100 last:border-0">
                            <AccordionTrigger className="px-4 py-4 text-left font-black text-sm hover:text-[#f59e08] transition-colors" style={{ color: N }}>
                              {faq.question || faq.q || "Question?"}
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4 text-slate-500 text-sm leading-relaxed font-medium">
                              {faq.answer || faq.a || "Answer goes here."}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </div>
                )}
              </div>

              {/* ── RIGHT SIDEBAR (1/3) ── */}
              <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
                  <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${N}, ${G})` }} />
                  <div className="p-6">
                    <h3 className="font-black text-base mb-5" style={{ color: N }}>Contact Details</h3>
                    <div className="space-y-4">
                      {(detailBanker.cemail || detailBanker.email) && (
                        <a href={`mailto:${detailBanker.cemail || detailBanker.email}`} className="flex items-center gap-3 group">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(0,21,41,0.06)" }}>
                            <Mail className="h-4 w-4" style={{ color: N }} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Email</p>
                            <p className="text-sm font-semibold break-all group-hover:text-[#f59e08] transition-colors" style={{ color: N }}>
                              {detailBanker.cemail || detailBanker.email}
                            </p>
                          </div>
                        </a>
                      )}
                      {(detailBanker.cmobile || detailBanker.phone) && (
                        <a href={`tel:${detailBanker.cmobile || detailBanker.phone}`} className="flex items-center gap-3 group">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(245,158,8,0.08)" }}>
                            <Phone className="h-4 w-4" style={{ color: G2 }} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Phone</p>
                            <p className="text-sm font-semibold group-hover:text-[#f59e08] transition-colors" style={{ color: N }}>
                              {detailBanker.cmobile || detailBanker.phone}
                            </p>
                          </div>
                        </a>
                      )}
                      {(detailBanker.caddress || detailBanker.location) && (
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(0,21,41,0.06)" }}>
                            <MapPin className="h-4 w-4" style={{ color: N }} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Address</p>
                            <p className="text-sm font-medium text-slate-600 leading-relaxed">
                              {detailBanker.caddress || detailBanker.location}
                            </p>
                          </div>
                        </div>
                      )}
                      {(detailBanker.cweblink || detailBanker.website) && (
                        <a href={webUrl(detailBanker.cweblink || detailBanker.website)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(0,21,41,0.06)" }}>
                            <Globe className="h-4 w-4" style={{ color: N }} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Website</p>
                            <p className="text-sm font-semibold group-hover:text-[#f59e08] transition-colors truncate max-w-[160px]" style={{ color: N }}>
                              {detailBanker.cweblink || detailBanker.website}
                            </p>
                          </div>
                        </a>
                      )}
                    </div>

                    <button onClick={() => setConnectBanker(detailBanker)}
                      className="flex items-center justify-center gap-2 w-full h-12 rounded-xl font-black text-sm mt-6 transition-all hover:scale-105"
                      style={{ background: `linear-gradient(135deg, ${N}, #003380)`, color: "white", boxShadow: "0 4px 16px rgba(0,21,41,0.3)" }}>
                      <Mail className="h-4 w-4" /> Send Enquiry
                    </button>
                  </div>

                  {/* Quick summary */}
                  <div className="border-t border-slate-100 p-6">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Quick Summary</p>
                    <div className="space-y-3">
                      {[
                        { label: "Total IPOs", val: detailBanker.noOfiposofar || detailBanker.total_ipos },
                        { label: "Fund Raised", val: detailBanker.totalfundraised || detailBanker.total_raised },
                        { label: "Avg IPO Size", val: detailBanker.avgiposize || detailBanker.avg_size },
                        { label: "Avg Subscription", val: detailBanker.avgsubscription || detailBanker.avg_subscription },
                        { label: "Avg Listing Gain", val: detailBanker.avglisting_gain || detailBanker.avg_listing_gain },
                        { label: "NSE Emerge", val: detailBanker.nseemer },
                        { label: "BSE SME", val: detailBanker.bsesme },
                      ].filter(s => s.val && String(s.val).trim() && String(s.val) !== "0").map((s, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-400">{s.label}</span>
                          <span className="text-xs font-black" style={{ color: N }}>{s.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: N }}>
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
                    style={{ background: G, filter: "blur(30px)", transform: "translate(30%,-30%)" }} />
                  <Award className="h-8 w-8 mb-3" style={{ color: G }} />
                  <h4 className="font-black text-white text-base mb-2">Planning Your IPO?</h4>
                  <p className="text-white/55 text-xs mb-4 leading-relaxed">Connect with top SEBI-registered merchant bankers for a seamless IPO journey.</p>
                  <Link to="/ipo-feasibility"
                    className="flex items-center justify-center gap-2 w-full h-10 rounded-xl font-black text-xs transition-all hover:scale-105"
                    style={{ background: `linear-gradient(135deg, ${G}, ${G2})`, color: N }}>
                    Check IPO Feasibility <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>

        <AnimatePresence>
          {connectBanker && <ConnectModal banker={connectBanker} onClose={() => setConnectBanker(null)} />}
        </AnimatePresence>
        <Footer />
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════
     LISTING VIEW
  ══════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F8FAFC" }}>
      <SEOHead
        title={`${pageTitle} | IndiaIPO — SEBI Registered Bankers Directory`}
        description={`Complete directory of ${isSME ? "SME" : "Mainboard"} merchant bankers in India with IPO stats, contact details, and performance data.`}
        keywords={`${pageTitle}, SEBI registered, IPO merchant bankers, BRLM India, ${isSME ? "BSE SME NSE Emerge" : "NSE BSE mainboard"} IPO lead manager`}
      />
      <Header />
      <main className="flex-grow">

        {/* ── HERO ── */}
        <section className="py-16 lg:py-24 relative overflow-hidden bg-[#001529]">
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

          <div className="absolute inset-0 pointer-events-none overflow-hidden z-1">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-5"
              style={{ background: G, filter: "blur(100px)", transform: "translate(25%,-25%)" }} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 z-10"
            style={{ background: `linear-gradient(90deg, ${N}, ${G}, ${N})` }} />

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-8 flex-wrap justify-center">
              <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/90 font-semibold">{isSME ? "SME" : "Mainboard"} Merchant Bankers</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 text-xs font-black uppercase tracking-widest"
                style={{ background: "rgba(245,158,8,0.2)", color: G, border: "1px solid rgba(245,158,8,0.35)" }}>
                <Shield className="h-3.5 w-3.5" /> SEBI Registered Merchant Bankers
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
                {isSME ? "SME" : "Mainboard"} <span style={{ color: G }}>Merchant Bankers</span>
              </h1>
              <p className="text-white/65 max-w-2xl mx-auto mb-8 text-base md:text-lg font-medium leading-relaxed">
                {isSME
                  ? "Explore the exhaustive directory of SEBI-registered Merchant Bankers for SME IPOs on BSE SME & NSE Emerge."
                  : "India's top SEBI-registered Merchant Bankers for Mainline IPO advisory and book running."}
              </p>

              <div className="max-w-xl mx-auto relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  placeholder="Search by merchant banker name or keywords…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm font-medium focus:outline-none focus:bg-white/15 focus:border-[#f59e08]/50 transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <Link to={isSME ? "/merchant-bankers/mainboard-list" : "/merchant-bankers/sme"}
                  className="flex items-center gap-2 px-6 h-11 rounded-xl font-black text-sm text-white border border-white/25 hover:bg-white/10 transition-all">
                  View {isSME ? "Mainboard" : "SME"} Bankers <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/ipo-feasibility"
                  className="flex items-center gap-2 px-6 h-11 rounded-xl font-black text-sm transition-all hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${G}, ${G2})`, color: N }}>
                  <Zap className="h-4 w-4" /> Check IPO Feasibility
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── TRUST STATS ── */}
        <section style={{ background: `linear-gradient(135deg, ${N}, #003380)` }} className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, value: "100+", label: isSME ? "SME Bankers" : "Mainboard Bankers" },
                { icon: Shield, value: "100%", label: "SEBI Registered" },
                { icon: TrendingUp, value: "25+ Yrs", label: "Track Record" },
                { icon: Award, value: isSME ? "1000+" : "500+", label: isSME ? "SME IPOs" : "Mainboard IPOs" },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center text-center py-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-2">
                    <s.icon className="h-5 w-5" style={{ color: G }} />
                  </div>
                  <p className="text-xl font-black text-white mb-0.5">{s.value}</p>
                  <p className="text-xs text-white/55 font-semibold uppercase tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CARDS ── */}
        <section className="py-14">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 rounded-full" style={{ background: G }} />
              <h2 className="text-2xl font-black" style={{ color: N }}>{pageTitle}</h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200 h-72 animate-pulse" />
                ))}
              </div>
            ) : bankers.length === 0 ? (
              <div className="bg-white text-center py-24 rounded-2xl border-2 border-dashed border-slate-200">
                <Building2 className="w-14 h-14 mx-auto mb-4 text-slate-200" />
                <h3 className="text-xl font-black mb-2" style={{ color: N }}>No merchant bankers found</h3>
                <p className="text-slate-400 font-medium">Try adjusting your search criteria.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bankers.map((banker, i) => (
                    <motion.div key={banker.id}
                      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (i % limit) * 0.05 }}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all cursor-pointer group flex flex-col"
                      onClick={() => fetchDetailBanker(banker.id)}>
                      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${N}, ${G})` }} />

                      <div className="p-5 flex gap-4 items-start">
                        <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-2 shrink-0 shadow-sm group-hover:border-[#f59e08]/40 transition-colors overflow-hidden">
                          {banker.image ? (
                            <img src={getImageUrl(banker.image)} alt={banker.title} className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-2xl font-black" style={{ color: N }}>{banker.title?.[0]}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-black leading-snug line-clamp-2 transition-colors group-hover:text-[#f59e08]"
                            style={{ color: N }}>{banker.title}</h3>
                          {banker.sub_title && (
                            <span className="inline-block mt-1.5 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest"
                              style={{ background: "rgba(245,158,8,0.12)", color: G2 }}>
                              {banker.sub_title}
                            </span>
                          )}
                        </div>
                      </div>


                      <div className="grid grid-cols-4 gap-0 mx-5 mb-5 rounded-xl overflow-hidden border border-slate-100"
                        style={{ background: "#F8FAFC" }}>
                        {[
                          { val: banker.noOfiposofar || "0", lbl: "IPOs", c: N },
                          { val: banker.totalfundraised || "₹0", lbl: "Raised", c: G2 },
                          { val: banker.avgiposize || "NA", lbl: "Avg Sz", c: N },
                          { val: banker.avgsubscription || "0x", lbl: "Avg Sub", c: G2 },
                        ].map((s, si) => (
                          <div key={si} className="py-3 text-center border-r border-slate-100 last:border-r-0">
                            <p className="text-sm font-black" style={{ color: s.c }}>{s.val}</p>
                            <p className="text-[9px] text-slate-400 uppercase font-black mt-0.5 tracking-widest">{s.lbl}</p>
                          </div>
                        ))}
                      </div>

                      <div className="px-5 pb-5 mt-auto flex gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); fetchDetailBanker(banker.id); }}
                          className="flex-1 h-10 rounded-xl font-black text-xs border transition-all  hover:text-white"
                          style={{ borderColor: "rgba(0,21,41,0.2)", color: N }}>
                          View Details
                        </button>
                        <button
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            navigate(`/merchant-contact?ipo_type=${isSME ? "SME IPO" : "Mainboard IPO"}&banker=${encodeURIComponent(banker.title)}`);
                          }}
                          className="flex-1 h-10 rounded-xl font-black text-xs transition-all hover:scale-105"
                          style={{ background: `linear-gradient(135deg, ${G}, ${G2})`, color: N, boxShadow: "0 4px 12px rgba(245,158,8,0.3)" }}>
                          Connect
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-12 text-center">
                    <button onClick={() => setPage((p) => p + 1)} disabled={loadingMore}
                      className="inline-flex items-center gap-2 px-10 h-14 rounded-xl font-black text-base text-white transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ background: `linear-gradient(135deg, ${N}, #003380)`, boxShadow: "0 8px 32px rgba(0,21,41,0.25)" }}>
                      {loadingMore ? (
                        <><div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> Loading…</>
                      ) : (
                        <>Load More Bankers <ChevronRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${N}, #002147, #003380)` }}>
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 pointer-events-none"
            style={{ background: G, filter: "blur(80px)", transform: "translate(20%,-30%)" }} />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to <span style={{ color: G }}>Go Public?</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto font-medium mb-10 text-base leading-relaxed">
              Our team of SEBI-registered advisors and merchant bankers will guide you through every step of your IPO journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact"
                className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${G}, ${G2})`, color: N, boxShadow: "0 8px 32px rgba(245,158,8,0.35)" }}>
                Get Free Consultation <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/ipo-feasibility"
                className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base text-white border border-white/25 hover:bg-white/10 transition-all">
                Check Feasibility
              </Link>
            </div>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {connectBanker && <ConnectModal banker={connectBanker} onClose={() => setConnectBanker(null)} />}
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export const SMEMerchantBankers = () => <MerchantBankersPage type="SME" />;
export const MainboardMerchantBankers = () => <MerchantBankersPage type="Mainboard" />;

const MerchantBankersRoute = () => {
  const { category } = useParams<{ category: string }>();
  const normalizedCategory = category?.toLowerCase() === "mainboard" ? "Mainboard" : "SME";
  return <MerchantBankersPage type={normalizedCategory} />;
};
export default MerchantBankersRoute;
