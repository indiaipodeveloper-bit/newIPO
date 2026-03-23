import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2, Calendar, TrendingUp, IndianRupee, ArrowLeft,
  Download, FileText, Info, BarChart3, Activity, Wallet,
  CheckCircle2, HelpCircle, Star, Shield
} from "lucide-react";

interface AdminBlogFull {
  id: string; title: string; slug: string;
  image: string; content: string; faqs: string; status: string;
  confidential: string; upcoming: string; category: string;
  new_highlight_text: string; gmp_date: string; gmp_ipo_price: string;
  gmp: string; gmp_last_updated: string;
  ipo_details: string; ipo_description: string;
  ipo_timeline_details: string; ipo_timeline_description: string;
  ipo_lots_application: string; ipo_lots: string;
  ipo_lots_share: string; ipo_lots_amount: string;
  promotor_hold_pre_issue: string; promotor_hold_post_issue: string;
  finantial_information_ended: string; finantial_information_assets: string;
  finantial_information_revenue: string; finantial_information_profit_tax: string;
  financial_info_reserves_surplus: string; finantial_information_networth: string;
  finantial_information_borrowing: string;
  key_kpi: string; key_value: string; key_pri_ipo_eps: string;
  key_pos_ipo_eps: string; key_pre_ipo_pe: string; key_post_ipo_pe: string;
  competative_strenght: string;
  meta_title: string; description: string; keyword: string;
  rhp: string; drhp: string; confidential_drhp: string;
  created_at: string;
}

const isValid = (val: any) => {
  if (val === null || val === undefined) return false;
  const s = String(val).trim().toLowerCase();
  return s !== "null" && s !== "[null]" && s !== "" && s !== "undefined" && s !== "[]" && s !== "[\"null\"]";
};

const cleanGarbledText = (text: string) => {
  if (!text) return "";
  const s = String(text);
  if (s.toLowerCase() === "null" || s.toLowerCase() === "[null]" || s === "undefined" || s === "[]" || s === "[\"null\"]") return "";
  return s
    .replace(/\\u20b9/g, "₹")
    .replace(/\\u20b5/g, "₹")
    .replace(/&nbsp;/g, " ")
    .replace(/\["null"\]/g, "")
    .trim();
};

const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '').trim();
};

const parseArrayData = (data: any): string[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data.filter(d => d && String(d).toLowerCase() !== "null").map(d => cleanGarbledText(String(d)));
  const s = String(data).trim();
  if (s === "" || s.toLowerCase() === "null" || s === "[]") return [];
  if (s.startsWith('[') && s.endsWith(']')) {
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) {
        return parsed.filter(d => d && String(d).toLowerCase() !== "null").map(d => cleanGarbledText(String(d)));
      }
    } catch (e) {}
  }
  if (s.includes(",")) {
    return s.split(",").map(item => cleanGarbledText(item.trim())).filter(item => item !== "");
  }
  return [cleanGarbledText(s)];
};

const IPOBlogDetails = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<AdminBlogFull | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/admin-blogs/${slug}`);
        if (res.ok) { const data = await res.json(); setBlog(data); }
        else setBlog(null);
      } catch (err) { console.error("Failed to fetch IPO blog:", err); }
      finally { setLoading(false); }
    };
    if (slug) fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground animate-pulse">Loading IPO Insights...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Post Not Found</h2>
          <p className="text-muted-foreground mb-8">The IPO blog you're looking for does not exist or has been removed.</p>
          <Button asChild><Link to="/ipo-blogs"><ArrowLeft className="w-4 h-4 mr-2" /> Back to IPO Blogs</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const timelineLabels = parseArrayData(blog.ipo_timeline_details);
  const timelineDates = parseArrayData(blog.ipo_timeline_description);
  const lots = parseArrayData(blog.ipo_lots);
  const lotShares = parseArrayData(blog.ipo_lots_share);
  const lotAmounts = parseArrayData(blog.ipo_lots_amount);
  const kpiNames = parseArrayData(blog.key_kpi);
  const kpiValues = parseArrayData(blog.key_value);
  const strengths = parseArrayData(blog.competative_strenght);
  const ipoDescItems = parseArrayData(blog.ipo_description);

  const gmpPrice = cleanGarbledText(String(parseArrayData(blog.gmp_ipo_price)[0] || blog.gmp_ipo_price || ""));
  const latestGmp = cleanGarbledText(String(parseArrayData(blog.gmp)[0] || blog.gmp || ""));
  const gmpDate = cleanGarbledText(String(parseArrayData(blog.gmp_date)[0] || blog.gmp_date || ""));
  const gmpUpdated = cleanGarbledText(String(parseArrayData(blog.gmp_last_updated)[0] || blog.gmp_last_updated || ""));
  const revenue = cleanGarbledText(String(parseArrayData(blog.finantial_information_revenue)[0] || blog.finantial_information_revenue || ""));
  const profit = cleanGarbledText(String(parseArrayData(blog.finantial_information_profit_tax)[0] || blog.finantial_information_profit_tax || ""));
  const networth = cleanGarbledText(String(parseArrayData(blog.finantial_information_networth)[0] || blog.finantial_information_networth || ""));
  const borrowing = cleanGarbledText(String(parseArrayData(blog.finantial_information_borrowing)[0] || blog.finantial_information_borrowing || ""));
  const preHolding = cleanGarbledText(String(parseArrayData(blog.promotor_hold_pre_issue)[0] || blog.promotor_hold_pre_issue || ""));
  const postHolding = cleanGarbledText(String(parseArrayData(blog.promotor_hold_post_issue)[0] || blog.promotor_hold_post_issue || ""));
  const preEps = cleanGarbledText(blog.key_pri_ipo_eps || "");
  const postEps = cleanGarbledText(blog.key_pos_ipo_eps || "");
  const prePe = cleanGarbledText(blog.key_pre_ipo_pe || "");
  const postPe = cleanGarbledText(blog.key_post_ipo_pe || "");

  const isUpcoming = blog.upcoming === "1";
  const statusColor = isUpcoming ? "from-orange-500 to-amber-500" : "from-emerald-500 to-teal-600";

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f8]">
      <SEOHead
        title={stripHtml(blog.meta_title) || `${stripHtml(blog.title)} - IndiaIPO`}
        description={stripHtml(blog.description) || `Read details and updates about ${stripHtml(blog.title)}`}
        ogImage={blog.image}
      />
      <Header />

      {/* ─── HERO BANNER ─────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0f172a] overflow-hidden">
        {/* Decorative */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
        </div>
        {isValid(blog.image) && (
          <div className="absolute inset-0">
            <img src={blog.image} alt="" className="w-full h-full object-cover opacity-10" />
          </div>
        )}

        <div className="relative container mx-auto px-4 py-10 lg:py-14">
          <Link to="/ipo-blogs" className="inline-flex items-center gap-1.5 text-blue-300 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to IPO Blogs
          </Link>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left: Main Info */}
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-flex items-center gap-1.5 text-white text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${statusColor}`}>
                  {isUpcoming ? "⏳ UPCOMING IPO" : "✅ CURRENT IPO"}
                </span>
                <span className="inline-flex items-center gap-1.5 text-blue-200 text-xs font-bold px-3 py-1 rounded-full bg-white/10 border border-white/10">
                  {(blog.category || 'IPO').replace(/_/g, ' ').toUpperCase()}
                </span>
                {blog.confidential === "1" && (
                  <span className="inline-flex items-center gap-1 text-red-300 text-xs font-bold px-3 py-1 rounded-full bg-red-500/20 border border-red-400/30">
                    <Shield className="w-3 h-3" /> CONFIDENTIAL
                  </span>
                )}
                {isValid(blog.new_highlight_text) && (
                  <span className="inline-flex items-center gap-1 text-purple-200 text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30">
                    <Star className="w-3 h-3" /> {blog.new_highlight_text}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                {blog.title}
              </h1>

              {(isValid(blog.description) || isValid(blog.ipo_details)) && (
                <p className="text-blue-200/80 text-sm md:text-base leading-relaxed max-w-2xl">
                  {stripHtml(cleanGarbledText(isValid(blog.description) ? blog.description : blog.ipo_details)).substring(0, 200)}
                  {stripHtml(cleanGarbledText(isValid(blog.description) ? blog.description : blog.ipo_details)).length > 200 ? '...' : ''}
                </p>
              )}

              {/* Key Metrics Row */}
              <div className="flex flex-wrap gap-6 mt-6">
                {isValid(gmpPrice) && (
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-blue-300" />
                    <div>
                      <p className="text-[10px] text-blue-400 uppercase font-bold tracking-widest">Price Band</p>
                      <p className="text-white font-black text-lg leading-none">{gmpPrice}</p>
                    </div>
                  </div>
                )}
                {isValid(latestGmp) && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-widest">Latest GMP</p>
                      <p className="text-emerald-300 font-black text-lg leading-none">{latestGmp}</p>
                    </div>
                  </div>
                )}
                {isValid(gmpDate) && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-300" />
                    <div>
                      <p className="text-[10px] text-indigo-300 uppercase font-bold tracking-widest">IPO Date</p>
                      <p className="text-white font-black text-lg leading-none">{gmpDate}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Image Card */}
            {isValid(blog.image) && (
              <div className="lg:w-72 shrink-0">
                <div className="rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
                  <img src={blog.image} alt={blog.title} className="w-full h-52 object-cover" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── CONTENT ─────────────────────────────────────────────── */}
      <main className="flex-1 container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Main Column */}
          <div className="lg:col-span-8 space-y-6">

            {/* ── IPO Details Table ── */}
            {ipoDescItems.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <Info className="w-5 h-5 text-blue-600" />
                  <h2 className="text-base font-black text-slate-800">IPO Overview</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody>
                      {ipoDescItems.map((item, idx) => {
                        const parts = item.split(/[:–-](.+)/);
                        const key = parts.length > 1 ? parts[0].trim() : `Detail ${idx + 1}`;
                        const val = parts.length > 1 ? parts.slice(1).join("").trim() : item;
                        return (
                          <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                            <td className="py-3 px-6 font-semibold text-slate-500 w-2/5 border-b border-slate-100">{key}</td>
                            <td className="py-3 px-6 font-bold text-slate-800 border-b border-slate-100">{val}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Main HTML Content ── */}
            {isValid(blog.content) && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h2 className="text-base font-black text-slate-800">About {blog.title}</h2>
                </div>
                <div className="p-6 md:p-8">
                  <div
                    className="prose prose-slate max-w-none prose-headings:font-black prose-h1:text-2xl prose-h2:text-xl prose-h1:text-slate-900 prose-p:text-slate-600 prose-a:text-blue-600 prose-strong:text-slate-800"
                    dangerouslySetInnerHTML={{ __html: cleanGarbledText(blog.content) }}
                  />
                </div>
              </div>
            )}

            {/* ── Financial Summary Table ── */}
            {isValid(blog.finantial_information_assets) && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base font-black text-slate-800">Financial Highlights</h2>
                </div>
                <div className="p-6">
                  {/* Key financial metrics comparison */}
                  {(isValid(revenue) || isValid(profit) || isValid(networth) || isValid(borrowing)) && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {isValid(revenue) && (
                        <div className="text-center p-4 rounded-xl bg-blue-50 border border-blue-100">
                          <p className="text-[10px] text-blue-500 font-black uppercase tracking-wide mb-1">Revenue</p>
                          <p className="text-base font-black text-slate-900">{revenue}</p>
                        </div>
                      )}
                      {isValid(profit) && (
                        <div className="text-center p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                          <p className="text-[10px] text-emerald-500 font-black uppercase tracking-wide mb-1">PAT</p>
                          <p className="text-base font-black text-slate-900">{profit}</p>
                        </div>
                      )}
                      {isValid(networth) && (
                        <div className="text-center p-4 rounded-xl bg-purple-50 border border-purple-100">
                          <p className="text-[10px] text-purple-500 font-black uppercase tracking-wide mb-1">Net Worth</p>
                          <p className="text-base font-black text-slate-900">{networth}</p>
                        </div>
                      )}
                      {isValid(borrowing) && (
                        <div className="text-center p-4 rounded-xl bg-orange-50 border border-orange-100">
                          <p className="text-[10px] text-orange-500 font-black uppercase tracking-wide mb-1">Total Debt</p>
                          <p className="text-base font-black text-slate-900">{borrowing}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {/* HTML financial table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <div
                      className="prose prose-sm max-w-none [&_table]:w-full [&_table]:border-collapse [&_th]:bg-slate-50 [&_th]:p-3 [&_th]:text-left [&_th]:font-bold [&_th]:text-slate-700 [&_th]:border [&_th]:border-slate-200 [&_td]:p-3 [&_td]:border [&_td]:border-slate-100 [&_td]:text-slate-700 [&_tr:nth-child(even)]:bg-slate-50/50"
                      dangerouslySetInnerHTML={{ __html: cleanGarbledText(blog.finantial_information_assets) }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Promoter Holding & KPI Comparison Table ── */}
            {(isValid(preHolding) || kpiNames.length > 0 || isValid(prePe)) && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-indigo-50">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <h2 className="text-base font-black text-slate-800">Key Performance Metrics</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left py-3 px-6 font-bold text-slate-500 uppercase text-xs tracking-wide">Metric</th>
                        <th className="text-right py-3 px-6 font-bold text-slate-500 uppercase text-xs tracking-wide">Pre-IPO</th>
                        <th className="text-right py-3 px-6 font-bold text-slate-500 uppercase text-xs tracking-wide">Post-IPO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isValid(preHolding) && (
                        <tr className="border-b border-slate-100 hover:bg-purple-50/30 transition-colors">
                          <td className="py-3.5 px-6 font-semibold text-slate-700">Promoter Holding</td>
                          <td className="py-3.5 px-6 text-right font-black text-purple-700">{preHolding}</td>
                          <td className="py-3.5 px-6 text-right font-black text-emerald-700">{isValid(postHolding) ? postHolding : "—"}</td>
                        </tr>
                      )}
                      {isValid(prePe) && (
                        <tr className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors">
                          <td className="py-3.5 px-6 font-semibold text-slate-700">P/E Ratio</td>
                          <td className="py-3.5 px-6 text-right font-black text-blue-700">{prePe}</td>
                          <td className="py-3.5 px-6 text-right font-black text-blue-700">{isValid(postPe) ? postPe : "—"}</td>
                        </tr>
                      )}
                      {isValid(preEps) && (
                        <tr className="border-b border-slate-100 hover:bg-indigo-50/30 transition-colors">
                          <td className="py-3.5 px-6 font-semibold text-slate-700">EPS</td>
                          <td className="py-3.5 px-6 text-right font-black text-indigo-700">{preEps}</td>
                          <td className="py-3.5 px-6 text-right font-black text-indigo-700">{isValid(postEps) ? postEps : "—"}</td>
                        </tr>
                      )}
                      {kpiNames.map((kpi, idx) => (
                        <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-6 font-semibold text-slate-700">{kpi}</td>
                          <td className="py-3.5 px-6 text-right font-black text-slate-900" colSpan={2}>{kpiValues[idx] || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Competitive Strengths ── */}
            {strengths.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-green-50">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base font-black text-slate-800">Competitive Strengths</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {strengths.map((s, idx) => (
                    <div key={idx} className="flex gap-3 items-start p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 hover:border-emerald-300 transition-colors">
                      <div className="shrink-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black mt-0.5">{idx + 1}</div>
                      <p className="text-sm font-semibold text-slate-700 leading-snug">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── FAQs ── */}
            {isValid(blog.faqs) && (() => {
              let faqItems: { question: string; answer: string }[] = [];
              try {
                const parsed = JSON.parse(blog.faqs);
                if (Array.isArray(parsed)) {
                  faqItems = parsed.filter(f => f && f.question && f.answer).map(f => ({ question: cleanGarbledText(f.question), answer: cleanGarbledText(f.answer) }));
                }
              } catch (e) {}
              if (faqItems.length === 0) return null;

              return (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-purple-50">
                    <HelpCircle className="w-5 h-5 text-violet-600" />
                    <h2 className="text-base font-black text-slate-800">Frequently Asked Questions</h2>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {faqItems.map((faq, idx) => (
                      <div key={idx} className="p-6 hover:bg-violet-50/30 transition-colors">
                        <p className="font-black text-slate-900 mb-2 text-sm flex gap-2"><span className="text-violet-500 shrink-0">Q.</span>{faq.question}</p>
                        <p className="text-sm text-slate-600 leading-relaxed pl-5">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* ─── RIGHT SIDEBAR ─── */}
          <div className="lg:col-span-4 space-y-5">

            {/* Official Documents */}
            {(isValid(blog.drhp) || isValid(blog.rhp) || isValid(blog.confidential_drhp)) && (
              <div className="rounded-2xl shadow-lg overflow-hidden border border-slate-800 bg-gradient-to-br from-[#0f172a] to-[#1e3a5f]">
                <div className="p-5 border-b border-white/10">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <FileText className="w-4 h-4 text-blue-400" /> Official Documents
                  </div>
                  <p className="text-xs text-blue-300/60 mt-0.5">Download regulatory filings</p>
                </div>
                <div className="p-5 space-y-2">
                  {[
                    { label: "Download DRHP", link: blog.drhp },
                    { label: "Download RHP", link: blog.rhp },
                    { label: "Confidential DRHP", link: blog.confidential_drhp }
                  ].map((doc, idx) => {
                    if (!isValid(doc.link)) return null;
                    const isExternal = String(doc.link).startsWith('http');
                    const href = isExternal ? doc.link : `/uploads/${doc.link}`;
                    return (
                      <a key={idx} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/10 transition-all group">
                        <span>{doc.label}</span>
                        <Download className="w-4 h-4 text-blue-400 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* IPO Timeline Table */}
            {timelineLabels.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-black text-slate-800">IPO Timelines</h3>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {timelineLabels.map((label, idx) => (
                      <tr key={idx} className={`border-b border-slate-100 last:border-0 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                        <td className="py-3 px-5 text-slate-500 font-semibold text-xs">{label}</td>
                        <td className="py-3 px-5 text-slate-900 font-black text-xs text-right">
                          {cleanGarbledText(timelineDates[idx] || "TBA")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Lot Size Table */}
            {lots.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-black text-slate-800">Lot Size</h3>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      <th className="text-left py-2.5 px-5 text-xs font-bold text-slate-400 uppercase">Category</th>
                      <th className="text-center py-2.5 px-3 text-xs font-bold text-slate-400 uppercase">Shares</th>
                      <th className="text-right py-2.5 px-5 text-xs font-bold text-slate-400 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lots.map((lot, idx) => (
                      <tr key={idx} className={`border-b border-slate-100 last:border-0 ${idx % 2 === 0 ? "bg-white" : "bg-emerald-50/30"}`}>
                        <td className="py-3 px-5 text-emerald-700 font-bold text-xs">{lot}</td>
                        <td className="py-3 px-3 text-center text-slate-600 font-semibold text-xs">{cleanGarbledText(lotShares[idx] || "—")}</td>
                        <td className="py-3 px-5 text-right text-slate-900 font-black text-xs">{cleanGarbledText(lotAmounts[idx] || "—")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {isValid(blog.ipo_lots_application) && (
                  <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Application Info</p>
                    <p className="text-xs text-slate-600">{cleanGarbledText(blog.ipo_lots_application)}</p>
                  </div>
                )}
              </div>
            )}

            {/* GMP Card */}
            {isValid(latestGmp) && (
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-lg">
                <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Grey Market Premium
                </p>
                <p className="text-4xl font-black mb-1">{latestGmp}</p>
                {isValid(gmpPrice) && <p className="text-emerald-200 text-sm">vs. Issue Price: <span className="font-bold text-white">{gmpPrice}</span></p>}
                {isValid(gmpUpdated) && <p className="text-emerald-300/70 text-[10px] mt-3">Last Updated: {gmpUpdated}</p>}
              </div>
            )}

            {/* Promoter Holding Quick Card */}
            {isValid(preHolding) && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-indigo-50">
                  <Wallet className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-black text-slate-800">Promoter Holding</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-500">Pre-Issue</span>
                      <span className="text-purple-700">{preHolding}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: preHolding.includes('%') ? preHolding : `${preHolding}%` }} />
                    </div>
                  </div>
                  {isValid(postHolding) && (
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-slate-500">Post-Issue</span>
                        <span className="text-emerald-700">{postHolding}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: postHolding.includes('%') ? postHolding : `${postHolding}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default IPOBlogDetails;
