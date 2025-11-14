'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X, Heart, Info, RotateCcw, Star } from 'lucide-react';
import { useWatchlistStore } from '@/lib/store/useWatchlistStore';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path?: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview: string;
  genre_ids: number[];
  media_type: 'movie' | 'tv';
}

interface SwipeDiscoveryProps {
  initialType?: 'movie' | 'tv' | 'mixed';
  region?: string;
}

const SWIPE_THRESHOLD = 100;

export default function SwipeDiscovery({ initialType = 'mixed', region = 'IN' }: SwipeDiscoveryProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [removedCards, setRemovedCards] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const { addItem } = useWatchlistStore();
  const router = useRouter();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const skipOpacity = useTransform(x, [-200, -50, 0], [1, 0.5, 0]);
  const saveOpacity = useTransform(x, [0, 50, 200], [0, 0.5, 1]);

  // Preload images
  const preloadedImages = useRef<Set<string>>(new Set());

  const preloadImage = (url: string) => {
    if (preloadedImages.current.has(url)) return;

    const img = document.createElement('img');
    img.src = url;
    preloadedImages.current.add(url);
  };

  // Fetch discover feed
  useEffect(() => {
    fetchMovies();
  }, []);

  // Preload next 5 images
  useEffect(() => {
    const visibleCards = movies.slice(0, Math.min(5, movies.length));
    visibleCards.forEach(movie => {
      preloadImage(`https://image.tmdb.org/t/p/w500${movie.poster_path}`);
    });
  }, [movies]);

  const fetchMovies = async () => {
    try {
      setIsLoading(true);

      let newMovies: Movie[] = [];

      if (initialType === 'mixed') {
        // Fetch both movies and TV shows
        const [movieResponse, tvResponse] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&sort_by=popularity.desc&vote_count.gte=100&vote_average.gte=6&region=${region}&page=${Math.floor(Math.random() * 5) + 1}`
          ),
          fetch(
            `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&sort_by=popularity.desc&vote_count.gte=50&vote_average.gte=6&page=${Math.floor(Math.random() * 5) + 1}`
          )
        ]);

        const [movieData, tvData] = await Promise.all([
          movieResponse.json(),
          tvResponse.json()
        ]);

        // Mix movies and TV shows
        const movieItems = movieData.results
          .filter((item: any) => item.poster_path)
          .map((item: any) => ({ ...item, media_type: 'movie' as const }));

        const tvItems = tvData.results
          .filter((item: any) => item.poster_path)
          .map((item: any) => ({ ...item, media_type: 'tv' as const }));

        // Interleave movies and TV shows
        const maxLength = Math.max(movieItems.length, tvItems.length);
        for (let i = 0; i < maxLength; i++) {
          if (movieItems[i]) newMovies.push(movieItems[i]);
          if (tvItems[i]) newMovies.push(tvItems[i]);
        }
      } else {
        // Fetch only specified type
        const endpoint = initialType === 'movie' ? 'movie' : 'tv';
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/${endpoint}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&sort_by=popularity.desc&vote_count.gte=50&vote_average.gte=6&region=${region}&page=${Math.floor(Math.random() * 5) + 1}`
        );
        const data = await response.json();
        newMovies = data.results
          .filter((item: any) => item.poster_path)
          .map((item: any) => ({ ...item, media_type: initialType }));
      }

      setMovies(prev => [...prev, ...newMovies.slice(0, 20)]);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get visible cards (excluding removed ones)
  const visibleMovies = movies.filter((_, index) => !removedCards.includes(index));
  const [currentMovie, nextMovie, thirdMovie] = visibleMovies;
  const currentIndex = movies.length - visibleMovies.length;

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating || !currentMovie) return;

    setIsAnimating(true);
    setSwipeDirection(direction);

    if (direction === 'right') {
      // Add to watchlist using Zustand
      addItem({
        id: currentMovie.id,
        title: currentMovie.title || currentMovie.name || '',
        poster_path: currentMovie.poster_path,
        vote_average: currentMovie.vote_average,
        media_type: currentMovie.media_type
      });
    }

    // Wait for animation to complete before removing card
    setTimeout(() => {
      setRemovedCards(prev => [...prev, movies.indexOf(currentMovie)]);
      setSwipeDirection(null);
      setIsAnimating(false);
      x.set(0);

      // Fetch more when running low
      if (visibleMovies.length <= 5) {
        fetchMovies();
      }
    }, 300);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (isAnimating) return;

    const swipeVelocity = info.velocity.x;
    const swipeOffset = info.offset.x;

    if (Math.abs(swipeOffset) > SWIPE_THRESHOLD || Math.abs(swipeVelocity) > 500) {
      handleSwipe(swipeOffset > 0 ? 'right' : 'left');
    } else {
      x.set(0);
    }
  };

  const handleViewDetails = () => {
    if (currentMovie) {
      router.push(`/${currentMovie.media_type}/${currentMovie.id}`);
    }
  };

  const handleReset = () => {
    setRemovedCards([]);
    setMovies([]);
    preloadedImages.current.clear();
    fetchMovies();
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (!currentMovie || isAnimating) return;

    switch (e.key) {
      case 'ArrowLeft':
        handleSwipe('left');
        break;
      case 'ArrowRight':
        handleSwipe('right');
        break;
      case 'ArrowUp':
      case 'Enter':
        handleViewDetails();
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentMovie, isAnimating]);

  if (isLoading && movies.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-cinema-gold border-t-transparent mx-auto mb-4"></div>
          <p className="text-cinema-text">Loading your personalized picks...</p>
        </div>
      </div>
    );
  }

  if (visibleMovies.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-cinema-gold mb-4">That&apos;s all for now! 🎬</h3>
          <p className="text-cinema-text mb-6">You&apos;ve seen all the recommendations.</p>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-cinema-gold text-cinema-dark px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors mx-auto"
          >
            <RotateCcw size={20} />
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const getTitle = (movie: Movie) => movie.title || movie.name || '';
  const getYear = (movie: Movie) => {
    const date = movie.release_date || movie.first_air_date;
    return date ? new Date(date).getFullYear() : '';
  };

  return (
    <div className="relative w-full max-w-md mx-auto" style={{ minHeight: '700px' }}>
      {/* Instructions */}
      <div className="text-center mb-6">
        <p className="text-cinema-text text-sm mb-2">
          <span className="hidden md:inline">← Skip | → Save to Watchlist | ↑ Details</span>
          <span className="md:hidden">Swipe left to skip, right to save</span>
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-cinema-gold"></div>
            {currentIndex + 1} / {movies.length}
          </span>
        </div>
      </div>

      {/* Card Stack */}
      <div className="relative w-full aspect-[2/3]">
        {/* Third card (background) */}
        {thirdMovie && (
          <motion.div
            key={`third-${movies.indexOf(thirdMovie)}`}
            className="absolute inset-0 w-full h-full"
            initial={{ scale: 0.88, y: 20, opacity: 0.6 }}
            animate={{ scale: 0.88, y: 20, opacity: 0.6 }}
            style={{ zIndex: 1 }}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-800">
              <Image
                src={`https://image.tmdb.org/t/p/w500${thirdMovie.poster_path}`}
                alt={getTitle(thirdMovie)}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 448px"
              />
            </div>
          </motion.div>
        )}

        {/* Second card (middle) */}
        {nextMovie && (
          <motion.div
            key={`next-${movies.indexOf(nextMovie)}`}
            className="absolute inset-0 w-full h-full"
            initial={{ scale: 0.94, y: 10, opacity: 0.8 }}
            animate={{ scale: 0.94, y: 10, opacity: 0.8 }}
            style={{ zIndex: 2 }}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-800">
              <Image
                src={`https://image.tmdb.org/t/p/w500${nextMovie.poster_path}`}
                alt={getTitle(nextMovie)}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 448px"
              />
            </div>
          </motion.div>
        )}

        {/* Top card (interactive) */}
        {currentMovie && (
          <motion.div
            key={`current-${movies.indexOf(currentMovie)}`}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
            style={{
              x,
              rotate,
              opacity,
              zIndex: 3
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={swipeDirection ? {
              x: swipeDirection === 'left' ? -500 : 500,
              opacity: 0,
              transition: { duration: 0.3, ease: 'easeOut' }
            } : {}}
            initial={{ scale: 1, rotateZ: 0 }}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-900 shadow-2xl">
              {/* Poster Image */}
              <Image
                src={`https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`}
                alt={getTitle(currentMovie)}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 448px"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              {/* Swipe Indicators */}
              <motion.div
                className="absolute top-8 left-8 bg-red-500 text-white px-6 py-3 rounded-full font-bold text-2xl rotate-[-20deg] border-4 border-red-500"
                style={{
                  opacity: skipOpacity
                }}
              >
                SKIP
              </motion.div>
              <motion.div
                className="absolute top-8 right-8 bg-green-500 text-white px-6 py-3 rounded-full font-bold text-2xl rotate-[20deg] border-4 border-green-500"
                style={{
                  opacity: saveOpacity
                }}
              >
                SAVE
              </motion.div>

              {/* Movie Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {getTitle(currentMovie)}
                </h2>
                <div className="flex items-center gap-3 text-white mb-3">
                  <div className="flex items-center gap-1">
                    <Star size={18} className="fill-cinema-gold text-cinema-gold" />
                    <span className="font-semibold">{currentMovie.vote_average.toFixed(1)}</span>
                  </div>
                  {getYear(currentMovie) && (
                    <>
                      <span>•</span>
                      <span>{getYear(currentMovie)}</span>
                    </>
                  )}
                  <span>•</span>
                  <span className="uppercase text-sm">
                    {currentMovie.media_type === 'movie' ? 'Movie' : 'TV Show'}
                  </span>
                </div>
                <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                  {currentMovie.overview}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6 mt-8">
        <button
          onClick={() => handleSwipe('left')}
          disabled={isAnimating}
          className="w-16 h-16 rounded-full bg-gray-800 hover:bg-red-600 text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          title="Skip (←)"
          aria-label="Skip this content"
        >
          <X size={28} />
        </button>

        <button
          onClick={handleViewDetails}
          disabled={isAnimating}
          className="w-20 h-20 rounded-full bg-cinema-gold hover:bg-yellow-500 text-cinema-dark flex items-center justify-center transition-all hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          title="View Details (↑)"
          aria-label="View details"
        >
          <Info size={32} />
        </button>

        <button
          onClick={() => handleSwipe('right')}
          disabled={isAnimating}
          className="w-16 h-16 rounded-full bg-gray-800 hover:bg-green-600 text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          title="Add to Watchlist (→)"
          aria-label="Add to watchlist"
        >
          <Heart size={28} />
        </button>
      </div>

      {/* Desktop Keyboard Hints */}
      <div className="hidden md:block text-center mt-4 text-xs text-gray-500">
        Use arrow keys: ← Skip | → Save | ↑ Details
      </div>
    </div>
  );
}
