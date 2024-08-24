'use client';

import React, { useState } from 'react';
import { Search, Star, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
  vote_count: number;
}

const MovieSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchTerm.trim()) return;
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${searchTerm}`
      );
      const data = await response.json();
      const sortedResults = sortMovies(data.results);
      setSearchResults(sortedResults);
    } catch (error) {
      console.error('Error searching movies:', error);
    }
  };

  const sortMovies = (movies: any[]): Movie[] => {
    return movies.sort((a, b) => {
      const scoreA = calculateMovieScore(a);
      const scoreB = calculateMovieScore(b);
      return scoreB - scoreA;
    });
  };

  const calculateMovieScore = (movie: Movie): number => {
    let score = 0;
    score += movie.vote_average * 10;
    score += Math.log(movie.vote_count + 1) * 20;
    if (movie.poster_path) score += 50;
    const currentYear = new Date().getFullYear();
    const movieYear = new Date(movie.release_date).getFullYear();
    score += Math.max(0, 10 - (currentYear - movieYear));
    return score;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-cinema-dark">
      <h1 className="text-3xl font-bold mb-8 text-center text-cinema-gold">Enter movie name</h1>
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a movie..."
            className="w-full px-4 py-2 pr-10 text-cinema-text bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-cinema-gold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div
            onClick={() => handleSearch()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cinema-gold hover:text-yellow-300 cursor-pointer"
          >
            <Search className="w-6 h-6" />
          </div>
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {searchResults.map((movie) => (
          <div key={movie.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
            <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noopener noreferrer" className="block hover:opacity-75 transition-opacity">
              {movie.poster_path && (
                <Image 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="w-full h-64 object-cover"
                />
              )}
            </a>
            <div className="p-4">
              <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noopener noreferrer" className="block hover:underline">
                <h2 className="text-xl font-bold mb-2 text-cinema-gold">{movie.title}</h2>
              </a>
              <p className="text-sm text-gray-400 mb-2">Released: {movie.release_date}</p>
              <p className="text-sm mb-2">{movie.overview}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-cinema-gold mr-1" />
                  <span>{movie.vote_average.toFixed(1)} ({movie.vote_count} votes)</span>
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
    </div>
  );
};

export default MovieSearch;