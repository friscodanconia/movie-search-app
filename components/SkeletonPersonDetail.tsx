export default function SkeletonPersonDetail() {
  return (
    <div className="min-h-screen bg-cinema-dark">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-gray-900 to-cinema-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-6 h-5 w-20 bg-gray-800 rounded animate-pulse"></div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Photo Skeleton */}
            <div className="flex-shrink-0">
              <div className="w-48 h-72 md:w-64 md:h-96 rounded-lg overflow-hidden bg-gray-800">
                <div className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] animate-shimmer"></div>
              </div>
            </div>

            {/* Info Skeleton */}
            <div className="flex-1 space-y-4">
              <div className="h-10 bg-gray-800 rounded w-3/4 animate-pulse"></div>

              <div className="flex flex-wrap gap-4">
                <div className="h-6 bg-gray-800 rounded w-32 animate-pulse"></div>
                <div className="h-6 bg-gray-800 rounded w-24 animate-pulse"></div>
                <div className="h-6 bg-gray-800 rounded w-40 animate-pulse"></div>
              </div>

              <div className="space-y-2">
                <div className="h-8 bg-gray-800 rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-gray-800 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-800 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-800 rounded w-4/6 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filmography Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="h-8 bg-gray-800 rounded w-48 mb-6 animate-pulse"></div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="relative aspect-[2/3] mb-2 rounded-lg overflow-hidden bg-gray-800">
                <div className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] animate-shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
