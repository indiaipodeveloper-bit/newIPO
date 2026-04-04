import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Building2, TrendingUp, BarChart3, Wallet, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getImageUrl } from "@/lib/utils";

const allServices = [
  {
    id: "sme-ipo",
    title: "SME IPO",
    icon: <Building2 className="h-10 w-10" />,
    description: "End-to-end advisory for Small and Medium Enterprise IPOs on BSE SME and NSE Emerge platforms.",
    benefits: ["Lower listing requirements", "Faster time to market", "Access to growth capital", "Enhanced brand visibility"],
    steps: ["Eligibility Assessment", "Due Diligence & Documentation", "Merchant Banker Coordination", "SEBI Filing & Approval", "Roadshows & Marketing", "Listing Day Support"],
  },
  {
    id: "mainline-ipo",
    title: "Mainline IPO",
    icon: <TrendingUp className="h-10 w-10" />,
    description: "Comprehensive consultancy for mainboard IPO listings with full SEBI compliance and institutional investor roadshows.",
    benefits: ["Access to institutional investors", "Higher valuation potential", "Greater liquidity", "National brand recognition"],
    steps: ["Feasibility Study", "Valuation & Structuring", "DRHP Preparation", "SEBI Review Process", "Institutional Roadshows", "Book Building & Allotment"],
  },
  {
    id: "fpo",
    title: "FPO Advisory",
    icon: <BarChart3 className="h-10 w-10" />,
    description: "Follow-on Public Offering strategy for listed companies seeking additional capital from the public markets.",
    benefits: ["Raise additional capital", "Improve free float", "Strengthen balance sheet", "Reduce promoter debt"],
    steps: ["Capital Need Assessment", "Board & Shareholder Approvals", "Pricing Strategy", "SEBI Filing", "Offer Execution", "Post-Issue Compliance"],
  },
  {
    id: "pre-ipo",
    title: "Pre-IPO Funding",
    icon: <Wallet className="h-10 w-10" />,
    description: "Connect with institutional investors and HNIs for pre-IPO capital raising and optimal valuation discovery.",
    benefits: ["Early capital access", "Valuation benchmarking", "Strategic investor onboarding", "IPO readiness preparation"],
    steps: ["Company Profiling", "Investor Identification", "Pitch Deck & Data Room", "Term Sheet Negotiation", "Due Diligence Support", "Investment Closure"],
  },
];

const Services = () => {
  const { pathname } = useLocation();
  const [bannerVideo, setBannerVideo] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`/api/banners?page=${encodeURIComponent(pathname)}`);
        if (res.ok) {
          const data = await res.json();
          const activeBanner = data.find((b: any) => b.video_url || b.image_url);
          if (activeBanner) {
            if (activeBanner.video_url) setBannerVideo(activeBanner.video_url);
            if (activeBanner.image_url) setBannerImage(activeBanner.image_url);
          }
        }
      } catch (err) { console.error(err); }
    };
    fetchBanners();
  }, [pathname]);

  return (
    <div className="min-h-screen">
      <SEOHead title="Services" description="SME IPO, Mainline IPO, FPO Advisory, and Pre-IPO Funding — comprehensive IPO consultancy services by IndiaIPO." keywords="SME IPO, Mainline IPO, FPO, Pre-IPO funding, IPO advisory services" />
      <Header />
      <main>
        <section className="relative py-24 overflow-hidden bg-[#001529]">
          {/* Dynamic Background */}
          {bannerVideo ? (
            <div className="absolute inset-0 z-0">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                src={getImageUrl(bannerVideo)}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#001529] via-[#002147] to-[#003380] opacity-80 mix-blend-multiply" />
            </div>
          ) : bannerImage ? (
            <div className="absolute inset-0 z-0">
               <div 
                 className="w-full h-full bg-cover bg-center opacity-40 mix-blend-overlay"
                 style={{ backgroundImage: `url(${getImageUrl(bannerImage)})` }}
               />
               <div className="absolute inset-0 bg-gradient-to-br from-[#001529] via-[#002147] to-[#003380] opacity-80 mix-blend-multiply" />
            </div>
          ) : (
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#001529] via-[#002147] to-[#003380]" />
          )}

          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Our <span className="text-[#f59e08]">Services</span>
            </h1>
            <p className="text-white/70 max-w-lg mx-auto text-lg font-medium">
              Comprehensive IPO advisory solutions tailored for companies at every stage.
            </p>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 space-y-16">
            {allServices.map((service, i) => (
              <div key={service.id} id={service.id} className="scroll-mt-20">
                <div className={`grid md:grid-cols-2 gap-10 items-start ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                  <div>
                    <div className="w-16 h-16 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                      {service.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-3">{service.title}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>
                    <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">Key Benefits</h3>
                    <div className="space-y-2 mb-6">
                      {service.benefits.map((b) => (
                        <div key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-success shrink-0" />
                          {b}
                        </div>
                      ))}
                    </div>
                    <Button className="bg-accent text-accent-foreground hover:bg-gold-light font-semibold" asChild>
                      <Link to="/contact">
                        Schedule Consultation
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Process Steps</h3>
                    <div className="space-y-4">
                      {service.steps.map((step, idx) => (
                        <div key={step} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold shrink-0">
                            {idx + 1}
                          </div>
                          <div className="pt-1 text-sm text-muted-foreground">{step}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
