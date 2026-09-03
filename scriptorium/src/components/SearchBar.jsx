import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';

function SearchBar({ large = true, initialValue = '' }) {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${large ? 'max-w-2xl' : ''}`} role="search">
      <Search className={`absolute left-4 top-1/2 -translate-y-1/2 text-burgundy-700 ${large ? 'h-5 w-5' : 'h-4 w-4'}`} />
      <label className="sr-only" htmlFor={large ? 'hero-search' : 'book-search'}>Search books</label>
      <input id={large ? 'hero-search' : 'book-search'} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title, author, or subject" className={`w-full border border-burgundy-900/30 bg-cream-50 text-gray-900 outline-none placeholder:text-gray-500 focus:border-burgundy-800 focus:ring-1 focus:ring-burgundy-800 ${large ? 'py-4 pl-12 pr-16 text-base sm:py-5 sm:pl-13 sm:pr-36 sm:text-lg' : 'py-3 pl-10 pr-4 text-sm'}`} />
      {large && <button type="submit" className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center bg-burgundy-800 text-cream-50 hover:bg-burgundy-900 sm:w-auto sm:px-5"><span className="hidden text-sm font-semibold sm:inline">Find a book</span><ArrowRight className="h-4 w-4 sm:ml-2" /></button>}
    </form>
  );
}

export default SearchBar;
