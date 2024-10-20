// const express = require('express');
// const router = express.Router();
// const Blog = require('../models/Blog');
// const auth = require('../middleware/auth');

// // Get all public blogs
// router.get('/public', async (req, res) => {
//   try {
//     const blogs = await Blog.find({ isPublic: true }).populate('author', 'username');
//     res.json(blogs);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch blogs' });
//   }
// });

// // Get user's blogs
// router.get('/my', auth, async (req, res) => {
//   try {
//     const blogs = await Blog.find({ author: req.userId });
//     res.json(blogs);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch blogs' });
//   }
// });

// // Create a new blog
// router.post('/', auth, async (req, res) => {
//   try {
//     const { title, content, isPublic } = req.body;
//     const blog = new Blog({ title, content, isPublic, author: req.userId });
//     await blog.save();
//     res.status(201).json(blog);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to create blog' });
//   }
// });

// // Update a blog
// router.put('/:id', auth, async (req, res) => {
//   try {
//     const { title, content, isPublic } = req.body;
//     const blog = await Blog.findOneAndUpdate(
//       { _id: req.params.id, author: req.userId },
//       { title, content, isPublic, updatedAt: Date.now() },
//       { new: true }
//     );
//     if (!blog) {
//       return res.status(404).json({ error: 'Blog not found' });
//     }
//     res.json(blog);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to update blog' });
//   }
// });

// // Delete a blog
// router.delete('/:id', auth, async (req, res) => {
//   try {
//     const blog = await Blog.findOneAndDelete({ _id: req.params.id, author: req.userId });
//     if (!blog) {
//       return res.status(404).json({ error: 'Blog not found' });
//     }
//     res.json({ message: 'Blog deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to delete blog' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all public blogs
router.get('/public', async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublic: true }).populate('author', 'username');
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Get user's blogs
router.get('/my', auth, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.userId });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Create a new blog
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;
    const blog = new Blog({ title, content, isPublic, author: req.userId });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

// Update a blog
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;
    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, author: req.userId },
      { title, content, isPublic, updatedAt: Date.now() },
      { new: true }
    );
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

// Delete a blog
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ _id: req.params.id, author: req.userId });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

// New routes

// Get a single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'username');
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

// Get comments for a blog
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.id }).populate('author', 'username');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Add a comment to a blog
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const comment = new Comment({
      content,
      author: req.userId,
      blog: req.params.id,
    });
    await comment.save();
    await comment.populate('author', 'username');
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Get public blogs for a specific user
router.get('/user/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const blogs = await Blog.find({ author: user._id, isPublic: true });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user blogs' });
  }
});

module.exports = router;