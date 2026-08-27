import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SaveToCollectionModal from './SaveToCollectionModal';

function BookCard({ book }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const { user } = useAuth();
  
  // Handle different API response shapes 
  const coverId = book.cover_i || book.cover_id;
  const title = book.title;
  const author = book.author_name ? book.author_name[0] : (book.authors ? book.authors[0]?.name : 'Unknown');
  const workKey = book.key;

  const handleSaveClick = (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please sign in to save books to your collections.');
      return;
    }
    
    setShowSaveModal(true);
  };

  return (
    <>
      <div 
        className="break-inside-avoid mb-6 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link 
          to={`/book/${encodeURIComponent(workKey)}`} 
          className="block relative overflow-hidden rounded-2xl shadow-soft hover:shadow-lift transition-all duration-300 transform hover:-translate-y-1"
        >
          {/* The Cover Image */}
          <div className="aspect-[2/3] bg-cream-200">
            {coverId ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450/F0E8DC/722F37?text=No+Cover'; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-burgundy-600 font-serif text-lg p-4 text-center bg-cream-200">
                {title}
              </div>
            )}
          </div>

          {/* Pinterest-Style Hover Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={handleSaveClick}
              className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-burgundy-600 hover:bg-white transition-colors shadow-md"
              title="Save to collection"
            >
              <Bookmark className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-lg text-white font-semibold leading-tight line-clamp-2">
              {title}
            </h3>
            <p className="text-cream-200 text-sm mt-1 line-clamp-1 italic">
              {author}
            </p>
          </div>
        </Link>
      </div>

      {/* Save Modal */}
      <SaveToCollectionModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        book={{ ...book, work_key: workKey }}
      />
    </>
  );
}

export default BookCard;