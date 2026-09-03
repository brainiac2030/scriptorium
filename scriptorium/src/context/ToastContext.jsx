import { createContext, useCallback, useContext, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const ToastContext = createContext();
export const useToast = () => { const context = useContext(ToastContext); if (!context) throw new Error('useToast must be used within ToastProvider'); return context; };

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const removeToast = useCallback((id) => setToasts((items) => items.filter((item) => item.id !== id)), []);
  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((items) => [...items, { id, message, type }]);
    window.setTimeout(() => removeToast(id), duration);
  }, [removeToast]);
  const success = useCallback((message) => addToast(message, 'success'), [addToast]);
  const error = useCallback((message) => addToast(message, 'error'), [addToast]);
  const info = useCallback((message) => addToast(message, 'info'), [addToast]);

  return <ToastContext.Provider value={{ success, error, info }}>{children}<div className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-full sm:max-w-sm" aria-live="polite">{toasts.map((toast) => { const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? AlertCircle : Info; return <div key={toast.id} className="pointer-events-auto flex w-full items-start gap-3 border border-burgundy-900/15 bg-cream-50 p-4 shadow-xl animate-slideUp"><Icon className={`mt-0.5 h-5 w-5 shrink-0 ${toast.type === 'error' ? 'text-red-700' : toast.type === 'success' ? 'text-green-700' : 'text-burgundy-700'}`} /><p className="flex-1 text-sm leading-5 text-gray-800">{toast.message}</p><button onClick={() => removeToast(toast.id)} aria-label="Dismiss notification" className="text-gray-400 hover:text-gray-700"><X className="h-4 w-4" /></button></div>; })}</div></ToastContext.Provider>;
};
