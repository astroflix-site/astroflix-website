import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { getEpisodeById, getSeriesById } from "@/lib/api";

export default function Player() {
  const [match, params] = useRoute("/watch/:episodeId");
  const [episode, setEpisode] = useState(null);
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedServer, setSelectedServer] = useState(0);

  useEffect(() => {
    if (params?.episodeId) {
      setLoading(true);
      getEpisodeById(params.episodeId)
        .then(async (ep) => {
          setEpisode(ep);
          setSelectedServer(0); // Default to first server

          // Fetch series details to get episode list
          if (ep.series) {
            try {
              const seriesData = await getSeriesById(ep.series);
              setSeries(seriesData);
            } catch (err) {
              console.error("Failed to load series details", err);
            }
          }
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load episode.");
        })
        .finally(() => setLoading(false));
    }
  }, [params?.episodeId]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  if (error) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">{error}</div>;
  if (!episode) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Episode not found</div>;

  // Get servers array (backward compatible)
  const servers = episode.servers || [{ name: 'Server 1', url: episode.url }];
  const currentServer = servers[selectedServer] || servers[0];

  // Calculate Next/Prev
  let nextEpisode = null;
  let prevEpisode = null;
  let upNextEpisodes = [];

  if (series && series.episodes) {
    const currentIndex = series.episodes.findIndex(e => e._id === episode._id || e.id === episode._id);
    if (currentIndex !== -1) {
      if (currentIndex > 0) prevEpisode = series.episodes[currentIndex - 1];
      if (currentIndex < series.episodes.length - 1) nextEpisode = series.episodes[currentIndex + 1];

      // Get next 5 episodes
      upNextEpisodes = series.episodes.slice(currentIndex + 1, currentIndex + 6);
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="absolute top-0 left-0 p-6 z-50">
        <Link href={series ? `/anime/${series._id}` : "/"}>
          <Button variant="ghost" className="text-white hover:bg-white/10 gap-2">
            <ArrowLeft className="w-5 h-5" />
            {series ? `Back to ${series.title}` : "Back to Browse"}
          </Button>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center bg-black p-4 lg:p-8">
        <div className="w-full max-w-[1400px] aspect-video relative bg-black rounded-lg overflow-hidden border border-white/10 shadow-2xl">
          {currentServer && currentServer.url ? (
            <iframe
              key={selectedServer} // Force reload on server change
              src={currentServer.url}
              className="w-full h-full border-0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              Server unavailable
            </div>
          )}
        </div>
      </div>

      <div className="bg-background p-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">{episode.title}</h2>
                  <p className="text-sm md:text-base text-muted-foreground">Episode {episode.episodeNumber} • Season {episode.season || 1}</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <Link className="flex-1 md:flex-none" href={prevEpisode ? `/watch/${prevEpisode._id || prevEpisode.id}` : "#"}>
                    <Button variant="outline" disabled={!prevEpisode} className="w-full md:w-auto border-white/20 text-white hover:bg-white/10">
                      <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                    </Button>
                  </Link>
                  <Link className="flex-1 md:flex-none" href={nextEpisode ? `/watch/${nextEpisode._id || nextEpisode.id}` : "#"}>
                    <Button variant="default" disabled={!nextEpisode} className="w-full md:w-auto bg-white text-black hover:bg-white/90">
                      Next <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Server Selection Buttons */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Select Server:</p>
                <div className="flex gap-2 flex-wrap">
                  {[0, 1, 2, 3, 4].map((index) => {
                    const server = servers[index];
                    const isAvailable = server && server.url;
                    const isActive = selectedServer === index;

                    return (
                      <Button
                        key={index}
                        onClick={() => isAvailable && setSelectedServer(index)}
                        disabled={!isAvailable}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        className={`
                          ${isActive ? 'bg-white text-black hover:bg-white/90' : 'bg-transparent border-white/20 text-white hover:bg-white/10'}
                          ${!isAvailable ? 'opacity-40 cursor-not-allowed' : ''}
                        `}
                      >
                        Server {index + 1}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Up Next List */}
            {upNextEpisodes.length > 0 && (
              <div className="w-full lg:w-80 space-y-4">
                <h3 className="text-lg font-bold text-white">Up Next</h3>
                <div className="space-y-2">
                  {upNextEpisodes.map((ep) => (
                    <Link key={ep._id || ep.id} href={`/watch/${ep._id || ep.id}`}>
                      <div className="group m-2 flex items-center gap-3 p-3 rounded-md bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                        <div className="flex-none w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {ep.episodeNumber}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-white truncate group-hover:text-primary transition-colors">{ep.title}</h4>
                          <span className="text-xs text-muted-foreground">24:00</span>
                        </div>
                        <Play className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
