import { useState } from "react";
import { updateSeries } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EditSeriesDialog({ series, open, onOpenChange, onUpdate }) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: series.title,
        genre: series.genre || "",
        description: series.description,
        imageURL: series.imageURL,
        backdrop: series.backdrop || "",
        status: series.status,
        rating: series.rating,
        totalEpisodes: series.totalEpisodes
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateSeries(series._id, formData);
            toast({ title: "Success", description: "Series updated successfully!" });
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
            <DialogContent className="bg-card border-white/10 text-white max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Series</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input name="title" value={formData.title} onChange={handleChange} className="bg-black/20 border-white/10" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Genre</Label>
                            <Input name="genre" value={formData.genre} onChange={handleChange} className="bg-black/20 border-white/10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Input name="description" value={formData.description} onChange={handleChange} className="bg-black/20 border-white/10" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Image URL</Label>
                            <Input name="imageURL" value={formData.imageURL} onChange={handleChange} className="bg-black/20 border-white/10" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Backdrop URL</Label>
                            <Input name="backdrop" value={formData.backdrop} onChange={handleChange} className="bg-black/20 border-white/10" />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Input name="status" value={formData.status} onChange={handleChange} className="bg-black/20 border-white/10" />
                        </div>
                        <div className="space-y-2">
                            <Label>Rating</Label>
                            <Input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleChange} className="bg-black/20 border-white/10" />
                        </div>
                        <div className="space-y-2">
                            <Label>Total Episodes</Label>
                            <Input type="number" name="totalEpisodes" value={formData.totalEpisodes} onChange={handleChange} className="bg-black/20 border-white/10" />
                        </div>
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
