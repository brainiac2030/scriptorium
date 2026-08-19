import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '20px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
export default Layout;