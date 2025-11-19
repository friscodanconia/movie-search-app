'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useRouter } from 'next/navigation';
import { Play, Info } from 'lucide-react';
import VideoModal from './VideoModal';
import SkeletonHero from './SkeletonHero';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
  videos?: {
    results: { key: string; type: string; site: string }[];
  };
}

export default function HeroCarousel() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&region=IN&page=1`
        );
        const data = await response.json();
        const topMovies = data.results.slice(0, 5);

        // Fetch videos for each movie
        const moviesWithVideos = await Promise.all(
          topMovies.map(async (movie: Movie) => {
            try {
              const videoResponse = await fetch(
                `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
              );
              const videoData = await videoResponse.json();
              return { ...movie, videos: videoData };
            } catch (err) {
              return movie;
            }
          })
        );

        setMovies(moviesWithVideos);
      } catch (error) {
        console.error('Error fetching popular movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  if (isLoading) {
    return <SkeletonHero />;
  }

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] bg-cinema-dark">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        navigation={true}
        loop={true}
        className="h-full"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div
              className="relative w-full h-full bg-cover bg-center md:bg-center"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
              }}
            >
              {/* Mobile: Strong bottom gradient for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-cinema-dark/80 to-transparent md:hidden"></div>

              {/* Desktop: Side gradient (original style) */}
              <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-cinema-dark/95 via-cinema-dark/60 to-cinema-dark/95"></div>

              <div className="absolute inset-0 flex items-end md:items-center pb-8 md:pb-0">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
                  <div className="max-w-2xl">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-medium text-cinema-accent mb-3 md:mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] tracking-tight">
                      {movie.title}
                    </h1>
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="flex items-center gap-1 bg-cinema-dark/80 backdrop-blur-sm px-2 py-1 rounded border border-cinema-border">
                        <span className="text-cinema-accent text-lg md:text-xl">⭐</span>
                        <span className="text-cinema-text text-base md:text-lg font-mono font-semibold">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-cinema-text-dim text-base md:text-lg font-mono font-medium bg-cinema-dark/80 backdrop-blur-sm px-2 py-1 rounded border border-cinema-border">
                        {new Date(movie.release_date).getFullYear()}
                      </span>
                    </div>
                    <p className="hidden md:block text-cinema-text-dim text-base md:text-lg mb-6 line-clamp-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-sans leading-relaxed">
                      {movie.overview}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                      <button
                        onClick={() => router.push(`/movie/${movie.id}`)}
                        className="flex items-center justify-center gap-2 bg-cinema-accent text-cinema-dark px-6 py-3 md:py-3 rounded-full font-sans font-semibold hover:bg-cinema-accent-dim transition-all shadow-lg shadow-cinema-accent/30 hover:shadow-xl hover:shadow-cinema-accent/40 min-h-[48px] hover:scale-105 active:scale-95"
                      >
                        <Info size={20} />
                        <span>More Info</span>
                      </button>
                      {movie.videos?.results && movie.videos.results.length > 0 && (
                        <button
                          onClick={() => {
                            const trailer = movie.videos?.results.find(
                              (video) => video.type === 'Trailer' && video.site === 'YouTube'
                            );
                            if (trailer) {
                              setTrailerKey(trailer.key);
                            }
                          }}
                          className="flex items-center justify-center gap-2 bg-cinema-surface/90 backdrop-blur-sm text-cinema-text px-6 py-3 md:py-3 rounded-full font-sans font-semibold hover:bg-cinema-surface-hover transition-all shadow-lg border border-cinema-border hover:border-cinema-accent min-h-[48px] hover:scale-105 active:scale-95"
                        >
                          <Play size={20} className="fill-cinema-text" />
                          <span>Watch Trailer</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-pagination {
          bottom: 20px !important;
        }
        /* Move pagination higher on mobile to avoid button overlap */
        @media (max-width: 639px) {
          .swiper-pagination {
            bottom: 180px !important;
          }
        }
        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.4);
          opacity: 1;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .swiper-pagination-bullet-active {
          background: var(--cinema-accent);
          width: 12px;
          height: 12px;
          border-color: var(--cinema-accent);
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: var(--cinema-accent);
          background: rgba(26, 26, 26, 0.8);
          backdrop-filter: blur(8px);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid var(--cinema-border);
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(26, 26, 26, 0.95);
          border-color: var(--cinema-accent);
        }
        @media (min-width: 768px) {
          .swiper-button-next,
          .swiper-button-prev {
            width: 50px;
            height: 50px;
          }
        }
        /* Hide navigation arrows on mobile for cleaner look */
        @media (max-width: 767px) {
          .swiper-button-next,
          .swiper-button-prev {
            display: none;
          }
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 18px;
        }
        @media (min-width: 768px) {
          .swiper-button-next:after,
          .swiper-button-prev:after {
            font-size: 20px;
          }
        }
      `}</style>

      <VideoModal videoKey={trailerKey} onClose={() => setTrailerKey(null)} />
    </div>
  );
}
