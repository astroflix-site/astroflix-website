import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimeCard } from "@/components/AnimeCard";
import { useEffect, useState } from "react";
import { getBookmarks } from "@/lib/api";
import { User, Settings, CreditCard } from "lucide-react";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (user) {
      getBookmarks()
        .then((data) => {
          const mappedBookmarks = data.map(s => ({
            id: s._id,
            title: s.title,
            image: s.imageURL,
            rating: s.rating,
            year: s.releaseDate ? new Date(s.releaseDate).getFullYear() : "N/A",
          }));
          setBookmarks(mappedBookmarks);
        })
        .catch(console.error);
    }
  }, [user]);

  if (isLoading) return null;

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="container mx-auto px-6 pt-24 pb-12 flex-1">
        <h1 className="text-3xl font-display font-bold text-white mb-8">Account Overview</h1>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card border border-white/5 p-6 rounded-lg flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10">
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{user.username}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.isAdmin && <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded mt-1 inline-block">Admin</span>}
            </div>
          </div>

          {/* <div className="bg-card border border-white/5 p-6 rounded-lg space-y-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Settings className="w-4 h-4" /> Settings
            </h3>
            <div className="space-y-2">
              <button className="text-sm text-muted-foreground hover:text-white block">Change Password</button>
              <button className="text-sm text-muted-foreground hover:text-white block">Notification Preferences</button>
              <button className="text-sm text-muted-foreground hover:text-white block">Parental Controls</button>
            </div>
          </div>

          <div className="bg-card border border-white/5 p-6 rounded-lg space-y-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Subscription
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-white">Premium Plan (4K HDR)</p>
              <p className="text-xs text-muted-foreground">Next billing date: Jan 12, 2026</p>
              <button className="text-sm text-blue-400 hover:text-blue-300 block mt-2">Manage Subscription</button>
            </div>
          </div> */}
        </div>

        <h2 className="text-2xl font-display font-bold text-white mb-6">My List</h2>
        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {bookmarks.map(anime => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-lg">
            <p className="text-muted-foreground">Your list is empty. Start adding some anime!</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
