'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Film, Library, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import InstantSearch from './InstantSearch';

export default function Header() {
  const router = useRouter();

  return (
    <>
      {/* Skip Navigation Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-cinema-accent focus:text-cinema-dark focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold focus:font-mono"
      >
        Skip to main content
      </a>

      <header 
        className="sticky top-0 z-50 bg-cinema-dark/95 backdrop-blur-md border-b border-cinema-border shadow-lg" 
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo - Cinematic Style */}
            <motion.button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 cursor-pointer group flex-shrink-0 bg-transparent border-none p-0"
              aria-label="CineMagic home"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Film className="w-7 h-7 sm:w-8 sm:h-8 text-cinema-accent group-hover:text-cinema-accent-dim transition-colors" aria-hidden="true" />
              <h1 className="text-xl sm:text-2xl font-display font-medium text-cinema-accent group-hover:text-cinema-accent-dim transition-colors tracking-tight hidden sm:block">
                CineMagic
              </h1>
            </motion.button>

            {/* Instant Search - Desktop Only */}
            <div className="hidden md:block flex-1 max-w-2xl mx-4">
              <InstantSearch />
            </div>

            {/* Navigation - Cinema Style */}
            <nav className="flex items-center gap-3 sm:gap-6 flex-shrink-0" aria-label="Main navigation">
              {/* Mobile Search Icon */}
              <div className="md:hidden">
                <InstantSearch />
              </div>

              <motion.button
                onClick={() => router.push('/discover')}
                className="flex items-center gap-1.5 sm:gap-2 text-cinema-text hover:text-cinema-accent transition-colors text-xs sm:text-sm font-sans font-medium focus:outline-none focus:ring-2 focus:ring-cinema-accent focus:ring-offset-2 focus:ring-offset-cinema-dark rounded"
                aria-label="Discover movies and shows"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-5 h-5 sm:w-5 sm:h-5" aria-hidden="true" />
                <span className="hidden sm:inline">Discover</span>
                <span className="sr-only sm:hidden">Discover</span>
              </motion.button>

              <motion.button
                onClick={() => router.push('/collections')}
                className="flex items-center gap-1.5 sm:gap-2 text-cinema-text hover:text-cinema-accent transition-colors text-xs sm:text-sm font-sans font-medium focus:outline-none focus:ring-2 focus:ring-cinema-accent focus:ring-offset-2 focus:ring-offset-cinema-dark rounded"
                aria-label="Browse collections"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Library className="w-5 h-5 sm:w-5 sm:h-5" aria-hidden="true" />
                <span className="hidden sm:inline">Collections</span>
                <span className="sr-only sm:hidden">Collections</span>
              </motion.button>

              <a
                href="https://www.themoviedb.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cinema-text-dim hover:text-cinema-accent transition-colors text-xs sm:text-sm font-mono font-medium hidden lg:block"
              >
                <span className="hidden xl:inline">Powered by </span>TMDb
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Screen reader only styles */}
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
