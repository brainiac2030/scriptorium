import { BookOpen } from 'lucide-react';

function BookCover({ coverId, title, size = 'L', className = '', loading = 'lazy' }) {
  const src = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
    : null;

  return (
    <div
      className={`relative overflow-hidden bg-[#2d3142] ${className}`}
      style={{
        boxShadow:
          '8px 10px 0 rgba(45, 49, 66, 0.12), 0 16px 28px -12px rgba(45, 49, 66, 0.35)',
      }}
    >
      <div className="absolute inset-0 flex flex-col justify-between p-4 text-center text-[#f7f3e9]">
        <BookOpen className="mx-auto h-5 w-5 opacity-40" />
        <span className="font-serif text-sm font-medium leading-snug line-clamp-4">
          {title || 'Untitled'}
        </span>
        <span className="text-[9px] uppercase tracking-[0.16em] opacity-40">Open Library</span>
      </div>

      {src && (
        <img
          src={src}
          alt={title ? `Cover of ${title}` : 'Book cover'}
          className="absolute inset-0 z-10 h-full w-full object-cover"
          loading={loading}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
    </div>
  );
}

export default BookCover;