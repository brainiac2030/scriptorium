import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import BookDetails from './pages/BookDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CollectionDetail from './pages/CollectionDetail';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center" role="status">
        <div className="text-center">
          <BookOpen className="mx-auto mb-4 h-8 w-8 animate-pulse text-burgundy-700" />
          <p className="font-serif text-lg text-burgundy-900">Opening your library…</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-24 text-center">
      <p className="eyebrow mb-5">Page 404</p>
      <h1 className="text-4xl text-burgundy-900 sm:text-5xl">This page has gone missing.</h1>
      <p className="mx-auto mt-5 max-w-md leading-7 text-gray-600">Like a borrowed book that never found its way home. Return to discovery and find your next read.</p>
      <Link to="/" className="button-primary mt-8"><ArrowLeft className="h-4 w-4" /> Return to discover</Link>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="search" element={<SearchResults />} />
              <Route path="book/:id" element={<BookDetails />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="collections/:id" element={<ProtectedRoute><CollectionDetail /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
