import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import debounce from 'lodash.debounce';

interface SearchSuggestion {
  id: number;
  title: string;
  media_type: string;
}

interface SearchBarProps {
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (term.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${term}&page=1`
        );
        const data = await response.json();
        const filteredSuggestions = data.results
          .filter((item: any) => item.media_type === 'movie' || item.media_type === 'person')
          .slice(0, 5)
          .map((item: any) => ({
            id: item.id,
            title: item.title || item.name,
            media_type: item.media_type,
          }));
        setSuggestions(filteredSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }, 300),
    [] // Empty dependency array
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchTerm(suggestion.title);
    onSearch(suggestion.title);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a movie or person..."
            aria-label="Search for a movie or person"
            className="w-full px-4 py-2 pr-10 text-cinema-text bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-cinema-gold"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cinema-gold hover:text-yellow-300 cursor-pointer"
          >
            <Search className="w-6 h-6" />
          </button>
        </div>
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-md mt-1">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-cinema-text"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.title} ({suggestion.media_type})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;