import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, TrendingUp, IndianRupee, ArrowLeft, Download, FileText } from "lucide-react";

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
  const s = String(val).toLowerCase().trim();
  return s !== "null" && s !== "[null]" && s !== "" && s !== "undefined" && s !== "[]";
};

const cleanGarbledText = (text: string) => {
  if (!text) return "";
  return text
    .replace(/\\u20b9/g, "₹")
    .replace(/&nbsp;/g, " ")
    .replace(/null/g, "")
    .trim();
};

const parseArrayData = (data: any): string[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data.filter(d => d && String(d).toLowerCase() !== "null");
  try {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) return parsed.filter(d => d && String(d).toLowerCase() !== "null");
  } catch (e) {
    // If it's a string that looks like a comma separated list but not JSON
    if (String(data).includes(",")) {
       return String(data).split(",").map(s => s.trim()).filter(s => s && s.toLowerCase() !== "null");
    }
  }
  return [String(data)];
};

const IPOBlogDetails = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<AdminBlogFull | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/admin-blogs/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setBlog(data);
        } else {
          setBlog(null);
        }
      } catch (err) {
        console.error("Failed to fetch IPO blog:", err);
      } finally {
        setLoading(false);
      }
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
          <Button asChild>
            <Link to="/ipo-blogs"><ArrowLeft className="w-4 h-4 mr-2" /> Back to IPO Blogs</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SEOHead 
        title={blog.meta_title || `${blog.title} - IndiaIPO`} 
        description={blog.description || `Read details and updates about ${blog.title}`}
        ogImage={blog.image}
      />
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 lg:py-12">
        <Button variant="ghost" className="mb-6 hover:bg-transparent hover:text-primary p-0" asChild>
          <Link to="/ipo-blogs"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Listing</Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 backdrop-blur-md">
                  {(blog.category || 'IPO').replace('_', ' ').toUpperCase()}
                </Badge>
                {blog.upcoming == "1" ? (
                  <Badge className="bg-amber-100 text-amber-800 border-amber-300">UPCOMING</Badge>
                ) : (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">CURRENT</Badge>
                )}
                {blog.confidential == "1" && (
                  <Badge className="bg-red-100 text-red-800 border-red-300">CONFIDENTIAL</Badge>
                )}
                {isValid(blog.new_highlight_text) && (
                  <Badge className="bg-purple-100 text-purple-800 border-purple-300 italic">{blog.new_highlight_text}</Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-6 leading-tight">
                {blog.title}
              </h1>

              {isValid(blog.image) && (
                <div className="rounded-xl overflow-hidden bg-slate-100 mb-8 border border-slate-200">
                  <img src={blog.image} alt={blog.title} className="w-full h-auto object-cover max-h-[400px]" />
                </div>
              )}

              {/* Core Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {isValid(blog.gmp_ipo_price) && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-sm text-slate-500 mb-1 flex items-center"><IndianRupee className="w-4 h-4 mr-1"/> Price Band</p>
                    <p className="font-bold text-lg text-slate-900">{cleanGarbledText(blog.gmp_ipo_price)}</p>
                  </div>
                )}
                {isValid(blog.gmp) && (
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <p className="text-sm text-emerald-600 mb-1 flex items-center"><TrendingUp className="w-4 h-4 mr-1"/> Latest GMP</p>
                    <p className="font-bold text-lg text-emerald-700">{cleanGarbledText(blog.gmp)}</p>
                  </div>
                )}
                {isValid(blog.gmp_date) && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-sm text-slate-500 mb-1 flex items-center"><Calendar className="w-4 h-4 mr-1"/> Important Date</p>
                    <p className="font-bold text-lg text-slate-900">{cleanGarbledText(blog.gmp_date)}</p>
                  </div>
                )}
              </div>

              {/* Main HTML Content rendered directly since it's an admin blog */}
              {isValid(blog.content) && (
                <div 
                  className="prose prose-slate max-w-none prose-headings:font-heading prose-a:text-primary mt-8"
                  dangerouslySetInnerHTML={{ __html: cleanGarbledText(blog.content) }}
                />
              )}
            </div>

            {/* Financials & Strengths */}
            {(isValid(blog.finantial_information_assets) || isValid(blog.competative_strenght)) && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                {isValid(blog.finantial_information_assets) && (
                  <div className="mb-10">
                    <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                      <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                      Financial Highlights
                    </h3>
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                       <div 
                         className="prose prose-sm max-w-none prose-table:border prose-th:bg-slate-50 prose-th:p-3 prose-td:p-3" 
                         dangerouslySetInnerHTML={{ __html: cleanGarbledText(blog.finantial_information_assets) }} 
                       />
                    </div>
                  </div>
                )}

                {isValid(blog.competative_strenght) && (
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                       <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
                       Competitive Strengths
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {parseArrayData(blog.competative_strenght).map((strength, idx) => (
                         <div key={idx} className="flex gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-emerald-200 transition-colors">
                           <div className="h-6 w-6 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center text-emerald-600 text-[10px] font-black group-hover:bg-emerald-500 group-hover:text-white transition-all">
                             {idx + 1}
                           </div>
                           <p className="text-sm font-bold text-slate-700 leading-tight">{cleanGarbledText(strength)}</p>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Promoter Holding & KPIs */}
            {(isValid(blog.promotor_hold_pre_issue) || isValid(blog.key_kpi)) && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   {isValid(blog.promotor_hold_pre_issue) && (
                     <div>
                       <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                         <div className="w-1.5 h-6 bg-purple-600 rounded-full"></div>
                         Promoter Holding
                       </h3>
                       <div className="space-y-6">
                          <div>
                            <div className="flex justify-between text-sm font-bold mb-2">
                               <span className="text-slate-500">Pre-Issue</span>
                               <span className="text-slate-900">{cleanGarbledText(blog.promotor_hold_pre_issue)}</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full bg-purple-600 rounded-full" style={{ width: blog.promotor_hold_pre_issue.includes('%') ? blog.promotor_hold_pre_issue : '100%' }}></div>
                            </div>
                          </div>
                          {isValid(blog.promotor_hold_post_issue) && (
                             <div>
                               <div className="flex justify-between text-sm font-bold mb-2">
                                  <span className="text-slate-500">Post-Issue</span>
                                  <span className="text-slate-900">{cleanGarbledText(blog.promotor_hold_post_issue)}</span>
                               </div>
                               <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: blog.promotor_hold_post_issue.includes('%') ? blog.promotor_hold_post_issue : '100%' }}></div>
                               </div>
                             </div>
                          )}
                       </div>
                     </div>
                   )}

                   {isValid(blog.key_kpi) && (
                      <div>
                        <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                          <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                          Key KPIs
                        </h3>
                        <div className="space-y-3">
                           {parseArrayData(blog.key_kpi).map((kpi, idx) => {
                              const values = parseArrayData(blog.key_value);
                              return (
                                <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                   <span className="text-xs font-bold text-slate-500">{cleanGarbledText(kpi)}</span>
                                   <span className="text-sm font-black text-slate-900">{cleanGarbledText(values[idx] || "N/A")}</span>
                                </div>
                              )
                           })}
                        </div>
                      </div>
                   )}
                </div>
              </div>
            )}

            {/* FAQs Section */}
            {isValid(blog.faqs) && (
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-8 bg-purple-600 rounded-full"></div>
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    {parseArrayData(blog.faqs).map((faq: any, idx) => {
                       let q = "", a = "";
                       try {
                          if (typeof faq === 'object') { q = faq.question; a = faq.answer; }
                          else { 
                             const split = String(faq).split("?");
                             q = split[0] + "?";
                             a = split.slice(1).join("?");
                          }
                       } catch(e) {}
                       
                       if (!q || !a) return null;

                       return (
                        <div key={idx} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                           <p className="text-base font-black text-slate-900 mb-2">Q: {cleanGarbledText(q)}</p>
                           <p className="text-sm text-slate-600 leading-relaxed font-medium">A: {cleanGarbledText(a)}</p>
                        </div>
                       )
                    })}
                  </div>
               </div>
            )}
          </div>

          {/* Sidebar / Secondary Content */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Official Documents section */}
            {(isValid(blog.drhp) || isValid(blog.rhp) || isValid(blog.confidential_drhp)) && (
              <div className="bg-[#001529] text-white rounded-2xl shadow-xl overflow-hidden border border-slate-800">
                <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800">
                  <h3 className="text-xl font-bold font-heading flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Official Documents
                  </h3>
                  <p className="text-xs text-blue-100/70 mt-1">Download regulatory filings and reports</p>
                </div>
                <div className="p-6 space-y-3">
                  {[
                    { label: "Download DRHP", link: blog.drhp },
                    { label: "Download RHP", link: blog.rhp },
                    { label: "Confidential DRHP", link: blog.confidential_drhp }
                  ].map((doc, idx) => {
                    if (!isValid(doc.link)) return null;
                    const isExternal = String(doc.link).startsWith('http');
                    const href = isExternal ? doc.link : `/uploads/${doc.link}`;

                    return (
                      <Button key={idx} variant="secondary" className="w-full flex justify-between group bg-white/10 hover:bg-white/20 border-white/10 text-white" asChild>
                        <a href={href} target="_blank" rel="noopener noreferrer">
                          <span>{doc.label}</span>
                          <Download className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-all text-blue-400" />
                        </a>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Timelines and Lots */}
            {(isValid(blog.ipo_description) || isValid(blog.ipo_timeline_description) || isValid(blog.ipo_timeline_details)) && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-xl font-bold mb-6 text-slate-900 font-heading flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  IPO Timelines
                </h3>
                
                <div className="space-y-4">
                   {(() => {
                      const labels = parseArrayData(blog.ipo_timeline_details);
                      const dates = parseArrayData(blog.ipo_timeline_description);
                      return labels.map((label, idx) => (
                        <div key={idx} className="relative pl-6 pb-4 border-l border-slate-100 last:border-0 last:pb-0">
                           <div className="absolute left-[-5px] top-1.5 h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-blue-50"></div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cleanGarbledText(label)}</p>
                           <p className="text-sm font-bold text-slate-900 mt-0.5">{cleanGarbledText(dates[idx] || "TBA")}</p>
                        </div>
                      ));
                   })()}
                </div>

                {isValid(blog.ipo_description) && (
                  <div className="mt-8 pt-6 border-t border-slate-50">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-tighter mb-3">Additional Details</h4>
                      <div className="space-y-2">
                        {parseArrayData(blog.ipo_description).map((detail, idx) => (
                          <div key={idx} className="text-sm font-bold text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                             {cleanGarbledText(detail)}
                          </div>
                        ))}
                      </div>
                  </div>
                )}
              </div>
            )}

            {/* Lot Size */}
            {(isValid(blog.ipo_lots) || isValid(blog.ipo_lots_amount)) && (
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                 <h3 className="text-xl font-bold mb-6 text-slate-900 font-heading flex items-center gap-2">
                   <TrendingUp className="w-5 h-5 text-emerald-500" />
                   Lot Size Information
                 </h3>
                 <div className="space-y-3">
                    {(() => {
                       const lots = parseArrayData(blog.ipo_lots);
                       const amounts = parseArrayData(blog.ipo_lots_amount);
                       const shares = parseArrayData(blog.ipo_lots_share);
                       
                       return lots.map((lot, idx) => (
                         <div key={idx} className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex justify-between items-center">
                            <div>
                               <p className="text-xs font-black text-emerald-600 uppercase tracking-tighter">{cleanGarbledText(lot)}</p>
                               <p className="text-[10px] text-emerald-400 font-bold">{cleanGarbledText(shares[idx] || "")} Shares</p>
                            </div>
                            <div className="text-right">
                               <p className="text-lg font-black text-slate-900">{cleanGarbledText(amounts[idx] || "0")}</p>
                            </div>
                         </div>
                       ));
                    })()}
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
