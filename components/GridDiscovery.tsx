'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Heart, Info, Loader } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import { useWatchlistStore } from '@/lib/store/useWatchlistStore';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview: string;
  media_type: 'movie' | 'tv';
}

interface GridDiscoveryProps {
  region?: string;
}

type FilterType = 'all' | 'movie' | 'tv';

export default function GridDiscovery({ region = 'IN' }: GridDiscoveryProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const router = useRouter();
  const { addItem, removeItem, isInWatchlist } = useWatchlistStore();

  const fetchMovies = useCallback(async (currentPage: number, currentFilter: FilterType, append = false) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      let results: Movie[] = [];

      if (currentFilter === 'all') {
        // Fetch both movies and TV shows
        const [movieResponse, tvResponse] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&sort_by=popularity.desc&vote_count.gte=100&vote_average.gte=6&region=${region}&page=${currentPage}`
          ),
          fetch(
            `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&sort_by=popularity.desc&vote_count.gte=50&vote_average.gte=6&page=${currentPage}`
          )
        ]);

        const [movieData, tvData] = await Promise.all([
          movieResponse.json(),
          tvResponse.json()
        ]);

        const movieItems = movieData.results
          .filter((item: any) => item.poster_path)
          .map((item: any) => ({ ...item, media_type: 'movie' as const }));

        const tvItems = tvData.results
          .filter((item: any) => item.poster_path)
          .map((item: any) => ({ ...item, media_type: 'tv' as const }));

        // Interleave movies and TV shows
        const maxLength = Math.max(movieItems.length, tvItems.length);
        for (let i = 0; i < maxLength; i++) {
          if (movieItems[i]) results.push(movieItems[i]);
          if (tvItems[i]) results.push(tvItems[i]);
        }
      } else {
        // Fetch only specified type
        const endpoint = currentFilter === 'movie' ? 'movie' : 'tv';
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/${endpoint}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&sort_by=popularity.desc&vote_count.gte=${currentFilter === 'movie' ? 100 : 50}&vote_average.gte=6&region=${region}&page=${currentPage}`
        );
        const data = await response.json();
        results = data.results
          .filter((item: any) => item.poster_path)
          .map((item: any) => ({ ...item, media_type: currentFilter }));
      }

      if (append) {
        setMovies(prev => [...prev, ...results]);
      } else {
        setMovies(results);
      }

      setHasMore(results.length > 0);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [region]);

  useEffect(() => {
    setPage(1);
    setMovies([]);
    fetchMovies(1, filter, false);
  }, [filter, fetchMovies]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(nextPage, filter, true);
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  const handleToggleWatchlist = (movie: Movie, e: React.MouseEvent) => {
    e.stopPropagation();

    const item = {
      id: movie.id,
      title: movie.title || movie.name || '',
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      media_type: movie.media_type
    };

    if (isInWatchlist(movie.id, movie.media_type)) {
      removeItem(movie.id, movie.media_type);
    } else {
      addItem(item);
    }
  };

  const handleViewDetails = (movie: Movie) => {
    router.push(`/${movie.media_type}/${movie.id}`);
  };

  const getTitle = (movie: Movie) => movie.title || movie.name || '';
  const getYear = (movie: Movie) => {
    const date = movie.release_date || movie.first_air_date;
    return date ? new Date(date).getFullYear() : '';
  };

  if (isLoading && movies.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-cinema-gold border-t-transparent mx-auto mb-4"></div>
          <p className="text-cinema-text">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header & Filter Tabs */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-cinema-gold mb-6">
          Discover Content
        </h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-gray-800">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              filter === 'all'
                ? 'text-cinema-gold'
                : 'text-gray-400 hover:text-cinema-text'
            }`}
          >
            All
            {filter === 'all' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cinema-gold"></div>
            )}
          </button>
          <button
            onClick={() => handleFilterChange('movie')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              filter === 'movie'
                ? 'text-cinema-gold'
                : 'text-gray-400 hover:text-cinema-text'
            }`}
          >
            Movies
            {filter === 'movie' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cinema-gold"></div>
            )}
          </button>
          <button
            onClick={() => handleFilterChange('tv')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              filter === 'tv'
                ? 'text-cinema-gold'
                : 'text-gray-400 hover:text-cinema-text'
            }`}
          >
            TV Shows
            {filter === 'tv' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cinema-gold"></div>
            )}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {movies.map((movie, index) => {
          const inWatchlist = isInWatchlist(movie.id, movie.media_type);

          return (
            <div
              key={`${movie.media_type}-${movie.id}`}
              className="group cursor-pointer"
              onClick={() => handleViewDetails(movie)}
            >
              <div className="relative aspect-[2/3] mb-3 rounded-lg overflow-hidden bg-gray-800 transition-all group-hover:ring-2 group-hover:ring-cinema-gold group-hover:scale-105">
                {/* Poster */}
                <OptimizedImage
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={getTitle(movie)}
                  fill
                  className="object-cover"
                  priority={index < 10}
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />

                {/* Rating Badge */}
                <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded flex items-center gap-1">
                  <Star size={12} className="fill-cinema-gold text-cinema-gold" />
                  <span className="text-white text-xs font-semibold">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>

                {/* Hover Overlay with Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  {/* Movie Info */}
                  <div className="mb-3">
                    <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">
                      {getTitle(movie)}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      {getYear(movie) && <span>{getYear(movie)}</span>}
                      {getYear(movie) && <span>•</span>}
                      <span className="uppercase">
                        {movie.media_type === 'movie' ? 'Movie' : 'TV'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleToggleWatchlist(movie, e)}
                      className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg font-semibold text-xs transition-colors ${
                        inWatchlist
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                      title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      <Heart
                        size={14}
                        className={inWatchlist ? 'fill-white' : ''}
                      />
                      {inWatchlist ? 'Saved' : 'Save'}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(movie);
                      }}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-cinema-gold text-cinema-dark rounded-lg font-semibold text-xs hover:bg-yellow-500 transition-colors"
                      title="View Details"
                    >
                      <Info size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Title & Info (visible on mobile) */}
              <div className="md:hidden">
                <h3 className="text-cinema-text text-sm font-medium line-clamp-2 mb-1">
                  {getTitle(movie)}
                </h3>
                {getYear(movie) && (
                  <p className="text-gray-400 text-xs">{getYear(movie)}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="flex items-center gap-2 bg-cinema-gold text-cinema-dark px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? (
              <>
                <Loader className="animate-spin" size={20} />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}

      {/* No Results */}
      {!isLoading && movies.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">
            No content found. Try changing the filter.
          </p>
        </div>
      )}
    </div>
  );
}
