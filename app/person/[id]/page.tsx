'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, ArrowLeft, Calendar, MapPin } from 'lucide-react';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  character?: string;
  media_type?: string;
}

interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
  known_for_department: string;
  movie_credits: {
    cast: Movie[];
  };
}

export default function PersonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [person, setPerson] = useState<Person | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersonDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://api.themoviedb.org/3/person/${params.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=movie_credits`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch person details');
        }

        const data = await response.json();
        setPerson(data);

        // Sort movies: prioritize those with posters, then by rating
        const sortedMovies = data.movie_credits.cast
          .sort((a: Movie, b: Movie) => {
            // First, prioritize movies with posters
            const aHasPoster = a.poster_path ? 1 : 0;
            const bHasPoster = b.poster_path ? 1 : 0;
            if (aHasPoster !== bHasPoster) {
              return bHasPoster - aHasPoster;
            }
            // Then sort by rating
            return (b.vote_average || 0) - (a.vote_average || 0);
          });

        setMovies(sortedMovies);
      } catch (err) {
        setError('Failed to load person details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchPersonDetails();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cinema-dark flex items-center justify-center">
        <p className="text-cinema-text text-xl">Loading...</p>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="min-h-screen bg-cinema-dark flex items-center justify-center">
        <p className="text-red-500 text-xl">{error || 'Person not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cinema-dark">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-gray-900 to-cinema-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-cinema-text hover:text-cinema-gold transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              <div className="w-48 h-72 md:w-64 md:h-96 rounded-lg overflow-hidden bg-gray-800">
                {person.profile_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                    alt={person.name}
                    width={500}
                    height={750}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-700">
                    <span className="text-gray-500 text-6xl">👤</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-cinema-gold mb-4">
                {person.name}
              </h1>

              <div className="flex flex-wrap gap-4 text-cinema-text mb-6">
                {person.known_for_department && (
                  <div className="flex items-center gap-2">
                    <Star size={18} className="text-cinema-gold" />
                    <span>Known for: {person.known_for_department}</span>
                  </div>
                )}
                {person.birthday && (
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-cinema-gold" />
                    <span>Born: {new Date(person.birthday).getFullYear()}</span>
                  </div>
                )}
                {person.place_of_birth && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-cinema-gold" />
                    <span>{person.place_of_birth}</span>
                  </div>
                )}
              </div>

              {person.biography && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-cinema-gold mb-3">Biography</h2>
                  <p className="text-cinema-text leading-relaxed line-clamp-6 md:line-clamp-none">
                    {person.biography}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filmography */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-cinema-gold mb-6">
          Filmography ({movies.length} {movies.length === 1 ? 'movie' : 'movies'})
        </h2>

        {movies.length === 0 ? (
          <p className="text-cinema-text">No movies found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => router.push(`/movie/${movie.id}`)}
                className="cursor-pointer group"
              >
                <div className="relative aspect-[2/3] mb-2 rounded-lg overflow-hidden bg-gray-800 group-hover:ring-2 group-hover:ring-cinema-gold transition-all group-hover:scale-105 duration-300">
                  {movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                      alt={movie.title || movie.name || 'Movie'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <span className="text-gray-500 text-6xl">🎬</span>
                    </div>
                  )}
                  {movie.vote_average && movie.vote_average > 0 && (
                    <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded flex items-center gap-1">
                      <Star size={12} className="fill-cinema-gold text-cinema-gold" />
                      <span className="text-white text-xs font-semibold">
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <h3 className="text-white text-sm font-bold line-clamp-2 mb-1">
                      {movie.title || movie.name}
                    </h3>
                    {movie.character && (
                      <p className="text-gray-300 text-xs line-clamp-1">
                        as {movie.character}
                      </p>
                    )}
                    {(movie.release_date || movie.first_air_date) && (
                      <p className="text-gray-400 text-xs">
                        {new Date(movie.release_date || movie.first_air_date || '').getFullYear()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
