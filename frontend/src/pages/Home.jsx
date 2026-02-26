import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimeCard } from "@/components/AnimeCard";
import { Button } from "@/components/ui/button";
import { getAllSeries, getSeriesById } from "@/lib/api";
import { Play, Info } from "lucide-react";

function HeroSkeleton() {
  return (
    <div className="relative w-full h-[85vh] lg:h-[95vh] overflow-hidden">
      <div className="absolute inset-0 bg-secondary animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full p-6 lg:p-16 pb-24 z-10 flex flex-col items-start gap-5 max-w-3xl">
        <div className="h-14 md:h-20 w-80 bg-white/5 rounded-lg animate-pulse" />
        <div className="flex items-center gap-3">
          <div className="h-5 w-20 bg-white/5 rounded animate-pulse" />
          <div className="h-5 w-12 bg-white/5 rounded animate-pulse" />
          <div className="h-5 w-10 bg-white/5 rounded animate-pulse" />
          <div className="h-5 w-32 bg-white/5 rounded animate-pulse" />
        </div>
        <div className="space-y-2 w-full max-w-xl">
          <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-white/5 rounded animate-pulse" />
          <div className="h-4 w-3/5 bg-white/5 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="h-12 w-40 bg-white/10 rounded-md animate-pulse" />
          <div className="h-12 w-36 bg-white/5 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex-none w-[160px] md:w-[200px]">
      <div className="aspect-[2/3] rounded-md bg-secondary animate-pulse" />
      <div className="mt-3 space-y-2">
        <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
          <div className="h-3 w-8 bg-white/5 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function RowSkeleton({ title }) {
  return (
    <section>
      <div className="h-7 w-40 bg-white/5 rounded mb-6 animate-pulse" />
      <div className="flex gap-4 overflow-hidden -mx-6 px-6 lg:-mx-12 lg:px-12">
        {Array.from({ length: 7 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const seriesData = await getAllSeries();

        const mappedData = seriesData.map(s => ({
          id: s._id,
          title: s.title,
          description: s.description,
          image: s.imageURL,
          backdrop: s.backdrop || s.imageURL,
          rating: s.rating,
          genre: s.genre ? s.genre.split(',').map(g => g.trim()) : [],
          year: s.releaseDate ? new Date(s.releaseDate).getFullYear() : "N/A",
          status: s.status,
          episodes: s.episodes || []
        }));

        const popularData = [...mappedData].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        setTrending(popularData);

        const latestData = [...mappedData].sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0));
        setLatest(latestData);

        if (mappedData.length > 0) {
          setFeatured(mappedData[0]);
        }
      } catch (error) {
        console.error("Failed to fetch series:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch featured details for episode links
  useEffect(() => {
    if (featured && !featured.realEpisodesFetched) {
      getSeriesById(featured.id).then(data => {
        if (data && data.episodes && data.episodes.length > 0) {
          setFeatured(prev => ({
            ...prev,
            episodes: data.episodes.map(e => e._id),
            realEpisodesFetched: true
          }));
        }
      });
    }
  }, [featured]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Section */}
      {loading ? (
        <HeroSkeleton />
      ) : featured ? (
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
              <span>{featured.genre.join(" \u2022 ")}</span>
            </div>

            <p className="text-muted-foreground text-base md:text-lg line-clamp-3 max-w-xl drop-shadow-md">
              {featured.description}
            </p>

            <div className="flex items-center gap-4 mt-4">
              <Link href={featured.episodes && featured.episodes.length > 0 && featured.episodes[0] ? `/watch/${featured.episodes[0]}` : `/anime/${featured.id}`}>
                <Button size="lg" className="bg-white text-black hover:bg-white/90 font-bold px-8 h-12 text-base rounded-md">
                  <Play className="w-5 h-5 mr-2 fill-black" />
                  {featured.episodes && featured.episodes.length > 0 && featured.episodes[0] ? "Play Now" : "View Details"}
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
      ) : null}

      {/* Content Rows */}
      <div className="relative z-20 -mt-16 pb-20 space-y-12 px-6 lg:px-12">
        {loading ? (
          <>
            <RowSkeleton />
            <RowSkeleton />
          </>
        ) : (
          <>
            <section>
              <h2 className="text-xl md:text-2xl font-display font-semibold text-white mb-6">Popular</h2>
              <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide -mx-6 px-6 lg:-mx-12 lg:px-12">
                {trending.slice(0, 10).map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-display font-semibold text-white mb-6">Latest Uploads</h2>
              <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide -mx-6 px-6 lg:-mx-12 lg:px-12">
                {latest.slice(0, 10).map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
