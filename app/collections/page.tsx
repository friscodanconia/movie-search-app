'use client';

import React from 'react';
import { CURATED_COLLECTIONS } from '@/lib/collections';
import CollectionCard from '@/components/CollectionCard';
import { Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CollectionsPage() {
  const router = useRouter();

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

        {/* Watchlist Card */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-cinema-gold mb-4">
            Your Watchlist
          </h2>
          <div
            onClick={() => router.push('/collections/watchlist')}
            className="bg-gradient-to-r from-cinema-gold/20 to-yellow-600/20 border-2 border-cinema-gold rounded-lg p-6 md:p-8 cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-center gap-4">
              <span className="text-5xl md:text-6xl">❤️</span>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-cinema-gold mb-2">
                  My Watchlist
                </h3>
                <p className="text-cinema-text">
                  Save your favorite movies and shows to watch later
                </p>
              </div>
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
