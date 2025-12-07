import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageSeries from "./admin/ManageSeries";
import UploadVideo from "./admin/UploadVideo";
import UserManagement from "./admin/UserManagement";
import SeriesList from "./admin/SeriesList";

export default function AdminPanel() {
    const { user, isLoading: authLoading } = useAuth();

    if (authLoading) return null;

    if (!user?.isAdmin) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">Access Denied</div>;
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />

            <div className="container mx-auto px-6 pt-24 pb-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-display font-bold text-white">Admin Dashboard</h1>
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/20">ADMIN ACCESS</span>
                </div>

                <Tabs defaultValue="series" className="space-y-8">
                    <TabsList className="bg-secondary/50 border border-white/5">
                        <TabsTrigger value="series">Manage Series</TabsTrigger>
                        <TabsTrigger value="list">Series List</TabsTrigger>
                        <TabsTrigger value="upload">Upload Video</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                    </TabsList>

                    <TabsContent value="series">
                        <ManageSeries />
                    </TabsContent>

                    <TabsContent value="list">
                        <SeriesList />
                    </TabsContent>

                    <TabsContent value="upload">
                        <UploadVideo />
                    </TabsContent>

                    <TabsContent value="users">
                        <UserManagement />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
