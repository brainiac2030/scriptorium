import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

function Footer() {
  return (
    <footer className="border-t border-burgundy-900/15 bg-burgundy-900 text-cream-100">
      <div className="page-shell py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div><p className="font-serif text-2xl font-bold">Scriptorium</p><p className="mt-3 max-w-sm text-sm leading-6 text-cream-300">A quieter place to discover books, shape a personal library, and keep a record of the reading life.</p></div>
          <div><p className="eyebrow !text-cream-400">Explore</p><div className="mt-4 flex flex-col gap-3 text-sm"><Link to="/" className="hover:text-white">Discover books</Link><Link to="/dashboard" className="hover:text-white">My library</Link></div></div>
          <div><p className="eyebrow !text-cream-400">Book data</p><a href="https://openlibrary.org" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm hover:text-white">Open Library <ArrowUpRight className="h-3.5 w-3.5" /></a><p className="mt-3 text-xs leading-5 text-cream-400">Digitized editions are provided by Internet Archive.</p></div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-5 text-xs text-cream-400">© {new Date().getFullYear()} Scriptorium. Read with intention.</div>
      </div>
    </footer>
  );
}

export default Footer;
