'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, Play, ArrowLeft, Calendar, Tv } from 'lucide-react';
import VideoModal from '@/components/VideoModal';
import WatchlistButton from '@/components/WatchlistButton';
import WatchProviders from '@/components/WatchProviders';

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

interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
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

interface SimilarShow {
  id: number;
  name: string;
  poster_path: string | null;
  vote_average: number;
}

interface WatchProvidersData {
  link?: string;
  flatrate?: any[];
  rent?: any[];
  buy?: any[];
}

export default function TVDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [tvShow, setTVShow] = useState<TVShow | null>(null);
  const [similarShows, setSimilarShows] = useState<SimilarShow[]>([]);
  const [watchProviders, setWatchProviders] = useState<WatchProvidersData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchTVDetails = async () => {
      try {
        setIsLoading(true);
        const [tvResponse, similarResponse, providersResponse] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/tv/${params.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=videos,credits`
          ),
          fetch(
            `https://api.themoviedb.org/3/tv/${params.id}/similar?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          ),
          fetch(
            `https://api.themoviedb.org/3/tv/${params.id}/watch/providers?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          ),
        ]);

        if (!tvResponse.ok || !similarResponse.ok) {
          throw new Error('Failed to fetch TV show details');
        }

        const tvData = await tvResponse.json();
        const similarData = await similarResponse.json();
        const providersData = await providersResponse.json();

        setTVShow(tvData);
        setSimilarShows(similarData.results.slice(0, 6));

        // Extract India providers
        if (providersData.results?.IN) {
          setWatchProviders(providersData.results.IN);
        }
      } catch (err) {
        setError('Failed to load TV show details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchTVDetails();
    }
  }, [params.id]);

  const handlePlayTrailer = () => {
    if (tvShow?.videos?.results) {
      const trailer = tvShow.videos.results.find(
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

  if (error || !tvShow) {
    return (
      <div className="min-h-screen bg-cinema-dark flex items-center justify-center">
        <p className="text-red-500 text-xl">{error || 'TV show not found'}</p>
      </div>
    );
  }

  const trailer = tvShow.videos?.results?.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  return (
    <div className="min-h-screen bg-cinema-dark">
      {/* Hero Section with Backdrop */}
      <div
        className="relative w-full h-[70vh] bg-cover bg-center"
        style={{
          backgroundImage: tvShow.backdrop_path
            ? `linear-gradient(to bottom, rgba(18,18,18,0.3), rgba(18,18,18,0.95)), url(https://image.tmdb.org/t/p/original${tvShow.backdrop_path})`
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
            <h1 className="text-5xl font-bold text-cinema-gold mb-4">{tvShow.name}</h1>
            <div className="flex items-center gap-4 text-cinema-text mb-4">
              <div className="flex items-center gap-1">
                <Calendar size={18} />
                <span>{new Date(tvShow.first_air_date).getFullYear()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Tv size={18} />
                <span>{tvShow.number_of_seasons} Season{tvShow.number_of_seasons !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={18} className="fill-cinema-gold text-cinema-gold" />
                <span>{tvShow.vote_average.toFixed(1)}</span>
                <span className="text-gray-400">({tvShow.vote_count} votes)</span>
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
                  id: tvShow.id,
                  title: tvShow.name,
                  poster_path: tvShow.poster_path,
                  vote_average: tvShow.vote_average,
                  media_type: 'tv',
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
        {tvShow.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tvShow.genres.map((genre) => (
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
          <p className="text-cinema-text text-lg leading-relaxed">{tvShow.overview}</p>
        </div>

        {/* Where to Watch */}
        <div className="mb-8">
          <WatchProviders
            providers={watchProviders}
            country="IN"
            movieTitle={tvShow.name}
          />
        </div>

        {/* Cast */}
        {tvShow.credits?.cast && tvShow.credits.cast.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-cinema-gold mb-4">Top Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {tvShow.credits.cast.slice(0, 6).map((actor) => (
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

        {/* Similar TV Shows */}
        {similarShows.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-cinema-gold mb-4">Similar TV Shows</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similarShows.map((similar) => (
                <div
                  key={similar.id}
                  onClick={() => router.push(`/tv/${similar.id}`)}
                  className="cursor-pointer group"
                >
                  <div className="mb-2 rounded-lg overflow-hidden bg-gray-800 group-hover:ring-2 group-hover:ring-cinema-gold transition-all">
                    {similar.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w342${similar.poster_path}`}
                        alt={similar.name}
                        width={342}
                        height={513}
                        className="w-full h-auto"
                      />
                    ) : (
                      <div className="w-full aspect-[2/3] flex items-center justify-center bg-gray-700">
                        <span className="text-gray-500 text-4xl">📺</span>
                      </div>
                    )}
                  </div>
                  <p className="text-cinema-text text-sm font-medium line-clamp-2">
                    {similar.name}
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
