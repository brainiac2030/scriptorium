import { Link } from 'react-router-dom';
import { Bookmark, Star } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SaveToCollectionModal from './SaveToCollectionModal';

function BookCard({ book }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const { user } = useAuth();
  
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
          className="block relative overflow-hidden rounded-2xl shadow-soft hover:shadow-lift transition-all duration-500 transform hover:-translate-y-2"
        >
          {/* The Cover Image */}
          <div className="aspect-[2/3] bg-gradient-to-br from-cream-200 to-cream-300 relative">
            {coverId ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450/F0E8DC/722F37?text=No+Cover'; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-burgundy-600 font-serif text-lg p-6 text-center bg-gradient-to-br from-cream-200 to-cream-300">
                <div>
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">{title}</p>
                </div>
              </div>
            )}
          </div>

          {/* Pinterest-Style Hover Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5 transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={handleSaveClick}
              className="absolute top-4 right-4 p-2.5 bg-white rounded-full text-burgundy-600 hover:bg-burgundy-600 hover:text-white transition-all shadow-lift transform hover:scale-110"
              title="Save to collection"
            >
              <Bookmark className="w-5 h-5" />
            </button>
            
            <div className="transform transition-transform duration-500" style={{ transform: isHovered ? 'translateY(0)' : 'translateY(10px)' }}>
              <h3 className="font-serif text-xl text-white font-bold leading-tight line-clamp-2 mb-2 drop-shadow-lg">
                {title}
              </h3>
              <p className="text-cream-100 text-sm line-clamp-1 italic drop-shadow-md">
                by {author}
              </p>
            </div>
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