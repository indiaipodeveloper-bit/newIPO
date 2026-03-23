import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import {
  ChevronRight, Users, MapPin, Award, ArrowRight, Star,
  CheckCircle2, Home, Shield, TrendingUp, Building2, Zap
} from "lucide-react";

interface Consultant {
  id: string; name: string; description: string | null;
  image_url: string | null; specialization: string | null;
  office_location: string | null; experience_years: number;
}

const N = "#001529", G = "#f59e08", G2 = "#d97706";

const ConsultantPage = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/consultants")
      .then(r => r.json())
      .then(data => { setConsultants(data.filter((c: any) => c.is_active)); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <SEOHead
        title="IPO Consultants in India | IndiaIPO — Expert SEBI Advisory"
        description="Partner with India's most trusted IPO consultants. SEBI-compliant advisory for SME and Mainboard IPOs. Expert guidance for a successful public listing."
        keywords="IPO consultants India, SEBI advisory, SME IPO consultant, mainboard IPO expert, capital market advisory India, IPO listing guidance"
      />
      <Header />

      {/* ── HERO ── */}
      <section className="py-16 lg:py-24 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${N} 0%, #002147 55%, #003380 100%)` }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-5"
            style={{ background: G, filter: "blur(100px)", transform: "translate(25%,-25%)" }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-5"
            style={{ background: "#3b82f6", filter: "blur(80px)", transform: "translate(-20%,20%)" }} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: `linear-gradient(90deg, ${N}, ${G}, ${N})` }} />

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/50 text-sm mb-8 flex-wrap justify-center">
            <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors">
              <Home className="h-3.5 w-3.5" /> Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white/90 font-semibold">IPO Consultants</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 text-xs font-black uppercase tracking-widest"
              style={{ background: "rgba(245,158,8,0.2)", color: G, border: "1px solid rgba(245,158,8,0.35)" }}>
              <Award className="h-3.5 w-3.5" /> Expert IPO Advisory
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
              Professional{" "}
              <span style={{ color: G }}>IPO Consultants</span>{" "}
              for Your Growth Journey
            </h1>
            <p className="text-white/65 text-base md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
              Partner with India's most trusted IPO specialists. We connect ambitious businesses with the right consultants to ensure a successful public listing.
            </p>
            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: Star, label: "4.9/5 Average Rating", color: G },
                { icon: CheckCircle2, label: "SEBI Compliant Advisory", color: "#86efac" },
                { icon: Shield, label: "100% Registered Experts", color: G },
              ].map((b, i) => (
                <span key={i} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <b.icon className="h-4 w-4" style={{ color: b.color }} />
                  {b.label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TRUST STATS ── */}
      <section style={{ background: `linear-gradient(135deg, ${N}, #003380)` }} className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, value: "100+", label: "Companies Guided" },
              { icon: MapPin, value: "Pan-India", label: "Office Presence" },
              { icon: Award, value: "SEBI", label: "Compliant Advisory" },
              { icon: TrendingUp, value: "500+", label: "Successful IPOs" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center py-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-2">
                  <s.icon className="h-5 w-5" style={{ color: G }} />
                </div>
                <p className="text-xl font-black text-white mb-0.5">{s.value}</p>
                <p className="text-xs text-white/50 font-bold uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONSULTANTS GRID ── */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 rounded-full" style={{ background: G }} />
            <h2 className="text-2xl font-black" style={{ color: N }}>Our Expert Consultants</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-white border border-slate-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : consultants.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <Users className="w-14 h-14 mx-auto mb-4 text-slate-200" />
              <h3 className="text-xl font-black mb-2" style={{ color: N }}>No consultants available</h3>
              <p className="text-slate-400 font-medium">Please check back soon for our expert listing.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {consultants.map((c, idx) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: idx * 0.07 }}
                  className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col">
                  {/* Top accent */}
                  <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${N}, ${G})` }} />

                  {/* Image */}
                  <div className="h-52 bg-slate-100 overflow-hidden relative">
                    {c.image_url ? (
                      <img src={`/${c.image_url}`} alt={c.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, rgba(0,21,41,0.06), rgba(245,158,8,0.06))` }}>
                        <Users className="h-16 w-16 text-slate-200" />
                      </div>
                    )}
                    {c.office_location && (
                      <div className="absolute top-3 right-3">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black backdrop-blur-md"
                          style={{ background: "rgba(0,21,41,0.75)", color: G }}>
                          <MapPin className="h-3 w-3" /> {c.office_location}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest mb-3" style={{ color: G2 }}>
                      <Award className="h-3.5 w-3.5" /> {c.specialization || "SME & Mainboard IPO"}
                    </div>
                    <h3 className="text-lg font-black leading-snug mb-3 line-clamp-2 transition-colors group-hover:text-[#f59e08]"
                      style={{ color: N }}>
                      {c.name}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-3 mb-5 leading-relaxed font-medium">
                      {c.description || "Leading strategic IPO advisory firm focused on helping companies achieve successful listings on NSE Emerge and BSE SME platforms."}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-slate-400 block mb-0.5 font-medium">Experience</span>
                        <span className="font-black" style={{ color: N }}>
                          {c.experience_years ? `${c.experience_years}+ Years` : "Expert Team"}
                        </span>
                      </div>
                      <Link to={`/consultants/${c.id}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all hover:scale-105"
                        style={{ background: `linear-gradient(135deg, ${N}, #003380)`, color: "white" }}>
                        View Details <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 text-xs font-black uppercase tracking-widest"
              style={{ background: "rgba(245,158,8,0.12)", color: G2, border: "1px solid rgba(245,158,8,0.25)" }}>
              <Shield className="h-3.5 w-3.5" /> Why Choose IndiaIPO
            </div>
            <h2 className="text-3xl font-black mb-3" style={{ color: N }}>Trusted by <span style={{ color: G }}>Hundreds of Companies</span></h2>
            <p className="text-slate-500 max-w-xl mx-auto font-medium">Our team brings unmatched expertise in capital markets, regulatory compliance, and successful IPO execution.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users, value: "100+", label: "Companies Guided", desc: "Successfully guided through their IPO journey with end-to-end support." },
              { icon: MapPin, value: "Pan-India", label: "Coverage", desc: "Expert consultants in Mumbai, Delhi, Ahmedabad, Kolkata, and more." },
              { icon: Award, value: "SEBI", label: "Compliance", desc: "Ensuring all advisory follows stringent regulatory frameworks for transparency." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group text-center p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-[#f59e08]/40 hover:-translate-y-1 transition-all">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all group-hover:scale-110"
                  style={{ background: "rgba(0,21,41,0.06)" }}>
                  <item.icon className="h-8 w-8" style={{ color: N }} />
                </div>
                <p className="text-2xl font-black mb-1" style={{ color: G }}>{item.value}</p>
                <h3 className="text-lg font-black mb-3" style={{ color: N }}>{item.label}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${N}, #002147, #003380)` }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
          style={{ background: G, filter: "blur(80px)", transform: "translate(20%,-30%)" }} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            Ready to <span style={{ color: G }}>Go Public?</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto font-medium mb-8 leading-relaxed">
            Connect with our expert IPO consultants today and take the first step toward a successful public listing on NSE or BSE.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base transition-all hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${G}, ${G2})`, color: N, boxShadow: "0 8px 32px rgba(245,158,8,0.35)" }}>
              Get Free Consultation <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/ipo-feasibility"
              className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base text-white border border-white/25 hover:bg-white/10 transition-all">
              <Zap className="h-5 w-5" style={{ color: G }} /> Check IPO Eligibility
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ConsultantPage;
