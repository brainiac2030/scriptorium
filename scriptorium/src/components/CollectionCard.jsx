import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, Trash2 } from 'lucide-react';
import { deleteCollection } from '../api';

function CollectionCard({ collection, onDelete }) {
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm(`Delete "${collection.name}"? This will also remove all books inside it.`)) {
      try {
        await deleteCollection(collection.id);
        onDelete(collection.id);
      } catch (err) {
        alert('Failed to delete collection');
      }
    }
  };

  return (
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
            onClick={handleDelete}
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
  );
}

export default CollectionCard;