import { useState } from "react";
import { deleteEpisode, getSeriesById } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EditEpisodeDialog from "./EditEpisodeDialog";

export default function EpisodeListDialog({ seriesId, open, onOpenChange }) {
    const { toast } = useToast();
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingEpisode, setEditingEpisode] = useState(null);

    // Fetch episodes when dialog opens
    useState(() => {
        if (open && seriesId) {
            setLoading(true);
            getSeriesById(seriesId)
                .then(data => setEpisodes(data.episodes || []))
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [open, seriesId]);

    const refreshEpisodes = () => {
        getSeriesById(seriesId)
            .then(data => setEpisodes(data.episodes || []))
            .catch(console.error);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this episode?")) return;
        try {
            await deleteEpisode(id);
            toast({ title: "Deleted", description: "Episode deleted successfully." });
            refreshEpisodes();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete episode.", variant: "destructive" });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-white/10 text-white max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Manage Episodes</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableHead>Season</TableHead>
                                <TableHead>Ep</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {episodes.map(ep => (
                                <TableRow key={ep._id} className="border-white/5 hover:bg-white/5">
                                    <TableCell>{ep.season || 1}</TableCell>
                                    <TableCell>{ep.episodeNumber}</TableCell>
                                    <TableCell>{ep.title}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button size="sm" variant="ghost" onClick={() => setEditingEpisode(ep)}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => handleDelete(ep._id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {episodes.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">No episodes found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}

                {editingEpisode && (
                    <EditEpisodeDialog
                        episode={editingEpisode}
                        open={!!editingEpisode}
                        onOpenChange={(open) => !open && setEditingEpisode(null)}
                        onUpdate={refreshEpisodes}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
