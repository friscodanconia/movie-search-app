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

interface FilmArchiveSectionProps {
  title: string;
  endpoint: string;
  mediaType?: 'movie' | 'tv';
  featuredCount?: number; // Number of featured (larger) items
}

export default function FilmArchiveSection({ 
  title, 
  endpoint, 
  mediaType,
  featuredCount = 2 
}: FilmArchiveSectionProps) {
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
          .slice(0, 12);
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

  const sectionId = `section-${title.replace(/\s+/g, '-').toLowerCase()}`;

  if (isLoading) {
    return (
      <section className="mb-16" aria-label={`${title} section`} aria-busy="true">
        <div className="h-8 bg-cinema-surface rounded w-64 mb-8 animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-cinema-surface rounded animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  const featuredItems = items.slice(0, featuredCount);
  const regularItems = items.slice(featuredCount);

  return (
    <motion.section
      className="mb-16"
      aria-labelledby={sectionId}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Film Strip Divider */}
      <div className="relative mb-8">
        <div className="h-px bg-cinema-border"></div>
        <div className="absolute left-0 top-0 h-px w-24 bg-cinema-accent"></div>
        {/* Perforation dots */}
        <div className="absolute left-24 top-1/2 -translate-y-1/2 flex gap-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-cinema-border"></div>
          ))}
        </div>
      </div>

      {/* Section Title - Program Style */}
      <h2
        id={sectionId}
        className="text-2xl md:text-3xl font-display font-medium text-cinema-accent mb-8 tracking-tight uppercase"
      >
        {title}
      </h2>

      {/* Asymmetric Poster Wall */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 auto-rows-max">
        {/* Featured Items - Larger */}
        {featuredItems.map((item, index) => (
          <motion.article
            key={item.id}
            className={`${index === 0 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-2 md:row-span-1'} cursor-pointer group`}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            onClick={() => handleItemClick(item)}
            whileHover={{ y: -4 }}
          >
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-cinema-surface border border-cinema-border/50 group-hover:border-cinema-accent transition-all">
              <OptimizedImage
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name || 'Content'}
                width={500}
                height={750}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                sizes={index === 0 ? '(max-width: 768px) 50vw, 33vw' : '(max-width: 768px) 50vw, 25vw'}
              />
              {/* Rating Badge */}
              <div className="absolute top-3 right-3 bg-cinema-dark/90 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1 border border-cinema-border">
                <Star size={12} className="fill-cinema-accent text-cinema-accent" />
                <span className="text-cinema-text text-xs font-mono font-semibold">
                  {item.vote_average.toFixed(1)}
                </span>
              </div>
              {/* Watchlist Button */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
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
            {/* Title - Only for featured */}
            {index === 0 && (
              <h3 className="mt-3 text-lg font-display text-cinema-text group-hover:text-cinema-accent transition-colors line-clamp-2">
                {item.title || item.name}
              </h3>
            )}
          </motion.article>
        ))}

        {/* Regular Items - Standard Size */}
        {regularItems.map((item, index) => (
          <motion.article
            key={item.id}
            className="cursor-pointer group"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: (featuredCount + index) * 0.05, duration: 0.4 }}
            onClick={() => handleItemClick(item)}
            whileHover={{ y: -2 }}
          >
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-cinema-surface border border-cinema-border/50 group-hover:border-cinema-accent transition-all">
              <OptimizedImage
                src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                alt={item.title || item.name || 'Content'}
                width={342}
                height={513}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 16vw"
              />
              {/* Rating Badge */}
              <div className="absolute top-2 right-2 bg-cinema-dark/90 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1 border border-cinema-border">
                <Star size={10} className="fill-cinema-accent text-cinema-accent" />
                <span className="text-cinema-text text-xs font-mono font-semibold">
                  {item.vote_average.toFixed(1)}
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}

