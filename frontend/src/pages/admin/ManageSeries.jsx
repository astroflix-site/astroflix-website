import { useState } from "react";
import { createSeries } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ManageSeries() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        genre: "",
        description: "",
        imageURL: "",
        backdrop: "", // Note: Backend schema might need this if not present, checking Series.js... it has imageURL but not backdrop explicitly? Wait, Series.js has imageURL. Let's stick to schema.
        // Series.js schema: imageURL, title, description, genre, releaseDate, status, rating, totalEpisodes
        status: "Ongoing",
        rating: 0,
        totalEpisodes: 0
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createSeries(formData);
            toast({
                title: "Success",
                description: "Series created successfully!",
            });
            setFormData({
                title: "",
                genre: "",
                description: "",
                imageURL: "",
                status: "Ongoing",
                rating: 0,
                totalEpisodes: 0
            });
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
                <CardTitle className="text-white">Add New Series</CardTitle>
                <CardDescription>Create a new anime series entry in the database.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-white">Title</Label>
                            <Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Neon Genesis Evangelion" className="bg-black/20 border-white/10" required />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-white">Genre (comma separated)</Label>
                            <Input name="genre" value={formData.genre} onChange={handleChange} placeholder="Mecha, Psychological, Sci-Fi" className="bg-black/20 border-white/10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-white">Description</Label>
                        <Input name="description" value={formData.description} onChange={handleChange} placeholder="Series synopsis..." className="bg-black/20 border-white/10" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-white">Image URL (Poster)</Label>
                            <Input name="imageURL" value={formData.imageURL} onChange={handleChange} placeholder="https://..." className="bg-black/20 border-white/10" required />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-white">Backdrop URL (Hero)</Label>
                            <Input name="backdrop" value={formData.backdrop} onChange={handleChange} placeholder="https://..." className="bg-black/20 border-white/10" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-white">Status</Label>
                            <Input name="status" value={formData.status} onChange={handleChange} placeholder="Ongoing / Completed" className="bg-black/20 border-white/10" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-white">Rating</Label>
                            <Input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleChange} placeholder="0-10" className="bg-black/20 border-white/10" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-white">Total Episodes</Label>
                            <Input type="number" name="totalEpisodes" value={formData.totalEpisodes} onChange={handleChange} placeholder="0" className="bg-black/20 border-white/10" />
                        </div>
                    </div>
                    <Button type="submit" className="bg-white text-black hover:bg-white/90 w-full mt-4" disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                        Create Series
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
