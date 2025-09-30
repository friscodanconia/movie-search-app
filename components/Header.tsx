'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Film } from 'lucide-react';

export default function Header() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-cinema-dark bg-opacity-95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <Film className="w-8 h-8 text-cinema-gold group-hover:scale-110 transition-transform" />
          <h1 className="text-2xl font-bold text-cinema-gold group-hover:text-yellow-300 transition-colors">
            CineMagic
          </h1>
        </div>
        
        <nav className="flex items-center gap-6">
          <a 
            href="https://www.themoviedb.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-cinema-text hover:text-cinema-gold transition-colors text-sm font-medium"
          >
            Powered by TMDb
          </a>
        </nav>
      </div>
    </header>
  );
}
