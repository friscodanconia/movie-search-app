'use client';

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SearchBar from './SearchBarEnhanced';
import SkeletonCard from './SkeletonCard';
import AdvancedFilters, { FilterOptions } from './AdvancedFilters';

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
  known_for?: Movie[];
  media_type: 'person';
}

type SearchResult = Movie | Person;

interface DisplayItem {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  overview?: string;
  vote_average?: number;
  vote_count?: number;
  media_type: 'movie' | 'tv' | 'person';
  known_for_department?: string;
}

interface MovieSearchProps {
  onSearchStateChange?: (isActive: boolean) => void;
}

const MovieSearch: React.FC<MovieSearchProps> = ({ onSearchStateChange }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<DisplayItem[]>([]);
  const [visibleResults, setVisibleResults] = useState<DisplayItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [isGenreSearch, setIsGenreSearch] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleLogoClick = () => {
    setSearchTerm('');
    setSearchResults([]);
    setVisibleResults([]);
    setCurrentPage(1);
    setTotalPages(0);
    setError(null);
    router.refresh();
  };

  const handleMovieClick = (item: DisplayItem) => {
    // Route to appropriate page based on media type
    if (item.media_type === 'person') {
      router.push(`/person/${item.id}`);
    } else {
      const mediaType = item.media_type === 'movie' ? 'movie' : 'tv';
      router.push(`/${mediaType}/${item.id}`);
    }
  };

  const handleSearch = async (term: string, genres: number[] = [], page: number = 1) => {
    if (!term.trim() && genres.length === 0) return;

    setIsLoading(true);
    setSearchTerm(term);
    setError(null);
    setIsGenreSearch(genres.length > 0 && !term.trim());

    try {
      let response;
      let processedResults: DisplayItem[] = [];

      // If we have BOTH text search AND genre filters
      if (term.trim() && genres.length > 0) {
        // Use search API with text, then filter by genre client-side
        response = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${term}&page=${page}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }
        const data = await response.json();

        // Filter results to only include items that match selected genres
        const genreFilteredResults = data.results.filter((item: any) => {
          if (item.media_type !== 'movie' && item.media_type !== 'tv') return false;
          if (!item.genre_ids || !Array.isArray(item.genre_ids)) return false;
          return genres.some(genreId => item.genre_ids.includes(genreId));
        });

        processedResults = processSearchResults(genreFilteredResults);
        setSearchResults(processedResults);
        setCurrentPage(data.page);
        setTotalPages(Math.ceil(genreFilteredResults.length / 20));
        setTotalResults(genreFilteredResults.length);
      }
      // If genres are selected but no text, use discover API
      else if (genres.length > 0 && !term.trim()) {
        const genreQuery = genres.join(',');

        // Build filter parameters
        const filterParams = [];
        if (filters.yearFrom) filterParams.push(`primary_release_date.gte=${filters.yearFrom}-01-01`);
        if (filters.yearTo) filterParams.push(`primary_release_date.lte=${filters.yearTo}-12-31`);
        if (filters.minRating) filterParams.push(`vote_average.gte=${filters.minRating}`);
        if (filters.language) filterParams.push(`with_original_language=${filters.language}`);

        const filterQuery = filterParams.length > 0 ? `&${filterParams.join('&')}` : '';

        response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&with_genres=${genreQuery}&sort_by=popularity.desc&page=${page}${filterQuery}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }
        const data = await response.json();

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
        setCurrentPage(data.page);
        setTotalPages(data.total_pages);
        setTotalResults(data.total_results || 0);
      }
      // Otherwise use regular multi-search (text only, no genre filter)
      else {
        response = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${term}&page=${page}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }
        const data = await response.json();

        processedResults = processSearchResults(data.results);
        setSearchResults(processedResults);
        setCurrentPage(data.page);
        setTotalPages(data.total_pages);
        setTotalResults(data.total_results || 0);
      }

      setHasSearched(true);
    } catch (error) {
      console.error('Error searching:', error);
      setError('An error occurred while searching. Please try again.');
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  };

  const processSearchResults = (results: SearchResult[]): DisplayItem[] => {
    const processedResults: DisplayItem[] = [];

    results.forEach(result => {
      if (result.media_type === 'movie' || result.media_type === 'tv') {
        processedResults.push(result as DisplayItem);
      } else if (result.media_type === 'person') {
        const person = result as Person;
        // Add the person card itself
        processedResults.push({
          id: person.id,
          title: person.name,
          poster_path: person.profile_path,
          media_type: 'person',
          known_for_department: person.known_for_department,
        } as DisplayItem);
      }
    });

    return sortMovies(processedResults);
  };

  const sortMovies = (items: DisplayItem[]): DisplayItem[] => {
    return items.sort((a, b) => {
      const scoreA = calculateMovieScore(a);
      const scoreB = calculateMovieScore(b);
      return scoreB - scoreA;
    });
  };

  const calculateMovieScore = (item: DisplayItem): number => {
    let score = 0;

    // Person cards get a moderate base score
    if (item.media_type === 'person') {
      score = 100; // Base score for person cards
      if (item.poster_path) score += 50;
      return score;
    }

    // Movie/TV scoring
    score += (item.vote_average || 0) * 10;
    score += Math.log((item.vote_count || 0) + 1) * 20;
    if (item.poster_path) score += 50;
    const currentYear = new Date().getFullYear();
    const movieYear = item.release_date ? new Date(item.release_date).getFullYear() : currentYear;
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
    setHasSearched(false);
    setFilters({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search Bar with Advanced Filters */}
      <div className="max-w-3xl mx-auto mb-4">
        <div className="relative">
          <SearchBar onSearch={handleSearch} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {/* Advanced Filters and Clear Button */}
          <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-between">
            <AdvancedFilters
              currentFilters={filters}
              onFilterChange={(newFilters) => {
                setFilters(newFilters);
                // Re-trigger search with new filters if we have an active search
                if (searchTerm || hasSearched) {
                  handleSearch(searchTerm, [], 1);
                }
              }}
            />

            {(visibleResults.length > 0 || searchTerm) && (
              <button
                onClick={handleClearSearch}
                className="px-6 py-2 bg-gray-700 text-cinema-text rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                ← Back to Browse
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Results */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mt-6">
          {[...Array(10)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}
      {error && <p className="text-center text-red-500 py-4">{error}</p>}
      {!isLoading && !error && hasSearched && visibleResults.length === 0 && searchTerm && (
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
          {/* Hero Card - Desktop Only (only for movie/tv, not person) */}
          <div className="hidden md:block mb-8">
            {(() => {
              const heroItem = visibleResults.find(item => item.media_type !== 'person');
              return heroItem ? (
                <div
                  onClick={() => handleMovieClick(heroItem)}
                  className="relative h-[400px] rounded-xl overflow-hidden cursor-pointer group"
                  style={{
                    backgroundImage: heroItem.backdrop_path
                      ? `url(https://image.tmdb.org/t/p/original${heroItem.backdrop_path})`
                      : heroItem.poster_path
                      ? `url(https://image.tmdb.org/t/p/original${heroItem.poster_path})`
                      : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-cinema-dark/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-start gap-6">
                      {heroItem.poster_path && (
                        <div className="flex-shrink-0 hidden lg:block">
                          <Image
                            src={`https://image.tmdb.org/t/p/w342${heroItem.poster_path}`}
                            alt={heroItem.title}
                            width={200}
                            height={300}
                            className="rounded-lg shadow-2xl"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-3xl lg:text-4xl font-bold text-cinema-gold mb-3">
                          {heroItem.title}
                        </h3>
                        <div className="flex items-center gap-4 mb-4">
                          {heroItem.release_date && (
                            <span className="text-cinema-text">
                              {new Date(heroItem.release_date).getFullYear()}
                            </span>
                          )}
                          <div className="flex items-center gap-1">
                            <Star size={20} className="fill-cinema-gold text-cinema-gold" />
                            <span className="text-cinema-text font-semibold">
                              {heroItem.vote_average?.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <p className="text-cinema-text text-lg line-clamp-3 mb-4 max-w-3xl">
                          {heroItem.overview}
                        </p>
                        <button className="px-6 py-3 bg-cinema-gold text-cinema-dark rounded-full font-semibold hover:bg-yellow-500 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}
          </div>

          {/* Grid - Shows all results except hero item on desktop, all on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {visibleResults.filter((item, index) => {
              // On mobile, show all
              // On desktop, skip the first movie/tv that was shown in hero
              const heroItem = visibleResults.find(i => i.media_type !== 'person');
              return item.media_type === 'person' || item.id !== heroItem?.id;
            }).map((item) => (
              <div
                key={item.id}
                onClick={() => handleMovieClick(item)}
                className="cursor-pointer group"
              >
                <div className="relative aspect-[2/3] mb-2 rounded-lg overflow-hidden bg-gray-800 group-hover:ring-2 group-hover:ring-cinema-gold transition-all">
                  {item.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <span className="text-gray-500 text-4xl">
                        {item.media_type === 'person' ? '👤' : '🎬'}
                      </span>
                    </div>
                  )}
                  {item.media_type === 'person' ? (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                      <p className="text-white text-xs font-semibold">
                        {item.known_for_department || 'Actor'}
                      </p>
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded flex items-center gap-1">
                      <Star size={12} className="fill-cinema-gold text-cinema-gold" />
                      <span className="text-white text-xs font-semibold">
                        {item.vote_average?.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-cinema-text text-sm font-medium line-clamp-2 mb-1">
                  {item.title}
                </h3>
                {item.release_date && item.media_type !== 'person' && (
                  <p className="text-gray-400 text-xs">
                    {new Date(item.release_date).getFullYear()}
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
          {visibleResults.map((item) => (
            <div
              key={item.id}
              onClick={() => handleMovieClick(item)}
              className="cursor-pointer group"
            >
              <div className="relative aspect-[2/3] mb-2 rounded-lg overflow-hidden bg-gray-800 group-hover:ring-2 group-hover:ring-cinema-gold transition-all group-hover:scale-105 duration-300">
                {item.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                    alt={item.title}
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
                    {item.vote_average?.toFixed(1)}
                  </span>
                </div>
                {/* Hover overlay with info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <h3 className="text-white text-sm font-bold line-clamp-2 mb-1">
                    {item.title}
                  </h3>
                  {item.release_date && (
                    <p className="text-gray-300 text-xs">
                      {new Date(item.release_date).getFullYear()}
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