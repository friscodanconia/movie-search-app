'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Film, Library } from 'lucide-react';
import InstantSearch from './InstantSearch';

export default function Header() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-cinema-dark bg-opacity-95 backdrop-blur-sm border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div
            onClick={() => router.push('/')}
            className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
          >
            <Film className="w-7 h-7 sm:w-8 sm:h-8 text-cinema-gold group-hover:scale-110 transition-transform" />
            <h1 className="text-xl sm:text-2xl font-bold text-cinema-gold group-hover:text-yellow-300 transition-colors hidden sm:block">
              CineMagic
            </h1>
          </div>

          {/* Instant Search - Desktop Only (Mobile gets modal) */}
          <div className="hidden md:block flex-1 max-w-2xl mx-4">
            <InstantSearch />
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
            {/* Mobile Search Icon */}
            <div className="md:hidden">
              <InstantSearch />
            </div>

            <button
              onClick={() => router.push('/collections')}
              className="flex items-center gap-1.5 sm:gap-2 text-cinema-text hover:text-cinema-gold transition-colors text-xs sm:text-base font-medium"
            >
              <Library className="w-5 h-5 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Collections</span>
            </button>
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cinema-text hover:text-cinema-gold transition-colors text-xs sm:text-sm font-medium hidden lg:block"
            >
              <span className="hidden xl:inline">Powered by </span>TMDb
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
