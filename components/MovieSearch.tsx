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

const MovieSearch = () => {
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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Enter movie name</h1>
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a movie..."
            className="w-full px-4 py-2 pr-10 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}