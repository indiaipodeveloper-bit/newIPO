import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Play, Video, Loader2, ChevronRight } from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  youtube_id: string;
}

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

const VideoCard = ({ video, idx }: { video: VideoItem; idx: number }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300 group"
    >
      <div className="relative aspect-video bg-foreground/5">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.youtube_id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full cursor-pointer group/play"
          >
            <img
              src={`https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-foreground/30 group-hover/play:bg-foreground/40 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center shadow-lg group-hover/play:scale-110 transition-transform">
                <Play className="h-7 w-7 text-primary-foreground fill-primary-foreground ml-1" />
              </div>
            </div>
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold font-heading text-foreground text-sm line-clamp-2">{video.title}</h3>
      </div>
    </motion.div>
  );
};

const IPOVideoSection = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
        const playlistId = import.meta.env.VITE_YOUTUBE_PLAYLIST_ID;
        
        if (apiKey && playlistId) {
          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=3&playlistId=${playlistId}&key=${apiKey}`
          );
          
          if (res.ok) {
            const data = await res.json();
            const mappedVideos: VideoItem[] = data.items.map((item: any) => ({
              id: item.snippet.resourceId.videoId,
              title: item.snippet.title,
              youtube_id: item.snippet.resourceId.videoId
            }));
            setVideos(mappedVideos);
          } else {
            throw new Error("YouTube fetch failed");
          }
        } else {
          // Fallback to local API
          const res = await fetch("/api/videos");
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setVideos(data.map((v: any) => ({
              id: String(v.id),
              title: v.title,
              youtube_id: v.youtube_id || extractYoutubeId(v.url) || ""
            })));
          }
        }
      } catch (err) {
        console.error("Failed to load videos", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">Loading latest updates...</p>
        </div>
      </section>
    );
  }

  if (videos.length === 0) return null;


  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20 mb-6">
            <Video className="h-3.5 w-3.5" />
            IPO Video Updates
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-foreground mb-4">
            Watch Our <span className="text-primary">IPO Video Updates</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-8 h-1 rounded-full bg-primary" />
            <div className="w-4 h-1 rounded-full bg-primary/40" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, idx) => (
            <VideoCard key={video.id} video={video} idx={idx} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5 rounded-xl font-semibold" asChild>
            <Link to="/ipo-and-market-snaps">
              View All Videos
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default IPOVideoSection;
