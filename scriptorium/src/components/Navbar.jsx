import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Search, LogOut, User, Library, Menu, X, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Wordmark() {
  return (
    <span className="flex items-center gap-3">
      <span className="grid h-8 w-7 place-items-center border border-burgundy-800 bg-burgundy-800 text-[11px] font-bold tracking-wide text-cream-50">S</span>
      <span className="font-serif text-xl font-bold tracking-tight text-burgundy-900">Scriptorium</span>
    </span>
  );
}

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef(null);

  useEffect(() => { setMobileOpen(false); }, [location.pathname, location.search]);
  useEffect(() => {
    const close = (event) => menuRef.current && !menuRef.current.contains(event.target) && setShowUserMenu(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
  };

  const navClass = ({ isActive }) => `text-sm font-medium ${isActive ? 'text-burgundy-800' : 'text-gray-600 hover:text-burgundy-800'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-burgundy-900/10 bg-cream-100/95 backdrop-blur-md">
      <div className="page-shell flex h-[68px] items-center gap-7">
        <Link to="/" aria-label="Scriptorium home" className="shrink-0"><Wordmark /></Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary navigation">
          <NavLink to="/" end className={navClass}>Discover</NavLink>
          {user && <NavLink to="/dashboard" className={navClass}>My library</NavLink>}
        </nav>

        <form onSubmit={handleSearch} className="ml-auto hidden w-full max-w-sm md:block">
          <label className="relative block">
            <span className="sr-only">Search books</span>
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search title, author, or subject" className="w-full border-b border-burgundy-900/25 bg-transparent py-2 pl-10 pr-3 text-sm outline-none placeholder:text-gray-500 focus:border-burgundy-700" />
          </label>
        </form>

        <div className="hidden items-center gap-3 sm:flex">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex h-10 items-center gap-2 border border-burgundy-900/20 px-3 text-sm font-medium text-burgundy-900 hover:bg-cream-50" aria-expanded={showUserMenu}>
                <User className="h-4 w-4" /><span className="max-w-24 truncate">{user.username}</span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 border border-burgundy-900/15 bg-cream-50 p-2 shadow-xl">
                  <div className="border-b border-burgundy-900/10 px-3 py-2.5"><p className="text-sm font-semibold text-burgundy-900">{user.username}</p><p className="truncate text-xs text-gray-500">{user.email}</p></div>
                  <Link to="/dashboard" onClick={() => setShowUserMenu(false)} className="mt-1 flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-cream-200"><Library className="h-4 w-4" />My library</Link>
                  <button onClick={() => { logout(); navigate('/'); }} className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-red-700 hover:bg-red-50"><LogOut className="h-4 w-4" />Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <><Link to="/login" className="px-3 py-2 text-sm font-semibold text-burgundy-900">Sign in</Link><Link to="/signup" className="button-primary">Start your library</Link></>
          )}
        </div>

        <button className="ml-auto grid h-10 w-10 place-items-center border border-burgundy-900/20 md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      </div>

      {mobileOpen && (
        <div className="border-t border-burgundy-900/10 bg-cream-50 px-5 py-5 md:hidden">
          <form onSubmit={handleSearch} className="relative mb-5"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /><input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search books" className="field pl-10" autoFocus /></form>
          <nav className="space-y-1"><Link to="/" className="flex items-center gap-3 py-3 font-medium text-burgundy-900"><Compass className="h-4 w-4" />Discover</Link>{user && <Link to="/dashboard" className="flex items-center gap-3 py-3 font-medium text-burgundy-900"><Library className="h-4 w-4" />My library</Link>}</nav>
          {!user && <div className="mt-4 grid grid-cols-2 gap-3"><Link to="/login" className="button-secondary">Sign in</Link><Link to="/signup" className="button-primary">Join free</Link></div>}
        </div>
      )}
    </header>
  );
}

export default Navbar;
