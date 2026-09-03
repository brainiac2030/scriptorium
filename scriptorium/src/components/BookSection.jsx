import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { getSubjectBooks } from '../api';
import BookCard from './BookCard';

function BookSection({ title, subject, description }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await getSubjectBooks(subject, 12);
      setBooks(data.works || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [subject]);

  useEffect(() => { loadBooks(); }, [loadBooks]);

  return (
    <section className="py-11 sm:py-16">
      <div className="mb-7 flex items-end justify-between gap-5 border-b border-burgundy-900/15 pb-5">
        <div><p className="eyebrow mb-2">Curated shelf</p><h2 className="text-2xl font-bold text-burgundy-900 sm:text-3xl">{title}</h2>{description && <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">{description}</p>}</div>
        <Link to={`/search?q=${encodeURIComponent(subject.replaceAll('_', ' '))}`} className="hidden shrink-0 items-center gap-2 text-sm font-semibold text-burgundy-700 hover:text-burgundy-900 sm:flex">View shelf <ArrowRight className="h-4 w-4" /></Link>
      </div>

      {loading && <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">{Array.from({ length: 6 }).map((_, i) => <div key={i}><div className="skeleton aspect-[2/3]" /><div className="skeleton mt-4 h-4 w-4/5" /><div className="skeleton mt-2 h-3 w-1/2" /></div>)}</div>}
      {error && <div className="flex items-center justify-between border-y border-burgundy-900/10 py-6"><p className="text-sm text-gray-600">This shelf could not be loaded.</p><button onClick={loadBooks} className="flex items-center gap-2 text-sm font-semibold text-burgundy-700"><RefreshCw className="h-4 w-4" />Try again</button></div>}
      {!loading && !error && books.length > 0 && <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-6">{books.slice(0, 6).map((book, index) => <BookCard key={book.key} book={book} priority={index < 2} />)}</div>}
      <Link to={`/search?q=${encodeURIComponent(subject.replaceAll('_', ' '))}`} className="mt-7 flex items-center gap-2 text-sm font-semibold text-burgundy-700 sm:hidden">View the full shelf <ArrowRight className="h-4 w-4" /></Link>
    </section>
  );
}

export default BookSection;
