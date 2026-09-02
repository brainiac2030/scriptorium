import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  BookOpen,
  X,
  Check,
  BookMarked,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { deleteCollection, updateCollection } from '../api';
import api from '../api';
import { useToast } from '../context/ToastContext';
import ReadingSessionModal from '../components/ReadingSessionModal';

function CollectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  const [collection, setCollection] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [selectedBook, setSelectedBook] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // { type: 'collection' | 'book', id, title }

  useEffect(() => {
    fetchCollectionData();
  }, [id]);

  const fetchCollectionData = async () => {
    try {
      const [collectionRes, booksRes] = await Promise.all([
        api.get(`/collections/${id}`),
        api.get(`/collections/${id}/books`),
      ]);
      setCollection(collectionRes.data);
      setBooks(booksRes.data || []);
      setEditForm({
        name: collectionRes.data.name,
        description: collectionRes.data.description || '',
      });
    } catch (err) {
      console.error('Failed to fetch collection:', err);
      showError('Collection not found');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCollection = async () => {
    try {
      await deleteCollection(id);
      success('Collection deleted');
      navigate('/dashboard');
    } catch (err) {
      showError('Failed to delete collection');
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleUpdateCollection = async (e) => {
    e.preventDefault();
    try {
      const response = await updateCollection(id, editForm);
      setCollection(response.data);
      setIsEditing(false);
      success('Collection updated');
    } catch (err) {
      showError('Failed to update collection');
    }
  };

  const handleUpdateBookStatus = async (bookId, newStatus) => {
    try {
      const response = await api.put(`/saved_books/${bookId}`, {
        status: newStatus,
      });
      setBooks((prev) =>
        prev.map((b) => (b.id === bookId ? response.data : b))
      );
      success('Status updated');
    } catch (err) {
      showError('Failed to update status');
    }
  };

  const handleLogSession = (book) => {
    setSelectedBook(book);
    setShowSessionModal(true);
  };

  const handleSessionLogged = () => {
    success('Reading session logged');
    fetchCollectionData();
  };

  const handleRemoveBook = async (bookId) => {
    try {
      await api.delete(`/saved_books/${bookId}`);
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      success('Book removed from collection');
    } catch (err) {
      showError('Failed to remove book');
    } finally {
      setConfirmDelete(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'finished':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'reading':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-cream-200 text-burgundy-700 border-burgundy-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'finished':
        return 'Finished';
      case 'reading':
        return 'Reading';
      default:
        return 'To Read';
    }
  };

  const getProgressPercentage = (book) => {
    if (!book.total_pages || !book.current_page) return 0;
    return Math.min(100, Math.round((book.current_page / book.total_pages) * 100));
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto animate-fadeIn">
        <div className="h-6 w-40 bg-cream-200 rounded mb-6 animate-pulse" />
        <div className="h-48 bg-cream-200 rounded-2xl mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-soft overflow-hidden animate-pulse">
              <div className="aspect-[2/3] bg-cream-200" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-cream-200 rounded w-3/4" />
                <div className="h-4 bg-cream-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!collection) return null;

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      {/* Back Link */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-burgundy-600 hover:text-burgundy-800 mb-6 transition-colors font-medium group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      {/* Collection Header */}
      <div className="bg-gradient-to-br from-burgundy-600 to-burgundy-800 rounded-2xl shadow-lift p-6 md:p-8 text-white mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 pointer-events-none" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <form onSubmit={handleUpdateCollection} className="space-y-3">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
                  placeholder="Collection name"
                  required
                />
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 resize-none"
                  placeholder="Description (optional)"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white text-burgundy-700 rounded-lg font-medium hover:bg-cream-100 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Check className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors text-sm"
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
                <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
                  {collection.name}
                </h1>
                {collection.description && (
                  <p className="text-white/80 text-lg">{collection.description}</p>
                )}
                <p className="text-white/60 text-sm mt-3">
                  Created{' '}
                  {new Date(collection.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </>
            )}
          </div>

          {!isEditing && (
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                title="Edit collection"
              >
                <Edit3 className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setConfirmDelete({
                    type: 'collection',
                    id: collection.id,
                    title: collection.name,
                  })
                }
                className="p-2.5 bg-white/10 rounded-lg hover:bg-red-500/80 transition-colors"
                title="Delete collection"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Books Section Header */}
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
            Browse the homepage or search for books, then click the bookmark icon
            to add them here.
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
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-burgundy-600 font-serif text-base p-4 text-center">
                      {book.title}
                    </div>
                  )}

                  {/* Status Badge */}
                  <div
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      book.status
                    )}`}
                  >
                    {getStatusLabel(book.status)}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() =>
                      setConfirmDelete({
                        type: 'book',
                        id: book.id,
                        title: book.title,
                      })
                    }
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-red-600 hover:bg-white transition-all shadow-md opacity-0 group-hover:opacity-100"
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
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Page {book.current_page} of {book.total_pages}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-auto pt-3 border-t border-burgundy-50 space-y-2">
                    <select
                      value={book.status}
                      onChange={(e) =>
                        handleUpdateBookStatus(book.id, e.target.value)
                      }
                      className="w-full px-3 py-2 bg-cream-50 border border-burgundy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500 cursor-pointer"
                    >
                      <option value="to_read">To Read</option>
                      <option value="reading">Currently Reading</option>
                      <option value="finished">Finished</option>
                    </select>

                    {book.status === 'reading' && (
                      <button
                        onClick={() => handleLogSession(book)}
                        className="w-full px-3 py-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <Clock className="w-4 h-4" />
                        Log Session
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

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lift max-w-sm w-full p-6 animate-scaleIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2.5 rounded-full">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-serif text-lg font-bold text-burgundy-800">
                Confirm Delete
              </h3>
            </div>

            <p className="text-gray-600 text-sm mb-6">
              {confirmDelete.type === 'collection' ? (
                <>
                  Delete <strong>"{confirmDelete.title}"</strong>? This will also
                  remove all books inside it. This action cannot be undone.
                </>
              ) : (
                <>
                  Remove <strong>"{confirmDelete.title}"</strong> from this
                  collection?
                </>
              )}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 border border-burgundy-200 text-burgundy-700 font-medium rounded-xl hover:bg-cream-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmDelete.type === 'collection') {
                    handleDeleteCollection();
                  } else {
                    handleRemoveBook(confirmDelete.id);
                  }
                }}
                className="flex-1 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
              >
                {confirmDelete.type === 'collection' ? 'Delete' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollectionDetail;