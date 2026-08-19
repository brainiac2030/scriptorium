import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function BookDetails() {
  const { id } = useParams(); // This is the encoded key from the URL
  const workKey = decodeURIComponent(id); // e.g., /works/OL123W
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch the work details using the decoded key
        const response = await fetch(`https://openlibrary.org${workKey}.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch book details.');
        }
        const data = await response.json();
        setBook(data);
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

  // Handle description (it can be a string or an object with a 'value' property)
  const description = typeof book.description === 'string' 
    ? book.description 
    : book.description?.value || 'No description available.';

  // Get the primary cover ID
  const coverId = book.covers && book.covers.length > 0 ? book.covers[0] : null;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        &larr; Back to Home
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
          
          <h3 style={{ color: '#555', fontWeight: 'normal', marginTop: '5px' }}>About this book</h3>
          <p style={{ lineHeight: '1.6', color: '#333' }}>{description}</p>

          {book.subjects && book.subjects.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ color: '#555', fontWeight: 'normal' }}>Subjects</h3>
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