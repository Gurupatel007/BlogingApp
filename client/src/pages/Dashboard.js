import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserBlogs, deleteBlog } from '../services/api';
import { Trash2, Edit, Plus, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await getUserBlogs();
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching user blogs:', error);
    }
  };

  // const handleDelete = async (id) => {
  //   try {
  //     await deleteBlog(id);
  //     fetchBlogs();
  //   } catch (error) {
  //     console.error('Error deleting blog:', error);
  //   }
  // };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });
  
    if (result.isConfirmed) {
      try {
        await deleteBlog(id);
        fetchBlogs(); // Refresh the list of blogs after deletion
        MySwal.fire('Deleted!', 'Your blog has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting blog:', error);
        MySwal.fire('Error', 'Something went wrong.', 'error');
      }
    }
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          My Blogs
        </h1>
        <Link
          to="/create-blog"
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          <Plus size={20} />
          <span>Create New Blog</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 truncate mb-2">
                {blog.title}
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-700 line-clamp-3">
                {stripHtml(blog.content)}
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {blog.isPublic ? (
                  <Eye size={18} className="text-green-500" />
                ) : (
                  <EyeOff size={18} className="text-yellow-500" />
                )}
                <span className={blog.isPublic ? 'text-green-500' : 'text-yellow-500'}>
                  {blog.isPublic ? 'Public' : 'Private'}
                </span>
              </div>
              <div className="flex space-x-2">
                <Link
                  to={`/edit-blog/${blog._id}`}
                  className="text-blue-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition duration-300"
                >
                  <Edit size={18} />
                </Link>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition duration-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;