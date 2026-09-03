import { Link } from 'react-router-dom';
import { Clock3, PencilLine, Trash2 } from 'lucide-react';
import BookCover from './BookCover';

const statusLabels = { to_read: 'Want to read', reading: 'Reading now', finished: 'Finished' };

function LibraryBookRow({ book, onStatusChange, onLogSession, onUpdateProgress, onRemove }) {
  const progress = book.total_pages ? Math.min(100, Math.round(((book.current_page || 0) / book.total_pages) * 100)) : 0;

  return (
    <article className="group grid grid-cols-[64px_1fr] gap-4 border-t border-burgundy-900/15 py-5 sm:grid-cols-[72px_1fr_auto] sm:items-center sm:gap-5">
      <Link to={`/book/${encodeURIComponent(book.work_key)}`}><BookCover coverId={book.cover_id} title={book.title} className="aspect-[2/3] w-full book-shadow" /></Link>
      <div className="min-w-0">
        <Link to={`/book/${encodeURIComponent(book.work_key)}`}><h3 className="line-clamp-2 font-serif font-bold leading-snug text-burgundy-900 hover:text-burgundy-600">{book.title}</h3></Link>
        <p className="mt-1 truncate text-sm text-gray-600">{book.author}</p>
        {book.status === 'reading' && <div className="mt-3 max-w-sm"><div className="mb-1.5 flex justify-between text-[11px] font-medium text-gray-500"><span>{book.total_pages ? `Page ${book.current_page || 0} of ${book.total_pages}` : `${book.current_page || 0} pages logged`}</span>{book.total_pages && <span>{progress}%</span>}</div>{book.total_pages && <div className="h-1 bg-cream-300"><div className="h-full bg-burgundy-700" style={{ width: `${progress}%` }} /></div>}</div>}
      </div>
      <div className="col-span-2 flex flex-wrap items-center gap-2 pl-20 sm:col-span-1 sm:pl-0">
        <select value={book.status} onChange={(e) => onStatusChange(book.id, e.target.value)} className="h-10 border border-burgundy-900/20 bg-transparent px-3 text-xs font-semibold text-burgundy-900 outline-none focus:border-burgundy-700" aria-label={`Reading status for ${book.title}`}><option value="to_read">{statusLabels.to_read}</option><option value="reading">{statusLabels.reading}</option><option value="finished">{statusLabels.finished}</option></select>
        {book.status === 'reading' && <><button onClick={() => onUpdateProgress(book)} className="grid h-10 w-10 place-items-center border border-burgundy-900/20 text-burgundy-800 hover:bg-cream-200" title="Update page"><PencilLine className="h-4 w-4" /></button><button onClick={() => onLogSession(book)} className="grid h-10 w-10 place-items-center border border-burgundy-900/20 text-burgundy-800 hover:bg-cream-200" title="Log reading session"><Clock3 className="h-4 w-4" /></button></>}
        {onRemove && <button onClick={() => onRemove(book)} className="grid h-10 w-10 place-items-center border border-transparent text-gray-400 hover:border-red-200 hover:text-red-700" title="Remove book"><Trash2 className="h-4 w-4" /></button>}
      </div>
    </article>
  );
}

export default LibraryBookRow;
