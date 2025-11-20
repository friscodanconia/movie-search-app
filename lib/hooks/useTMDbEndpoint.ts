import { useQuery, UseQueryOptions } from '@tanstack/react-query';

const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

/**
 * Generic hook for fetching from any TMDb endpoint
 * Provides automatic caching, request deduplication, and background refetching
 *
 * @param endpoint - The TMDb API endpoint path (e.g., '/movie/popular')
 * @param params - Query parameters to append to the endpoint
 * @param options - React Query options
 */
export function useTMDbEndpoint<T = any>(
  endpoint: string,
  params: Record<string, any> = {},
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  const queryKey = ['tmdb', endpoint, params];

  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      const separator = endpoint.includes('?') ? '&' : '?';
      const url = `${TMDB_API_BASE_URL}${endpoint}${separator}api_key=${TMDB_API_KEY}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`TMDb API error: ${response.statusText}`);
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    ...options,
  });
}

/**
 * Hook for fetching content with automatic filtering
 * Filters out items without posters and with zero ratings
 *
 * @param endpoint - The TMDb API endpoint path
 * @param limit - Maximum number of items to return (default: 10)
 * @param options - React Query options
 */
export function useTMDbContent(
  endpoint: string,
  limit = 10,
  options?: Omit<UseQueryOptions<{ results: any[] }>, 'queryKey' | 'queryFn'>
) {
  const query = useTMDbEndpoint<{ results: any[] }>(endpoint, {}, options);

  const filteredResults = query.data?.results
    ? query.data.results
        .filter((item: any) => item.poster_path && item.vote_average > 0)
        .slice(0, limit)
    : [];

  return {
    ...query,
    data: filteredResults,
  };
}
