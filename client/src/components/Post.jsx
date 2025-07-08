import React from "react";
import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Smile,
} from "lucide-react";

const Post = ({
  post,
  dogImage,
  comments,
  onCommentAdded,
  user,
  onEdit,
  onDeleted,
}) => {
  const [showAllComments, setShowAllComments] = React.useState(false);
  const [commentText, setCommentText] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const commentInputRef = React.useRef(null);

  // Determine if user is author or admin
  const isAuthor = user && post.author._id && user.userId === post.author._id;
  const isAdmin = user && user.role === "admin";
  console.log(post.author._id);
  console.log(user.userId);
  console.log(post);

  const handleCommentIconClick = () => {
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  const handleInputChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
        },
        body: JSON.stringify({ text: commentText, postId: post._id }),
        credentials: "include",
      });
      if (res.ok) {
        setCommentText("");
        if (typeof onCommentAdded === "function") {
          await onCommentAdded(); // Ask parent to refresh comments
        }
      } else {
        const data = await res.json();
        alert(data.error || "Failed to add comment");
      }
    } catch (err) {
      // Optionally handle error
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !submitting) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };

  // Format the createdAt date to a readable time (e.g., '2h ago')
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // in seconds
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Delete post handler
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${post._id}`, {
        method: "DELETE",
        headers: {
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
        },
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete post");
        return;
      }
      if (typeof onDeleted === "function") onDeleted();
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  return (
    <article className="bg-white border border-gray-200 rounded-lg mb-6 max-w-[470px] text-black">
      {/* Post Header */}
      <div className="flex items-center p-3">
        <img
          className="w-8 h-8 rounded-full"
          src={"https://placehold.co/48x48/8E44AD/FFFFFF?text=U"}
          alt={post.author?.username || "User"}
        />
        <span className="font-bold ml-3 mr-1">
          {post.author?.username || "Unknown"}
        </span>
        <span className="text-gray-500 text-sm">
          {" "}
          • {getTimeAgo(post.createdAt)}
        </span>
        <button className="ml-auto">
          <MoreHorizontal size={20} />
        </button>
        {(isAuthor || isAdmin) && (
          <>
            <button
              className="ml-2 text-xs text-blue-500 hover:underline"
              onClick={onEdit}
            >
              Edit
            </button>
            <button
              className="ml-2 text-xs text-red-500 hover:underline"
              onClick={handleDelete}
            >
              Delete
            </button>
          </>
        )}
      </div>

      {/* Post Image */}
      <div>
        <img
          className="w-full object-cover"
          src={dogImage || post.imageUrl}
          alt="Post content"
        />
      </div>

      {/* Post Actions */}
      <div className="flex justify-between p-3">
        <div className="flex space-x-4">
          <button>
            <Heart size={24} />
          </button>
          <button onClick={handleCommentIconClick}>
            <MessageCircle size={24} />
          </button>
          <button>
            <Send size={24} />
          </button>
        </div>
        <div>
          <button>
            <Bookmark size={24} />
          </button>
        </div>
      </div>

      {/* Post Info */}
      <div className="px-3 pb-3">
        <p className="font-bold text-sm">
          {post.likes?.toLocaleString() || 0} likes
        </p>
        <p className="text-sm mt-1">
          <span className="font-bold mr-2">
            {post.author?.username || "Unknown"}
          </span>
          {post.caption}
        </p>
        {/* Comments Section */}
        <div className="mt-2">
          {comments === undefined ? (
            <p className="text-gray-400 text-sm">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-400 text-sm">No comments yet.</p>
          ) : (
            <>
              {(showAllComments
                ? comments
                : [comments[comments.length - 1]]
              ).map((comment) => (
                <div key={comment._id} className="flex items-start mb-1">
                  <span className="font-bold mr-2 text-sm">
                    {comment.author?.username || "User"}
                  </span>
                  <span className="text-sm">{comment.text}</span>
                  <span className="text-gray-400 text-xs ml-2">
                    • {getTimeAgo(comment.createdAt)}
                  </span>
                </div>
              ))}
              {comments.length > 1 && !showAllComments && (
                <button
                  className="text-blue-500 text-xs mt-1"
                  onClick={() => setShowAllComments(true)}
                >
                  View all {comments.length} comments
                </button>
              )}
              {showAllComments && comments.length > 1 && (
                <button
                  className="text-blue-500 text-xs mt-1"
                  onClick={() => setShowAllComments(false)}
                >
                  Hide comments
                </button>
              )}
            </>
          )}
        </div>
        <div className="flex items-center mt-2">
          <input
            type="text"
            placeholder="Add a comment..."
            className="bg-transparent border-none w-full focus:outline-none text-sm"
            ref={commentInputRef}
            value={commentText}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            disabled={submitting}
          />
          <button
            className="ml-2 text-blue-500 text-xs font-bold disabled:opacity-50"
            onClick={handleCommentSubmit}
            disabled={submitting || !commentText.trim()}
            aria-label="Post comment"
            type="button"
          >
            Post
          </button>
          <Smile size={16} className="text-gray-400 ml-2" />
        </div>
      </div>
    </article>
  );
};

export default Post;
