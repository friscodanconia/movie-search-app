import React from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Optimized Image Component
 * Wraps Next.js Image with consistent optimization settings
 * - Blur placeholder for better perceived performance
 * - Proper sizes for responsive images
 * - Automatic loading strategy
 */
export default function OptimizedImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  priority = false,
  sizes,
}: OptimizedImageProps) {
  // Default sizes if not provided
  const defaultSizes = fill
    ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
    : undefined;

  // Simple blur data URL for placeholder
  const blurDataURL =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4=';

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes || defaultSizes}
      placeholder="blur"
      blurDataURL={blurDataURL}
      loading={priority ? undefined : 'lazy'}
    />
  );
}
