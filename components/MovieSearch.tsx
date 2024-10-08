'use client';

import React, { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SearchBar from './SearchBar';

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

interface MovieDetailProps {
  movie: Movie;
  onClose: () => void;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movie, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full overflow-y-auto max-h-full">
        <div className="p-4 flex justify-between items-start">
          <h2 className="text-2xl font-bold text-cinema-gold">{movie.title}</h2>
          <button onClick={onClose} className="text-cinema-text hover:text-cinema-gold">
            <X size={24} />
          </button>
        </div>
        <div className="p-4">
          {movie.poster_path && (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={500}
              height={750}
              className="w-full h-auto rounded-lg mb-4"
            />
          )}
          <p className="text-cinema-text mb-2">{movie.overview}</p>
          <p className="text-cinema-text mb-2">Released: {movie.release_date}</p>
          <div className="flex items-center">
            <Star className="w-5 h-5 text-cinema-gold mr-1" />
            <span className="text-cinema-text">
              {movie.vote_average?.toFixed(1) || 'N/A'} ({movie.vote_count || 0} votes)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

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

  const handleSearch = async (term: string, page: number = 1) => {
    setSearchTerm(term);
    if (!term.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${term}&page=${page}`
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
  className="text-4xl font-bold mb-2 text-center text-cinema-gold cursor-pointer hover:text-yellow-300 transition-colors relative group"
  onClick={handleLogoClick}
>
  CineMagic
  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300 ease-out"></span>
</h1>
<p className="text-lg mb-8 text-center text-cinema-text">Search for movies or people</p>
<SearchBar onSearch={handleSearch} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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
            onClick={() => handleSearch(searchTerm, currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-cinema-gold text-cinema-dark rounded-l-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-gray-800 text-cinema-text">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handleSearch(searchTerm, currentPage + 1)}
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