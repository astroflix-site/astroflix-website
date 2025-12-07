import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimeCard } from "@/components/AnimeCard";
import { searchSeries } from "@/lib/api";

export default function SearchResults() {
    const [match, params] = useRoute("/search/:query");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const query = decodeURIComponent(params?.query || "");

    useEffect(() => {
        if (query) {
            setLoading(true);
            searchSeries(query)
                .then((data) => {
                    const mappedResults = data.map(s => ({
                        id: s._id,
                        title: s.title,
                        image: s.imageURL,
                        rating: s.rating,
                        year: s.releaseDate ? new Date(s.releaseDate).getFullYear() : "N/A",
                        status: s.status,
                        genre: s.genre ? s.genre.split(',').map(g => g.trim()) : [],
                    }));
                    setResults(mappedResults);
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [query]);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="container mx-auto px-6 pt-24 pb-12 flex-1">
                <h1 className="text-3xl font-display font-bold text-white mb-2">Search Results</h1>
                <p className="text-muted-foreground mb-8">Found {results.length} results for "{query}"</p>

                {loading ? (
                    <div className="text-white">Loading...</div>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {results.map(anime => (
                            <AnimeCard key={anime.id} anime={anime} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-lg">
                        <p className="text-muted-foreground">No results found for "{query}". Try a different search term.</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
