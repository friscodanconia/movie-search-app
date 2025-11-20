'use client';

import React from 'react';

interface WatchlistBackgroundProps {
  className?: string;
  children: React.ReactNode;
}

export default function WatchlistBackground({ className = '', children }: WatchlistBackgroundProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fbbf24]/20 via-[#f59e0b]/15 to-[#ef4444]/10" />

      {/* Content wrapper */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

