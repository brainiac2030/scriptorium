import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

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

  if (loading) return <div className="text-center py-20"><p className="text-lg text-gray-600">Loading book details...</p></div>;
  if (error) return <div className="text-center py-20"><p className="text-lg text-red-600">{error}</p></div>;
  if (!book) return <div className="text-center py-20"><p className="text-lg text-gray-600">Book not found.</p></div>;

  const description = typeof book.description === 'string' 
    ? book.description 
    : book.description?.value || 'No description available for this book.';

  const coverId = book.covers && book.covers.length > 0 ? book.covers[0] : null;

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
        &larr; Back to Home
      </Link>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Cover Image */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            {coverId ? (
              <img 
                src={`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`} 
                alt={`Cover of ${book.title}`} 
                className="w-48 md:w-64 rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-48 md:w-64 h-72 md:h-96 bg-gray-100 flex items-center justify-center rounded-lg shadow-lg text-gray-400">
                No Cover
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <h3 className="text-xl text-gray-600 mb-6">
              by <span className="italic text-gray-800">{authorName}</span>
            </h3>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">About this book</h4>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{description}</p>
            </div>

            {book.subjects && book.subjects.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  {book.subjects.slice(0, 15).map((subject, index) => (
                    <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
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