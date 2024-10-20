import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog } from '../services/api';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBlog({ title, content, isPublic });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-7xl mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-24 p-6 space-y-4">
        <h2 className="text-3xl font-bold mb-6">Create New Blog</h2>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your blog content here"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="10"
          ></textarea>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="public"
            className="rounded text-blue-500 focus:ring-blue-500"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <label htmlFor="public" className="text-sm text-gray-700">
            Make public
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Publish
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
