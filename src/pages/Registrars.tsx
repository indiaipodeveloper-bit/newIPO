import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, MapPin, Calendar, ArrowRight, Search, Activity, Users, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

interface Registrar {
  id: number;
  name: string;
  image: string;
  slug: string;
  sme_ipo: string;
  mainboard_ipo: string;
  location: string;
  dic: string;
  registrar_year: string;
  latest_sme: string;
  latest_mainbord: string;
  status: string;
}

const Registrars = () => {
  const [registrars, setRegistrars] = useState<Registrar[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const fetchRegistrars = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/registrars?page=${page}&limit=9`);
      if (res.ok) {
        const body = await res.json();
        setRegistrars(body.data || []);
        setTotalPages(body.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrars();
    window.scrollTo(0, 0);
  }, [page]);

  const filteredRegistrars = registrars.filter(r => 
    (r.name || "").toLowerCase().includes(search.toLowerCase()) || 
    (r.location || "").toLowerCase().includes(search.toLowerCase())
  );

  const getImageUrl = (path: string) => {
    if (!path) return 'https://via.placeholder.com/150';
    if (path.startsWith('http')) return path;
    return window.location.origin + (path.startsWith('/') ? '' : '/') + path;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="List of IPO Registrars"
        description="Explore the comprehensive list of official IPO registrars in India. Check their track record, serviced IPOs, and contact details."
      />
      <Header />

      <main className="font-poppins">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden bg-primary">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-green/20 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20 mb-6 uppercase tracking-wider font-poppins">
                <Activity className="h-3.5 w-3.5" />
                Trusted Intermediaries
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black font-heading text-white mb-6 leading-tight">
                Official IPO <span className="text-accent underline decoration-brand-green underline-offset-8">Registrars</span>
              </h1>
              <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto font-medium font-poppins">
                Comprehensive directory of SEBI-registered registrars facilitating share allotment and registry services for Mainboard and SME IPOs.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search & Filter Bar */}
        <div className="container mx-auto px-4 -mt-10 relative z-20">
          <div className="bg-card border border-border rounded-3xl p-4 shadow-2xl flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search by Registrar Name or Location..." 
                className="pl-12 py-7 rounded-2xl bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary text-base font-poppins"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="bg-primary/5 px-4 py-3 rounded-2xl border border-primary/10 text-primary font-semibold whitespace-nowrap hidden sm:block font-poppins">
                {registrars.length} Registrars Listed
              </div>
            </div>
          </div>
        </div>

        {/* List Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 rounded-3xl bg-muted animate-pulse"></div>
                ))}
              </div>
            ) : filteredRegistrars.length === 0 ? (
              <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border font-poppins">
                <Building2 className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground font-heading">No registrars found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRegistrars.map((r, idx) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-card border border-border rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:border-primary/30 transition-all duration-500 flex flex-col shadow-sm"
                  >
                    {/* Upper Card Part */}
                    <div className="p-8 pb-4 relative">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-20 h-20 rounded-2xl border border-border bg-white p-2 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                          <img 
                            src={getImageUrl(r.image)} 
                            alt={r.name} 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                           {r.registrar_year && (
                             <span className="bg-primary/5 text-primary text-[10px] font-bold px-3 py-1 rounded-full border border-primary/10 flex items-center gap-1">
                               <Calendar className="h-3 w-3" /> Est. {r.registrar_year}
                             </span>
                           )}
                           <span className="bg-brand-green/10 text-brand-green text-[10px] font-bold px-3 py-1 rounded-full border border-brand-green/10 flex items-center gap-1 uppercase tracking-tighter">
                             <Activity className="h-3 w-3" /> SEBI Registered
                           </span>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold font-heading text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                        {r.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                        <MapPin className="h-4 w-4 text-primary" />
                        {r.location || "Head Office, India"}
                      </div>
                    </div>

                    {/* Stats Part */}
                    <div className="px-8 py-6 grid grid-cols-2 gap-4 border-y border-border/50 bg-muted/30">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Mainboard</p>
                        <p className="text-xl font-black text-foreground">{r.mainboard_ipo || '0'}<span className="text-xs font-normal ml-1">IPOs</span></p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">SME Portal</p>
                        <p className="text-xl font-black text-brand-green">{r.sme_ipo || '0'}<span className="text-xs font-normal ml-1 text-muted-foreground">IPOs</span></p>
                      </div>
                    </div>

                    {/* Lower Card Part */}
                    <div className="p-8 pt-6 mt-auto">
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground font-medium">Latest Mainboard:</span>
                          <span className="text-foreground font-bold truncate max-w-[120px]">{r.latest_mainbord || '0'}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground font-medium">Latest SME:</span>
                          <span className="text-foreground font-bold truncate max-w-[120px]">{r.latest_sme || '0'}</span>
                        </div>
                      </div>
                      
                      <Button asChild className="w-full bg-secondary hover:bg-primary hover:text-white text-primary font-bold py-6 rounded-2xl group-hover:shadow-lg transition-all duration-300 border border-primary/10">
                        <Link to={`/list-of-ipo-registrar/${r.slug}`}>
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-12 h-12 rounded-2xl border-border hover:bg-primary hover:text-white transition-all shadow-md"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-12 h-12 rounded-2xl font-bold transition-all shadow-md ${
                        page === i + 1 
                        ? 'bg-primary text-white scale-110' 
                        : 'bg-card border border-border text-muted-foreground hover:border-primary'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="w-12 h-12 rounded-2xl border-border hover:bg-primary hover:text-white transition-all shadow-md"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Unique Feature Section */}
        <section className="py-24 bg-muted/30">
           <div className="container mx-auto px-4">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <motion.div
                 initial={{ opacity: 0, x: -30 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
               >
                 <h2 className="text-3xl md:text-5xl font-black font-heading text-foreground mb-8 leading-tight">
                   Role of a Registrar in <span className="text-primary italic">IPO Allotment</span>
                 </h2>
                 <div className="space-y-6">
                   <div className="flex gap-4">
                     <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                       <Users className="h-7 w-7 text-primary" />
                     </div>
                     <div>
                       <h4 className="font-bold text-xl mb-1 text-foreground">Share Processing</h4>
                       <p className="text-muted-foreground">Registrars handle the massive influx of applications from retail, HNI, and institutional investors during the IPO window.</p>
                     </div>
                   </div>
                   <div className="flex gap-4">
                     <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center shrink-0">
                       <Activity className="h-7 w-7 text-orange-500" />
                     </div>
                     <div>
                       <h4 className="font-bold text-xl mb-1 text-foreground">Basis of Allotment</h4>
                       <p className="text-muted-foreground">They finalize the allotment basis in coordination with Stock Exchanges and SEBI, ensuring fair distribution according to norms.</p>
                     </div>
                   </div>
                   <div className="flex gap-4">
                     <div className="w-14 h-14 rounded-2xl bg-brand-green/10 flex items-center justify-center shrink-0">
                       <Globe className="h-7 w-7 text-brand-green" />
                     </div>
                     <div>
                       <h4 className="font-bold text-xl mb-1 text-foreground">Registry Maintenance</h4>
                       <p className="text-muted-foreground">Post-listing, they maintain the record of shareholders and handle dividends, corporate actions, and transfer requests.</p>
                     </div>
                   </div>
                 </div>
               </motion.div>
               <motion.div 
                 initial={{ opacity: 0, x: 30 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="relative"
               >
                 <div className="absolute inset-0 bg-primary/10 rounded-[3rem] rotate-3 -z-10 scale-105"></div>
                 <div className="bg-card border border-border rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
                      alt="Market Analysis" 
                      className="w-full h-80 object-cover rounded-[2rem] mb-8"
                    />
                    <div className="p-4 bg-primary text-white rounded-3xl text-center shadow-xl">
                      <p className="text-lg font-bold">Official Registrar Support</p>
                      <p className="text-sm opacity-80">Connected with all major RTA agents in India</p>
                    </div>
                 </div>
               </motion.div>
             </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Registrars;
