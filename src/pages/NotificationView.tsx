import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Home, ChevronRight, FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationPdf {
  id: string;
  title: string;
  slug: string;
  pdf_url: string | null;
  description: string | null;
}

const NotificationView = () => {
  const { slug } = useParams();
  const [pdf, setPdf] = useState<NotificationPdf | null>(null);
  const [allPdfs, setAllPdfs] = useState<NotificationPdf[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

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

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={pdf ? `${pdf.title} - IndiaIPO` : "Notification - IndiaIPO"}
        description={pdf?.description || "SEBI Notifications & Circulars"}
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-white/70 mb-6">
              <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
                <Home className="h-4 w-4" /> Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white/70">Notifications / Circulars</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white font-medium">{pdf?.title || "Loading..."}</span>
            </div>
            <div className="border-t border-white/20 pt-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-4xl font-bold text-white flex items-center gap-3"
              >
                <FileText className="h-8 w-8" />
                {pdf?.title || "Notification"}
              </motion.h1>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* PDF Viewer */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : pdf?.pdf_url ? (
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{pdf.title}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <a href={pdf.pdf_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5 mr-1" /> Open in New Tab
                        </a>
                      </Button>
                      <Button size="sm" asChild className="bg-primary text-primary-foreground">
                        <a href={pdf.pdf_url} download>
                          <Download className="h-3.5 w-3.5 mr-1" /> Download
                        </a>
                      </Button>
                    </div>
                  </div>
                  <iframe
                    src={pdf.pdf_url}
                    className="w-full border-0"
                    style={{ height: "80vh" }}
                    title={pdf.title}
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">PDF Not Available Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Admin will upload the PDF for "{pdf?.title}" soon. Please check back later.
                  </p>
                </div>
              )}

              {pdf?.description && (
                <div className="mt-6 bg-card border border-border rounded-xl p-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">{pdf.description}</p>
                </div>
              )}
            </div>

            {/* Sidebar - All Notifications */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
              <div className="border border-border rounded-xl p-5">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  All Notifications
                </h3>
                <div className="space-y-1">
                  {allPdfs.map((p) => (
                    <Link
                      key={p.id}
                      to={`/notifications/${p.slug}`}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${pdf?.id === p.id
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-foreground/70 hover:bg-secondary hover:text-primary"
                        }`}
                    >
                      <FileText className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{p.title}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary to-purple-700 rounded-xl p-5 text-white">
                <h3 className="font-bold mb-2">Need IPO Consultation?</h3>
                <p className="text-sm text-white/80 mb-4">Get expert guidance on SEBI regulations and IPO compliance.</p>
                <Button asChild className="w-full bg-white text-primary hover:bg-white/90 font-semibold">
                  <Link to="/contact">Contact Us →</Link>
                </Button>
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
