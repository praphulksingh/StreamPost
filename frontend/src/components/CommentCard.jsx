import { useState } from "react";
import { FiThumbsUp, FiThumbsDown, FiTrash2 } from "react-icons/fi";
import { formatTimeAgo } from "../utils/formatters";
import { likeService } from "../services/like.service";
import { commentService } from "../services/comment.service";
import { useAuth } from "../context/AuthContext";

const CommentCard = ({ comment, onDelete }) => {
  const { user } = useAuth();
  
  // Like states
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likeCount, setLikeCount] = useState(comment.likesCount || 0);

  // Reply states
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  
  // 👇 NEW: State to hold and display our nested replies
  const [replies, setReplies] = useState(comment.replies || []);

  const handleLike = async () => {
    try {
      const res = await likeService.toggleCommentLike(comment._id);
      setIsLiked(res.data.isLiked);
      setLikeCount(prev => res.data.isLiked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error("Failed to toggle comment like", error);
    }
  };

  const handleDislike = () => {
    if (isLiked) handleLike(); 
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      setSubmittingReply(true);
      const res = await commentService.addReply(comment._id, { content: replyText });
      
      // 👇 NEW: Instantly inject the newly saved reply into the UI
      setReplies((prevReplies) => [...prevReplies, res.data]);
      
      // Clear and close the box
      setReplyText("");
      setIsReplyOpen(false);
      
    } catch (error) {
      console.error("Reply failed", error);
      alert(error.response?.data?.message || "Reply failed.");
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className="flex gap-4 group">
      {/* Main Comment Avatar */}
      <img
        src={comment.owner?.avatar || "https://ui-avatars.com/api/?name=User&background=random"}
        alt={comment.owner?.fullName}
        className="w-10 h-10 rounded-full object-cover shrink-0 mt-1"
      />

      {/* Main Content Area */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white text-sm">
            {comment.owner?.fullName || "User"}
          </span>
          <span className="text-brand-muted text-xs">
            {formatTimeAgo(comment.createdAt)}
          </span>
        </div>

        <p className="text-brand-text text-sm mt-1 whitespace-pre-wrap">
          {comment.content}
        </p>

        {/* Interaction Bar */}
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1">
            <button 
              onClick={handleLike}
              className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${
                isLiked ? "text-brand-accent" : "text-brand-muted"
              }`}
            >
              <FiThumbsUp className="w-4 h-4" />
            </button>
            <span className="text-xs text-brand-muted font-medium">
              {likeCount > 0 ? likeCount : ""}
            </span>
          </div>

          <button 
            onClick={handleDislike}
            className="p-1.5 rounded-full hover:bg-white/10 text-brand-muted transition-colors"
          >
            <FiThumbsDown className="w-4 h-4" />
          </button>
          
          {user && (
            <button 
              onClick={() => setIsReplyOpen(!isReplyOpen)}
              className="text-xs text-brand-muted font-medium hover:text-white transition-colors px-2 py-1 rounded-full hover:bg-white/10"
            >
              Reply
            </button>
          )}
        </div>

        {/* Mini Reply Input Box */}
        {isReplyOpen && (
          <form onSubmit={handleReplySubmit} className="mt-3 flex gap-3 pr-4">
            <img 
              src={user?.avatar || "https://ui-avatars.com/api/?name=User"} 
              alt="You" 
              className="w-6 h-6 rounded-full object-cover shrink-0 mt-1"
            />
            <div className="flex flex-col w-full gap-2">
              <input 
                type="text" 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Add a reply..."
                autoFocus
                className="bg-transparent border-b border-brand-secondary text-white text-sm pb-1 focus:outline-none focus:border-white transition-colors"
              />
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsReplyOpen(false);
                    setReplyText("");
                  }}
                  className="px-3 py-1 text-xs text-brand-muted hover:text-white font-medium rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submittingReply || !replyText.trim()}
                  className="bg-brand-accent text-white px-3 py-1 text-xs font-medium rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-50"
                >
                  {submittingReply ? "..." : "Reply"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 👇 NEW: Nested Replies Rendering 👇 */}
        {replies.length > 0 && (
          <div className="mt-4 flex flex-col gap-4 border-l-2 border-brand-secondary pl-4 ml-2">
            {replies.map((reply) => (
              <div key={reply._id} className="flex gap-3">
                <img
                  // The backend might not populate the owner immediately on creation, so we fallback to the logged-in user's avatar
                  src={reply.owner?.avatar || user?.avatar || "https://ui-avatars.com/api/?name=User&background=random"}
                  alt="Reply Avatar"
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-xs">
                      {reply.owner?.fullName || user?.fullName || "You"}
                    </span>
                    <span className="text-brand-muted text-[10px]">
                      Just now
                    </span>
                  </div>
                  <p className="text-brand-text text-sm mt-0.5 whitespace-pre-wrap">
                    {reply.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Delete Button */}
      {user && user._id === comment.owner?._id && (
        <button 
          onClick={() => onDelete(comment._id)}
          className="opacity-0 group-hover:opacity-100 p-2 text-brand-muted hover:text-red-500 transition-all h-fit rounded-full hover:bg-white/10"
          title="Delete Comment"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default CommentCard;