import { useState, useEffect } from "react";
import { getAdminUserDetails } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Calendar, Clock, Bookmark, Shield } from "lucide-react";

export default function UserDetailsDialog({ userId, open, onOpenChange }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open && userId) {
            setLoading(true);
            setError(null);
            setData(null);
            getAdminUserDetails(userId)
                .then(setData)
                .catch((err) => setError(typeof err === "string" ? err : "Failed to load user details"))
                .finally(() => setLoading(false));
        }
    }, [open, userId]);

    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getTimeSince = (dateStr) => {
        if (!dateStr) return null;
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
        const diffMonths = Math.floor(diffDays / 30);
        return `${diffMonths}mo ago`;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0a0a0a] border-white/10 text-white max-w-md max-h-[85vh] overflow-y-auto p-0">
                {loading ? (
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-14 w-14 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                        </div>
                        <Skeleton className="h-px w-full" />
                        <div className="grid grid-cols-2 gap-3">
                            <Skeleton className="h-16 rounded-lg" />
                            <Skeleton className="h-16 rounded-lg" />
                        </div>
                        <Skeleton className="h-24 w-full rounded-lg" />
                    </div>
                ) : error ? (
                    <div className="p-6">
                        <DialogHeader>
                            <DialogTitle className="text-white">Error</DialogTitle>
                        </DialogHeader>
                        <p className="text-red-400 py-4 text-sm">{error}</p>
                    </div>
                ) : data ? (
                    <>
                        {/* Header with avatar and identity */}
                        <div className="p-6 pb-4">
                            <DialogHeader className="sr-only">
                                <DialogTitle>{data.user.username}</DialogTitle>
                                <DialogDescription>User profile details</DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.username}`}
                                        alt={data.user.username}
                                        className="w-14 h-14 rounded-full border-2 border-white/10 bg-white/5"
                                    />
                                    {data.user.role === "admin" && (
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
                                            <Shield className="w-2.5 h-2.5 text-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-bold text-white truncate">{data.user.username}</h2>
                                        {data.user.role === "admin" ? (
                                            <span className="text-[10px] font-bold uppercase bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded tracking-wider shrink-0">Admin</span>
                                        ) : (
                                            <span className="text-[10px] font-bold uppercase bg-white/10 text-white/60 px-1.5 py-0.5 rounded tracking-wider shrink-0">User</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">{data.user.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats row */}
                        <div className="px-6 grid grid-cols-2 gap-3">
                            <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Joined</span>
                                </div>
                                <p className="text-sm text-white font-medium">{formatDate(data.user.createdAt) || "Unknown"}</p>
                            </div>
                            <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Last seen</span>
                                </div>
                                <p className="text-sm text-white font-medium">
                                    {data.user.lastLogin ? getTimeSince(data.user.lastLogin) : "Never"}
                                </p>
                                {data.user.lastLogin && (
                                    <p className="text-[11px] text-muted-foreground mt-0.5">{formatDate(data.user.lastLogin)}</p>
                                )}
                            </div>
                        </div>

                        {/* Bookmarks section */}
                        <div className="mt-4 border-t border-white/5">
                            <div className="px-6 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />
                                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Watchlist
                                    </h3>
                                </div>
                                <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">
                                    {data.bookmarks.length} {data.bookmarks.length === 1 ? "title" : "titles"}
                                </span>
                            </div>
                            {data.bookmarks.length === 0 ? (
                                <div className="px-6 pb-6">
                                    <div className="text-center py-6 rounded-lg border border-dashed border-white/10 bg-white/[0.02]">
                                        <Bookmark className="w-6 h-6 text-white/20 mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground">No anime bookmarked yet</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="px-6 pb-6 space-y-1.5 max-h-56 overflow-y-auto">
                                    {data.bookmarks.map((b) => (
                                        <div
                                            key={b._id}
                                            className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/5 transition-colors"
                                        >
                                            {b.imageURL ? (
                                                <img
                                                    src={b.imageURL}
                                                    alt={b.title}
                                                    className="w-9 h-13 object-cover rounded shadow-md shrink-0"
                                                    style={{ aspectRatio: "2/3" }}
                                                />
                                            ) : (
                                                <div className="w-9 h-13 bg-white/5 rounded flex items-center justify-center shrink-0" style={{ aspectRatio: "2/3" }}>
                                                    <Bookmark className="w-3.5 h-3.5 text-white/20" />
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm text-white font-medium truncate">{b.title}</p>
                                                {b.genre && (
                                                    <p className="text-[11px] text-muted-foreground truncate">{b.genre}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
