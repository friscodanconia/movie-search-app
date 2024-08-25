'use client';

import React, { useState, useEffect } from 'react';
import { Search, Star, ExternalLink, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import MovieDetail from './MovieDetail';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  overview?: string;
  vote_average?: number;
  vote_count?: number;
  media_type: 'movie';
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

const MovieSearch: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [visibleResults, setVisibleResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleLogoClick = () => {
    setSearchTerm('');
    setSearchResults([]);
    setVisibleResults([]);
    setCurrentPage(1);
    setTotalPages(0);
    setError(null);
    router.refresh();
  };

  const handleSearch = async (e?: React.FormEvent, page: number = 1) => {
    e?.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${searchTerm}&page=${page}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }
      const data = await response.json();
      const processedResults = processSearchResults(data.results);
      setSearchResults(processedResults);
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
      if (result.media_type === 'movie') {
        processedResults.push(result as Movie);
      } else if (result.media_type === 'person') {
        const person = result as Person;
        person.known_for.forEach(movie => {
          if (movie.media_type === 'movie') {
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
      const timer = setTimeout(() => {
        setVisibleResults(searchResults.slice(0, visibleResults.length + 4));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [searchResults, visibleResults]);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-cinema-dark">
      <h1 
        className="text-4xl font-bold mb-2 text-center text-cinema-gold cursor-pointer hover:text-yellow-300 transition-colors"
        onClick={handleLogoClick}
      >
        CineMagic
      </h1>
      <p className="text-lg mb-8 text-center text-cinema-text">Search for movies or people</p>
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a movie or person..."
            aria-label="Search for a movie or person"
            className="w-full px-4 py-2 pr-10 text-cinema-text bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-cinema-gold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => handleSearch()}
            aria-label="Search"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cinema-gold hover:text-yellow-300 cursor-pointer"
          >
            <Search className="w-6 h-6" />
          </button>
        </div>
      </form>
      {isLoading && <p className="text-center text-cinema-text">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!isLoading && !error && visibleResults.length === 0 && searchTerm && (
        <p className="text-center text-cinema-text">No results found</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleResults.map((movie) => (
          <div 
            key={movie.id} 
            className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700 cursor-pointer"
            onClick={() => setSelectedMovie(movie)}
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
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handleSearch(undefined, currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-cinema-gold text-cinema-dark rounded-l-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-gray-800 text-cinema-text">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handleSearch(undefined, currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-cinema-gold text-cinema-dark rounded-r-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      {selectedMovie && (
        <MovieDetail movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
};

export default MovieSearch;