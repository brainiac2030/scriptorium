import { useEffect, useState } from 'react';
import BookCard from './BookCard';
import { ChevronRight } from 'lucide-react';

function BookSection({ title, apiUrl }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        // Subjects API returns `works`, Search API returns `docs`
        setBooks(data.works || data.docs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [apiUrl]);

  // Skeleton Loader
  if (loading) return (
    <div className="mb-16">
      <h2 className="font-serif text-3xl text-burgundy-700 mb-6">{title}</h2>
      <div className="masonry-grid">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="break-inside-avoid mb-6">
            <div className="aspect-[2/3] bg-cream-200 rounded-2xl animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );

  if (books.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-3xl text-burgundy-700">{title}</h2>
        <button className="flex items-center gap-1 text-burgundy-600 hover:text-burgundy-800 font-medium text-sm transition-colors">
          View All <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="masonry-grid">
        {books.map((book) => (
          <BookCard key={book.key} book={book} />
        ))}
      </div>
    </section>
  );
}

export default BookSection;