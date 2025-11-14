'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CURATED_COLLECTIONS } from '@/lib/collections';
import Image from 'next/image';
import { ArrowLeft, Star } from 'lucide-react';
import ErrorMessage from '@/components/ErrorMessage';
import EmptyState from '@/components/EmptyState';
import { useWatchlistStore } from '@/lib/store/useWatchlistStore';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
}

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [collection, setCollection] = useState<any>(null);

  // Get watchlist from Zustand store
  const { items: watchlistItems } = useWatchlistStore();

  useEffect(() => {
    const fetchCollectionMovies = async () => {
      try {
        setIsLoading(true);

        // Handle watchlist separately
        if (slug === 'watchlist') {
          const moviePromises = watchlistItems.map(async (item) => {
            const response = await fetch(
              `https://api.themoviedb.org/3/${item.media_type}/${item.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
            );
            const data = await response.json();
            return {
              id: data.id,
              title: data.title || data.name,
              poster_path: data.poster_path,
              vote_average: data.vote_average,
              release_date: data.release_date || data.first_air_date,
              overview: data.overview,
            };
          });
          const fetchedMovies = await Promise.all(moviePromises);
          setMovies(fetchedMovies);
          setCollection({
            title: 'My Watchlist',
            description: 'Your saved movies and shows',
            icon: '❤️',
          });
        } else {
          // Handle curated collections
          const selectedCollection = CURATED_COLLECTIONS.find((c) => c.id === slug);
          if (selectedCollection) {
            setCollection(selectedCollection);
            const moviePromises = selectedCollection.movieIds.map(async (id) => {
              const response = await fetch(
                `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
              );
              return response.json();
            });
            const fetchedMovies = await Promise.all(moviePromises);
            setMovies(fetchedMovies);
          }
        }
      } catch (error) {
        console.error('Error fetching collection movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollectionMovies();
  }, [slug, watchlistItems]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cinema-dark flex items-center justify-center">
        <p className="text-cinema-text text-xl">Loading collection...</p>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-cinema-dark">
        <ErrorMessage
          title="Collection Not Found"
          message="The collection you are looking for could not be found. It may have been removed or the link is incorrect."
          onRetry={() => window.location.reload()}
          onGoHome={() => router.push('/collections')}
          showHomeButton
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-cinema-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-cinema-text hover:text-cinema-gold transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-5xl md:text-6xl">{collection.icon}</span>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-cinema-gold">
                {collection.title}
              </h1>
              <p className="text-cinema-text text-lg mt-2">
                {collection.description}
              </p>
            </div>
          </div>
          <p className="text-gray-400">
            {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
          </p>
        </div>

        {/* Movies Grid */}
        {movies.length === 0 ? (
          <EmptyState
            title={slug === 'watchlist' ? 'Your Watchlist is Empty' : 'No Movies in Collection'}
            message={
              slug === 'watchlist'
                ? 'Start building your watchlist by adding movies and shows you want to watch!'
                : 'This collection is currently empty. Check back later or explore other collections.'
            }
            icon={slug === 'watchlist' ? 'film' : 'search'}
            actionLabel="Discover Movies"
            onAction={() => router.push('/')}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => router.push(`/movie/${movie.id}`)}
                className="cursor-pointer group"
              >
                <div className="relative mb-2 rounded-lg overflow-hidden bg-gray-800 group-hover:ring-2 group-hover:ring-cinema-gold transition-all">
                  {movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                      alt={movie.title}
                      width={342}
                      height={513}
                      className="w-full h-auto"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] flex items-center justify-center bg-gray-700">
                      <span className="text-gray-500 text-4xl">🎬</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded flex items-center gap-1">
                    <Star size={14} className="fill-cinema-gold text-cinema-gold" />
                    <span className="text-white text-sm font-semibold">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className="text-cinema-text text-sm font-medium line-clamp-2">
                  {movie.title}
                </p>
                {movie.release_date && (
                  <p className="text-gray-400 text-xs">
                    {new Date(movie.release_date).getFullYear()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
