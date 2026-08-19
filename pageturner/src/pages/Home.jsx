import SearchBar from '../components/SearchBar';
import BookSection from '../components/BookSection';
import { Sparkles } from 'lucide-react';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-16 pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy-100 text-burgundy-700 rounded-full text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          <span>Your personal digital library</span>
        </div>
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-burgundy-800 mb-6 leading-tight">
          Discover Your Next <br />
          <span className="text-burgundy-500 italic">Great Read</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          Wander through curated collections, explore timeless classics, and find the books that will captivate your imagination.
        </p>
        <SearchBar />
      </div>

      {/* Curated Sections */}
      <div className="mt-16">
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