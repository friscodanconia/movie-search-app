# CineMagic 🎬

A modern movie and TV show discovery application built with Next.js 14, featuring instant search, Tinder-style swipe discovery, curated collections, and streaming availability for India.

## Features

- **Instant Search** - Lightning-fast search with debouncing and recent search history
- **Swipe Discovery** - Tinder-style card interface for discovering movies and TV shows
- **Curated Collections** - Pre-built collections (Action Packed, MCU, Oscar Winners, etc.)
- **Watchlist** - Save your favorite content for later
- **Streaming Availability** - Find where to watch content in India
- **Detailed Pages** - Full movie/TV/person details with cast, trailers, and similar content

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A free TMDb API key (required)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd movie-search-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example file
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your TMDb API key:
   - Get your free API key from [TMDb Settings](https://www.themoviedb.org/settings/api)
   - (Optional) Add RapidAPI key for enhanced streaming data - see [STREAMING_API_SETUP.md](./STREAMING_API_SETUP.md)

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. **Open the app**

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 14 (React 18, App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Carousels**: Swiper
- **Icons**: Lucide React
- **API**: The Movie Database (TMDb)

## Project Structure

```
movie-search-app/
├── app/                    # Next.js app router pages
│   ├── collections/        # Collections pages
│   ├── discover/          # Swipe discovery page
│   ├── movie/[id]/        # Movie detail pages
│   ├── person/[id]/       # Person detail pages
│   ├── tv/[id]/           # TV show detail pages
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Header.tsx
│   ├── InstantSearch.tsx
│   ├── SwipeDiscovery.tsx
│   └── ...
├── lib/                   # Utilities and helpers
│   ├── collections.ts     # Curated collections data
│   └── streamingAvailability.ts
└── public/               # Static assets

```

## Development

- Edit pages in `app/` directory - changes auto-update
- Add components in `components/` directory
- Configure Tailwind in `tailwind.config.ts`

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com/new)
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_TMDB_API_KEY`
   - `NEXT_PUBLIC_RAPIDAPI_KEY` (optional)
4. Deploy!

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

See the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TMDb API Documentation](https://developers.themoviedb.org/3)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## License

MIT
