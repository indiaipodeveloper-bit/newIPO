import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          company: form.company.trim() || null,
          message: form.message.trim(),
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      toast.success("Thank you! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
    } catch (err: any) {
      toast.error("Failed to submit. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead title="Contact Us" description="Get in touch with IndiaIPO for IPO consultancy, pre-IPO funding, and capital market advisory." keywords="contact IndiaIPO, IPO consultation, IPO advisory contact" />
      <Header />
      <main>
        <section className="gradient-navy py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
              Contact <span className="text-gradient-gold">Us</span>
            </h1>
            <p className="text-primary-foreground/60 max-w-lg mx-auto">
              Ready to start your IPO journey? Get in touch with our expert team.
            </p>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Contact Info */}
              <div className="space-y-6">
                {[
                  { icon: <MapPin className="h-5 w-5" />, title: "Office", text: "123, Dalal Street, Fort\nMumbai 400001, India" },
                  { icon: <Phone className="h-5 w-5" />, title: "Phone", text: "+91 98765 43210\n+91 22 4050 6070" },
                  { icon: <Mail className="h-5 w-5" />, title: "Email", text: "info@indiaipo.in\nconsulting@indiaipo.in" },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{item.text}</p>
                    </div>
                  </div>
                ))}

                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-success/10 text-success text-sm font-medium hover:bg-success/20 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              </div>

              {/* Form */}
              <div className="md:col-span-2">
                <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Name *</label>
                      <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" maxLength={100} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                      <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" maxLength={255} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Phone</label>
                      <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" maxLength={20} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Company</label>
                      <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" maxLength={200} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Message *</label>
                    <Textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your IPO requirements..." rows={5} maxLength={2000} />
                  </div>
                  <Button type="submit" disabled={loading} className="bg-accent text-accent-foreground hover:bg-gold-light font-semibold w-full sm:w-auto">
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
