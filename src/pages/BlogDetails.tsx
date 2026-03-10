import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Calendar, ArrowLeft, Loader2, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

const fallbackImage = "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop";

export default function BlogDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/blogs/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you are looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate("/blog")}>Back to Blogs</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedDate = post.created_at && !isNaN(new Date(post.created_at).getTime()) 
    ? new Date(post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "No date";

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title={post.meta_title || post.title} 
        description={post.excerpt} 
      />
      <Header />
      <main className="flex-1 bg-background pb-16">
        {/* Hero Section */}
        <section className="relative h-[400px] md:h-[500px] w-full bg-muted">
          <img
            src={post.image_url || fallbackImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e: any) => { e.target.src = fallbackImage; }}
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-12">
              <Button 
                variant="ghost" 
                className="text-white hover:text-white/80 hover:bg-white/10 mb-6 pl-0"
                onClick={() => navigate("/blog")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to all articles
              </Button>
              
              {post.category && (
                <span className="inline-block bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-full mb-4">
                  {post.category}
                </span>
              )}
              
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading leading-tight max-w-4xl">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <span>{post.author || "Admin"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 pt-12">
          <div className="max-w-3xl mx-auto">
            <div 
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: post.content || "<p>No content available.</p>" }}
            />
            
            {post.tags && (
              <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-2">
                <div className="flex items-center gap-2 text-muted-foreground mr-2">
                  <Tag className="h-4 w-4" /> Tags:
                </div>
                {post.tags.split(',').map((tag: string, i: number) => (
                  <span key={i} className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
