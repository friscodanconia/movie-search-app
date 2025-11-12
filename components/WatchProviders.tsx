'use client';

import React from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

interface WatchProvidersData {
  link?: string;
  flatrate?: Provider[]; // Streaming services
  rent?: Provider[]; // Rental services
  buy?: Provider[]; // Purchase options
}

interface WatchProvidersProps {
  providers: WatchProvidersData | null;
  country?: string;
}

export default function WatchProviders({ providers, country = 'US' }: WatchProvidersProps) {
  // Show message if no providers available
  if (!providers || (!providers.flatrate && !providers.rent && !providers.buy)) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="text-xl font-bold text-cinema-gold mb-4">Where to Watch</h3>
        <p className="text-gray-400 text-sm">
          Streaming information not available for {country} at this time. Check local streaming platforms or theaters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-cinema-gold">Where to Watch</h3>
        {providers.link && (
          <a
            href={providers.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-cinema-gold transition-colors flex items-center gap-1"
          >
            <span>More info</span>
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      <div className="space-y-4">
        {/* Streaming Services */}
        {providers.flatrate && providers.flatrate.length > 0 && (
          <div>
            <p className="text-sm text-gray-400 mb-2 font-medium">Stream</p>
            <div className="flex flex-wrap gap-3">
              {providers.flatrate.map((provider) => (
                <div
                  key={provider.provider_id}
                  className="group relative"
                  title={provider.provider_name}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-700 group-hover:border-cinema-gold transition-colors">
                    <Image
                      src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                      alt={provider.provider_name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {provider.provider_name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rental Services */}
        {providers.rent && providers.rent.length > 0 && (
          <div>
            <p className="text-sm text-gray-400 mb-2 font-medium">Rent</p>
            <div className="flex flex-wrap gap-3">
              {providers.rent.map((provider) => (
                <div
                  key={provider.provider_id}
                  className="group relative"
                  title={provider.provider_name}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-700 group-hover:border-cinema-gold transition-colors">
                    <Image
                      src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                      alt={provider.provider_name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {provider.provider_name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Purchase Options */}
        {providers.buy && providers.buy.length > 0 && (
          <div>
            <p className="text-sm text-gray-400 mb-2 font-medium">Buy</p>
            <div className="flex flex-wrap gap-3">
              {providers.buy.map((provider) => (
                <div
                  key={provider.provider_id}
                  className="group relative"
                  title={provider.provider_name}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-700 group-hover:border-cinema-gold transition-colors">
                    <Image
                      src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                      alt={provider.provider_name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {provider.provider_name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Availability for {country}. Data provided by JustWatch.
      </p>
    </div>
  );
}
