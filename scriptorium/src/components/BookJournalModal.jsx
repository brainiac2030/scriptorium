import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Clock3, MessageSquareQuote, Plus, X } from 'lucide-react';
import { addQuote, getBookQuotes, getBookSessions } from '../api';
import { useToast } from '../context/ToastContext';

function BookJournalModal({ book, isOpen, onClose }) {
  const { success, error: showError } = useToast();
  const [tab, setTab] = useState('sessions');
  const [sessions, setSessions] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quoteForm, setQuoteForm] = useState({ content: '', page_number: '' });
  const [addingQuote, setAddingQuote] = useState(false);

  useEffect(() => {
    if (!isOpen || !book) return;
    setLoading(true);
    Promise.all([getBookSessions(book.id), getBookQuotes(book.id)])
      .then(([sessionsRes, quotesRes]) => { setSessions(sessionsRes.data || []); setQuotes(quotesRes.data || []); })
      .catch(() => showError('This reading journal could not be loaded.'))
      .finally(() => setLoading(false));
  }, [isOpen, book, showError]);

  const totals = useMemo(() => sessions.reduce((sum, item) => ({ minutes: sum.minutes + item.duration_minutes, pages: sum.pages + item.pages_read }), { minutes: 0, pages: 0 }), [sessions]);
  if (!isOpen || !book) return null;

  const submitQuote = async (event) => {
    event.preventDefault();
    setAddingQuote(true);
    try {
      const { data } = await addQuote(book.id, { content: quoteForm.content.trim(), page_number: quoteForm.page_number ? Number(quoteForm.page_number) : null });
      setQuotes((items) => [data, ...items]);
      setQuoteForm({ content: '', page_number: '' });
      success('Passage saved to your journal.');
    } catch (error) { showError(error.response?.data?.error || 'Could not save this passage.'); }
    finally { setAddingQuote(false); }
  };

  return <div className="fixed inset-0 z-50 flex justify-end bg-burgundy-900/60" role="dialog" aria-modal="true" aria-labelledby="journal-title">
    <div className="h-full w-full max-w-xl overflow-y-auto bg-cream-50 shadow-2xl animate-slideUp">
      <header className="sticky top-0 z-10 border-b border-burgundy-900/10 bg-cream-50/95 px-5 py-5 backdrop-blur sm:px-8"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow mb-2">Reading journal</p><h2 id="journal-title" className="line-clamp-1 text-2xl font-bold text-burgundy-900">{book.title}</h2><p className="mt-1 text-sm text-gray-500">{book.author}</p></div><button onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl hover:bg-cream-200" aria-label="Close journal"><X className="h-5 w-5" /></button></div><div className="mt-5 grid grid-cols-2 rounded-xl bg-cream-200 p-1"><button onClick={() => setTab('sessions')} className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold ${tab === 'sessions' ? 'bg-white text-burgundy-900 shadow-sm' : 'text-gray-600'}`}><Clock3 className="h-4 w-4" />Sessions</button><button onClick={() => setTab('quotes')} className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold ${tab === 'quotes' ? 'bg-white text-burgundy-900 shadow-sm' : 'text-gray-600'}`}><MessageSquareQuote className="h-4 w-4" />Passages</button></div></header>

      <div className="px-5 py-7 sm:px-8">
        {loading ? <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}</div> : tab === 'sessions' ? <>
          <div className="mb-7 grid grid-cols-2 gap-3"><div className="paper p-4"><p className="text-xs text-gray-500">Time recorded</p><p className="mt-1 font-serif text-2xl font-bold text-burgundy-900">{totals.minutes >= 60 ? `${Math.floor(totals.minutes / 60)}h ${totals.minutes % 60}m` : `${totals.minutes}m`}</p></div><div className="paper p-4"><p className="text-xs text-gray-500">Pages in sessions</p><p className="mt-1 font-serif text-2xl font-bold text-burgundy-900">{totals.pages}</p></div></div>
          {sessions.length ? <div className="space-y-0">{sessions.map((session) => <article key={session.id} className="border-t border-burgundy-900/12 py-5"><div className="flex items-baseline justify-between gap-4"><h3 className="font-semibold text-burgundy-900">{session.pages_read} pages · {session.duration_minutes} min</h3><time className="shrink-0 text-xs text-gray-500">{new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</time></div>{session.notes && <p className="mt-3 border-l-2 border-gold-400 pl-4 text-sm leading-6 text-gray-600">{session.notes}</p>}</article>)}</div> : <div className="py-14 text-center"><Clock3 className="mx-auto h-7 w-7 text-burgundy-400" /><h3 className="mt-4 font-serif text-xl font-bold text-burgundy-900">No sessions yet</h3><p className="mt-2 text-sm text-gray-600">Log a reading session to begin this book’s history.</p></div>}
        </> : <>
          <form onSubmit={submitQuote} className="paper mb-8 p-5"><div className="flex items-center gap-2"><Plus className="h-4 w-4 text-burgundy-600" /><h3 className="font-semibold text-burgundy-900">Save a passage</h3></div><textarea required value={quoteForm.content} onChange={(e) => setQuoteForm({ ...quoteForm, content: e.target.value })} rows="4" className="field mt-4 resize-none" placeholder="A line you want to keep…" /><div className="mt-3 flex items-end gap-3"><label className="flex-1 text-xs font-semibold text-gray-600">Page <span className="font-normal text-gray-400">(optional)</span><input type="number" min="1" value={quoteForm.page_number} onChange={(e) => setQuoteForm({ ...quoteForm, page_number: e.target.value })} className="field mt-1.5 py-2" /></label><button type="submit" disabled={addingQuote || !quoteForm.content.trim()} className="button-primary">{addingQuote ? 'Saving…' : 'Save passage'}</button></div></form>
          {quotes.length ? <div className="space-y-4">{quotes.map((quote) => <blockquote key={quote.id} className="rounded-xl border border-burgundy-900/10 bg-white p-5"><MessageSquareQuote className="h-5 w-5 text-gold-500" /><p className="mt-3 font-serif text-lg leading-7 text-burgundy-900">“{quote.content}”</p><footer className="mt-4 flex justify-between text-xs text-gray-500"><span>{quote.page_number ? `Page ${quote.page_number}` : 'Saved passage'}</span><time>{new Date(quote.created_at).toLocaleDateString()}</time></footer></blockquote>)}</div> : <div className="py-12 text-center"><BookOpen className="mx-auto h-7 w-7 text-burgundy-400" /><h3 className="mt-4 font-serif text-xl font-bold text-burgundy-900">No passages saved</h3><p className="mt-2 text-sm text-gray-600">Keep the sentences you want to return to.</p></div>}
        </>}
      </div>
    </div>
  </div>;
}

export default BookJournalModal;
