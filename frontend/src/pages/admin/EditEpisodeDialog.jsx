import { useState } from "react";
import { updateEpisode } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EditEpisodeDialog({ episode, open, onOpenChange, onUpdate }) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: episode.title,
        episodeNumber: episode.episodeNumber,
        season: episode.season || 1,
        url: episode.url
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateEpisode(episode._id, formData);
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
            <DialogContent className="bg-card border-white/10 text-white">
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
                    <div className="space-y-2">
                        <Label>Video URL</Label>
                        <Input name="url" value={formData.url} onChange={handleChange} className="bg-black/20 border-white/10" required />
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
