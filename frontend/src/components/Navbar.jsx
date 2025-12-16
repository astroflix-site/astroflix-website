import { Link, useLocation } from "wouter";
import { Search, User, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [_, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setLocation(`/search/${encodeURIComponent(search.trim())}`);
      setShowMobileSearch(false);
    }
  };

  const NavLinks = ({ mobile = false, onClick = () => { } }) => (
    <>
      <Link href="/" className={`hover:text-white transition-colors ${mobile ? 'text-lg py-2' : ''}`} onClick={onClick}>Home</Link>
      <Link href="/explore" className={`hover:text-white transition-colors ${mobile ? 'text-lg py-2' : ''}`} onClick={onClick}>Explore</Link>
      <Link href="/dashboard" className={`hover:text-white transition-colors ${mobile ? 'text-lg py-2' : ''}`} onClick={onClick}>My List</Link>
      {user?.isAdmin && (
        <Link href="/admin" className={`hover:text-white transition-colors ${mobile ? 'text-lg py-2' : ''}`} onClick={onClick}>Admin</Link>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5 h-16 flex items-center px-4 lg:px-12">
      <div className="flex items-center gap-4 lg:gap-8 flex-1">
        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background border-white/10 text-white w-64">
              <div className="flex flex-col gap-4 mt-8">
                <NavLinks mobile onClick={() => setIsMobileMenuOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Link href="/" className="text-xl lg:text-2xl font-display font-bold tracking-tighter text-white hover:text-white/90 transition-colors">
          ASTROFLIX
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
          <NavLinks />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Titles, people, genres"
            className="pl-9 bg-secondary border-none h-9 w-64 text-sm focus-visible:ring-1 focus-visible:ring-white/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        {/* Mobile Search Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-muted-foreground hover:text-white"
          onClick={() => setShowMobileSearch(!showMobileSearch)}
        >
          <Search className="h-5 w-5" />
        </Button>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 lg:w-9 lg:h-9 border border-white/10 hover:bg-white/10">
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
              <Button size="sm" className="bg-white text-black hover:bg-white/90 hidden sm:flex">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Search Bar Overlay */}
      {showMobileSearch && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b border-white/10 p-4 md:hidden animate-in slide-in-from-top-2">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-9 bg-secondary border-none w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </form>
        </div>
      )}
    </nav>
  );
}
