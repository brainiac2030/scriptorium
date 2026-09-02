import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Search, LogOut, User, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef(null);

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="glass border-b border-burgundy-100 sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative">
              <div className="bg-gradient-to-br from-burgundy-600 to-burgundy-800 p-2.5 rounded-xl group-hover:shadow-glow transition-all duration-300">
                <BookOpen className="w-6 h-6 text-cream-50" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="font-serif text-2xl font-bold text-gradient">
                Scriptorium
              </span>
              <p className="text-xs text-gray-500 -mt-1">Your personal library</p>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-burgundy-600 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search titles, authors, genres..."
                className="w-full pl-12 pr-4 py-2.5 bg-white border-2 border-cream-300 rounded-full focus:outline-none focus:border-burgundy-500 focus:shadow-lift transition-all placeholder-gray-400 text-sm"
              />
            </form>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile search button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 text-burgundy-700 hover:bg-burgundy-50 rounded-full transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white rounded-full hover:shadow-lift transition-all font-medium text-sm"
                >
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">
                    {user.username}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lift border border-burgundy-100 py-2 animate-scaleIn z-50">
                    <div className="px-4 py-2 border-b border-burgundy-50">
                      <p className="text-sm font-semibold text-burgundy-800 truncate">
                        {user.username}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-cream-100 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-burgundy-600" />
                      My Library
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-4 py-2 text-burgundy-700 hover:bg-burgundy-50 rounded-full font-medium text-sm transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white rounded-full hover:shadow-lift transition-all font-medium text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-slideUp">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books..."
                autoFocus
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-cream-300 rounded-full focus:outline-none focus:border-burgundy-500 transition-all placeholder-gray-400"
              />
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;