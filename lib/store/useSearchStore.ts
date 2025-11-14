/**
 * Search Store (Zustand)
 * Manages search history and state
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { STORAGE_KEYS, SEARCH_CONFIG } from '../constants';

export interface RecentSearch {
  query: string;
  timestamp: number;
}

interface SearchState {
  recentSearches: RecentSearch[];

  // Actions
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  getRecentSearches: () => RecentSearch[];
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      recentSearches: [],

      addRecentSearch: (query) => {
        if (!query.trim()) return;

        const { recentSearches } = get();

        // Create new search entry
        const newSearch: RecentSearch = {
          query: query.trim(),
          timestamp: Date.now(),
        };

        // Remove duplicates (case-insensitive) and add new search at the beginning
        const updated = [
          newSearch,
          ...recentSearches.filter(
            (s) => s.query.toLowerCase() !== query.toLowerCase()
          ),
        ].slice(0, SEARCH_CONFIG.MAX_RECENT_SEARCHES);

        set({ recentSearches: updated });
      },

      clearRecentSearches: () => {
        set({ recentSearches: [] });
      },

      getRecentSearches: () => {
        return get().recentSearches;
      },
    }),
    {
      name: STORAGE_KEYS.RECENT_SEARCHES,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
