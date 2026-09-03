import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SearchX, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { searchBooks } from '../api';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';

const prompts = ['contemporary fiction', 'African literature', 'nature writing', 'historical mystery'];

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('relevance');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!query) { setBooks([]); return; }
    let active = true;
    setLoading(true);
    setError(false);
    searchBooks(query)
      .then(({ data }) => { if (active) { setBooks(data.docs || []); setTotal(data.numFound || data.num_found || 0); } })
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [query, reloadKey]);

  const sortedBooks = useMemo(() => {
    if (sort === 'newest') return [...books].sort((a, b) => (b.first_publish_year || 0) - (a.first_publish_year || 0));
    if (sort === 'oldest') return [...books].sort((a, b) => (a.first_publish_year || 9999) - (b.first_publish_year || 9999));
    return books;
  }, [books, sort]);

  return (
    <div className="page-shell pt-12 sm:pt-16">
      <header className="grid gap-8 border-b border-burgundy-900/15 pb-10 lg:grid-cols-[1fr_1fr] lg:items-end">
        <div><p className="eyebrow mb-3">Search the catalogue</p><h1 className="text-4xl font-bold text-burgundy-900 sm:text-5xl">{query ? <>Books matching <em className="font-normal text-burgundy-600">“{query}”</em></> : 'What are you looking for?'}</h1>{query && !loading && !error && <p className="mt-4 text-sm text-gray-600">{total.toLocaleString()} possible matches · showing the strongest {books.length}</p>}</div>
        <SearchBar initialValue={query} />
      </header>

      {!query && <div className="py-20 text-center"><p className="font-serif text-2xl text-burgundy-900">Begin with a title, an author, or an idea.</p><div className="mt-6 flex flex-wrap justify-center gap-3">{prompts.map((prompt) => <Link key={prompt} to={`/search?q=${encodeURIComponent(prompt)}`} className="button-secondary">{prompt}</Link>)}</div></div>}

      {query && <div className="flex items-center justify-between py-6"><p className="text-sm text-gray-500">Browse results</p><label className="flex items-center gap-2 text-sm text-gray-600"><SlidersHorizontal className="h-4 w-4" /><span className="sr-only sm:not-sr-only">Order by</span><select value={sort} onChange={(e) => setSort(e.target.value)} className="border-0 bg-transparent font-semibold text-burgundy-900 outline-none"><option value="relevance">Relevance</option><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label></div>}

      {loading && <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">{Array.from({ length: 12 }).map((_, i) => <div key={i}><div className="skeleton aspect-[2/3]" /><div className="skeleton mt-4 h-4" /><div className="skeleton mt-2 h-3 w-2/3" /></div>)}</div>}
      {error && <div className="my-12 border-y border-burgundy-900/15 py-14 text-center"><p className="font-serif text-2xl text-burgundy-900">The catalogue is temporarily out of reach.</p><p className="mt-2 text-sm text-gray-600">Your search is safe. Try reconnecting in a moment.</p><button onClick={() => setReloadKey((value) => value + 1)} className="button-secondary mt-6"><RefreshCw className="h-4 w-4" />Try again</button></div>}
      {!loading && !error && query && books.length === 0 && <div className="py-20 text-center"><SearchX className="mx-auto h-9 w-9 text-burgundy-400" /><h2 className="mt-5 text-2xl font-bold text-burgundy-900">No exact matches found</h2><p className="mt-2 text-gray-600">Try fewer words, check the spelling, or search by author.</p></div>}
      {!loading && !error && sortedBooks.length > 0 && <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">{sortedBooks.map((book, index) => <BookCard key={`${book.key}-${index}`} book={book} priority={index < 6} />)}</div>}
    </div>
  );
}

export default SearchResults;
