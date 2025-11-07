'use client';

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SearchBar from './SearchBarEnhanced';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  overview?: string;
  vote_average?: number;
  vote_count?: number;
  media_type: 'movie' | 'tv';
}

interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  known_for: Movie[];
  media_type: 'person';
}

type SearchResult = Movie | Person;

interface MovieSearchProps {
  onSearchStateChange?: (isActive: boolean) => void;
}

const MovieSearch: React.FC<MovieSearchProps> = ({ onSearchStateChange }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [visibleResults, setVisibleResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [isGenreSearch, setIsGenreSearch] = useState(false);

  const handleLogoClick = () => {
    setSearchTerm('');
    setSearchResults([]);
    setVisibleResults([]);
    setCurrentPage(1);
    setTotalPages(0);
    setError(null);
    router.refresh();
  };

  const handleMovieClick = (movie: Movie) => {
    // Route to appropriate page based on media type
    const mediaType = movie.media_type === 'movie' ? 'movie' : 'tv';
    router.push(`/${mediaType}/${movie.id}`);
  };

  const handleSearch = async (term: string, genres: number[] = [], page: number = 1) => {
    setSearchTerm(term);
    if (!term.trim() && genres.length === 0) return;

    setIsLoading(true);
    setError(null);
    setIsGenreSearch(genres.length > 0);

    try {
      let response;

      // If genres are selected, use discover API (discover doesn't support text query)
      if (genres.length > 0) {
        const genreQuery = genres.join(',');
        response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&with_genres=${genreQuery}&sort_by=popularity.desc&page=${page}`
        );
      } else {
        // Otherwise use regular multi-search
        response = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${term}&page=${page}`
        );
      }

      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }
      const data = await response.json();

      // If using discover API, directly map results
      if (genres.length > 0) {
        const movies = data.results.map((item: any) => ({
          id: item.id,
          title: item.title || item.name,
          poster_path: item.poster_path,
          backdrop_path: item.backdrop_path,
          release_date: item.release_date || item.first_air_date,
          overview: item.overview,
          vote_average: item.vote_average,
          vote_count: item.vote_count,
          media_type: 'movie' as const,
        }));
        setSearchResults(sortMovies(movies));
      } else {
        const processedResults = processSearchResults(data.results);
        setSearchResults(processedResults);
      }

      setCurrentPage(data.page);
      setTotalPages(data.total_pages);
      setTotalResults(data.total_results || 0);
    } catch (error) {
      console.error('Error searching:', error);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const processSearchResults = (results: SearchResult[]): Movie[] => {
    const processedResults: Movie[] = [];
    
    results.forEach(result => {
      if (result.media_type === 'movie' || result.media_type === 'tv') {
        processedResults.push(result as Movie);
      } else if (result.media_type === 'person') {
        const person = result as Person;
        person.known_for.forEach(movie => {
          if (movie.media_type === 'movie' || movie.media_type === 'tv') {
            processedResults.push({
              ...movie,
              title: `${movie.title} (featuring ${person.name})`,
            });
          }
        });
      }
    });

    return sortMovies(processedResults);
  };

  const sortMovies = (movies: Movie[]): Movie[] => {
    return movies.sort((a, b) => {
      const scoreA = calculateMovieScore(a);
      const scoreB = calculateMovieScore(b);
      return scoreB - scoreA;
    });
  };

  const calculateMovieScore = (movie: Movie): number => {
    let score = 0;
    score += (movie.vote_average || 0) * 10;
    score += Math.log((movie.vote_count || 0) + 1) * 20;
    if (movie.poster_path) score += 50;
    const currentYear = new Date().getFullYear();
    const movieYear = movie.release_date ? new Date(movie.release_date).getFullYear() : currentYear;
    score += Math.max(0, 10 - (currentYear - movieYear));
    return score;
  };

  useEffect(() => {
    if (searchResults.length > 0) {
      setVisibleResults(searchResults);
      onSearchStateChange?.(true);
    } else {
      setVisibleResults([]);
      onSearchStateChange?.(false);
    }
  }, [searchResults, onSearchStateChange]);

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setVisibleResults([]);
    setCurrentPage(1);
    setTotalPages(0);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search Bar with Clear Button */}
      <div className="max-w-3xl mx-auto mb-4">
        <div className="relative">
          <SearchBar onSearch={handleSearch} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          {(visibleResults.length > 0 || searchTerm) && (
            <button
              onClick={handleClearSearch}
              className="mt-3 w-full sm:w-auto px-6 py-2 bg-gray-700 text-cinema-text rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              ← Back to Browse
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {isLoading && <p className="text-center text-cinema-text py-4">Loading...</p>}
      {error && <p className="text-center text-red-500 py-4">{error}</p>}
      {!isLoading && !error && visibleResults.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-cinema-text text-lg mb-4">No results found for &ldquo;{searchTerm}&rdquo;</p>
          <button
            onClick={handleClearSearch}
            className="px-6 py-3 bg-cinema-gold text-cinema-dark rounded-full font-semibold hover:bg-yellow-500 transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Results Header */}
      {visibleResults.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-cinema-gold">
            Search Results
            {searchTerm && <span className="text-cinema-text font-normal"> for &ldquo;{searchTerm}&rdquo;</span>}
          </h2>
          <p className="text-gray-400 mt-2">
            Showing {visibleResults.length} of {totalResults.toLocaleString()} results
            {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </p>
        </div>
      )}

      {/* Text Search Layout: Hero + Grid */}
      {!isGenreSearch && visibleResults.length > 0 && (
        <>
          {/* Hero Card - Desktop Only */}
          <div className="hidden md:block mb-8">
            {visibleResults[0] && (
              <div
                onClick={() => handleMovieClick(visibleResults[0])}
                className="relative h-[400px] rounded-xl overflow-hidden cursor-pointer group"
                style={{
                  backgroundImage: visibleResults[0].backdrop_path
                    ? `url(https://image.tmdb.org/t/p/original${visibleResults[0].backdrop_path})`
                    : visibleResults[0].poster_path
                    ? `url(https://image.tmdb.org/t/p/original${visibleResults[0].poster_path})`
                    : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-cinema-dark/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-start gap-6">
                    {visibleResults[0].poster_path && (
                      <div className="flex-shrink-0 hidden lg:block">
                        <Image
                          src={`https://image.tmdb.org/t/p/w342${visibleResults[0].poster_path}`}
                          alt={visibleResults[0].title}
                          width={200}
                          height={300}
                          className="rounded-lg shadow-2xl"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-3xl lg:text-4xl font-bold text-cinema-gold mb-3">
                        {visibleResults[0].title}
                      </h3>
                      <div className="flex items-center gap-4 mb-4">
                        {visibleResults[0].release_date && (
                          <span className="text-cinema-text">
                            {new Date(visibleResults[0].release_date).getFullYear()}
                          </span>
                        )}
                        <div className="flex items-center gap-1">
                          <Star size={20} className="fill-cinema-gold text-cinema-gold" />
                          <span className="text-cinema-text font-semibold">
                            {visibleResults[0].vote_average?.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <p className="text-cinema-text text-lg line-clamp-3 mb-4 max-w-3xl">
                        {visibleResults[0].overview}
                      </p>
                      <button className="px-6 py-3 bg-cinema-gold text-cinema-dark rounded-full font-semibold hover:bg-yellow-500 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Grid - Shows all on mobile, skips first on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {visibleResults.slice(1).map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleMovieClick(movie)}
                className="cursor-pointer group"
              >
                <div className="relative aspect-[2/3] mb-2 rounded-lg overflow-hidden bg-gray-800 group-hover:ring-2 group-hover:ring-cinema-gold transition-all">
                  {movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <span className="text-gray-500 text-4xl">🎬</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded flex items-center gap-1">
                    <Star size={12} className="fill-cinema-gold text-cinema-gold" />
                    <span className="text-white text-xs font-semibold">
                      {movie.vote_average?.toFixed(1)}
                    </span>
                  </div>
                </div>
                <h3 className="text-cinema-text text-sm font-medium line-clamp-2 mb-1">
                  {movie.title}
                </h3>
                {movie.release_date && (
                  <p className="text-gray-400 text-xs">
                    {new Date(movie.release_date).getFullYear()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Genre Search Layout: Netflix Grid */}
      {isGenreSearch && visibleResults.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {visibleResults.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleMovieClick(movie)}
              className="cursor-pointer group"
            >
              <div className="relative aspect-[2/3] mb-2 rounded-lg overflow-hidden bg-gray-800 group-hover:ring-2 group-hover:ring-cinema-gold transition-all group-hover:scale-105 duration-300">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-700">
                    <span className="text-gray-500 text-4xl">🎬</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded flex items-center gap-1">
                  <Star size={12} className="fill-cinema-gold text-cinema-gold" />
                  <span className="text-white text-xs font-semibold">
                    {movie.vote_average?.toFixed(1)}
                  </span>
                </div>
                {/* Hover overlay with info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <h3 className="text-white text-sm font-bold line-clamp-2 mb-1">
                    {movie.title}
                  </h3>
                  {movie.release_date && (
                    <p className="text-gray-300 text-xs">
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handleSearch(searchTerm, [], currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-cinema-gold text-cinema-dark rounded-l-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-gray-800 text-cinema-text">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handleSearch(searchTerm, [], currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-cinema-gold text-cinema-dark rounded-r-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieSearch;