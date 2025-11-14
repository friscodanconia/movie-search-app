/**
 * Application Constants
 * Centralized configuration values
 */

// =============================================================================
// API Configuration
// =============================================================================

export const API_CONFIG = {
  TMDB_BASE_URL: 'https://api.themoviedb.org/3',
  TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  TMDB_API_KEY: process.env.NEXT_PUBLIC_TMDB_API_KEY,
  RAPIDAPI_KEY: process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
} as const;

// =============================================================================
// Image Sizes (TMDb)
// =============================================================================

export const IMAGE_SIZES = {
  POSTER: {
    SMALL: 'w92',
    MEDIUM: 'w185',
    LARGE: 'w342',
    XLARGE: 'w500',
    ORIGINAL: 'original',
  },
  BACKDROP: {
    SMALL: 'w300',
    MEDIUM: 'w780',
    LARGE: 'w1280',
    ORIGINAL: 'original',
  },
  PROFILE: {
    SMALL: 'w45',
    MEDIUM: 'w185',
    LARGE: 'h632',
    ORIGINAL: 'original',
  },
  LOGO: {
    SMALL: 'w45',
    MEDIUM: 'w92',
    LARGE: 'w154',
    XLARGE: 'w185',
    ORIGINAL: 'original',
  },
} as const;

// =============================================================================
// Local Storage Keys
// =============================================================================

export const STORAGE_KEYS = {
  WATCHLIST: 'cinemagic_watchlist',
  RECENT_SEARCHES: 'recentSearches',
  THEME: 'cinemagic_theme',
  USER_PREFERENCES: 'cinemagic_preferences',
} as const;

// =============================================================================
// Search Configuration
// =============================================================================

export const SEARCH_CONFIG = {
  DEBOUNCE_DELAY: 300, // milliseconds
  MAX_RECENT_SEARCHES: 5,
  MAX_RESULTS_PER_PAGE: 20,
  INSTANT_SEARCH_LIMIT: 8,
} as const;

// =============================================================================
// Pagination
// =============================================================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  ITEMS_PER_PAGE: 20,
} as const;

// =============================================================================
// Regional Settings
// =============================================================================

export const REGIONS = {
  INDIA: 'IN',
  US: 'US',
  UK: 'GB',
} as const;

export const DEFAULT_REGION = REGIONS.INDIA;

// =============================================================================
// Media Types
// =============================================================================

export const MEDIA_TYPES = {
  MOVIE: 'movie',
  TV: 'tv',
  PERSON: 'person',
} as const;

// =============================================================================
// Genre IDs (TMDb)
// =============================================================================

export const MOVIE_GENRES = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  TV_MOVIE: 10770,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
} as const;

export const TV_GENRES = {
  ACTION_ADVENTURE: 10759,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  KIDS: 10762,
  MYSTERY: 9648,
  NEWS: 10763,
  REALITY: 10764,
  SCI_FI_FANTASY: 10765,
  SOAP: 10766,
  TALK: 10767,
  WAR_POLITICS: 10768,
  WESTERN: 37,
} as const;

// =============================================================================
// Language Codes
// =============================================================================

export const LANGUAGES = {
  ENGLISH: 'en',
  HINDI: 'hi',
  TAMIL: 'ta',
  TELUGU: 'te',
  MALAYALAM: 'ml',
  KANNADA: 'kn',
  BENGALI: 'bn',
  MARATHI: 'mr',
} as const;

// =============================================================================
// Swipe Discovery Configuration
// =============================================================================

export const SWIPE_CONFIG = {
  THRESHOLD: 100, // pixels
  ROTATION_FACTOR: 0.1,
  CARDS_TO_PRELOAD: 3,
  REFETCH_THRESHOLD: 5, // Fetch more when 5 cards remaining
} as const;

// =============================================================================
// Animation Durations (milliseconds)
// =============================================================================

export const ANIMATION = {
  FAST: 150,
  MEDIUM: 300,
  SLOW: 500,
  CAROUSEL_INTERVAL: 5000,
} as const;

// =============================================================================
// Breakpoints (matches Tailwind)
// =============================================================================

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// =============================================================================
// Route Paths
// =============================================================================

export const ROUTES = {
  HOME: '/',
  DISCOVER: '/discover',
  COLLECTIONS: '/collections',
  MOVIE: (id: number | string) => `/movie/${id}`,
  TV: (id: number | string) => `/tv/${id}`,
  PERSON: (id: number | string) => `/person/${id}`,
  COLLECTION: (slug: string) => `/collections/${slug}`,
} as const;

// =============================================================================
// External Links
// =============================================================================

export const EXTERNAL_LINKS = {
  TMDB: 'https://www.themoviedb.org',
  TMDB_MOVIE: (id: number) => `https://www.themoviedb.org/movie/${id}`,
  TMDB_TV: (id: number) => `https://www.themoviedb.org/tv/${id}`,
  IMDB: (id: string) => `https://www.imdb.com/title/${id}`,
  GITHUB: 'https://github.com/friscodanconia/movie-search-app',
} as const;

// =============================================================================
// Error Messages
// =============================================================================

export const ERROR_MESSAGES = {
  API_KEY_MISSING: 'TMDb API key is not configured',
  FETCH_FAILED: 'Failed to fetch data',
  NETWORK_ERROR: 'Network error occurred',
  NOT_FOUND: 'Content not found',
  UNKNOWN_ERROR: 'An unknown error occurred',
} as const;
