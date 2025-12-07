import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(username, email, password);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center opacity-20 blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

      <Card className="w-full max-w-md bg-card/80 backdrop-blur-md border-white/10 relative z-10 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <Link href="/">
            <h1 className="text-3xl font-display font-bold text-white tracking-tighter mb-2 cursor-pointer">ANIFLEX</h1>
          </Link>
          <p className="text-muted-foreground text-sm">Create your account to start watching.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Username</Label>
              <Input
                type="text"
                placeholder="OtakuKing"
                className="bg-black/40 border-white/10 text-white placeholder:text-white/20 focus:border-white/30"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                className="bg-black/40 border-white/10 text-white placeholder:text-white/20 focus:border-white/30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Password</Label>
              <Input
                type="password"
                placeholder="Create a password"
                className="bg-black/40 border-white/10 text-white placeholder:text-white/20 focus:border-white/30"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-white text-black hover:bg-white/90 font-bold" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="text-white hover:underline">Sign in</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
