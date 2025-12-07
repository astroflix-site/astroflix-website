
import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getSeriesById, addBookmark, removeBookmark, getBookmarks } from "@/lib/api";
import { Play, Plus, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function AnimeDetail() {
  const [match, params] = useRoute("/anime/:id");
  const [anime, setAnime] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (params?.id) {
      setLoading(true);

      // Fetch series details
      getSeriesById(params.id)
        .then((data) => {
          if (data) {
            const mappedAnime = {
              id: data._id,
              title: data.title,
              description: data.description,
              image: data.imageURL,
              backdrop: data.backdrop || data.imageURL,
              rating: data.rating,
              year: data.releaseDate ? new Date(data.releaseDate).getFullYear() : "N/A",
              status: data.status,
              genre: data.genre ? data.genre.split(',').map(g => g.trim()) : [],
              episodes: data.episodes ? data.episodes.map(ep => ({
                id: ep._id,
                number: ep.episodeNumber,
                title: ep.title,
                duration: "24:00",
                url: ep.url
              })) : []
            };
            setAnime(mappedAnime);
          }
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load series details.");
        })
        .finally(() => setLoading(false));

      // Check if bookmarked
      if (user) {
        getBookmarks().then(bookmarks => {
          const isMarked = bookmarks.some(b => b._id === params.id);
          setIsBookmarked(isMarked);
        }).catch(console.error);
      }
    }
  }, [params?.id, user]);

  const handleBookmarkToggle = async () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please login to add to your list.", variant: "destructive" });
      return;
    }

    try {
      if (isBookmarked) {
        await removeBookmark(anime.id);
        setIsBookmarked(false);
        toast({ title: "Removed from List", description: `${anime.title} has been removed.` });
      } else {
        await addBookmark(anime.id);
        setIsBookmarked(true);
        toast({ title: "Added to List", description: `${anime.title} has been added.` });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update list.", variant: "destructive" });
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  if (error) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">{error}</div>;
  if (!anime) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Series not found</div>;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* Backdrop */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
        <img src={anime.backdrop} alt={anime.title} className="w-full h-full object-cover opacity-50" />
      </div>

      <div className="container mx-auto px-6 -mt-32 relative z-20 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-none w-64 rounded-lg overflow-hidden shadow-2xl border border-white/10 hidden md:block">
            <img src={anime.image} alt={anime.title} className="w-full h-auto" />
          </div>

          {/* Details */}
          <div className="flex-1 pt-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">{anime.title}</h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="text-green-400 font-bold">{anime.rating} Match</span>
              <span>{anime.year}</span>
              <span>{anime.episodes.length} Episodes</span>
              <span className="border border-white/20 px-2 py-0.5 rounded text-xs">{anime.status}</span>
            </div>

            <div className="flex gap-4 mb-8">
              <Link href={anime.episodes.length > 0 ? `/watch/${anime.episodes[0].id}` : "#"}>
                <Button className="bg-white text-black hover:bg-white/90 font-bold px-8">
                  <Play className="w-4 h-4 mr-2 fill-black" />
                  Play Episode 1
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={handleBookmarkToggle}
              >
                {isBookmarked ? <Check className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                My List
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-2">Synopsis</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{anime.description}</p>
              </div>
              <div className="md:col-span-1 space-y-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Genres:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {anime.genre.map(g => (
                      <span key={g} className="text-white hover:underline cursor-pointer">{g}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Episode List */}
            <div className="mt-12">
              <h3 className="text-2xl font-display font-bold text-white mb-6">Episodes</h3>
              <div className="grid gap-2">
                {anime.episodes.map((ep) => (
                  <Link href={`/watch/${ep.id}`} key={ep.id}>
                    <div className="group flex items-center gap-4 p-4 rounded-md hover:bg-white/10 transition-colors cursor-pointer border-b border-white/5 last:border-0">
                      <div className="w-8 text-center text-muted-foreground font-mono">{ep.number}</div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium group-hover:text-primary transition-colors">{ep.title}</h4>
                        <span className="text-xs text-muted-foreground">{ep.duration}</span>
                      </div>
                      <Play className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
                {anime.episodes.length === 0 && (
                  <div className="text-muted-foreground">No episodes available yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

