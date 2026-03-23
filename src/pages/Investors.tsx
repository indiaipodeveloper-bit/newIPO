import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, TrendingUp, Shield, CheckCircle, ArrowRight, BarChart3, Briefcase, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

const benefits = [
  { icon: TrendingUp, title: "Expert Market Analysis", desc: "Access real-time GMP data, subscription status, and listing performance analysis." },
  { icon: Shield, title: "SEBI Compliant", desc: "All our advisory services are fully compliant with SEBI regulations and guidelines." },
  { icon: Users, title: "Dedicated Support", desc: "Get personalized IPO investment guidance from our expert wealth management team." },
  { icon: CheckCircle, title: "Proven Track Record", desc: "Over 450+ successful IPO listings evaluated with a 98% accuracy rate." },
];

const stats = [
  { label: "Active Investors", value: "50,000+" },
  { label: "Capital Advised", value: "₹5,000 Cr+" },
  { label: "Years of Experience", value: "15+" },
  { label: "Research Reports", value: "1,200+" }
];

const Investors = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    ticket_size: "",
    industry: "",
    roi: "",
    tenure: "",
    inv_type: "",
    buss_type: "",
    vintage: "",
    query: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobile) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/investor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to submit enquiry");
      }

      toast.success("Thank you! Your enquiry has been submitted. Our team will contact you shortly.");
      setFormData({ name: "", mobile: "", email: "", ticket_size: "", industry: "", roi: "", tenure: "", inv_type: "", buss_type: "", vintage: "", query: "" });
    } catch (err: any) {
      toast.error(err.message || "An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="For Investors | Professional Services" description="Premium IPO investment tools, private equity opportunities, GMP tracking, and expert advisory for HNI and institutional investors." />
      <Header />
      
      <main className="flex-1 bg-background">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 bg-black">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000" 
              alt="Investors" 
              className="w-full h-full object-cover opacity-50"
            />
          </div>
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-background/80 to-transparent bottom-0 h-32 mt-auto" />
          
          <div className="container relative z-10 px-4 pt-20">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary-foreground backdrop-blur-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-sm font-semibold tracking-wide uppercase">Premium Investor Services</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading text-white mb-6 leading-tight drop-shadow-lg">
                Maximize Your <br/><span className="text-accent text-transparent bg-clip-text bg-gradient-to-r from-accent to-gold-light">Investment Potential</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl leading-relaxed drop-shadow-md">
                Join India's leading platform for data-driven IPO analysis, unlisted shares, and exclusive wealth creation opportunities tailored for discerning investors.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-gold-light font-bold h-12 px-8 rounded-full shadow-lg" onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })}>
                  Partner With Us
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 rounded-full border-white/30 text-black hover:bg-white/10 backdrop-blur-sm" onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}>
                  Explore Benefits
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative -mt-16 z-20 container mx-auto px-4 mb-20">
          <div className="bg-card border border-border shadow-2xl rounded-2xl p-8 backdrop-blur-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border/50">
              {stats.map((stat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center px-4"
                >
                  <h4 className="text-3xl md:text-4xl font-bold font-heading text-primary mb-2">{stat.value}</h4>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[500px]">
                  <img 
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1000" 
                    alt="Corporate Meeting" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                    <div className="text-white">
                      <h3 className="text-2xl font-bold font-heading mb-2">Institutional Grade Research</h3>
                      <p className="text-white/80">Delivering actionable insights backed by rigorous fundamental analysis.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground">Why High Net-Worth Individuals Choose Us</h2>
                <div className="w-20 h-1.5 bg-accent rounded-full mb-6" />
                <p className="text-lg text-muted-foreground leading-relaxed">
                  In today's dynamic capital markets, securing alpha requires more than just public data. It demands proprietary insights, priority access, and a deep understanding of market sentiment.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our investor services are designed exclusively for HNIs, family offices, and institutional investors seeking curated opportunities in upcoming IPOs, Pre-IPO placements, and unlisted equities. We provide end-to-end advisory—from early-stage evaluation to optimal listing-day exit strategies.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <BarChart3 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">Data-Driven</h4>
                      <p className="text-sm text-muted-foreground mt-1">Quantitative models for precise valuations.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Briefcase className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">Exclusive Access</h4>
                      <p className="text-sm text-muted-foreground mt-1">Priority allocation networks.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Benefits Grid Section */}
        <section id="benefits" className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">Our Core Competencies</h2>
              <p className="text-lg text-muted-foreground">Comprehensive coverage across the entire spectrum of primary market investments.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="group bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:border-primary/40 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-150 transition-transform duration-500 pointer-events-none">
                      <Icon className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Icon className="h-8 w-8 text-primary shadow-primary/20 drop-shadow-sm" />
                      </div>
                      <h3 className="text-xl font-bold font-heading text-foreground mb-3">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Enquiry Form & Quick Links Section */}
        <section id="enquiry-form" className="py-24 bg-foreground text-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
              
              {/* Form Side */}
              <div className="lg:col-span-3">
                <div className="bg-background text-foreground rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary" />
                  <h2 className="text-3xl font-bold font-heading mb-2">Request Investor Advisory</h2>
                  <p className="text-muted-foreground mb-8">Leave your details and our senior wealth manager will connect with you.</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Full Name *</label>
                        <Input 
                          placeholder="John Doe" 
                          className="bg-muted/50 border-transparent focus:bg-background h-12" 
                          value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Email Address *</label>
                        <Input 
                          type="email" 
                          placeholder="john@example.com" 
                          className="bg-muted/50 border-transparent focus:bg-background h-12" 
                          value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Mobile Number *</label>
                        <Input 
                          type="tel" 
                          placeholder="+91 74283 37280" 
                          className="bg-muted/50 border-transparent focus:bg-background h-12" 
                          value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Ticket Size</label>
                        <Input 
                          placeholder="e.g. ₹50 Lakhs - ₹1 Crore" 
                          className="bg-muted/50 border-transparent focus:bg-background h-12" 
                          value={formData.ticket_size} onChange={e => setFormData({...formData, ticket_size: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Industry</label>
                        <Input 
                          placeholder="e.g. IT, Healthcare, Real Estate" 
                          className="bg-muted/50 border-transparent focus:bg-background h-12" 
                          value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Expected ROI</label>
                        <Input 
                          placeholder="e.g. 15-20% annually" 
                          className="bg-muted/50 border-transparent focus:bg-background h-12" 
                          value={formData.roi} onChange={e => setFormData({...formData, roi: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Investment Tenure</label>
                        <Input 
                          placeholder="e.g. 3-5 Years" 
                          className="bg-muted/50 border-transparent focus:bg-background h-12" 
                          value={formData.tenure} onChange={e => setFormData({...formData, tenure: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Investment Type</label>
                        <Input 
                          placeholder="e.g. Equity, Debt, Hybrid" 
                          className="bg-muted/50 border-transparent focus:bg-background h-12" 
                          value={formData.inv_type} onChange={e => setFormData({...formData, inv_type: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Business Type</label>
                        <Input 
                          placeholder="e.g. B2B, B2C, SaaS" 
                          className="bg-muted/50 border-transparent focus:bg-background h-12" 
                          value={formData.buss_type} onChange={e => setFormData({...formData, buss_type: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold">Vintage</label>
                        <Input 
                          placeholder="e.g. 5+ Years" 
                          className="bg-muted/50 border-transparent focus:bg-background h-12" 
                          value={formData.vintage} onChange={e => setFormData({...formData, vintage: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold">Query / Message</label>
                        <Textarea 
                          placeholder="Briefly describe your investment goals..." 
                          className="bg-muted/50 border-transparent focus:bg-background min-h-[120px] resize-none" 
                          value={formData.query} onChange={e => setFormData({...formData, query: e.target.value})}
                        />
                      </div>
                    </div>
                    <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-primary hover:bg-primary/90 rounded-xl">
                      {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin"/> Processing...</> : "Submit Enquiry"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center sm:text-left mt-4">
                      By submitting this form, you agree to our privacy policy and consent to being contacted by our team.
                    </p>
                  </form>
                </div>
              </div>

              {/* Quick Links Side */}
              <div className="lg:col-span-2 flex flex-col justify-center">
                <h3 className="text-2xl font-bold font-heading mb-6 text-white">Investor Resources</h3>
                <p className="text-white/70 mb-8 max-w-md leading-relaxed">
                  Access our suite of tools designated to guide your market decisions and maintain an edge in capital allocation.
                </p>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "View IPO Calendar", desc: "Track upcoming listings", href: "/ipo-calendar" },
                    { label: "Live GMP Tracker", desc: "Real-time grey market premium", href: "/#gmp" },
                    { label: "Valuation Calculator", desc: "Compute potential listing gains", href: "/ipo-calculator" },
                    { label: "Deep-dive Reports", desc: "Institutional grade DRHP analysis", href: "/reports" },
                  ].map((link) => (
                    <Link key={link.label} to={link.href} className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-accent/50 transition-all flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-lg text-white group-hover:text-accent transition-colors">{link.label}</h4>
                        <p className="text-white/60 text-sm mt-1">{link.desc}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Investors;
