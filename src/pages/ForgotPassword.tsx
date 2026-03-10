import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock — replace with: authApi.forgotPassword(email)
    toast.success("Password reset link sent to your email!");
    setSent(true);
  };

  return (
    <div className="min-h-screen">
      <SEOHead title="Forgot Password" description="Reset your IndiaIPO account password." />
      <Header />
      <main className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-3">
                  <KeyRound className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Forgot Password</h1>
                <p className="text-sm text-muted-foreground mt-1">Enter your email to receive a reset link</p>
              </div>

              {sent ? (
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    If an account exists with <strong className="text-foreground">{email}</strong>, you'll receive a password reset link shortly.
                  </p>
                  <Link to="/login" className="text-accent hover:underline text-sm font-medium">Back to Login</Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                    <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
                  </div>
                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-gold-light font-semibold">
                    Send Reset Link
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    <Link to="/login" className="text-accent hover:underline">Back to Login</Link>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
