import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function BookDetails() {
  const { id } = useParams(); 
  const workKey = decodeURIComponent(id); 
  
  const [book, setBook] = useState(null);
  const [authorName, setAuthorName] = useState('Unknown Author'); // New state for the author
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch the Book (Work) details
        const response = await fetch(`https://openlibrary.org${workKey}.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch book details.');
        }
        const data = await response.json();
        setBook(data);

        
        if (data.authors && data.authors.length > 0) {
          try {
            // The API returns an array of authors. We'll grab the first one.
            const authorKey = data.authors[0].author.key; 
            const authorResponse = await fetch(`https://openlibrary.org${authorKey}.json`);
            
            if (authorResponse.ok) {
              const authorData = await authorResponse.json();
              setAuthorName(authorData.name);
            }
          } catch (err) {
            console.error("Failed to fetch author name, falling back to Unknown.", err);
            
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

  if (loading) return <p style={{ textAlign: 'center', fontSize: '18px' }}>Loading book details...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  if (!book) return <p style={{ textAlign: 'center' }}>Book not found.</p>;

  const description = typeof book.description === 'string' 
    ? book.description 
    : book.description?.value || 'No description available for this book.';

  const coverId = book.covers && book.covers.length > 0 ? book.covers[0] : null;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        &larr; Back to Search
      </Link>
      
      <div style={{ display: 'flex', gap: '30px', marginTop: '20px', flexWrap: 'wrap' }}>
        {/* Cover Image */}
        <div style={{ flex: '0 0 250px' }}>
          {coverId ? (
            <img 
              src={`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`} 
              alt={`Cover of ${book.title}`} 
              style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            />
          ) : (
            <div style={{ width: '250px', height: '350px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: '#999' }}>
              No Cover
            </div>
          )}
        </div>

        {/* Book Info */}
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h1 style={{ marginTop: 0 }}>{book.title}</h1>
          
          {/* Display the fetched Author Name */}
          <h3 style={{ color: '#555', fontWeight: 'normal', marginTop: '5px', marginBottom: '20px' }}>
            by <span style={{ fontStyle: 'italic' }}>{authorName}</span>
          </h3>

          <h4 style={{ color: '#333', marginBottom: '10px' }}>About this book</h4>
          <p style={{ lineHeight: '1.6', color: '#444' }}>{description}</p>

          {book.subjects && book.subjects.length > 0 && (
            <div style={{ marginTop: '25px' }}>
              <h4 style={{ color: '#333', marginBottom: '10px' }}>Subjects</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {book.subjects.slice(0, 15).map((subject, index) => (
                  <span key={index} style={{ backgroundColor: '#e9ecef', padding: '5px 10px', borderRadius: '15px', fontSize: '14px', color: '#495057' }}>
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetails;