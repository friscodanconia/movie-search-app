import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Search, Film, User, Loader, Tv } from 'lucide-react';
import debounce from 'lodash.debounce';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface SearchSuggestion {
  id: number;
  title: string;
  media_type: string;
  year?: string;
  character?: string;
  poster_path?: string;
  profile_path?: string;
  vote_average?: number;
}

interface SearchBarProps {
  onSearch: (term: string) => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchTerm, setSearchTerm }) => {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (term.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${term}&page=1`
        );
        const data = await response.json();
        const filteredSuggestions = data.results
          .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv' || item.media_type === 'person')
          .slice(0, 6)
          .map((item: any) => ({
            id: item.id,
            title: item.title || item.name,
            media_type: item.media_type,
            year: item.release_date ? new Date(item.release_date).getFullYear().toString() : 
                  item.first_air_date ? new Date(item.first_air_date).getFullYear().toString() :
                  (item.known_for && item.known_for[0]?.release_date ? 
                    new Date(item.known_for[0].release_date).getFullYear().toString() : undefined),
            character: item.media_type === 'person' && item.known_for && item.known_for[0]?.title ? 
                       item.known_for[0].title : undefined,
            poster_path: item.poster_path,
            profile_path: item.profile_path,
            vote_average: item.vote_average
          }));
        setSuggestions(filteredSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim().length >= 2) {
      debouncedSearch(value);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (e: React.MouseEvent, suggestion: SearchSuggestion) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSuggestions(false);
    // Navigate directly to detail page based on media type
    if (suggestion.media_type === 'movie') {
      router.push(`/movie/${suggestion.id}`);
    } else if (suggestion.media_type === 'tv') {
      router.push(`/tv/${suggestion.id}`);
    } else {
      // For persons, do a search
      setSearchTerm(suggestion.title);
      onSearch(suggestion.title);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const suggestion = suggestions[selectedIndex];
      setShowSuggestions(false);
      if (suggestion.media_type === 'movie') {
        router.push(`/movie/${suggestion.id}`);
      } else if (suggestion.media_type === 'tv') {
        router.push(`/tv/${suggestion.id}`);
      } else {
        setSearchTerm(suggestion.title);
        onSearch(suggestion.title);
      }
    }
  };

  useEffect(() => {
    if (selectedIndex >= 0 && inputRef.current) {
      inputRef.current.value = suggestions[selectedIndex].title;
    }
  }, [selectedIndex, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const highlightMatch = (text: string, highlight: string) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() ? 
        <span key={index} className="bg-yellow-300 text-gray-800">{part}</span> : part
    );
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
        <input
  ref={inputRef}
  type="text"
  placeholder="Search movies, TV shows, people..."
  aria-label="Search for a movie or person"
  className="w-full px-5 py-3 pr-12 text-cinema-text bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cinema-gold focus:bg-opacity-70 transition-all duration-300"
  value={searchTerm}
  onChange={handleInputChange}
  onFocus={() => setShowSuggestions(true)}
  onKeyDown={handleKeyDown}
/>
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cinema-gold hover:text-yellow-300 cursor-pointer"
          >
            {isLoading ? <Loader className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
          </button>
        </div>
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-md mt-1 overflow-hidden shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              className={`p-3 hover:bg-gray-700 cursor-pointer text-cinema-text ${
                index === selectedIndex ? 'bg-gray-700' : ''
              }`}
              onMouseDown={(e) => handleSuggestionClick(e, suggestion)}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-4">
                  {suggestion.poster_path || suggestion.profile_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w92${suggestion.poster_path || suggestion.profile_path}`}
                      alt={suggestion.title}
                      width={45}
                      height={68}
                      className="rounded object-cover w-12 h-18 sm:w-16 sm:h-24"
                    />
                  ) : suggestion.media_type === 'movie' ? (
                    <Film className="w-12 h-18 sm:w-16 sm:h-24 text-cinema-gold" />
                  ) : suggestion.media_type === 'tv' ? (
                    <Tv className="w-12 h-18 sm:w-16 sm:h-24 text-cinema-gold" />
                  ) : (
                    <User className="w-12 h-18 sm:w-16 sm:h-24 text-cinema-gold" />
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="font-semibold text-sm sm:text-base truncate">
                    {highlightMatch(suggestion.title, searchTerm)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400 truncate">
                    {suggestion.media_type === 'movie' ? (
                      <>
                        Movie • {suggestion.year} 
                        {suggestion.vote_average && ` • ${suggestion.vote_average.toFixed(1)}⭐`}
                      </>
                    ) : suggestion.media_type === 'tv' ? (
                      <>
                        TV Show • {suggestion.year}
                        {suggestion.vote_average && ` • ${suggestion.vote_average.toFixed(1)}⭐`}
                      </>
                    ) : (
                      suggestion.character ? `Known for: ${suggestion.character}` : 'Actor/Actress'
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;