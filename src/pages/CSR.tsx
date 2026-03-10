import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Heart, Globe, Users, ShieldCheck, ArrowRight, Loader2, Sparkles } from "lucide-react";

interface CSREntry {
  id: number;
  title: string;
  image: string;
  dsc: string;
  status: string;
}

const CSR = () => {
  const [entries, setEntries] = useState<CSREntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCSR = async () => {
      try {
        const res = await fetch("/api/csr");
        if (res.ok) {
          const data = await res.json();
          // Only show published entries
          setEntries(data.filter((e: CSREntry) => e.status === 'published'));
        }
      } catch (err) {
        console.error("Failed to fetch CSR data");
      } finally {
        setLoading(false);
      }
    };
    fetchCSR();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Corporate Social Responsibility (CSR) | IndiaIPO"
        description="Learn about IndiaIPO's commitment to social good, sustainable development, and community empowerment through our Corporate Social Responsibility (CSR) initiatives."
        keywords="Corporate Social Responsibility, CSR India, IndiaIPO CSR, Social Impact, Community Support"
      />
      <Header />

      <main className="flex-1">
        {/* Elegant Hero Section */}
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden bg-foreground text-background">
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-accent/10 blur-[120px] rounded-full" />
             <div className="absolute bottom-0 left-0 -ml-20 mb-20 w-[400px] h-[400px] bg-primary/20 blur-[100px] rounded-full" />
          </div>
          
          <div className="container relative z-10 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground font-bold text-xs mb-8 shadow-lg shadow-accent/20">
                  <Sparkles className="w-4 h-4 fill-accent-foreground" />
                  <span>EMPOWERING COMMUNITIES</span>
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-heading tracking-tight mb-8">
                  Building a Sustainable <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-gold-light">Social Infrastructure</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  At IndiaIPO, we believe that true growth is inclusive. Our CSR initiatives are focused on creating long-term value for society, beyond just financial success.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Vision Stats */}
        <section className="py-20 -mt-10 relative z-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: <Heart className="w-8 h-8 text-red-500" />, label: "Lives Impacted", value: "50,000+" },
                        { icon: <Globe className="w-8 h-8 text-blue-500" />, label: "Locations", value: "24+ Districts" },
                        { icon: <ShieldCheck className="w-8 h-8 text-green-500" />, label: "Core Pillars", value: "Education & Health" },
                    ].map((stat, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-card border border-border p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all text-center flex flex-col items-center"
                        >
                            <div className="mb-4 p-4 bg-muted rounded-2xl">{stat.icon}</div>
                            <div className="text-3xl font-black text-foreground mb-1 font-heading">{stat.value}</div>
                            <div className="text-muted-foreground font-semibold uppercase tracking-widest text-xs">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* Dynamic Initiatives Grid */}
        <section className="py-24 container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 text-center md:text-left">
                <div className="max-w-2xl">
                    <h2 className="text-3xl md:text-5xl font-black font-heading text-foreground mb-6">Our Core CSR Initiatives</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        Explore how we are making a difference through dedicated environmental, educational, and healthcare projects across India.
                    </p>
                </div>
                <div className="hidden lg:block">
                    <Users className="w-20 h-20 text-primary/10" />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">Fetching our latest social impacts...</p>
                </div>
            ) : entries.length === 0 ? (
                <div className="text-center py-20 border border-dashed rounded-3xl bg-muted/30">
                    <p className="text-muted-foreground">Our new CSR initiatives are being cataloged. Check back soon!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {entries.map((entry, idx) => (
                        <motion.div 
                            key={entry.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: (idx % 2) * 0.2 }}
                            className="group"
                        >
                            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl mb-8">
                                {entry.image ? (
                                    <img 
                                        src={entry.image} 
                                        alt={entry.title} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                                        <Heart className="w-20 h-20 text-primary/10" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h3 className="text-2xl font-bold bg-background text-foreground px-4 py-2 inline-block rounded-lg shadow-lg">
                                        {entry.title}
                                    </h3>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    {entry.dsc}
                                </p>
                                <button className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all">
                                    See Project Impact <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </section>

        {/* Commitment Banner */}
        <section className="container mx-auto px-4 mb-24">
            <div className="bg-primary rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013')] opacity-10 bg-cover bg-center grayscale" />
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black font-heading text-primary-foreground mb-8">Partner With Us for Change</h2>
                    <p className="text-primary-foreground/70 text-lg mb-12">
                        Are you an NGO or a social startup looking for strategic support? We are always looking for impactful projects to support.
                    </p>
                    <button className="bg-accent text-accent-foreground px-10 py-5 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-accent/40">
                        Contact CSR Division
                    </button>
                </div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CSR;
