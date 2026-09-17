import React from 'react';
import { 
  Radio, 
  Globe, 
  ShieldAlert, 
  Bell, 
  MapPin, 
  UserCheck, 
  ChevronDown,
  Sparkles,
  PlusCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { 
    lang, 
    setLang, 
    isConnected, 
    reports, 
    currentUser, 
    switchUserRole,
    setActiveTab,
    activeTab,
    setIsReportModalOpen,
    setPreselectedStationId
  } = useApp();

  const activeReportsCount = reports.filter((r) => r.status === 'aktiv').length;

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Brand & City Indicator */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveTab('map')}
            className="cursor-pointer flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-950/40 text-white font-bold text-lg">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Kollektiv<span className="text-emerald-400">Alert</span>
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Live
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>Stockholm · SL</span>
                <span className="text-slate-600">|</span>
                <span className="text-emerald-400 font-semibold">{activeReportsCount} aktiva</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls & User / Lang Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Realtime Status Indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
            <span className="text-slate-300 font-medium">
              {isConnected ? 'Realtid' : 'Synkar'}
            </span>
          </div>

          {/* Language Switcher */}
          <div className="relative group">
            <button 
              id="lang-select-button"
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span className="uppercase">{lang}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            <div className="absolute right-0 mt-1 w-28 py-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
              <button 
                onClick={() => setLang('sv')} 
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-700 flex items-center justify-between ${lang === 'sv' ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}
              >
                <span>Svenska</span>
                {lang === 'sv' && '✓'}
              </button>
              <button 
                onClick={() => setLang('en')} 
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-700 flex items-center justify-between ${lang === 'en' ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}
              >
                <span>English</span>
                {lang === 'en' && '✓'}
              </button>
              <button 
                onClick={() => setLang('es')} 
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-700 flex items-center justify-between ${lang === 'es' ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}
              >
                <span>Español</span>
                {lang === 'es' && '✓'}
              </button>
            </div>
          </div>

          {/* Quick Report Button in Header */}
          <button
            id="header-report-button"
            onClick={() => {
              setPreselectedStationId(null);
              setIsReportModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
            title="Skapa ny rapport"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rapportera</span>
          </button>

          {/* Quick Role Toggle (Demo / Admin) */}
          <button
            id="role-switch-button"
            onClick={() => {
              if (currentUser.role === 'admin') {
                switchUserRole('user');
              } else {
                switchUserRole('admin');
                setActiveTab('admin');
              }
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              currentUser.role === 'admin'
                ? 'bg-purple-900/60 border-purple-500/50 text-purple-200'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title="Toggle Admin / User mode"
          >
            {currentUser.role === 'admin' ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Admin-läge</span>
                <span className="sm:hidden">Admin</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{currentUser.username}</span>
                <span className="text-emerald-400 text-[11px]">★ {currentUser.reputation}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
