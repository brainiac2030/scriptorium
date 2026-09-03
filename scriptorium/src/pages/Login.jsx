import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
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
    event.preventDefault(); setError(''); setLoading(true);
    try { await login(formData); success('Welcome back.'); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.error || 'We could not sign you in. Check your details and try again.'); }
    finally { setLoading(false); }
  };

  return <div className="grid min-h-[calc(100vh-68px)] lg:grid-cols-2"><aside className="hidden bg-burgundy-900 p-14 text-cream-100 lg:flex lg:flex-col lg:justify-between"><Link to="/" className="inline-flex items-center gap-2 text-sm text-cream-300"><ArrowLeft className="h-4 w-4" />Back to discovery</Link><blockquote className="max-w-lg"><p className="font-serif text-4xl leading-snug">A personal library is a map of every question you have followed.</p><footer className="mt-6 text-sm text-cream-400">Return to yours.</footer></blockquote><p className="text-xs uppercase tracking-[.18em] text-cream-400">Scriptorium · Read with intention</p></aside><main className="flex items-center justify-center px-5 py-14 sm:px-10"><div className="w-full max-w-md"><p className="eyebrow mb-3">Welcome back</p><h1 className="text-4xl font-bold text-burgundy-900">Open your library.</h1><p className="mt-3 text-gray-600">Continue the books, notes, and collections you have begun.</p>{error && <p className="mt-6 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}<form onSubmit={submit} className="mt-8 space-y-5"><div><label htmlFor="email" className="text-sm font-semibold text-gray-700">Email address</label><input id="email" type="email" required autoComplete="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="field mt-2" placeholder="you@example.com" /></div><div><label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</label><div className="relative mt-2"><input id="password" type={showPassword ? 'text' : 'password'} required autoComplete="current-password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="field pr-12" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div></div><button type="submit" disabled={loading} className="button-primary w-full">{loading ? 'Opening your library…' : 'Sign in'}</button></form><p className="mt-7 text-sm text-gray-600">New to Scriptorium? <Link to="/signup" className="font-semibold text-burgundy-700 underline underline-offset-4">Start your library</Link></p></div></main></div>;
}

export default Login;
