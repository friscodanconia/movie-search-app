'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

export interface FilterOptions {
  yearFrom?: number;
  yearTo?: number;
  minRating?: number;
  language?: string;
}

interface AdvancedFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

const LANGUAGES = [
  { code: '', name: 'All Languages' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'pt', name: 'Portuguese' },
];

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1900;

export default function AdvancedFilters({ onFilterChange, currentFilters }: AdvancedFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(currentFilters);

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterOptions = {
      yearFrom: undefined,
      yearTo: undefined,
      minRating: undefined,
      language: undefined,
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters =
    localFilters.yearFrom ||
    localFilters.yearTo ||
    localFilters.minRating ||
    localFilters.language;

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          hasActiveFilters
            ? 'bg-cinema-gold text-cinema-dark'
            : 'bg-gray-800 text-cinema-text hover:bg-gray-700'
        }`}
      >
        <SlidersHorizontal size={18} />
        <span className="hidden sm:inline">Filters</span>
        {hasActiveFilters && (
          <span className="bg-cinema-dark text-cinema-gold rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {[localFilters.yearFrom, localFilters.yearTo, localFilters.minRating, localFilters.language].filter(Boolean).length}
          </span>
        )}
      </button>

      {/* Filters Panel */}
      {showFilters && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowFilters(false)}
          />

          {/* Filter Panel */}
          <div className="absolute top-full right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 w-80 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-cinema-gold">Advanced Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-cinema-text"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Year Range */}
              <div>
                <label className="block text-sm font-medium text-cinema-text mb-2">
                  Release Year
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min={MIN_YEAR}
                    max={CURRENT_YEAR}
                    placeholder="From"
                    value={localFilters.yearFrom || ''}
                    onChange={(e) => setLocalFilters({
                      ...localFilters,
                      yearFrom: e.target.value ? parseInt(e.target.value) : undefined
                    })}
                    className="flex-1 bg-gray-800 text-cinema-text border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-cinema-gold"
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="number"
                    min={localFilters.yearFrom || MIN_YEAR}
                    max={CURRENT_YEAR}
                    placeholder="To"
                    value={localFilters.yearTo || ''}
                    onChange={(e) => setLocalFilters({
                      ...localFilters,
                      yearTo: e.target.value ? parseInt(e.target.value) : undefined
                    })}
                    className="flex-1 bg-gray-800 text-cinema-text border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-cinema-gold"
                  />
                </div>
              </div>

              {/* Minimum Rating */}
              <div>
                <label className="block text-sm font-medium text-cinema-text mb-2">
                  Minimum Rating
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={localFilters.minRating || 0}
                    onChange={(e) => setLocalFilters({
                      ...localFilters,
                      minRating: parseFloat(e.target.value) || undefined
                    })}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cinema-gold"
                  />
                  <span className="text-cinema-gold font-semibold min-w-[3rem] text-right">
                    {localFilters.minRating ? `${localFilters.minRating}+` : 'Any'}
                  </span>
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-cinema-text mb-2">
                  Language
                </label>
                <select
                  value={localFilters.language || ''}
                  onChange={(e) => setLocalFilters({
                    ...localFilters,
                    language: e.target.value || undefined
                  })}
                  className="w-full bg-gray-800 text-cinema-text border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-cinema-gold"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleClearFilters}
                className="flex-1 px-4 py-2 bg-gray-800 text-cinema-text rounded hover:bg-gray-700 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={handleApplyFilters}
                className="flex-1 px-4 py-2 bg-cinema-gold text-cinema-dark rounded hover:bg-yellow-500 transition-colors font-semibold"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
