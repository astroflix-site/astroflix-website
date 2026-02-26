import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <Ghost className="w-16 h-16 text-white/20 mb-6" />
      <h1 className="text-6xl font-display font-bold text-white tracking-tighter mb-2">404</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        This page has vanished into another dimension. The content you're looking for doesn't exist.
      </p>
      <Link href="/">
        <Button className="bg-white text-black hover:bg-white/90 font-bold px-8">
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
