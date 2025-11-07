'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { addToWatchlist, removeFromWatchlist, isInWatchlist, WatchlistItem } from '@/lib/collections';

interface WatchlistButtonProps {
  item: {
    id: number;
    title: string;
    poster_path: string | null;
    vote_average: number;
    media_type: 'movie' | 'tv';
  };
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function WatchlistButton({ item, size = 'md', showLabel = false }: WatchlistButtonProps) {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setInWatchlist(isInWatchlist(item.id, item.media_type));
  }, [item.id, item.media_type]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (inWatchlist) {
      removeFromWatchlist(item.id, item.media_type);
      setInWatchlist(false);
    } else {
      const watchlistItem: WatchlistItem = {
        ...item,
        addedAt: Date.now(),
      };
      addToWatchlist(watchlistItem);
      setInWatchlist(true);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-2.5',
  };

  const iconSizes = {
    sm: 18,
    md: 20,
    lg: 24,
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClasses[size]}
        ${inWatchlist ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-800/90 hover:bg-gray-700'}
        backdrop-blur-sm rounded-full transition-all duration-300
        flex items-center justify-center gap-2
        ${isAnimating ? 'scale-125' : 'scale-100'}
        ${showLabel ? 'px-4' : ''}
      `}
      aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
      title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <Heart
        size={iconSizes[size]}
        className={`transition-all duration-300 ${
          inWatchlist ? 'fill-white text-white' : 'text-white'
        }`}
      />
      {showLabel && (
        <span className="text-white text-sm font-medium whitespace-nowrap">
          {inWatchlist ? 'In Watchlist' : 'Add to List'}
        </span>
      )}
    </button>
  );
}
