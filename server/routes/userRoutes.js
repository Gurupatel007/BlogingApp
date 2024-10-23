const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const User = require('../models/User');

// Get public blogs for a specific user
router.get('/:username', async (req, res) => {
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