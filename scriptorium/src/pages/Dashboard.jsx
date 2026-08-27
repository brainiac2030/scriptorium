import { useState, useEffect } from 'react';
import { Plus, Library, BookOpen } from 'lucide-react';
import { getCollections, getSavedBooks } from '../api';
import { useAuth } from '../context/AuthContext';
import CollectionCard from '../components/CollectionCard';
import CreateCollectionModal from '../components/CreateCollectionModal';

function Dashboard() {
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [collectionsRes, booksRes] = await Promise.all([
        getCollections(),
        getSavedBooks()
      ]);
      setCollections(collectionsRes.data);
      setTotalBooks(booksRes.data.length);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCollectionDeleted = (id) => {
    setCollections(collections.filter(c => c.id !== id));
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
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
            <p className="text-3xl font-bold text-burgundy-800 font-serif">{totalBooks}</p>
          </div>
        </div>
      </div>

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

      {/* Modal */}
      <CreateCollectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCollectionCreated={fetchData}
      />
    </div>
  );
}

export default Dashboard;