import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPublicBlogs } from '../services/api';
import { Search } from 'lucide-react';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getPublicBlogs();
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stripHtml(blog.content).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Note <span className="text-blue-500">it</span>
          </h1>
          <p className="text-xl text-gray-600">Discover insightful articles and stories</p>
        </header>

        <div className="mb-12 relative">
          <input
            type="text"
            placeholder="Search blogs..."
            className="w-full p-4 pr-12 rounded-full bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
        </div>

        {filteredBlogs.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No public blogs available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredBlogs.map((blog) => (
              <div key={blog._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 hover:text-blue-500 transition duration-300 ease-in-out">
                    <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                  </h2>
                  <p className="text-sm text-gray-500 mb-4 flex items-center">
                    <span className="mr-2">{blog.author.username}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </p>
                  <p className="text-gray-600 mb-6">{stripHtml(blog.content).substring(0, 100)}...</p>
                  <Link
                    to={`/blog/${blog._id}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 ease-in-out"
                  >
                    Read More
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;