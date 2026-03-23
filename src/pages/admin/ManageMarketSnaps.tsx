import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Loader2, PlayCircle, Clock, Youtube, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface SocialMedia {
  id: string | number;
  title: string;
  url: string;
  img_url: string;
  status: string;
  created_at: string;
}

const ManageMarketSnaps = () => {
  const [videos, setVideos] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageTokens, setPageTokens] = useState<Record<number, string | null>>({ 1: null });

  const limit = 20;

  const fetchVideos = async (currentPage = 1) => {
    try {
      setLoading(true);
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      const playlistId = import.meta.env.VITE_YOUTUBE_PLAYLIST_ID;
      
      const token = pageTokens[currentPage] || null;
      const tokenParam = token ? `&pageToken=${token}` : "";
      
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${limit}&playlistId=${playlistId}&key=${apiKey}${tokenParam}`
      );
      
      if (res.ok) {
        const data = await res.json();
        const mappedVideos: SocialMedia[] = data.items.map((item: any) => ({
          id: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
          img_url: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
          status: "published",
          created_at: item.snippet.publishedAt,
        }));
        setVideos(mappedVideos);

        if (data.pageInfo) {
          setTotalPages(Math.ceil(data.pageInfo.totalResults / limit));
        }

        if (data.nextPageToken) {
          setPageTokens(prev => ({ ...prev, [currentPage + 1]: data.nextPageToken }));
        }
      } else {
        throw new Error("Failed to load videos from YouTube");
      }
    } catch (err) {
      console.error("YouTube Fetch Error:", err);
      toast.error("Failed to load market snaps from YouTube");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(page);
  }, [page]);

  const extractYoutubeId = (url: string) => {
    if (!url) return null;
    if (!url.includes('/')) {
        const potentialId = url.split('?')[0];
        if (potentialId.length === 11) return potentialId;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getVideoLink = (url: string) => {
    if (!url) return "#";
    if (!url.includes('/')) {
        const id = url.split('?')[0];
        if (id.length === 11) return `https://www.youtube.com/watch?v=${id}`;
    }
    return url;
  };

  const getThumbnail = (video: SocialMedia) => {
    if (video.img_url && video.img_url.startsWith('http')) return video.img_url;
    
    let yId = extractYoutubeId(video.url);
    if (yId && yId.length === 11) return `https://img.youtube.com/vi/${yId}/hqdefault.jpg`;
    return "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-heading">Market Snaps (YouTube Feed)</h1>
            <p className="text-sm text-muted-foreground italic">Fetching directly from YouTube Playlist: PLPFGVZD8H7BjbqdjRZH2F-dSDGVVPHomq</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 text-red-600 text-xs font-bold border border-red-500/20">
              <Youtube className="w-3.5 h-3.5" />
              Live Sync
            </span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-24 text-muted-foreground bg-card border rounded-2xl">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
            <p className="animate-pulse">Fetching latest videos from YouTube...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground border rounded-2xl bg-card shadow-sm">
            <Youtube className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No videos found in the playlist.</p>
            <p className="text-sm">Make sure your YouTube Playlist ID is correct in .env</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col group hover:border-primary/50 transition-colors">
                  <div className="relative aspect-video bg-muted overflow-hidden">
                    <img src={getThumbnail(video)} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 right-2">
                      <div className="bg-black/60 backdrop-blur-md p-1.5 rounded-lg text-white">
                        <Youtube className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={getVideoLink(video.url)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white font-bold text-sm shadow-xl transform scale-90 group-hover:scale-100 transition-all">
                        <PlayCircle className="w-5 h-5" /> View on YouTube
                      </a>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">{video.title}</h3>
                    
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
                      <span className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(video.created_at).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </span>
                      <a 
                        href={getVideoLink(video.url)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        Source <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12 bg-card border p-4 rounded-xl shadow-sm">
                <Button 
                  variant="outline" 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page === 1}
                  className="rounded-lg"
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">Page {page}</span>
                  <span className="text-sm text-muted-foreground">of {totalPages}</span>
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                  disabled={page === totalPages || !pageTokens[page + 1]}
                  className="rounded-lg"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageMarketSnaps;
