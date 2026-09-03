import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData);
      success('Welcome back.');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'We could not sign you in. Check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left panel — warm coral */}
      <aside className="relative hidden overflow-hidden bg-[#e07a5f] lg:flex lg:flex-col lg:justify-between p-12 xl:p-16">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/5" />

        <Link to="/" className="relative z-10 inline-flex items-center gap-2.5 text-[#2d3142]">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#f4d35e] text-[#2d3142]">
            <BookOpen className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight">Scriptorium</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2d3142]/60">
            A library is a form of autobiography
          </p>
          <h2 className="mt-6 font-serif text-5xl font-medium leading-[1.05] text-white xl:text-6xl">
            Keep the<br />
            <em className="not-italic font-normal italic">good bits.</em>
          </h2>
        </div>

        <p className="relative z-10 text-xs uppercase tracking-[0.16em] text-[#2d3142]/50">
          Scriptorium · Read with intention
        </p>
      </aside>

      {/* Right panel — dark navy */}
      <main className="flex flex-col justify-center bg-[#2d3142] px-6 py-14 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link
            to="/"
            className="mb-12 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Scriptorium
          </Link>

          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f4d35e]">
            Welcome back
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium text-white sm:text-5xl">
            Sign in.
          </h1>
          <p className="mt-3 text-sm leading-6 text-white/55">
            Your shelves are waiting where you left them.
          </p>

          {error && (
            <p className="mt-6 border-l-2 border-red-400 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          <form onSubmit={submit} className="mt-9 space-y-5">
            <div>
              <label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-2 w-full border-0 border-b border-white/20 bg-transparent px-0 py-3 text-[15px] text-white outline-none placeholder:text-white/30 focus:border-[#f4d35e]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border-0 border-b border-white/20 bg-transparent py-3 pr-10 text-[15px] text-white outline-none placeholder:text-white/30 focus:border-[#f4d35e]"
                  placeholder="at least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white/70"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-[#f4d35e] py-3.5 text-sm font-semibold text-[#2d3142] transition hover:bg-[#f7dc7a] disabled:opacity-50"
            >
              {loading ? 'Opening your library…' : 'Enter the library'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-white/45">
            New here?{' '}
            <Link to="/signup" className="font-medium text-[#f4d35e] underline underline-offset-4 hover:text-[#f7dc7a]">
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;