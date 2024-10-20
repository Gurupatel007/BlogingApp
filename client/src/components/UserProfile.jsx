import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserPublicBlogs } from '../services/api';
import Spinner from './Spinner';

const UserProfile = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const response = await getUserPublicBlogs(username);
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching user blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserBlogs();
  }, [username]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blogs by {username}</h1>
      {blogs.length === 0 ? (
        <p className="text-gray-600">No public blogs available for this user.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">
                <Link to={`/blog/${blog._id}`} className="text-blue-500 hover:underline">
                  {blog.title}
                </Link>
              </h3>
              <p className="text-gray-800">{blog.content.substring(0, 100)}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
