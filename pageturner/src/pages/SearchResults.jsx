import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Failed to fetch books. Please try again.');
        const data = await response.json();
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
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        {query ? `Results for "${query}"` : 'Browse Books'}
      </h2>
      
      <div className="mb-8">
        <SearchBar />
      </div>
      
      {loading && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Loading books...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center py-12">
          <p className="text-lg text-red-600">{error}</p>
        </div>
      )}
      
      {!loading && !error && books.length === 0 && query && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No books found for "{query}". Try a different search term.</p>
        </div>
      )}

      {!loading && !error && books.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {books.slice(0, 20).map((book) => (
            <Link 
              to={`/book/${encodeURIComponent(book.key)}`} 
              key={book.key} 
              className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
            >
              <div className="aspect-[2/3] bg-gray-100 relative overflow-hidden">
                {book.cover_i ? (
                  <img 
                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`} 
                    alt={`Cover of ${book.title}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150x220?text=No+Cover'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No Cover
                  </div>
                )}
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {book.author_name ? book.author_name[0] : 'Unknown Author'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
export default SearchResults;