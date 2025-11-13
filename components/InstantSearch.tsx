'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, X, Clock, TrendingUp, Film, Tv, User } from 'lucide-react';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  media_type: 'movie' | 'tv' | 'person';
  poster_path?: string;
  profile_path?: string;
  vote_average?: number;
  first_air_date?: string;
  release_date?: string;
  known_for_department?: string;
}

interface RecentSearch {
  query: string;
  timestamp: number;
}

export default function InstantSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>();
  const router = useRouter();

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recent searches', e);
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}&page=1`
      );

      const data = await response.json();

      // Filter out items without images
      const validResults = data.results.filter((item: SearchResult) =>
        (item.media_type === 'movie' || item.media_type === 'tv' || item.media_type === 'person') &&
        (item.poster_path || item.profile_path)
      );

      // Separate by type for balanced results
      const movies = validResults.filter((item: SearchResult) => item.media_type === 'movie');
      const tvShows = validResults.filter((item: SearchResult) => item.media_type === 'tv');
      const people = validResults.filter((item: SearchResult) => item.media_type === 'person');

      // Create balanced result set: prioritize diversity
      const balanced: SearchResult[] = [];

      // Add top 4 movies
      balanced.push(...movies.slice(0, 4));

      // Add top 2 people (important for actor/director searches)
      balanced.push(...people.slice(0, 2));

      // Add top 2 TV shows
      balanced.push(...tvShows.slice(0, 2));

      // If we don't have 8 items, fill with remaining results
      if (balanced.length < 8) {
        const remaining = validResults
          .filter((item: SearchResult) => !balanced.includes(item))
          .slice(0, 8 - balanced.length);
        balanced.push(...remaining);
      }

      setResults(balanced);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    setSelectedIndex(-1);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    if (value.trim()) {
      setIsLoading(true);
      debounceTimer.current = setTimeout(() => {
        performSearch(value);
      }, 300);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  };

  // Save to recent searches
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const newRecent: RecentSearch = {
      query: searchQuery,
      timestamp: Date.now()
    };

    // Remove duplicates and limit to 5
    const updated = [
      newRecent,
      ...recentSearches.filter(r => r.query.toLowerCase() !== searchQuery.toLowerCase())
    ].slice(0, 5);

    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(query);
    setIsOpen(false);
    setQuery('');

    if (result.media_type === 'person') {
      router.push(`/person/${result.id}`);
    } else {
      router.push(`/${result.media_type}/${result.id}`);
    }
  };

  // Handle recent search click
  const handleRecentClick = (recentQuery: string) => {
    setQuery(recentQuery);
    performSearch(recentQuery);
    inputRef.current?.focus();
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Get display title
  const getTitle = (result: SearchResult) => result.title || result.name || '';

  // Get year
  const getYear = (result: SearchResult) => {
    const date = result.release_date || result.first_air_date;
    return date ? new Date(date).getFullYear() : '';
  };

  // Get icon for media type
  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'movie': return <Film size={14} className="text-cinema-gold" />;
      case 'tv': return <Tv size={14} className="text-cinema-gold" />;
      case 'person': return <User size={14} className="text-cinema-gold" />;
      default: return null;
    }
  };

  const showDropdown = isOpen && (query.trim() || recentSearches.length > 0);

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Search Input - Desktop */}
      <div className="hidden md:block relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder="Search movies, shows, people..."
          className="w-full bg-gray-800 text-cinema-text pl-12 pr-12 py-3 rounded-full border-2 border-transparent focus:border-cinema-gold outline-none transition-all placeholder:text-gray-500"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cinema-gold transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Search Icon - Mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden text-cinema-text hover:text-cinema-gold transition-colors p-2"
      >
        <Search size={20} />
      </button>

      {/* Results Dropdown/Modal */}
      {showDropdown && (
        <>
          {/* Mobile: Full-screen overlay */}
          {isMobile && (
            <div className="fixed inset-0 bg-cinema-dark z-50 overflow-y-auto">
              <div className="sticky top-0 bg-cinema-dark border-b border-gray-800 p-4">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search..."
                    className="w-full bg-gray-800 text-cinema-text pl-12 pr-12 py-3 rounded-full outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-4">
                {/* Recent Searches */}
                {!query && recentSearches.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                        <Clock size={16} />
                        Recent Searches
                      </h3>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-cinema-gold hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                    {recentSearches.map((recent, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleRecentClick(recent.query)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors text-left"
                      >
                        <Clock size={16} className="text-gray-500" />
                        <span className="text-cinema-text">{recent.query}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="text-center py-8 text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-cinema-gold border-t-transparent mx-auto"></div>
                    <p className="mt-2 text-sm">Searching...</p>
                  </div>
                )}

                {/* Results */}
                {!isLoading && results.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-3">
                      Results ({results.length})
                    </h3>
                    {results.map((result, idx) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="w-full flex items-start gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <div className="w-12 h-16 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                          {(result.poster_path || result.profile_path) && (
                            <Image
                              src={`https://image.tmdb.org/t/p/w92${result.poster_path || result.profile_path}`}
                              alt={getTitle(result)}
                              width={48}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2 mb-1">
                            {getMediaIcon(result.media_type)}
                            <span className="text-cinema-text font-medium line-clamp-1">
                              {getTitle(result)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            {result.media_type === 'person' ? (
                              <span>{result.known_for_department}</span>
                            ) : (
                              <>
                                {getYear(result) && <span>{getYear(result)}</span>}
                                {result.vote_average && (
                                  <>
                                    <span>•</span>
                                    <span>⭐ {result.vote_average.toFixed(1)}</span>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {!isLoading && query && results.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p>No results found for &quot;{query}&quot;</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Desktop: Dropdown */}
          {!isMobile && (
            <div className="absolute top-full mt-2 w-full bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-h-[600px] overflow-y-auto z-50">
              {/* Recent Searches */}
              {!query && recentSearches.length > 0 && (
                <div className="p-4 border-b border-gray-800">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                      <Clock size={16} />
                      Recent Searches
                    </h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-cinema-gold hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                  {recentSearches.map((recent, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRecentClick(recent.query)}
                      className="w-full flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg transition-colors text-left"
                    >
                      <Clock size={16} className="text-gray-500" />
                      <span className="text-cinema-text">{recent.query}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-8 text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-cinema-gold border-t-transparent mx-auto"></div>
                  <p className="mt-2 text-sm">Searching...</p>
                </div>
              )}

              {/* Results */}
              {!isLoading && results.length > 0 && (
                <div className="p-2">
                  {results.map((result, idx) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-start gap-4 p-3 rounded-lg transition-all ${
                        selectedIndex === idx
                          ? 'bg-gray-800 ring-2 ring-cinema-gold'
                          : 'hover:bg-gray-800'
                      }`}
                    >
                      <div className="w-16 h-24 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                        {(result.poster_path || result.profile_path) && (
                          <Image
                            src={`https://image.tmdb.org/t/p/w92${result.poster_path || result.profile_path}`}
                            alt={getTitle(result)}
                            width={64}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-2">
                          {getMediaIcon(result.media_type)}
                          <span className="text-cinema-text font-semibold">
                            {getTitle(result)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          {result.media_type === 'person' ? (
                            <span>{result.known_for_department}</span>
                          ) : (
                            <>
                              {getYear(result) && <span>{getYear(result)}</span>}
                              {result.vote_average && (
                                <>
                                  <span>•</span>
                                  <span>⭐ {result.vote_average.toFixed(1)}</span>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!isLoading && query && results.length === 0 && (
                <div className="text-center py-8 text-gray-400 p-4">
                  <p>No results found for &quot;{query}&quot;</p>
                  <p className="text-sm mt-2">Try searching for a movie, TV show, or person</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
