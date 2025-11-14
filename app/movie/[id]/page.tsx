'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, Play, ArrowLeft, Calendar, Clock } from 'lucide-react';
import VideoModal from '@/components/VideoModal';
import WatchlistButton from '@/components/WatchlistButton';
import WatchProviders from '@/components/WatchProviders';
import { fetchStreamingAvailability } from '@/lib/streamingAvailability';
import { useSEO } from '@/lib/hooks/useSEO';
import ErrorMessage from '@/components/ErrorMessage';

interface Genre {
  id: number;
  name: string;
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number;
  overview: string;
  vote_average: number;
  vote_count: number;
  genres: Genre[];
  videos: {
    results: Video[];
  };
  credits: {
    cast: Cast[];
  };
}

interface SimilarMovie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
}

interface WatchProvidersData {
  link?: string;
  flatrate?: any[];
  rent?: any[];
  buy?: any[];
}

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([]);
  const [watchProviders, setWatchProviders] = useState<WatchProvidersData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  // SEO: Update page metadata when movie data is available
  useSEO({
    title: movie?.title || 'Movie Details',
    description: movie?.overview || 'Discover movies and TV shows',
    image: movie?.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
      : movie?.poster_path
      ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
      : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    type: 'video.movie',
  });

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true);
        const [movieResponse, similarResponse, providersResponse] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/movie/${params.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=videos,credits`
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/${params.id}/similar?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/${params.id}/watch/providers?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          ),
        ]);

        if (!movieResponse.ok || !similarResponse.ok) {
          throw new Error('Failed to fetch movie details');
        }

        const movieData = await movieResponse.json();
        const similarData = await similarResponse.json();
        const providersData = await providersResponse.json();

        setMovie(movieData);
        setSimilarMovies(similarData.results.slice(0, 6));

        // Extract India providers from TMDb
        if (providersData.results?.IN) {
          const indiaProviders = providersData.results.IN;
          const hasData = indiaProviders.flatrate || indiaProviders.rent || indiaProviders.buy;

          if (hasData) {
            console.log(`✅ [Watch Providers] TMDb has India data for "${movieData.title}"`);
            setWatchProviders(indiaProviders);
          } else {
            console.log(`⚠️ [Watch Providers] TMDb has empty India data for "${movieData.title}"`);
            console.log('🎬 [Watch Providers] Attempting fallback to Streaming Availability API...');
            const fallbackData = await fetchStreamingAvailability(
              movieData.title,
              'movie',
              'in'
            );
            if (fallbackData) {
              setWatchProviders(fallbackData);
            }
          }
        } else {
          // Fallback: Try Streaming Availability API for India
          console.log(`ℹ️ [Watch Providers] No TMDb data for "${movieData.title}" in India region`);
          console.log('🎬 [Watch Providers] Attempting fallback to Streaming Availability API...');
          const fallbackData = await fetchStreamingAvailability(
            movieData.title,
            'movie',
            'in'
          );
          if (fallbackData) {
            setWatchProviders(fallbackData);
          }
        }
      } catch (err) {
        setError('Failed to load movie details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchMovieDetails();
    }
  }, [params.id]);

  const handlePlayTrailer = () => {
    if (movie?.videos?.results) {
      const trailer = movie.videos.results.find(
        (video) => video.type === 'Trailer' && video.site === 'YouTube'
      );
      if (trailer) {
        setTrailerKey(trailer.key);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cinema-dark flex items-center justify-center">
        <p className="text-cinema-text text-xl">Loading...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-cinema-dark">
        <ErrorMessage
          title={error ? 'Failed to Load Movie' : 'Movie Not Found'}
          message={
            error
              ? 'We encountered an error while loading this movie. Please try again or go back to the home page.'
              : 'The movie you are looking for could not be found. It may have been removed or the ID is incorrect.'
          }
          onRetry={() => window.location.reload()}
          onGoHome={() => router.push('/')}
          showHomeButton
        />
      </div>
    );
  }

  const trailer = movie.videos?.results?.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  return (
    <div className="min-h-screen bg-cinema-dark">
      {/* Hero Section with Backdrop */}
      <div
        className="relative w-full h-[70vh] bg-cover bg-center"
        style={{
          backgroundImage: movie.backdrop_path
            ? `linear-gradient(to bottom, rgba(18,18,18,0.3), rgba(18,18,18,0.95)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : 'none',
        }}
      >
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-6xl mx-auto w-full px-4 pb-8">
            <button
              onClick={() => router.back()}
              className="mb-4 flex items-center gap-2 text-cinema-text hover:text-cinema-gold transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            <h1 className="text-5xl font-bold text-cinema-gold mb-4">{movie.title}</h1>
            <div className="flex items-center gap-4 text-cinema-text mb-4">
              <div className="flex items-center gap-1">
                <Calendar size={18} />
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>
              {movie.runtime > 0 && (
                <div className="flex items-center gap-1">
                  <Clock size={18} />
                  <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star size={18} className="fill-cinema-gold text-cinema-gold" />
                <span>{movie.vote_average.toFixed(1)}</span>
                <span className="text-gray-400">({movie.vote_count} votes)</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {trailer && (
                <button
                  onClick={handlePlayTrailer}
                  className="flex items-center gap-2 bg-cinema-gold text-cinema-dark px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors shadow-lg"
                >
                  <Play size={20} className="fill-cinema-dark" />
                  Watch Trailer
                </button>
              )}
              <WatchlistButton
                item={{
                  id: movie.id,
                  title: movie.title,
                  poster_path: movie.poster_path,
                  vote_average: movie.vote_average,
                  media_type: 'movie',
                }}
                size="lg"
                showLabel={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Genres */}
        {movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="px-4 py-1 bg-gray-800 text-cinema-gold rounded-full text-sm border border-cinema-gold"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}

        {/* Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-cinema-gold mb-3">Overview</h2>
          <p className="text-cinema-text text-lg leading-relaxed">{movie.overview}</p>
        </div>

        {/* Where to Watch */}
        <div className="mb-8">
          <WatchProviders
            providers={watchProviders}
            country="IN"
            movieTitle={movie.title}
          />
        </div>

        {/* Cast */}
        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-cinema-gold mb-4">Top Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movie.credits.cast.slice(0, 6).map((actor) => (
                <div
                  key={actor.id}
                  onClick={() => router.push(`/person/${actor.id}`)}
                  className="text-center cursor-pointer group"
                >
                  <div className="mb-2 rounded-lg overflow-hidden bg-gray-800 group-hover:ring-2 group-hover:ring-cinema-gold transition-all">
                    {actor.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        width={185}
                        height={278}
                        className="w-full h-auto"
                      />
                    ) : (
                      <div className="w-full aspect-[2/3] flex items-center justify-center bg-gray-700">
                        <span className="text-gray-500 text-4xl">👤</span>
                      </div>
                    )}
                  </div>
                  <p className="text-cinema-text font-semibold text-sm group-hover:text-cinema-gold transition-colors">{actor.name}</p>
                  <p className="text-gray-400 text-xs">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-cinema-gold mb-4">Similar Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similarMovies.map((similar) => (
                <div
                  key={similar.id}
                  onClick={() => router.push(`/movie/${similar.id}`)}
                  className="cursor-pointer group"
                >
                  <div className="mb-2 rounded-lg overflow-hidden bg-gray-800 group-hover:ring-2 group-hover:ring-cinema-gold transition-all">
                    {similar.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w342${similar.poster_path}`}
                        alt={similar.title}
                        width={342}
                        height={513}
                        className="w-full h-auto"
                      />
                    ) : (
                      <div className="w-full aspect-[2/3] flex items-center justify-center bg-gray-700">
                        <span className="text-gray-500 text-4xl">🎬</span>
                      </div>
                    )}
                  </div>
                  <p className="text-cinema-text text-sm font-medium line-clamp-2">
                    {similar.title}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={12} className="fill-cinema-gold text-cinema-gold" />
                    <span className="text-gray-400 text-xs">{similar.vote_average.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <VideoModal videoKey={trailerKey} onClose={() => setTrailerKey(null)} />
    </div>
  );
}
