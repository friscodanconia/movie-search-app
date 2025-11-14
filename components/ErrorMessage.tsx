import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  showHomeButton?: boolean;
}

/**
 * ErrorMessage Component
 * Reusable error UI with retry functionality
 * Used for displaying API errors, loading failures, etc.
 */
export default function ErrorMessage({
  title = 'Something went wrong',
  message,
  onRetry,
  onGoHome,
  showHomeButton = false,
}: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] px-4">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* Error Title */}
        <h2 className="text-xl font-bold text-cinema-gold mb-3">{title}</h2>

        {/* Error Message */}
        <p className="text-cinema-text mb-6 leading-relaxed">{message}</p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center justify-center gap-2 bg-cinema-gold text-cinema-dark px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors focus:outline-none focus:ring-2 focus:ring-cinema-gold focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
          )}

          {showHomeButton && (
            <button
              onClick={onGoHome || (() => (window.location.href = '/'))}
              className="flex items-center justify-center gap-2 bg-gray-800 text-cinema-text px-6 py-3 rounded-full font-semibold hover:bg-gray-700 transition-colors border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cinema-gold focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <Home size={18} />
              Go Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
