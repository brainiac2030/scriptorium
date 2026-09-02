import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  User,
  Tag,
  ExternalLink,
  Globe,
  Calendar,
  BookMarked,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import SaveToCollectionModal from '../components/SaveToCollectionModal';

function BookDetails() {
  const { id } = useParams();
  const workKey = decodeURIComponent(id);

  const { user } = useAuth();
  const { info } = useToast();

  const [book, setBook] = useState(null);
  const [authorName, setAuthorName] = useState('Unknown Author');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [editions, setEditions] = useState([]);
  const [readLinks, setReadLinks] = useState([]);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch work details
        const response = await fetch(`https://openlibrary.org${workKey}.json`);
        if (!response.ok) throw new Error('Failed to fetch book details.');
        const data = await response.json();
        setBook(data);

        // Fetch author name
        if (data.authors && data.authors.length > 0) {
          try {
            const authorKey = data.authors[0].author.key;
            const authorResponse = await fetch(`https://openlibrary.org${authorKey}.json`);
            if (authorResponse.ok) {
              const authorData = await authorResponse.json();
              setAuthorName(authorData.name || 'Unknown Author');
            }
          } catch (err) {
            console.error('Failed to fetch author name', err);
          }
        }

        // Try to get editions + Internet Archive availability
        try {
          const editionsRes = await fetch(
            `https://openlibrary.org${workKey}/editions.json?limit=20`
          );
          if (editionsRes.ok) {
            const editionsData = await editionsRes.json();
            const entries = editionsData.entries || [];
            setEditions(entries);

            // Collect possible read/borrow links
            const links = [];
            entries.forEach((edition) => {
              if (edition.ocaid) {
                links.push({
                  type: 'archive',
                  label: 'Read on Internet Archive',
                  url: `https://archive.org/stream/${edition.ocaid}`,
                  ocaid: edition.ocaid,
                });
              }
              if (edition.isbn_13?.[0] || edition.isbn_10?.[0]) {
                // We can later expand this
              }
            });

            
            const unique = Array.from(
              new Map(links.map((item) => [item.ocaid, item])).values()
            );
            setReadLinks(unique);
          }
        } catch (err) {
          console.error('Failed to fetch editions', err);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [workKey]);

  const handleSaveClick = () => {
    if (!user) {
      info('Please sign in to save books to your collections');
      return;
    }
    setShowSaveModal(true);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <div className="h-6 w-32 bg-cream-200 rounded mb-8 animate-pulse" />
        <div className="bg-white rounded-3xl shadow-soft border border-burgundy-100 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 p-8 md:p-10 bg-cream-100 flex justify-center">
              <div className="w-full max-w-[280px] aspect-[2/3] bg-cream-200 rounded-xl animate-pulse" />
            </div>
            <div className="md:w-2/3 p-8 md:p-10 space-y-5">
              <div className="h-10 bg-cream-200 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-cream-200 rounded w-1/3 animate-pulse" />
              <div className="h-4 bg-cream-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-cream-200 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-cream-200 rounded w-4/6 animate-pulse" />
              <div className="flex gap-3 pt-4">
                <div className="h-12 w-40 bg-cream-200 rounded-full animate-pulse" />
                <div className="h-12 w-40 bg-cream-200 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24">
        <p className="text-lg text-red-600 mb-4">{error}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-burgundy-600 text-white rounded-full hover:bg-burgundy-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-24">
        <p className="text-lg text-gray-600">Book not found.</p>
      </div>
    );
  }

  const description =
    typeof book.description === 'string'
      ? book.description
      : book.description?.value || 'No description available for this book.';

  const coverId = book.covers && book.covers.length > 0 ? book.covers[0] : null;
  const firstPublishYear = book.first_publish_date || book.first_publish_year;

  // Prepare book object for the modal
  const bookForModal = {
    key: workKey,
    work_key: workKey,
    title: book.title,
    author_name: [authorName],
    author: authorName,
    cover_i: coverId,
    cover_id: coverId,
  };

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-burgundy-600 hover:text-burgundy-800 mb-8 transition-colors font-medium group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Library
      </Link>

      <div className="bg-white rounded-3xl shadow-soft border border-burgundy-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* ========== COVER SIDEBAR ========== */}
          <div className="md:w-1/3 p-8 md:p-10 flex flex-col items-center bg-gradient-to-b from-cream-100 to-cream-50">
            {coverId ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`}
                alt={book.title}
                className="w-full max-w-[280px] rounded-xl shadow-lift object-cover"
              />
            ) : (
              <div className="w-full max-w-[280px] aspect-[2/3] bg-cream-200 flex items-center justify-center rounded-xl shadow-lift text-burgundy-600 font-serif text-2xl p-6 text-center">
                {book.title}
              </div>
            )}

            {/* Quick actions */}
            <div className="w-full max-w-[280px] mt-6 space-y-3">
              <button
                onClick={handleSaveClick}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-burgundy-600 text-white rounded-xl hover:bg-burgundy-700 transition-all font-medium shadow-soft hover:shadow-lift"
              >
                <Bookmark className="w-5 h-5" />
                Save to Collection
              </button>

              {readLinks.length > 0 && (
                <a
                  href={readLinks[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-white border-2 border-burgundy-200 text-burgundy-700 rounded-xl hover:bg-burgundy-50 transition-all font-medium"
                >
                  <BookOpen className="w-5 h-5" />
                  Read Online
                </a>
              )}
            </div>
          </div>

          {/* ========== DETAILS CONTENT ========== */}
          <div className="md:w-2/3 p-8 md:p-10">
            {/* Title + Author */}
            <div className="mb-6">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-burgundy-800 leading-tight mb-3">
                {book.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-burgundy-500" />
                  <span className="text-lg italic">{authorName}</span>
                </div>

                {firstPublishYear && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-burgundy-500" />
                    <span>{firstPublishYear}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="hidden md:flex flex-wrap gap-3 mb-8">
              <button
                onClick={handleSaveClick}
                className="inline-flex items-center gap-2 px-6 py-3 bg-burgundy-600 text-white rounded-full hover:bg-burgundy-700 transition-all font-medium shadow-soft hover:shadow-lift"
              >
                <Bookmark className="w-5 h-5" />
                Save to Collection
              </button>

              {readLinks.length > 0 ? (
                <a
                  href={readLinks[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-burgundy-300 text-burgundy-700 rounded-full hover:bg-burgundy-50 transition-all font-medium"
                >
                  <BookOpen className="w-5 h-5" />
                  Read Online
                  <ExternalLink className="w-4 h-4 opacity-70" />
                </a>
              ) : (
                <a
                  href={`https://openlibrary.org${workKey}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-burgundy-200 text-burgundy-600 rounded-full hover:bg-cream-100 transition-all font-medium"
                >
                  <Globe className="w-5 h-5" />
                  View on Open Library
                  <ExternalLink className="w-4 h-4 opacity-70" />
                </a>
              )}
            </div>

            {/* Availability notice */}
            {readLinks.length > 0 && (
              <div className="mb-8 flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800 text-sm">
                    Available to read online
                  </p>
                  <p className="text-green-700 text-sm mt-0.5">
                    This book has a digitized version on Internet Archive.
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h3 className="font-serif text-xl font-semibold text-burgundy-700 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                About this book
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* Subjects */}
            {book.subjects && book.subjects.length > 0 && (
              <div className="mb-2">
                <h3 className="font-serif text-xl font-semibold text-burgundy-700 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Subjects & Themes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {book.subjects.slice(0, 18).map((subject, index) => (
                    <span
                      key={index}
                      className="bg-cream-100 text-burgundy-700 px-3.5 py-1.5 rounded-full text-sm font-medium border border-burgundy-100 hover:bg-burgundy-50 transition-colors"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Extra read links if multiple */}
            {readLinks.length > 1 && (
              <div className="mt-8 pt-6 border-t border-burgundy-100">
                <h4 className="text-sm font-semibold text-burgundy-700 mb-3">
                  More reading options
                </h4>
                <div className="flex flex-wrap gap-2">
                  {readLinks.slice(1).map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-cream-100 text-burgundy-700 rounded-lg hover:bg-burgundy-50 transition-colors"
                    >
                      <BookMarked className="w-4 h-4" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Modal */}
      <SaveToCollectionModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        book={bookForModal}
      />
    </div>
  );
}

export default BookDetails;