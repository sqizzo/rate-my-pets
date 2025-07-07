const Post = require("../models/Post");

const checkPermission = async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id).populate("author");
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (!(post.author.id === req.user.id || req.user.role === "admin")) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "Server cannot authorize" });
  }
};

module.exports = checkPermission;
