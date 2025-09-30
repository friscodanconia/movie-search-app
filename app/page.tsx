import MovieSearch from '../components/MovieSearch';
import HeroCarousel from '../components/HeroCarousel';
import ContentSection from '../components/ContentSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-cinema-dark">
      {/* Hero Carousel */}
      <HeroCarousel />
      
      {/* Search Section - Integrated */}
      <div className="bg-gradient-to-b from-cinema-dark via-gray-900 to-cinema-dark py-8">
        <MovieSearch />
      </div>
      
      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ContentSection 
          title="Trending Movies" 
          endpoint="/trending/movie/week"
        />
        
        <ContentSection 
          title="Top Rated Movies" 
          endpoint="/movie/top_rated"
          mediaType="movie"
        />
        
        <ContentSection 
          title="Trending TV Shows" 
          endpoint="/trending/tv/week"
        />
        
        <ContentSection 
          title="Top Rated TV Shows" 
          endpoint="/tv/top_rated"
          mediaType="tv"
        />
      </div>
    </main>
  );
}