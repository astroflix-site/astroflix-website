import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimeCard } from "@/components/AnimeCard";
import { useEffect, useState } from "react";
import { getBookmarks } from "@/lib/api";
import { User, Settings, CreditCard } from "lucide-react";

export default function Dashboard() {
  const { user, isLoading, updateProfile } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="bg-background border border-white/10 rounded px-2 py-1 text-white text-sm w-full"
                    placeholder="New username"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateProfile}
                      className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs hover:bg-primary/90"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setNewUsername(user.username);
                        setError("");
                      }}
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs hover:bg-secondary/80"
                    >
                      Cancel
                    </button>
                  </div>
                  {error && <p className="text-red-400 text-xs">{error}</p>}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold text-lg">{user.username}</h3>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-muted-foreground hover:text-white"
                      title="Edit Profile"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.isAdmin && <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded mt-1 inline-block">Admin</span>}
                  {success && <p className="text-green-400 text-xs mt-1">{success}</p>}
                </>
              )}
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
