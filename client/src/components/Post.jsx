import React from "react";
import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Smile,
} from "lucide-react";

const Post = ({ post, dogImage }) => {
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
          <button>
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
        {/* Comments placeholder, since API does not provide commentsCount */}
        {/* <p className="text-gray-500 text-sm mt-2 cursor-pointer">
          View all X comments
        </p> */}
        <div className="flex items-center mt-2">
          <input
            type="text"
            placeholder="Add a comment..."
            className="bg-transparent border-none w-full focus:outline-none text-sm"
          />
          <Smile size={16} className="text-gray-400" />
        </div>
      </div>
    </article>
  );
};

export default Post;
