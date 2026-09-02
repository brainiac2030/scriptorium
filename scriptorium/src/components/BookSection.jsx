import { useEffect, useState } from 'react';
import BookCard from './BookCard';

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
        console.error('Failed to load section:', title, err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [apiUrl, title]);

  // Skeleton Loader
  if (loading) {
    return (
      <section className="mb-4">
        <h2 className="font-serif text-2xl md:text-3xl text-burgundy-700 mb-6">
          {title}
        </h2>
        <div className="masonry-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="break-inside-avoid mb-6">
              <div className="aspect-[2/3] bg-cream-200 rounded-2xl animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (books.length === 0) return null;

  return (
    <section className="mb-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl md:text-3xl text-burgundy-700">
          {title}
        </h2>
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