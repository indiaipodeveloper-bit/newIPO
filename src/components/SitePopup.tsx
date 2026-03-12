import { useState, useEffect } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

interface PopupData {
  title: string;
  description: string;
  image_url: string | null;
  button_text: string;
  button_link: string;
  is_active: boolean;
}

const SitePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<PopupData | null>(null);

  useEffect(() => {
    const fetchPopup = async () => {
      try {
        const res = await fetch("/api/popup");
        if (res.ok) {
          const popupData = await res.json();
          if (popupData.is_active) {
            setData(popupData);
            // Show after a slight delay for better UX
            setTimeout(() => setIsOpen(true), 1500);
          }
        }
      } catch (err) {
        console.error("Popup fetch error:", err);
      }
    };

    fetchPopup();
  }, []);

  if (!data) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-card rounded-3xl overflow-hidden shadow-2xl border border-border max-h-[90vh] overflow-y-auto scrollbar-hide"
          >
            {/* Header / Banner Part */}
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              {data.image_url ? (
                <img 
                  src={data.image_url} 
                  alt={data.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-2xl px-6 text-center">{data.title}</span>
                </div>
              )}
              
              {/* Close Button */}
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 bg-background/50 backdrop-blur-md rounded-full text-foreground hover:bg-background transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Tag - Premium touch */}
              <div className="absolute top-4 left-4">
                <span className="bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
                  </span>
                  New Release
                </span>
              </div>
              
              {/* Title overlay if image exists */}
              {data.image_url && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                   <h3 className="text-white text-xl md:text-2xl font-bold font-heading">{data.title}</h3>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 space-y-6">
              {!data.image_url && <h3 className="text-2xl font-bold font-heading text-foreground">{data.title}</h3>}
              
              <div className="text-muted-foreground text-sm md:text-base leading-relaxed">
                {data.description.split('\n').map((line, i) => (
                   <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
                ))}
              </div>

              {/* Highlight items - Static style but adds premium feel */}
              <div className="space-y-3 bg-muted/30 p-4 rounded-2xl border border-border/50">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-foreground">Premium research and real-time updates</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-foreground">Exclusive IPO insights and deep research</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20"
                  onClick={() => {
                    setIsOpen(false);
                    if (data.button_link) {
                      window.location.href = data.button_link;
                    }
                  }}
                >
                  {data.button_text || "Read More"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SitePopup;
