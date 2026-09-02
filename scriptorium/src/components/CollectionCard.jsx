import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { deleteCollection } from '../api';
import { useToast } from '../context/ToastContext';

function CollectionCard({ collection, onDelete }) {
  const { success, error: showError } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleting(true);

    try {
      await deleteCollection(collection.id);
      onDelete(collection.id);
      success('Collection deleted');
    } catch (err) {
      showError('Failed to delete collection');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <Link
        to={`/collections/${collection.id}`}
        className="group bg-white rounded-2xl shadow-soft hover:shadow-lift transition-all duration-300 overflow-hidden border border-burgundy-100 flex flex-col transform hover:-translate-y-1"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-burgundy-600 to-burgundy-800 p-6 text-white relative">
          <div className="flex items-start justify-between">
            <div className="bg-white/20 p-3 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowConfirm(true);
              }}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
              title="Delete collection"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-serif text-xl font-bold text-burgundy-800 mb-2 line-clamp-1">
            {collection.name}
          </h3>
          {collection.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
              {collection.description}
            </p>
          )}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-burgundy-50">
            <span className="text-xs text-gray-500">
              Created {new Date(collection.created_at).toLocaleDateString()}
            </span>
            <ChevronRight className="w-4 h-4 text-burgundy-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-2xl shadow-lift max-w-sm w-full p-6 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2.5 rounded-full">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-serif text-lg font-bold text-burgundy-800">
                Delete Collection?
              </h3>
            </div>

            <p className="text-gray-600 text-sm mb-6">
              Delete <strong>"{collection.name}"</strong>? This will also remove
              all books inside it. This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="flex-1 py-2.5 border border-burgundy-200 text-burgundy-700 font-medium rounded-xl hover:bg-cream-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CollectionCard;