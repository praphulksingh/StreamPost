import { useState, useEffect } from "react";
import { FiThumbsUp, FiThumbsDown, FiTrash2, FiMessageSquare } from "react-icons/fi";
import { formatTimeAgo } from "../utils/formatters";
import { likeService } from "../services/like.service";
import { commentService } from "../services/comment.service";
import { useAuth } from "../context/AuthContext";
import CommentCard from "./CommentCard"; // We reuse our powerhouse component!

const TweetCard = ({ tweet, onDelete }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(tweet.isLiked || false);
  const [likeCount, setLikeCount] = useState(tweet.likesCount || 0);
  
  // NEW STATES FOR COMMENTS
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  const handleLike = async () => {
    try {
      const res = await likeService.toggleTweetLike(tweet._id);
      setIsLiked(res.data.isLiked);
      setLikeCount(prev => res.data.isLiked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error("Failed to toggle tweet like", error);
    }
  };

  // Fetch comments only when the user clicks the "Comments" button
  useEffect(() => {
    if (showComments && comments.length === 0) {
      const fetchComments = async () => {
        setLoadingComments(true);
        try {
          const res = await commentService.getTweetComments(tweet._id);
          setComments(res.data?.docs || res.data || []);
        } catch (error) {
          console.error("Failed to fetch tweet comments", error);
        } finally {
          setLoadingComments(false);
        }
      };
      fetchComments();
    }
  }, [showComments, tweet._id]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      setSubmittingComment(true);
      const res = await commentService.addTweetComment(tweet._id, { content: newComment });
      const createdComment = { ...res.data, owner: user, likesCount: 0, isLiked: false, replies: [] };
      setComments([createdComment, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await commentService.deleteComment(commentId);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  return (
    <div className="bg-brand-secondary/20 border border-brand-secondary rounded-xl p-4 flex flex-col w-full">
      <div className="flex gap-4 group">
        <img src={tweet.owner?.avatar || "https://ui-avatars.com/api/?name=User"} alt="Avatar" className="w-12 h-12 rounded-full object-cover shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{tweet.owner?.fullName || "User"}</span>
            <span className="text-brand-muted text-sm">@{tweet.owner?.username} • {formatTimeAgo(tweet.createdAt)}</span>
          </div>
          <p className="text-brand-text mt-2 whitespace-pre-wrap text-[15px]">{tweet.content}</p>

          {/* Interaction Bar */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button onClick={handleLike} className={`p-2 rounded-full hover:bg-white/10 ${isLiked ? "text-brand-accent" : "text-brand-muted"}`}>
                  <FiThumbsUp className="w-4 h-4" />
                </button>
                <span className="text-sm text-brand-muted font-medium">{likeCount > 0 ? likeCount : ""}</span>
              </div>
              
              {/* 👇 THE MISSING DISLIKE BUTTON IS BACK 👇 */}
              <button 
                onClick={() => isLiked && handleLike()} 
                className="p-2 rounded-full hover:bg-white/10 text-brand-muted transition-colors"
              >
                <FiThumbsDown className="w-4 h-4" />
              </button>
            </div>
            
            {/* 👇 COMMENT BUTTON 👇 */}
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 p-2 rounded-full hover:bg-white/10 text-brand-muted transition-colors"
            >
              <FiMessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">Reply</span>
            </button>
          </div>
        </div>

        {user?._id === tweet.owner?._id && (
          <button onClick={() => onDelete(tweet._id)} className="opacity-0 group-hover:opacity-100 p-2 text-brand-muted hover:text-red-500 h-fit rounded-full hover:bg-white/10">
            <FiTrash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 👇 COMMENT SECTION DROPDOWN 👇 */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-white/5 pl-2 sm:pl-16">
          
          {user && (
            <form onSubmit={handlePostComment} className="flex gap-3 mb-6">
              <img src={user.avatar || "https://ui-avatars.com/api/?name=User"} alt="You" className="w-8 h-8 rounded-full object-cover shrink-0 mt-1" />
              <div className="flex flex-col w-full gap-2">
                <input 
                  type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Post a reply..."
                  className="bg-transparent border-b border-brand-secondary text-white text-sm pb-1 focus:outline-none focus:border-white"
                />
                {newComment.trim() && (
                  <div className="flex justify-end gap-2">
                    <button type="submit" disabled={submittingComment} className="bg-brand-accent text-white px-4 py-1.5 text-xs font-medium rounded-full disabled:opacity-50">
                      {submittingComment ? "..." : "Reply"}
                    </button>
                  </div>
                )}
              </div>
            </form>
          )}

          {loadingComments ? (
            <div className="text-brand-muted text-sm text-center">Loading replies...</div>
          ) : (
            <div className="flex flex-col gap-6">
              {comments.map((comment) => (
                <CommentCard key={comment._id} comment={comment} onDelete={handleDeleteComment} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TweetCard;