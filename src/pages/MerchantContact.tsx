import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import {
  Mail, Phone, Building2, MessageSquare, Send, CheckCircle2,
  MapPin, ShieldCheck, TrendingUp, Info, Users, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import heroBg from "@/assets/hero-bg.jpg";

interface FormData {
  ipo_type: string;
  name: string;
  email: string;
  mobile: string;
  company: string;
  message: string;
}

interface ContactFormProps {
  id?: string;
  formData: FormData;
  isSubmitting: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const ContactForm = ({ id, formData, isSubmitting, handleChange, handleSubmit }: ContactFormProps) => (
  <div id={id} className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none" />
    <h3 className="text-2xl font-black text-[#001529] mb-6 flex items-center gap-2">
      <MessageSquare className="text-primary w-6 h-6" /> Send Us an Enquiry
    </h3>
    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-slate-400">IPO Type *</label>
        <select
          name="ipo_type"
          value={formData.ipo_type}
          onChange={handleChange}
          className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
          required
        >
          <option value="">Select IPO Type</option>
          <option value="SME IPO">SME IPO</option>
          <option value="Mainboard IPO">Mainboard IPO</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400">Your Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address *</label>
          <input
            type="email"
            name="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400">Mobile Number *</label>
          <input
            type="tel"
            name="mobile"
            placeholder="10-digit Number"
            maxLength={10}
            value={formData.mobile}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400">Company Name</label>
          <input
            type="text"
            name="company"
            placeholder="Your Company"
            value={formData.company}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400">Write Message *</label>
          <span className={`text-[10px] font-bold ${formData.message.trim().split(/\s+/).filter(w => w.length > 0).length > 150 ? "text-destructive" : "text-slate-400"}`}>
            {formData.message.trim().split(/\s+/).filter(w => w.length > 0).length}/150 Words
          </span>
        </div>
        <textarea
          name="message"
          rows={4}
          placeholder="How can we help you?"
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium resize-none"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 rounded-2xl bg-[#001529] text-white hover:bg-[#002147] font-black text-sm uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-95"
      >
        {isSubmitting ? "Submitting..." : (
          <span className="flex items-center gap-2">
            Submit Enquiry <Send className="w-4 h-4" />
          </span>
        )}
      </Button>
      <p className="text-[10px] text-center text-slate-400 font-medium italic">
        By clicking submit, you agree to our privacy policy and terms of service.
      </p>
    </form>
  </div>
);

const MerchantContact = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<FormData>({
    ipo_type: searchParams.get("ipo_type") || "",
    name: "",
    email: "",
    mobile: "",
    company: "",
    message: searchParams.get("banker") ? `I am interested in connecting with ${searchParams.get("banker")} for my IPO.` : ""
  });

  useEffect(() => {
    const type = searchParams.get("ipo_type");
    const banker = searchParams.get("banker");
    if (type || banker) {
      setFormData(prev => ({
        ...prev,
        ipo_type: type || prev.ipo_type,
        message: banker ? `I am interested in connecting with ${banker} for my IPO.` : prev.message
      }));
    }
  }, [searchParams]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "mobile") {
      const numericVal = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: numericVal });
      return;
    }

    if (name === "message") {
      const words = value.trim().split(/\s+/).filter(w => w.length > 0);
      if (words.length > 150 && value.length > (formData.message.length || 0)) {
        toast.error("Message cannot exceed 150 words");
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const wordCount = formData.message.trim().split(/\s+/).filter(w => w.length > 0).length;

    if (!formData.ipo_type || !formData.name || !formData.email || !formData.message || formData.mobile.length !== 10) {
      toast.error(formData.mobile.length !== 10 ? "Mobile number must be exactly 10 digits" : "Please fill in all required fields.");
      return;
    }

    if (wordCount > 150) {
      toast.error("Message cannot exceed 150 words");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/merchant-contact-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success("Enquiry submitted successfully! We will contact you soon.");
        setFormData({
          ipo_type: "",
          name: "",
          email: "",
          mobile: "",
          company: "",
          message: ""
        });
      } else {
        toast.error("Failed to submit enquiry. Please try again.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SEOHead
        title="Contact Merchant Bankers | IndiaIPO"
        description="Connect with top SEBI registered merchant bankers for SME and Mainboard IPO advisory services. Get expert insights and professional consultation."
        keywords="merchant banker contact, IPO advisory, SME IPO consultants, mainline IPO bankers, IndiaIPO contact"
      />
      <Header />

      <main>
        {/* Banner Section */}
        <section className="relative pt-20 pb-32 overflow-hidden bg-[#001529]">
          <div className="absolute inset-0 opacity-20">
            <img src={heroBg} alt="Background" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#001529] via-[#001529]/90 to-transparent" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                  <ShieldCheck className="w-4 h-4" /> Professional IPO Support
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                  Connect with India's <span className="text-primary">Leading Merchant Bankers</span>
                </h1>
                <p className="text-lg text-white/70 mb-8 max-w-xl font-medium leading-relaxed">
                  Start your IPO journey with expert guidance. Whether it's an SME IPO or a Mainboard listing, our network of SEBI-registered bankers is here to ensure your success.
                </p>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                      <TrendingUp className="text-primary w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-white font-black text-sm">Strategic Growth</p>
                      <p className="text-white/40 text-xs">Customized Advisory</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                      <Users className="text-primary w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-white font-black text-sm">Expert Network</p>
                      <p className="text-white/40 text-xs">Top Rated Bankers</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <ContactForm 
                  formData={formData} 
                  isSubmitting={isSubmitting} 
                  handleChange={handleChange} 
                  handleSubmit={handleSubmit} 
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Info Sections */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl md:text-5xl font-black text-[#001529] mb-6">
                Expert Services for Your <span className="text-primary">Financial Success</span>
              </h2>
              <div className="w-24 h-2 rounded-full bg-primary mx-auto mb-8" />
              <p className="text-slate-500 font-medium">
                We provide end-to-end support for companies planning to go public, offering insights and strategic consultancy to navigate the complex IPO landscape.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "IPO Advisory Services",
                  desc: "Comprehensive guidance on capital structure, regulatory compliance, and market readiness for both SME and Mainboard IPOs.",
                  icon: ShieldCheck,
                  color: "bg-blue-50 text-blue-600 border-blue-100"
                },
                {
                  title: "Insight Market Stories",
                  desc: "Stay updated with real-time market trends, investor sentiment analysis, and deep-dive stories on successful IPO listings.",
                  icon: TrendingUp,
                  color: "bg-orange-50 text-orange-600 border-orange-100"
                },
                {
                  title: "Consultant Support",
                  desc: "Direct access to industry veterans and financial consultants who specialize in pre-IPO preparation and post-listing strategy.",
                  icon: Users,
                  color: "bg-green-50 text-green-600 border-green-100"
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -10 }}
                  className={`${item.color} border p-8 rounded-3xl h-full shadow-sm hover:shadow-xl transition-all flex flex-col items-start`}
                >
                  <div className={`w-14 h-14 rounded-2xl ${item.color} border-2 flex items-center justify-center mb-6`}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black mb-4 text-[#001529]">{item.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Second Form CTA */}
        <section className="py-24 bg-[#F1F5F9] border-y border-slate-200">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-black text-[#001529] mb-8 leading-tight">
                  Ready to take the <span className="text-primary">Next Step?</span>
                </h2>
                <p className="text-lg text-slate-500 mb-10 font-medium leading-relaxed">
                  Don't miss the opportunity to grow your business exponentially. Our merchant bankers are experts in identifying the right market timing and valuation for your company.
                </p>
                <ul className="space-y-4">
                  {[
                    "Free Initial Consultation",
                    "Confidential Data Handling",
                    "Customized IPO Roadmap",
                    "Dedicated Relationship Manager"
                  ].map((li, idx) => (
                    <li key={idx} className="flex items-center gap-3 font-bold text-[#001529]">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      {li}
                    </li>
                  ))}
                </ul>
              </div>
              <ContactForm 
                id="second-form" 
                formData={formData} 
                isSubmitting={isSubmitting} 
                handleChange={handleChange} 
                handleSubmit={handleSubmit} 
              />
            </div>
          </div>
        </section>

        {/* Office & Map Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 h-[450px] rounded-3xl overflow-hidden border-4 border-white shadow-2xl relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.82285149303!2d77.12644267613653!3d28.60502128522774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1cc20ccbd161%3A0x6bbaea3f721d6e64!2sNARAAYNI%20CAPITAL%20SERVICES!5e0!3m2!1sen!2sin!4v1740484555811!5m2!1sen!2sin"
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="order-1 lg:order-2 space-y-8">
                <h2 className="text-3xl md:text-5xl font-black text-[#001529]">Visit Our <span className="text-primary">Corporate Office</span></h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                      <MapPin className="text-blue-600 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Our Address</p>
                      <p className="text-lg font-bold text-[#001529] leading-relaxed">
                        808, 8th Floor, D-Mall, Netaji Subhash Place, Pitampura, Delhi-110034
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100">
                      <Mail className="text-orange-600 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Email Us</p>
                      <a href="mailto:info@indiaipo.in" className="text-lg font-bold text-[#001529] hover:text-primary transition-colors">
                        info@indiaipo.in
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
                      <Phone className="text-green-600 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Call Support</p>
                      <a href="tel:+917428337280" className="text-lg font-bold text-[#001529] hover:text-primary transition-colors">
                        +91-74283-37280
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MerchantContact;
