import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimeCard } from "@/components/AnimeCard";
import { Button } from "@/components/ui/button";
import { getAllSeries } from "@/lib/api";
import { Play, Info } from "lucide-react";

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const seriesData = await getAllSeries();

        // Map backend data to frontend structure if needed
        const mappedData = seriesData.map(s => ({
          id: s._id,
          title: s.title,
          description: s.description,
          image: s.imageURL,
          backdrop: s.backdrop || s.imageURL, // Fallback to poster if no backdrop
          rating: s.rating,
          genre: s.genre ? s.genre.split(',').map(g => g.trim()) : [],
          year: s.releaseDate ? new Date(s.releaseDate).getFullYear() : "N/A",
          year: s.releaseDate ? new Date(s.releaseDate).getFullYear() : "N/A",
          status: s.status,
          episodes: s.episodes || []
        }));

        setTrending(mappedData);
        setLatest([...mappedData].reverse()); // Simple reverse for latest for now
        if (mappedData.length > 0) {
          setFeatured(mappedData[0]);
        }
      } catch (error) {
        console.error("Failed to fetch series:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Section */}
      {featured && (
        <div className="relative w-full h-[85vh] lg:h-[95vh] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={featured.backdrop}
              alt={featured.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 w-full p-6 lg:p-16 pb-24 z-10 flex flex-col items-start gap-6 max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-none tracking-tighter drop-shadow-2xl">
              {featured.title}
            </h1>

            <div className="flex items-center gap-4 text-sm md:text-base font-medium text-white/80">
              <span className="text-green-400 font-bold">{featured.rating} Match</span>
              <span>{featured.year}</span>
              <span className="border border-white/30 px-2 py-0.5 rounded text-xs">HD</span>
              <span>{featured.genre.join(" • ")}</span>
            </div>

            <p className="text-muted-foreground text-base md:text-lg line-clamp-3 max-w-xl drop-shadow-md">
              {featured.description}
            </p>

            <div className="flex items-center gap-4 mt-4">
              <Link href={featured.episodes && featured.episodes.length > 0 ? `/watch/${featured.episodes[0]}` : "#"}>
                <Button size="lg" className="bg-white text-black hover:bg-white/90 font-bold px-8 h-12 text-base rounded-md">
                  <Play className="w-5 h-5 mr-2 fill-black" />
                  Play Now
                </Button>
              </Link>
              <Link href={`/anime/${featured.id}`}>
                <Button size="lg" variant="secondary" className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm px-8 h-12 text-base rounded-md border border-white/10">
                  <Info className="w-5 h-5 mr-2" />
                  More Info
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Content Rows */}
      <div className="relative z-20 -mt-16 pb-20 space-y-12 px-6 lg:px-12">
        <section>
          <h2 className="text-xl md:text-2xl font-display font-semibold text-white mb-6">Trending Now</h2>
          <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide -mx-6 px-6 lg:-mx-12 lg:px-12">
            {trending.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-display font-semibold text-white mb-6">Latest Uploads</h2>
          <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide -mx-6 px-6 lg:-mx-12 lg:px-12">
            {latest.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
