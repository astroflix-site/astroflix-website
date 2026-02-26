import { useState, useEffect } from "react";
import { getAllUsers, deleteUser } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Eye, Search, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UserDetailsDialog from "./UserDetailsDialog";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        getAllUsers().then(setUsers).catch(console.error);
    }, []);

    const filteredUsers = users.filter(u => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            u.username?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q) ||
            String(u._id).includes(q)
        );
    });

    const handleDeleteUser = async (e, id) => {
        e.stopPropagation();
        try {
            await deleteUser(id);
            setUsers(users.filter(u => u._id !== id));
            toast({
                title: "User deleted",
                description: "The user has been removed from the database.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete user",
                variant: "destructive"
            });
        }
    };

    const handleRowClick = (userId) => {
        setSelectedUserId(userId);
        setDialogOpen(true);
    };

    const formatLastLogin = (dateStr) => {
        if (!dateStr) return "Never";
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 30) return `${diffDays}d ago`;
        return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    return (
        <Card className="bg-card border-white/10">
            <CardHeader>
                <CardTitle className="text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <span>User Management</span>
                        <span className="text-xs font-normal text-muted-foreground bg-white/5 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                            <Users className="w-3 h-3" />
                            {users.length}
                        </span>
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email or ID..."
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
                            <TableHead className="text-muted-foreground">ID</TableHead>
                            <TableHead className="text-muted-foreground">Username</TableHead>
                            <TableHead className="text-muted-foreground">Email</TableHead>
                            <TableHead className="text-muted-foreground">Role</TableHead>
                            <TableHead className="text-muted-foreground hidden md:table-cell">Last Login</TableHead>
                            <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((u) => (
                            <TableRow
                                key={u._id}
                                className="border-white/5 hover:bg-white/5 cursor-pointer"
                                onClick={() => handleRowClick(u._id)}
                            >
                                <TableCell className="font-mono text-xs">{u._id}</TableCell>
                                <TableCell className="text-white font-medium">{u.username}</TableCell>
                                <TableCell>{u.email}</TableCell>
                                <TableCell>
                                    {u.role === 'admin' ? (
                                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">Admin</span>
                                    ) : (
                                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded">User</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm hidden md:table-cell">
                                    {formatLastLogin(u.lastLogin)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 mr-1"
                                        onClick={(e) => { e.stopPropagation(); handleRowClick(u._id); }}
                                        title="View Details"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                                        onClick={(e) => handleDeleteUser(e, u._id)}
                                        title="Delete User"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredUsers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                    {searchQuery ? `No users found matching "${searchQuery}"` : "No users found."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>

            <UserDetailsDialog
                userId={selectedUserId}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </Card>
    );
}
