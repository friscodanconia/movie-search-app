// Streaming Availability API integration (RapidAPI)
// Fallback when TMDb has no India streaming data
// Enhanced coverage for Indian OTT platforms

interface StreamingProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

interface StreamingData {
  link?: string;
  flatrate?: StreamingProvider[];
  rent?: StreamingProvider[];
  buy?: StreamingProvider[];
}

// Map Streaming Availability API providers to TMDb format
const providerMapping: Record<string, { id: number; logo: string }> = {
  'netflix': { id: 8, logo: '/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg' },
  'prime': { id: 119, logo: '/emthp39XA2YScoYL1p0sdbAH2WA.jpg' },
  'hotstar': { id: 377, logo: '/3TLW4vSsgzONV1ulAYe0qHJHzDi.jpg' },
  'zee5': { id: 232, logo: '/8wxeSKTbTr59OjFMfTfOjpTZhFt.jpg' },
  'sonyliv': { id: 237, logo: '/sVBEF7q7LqjHAWSnKwDbzmr2EMY.jpg' },
  'jiocinema': { id: 220, logo: '/6uhKBfmtzFqOcLousHwZuzcrScK.jpg' },
};

export async function fetchStreamingAvailability(
  title: string,
  type: 'movie' | 'tv',
  country: string = 'in'
): Promise<StreamingData | null> {
  // Check if API key is available
  const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
  if (!apiKey) {
    console.warn('Streaming Availability API key not configured');
    return null;
  }

  try {
    // Search for the title first
    const searchUrl = `https://streaming-availability.p.rapidapi.com/search/title?title=${encodeURIComponent(title)}&country=${country}&output_language=en&show_type=${type}`;

    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      console.warn('Streaming Availability API error:', response.status);
      return null;
    }

    const data = await response.json();

    // Parse response and convert to TMDb format
    if (data.result && data.result.length > 0) {
      const item = data.result[0];
      const streamingInfo = item.streamingInfo?.[country];

      if (!streamingInfo) {
        return null;
      }

      const providers: StreamingData = {};

      // Process streaming options
      if (streamingInfo.subscription) {
        providers.flatrate = streamingInfo.subscription.map((service: any) => {
          const mapped = providerMapping[service.service.toLowerCase()];
          return {
            provider_id: mapped?.id || 0,
            provider_name: service.service,
            logo_path: mapped?.logo || ''
          };
        });
      }

      // Process rental options
      if (streamingInfo.rent) {
        providers.rent = streamingInfo.rent.map((service: any) => {
          const mapped = providerMapping[service.service.toLowerCase()];
          return {
            provider_id: mapped?.id || 0,
            provider_name: service.service,
            logo_path: mapped?.logo || ''
          };
        });
      }

      // Process purchase options
      if (streamingInfo.buy) {
        providers.buy = streamingInfo.buy.map((service: any) => {
          const mapped = providerMapping[service.service.toLowerCase()];
          return {
            provider_id: mapped?.id || 0,
            provider_name: service.service,
            logo_path: mapped?.logo || ''
          };
        });
      }

      return providers.flatrate || providers.rent || providers.buy ? providers : null;
    }

    return null;
  } catch (error) {
    console.error('Error fetching streaming availability:', error);
    return null;
  }
}
