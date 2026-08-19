import { Link } from 'react-router-dom';
import { BookOpen, Search } from 'lucide-react';

function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-burgundy-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-burgundy-600 p-2 rounded-lg group-hover:bg-burgundy-700 transition-colors">
              <BookOpen className="w-6 h-6 text-cream-50" />
            </div>
            <span className="font-serif text-2xl font-bold text-burgundy-700 group-hover:text-burgundy-800 transition-colors">
              Scriptorium
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form action="/search" method="GET" className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="q"
                placeholder="Search titles, authors, genres..."
                className="w-full pl-10 pr-4 py-2.5 bg-cream-100 border border-burgundy-200 rounded-full focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent transition-all placeholder-gray-400"
              />
            </form>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-burgundy-600 text-cream-50 rounded-full hover:bg-burgundy-700 transition-colors font-medium text-sm shadow-sm">
              <span>My Library</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;