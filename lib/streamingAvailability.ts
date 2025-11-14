/**
 * Streaming Availability API integration (RapidAPI)
 * Fallback when TMDb has no India streaming data
 * Enhanced coverage for Indian OTT platforms (Hotstar, Zee5, SonyLIV, etc.)
 */

import type { WatchProvidersRegion, WatchProvider } from './types';
import { API_CONFIG } from './constants';

interface StreamingData extends WatchProvidersRegion {}

// Detailed logging helper
const log = {
  info: (message: string, data?: any) => {
    if (data) {
      console.log(`🎬 [Streaming API] ${message}`, data);
    } else {
      console.log(`🎬 [Streaming API] ${message}`);
    }
  },
  warn: (message: string, data?: any) => {
    if (data) {
      console.warn(`⚠️ [Streaming API] ${message}`, data);
    } else {
      console.warn(`⚠️ [Streaming API] ${message}`);
    }
  },
  error: (message: string, error?: any) => {
    if (error) {
      console.error(`❌ [Streaming API] ${message}`, error);
    } else {
      console.error(`❌ [Streaming API] ${message}`);
    }
  },
  success: (message: string, data?: any) => {
    if (data) {
      console.log(`✅ [Streaming API] ${message}`, data);
    } else {
      console.log(`✅ [Streaming API] ${message}`);
    }
  },
};

// Map Streaming Availability API providers to TMDb format
const providerMapping: Record<string, { id: number; logo: string }> = {
  'netflix': { id: 8, logo: '/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg' },
  'prime': { id: 119, logo: '/emthp39XA2YScoYL1p0sdbAH2WA.jpg' },
  'hotstar': { id: 377, logo: '/3TLW4vSsgzONV1ulAYe0qHJHzDi.jpg' },
  'disney': { id: 377, logo: '/3TLW4vSsgzONV1ulAYe0qHJHzDi.jpg' }, // Disney+ Hotstar
  'zee5': { id: 232, logo: '/8wxeSKTbTr59OjFMfTfOjpTZhFt.jpg' },
  'sonyliv': { id: 237, logo: '/sVBEF7q7LqjHAWSnKwDbzmr2EMY.jpg' },
  'jiocinema': { id: 220, logo: '/6uhKBfmtzFqOcLousHwZuzcrScK.jpg' },
  'youtube': { id: 192, logo: '/96PzNgP3tz0eEp1NHCvPSVODddR.jpg' },
  'apple': { id: 2, logo: '/peURlLlr8jggOwK53fJ5wdQl05y.jpg' }, // Apple TV+
};

export async function fetchStreamingAvailability(
  title: string,
  type: 'movie' | 'tv',
  country: string = 'in'
): Promise<StreamingData | null> {
  const startTime = Date.now();

  // Check if API key is available
  const apiKey = API_CONFIG.RAPIDAPI_KEY;
  if (!apiKey) {
    log.warn('RapidAPI key not configured. Skipping fallback streaming search.');
    log.info('To enable enhanced India streaming data, add NEXT_PUBLIC_RAPIDAPI_KEY to .env.local');
    log.info('See STREAMING_API_SETUP.md for setup instructions');
    return null;
  }

  log.info(`Attempting fallback search for "${title}" (${type}) in ${country.toUpperCase()}`);

  try {
    // Search for the title first
    const searchUrl = `https://streaming-availability.p.rapidapi.com/search/title?title=${encodeURIComponent(title)}&country=${country}&output_language=en&show_type=${type}`;

    log.info('Making request to Streaming Availability API...');
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
      }
    });

    const elapsed = Date.now() - startTime;

    if (!response.ok) {
      log.error(`API returned error status: ${response.status} ${response.statusText} (${elapsed}ms)`);

      // Provide helpful error messages
      if (response.status === 401) {
        log.error('Authentication failed. Check your RapidAPI key.');
      } else if (response.status === 403) {
        log.error('Access forbidden. Your API plan may not have access to this endpoint.');
      } else if (response.status === 429) {
        log.error('Rate limit exceeded. You may have used up your monthly quota.');
      }

      return null;
    }

    const data = await response.json();
    log.info(`Received response from API (${elapsed}ms)`);

    // Parse response and convert to TMDb format
    if (data.result && data.result.length > 0) {
      log.info(`Found ${data.result.length} result(s) for "${title}"`);

      const item = data.result[0];
      const streamingInfo = item.streamingInfo?.[country];

      if (!streamingInfo) {
        log.warn(`No streaming info found for ${country.toUpperCase()}`);
        return null;
      }

      const providers: StreamingData = {};
      let totalServices = 0;

      // Process streaming options
      if (streamingInfo.subscription && streamingInfo.subscription.length > 0) {
        const flatrateProviders = streamingInfo.subscription.map((service: any) => {
          const serviceName = service.service.toLowerCase();
          const mapped = providerMapping[serviceName];

          if (!mapped) {
            log.warn(`Unknown streaming service: ${service.service} - add to providerMapping`);
          }

          return {
            provider_id: mapped?.id || 0,
            provider_name: service.service,
            logo_path: mapped?.logo || '',
            display_priority: mapped ? 1 : 99,
          };
        });
        providers.flatrate = flatrateProviders;
        totalServices += flatrateProviders.length;
        log.success(`Found ${flatrateProviders.length} subscription service(s): ${flatrateProviders.map((p: WatchProvider) => p.provider_name).join(', ')}`);
      }

      // Process rental options
      if (streamingInfo.rent && streamingInfo.rent.length > 0) {
        const rentProviders = streamingInfo.rent.map((service: any) => {
          const serviceName = service.service.toLowerCase();
          const mapped = providerMapping[serviceName];

          return {
            provider_id: mapped?.id || 0,
            provider_name: service.service,
            logo_path: mapped?.logo || '',
            display_priority: mapped ? 1 : 99,
          };
        });
        providers.rent = rentProviders;
        totalServices += rentProviders.length;
        log.success(`Found ${rentProviders.length} rental service(s): ${rentProviders.map((p: WatchProvider) => p.provider_name).join(', ')}`);
      }

      // Process purchase options
      if (streamingInfo.buy && streamingInfo.buy.length > 0) {
        const buyProviders = streamingInfo.buy.map((service: any) => {
          const serviceName = service.service.toLowerCase();
          const mapped = providerMapping[serviceName];

          return {
            provider_id: mapped?.id || 0,
            provider_name: service.service,
            logo_path: mapped?.logo || '',
            display_priority: mapped ? 1 : 99,
          };
        });
        providers.buy = buyProviders;
        totalServices += buyProviders.length;
        log.success(`Found ${buyProviders.length} purchase option(s): ${buyProviders.map((p: WatchProvider) => p.provider_name).join(', ')}`);
      }

      if (totalServices > 0) {
        log.success(`Successfully retrieved ${totalServices} streaming option(s) for "${title}"`);
        return providers;
      } else {
        log.warn('No streaming options available');
        return null;
      }
    }

    log.warn('No results found in API response');
    return null;
  } catch (error) {
    const elapsed = Date.now() - startTime;
    log.error(`Request failed after ${elapsed}ms:`, error);

    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        log.error('Network error - check your internet connection');
      } else if (error.message.includes('JSON')) {
        log.error('Invalid JSON response from API');
      }
    }

    return null;
  }
}
