import { useState, useEffect } from 'react';
import { Plus, Library, BookOpen, TrendingUp, Award, Target } from 'lucide-react';
import { getCollections, getSavedBooks, getUserStats, getReadingGoal, setReadingGoal } from '../api';
import { useAuth } from '../context/AuthContext';
import CollectionCard from '../components/CollectionCard';
import CreateCollectionModal from '../components/CreateCollectionModal';

function Dashboard() {
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [stats, setStats] = useState(null);
  const [goal, setGoal] = useState(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalForm, setGoalForm] = useState({ books_target: '', pages_target: '' });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [collectionsRes, booksRes, statsRes] = await Promise.all([
        getCollections(),
        getSavedBooks(),
        getUserStats()
      ]);
      setCollections(collectionsRes.data);
      
      // Try to get goal
      try {
        const goalRes = await getReadingGoal();
        setGoal(goalRes.data);
      } catch (err) {
        // No goal set yet
      }
      
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGoal = async (e) => {
    e.preventDefault();
    try {
      await setReadingGoal({
        books_target: parseInt(goalForm.books_target),
        pages_target: goalForm.pages_target ? parseInt(goalForm.pages_target) : null
      });
      setShowGoalModal(false);
      fetchData();
    } catch (err) {
      alert('Failed to set goal');
    }
  };

  const handleCollectionDeleted = (id) => {
    setCollections(collections.filter(c => c.id !== id));
  };

  const getGoalProgress = () => {
    if (!goal || !stats) return 0;
    return Math.min(100, Math.round((stats.books_finished / goal.books_target) * 100));
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-burgundy-800 mb-2">
          Welcome back, <span className="italic">{user?.username}</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Your personal reading library and discovery hub.
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-2xl shadow-soft p-6 border border-burgundy-100 flex items-center gap-4">
            <div className="bg-burgundy-100 p-3 rounded-xl">
              <Library className="w-6 h-6 text-burgundy-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Collections</p>
              <p className="text-3xl font-bold text-burgundy-800 font-serif">{collections.length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-soft p-6 border border-burgundy-100 flex items-center gap-4">
            <div className="bg-gold-400/20 p-3 rounded-xl">
              <BookOpen className="w-6 h-6 text-gold-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Saved Books</p>
              <p className="text-3xl font-bold text-burgundy-800 font-serif">{stats.total_books}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6 border border-burgundy-100 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Books Finished</p>
              <p className="text-3xl font-bold text-burgundy-800 font-serif">{stats.books_finished}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6 border border-burgundy-100 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pages Read</p>
              <p className="text-3xl font-bold text-burgundy-800 font-serif">{stats.total_pages_read.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Reading Goal Progress */}
      {goal && stats && (
        <div className="bg-gradient-to-br from-burgundy-600 to-burgundy-800 rounded-2xl shadow-lift p-6 text-white mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
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
              onClick={() => setShowGoalModal(true)}
              className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
            >
              Edit Goal
            </button>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${getGoalProgress()}%` }}
            ></div>
          </div>
          <p className="text-center text-white/80 text-sm mt-2">
            {getGoalProgress()}% complete
          </p>
        </div>
      )}

      {!goal && (
        <div className="bg-cream-100 border-2 border-dashed border-burgundy-300 rounded-2xl p-8 text-center mb-10">
          <h3 className="font-serif text-xl font-bold text-burgundy-800 mb-2">
            Set Your Reading Goal
          </h3>
          <p className="text-gray-600 mb-4">
            Challenge yourself to read more books this year!
          </p>
          <button
            onClick={() => setShowGoalModal(true)}
            className="px-6 py-3 bg-burgundy-600 text-white rounded-full hover:bg-burgundy-700 transition-colors font-medium"
          >
            Set Annual Goal
          </button>
        </div>
      )}

      {/* Collections Section */}
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
            <div key={i} className="bg-white rounded-2xl shadow-soft overflow-hidden animate-pulse">
              <div className="h-32 bg-cream-200"></div>
              <div className="p-5 space-y-3">
                <div className="h-6 bg-cream-200 rounded w-3/4"></div>
                <div className="h-4 bg-cream-200 rounded w-full"></div>
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
            Collections help you organize books by theme, subject, or reading goal. Create your first one to get started!
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

      {/* Modals */}
      <CreateCollectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCollectionCreated={fetchData}
      />

      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lift max-w-md w-full p-8 relative">
            <h2 className="font-serif text-2xl font-bold text-burgundy-800 mb-4">
              Set Reading Goal
            </h2>
            <form onSubmit={handleSaveGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Books to Read in {new Date().getFullYear()}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={goalForm.books_target}
                  onChange={(e) => setGoalForm({ ...goalForm, books_target: e.target.value })}
                  className="w-full px-4 py-3 border border-burgundy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                  placeholder="e.g., 24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pages to Read (optional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={goalForm.pages_target}
                  onChange={(e) => setGoalForm({ ...goalForm, pages_target: e.target.value })}
                  className="w-full px-4 py-3 border border-burgundy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                  placeholder="e.g., 5000"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 py-3 border border-burgundy-200 text-burgundy-700 font-medium rounded-lg hover:bg-cream-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-burgundy-600 text-white font-semibold rounded-lg hover:bg-burgundy-700 transition-colors"
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