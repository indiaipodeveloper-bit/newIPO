import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { ExternalLink, MapPin, Search, TrendingUp, ArrowRight, Shield, Star, Building2, Phone, CheckCircle, Award, Users, Globe, Info, MessageSquare, Mail, X, ChevronLeft, ChevronRight, BarChart3, PieChart, LineChart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
}

const safeParseJSON = (str: string) => {
  if (!str) return [];
  try {
    return JSON.parse(str);
  } catch (e) {
    return [];
  }
};

const MerchantBankersPage = ({ type }: { type: "SME" | "Mainboard" }) => {
  const isSME = type.toLowerCase() === "sme";
  const [bankers, setBankers] = useState<Banker[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // Pagination State
  const [page, setPage] = useState(1);
  const limit = 9;
  const [hasMore, setHasMore] = useState(false);
  
  // UI States
  const [detailBanker, setDetailBanker] = useState<Banker | null>(null);
  const [connectBanker, setConnectBanker] = useState<Banker | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (page === 1) setLoading(true);
    else setLoadingMore(true);

    fetch(`/api/bankers?page=${page}&limit=${limit}&search=${encodeURIComponent(debouncedSearch)}`)
      .then((res) => res.json())
      .then((body) => {
        const data = body.data || [];
        // Optional client-side fallback filter if the backend doesn't filter by SME/Mainboard natively
        const typedData = data.filter((b: Banker) => 
          isSME ? b.sub_title?.toUpperCase().includes('SME') : !b.sub_title?.toUpperCase().includes('SME')
        );

        if (page === 1) {
          setBankers(data); // Render all for now, or use typedData if you strictly want SME only
        } else {
          setBankers(prev => [...prev, ...data]);
        }
        
        if (body.pagination) {
          setHasMore(page < body.pagination.totalPages);
        } else {
          setHasMore(false);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  }, [type, page, debouncedSearch]);

  const title = isSME
    ? "List of SME Merchant Bankers"
    : "List of Mainboard Merchant Bankers";

  // --- DETAIL VIEW ---
  if (detailBanker) {
    const yearwise = safeParseJSON(detailBanker.yearwise_ipolisting);
    const sizeData = safeParseJSON(detailBanker.sme_ipos_by_size);
    const subData = safeParseJSON(detailBanker.sme_ipos_by_subscription);
    const faqsData = safeParseJSON(detailBanker.faqs);

    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SEOHead
          title={`${detailBanker.meta_title || detailBanker.title} | Merchant Banker`}
          description={detailBanker.meta_desc || detailBanker.description?.replace(/<[^>]*>?/gm, '').substring(0, 160)}
          keywords={detailBanker.meta_keywords || "Merchant Banker, SME IPO, Book Running Lead Manager"}
        />
        <Header />
        
        <main className="flex-1">
          {/* Header Section */}
          <div className="bg-primary pt-12 pb-24 px-4 relative">
            <div className="absolute inset-0 opacity-10 blur-3xl pointer-events-none">
              <div className="absolute top-10 right-20 w-96 h-96 bg-accent rounded-full" />
            </div>
            <div className="container mx-auto max-w-6xl relative z-10">
              <button 
                onClick={() => setDetailBanker(null)}
                className="flex items-center text-primary-foreground/80 hover:text-white mb-8 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 mr-1" /> Back to Directory
              </button>
              
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-white flex items-center justify-center p-4 shadow-xl shrink-0">
                  {detailBanker.image ? (
                    <img src={getImageUrl(detailBanker.image)} alt={detailBanker.title} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-4xl text-primary font-bold">{detailBanker.title?.[0]}</span>
                  )}
                </div>
                <div className="flex-1 text-primary-foreground">
                  <h1 className="text-3xl md:text-5xl font-bold mb-3">{detailBanker.title}</h1>
                  <span className="inline-block px-3 py-1 bg-accent/20 text-accent border border-accent/40 rounded-full text-sm font-medium mb-6">
                    {detailBanker.sub_title || "SEBI Registered Merchant Banker"}
                  </span>
                  <div 
                    className="prose prose-invert max-w-none text-primary-foreground/90 leading-relaxed" 
                    dangerouslySetInnerHTML={{__html: detailBanker.description || 'India based Merchant Banker specializing in IPO Advisory and Corporate Finance.'}} 
                  />
                  <div className="mt-8 flex gap-4">
                    <Button onClick={() => setConnectBanker(detailBanker)} className="bg-accent text-accent-foreground hover:bg-accent/90">
                      <Mail className="w-4 h-4 mr-2" /> Connect Now
                    </Button>
                    {detailBanker.cweblink && (
                      <a href={detailBanker.cweblink.startsWith('http') ? detailBanker.cweblink : `https://${detailBanker.cweblink}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent">
                          <Globe className="w-4 h-4 mr-2" /> Visit Website
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto max-w-6xl px-4 -mt-12 relative z-20 pb-20">
            {/* Statistics Section */}
            <div className="bg-card rounded-2xl shadow-xl border border-border p-8 mb-12 flex flex-wrap gap-8 justify-between items-center text-center divide-x-0 md:divide-x divide-border">
              <div className="flex-1 min-w-[150px] px-4">
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-2">Total IPOs Managed</p>
                <p className="text-3xl font-bold text-foreground">{detailBanker.noOfiposofar || "0"}</p>
              </div>
              <div className="flex-1 min-w-[150px] px-4">
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-2">Total Amount Raised</p>
                <p className="text-3xl font-bold text-foreground">{detailBanker.totalfundraised || "₹0 Cr"}</p>
              </div>
              <div className="flex-1 min-w-[150px] px-4">
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-2">Average IPO Size</p>
                <p className="text-3xl font-bold text-foreground">{detailBanker.avgiposize || "₹0 Cr"}</p>
              </div>
              <div className="flex-1 min-w-[150px] px-4">
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-2">Average Subscription</p>
                <p className="text-3xl font-bold text-foreground">{detailBanker.avgsubscription || "0x"}</p>
              </div>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Box 1: Exchange */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary"><Building2 className="w-5 h-5" /></div>
                  <h3 className="text-xl font-bold">SME IPO Listing by Exchange</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/20 rounded-xl p-6 text-center">
                    <p className="text-4xl font-bold text-primary mb-2">{detailBanker.nseemer || "0"}</p>
                    <p className="text-muted-foreground font-medium">NSE Emerge</p>
                  </div>
                  <div className="bg-secondary/20 rounded-xl p-6 text-center">
                    <p className="text-4xl font-bold text-accent mb-2">{detailBanker.bsesme || "0"}</p>
                    <p className="text-muted-foreground font-medium">BSE SME</p>
                  </div>
                </div>
              </div>

              {/* Box 2: Year Wise */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary"><LineChart className="w-5 h-5" /></div>
                  <h3 className="text-xl font-bold">Year-wise SME IPO Listing</h3>
                </div>
                {yearwise.length > 0 ? (
                  <div className="space-y-4">
                    {yearwise.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-background rounded-lg p-3 border border-border">
                        <span className="font-semibold">{item.year || item.label || 'Year'}</span>
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">{item.count || item.value || 0} IPOs</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground py-8 text-center italic">No year-wise listing data available.</p>
                )}
              </div>

              {/* Box 3: Subscription Category */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary"><PieChart className="w-5 h-5" /></div>
                  <h3 className="text-xl font-bold">SME IPOs by Subscription</h3>
                </div>
                {subData.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {subData.map((item: any, idx: number) => {
                      const colors = [
                        "bg-blue-50/50 text-blue-600 border-blue-100",
                        "bg-green-50/50 text-green-600 border-green-100",
                        "bg-red-50/50 text-red-600 border-red-100",
                        "bg-amber-50/50 text-amber-600 border-amber-100",
                        "bg-purple-50/50 text-purple-600 border-purple-100"
                      ];
                      const colorClass = colors[idx % colors.length];
                      return (
                        <div key={idx} className={`rounded-xl p-4 text-center flex flex-col items-center justify-center border ${colorClass}`}>
                          <span className="text-lg font-bold mb-1">{item.subscription || item.sub || item.value || "0"}</span>
                          <span className="text-xs font-medium text-foreground/70">{item.title || item.category || item.label || "Category"}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground py-8 text-center italic">No subscription breakdown available.</p>
                )}
              </div>

              {/* Box 4: Size Category */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary"><BarChart3 className="w-5 h-5" /></div>
                  <h3 className="text-xl font-bold">SME IPOs by Size Category</h3>
                </div>
                {sizeData.length > 0 ? (
                  <div className="grid gap-3">
                    {sizeData.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-background rounded-lg p-3 border border-border">
                        <span className="font-medium text-sm text-foreground/80">{item.title || item.label || 'Size'}</span>
                        <span className="font-bold text-sm bg-primary/10 text-primary px-3 py-1 rounded-md">{item.size || item.count || item.value || "0"}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground py-8 text-center italic">No size category data available.</p>
                )}
              </div>
            </div>

            {/* FAQs */}
            {faqsData.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  Frequently Asked Questions
                </h2>
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <Accordion type="single" collapsible className="w-full">
                    {faqsData.map((faq: any, idx: number) => (
                      <AccordionItem key={idx} value={`faq-${idx}`}>
                        <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary transition-colors">
                          {faq.question || faq.q || "Question?"}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {faq.answer || faq.a || "Answer goes here."}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            )}

            {/* Upcoming Mock IPOs */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                Upcoming SME IPOs associated with {detailBanker.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg">TechNova Solutions Ltd.</h4>
                        <p className="text-sm text-muted-foreground">Information Technology</p>
                      </div>
                      <span className="px-2 py-1 bg-brand-green/10 text-brand-green text-xs font-bold rounded">Upcoming</span>
                    </div>
                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Listing Date:</span><span className="font-semibold text-foreground">TBA</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Exchange:</span><span className="font-semibold text-foreground">NSE Emerge</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Issue Size:</span><span className="font-semibold text-foreground">~₹35.5 Cr</span></div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1">Read DRHP</Button>
                      <Button className="flex-1">Know More</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        
        {/* Render Connect Modal inside Detail View too if requested */}
        <AnimatePresence>
          {connectBanker && (
            <ConnectModal banker={connectBanker} onClose={() => setConnectBanker(null)} />
          )}
        </AnimatePresence>

        <Footer />
      </div>
    );
  }

  // --- LISTING VIEW ---
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title={title}
        description={`Complete directory of ${isSME ? "SME" : "Mainboard"} merchant bankers in India with IPO stats, contact details, and performance data.`}
        keywords={`${title}, SEBI registered, IPO merchant bankers, BRLM India`}
      />
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary via-primary/95 to-purple-700 py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-10 right-10 w-72 h-72 bg-accent rounded-full blur-[120px]" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-brand-green rounded-full blur-[150px]" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20 mb-6">
                <Shield className="h-3.5 w-3.5" />
                SEBI Registered Merchant Bankers
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-5">
                {isSME ? "SME" : "Mainboard"}{" "}
                <span className="text-accent">Merchant Bankers</span>
              </h1>
              <p className="text-white/70 max-w-2xl mx-auto mb-8 text-lg">
                {isSME
                  ? "Explore the exhaustive directory of SEBI-registered Merchant Bankers for SME IPOs on BSE SME & NSE Emerge."
                  : "India's top SEBI-registered Merchant Bankers for Mainline IPO advisory and book running."}
              </p>
              {/* Search in hero */}
              <div className="max-w-xl mx-auto relative group mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search by merchant banker name or keywords..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 py-6 text-base bg-white text-foreground border-0 rounded-2xl shadow-2xl w-full"
                />
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to={isSME ? "/merchant-bankers/mainboard-list" : "/merchant-bankers/sme"}>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                    View {isSME ? "Mainboard" : "SME"} Bankers <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
                <Link to="/ipo-feasibility">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                    Check IPO Feasibility
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Listing Content */}
        <section className="py-14 bg-secondary/20">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-card rounded-2xl border border-border h-80 animate-pulse" />
                ))}
              </div>
            ) : bankers.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground bg-card rounded-2xl border border-border">
                <Building2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-xl">No merchant bankers found.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bankers.map((banker, i) => (
                    <motion.div
                      key={banker.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (i % limit) * 0.05, ease: "easeOut" }}
                      className="bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
                      onClick={() => { setDetailBanker(banker); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    >
                      {/* Gradient top accent bar */}
                      <div className="h-1 w-full bg-gradient-to-r from-primary to-purple-600 group-hover:from-accent group-hover:to-primary transition-all duration-500" />

                      {/* Card Header */}
                      <div className="p-5 flex gap-4 items-start">
                        <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-2 shadow-sm border border-border shrink-0 group-hover:border-primary/30 transition-colors">
                          {banker.image ? (
                            <img src={getImageUrl(banker.image)} alt={banker.title} className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-2xl font-bold text-primary">{banker.title?.[0]}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-tight">{banker.title}</h3>
                          {banker.sub_title && (
                            <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{banker.sub_title}</span>
                          )}
                        </div>
                      </div>

                      {/* Card Stats */}
                      <div className="grid grid-cols-4 gap-0 mx-5 mb-5 rounded-xl overflow-hidden border border-border">
                        <div className="py-3 text-center border-r border-border last:border-r-0">
                          <p className="text-sm font-bold text-primary">{banker.noOfiposofar || "0"}</p>
                          <p className="text-[9px] text-muted-foreground uppercase font-semibold mt-0.5 tracking-wide">IPOs</p>
                        </div>
                        <div className="py-3 text-center border-r border-border last:border-r-0">
                          <p className="text-sm font-bold text-foreground">{banker.totalfundraised || "₹0"}</p>
                          <p className="text-[9px] text-muted-foreground uppercase font-semibold mt-0.5 tracking-wide">Raised</p>
                        </div>
                        <div className="py-3 text-center border-r border-border last:border-r-0">
                          <p className="text-sm font-bold text-foreground">{banker.avgiposize || "NA"}</p>
                          <p className="text-[9px] text-muted-foreground uppercase font-semibold mt-0.5 tracking-wide">Avg Sz</p>
                        </div>
                        <div className="py-3 text-center">
                          <p className="text-sm font-bold text-foreground">{banker.avgsubscription || "0x"}</p>
                          <p className="text-[9px] text-muted-foreground uppercase font-semibold mt-0.5 tracking-wide">Avg Sub</p>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="px-5 pb-5 flex gap-3 mt-auto">
                        <Button
                          variant="outline"
                          className="flex-1 border-primary/20 hover:bg-primary/5 text-primary font-semibold"
                          onClick={(e) => { e.stopPropagation(); setDetailBanker(banker); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        >
                          View Details
                        </Button>
                        <Button
                          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md shadow-primary/20"
                          onClick={(e) => { e.stopPropagation(); setConnectBanker(banker); }}
                        >
                          Connect
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {hasMore && (
                  <div className="mt-12 text-center">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      onClick={() => setPage(p => p + 1)}
                      disabled={loadingMore}
                      className="border-primary/20 hover:border-primary/50 text-primary hover:bg-primary/5 py-6 px-12 rounded-full font-bold shadow-sm transition-all"
                    >
                      {loadingMore ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                          Loading more bankers...
                        </>
                      ) : (
                        <>Load More Bankers <ChevronRight className="w-4 h-4 ml-1" /></>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      
      {/* Connect Modal Overlay */}
      <AnimatePresence>
        {connectBanker && (
          <ConnectModal banker={connectBanker} onClose={() => setConnectBanker(null)} />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

// Extracted Connect Modal Component
const ConnectModal = ({ banker, onClose }: { banker: Banker, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-border"
      >
        <div className="bg-primary p-6 text-primary-foreground relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-primary-foreground/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 rounded-xl bg-white mb-4 p-2 shadow-lg">
            {banker.image ? (
              <img src={getImageUrl(banker.image)} alt={banker.title} className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary font-bold text-2xl">{banker.title?.[0]}</div>
            )}
          </div>
          <h2 className="text-xl font-bold mb-1">Connect with {banker.title}</h2>
          <p className="text-primary-foreground/80 text-sm">Use the details below to reach out regarding your upcoming IPO journey.</p>
        </div>
        
        <div className="p-6 space-y-6">
          {banker.cemail && (
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><Mail className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Email Address</p>
                <a href={`mailto:${banker.cemail}`} className="text-foreground font-medium hover:text-primary transition-colors">{banker.cemail}</a>
              </div>
            </div>
          )}
          {banker.cmobile && (
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><Phone className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Mobile Number</p>
                <a href={`tel:${banker.cmobile}`} className="text-foreground font-medium hover:text-primary transition-colors">{banker.cmobile}</a>
              </div>
            </div>
          )}
          {banker.caddress && (
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><MapPin className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Office Address</p>
                <p className="text-foreground font-medium text-sm leading-relaxed">{banker.caddress}</p>
              </div>
            </div>
          )}
          {banker.cweblink && (
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><Globe className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Website</p>
                <a href={banker.cweblink.startsWith('http') ? banker.cweblink : `https://${banker.cweblink}`} target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">
                  {banker.cweblink}
                </a>
              </div>
            </div>
          )}
          
          <div className="pt-6 border-t border-border mt-4">
            <a href={`mailto:${banker.cemail || "contact@example.com"}`}>
              <Button className="w-full h-12 text-lg font-bold bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20">
                Contact Now
              </Button>
            </a>
          </div>
        </div>
      </motion.div>
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
