/**
 * Watchlist Store (Zustand)
 * Manages watchlist state with localStorage persistence
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WatchlistItem } from '../types';
import { STORAGE_KEYS } from '../constants';

interface WatchlistState {
  items: WatchlistItem[];

  // Actions
  addItem: (item: Omit<WatchlistItem, 'addedAt'>) => void;
  removeItem: (id: number, mediaType: 'movie' | 'tv') => void;
  isInWatchlist: (id: number, mediaType: 'movie' | 'tv') => boolean;
  clearWatchlist: () => void;
  getItemCount: () => number;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();

        // Check if item already exists
        const exists = items.some(
          (i) => i.id === item.id && i.media_type === item.media_type
        );

        if (exists) {
          console.log('Item already in watchlist');
          return;
        }

        // Add item with timestamp
        const newItem: WatchlistItem = {
          ...item,
          addedAt: Date.now(),
        };

        set({ items: [newItem, ...items] });
      },

      removeItem: (id, mediaType) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.id === id && item.media_type === mediaType)
          ),
        }));
      },

      isInWatchlist: (id, mediaType) => {
        const { items } = get();
        return items.some(
          (item) => item.id === id && item.media_type === mediaType
        );
      },

      clearWatchlist: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.length;
      },
    }),
    {
      name: STORAGE_KEYS.WATCHLIST,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
