import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Search, 
  Clock, 
  RotateCcw, 
  Layers, 
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
  PlusCircle,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TransportType } from '../types';
import { getLocalizedText } from '../utils/confidence';
import { ReportCard } from './ReportCard';

export const ReportFeed: React.FC = () => {
  const { reports, categories, lang, t, setIsReportModalOpen } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTransport, setSelectedTransport] = useState<string>('all');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<'all' | '5m' | '15m' | '1h' | 'today'>('all');
  const [showResolved, setShowResolved] = useState<boolean>(false);

  // Filter logic
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // Status filter
      if (!showResolved && report.status !== 'aktiv') {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && report.category !== selectedCategory) {
        return false;
      }

      // Transport filter
      if (selectedTransport !== 'all' && report.location.transportType !== selectedTransport) {
        return false;
      }

      // Time filter
      if (selectedTimeFilter !== 'all') {
        const ageMs = Date.now() - new Date(report.createdAt).getTime();
        if (selectedTimeFilter === '5m' && ageMs > 5 * 60 * 1000) return false;
        if (selectedTimeFilter === '15m' && ageMs > 15 * 60 * 1000) return false;
        if (selectedTimeFilter === '1h' && ageMs > 60 * 60 * 1000) return false;
        if (selectedTimeFilter === 'today' && ageMs > 24 * 60 * 60 * 1000) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchStation = report.location.stationName?.toLowerCase().includes(q);
        const matchEntrance = report.location.entranceExitName?.toLowerCase().includes(q);
        const matchLine = report.location.lineName?.toLowerCase().includes(q);
        const matchFrom = report.location.fromStationName?.toLowerCase().includes(q);
        const matchTo = report.location.toStationName?.toLowerCase().includes(q);
        const matchSubcat = report.subcategoryName.toLowerCase().includes(q);
        const matchComment = report.comment?.toLowerCase().includes(q);

        if (!matchStation && !matchEntrance && !matchLine && !matchFrom && !matchTo && !matchSubcat && !matchComment) {
          return false;
        }
      }

      return true;
    });
  }, [reports, selectedCategory, selectedTransport, selectedTimeFilter, showResolved, searchQuery]);

  const activeReportsCount = reports.filter((r) => r.status === 'aktiv').length;

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 space-y-4 pb-24">
      {/* Feed Header & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>{t('latestReports')}</span>
            </h1>
            <p className="text-xs text-slate-400">
              {lang === 'es'
                ? 'Actualizaciones estructuradas en tiempo real de pasajeros de Estocolmo.'
                : lang === 'en'
                ? 'Structured real-time updates from passengers in Stockholm.'
                : 'Strukturerade realtidsuppdateringar från pendlare i Stockholm.'}
            </p>
          </div>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all touch-manipulation active:scale-95 shrink-0"
          >
            <span>{lang === 'es' ? '+ Reportar' : '+ Rapportera'}</span>
          </button>
        </div>

        {/* Search input */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus-within:border-emerald-500 transition-colors">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Transport Type Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedTransport('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedTransport === 'all'
                ? 'bg-slate-700 text-white font-bold'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            Alla transportslag
          </button>
          <button
            onClick={() => setSelectedTransport('tunnelbana')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedTransport === 'tunnelbana'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            🚇 Tunnelbana
          </button>
          <button
            onClick={() => setSelectedTransport('pendeltag')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedTransport === 'pendeltag'
                ? 'bg-pink-600 text-white font-bold'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            🚆 Pendeltåg
          </button>
          <button
            onClick={() => setSelectedTransport('buss')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedTransport === 'buss'
                ? 'bg-sky-600 text-white font-bold'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            🚌 Buss
          </button>
          <button
            onClick={() => setSelectedTransport('tvarbanan')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedTransport === 'tvarbanan'
                ? 'bg-orange-600 text-white font-bold'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            🚊 Tvärbanan
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Alla kategorier
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              style={
                selectedCategory === cat.id ? { backgroundColor: cat.color } : undefined
              }
            >
              {getLocalizedText(cat.name, lang, cat.id)}
            </button>
          ))}
        </div>

        {/* Time Window & Show Resolved Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedTimeFilter}
              onChange={(e) => setSelectedTimeFilter(e.target.value as any)}
              className="bg-slate-800 text-slate-200 rounded-lg px-2 py-1 border border-slate-700 outline-none text-xs"
            >
              <option value="all">{lang === 'es' ? 'Cualquier momento' : lang === 'en' ? 'All time windows' : 'Alla tidsintervall'}</option>
              <option value="5m">{t('filterLast5Min')}</option>
              <option value="15m">{t('filterLast15Min')}</option>
              <option value="1h">{t('filterLastHour')}</option>
              <option value="today">{t('filterToday')}</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-slate-200 text-xs">
            <input
              type="checkbox"
              checked={showResolved}
              onChange={(e) => setShowResolved(e.target.checked)}
              className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0"
            />
            <span>{lang === 'es' ? 'Mostrar también resueltos / caducados' : 'Visa även lösta / utgångna'}</span>
          </label>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-white text-base">
                {reports.length === 0 ? t('feedEmptyTitle') : t('noReportsFound')}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                {reports.length === 0 ? t('feedEmptyDesc') : (
                  lang === 'es' 
                    ? 'No hay reportes que coincidan con los filtros seleccionados o la búsqueda actual.' 
                    : 'Inga aktiva incidenter matchar dina valda filter eller sökord.'
                )}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition-all active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{t('reportIncidentBtn')}</span>
              </button>
              
              {(selectedCategory !== 'all' || selectedTransport !== 'all' || selectedTimeFilter !== 'all' || searchQuery.trim() !== '') && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedTransport('all');
                    setSelectedTimeFilter('all');
                    setSearchQuery('');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lang === 'es' ? 'Restablecer filtros' : 'Återställ filter'}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
