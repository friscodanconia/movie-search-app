'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
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
        // Filter out items without posters and with zero ratings
        const filteredResults = data.results
          .filter((item: ContentItem) => item.poster_path && item.vote_average > 0)
          .slice(0, 10);
        setItems(filteredResults);
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

  const handleKeyDown = (event: React.KeyboardEvent, item: ContentItem) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleItemClick(item);
    }
  };

  const sectionId = `section-${title.replace(/\s+/g, '-').toLowerCase()}`;

  if (isLoading) {
    return (
      <section className="mb-12" aria-label={`${title} section`} aria-busy="true">
        <h2 id={`section-${title.replace(/\s+/g, '-').toLowerCase()}`} className="text-3xl font-bold text-cinema-gold mb-6">{title}</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48">
              <div className="relative aspect-[2/3] mb-2 rounded-lg overflow-hidden bg-gray-800">
                <div className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] animate-shimmer"></div>
              </div>
              <div className="h-4 bg-gray-800 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-800 rounded w-1/2 animate-pulse"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12" aria-labelledby={sectionId}>
      <h2 id={sectionId} className="text-3xl font-bold text-cinema-gold mb-6">{title}</h2>
      <div
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        role="list"
        aria-label={`${title} carousel`}
      >
        {items.map((item, index) => (
          <article
            key={item.id}
            role="listitem"
            tabIndex={0}
            onClick={() => handleItemClick(item)}
            onKeyDown={(e) => handleKeyDown(e, item)}
            className="flex-shrink-0 w-48 cursor-pointer group active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-cinema-gold focus:ring-offset-2 focus:ring-offset-cinema-dark rounded-lg"
            aria-label={`${item.title || item.name}, rated ${item.vote_average.toFixed(1)} out of 10`}
          >
            <div className="relative mb-2 rounded-lg overflow-hidden bg-gray-800 transition-all hover:ring-2 hover:ring-cinema-gold">
              {item.poster_path ? (
                <OptimizedImage
                  src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                  alt={item.title || item.name || 'Content'}
                  width={342}
                  height={513}
                  className="w-full h-auto"
                  priority={index < 3}
                  sizes="(max-width: 768px) 50vw, 25vw"
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
              {/* Watchlist Button - Shows on hover (desktop only) */}
              <div className="absolute bottom-2 right-2 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none md:pointer-events-auto">
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
          </article>
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
