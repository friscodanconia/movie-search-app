import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Search, Film, User, Loader } from 'lucide-react';
import debounce from 'lodash.debounce';
import Image from 'next/image';

// ... (keep the existing interfaces)

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  // ... (keep the existing state and functions)

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for a movie or person..."
            aria-label="Search for a movie or person"
            className="w-full px-4 py-3 pr-10 text-cinema-text bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-cinema-gold text-lg"
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
              onClick={() => handleSuggestionClick(suggestion)}
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
                        {suggestion.year} 
                        {suggestion.vote_average && ` • Rating: ${suggestion.vote_average.toFixed(1)}`}
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