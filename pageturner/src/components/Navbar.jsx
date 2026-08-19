import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
      <h1 style={{ margin: 0 }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          PageTurner
        </Link>
      </h1>
    </nav>
  );
}
export default Navbar;