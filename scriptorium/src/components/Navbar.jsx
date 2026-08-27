import { Link } from 'react-router-dom';
import { BookOpen, Search, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

function Navbar() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="glass border-b border-burgundy-100 sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="bg-gradient-to-br from-burgundy-600 to-burgundy-800 p-2.5 rounded-xl group-hover:shadow-glow transition-all duration-300">
                <BookOpen className="w-6 h-6 text-cream-50" />
              </div>
              <div className="absolute inset-0 bg-burgundy-600 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold text-gradient group-hover:opacity-80 transition-opacity">
                Scriptorium
              </span>
              <p className="text-xs text-gray-500 -mt-1 hidden sm:block">Your personal library</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form action="/search" method="GET" className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-burgundy-600 transition-colors" />
              <input
                type="text"
                name="q"
                placeholder="Search titles, authors, genres..."
                className="w-full pl-12 pr-4 py-2.5 bg-white border-2 border-cream-300 rounded-full focus:outline-none focus:border-burgundy-500 focus:shadow-lift transition-all placeholder-gray-400"
              />
            </form>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white rounded-full hover:shadow-lift transition-all font-medium text-sm"
                >
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden sm:inline">{user.username}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lift border border-burgundy-100 py-2 animate-scaleIn">
                    <Link
                      to="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-cream-100 transition-colors"
                    >
                      My Library
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white rounded-full hover:shadow-lift transition-all font-medium text-sm"
              >
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;