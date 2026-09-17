import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage, setToastMessage } = useApp();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, setToastMessage]);

  if (!toastMessage) return null;

  return (
    <aside aria-label="Systemmeddelanden" className="fixed top-4 right-4 z-50 max-w-sm w-full animate-in slide-in-from-top-3 duration-200">
      <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-md flex items-start justify-between gap-3 ${
        toastMessage.type === 'success'
          ? 'bg-slate-900/95 border-emerald-500/50 text-slate-100'
          : toastMessage.type === 'error' || toastMessage.type === 'alert'
          ? 'bg-slate-900/95 border-rose-500/50 text-slate-100'
          : 'bg-slate-900/95 border-slate-700 text-slate-100'
      }`}>
        <div className="flex items-start gap-3">
          {toastMessage.type === 'success' && (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          )}
          {(toastMessage.type === 'error' || toastMessage.type === 'alert') && (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          {toastMessage.type === 'info' && (
            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          )}
          <div>
            <div className="font-bold text-xs sm:text-sm text-white">
              {toastMessage.title}
            </div>
            <div className="text-xs text-slate-300 mt-0.5 leading-snug">
              {toastMessage.body}
            </div>
          </div>
        </div>

        <button
          onClick={() => setToastMessage(null)}
          className="text-slate-400 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
