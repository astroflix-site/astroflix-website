import { useState, useEffect } from "react";
import { createEpisode, getAllSeries } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function UploadVideo() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [seriesList, setSeriesList] = useState([]);
    const [formData, setFormData] = useState({
        seriesId: "",
        title: "",
        episodeNumber: "",
        season: "1",
    });
    const [servers, setServers] = useState([{ name: "Server 1", url: "" }]);

    useEffect(() => {
        getAllSeries().then(data => setSeriesList(data || [])).catch(console.error);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSeriesChange = (value) => {
        setFormData(prev => ({ ...prev, seriesId: value }));
    };

    const handleServerChange = (index, value) => {
        const newServers = [...servers];
        newServers[index].url = value;
        setServers(newServers);
    };

    const addServer = () => {
        if (servers.length < 5) {
            setServers([...servers, { name: `Server ${servers.length + 1}`, url: "" }]);
        }
    };

    const removeServer = (index) => {
        if (servers.length > 1) {
            setServers(servers.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Filter out empty server URLs
            const validServers = servers.filter(s => s.url.trim() !== "");

            if (validServers.length === 0) {
                toast({
                    title: "Error",
                    description: "At least one server URL is required",
                    variant: "destructive"
                });
                setLoading(false);
                return;
            }

            await createEpisode({ ...formData, servers: validServers });
            toast({
                title: "Success",
                description: "Episode added successfully!",
            });
            setFormData({
                seriesId: "",
                title: "",
                episodeNumber: "",
                season: "1",
            });
            setServers([{ name: "Server 1", url: "" }]);
        } catch (error) {
            toast({
                title: "Error",
                description: error.toString(),
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-card border-white/10">
            <CardHeader>
                <CardTitle className="text-white">Add Episode</CardTitle>
                <CardDescription>Add a new episode to a series with multiple server options.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-white">Select Series</Label>
                        <Select
                            onValueChange={handleSeriesChange}
                            value={formData.seriesId}
                            key={seriesList.length} // Force re-render when series list loads
                        >
                            <SelectTrigger className="bg-black/20 border-white/10 text-white">
                                <SelectValue placeholder="Select a series" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-white/10 text-white">
                                {seriesList.map(series => (
                                    <SelectItem key={series._id} value={series._id}>{series.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2 col-span-2">
                            <Label className="text-white">Episode Title</Label>
                            <Input name="title" value={formData.title} onChange={handleChange} placeholder="Episode 1: The Beginning" className="bg-black/20 border-white/10" required />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-white">Season</Label>
                            <Input type="number" name="season" value={formData.season} onChange={handleChange} placeholder="1" className="bg-black/20 border-white/10" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-white">Episode Number</Label>
                        <Input type="number" name="episodeNumber" value={formData.episodeNumber} onChange={handleChange} placeholder="1" className="bg-black/20 border-white/10" required />
                    </div>

                    {/* Server URLs Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-white">Video Server URLs</Label>
                            {servers.length < 5 && (
                                <Button
                                    type="button"
                                    onClick={addServer}
                                    variant="outline"
                                    size="sm"
                                    className="bg-transparent border-white/20 text-white hover:bg-white/10"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add Server
                                </Button>
                            )}
                        </div>
                        {servers.map((server, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <div className="flex-1 space-y-1">
                                    <Label className="text-white/60 text-xs">{server.name}</Label>
                                    <Input
                                        type="text"
                                        value={server.url}
                                        onChange={(e) => handleServerChange(index, e.target.value)}
                                        placeholder={`https://server${index + 1}.example.com/video`}
                                        className="bg-black/20 border-white/10"
                                    />
                                </div>
                                {servers.length > 1 && (
                                    <Button
                                        type="button"
                                        onClick={() => removeServer(index)}
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10 mt-5"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <Button type="submit" className="bg-white text-black hover:bg-white/90 w-full mt-4" disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                        Add Episode
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
