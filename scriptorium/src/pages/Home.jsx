import SearchBar from '../components/SearchBar';
import BookSection from '../components/BookSection';
import { Sparkles, BookOpen, Target, TrendingUp } from 'lucide-react';

function Home() {
  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <div className="relative text-center mb-20 pt-12 pb-16">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-burgundy-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-burgundy-100 to-burgundy-50 text-burgundy-700 rounded-full text-sm font-medium mb-6 shadow-soft animate-slideUp">
            <Sparkles className="w-4 h-4" />
            <span>Your personal digital library</span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-bold text-burgundy-800 mb-6 leading-tight animate-slideUp" style={{ animationDelay: '0.1s' }}>
            Discover Your Next <br />
            <span className="text-gradient italic">Great Read</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-slideUp" style={{ animationDelay: '0.2s' }}>
            Wander through curated collections, explore timeless classics, and find the books that will captivate your imagination.
          </p>

          <div className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
            <SearchBar />
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-soft hover:shadow-lift transition-all animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <div className="bg-burgundy-100 p-3 rounded-xl mb-3">
                <BookOpen className="w-6 h-6 text-burgundy-600" />
              </div>
              <h3 className="font-serif font-semibold text-burgundy-800 mb-1">Discover</h3>
              <p className="text-sm text-gray-600 text-center">Explore millions of books by topic and genre</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-soft hover:shadow-lift transition-all animate-slideUp" style={{ animationDelay: '0.5s' }}>
              <div className="bg-gold-400/20 p-3 rounded-xl mb-3">
                <Target className="w-6 h-6 text-gold-600" />
              </div>
              <h3 className="font-serif font-semibold text-burgundy-800 mb-1">Organize</h3>
              <p className="text-sm text-gray-600 text-center">Create collections and track your reading goals</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-soft hover:shadow-lift transition-all animate-slideUp" style={{ animationDelay: '0.6s' }}>
              <div className="bg-green-100 p-3 rounded-xl mb-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-serif font-semibold text-burgundy-800 mb-1">Track</h3>
              <p className="text-sm text-gray-600 text-center">Log reading sessions and monitor progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Curated Sections */}
      <div className="mt-20 space-y-20">
        <BookSection title="Trending Now" apiUrl="https://openlibrary.org/subjects/science_fiction.json?limit=15" />
        <BookSection title="Timeless Classics" apiUrl="https://openlibrary.org/subjects/classics.json?limit=15" />
        <BookSection title="Mystery & Thriller" apiUrl="https://openlibrary.org/subjects/mystery_and_detective_stories.json?limit=15" />
        <BookSection title="Editor's Picks: Romance" apiUrl="https://openlibrary.org/subjects/romance.json?limit=15" />
        <BookSection title="New & Notable: Fantasy" apiUrl="https://openlibrary.org/subjects/fantasy.json?limit=15" />
      </div>
    </div>
  );
}

export default Home;