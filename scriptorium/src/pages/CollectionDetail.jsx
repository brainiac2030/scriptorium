import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Trash2, BookOpen, X, Check, BookMarked, Clock, TrendingUp } from 'lucide-react';
import { deleteCollection } from '../api';
import api from '../api';
import ReadingSessionModal from '../components/ReadingSessionModal';

function CollectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [collection, setCollection] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [selectedBook, setSelectedBook] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);

  useEffect(() => {
    fetchCollectionData();
  }, [id]);

  const fetchCollectionData = async () => {
    try {
      const [collectionRes, booksRes] = await Promise.all([
        api.get(`/collections/${id}`),
        api.get(`/collections/${id}/books`)
      ]);
      setCollection(collectionRes.data);
      setBooks(booksRes.data);
      setEditForm({ 
        name: collectionRes.data.name, 
        description: collectionRes.data.description || '' 
      });
    } catch (err) {
      console.error('Failed to fetch collection:', err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCollection = async () => {
    if (window.confirm(`Delete "${collection.name}"? This will remove all books inside it.`)) {
      try {
        await deleteCollection(id);
        navigate('/dashboard');
      } catch (err) {
        alert('Failed to delete collection');
      }
    }
  };

  const handleUpdateCollection = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/collections/${id}`, editForm);
      setCollection(response.data);
      setIsEditing(false);
    } catch (err) {
      alert('Failed to update collection');
    }
  };

  const handleUpdateBookStatus = async (bookId, newStatus) => {
    try {
      const response = await api.put(`/saved_books/${bookId}`, { status: newStatus });
      setBooks(books.map(b => b.id === bookId ? response.data : b));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleLogSession = async (book) => {
    setSelectedBook(book);
    setShowSessionModal(true);
  };

  const handleSessionLogged = () => {
    fetchCollectionData(); // Refresh to show updated progress
  };

  const handleRemoveBook = async (bookId, bookTitle) => {
    if (window.confirm(`Remove "${bookTitle}" from this collection?`)) {
      try {
        await api.delete(`/saved_books/${bookId}`);
        setBooks(books.filter(b => b.id !== bookId));
      } catch (err) {
        alert('Failed to remove book');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'finished': return 'bg-green-100 text-green-800 border-green-200';
      case 'reading': return 'bg-gold-400/20 text-gold-600 border-gold-400';
      default: return 'bg-cream-200 text-burgundy-700 border-burgundy-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'finished': return 'Finished';
      case 'reading': return 'Reading';
      default: return 'To Read';
    }
  };

  const getProgressPercentage = (book) => {
    if (!book.total_pages || !book.current_page) return 0;
    return Math.min(100, Math.round((book.current_page / book.total_pages) * 100));
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="h-8 bg-cream-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="h-48 bg-cream-200 rounded-2xl mb-8 animate-pulse"></div>
      </div>
    );
  }

  if (!collection) return null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Link */}
      <Link 
        to="/dashboard" 
        className="inline-flex items-center gap-2 text-burgundy-600 hover:text-burgundy-800 mb-6 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Collection Header */}
      <div className="bg-gradient-to-br from-burgundy-600 to-burgundy-800 rounded-2xl shadow-lift p-8 text-white mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex-1">
            {isEditing ? (
              <form onSubmit={handleUpdateCollection} className="space-y-3">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Collection name"
                />
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                  placeholder="Description (optional)"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white text-burgundy-700 rounded-lg font-medium hover:bg-cream-100 transition-colors flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <BookMarked className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-white/70">
                    {books.length} {books.length === 1 ? 'book' : 'books'}
                  </span>
                </div>
                <h1 className="font-serif text-4xl font-bold mb-2">{collection.name}</h1>
                {collection.description && (
                  <p className="text-white/80 text-lg">{collection.description}</p>
                )}
                <p className="text-white/60 text-sm mt-3">
                  Created {new Date(collection.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', month: 'long', day: 'numeric' 
                  })}
                </p>
              </>
            )}
          </div>

          {!isEditing && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                title="Edit collection"
              >
                <Edit3 className="w-5 h-5" />
              </button>
              <button
                onClick={handleDeleteCollection}
                className="p-2 bg-white/10 rounded-lg hover:bg-red-500/80 transition-colors"
                title="Delete collection"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Books Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-bold text-burgundy-700">
          Books in this Collection
        </h2>
      </div>

      {/* Empty State */}
      {books.length === 0 && (
        <div className="bg-white rounded-2xl shadow-soft p-12 border border-burgundy-100 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-burgundy-100 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-burgundy-600" />
          </div>
          <h3 className="font-serif text-xl font-bold text-burgundy-800 mb-2">
            No books yet
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Browse the homepage or search for books, then click the bookmark icon to add them here.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-burgundy-600 text-white rounded-full hover:bg-burgundy-700 transition-colors font-medium"
          >
            Discover Books
          </Link>
        </div>
      )}

      {/* Books Grid */}
      {books.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => {
            const progress = getProgressPercentage(book);
            
            return (
              <div
                key={book.id}
                className="bg-white rounded-2xl shadow-soft hover:shadow-lift transition-all duration-300 overflow-hidden border border-burgundy-100 flex flex-col group"
              >
                {/* Cover */}
                <div className="aspect-[2/3] bg-cream-200 relative">
                  {book.cover_id ? (
                    <img
                      src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450/F0E8DC/722F37?text=No+Cover'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-burgundy-600 font-serif text-lg p-4 text-center">
                      {book.title}
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(book.status)}`}>
                    {getStatusLabel(book.status)}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveBook(book.id, book.title)}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-red-600 hover:bg-white transition-colors shadow-md opacity-0 group-hover:opacity-100"
                    title="Remove from collection"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-serif text-base font-bold text-burgundy-800 line-clamp-2 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 italic line-clamp-1 mb-3">
                    {book.author}
                  </p>

                  {/* Progress Bar */}
                  {book.total_pages && book.current_page > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span className="font-semibold">{progress}%</span>
                      </div>
                      <div className="w-full bg-cream-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-burgundy-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Page {book.current_page} of {book.total_pages}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-auto pt-3 border-t border-burgundy-50 space-y-2">
                    {/* Status Selector */}
                    <select
                      value={book.status}
                      onChange={(e) => handleUpdateBookStatus(book.id, e.target.value)}
                      className="w-full px-3 py-2 bg-cream-100 border border-burgundy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500 cursor-pointer"
                    >
                      <option value="to_read">To Read</option>
                      <option value="reading">Currently Reading</option>
                      <option value="finished">Finished</option>
                    </select>

                    {/* Log Session Button */}
                    {book.status === 'reading' && (
                      <button
                        onClick={() => handleLogSession(book)}
                        className="w-full px-3 py-2 bg-gold-400/20 text-gold-700 border border-gold-400 rounded-lg text-sm font-medium hover:bg-gold-400/30 transition-colors flex items-center justify-center gap-2"
                      >
                        <Clock className="w-4 h-4" />
                        Log Reading Session
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reading Session Modal */}
      {selectedBook && (
        <ReadingSessionModal
          isOpen={showSessionModal}
          onClose={() => {
            setShowSessionModal(false);
            setSelectedBook(null);
          }}
          book={selectedBook}
          onSessionLogged={handleSessionLogged}
        />
      )}
    </div>
  );
}

export default CollectionDetail;