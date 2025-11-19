'use client';

import React, { useEffect, useState } from 'react';
import { useWatchlistStore } from '@/lib/store';

interface WatchlistBackgroundProps {
  className?: string;
  children: React.ReactNode;
}

export default function WatchlistBackground({ className = '', children }: WatchlistBackgroundProps) {
  const { items } = useWatchlistStore();
  const [backgroundStyle, setBackgroundStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    // Get up to 6 posters for the composite
    const posters = items
      .filter(item => item.poster_path)
      .slice(0, 6)
      .map(item => `https://image.tmdb.org/t/p/w300${item.poster_path}`);

    if (posters.length === 0) {
      // Fallback gradient if no posters
      setBackgroundStyle({
        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 235, 128, 0.2) 100%)',
      });
      return;
    }

    // Create CSS background with multiple images in a grid layout
    // This creates a composite effect with posters arranged in a 3x2 grid
    const imageUrls = posters.map(url => `url("${url}")`).join(', ');
    
    setBackgroundStyle({
      backgroundImage: imageUrls,
      backgroundSize: posters.length >= 4 ? '50% 50%' : '33.33% 50%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 
        posters.length === 1 ? 'center center' :
        posters.length === 2 ? 'left center, right center' :
        posters.length === 3 ? 'left top, center top, right top' :
        posters.length === 4 ? 'left top, right top, left bottom, right bottom' :
        posters.length === 5 ? 'left top, center top, right top, left bottom, center bottom' :
        'left top, center top, right top, left bottom, center bottom, right bottom',
      backgroundBlendMode: 'overlay',
    });
  }, [items]);

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={backgroundStyle}
    >
      {/* Dark overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-cinema-dark/90 via-cinema-dark/80 to-cinema-dark/70" />
      
      {/* Additional overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-transparent to-cinema-dark/50" />
      
      {/* Content wrapper - relative positioning for text */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

