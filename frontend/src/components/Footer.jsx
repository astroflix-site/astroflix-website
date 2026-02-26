import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="py-10 px-6 bg-black border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-display font-bold text-white tracking-tighter">ASTROFLIX</h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your premium destination for anime streaming. Watch the latest and greatest anime, all in one place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 text-sm">
            <div className="flex flex-col gap-2">
              <h3 className="text-white font-medium mb-1">Browse</h3>
              <Link href="/explore" className="text-muted-foreground hover:text-white transition-colors">Explore</Link>
              <Link href="/dashboard" className="text-muted-foreground hover:text-white transition-colors">My List</Link>
            </div>
            
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} AstroFlix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
