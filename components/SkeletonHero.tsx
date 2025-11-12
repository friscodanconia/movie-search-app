export default function SkeletonHero() {
  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] bg-gray-900 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] animate-shimmer"></div>
      <div className="absolute inset-0 flex items-end md:items-center pb-8 md:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-2xl space-y-4">
            {/* Title skeleton */}
            <div className="h-12 md:h-16 bg-gray-800 rounded w-3/4"></div>
            {/* Meta info skeleton */}
            <div className="flex gap-4">
              <div className="h-8 bg-gray-800 rounded w-20"></div>
              <div className="h-8 bg-gray-800 rounded w-16"></div>
            </div>
            {/* Overview skeleton - desktop only */}
            <div className="hidden md:block space-y-2">
              <div className="h-4 bg-gray-800 rounded w-full"></div>
              <div className="h-4 bg-gray-800 rounded w-5/6"></div>
              <div className="h-4 bg-gray-800 rounded w-4/6"></div>
            </div>
            {/* Buttons skeleton */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="h-12 bg-gray-800 rounded-full w-40"></div>
              <div className="h-12 bg-gray-700 rounded-full w-44"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
