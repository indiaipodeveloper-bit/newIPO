import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  ChevronLeft, Send, Users, Building2, Mail, Phone, 
  MessageSquare, CheckCircle2, Award, Briefcase, 
  MapPin, Star, ShieldCheck, TrendingUp, Sparkles,
  Target, Rocket, ClipboardCheck, BarChart3, Globe2,
  FileText, ShieldAlert, Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Consultant {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  experience_years: number;
  specialization: string | null;
  office_location: string | null;
  success_stories: string | null;
  tags: string | null;
}

const ConsultantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organisation: "",
    message: ""
  });

  useEffect(() => {
    fetch(`/api/consultants/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setConsultant(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Consultant not found");
        navigate("/consultants");
      });
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      return toast.error("Please fill in all required fields.");
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/consultant-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultant_id: id,
          ...formData
        })
      });

      if (res.ok) {
        setSubmitted(true);
        toast.success("Enquiry submitted successfully!");
      } else {
        throw new Error("Failed to submit");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tagsList = consultant?.tags ? consultant.tags.split(',').map(t => t.trim()) : ['IPO', 'Listing', 'Corporate Advisory'];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Dynamic Header / Hero Area */}
      <div className="pt-32 pb-16 bg-gradient-to-b from-primary/10 via-primary/5 to-background border-b border-border">
        <div className="container mx-auto px-4">
          <Link to="/consultants" className="inline-flex items-center text-primary font-bold mb-8 hover:underline group">
            <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" /> Back to Consultants
          </Link>
          
          <div className="flex flex-col lg:flex-row items-center lg:items-end gap-10">
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-[2.5rem] bg-card border-4 border-background shadow-2xl shadow-primary/10 overflow-hidden flex items-center justify-center shrink-0 relative">
              {consultant?.image_url ? (
                <img src={`/${consultant.image_url}`} alt={consultant.name} className="w-full h-full object-cover" />
              ) : (
                <Users className="h-20 w-20 text-primary/20" />
              )}
            </div>
            
            <div className="flex-1 text-center lg:text-left space-y-4">
              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                <Badge className="bg-primary text-primary-foreground px-3 py-1 font-bold">
                  {consultant?.experience_years ? `${consultant.experience_years}+ Years Experience` : "Expert IPO Advisor"}
                </Badge>
                <Badge variant="outline" className="bg-background/50 backdrop-blur-sm flex items-center gap-1 border-primary/20 text-primary font-bold">
                  <MapPin className="h-3 w-3" /> {consultant?.office_location || "India"}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground font-heading tracking-tight leading-tight">
                {consultant?.name}
              </h1>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 items-center">
                <div className="flex items-center gap-1.5 text-accent font-bold">
                  <Star className="h-4 w-4 fill-accent" />
                  <Star className="h-4 w-4 fill-accent" />
                  <Star className="h-4 w-4 fill-accent" />
                  <Star className="h-4 w-4 fill-accent" />
                  <Star className="h-4 w-4 fill-accent" />
                  <span className="text-muted-foreground text-sm ml-1">(Premium Verified Expert)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Main Content Side */}
          <div className="lg:col-span-2 space-y-20">
            
            {/* About / Description */}
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl shadow-inner border border-primary/20">
                  <ShieldCheck className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-foreground font-heading tracking-tight">Profile Overview</h2>
                  <div className="h-1.5 w-20 bg-primary mt-1 rounded-full" />
                </div>
              </div>
              <div className="prose prose-slate max-w-none">
                <p className="text-xl text-muted-foreground leading-relaxed whitespace-pre-wrap font-medium border-l-4 border-primary/30 pl-6 italic">
                  {consultant?.description || "With a focus on delivering end-to-end IPO solutions, our consultancy specializes in preparing companies for the public markets."}
                </p>
              </div>
              {consultant?.specialization && (
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <Target className="h-4 w-4" /> Areas of Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {consultant.specialization.split(',').map((spec, i) => (
                      <Badge key={i} variant="secondary" className="px-6 py-2.5 rounded-2xl text-sm font-bold bg-muted border border-border/50 text-foreground hover:bg-primary/10 hover:border-primary/30 transition-all cursor-default shadow-sm text-center">
                        {spec.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Methodology Section (New) */}
            <section className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-2xl shadow-inner border border-accent/20">
                  <ClipboardCheck className="h-7 w-7 text-accent" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-foreground font-heading tracking-tight">Advisory Methodology</h2>
                  <div className="h-1.5 w-20 bg-accent mt-1 rounded-full" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    title: "Strategic Readiness",
                    desc: "Comprehensive diagnostic of financial, legal, and operational health to ensure 100% IPO viability.",
                    icon: <BarChart3 className="h-6 w-6" />
                  },
                  {
                    title: "Regulatory Liaison",
                    desc: "Direct coordination with SEBI, ROC, and Exchanges to facilitate rapid multi-stage approvals.",
                    icon: <Globe2 className="h-6 w-6" />
                  },
                  {
                    title: "Investor Storyboarding",
                    desc: "Crafting a compelling narrative that resonates with institutional, DII, and retail investors alike.",
                    icon: <FileText className="h-6 w-6" />
                  },
                  {
                    title: "Listing Management",
                    desc: "Advanced support through price band discovery, subscription management, and post-listing stabilization.",
                    icon: <Rocket className="h-6 w-6" />
                  }
                ].map((item, i) => (
                  <div key={i} className="p-8 bg-card border border-border rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 group">
                    <div className="h-14 w-14 bg-muted rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 font-heading">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Success Stories */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl shadow-inner border border-primary/20">
                  <TrendingUp className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-foreground font-heading tracking-tight">Proven Track Record</h2>
                  <div className="h-1.5 w-20 bg-primary mt-1 rounded-full" />
                </div>
              </div>
              
              {consultant?.success_stories ? (
                <div className="bg-card border-2 border-primary/10 rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-primary/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Sparkles className="h-48 w-48 text-primary" />
                  </div>
                  <div className="relative z-10">
                    <Quote className="h-12 w-12 text-primary/20 mb-6" />
                    <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-xl font-medium line-clamp-none italic">
                      {consultant.success_stories}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    "Handled 15+ SME IPOs with substantial oversubscriptions",
                    "Achieved 100% success rate in regulatory clearance",
                    "Expert guidance for complex post-listing compliances",
                    "Facilitated pre-IPO investment syndication for diverse sectors"
                  ].map((item, i) => (
                    <div key={i} className="flex gap-5 p-8 bg-muted/40 rounded-3xl border border-border items-start shadow-sm hover:shadow-md transition-shadow">
                      <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      </div>
                      <p className="font-bold text-foreground leading-snug">{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Process Timeline (New) */}
            <section className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-2xl shadow-inner border border-secondary/20">
                  <BarChart3 className="h-7 w-7 text-secondary" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-foreground font-heading tracking-tight">IPO Journey Roadmap</h2>
                  <div className="h-1.5 w-20 bg-secondary mt-1 rounded-full" />
                </div>
              </div>
              
              <div className="relative pl-8 space-y-12 before:absolute before:left-[1.375rem] before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-accent before:to-muted">
                {[
                  { step: "01", title: "Preliminary Audit", desc: "Evaluating current governance and financial maturity." },
                  { step: "02", title: "Internal Restructuring", desc: "Capitalizing reserves and defining board independence." },
                  { step: "03", title: "Drafting & Filing", desc: "Compiling DRHP in accordance with SEBI ICDR guidelines." },
                  { step: "04", title: "Market Engagement", desc: "Institutional roadshows and price discovered bidding." }
                ].map((item, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[1.8125rem] h-11 w-11 bg-background border-4 border-primary rounded-full flex items-center justify-center text-xs font-black shadow-lg">
                      {item.step}
                    </div>
                    <div className="pl-6">
                      <h4 className="text-xl font-black mb-2">{item.title}</h4>
                      <p className="text-muted-foreground font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Tags Cloud */}
            <section className="space-y-4 pt-10 border-t border-border">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Expertise Keywords</h3>
              <div className="flex flex-wrap gap-2.5">
                {tagsList.map((tag, i) => (
                  <span key={i} className="text-sm font-bold px-4 py-1.5 bg-muted/60 border border-border rounded-xl text-muted-foreground hover:bg-muted hover:text-primary transition-colors cursor-default">
                    #{tag}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-card border-2 border-primary/20 rounded-[3.5rem] p-10 md:p-12 shadow-2xl shadow-primary/10 relative overflow-hidden">
                {/* Visual Flair */}
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/5 rounded-full blur-2xl" />
                <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-accent/5 rounded-full blur-xl" />
                
                {submitted ? (
                  <div className="text-center py-12 space-y-8 relative z-10">
                    <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-inner border-2 border-green-200">
                      <CheckCircle2 className="h-14 w-14 text-green-600 animate-bounce" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-4xl font-black font-heading tracking-tight">Success!</h3>
                      <p className="text-muted-foreground font-semibold text-lg">
                        Your strategic interest in <span className="text-primary">{consultant?.name}</span> has been securely transmitted.
                      </p>
                      <p className="text-sm text-muted-foreground pt-4">
                        A senior deployment partner will contact you within 
                        <span className="text-foreground font-bold"> 4-6 business hours</span>.
                      </p>
                    </div>
                    <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-8 rounded-2xl px-10 py-6 h-auto text-lg font-bold border-primary/20 hover:bg-primary/5 transition-all">
                      Open New Enquiry
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                    <div className="text-center md:text-left space-y-3">
                      <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-widest px-3 mb-2">PRIORITY CHANNEL</Badge>
                      <h3 className="text-4xl font-black font-heading tracking-tight leading-none text-foreground">Secure Listing Consultation</h3>
                      <p className="text-base text-muted-foreground font-semibold">Ready to scale? Connect with our top-tier advisory team today.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2.5">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                          <Users className="h-3.5 w-3.5" /> Full Name
                        </label>
                        <Input 
                          placeholder="Rajesh Kumar" 
                          required 
                          className="bg-muted/30 border-border/50 rounded-2xl h-14 focus:ring-primary/20 text-base font-medium transition-all hover:bg-muted/50"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2.5">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5" /> Work Email
                        </label>
                        <Input 
                          type="email" 
                          placeholder="rajesh@fortune500.in" 
                          required 
                          className="bg-muted/30 border-border/50 rounded-2xl h-14 focus:ring-primary/20 text-base font-medium transition-all hover:bg-muted/50"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2.5">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5" /> Mobile
                          </label>
                          <Input 
                            type="tel" 
                            placeholder="+91..." 
                            className="bg-muted/30 border-border/50 rounded-2xl h-14 focus:ring-primary/20 text-base font-medium transition-all hover:bg-muted/50"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                            <Building2 className="h-3.5 w-3.5" /> Organisation
                          </label>
                          <Input 
                            placeholder="Org Name" 
                            className="bg-muted/30 border-border/50 rounded-2xl h-14 focus:ring-primary/20 text-base font-medium transition-all hover:bg-muted/50"
                            value={formData.organisation}
                            onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                          <MessageSquare className="h-3.5 w-3.5" /> Why Listing Now?
                        </label>
                        <textarea 
                          className="w-full min-h-[160px] px-5 py-4 rounded-[2rem] border border-border/50 bg-muted/30 text-base font-medium ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all hover:bg-muted/50"
                          placeholder="Describe your current capital needs or listing questions..." 
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Button type="submit" className="w-full h-16 text-xl font-black rounded-2xl shadow-2xl shadow-primary/30 group relative overflow-hidden transition-all active:scale-[0.98]" disabled={submitting}>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-shimmer" />
                        <span className="relative z-10 flex items-center justify-center">
                          {submitting ? "Processing..." : (
                            <>
                              Initialize Consultation <Send className="h-6 w-6 ml-3 transition-transform group-hover:translate-x-1.5 group-hover:-translate-y-0.5" />
                            </>
                          )}
                        </span>
                      </Button>
                      
                      <div className="flex flex-col gap-3 py-4 border-y border-border/50">
                        <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                          <ShieldAlert className="h-4 w-4 text-primary" /> Data Encryption Active
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                          <Zap className="h-4 w-4 text-yellow-500" /> Response in under 60 mins
                        </div>
                      </div>

                      <p className="text-[10px] text-center text-muted-foreground leading-relaxed px-4 font-bold border border-muted p-2.5 rounded-2xl bg-muted/20">
                        Disclaimer: India IPO facilitates expert connections. Strategic decisions should be made in consultation with certified financial stakeholders.
                      </p>
                    </div>
                  </form>
                )}
              </div>
              
              {/* Trust Badges */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-card p-6 rounded-[2.5rem] border border-border flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow group">
                  <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase text-foreground leading-tight tracking-wider">Top-Tier<br/>Advisory</span>
                </div>
                <div className="bg-card p-6 rounded-[2.5rem] border border-border flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow group">
                  <div className="h-10 w-10 bg-accent/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-accent group-hover:text-primary-foreground transition-all">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase text-foreground leading-tight tracking-wider">SEBI Fixed<br/>Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Help icon for success stories
const Quote = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 21c3 0 7-1 7-8V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h4c0 1.5-1 3-2 4a12.8 12.8 0 0 1-3 1" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h4c0 1.5-1 3-2 4a12.8 12.8 0 0 1-3 1" />
  </svg>
);

export default ConsultantDetail;
