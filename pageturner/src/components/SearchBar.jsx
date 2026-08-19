import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to the search page and pass the query as a URL parameter (?q=...)
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px', maxWidth: '600px', margin: '0 auto 20px auto' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for books, authors..."
        style={{ flex: 1, padding: '12px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <button type="submit" style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white' }}>
        Search
      </button>
    </form>
  );
}

export default SearchBar;