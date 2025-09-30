'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  videoKey: string | null;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ videoKey, onClose }) => {
  useEffect(() => {
    if (videoKey) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [videoKey]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (videoKey) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [videoKey, onClose]);

  if (!videoKey) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-cinema-gold transition-colors"
          aria-label="Close video"
        >
          <X size={32} />
        </button>
        <iframe
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
          title="Movie Trailer"
          width="100%"
          height="100%"
          className="rounded-lg"
          allowFullScreen
          allow="autoplay; encrypted-media"
        />
      </div>
    </div>
  );
};

export default VideoModal;
