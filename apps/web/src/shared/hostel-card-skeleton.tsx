export function HostelCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#F4F4F4] bg-white overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="relative h-[206px] bg-gray-200">
        {/* Badge skeletons */}
        <div className="absolute left-4 top-4 flex gap-x-1.5 items-center">
          <div className="h-6 w-16 bg-gray-300 rounded"></div>
          <div className="h-6 w-16 bg-gray-300 rounded"></div>
        </div>
        {/* Favorite button skeleton */}
        <div className="absolute right-4 top-4 hidden lg:block h-7 w-7 bg-gray-300 rounded-md"></div>
      </div>

      {/* Content skeleton */}
      <div className="p-4">
        {/* Title and rating */}
        <div className="flex justify-between items-center">
          <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-5 w-16 bg-gray-200 rounded"></div>
        </div>

        {/* Location and agent */}
        <div className="flex justify-between items-center mt-3">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>

        {/* Amenities badges */}
        <div className="flex flex-wrap gap-2 items-center mt-6">
          <div className="h-6 w-20 bg-gray-200 rounded"></div>
          <div className="h-6 w-20 bg-gray-200 rounded"></div>
          <div className="h-6 w-20 bg-gray-200 rounded"></div>
        </div>

        {/* Price */}
        <div className="h-6 w-40 bg-gray-200 rounded mt-6"></div>

        {/* Buttons */}
        <div className="flex gap-x-2 items-center mt-4">
          <div className="grow h-10 bg-gray-200 rounded-[5px]"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
