import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="What do you want to read next?"
        className="w-full pl-12 pr-4 py-4 bg-white border border-burgundy-200 rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent transition-all text-lg placeholder-gray-400"
      />
      <button 
        type="submit" 
        className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-burgundy-600 text-white font-medium rounded-xl hover:bg-burgundy-700 transition-colors"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;