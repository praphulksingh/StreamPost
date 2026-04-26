import { useState, useEffect } from "react";
import { commentService } from "../services/comment.service";
import CommentCard from "./CommentCard";
import { useAuth } from "../context/AuthContext";

const CommentSection = ({ videoId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await commentService.getVideoComments(videoId);
        setComments(response.data?.docs || response.data || []);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      } finally {
        setLoading(false);
      }
    };

    if (videoId) fetchComments();
  }, [videoId]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const res = await commentService.addComment(videoId, { content: newComment });
      
      // Add the new comment to the top of the list locally
      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    
    try {
      await commentService.deleteComment(commentId);
      // Remove it from the local state
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  if (loading) {
    return <div className="text-brand-muted text-sm mt-4">Loading comments...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-white font-bold text-lg">{comments.length} Comments</h3>

      {/* Add Comment Input */}
      {user ? (
        <form onSubmit={handlePostComment} className="flex gap-4">
          <img 
            src={user.avatar || "https://ui-avatars.com/api/?name=User"} 
            alt="You" 
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
          <div className="flex flex-col w-full gap-2">
            <input 
              type="text" 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="bg-transparent border-b border-brand-secondary text-white pb-1 focus:outline-none focus:border-white transition-colors"
            />
            {newComment.trim() && (
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setNewComment("")}
                  className="px-4 py-2 text-sm text-brand-muted hover:text-white font-medium rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-brand-accent text-white px-4 py-2 text-sm font-medium rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-50"
                >
                  {submitting ? "Posting..." : "Comment"}
                </button>
              </div>
            )}
          </div>
        </form>
      ) : (
        <div className="p-4 bg-brand-secondary/30 rounded-xl text-center text-brand-muted text-sm">
          Please sign in to leave a comment.
        </div>
      )}

      {/* Render Comments List */}
      <div className="flex flex-col gap-6 mt-2">
        {comments.map((comment) => (
          <CommentCard 
            key={comment._id} 
            comment={comment} 
            onDelete={handleDeleteComment} 
          />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;