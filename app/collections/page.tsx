'use client';

import React from 'react';
import { CURATED_COLLECTIONS } from '@/lib/collections';
import CollectionCard from '@/components/CollectionCard';
import { Bookmark, Heart, Film, Tv, ChevronRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWatchlistStore } from '@/lib/store/useWatchlistStore';

export default function CollectionsPage() {
  const router = useRouter();
  const { items: watchlistItems, getItemCount } = useWatchlistStore();
  const watchlistCount = getItemCount();

  // Get counts for movies vs TV shows
  const movieCount = watchlistItems.filter(item => item.media_type === 'movie').length;
  const tvCount = watchlistItems.filter(item => item.media_type === 'tv').length;

  return (
    <main className="min-h-screen bg-cinema-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-cinema-gold mb-3 flex items-center gap-3">
            <Bookmark className="w-8 h-8 md:w-10 md:h-10" />
            Collections
          </h1>
          <p className="text-cinema-text text-lg md:text-xl">
            Curated lists of must-watch movies, organized by theme
          </p>
        </div>

        {/* Watchlist Card - Enhanced Design */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-cinema-gold flex items-center gap-2">
              <Heart className="w-6 h-6 md:w-7 md:h-7 fill-cinema-gold" />
              Your Watchlist
            </h2>
            {watchlistCount > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Sparkles size={16} className="text-cinema-gold" />
                <span>{watchlistCount} {watchlistCount === 1 ? 'item' : 'items'} saved</span>
              </div>
            )}
          </div>

          <div
            onClick={() => router.push('/collections/watchlist')}
            className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-cinema-gold/20"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cinema-gold/30 via-yellow-600/20 to-orange-600/30 group-hover:from-cinema-gold/40 group-hover:via-yellow-600/30 group-hover:to-orange-600/40 transition-all duration-300"></div>

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }}></div>

            {/* Border glow effect */}
            <div className="absolute inset-0 rounded-2xl ring-2 ring-cinema-gold/50 group-hover:ring-cinema-gold transition-all duration-300"></div>

            <div className="relative p-6 md:p-8">
              {/* Top Section */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  {/* Animated heart icon */}
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-8 h-8 md:w-10 md:h-10 text-white fill-white" />
                  </div>

                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 flex items-center gap-2">
                      My Watchlist
                      <ChevronRight className="w-6 h-6 text-cinema-gold group-hover:translate-x-1 transition-transform" />
                    </h3>
                    <p className="text-gray-200 text-sm md:text-base">
                      {watchlistCount === 0
                        ? 'Start building your personal collection'
                        : 'Your saved movies and shows'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              {watchlistCount > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Film className="w-4 h-4 text-cinema-gold" />
                      <span className="text-xs text-gray-300 uppercase tracking-wide">Movies</span>
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-white">{movieCount}</p>
                  </div>

                  <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Tv className="w-4 h-4 text-cinema-gold" />
                      <span className="text-xs text-gray-300 uppercase tracking-wide">TV Shows</span>
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-white">{tvCount}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
                  <p className="text-gray-300 mb-4">
                    ✨ Browse content and click the heart icon to save items here
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push('/discover');
                    }}
                    className="inline-flex items-center gap-2 bg-cinema-gold text-cinema-dark px-6 py-2 rounded-full font-semibold hover:bg-yellow-500 transition-colors"
                  >
                    Start Exploring
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Curated Collections */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-cinema-gold mb-6">
            Curated Collections
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CURATED_COLLECTIONS.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
