import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import SaveToCollectionModal from './SaveToCollectionModal';
import BookCover from './BookCover';

function BookCard({ book, priority = false }) {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const { user } = useAuth();
  const { info } = useToast();

  const coverId = book.cover_i || book.cover_id || book.cover_id?.[0];
  const title = book.title || 'Untitled';
  const author = book.author_name?.[0] || book.authors?.[0]?.name || book.author || 'Unknown author';
  const workKey = book.key || book.work_key;
  const year = book.first_publish_year || book.first_publish_date;

  if (!workKey) return null;

  const handleSave = (event) => {
    event.preventDefault();
    if (!user) return info('Sign in to begin your personal library.');
    setShowSaveModal(true);
  };

  return (
    <article className="group min-w-0">
      <div className="relative">
        <Link to={`/book/${encodeURIComponent(workKey)}`} aria-label={`View ${title} by ${author}`}>
          <BookCover coverId={coverId} title={title} className="book-shadow aspect-[2/3] w-full transition duration-300 group-hover:-translate-y-1" loading={priority ? 'eager' : 'lazy'} />
        </Link>
        <button onClick={handleSave} className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center border border-burgundy-900/10 bg-cream-50 text-burgundy-800 shadow-md hover:bg-burgundy-800 hover:text-white" title="Save to a collection" aria-label={`Save ${title}`}><Bookmark className="h-4 w-4" /></button>
      </div>
      <div className="pt-4">
        {year && <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-burgundy-600">First published {String(year).slice(0, 4)}</p>}
        <Link to={`/book/${encodeURIComponent(workKey)}`} className="block"><h3 className="line-clamp-2 font-serif text-base font-bold leading-snug text-burgundy-900 group-hover:text-burgundy-600">{title}</h3></Link>
        <p className="mt-1 line-clamp-1 text-sm text-gray-600">{author}</p>
      </div>
      <SaveToCollectionModal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)} book={{ ...book, work_key: workKey, title, author }} />
    </article>
  );
}

export default BookCard;
