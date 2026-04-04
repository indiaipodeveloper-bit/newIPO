import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, CheckCircle, ChevronRight, FileSearch, LineChart, Target, ShieldCheck, Landmark } from "lucide-react";
import { useState, useEffect } from "react";
import { getImageUrl } from "@/lib/utils";

const PreIPOProcess = () => {
  const [bannerVideo, setBannerVideo] = useState<string | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`/api/banners?page=${encodeURIComponent(pathname)}`);
        if (res.ok) {
          const data = await res.json();
          const videoBanner = data.find((b: any) => b.video_url);
          if (videoBanner) setBannerVideo(videoBanner.video_url);
        }
      } catch (err) { console.error(err); }
    };
    fetchBanners();
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Pre-IPO Process Guidance | Complete Readiness for Unlisted Companies"
        description="Comprehensive Pre-IPO consulting. Discover how to prepare your company financially, legally, and strategically 1-2 years before an Initial Public Offering in India."
        keywords="Pre-IPO preparation, IPO readiness, Corporate governance, Private Equity before IPO, HNI funding, Financial Restructuring, SME IPO preparation"
      />
      <Header />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section 
          className="pt-20 pb-28 px-4 relative overflow-hidden bg-[#001529]"
        >
          {/* Background Video */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-30"
              src={getImageUrl(bannerVideo || "/uploads/video/ccvindia1.mp4")}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#001529]/80 via-[#001529]/40 to-[#001529]" />
          </div>
          {/* Background blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full"
              style={{ background: '#f59e08', filter: 'blur(100px)', opacity: 0.05, transform: 'translate(25%,-25%)' }} />
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
              style={{ background: '#3b82f6', filter: 'blur(80px)', opacity: 0.05, transform: 'translate(-20%,20%)' }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-white/70 mb-8 font-medium">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/ipo-knowledge" className="hover:text-white transition-colors">IPO Knowledge</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Pre-IPO Guidance</span>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
              <div 
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl"
                style={{ 
                  background: 'linear-gradient(135deg, hsl(35 95% 52%), hsl(45 93% 65%))',
                  color: 'white'
                }}
              >
                <FileSearch className="w-12 h-12 md:w-16 md:h-16" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-[#f59e08]/20 border border-[#f59e08]/30 rounded-full px-4 py-1.5 mb-6">
                  <div className="w-2 h-2 rounded-full bg-[#f59e08]" />
                  <span className="text-[#f59e08] text-xs font-black uppercase tracking-widest">Expert Consultancy</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  The Blueprint for Pre-IPO Readiness
                </h1>
                <p className="text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed">
                  A successful IPO is rarely an overnight phenomenon. It requires 18-24 months of meticulous financial restructuring, corporate governance implementation, and strategic valuation discovery before facing public scrutiny.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT SECTION */}
        <section className="py-20 bg-background relative -mt-10 rounded-t-[40px] z-20">
          <div className="container mx-auto px-4 space-y-16">
            
            {/* Intro Blocks */}
            <div className="prose prose-lg prose-headings:text-foreground prose-p:text-muted-foreground max-w-none">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'hsl(220 72% 25%)' }}>What Does It Mean to Be "IPO Ready"?</h2>
              <p className="leading-relaxed">
                Going public demands an extraordinary level of financial reporting, management maturity, and operational transparency that most unlisted private companies simply don't possess inherently. Being "IPO Ready" means functioning like a publicly-traded corporation long before the DRHP is filed. 
              </p>
              <p className="leading-relaxed mt-4">
                The <strong>Pre-IPO preparation phase</strong> is designed to identify and plug massive gaps within the company. This could involve settling long-standing promoter litigations, converting sole proprietorships into public limited entities, standardizing accounting practices to Ind-AS, and appointing independent directors. Rushing this sequence—or ignoring it altogether—often leads to underpriced IPOs or outright rejection by regulatory bodies like SEBI.
              </p>
            </div>

            {/* Core Pillars */}
            <div className="bg-secondary/20 border border-border rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-center md:text-left" style={{ color: 'hsl(220 72% 25%)' }}>
                <Target className="w-7 h-7" style={{ color: 'hsl(35 95% 52%)' }} />
                The 4 Pillars of Pre-IPO Restructuring
              </h2>
              
              <div className="space-y-8">
                {/* Pillar 1 */}
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: 'hsl(220 72% 95%)', color: 'hsl(220 72% 45%)' }}>
                    <LineChart className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2 text-foreground">1. Financial Restructuring & Auditing</h4>
                    <p className="text-muted-foreground leading-relaxed">Public investors demand a pristine financial track record spanning a minimum of 3 years. Weak internal controls, commingling of personal promoter funds with company cashflows, and disparate accounting standards are major red flags. Pre-IPO preparation involves migrating to stringent Ind-AS accounting norms, hiring reputed 'Big 4' or equivalent statutory auditors, retiring high-interest debt, and ensuring robust internal margins.</p>
                  </div>
                </div>

                {/* Pillar 2 */}
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: 'hsl(220 72% 95%)', color: 'hsl(220 72% 45%)' }}>
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2 text-foreground">2. Legal & Compliance Due Diligence</h4>
                    <p className="text-muted-foreground leading-relaxed">Unresolved litigations—especially tax disputes—can severely impact valuations and investor sentiment. A crucial pre-IPO step involves comprehensive legal due diligence. This includes securing all intellectual property (trademarks, patents), clearing outstanding environmental or labor compliances, resolving pending legal suits where possible, and structuring the promoter holding efficiently.</p>
                  </div>
                </div>

                {/* Pillar 3 */}
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: 'hsl(220 72% 95%)', color: 'hsl(220 72% 45%)' }}>
                    <Landmark className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2 text-foreground">3. Corporate Governance & Board Formation</h4>
                    <p className="text-muted-foreground leading-relaxed">Transitioning from a family-run enterprise to a board-governed institution is the hardest cultural shift. Before listing, companies must appoint qualified Independent Directors, set up mandatory committees (Audit, Nomination & Remuneration, Stakeholders Relationship), and hire Key Managerial Personnel (KMPs) like a full-time professional CFO and Company Secretary.</p>
                  </div>
                </div>

                {/* Pillar 4 */}
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: 'hsl(35 95% 95%)', color: 'hsl(35 95% 52%)' }}>
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2 text-foreground">4. Organizational Restructuring & Entity Conversion</h4>
                    <p className="text-muted-foreground leading-relaxed">To list in India, an entity must be a 'Public Limited Company'. The pre-IPO phase might involve converting an LLP or a Private Limited entity to a Public Limited one. Furthermore, complex group structures holding multiple subsidiaries are often streamlined or consolidated via M&A to present a clear, unified business model to institutional investors.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* The Pre-IPO Funding Step */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: 'hsl(220 72% 25%)' }}>The Phenomenon of "Pre-IPO Funding"</h2>
              <div className="prose prose-lg prose-p:text-muted-foreground max-w-none">
                <p className="leading-relaxed">
                  Apart from operational readiness, one of the most critical aspects of the Pre-IPO phase is <strong>Pre-IPO Placement or Funding</strong>. Rather than waiting for the public issue to discover the company's valuation, promoters opt to raise emergency or growth capital 6 to 12 months prior to the IPO from select High Net Worth Individuals (HNIs), Private Equity (PE) funds, or Sovereign wealth funds.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-8 mb-4">
                  <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex items-start gap-4 hover:border-primary/30 transition-colors">
                    <CheckCircle className="w-6 h-6 shrink-0 text-success" />
                    <span className="font-medium text-foreground">Establishes a solid "floor valuation" before pricing the main IPO.</span>
                  </div>
                  <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex items-start gap-4 hover:border-primary/30 transition-colors">
                    <CheckCircle className="w-6 h-6 shrink-0 text-success" />
                    <span className="font-medium text-foreground">Brings "smart money" (strategic institutional investors) onto the cap table.</span>
                  </div>
                  <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex items-start gap-4 hover:border-primary/30 transition-colors">
                    <CheckCircle className="w-6 h-6 shrink-0 text-success" />
                    <span className="font-medium text-foreground">Reduces the overall size of the public issue, minimizing absolute listing risk.</span>
                  </div>
                  <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex items-start gap-4 hover:border-primary/30 transition-colors">
                    <CheckCircle className="w-6 h-6 shrink-0 text-success" />
                    <span className="font-medium text-foreground">Vastly improves market sentiment when retail investors see large funds backing it.</span>
                  </div>
                </div>
                <p className="leading-relaxed text-sm italic border-l-4 border-warning pl-4 py-2 bg-warning/5 rounded-r-lg mt-8">
                  <strong>Regulatory Note:</strong> If a Pre-IPO placement is completed after the filing of the Draft Red Herring Prospectus (DRHP) with SEBI, the size of the fresh issue in the IPO is proportionately reduced. Furthermore, shares allotted to pre-IPO investors are subject to strict lock-in periods post-listing.
                </p>
              </div>
            </div>


            {/* CTA Banner */}
            <div className="mt-20 p-12 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #001529 0%, #002147 55%, #003380 100%)' }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5" style={{ background: '#f59e08', filter: 'blur(60px)', transform: 'translate(30%,-30%)' }} />
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 relative z-10">Don't Wait Until the Last Minute</h2>
              <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto font-medium relative z-10">
                A botched DRHP filing due to poor preparation can delay your IPO by years. Engage with our Pre-IPO experts today to architect a foolproof listing strategy.
              </p>
              <div className="flex flex-wrap gap-4 justify-center relative z-10">
                <Link to="/contact">
                  <button className="px-10 py-4 text-lg font-black rounded-xl transition-all hover:scale-105 shadow-xl" style={{ background: 'linear-gradient(135deg, #f59e08, #d97706)', color: '#001529', boxShadow: '0 8px 32px rgba(245,158,8,0.35)' }}>
                    Start Pre-IPO Advisory
                  </button>
                </Link>
                <Link to="/ipo-feasibility">
                  <button className="px-10 py-4 bg-transparent border-2 border-white text-white text-lg font-black rounded-xl transition-all hover:bg-white/5 shadow-sm hidden md:inline-block">
                    Check IPO Feasibility
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PreIPOProcess;
