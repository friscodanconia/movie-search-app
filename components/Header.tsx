'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Film, Library, Sparkles } from 'lucide-react';
import InstantSearch from './InstantSearch';

export default function Header() {
  const router = useRouter();

  return (
    <>
      {/* Skip Navigation Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-cinema-gold focus:text-cinema-dark focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 bg-cinema-dark bg-opacity-95 backdrop-blur-sm border-b border-gray-800 shadow-lg" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 cursor-pointer group flex-shrink-0 bg-transparent border-none p-0"
              aria-label="CineMagic home"
            >
              <Film className="w-7 h-7 sm:w-8 sm:h-8 text-cinema-gold group-hover:scale-110 transition-transform" aria-hidden="true" />
              <h1 className="text-xl sm:text-2xl font-bold text-cinema-gold group-hover:text-yellow-300 transition-colors hidden sm:block">
                CineMagic
              </h1>
            </button>

          {/* Instant Search - Desktop Only (Mobile gets modal) */}
          <div className="hidden md:block flex-1 max-w-2xl mx-4">
            <InstantSearch />
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-3 sm:gap-6 flex-shrink-0" aria-label="Main navigation">
            {/* Mobile Search Icon */}
            <div className="md:hidden">
              <InstantSearch />
            </div>

            <button
              onClick={() => router.push('/discover')}
              className="flex items-center gap-1.5 sm:gap-2 text-cinema-text hover:text-cinema-gold transition-colors text-xs sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-cinema-gold focus:ring-offset-2 focus:ring-offset-cinema-dark rounded"
              aria-label="Discover movies and shows"
            >
              <Sparkles className="w-5 h-5 sm:w-5 sm:h-5" aria-hidden="true" />
              <span className="hidden sm:inline">Discover</span>
              <span className="sr-only sm:hidden">Discover</span>
            </button>

            <button
              onClick={() => router.push('/collections')}
              className="flex items-center gap-1.5 sm:gap-2 text-cinema-text hover:text-cinema-gold transition-colors text-xs sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-cinema-gold focus:ring-offset-2 focus:ring-offset-cinema-dark rounded"
              aria-label="Browse collections"
            >
              <Library className="w-5 h-5 sm:w-5 sm:h-5" aria-hidden="true" />
              <span className="hidden sm:inline">Collections</span>
              <span className="sr-only sm:hidden">Collections</span>
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

      {/* Screen reader only styles are handled by Tailwind's sr-only class */}
      <style jsx global>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
        .focus\\:not-sr-only:focus {
          position: static;
          width: auto;
          height: auto;
          padding: revert;
          margin: revert;
          overflow: visible;
          clip: auto;
          white-space: normal;
        }
      `}</style>
    </>
  );
}
