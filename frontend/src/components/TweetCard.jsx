import { formatTimeAgo } from "../utils/formatters";
import { FiThumbsUp, FiTrash2 } from "react-icons/fi";

const TweetCard = ({ tweet, isOwner, onDelete }) => {
  return (
    <div className="bg-brand-secondary/20 border border-brand-secondary p-5 rounded-xl flex gap-4">
      <img 
        src={tweet.owner?.avatar || "https://ui-avatars.com/api/?name=User&background=random"} 
        alt="Avatar" 
        className="w-12 h-12 rounded-full object-cover shrink-0"
      />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-white font-bold">{tweet.owner?.fullName || "User"}</h3>
            <p className="text-brand-muted text-xs">@{tweet.owner?.username} • {formatTimeAgo(tweet.createdAt)}</p>
          </div>
          {isOwner && (
            <button 
              onClick={() => onDelete(tweet._id)}
              className="text-brand-muted hover:text-red-500 transition-colors p-2"
              title="Delete post"
            >
              <FiTrash2 />
            </button>
          )}
        </div>
        
        <p className="text-brand-text mt-3 whitespace-pre-wrap">{tweet.content}</p>
        
        {/* Like Button (Visual placeholder for now, you can wire it up to the like service later!) */}
        <div className="mt-4 flex items-center gap-6">
          <button className="flex items-center gap-2 text-brand-muted hover:text-white transition-colors text-sm">
            <FiThumbsUp /> <span>{tweet.likesCount || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TweetCard;