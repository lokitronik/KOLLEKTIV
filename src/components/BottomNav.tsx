import React from 'react';
import { 
  Map, 
  Layers, 
  Star, 
  BarChart3, 
  User, 
  PlusCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsReportModalOpen, 
    setPreselectedStationId,
    t,
    lang,
    reports
  } = useApp();

  const activeReportsCount = reports.filter((r) => r.status === 'aktiv').length;

  const handleOpenReport = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setPreselectedStationId(null);
    setIsReportModalOpen(true);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/98 backdrop-blur-md border-t border-slate-800 pb-safe shadow-2xl">
      <div className="max-w-md md:max-w-xl mx-auto px-2 sm:px-3 py-1 flex items-center justify-between">
        {/* Karta */}
        <button
          id="nav-map-button"
          onClick={() => setActiveTab('map')}
          className={`min-h-[46px] min-w-[46px] flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all touch-manipulation active:scale-90 ${
            activeTab === 'map'
              ? 'text-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Map className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">{t('navMap')}</span>
        </button>

        {/* Rapporter / Feed */}
        <button
          id="nav-feed-button"
          onClick={() => setActiveTab('feed')}
          className={`min-h-[46px] min-w-[46px] relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all touch-manipulation active:scale-90 ${
            activeTab === 'feed'
              ? 'text-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Layers className="w-5 h-5 mb-0.5" />
            {activeReportsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-emerald-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {activeReportsCount}
              </span>
            )}
          </div>
          <span className="text-[11px] leading-tight">{t('navFeed')}</span>
        </button>

        {/* Main Action: + Rapportera */}
        <div className="relative -top-3">
          <button
            id="main-report-button"
            onClick={handleOpenReport}
            className="min-h-[48px] flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/40 active:scale-95 transition-transform border-2 border-slate-900 touch-manipulation"
          >
            <PlusCircle className="w-4 h-4 fill-slate-950 text-white shrink-0" />
            <span>{lang === 'es' ? 'Reportar' : lang === 'en' ? 'Report' : 'Rapportera'}</span>
          </button>
        </div>

        {/* Favoriter */}
        <button
          id="nav-favorites-button"
          onClick={() => setActiveTab('favorites')}
          className={`min-h-[46px] min-w-[46px] flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all touch-manipulation active:scale-90 ${
            activeTab === 'favorites'
              ? 'text-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Star className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">{t('navFavorites')}</span>
        </button>

        {/* Statistik */}
        <button
          id="nav-stats-button"
          onClick={() => setActiveTab('stats')}
          className={`min-h-[46px] min-w-[46px] flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all touch-manipulation active:scale-90 ${
            activeTab === 'stats'
              ? 'text-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">{t('navStats')}</span>
        </button>

        {/* Profil */}
        <button
          id="nav-profile-button"
          onClick={() => setActiveTab('profile')}
          className={`min-h-[46px] min-w-[46px] flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all touch-manipulation active:scale-90 ${
            activeTab === 'profile'
              ? 'text-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">{t('navProfile')}</span>
        </button>
      </div>
    </nav>
  );
};
