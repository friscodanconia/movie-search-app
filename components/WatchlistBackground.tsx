'use client';

import React from 'react';
import { useWatchlistStore } from '@/lib/store';

interface WatchlistBackgroundProps {
  className?: string;
  children: React.ReactNode;
}

export default function WatchlistBackground({ className = '', children }: WatchlistBackgroundProps) {
  const { items } = useWatchlistStore();
  
  // Default placeholder posters if watchlist is empty
  const defaultPosters = [
    'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg', // Popular movie poster
    'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', // Popular movie poster
    'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg', // Popular movie poster
    'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61eNJ22LqMfqN.jpg', // Popular movie poster
  ];

  // Get up to 6 posters for the composite, or use defaults if empty
  const userPosters = items
    .filter(item => item.poster_path)
    .slice(0, 6)
    .map(item => ({
      url: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
      id: `${item.id}-${item.media_type}`
    }));

  const posters = userPosters.length > 0 
    ? userPosters 
    : defaultPosters.map((url, index) => ({
        url,
        id: `default-${index}`
      }));

  // Determine grid layout based on number of posters
  const getGridCols = () => {
    if (posters.length === 0) return 'grid-cols-1';
    if (posters.length === 1) return 'grid-cols-1';
    if (posters.length === 2) return 'grid-cols-2';
    if (posters.length <= 4) return 'grid-cols-2';
    return 'grid-cols-3';
  };

  const getGridRows = () => {
    if (posters.length === 0) return 'grid-rows-1';
    if (posters.length <= 2) return 'grid-rows-1';
    if (posters.length <= 4) return 'grid-rows-2';
    return 'grid-rows-2';
  };

  return (
    <div className={`relative overflow-hidden rounded-lg min-h-[200px] ${className}`}>
      {/* Poster Grid Background */}
      {posters.length > 0 ? (
        <div className={`absolute inset-0 grid ${getGridCols()} ${getGridRows()} gap-0 z-0`}>
          {posters.map((poster, index) => (
            <div key={poster.id} className="relative overflow-hidden w-full h-full">
              <img
                src={poster.url}
                alt=""
                className="w-full h-full object-cover opacity-60"
                style={{ display: 'block' }}
              />
            </div>
          ))}
        </div>
      ) : (
        // Fallback gradient if no posters
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-gold/30 via-yellow-600/30 to-cinema-gold/30" />
      )}

      {/* Dark overlay gradient for text readability - lighter so posters show through */}
      <div className="absolute inset-0 bg-gradient-to-br from-cinema-dark/70 via-cinema-dark/50 to-transparent z-[1]" />

      {/* Additional overlay for better text contrast - very light */}
      <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark/40 via-transparent to-transparent z-[2]" />
      
      {/* Content wrapper - relative positioning for text */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

