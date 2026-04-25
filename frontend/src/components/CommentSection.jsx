import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { commentService } from "../services/comment.service";
import { formatTimeAgo } from "../utils/formatters";
import { useAuth } from "../context/AuthContext";

const CommentSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm();

  // Fetch comments when the component loads
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await commentService.getVideoComments(videoId);
        setComments(response.data?.docs || []);
      } catch (error) {
        console.error("Failed to load comments", error);
      } finally {
        setLoading(false);
      }
    };
    if (videoId) fetchComments();
  }, [videoId]);

  // Handle posting a new comment
  const onSubmit = async (data) => {
    if (!data.content.trim()) return;
    try {
      const response = await commentService.addComment(videoId, data.content);
      // Add the new comment to the top of the list instantly
      setComments((prev) => [response.data, ...prev]);
      reset(); // Clear the input field
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-white font-bold text-lg mb-4">{comments.length} Comments</h3>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 mb-8">
          <img src={user.avatar} alt="You" className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1 flex flex-col items-end gap-2">
            <input
              {...register("content", { required: true })}
              placeholder="Add a comment..."
              className="w-full bg-transparent border-b border-brand-secondary focus:border-brand-accent pb-2 text-white outline-none transition-colors"
            />
            <button type="submit" className="bg-brand-secondary hover:bg-brand-accent text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
              Comment
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-brand-secondary/30 p-4 rounded-lg text-brand-muted text-sm mb-8 text-center">
          Please sign in to leave a comment.
        </div>
      )}

      {/* Comments List */}
      <div className="flex flex-col gap-6">
        {loading ? (
          <p className="text-brand-muted">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-brand-muted">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              {/* Note: In a full app, you'd populate the owner details in the backend aggregation. 
                  If owner is just an ID right now, we use a placeholder avatar. */}
              <img 
                src={comment.owner?.avatar || "https://via.placeholder.com/150"} 
                alt="User" 
                className="w-10 h-10 rounded-full object-cover" 
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold text-sm">
                    {comment.owner?.username || "User"}
                  </span>
                  <span className="text-brand-muted text-xs">
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="text-brand-text text-sm mt-1">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;