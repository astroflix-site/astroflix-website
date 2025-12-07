import { Link } from "wouter";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export function AnimeCard({ anime }) {
  return (
    <Link href={`/anime/${anime.id}`}>
      <motion.div 
        className="group relative flex-none w-[160px] md:w-[200px] cursor-pointer"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        data-testid={`card-anime-${anime.id}`}
      >
        <div className="aspect-[2/3] rounded-md overflow-hidden bg-secondary relative shadow-lg">
          <img 
            src={anime.image} 
            alt={anime.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-75"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Play className="w-5 h-5 text-white fill-white ml-1" />
            </div>
          </div>
        </div>
        
        <div className="mt-3 opacity-80 group-hover:opacity-100 transition-opacity">
          <h3 className="text-sm font-medium text-white truncate group-hover:text-white/90">
            {anime.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <span className="text-green-400 font-bold">{anime.rating} Match</span>
            <span>•</span>
            <span>{anime.year}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
