'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MovieSearch from '../components/MovieSearch';
import HeroCarousel from '../components/HeroCarousel';
import ContentSection from '../components/ContentSection';

export default function Home() {
  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
    <main id="main-content" className="min-h-screen bg-cinema-dark" role="main">
      {/* Hero Carousel - Hidden when searching */}
      <AnimatePresence mode="wait">
        {!isSearchActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroCarousel />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Section - Always visible */}
      <motion.div 
        className="bg-gradient-to-b from-cinema-dark via-cinema-surface to-cinema-dark py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <MovieSearch onSearchStateChange={setIsSearchActive} />
      </motion.div>

      {/* Content Sections - Hidden when searching */}
      <AnimatePresence>
        {!isSearchActive && (
          <motion.div 
            className="max-w-7xl mx-auto px-4 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <ContentSection
              title="Trending in India"
              endpoint="/trending/movie/week?region=IN"
            />

            <ContentSection
              title="Popular Hindi Movies"
              endpoint="/discover/movie?with_original_language=hi&sort_by=popularity.desc&vote_count.gte=50&vote_average.gte=6&region=IN"
              mediaType="movie"
            />

            <ContentSection
              title="Popular Tamil Movies"
              endpoint="/discover/movie?with_original_language=ta&sort_by=popularity.desc&vote_count.gte=50&vote_average.gte=6&region=IN"
              mediaType="movie"
            />

            <ContentSection
              title="Popular Telugu Movies"
              endpoint="/discover/movie?with_original_language=te&sort_by=popularity.desc&vote_count.gte=50&vote_average.gte=6&region=IN"
              mediaType="movie"
            />

            <ContentSection
              title="Action Movies"
              endpoint="/discover/movie?with_genres=28&sort_by=popularity.desc&vote_count.gte=100&region=IN"
              mediaType="movie"
            />

            <ContentSection
              title="Top Rated Movies"
              endpoint="/movie/top_rated?region=IN"
              mediaType="movie"
            />

            <ContentSection
              title="Trending TV Shows"
              endpoint="/trending/tv/week?region=IN"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
