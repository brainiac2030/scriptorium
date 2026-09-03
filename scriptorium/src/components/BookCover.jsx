import { BookOpen } from 'lucide-react';

function BookCover({ coverId, title, size = 'M', className = '', loading = 'lazy' }) {
  return (
    <div className={`relative overflow-hidden bg-burgundy-800 ${className}`}>
      <div className="absolute inset-0 flex flex-col items-center justify-center border border-white/15 p-4 text-center text-cream-100">
        <BookOpen className="mb-3 h-7 w-7 opacity-60" />
        <span className="font-serif text-sm font-bold leading-snug">{title || 'Untitled'}</span>
      </div>
      {coverId ? (
        <img src={`https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`} alt={`Cover of ${title}`} className="absolute inset-0 z-10 h-full w-full object-cover" loading={loading} onError={(event) => { event.currentTarget.style.display = 'none'; }} />
      ) : null}
    </div>
  );
}

export default BookCover;
