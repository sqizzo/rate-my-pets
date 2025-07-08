const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const { default: mongoose } = require('mongoose');

const router = express.Router();

// middleware
const authMiddleware = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');
const emailVerificationMiddleware = require('../middleware/emailVerification');
const Comment = require('../models/Comment');

// Get all posts
// url: /posts
router.get('/', async (req, res) => {
	try {
		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate('author', 'username');
		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch the posts' });
	}
});

// Create post
// url: /posts

router.post(
	'/',
	authMiddleware,
	emailVerificationMiddleware,
	async (req, res) => {
		const { petName, category, imageUrl, caption } = req.body;

		const author = req.user.id;

		try {
			const newPost = await Post.create({
				petName,
				category,
				imageUrl,
				author,
				caption,
			});
			res.status(201).json(newPost);
		} catch (error) {
			res.status(500).json({ error: 'Failed to create post' });
		}
	}
);

// Like post
// url: /posts/:id/like
router.patch('/:id/like', authMiddleware, async (req, res) => {
	try {
		const { id } = req.params;

		const likedById = req.user.id;

		const post = await Post.findById(id);

		if (!post) {
			return res.status(404).json({ error: 'Target post was not found' });
		}

		if (post.likedBy.includes(likedById)) {
			return res
				.status(400)
				.json({ error: 'Post already liked by this user' });
		}

		post.likes += 1;
		post.likedBy.push(likedById);
		await post.save();

		res.status(200).json(post);
	} catch (error) {
		res.status(500).json({ error: 'Failed to like the post' });
	}
});

// Unlike post
// url: /posts/:id/unlike


router.patch('/:id/unlike', authMiddleware, async (req, res) => {
	try {
		const { id } = req.params;
		const likedById = req.user.id;

		const post = await Post.findById(id);

		if (!post) {
			return res.status(404).json({ error: 'Target post was not found' });
		}

		const alreadyLiked = post.likedBy.some((userId) =>
			userId.equals(likedById)
		);

		if (!alreadyLiked) {
			return res
				.status(400)
				.json({ error: 'Post was not liked by this user' });
		}

		const likedByIndex = post.likedBy.findIndex((userId) =>
			userId.equals(likedById)
		);

		post.likes = Math.max(0, post.likes - 1);
		post.likedBy.splice(likedByIndex, 1);
		await post.save();

		res.status(200).json(post);
	} catch (error) {
		res.status(500).json({ error: 'Failed to unlike the post' });
	}
});

// Get 7 most popular posts
// url: /posts/popular
router.get('/popular', async (req, res) => {
	try {
		const popularPosts = await Post.find({ likes: { $gt: 0 } })
			.sort({ likes: -1 })
			.limit(7)
			.populate('author', 'username');
		res.status(200).json(popularPosts);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch popular posts' });
	}
});


router.delete('/:id', authMiddleware, checkPermission, async (req, res) => {
	try {
		const { id } = req.params;


		const deletedPost = await Post.findByIdAndDelete(id);

		if (!deletedPost) {
			return res.status(404).json({ error: 'Target post was not found' });
		}

		const deleteComments = await Comment.deleteMany({ postId: id });

		res.status(200).json(deletedPost);
	} catch (error) {
		res.status(500).json({ error: 'Cannot delete the post' });
	}
});

router.put('/:id', authMiddleware, checkPermission, async (req, res) => {
	try {
		const { id } = req.params;
		const { petName, caption, imageUrl, category } = req.body;

		if (!petName?.trim() || !category?.trim() || !imageUrl?.trim()) {
			return res
				.status(400)
				.json({ error: 'Required field cannot be blank' });
		}

		const editedPost = await Post.findByIdAndUpdate(
			id,
			{
				petName,
				caption,
				imageUrl,
				category,
			},
			{ new: true }
		);

		if (!editedPost) {
			return res.status(404).json({ error: 'Target post was not found' });
		}

		res.status(200).json({ editedPost });
	} catch (error) {
		res.status(500).json({ error: 'Cannot edit the post' });
	}
});

module.exports = router;
