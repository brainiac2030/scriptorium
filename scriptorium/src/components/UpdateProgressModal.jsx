import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { updateReadingProgress } from '../api';
import { useToast } from '../context/ToastContext';

function UpdateProgressModal({ book, isOpen, onClose, onUpdated }) {
  const [page, setPage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { success, error: showError } = useToast();

  useEffect(() => { if (book) setPage(String(book.current_page || 0)); }, [book]);
  if (!isOpen || !book) return null;

  const submit = async (event) => {
    event.preventDefault();
    const nextPage = Number(page);
    if (nextPage < 0 || (book.total_pages && nextPage > book.total_pages)) { setError(`Enter a page between 0 and ${book.total_pages}.`); return; }
    setLoading(true);
    setError('');
    try {
      await updateReadingProgress(book.id, { current_page: nextPage });
      success(nextPage === book.total_pages ? 'Book marked as finished.' : 'Reading progress updated.');
      onUpdated();
      onClose();
    } catch (err) {
      const message = err.response?.data?.error || 'Could not update your progress.';
      setError(message); showError(message);
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-burgundy-900/60 p-4" role="dialog" aria-modal="true" aria-labelledby="progress-title">
      <div className="w-full max-w-md border border-burgundy-900/15 bg-cream-50 p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4"><div><p className="eyebrow mb-2">Reading progress</p><h2 id="progress-title" className="text-2xl font-bold text-burgundy-900">Where are you now?</h2><p className="mt-2 line-clamp-1 text-sm text-gray-600">{book.title}</p></div><button onClick={onClose} aria-label="Close" className="p-2 text-gray-500 hover:text-burgundy-900"><X className="h-5 w-5" /></button></div>
        {error && <p className="mt-5 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
        <form onSubmit={submit} className="mt-7"><label htmlFor="current-page" className="text-sm font-semibold text-gray-700">Current page</label><div className="mt-2 flex items-center"><input id="current-page" type="number" min="0" max={book.total_pages || undefined} required value={page} onChange={(e) => setPage(e.target.value)} className="field text-lg" autoFocus />{book.total_pages && <span className="border-y border-r border-burgundy-900/20 bg-cream-200 px-4 py-3.5 text-sm text-gray-500">of {book.total_pages}</span>}</div><div className="mt-7 flex justify-end gap-3"><button type="button" onClick={onClose} className="button-secondary">Cancel</button><button type="submit" disabled={loading} className="button-primary">{loading ? 'Saving…' : 'Update progress'}</button></div></form>
      </div>
    </div>
  );
}

export default UpdateProgressModal;
