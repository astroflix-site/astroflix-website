import { useState, useEffect } from "react";
import { getAllUsers, deleteUser } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const { toast } = useToast();

    useEffect(() => {
        getAllUsers().then(setUsers).catch(console.error);
    }, []);

    const handleDeleteUser = async (id) => {
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

    return (
        <Card className="bg-card border-white/10">
            <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-transparent">
                            <TableHead className="text-muted-foreground">ID</TableHead>
                            <TableHead className="text-muted-foreground">Username</TableHead>
                            <TableHead className="text-muted-foreground">Email</TableHead>
                            <TableHead className="text-muted-foreground">Role</TableHead>
                            <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((u) => (
                            <TableRow key={u._id} className="border-white/5 hover:bg-white/5">
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
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                                        onClick={() => handleDeleteUser(u._id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
