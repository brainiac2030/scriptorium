import { Link } from 'react-router-dom';
import { ArrowRight, Bookmark, Edit3, Eye } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import BookSection from '../components/BookSection';
import BookCard from '../components/BookCard';
import { useAuth } from '../context/AuthContext';

const curated = [
  {
    key: '/works/OL45804W',
    title: 'The Left Hand of Darkness',
    author_name: ['Ursula K. Le Guin'],
    cover_i: 8567416,
    first_publish_year: 1969,
    number_of_pages_median: 304,
  },
  {
    key: '/works/OL66554W',
    title: "A Room of One's Own",
    author_name: ['Virginia Woolf'],
    cover_i: 8231856,
    first_publish_year: 1929,
    number_of_pages_median: 112,
  },
  {
    key: '/works/OL27448W',
    title: 'The Dispossessed',
    author_name: ['Ursula K. Le Guin'],
    cover_i: 8564627,
    first_publish_year: 1974,
    number_of_pages_median: 341,
  },
  {
    key: '/works/OL7353617W',
    title: 'Braiding Sweetgrass',
    author_name: ['Robin Wall Kimmerer'],
    cover_i: 8235608,
    first_publish_year: 2013,
    number_of_pages_median: 408,
  },
  {
    key: '/works/OL23237W',
    title: 'The Master and Margarita',
    author_name: ['Mikhail Bulgakov'],
    cover_i: 8464164,
    first_publish_year: 1967,
    number_of_pages_median: 384,
  },
];

function Home() {
  const { user } = useAuth();

  return (
    <div className="animate-fadeIn">
      <section className="border-b border-burgundy-900/10">
        <div className="page-shell grid items-end gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <p className="eyebrow mb-5 flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-burgundy-600" />
              The personal library
            </p>
            <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[0.95] tracking-[-0.03em] text-burgundy-900 sm:text-6xl lg:text-7xl">
              Read
              <br />
              <em className="font-normal text-[#e07a5f]">in context.</em>
            </h1>
            <p className="mt-7 max-w-md text-base leading-7 text-gray-600 sm:text-lg">
              A considered place to collect the books that find you, and keep track of the ones you mean to finish.
            </p>
            <div className="mt-9">
              <SearchBar />
            </div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
              <span>Try:</span>
              {['Octavia Butler', 'quiet novels', 'art history'].map((term) => (
                <Link
                  key={term}
                  to={`/search?q=${encodeURIComponent(term)}`}
                  className="border-b border-gray-400 hover:border-burgundy-700 hover:text-burgundy-700"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>

          <aside className="relative hidden min-h-[280px] lg:block" aria-hidden="true">
            <div className="absolute right-8 top-0 h-56 w-40 rotate-[6deg] border border-burgundy-900/15 bg-cream-100 p-5 shadow-lg">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-500">Vol. 01 / Notes</p>
              <p className="mt-14 font-serif text-2xl leading-snug text-burgundy-900">
                The
                <br />
                shape of
                <br />
                <em>attention</em>
              </p>
            </div>
            <div className="absolute right-28 top-10 h-56 w-40 -rotate-[7deg] bg-[#e07a5f] p-5 text-white shadow-xl">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] opacity-70">Scriptorium</p>
              <p className="mt-16 font-serif text-2xl leading-snug">
                A room
                <br />
                for the
                <br />
                <em>unread.</em>
              </p>
            </div>
          </aside>
        </div>
      </section>

      {user && (
        <section className="bg-burgundy-900 text-cream-100">
          <div className="page-shell flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-cream-300">Welcome back, {user.username}.</p>
              <p className="mt-0.5 font-serif text-lg font-medium">Your reading life is waiting.</p>
            </div>
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-cream-100 hover:text-gold-400">
              Continue to your library <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      <section className="page-shell py-14 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">01 / A starting point</p>
            <h2 className="font-serif text-3xl font-medium text-burgundy-900 sm:text-4xl">
              A few to begin with
            </h2>
          </div>
          <Link
            to="/search?q=essential%20reading"
            className="hidden items-center gap-2 text-sm font-semibold text-[#e07a5f] sm:flex"
          >
            See more <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-7">
          {curated.map((book, i) => (
            <BookCard key={book.key} book={book} priority={i < 3} />
          ))}
        </div>
      </section>

      <section className="border-y border-burgundy-900/10 bg-cream-50">
        <div className="page-shell grid gap-10 py-14 md:grid-cols-3 sm:py-16">
          {[
            {
              icon: Bookmark,
              title: 'Save what stays',
              body: 'Keep discoveries in collections made for how you actually read.',
            },
            {
              icon: Eye,
              title: 'See your thread',
              body: 'A gentle overview of what is waiting, underway, and complete.',
            },
            {
              icon: Edit3,
              title: 'Leave a note',
              body: 'Mark the page, capture the thought, return when ready.',
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="border-l-2 border-[#e07a5f]/40 pl-5">
              <Icon className="h-5 w-5 text-[#e07a5f]" />
              <h3 className="mt-4 font-serif text-lg font-medium text-burgundy-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="page-shell">
        <BookSection
          title="Enduring fiction"
          subject="classic_literature"
          description="Novels and stories that continue to find new readers across generations."
        />
      </div>
      <div className="border-y border-burgundy-900/10 bg-cream-50">
        <div className="page-shell">
          <BookSection
            title="Other worlds, other futures"
            subject="science_fiction"
            description="Speculative writing that makes the strange feel possible."
          />
        </div>
      </div>
      <div className="page-shell">
        <BookSection
          title="Mysteries of motive"
          subject="mystery_and_detective_stories"
          description="Investigations, secrets, and the enduring question of why people do what they do."
        />
      </div>
    </div>
  );
}

export default Home;