import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { getImageUrl } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import {
  Home, ChevronRight, FileText, Download, ExternalLink,
  Bell, ArrowRight, Phone, Mail, Shield, CheckCircle2, AlertCircle, Info
} from "lucide-react";

interface NotificationPdf {
  id: string;
  title: string;
  slug: string;
  pdf_url: string | null;
  link: string | null;
  description: string | null;
}

const NotificationView = () => {
  const { slug } = useParams();
  const [pdf, setPdf] = useState<NotificationPdf | null>(null);
  const [allPdfs, setAllPdfs] = useState<NotificationPdf[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => {
    if (allPdfs.length > 0 && slug) {
      const found = allPdfs.find((p) => p.slug === slug);
      if (found) setPdf(found);
    }
  }, [allPdfs, slug]);

  const fetchAll = async () => {
    try {
      const res = await fetch("/api/notifications");
      let data = res.ok ? await res.json() : [];
      
      const mandatory: NotificationPdf[] = [
        { id: "nse-elig", title: "NSE Emerge Eligibility Criteria", slug: "nse-emerge-eligibility", pdf_url: null, link: null, description: "Official listing criteria for the National Stock Exchange (NSE) Emerge platform for SME IPOs." },
        { id: "bse-elig", title: "BSE SME Eligibility Criteria", slug: "bse-sme-eligibility", pdf_url: null, link: null, description: "Official listing criteria for the Bombay Stock Exchange (BSE) SME platform for SME IPOs." }
      ];

      // Merge and avoid duplicates
      data = [...data];
      mandatory.forEach(m => {
        if (!data.find((d: any) => d.slug === m.slug)) {
          data.push(m);
        }
      });

      setAllPdfs(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const pdfSrc = pdf?.pdf_url
    ? pdf.pdf_url.startsWith("http") || pdf.pdf_url.startsWith("/")
      ? pdf.pdf_url
      : `/${pdf.pdf_url}`
    : null;

  const extLink = pdf?.link
    ? pdf.link.startsWith("http") ? pdf.link : `https://${pdf.link}`
    : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SEOHead
        title={pdf ? `${pdf.title} | IndiaIPO Notifications` : "SEBI Notifications & Circulars | IndiaIPO"}
        description={pdf?.description || "SEBI Notifications, Circulars, ICDR Regulations and SME IPO compliance documents — IndiaIPO Knowledge Center."}
        keywords="SEBI notifications, ICDR amendments, SME IPO circulars, BSE NSE notifications India, SEBI circulars PDF"
      />
      <Header />

      <main>
        {/* ── HERO ── */}
        <section className="bg-[#001529] py-14 relative overflow-hidden">
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

          <div className="absolute inset-0 pointer-events-none z-1">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-5"
              style={{ background: "#f59e08", filter: "blur(80px)", transform: "translate(25%,-25%)" }} />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-6 flex-wrap">
              <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/70">Notifications / Circulars</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/90 font-semibold line-clamp-1 max-w-[200px]">{pdf?.title || "Loading…"}</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 bg-[#f59e08]/20 border border-[#f59e08]/30 rounded-full px-4 py-1.5 mb-5">
                <Bell className="h-3 w-3 text-[#f59e08]" />
                <span className="text-[#f59e08] text-xs font-black uppercase tracking-widest">SEBI Regulatory</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-white leading-tight flex items-start gap-4 max-w-4xl">
                <div className="w-12 h-12 rounded-xl bg-[#f59e08]/20 flex items-center justify-center shrink-0 mt-1">
                  <FileText className="h-6 w-6 text-[#f59e08]" />
                </div>
                {pdf?.title || "Notification"}
              </h1>
            </motion.div>
          </div>
        </section>

        {/* ── CONTENT ── */}
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* PDF Viewer */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#001529] to-[#003380] flex items-center justify-center mb-4 animate-pulse">
                    <FileText className="h-7 w-7 text-[#f59e08]" />
                  </div>
                  <p className="text-slate-500 font-semibold">Loading document…</p>
                </div>
              ) : pdfSrc ? (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  {/* Toolbar */}
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3"
                    style={{ background: "linear-gradient(135deg, #001529, #003380)" }}>
                    <span className="text-sm font-bold text-white line-clamp-1 flex-1">{pdf?.title}</span>
                    <div className="flex gap-2">
                      <a href={pdfSrc} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black border border-white/25 text-white hover:bg-white/10 transition-all">
                        <ExternalLink className="h-3.5 w-3.5" /> Open in New Tab
                      </a>
                      <a href={pdfSrc} download
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all hover:scale-105"
                        style={{ background: "linear-gradient(135deg, #f59e08, #d97706)", color: "#001529" }}>
                        <Download className="h-3.5 w-3.5" /> Download
                      </a>
                    </div>
                  </div>
                  <iframe src={pdfSrc} className="w-full border-0" style={{ height: "80vh" }} title={pdf?.title} />
                </div>
              ) : extLink ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
                  <div className="w-20 h-20 rounded-2xl bg-[#001529]/08 flex items-center justify-center mx-auto mb-5">
                    <ExternalLink className="h-10 w-10 text-[#001529]/40" />
                  </div>
                  <h3 className="text-xl font-black text-[#001529] mb-3">External Document Available</h3>
                  <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto">
                    This notification is available as an external link. Click the button below to open it.
                  </p>
                  <a href={extLink} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-[#001529] transition-all hover:scale-105 shadow-xl"
                    style={{ background: "linear-gradient(135deg, #f59e08, #d97706)", boxShadow: "0 8px 32px rgba(245,158,8,0.35)" }}>
                    Open External Link <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
              ) : slug === "nse-emerge-eligibility" ? (
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl">
                  {/* Banner */}
                  <div className="bg-gradient-to-r from-[#001529] to-[#003380] p-10 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10" 
                      style={{ backgroundImage: 'radial-gradient(circle, #f59e08 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                    <Shield className="h-16 w-16 text-[#f59e08] mx-auto mb-4 relative z-10" />
                    <h2 className="text-4xl font-black mb-2 relative z-10">NSE Emerge Listing Checklist</h2>
                    <p className="text-white/70 max-w-2xl mx-auto relative z-10 font-medium">Comprehensive eligibility criteria for listing small and medium enterprises on the National Stock Exchange (NSE) Emerge platform for 2025-26.</p>
                  </div>
                  
                  <div className="p-8 md:p-14 space-y-12">
                    {/* section 1: Basic Structure */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-orange-600" />
                        </div>
                        <h3 className="text-2xl font-black text-[#001529]">1. Basic Eligibility Structure</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                          <h4 className="font-bold text-[#001529] mb-3">Company Incorporation</h4>
                          <p className="text-sm text-slate-600 leading-relaxed">The applicant must be a public limited company incorporated in India under the Companies Act, 1956 or the Companies Act, 2013.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                          <h4 className="font-bold text-[#001529] mb-3">Paid-up Capital Limits</h4>
                          <p className="text-sm text-slate-600 leading-relaxed">The post-issue paid-up capital of the company (face value) shall not exceed <b>₹25 Crore</b>.</p>
                        </div>
                      </div>
                    </div>

                    {/* section 2: Financial Benchmarks */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-black text-[#001529]">2. Stringent Financial Benchmarks</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50">
                              <th className="p-4 text-sm font-black text-[#001529] border-b border-slate-200">Criterion</th>
                              <th className="p-4 text-sm font-black text-[#001529] border-b border-slate-200">NSE Emerge Requirement (2025-26)</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm">
                            <tr>
                              <td className="p-4 border-b border-slate-100 font-bold">Operating Profit (EBITDA)</td>
                              <td className="p-4 border-b border-slate-100 text-slate-600">Minimum ₹1 Crore for any 2 out of 3 preceding financial years.</td>
                            </tr>
                            <tr>
                              <td className="p-4 border-b border-slate-100 font-bold">Free Cash Flow (FCFE)</td>
                              <td className="p-4 border-b border-slate-100 text-slate-600">Must have positive Free Cash Flow to Equity for at least 2 out of 3 preceding years.</td>
                            </tr>
                            <tr>
                              <td className="p-4 border-b border-slate-100 font-bold">Net Worth</td>
                              <td className="p-4 border-b border-slate-100 text-slate-600">The company must have a positive Net Worth in its audited financials.</td>
                            </tr>
                            <tr>
                              <td className="p-4 border-b border-slate-100 font-bold">Audit Standard</td>
                              <td className="p-4 border-b border-slate-100 text-slate-600">Accounts must be audited by a peer-reviewed auditor for the last 3 years.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* section 3: Track Record */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-black text-[#001529]">3. Experience & Track Record</h3>
                      </div>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <li className="flex gap-3 bg-white border border-slate-200 p-5 rounded-2xl">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-1">1</div>
                          <div>
                            <p className="font-bold text-[#001529]">3-Year Tenure</p>
                            <p className="text-xs text-slate-500">Min 3 years of operational track record (including predecessor entities like partnerships).</p>
                          </div>
                        </li>
                        <li className="flex gap-3 bg-white border border-slate-200 p-5 rounded-2xl">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-1">2</div>
                          <div>
                            <p className="font-bold text-[#001529]">Promoter Experience</p>
                            <p className="text-xs text-slate-500">At least one promoter must have 3+ years experience in the same line of business.</p>
                          </div>
                        </li>
                        <li className="flex gap-3 bg-white border border-slate-200 p-5 rounded-2xl">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-1">3</div>
                          <div>
                            <p className="font-bold text-[#001529]">Conversion Proof</p>
                            <p className="text-xs text-slate-500">If converted from a firm, it must show consistent business and tax records (GST/ITR).</p>
                          </div>
                        </li>
                        <li className="flex gap-3 bg-white border border-slate-200 p-5 rounded-2xl">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-1">4</div>
                          <div>
                            <p className="font-bold text-[#001529]">Physical Verification</p>
                            <p className="text-xs text-slate-500">The exchange may conduct a site visit to verify the company's premises and operations.</p>
                          </div>
                        </li>
                      </ul>
                    </div>

                    {/* section 4: Regulatory Restrictions */}
                    <div className="bg-red-50/50 border border-red-100 p-8 rounded-3xl space-y-6">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                        <h3 className="text-xl font-black text-red-900 uppercase">Critical Prohibitions & Lock-ins</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-red-800">No Default History</p>
                          <p className="text-xs text-red-700/70">Company and promoters must not be listed as Wilful Defaulters or Fugitive Economic Offenders.</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-red-800">OFS Cap (20%)</p>
                          <p className="text-xs text-red-700/70">Offer for Sale (OFS) by existing shareholders cannot exceed 20% of the total issue size.</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-red-800">Use of Proceeds</p>
                          <p className="text-xs text-red-700/70">Proceeds cannot be used to repay loans taken from promoters or related parties.</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-red-800">Promoter Lock-in</p>
                          <p className="text-xs text-red-700/70">Minimum 20% promoter contribution is locked for 3 years post-listing.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : slug === "bse-sme-eligibility" ? (
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl">
                  {/* Banner */}
                  <div className="bg-gradient-to-r from-[#001529] to-[#004276] p-10 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10" 
                      style={{ backgroundImage: 'radial-gradient(circle, #f59e08 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                    <Shield className="h-16 w-16 text-[#f59e08] mx-auto mb-4 relative z-10" />
                    <h2 className="text-4xl font-black mb-2 relative z-10">BSE SME Listing Checklist</h2>
                    <p className="text-white/70 max-w-2xl mx-auto relative z-10 font-medium">Detailed financial and corporate governance requirements for listing small and medium enterprises on the Bombay Stock Exchange (BSE) SME platform.</p>
                  </div>

                  <div className="p-8 md:p-14 space-y-12">
                    {/* section 1: Financial Strength */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-black text-[#001529]">1. Financial Solvency Requirements</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center">
                          <p className="text-xs font-black text-slate-400 uppercase mb-2">Net Tangible Assets</p>
                          <p className="text-2xl font-black text-[#001529]">₹3 Crore</p>
                          <p className="text-[10px] text-slate-500 mt-2">Required in the last preceding financial year.</p>
                        </div>
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center">
                          <p className="text-xs font-black text-slate-400 uppercase mb-2">Operating EBIDT</p>
                          <p className="text-2xl font-black text-[#001529]">₹1 Crore</p>
                          <p className="text-[10px] text-slate-500 mt-2">Operating profit in 2 out of 3 latest years.</p>
                        </div>
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center">
                          <p className="text-xs font-black text-slate-400 uppercase mb-2">Net Worth</p>
                          <p className="text-2xl font-black text-[#001529]">₹1 Crore</p>
                          <p className="text-[10px] text-slate-500 mt-2">Minimum in each of the 2 preceding years.</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex items-center gap-3">
                        <Info className="h-5 w-5 text-blue-600 shrink-0" />
                        <p className="text-sm text-blue-900 font-medium"><b>Leverage Norm:</b> The Post-issue Debt-Equity ratio should generally not exceed 3:1.</p>
                      </div>
                    </div>

                    {/* section 2: Operational History */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-orange-600" />
                        </div>
                        <h3 className="text-2xl font-black text-[#001529]">2. Track Record & Operations</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">The company must have a minimum of <b>3 years</b> operational track record. If converted from a proprietorship/partnership, the cumulative track record is considered.</p>
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">Important: The applicant company must have completed at least <b>one full financial year</b> of operations with audited results under its current name.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                          <h4 className="font-bold text-[#001529]">Alternative Eligibility Route</h4>
                          <p className="text-xs text-slate-500 leading-normal">If a 3-year track record is unavailable, the proposed project must be appraised and funded to the extent of 15% by NABARD, SIDBI, banks, or specific financial institutions.</p>
                        </div>
                      </div>
                    </div>

                    {/* section 3: Corporate Governance */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="text-2xl font-black text-[#001529]">3. Corporate Governance Mandates</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-200">
                            <Shield className="h-8 w-8 text-[#001529] shrink-0" />
                            <div>
                               <p className="font-bold text-[#001529]">Independent Directors</p>
                               <p className="text-xs text-slate-500">Board must have at least 1/3rd (or 1/2 in some cases) Independent Directors.</p>
                            </div>
                         </div>
                         <div className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-200">
                            <Shield className="h-8 w-8 text-[#001529] shrink-0" />
                            <div>
                               <p className="font-bold text-[#001529]">Company Secretary</p>
                               <p className="text-xs text-slate-500">Full-time CS is mandatory for secretarial compliance and exchange filings.</p>
                            </div>
                         </div>
                         <div className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-200">
                            <Shield className="h-8 w-8 text-[#001529] shrink-0" />
                            <div>
                               <p className="font-bold text-[#001529]">Audit Committee</p>
                               <p className="text-xs text-slate-500">Mandatory formation of Audit, Stakeholder, and Nomination committees.</p>
                            </div>
                         </div>
                         <div className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-200">
                            <Shield className="h-8 w-8 text-[#001529] shrink-0" />
                            <div>
                               <p className="font-bold text-[#001529]">Vigil Mechanism</p>
                               <p className="text-xs text-slate-500">Establishment of a whistle-blower policy is required for listing.</p>
                            </div>
                         </div>
                      </div>
                    </div>

                    {/* section 4: Issue Terms */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-black text-[#001529]">4. IPO & After-Market Terms</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="space-y-3">
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden"><div className="w-full h-full bg-red-500" /></div>
                            <p className="text-sm font-bold">100% Underwritten</p>
                            <p className="text-xs text-slate-500">The entire issue must be fully underwritten by the Merchant Banker.</p>
                         </div>
                         <div className="space-y-3">
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden"><div className="w-full h-full bg-red-500" /></div>
                            <p className="text-sm font-bold">Market Making</p>
                            <p className="text-xs text-slate-500">Compulsory for at least 3 years to ensure liquidity for investors.</p>
                         </div>
                         <div className="space-y-3">
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden"><div className="w-full h-full bg-red-500" /></div>
                            <p className="text-sm font-bold">Min 200 Allottees</p>
                            <p className="text-xs text-slate-500">Minimum number of subscribers required for successful allotment.</p>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-16 text-center">
                  <FileText className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                  <h3 className="text-lg font-black text-[#001529] mb-2">Document Not Yet Available</h3>
                  <p className="text-sm text-slate-400 font-medium">
                    The admin will upload the PDF or link for "{pdf?.title}" soon. Please check back later.
                  </p>
                </div>
              )}

              {pdf?.description && (
                <div className="mt-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-5 rounded-full bg-[#f59e08]" />
                    <span className="text-sm font-black text-[#001529]">About this Document</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{pdf.description}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-72 shrink-0 space-y-5">

              {/* All Notifications list */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2"
                  style={{ background: "#001529" }}>
                  <FileText className="h-4 w-4 text-[#f59e08]" />
                  <h3 className="font-black text-white text-sm uppercase tracking-widest">All Notifications</h3>
                </div>
                <div className="p-3 space-y-1 max-h-[60vh] overflow-y-auto">
                  {allPdfs.map((p) => (
                    <Link key={p.id} to={`/notifications/${p.slug}`}
                      className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        pdf?.id === p.id
                          ? "text-[#001529] font-black"
                          : "text-slate-500 hover:text-[#001529] hover:bg-slate-50"
                      }`}
                      style={pdf?.id === p.id
                        ? { background: "rgba(245,158,8,0.1)", border: "1px solid rgba(245,158,8,0.25)" }
                        : {}}>
                      <FileText className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${pdf?.id === p.id ? "text-[#f59e08]" : "text-slate-300"}`} />
                      <span className="leading-snug">{p.title}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA Card */}
              <div className="bg-[#001529] rounded-2xl p-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10"
                  style={{ background: "#f59e08", filter: "blur(20px)", transform: "translate(30%,-30%)" }} />
                <div className="w-12 h-12 rounded-xl bg-[#f59e08]/20 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-[#f59e08]" />
                </div>
                <h3 className="font-black text-white text-base mb-2">Need IPO Consultation?</h3>
                <p className="text-white/55 text-xs mb-5 leading-relaxed">
                  Get expert guidance on SEBI regulations and IPO compliance from our registered advisors.
                </p>
                <Link to="/contact"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-black text-[#001529] transition-all hover:scale-105 mb-3"
                  style={{ background: "linear-gradient(135deg, #f59e08, #d97706)" }}>
                  Contact Us <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="space-y-2 pt-3 border-t border-white/10">
                  <a href="mailto:info@indiaipo.in" className="flex items-center gap-2 text-white/60 text-xs hover:text-white transition-colors">
                    <Mail className="h-3.5 w-3.5 text-[#f59e08]" /> info@indiaipo.in
                  </a>
                  <a href="tel:+917428337280" className="flex items-center gap-2 text-white/60 text-xs hover:text-white transition-colors">
                    <Phone className="h-3.5 w-3.5 text-[#f59e08]" /> +91-74283-37280
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotificationView;
