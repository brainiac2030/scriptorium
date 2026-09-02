import { BookOpen, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-white border-t border-burgundy-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-burgundy-600 to-burgundy-800 p-2 rounded-lg">
              <BookOpen className="w-5 h-5 text-cream-50" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold text-burgundy-700">
                Scriptorium
              </span>
              <p className="text-xs text-gray-500 -mt-0.5">
                Your personal digital library
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link
              to="/"
              className="hover:text-burgundy-700 transition-colors"
            >
              Discover
            </Link>
            <Link
              to="/dashboard"
              className="hover:text-burgundy-700 transition-colors"
            >
              My Library
            </Link>
            <a
              href="https://openlibrary.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-burgundy-700 transition-colors"
            >
              Open Library
            </a>
          </div>

          {/* Credit */}
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-burgundy-50 text-center text-xs text-gray-400">
          Book data powered by{' '}
          <a
            href="https://openlibrary.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-burgundy-600 hover:underline"
          >
            Open Library
          </a>
          {' '}· Digitized books via Internet Archive
        </div>
      </div>
    </footer>
  );
}

export default Footer;