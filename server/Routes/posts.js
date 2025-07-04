const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");

const router = express.Router();

// middleware
const authMiddleware = require("../middleware/auth");

// Get all posts
// url: /posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "username");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the posts" });
  }
});

// Create post
// url: /posts
router.post("/", authMiddleware, async (req, res) => {
  const { petName, category, imageUrl } = req.body;

  const author = req.user.id;

  try {
    const newPost = await Post.create({ petName, category, imageUrl, author });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

// Like post
// url: /posts/:id/like
router.patch("/:id/like", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const likedPost = await Post.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!likedPost) {
      return res.status(404).json({ error: "Target post was not found" });
    }

    res.status(200).json(likedPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to like the post" });
  }
});

// Get 7 most popular posts
// url: /posts/popular
router.get("/popular", async (req, res) => {
  try {
    const popularPosts = await Post.find({ likes: { $gt: 0 } })
      .sort({ likes: -1 })
      .limit(7)
      .populate("author", "username");
    res.status(200).json(popularPosts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch popular posts" });
  }
});

module.exports = router;
