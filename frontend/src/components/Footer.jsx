import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="py-12 px-6 bg-black border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-display font-bold text-white tracking-tighter">ANIFLEX</h2>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AstroFlix Inc. All rights reserved.
          </p>
        </div>

        <div className="flex gap-8 text-sm text-muted-foreground">
          <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Preferences</a>
          <a href="#" className="hover:text-white transition-colors">Corporate Information</a>
        </div>
      </div>
    </footer>
  );
}
