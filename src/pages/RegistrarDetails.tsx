import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Building2, MapPin, Calendar, Activity, ArrowLeft, 
  Globe, Info, CheckCircle2, ListChecks, HelpCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface IPO {
  id: number;
  issuer_company: string;
  listing_date?: string;
  exchange?: string;
  lot_size?: string;
  issue_size?: string;
  blog_slug?: string;
  logo?: string;
}

interface Registrar {
  id: number;
  name: string;
  image: string;
  slug: string;
  meta_title: string;
  meta_desc: string;
  meta_keywords: string;
  sme_ipo: string;
  mainboard_ipo: string;
  sme_ipo_parentage: string;
  mainboard_ipo_parentage: string;
  avgsubscription_sme: string;
  avgsubscription_mainboard: string;
  location: string;
  dic: string;
  registrar_year: string;
  latest_sme: string;
  latest_mainbord: string;
  latest_sme_ipos?: IPO[];
  latest_mainboard_ipos?: IPO[];
  faqs: string;
  status: string;
}

const RegistrarDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [registrar, setRegistrar] = useState<Registrar | null>(null);
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/registrars/slug/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setRegistrar(data);
          
          // Use registrar-specific faqs if they exist
          if (data.faqs) {
             try {
               const parsedFaqs = JSON.parse(data.faqs);
               if (Array.isArray(parsedFaqs) && parsedFaqs.length > 0) {
                 const normalizedFaqs = parsedFaqs.map((f: any) => ({
                    question: f.q || f.question || "",
                    answer: f.a || f.answer || ""
                 }));
                 setFaqs(normalizedFaqs);
               } else {
                 fetchGlobalFaqs();
               }
             } catch(err) {
               console.error("Failed to parse registrar faqs", err);
               fetchGlobalFaqs();
             }
          } else {
             fetchGlobalFaqs();
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchGlobalFaqs = async () => {
      try {
        const res = await fetch("/api/registrar-faqs/active");
        if (res.ok) {
          const data = await res.json();
          setFaqs(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchDetails().finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!registrar) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Registrar not found</h2>
        <Button asChild><Link to="/list-of-ipo-registrar">Back to List</Link></Button>
      </div>
    );
  }


  const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  );

  const getImageUrl = (path: string) => {
    if (!path) return 'https://via.placeholder.com/150';
    if (path.startsWith('http')) return path;
    return window.location.origin + (path.startsWith('/') ? '' : '/') + path;
  };

  const formatDate = (dateStr: any) => {
    if (!dateStr || dateStr === "0") return "TBA";
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? "TBA" : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    } catch { return "TBA"; }
  };

  const renderIPOGrid = (ipos: IPO[] | undefined, title: string) => {
    if (!ipos || ipos.length === 0) return null;

    return (
      <div className="mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black font-heading text-foreground mb-4 tracking-tight">
            {title}
          </h2>
          <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ipos.map((ipo) => (
            <motion.div
              key={ipo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-primary/5 text-primary text-[10px] font-black px-3 py-1 rounded-full border border-primary/10 uppercase tracking-widest">
                  {ipo.exchange || "BSE, NSE"}
                </span>
              </div>
              
              <div className="mb-6 mt-2">
                <h3 className="text-xl font-black font-heading text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {ipo.issuer_company} IPO
                </h3>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between py-3 border-b border-border/50">
                   <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Listing Date</span>
                   <span className="text-sm font-black text-foreground">{formatDate(ipo.listing_date)}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border/50">
                   <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Lot Size</span>
                   <span className="text-sm font-black text-foreground">{ipo.lot_size || 'TBA'}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                   <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Issue Size</span>
                   <span className="text-sm font-black text-primary italic">₹{ipo.issue_size || '0'} Cr.</span>
                </div>
              </div>

              <Button asChild className="w-full h-12 rounded-2xl font-black bg-primary/10 hover:bg-primary text-primary hover:text-white transition-all border-none">
                <Link to={ipo.blog_slug ? `/ipo-blogs/${ipo.blog_slug}` : `/list-of-ipo-registrar/${slug}`}>
                  View Details
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={registrar.meta_title || registrar.name}
        description={registrar.meta_desc}
        keywords={registrar.meta_keywords}
      />
      <Header />

      <main className="pb-20">
        {/* Banner Section */}
        <div className="h-48 md:h-64 bg-primary relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"></div>
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
           <div className="container mx-auto px-4 h-full flex items-end pb-8 relative z-10">
              <Link to="/list-of-ipo-registrar" className="mb-auto mt-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium font-poppins">
                <ArrowLeft className="h-4 w-4" /> Back to list
              </Link>
           </div>
        </div>

        {/* Profile Header */}
        <div className="container mx-auto px-4 -mt-12 relative z-20">
          <div className="bg-card border border-border rounded-[2.5rem] p-6 md:p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-white border border-border shadow-inner p-4 flex items-center justify-center shrink-0 overflow-hidden">
                <img 
                  src={getImageUrl(registrar.image)} 
                  alt={registrar.name} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="bg-brand-green/10 text-brand-green text-[10px] font-bold px-3 py-1 rounded-full border border-brand-green/10 uppercase tracking-wider h-fit font-poppins">
                    SEBI Registered RTA
                  </span>
                  <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full border border-primary/10 uppercase tracking-wider h-fit font-poppins">
                    Est. {registrar.registrar_year || '0'}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black font-heading text-foreground mb-4 leading-tight">
                  {registrar.name}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-medium font-poppins">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {registrar.location || "Head Office, India"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Official Registrar
                  </div>
                </div>
              </div>
              <div className="w-full md:w-auto">
                <Button asChild className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-bold px-8 py-7 rounded-2xl shadow-lg shadow-primary/20 text-lg font-heading">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <section className="mt-12 mb-16">
          <div className="container mx-auto px-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border rounded-3xl p-6 shadow-sm"
                >
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 font-heading">SME IPOs Serviced</p>
                  <p className="text-4xl font-black text-primary font-heading">{registrar.sme_ipo || '0'}</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-card border border-border rounded-3xl p-6 shadow-sm"
                >
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 font-heading">Mainboard IPOs</p>
                  <p className="text-4xl font-black text-orange-500 font-heading">{registrar.mainboard_ipo || '0'}</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-card border border-border rounded-3xl p-6 shadow-sm"
                >
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 font-heading">SME Parentage</p>
                  <p className="text-4xl font-black text-brand-green font-heading">{registrar.sme_ipo_parentage && String(registrar.sme_ipo_parentage).includes('%') ? registrar.sme_ipo_parentage : (registrar.sme_ipo_parentage || '0') + '%'}</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-card border border-border rounded-3xl p-6 shadow-sm"
                >
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 font-heading">Mainboard Parentage</p>
                  <p className="text-4xl font-black text-brand-green font-heading">{registrar.mainboard_ipo_parentage && String(registrar.mainboard_ipo_parentage).includes('%') ? registrar.mainboard_ipo_parentage : (registrar.mainboard_ipo_parentage || '0') + '%'}</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="bg-card border border-border rounded-3xl p-6 shadow-sm"
                >
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 font-heading">SME Avg. Subscription</p>
                  <p className="text-4xl font-black text-blue-500 font-heading">{registrar.avgsubscription_sme && String(registrar.avgsubscription_sme).includes('x') ? registrar.avgsubscription_sme : (registrar.avgsubscription_sme || '0') + 'x'}</p>
                </motion.div>
             </div>
          </div>
        </section>

        {/* Assisted Banner Section */}
        <section className="mb-20">
           <div className="container mx-auto px-4">
              <div className="bg-primary rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden text-center">
                 <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                 <div className="relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black font-heading mb-8 tracking-tight">
                       {registrar.name} IPOs Assisted So Far
                    </h2>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                       <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 min-w-[200px]">
                          <p className="text-6xl font-black mb-2">{Number(registrar.mainboard_ipo || 0) + Number(registrar.sme_ipo || 0)}</p>
                          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">Total IPOs Processed</p>
                       </div>
                       <div className="flex gap-8">
                          <div className="text-center">
                             <p className="text-4xl font-black mb-1 text-orange-400">{registrar.mainboard_ipo || '0'}</p>
                             <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Mainboard IPOs</p>
                          </div>
                          <div className="w-px h-12 bg-white/20"></div>
                          <div className="text-center">
                             <p className="text-4xl font-black mb-1 text-green-400">{registrar.sme_ipo || '0'}</p>
                             <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">SME IPOs</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Latest IPOs Grid Section */}
        <section className="mb-24">
           <div className="container mx-auto px-4">
              {renderIPOGrid(registrar.latest_sme_ipos, "Latest SME IPOs")}
              {renderIPOGrid(registrar.latest_mainboard_ipos, "Latest Mainboard IPOs")}
           </div>
        </section>

        {/* Content Section */}
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-3xl font-bold font-heading text-foreground mb-6 flex items-center gap-3">
                <Info className="h-7 w-7 text-primary" />
                About {registrar.name}
              </h2>
              <div 
                className="prose prose-lg max-w-none text-muted-foreground leading-relaxed font-poppins registrar-description"
                dangerouslySetInnerHTML={{ 
                  __html: registrar.dic || `<p>Information about ${registrar.name} is currently being updated by our research team.</p>` 
                }}
              />
            </div>

            {faqs.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold font-heading text-foreground mb-6 flex items-center gap-3">
                  <HelpCircle className="h-7 w-7 text-primary" />
                  Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {faqs.map((faq, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`} className="border border-border rounded-2xl overflow-hidden bg-white shadow-sm">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline font-bold text-foreground hover:bg-muted/30 transition-colors">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 py-4 text-muted-foreground leading-relaxed pb-6">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Stats Sidebar */}
            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-heading">
                <ListChecks className="h-5 w-5 text-primary" />
                Performance Summary
              </h3>
              <div className="space-y-6 font-poppins text-center">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 font-heading">Mainboard Parentage</p>
                  <p className="font-black text-primary text-3xl">
                    {registrar.mainboard_ipo_parentage && String(registrar.mainboard_ipo_parentage).includes('%') ? registrar.mainboard_ipo_parentage : (registrar.mainboard_ipo_parentage || '0') + '%'}
                  </p>
                </div>
              </div>
            </div>

            {/* Service Highlights */}
            <div className="bg-primary rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Building2 className="h-32 w-32" />
              </div>
              <h3 className="text-xl font-bold mb-6 relative z-10">Registry Services</h3>
              <ul className="space-y-4 relative z-10 opacity-90">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>IPO Application Processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>Basis of Allotment Finalization</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>Refund & Share Credit</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>Dividend Disbursal</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegistrarDetails;
