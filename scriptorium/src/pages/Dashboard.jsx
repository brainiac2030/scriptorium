import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Library, Plus, Target } from 'lucide-react';
import {
  getCollections,
  getReadingGoal,
  getSavedBooks,
  getUserStats,
  setReadingGoal,
  updateSavedBook,
} from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import CollectionCard from '../components/CollectionCard';
import CreateCollectionModal from '../components/CreateCollectionModal';
import LibraryBookRow from '../components/LibraryBookRow';
import ReadingSessionModal from '../components/ReadingSessionModal';
import UpdateProgressModal from '../components/UpdateProgressModal';

const filters = [
  { value: 'all', label: 'All books' },
  { value: 'reading', label: 'Reading now' },
  { value: 'to_read', label: 'Want to read' },
  { value: 'finished', label: 'Finished' },
];

function Dashboard() {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [collections, setCollections] = useState([]);
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [goal, setGoal] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const [goalForm, setGoalForm] = useState({ books_target: '', pages_target: '' });
  const [sessionBook, setSessionBook] = useState(null);
  const [progressBook, setProgressBook] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [collectionsRes, booksRes, statsRes] = await Promise.all([
        getCollections(),
        getSavedBooks(),
        getUserStats(),
      ]);
      setCollections(collectionsRes.data || []);
      setBooks(booksRes.data || []);
      setStats(statsRes.data);
      try {
        const goalRes = await getReadingGoal();
        setGoal(goalRes.data);
      } catch (error) {
        if (error.response?.status !== 404) showError('Your reading goal could not be loaded.');
        else setGoal(null);
      }
    } catch {
      showError('Your library could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const currentlyReading = books.filter((book) => book.status === 'reading');
  const visibleBooks = useMemo(
    () => (filter === 'all' ? books : books.filter((book) => book.status === filter)),
    [books, filter]
  );
  const goalProgress = goal?.books_target
    ? Math.min(100, Math.round(((stats?.books_finished || 0) / goal.books_target) * 100))
    : 0;

  const changeStatus = async (bookId, status) => {
    try {
      const { data } = await updateSavedBook(bookId, { status });
      setBooks((current) => current.map((book) => (book.id === bookId ? data : book)));
      success(status === 'finished' ? 'Finished—well read.' : 'Reading status updated.');
      loadData();
    } catch {
      showError('Could not update reading status.');
    }
  };

  const openGoal = () => {
    setGoalForm({
      books_target: goal?.books_target?.toString() || '',
      pages_target: goal?.pages_target?.toString() || '',
    });
    setGoalOpen(true);
  };

  const saveGoal = async (event) => {
    event.preventDefault();
    try {
      await setReadingGoal({
        books_target: Number(goalForm.books_target),
        pages_target: goalForm.pages_target ? Number(goalForm.pages_target) : null,
      });
      success('Your reading intention is set.');
      setGoalOpen(false);
      loadData();
    } catch {
      showError('Could not save your reading goal.');
    }
  };

  if (loading) {
    return (
      <div className="page-shell py-12">
        <div className="skeleton h-5 w-32" />
        <div className="skeleton mt-5 h-14 max-w-xl" />
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-28" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <header className="border-b border-burgundy-900/10">
        <div className="page-shell py-12 sm:py-16">
          <p className="eyebrow mb-4">My library / Overview</p>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="font-serif text-4xl font-medium text-burgundy-900 sm:text-5xl">
                Good to see you,
                <br />
                <em className="font-normal text-[#e07a5f]">{user?.username}.</em>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-gray-600">
                Pick up where you left off, or make space for whatever you want to read next.
              </p>
            </div>
            <button onClick={() => setCreateOpen(true)} className="button-secondary shrink-0">
              <Plus className="h-4 w-4" /> New collection
            </button>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <div className="border border-burgundy-900/10 bg-cream-50 px-6 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">Saved books</p>
              <p className="mt-3 font-serif text-4xl font-medium text-burgundy-900">{stats?.total_books || 0}</p>
              <p className="mt-1 text-xs text-gray-500">across your shelves</p>
            </div>
            <div className="border border-[#e07a5f]/30 bg-[#e07a5f]/08 px-6 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#e07a5f]">In progress</p>
              <p className="mt-3 font-serif text-4xl font-medium text-burgundy-900">{currentlyReading.length}</p>
              <p className="mt-1 text-xs text-gray-500">currently underway</p>
            </div>
            <div className="border border-burgundy-900/10 bg-cream-50 px-6 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">Finished</p>
              <p className="mt-3 font-serif text-4xl font-medium text-burgundy-900">{stats?.books_finished || 0}</p>
              <p className="mt-1 text-xs text-gray-500">books you made time for</p>
            </div>
          </div>
        </div>
      </header>

      <div className="page-shell py-12 sm:py-16">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
          <main className="space-y-14">
            <section>
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <p className="eyebrow mb-2">In progress</p>
                  <h2 className="font-serif text-2xl font-medium text-burgundy-900">Your current reads</h2>
                </div>
                <span className="font-serif text-2xl text-burgundy-400">{currentlyReading.length}</span>
              </div>
              {currentlyReading.length ? (
                currentlyReading.map((book) => (
                  <LibraryBookRow
                    key={book.id}
                    book={book}
                    onStatusChange={changeStatus}
                    onLogSession={setSessionBook}
                    onUpdateProgress={setProgressBook}
                  />
                ))
              ) : (
                <div className="border border-dashed border-burgundy-900/15 px-6 py-12 text-center">
                  <BookOpen className="mx-auto h-6 w-6 text-burgundy-400" />
                  <h3 className="mt-4 font-serif text-xl font-medium text-burgundy-900">No book open right now</h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
                    Choose a saved book and mark it as “Reading now,” or discover something that earns your attention.
                  </p>
                  <Link to="/" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-burgundy-700">
                    Browse books <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </section>

            <section>
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <p className="eyebrow mb-2">Personal catalogue</p>
                  <h2 className="font-serif text-2xl font-medium text-burgundy-900">All saved books</h2>
                </div>
                <div className="hide-scrollbar flex gap-5 overflow-x-auto border-b border-burgundy-900/15">
                  {filters.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setFilter(item.value)}
                      className={`shrink-0 border-b-2 pb-2 text-xs font-semibold ${
                        filter === item.value
                          ? 'border-burgundy-700 text-burgundy-800'
                          : 'border-transparent text-gray-500 hover:text-burgundy-800'
                      }`}
                    >
                      {item.label}{' '}
                      <span className="ml-1 text-gray-400">
                        {item.value === 'all'
                          ? books.length
                          : books.filter((book) => book.status === item.value).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-5">
                {visibleBooks.length ? (
                  visibleBooks.map((book) => (
                    <LibraryBookRow
                      key={book.id}
                      book={book}
                      onStatusChange={changeStatus}
                      onLogSession={setSessionBook}
                      onUpdateProgress={setProgressBook}
                    />
                  ))
                ) : (
                  <p className="border-t border-burgundy-900/10 py-10 text-sm text-gray-600">
                    There are no books on this shelf yet.
                  </p>
                )}
              </div>
            </section>

            <section>
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="eyebrow mb-2">Your shelves</p>
                  <h2 className="font-serif text-2xl font-medium text-burgundy-900">Collections</h2>
                </div>
                <button onClick={() => setCreateOpen(true)} className="button-primary">
                  <Plus className="h-4 w-4" /> New collection
                </button>
              </div>
              {collections.length ? (
                collections.map((collection, index) => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    index={index}
                    onDelete={(id) => setCollections((current) => current.filter((item) => item.id !== id))}
                  />
                ))
              ) : (
                <div className="border border-dashed border-burgundy-900/15 px-6 py-16 text-center">
                  <Library className="mx-auto h-6 w-6 text-[#e07a5f]" />
                  <h3 className="mt-4 font-serif text-xl font-medium text-burgundy-900">Start with a shelf</h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-600">
                    Collections are little rooms for different kinds of reading.
                  </p>
                  <button onClick={() => setCreateOpen(true)} className="button-primary mt-6">
                    Make a collection
                  </button>
                </div>
              )}
            </section>
          </main>

          <aside className="space-y-8">
            <section className="bg-burgundy-900 p-7 text-cream-100">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cream-400">
                  {new Date().getFullYear()} intention
                </p>
                <Target className="h-5 w-5 text-gold-400" />
              </div>
              {goal ? (
                <>
                  <p className="mt-7 font-serif text-5xl font-medium">
                    {stats?.books_finished || 0}
                    <span className="text-2xl font-normal text-cream-400"> / {goal.books_target}</span>
                  </p>
                  <p className="mt-2 text-sm text-cream-300">books finished this year</p>
                  <div className="mt-6 h-1.5 bg-white/15">
                    <div className="h-full bg-gold-400" style={{ width: `${goalProgress}%` }} />
                  </div>
                  <button
                    onClick={openGoal}
                    className="mt-5 text-xs font-semibold text-cream-200 underline underline-offset-4"
                  >
                    Adjust goal
                  </button>
                </>
              ) : (
                <>
                  <h3 className="mt-7 font-serif text-2xl font-medium">Give the year a shape.</h3>
                  <p className="mt-3 text-sm leading-6 text-cream-300">
                    Set a book goal as a gentle direction, not a score to chase.
                  </p>
                  <button
                    onClick={openGoal}
                    className="mt-6 border border-cream-300 px-4 py-2.5 text-sm font-semibold hover:bg-white/10"
                  >
                    Set an intention
                  </button>
                </>
              )}
            </section>

            <section className="border-y border-burgundy-900/10 py-6">
              <p className="eyebrow mb-5">Your library in numbers</p>
              <dl className="space-y-4">
                {[
                  { label: 'Books saved', value: stats?.total_books || 0 },
                  { label: 'Books finished', value: stats?.books_finished || 0 },
                  { label: 'Pages travelled', value: (stats?.total_pages_read || 0).toLocaleString() },
                  { label: 'Sessions logged', value: stats?.reading_streak || 0 },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-baseline justify-between border-b border-burgundy-900/10 pb-3"
                  >
                    <dt className="text-sm text-gray-600">{item.label}</dt>
                    <dd className="font-serif text-xl font-medium text-burgundy-900">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </aside>
        </div>
      </div>

      <CreateCollectionModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onCollectionCreated={loadData} />
      <ReadingSessionModal
        isOpen={Boolean(sessionBook)}
        onClose={() => setSessionBook(null)}
        book={sessionBook}
        onSessionLogged={loadData}
      />
      <UpdateProgressModal
        isOpen={Boolean(progressBook)}
        onClose={() => setProgressBook(null)}
        book={progressBook}
        onUpdated={loadData}
      />

      {goalOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-burgundy-900/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="goal-title"
        >
          <div className="w-full max-w-md bg-cream-50 p-7 shadow-2xl sm:p-8">
            <p className="eyebrow mb-2">Annual intention</p>
            <h2 id="goal-title" className="font-serif text-2xl font-medium text-burgundy-900">
              {goal ? 'Adjust your goal' : 'Shape your reading year'}
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Choose a number that feels inviting, not punishing.
            </p>
            <form onSubmit={saveGoal} className="mt-7 space-y-5">
              <div>
                <label htmlFor="book-target" className="text-sm font-semibold text-gray-700">
                  Books to finish
                </label>
                <input
                  id="book-target"
                  type="number"
                  min="1"
                  required
                  value={goalForm.books_target}
                  onChange={(e) => setGoalForm({ ...goalForm, books_target: e.target.value })}
                  className="field mt-2"
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="page-target" className="text-sm font-semibold text-gray-700">
                  Page target <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <input
                  id="page-target"
                  type="number"
                  min="1"
                  value={goalForm.pages_target}
                  onChange={(e) => setGoalForm({ ...goalForm, pages_target: e.target.value })}
                  className="field mt-2"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setGoalOpen(false)} className="button-secondary">
                  Cancel
                </button>
                <button type="submit" className="button-primary">
                  Save intention
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