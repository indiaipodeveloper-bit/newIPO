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
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchFaqs = async () => {
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

    Promise.all([fetchDetails(), fetchFaqs()]).finally(() => setLoading(false));
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
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <p className="text-4xl font-black text-brand-green font-heading">{registrar.sme_ipo_parentage || '0'}%</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-card border border-border rounded-3xl p-6 shadow-sm"
                >
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 font-heading">SME Avg. Subscription</p>
                  <p className="text-4xl font-black text-blue-500 font-heading">{registrar.avgsubscription_sme || '0'}x</p>
                </motion.div>
             </div>
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
              <div className="space-y-6 font-poppins">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 font-heading">Latest Mainboard IPO</p>
                  <p className="font-bold text-foreground text-lg">{registrar.latest_mainbord || '0'}</p>
                </div>
                <div className="pt-6 border-t border-border/50">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 font-heading">Latest SME IPO</p>
                  <p className="font-bold text-foreground text-lg">{registrar.latest_sme || '0'}</p>
                </div>
                <div className="pt-6 border-t border-border/50">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 font-heading">Mainboard Parentage</p>
                  <p className="font-bold text-foreground text-lg">{registrar.mainboard_ipo_parentage || '0'}%</p>
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
