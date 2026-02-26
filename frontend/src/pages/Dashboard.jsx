import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimeCard } from "@/components/AnimeCard";
import { useEffect, useState } from "react";
import { getBookmarks } from "@/lib/api";
import { useLocation } from "wouter";
import { User, Settings, Bookmark, Pen, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const { user, isLoading, updateProfile } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [_, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setNewUsername(user.username);
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

  const handleUpdateProfile = async () => {
    setError("");
    setSuccess("");
    try {
      await updateProfile({ username: newUsername });
      setSuccess("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      setError(err.toString());
    }
  };

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [isLoading, user, setLocation]);

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="container mx-auto px-6 pt-24 pb-12 flex-1">
        <h1 className="text-3xl font-display font-bold text-white mb-8">Account Overview</h1>

        {/* Profile Card */}
        <div className="bg-card border border-white/5 rounded-lg p-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 shrink-0">
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="bg-background border-white/10 text-white max-w-xs"
                    placeholder="New username"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleUpdateProfile}
                      className="bg-white text-black hover:bg-white/90"
                    >
                      <Check className="w-3.5 h-3.5 mr-1.5" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setNewUsername(user.username);
                        setError("");
                      }}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <X className="w-3.5 h-3.5 mr-1.5" />
                      Cancel
                    </Button>
                  </div>
                  {error && <p className="text-red-400 text-xs">{error}</p>}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-bold text-lg truncate">{user.username}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-7 h-7 text-muted-foreground hover:text-white hover:bg-white/10"
                      onClick={() => setIsEditing(true)}
                      title="Edit Profile"
                    >
                      <Pen className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.isAdmin && <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded mt-2 inline-block border border-red-500/20">Admin</span>}
                  {success && <p className="text-green-400 text-xs mt-1">{success}</p>}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bookmarks Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-white">My List</h2>
          {bookmarks.length > 0 && (
            <span className="text-xs text-muted-foreground bg-white/5 px-2.5 py-1 rounded-full">
              {bookmarks.length} {bookmarks.length === 1 ? "title" : "titles"}
            </span>
          )}
        </div>

        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {bookmarks.map(anime => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-lg">
            <Bookmark className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white font-medium mb-1">Your watchlist is empty</p>
            <p className="text-sm text-muted-foreground mb-4">Explore and bookmark anime to build your list</p>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => setLocation("/explore")}
            >
              Browse Anime
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
