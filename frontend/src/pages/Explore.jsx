import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimeCard } from "@/components/AnimeCard";
import { getAllSeries } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function Explore() {
    const [series, setSeries] = useState([]);
    const [filteredSeries, setFilteredSeries] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("All");
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
        getAllSeries().then(data => {
            // Map data
            const mapped = data.map(s => ({
                id: s._id,
                title: s.title,
                image: s.imageURL,
                rating: s.rating,
                year: s.releaseDate ? new Date(s.releaseDate).getFullYear() : "N/A",
                status: s.status,
                genre: s.genre ? s.genre.split(',').map(g => g.trim()) : [],
                episodes: s.episodes || []
            }));
            setSeries(mapped);
            setFilteredSeries(mapped);
            setLoading(false);
        }).catch(console.error);
    }, []);

    // Extract unique genres
    const allGenres = ["All", ...new Set(series.flatMap(s => s.genre))].sort();

    useEffect(() => {
        let result = [...series];

        // Filter by Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(s => s.title.toLowerCase().includes(query));
        }

        // Filter by Genre
        if (selectedGenre !== "All") {
            result = result.filter(s => s.genre.includes(selectedGenre));
        }

        // Sort
        switch (sortBy) {
            case "a-z":
                result.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "z-a":
                result.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case "rating":
                result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case "newest":
            default:
                // Assuming original order is newest or we use ID/Date if available
                // If we want strict date sort:
                // result.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                // For now, we rely on the initial fetch order which is usually newest first from backend
                break;
        }

        setFilteredSeries(result);
    }, [series, searchQuery, selectedGenre, sortBy]);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="container mx-auto px-6 py-24 flex-1">
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-white mb-2">Explore</h1>
                        <p className="text-muted-foreground">Discover your next favorite anime</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        {/* Search */}
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search anime..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-secondary border-none"
                            />
                        </div>

                        {/* Genre Filter */}
                        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                            <SelectTrigger className="w-full sm:w-40 bg-secondary border-none">
                                <SelectValue placeholder="Genre" />
                            </SelectTrigger>
                            <SelectContent>
                                {allGenres.map(g => (
                                    <SelectItem key={g} value={g}>{g}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Sort */}
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full sm:w-40 bg-secondary border-none">
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="rating">Top Rated</SelectItem>
                                <SelectItem value="a-z">A-Z</SelectItem>
                                <SelectItem value="z-a">Z-A</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-muted-foreground">Loading...</div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {filteredSeries.map(anime => (
                                <AnimeCard key={anime.id} anime={anime} />
                            ))}
                        </div>

                        {filteredSeries.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground">
                                No anime found matching your criteria.
                            </div>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
}
