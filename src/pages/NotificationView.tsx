import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import {
  Home, ChevronRight, FileText, Download, ExternalLink,
  Bell, ArrowRight, Phone, Mail, Shield,
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
      if (res.ok) setAllPdfs(await res.json());
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
        <section className="bg-gradient-to-br from-[#001529] via-[#002147] to-[#003380] py-14 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
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
        <div className="container mx-auto px-4 py-10 max-w-7xl">
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
                  <a href="tel:+918000000000" className="flex items-center gap-2 text-white/60 text-xs hover:text-white transition-colors">
                    <Phone className="h-3.5 w-3.5 text-[#f59e08]" /> +91 8000 000 000
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
