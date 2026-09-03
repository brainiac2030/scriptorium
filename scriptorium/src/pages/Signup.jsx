import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signup } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault(); setError(''); setLoading(true);
    try { await signup(formData); success('Your library is ready.'); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.error || err.response?.data?.errors?.username?.[0] || err.response?.data?.errors?.email?.[0] || 'We could not create your account.'); }
    finally { setLoading(false); }
  };

  return <div className="grid min-h-[calc(100vh-68px)] lg:grid-cols-2"><aside className="hidden bg-gold-400 p-14 text-burgundy-900 lg:flex lg:flex-col lg:justify-between"><Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold"><ArrowLeft className="h-4 w-4" />Back to discovery</Link><div className="max-w-lg"><p className="eyebrow !text-burgundy-800">Your reading life, gathered</p><h2 className="mt-5 font-serif text-4xl font-bold leading-snug">Save what calls to you. Follow what changes you. Remember what you read.</h2><div className="mt-8 grid grid-cols-3 gap-4 border-t border-burgundy-900/25 pt-5 text-xs font-semibold"><span>Discover</span><span>Organize</span><span>Keep momentum</span></div></div><p className="text-xs uppercase tracking-[.18em]">Scriptorium · A library of your own</p></aside><main className="flex items-center justify-center px-5 py-14 sm:px-10"><div className="w-full max-w-md"><p className="eyebrow mb-3">Begin here</p><h1 className="text-4xl font-bold text-burgundy-900">Build a library that is yours.</h1><p className="mt-3 text-gray-600">Create a free account to save books and keep your reading record.</p>{error && <p className="mt-6 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}<form onSubmit={submit} className="mt-8 space-y-5"><div><label htmlFor="username" className="text-sm font-semibold text-gray-700">Name</label><input id="username" required minLength="3" autoComplete="username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="field mt-2" placeholder="How should we greet you?" /></div><div><label htmlFor="email" className="text-sm font-semibold text-gray-700">Email address</label><input id="email" type="email" required autoComplete="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="field mt-2" placeholder="you@example.com" /></div><div><label htmlFor="new-password" className="text-sm font-semibold text-gray-700">Password</label><div className="relative mt-2"><input id="new-password" type={showPassword ? 'text' : 'password'} required minLength="6" autoComplete="new-password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="field pr-12" placeholder="At least 6 characters" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div></div><button type="submit" disabled={loading} className="button-primary w-full">{loading ? 'Creating your library…' : 'Create my library'}</button></form><p className="mt-7 text-sm text-gray-600">Already have an account? <Link to="/login" className="font-semibold text-burgundy-700 underline underline-offset-4">Sign in</Link></p></div></main></div>;
}

export default Signup;
