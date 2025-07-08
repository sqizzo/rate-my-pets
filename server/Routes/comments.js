const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { default: mongoose } = require('mongoose');

const router = express.Router();

// middleware
const authMiddleware = require('../middleware/auth');
const emailVerificationMiddleware = require('../middleware/emailVerification');

// Create comment for specific post
// url: /comments
router.post(
	'/',
	authMiddleware,
	emailVerificationMiddleware,
	async (req, res) => {
		try {
			const { text, postId } = req.body;
			const author = req.user.id;

			if (!text?.trim() || !postId) {
				return res
					.status(400)
					.json({ error: 'Text and postId are required' });
			}

			const newComments = await Comment.create({ text, author, postId });
			res.status(201).json(newComments);
		} catch (error) {
			res.status(500).json({ error: 'Failed to create comment' });
		}
	}
);

// Get comment for specific post
// url: /comments/:postId
router.get('/:postId', async (req, res) => {
	const { postId } = req.params;
	if (!mongoose.isValidObjectId(postId)) {
		return res.status(400).json({ error: 'Invalid post ID' });
	}
	try {
		const postExists = await Post.findById(postId);
		if (!postExists) {
			return res.status(404).json({ error: 'Post was not found' });
		}

		const comments = await Comment.find({ postId })
			.sort({ createdAt: -1 })
			.populate('author', 'username');

		res.status(200).json(comments);
	} catch (error) {
		res.status(500).json({
			error: 'Failed to fetch comments from the server',
		});
	}
});

module.exports = router;
