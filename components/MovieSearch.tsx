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

    try {
      let response;

      // If genres are selected, use discover API
      if (genres.length > 0) {
        const genreQuery = genres.join(',');
        const searchQuery = term ? `&query=${encodeURIComponent(term)}` : '';
        response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&with_genres=${genreQuery}&sort_by=popularity.desc${searchQuery}&page=${page}`
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
            Found {visibleResults.length} {visibleResults.length === 1 ? 'result' : 'results'}
          </p>
        </div>
      )}

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {visibleResults.map((movie) => (
    <div 
      key={movie.id} 
      className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700 cursor-pointer hover:border-cinema-gold transition-colors"
      onClick={() => handleMovieClick(movie)}
      role="button"
      aria-label={`View details for ${movie.title}`}
      tabIndex={0}
          >
            {movie.poster_path && (
              <Image 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={500}
                height={750}
                className="w-full h-64 object-cover"
                loading="lazy"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2 text-cinema-gold">{movie.title}</h2>
              {movie.release_date && (
                <p className="text-sm text-gray-400 mb-2">Released: {movie.release_date}</p>
              )}
              <p className="text-sm mb-2">{movie.overview}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-cinema-gold mr-1" />
                  <span>{movie.vote_average?.toFixed(1) || 'N/A'} ({movie.vote_count || 0} votes)</span>
                </div>
                <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noopener noreferrer" className="text-cinema-gold hover:underline flex items-center">
                  View on TMDb
                  <span className="ml-1">→</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
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