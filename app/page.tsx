'use client';

import { motion } from 'framer-motion';
import FeaturedFilm from '../components/FeaturedFilm';
import FilmArchiveSection from '../components/FilmArchiveSection';

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen bg-cinema-dark" role="main">
      {/* Featured Film - Editorial Treatment */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <FeaturedFilm />
      </motion.div>

      {/* Film Archive Sections - Curated Collections */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {/* Opening Title - Film Festival Program Style */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-medium text-cinema-accent mb-4 tracking-tight">
            Curated Collections
          </h2>
          <p className="text-cinema-text-dim font-sans text-lg max-w-2xl mx-auto">
            A selection of films and series, curated for discovery
          </p>
        </motion.div>

        {/* Archive Sections */}
        <FilmArchiveSection
          title="Trending This Week"
          endpoint="/trending/movie/week?region=IN"
          featuredCount={2}
        />

        <FilmArchiveSection
          title="Popular Hindi Cinema"
          endpoint="/discover/movie?with_original_language=hi&sort_by=popularity.desc&vote_count.gte=50&vote_average.gte=6&region=IN"
          mediaType="movie"
          featuredCount={1}
        />

        <FilmArchiveSection
          title="Popular Tamil Cinema"
          endpoint="/discover/movie?with_original_language=ta&sort_by=popularity.desc&vote_count.gte=50&vote_average.gte=6&region=IN"
          mediaType="movie"
          featuredCount={1}
        />

        <FilmArchiveSection
          title="Popular Telugu Cinema"
          endpoint="/discover/movie?with_original_language=te&sort_by=popularity.desc&vote_count.gte=50&vote_average.gte=6&region=IN"
          mediaType="movie"
          featuredCount={1}
        />

        <FilmArchiveSection
          title="Action Cinema"
          endpoint="/discover/movie?with_genres=28&sort_by=popularity.desc&vote_count.gte=100&region=IN"
          mediaType="movie"
          featuredCount={2}
        />

        <FilmArchiveSection
          title="Critically Acclaimed"
          endpoint="/movie/top_rated?region=IN"
          mediaType="movie"
          featuredCount={2}
        />

        <FilmArchiveSection
          title="Trending Television"
          endpoint="/trending/tv/week?region=IN"
          featuredCount={1}
        />
      </motion.div>
    </main>
  );
}
