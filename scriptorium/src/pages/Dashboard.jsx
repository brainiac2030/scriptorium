import { useState, useEffect } from 'react';
import {
  Plus,
  Library,
  BookOpen,
  TrendingUp,
  Award,
  Target,
  BookMarked,
} from 'lucide-react';
import {
  getCollections,
  getSavedBooks,
  getUserStats,
  getReadingGoal,
  setReadingGoal,
} from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import CollectionCard from '../components/CollectionCard';
import CreateCollectionModal from '../components/CreateCollectionModal';

function Dashboard() {
  const { user } = useAuth();
  const { success, error: showError } = useToast();

  const [collections, setCollections] = useState([]);
  const [stats, setStats] = useState(null);
  const [goal, setGoal] = useState(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalForm, setGoalForm] = useState({ books_target: '', pages_target: '' });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentlyReading, setCurrentlyReading] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [collectionsRes, booksRes, statsRes] = await Promise.all([
        getCollections(),
        getSavedBooks(),
        getUserStats(),
      ]);

      setCollections(collectionsRes.data || []);
      setStats(statsRes.data);

      // Extract currently reading books
      const reading = (booksRes.data || []).filter((b) => b.status === 'reading');
      setCurrentlyReading(reading);

      try {
        const goalRes = await getReadingGoal();
        setGoal(goalRes.data);
      } catch {
        // No goal set yet — that's fine
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      showError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGoal = async (e) => {
    e.preventDefault();
    try {
      await setReadingGoal({
        books_target: parseInt(goalForm.books_target),
        pages_target: goalForm.pages_target
          ? parseInt(goalForm.pages_target)
          : null,
      });
      setShowGoalModal(false);
      setGoalForm({ books_target: '', pages_target: '' });
      success('Reading goal saved!');
      fetchData();
    } catch (err) {
      showError('Failed to set goal');
    }
  };

  const handleCollectionDeleted = (id) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
    success('Collection deleted');
  };

  const getGoalProgress = () => {
    if (!goal || !stats) return 0;
    return Math.min(
      100,
      Math.round((stats.books_finished / goal.books_target) * 100)
    );
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-burgundy-800 mb-2">
          Welcome back, <span className="italic">{user?.username}</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Your personal reading library and progress hub.
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-2xl shadow-soft p-5 border border-burgundy-100 flex items-center gap-4">
            <div className="bg-burgundy-100 p-3 rounded-xl flex-shrink-0">
              <Library className="w-6 h-6 text-burgundy-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Collections</p>
              <p className="text-2xl md:text-3xl font-bold text-burgundy-800 font-serif">
                {collections.length}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-5 border border-burgundy-100 flex items-center gap-4">
            <div className="bg-gold-400/20 p-3 rounded-xl flex-shrink-0">
              <BookOpen className="w-6 h-6 text-gold-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Saved Books</p>
              <p className="text-2xl md:text-3xl font-bold text-burgundy-800 font-serif">
                {stats.total_books}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-5 border border-burgundy-100 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl flex-shrink-0">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Finished</p>
              <p className="text-2xl md:text-3xl font-bold text-burgundy-800 font-serif">
                {stats.books_finished}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-5 border border-burgundy-100 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pages Read</p>
              <p className="text-2xl md:text-3xl font-bold text-burgundy-800 font-serif">
                {(stats.total_pages_read || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Currently Reading Section */}
      {currentlyReading.length > 0 && (
        <div className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-burgundy-700 mb-4 flex items-center gap-2">
            <BookMarked className="w-5 h-5" />
            Currently Reading
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentlyReading.map((book) => {
              const progress =
                book.total_pages && book.current_page
                  ? Math.min(
                      100,
                      Math.round((book.current_page / book.total_pages) * 100)
                    )
                  : 0;

              return (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl shadow-soft border border-burgundy-100 p-4 flex gap-4"
                >
                  <div className="w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-cream-200">
                    {book.cover_id ? (
                      <img
                        src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-burgundy-600 p-1 text-center font-serif">
                        {book.title?.slice(0, 20)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-burgundy-800 line-clamp-2 text-sm leading-snug">
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-500 italic mt-0.5 line-clamp-1">
                      {book.author}
                    </p>
                    {book.total_pages ? (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>
                            Page {book.current_page || 0} of {book.total_pages}
                          </span>
                          <span className="font-semibold">{progress}%</span>
                        </div>
                        <div className="w-full bg-cream-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-burgundy-600 h-full rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 mt-2">No page count</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reading Goal */}
      {goal && stats ? (
        <div className="bg-gradient-to-br from-burgundy-600 to-burgundy-800 rounded-2xl shadow-lift p-6 text-white mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2.5 rounded-lg">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold">
                  {new Date().getFullYear()} Reading Goal
                </h3>
                <p className="text-white/80 text-sm">
                  {stats.books_finished} of {goal.books_target} books finished
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setGoalForm({
                  books_target: goal.books_target.toString(),
                  pages_target: goal.pages_target?.toString() || '',
                });
                setShowGoalModal(true);
              }}
              className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
            >
              Edit Goal
            </button>
          </div>

          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-700"
              style={{ width: `${getGoalProgress()}%` }}
            />
          </div>
          <p className="text-center text-white/80 text-sm mt-2">
            {getGoalProgress()}% complete
          </p>
        </div>
      ) : (
        !loading && (
          <div className="bg-cream-50 border-2 border-dashed border-burgundy-200 rounded-2xl p-8 text-center mb-10">
            <Target className="w-10 h-10 text-burgundy-400 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-burgundy-800 mb-2">
              Set Your Reading Goal
            </h3>
            <p className="text-gray-600 mb-5 max-w-md mx-auto">
              Challenge yourself to read more books this year.
            </p>
            <button
              onClick={() => setShowGoalModal(true)}
              className="px-6 py-3 bg-burgundy-600 text-white rounded-full hover:bg-burgundy-700 transition-colors font-medium"
            >
              Set Annual Goal
            </button>
          </div>
        )
      )}

      {/* Collections Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-bold text-burgundy-700">
          Your Collections
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-burgundy-600 text-white rounded-full hover:bg-burgundy-700 transition-colors font-medium text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Collection
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-soft overflow-hidden animate-pulse"
            >
              <div className="h-28 bg-cream-200" />
              <div className="p-5 space-y-3">
                <div className="h-6 bg-cream-200 rounded w-3/4" />
                <div className="h-4 bg-cream-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && collections.length === 0 && (
        <div className="bg-white rounded-2xl shadow-soft p-12 border border-burgundy-100 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-burgundy-100 rounded-full mb-4">
            <Library className="w-8 h-8 text-burgundy-600" />
          </div>
          <h3 className="font-serif text-xl font-bold text-burgundy-800 mb-2">
            No collections yet
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Collections help you organize books by theme, mood, or goal. Create
            your first one to get started.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-burgundy-600 text-white rounded-full hover:bg-burgundy-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Your First Collection
          </button>
        </div>
      )}

      {/* Collections Grid */}
      {!loading && collections.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onDelete={handleCollectionDeleted}
            />
          ))}
        </div>
      )}

      {/* Create Collection Modal */}
      <CreateCollectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCollectionCreated={fetchData}
      />

      {/* Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lift max-w-md w-full p-8 relative animate-scaleIn">
            <h2 className="font-serif text-2xl font-bold text-burgundy-800 mb-6">
              {goal ? 'Edit' : 'Set'} Reading Goal
            </h2>
            <form onSubmit={handleSaveGoal} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Books to read in {new Date().getFullYear()}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={goalForm.books_target}
                  onChange={(e) =>
                    setGoalForm({ ...goalForm, books_target: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-burgundy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                  placeholder="e.g. 24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pages target{' '}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={goalForm.pages_target}
                  onChange={(e) =>
                    setGoalForm({ ...goalForm, pages_target: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-burgundy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                  placeholder="e.g. 5000"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 py-3 border border-burgundy-200 text-burgundy-700 font-medium rounded-xl hover:bg-cream-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-burgundy-600 text-white font-semibold rounded-xl hover:bg-burgundy-700 transition-colors"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;