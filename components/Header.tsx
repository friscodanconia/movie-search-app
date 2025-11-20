'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Film, Library, Sparkles, Dna, Trophy } from 'lucide-react';
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
        className="sticky top-0 z-50 glass border-b border-cinema-border shadow-lg"
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
              <div className="relative">
                <Film className="w-7 h-7 sm:w-8 sm:h-8 text-[#00f5ff] group-hover:neon-glow-cyan transition-all" aria-hidden="true" />
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-semibold gradient-text tracking-tight hidden sm:block">
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
                className="flex items-center gap-1.5 sm:gap-2 text-cinema-text hover:text-[#a855f7] transition-all text-xs sm:text-sm font-sans font-medium focus:outline-none focus:ring-2 focus:ring-[#a855f7] rounded px-3 py-2 hover:bg-white/5 ripple"
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
                className="flex items-center gap-1.5 sm:gap-2 text-cinema-text hover:text-[#ec4899] transition-all text-xs sm:text-sm font-sans font-medium focus:outline-none focus:ring-2 focus:ring-[#ec4899] rounded px-3 py-2 hover:bg-white/5 ripple"
                aria-label="Browse collections"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Library className="w-5 h-5 sm:w-5 sm:h-5" aria-hidden="true" />
                <span className="hidden sm:inline">Collections</span>
                <span className="sr-only sm:hidden">Collections</span>
              </motion.button>

              <motion.button
                onClick={() => router.push('/challenges')}
                className="flex items-center gap-1.5 sm:gap-2 text-cinema-text hover:text-[#fbbf24] transition-all text-xs sm:text-sm font-sans font-medium focus:outline-none focus:ring-2 focus:ring-[#fbbf24] rounded px-3 py-2 hover:bg-white/5 ripple"
                aria-label="Cinema challenges"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trophy className="w-5 h-5 sm:w-5 sm:h-5" aria-hidden="true" />
                <span className="hidden lg:inline">Challenges</span>
                <span className="sr-only lg:hidden">Challenges</span>
              </motion.button>

              <motion.button
                onClick={() => router.push('/dna')}
                className="flex items-center gap-1.5 sm:gap-2 text-cinema-text hover:text-[#00f5ff] transition-all text-xs sm:text-sm font-sans font-medium focus:outline-none focus:ring-2 focus:ring-[#00f5ff] rounded px-3 py-2 hover:bg-white/5 ripple"
                aria-label="Your Cinema DNA"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Dna className="w-5 h-5 sm:w-5 sm:h-5" aria-hidden="true" />
                <span className="hidden lg:inline">DNA</span>
                <span className="sr-only lg:hidden">DNA</span>
              </motion.button>
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
