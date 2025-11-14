import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { movieApi, tvApi, personApi, searchApi, discoverApi, trendingApi } from '@/lib/api/tmdb';
import type {
  Movie,
  TVShow,
  Person,
  PaginatedResponse,
  MovieListItem,
  TVShowListItem,
  PersonListItem,
  SearchResult,
} from '@/lib/types';

/**
 * Query keys for React Query caching
 * Organized by entity type for easy cache invalidation
 */
export const queryKeys = {
  movie: {
    all: ['movies'] as const,
    detail: (id: number) => [...queryKeys.movie.all, 'detail', id] as const,
    similar: (id: number) => [...queryKeys.movie.all, 'similar', id] as const,
    popular: (page: number) => [...queryKeys.movie.all, 'popular', page] as const,
    topRated: (page: number) => [...queryKeys.movie.all, 'topRated', page] as const,
    upcoming: (page: number) => [...queryKeys.movie.all, 'upcoming', page] as const,
    nowPlaying: (page: number) => [...queryKeys.movie.all, 'nowPlaying', page] as const,
  },
  tv: {
    all: ['tv'] as const,
    detail: (id: number) => [...queryKeys.tv.all, 'detail', id] as const,
    similar: (id: number) => [...queryKeys.tv.all, 'similar', id] as const,
    popular: (page: number) => [...queryKeys.tv.all, 'popular', page] as const,
    topRated: (page: number) => [...queryKeys.tv.all, 'topRated', page] as const,
  },
  person: {
    all: ['people'] as const,
    detail: (id: number) => [...queryKeys.person.all, 'detail', id] as const,
    popular: (page: number) => [...queryKeys.person.all, 'popular', page] as const,
  },
  search: {
    all: ['search'] as const,
    multi: (query: string, page: number) => [...queryKeys.search.all, 'multi', query, page] as const,
    movies: (query: string, page: number) => [...queryKeys.search.all, 'movies', query, page] as const,
    tv: (query: string, page: number) => [...queryKeys.search.all, 'tv', query, page] as const,
    people: (query: string, page: number) => [...queryKeys.search.all, 'people', query, page] as const,
  },
  discover: {
    all: ['discover'] as const,
    movies: (params: string) => [...queryKeys.discover.all, 'movies', params] as const,
    tv: (params: string) => [...queryKeys.discover.all, 'tv', params] as const,
  },
  trending: {
    all: ['trending'] as const,
    movies: (timeWindow: 'day' | 'week', page: number) =>
      [...queryKeys.trending.all, 'movies', timeWindow, page] as const,
    tv: (timeWindow: 'day' | 'week', page: number) =>
      [...queryKeys.trending.all, 'tv', timeWindow, page] as const,
    all: (timeWindow: 'day' | 'week', page: number) =>
      [...queryKeys.trending.all, 'all', timeWindow, page] as const,
  },
};

/**
 * Hook: Fetch movie details by ID
 */
export function useMovieDetails(movieId: number, options?: UseQueryOptions<Movie>) {
  return useQuery<Movie>({
    queryKey: queryKeys.movie.detail(movieId),
    queryFn: () => movieApi.getDetails(movieId),
    enabled: !!movieId,
    ...options,
  });
}

/**
 * Hook: Fetch similar movies
 */
export function useSimilarMovies(
  movieId: number,
  page = 1,
  options?: UseQueryOptions<PaginatedResponse<MovieListItem>>
) {
  return useQuery<PaginatedResponse<MovieListItem>>({
    queryKey: queryKeys.movie.similar(movieId),
    queryFn: () => movieApi.getSimilar(movieId, page),
    enabled: !!movieId,
    ...options,
  });
}

/**
 * Hook: Fetch TV show details by ID
 */
export function useTVShowDetails(tvId: number, options?: UseQueryOptions<TVShow>) {
  return useQuery<TVShow>({
    queryKey: queryKeys.tv.detail(tvId),
    queryFn: () => tvApi.getDetails(tvId),
    enabled: !!tvId,
    ...options,
  });
}

/**
 * Hook: Fetch similar TV shows
 */
export function useSimilarTVShows(
  tvId: number,
  page = 1,
  options?: UseQueryOptions<PaginatedResponse<TVShowListItem>>
) {
  return useQuery<PaginatedResponse<TVShowListItem>>({
    queryKey: queryKeys.tv.similar(tvId),
    queryFn: () => tvApi.getSimilar(tvId, page),
    enabled: !!tvId,
    ...options,
  });
}

/**
 * Hook: Fetch person details by ID
 */
export function usePersonDetails(personId: number, options?: UseQueryOptions<Person>) {
  return useQuery<Person>({
    queryKey: queryKeys.person.detail(personId),
    queryFn: () => personApi.getDetails(personId),
    enabled: !!personId,
    ...options,
  });
}

/**
 * Hook: Fetch popular movies
 */
export function usePopularMovies(
  page = 1,
  options?: UseQueryOptions<PaginatedResponse<MovieListItem>>
) {
  return useQuery<PaginatedResponse<MovieListItem>>({
    queryKey: queryKeys.movie.popular(page),
    queryFn: () => movieApi.getPopular(page),
    ...options,
  });
}

/**
 * Hook: Fetch top rated movies
 */
export function useTopRatedMovies(
  page = 1,
  options?: UseQueryOptions<PaginatedResponse<MovieListItem>>
) {
  return useQuery<PaginatedResponse<MovieListItem>>({
    queryKey: queryKeys.movie.topRated(page),
    queryFn: () => movieApi.getTopRated(page),
    ...options,
  });
}

/**
 * Hook: Multi-search (movies, TV shows, people)
 */
export function useMultiSearch(
  query: string,
  page = 1,
  options?: UseQueryOptions<PaginatedResponse<SearchResult>>
) {
  return useQuery<PaginatedResponse<SearchResult>>({
    queryKey: queryKeys.search.multi(query, page),
    queryFn: () => searchApi.multi(query, page),
    enabled: !!query && query.trim().length > 0,
    ...options,
  });
}

/**
 * Hook: Search movies
 */
export function useSearchMovies(
  query: string,
  page = 1,
  options?: UseQueryOptions<PaginatedResponse<MovieListItem>>
) {
  return useQuery<PaginatedResponse<MovieListItem>>({
    queryKey: queryKeys.search.movies(query, page),
    queryFn: () => searchApi.movies(query, page),
    enabled: !!query && query.trim().length > 0,
    ...options,
  });
}

/**
 * Hook: Trending movies
 */
export function useTrendingMovies(
  timeWindow: 'day' | 'week' = 'week',
  page = 1,
  options?: UseQueryOptions<PaginatedResponse<MovieListItem>>
) {
  return useQuery<PaginatedResponse<MovieListItem>>({
    queryKey: queryKeys.trending.movies(timeWindow, page),
    queryFn: () => trendingApi.getMovies(timeWindow, page),
    ...options,
  });
}

/**
 * Hook: Trending TV shows
 */
export function useTrendingTV(
  timeWindow: 'day' | 'week' = 'week',
  page = 1,
  options?: UseQueryOptions<PaginatedResponse<TVShowListItem>>
) {
  return useQuery<PaginatedResponse<TVShowListItem>>({
    queryKey: queryKeys.trending.tv(timeWindow, page),
    queryFn: () => trendingApi.getTV(timeWindow, page),
    ...options,
  });
}

/**
 * Hook: Discover movies with filters
 */
export function useDiscoverMovies(
  params: Record<string, any> = {},
  page = 1,
  options?: UseQueryOptions<PaginatedResponse<MovieListItem>>
) {
  const paramsKey = JSON.stringify({ ...params, page });

  return useQuery<PaginatedResponse<MovieListItem>>({
    queryKey: queryKeys.discover.movies(paramsKey),
    queryFn: () => discoverApi.discoverMovies({ ...params, page }),
    ...options,
  });
}

/**
 * Hook: Discover TV shows with filters
 */
export function useDiscoverTV(
  params: Record<string, any> = {},
  page = 1,
  options?: UseQueryOptions<PaginatedResponse<TVShowListItem>>
) {
  const paramsKey = JSON.stringify({ ...params, page });

  return useQuery<PaginatedResponse<TVShowListItem>>({
    queryKey: queryKeys.discover.tv(paramsKey),
    queryFn: () => discoverApi.discoverTV({ ...params, page }),
    ...options,
  });
}
