import { useState, useEffect } from 'react';
import { X, Plus, Library } from 'lucide-react';
import { getCollections, addSavedBook } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function SaveToCollectionModal({ isOpen, onClose, book }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      fetchCollections();
    }
  }, [isOpen, user]);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const response = await getCollections();
      setCollections(response.data);
    } catch (err) {
      setError('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (collectionId) => {
    setSaving(true);
    setError('');

    try {
      await addSavedBook({
        collection_id: collectionId,
        work_key: book.work_key || book.key,
        title: book.title,
        author: book.author_name ? book.author_name[0] : (book.author || 'Unknown'),
        cover_id: book.cover_i || book.cover_id || null,
        status: 'to_read'
      });
      
      // Success feedback
      alert(`"${book.title}" saved to your collection!`);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save book');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateNew = () => {
    onClose();
    navigate('/dashboard'); // User can create a collection from the dashboard
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lift max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="font-serif text-2xl font-bold text-burgundy-800 mb-2">
            Save to Collection
          </h2>
          <p className="text-gray-600 text-sm">
            Choose a collection to save <span className="font-semibold italic">"{book.title}"</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-cream-200 rounded-lg animate-pulse"></div>
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
            <p className="text-gray-600 text-sm mb-4">
              Create your first collection to start organizing books.
            </p>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy-600 text-white rounded-full hover:bg-burgundy-700 transition-colors font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              Create Collection
            </button>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {collections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => handleSave(collection.id)}
                disabled={saving}
                className="w-full text-left p-4 bg-cream-100 hover:bg-burgundy-50 border border-burgundy-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-burgundy-800">{collection.name}</h4>
                    {collection.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {collection.description}
                      </p>
                    )}
                  </div>
                  <Plus className="w-5 h-5 text-burgundy-600 flex-shrink-0" />
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