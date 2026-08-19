import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
          PageTurner
        </Link>
        <div className="hidden sm:block text-sm text-gray-500">
          Discover your next favorite read
        </div>
      </div>
    </nav>
  );
}
export default Navbar;