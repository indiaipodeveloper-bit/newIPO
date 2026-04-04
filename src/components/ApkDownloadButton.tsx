import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ApkDownloadButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    setShowTooltip(false);
    
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      // We've used the prompt, and can't use it again, throw it away
      setDeferredPrompt(null);
    } else {
      // If it's already installed or prompt is not available, show instructions
      alert("Note: If the install prompt didn't appear, you might need to install via your browser menu by selecting 'Add to Home Screen' or 'Install App'. PWA ensures automatic updates!");
    }
  };

  if (isInstalled) return null;

  return (
    <div className="fixed bottom-[168px] md:bottom-24 right-6 z-[60]">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-16 right-0 bg-card border border-border rounded-xl shadow-xl p-4 w-64 mb-2 origin-bottom-right"
          >
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-sm font-semibold text-foreground mb-1">Download App (APK)</p>
            <p className="text-xs text-muted-foreground mb-3">Install IndiaIPO on your device for a seamless professional app experience. Automatic updates included!</p>
            <button
              onClick={handleInstallClick}
              className="w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="h-4 w-4" /> Install Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setShowTooltip(!showTooltip)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Download App"
      >
        <Download className="w-7 h-7 text-white" />
      </motion.button>
    </div>
  );
};

export default ApkDownloadButton;
