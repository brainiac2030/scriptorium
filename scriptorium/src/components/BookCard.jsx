import { Link } from 'react-router-dom';
import { Bookmark, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import SaveToCollectionModal from './SaveToCollectionModal';

function BookCard({ book }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const { user } = useAuth();
  const { info } = useToast();

  const coverId = book.cover_i || book.cover_id;
  const title = book.title || 'Untitled';
  const author = book.author_name
    ? book.author_name[0]
    : book.authors
    ? book.authors[0]?.name
    : book.author || 'Unknown Author';
  const workKey = book.key || book.work_key;

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      info('Please sign in to save books to your collections');
      return;
    }

    setShowSaveModal(true);
  };

  if (!workKey) return null;

  return (
    <>
      <div
        className="break-inside-avoid mb-6 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          to={`/book/${encodeURIComponent(workKey)}`}
          className="block relative overflow-hidden rounded-2xl shadow-soft hover:shadow-lift transition-all duration-500 transform hover:-translate-y-1.5"
        >
          {/* Cover */}
          <div className="aspect-[2/3] bg-gradient-to-br from-cream-200 to-cream-300 relative overflow-hidden">
            {coverId ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling?.classList.remove('hidden');
                }}
              />
            ) : null}

            {/* Fallback when no cover */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center text-burgundy-600 font-serif p-5 text-center bg-gradient-to-br from-cream-200 to-cream-300 ${
                coverId ? 'hidden' : ''
              }`}
            >
              <BookOpen className="w-10 h-10 mb-3 opacity-40" />
              <p className="font-semibold text-sm leading-snug line-clamp-4">{title}</p>
            </div>
          </div>

          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-4 transition-all duration-400 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              onClick={handleSaveClick}
              className="absolute top-3 right-3 p-2.5 bg-white/95 backdrop-blur-sm rounded-full text-burgundy-600 hover:bg-burgundy-600 hover:text-white transition-all shadow-lg transform hover:scale-110"
              title="Save to collection"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <div
              className="transform transition-transform duration-400"
              style={{ transform: isHovered ? 'translateY(0)' : 'translateY(12px)' }}
            >
              <h3 className="font-serif text-lg text-white font-bold leading-tight line-clamp-2 mb-1 drop-shadow-md">
                {title}
              </h3>
              <p className="text-cream-100 text-sm line-clamp-1 italic opacity-90">
                {author}
              </p>
            </div>
          </div>
        </Link>
      </div>

      <SaveToCollectionModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        book={{ ...book, work_key: workKey, title, author }}
      />
    </>
  );
}

export default BookCard;