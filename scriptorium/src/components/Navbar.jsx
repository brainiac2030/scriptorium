import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Compass, Library, LogOut, Menu, Search, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Wordmark() {
  return <span className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-burgundy-800 text-cream-50 shadow-sm"><BookOpen className="h-5 w-5" /></span><span className="font-serif text-xl font-bold tracking-tight text-burgundy-900">Scriptorium</span></span>;
}

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const accountRef = useRef(null);

  useEffect(() => { setMobileOpen(false); }, [location.pathname, location.search]);
  useEffect(() => {
    const close = (event) => accountRef.current && !accountRef.current.contains(event.target) && setAccountOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const search = (event) => { event.preventDefault(); if (query.trim()) { navigate(`/search?q=${encodeURIComponent(query.trim())}`); setQuery(''); } };
  const signOut = () => { logout(); setAccountOpen(false); setMobileOpen(false); navigate('/'); };
  const navClass = ({ isActive }) => `relative py-6 text-sm font-semibold ${isActive ? 'text-burgundy-800 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-burgundy-700' : 'text-gray-600 hover:text-burgundy-800'}`;

  return <>
    <header className="sticky top-0 z-40 border-b border-burgundy-900/10 bg-cream-50/95 shadow-[0_1px_10px_rgba(47,29,24,.04)] backdrop-blur-xl">
      <div className="page-shell flex h-[70px] items-center gap-8">
        <Link to="/" aria-label="Scriptorium home" className="shrink-0"><Wordmark /></Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary navigation"><NavLink to="/" end className={navClass}>Discover</NavLink><NavLink to="/search" className={navClass}>Browse</NavLink>{user && <NavLink to="/dashboard" className={navClass}>My books</NavLink>}</nav>
        <form onSubmit={search} className="ml-auto hidden w-full max-w-md md:block" role="search"><label className="relative block"><span className="sr-only">Search books</span><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search books, authors, ISBNs" className="w-full rounded-xl border border-burgundy-900/15 bg-cream-100 py-2.5 pl-10 pr-3 text-sm outline-none placeholder:text-gray-500 focus:border-burgundy-600 focus:bg-white focus:ring-2 focus:ring-burgundy-100" /></label></form>
        <div className="hidden items-center gap-2 sm:flex">{user ? <div className="relative" ref={accountRef}><button onClick={() => setAccountOpen(!accountOpen)} className="flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-burgundy-900 hover:bg-cream-200" aria-expanded={accountOpen}><span className="grid h-7 w-7 place-items-center rounded-full bg-burgundy-100 text-burgundy-700"><User className="h-4 w-4" /></span><span className="max-w-24 truncate">{user.username}</span></button>{accountOpen && <div className="absolute right-0 mt-2 w-60 rounded-xl border border-burgundy-900/10 bg-cream-50 p-2 shadow-xl"><div className="border-b border-burgundy-900/10 px-3 py-2.5"><p className="text-sm font-bold text-burgundy-900">{user.username}</p><p className="truncate text-xs text-gray-500">{user.email}</p></div><Link to="/dashboard" onClick={() => setAccountOpen(false)} className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-cream-200"><Library className="h-4 w-4" />My library</Link><button onClick={signOut} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-700 hover:bg-red-50"><LogOut className="h-4 w-4" />Sign out</button></div>}</div> : <><Link to="/login" className="px-3 py-2 text-sm font-semibold text-burgundy-900">Sign in</Link><Link to="/signup" className="button-primary">Join Scriptorium</Link></>}</div>
        <button className="ml-auto grid h-10 w-10 place-items-center rounded-xl border border-burgundy-900/15 md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      </div>
      {mobileOpen && <div className="border-t border-burgundy-900/10 bg-cream-50 px-5 py-5 md:hidden"><form onSubmit={search} className="relative mb-4"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search books and authors" className="field pl-10" autoFocus /></form><nav className="space-y-1"><Link to="/" className="flex items-center gap-3 rounded-lg px-2 py-3 font-semibold text-burgundy-900"><Compass className="h-4 w-4" />Discover</Link><Link to="/search" className="flex items-center gap-3 rounded-lg px-2 py-3 font-semibold text-burgundy-900"><Search className="h-4 w-4" />Browse</Link>{user && <><Link to="/dashboard" className="flex items-center gap-3 rounded-lg px-2 py-3 font-semibold text-burgundy-900"><Library className="h-4 w-4" />My library</Link><button onClick={signOut} className="flex w-full items-center gap-3 rounded-lg px-2 py-3 font-semibold text-red-700"><LogOut className="h-4 w-4" />Sign out</button></>}</nav>{!user && <div className="mt-4 grid grid-cols-2 gap-3"><Link to="/login" className="button-secondary">Sign in</Link><Link to="/signup" className="button-primary">Join free</Link></div>}</div>}
    </header>
    {user && <><nav className="fixed inset-x-0 bottom-0 z-40 grid h-16 grid-cols-3 border-t border-burgundy-900/10 bg-cream-50/95 px-4 backdrop-blur-xl sm:hidden" aria-label="Mobile navigation"><Link to="/" className={`flex flex-col items-center justify-center gap-1 text-[10px] font-semibold ${location.pathname === '/' ? 'text-burgundy-700' : 'text-gray-500'}`}><Compass className="h-5 w-5" />Discover</Link><Link to="/search" className={`flex flex-col items-center justify-center gap-1 text-[10px] font-semibold ${location.pathname === '/search' ? 'text-burgundy-700' : 'text-gray-500'}`}><Search className="h-5 w-5" />Search</Link><Link to="/dashboard" className={`flex flex-col items-center justify-center gap-1 text-[10px] font-semibold ${location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/collections') ? 'text-burgundy-700' : 'text-gray-500'}`}><Library className="h-5 w-5" />My books</Link></nav><div className="h-16 sm:hidden" /></>}
  </>;
}

export default Navbar;
