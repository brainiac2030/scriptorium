import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, BookOpen, User, Tag } from 'lucide-react';

function BookDetails() {
  const { id } = useParams();
  const workKey = decodeURIComponent(id);

  const [book, setBook] = useState(null);
  const [authorName, setAuthorName] = useState('Unknown Author');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://openlibrary.org${workKey}.json`);
        if (!response.ok) throw new Error('Failed to fetch book details.');
        const data = await response.json();
        setBook(data);

        if (data.authors && data.authors.length > 0) {
          try {
            const authorKey = data.authors[0].author.key;
            const authorResponse = await fetch(`https://openlibrary.org${authorKey}.json`);
            if (authorResponse.ok) {
              const authorData = await authorResponse.json();
              setAuthorName(authorData.name);
            }
          } catch (err) {
            console.error("Failed to fetch author name.", err);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookDetails();
  }, [workKey]);

  if (loading) return (
    <div className="max-w-5xl mx-auto py-12">
      <div className="flex flex-col md:flex-row gap-10 animate-pulse">
        <div className="w-64 h-96 bg-cream-200 rounded-2xl flex-shrink-0"></div>
        <div className="flex-1 space-y-4">
          <div className="h-10 bg-cream-200 rounded w-3/4"></div>
          <div className="h-6 bg-cream-200 rounded w-1/4"></div>
          <div className="h-32 bg-cream-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );

  if (error) return <div className="text-center py-20"><p className="text-lg text-red-600">{error}</p></div>;
  if (!book) return <div className="text-center py-20"><p className="text-lg text-gray-600">Book not found.</p></div>;

  const description = typeof book.description === 'string'
    ? book.description
    : book.description?.value || 'No description available for this book.';

  const coverId = book.covers && book.covers.length > 0 ? book.covers[0] : null;

  return (
    <div className="max-w-5xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-burgundy-600 hover:text-burgundy-800 mb-8 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" />
        Back to Library
      </Link>

      <div className="bg-white rounded-3xl shadow-soft border border-burgundy-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Cover Sidebar */}
          <div className="md:w-1/3 p-8 md:p-10 flex items-center justify-center bg-cream-100">
            {coverId ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`}
                alt={book.title}
                className="w-full max-w-[280px] rounded-xl shadow-lift"
              />
            ) : (
              <div className="w-full max-w-[280px] aspect-[2/3] bg-cream-200 flex items-center justify-center rounded-xl shadow-lift text-burgundy-600 font-serif text-2xl p-6 text-center">
                {book.title}
              </div>
            )}
          </div>

          {/* Details Content */}
          <div className="md:w-2/3 p-8 md:p-10">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-burgundy-800 leading-tight mb-2">
                  {book.title}
                </h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="text-lg italic">{authorName}</span>
                </div>
              </div>
              <button
                onClick={() => alert('Save to library feature coming in Phase 3!')}
                className="flex-shrink-0 p-3 bg-burgundy-50 text-burgundy-600 rounded-full hover:bg-burgundy-100 transition-colors"
              >
                <Bookmark className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-8">
              <h3 className="font-serif text-xl font-semibold text-burgundy-700 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> About this book
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{description}</p>
            </div>

            {book.subjects && book.subjects.length > 0 && (
              <div>
                <h3 className="font-serif text-xl font-semibold text-burgundy-700 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5" /> Subjects & Themes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {book.subjects.slice(0, 20).map((subject, index) => (
                    <span key={index} className="bg-cream-200 text-burgundy-700 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-burgundy-100 transition-colors cursor-default">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;