'use client';

import React from 'react';
import Image from 'next/image';
import { useWatchlistStore } from '@/lib/store';

interface WatchlistBackgroundProps {
  className?: string;
  children: React.ReactNode;
}

export default function WatchlistBackground({ className = '', children }: WatchlistBackgroundProps) {
  const { items } = useWatchlistStore();
  
  // Get up to 6 posters for the composite
  const posters = items
    .filter(item => item.poster_path)
    .slice(0, 6)
    .map(item => ({
      url: `https://image.tmdb.org/t/p/w300${item.poster_path}`,
      id: `${item.id}-${item.media_type}`
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
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {/* Poster Grid Background */}
      {posters.length > 0 ? (
        <div className={`absolute inset-0 grid ${getGridCols()} ${getGridRows()} opacity-30`}>
          {posters.map((poster, index) => (
            <div key={poster.id} className="relative overflow-hidden">
              <Image
                src={poster.url}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
                unoptimized
              />
            </div>
          ))}
        </div>
      ) : (
        // Fallback gradient if no posters
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-gold/20 to-yellow-600/20" />
      )}

      {/* Dark overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-cinema-dark/85 via-cinema-dark/75 to-cinema-dark/65" />
      
      {/* Additional overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark/60 via-transparent to-cinema-dark/40" />
      
      {/* Content wrapper - relative positioning for text */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

