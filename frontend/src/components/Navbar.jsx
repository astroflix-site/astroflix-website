import { Link, useLocation } from "wouter";
import { Search, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export function Navbar() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [_, setLocation] = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setLocation(`/search/${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5 h-16 flex items-center px-6 lg:px-12">
      <div className="flex items-center gap-8 flex-1">
        <Link href="/" className="text-2xl font-display font-bold tracking-tighter text-white hover:text-white/90 transition-colors">
          ASTROFLIX
        </Link>
        <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">My List</Link>
          {user?.isAdmin && (
            <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Titles, people, genres"
            className="pl-9 bg-secondary border-none h-9 w-64 text-sm focus-visible:ring-1 focus-visible:ring-white/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 border border-white/10 hover:bg-white/10">
                <img
                  src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-white/10 text-white">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="cursor-pointer focus:bg-white/10" onClick={() => setLocation("/dashboard")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              {user.isAdmin && (
                <DropdownMenuItem className="cursor-pointer focus:bg-white/10" onClick={() => setLocation("/admin")}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Admin Dashboard</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="cursor-pointer focus:bg-white/10 text-red-400 focus:text-red-400" onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/10">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-white text-black hover:bg-white/90">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
