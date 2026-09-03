import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Compass, Library, PenLine } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import BookSection from '../components/BookSection';
import { useAuth } from '../context/AuthContext';

const pathways = [
  { label: 'A short, absorbing read', query: 'short stories', note: 'For a single sitting' },
  { label: 'A world to disappear into', query: 'epic fantasy', note: 'For immersive reading' },
  { label: 'A new way to see things', query: 'essays philosophy', note: 'For curious minds' },
  { label: 'A mystery worth staying up for', query: 'mystery thriller', note: 'For page-turning nights' },
];

function Home() {
  const { user } = useAuth();

  return (
    <div className="animate-fadeIn">
      <section className="border-b border-burgundy-900/15">
        <div className="page-shell grid min-h-[590px] items-center gap-12 py-16 lg:grid-cols-[1.15fr_.85fr] lg:py-24">
          <div>
            <p className="eyebrow mb-6">A home for your reading life</p>
            <h1 className="max-w-4xl text-5xl font-bold leading-[1.04] text-burgundy-900 sm:text-6xl lg:text-7xl">Find the book that meets you <em className="font-normal text-burgundy-600">where you are.</em></h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600">Discover with intention, keep a library that means something, and turn pages into a reading life you can look back on.</p>
            <div className="mt-9"><SearchBar /></div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500"><span>Try:</span>{['Octavia Butler', 'quiet novels', 'art history'].map((term) => <Link key={term} to={`/search?q=${encodeURIComponent(term)}`} className="border-b border-gray-400 hover:border-burgundy-700 hover:text-burgundy-700">{term}</Link>)}</div>
          </div>

          <aside className="relative hidden min-h-[420px] border-l border-burgundy-900/15 pl-12 lg:block" aria-label="Scriptorium reading philosophy">
            <div className="absolute left-12 top-2 h-72 w-48 rotate-[-5deg] bg-burgundy-800 p-7 text-cream-100 shadow-xl"><BookOpen className="h-7 w-7" /><p className="mt-20 font-serif text-2xl leading-snug">Books are not content. They are places we return from changed.</p><span className="absolute bottom-6 text-[10px] uppercase tracking-[.2em] text-cream-300">The Scriptorium principle</span></div>
            <div className="absolute bottom-3 right-4 h-64 w-44 rotate-[7deg] border border-burgundy-900/20 bg-gold-400 p-6 text-burgundy-900 shadow-lg"><PenLine className="h-6 w-6" /><p className="mt-14 font-serif text-xl font-bold leading-snug">Choose slowly.<br />Read deeply.<br />Remember more.</p></div>
          </aside>
        </div>
      </section>

      {user && <section className="bg-burgundy-800 text-cream-100"><div className="page-shell flex flex-col justify-between gap-5 py-6 sm:flex-row sm:items-center"><div><p className="text-sm text-cream-300">Welcome back, {user.username}.</p><p className="mt-1 font-serif text-xl font-bold">Your reading life is waiting.</p></div><Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold">Continue to your library <ArrowRight className="h-4 w-4" /></Link></div></section>}

      <section className="page-shell py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[.65fr_1.35fr]">
          <div><p className="eyebrow mb-3">Start with a feeling</p><h2 className="text-3xl font-bold text-burgundy-900 sm:text-4xl">What kind of reading do you need today?</h2><p className="mt-4 leading-7 text-gray-600">The best discovery begins with a reason, not an algorithm.</p></div>
          <div className="grid sm:grid-cols-2">{pathways.map((item, index) => <Link key={item.query} to={`/search?q=${encodeURIComponent(item.query)}`} className={`group flex min-h-32 items-end justify-between gap-5 border-b border-burgundy-900/15 py-6 sm:px-6 ${index % 2 === 0 ? 'sm:border-r' : ''} ${index < 2 ? 'sm:border-t' : ''}`}><div><p className="text-xs text-gray-500">{item.note}</p><h3 className="mt-2 text-lg font-bold text-burgundy-900">{item.label}</h3></div><ArrowRight className="h-5 w-5 shrink-0 text-burgundy-600 transition-transform group-hover:translate-x-1" /></Link>)}</div>
        </div>
      </section>

      <div className="border-y border-burgundy-900/15 bg-cream-50"><div className="page-shell"><BookSection title="Enduring fiction" subject="classic_literature" description="Novels and stories that continue to find new readers across generations." /></div></div>
      <div className="page-shell"><BookSection title="Other worlds, other futures" subject="science_fiction" description="Speculative writing that makes the strange feel possible—and the familiar feel new." /></div>
      <div className="border-y border-burgundy-900/15 bg-cream-50"><div className="page-shell"><BookSection title="Mysteries of motive" subject="mystery_and_detective_stories" description="Investigations, secrets, and the enduring question of why people do what they do." /></div></div>

      <section className="page-shell py-16 sm:py-24">
        <div className="grid gap-10 border-y border-burgundy-900/20 py-12 md:grid-cols-3">
          {[{ icon: Compass, title: 'Discover with context', body: 'Browse focused shelves and search millions of works without losing the thread.' }, { icon: Library, title: 'Shape your shelves', body: 'Collect books by mood, project, season, or whatever matters to your reading.' }, { icon: PenLine, title: 'Keep your momentum', body: 'Track pages and sessions so your library reflects the life lived inside it.' }].map(({ icon: Icon, title, body }) => <div key={title}><Icon className="h-5 w-5 text-burgundy-600" /><h3 className="mt-5 text-lg font-bold text-burgundy-900">{title}</h3><p className="mt-2 text-sm leading-6 text-gray-600">{body}</p></div>)}
        </div>
      </section>
    </div>
  );
}

export default Home;
