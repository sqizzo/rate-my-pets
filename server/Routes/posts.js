const express = require("express");
const Post = require("../models/Post");

const router = express.Router();
const postRoutes = require("../Routes/posts");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the posts" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { petName, category, imageUrl } = req.body;
    const newPost = await Post.create({ petName, category, imageUrl });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

module.exports = router;
