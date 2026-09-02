import { useState, useEffect } from 'react';
import { X, Plus, Library, Check } from 'lucide-react';
import { getCollections, addSavedBook } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

function SaveToCollectionModal({ isOpen, onClose, book }) {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      fetchCollections();
    }
  }, [isOpen, user]);

  const fetchCollections = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getCollections();
      setCollections(response.data || []);
    } catch (err) {
      setError('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (collectionId) => {
    if (!book) return;

    setSavingId(collectionId);
    setError('');

    try {
      const authorName = Array.isArray(book.author_name)
        ? book.author_name[0]
        : book.author || book.author_name || 'Unknown Author';

      await addSavedBook({
        collection_id: collectionId,
        work_key: book.work_key || book.key,
        title: book.title,
        author: authorName,
        cover_id: book.cover_i || book.cover_id || null,
        status: 'to_read',
        total_pages: book.number_of_pages_median || book.number_of_pages || null,
      });

      success(`"${book.title}" saved to your collection`);
      onClose();
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to save book';
      setError(message);
      showError(message);
    } finally {
      setSavingId(null);
    }
  };

  const handleCreateNew = () => {
    onClose();
    navigate('/dashboard');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lift max-w-md w-full p-6 md:p-8 relative animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-cream-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 pr-8">
          <h2 className="font-serif text-2xl font-bold text-burgundy-800 mb-1">
            Save to Collection
          </h2>
          <p className="text-gray-600 text-sm">
            Choose a collection for{' '}
            <span className="font-semibold italic text-burgundy-700">
              "{book?.title}"
            </span>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-cream-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-burgundy-100 rounded-full mb-4">
              <Library className="w-8 h-8 text-burgundy-600" />
            </div>
            <h3 className="font-serif text-lg font-bold text-burgundy-800 mb-2">
              No collections yet
            </h3>
            <p className="text-gray-600 text-sm mb-5">
              Create your first collection to start organizing books.
            </p>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-burgundy-600 text-white rounded-full hover:bg-burgundy-700 transition-colors font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              Create Collection
            </button>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {collections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => handleSave(collection.id)}
                disabled={savingId !== null}
                className="w-full text-left p-4 bg-cream-50 hover:bg-burgundy-50 border border-burgundy-100 rounded-xl transition-all disabled:opacity-60 group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-burgundy-800 truncate">
                      {collection.name}
                    </h4>
                    {collection.description && (
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                        {collection.description}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {savingId === collection.id ? (
                      <div className="w-5 h-5 border-2 border-burgundy-300 border-t-burgundy-600 rounded-full animate-spin" />
                    ) : (
                      <Plus className="w-5 h-5 text-burgundy-500 group-hover:text-burgundy-700 transition-colors" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SaveToCollectionModal;