export default function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="relative aspect-[2/3] mb-2 rounded-lg overflow-hidden bg-gray-800">
        <div className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] animate-shimmer"></div>
      </div>
      <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-800 rounded w-1/2"></div>
    </div>
  );
}
