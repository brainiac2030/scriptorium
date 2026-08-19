import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import { SearchX } from 'lucide-react';

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
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=30`);
        if (!response.ok) throw new Error('Failed to fetch books.');
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
      <div className="mb-8">
        <h2 className="font-serif text-3xl md:text-4xl text-burgundy-700 mb-2">
          {query ? `Results for "${query}"` : 'Explore the Library'}
        </h2>
        <p className="text-gray-500 mb-6">
          {query ? `${books.length} books found` : 'Search for titles, authors, or subjects'}
        </p>
        <SearchBar />
      </div>

      {/* Skeleton Loader */}
      {loading && (
        <div className="masonry-grid">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="break-inside-avoid mb-6">
              <div className="aspect-[2/3] bg-cream-200 rounded-2xl animate-pulse"></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-lg text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && books.length === 0 && query && (
        <div className="text-center py-20">
          <SearchX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600">No books found for "{query}".</p>
          <p className="text-gray-400 mt-2">Try a different search term.</p>
        </div>
      )}

      {!loading && !error && books.length > 0 && (
        <div className="masonry-grid">
          {books.map((book) => (
            <BookCard key={book.key} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;