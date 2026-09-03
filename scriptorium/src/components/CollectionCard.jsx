import { Link } from 'react-router-dom';
import { ArrowRight, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { deleteCollection } from '../api';
import { useToast } from '../context/ToastContext';

function CollectionCard({ collection, index = 0, onDelete }) {
  const { success, error: showError } = useToast();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const remove = async () => {
    setDeleting(true);
    try { await deleteCollection(collection.id); onDelete(collection.id); success('Collection deleted.'); }
    catch { showError('Could not delete this collection.'); }
    finally { setDeleting(false); setConfirming(false); }
  };

  return (
    <>
      <article className="group relative border-t border-burgundy-900/20 py-6">
        <div className="grid grid-cols-[40px_1fr_auto] items-start gap-4">
          <span className="font-serif text-sm italic text-burgundy-500">{String(index + 1).padStart(2, '0')}</span>
          <Link to={`/collections/${collection.id}`}><h3 className="text-xl font-bold text-burgundy-900 group-hover:text-burgundy-600">{collection.name}</h3><p className="mt-2 line-clamp-2 max-w-xl text-sm leading-6 text-gray-600">{collection.description || 'A personal shelf in your library.'}</p><p className="mt-4 text-[10px] font-semibold uppercase tracking-[.14em] text-gray-500">Created {new Date(collection.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</p></Link>
          <div className="flex items-center gap-1"><button onClick={() => setConfirming(true)} className="grid h-9 w-9 place-items-center text-gray-400 hover:text-red-700" aria-label={`Delete ${collection.name}`}><Trash2 className="h-4 w-4" /></button><Link to={`/collections/${collection.id}`} className="grid h-9 w-9 place-items-center text-burgundy-800" aria-label={`Open ${collection.name}`}><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link></div>
        </div>
      </article>
      {confirming && <div className="fixed inset-0 z-50 grid place-items-center bg-burgundy-900/60 p-4" role="dialog" aria-modal="true"><div className="w-full max-w-sm bg-cream-50 p-7 shadow-2xl"><p className="eyebrow">Delete collection</p><h3 className="mt-3 text-2xl font-bold text-burgundy-900">Remove “{collection.name}”?</h3><p className="mt-3 text-sm leading-6 text-gray-600">Every saved book in this collection will also be removed. This cannot be undone.</p><div className="mt-7 flex justify-end gap-3"><button onClick={() => setConfirming(false)} disabled={deleting} className="button-secondary">Keep it</button><button onClick={remove} disabled={deleting} className="button-primary !bg-red-800 hover:!bg-red-900">{deleting ? 'Deleting…' : 'Delete'}</button></div></div></div>}
    </>
  );
}

export default CollectionCard;
