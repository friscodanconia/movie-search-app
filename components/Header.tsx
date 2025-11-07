'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Film, Bookmark } from 'lucide-react';

export default function Header() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-cinema-dark bg-opacity-95 backdrop-blur-sm border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div
          onClick={() => router.push('/')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <Film className="w-7 h-7 sm:w-8 sm:h-8 text-cinema-gold group-hover:scale-110 transition-transform" />
          <h1 className="text-xl sm:text-2xl font-bold text-cinema-gold group-hover:text-yellow-300 transition-colors">
            CineMagic
          </h1>
        </div>

        <nav className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={() => router.push('/collections')}
            className="flex items-center gap-1.5 sm:gap-2 text-cinema-text hover:text-cinema-gold transition-colors text-sm sm:text-base font-medium"
          >
            <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Collections</span>
          </button>
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cinema-text hover:text-cinema-gold transition-colors text-xs sm:text-sm font-medium hidden md:block"
          >
            <span className="hidden sm:inline">Powered by </span>TMDb
          </a>
        </nav>
      </div>
    </header>
  );
}
