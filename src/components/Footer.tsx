import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Linkedin, Instagram, Youtube } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-foreground border-t border-border">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              <img src={logo} alt="India IPO" className="h-14 w-auto" />
            </div>
            <p className="text-xs text-background/50 font-semibold mb-3">
              <span className="tracking-wider">IIII</span> GST No: 07AAHCB7068H2ZF
            </p>
            <p className="text-background/60 text-sm leading-relaxed mb-5">
              India IPO is a leading Indian business services platform that helps firms and companies to launch their initial public offerings (IPOs) in order to raise essential capital for growth and expansion while adding value & fueling the nation's immense potential and future opportunities.
            </p>
            <p className="text-background/50 text-xs font-semibold mb-3">Follow us:</p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "https://www.facebook.com/01indiapo", label: "Facebook", color: "#1877F2" },
                { icon: () => <span className="text-xs font-bold">𝕏</span>, href: "https://x.com/india_ipo1", label: "X", color: "#000000" },
                { icon: Linkedin, href: "https://www.linkedin.com/company/india-ipo/", label: "LinkedIn", color: "#0077B5" },
                { icon: Instagram, href: "https://www.instagram.com/india_ipo1", label: "Instagram", color: "#E4405F" },
                { icon: Youtube, href: "https://www.youtube.com/@IndiaIPOofficial", label: "YouTube", color: "#FF0000" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center text-background/70 transition-all hover:scale-110 shadow-sm"
                  style={{
                    color: social.color,
                    backgroundColor: `${social.color}15` // 15 is hex for ~8% opacity
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = social.color;
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${social.color}15`;
                    e.currentTarget.style.color = social.color;
                  }}
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-accent font-bold font-heading text-lg mb-5">Quick Links</h4>
            <div className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "IPO Services", href: "/ipo-services" },
                { label: "Blogs", href: "/ipo-blogs" },
                { label: "Consultant", href: "/consultants" },
                { label: "Youtube Videos", href: "/ipo-and-market-snaps" },
                { label: "News", href: "/news-updates" },
                { label: "Contact Us", href: "/contact" },
                { label: "Career", href: "/careers" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="flex items-center gap-2 text-sm text-background/60 hover:text-accent transition-colors group"
                >
                  <span className="text-accent text-xs">»</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-2">
            <h4 className="text-accent font-bold font-heading text-lg mb-5">Contact Information:</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-background/80">Corporate Office:</p>
                  <p className="text-sm text-background/60">808, 8<sup>th</sup> Floor, D-Mall, Netaji Subhash Place, Pitampura, Delhi-110034</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-background/80">Regional Office:</p>
                  <p className="text-sm text-background/60">Office No. 601, Shagun Insignia, Ulwe, Sector-19, Navi Mumbai- 410206</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <div>
                  <span className="text-sm font-semibold text-background/80">Email: </span>
                  <a href="mailto:info@indiaipo.in" className="text-sm text-background/60 hover:text-accent transition-colors">info@indiaipo.in</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <div>
                  <span className="text-sm font-semibold text-background/80">Mobile: </span>
                  <a href="tel:+917428337280" className="text-sm text-background/60 hover:text-accent transition-colors">+91-74283-37280</a>
                  <span className="text-background/40">, </span>
                  <a href="tel:+919650982781" className="text-sm text-background/60 hover:text-accent transition-colors">+91-96509-82781</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10 bg-foreground">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap gap-4">
            <Link to="#" className="text-xs text-background/50 hover:text-accent transition-colors">Disclaimer</Link>
            <span className="text-background/20">|</span>
            <Link to="#" className="text-xs text-background/50 hover:text-accent transition-colors">Privacy & Policy</Link>
            <span className="text-background/20">|</span>
            <Link to="#" className="text-xs text-background/50 hover:text-accent transition-colors">Terms & Conditions</Link>
          </div>
          <p className="text-xs text-background/40">
            Copyright © 2026 All rights reserved by - <span className="text-background/60 font-medium">Bmarkt Tecamat Private Limited</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
