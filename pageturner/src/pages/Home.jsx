import SearchBar from '../components/SearchBar';

function Home() {
  return (
    <div className="text-center mt-16">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Discover Your Next <span className="text-blue-600">Favorite Book</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
        Search through millions of titles and find the perfect read for your next adventure.
      </p>
      <SearchBar />
    </div>
  );
}
export default Home;