import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, TrendingUp, IndianRupee, ArrowLeft, Download } from "lucide-react";

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
                  {blog.category.replace('_', ' ').toUpperCase()}
                </Badge>
                {blog.upcoming == "1" ? (
                  <Badge className="bg-amber-100 text-amber-800 border-amber-300">UPCOMING</Badge>
                ) : (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">CURRENT</Badge>
                )}
                {blog.new_highlight_text && (
                  <Badge className="bg-purple-100 text-purple-800 border-purple-300">{blog.new_highlight_text}</Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-6 leading-tight">
                {blog.title}
              </h1>

              {blog.image && (
                <div className="rounded-xl overflow-hidden bg-slate-100 mb-8 border border-slate-200">
                  <img src={blog.image} alt={blog.title} className="w-full h-auto object-cover max-h-[400px]" />
                </div>
              )}

              {/* Core Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {blog.gmp_ipo_price && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-sm text-slate-500 mb-1 flex items-center"><IndianRupee className="w-4 h-4 mr-1"/> Price Band</p>
                    <p className="font-bold text-lg text-slate-900">{blog.gmp_ipo_price}</p>
                  </div>
                )}
                {blog.gmp && (
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <p className="text-sm text-emerald-600 mb-1 flex items-center"><TrendingUp className="w-4 h-4 mr-1"/> Latest GMP</p>
                    <p className="font-bold text-lg text-emerald-700">{blog.gmp}</p>
                  </div>
                )}
                {blog.gmp_date && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-sm text-slate-500 mb-1 flex items-center"><Calendar className="w-4 h-4 mr-1"/> Important Date</p>
                    <p className="font-bold text-lg text-slate-900">{blog.gmp_date}</p>
                  </div>
                )}
              </div>

              {/* Main HTML Content rendered directly since it's an admin blog */}
              {blog.content && (
                <div 
                  className="prose prose-slate max-w-none prose-headings:font-heading prose-a:text-primary mt-8"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              )}
            </div>

            {/* Financials & Strengths */}
            {(blog.finantial_information_assets || blog.competative_strenght) && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                {blog.finantial_information_assets && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Financial Information</h3>
                    <div className="prose prose-sm max-w-none overflow-x-auto" dangerouslySetInnerHTML={{ __html: blog.finantial_information_assets }} />
                  </div>
                )}

                {blog.competative_strenght && (
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Competitive Strengths</h3>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: blog.competative_strenght }} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar / Secondary Content */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Download section */}
            {(blog.drhp || blog.rhp) && (
              <div className="bg-primary text-primary-foreground rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 font-heading">Official Documents</h3>
                <div className="space-y-3">
                  {blog.drhp && (
                    <Button variant="secondary" className="w-full flex justify-between group" asChild>
                      <a href={blog.drhp} target="_blank" rel="noopener noreferrer">
                        <span>Download DRHP</span>
                        <Download className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-all" />
                      </a>
                    </Button>
                  )}
                  {blog.rhp && (
                    <Button variant="secondary" className="w-full flex justify-between group" asChild>
                      <a href={blog.rhp} target="_blank" rel="noopener noreferrer">
                        <span>Download RHP</span>
                        <Download className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-all" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Timelines and Lots */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-bold mb-4 text-slate-900 font-heading">Timelines & Details</h3>
              {blog.ipo_description && (
                <div className="mb-4 text-sm text-slate-600 border-l-2 border-primary pl-3">
                    <div dangerouslySetInnerHTML={{ __html: blog.ipo_description }} />
                </div>
              )}
              {blog.ipo_timeline_description && (
                <div className="text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: blog.ipo_timeline_description }} />
              )}
            </div>

            {/* Lots Size */}
            {blog.ipo_lots_amount && (
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                 <h3 className="text-xl font-bold mb-4 text-slate-900 font-heading">Lot Size</h3>
                 <div className="text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: blog.ipo_lots_amount }} />
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
