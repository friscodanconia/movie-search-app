'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useRouter } from 'next/navigation';
import { Play, Info } from 'lucide-react';
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
}

export default function HeroCarousel() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=1`
        );
        const data = await response.json();
        setMovies(data.results.slice(0, 5)); // Get top 5 popular movies
      } catch (error) {
        console.error('Error fetching popular movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-[70vh] bg-gray-900 flex items-center justify-center">
        <p className="text-cinema-text text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[70vh] bg-cinema-dark">
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
              className="relative w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(18,18,18,0.9) 30%, rgba(18,18,18,0.4) 70%, rgba(18,18,18,0.9)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
              }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-6xl mx-auto px-4 w-full">
                  <div className="max-w-2xl">
                    <h1 className="text-5xl md:text-6xl font-bold text-cinema-gold mb-4">
                      {movie.title}
                    </h1>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <span className="text-cinema-gold text-xl">⭐</span>
                        <span className="text-cinema-text text-lg">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-gray-400">
                        {new Date(movie.release_date).getFullYear()}
                      </span>
                    </div>
                    <p className="text-cinema-text text-lg mb-6 line-clamp-3">
                      {movie.overview}
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => router.push(`/movie/${movie.id}`)}
                        className="flex items-center gap-2 bg-cinema-gold text-cinema-dark px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors"
                      >
                        <Info size={20} />
                        More Info
                      </button>
                      <button
                        onClick={() => router.push(`/movie/${movie.id}`)}
                        className="flex items-center gap-2 bg-gray-700 bg-opacity-80 text-white px-6 py-3 rounded-full font-semibold hover:bg-opacity-100 transition-colors"
                      >
                        <Play size={20} className="fill-white" />
                        Watch Trailer
                      </button>
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
        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #FFD700;
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: #FFD700;
          background: rgba(0, 0, 0, 0.5);
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px;
        }
      `}</style>
    </div>
  );
}
