const API_BASE =
  import.meta.env.VITE_API_URL ||
  window.location.origin.replace("ipo.", "ipoapi.");

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";

import { useState, useEffect, useCallback } from "react";

import heroBanner1 from "@/assets/hero-banner-1.jpg";
import heroBanner2 from "@/assets/hero-banner-2.jpg";
import heroBanner3 from "@/assets/hero-banner-3.jpg";

interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  cta_text: string | null;
  cta_link: string | null;
  badge_text?: string | null;
  cta2_text?: string | null;
  cta2_link?: string | null;
  sort_order: number;
  is_active?: boolean;
}

const fallbackBanners: Banner[] = [
  {
    id: "1",
    title: "India's Leading IPO Consultancy Platform",
    subtitle:
      "Expert advisory for SME IPO, Mainline IPO, FPO, and Pre-IPO funding.",
    image_url: heroBanner1,
    cta_text: "Check IPO Feasibility",
    cta_link: "/ipo-feasibility",
    badge_text: "SEBI Registered IPO Consultancy",
    cta2_text: "Contact Us",
    cta2_link: "/contact",
    sort_order: 1,
  },
  {
    id: "2",
    title: "SME IPO — Your Gateway to Growth",
    subtitle:
      "Get listed on BSE SME or NSE Emerge with our end-to-end IPO consultation services.",
    image_url: heroBanner2,
    cta_text: "Explore Services",
    cta_link: "/services",
    badge_text: "Unlock Growth Potential",
    cta2_text: "Contact Us",
    cta2_link: "/contact",
    sort_order: 2,
  },
  {
    id: "3",
    title: "Trusted by 500+ Companies Nationwide",
    subtitle:
      "SEBI registered consultancy helping businesses raise capital through public markets.",
    image_url: heroBanner3,
    cta_text: "Contact Us",
    cta_link: "/contact",
    badge_text: "Proven Track Record",
    cta2_text: "Our Services",
    cta2_link: "/services",
    sort_order: 3,
  },
];

const HeroSection = () => {
  const [banners, setBanners] = useState<Banner[]>(fallbackBanners);
  const [current, setCurrent] = useState(0);

  // Load banners after page idle
  useEffect(() => {
    const loadBanners = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/banners`);

        const data = await res.json();

        const activeBanners = data.filter((b: Banner) => b.is_active);

        if (activeBanners.length > 0) {
          const mapped = activeBanners.map((b: Banner) => ({
            ...b,
            image_url: b.image_url || fallbackBanners[0].image_url,
          }));

          setBanners(mapped);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadBanners();
  }, []);

  // Preload first banner
  useEffect(() => {
    if (!banners[0]?.image_url) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";

    link.href = banners[0].image_url.startsWith("http")
      ? banners[0].image_url
      : `${API_BASE}/${banners[0].image_url.replace(/^\/+/, "")}`;

    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [banners]);

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const banner = banners[current];

  return (
    <section className="relative overflow-hidden h-[600px] lg:h-[700px]">
      {/* Background image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={
              banner.image_url?.startsWith("http")
                ? banner.image_url
                : `${API_BASE}/${banner.image_url.replace(/^\/+/, "")}`
            }
            alt={banner.title || "IPO Banner"}
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />

          <div className="absolute inset-0 bg-foreground/65" />
        </motion.div>
      </AnimatePresence>

      <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
        <div className="max-w-3xl">

          {banner.badge_text && (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-brand-green/20 text-brand-green border border-brand-green/30 mb-6">
              <CheckCircle className="h-3.5 w-3.5" />
              {banner.badge_text}
            </span>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight mb-6 text-background">
                {banner.title}
              </h1>

              <p className="text-lg text-background/75 mb-8 max-w-xl">
                {banner.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-8 gold-glow"
              asChild
            >
              <Link to={banner.cta_link || "/ipo-feasibility"}>
                {banner.cta_text || "Check IPO Feasibility"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-background/30 text-background hover:bg-background/10 font-semibold text-base px-8"
              asChild
            >
              <Link
                to="/#newsletter-section"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("newsletter-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Read Magazine
              </Link>
            </Button>

            {banner.cta2_text && (
              <Button
                size="lg"
                variant="ghost"
                className="text-background hover:bg-background/10 font-semibold text-base px-6 h-auto py-3"
                asChild
              >
                <Link to={banner.cta2_link || "/contact"}>
                  {banner.cta2_text}
                </Link>
              </Button>
            )}
          </div>

        </div>
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/20 hover:bg-background/40 flex items-center justify-center text-background transition-colors backdrop-blur-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/20 hover:bg-background/40 flex items-center justify-center text-background transition-colors backdrop-blur-sm"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${i === current
                    ? "bg-accent w-8"
                    : "bg-background/40 hover:bg-background/60"
                  }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSection;