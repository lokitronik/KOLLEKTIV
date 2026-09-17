import React, { useState } from 'react';
import { 
  Star, 
  Bell, 
  MapPin, 
  Train, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ReportCard } from './ReportCard';

export const FavoritesView: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser,
    stations, 
    lines, 
    reports, 
    toggleFavoriteStation, 
    toggleFavoriteLine,
    t,
    setPreselectedStationId,
    setIsReportModalOpen
  } = useApp();

  const [addStationId, setAddStationId] = useState<string>('');
  const [addLineId, setAddLineId] = useState<string>('');

  const favoriteStations = stations.filter((s) => currentUser.favoriteStations.includes(s.id));
  const favoriteLines = lines.filter((l) => currentUser.favoriteLines.includes(l.id));

  // Active reports for user's favorites
  const favoriteReports = reports.filter((r) => {
    if (r.status !== 'aktiv') return false;
    const matchStation = currentUser.favoriteStations.includes(r.location.stationId || '');
    const matchLine = currentUser.favoriteLines.includes(r.location.lineId || '');
    return matchStation || matchLine;
  });

  const handleAddStation = () => {
    if (addStationId && !currentUser.favoriteStations.includes(addStationId)) {
      toggleFavoriteStation(addStationId);
      setAddStationId('');
    }
  };

  const handleAddLine = () => {
    if (addLineId && !currentUser.favoriteLines.includes(addLineId)) {
      toggleFavoriteLine(addLineId);
      setAddLineId('');
    }
  };

  const toggleNotifications = () => {
    setCurrentUser((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        notificationsEnabled: !prev.settings.notificationsEnabled
      }
    }));
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 space-y-5 pb-24 text-slate-200">
      {/* Header & Notifications Toggle */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>{t('favoritesTitle')}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Bevaka dina dagliga pendlingsstationer och linjer för omedelbara notiser.
            </p>
          </div>

          <button
            onClick={toggleNotifications}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              currentUser.settings.notificationsEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <Bell className={`w-4 h-4 ${currentUser.settings.notificationsEnabled ? 'text-emerald-400 animate-bounce' : 'text-slate-500'}`} />
            <span>
              {currentUser.settings.notificationsEnabled ? 'Notiser aktiverade' : 'Notiser avstängda'}
            </span>
          </button>
        </div>
      </div>

      {/* Active Incidents on Your Favorites */}
      {favoriteReports.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Aktiva incidenter på dina favoriter ({favoriteReports.length})</span>
          </div>
          <div className="space-y-2.5">
            {favoriteReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </div>
      )}

      {/* Favorite Stations List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{t('favoriteStations')}</span>
          </h2>
          <span className="text-xs text-slate-400">{favoriteStations.length} sparade</span>
        </div>

        {/* Add Station Input */}
        <div className="flex items-center gap-2">
          <select
            value={addStationId}
            onChange={(e) => setAddStationId(e.target.value)}
            className="flex-1 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-emerald-500"
          >
            <option value="">-- Välj station att bevaka --</option>
            {stations
              .filter((s) => !currentUser.favoriteStations.includes(s.id))
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
          </select>
          <button
            onClick={handleAddStation}
            disabled={!addStationId}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Lägg till</span>
          </button>
        </div>

        {/* Station Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {favoriteStations.map((station) => {
            const stationActiveCount = reports.filter(
              (r) => r.status === 'aktiv' && r.location.stationId === station.id
            ).length;

            return (
              <div
                key={station.id}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="font-bold text-sm text-white truncate flex items-center gap-1.5">
                    <span>{station.name}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">
                      Zon {station.zone}
                    </span>
                  </div>
                  <div className="text-[11px] mt-0.5">
                    {stationActiveCount > 0 ? (
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        {stationActiveCount} incident(er) aktiv(a)
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Normal drift
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setPreselectedStationId(station.id);
                      setIsReportModalOpen(true);
                    }}
                    className="p-1.5 text-xs text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Skapa rapport för denna station"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleFavoriteStation(station.id)}
                    className="p-1.5 text-xs text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Ta bort från favoriter"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Favorite Lines List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Train className="w-4 h-4 text-emerald-400" />
            <span>{t('favoriteLines')}</span>
          </h2>
          <span className="text-xs text-slate-400">{favoriteLines.length} sparade</span>
        </div>

        {/* Add Line Input */}
        <div className="flex items-center gap-2">
          <select
            value={addLineId}
            onChange={(e) => setAddLineId(e.target.value)}
            className="flex-1 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-emerald-500"
          >
            <option value="">-- Välj linje att bevaka --</option>
            {lines
              .filter((l) => !currentUser.favoriteLines.includes(l.id))
              .map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
          </select>
          <button
            onClick={handleAddLine}
            disabled={!addLineId}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Lägg till</span>
          </button>
        </div>

        {/* Line Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {favoriteLines.map((line) => {
            const lineActiveCount = reports.filter(
              (r) => r.status === 'aktiv' && r.location.lineId === line.id
            ).length;

            return (
              <div
                key={line.id}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-3 h-8 rounded-full shrink-0"
                    style={{ backgroundColor: line.color }}
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-xs sm:text-sm text-white truncate">
                      {line.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {lineActiveCount > 0 ? (
                        <span className="text-amber-400 font-semibold">
                          {lineActiveCount} aktiv(a) incident(er)
                        </span>
                      ) : (
                        <span className="text-emerald-400">Normal trafik</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleFavoriteLine(line.id)}
                  className="p-1.5 text-xs text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Ta bort från favoriter"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
