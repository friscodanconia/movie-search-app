'use client';

import { useState } from 'react';
import MovieSearch from '../components/MovieSearch';
import HeroCarousel from '../components/HeroCarousel';
import ContentSection from '../components/ContentSection';

export default function Home() {
  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
    <main id="main-content" className="min-h-screen bg-cinema-dark" role="main">
      {/* Hero Carousel - Hidden when searching */}
      {!isSearchActive && <HeroCarousel />}

      {/* Search Section - Always visible */}
      <div className="bg-gradient-to-b from-cinema-dark via-gray-900 to-cinema-dark py-8">
        <MovieSearch onSearchStateChange={setIsSearchActive} />
      </div>

      {/* Content Sections - Hidden when searching */}
      {!isSearchActive && (
        <div className="max-w-7xl mx-auto px-4 py-8">
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
        </div>
      )}
    </main>
  );
}
