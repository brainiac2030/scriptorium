import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Edit3, Search, Trash2 } from 'lucide-react';
import { deleteCollection, deleteSavedBook, getCollection, getCollectionBooks, updateCollection, updateSavedBook } from '../api';
import { useToast } from '../context/ToastContext';
import LibraryBookRow from '../components/LibraryBookRow';
import ReadingSessionModal from '../components/ReadingSessionModal';
import UpdateProgressModal from '../components/UpdateProgressModal';

function CollectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const [collection, setCollection] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [sessionBook, setSessionBook] = useState(null);
  const [progressBook, setProgressBook] = useState(null);
  const [removeBook, setRemoveBook] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [collectionRes, booksRes] = await Promise.all([getCollection(id), getCollectionBooks(id)]);
      setCollection(collectionRes.data);
      setBooks(booksRes.data || []);
      setEditForm({ name: collectionRes.data.name, description: collectionRes.data.description || '' });
    } catch { showError('That collection could not be found.'); navigate('/dashboard'); }
    finally { setLoading(false); }
  }, [id, navigate, showError]);

  useEffect(() => { loadData(); }, [loadData]);

  const saveCollection = async (event) => {
    event.preventDefault();
    try { const { data } = await updateCollection(id, editForm); setCollection(data); setEditing(false); success('Collection updated.'); }
    catch { showError('Could not update this collection.'); }
  };

  const changeStatus = async (bookId, status) => {
    try { const { data } = await updateSavedBook(bookId, { status }); setBooks((current) => current.map((book) => book.id === bookId ? data : book)); success('Reading status updated.'); }
    catch { showError('Could not update reading status.'); }
  };

  const confirmRemoveBook = async () => {
    try { await deleteSavedBook(removeBook.id); setBooks((current) => current.filter((book) => book.id !== removeBook.id)); success('Book removed from this collection.'); setRemoveBook(null); }
    catch { showError('Could not remove this book.'); }
  };

  const removeCollection = async () => {
    try { await deleteCollection(id); success('Collection deleted.'); navigate('/dashboard'); }
    catch { showError('Could not delete this collection.'); }
  };

  if (loading) return <div className="page-shell py-12"><div className="skeleton h-4 w-36" /><div className="skeleton mt-10 h-40" /><div className="mt-10 space-y-3">{Array.from({ length: 4 }).map((_, i) => <div className="skeleton h-28" key={i} />)}</div></div>;
  if (!collection) return null;

  const readingCount = books.filter((book) => book.status === 'reading').length;
  const finishedCount = books.filter((book) => book.status === 'finished').length;

  return (
    <div className="animate-fadeIn">
      <div className="page-shell py-7"><Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-burgundy-700"><ArrowLeft className="h-4 w-4" />Back to my library</Link></div>
      <header className="border-y border-burgundy-900/15 bg-cream-50">
        <div className="page-shell py-12 sm:py-16">
          {editing ? <form onSubmit={saveCollection} className="max-w-2xl space-y-4"><p className="eyebrow">Edit collection</p><input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="field font-serif text-2xl font-bold" required maxLength="100" autoFocus /><textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows="3" className="field resize-none" placeholder="What belongs on this shelf?" /><div className="flex gap-3"><button type="submit" className="button-primary"><Check className="h-4 w-4" />Save changes</button><button type="button" onClick={() => setEditing(false)} className="button-secondary">Cancel</button></div></form> : <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><p className="eyebrow mb-4">Personal collection</p><h1 className="text-4xl font-bold text-burgundy-900 sm:text-5xl">{collection.name}</h1><p className="mt-4 max-w-2xl text-lg leading-7 text-gray-600">{collection.description || 'A shelf shaped by your reading.'}</p><p className="mt-5 text-xs text-gray-500">{books.length} {books.length === 1 ? 'book' : 'books'} · {readingCount} in progress · {finishedCount} finished</p></div><div className="flex gap-2"><button onClick={() => setEditing(true)} className="button-secondary"><Edit3 className="h-4 w-4" />Edit</button><button onClick={() => setDeleteOpen(true)} className="grid h-11 w-11 place-items-center border border-red-800/30 text-red-800 hover:bg-red-50" aria-label="Delete collection"><Trash2 className="h-4 w-4" /></button></div></div>}
        </div>
      </header>

      <main className="page-shell py-12 sm:py-16">
        <div className="mb-6 flex items-end justify-between"><div><p className="eyebrow mb-2">On this shelf</p><h2 className="text-2xl font-bold text-burgundy-900">Books</h2></div></div>
        {books.length ? books.map((book) => <LibraryBookRow key={book.id} book={book} onStatusChange={changeStatus} onLogSession={setSessionBook} onUpdateProgress={setProgressBook} onRemove={setRemoveBook} />) : <div className="border-y border-burgundy-900/15 py-14 text-center"><Search className="mx-auto h-7 w-7 text-burgundy-500" /><h2 className="mt-5 text-2xl font-bold text-burgundy-900">This shelf is ready for its first book.</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-600">Search the catalogue, open a book, and choose this collection when you save it.</p><Link to="/" className="button-primary mt-7">Discover books</Link></div>}
      </main>

      <ReadingSessionModal isOpen={Boolean(sessionBook)} onClose={() => setSessionBook(null)} book={sessionBook} onSessionLogged={loadData} />
      <UpdateProgressModal isOpen={Boolean(progressBook)} onClose={() => setProgressBook(null)} book={progressBook} onUpdated={loadData} />

      {removeBook && <div className="fixed inset-0 z-50 grid place-items-center bg-burgundy-900/60 p-4" role="dialog" aria-modal="true"><div className="w-full max-w-sm bg-cream-50 p-7 shadow-2xl"><button onClick={() => setRemoveBook(null)} className="float-right p-1 text-gray-500"><X className="h-5 w-5" /></button><p className="eyebrow">Remove book</p><h3 className="mt-3 text-2xl font-bold text-burgundy-900">Take “{removeBook.title}” off this shelf?</h3><p className="mt-3 text-sm leading-6 text-gray-600">Its reading progress and sessions in this collection will also be removed.</p><div className="mt-7 flex justify-end gap-3"><button onClick={() => setRemoveBook(null)} className="button-secondary">Keep it</button><button onClick={confirmRemoveBook} className="button-primary !bg-red-800">Remove</button></div></div></div>}
      {deleteOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-burgundy-900/60 p-4" role="dialog" aria-modal="true"><div className="w-full max-w-sm bg-cream-50 p-7 shadow-2xl"><p className="eyebrow">Delete collection</p><h3 className="mt-3 text-2xl font-bold text-burgundy-900">Delete “{collection.name}”?</h3><p className="mt-3 text-sm leading-6 text-gray-600">All {books.length} books and their reading records on this shelf will be deleted. This cannot be undone.</p><div className="mt-7 flex justify-end gap-3"><button onClick={() => setDeleteOpen(false)} className="button-secondary">Cancel</button><button onClick={removeCollection} className="button-primary !bg-red-800">Delete</button></div></div></div>}
    </div>
  );
}

export default CollectionDetail;
