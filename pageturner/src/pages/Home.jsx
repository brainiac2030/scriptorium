import SearchBar from '../components/SearchBar';

function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Welcome to PageTurner</h2>
      <p>Search for your next favorite book below.</p>
      <SearchBar />
    </div>
  );
}

export default Home;