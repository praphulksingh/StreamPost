const VideoSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 w-full animate-pulse">
      {/* Thumbnail Skeleton */}
      <div className="w-full aspect-video bg-brand-secondary/50 rounded-xl"></div>
      
      {/* Info Skeleton */}
      <div className="flex gap-3 mt-1">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-brand-secondary/50 shrink-0"></div>
        
        {/* Text Lines */}
        <div className="flex flex-col gap-2 w-full pt-1">
          <div className="w-11/12 h-4 bg-brand-secondary/50 rounded"></div>
          <div className="w-3/4 h-4 bg-brand-secondary/50 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoSkeleton;