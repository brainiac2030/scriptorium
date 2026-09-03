import { useState } from 'react';
import { Clock3, X } from 'lucide-react';
import { logReadingSession } from '../api';
import { useToast } from '../context/ToastContext';

function ReadingSessionModal({ isOpen, onClose, book, onSessionLogged }) {
  const { success, error: showError } = useToast();
  const [formData, setFormData] = useState({ duration_minutes: '', pages_read: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  if (!isOpen || !book) return null;

  const close = () => { setFormData({ duration_minutes: '', pages_read: '', notes: '' }); setError(''); onClose(); };
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError('');
    try { await logReadingSession(book.id, { duration_minutes: Number(formData.duration_minutes), pages_read: Number(formData.pages_read), notes: formData.notes || null }); success('Reading session added to your record.'); onSessionLogged(); close(); }
    catch (err) { const message = err.response?.data?.error || 'Could not log this session.'; setError(message); showError(message); }
    finally { setLoading(false); }
  };

  return <div className="fixed inset-0 z-50 grid place-items-center bg-burgundy-900/60 p-4" role="dialog" aria-modal="true" aria-labelledby="session-title"><div className="max-h-[90vh] w-full max-w-md overflow-y-auto bg-cream-50 p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-4"><div><div className="mb-3 flex items-center gap-2 text-burgundy-600"><Clock3 className="h-4 w-4" /><span className="eyebrow">Reading record</span></div><h2 id="session-title" className="text-2xl font-bold text-burgundy-900">Log this session</h2><p className="mt-2 line-clamp-1 text-sm text-gray-600">{book.title}</p></div><button onClick={close} aria-label="Close" className="p-2 text-gray-500"><X className="h-5 w-5" /></button></div>{error && <p className="mt-5 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}<form onSubmit={submit} className="mt-7 space-y-5"><div className="grid grid-cols-2 gap-4"><div><label htmlFor="minutes" className="text-sm font-semibold text-gray-700">Minutes</label><input id="minutes" type="number" required min="1" value={formData.duration_minutes} onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })} className="field mt-2" placeholder="30" autoFocus /></div><div><label htmlFor="pages" className="text-sm font-semibold text-gray-700">Pages read</label><input id="pages" type="number" required min="1" value={formData.pages_read} onChange={(e) => setFormData({ ...formData, pages_read: e.target.value })} className="field mt-2" placeholder="18" /></div></div><div><label htmlFor="session-notes" className="text-sm font-semibold text-gray-700">A note to remember <span className="font-normal text-gray-400">(optional)</span></label><textarea id="session-notes" rows="4" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="field mt-2 resize-none" placeholder="A thought, feeling, or passage to return to…" /></div><p className="text-xs leading-5 text-gray-500">Pages read will be added to your current progress. Reaching the final page marks the book as finished.</p><div className="flex justify-end gap-3 pt-2"><button type="button" onClick={close} className="button-secondary">Cancel</button><button type="submit" disabled={loading} className="button-primary">{loading ? 'Saving…' : 'Log session'}</button></div></form></div></div>;
}

export default ReadingSessionModal;
