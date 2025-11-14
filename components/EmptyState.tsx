import React from 'react';
import { Search, Film, Tv } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: 'search' | 'film' | 'tv';
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * EmptyState Component
 * Used when no data is available (empty search results, no watchlist items, etc.)
 */
export default function EmptyState({
  title = 'No results found',
  message,
  icon = 'search',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const icons = {
    search: Search,
    film: Film,
    tv: Tv,
  };

  const Icon = icons[icon];

  return (
    <div className="flex items-center justify-center min-h-[400px] px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
            <Icon className="w-10 h-10 text-gray-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-cinema-gold mb-3">{title}</h2>

        {/* Message */}
        <p className="text-cinema-text mb-6 leading-relaxed">{message}</p>

        {/* Optional Action Button */}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center justify-center gap-2 bg-cinema-gold text-cinema-dark px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors focus:outline-none focus:ring-2 focus:ring-cinema-gold focus:ring-offset-2 focus:ring-offset-cinema-dark"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
