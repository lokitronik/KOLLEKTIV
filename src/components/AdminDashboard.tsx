import React, { useState, useRef } from 'react';
import { 
  ShieldAlert, 
  Trash2, 
  Check, 
  Flag, 
  Settings, 
  Plus, 
  Users, 
  Clock, 
  AlertTriangle,
  Layers,
  MapPin,
  Download,
  Upload,
  Zap,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CategoryDefinition, Report } from '../types';
import { getLocalizedText } from '../utils/confidence';

export const AdminDashboard: React.FC = () => {
  const { 
    reports, 
    categories, 
    saveCategory, 
    updateReportStatus, 
    deleteReport, 
    stations, 
    lines, 
    lang, 
    t,
    setToastMessage,
    resetDemoReports,
    clearAllReports,
    importReports,
    exportDatabase,
    simulateIncident,
    isStandaloneMode
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'reports' | 'categories' | 'moderation' | 'network'>('reports');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New category form state
  const [newCatNameSv, setNewCatNameSv] = useState('');
  const [newCatNameEn, setNewCatNameEn] = useState('');
  const [newCatColor, setNewCatColor] = useState('#EC4899');
  const [newCatExpiry, setNewCatExpiry] = useState(60);

  // Filtered flagged reports
  const flaggedReports = reports.filter((r) => r.flaggedCount > 0 || r.status === 'avvisad');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const reportsList = Array.isArray(json) ? json : json.reports;
        if (Array.isArray(reportsList)) {
          importReports(reportsList);
        } else {
          setToastMessage({
            title: 'Ogiltigt format',
            body: 'Kunde inte identifiera en lista med rapporter i JSON-filen.',
            type: 'error'
          });
        }
      } catch {
        setToastMessage({
          title: 'Importfel',
          body: 'Filen innehåller inte giltig JSON.',
          type: 'error'
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatNameSv.trim()) return;

    const id = `cat_${newCatNameSv.toLowerCase().replace(/\s+/g, '_')}`;
    const newCat: CategoryDefinition = {
      id,
      name: {
        sv: newCatNameSv.trim(),
        en: newCatNameEn.trim() || newCatNameSv.trim(),
        es: newCatNameSv.trim()
      },
      icon: 'HelpCircle',
      color: newCatColor,
      bgColor: '#FDF2F8',
      borderColor: '#FBCFE8',
      defaultExpiryMinutes: Number(newCatExpiry),
      subcategories: [
        {
          id: `${id}_general`,
          name: { sv: 'Allmän händelse', en: 'General issue', es: 'Evento general' },
          severity: 'medium',
          defaultExpiryMinutes: Number(newCatExpiry)
        }
      ]
    };

    await saveCategory(newCat);
    setNewCatNameSv('');
    setNewCatNameEn('');
    setToastMessage({
      title: '✅ Kategori tillagd',
      body: `Kategorin "${newCat.name.sv}" är nu aktiv i systemet.`,
      type: 'success'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-5 pb-24 text-slate-200">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-950/80 to-slate-900 border border-purple-800/50 rounded-2xl p-4 sm:p-5 shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {t('adminDashboard')}
            </h1>
            <p className="text-xs text-purple-200">
              Moderering, kategorihantering och systemregler.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
          Superadmin
        </span>
      </div>

      {/* Sub Tabs & Maintenance */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
          <button
            onClick={() => setActiveAdminTab('reports')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeAdminTab === 'reports'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {t('adminReports')} ({reports.length})
          </button>

          <button
            onClick={() => setActiveAdminTab('moderation')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeAdminTab === 'moderation'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>{t('adminModerationQueue')}</span>
            {flaggedReports.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 rounded-full font-bold">
                {flaggedReports.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('categories')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeAdminTab === 'categories'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {t('adminCategories')} ({categories.length})
          </button>
        </div>

        {/* Database Quick Actions & Tools */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".json" 
            className="hidden" 
          />

          <button
            onClick={simulateIncident}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 text-[11px] font-semibold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
            title="Generera en simulerad live-incident för testning"
          >
            <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
            <span>Simulera händelse</span>
          </button>

          <button
            onClick={exportDatabase}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] font-semibold transition-all flex items-center gap-1.5"
            title="Ladda ned hela databasen som JSON-fil"
          >
            <Download className="w-3 h-3 text-slate-400" />
            <span>Exportera</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] font-semibold transition-all flex items-center gap-1.5"
            title="Läs in händelser från JSON-fil"
          >
            <Upload className="w-3 h-3 text-slate-400" />
            <span>Importera</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Vill du återställa standardincidenter?')) {
                resetDemoReports();
                if (!isStandaloneMode) {
                  fetch('/api/admin/reset-defaults', { method: 'POST' }).catch(() => {});
                }
              }
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] font-semibold transition-all flex items-center gap-1.5"
            title="Ladda in fräscha exempelincidenter"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Återställ</span>
          </button>

          <button
            onClick={async () => {
              if (window.confirm('Vill du rensa alla rapporter och starta med ett helt tomt flöde för skarp drift?')) {
                clearAllReports();
                if (!isStandaloneMode) {
                  try {
                    await fetch('/api/admin/clear-all', { method: 'POST' });
                  } catch {}
                }
              }
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/50 text-rose-300 border border-slate-800 hover:border-rose-700/50 text-[11px] font-semibold transition-all flex items-center gap-1.5"
            title="Rensa flödet för skarp användning"
          >
            <Trash2 className="w-3 h-3" />
            <span>Töm</span>
          </button>
        </div>
      </div>

      {/* TAB: Reports List */}
      {activeAdminTab === 'reports' && (
        <div className="space-y-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-2.5">Kategori / Händelse</th>
                  <th className="pb-2.5">Plats</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5">Förtroende</th>
                  <th className="pb-2.5 text-right">Åtgärder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3">
                      <div className="font-bold text-white">{r.subcategoryName}</div>
                      <div className="text-[11px] text-slate-400">Av: {r.username}</div>
                    </td>
                    <td className="py-3">
                      <div>{r.location.stationName || `${r.location.fromStationName} → ${r.location.toStationName}`}</div>
                      <div className="text-[11px] text-slate-400">{r.location.lineName}</div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.status === 'aktiv' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="font-bold text-emerald-400">{r.confidenceScore}%</div>
                      <div className="text-[10px] text-slate-400">{r.confirmationsCount} bekräftelser</div>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => updateReportStatus(r.id, r.status === 'aktiv' ? 'lost' : 'aktiv')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400"
                          title="Växla status"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteReport(r.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400"
                          title="Radera"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Moderation Queue */}
      {activeAdminTab === 'moderation' && (
        <div className="space-y-3">
          {flaggedReports.length > 0 ? (
            flaggedReports.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-slate-900 border border-rose-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4 text-rose-400" />
                    <span className="font-bold text-white text-sm">{r.subcategoryName}</span>
                    <span className="text-xs bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded">
                      {r.flaggedCount} anmälningar
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteReport(r.id)}
                      className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                    >
                      Radera & Varna
                    </button>
                    <button
                      onClick={() => updateReportStatus(r.id, 'aktiv')}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
                    >
                      Godkänn
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-300 italic bg-slate-950 p-2.5 rounded-lg">
                  "{r.comment || 'Ingen kommentar angiven'}"
                </p>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs">
              Inga anmälda rapporter i granskningskön. Systemet är rent!
            </div>
          )}
        </div>
      )}

      {/* TAB: Categories & Expiration Rules */}
      {activeAdminTab === 'categories' && (
        <div className="space-y-4">
          {/* Add Category Form */}
          <form onSubmit={handleAddCategory} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Skapa ny incidentkategori</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 font-bold uppercase mb-1">
                  Kategorinamn (Svenska)
                </label>
                <input
                  type="text"
                  value={newCatNameSv}
                  onChange={(e) => setNewCatNameSv(e.target.value)}
                  placeholder="T.ex. Hälsa & Miljö"
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 font-bold uppercase mb-1">
                  Namn (Engelska)
                </label>
                <input
                  type="text"
                  value={newCatNameEn}
                  onChange={(e) => setNewCatNameEn(e.target.value)}
                  placeholder="E.g. Health & Environment"
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 font-bold uppercase mb-1">
                  Standard livslängd (minuter)
                </label>
                <input
                  type="number"
                  value={newCatExpiry}
                  onChange={(e) => setNewCatExpiry(Number(e.target.value))}
                  min={15}
                  max={720}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-md"
            >
              Spara kategori
            </button>
          </form>

          {/* Current Categories List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: cat.color }} 
                    />
                    <span className="font-bold text-sm text-white">{getLocalizedText(cat.name, lang, cat.id)}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {lang === 'es' ? 'Caducidad' : lang === 'en' ? 'Expires' : 'Utgång'}: {cat.defaultExpiryMinutes} min
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  {(cat.subcategories || []).length} {lang === 'es' ? 'subcategorías definidas' : lang === 'en' ? 'subcategories defined' : 'subkategorier definierade'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
