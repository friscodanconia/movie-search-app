import SwipeDiscovery from '@/components/SwipeDiscovery';

export const metadata = {
  title: 'Discover | CineMagic',
  description: 'Swipe through personalized movie and TV show recommendations'
};

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-cinema-dark py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-cinema-gold mb-3">
            Discover Your Next Favorite
          </h1>
          <p className="text-cinema-text text-lg">
            Swipe right to save, left to skip, tap for details
          </p>
        </div>

        {/* Swipe Discovery Component */}
        <SwipeDiscovery initialType="mixed" region="IN" />
      </div>
    </div>
  );
}
