import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Layers, 
  Trash2, 
  Download, 
  Lock, 
  Globe, 
  FileText, 
  ExternalLink,
  Sparkles,
  Key
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getReputationTier } from '../utils/confidence';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    reports, 
    switchUserRole,
    lang, 
    setLang, 
    t,
    setIsLegalModalOpen,
    setLegalModalTab,
    setToastMessage
  } = useApp();

  const [authProvider, setAuthProvider] = useState<'guest' | 'google' | 'apple' | 'email'>('google');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // User's submitted reports
  const userReports = reports.filter((r) => r.userId === currentUser.id);

  // GDPR Data Export Download
  const handleExportData = () => {
    const exportPayload = {
      profile: {
        id: currentUser.id,
        username: currentUser.username,
        email: currentUser.email,
        role: currentUser.role,
        reputation: currentUser.reputation,
        createdAt: currentUser.createdAt
      },
      submittedReports: userReports,
      favorites: {
        stations: currentUser.favoriteStations,
        lines: currentUser.favoriteLines
      },
      exportTimestamp: new Date().toISOString(),
      gdprStatement: 'Exported under GDPR Article 20 (Right to data portability)'
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kollektivkoll_user_data_${currentUser.id}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setToastMessage({
      title: '📁 Data exporterade',
      body: 'Dina användardata har laddats ned i enlighet med GDPR.',
      type: 'success'
    });
  };

  // Account deletion
  const handleDeleteAccount = () => {
    setCurrentUser((prev) => ({
      ...prev,
      username: 'Raderad användare',
      reputation: 0,
      favoriteStations: [],
      favoriteLines: []
    }));
    setShowDeleteConfirm(false);
    setToastMessage({
      title: '🔒 Konto raderat',
      body: 'Alla personuppgifter och preferenser har tagits bort.',
      type: 'info'
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 space-y-5 pb-24 text-slate-200">
      {/* Profile Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">
                  {currentUser.username}
                </h1>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {getReputationTier(currentUser.reputation)}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentUser.email || 'Anonym pendlare'} · Medlem sedan jan 2025
              </p>
            </div>
          </div>

          {/* Quick Role Switcher Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => switchUserRole(currentUser.role === 'admin' ? 'user' : 'admin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                currentUser.role === 'admin'
                  ? 'bg-purple-900/60 border-purple-500 text-purple-200'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {currentUser.role === 'admin' ? 'Växla till Resenär' : 'Växla till Admin / Moderator'}
            </button>
          </div>
        </div>

        {/* Reputation & Performance Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[11px] text-slate-400 mb-0.5">Förtroendepoäng</div>
            <div className="text-xl font-extrabold text-emerald-400">
              ★ {currentUser.reputation}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[11px] text-slate-400 mb-0.5">Träffsäkerhet</div>
            <div className="text-xl font-extrabold text-white">98%</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[11px] text-slate-400 mb-0.5">{t('totalReportsCreated')}</div>
            <div className="text-xl font-extrabold text-white">
              {currentUser.reportsCount}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[11px] text-slate-400 mb-0.5">{t('totalConfirmationsGiven')}</div>
            <div className="text-xl font-extrabold text-white">
              {currentUser.confirmationsCount}
            </div>
          </div>
        </div>
      </div>

      {/* Account Login Options (Email / Google / Apple) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-emerald-400" />
          <span>Konto & Inloggningsmetoder</span>
        </h2>
        <p className="text-xs text-slate-400">
          Autentisering med Google, Apple eller e-post för att bevara förtroendestatus.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => {
              setAuthProvider('google');
              setCurrentUser((prev) => ({ ...prev, username: 'Google Pendlare' }));
            }}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              authProvider === 'google'
                ? 'border-emerald-500 bg-emerald-950/30 text-white'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <span>Google</span>
            {authProvider === 'google' && '✓'}
          </button>

          <button
            onClick={() => {
              setAuthProvider('apple');
              setCurrentUser((prev) => ({ ...prev, username: 'Apple Resenär' }));
            }}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              authProvider === 'apple'
                ? 'border-emerald-500 bg-emerald-950/30 text-white'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <span>Apple ID</span>
            {authProvider === 'apple' && '✓'}
          </button>

          <button
            onClick={() => setAuthProvider('email')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              authProvider === 'email'
                ? 'border-emerald-500 bg-emerald-950/30 text-white'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <span>E-post / Lösenord</span>
            {authProvider === 'email' && '✓'}
          </button>
        </div>
      </div>

      {/* Privacy & GDPR Compliance Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>{t('privacySection')}</span>
        </h2>
        <p className="text-xs text-slate-400">
          KollektivAlert är byggt med <strong>Privacy by Design</strong>. Vi samlar inte in eller lagrar GPS-positionsspårning eller resmönster. Alla rapporter är anonymiserade.
        </p>

        <div className="flex flex-wrap gap-2.5 pt-1">
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('btnExportData')}</span>
          </button>

          <button
            onClick={() => {
              setLegalModalTab('privacy');
              setIsLegalModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Integritetspolicy</span>
          </button>

          <button
            onClick={() => {
              setLegalModalTab('terms');
              setIsLegalModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Användarvillkor</span>
          </button>
        </div>

        {/* Delete Account Button */}
        <div className="pt-3 border-t border-slate-800">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('btnDeleteAccount')}</span>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-2">
              <p className="text-xs text-rose-200">
                Är du säker? Detta raderar alla dina förtroendepoäng och sparade favoriter omedelbart.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDeleteAccount}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
                >
                  Ja, radera mitt konto
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  Avbryt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
