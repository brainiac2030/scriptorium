import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data whenever the 'query' from the URL changes
  useEffect(() => {
    if (!query) return;

    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch books. Please try again.');
        }
        const data = await response.json();
        // Open Library returns the list of books inside the 'docs' array
        setBooks(data.docs || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [query]);

  return (
    <div>
      <h2>Search Results for "{query}"</h2>
      
      {/* Include the search bar again so users can easily search again */}
      <SearchBar />
      
      {/* 1. Loading State */}
      {loading && <p style={{ textAlign: 'center', fontSize: '18px' }}>Loading books...</p>}
      
      {/* 2. Error State */}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      
      {/* 3. Empty State */}
      {!loading && !error && books.length === 0 && query && (
        <p style={{ textAlign: 'center' }}>No books found for "{query}". Try a different search term.</p>
      )}

      {/* 4. Data Display State */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {}
        {books.slice(0, 20).map((book) => (
          <Link 
            to={`/book/${encodeURIComponent(book.key)}`} 
            key={book.key} 
            style={{ textDecoration: 'none', color: 'inherit', border: '1px solid #eee', padding: '10px', borderRadius: '8px', textAlign: 'center', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {}
            {book.cover_i ? (
              <img 
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`} 
                alt={`Cover of ${book.title}`} 
                style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/150x220?text=No+Cover'; }}
              />
            ) : (
              <div style={{ width: '100%', height: '220px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', marginBottom: '10px', color: '#999' }}>
                No Cover
              </div>
            )}
            
            <h3 style={{ margin: '0 0 5px', fontSize: '16px', height: '40px', overflow: 'hidden' }}>{book.title}</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
              {book.author_name ? book.author_name[0] : 'Unknown Author'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;