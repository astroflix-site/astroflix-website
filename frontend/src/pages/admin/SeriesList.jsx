import { useEffect, useState } from "react";
import { getAllSeries, deleteSeries } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, Search, Edit, Trash2, ListVideo } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EditSeriesDialog from "./EditSeriesDialog";
import EpisodeListDialog from "./EpisodeListDialog";

export default function SeriesList() {
  const [series, setSeries] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState(null);

  const [editingSeries, setEditingSeries] = useState(null);
  const [managingEpisodesId, setManagingEpisodesId] = useState(null);

  const fetchSeries = () => {
    getAllSeries().then((data) => {
      setSeries(data || []);
      setFilteredSeries(data || []);
    }).catch(console.error);
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = series.filter(s =>
      s.title.toLowerCase().includes(query) ||
      String(s._id).includes(query)
    );
    setFilteredSeries(filtered);
  }, [searchQuery, series]);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast({ title: "Copied", description: "Series ID copied to clipboard" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this series? This action cannot be undone.")) return;
    try {
      await deleteSeries(id);
      toast({ title: "Deleted", description: "Series deleted successfully." });
      fetchSeries();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete series.", variant: "destructive" });
    }
  };

  return (
    <Card className="bg-card border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex justify-between items-center">
          <span>Series List</span>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-black/20 border-white/10"
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Title</TableHead>
              <TableHead className="text-muted-foreground">ID</TableHead>
              <TableHead className="text-muted-foreground">Episodes</TableHead>
              <TableHead className="text-right text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSeries.map((s) => (
              <TableRow key={s._id} className="border-white/5 hover:bg-white/5">
                <TableCell className="text-white font-medium">{s.title}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{s._id}</TableCell>
                <TableCell>{s.episodes?.length || 0}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-white hover:bg-white/10"
                    onClick={() => handleCopy(s._id)}
                    title="Copy ID"
                  >
                    {copiedId === s._id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-white hover:bg-white/10"
                    onClick={() => setManagingEpisodesId(s._id)}
                    title="Manage Episodes"
                  >
                    <ListVideo className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-white hover:bg-white/10"
                    onClick={() => setEditingSeries(s)}
                    title="Edit Series"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-white/10"
                    onClick={() => handleDelete(s._id)}
                    title="Delete Series"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredSeries.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No series found matching "{searchQuery}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {editingSeries && (
        <EditSeriesDialog
          series={editingSeries}
          open={!!editingSeries}
          onOpenChange={(open) => !open && setEditingSeries(null)}
          onUpdate={fetchSeries}
        />
      )}

      {managingEpisodesId && (
        <EpisodeListDialog
          seriesId={managingEpisodesId}
          open={!!managingEpisodesId}
          onOpenChange={(open) => !open && setManagingEpisodesId(null)}
        />
      )}
    </Card>
  );
}
