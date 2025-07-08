import React, { useEffect, useState } from "react";
import Stories from "./Stories";
import Post from "./Post";

const Feed = ({ storiesData, user, refreshFlag, onEditPost, onRefresh }) => {
  const [postsData, setPostsData] = useState([]);
  const [dogImages, setDogImages] = useState([]);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/posts")
      .then((res) => res.json())
      .then(async (data) => {
        setPostsData(data);
        // Fetch comments for each post
        const commentsPromises = data.map((post) =>
          fetch(`http://localhost:5000/api/comments/${post._id}`)
            .then((res) => res.json())
            .catch(() => [])
        );
        const commentsResults = await Promise.all(commentsPromises);
        // Map postId to comments
        const commentsMap = {};
        data.forEach((post, idx) => {
          commentsMap[post._id] = commentsResults[idx];
        });
        setCommentsByPost(commentsMap);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        // handle error
      });
  }, [refreshFlag]);

  // Add a function to refresh comments for a single post
  const refreshCommentsForPost = async (postId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/comments/${postId}`);
      const comments = await res.json();
      setCommentsByPost((prev) => ({ ...prev, [postId]: comments }));
    } catch {
      // Optionally handle error
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <main className="col-span-1 w-full max-w-[630px] mx-auto pt-8">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-[470px]">
          {/* <Stories storiesData={storiesData} /> */}
          <div className="mt-6">
            {postsData.map((post, idx) => (
              <Post
                key={post._id}
                post={post}
                dogImage={post.imageUrl}
                comments={commentsByPost[post._id] || []}
                onCommentAdded={() => refreshCommentsForPost(post._id)}
                user={user}
                onEdit={() => onEditPost && onEditPost(post)}
                onDeleted={onRefresh}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Feed;
