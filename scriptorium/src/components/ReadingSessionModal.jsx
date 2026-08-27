import { useState } from 'react';
import { X, BookOpen } from 'lucide-react';
import { logReadingSession } from '../api';

function ReadingSessionModal({ isOpen, onClose, book, onSessionLogged }) {
  const [formData, setFormData] = useState({
    duration_minutes: '',
    pages_read: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await logReadingSession(book.id, {
        duration_minutes: parseInt(formData.duration_minutes),
        pages_read: parseInt(formData.pages_read),
        notes: formData.notes
      });
      
      onSessionLogged();
      setFormData({ duration_minutes: '', pages_read: '', notes: '' });
      onClose();
    } catch (err) {
      setError('Failed to log reading session');
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

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-burgundy-100 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-burgundy-600" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-burgundy-800">
                Log Reading Session
              </h2>
              <p className="text-sm text-gray-600 italic">{book.title}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes) *
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.duration_minutes}
              onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
              className="w-full px-4 py-3 border border-burgundy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
              placeholder="e.g., 30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pages Read *
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.pages_read}
              onChange={(e) => setFormData({ ...formData, pages_read: e.target.value })}
              className="w-full px-4 py-3 border border-burgundy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
              placeholder="e.g., 15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-burgundy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 resize-none"
              placeholder="What did you think about this section?"
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
              {loading ? 'Logging...' : 'Log Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReadingSessionModal;