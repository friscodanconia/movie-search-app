'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
        const separator = endpoint.includes('?') ? '&' : '?';
        const response = await fetch(
          `https://api.themoviedb.org/3${endpoint}${separator}api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        const data = await response.json();
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
        <h2 id={sectionId} className="text-3xl font-display font-medium text-cinema-accent mb-6 tracking-tight">{title}</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48">
              <div className="relative aspect-[2/3] mb-2 rounded-lg overflow-hidden bg-cinema-surface">
                <div className="w-full h-full bg-gradient-to-r from-cinema-surface via-cinema-surface-hover to-cinema-surface bg-[length:200%_100%] animate-shimmer"></div>
              </div>
              <div className="h-4 bg-cinema-surface rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-3 bg-cinema-surface rounded w-1/2 animate-pulse"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <motion.section 
      className="mb-12" 
      aria-labelledby={sectionId}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <h2 id={sectionId} className="text-3xl font-display font-medium text-cinema-accent mb-6 tracking-tight">
        {title}
      </h2>
      <div
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        role="list"
        aria-label={`${title} carousel`}
      >
        {items.map((item, index) => (
          <motion.article
            key={item.id}
            role="listitem"
            tabIndex={0}
            onClick={() => handleItemClick(item)}
            onKeyDown={(e) => handleKeyDown(e, item)}
            className="flex-shrink-0 w-48 cursor-pointer group"
            aria-label={`${item.title || item.name}, rated ${item.vote_average.toFixed(1)} out of 10`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative mb-2 rounded-lg overflow-hidden bg-cinema-surface transition-all group-hover:ring-2 group-hover:ring-cinema-accent group-hover:shadow-lg group-hover:shadow-cinema-accent/20">
              {item.poster_path ? (
                <OptimizedImage
                  src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                  alt={item.title || item.name || 'Content'}
                  width={342}
                  height={513}
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                  priority={index < 3}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full aspect-[2/3] flex items-center justify-center bg-cinema-surface">
                  <span className="text-cinema-text-dim text-4xl">🎬</span>
                </div>
              )}
              {/* Rating Badge - Cinema Style */}
              <div className="absolute top-2 right-2 bg-cinema-dark/90 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1 border border-cinema-border">
                <Star size={14} className="fill-cinema-accent text-cinema-accent" />
                <span className="text-cinema-text text-sm font-mono font-semibold">
                  {item.vote_average.toFixed(1)}
                </span>
              </div>
              {/* Watchlist Button */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none md:pointer-events-auto">
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
            <p className="text-cinema-text text-sm font-sans font-medium line-clamp-2 group-hover:text-cinema-accent transition-colors">
              {item.title || item.name}
            </p>
          </motion.article>
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
    </motion.section>
  );
}
