/**
 * Shared TypeScript types for CineMagic
 * Centralized type definitions for TMDb API responses and app data structures
 */

// =============================================================================
// Base Media Types
// =============================================================================

export type MediaType = 'movie' | 'tv' | 'person';

// =============================================================================
// Common Interfaces
// =============================================================================

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

// =============================================================================
// Movie Types
// =============================================================================

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  original_language: string;
  genres: Genre[];
  genre_ids?: number[];
  budget?: number;
  revenue?: number;
  homepage?: string;
  imdb_id?: string;
  status?: string;
  tagline?: string;
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountry[];
  spoken_languages?: SpokenLanguage[];
  videos?: VideosResponse;
  credits?: CreditsResponse;
}

export interface MovieListItem {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
}

// =============================================================================
// TV Show Types
// =============================================================================

export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  first_air_date: string;
  last_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  original_language: string;
  genres: Genre[];
  genre_ids?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  episode_run_time?: number[];
  status?: string;
  type?: string;
  homepage?: string;
  in_production?: boolean;
  created_by?: Creator[];
  networks?: Network[];
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountry[];
  spoken_languages?: SpokenLanguage[];
  videos?: VideosResponse;
  credits?: CreditsResponse;
}

export interface TVShowListItem {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_name: string;
  origin_country: string[];
}

export interface Creator {
  id: number;
  name: string;
  profile_path: string | null;
  credit_id: string;
}

export interface Network {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

// =============================================================================
// Person Types
// =============================================================================

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  adult: boolean;
  known_for_department: string;
  gender: number;
  popularity: number;
  biography?: string;
  birthday?: string;
  deathday?: string | null;
  place_of_birth?: string;
  also_known_as?: string[];
  homepage?: string | null;
  imdb_id?: string;
  movie_credits?: MovieCreditsResponse;
  tv_credits?: TVCreditsResponse;
}

export interface PersonListItem {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  known_for?: Array<MovieListItem | TVShowListItem>;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  cast_id?: number;
  credit_id: string;
  order: number;
  gender?: number;
  known_for_department?: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
  credit_id: string;
  gender?: number;
  known_for_department?: string;
}

// =============================================================================
// Credits Types
// =============================================================================

export interface CreditsResponse {
  id?: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface MovieCreditsResponse {
  cast: Array<MovieListItem & { character: string }>;
  crew: Array<MovieListItem & { job: string; department: string }>;
}

export interface TVCreditsResponse {
  cast: Array<TVShowListItem & { character: string }>;
  crew: Array<TVShowListItem & { job: string; department: string }>;
}

// =============================================================================
// Video Types
// =============================================================================

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  iso_639_1: string;
  iso_3166_1: string;
}

export interface VideosResponse {
  id?: number;
  results: Video[];
}

// =============================================================================
// Search Types
// =============================================================================

export interface SearchResult {
  id: number;
  media_type: MediaType;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  poster_path?: string | null;
  profile_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  adult?: boolean;
  original_language?: string;
  known_for_department?: string;
  known_for?: Array<MovieListItem | TVShowListItem>;
}

// =============================================================================
// Watch Providers Types
// =============================================================================

export interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface WatchProvidersRegion {
  link?: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

export interface WatchProvidersResponse {
  id: number;
  results: {
    [countryCode: string]: WatchProvidersRegion;
  };
}

// =============================================================================
// Streaming Availability Types (RapidAPI)
// =============================================================================

export interface StreamingService {
  service: string;
  streamingType: 'subscription' | 'free' | 'rent' | 'buy';
  link: string;
}

export interface StreamingAvailability {
  country: string;
  services: StreamingService[];
}

// =============================================================================
// Watchlist Types
// =============================================================================

export interface WatchlistItem {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  media_type: MediaType;
  addedAt: number;
}

// =============================================================================
// Collection Types
// =============================================================================

export interface Collection {
  id: string;
  title: string;
  description: string;
  icon: string;
  movieIds: number[];
}

// =============================================================================
// API Response Types
// =============================================================================

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDbError {
  status_code: number;
  status_message: string;
  success: false;
}

// =============================================================================
// Cinema DNA - Film Journal & Mood Tracking
// =============================================================================

export type MoodTag =
  | 'euphoric'
  | 'melancholic'
  | 'tense'
  | 'contemplative'
  | 'nostalgic'
  | 'uplifting'
  | 'dark'
  | 'whimsical'
  | 'intense'
  | 'peaceful';

export interface JournalEntry {
  id: string;
  movieId: number;
  title: string;
  poster_path: string | null;
  watchedAt: number;
  rating?: number;
  mood: MoodTag[];
  emotionalNotes: string;
  memoryAnchor?: string; // "Watched with Sarah on rainy Sunday"
  rewatchCount: number;
  context?: string; // Theater, Home, Flight, etc.
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  completed: boolean;
  type: 'director' | 'decade' | 'genre' | 'collection' | 'milestone';
  badge?: string;
  movies: number[]; // TMDb IDs of movies in this challenge
}

export interface UserCinemaDNA {
  dominantMoods: { mood: MoodTag; count: number }[];
  favoriteDecades: { decade: string; count: number }[];
  totalWatched: number;
  avgRating: number;
  rewatchChampion?: { title: string; count: number };
  currentStreak: number;
  longestStreak: number;
}

// =============================================================================
// Utility Types
// =============================================================================

export type TMDbResponse<T> = T | TMDbError;

export function isTMDbError(response: any): response is TMDbError {
  return response && response.success === false;
}
