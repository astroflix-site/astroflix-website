import { useState, useEffect } from "react";
import { updateEpisode } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EditEpisodeDialog({ episode, open, onOpenChange, onUpdate }) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: episode.title,
        episodeNumber: episode.episodeNumber,
        season: episode.season || 1,
    });
    const [servers, setServers] = useState([]);

    // Initialize servers when episode changes
    useEffect(() => {
        if (episode.servers && episode.servers.length > 0) {
            setServers(episode.servers.map((s, i) => ({
                name: s.name || `Server ${i + 1}`,
                url: s.url || ""
            })));
        } else if (episode.url) {
            // Backward compatibility for old single URL format
            setServers([{ name: "Server 1", url: episode.url }]);
        } else {
            setServers([{ name: "Server 1", url: "" }]);
        }
    }, [episode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

            await updateEpisode(episode._id, { ...formData, servers: validServers });
            toast({ title: "Success", description: "Episode updated successfully!" });
            onUpdate();
            onOpenChange(false);
        } catch (error) {
            toast({ title: "Error", description: error.toString(), variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Episode</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input name="title" value={formData.title} onChange={handleChange} className="bg-black/20 border-white/10" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Episode Number</Label>
                            <Input type="number" name="episodeNumber" value={formData.episodeNumber} onChange={handleChange} className="bg-black/20 border-white/10" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Season</Label>
                            <Input type="number" name="season" value={formData.season} onChange={handleChange} className="bg-black/20 border-white/10" required />
                        </div>
                    </div>

                    {/* Server URLs Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Video Server URLs</Label>
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

                    <DialogFooter>
                        <Button type="submit" className="bg-white text-black hover:bg-white/90" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
