import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  Construction, 
  TrainTrack, 
  Building2, 
  Users, 
  HelpCircle, 
  Flag, 
  ShieldCheck, 
  MoreVertical, 
  Check, 
  Trash2,
  Share2,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Report } from '../types';
import { formatTimeAgo } from '../utils/confidence';

interface ReportCardProps {
  report: Report;
  compact?: boolean;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, compact = false }) => {
  const { 
    currentUser, 
    confirmReport, 
    flagReport, 
    updateReportStatus, 
    deleteReport,
    categories,
    lang,
    t
  } = useApp();

  const [isFlagOpen, setIsFlagOpen] = useState(false);
  const [hasVotedLocally, setHasVotedLocally] = useState(false);

  const categoryDef = categories.find((c) => c.id === report.category);

  // Check if current user has already voted
  const userExistingVote = report.confirmations.find((c) => c.userId === currentUser.id);

  // Render category icon
  const getCategoryIcon = () => {
    switch (categoryDef?.icon) {
      case 'AlertTriangle':
        return <AlertTriangle className="w-4 h-4" />;
      case 'Construction':
        return <Construction className="w-4 h-4" />;
      case 'TrainTrack':
        return <TrainTrack className="w-4 h-4" />;
      case 'Building2':
        return <Building2 className="w-4 h-4" />;
      case 'Users':
        return <Users className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  const handleVote = async (type: 'confirm' | 'reject') => {
    if (userExistingVote || hasVotedLocally) return;
    setHasVotedLocally(true);
    await confirmReport(report.id, type);
  };

  const handleFlag = async (reason: 'spam' | 'falsk_info' | 'olampligt' | 'annat') => {
    await flagReport(report.id, reason);
    setIsFlagOpen(false);
  };

  // Confidence styling
  const getConfidenceBadge = () => {
    switch (report.confidence) {
      case 'hog':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {t('confHigh')}
          </span>
        );
      case 'osaker':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            {t('confMedium')}
          </span>
        );
      case 'ej_verifierad':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            {t('confLow')}
          </span>
        );
    }
  };

  return (
    <article 
      id={`report-${report.id}`}
      className={`rounded-2xl border transition-all ${
        report.status === 'aktiv'
          ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700/80 shadow-md'
          : 'bg-slate-900/40 border-slate-800/50 opacity-75'
      } p-4 sm:p-5 flex flex-col gap-3 relative`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-start justify-between gap-2">
        {/* Category & Subcategory */}
        <div className="flex items-center gap-2 flex-wrap">
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-sm"
            style={{ backgroundColor: categoryDef?.color || '#3B82F6' }}
          >
            {getCategoryIcon()}
            <span>{categoryDef?.name[lang] || categoryDef?.name.sv}</span>
          </div>

          <span className="text-white font-extrabold text-sm tracking-tight">
            {report.subcategoryName}
          </span>
        </div>

        {/* Status & Menu */}
        <div className="flex items-center gap-2">
          {report.status === 'aktiv' ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {t('statusActive')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {report.status === 'lost' ? t('statusResolved') : t('statusExpired')}
            </span>
          )}

          <div className="relative">
            <button
              onClick={() => setIsFlagOpen(!isFlagOpen)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Alternativ & Rapportera fel"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isFlagOpen && (
              <div className="absolute right-0 mt-1 w-48 py-1.5 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-30 text-xs">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Moderering & Val
                </div>
                <button
                  onClick={() => handleFlag('spam')}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-700 text-slate-300 flex items-center gap-2"
                >
                  <Flag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Anmäl som spam</span>
                </button>
                <button
                  onClick={() => handleFlag('falsk_info')}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-700 text-slate-300 flex items-center gap-2"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Falsk information</span>
                </button>

                {report.userId === currentUser.id && (
                  <div className="mt-1 pt-1 border-t border-slate-700">
                    <button
                      onClick={() => {
                        updateReportStatus(report.id, report.status === 'aktiv' ? 'lost' : 'aktiv');
                        setIsFlagOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-700 text-emerald-400 flex items-center gap-2 font-semibold"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>
                        {report.status === 'aktiv' 
                          ? (lang === 'es' ? 'Marcar como resuelto' : 'Markera som löst') 
                          : (lang === 'es' ? 'Reactivar alerta' : 'Återaktivera')}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        deleteReport(report.id);
                        setIsFlagOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-700 text-rose-400 flex items-center gap-2 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{lang === 'es' ? 'Eliminar mi alerta' : 'Radera min rapport'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Structured Location Hierarchy */}
      <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <span 
            className="w-2.5 h-2.5 rounded-full shrink-0" 
            style={{ backgroundColor: report.location.lineColor || '#10B981' }}
          />
          <span>
            {report.location.transportType === 'tunnelbana' && 'Tunnelbana'}
            {report.location.transportType === 'pendeltag' && 'Pendeltåg'}
            {report.location.transportType === 'buss' && 'Buss'}
            {report.location.transportType === 'tvarbanan' && 'Tvärbanan'}
            {report.location.transportType === 'sparvag' && 'Spårväg'}
            {report.location.lineName && ` · ${report.location.lineName}`}
          </span>
        </div>

        {/* Structured Node */}
        {report.location.locationType === 'station' && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="font-bold text-white flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {report.location.stationName}
            </span>
            {report.location.entranceExitName && (
              <span className="text-slate-300 font-medium bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700/60">
                🚪 {report.location.entranceExitName}
              </span>
            )}
            {report.location.stationArea && (
              <span className="text-slate-400 capitalize">
                ({report.location.stationArea})
              </span>
            )}
          </div>
        )}

        {(report.location.locationType === 'in_vehicle' || report.location.locationType === 'between_stations') && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 font-semibold">
              🚇 {report.location.locationType === 'in_vehicle' ? 'I tåget' : 'Mellan stationer'}
            </span>
            <span className="font-bold text-white">
              {report.location.fromStationName} → {report.location.toStationName}
            </span>
            {report.location.direction && (
              <span className="text-slate-400 italic">
                ({report.location.direction})
              </span>
            )}
          </div>
        )}

        {report.location.locationType === 'bus_stop' && (
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="font-bold text-white">
              🚏 {report.location.stopName || 'Hållplats'}
            </span>
          </div>
        )}
      </div>

      {/* User Optional Comment */}
      {report.comment && (
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/40">
          "{report.comment}"
        </p>
      )}

      {/* Confidence & Confirmation Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          {getConfidenceBadge()}
          <span>·</span>
          <span className="font-semibold text-slate-300">
            {report.confirmationsCount} {t('confirmations')}
          </span>
          {report.rejectionsCount > 0 && (
            <span className="text-rose-400 font-medium">
              ({report.rejectionsCount} {t('refutations')})
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTimeAgo(report.createdAt, lang)}</span>
        </div>
      </div>

      {/* Community Confirmation Flow ("Är detta fortfarande aktuellt?") */}
      {report.status === 'aktiv' && (
        <div className="mt-1 pt-3 border-t border-slate-800 bg-slate-950/40 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-3 sm:p-4 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <span className="text-xs font-semibold text-slate-300 text-center sm:text-left">
            {t('isStillActive')}
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleVote('confirm')}
              disabled={!!userExistingVote || hasVotedLocally}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 min-h-[42px] rounded-xl font-bold text-xs transition-all active:scale-95 touch-manipulation ${
                userExistingVote?.type === 'confirm'
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                  : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 disabled:opacity-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('btnYesStillHere')}</span>
            </button>

            <button
              onClick={() => handleVote('reject')}
              disabled={!!userExistingVote || hasVotedLocally}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 min-h-[42px] rounded-xl font-bold text-xs transition-all active:scale-95 touch-manipulation ${
                userExistingVote?.type === 'reject'
                  ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
                  : 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 disabled:opacity-50'
              }`}
            >
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{t('btnNoLongerHere')}</span>
            </button>
          </div>
        </div>
      )}
    </article>
  );
};
