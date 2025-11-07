'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Collection } from '@/lib/collections';

interface CollectionCardProps {
  collection: Collection;
}

interface MoviePoster {
  id: number;
  poster_path: string | null;
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  const router = useRouter();
  const [posters, setPosters] = useState<MoviePoster[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        // Fetch first 4 movies for preview
        const posterPromises = collection.movieIds.slice(0, 4).map(async (id) => {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          );
          const data = await response.json();
          return { id: data.id, poster_path: data.poster_path };
        });
        const fetchedPosters = await Promise.all(posterPromises);
        setPosters(fetchedPosters);
      } catch (error) {
        console.error('Error fetching collection posters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosters();
  }, [collection.movieIds]);

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer group animate-pulse">
        <div className="aspect-[16/9] bg-gray-700"></div>
        <div className="p-4">
          <div className="h-6 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => router.push(`/collections/${collection.id}`)}
      className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer group hover:ring-2 hover:ring-cinema-gold transition-all transform hover:scale-105 duration-300"
    >
      {/* Poster Grid Preview */}
      <div className="relative aspect-[16/9] bg-gray-900 overflow-hidden">
        <div className="grid grid-cols-2 grid-rows-2 h-full gap-1 p-2">
          {posters.map((poster, index) => (
            <div
              key={poster.id}
              className="relative bg-gray-800 rounded overflow-hidden"
            >
              {poster.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w342${poster.poster_path}`}
                  alt={`Movie ${index + 1}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                  <span className="text-gray-500 text-2xl">🎬</span>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Overlay with icon */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-start p-4">
          <span className="text-5xl drop-shadow-lg">{collection.icon}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-cinema-gold mb-1 group-hover:text-yellow-300 transition-colors">
          {collection.title}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2 mb-2">
          {collection.description}
        </p>
        <p className="text-xs text-cinema-text">
          {collection.movieIds.length} movies
        </p>
      </div>
    </div>
  );
}
