'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star } from 'lucide-react';
import WatchlistButton from './WatchlistButton';

interface ContentItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  vote_average: number;
  media_type?: string;
}

interface ContentSectionProps {
  title: string;
  endpoint: string;
  mediaType?: 'movie' | 'tv';
}

export default function ContentSection({ title, endpoint, mediaType }: ContentSectionProps) {
  const router = useRouter();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Check if endpoint already has query parameters
        const separator = endpoint.includes('?') ? '&' : '?';
        const response = await fetch(
          `https://api.themoviedb.org/3${endpoint}${separator}api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        const data = await response.json();
        setItems(data.results.slice(0, 10));
      } catch (error) {
        console.error(`Error fetching ${title}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [endpoint, title]);

  const handleItemClick = (item: ContentItem) => {
    const type = mediaType || item.media_type || 'movie';
    router.push(`/${type}/${item.id}`);
  };

  if (isLoading) {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-cinema-gold mb-6">{title}</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48 h-72 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-cinema-gold mb-6">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item)}
            className="flex-shrink-0 w-48 cursor-pointer group"
          >
            <div className="relative mb-2 rounded-lg overflow-hidden bg-gray-800 group-hover:ring-2 group-hover:ring-cinema-gold transition-all">
              {item.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                  alt={item.title || item.name || 'Content'}
                  width={342}
                  height={513}
                  className="w-full h-auto"
                />
              ) : (
                <div className="w-full aspect-[2/3] flex items-center justify-center bg-gray-700">
                  <span className="text-gray-500 text-4xl">🎬</span>
                </div>
              )}
              {/* Rating Badge */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded flex items-center gap-1">
                <Star size={14} className="fill-cinema-gold text-cinema-gold" />
                <span className="text-white text-sm font-semibold">
                  {item.vote_average.toFixed(1)}
                </span>
              </div>
              {/* Watchlist Button - Shows on hover */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <WatchlistButton
                  item={{
                    id: item.id,
                    title: item.title || item.name || '',
                    poster_path: item.poster_path,
                    vote_average: item.vote_average,
                    media_type: (mediaType || item.media_type || 'movie') as 'movie' | 'tv',
                  }}
                  size="sm"
                />
              </div>
            </div>
            <p className="text-cinema-text text-sm font-medium line-clamp-2">
              {item.title || item.name}
            </p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
