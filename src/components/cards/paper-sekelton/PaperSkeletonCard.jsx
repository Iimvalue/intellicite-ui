import React from 'react';

const PaperSkeletonCard = ({ className = "" }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 relative animate-pulse ${className}`}>
      {/* Bookmark Icon Skeleton - Top Right */}
      <div className="absolute top-4 right-4">
        <div className="w-9 h-9 bg-gray-200 rounded-md"></div>
      </div>

      {/* Header Section - Badges */}
      <div className="flex items-start justify-between mb-4 pr-12">
        <div className="flex items-center gap-4">
          {/* Relevance Badge Skeleton */}
          <div className="h-7 w-32 bg-gray-200 rounded-full"></div>
          
          {/* Citation Count Skeleton */}
          <div className="h-5 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Title Skeleton */}
      <div className="mb-3">
        <div className="h-6 bg-gray-200 rounded w-4/5 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-3/5"></div>
      </div>

      {/* Description Skeleton */}
      <div className="mb-6 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-between">
        {/* Authors Skeleton */}
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>

        {/* View Paper Button Skeleton */}
        <div className="flex-shrink-0">
          <div className="h-8 w-24 bg-gray-200 rounded border"></div>
        </div>
      </div>
    </div>
  );
};

export default PaperSkeletonCard;