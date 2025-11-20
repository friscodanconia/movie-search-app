'use client';

import React from 'react';
import { CURATED_COLLECTIONS } from '@/lib/collections';
import CollectionCard from '@/components/CollectionCard';
import WatchlistBackground from '@/components/WatchlistBackground';
import { Bookmark, Trophy, Globe, Film, Clock, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CATEGORY_META = {
  prestige: { title: 'Prestige & Awards', icon: Trophy, description: 'Critically acclaimed and award-winning films' },
  regional: { title: 'Indian Cinema', icon: Globe, description: 'Masterpieces from Bollywood and regional cinema' },
  director: { title: 'Director Spotlights', icon: Film, description: 'Curated collections from legendary filmmakers' },
  genre: { title: 'Genres', icon: Sparkles, description: 'Films organized by genre and style' },
  era: { title: 'By Era', icon: Clock, description: 'Journey through cinema history decade by decade' },
  theme: { title: 'Themes & Moods', icon: Bookmark, description: 'Collections based on themes and emotional experiences' },
};

export default function CollectionsPage() {
  const router = useRouter();

  // Group collections by category
  const collectionsByCategory = CURATED_COLLECTIONS.reduce((acc, collection) => {
    const category = collection.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(collection);
    return acc;
  }, {} as Record<string, typeof CURATED_COLLECTIONS>);

  // Order of categories
  const categoryOrder = ['prestige', 'regional', 'director', 'genre', 'era', 'theme'];

  return (
    <main className="min-h-screen bg-cinema-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3 flex items-center gap-3">
            <Bookmark className="w-8 h-8 md:w-10 md:h-10 text-[#00f5ff]" />
            Collections
          </h1>
          <p className="text-cinema-text text-lg md:text-xl">
            {CURATED_COLLECTIONS.length} expertly curated collections across genres, eras, and themes
          </p>
        </div>

        {/* Watchlist Card */}
        <div className="mb-12">
          <WatchlistBackground>
            <div
              onClick={() => router.push('/collections/watchlist')}
              className="glass-strong rounded-lg p-6 md:p-8 cursor-pointer hover:scale-[1.01] hover:border-[#00f5ff] border-2 border-white/10 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <span className="text-5xl md:text-6xl drop-shadow-lg">❤️</span>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-cinema-accent mb-2">
                    My Watchlist
                  </h3>
                  <p className="text-cinema-text-dim font-medium">
                    Save your favorite movies and shows to watch later
                  </p>
                </div>
              </div>
            </div>
          </WatchlistBackground>
        </div>

        {/* Collections by Category */}
        <div className="space-y-12">
          {categoryOrder.map((categoryKey) => {
            const collections = collectionsByCategory[categoryKey];
            if (!collections || collections.length === 0) return null;

            const categoryInfo = CATEGORY_META[categoryKey as keyof typeof CATEGORY_META];
            if (!categoryInfo) return null;

            const Icon = categoryInfo.icon;

            return (
              <div key={categoryKey} className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Icon className="w-6 h-6 text-[#a855f7]" />
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      {categoryInfo.title}
                    </h2>
                    <p className="text-cinema-text-dim text-sm mt-1">
                      {categoryInfo.description}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {collections.map((collection) => (
                    <CollectionCard key={collection.id} collection={collection} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
