import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import AnimeDetail from "@/pages/AnimeDetail";
import Player from "@/pages/Player";
import Dashboard from "@/pages/Dashboard";
import AdminPanel from "@/pages/AdminPanel";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import SearchResults from "@/pages/SearchResults";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/anime/:id" component={AnimeDetail} />
      <Route path="/watch/:episodeId" component={Player} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/search/:query" component={SearchResults} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
