import { useState } from 'react';
import { X } from 'lucide-react';
import { createCollection } from '../api';
import { useToast } from '../context/ToastContext';

function CreateCollectionModal({ isOpen, onClose, onCollectionCreated }) {
  const { success, error: showError } = useToast();
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;

  const close = () => { setFormData({ name: '', description: '' }); setError(''); onClose(); };
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError('');
    try { await createCollection(formData); success('Collection created.'); onCollectionCreated(); close(); }
    catch (err) { const message = err.response?.data?.errors?.name?.[0] || err.response?.data?.error || 'Could not create this collection.'; setError(message); showError(message); }
    finally { setLoading(false); }
  };

  return <div className="fixed inset-0 z-50 grid place-items-center bg-burgundy-900/60 p-4" role="dialog" aria-modal="true" aria-labelledby="collection-title"><div className="w-full max-w-md bg-cream-50 p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow mb-2">New shelf</p><h2 id="collection-title" className="text-2xl font-bold text-burgundy-900">Create a collection</h2><p className="mt-2 text-sm leading-6 text-gray-600">Organize by mood, subject, season, or a reading project.</p></div><button onClick={close} aria-label="Close" className="p-2 text-gray-500"><X className="h-5 w-5" /></button></div>{error && <p className="mt-5 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}<form onSubmit={submit} className="mt-7 space-y-5"><div><label htmlFor="collection-name" className="text-sm font-semibold text-gray-700">Name</label><input id="collection-name" required maxLength="100" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="field mt-2" placeholder="e.g. Books for slow Sundays" autoFocus /></div><div><label htmlFor="collection-description" className="text-sm font-semibold text-gray-700">Description <span className="font-normal text-gray-400">(optional)</span></label><textarea id="collection-description" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="field mt-2 resize-none" placeholder="What belongs on this shelf?" /></div><div className="flex justify-end gap-3 pt-2"><button type="button" onClick={close} className="button-secondary">Cancel</button><button type="submit" disabled={loading} className="button-primary">{loading ? 'Creating…' : 'Create collection'}</button></div></form></div></div>;
}

export default CreateCollectionModal;
