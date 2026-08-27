import { useState } from 'react';
import { X } from 'lucide-react';
import { createCollection } from '../api';

function CreateCollectionModal({ isOpen, onClose, onCollectionCreated }) {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createCollection(formData);
      onCollectionCreated(); // Refresh the collections list
      setFormData({ name: '', description: '' });
      onClose();
    } catch (err) {
      setError(err.response?.data?.errors?.name?.[0] || 'Failed to create collection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lift max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-serif text-2xl font-bold text-burgundy-800 mb-2">
          Create New Collection
        </h2>
        <p className="text-gray-600 mb-6">
          Organize your books by theme, subject, or reading goal.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Collection Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={100}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-burgundy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
              placeholder="e.g., Python Learning, Summer Fiction"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-burgundy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 resize-none"
              placeholder="What's this collection about?"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-burgundy-200 text-burgundy-700 font-medium rounded-lg hover:bg-cream-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-burgundy-600 text-white font-semibold rounded-lg hover:bg-burgundy-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCollectionModal;