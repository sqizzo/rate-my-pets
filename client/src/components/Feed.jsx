import React, { useEffect, useState } from "react";
import Stories from "./Stories";
import Post from "./Post";

const Feed = ({ storiesData }) => {
  const [postsData, setPostsData] = useState([]);
  const [dogImages, setDogImages] = useState([]);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/posts")
      .then((res) => res.json())
      .then(async (data) => {
        setPostsData(data);
        // Fetch a random dog image for each post
        // const dogImagePromises = data.map(() =>
        //   fetch("https://random.dog/woof.json?ref=apilist.fun")
        //     .then((res) => res.json())
        //     .then((dogData) => dogData.url)
        //     .catch(() => null)
        // );
        // const images = await Promise.all(dogImagePromises);
        // setDogImages(images);
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
  }, []);

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
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Feed;
