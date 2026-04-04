import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { getImageUrl } from "@/lib/utils";

interface Magazine {
  id: string;
  title: string;
  pdf: string;
  language: string;
  pdf_lock: boolean | number;
  report_images: string;
  created_at?: string;
  updated_at?: string;
}

const IPOWorldSection = () => {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        const res = await fetch("/api/magazines");
        if (res.ok) {
          const data = await res.json();
          setMagazines(data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching magazines:", err);
        setLoading(false);
      }
    };
    fetchMagazines();
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section id="magazine-section" className="py-24 bg-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
            <BookOpen className="h-3.5 w-3.5" />
            IPO World Monthly Editions
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-foreground">
            A Complete 360° View Of IPOs & <span className="text-primary">Capital Markets</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-8 h-1 rounded-full bg-primary" />
            <div className="w-8 h-1 rounded-full bg-primary/40" />
          </div>
        </div>

        {/* Scrollable carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-2 md:-left-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background border border-border shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute -right-2 md:-right-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background border border-border shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {loading ? (
              <div className="w-full text-center py-20 text-muted-foreground">Loading magazines...</div>
            ) : magazines.length === 0 ? (
              <div className="w-full text-center py-20 text-muted-foreground">No magazines available yet.</div>
            ) : (
              magazines.map((mag, idx) => (
                <motion.div
                  key={mag.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex-shrink-0 w-[280px] sm:w-[300px] snap-start bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  {/* Magazine Cover */}
                  <div className="relative h-[380px] overflow-hidden">
                    <img
                      src={getImageUrl(mag.report_images)}
                      alt={mag.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                       {Number(mag.pdf_lock) === 1 && (
                        <span className="bg-accent text-accent-foreground text-[10px] font-bold px-3 py-1 rounded-md shadow-md flex items-center gap-1">
                          <Lock className="h-3 w-3" /> Premium
                        </span>
                      )}
                      <span className="bg-primary/90 text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-md shadow-md uppercase">
                        {mag.language}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h4 className="font-bold font-heading text-foreground text-base mb-2 line-clamp-1">{mag.title}</h4>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                      <Calendar className="h-3.5 w-3.5" />
                      {mag.created_at ? new Date(mag.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                    </div>
                    <Button className="w-full bg-brand-green text-primary-foreground hover:bg-brand-green/90 font-semibold text-sm rounded-xl" asChild>
                      <Link to="/#newsletter-section" onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('newsletter-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}>
                        Read Magazine
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IPOWorldSection;
