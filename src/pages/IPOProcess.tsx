import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, ChevronRight, FileText, Globe, Landmark, LayoutDashboard, Target, TrendingUp } from "lucide-react";

const IPOProcess = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="The Complete IPO Process in India | IndiaIPO"
        description="Understand the step-by-step Initial Public Offering (IPO) process in India. From feasibility and DRHP filing to listing on BSE/NSE, learn how to take your company public."
        keywords="IPO Process, How to go public, DRHP, SEBI guidelines, Book Building, Listing in India, SME IPO process"
      />
      <Header />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section 
          className="pt-20 pb-28 px-4 relative overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, hsl(220 72% 22%) 0%, hsl(220 72% 38%) 55%, hsl(220 72% 45%) 100%)' 
          }}
        >
          {/* Abstract background shapes */}
          <div className="absolute inset-0 opacity-15 blur-3xl pointer-events-none">
            <div 
              className="absolute top-10 right-20 w-96 h-96 rounded-full" 
              style={{ background: 'hsl(35 95% 52%)' }} 
            />
            <div 
              className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full" 
              style={{ background: 'hsl(35 95% 52%)' }} 
            />
          </div>

          <div className="container mx-auto max-w-5xl relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-white/70 mb-8 font-medium">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/ipo-knowledge" className="hover:text-white transition-colors">IPO Knowledge</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">IPO Process</span>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
              <div 
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl"
                style={{ 
                  background: 'linear-gradient(135deg, hsl(35 95% 52%), hsl(45 93% 65%))',
                  color: 'white'
                }}
              >
                <TrendingUp className="w-12 h-12 md:w-16 md:h-16" />
              </div>
              <div className="flex-1">
                <span 
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 tracking-widest uppercase" 
                  style={{ 
                    background: 'hsl(35 95% 52% / 0.2)', 
                    color: 'hsl(35 95% 72%)', 
                    border: '1px solid hsl(35 95% 52% / 0.4)' 
                  }}
                >
                  Comprehensive Guide
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  The Definitive Guide to the IPO Process in India
                </h1>
                <p className="text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed">
                  Transforming from a private entity to a publicly traded powerhouse is a monumental shift. Understand the meticulous, multi-stage journey of an Initial Public Offering (IPO).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT SECTION */}
        <section className="py-20 bg-background relative -mt-10 rounded-t-[40px] z-20">
          <div className="container mx-auto max-w-4xl px-4 space-y-16">
            
            {/* Intro Blocks */}
            <div className="prose prose-lg prose-headings:text-foreground prose-p:text-muted-foreground max-w-none">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'hsl(220 72% 25%)' }}>What is an Initial Public Offering (IPO)?</h2>
              <p className="leading-relaxed">
                An Initial Public Offering (IPO) marks the transition of a privately held company into a publicly traded entity by offering its shares to institutional investors, high-net-worth individuals, and retail investors for the very first time. This watershed moment is not merely a fundraising event; it fundamentally alters the company's capital structure, governance, and public perception.
              </p>
              <p className="leading-relaxed mt-4">
                In India, the IPO landscape is strictly regulated by the <strong>Securities and Exchange Board of India (SEBI)</strong>. Depending on the company's financial metrics, track record, and operational scale, a business may choose to list its shares on the <strong>Mainboard</strong> (BSE & NSE) or the <strong>SME Platforms</strong> (BSE SME & NSE Emerge).
              </p>
            </div>

            {/* Why Go Public? */}
            <div className="bg-secondary/20 border border-border rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ color: 'hsl(220 72% 25%)' }}>
                <Target className="w-7 h-7" style={{ color: 'hsl(35 95% 52%)' }} />
                Why Do Companies Decide to Go Public?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 shrink-0 mt-1" style={{ color: 'hsl(35 95% 52%)' }} />
                  <div>
                    <h4 className="font-bold text-lg mb-2">Capital Expansion</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">IPOs raise massive amounts of equity capital directly from the public market, which can be utilized for capacity expansion, debt retirement, or working capital without incurring high interest costs.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 shrink-0 mt-1" style={{ color: 'hsl(35 95% 52%)' }} />
                  <div>
                    <h4 className="font-bold text-lg mb-2">Exit for Early Investors</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">It provides an essential liquidity event and an exit mechanism for promoters, venture capitalists (VCs), and private equity (PE) firms through an Offer for Sale (OFS).</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 shrink-0 mt-1" style={{ color: 'hsl(35 95% 52%)' }} />
                  <div>
                    <h4 className="font-bold text-lg mb-2">Acquisition Currency</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Publicly traded shares act as an independent "currency," allowing the company to acquire other businesses using its stock rather than depleting vital cash reserves.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 shrink-0 mt-1" style={{ color: 'hsl(35 95% 52%)' }} />
                  <div>
                    <h4 className="font-bold text-lg mb-2">Enhanced Corporate Stature</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Listed companies enjoy higher visibility, supreme brand recognition, and elevated trust among vendors, clients, and prospective talent due to stringent regulatory oversight.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* The 6 Step Process */}
            <div>
              <h2 className="text-3xl font-bold mb-10 text-center" style={{ color: 'hsl(220 72% 25%)' }}>The 6-Step Journey to Going Public</h2>
              
              <div className="space-y-12">
                {/* Step 1 */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg" style={{ background: 'hsl(220 72% 45%)', color: 'white' }}>
                    1
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Appointment of Intermediaries & Due Diligence</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      The process initiates by assembling an expert task force. The company appoints a <strong>Book Running Lead Manager (BRLM)</strong> or Merchant Banker who acts as the primary coordinator for the entire issue. Subsequently, legal counsels, syndicate members, statutory auditors, and a Registrar to the Issue are onboarded.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Following these appointments, an exhaustive <strong>Due Diligence (DD)</strong> is conducted. The legal and financial teams dissect the corporation's historical records, tax liabilities, pending litigations, and material contracts to ensure absolute transparency.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg" style={{ background: 'hsl(220 72% 45%)', color: 'white' }}>
                    2
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Preparation and Filing of the DRHP</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      The Merchant Banker, in collaboration with the company's management and legal advisors, drafts the <strong>Draft Red Herring Prospectus (DRHP)</strong>. This document is a comprehensive prospectus containing all material information related to the business operations, promoter background, industry overview, financial statements, and the specific objectives of the public issue.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Once vetted, the DRHP is filed with SEBI and the respective stock exchanges for rigorous review. The public is also invited to submit comments or point out discrepancies during a minimum 21-day public observation period.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg" style={{ background: 'hsl(220 72% 45%)', color: 'white' }}>
                    3
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">SEBI Observations & Filing of RHP</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      SEBI painstakingly reviews the DRHP to ensure that adequate disclosures run compliant with the ICDR (Issue of Capital and Disclosure Requirements) Regulations. Upon satisfaction, SEBI issues its "observation letter," commanding specific rectifications or clarifications.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Post-incorporation of these changes, the DRHP evolves into the <strong>Red Herring Prospectus (RHP)</strong>. At this stage, the document contains everything except the exact issue price and the quantum of shares, which are discovered later during the bidding process. The RHP is formally filed with the Registrar of Companies (RoC).
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg" style={{ background: 'hsl(220 72% 45%)', color: 'white' }}>
                    4
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Pre-Issue Marketing, Pricing, and Roadshows</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Before the issue opens, the company embarks on extensive roadshows spanning major financial hubs. The management pitches the growth story to Qualified Institutional Buyers (QIBs), mutual fund managers, and anchor investors. 
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Based on the feedback received from these institutional giants regarding valuation appetites, the Merchant Banker and the promoters freeze the <strong>Price Band</strong> (e.g., ₹100 – ₹105 per share). The RHP is then updated with this price band.
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg" style={{ background: 'hsl(220 72% 45%)', color: 'white' }}>
                    5
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">The IPO Bidding Window (Book Building)</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      The IPO is declared "Open" for a minimum of 3 working days. Investors—ranging from retail participants placing minimum lot bids to HNIs and institutional behemoths backing massive tranches—apply for shares within the stipulated price band.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Applications are primarily processed through ASBA (Application Supported by Blocked Amount), ensuring funds remain in the investor's bank account but are blocked until allotment is finalized. Once the window closes, the "Discovery Price" or Cut-off Price is determined based on aggregate demand.
                    </p>
                  </div>
                </div>

                {/* Step 6 */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg" style={{ background: 'hsl(220 72% 45%)', color: 'white' }}>
                    6
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Allotment of Shares & Stock Exchange Listing</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      After determining the final issue price, the Registrar finalizes the Basis of Allotment in collaboration with the designated stock exchange. If oversubscribed, shares are allotted proportionately or via lucky draw (for retail).
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Unsuccessful bidders witness their ASBA funds unblocked. Successful allottees receive shares directly into their Demat accounts. Finally, just a few days post-allotment (currently T+3 timeline in India), the company executives ring the bell at the BSE/NSE, marking the official commencement of secondary market trading for their stock.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Banner */}
            <div className="mt-20 p-12 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(35 95% 52%), hsl(45 93% 60%))' }}>
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent"></div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 relative z-10" style={{ fontFamily: 'Montserrat, sans-serif' }}>Are You Ready for the Next Leap?</h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium relative z-10">
                Let IndiaIPO's expert advisory team guide you through the intricacies of the DRHP, SEBI filings, and merchant banker selection.
              </p>
              <div className="flex flex-wrap gap-4 justify-center relative z-10">
                <Link to="/contact">
                  <button className="px-10 py-4 bg-white text-lg font-bold rounded-full transition-transform hover:scale-105 shadow-xl" style={{ color: 'hsl(220 72% 38%)' }}>
                    Consult Our Experts
                  </button>
                </Link>
                <Link to="/ipo-feasibility">
                  <button className="px-10 py-4 bg-transparent border-2 border-white text-white text-lg font-bold rounded-full transition-colors hover:bg-white/10 hidden md:inline-block">
                    Check Eligibility First
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

export default IPOProcess;
