import { Link } from "react-router-dom";
import { formatTimeAgo, formatDuration } from "../utils/formatters";

const VideoCard = ({ video }) => {
  // Safe extraction of owner details (handles cases where owner is populated or just an object)
  const ownerName = video.owner?.fullName || "Unknown Creator";
  const ownerAvatar = video.owner?.avatar || "https://via.placeholder.com/150";
  const ownerUsername = video.owner?.username || "";

  return (
    <div className="flex flex-col gap-2 cursor-pointer group">
      {/* Thumbnail Container */}
      <Link to={`/video/${video._id}`} className="relative w-full aspect-video rounded-xl overflow-hidden bg-brand-secondary">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        {/* Video Duration Badge */}
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
          {formatDuration(video.duration)}
        </span>
      </Link>

      {/* Video Details */}
      <div className="flex gap-3 mt-2">
        <Link to={`/channel/${ownerUsername}`} className="flex-shrink-0">
          <img 
            src={ownerAvatar} 
            alt={ownerName} 
            className="w-10 h-10 rounded-full object-cover mt-1 border border-transparent hover:border-brand-accent transition-colors"
          />
        </Link>
        <div className="flex flex-col overflow-hidden">
          <Link to={`/video/${video._id}`}>
            <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-2 leading-tight group-hover:text-brand-accent transition-colors">
              {video.title}
            </h3>
          </Link>
          <Link to={`/channel/${ownerUsername}`}>
            <p className="text-brand-muted text-xs sm:text-sm mt-1 hover:text-white transition-colors">
              {ownerName}
            </p>
          </Link>
          <p className="text-brand-muted text-xs flex items-center gap-1 mt-0.5">
            <span>{video.views} views</span>
            <span className="text-[10px]">●</span>
            <span>{formatTimeAgo(video.createdAt)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;