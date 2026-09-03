import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout() {
  const { pathname } = useLocation();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <div className="flex min-h-screen flex-col bg-cream-100">
      <Navbar />
      <main className={`flex-1 ${isAuthPage ? '' : 'pb-16 sm:pb-24'}`}>
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default Layout;
