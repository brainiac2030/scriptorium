import { useEffect, useState } from 'react';
import { Check, FolderPlus, Library, X } from 'lucide-react';
import { addSavedBook, createCollection, getCollections } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const statuses = [{ value: 'to_read', label: 'Want to read' }, { value: 'reading', label: 'Reading now' }, { value: 'finished', label: 'Finished' }];

function SaveToCollectionModal({ isOpen, onClose, book }) {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [collections, setCollections] = useState([]);
  const [status, setStatus] = useState('to_read');
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !user) return;
    setLoading(true); setError(''); setCreating(false);
    getCollections().then(({ data }) => setCollections(data || [])).catch(() => setError('Your collections could not be loaded.')).finally(() => setLoading(false));
  }, [isOpen, user]);

  if (!isOpen) return null;

  const save = async (collectionId) => {
    setSavingId(collectionId); setError('');
    try {
      const author = Array.isArray(book.author_name) ? book.author_name[0] : book.author || book.author_name || 'Unknown author';
      await addSavedBook({ collection_id: collectionId, work_key: book.work_key || book.key, title: book.title, author, cover_id: book.cover_i || book.cover_id || null, status, total_pages: book.number_of_pages_median || book.number_of_pages || null });
      success(`“${book.title}” is now in your library.`); onClose();
    } catch (err) { const message = err.response?.data?.error || 'Could not save this book.'; setError(message); showError(message); }
    finally { setSavingId(null); }
  };

  const createAndSave = async (event) => {
    event.preventDefault();
    setLoading(true); setError('');
    try { const { data } = await createCollection({ name: newName, description: '' }); setCollections((current) => [...current, data]); setCreating(false); setNewName(''); await save(data.id); }
    catch (err) { const message = err.response?.data?.errors?.name?.[0] || err.response?.data?.error || 'Could not create the collection.'; setError(message); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-burgundy-900/60 p-4" role="dialog" aria-modal="true" aria-labelledby="save-title">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-cream-50 p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4"><div><p className="eyebrow mb-2">Add to your library</p><h2 id="save-title" className="text-2xl font-bold text-burgundy-900">Choose a shelf</h2><p className="mt-2 line-clamp-1 text-sm text-gray-600">{book?.title}</p></div><button onClick={onClose} aria-label="Close" className="p-2 text-gray-500 hover:text-burgundy-900"><X className="h-5 w-5" /></button></div>
        <div className="mt-7"><p className="text-xs font-semibold uppercase tracking-[.12em] text-gray-500">Reading status</p><div className="mt-3 grid grid-cols-3 border border-burgundy-900/20">{statuses.map((item) => <button key={item.value} onClick={() => setStatus(item.value)} className={`min-h-11 border-r border-burgundy-900/15 px-2 text-xs font-semibold last:border-r-0 ${status === item.value ? 'bg-burgundy-800 text-white' : 'text-burgundy-900 hover:bg-cream-200'}`}>{item.label}</button>)}</div></div>
        {error && <p className="mt-5 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
        <div className="mt-7 border-t border-burgundy-900/15 pt-5"><div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[.12em] text-gray-500">Collections</p><button onClick={() => setCreating(!creating)} className="flex items-center gap-1.5 text-xs font-semibold text-burgundy-700"><FolderPlus className="h-4 w-4" />New collection</button></div>
          {creating && <form onSubmit={createAndSave} className="mt-4 flex gap-2"><input value={newName} onChange={(e) => setNewName(e.target.value)} required maxLength="100" placeholder="Collection name" className="field" autoFocus /><button className="button-primary shrink-0" disabled={loading}>Create & save</button></form>}
          {loading && !creating ? <div className="mt-4 space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-14" />)}</div> : collections.length ? <div className="mt-4 divide-y divide-burgundy-900/10 border-y border-burgundy-900/10">{collections.map((collection) => <button key={collection.id} onClick={() => save(collection.id)} disabled={savingId !== null} className="group flex w-full items-center justify-between gap-4 py-4 text-left disabled:opacity-50"><div><p className="font-serif font-bold text-burgundy-900">{collection.name}</p>{collection.description && <p className="mt-1 line-clamp-1 text-xs text-gray-500">{collection.description}</p>}</div>{savingId === collection.id ? <span className="text-xs text-gray-500">Saving…</span> : <Check className="h-4 w-4 text-burgundy-300 group-hover:text-burgundy-700" />}</button>)}</div> : !loading && <div className="mt-6 border-y border-burgundy-900/15 py-8 text-center"><Library className="mx-auto h-6 w-6 text-burgundy-500" /><p className="mt-3 font-serif font-bold text-burgundy-900">No collections yet</p><p className="mt-1 text-sm text-gray-600">Create one above and this book will be added to it.</p></div>}
        </div>
      </div>
    </div>
  );
}

export default SaveToCollectionModal;
