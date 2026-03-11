import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import {
  MapPin, Search, ArrowRight, Building2, Globe, FileText,
  CheckCircle, ChevronRight, X, Phone, Mail, Shield, Star,
  TrendingUp, Users, Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MainboardBanker {
  id: number;
  name: string;
  category: string;
  location: string;
  sebi_registration: string;
  website: string;
  services: string;
  total_ipos: number;
  established_year: number | null;
  description: string;
  logo_url: string;
  is_active: boolean;
  total_raised: number;
  avg_size: number;
  avg_subscription: number;
}

const StatCard = ({ label, value, icon: Icon }: { label: string; value: string | number; icon: any }) => (
  <div className="flex flex-col items-center text-center px-6 py-4">
    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3">
      <Icon className="w-5 h-5 text-white" />
    </div>
    <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
    <p className="text-xs text-white/70 uppercase tracking-wider font-semibold mt-1">{label}</p>
  </div>
);

const MainboardBankersPage = () => {
  const [bankers, setBankers] = useState<MainboardBanker[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 9;
  const [hasMore, setHasMore] = useState(false);
  const [detailBanker, setDetailBanker] = useState<MainboardBanker | null>(null);
  const [connectBanker, setConnectBanker] = useState<MainboardBanker | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (page === 1) setLoading(true);
    else setLoadingMore(true);

    fetch(`/api/mainboard-bankers?page=${page}&limit=${limit}&search=${encodeURIComponent(debouncedSearch)}`)
      .then((res) => res.json())
      .then((body) => {
        const data = body.data || [];
        if (page === 1) setBankers(data);
        else setBankers(prev => [...prev, ...data]);
        setHasMore(body.pagination ? page < body.pagination.totalPages : false);
      })
      .catch(console.error)
      .finally(() => { setLoading(false); setLoadingMore(false); });
  }, [page, debouncedSearch]);

  const handleConnect = (e: React.MouseEvent, banker: MainboardBanker) => {
    e.stopPropagation();
    setConnectBanker(banker);
  };

  // ─── DETAIL VIEW ─────────────────────────────────────────────────────────────
  if (detailBanker) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SEOHead
          title={`${detailBanker.name} | Mainboard Merchant Banker - India IPO`}
          description={detailBanker.description?.replace(/<[^>]*>/g, '').substring(0, 160) || "Mainboard Merchant Banker"}
        />
        <Header />
        <main className="flex-1">
          {/* Hero */}
          <div className="bg-gradient-to-br from-primary via-primary/90 to-purple-700 pt-12 pb-28 px-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-10 right-16 w-80 h-80 bg-accent rounded-full blur-[120px]" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-[150px]" />
            </div>
            <div className="container mx-auto max-w-6xl relative z-10">
              <button
                onClick={() => { setDetailBanker(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </div>
                Back to Directory
              </button>

              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-white flex items-center justify-center p-4 shadow-2xl shrink-0">
                  {detailBanker.logo_url ? (
                    <img src={detailBanker.logo_url} alt={detailBanker.name} className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="w-12 h-12 text-primary/40" />
                  )}
                </div>
                <div className="flex-1 text-white">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/20 text-brand-green border border-brand-green/30 text-xs font-bold">
                      <CheckCircle className="w-3.5 h-3.5" /> SEBI Registered
                    </span>
                    {detailBanker.category && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium border border-white/20">
                        {detailBanker.category}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold mb-4">{detailBanker.name}</h1>
                  {detailBanker.sebi_registration && (
                    <p className="text-white/60 text-sm font-mono mb-6">Reg. No: {detailBanker.sebi_registration}</p>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={(e) => handleConnect(e, detailBanker)} className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-6">
                      <Mail className="w-4 h-4 mr-2" /> Connect Now
                    </Button>
                    {detailBanker.website && (
                      <Button variant="outline" asChild className="border-white/30 text-white hover:bg-white/10 bg-transparent px-6">
                        <a href={detailBanker.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="w-4 h-4 mr-2" /> Visit Website
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto max-w-6xl px-4 -mt-16 pb-20 relative z-20">
            {/* Stats Bar */}
            <div className="bg-card rounded-2xl shadow-xl border border-border p-6 mb-10 flex flex-wrap gap-0 divide-x divide-border">
              <div className="flex-1 min-w-[130px] text-center px-4">
                <p className="text-2xl font-bold text-primary">{detailBanker.total_ipos || 0}</p>
                <p className="text-xs text-muted-foreground uppercase font-semibold mt-1 tracking-wide">Total IPOs</p>
              </div>
              <div className="flex-1 min-w-[130px] text-center px-4">
                <p className="text-2xl font-bold text-primary">₹{detailBanker.total_raised || "0"} Cr</p>
                <p className="text-xs text-muted-foreground uppercase font-semibold mt-1 tracking-wide">Amount Raised</p>
              </div>
              <div className="flex-1 min-w-[130px] text-center px-4">
                <p className="text-2xl font-bold text-foreground">₹{detailBanker.avg_size || "0"} Cr</p>
                <p className="text-xs text-muted-foreground uppercase font-semibold mt-1 tracking-wide">Avg Issue Size</p>
              </div>
              <div className="flex-1 min-w-[130px] text-center px-4">
                <p className="text-2xl font-bold text-foreground">{detailBanker.avg_subscription || "0"}x</p>
                <p className="text-xs text-muted-foreground uppercase font-semibold mt-1 tracking-wide">Avg Subscription</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {detailBanker.description && (
                  <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" /> About the Company
                    </h3>
                    <div
                      className="prose prose-sm md:prose-base max-w-none text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: detailBanker.description }}
                    />
                  </div>
                )}
                {detailBanker.services && (
                  <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" /> Core Services
                    </h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{detailBanker.services}</p>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-secondary/40 border border-border rounded-2xl p-6">
                  <h3 className="font-bold mb-4 text-foreground uppercase tracking-wide text-sm">Corporate Details</h3>
                  <div className="space-y-4">
                    {detailBanker.location && (
                      <div className="flex gap-3 items-start">
                        <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm">Head Office</p>
                          <p className="text-muted-foreground text-sm">{detailBanker.location}</p>
                        </div>
                      </div>
                    )}
                    {detailBanker.established_year && (
                      <div className="flex gap-3 items-start">
                        <Building2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm">Established</p>
                          <p className="text-muted-foreground text-sm">{detailBanker.established_year}</p>
                        </div>
                      </div>
                    )}
                    {detailBanker.sebi_registration && (
                      <div className="flex gap-3 items-start">
                        <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm">SEBI Registration</p>
                          <p className="text-muted-foreground text-sm font-mono">{detailBanker.sebi_registration}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary to-purple-700 rounded-2xl p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none" />
                  <h3 className="font-bold text-xl mb-2 relative z-10">Need Expert Guidance?</h3>
                  <p className="text-white/80 text-sm mb-5 relative z-10">
                    Connect with {detailBanker.name} for your mainboard IPO journey.
                  </p>
                  <Button
                    onClick={(e) => handleConnect(e, detailBanker)}
                    className="w-full bg-white text-primary hover:bg-white/90 font-bold relative z-10"
                  >
                    Initiate Discussion
                  </Button>
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

  // ─── LISTING VIEW ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="List of Mainboard Merchant Bankers in India - India IPO"
        description="Comprehensive directory of SEBI registered Mainboard Merchant Bankers in India. Compare track records, IPO sizes, and subscription rates."
        keywords="Mainboard Merchant Bankers, SEBI registered, IPO Lead Manager, BRLM India"
      />
      <Header />

      <main className="flex-grow">
        {/* ── Hero ── */}
        <section className="bg-gradient-to-br from-primary via-primary/95 to-purple-700 py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-10 right-10 w-72 h-72 bg-accent rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-10 w-96 h-96 bg-purple-500 rounded-full blur-[150px]" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20 mb-6">
                <Shield className="h-3.5 w-3.5" /> SEBI Registered Merchant Bankers
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-5">
                Mainboard{" "}
                <span className="text-accent">Merchant Bankers</span>
              </h1>
              <p className="text-white/70 max-w-2xl mx-auto mb-8 text-lg">
                India's top SEBI-registered Merchant Bankers for Mainline IPO advisory, book running, and capital markets advisory.
              </p>

              {/* Search */}
              <div className="max-w-xl mx-auto relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 group-focus-within:text-primary transition-colors" />
                <Input
                  type="text"
                  placeholder="Search by name, SEBI number, category..."
                  className="pl-12 pr-4 py-6 text-base rounded-2xl border-0 shadow-2xl bg-white text-foreground w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Quick Stats */}
            {bankers.length > 0 && (
              <div className="mt-12 flex flex-wrap justify-center divide-x divide-white/20">
                <StatCard label="Total Bankers" value={bankers.length} icon={Users} />
                <StatCard label="SEBI Registered" value="100%" icon={Shield} />
                <StatCard label="Track Record" value="25+ Yrs" icon={Award} />
                <StatCard label="Mainboard IPOs" value="500+" icon={TrendingUp} />
              </div>
            )}
          </div>
        </section>

        {/* ── Banker Cards ── */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-card rounded-2xl h-[280px] border border-border animate-pulse" />
                ))}
              </div>
            ) : bankers.length === 0 ? (
              <div className="text-center py-24 bg-card rounded-2xl border border-border">
                <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">No Merchants Found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bankers.map((banker, i) => (
                    <motion.div
                      key={banker.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (i % 9) * 0.05, ease: "easeOut" }}
                      className="bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
                      onClick={() => { setDetailBanker(banker); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    >
                      {/* Card Top gradient bar */}
                      <div className="h-1 w-full bg-gradient-to-r from-primary to-purple-600 group-hover:from-accent group-hover:to-primary transition-all duration-500" />

                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex items-start gap-4 mb-5">
                          <div className="w-16 h-16 rounded-xl bg-white border border-border/50 p-2 shadow-sm shrink-0 flex items-center justify-center overflow-hidden group-hover:border-primary/30 transition-colors">
                            {banker.logo_url ? (
                              <img src={banker.logo_url} alt={banker.name} className="w-full h-full object-contain" />
                            ) : (
                              <Building2 className="w-7 h-7 text-muted-foreground/40" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                              {banker.name}
                            </h3>
                            {banker.location && (
                              <div className="flex items-center text-xs text-muted-foreground mt-1.5">
                                <MapPin className="w-3 h-3 mr-1 shrink-0" />
                                <span className="truncate">{banker.location}</span>
                              </div>
                            )}
                            {banker.sebi_registration && (
                              <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                                <Shield className="w-3 h-3 mr-1 shrink-0 text-brand-green" />
                                <span className="truncate font-mono">{banker.sebi_registration}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2 mb-5 py-4 border-y border-border/50">
                          <div className="text-center">
                            <p className="text-xl font-bold text-primary">{banker.total_ipos || 0}</p>
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mt-0.5">IPOs</p>
                          </div>
                          <div className="text-center border-l border-border/50">
                            <p className="text-xl font-bold text-foreground">{banker.avg_size || 0}</p>
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mt-0.5">Avg Cr</p>
                          </div>
                          <div className="text-center border-l border-border/50">
                            <p className="text-xl font-bold text-foreground">{banker.avg_subscription || 0}x</p>
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mt-0.5">Avg Sub</p>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">
                          {banker.description?.replace(/<[^>]*>/g, '') || banker.services || "SEBI Registered Category-1 Merchant Banker providing bespoke IPO advisory and capital market solutions."}
                        </p>
                      </div>

                      <div className="px-6 pb-6 pt-0 grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          className="w-full border-primary/20 hover:bg-primary/5 text-primary font-semibold"
                          onClick={(e) => { e.stopPropagation(); setDetailBanker(banker); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        >
                          View Details
                        </Button>
                        <Button
                          onClick={(e) => handleConnect(e, banker)}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md shadow-primary/20"
                        >
                          Contact Now
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-12 text-center">
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setPage(p => p + 1)}
                      disabled={loadingMore}
                      className="rounded-full px-10 py-6 text-base font-semibold border-2 border-primary/20 hover:border-primary/50 text-primary hover:bg-primary/5 transition-all"
                    >
                      {loadingMore ? "Loading..." : <>Load More Bankers <ChevronRight className="w-4 h-4 ml-1" /></>}
                    </Button>
                  </div>
                )}
              </>
            )}
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

// ─── Connect Modal ─────────────────────────────────────────────────────────────
const ConnectModal = ({ banker, onClose }: { banker: MainboardBanker; onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    />
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
    >
      {/* Modal Header */}
      <div className="bg-gradient-to-r from-primary to-purple-700 p-6 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="w-14 h-14 rounded-xl bg-white mb-4 p-2 shadow-lg flex items-center justify-center overflow-hidden">
          {banker.logo_url ? (
            <img src={banker.logo_url} alt={banker.name} className="w-full h-full object-contain" />
          ) : (
            <Building2 className="w-8 h-8 text-primary/40" />
          )}
        </div>
        <h2 className="text-xl font-bold mb-1">Connect with {banker.name}</h2>
        <p className="text-white/70 text-sm">Fill in your details to request an introduction.</p>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <label className="text-sm font-semibold mb-1.5 block">Full Name</label>
          <Input placeholder="John Doe" className="bg-background" />
        </div>
        <div>
          <label className="text-sm font-semibold mb-1.5 block">Corporate Email</label>
          <Input type="email" placeholder="john@company.com" className="bg-background" />
        </div>
        <div>
          <label className="text-sm font-semibold mb-1.5 block">Phone Number</label>
          <Input type="tel" placeholder="+91 90000 00000" className="bg-background" />
        </div>

        {/* Direct Contact Info */}
        {(banker.website) && (
          <div className="pt-2 border-t border-border space-y-2">
            {banker.website && (
              <a
                href={banker.website.startsWith('http') ? banker.website : `https://${banker.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Globe className="w-4 h-4 shrink-0 text-primary" />
                {banker.website}
              </a>
            )}
          </div>
        )}

        <Button className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 mt-2">
          Request Introduction
        </Button>
        <p className="text-center text-xs text-muted-foreground/60">
          By submitting, you agree to our privacy policy and terms of service.
        </p>
      </div>
    </motion.div>
  </div>
);

export default MainboardBankersPage;
