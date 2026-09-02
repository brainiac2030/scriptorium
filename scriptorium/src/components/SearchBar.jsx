import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

function SearchBar({ large = true }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative w-full ${large ? 'max-w-xl mx-auto' : ''}`}
    >
      <Search
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 ${
          large ? 'w-5 h-5' : 'w-4 h-4'
        }`}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="What do you want to read next?"
        className={`w-full bg-white border border-burgundy-200 rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent transition-all placeholder-gray-400 ${
          large
            ? 'pl-12 pr-28 py-4 text-lg'
            : 'pl-10 pr-4 py-2.5 text-sm'
        }`}
      />
      {large && (
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-burgundy-600 text-white font-medium rounded-xl hover:bg-burgundy-700 transition-colors"
        >
          Search
        </button>
      )}
    </form>
  );
}

export default SearchBar;