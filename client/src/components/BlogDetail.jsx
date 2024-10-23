import React, { useState, useEffect, useContext } from 'react';
import { useParams,Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import DOMPurify from 'dompurify';
import 'react-quill/dist/quill.snow.css';
import { getBlogById, addComment, getComments, updateBlog } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBlogAndComments = async () => {
      try {
        const [blogResponse, commentsResponse] = await Promise.all([
          getBlogById(id),
          getComments(id)
        ]);
        setBlog(blogResponse.data);
        setEditedContent(blogResponse.data.content);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error fetching blog and comments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogAndComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addComment(id, { content: newComment });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      await updateBlog(id, { content: editedContent });
      setBlog({ ...blog, content: editedContent });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  const SafeHTML = ({ html }) => {
    return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) {
    return <div className={"text-center text-red-500 text-2xl font-bold mt-10"}>Blog not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
            <div className="p-8 bg-gradient-to-r from-blue-400 via-sky-500 to-blue-400 text-white">
              <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
              <div className="text-gray-100">
                <Link to={`/u/${blog.author.username}`} className="font-semibold hover:underline">
                  {blog.author.username}
                </Link>
                <span className="ml-2">{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="p-8">
              {isEditing ? (
                <div>
                  <ReactQuill 
                    value={editedContent} 
                    onChange={setEditedContent}
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline'],
                        [{'list': 'ordered'}, {'list': 'bullet'}],
                        ['link'],
                        ['clean']
                      ],
                    }}
                    className="mb-6"
                  />
                  <div className="flex justify-end space-x-4">
                    <button 
                      onClick={handleEditSubmit}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full transition duration-300 transform hover:scale-105"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-full transition duration-300 transform hover:scale-105"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <SafeHTML html={blog.content} />
                </div>
              )}
            </div>
          </div>
          
          {user && user._id === blog.author._id && !isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
            >
              Edit Blog
            </button>
          )}
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg sticky top-8 transition-all duration-300 hover:shadow-2xl">
            <div className="p-6 bg-gradient-to-r from-green-400 to-blue-500 text-white">
              <h2 className="text-2xl font-bold">Comments</h2>
            </div>
            <div className="p-6">
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto space-y-6 mb-6">
                {comments.map((comment) => (
                  <div key={comment._id} className="bg-gray-50 p-4 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-blue-600">{comment.author.username}</span>
                      <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))}
              </div>
              
              {user && (
                <form onSubmit={handleCommentSubmit}>
                  <textarea
                    className="w-full p-4 border rounded-2xl resize-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition duration-300"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows="3"
                    required
                  />
                  <button 
                    type="submit" 
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
                  >
                    Post Comment
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;