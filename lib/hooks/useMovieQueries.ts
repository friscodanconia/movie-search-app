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
    all: ['movies'],
    detail: (id: number) => ['movies', 'detail', id],
    similar: (id: number) => ['movies', 'similar', id],
    popular: (page: number) => ['movies', 'popular', page],
    topRated: (page: number) => ['movies', 'topRated', page],
    upcoming: (page: number) => ['movies', 'upcoming', page],
    nowPlaying: (page: number) => ['movies', 'nowPlaying', page],
  },
  tv: {
    all: ['tv'],
    detail: (id: number) => ['tv', 'detail', id],
    similar: (id: number) => ['tv', 'similar', id],
    popular: (page: number) => ['tv', 'popular', page],
    topRated: (page: number) => ['tv', 'topRated', page],
  },
  person: {
    all: ['people'],
    detail: (id: number) => ['people', 'detail', id],
    popular: (page: number) => ['people', 'popular', page],
  },
  search: {
    all: ['search'],
    multi: (query: string, page: number) => ['search', 'multi', query, page],
    movies: (query: string, page: number) => ['search', 'movies', query, page],
    tv: (query: string, page: number) => ['search', 'tv', query, page],
    people: (query: string, page: number) => ['search', 'people', query, page],
  },
  discover: {
    all: ['discover'],
    movies: (params: string) => ['discover', 'movies', params],
    tv: (params: string) => ['discover', 'tv', params],
  },
  trending: {
    all: ['trending'],
    movies: (timeWindow: 'day' | 'week', page: number) =>
      ['trending', 'movies', timeWindow, page],
    tv: (timeWindow: 'day' | 'week', page: number) =>
      ['trending', 'tv', timeWindow, page],
    allMedia: (timeWindow: 'day' | 'week', page: number) =>
      ['trending', 'all', timeWindow, page],
  },
};

/**
 * Hook: Fetch movie details by ID
 */
export function useMovieDetails(movieId: number, options?: Omit<UseQueryOptions<Movie>, 'queryKey' | 'queryFn'>) {
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
  options?: Omit<UseQueryOptions<PaginatedResponse<MovieListItem>>, 'queryKey' | 'queryFn'>
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
export function useTVShowDetails(tvId: number, options?: Omit<UseQueryOptions<TVShow>, 'queryKey' | 'queryFn'>) {
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
  options?: Omit<UseQueryOptions<PaginatedResponse<TVShowListItem>>, 'queryKey' | 'queryFn'>
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
export function usePersonDetails(personId: number, options?: Omit<UseQueryOptions<Person>, 'queryKey' | 'queryFn'>) {
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
  options?: Omit<UseQueryOptions<PaginatedResponse<MovieListItem>>, 'queryKey' | 'queryFn'>
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
  options?: Omit<UseQueryOptions<PaginatedResponse<MovieListItem>>, 'queryKey' | 'queryFn'>
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
  options?: Omit<UseQueryOptions<PaginatedResponse<SearchResult>>, 'queryKey' | 'queryFn'>
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
  options?: Omit<UseQueryOptions<PaginatedResponse<MovieListItem>>, 'queryKey' | 'queryFn'>
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
  options?: Omit<UseQueryOptions<PaginatedResponse<MovieListItem>>, 'queryKey' | 'queryFn'>
) {
  return useQuery<PaginatedResponse<MovieListItem>>({
    queryKey: queryKeys.trending.movies(timeWindow, page),
    queryFn: () => trendingApi.getMovies(timeWindow),
    ...options,
  });
}

/**
 * Hook: Trending TV shows
 */
export function useTrendingTV(
  timeWindow: 'day' | 'week' = 'week',
  page = 1,
  options?: Omit<UseQueryOptions<PaginatedResponse<TVShowListItem>>, 'queryKey' | 'queryFn'>
) {
  return useQuery<PaginatedResponse<TVShowListItem>>({
    queryKey: queryKeys.trending.tv(timeWindow, page),
    queryFn: () => trendingApi.getTVShows(timeWindow),
    ...options,
  });
}

/**
 * Hook: Discover movies with filters
 */
export function useDiscoverMovies(
  params: Record<string, any> = {},
  page = 1,
  options?: Omit<UseQueryOptions<PaginatedResponse<MovieListItem>>, 'queryKey' | 'queryFn'>
) {
  const paramsKey = JSON.stringify({ ...params, page });

  return useQuery<PaginatedResponse<MovieListItem>>({
    queryKey: queryKeys.discover.movies(paramsKey),
    queryFn: () => discoverApi.movies({ ...params, page }),
    ...options,
  });
}

/**
 * Hook: Discover TV shows with filters
 */
export function useDiscoverTV(
  params: Record<string, any> = {},
  page = 1,
  options?: Omit<UseQueryOptions<PaginatedResponse<TVShowListItem>>, 'queryKey' | 'queryFn'>
) {
  const paramsKey = JSON.stringify({ ...params, page });

  return useQuery<PaginatedResponse<TVShowListItem>>({
    queryKey: queryKeys.discover.tv(paramsKey),
    queryFn: () => discoverApi.tvShows({ ...params, page }),
    ...options,
  });
}
