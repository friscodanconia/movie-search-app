# React Query Integration

This document explains the React Query (TanStack Query) integration for data caching and state management.

## Overview

React Query has been integrated to provide:
- **Automatic caching** - API responses are cached for 5 minutes
- **Request deduplication** - Multiple components requesting the same data will only trigger one API call
- **Background refetching** - Data is automatically refreshed when the window regains focus
- **Optimistic updates** - UI can be updated before server responses
- **Offline support** - Cached data remains available offline

## Setup

### 1. Query Client Configuration (`lib/query-client.ts`)

Defines the global configuration for React Query:
```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      gcTime: 10 * 60 * 1000,        // 10 minutes
      retry: 2,                       // Retry failed requests twice
      refetchOnWindowFocus: true,     // Refresh on window focus
      refetchOnMount: false,          // Don't refetch if data is fresh
      refetchOnReconnect: true,       // Refetch on network reconnect
    },
  },
});
```

### 2. Query Provider (`components/QueryProvider.tsx`)

Wraps the application with QueryClientProvider:
```typescript
export default function QueryProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient({...}));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools /> {/* Only in development */}
    </QueryClientProvider>
  );
}
```

### 3. Custom Hooks

#### Generic TMDb Endpoint Hook (`lib/hooks/useTMDbEndpoint.ts`)

For flexible endpoint queries:
```typescript
const { data, isLoading, error } = useTMDbEndpoint('/movie/popular');
const { data: content } = useTMDbContent('/trending/movie/week', 10);
```

#### Specialized Hooks (`lib/hooks/useMovieQueries.ts`)

Type-safe hooks for common operations:
```typescript
const { data: movie } = useMovieDetails(movieId);
const { data: similar } = useSimilarMovies(movieId);
const { data: tvShow } = useTVShowDetails(tvId);
const { data: person } = usePersonDetails(personId);
const { data: results } = useMultiSearch(query, page);
```

## Query Keys

Organized hierarchically for easy cache invalidation:
```typescript
queryKeys.movie.all                    // ['movies']
queryKeys.movie.detail(123)            // ['movies', 'detail', 123]
queryKeys.movie.similar(123)           // ['movies', 'similar', 123]
queryKeys.search.multi('avatar', 1)    // ['search', 'multi', 'avatar', 1]
```

## Usage Examples

### Example 1: ContentSection with Caching

**Before (without React Query):**
```typescript
const [items, setItems] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchContent = async () => {
    const response = await fetch(url);
    const data = await response.json();
    setItems(data.results);
    setIsLoading(false);
  };
  fetchContent();
}, [endpoint]);
```

**After (with React Query):**
```typescript
const { data: items = [], isLoading } = useTMDbContent(endpoint, 10);
// Automatic caching, refetching, and error handling!
```

### Example 2: Movie Details Page

```typescript
export default function MovieDetailPage() {
  const params = useParams();
  const movieId = parseInt(params.id as string);

  // Fetch movie details with automatic caching
  const { data: movie, isLoading, error } = useMovieDetails(movieId);

  // Fetch similar movies in parallel (will be deduplicated)
  const { data: similarMovies } = useSimilarMovies(movieId);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;

  return <MovieDetails movie={movie} similar={similarMovies} />;
}
```

### Example 3: Search with Debouncing

```typescript
const [searchQuery, setSearchQuery] = useState('');
const debouncedQuery = useDebounce(searchQuery, 300);

// Query only runs when debounced query changes
// Multiple rapid keystrokes = single API call
const { data, isLoading } = useMultiSearch(debouncedQuery, 1);
```

## Benefits

### 1. Performance
- Eliminates duplicate requests across components
- Caches responses to reduce API calls
- Background refetching keeps data fresh without blocking UI

### 2. Developer Experience
- Less boilerplate (no manual loading/error states)
- Automatic TypeScript types
- DevTools for debugging queries

### 3. User Experience
- Faster navigation with cached data
- Fresh data when refocusing window
- Works offline with cached data

## DevTools

In development mode, React Query DevTools are automatically available:
- Press `Ctrl+Shift+D` to toggle the dev panel
- View active queries, cache status, and refetch history
- Manually trigger refetches and clear cache

## Cache Invalidation

To manually invalidate cache:
```typescript
import { queryClient } from '@/lib/query-client';

// Invalidate all movie queries
queryClient.invalidateQueries({ queryKey: queryKeys.movie.all });

// Invalidate specific movie
queryClient.invalidateQueries({ queryKey: queryKeys.movie.detail(123) });
```

## Future Enhancements

- Add mutations for user actions (watchlist updates)
- Implement infinite scroll queries for search results
- Add optimistic updates for instant UI feedback
- Configure per-query cache times based on data volatility

## Resources

- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
