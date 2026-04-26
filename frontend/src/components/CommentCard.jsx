import { useState } from "react";
import { FiThumbsUp, FiThumbsDown, FiTrash2 } from "react-icons/fi";
import { formatTimeAgo } from "../utils/formatters";
import { likeService } from "../services/like.service";
import { commentService } from "../services/comment.service";
import { useAuth } from "../context/AuthContext";

// 👇 MAGIC SUB-COMPONENT: Handles the UI and interactions for ANY comment (Main or Reply)
const CommentBody = ({ data, isReply, onReplyClick, onDelete }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(data.isLiked || false);
  const [likeCount, setLikeCount] = useState(data.likesCount || 0);

  const handleLike = async () => {
    try {
      const res = await likeService.toggleCommentLike(data._id);
      setIsLiked(res.data.isLiked);
      setLikeCount(prev => res.data.isLiked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error("Like failed", error);
    }
  };

  return (
    <div className="flex gap-4 group w-full">
      <img
        src={data.owner?.avatar || "https://ui-avatars.com/api/?name=User"}
        alt={data.owner?.fullName}
        className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} rounded-full object-cover shrink-0 mt-1`}
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={`font-semibold text-white ${isReply ? 'text-xs' : 'text-sm'}`}>
            {data.owner?.fullName || "User"}
          </span>
          <span className="text-brand-muted text-xs">
            {formatTimeAgo(data.createdAt)}
          </span>
        </div>
        <p className={`text-brand-text mt-1 whitespace-pre-wrap ${isReply ? 'text-xs' : 'text-sm'}`}>
          {data.content}
        </p>

        {/* Interaction Bar */}
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1">
            <button onClick={handleLike} className={`p-1.5 rounded-full hover:bg-white/10 ${isLiked ? "text-brand-accent" : "text-brand-muted"}`}>
              <FiThumbsUp className={isReply ? 'w-3 h-3' : 'w-4 h-4'} />
            </button>
            <span className="text-xs text-brand-muted font-medium">{likeCount > 0 ? likeCount : ""}</span>
          </div>
          <button onClick={() => isLiked && handleLike()} className="p-1.5 rounded-full hover:bg-white/10 text-brand-muted">
            <FiThumbsDown className={isReply ? 'w-3 h-3' : 'w-4 h-4'} />
          </button>
          
          {/* Always trigger the main input box, exactly like YouTube */}
          {user && (
            <button onClick={onReplyClick} className="text-xs text-brand-muted font-medium hover:text-white px-2 py-1 rounded-full hover:bg-white/10">
              Reply
            </button>
          )}
        </div>
      </div>

      {user?._id === data.owner?._id && (
        <button onClick={() => onDelete(data._id, isReply)} className="opacity-0 group-hover:opacity-100 p-2 text-brand-muted hover:text-red-500 h-fit rounded-full hover:bg-white/10">
          <FiTrash2 className={isReply ? 'w-3 h-3' : 'w-4 h-4'} />
        </button>
      )}
    </div>
  );
};


// 👇 MAIN COMPONENT: Manages the state for the whole thread
const CommentCard = ({ comment, onDelete }) => {
  const { user } = useAuth();
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      setSubmittingReply(true);
      const res = await commentService.addReply(comment._id, { content: replyText });
      
      // Inject the newly created reply with local formatting so it renders instantly
      const newReply = { ...res.data, owner: user, likesCount: 0, isLiked: false };
      setReplies([...replies, newReply]);
      
      setReplyText("");
      setIsReplyOpen(false);
    } catch (error) {
      console.error("Reply failed", error);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleLocalDelete = async (idToDelete, isReply) => {
    if (isReply) {
      // Delete reply from local state and DB
      await commentService.deleteComment(idToDelete);
      setReplies(replies.filter(r => r._id !== idToDelete));
    } else {
      // Propagate main comment deletion up
      onDelete(idToDelete);
    }
  };

  const openReplyBox = () => setIsReplyOpen(!isReplyOpen);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Render Top-Level Comment */}
      <CommentBody 
        data={comment} 
        isReply={false} 
        onReplyClick={openReplyBox} 
        onDelete={handleLocalDelete} 
      />

      {/* 2. Render Nested Replies (Flat YouTube Style) */}
      {replies.length > 0 && (
        <div className="mt-2 flex flex-col gap-3 pl-14">
          {replies.map((reply) => (
            <CommentBody 
              key={reply._id} 
              data={reply} 
              isReply={true} 
              onReplyClick={openReplyBox} 
              onDelete={handleLocalDelete} 
            />
          ))}
        </div>
      )}

      {/* 3. The Reply Input Box (Appears at the bottom of the thread) */}
      {isReplyOpen && (
        <form onSubmit={handleReplySubmit} className="mt-3 flex gap-3 pl-14 pr-4">
          <img src={user?.avatar || "https://ui-avatars.com/api/?name=User"} alt="You" className="w-6 h-6 rounded-full object-cover shrink-0 mt-1" />
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
              <button type="button" onClick={() => { setIsReplyOpen(false); setReplyText(""); }} className="px-3 py-1 text-xs text-brand-muted hover:text-white font-medium rounded-full">Cancel</button>
              <button type="submit" disabled={submittingReply || !replyText.trim()} className="bg-brand-accent text-white px-3 py-1 text-xs font-medium rounded-full disabled:opacity-50">
                {submittingReply ? "..." : "Reply"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default CommentCard;