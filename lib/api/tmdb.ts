/**
 * TMDb API Client
 * Centralized API calls to The Movie Database (TMDb)
 * All API methods are typed and handle errors consistently
 */

import type {
  Movie,
  MovieListItem,
  TVShow,
  TVShowListItem,
  Person,
  SearchResult,
  PaginatedResponse,
  WatchProvidersResponse,
  VideosResponse,
  CreditsResponse,
  TMDbResponse,
  isTMDbError,
} from '../types';

// =============================================================================
// Configuration
// =============================================================================

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

if (!TMDB_API_KEY) {
  console.warn('⚠️ TMDB_API_KEY is not set. API calls will fail.');
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Build URL with query parameters
 */
function buildUrl(endpoint: string, params: Record<string, any> = {}): string {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', TMDB_API_KEY || '');

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  return url.toString();
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchTMDb<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
  const url = buildUrl(endpoint, params);

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.status_message || 'TMDb API request failed');
    }

    return data as T;
  } catch (error) {
    console.error('TMDb API Error:', error);
    throw error;
  }
}

// =============================================================================
// Search API
// =============================================================================

export const searchApi = {
  /**
   * Multi-search (movies, TV shows, people)
   */
  multi: async (query: string, page: number = 1): Promise<PaginatedResponse<SearchResult>> => {
    return fetchTMDb<PaginatedResponse<SearchResult>>('/search/multi', { query, page });
  },

  /**
   * Search movies
   */
  movies: async (query: string, page: number = 1): Promise<PaginatedResponse<MovieListItem>> => {
    return fetchTMDb<PaginatedResponse<MovieListItem>>('/search/movie', { query, page });
  },

  /**
   * Search TV shows
   */
  tvShows: async (query: string, page: number = 1): Promise<PaginatedResponse<TVShowListItem>> => {
    return fetchTMDb<PaginatedResponse<TVShowListItem>>('/search/tv', { query, page });
  },

  /**
   * Search people
   */
  people: async (query: string, page: number = 1): Promise<PaginatedResponse<Person>> => {
    return fetchTMDb<PaginatedResponse<Person>>('/search/person', { query, page });
  },
};

// =============================================================================
// Movie API
// =============================================================================

export const movieApi = {
  /**
   * Get movie details
   */
  getDetails: async (
    movieId: number,
    appendToResponse?: string[]
  ): Promise<Movie> => {
    const params = appendToResponse
      ? { append_to_response: appendToResponse.join(',') }
      : {};
    return fetchTMDb<Movie>(`/movie/${movieId}`, params);
  },

  /**
   * Get popular movies
   */
  getPopular: async (page: number = 1, region?: string): Promise<PaginatedResponse<MovieListItem>> => {
    return fetchTMDb<PaginatedResponse<MovieListItem>>('/movie/popular', { page, region });
  },

  /**
   * Get top rated movies
   */
  getTopRated: async (page: number = 1, region?: string): Promise<PaginatedResponse<MovieListItem>> => {
    return fetchTMDb<PaginatedResponse<MovieListItem>>('/movie/top_rated', { page, region });
  },

  /**
   * Get now playing movies
   */
  getNowPlaying: async (page: number = 1, region?: string): Promise<PaginatedResponse<MovieListItem>> => {
    return fetchTMDb<PaginatedResponse<MovieListItem>>('/movie/now_playing', { page, region });
  },

  /**
   * Get upcoming movies
   */
  getUpcoming: async (page: number = 1, region?: string): Promise<PaginatedResponse<MovieListItem>> => {
    return fetchTMDb<PaginatedResponse<MovieListItem>>('/movie/upcoming', { page, region });
  },

  /**
   * Get similar movies
   */
  getSimilar: async (movieId: number, page: number = 1): Promise<PaginatedResponse<MovieListItem>> => {
    return fetchTMDb<PaginatedResponse<MovieListItem>>(`/movie/${movieId}/similar`, { page });
  },

  /**
   * Get movie credits (cast and crew)
   */
  getCredits: async (movieId: number): Promise<CreditsResponse> => {
    return fetchTMDb<CreditsResponse>(`/movie/${movieId}/credits`);
  },

  /**
   * Get movie videos (trailers, teasers, etc.)
   */
  getVideos: async (movieId: number): Promise<VideosResponse> => {
    return fetchTMDb<VideosResponse>(`/movie/${movieId}/videos`);
  },

  /**
   * Get watch providers
   */
  getWatchProviders: async (movieId: number): Promise<WatchProvidersResponse> => {
    return fetchTMDb<WatchProvidersResponse>(`/movie/${movieId}/watch/providers`);
  },
};

// =============================================================================
// TV Show API
// =============================================================================

export const tvApi = {
  /**
   * Get TV show details
   */
  getDetails: async (
    tvId: number,
    appendToResponse?: string[]
  ): Promise<TVShow> => {
    const params = appendToResponse
      ? { append_to_response: appendToResponse.join(',') }
      : {};
    return fetchTMDb<TVShow>(`/tv/${tvId}`, params);
  },

  /**
   * Get popular TV shows
   */
  getPopular: async (page: number = 1): Promise<PaginatedResponse<TVShowListItem>> => {
    return fetchTMDb<PaginatedResponse<TVShowListItem>>('/tv/popular', { page });
  },

  /**
   * Get top rated TV shows
   */
  getTopRated: async (page: number = 1): Promise<PaginatedResponse<TVShowListItem>> => {
    return fetchTMDb<PaginatedResponse<TVShowListItem>>('/tv/top_rated', { page });
  },

  /**
   * Get airing today TV shows
   */
  getAiringToday: async (page: number = 1): Promise<PaginatedResponse<TVShowListItem>> => {
    return fetchTMDb<PaginatedResponse<TVShowListItem>>('/tv/airing_today', { page });
  },

  /**
   * Get on the air TV shows
   */
  getOnTheAir: async (page: number = 1): Promise<PaginatedResponse<TVShowListItem>> => {
    return fetchTMDb<PaginatedResponse<TVShowListItem>>('/tv/on_the_air', { page });
  },

  /**
   * Get similar TV shows
   */
  getSimilar: async (tvId: number, page: number = 1): Promise<PaginatedResponse<TVShowListItem>> => {
    return fetchTMDb<PaginatedResponse<TVShowListItem>>(`/tv/${tvId}/similar`, { page });
  },

  /**
   * Get TV show credits
   */
  getCredits: async (tvId: number): Promise<CreditsResponse> => {
    return fetchTMDb<CreditsResponse>(`/tv/${tvId}/credits`);
  },

  /**
   * Get TV show videos
   */
  getVideos: async (tvId: number): Promise<VideosResponse> => {
    return fetchTMDb<VideosResponse>(`/tv/${tvId}/videos`);
  },

  /**
   * Get watch providers
   */
  getWatchProviders: async (tvId: number): Promise<WatchProvidersResponse> => {
    return fetchTMDb<WatchProvidersResponse>(`/tv/${tvId}/watch/providers`);
  },
};

// =============================================================================
// Person API
// =============================================================================

export const personApi = {
  /**
   * Get person details
   */
  getDetails: async (
    personId: number,
    appendToResponse?: string[]
  ): Promise<Person> => {
    const params = appendToResponse
      ? { append_to_response: appendToResponse.join(',') }
      : {};
    return fetchTMDb<Person>(`/person/${personId}`, params);
  },

  /**
   * Get popular people
   */
  getPopular: async (page: number = 1): Promise<PaginatedResponse<Person>> => {
    return fetchTMDb<PaginatedResponse<Person>>('/person/popular', { page });
  },
};

// =============================================================================
// Trending API
// =============================================================================

export const trendingApi = {
  /**
   * Get trending movies
   */
  getMovies: async (timeWindow: 'day' | 'week' = 'week', region?: string): Promise<PaginatedResponse<MovieListItem>> => {
    return fetchTMDb<PaginatedResponse<MovieListItem>>(`/trending/movie/${timeWindow}`, { region });
  },

  /**
   * Get trending TV shows
   */
  getTVShows: async (timeWindow: 'day' | 'week' = 'week', region?: string): Promise<PaginatedResponse<TVShowListItem>> => {
    return fetchTMDb<PaginatedResponse<TVShowListItem>>(`/trending/tv/${timeWindow}`, { region });
  },

  /**
   * Get trending people
   */
  getPeople: async (timeWindow: 'day' | 'week' = 'week'): Promise<PaginatedResponse<Person>> => {
    return fetchTMDb<PaginatedResponse<Person>>(`/trending/person/${timeWindow}`);
  },

  /**
   * Get all trending (movies, TV, people)
   */
  getAll: async (timeWindow: 'day' | 'week' = 'week'): Promise<PaginatedResponse<SearchResult>> => {
    return fetchTMDb<PaginatedResponse<SearchResult>>(`/trending/all/${timeWindow}`);
  },
};

// =============================================================================
// Discover API
// =============================================================================

export interface DiscoverMovieParams {
  page?: number;
  sort_by?: string;
  with_genres?: string;
  with_original_language?: string;
  'vote_count.gte'?: number;
  'vote_average.gte'?: number;
  region?: string;
  year?: number;
  primary_release_year?: number;
}

export interface DiscoverTVParams {
  page?: number;
  sort_by?: string;
  with_genres?: string;
  with_original_language?: string;
  'vote_count.gte'?: number;
  'vote_average.gte'?: number;
  first_air_date_year?: number;
}

export const discoverApi = {
  /**
   * Discover movies with filters
   */
  movies: async (params: DiscoverMovieParams = {}): Promise<PaginatedResponse<MovieListItem>> => {
    return fetchTMDb<PaginatedResponse<MovieListItem>>('/discover/movie', params);
  },

  /**
   * Discover TV shows with filters
   */
  tvShows: async (params: DiscoverTVParams = {}): Promise<PaginatedResponse<TVShowListItem>> => {
    return fetchTMDb<PaginatedResponse<TVShowListItem>>('/discover/tv', params);
  },
};

// =============================================================================
// Generic API (for custom endpoints)
// =============================================================================

export const genericApi = {
  /**
   * Fetch any TMDb endpoint with custom parameters
   */
  fetch: async <T>(endpoint: string, params?: Record<string, any>): Promise<T> => {
    return fetchTMDb<T>(endpoint, params);
  },
};

// =============================================================================
// Export unified API client
// =============================================================================

export const tmdbApi = {
  search: searchApi,
  movie: movieApi,
  tv: tvApi,
  person: personApi,
  trending: trendingApi,
  discover: discoverApi,
  generic: genericApi,
};

export default tmdbApi;
