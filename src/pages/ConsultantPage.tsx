import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Users, MapPin, Award, ArrowRight, Star, CheckCircle2 } from "lucide-react";

interface Consultant {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  specialization: string | null;
  office_location: string | null;
  experience_years: number;
}

const ConsultantPage = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<any>(null);

  useEffect(() => {
    fetch("/api/consultants")
      .then((res) => res.json())
      .then((data) => {
        setConsultants(data.filter((c: any) => c.is_active));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/banners")
      .then(res => res.json())
      .then(data => {
        const pageBanner = data.find((b: any) => b.page_path === "/consultants" && b.is_active);
        if (pageBanner) setBanner(pageBanner);
      })
      .catch(err => console.error("Failed to fetch banner:", err));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div 
        className="relative pt-32 pb-20 border-b border-border overflow-hidden"
        style={{
          background: banner?.image_url 
            ? `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('${banner.image_url}') center/cover no-repeat`
            : undefined
        }}
      >
        {!banner?.image_url && <div className="absolute inset-0 bg-primary/5 -z-10" />}
        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1">Expert IPO Advisory</Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 font-heading tracking-tight">
            Professional <span className="text-primary">IPO Consultants</span> for Your Growth Journey
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Partner with India's most trusted IPO specialists. We connect ambitious businesses with the right consultants to ensure a successful public listing.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground bg-card px-4 py-2 rounded-full border border-border shadow-sm">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> 4.9/5 Average Rating
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground bg-card px-4 py-2 rounded-full border border-border shadow-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500" /> SEBI Compliant Advisory
            </div>
          </div>
        </div>
      </div>

      {/* Consultants List */}
      <div className="container mx-auto px-4 py-20">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {consultants.map((c) => (
              <div key={c.id} className="group bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col hover:-translate-y-2">
                <div className="relative h-56 bg-muted overflow-hidden">
                  {c.image_url ? (
                    <img src={`/${c.image_url}`} alt={c.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5">
                      <Users className="h-16 w-16 text-primary/10" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-background/90 text-foreground backdrop-blur-sm border-none shadow-sm capitalize">
                      {c.office_location || "India Wide"}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-2">
                      <Award className="h-3.5 w-3.5" /> {c.specialization || "SME & Mainboard"}
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem] leading-tight font-heading">
                      {c.name}
                    </h3>
                  </div>
                  
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-6 leading-relaxed">
                    {c.description || "Leading strategic IPO advisory firm focused on helping companies achieve successful listings on NSE Emerge and BSE SME platforms."}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
                    <div className="text-xs">
                      <span className="text-muted-foreground block mb-1">Experience</span>
                      <span className="font-bold text-foreground">{c.experience_years ? `${c.experience_years}+ Years` : "Expert Team"}</span>
                    </div>
                    <Button variant="ghost" className="text-primary font-bold group/btn" asChild>
                      <Link to={`/consultants/${c.id}`} className="flex items-center">
                        View Details <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trust Section */}
      <div className="bg-muted/30 py-20 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">100+ Companies</h3>
              <p className="text-muted-foreground text-sm">Successfully guided through their initial public offering journeys.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Pan-India Presence</h3>
              <p className="text-muted-foreground text-sm">Expert consultants available in Mumbai, Delhi, Ahmedabad, Kolkata, and more.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">SEBI Compliance</h3>
              <p className="text-muted-foreground text-sm">Ensuring all advisory follows stringent regulatory frameworks for transparency.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ConsultantPage;
