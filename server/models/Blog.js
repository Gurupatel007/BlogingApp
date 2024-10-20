const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Blog', BlogSchema);

// const BlogSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     content: { type: String, required: true },
//     author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     isPublic: { type: Boolean, default: true },
//     createdAt: { type: Date, default: Date.now },
//   });
  
//   module.exports = mongoose.model('Blog', BlogSchema);
  
  // models/Comment.js

//   const CommentSchema = new mongoose.Schema({
//     content: { type: String, required: true },
//     author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
//     createdAt: { type: Date, default: Date.now },
//   });
  
//   module.exports = mongoose.model('Comment', CommentSchema);