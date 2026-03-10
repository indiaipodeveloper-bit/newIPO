import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { toast } from "sonner";
import { CheckCircle, ArrowRight, Building2, TrendingUp, Shield, BarChart3, PieChart, FileText, ArrowUpRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  created_at: string;
}

const IPOFeasibility = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    company_name: "",
    current_turn_over: "",
    current_pat: "",
    industry: "",
    business_type: "",
    networth: "",
    profit: "",
    vintage: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [recentNews, setRecentNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetch("/api/news?status=published&limit=6");
        if (res.ok) {
          const data = await res.json();
          setRecentNews(data.data || data); 
        }
      } catch (err) {
        console.error("Failed to fetch recent insights");
      }
    };
    fetchInsights();
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/ipo_feasibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Your IPO feasibility request has been submitted successfully! Our elite experts will contact you soon.");
        setFormData({
          name: "", mobile: "", email: "", company_name: "", current_turn_over: "", 
          current_pat: "", industry: "", business_type: "", networth: "", profit: "", vintage: ""
        });
      } else {
        toast.error("Failed to submit request. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Check IPO Feasibility | IndiaIPO"
        description="Comprehensive IPO Feasibility check. Evaluate your company's readiness for Mainboard or SME IPO with our elite SEBI-registered experts."
        keywords="IPO feasibility, IPO readiness, SME IPO check, Mainboard IPO eligibility"
      />
      <Header />
      
      <main className="flex-1 space-y-20 pb-20">
        {/* Elite Hero Section */}
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-foreground text-background">
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-accent/10 blur-[100px] rounded-full" />
             <div className="absolute bottom-0 left-0 -ml-20 mb-20 w-[400px] h-[400px] bg-primary/20 blur-[100px] rounded-full" />
          </div>
          
          <div className="container relative z-10 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/20 text-accent font-semibold text-sm mb-8 backdrop-blur-md">
                  <BarChart3 className="w-4 h-4 fill-accent text-foreground" />
                  <span>Strategic Corporate Advisory</span>
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-heading tracking-tight mb-8">
                  Evaluate Your Potential For An <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-gold-light">Initial Public Offering</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
                  Take the first step towards massive capital scaling. Our expert feasibility check accurately gauges your readiness for the Mainboard or SME exchanges.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" className="h-14 px-8 text-lg bg-accent text-accent-foreground hover:bg-accent/90 rounded-full w-full sm:w-auto font-bold" onClick={() => document.getElementById('feasibility-form')?.scrollIntoView({ behavior: 'smooth' })}>
                    Start Assessment Now
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Check Feasibility Section */}
        <section className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">Why Assess Your IPO Readiness?</h2>
               <p className="text-muted-foreground text-lg">An IPO is a critical milestone. Assessing feasibility ensures you understand the regulatory, financial, and strategic transformations required.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <TrendingUp className="h-6 w-6" />, title: "Valuation Insights", desc: "Understand your potential market cap and equity value before proceeding." },
                { icon: <Shield className="h-6 w-6" />, title: "Regulatory Check", desc: "Identify compliance gaps against stringent SEBI exchange norms." },
                { icon: <PieChart className="h-6 w-6" />, title: "Capital Structuring", desc: "Optimize your existing cap table for institutional investor attractiveness." },
                { icon: <Building2 className="h-6 w-6" />, title: "Market Timing", desc: "Gauge the current market sentiment for your specific industry sector." },
              ].map((item, i) => (
                <motion.div 
                  key={item.title} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border hover:border-primary/30 transition-all hover:shadow-xl group"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
        </section>

        {/* Core Form Section */}
        <section id="feasibility-form" className="container mx-auto px-4">
            <div className="bg-card rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col lg:flex-row relative">
               <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
               
               {/* Context Sidebar */}
               <div className="lg:w-2/5 bg-foreground text-background p-10 md:p-14 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554200876-56c2f25224fa?q=80&w=1000')] opacity-10 bg-cover bg-center mix-blend-overlay" />
                  <div className="relative z-10 w-full">
                     <h3 className="text-3xl font-bold font-heading mb-6">Uncover Your Potential</h3>
                     <p className="text-primary-foreground/70 text-lg mb-10 leading-relaxed">
                       Enter your company's core financial and structural details. Our advisory board will run a comprehensive diagnostic and revert with an executive summary.
                     </p>
                     
                     <div className="space-y-6">
                        <div className="flex items-start gap-4">
                           <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center shrink-0 font-bold">1</div>
                           <div>
                              <h4 className="font-bold text-lg">Submit Data</h4>
                              <p className="text-primary-foreground/60 text-sm">Provide accurate recent metrics.</p>
                           </div>
                        </div>
                        <div className="flex items-start gap-4">
                           <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 font-bold">2</div>
                           <div>
                              <h4 className="font-bold text-lg">Expert Analysis</h4>
                              <p className="text-primary-foreground/60 text-sm">We benchmark against listed peers.</p>
                           </div>
                        </div>
                        <div className="flex items-start gap-4">
                           <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 font-bold">3</div>
                           <div>
                              <h4 className="font-bold text-lg">Feasibility Report</h4>
                              <p className="text-primary-foreground/60 text-sm">Receive a strategic consultation call.</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Form Area */}
               <div className="lg:w-3/5 p-10 md:p-14 bg-card/80 backdrop-blur-md">
                 <h2 className="text-2xl font-bold font-heading text-foreground mb-8 border-b border-border pb-4">Confidential Assessment Form</h2>
                 <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                           <label className="text-sm font-semibold text-foreground">Applicant Name *</label>
                           <Input required className="h-12 bg-background border-border" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Full Name" />
                       </div>
                       <div className="space-y-2">
                           <label className="text-sm font-semibold text-foreground">Phone Number *</label>
                           <Input required className="h-12 bg-background border-border" value={formData.mobile} onChange={(e) => handleChange("mobile", e.target.value)} placeholder="+91 99999 99999" />
                       </div>
                       <div className="space-y-2 md:col-span-2">
                           <label className="text-sm font-semibold text-foreground">Email Address *</label>
                           <Input required type="email" className="h-12 bg-background border-border" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="official@company.com" />
                       </div>
                    </div>

                    <div className="border-t border-border my-6" />

                    {/* Company Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                           <label className="text-sm font-semibold text-foreground">Company Name</label>
                           <Input className="h-12 bg-background border-border" value={formData.company_name} onChange={(e) => handleChange("company_name", e.target.value)} placeholder="XYZ Pvt Ltd" />
                       </div>
                       <div className="space-y-2">
                           <label className="text-sm font-semibold text-foreground">Industry Sector</label>
                           <Input className="h-12 bg-background border-border" value={formData.industry} onChange={(e) => handleChange("industry", e.target.value)} placeholder="e.g. IT, Manufacturing, Pharma" />
                       </div>
                       <div className="space-y-2">
                           <label className="text-sm font-semibold text-foreground">Business Type</label>
                           <select 
                             className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                             value={formData.business_type} 
                             onChange={(e) => handleChange("business_type", e.target.value)}
                           >
                              <option value="">Select Type</option>
                              <option value="Private Limited">Private Limited</option>
                              <option value="Public Limited (Unlisted)">Public Limited (Unlisted)</option>
                              <option value="LLP">LLP</option>
                              <option value="Partnership">Partnership</option>
                              <option value="Other">Other</option>
                           </select>
                       </div>
                       <div className="space-y-2">
                           <label className="text-sm font-semibold text-foreground">Company Vintage (Years)</label>
                           <Input type="number" className="h-12 bg-background border-border" value={formData.vintage} onChange={(e) => handleChange("vintage", e.target.value)} placeholder="e.g. 5" />
                       </div>
                    </div>

                    <div className="border-t border-border my-6" />

                    {/* Financial Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                           <label className="text-sm font-semibold text-foreground">Current Turnover (₹ Cr)</label>
                           <Input className="h-12 bg-background border-border" value={formData.current_turn_over} onChange={(e) => handleChange("current_turn_over", e.target.value)} placeholder="e.g. 50" />
                       </div>
                       <div className="space-y-2">
                           <label className="text-sm font-semibold text-foreground">Current PAT (₹ Cr)</label>
                           <Input className="h-12 bg-background border-border" value={formData.current_pat} onChange={(e) => handleChange("current_pat", e.target.value)} placeholder="e.g. 5" />
                       </div>
                       <div className="space-y-2">
                           <label className="text-sm font-semibold text-foreground">Estimated Networth (₹ Cr)</label>
                           <Input className="h-12 bg-background border-border" value={formData.networth} onChange={(e) => handleChange("networth", e.target.value)} placeholder="e.g. 20" />
                       </div>
                       <div className="space-y-2">
                           <label className="text-sm font-semibold text-foreground">Profit Trend</label>
                           <select 
                             className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                             value={formData.profit} 
                             onChange={(e) => handleChange("profit", e.target.value)}
                           >
                              <option value="">Select Trend</option>
                              <option value="Increasing">Increasing</option>
                              <option value="Stable">Stable</option>
                              <option value="Decreasing">Decreasing</option>
                              <option value="Loss Making">Loss Making</option>
                           </select>
                       </div>
                    </div>

                    <div className="pt-6">
                       <Button type="submit" size="lg" disabled={loading} className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg rounded-xl">
                          {loading ? "Submitting securely..." : "Submit Confidential Data"}
                          {!loading && <CheckCircle className="ml-2 h-5 w-5" />}
                       </Button>
                       <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1.5">
                          <Shield className="w-3.5 h-3.5" /> All financial data is encrypted and strictly confidential.
                       </p>
                    </div>
                 </form>
               </div>
            </div>
        </section>

        {/* Dynamic News/Blogs Section */}
        {recentNews.length > 0 && (
          <section className="bg-muted/30 py-20 mt-20 border-t border-border">
            <div className="container mx-auto px-4">
               <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">Latest Market Insights</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl">Stay updated with the latest IPO trends, market announcements, and financial news curated by our team.</p>
                  </div>
                  <Button variant="outline" asChild className="shrink-0 rounded-full h-12 px-6">
                     <Link to="/news-updates">View All News <ArrowRight className="ml-2 w-4 h-4" /></Link>
                  </Button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {recentNews.slice(0, 6).map((news, idx) => (
                    <Link to={`/news/${news.slug}`} key={news.id} className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300">
                      <div className="aspect-video relative overflow-hidden bg-muted">
                        {news.image_url ? (
                          <img src={news.image_url} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/5">
                            <FileText className="w-12 h-12 text-primary/20" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                           <span className="px-3 py-1 bg-background/90 backdrop-blur-sm text-foreground text-xs font-bold rounded-full">
                             Insights
                           </span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-3">
                           <Calendar className="w-3.5 h-3.5" />
                           {new Date(news.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <h3 className="font-bold text-lg font-heading text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3">
                           {news.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                           {news.excerpt || "Read more about this latest update inside..."}
                        </p>
                        <div className="mt-auto flex items-center text-sm font-semibold text-primary">
                           Read Full Article <ArrowUpRight className="ml-1 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                 ))}
               </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default IPOFeasibility;
