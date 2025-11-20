'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Play, Info, Calendar, Star } from 'lucide-react';
import VideoModal from './VideoModal';
import OptimizedImage from './OptimizedImage';

interface FeaturedMovie {
  id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
  videos?: {
    results: { key: string; type: string; site: string }[];
  };
}

export default function FeaturedFilm() {
  const router = useRouter();
  const [movie, setMovie] = useState<FeaturedMovie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedMovie = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&region=IN&page=1`
        );
        const data = await response.json();
        const featured = data.results[0];

        // Fetch videos
        try {
          const videoResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${featured.id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          );
          const videoData = await videoResponse.json();
          setMovie({ ...featured, videos: videoData });
        } catch (err) {
          setMovie(featured);
        }
      } catch (error) {
        console.error('Error fetching featured movie:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedMovie();
  }, []);

  if (isLoading || !movie) {
    return (
      <div className="relative w-full h-[70vh] bg-cinema-dark animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cinema-dark/50 to-cinema-dark"></div>
      </div>
    );
  }

  const trailer = movie.videos?.results?.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  return (
    <>
      <motion.section
        className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Backdrop Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cinema-dark/80 to-cinema-dark"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-cinema-dark via-transparent to-cinema-dark"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="grid md:grid-cols-[300px_1fr] gap-8 lg:gap-12 items-center">
            {/* Poster - Large, Editorial */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:block"
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl border-2 border-cinema-accent/20">
                <OptimizedImage
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </motion.div>

            {/* Film Program Notes */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              {/* Title - Massive Display Type */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium text-cinema-accent leading-[0.9] tracking-tight">
                {movie.title}
              </h1>

              {/* Credits-Style Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-cinema-text-dim font-mono text-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-cinema-accent" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} className="fill-cinema-accent text-cinema-accent" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
              </div>

              {/* Synopsis - Editorial Style */}
              <p className="text-lg md:text-xl text-cinema-text font-sans leading-relaxed max-w-2xl">
                {movie.overview}
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <motion.button
                  onClick={() => router.push(`/movie/${movie.id}`)}
                  className="flex items-center justify-center gap-3 bg-cinema-accent text-cinema-dark px-8 py-4 rounded-lg font-sans font-semibold text-lg hover:bg-cinema-accent-dim hover:shadow-2xl hover:shadow-cinema-accent/50 transition-all neon-glow-cyan"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Info size={24} />
                  <span>View Details</span>
                </motion.button>
                {trailer && (
                  <motion.button
                    onClick={() => setTrailerKey(trailer.key)}
                    className="flex items-center justify-center gap-3 glass text-cinema-text px-8 py-4 rounded-lg font-sans font-semibold text-lg border border-cinema-border hover:border-[#a855f7] hover:shadow-lg hover:shadow-[#a855f7]/30 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play size={24} className="fill-cinema-text" />
                    <span>Watch Trailer</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <VideoModal videoKey={trailerKey} onClose={() => setTrailerKey(null)} />
    </>
  );
}

