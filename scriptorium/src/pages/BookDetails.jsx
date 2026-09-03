import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Bookmark, BookOpen, Calendar, Check, Layers, RefreshCw } from 'lucide-react';
import { getAuthor, getEditions, getSavedBooks, getWork } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import SaveToCollectionModal from '../components/SaveToCollectionModal';
import BookCover from '../components/BookCover';

function BookDetails() {
  const { id } = useParams();
  const workKey = decodeURIComponent(id);
  const { user } = useAuth();
  const { info } = useToast();
  const [book, setBook] = useState(null);
  const [authorName, setAuthorName] = useState('Unknown author');
  const [readLinks, setReadLinks] = useState([]);
  const [editionCount, setEditionCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    const load = async () => {
      try {
        const { data } = await getWork(workKey);
        if (!active) return;
        setBook(data);
        const authorKey = data.authors?.[0]?.author?.key;
        const requests = [getEditions(workKey, 20)];
        if (authorKey) requests.push(getAuthor(authorKey));
        if (user) requests.push(getSavedBooks());
        const results = await Promise.allSettled(requests);
        if (!active) return;
        const editionsData = results[0].status === 'fulfilled' ? results[0].value.data : {};
        const editions = editionsData.entries || [];
        setEditionCount(editionsData.size || editions.length);
        const links = editions.filter((edition) => edition.ocaid).map((edition) => ({ id: edition.ocaid, url: `https://archive.org/stream/${edition.ocaid}` }));
        setReadLinks(Array.from(new Map(links.map((link) => [link.id, link])).values()));
        let resultIndex = 1;
        if (authorKey) { if (results[resultIndex]?.status === 'fulfilled') setAuthorName(results[resultIndex].value.data.name || 'Unknown author'); resultIndex += 1; }
        if (user && results[resultIndex]?.status === 'fulfilled') setIsSaved((results[resultIndex].value.data || []).some((saved) => saved.work_key === workKey));
      } catch { if (active) setError(true); }
      finally { if (active) setLoading(false); }
    };
    load();
    return () => { active = false; };
  }, [workKey, user, reloadKey]);

  const handleSave = () => {
    if (!user) return info('Sign in to save this book and track your reading.');
    setShowSaveModal(true);
  };

  if (loading) return <div className="page-shell py-12"><div className="mb-10 skeleton h-4 w-28" /><div className="grid gap-12 md:grid-cols-[300px_1fr]"><div className="skeleton aspect-[2/3]" /><div><div className="skeleton h-12 w-4/5" /><div className="skeleton mt-5 h-5 w-1/3" /><div className="skeleton mt-12 h-4" /><div className="skeleton mt-3 h-4" /><div className="skeleton mt-3 h-4 w-4/5" /></div></div></div>;

  if (error || !book) return <div className="page-shell py-24 text-center"><p className="eyebrow">Catalogue interruption</p><h1 className="mt-4 text-3xl font-bold text-burgundy-900">We couldn’t open this book.</h1><p className="mt-3 text-gray-600">The record may be unavailable, or the catalogue may be offline.</p><div className="mt-7 flex justify-center gap-3"><Link to="/" className="button-secondary"><ArrowLeft className="h-4 w-4" />Discover</Link><button onClick={() => setReloadKey((v) => v + 1)} className="button-primary"><RefreshCw className="h-4 w-4" />Try again</button></div></div>;

  const description = typeof book.description === 'string' ? book.description : book.description?.value || 'No description is available for this work yet.';
  const coverId = book.covers?.[0];
  const publishDate = book.first_publish_date || book.first_publish_year;
  const modalBook = { key: workKey, work_key: workKey, title: book.title, author_name: [authorName], author: authorName, cover_i: coverId, cover_id: coverId };

  return (
    <div className="animate-fadeIn">
      <div className="page-shell py-7"><Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-burgundy-700 hover:text-burgundy-900"><ArrowLeft className="h-4 w-4" />Back to discovery</Link></div>
      <section className="border-y border-burgundy-900/15 bg-cream-50">
        <div className="page-shell grid gap-10 py-12 md:grid-cols-[280px_1fr] lg:grid-cols-[340px_1fr] lg:gap-20 lg:py-16">
          <div><BookCover coverId={coverId} title={book.title} size="L" className="book-shadow mx-auto aspect-[2/3] w-full max-w-[340px]" loading="eager" /></div>
          <div className="flex flex-col justify-center">
            <p className="eyebrow">A work in the Open Library</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-burgundy-900 sm:text-5xl lg:text-6xl">{book.title}</h1>
            <p className="mt-5 font-serif text-xl italic text-gray-600">by {authorName}</p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-y border-burgundy-900/15 py-4 text-sm text-gray-600">{publishDate && <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-burgundy-600" />First published {publishDate}</span>}{editionCount > 0 && <span className="flex items-center gap-2"><Layers className="h-4 w-4 text-burgundy-600" />{editionCount} editions sampled</span>}{readLinks.length > 0 && <span className="flex items-center gap-2 text-green-800"><Check className="h-4 w-4" />Digital edition available</span>}</div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><button onClick={handleSave} className="button-primary"><Bookmark className="h-4 w-4" />{isSaved ? 'Save to another collection' : 'Add to my library'}</button>{readLinks.length > 0 ? <a href={readLinks[0].url} target="_blank" rel="noopener noreferrer" className="button-secondary"><BookOpen className="h-4 w-4" />Read online <ArrowUpRight className="h-4 w-4" /></a> : <a href={`https://openlibrary.org${workKey}`} target="_blank" rel="noopener noreferrer" className="button-secondary">View source record <ArrowUpRight className="h-4 w-4" /></a>}</div>
            {isSaved && <p className="mt-4 flex items-center gap-2 text-sm text-green-800"><Check className="h-4 w-4" />This work is already in your library.</p>}
          </div>
        </div>
      </section>

      <section className="page-shell grid gap-12 py-14 lg:grid-cols-[1fr_320px] lg:gap-20 lg:py-20">
        <article><p className="eyebrow mb-4">About the work</p><h2 className="text-3xl font-bold text-burgundy-900">What you’ll find inside</h2><p className="mt-6 max-w-3xl whitespace-pre-line text-[17px] leading-8 text-gray-700">{description}</p></article>
        <aside className="border-t border-burgundy-900/15 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"><p className="eyebrow mb-4">Themes & subjects</p>{book.subjects?.length ? <div className="flex flex-wrap gap-2">{book.subjects.slice(0, 16).map((subject) => <Link key={subject} to={`/search?q=${encodeURIComponent(subject)}`} className="border border-burgundy-900/20 px-3 py-1.5 text-xs text-burgundy-800 hover:bg-burgundy-800 hover:text-white">{subject}</Link>)}</div> : <p className="text-sm leading-6 text-gray-500">No subject information is available for this record.</p>}{readLinks.length > 1 && <div className="mt-9 border-t border-burgundy-900/15 pt-6"><p className="eyebrow mb-3">Other digital editions</p>{readLinks.slice(1, 4).map((link, index) => <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between border-b border-burgundy-900/10 py-3 text-sm font-medium text-burgundy-800">Edition {index + 2}<ArrowUpRight className="h-4 w-4" /></a>)}</div>}</aside>
      </section>

      <SaveToCollectionModal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)} book={modalBook} />
    </div>
  );
}

export default BookDetails;
