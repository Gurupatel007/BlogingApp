import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r bg-gray-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-semibold tracking-wider">
          GT Blog
        </Link>
        <div className="hidden md:flex space-x-6 items-center text-lg font-light">
          <Link to="/" className="hover:text-gray-300 transition ease-in-out duration-300">
            Home
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-300 transition ease-in-out duration-300">
                Dashboard
              </Link>
              <Link to="/create-blog" className="hover:text-gray-300 transition ease-in-out duration-300">
                Create Blog
              </Link>
              <button
                onClick={logout}
                className="hover:text-gray-300 rounded-md transition ease-in-out duration-300 focus:outline-none">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300 transition ease-in-out duration-300">
                Login
              </Link>
              <Link to="/register" className="hover:text-gray-300 transition ease-in-out duration-300">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none text-white">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              {isMenuOpen ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-4">
          <Link to="/" className="block py-2 hover:text-gray-300">
            Home
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="block py-2 hover:text-gray-300">
                Dashboard
              </Link>
              <Link to="/create-blog" className="block py-2 hover:text-gray-300">
                Create Blog
              </Link>
              <button onClick={logout} className="block rounded-md py-2 hover:text-gray-300 w-full text-left">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 hover:text-gray-300">
                Login
              </Link>
              <Link to="/register" className="block py-2 hover:text-gray-300">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
