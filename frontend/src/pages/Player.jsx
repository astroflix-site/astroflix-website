import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getEpisodeById } from "@/lib/api";

export default function Player() {
  const [match, params] = useRoute("/watch/:episodeId");
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedServer, setSelectedServer] = useState(0);

  useEffect(() => {
    if (params?.episodeId) {
      setLoading(true);
      getEpisodeById(params.episodeId)
        .then((ep) => {
          setEpisode(ep);
          setSelectedServer(0); // Default to first server
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

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="absolute top-0 left-0 p-6 z-50">
        <Link href="/">
          <Button variant="ghost" className="text-white hover:bg-white/10 gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back to Browse
          </Button>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center bg-black relative">
        <div className="w-full h-full absolute inset-0">
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
        <div className="max-w-6xl mx-auto space-y-4">
          {/* Server Selection Buttons */}
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

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{episode.title}</h2>
            <p className="text-muted-foreground">Episode {episode.episodeNumber} • Season {episode.season || 1}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
