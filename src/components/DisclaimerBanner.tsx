import React from 'react';
import { Activity, Info, ShieldCheck, Wifi } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DisclaimerBanner: React.FC = () => {
  const { t, isConnected, setIsLegalModalOpen, setLegalModalTab } = useApp();

  return (
    <div className="bg-slate-900/90 border-b border-slate-800/90 px-3 py-1.5 text-[11px] sm:text-xs text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4">
        {/* Core Disclaimer */}
        <div className="flex items-center gap-1.5 text-slate-300 text-center sm:text-left">
          <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="leading-snug line-clamp-1 sm:line-clamp-none">
            <strong className="text-slate-100 font-semibold">Samhällsbaserad:</strong>{' '}
            {t('disclaimer')}
          </span>
        </div>

        {/* Live Status Indicator & Legal Links */}
        <div className="flex items-center gap-2 text-[11px] shrink-0">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-bold tracking-wide ${
            isConnected
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            {isConnected ? t('demoDataNotice') : 'OFFLINE LÄGE'}
          </span>
          <button
            onClick={() => {
              setLegalModalTab('terms');
              setIsLegalModalOpen(true);
            }}
            className="min-h-[30px] flex items-center text-slate-400 hover:text-slate-200 underline decoration-slate-600 underline-offset-2 transition-colors touch-manipulation"
          >
            Regler & GDPR
          </button>
        </div>
      </div>
    </div>
  );
};
