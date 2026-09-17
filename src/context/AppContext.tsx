import React, { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_CATEGORIES } from '../data/categories';
import { INITIAL_DEMO_REPORTS, getFreshDemoReports } from '../data/demoReports';
import { STATIONS, TRANSIT_LINES, TRANSIT_HIERARCHY } from '../data/transitNetwork';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { CategoryDefinition, Report, Station, TransitLine, User } from '../types';
import { calculateConfidence, getReputationTier } from '../utils/confidence';

interface AppContextType {
  // Localization
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS.sv) => string;
  
  // User & Auth
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  switchUserRole: (role: 'user' | 'moderator' | 'admin') => void;
  
  // Data
  reports: Report[];
  categories: CategoryDefinition[];
  stations: Station[];
  lines: TransitLine[];
  hierarchy: typeof TRANSIT_HIERARCHY;
  
  // Loading & Sync
  isConnected: boolean;
  isStandaloneMode: boolean;
  activeCity: string;
  setActiveCity: (city: string) => void;
  
  // Active Tab / View
  activeTab: 'map' | 'feed' | 'favorites' | 'stats' | 'profile' | 'admin';
  setActiveTab: (tab: 'map' | 'feed' | 'favorites' | 'stats' | 'profile' | 'admin') => void;
  
  // Modals
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  preselectedStationId: string | null;
  setPreselectedStationId: (id: string | null) => void;
  isLegalModalOpen: boolean;
  setIsLegalModalOpen: (open: boolean) => void;
  legalModalTab: 'terms' | 'privacy' | 'guidelines';
  setLegalModalTab: (tab: 'terms' | 'privacy' | 'guidelines') => void;
  selectedReportForDetail: Report | null;
  setSelectedReportForDetail: (report: Report | null) => void;
  
  // Notification Toast
  toastMessage: { title: string; body: string; type?: 'info' | 'alert' | 'success' | 'error' } | null;
  setToastMessage: (msg: { title: string; body: string; type?: 'info' | 'alert' | 'success' | 'error' } | null) => void;
  
  // Report Actions
  createReport: (reportData: Partial<Report>) => Promise<Report>;
  confirmReport: (reportId: string, type: 'confirm' | 'reject') => Promise<void>;
  flagReport: (reportId: string, reason: 'spam' | 'falsk_info' | 'olampligt' | 'annat', comment?: string) => Promise<void>;
  updateReportStatus: (reportId: string, status: Report['status']) => Promise<void>;
  deleteReport: (reportId: string) => Promise<void>;
  
  // Category Actions (Admin)
  saveCategory: (category: CategoryDefinition) => Promise<void>;
  
  // Favorites Management
  toggleFavoriteStation: (stationId: string) => void;
  toggleFavoriteLine: (lineId: string) => void;
  isStationFavorite: (stationId: string) => boolean;
  isLineFavorite: (lineId: string) => boolean;

  // Standalone / GitHub Pages Utilities
  clearAllReports: () => void;
  resetDemoReports: () => void;
  importReports: (newReports: Report[]) => void;
  exportDatabase: () => void;
  simulateIncident: () => void;
}

const DEFAULT_USER: User = {
  id: 'usr_me_1',
  username: 'SthlmResenär',
  email: 'resenar@exempel.se',
  role: 'user',
  reputation: 85,
  reputationTitle: 'Pålitlig resenär',
  createdAt: '2025-01-15T10:00:00.000Z',
  reportsCount: 4,
  confirmationsCount: 19,
  accurateReportsCount: 4,
  refutedReportsCount: 0,
  favoriteStations: ['odenplan', 't_centralen', 'slussen'],
  favoriteLines: ['tb_green', 'pendel_40'],
  favoriteZones: ['A'],
  settings: {
    language: 'sv',
    notificationsEnabled: true,
    notifyOnFavorites: true,
    notifyOnSafetyOnly: false,
    mapStyle: 'schematic'
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'kollektivkoll_user_profile_v2';
const LOCAL_STORAGE_LANG_KEY = 'kollektivkoll_lang_v2';
const LOCAL_STORAGE_REPORTS_KEY = 'kollektivalert_reports_v3';
const LOCAL_STORAGE_CATEGORIES_KEY = 'kollektivalert_categories_v3';

// BroadcastChannel helper for instant multi-tab sync without a backend
function broadcastSync(type: string, payload: unknown) {
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const bc = new BroadcastChannel('kollektivalert_realtime_sync');
      bc.postMessage({ type, payload });
      bc.close();
    } catch {}
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_LANG_KEY);
      if (saved && ['sv', 'en', 'es'].includes(saved)) {
        return saved as Language;
      }
    } catch {
      // ignore
    }
    return 'sv';
  });

  const [currentUser, setCurrentUserState] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_USER;
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(LOCAL_STORAGE_LANG_KEY, newLang);
    } catch {
      // ignore
    }
  };

  const setCurrentUser: React.Dispatch<React.SetStateAction<User>> = (value) => {
    setCurrentUserState((prev) => {
      const updated = typeof value === 'function' ? (value as (prev: User) => User)(prev) : value;
      try {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Initialize reports from localStorage (starts empty for clean live application)
  const [reports, setReports] = useState<Report[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading reports from localStorage', e);
    }
    // Clean initial state: no artificial or fake alerts
    return [];
  });

  // Initialize categories from localStorage or default
  const [categories, setCategories] = useState<CategoryDefinition[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.some((c: any) => c?.subcategories?.length > 0)) {
          return parsed;
        }
      }
    } catch {}
    return INITIAL_CATEGORIES;
  });

  const [stations] = useState<Station[]>(STATIONS);
  const [lines] = useState<TransitLine[]>(TRANSIT_LINES);
  const [hierarchy] = useState(TRANSIT_HIERARCHY);
  const [activeCity, setActiveCity] = useState('stockholm');
  const [isConnected, setIsConnected] = useState(true);
  const [isStandaloneMode, setIsStandaloneMode] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'map' | 'feed' | 'favorites' | 'stats' | 'profile' | 'admin'>('map');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [preselectedStationId, setPreselectedStationId] = useState<string | null>(null);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'terms' | 'privacy' | 'guidelines'>('terms');
  const [selectedReportForDetail, setSelectedReportForDetail] = useState<Report | null>(null);
  const [toastMessage, setToastMessage] = useState<{ title: string; body: string; type?: 'info' | 'alert' | 'success' | 'error' } | null>(null);

  // Auto-sync reports to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(reports));
    } catch (e) {
      console.warn('Failed saving reports to localStorage', e);
    }
  }, [reports]);

  // Auto-sync categories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
    } catch {}
  }, [categories]);

  // Cross-tab real-time sync with BroadcastChannel
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    try {
      const bc = new BroadcastChannel('kollektivalert_realtime_sync');
      bc.onmessage = (event) => {
        if (!event.data) return;
        const { type, payload } = event.data;
        if (type === 'NEW_REPORT') {
          setReports((prev) => {
            if (prev.some((r) => r.id === payload.id)) return prev;
            return [payload, ...prev];
          });
        } else if (type === 'UPDATE_REPORT') {
          setReports((prev) => prev.map((r) => (r.id === payload.id ? payload : r)));
        } else if (type === 'DELETE_REPORT') {
          setReports((prev) => prev.filter((r) => r.id !== payload));
        } else if (type === 'SET_REPORTS') {
          setReports(payload);
        } else if (type === 'SET_CATEGORIES') {
          setCategories(payload);
        }
      };
      return () => {
        bc.close();
      };
    } catch {}
  }, []);

  // Periodic expiration checker for client-side autonomous mode (every 20s)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setReports((prev) => {
        let changed = false;
        const updated = prev.map((rep) => {
          if (rep.status === 'aktiv' && new Date(rep.expiresAt).getTime() <= now) {
            changed = true;
            return { ...rep, status: 'utgangen' as const };
          }
          return rep;
        });
        return changed ? updated : prev;
      });
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // Helper translation lookup
  const t = (key: keyof typeof TRANSLATIONS.sv): string => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.sv[key] || String(key);
  };

  // Switch role helper
  const switchUserRole = (role: 'user' | 'moderator' | 'admin') => {
    setCurrentUser((prev) => ({
      ...prev,
      role,
      username: role === 'admin' ? 'SL-Admin (Moderator)' : 'SthlmResenär',
      reputation: role === 'admin' ? 500 : 85,
      reputationTitle: role === 'admin' ? 'Systemadministratör' : getReputationTier(85)
    }));
  };

  // Connect to SSE stream for real-time live events
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/events');
      
      eventSource.addEventListener('initial_sync', (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.reports) setReports(data.reports);
          if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
            const hasValidSubs = data.categories.some((c: any) => c && c.subcategories && c.subcategories.length > 0);
            if (hasValidSubs) {
              setCategories(data.categories);
            }
          }
          setIsConnected(true);
        } catch (err) {
          console.warn('Failed parsing initial_sync', err);
        }
      });

      eventSource.addEventListener('new_report', (e) => {
        try {
          const newRep: Report = JSON.parse(e.data);
          setReports((prev) => {
            if (prev.some((r) => r.id === newRep.id)) return prev;
            return [newRep, ...prev];
          });
          
          // Check if matches user favorite
          if (
            currentUser.favoriteStations.includes(newRep.location.stationId || '') ||
            currentUser.favoriteLines.includes(newRep.location.lineId || '')
          ) {
            setToastMessage({
              title: `🚨 Ny incident vid ${newRep.location.stationName || newRep.location.lineName}`,
              body: `${newRep.subcategoryName}: ${newRep.comment || 'Observerad händelse.'}`,
              type: 'alert'
            });
          }
        } catch (err) {
          console.warn('Failed parsing new_report event', err);
        }
      });

      eventSource.addEventListener('report_updated', (e) => {
        try {
          const updatedRep: Report = JSON.parse(e.data);
          setReports((prev) => prev.map((r) => (r.id === updatedRep.id ? updatedRep : r)));
        } catch (err) {
          console.warn('Failed parsing report_updated event', err);
        }
      });

      eventSource.addEventListener('reports_updated', (e) => {
        try {
          const updatedList: Report[] = JSON.parse(e.data);
          setReports(updatedList);
        } catch (err) {
          console.warn('Failed parsing reports_updated event', err);
        }
      });

      eventSource.addEventListener('report_deleted', (e) => {
        try {
          const { id } = JSON.parse(e.data);
          setReports((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
          console.warn('Failed parsing report_deleted event', err);
        }
      });

      eventSource.addEventListener('categories_updated', (e) => {
        try {
          const updatedCats: CategoryDefinition[] = JSON.parse(e.data);
          setCategories(updatedCats);
        } catch (err) {
          console.warn('Failed parsing categories_updated', err);
        }
      });

      eventSource.onerror = () => {
        // In standalone or GitHub Pages environment, SSE will fail: activate standalone mode
        setIsConnected(true);
        setIsStandaloneMode(true);
      };
      eventSource.onopen = () => {
        setIsConnected(true);
        setIsStandaloneMode(false);
      };
    } catch {
      setIsConnected(true);
      setIsStandaloneMode(true);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [currentUser.favoriteStations, currentUser.favoriteLines]);

  // Create report with instant local state + optional backend sync
  const createReport = async (reportData: Partial<Report>): Promise<Report> => {
    const fallbackReport: Report = {
      id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: currentUser.id,
      username: currentUser.username,
      userReputation: currentUser.reputation,
      category: reportData.category || 'drift',
      subcategoryId: reportData.subcategoryId || 'forsening',
      subcategoryName: reportData.subcategoryName || 'Incident',
      severity: reportData.severity || 'medium',
      location: reportData.location!,
      comment: reportData.comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      status: 'aktiv',
      confidence: 'ej_verifierad',
      confidenceScore: 40,
      confirmationsCount: 1,
      rejectionsCount: 0,
      confirmations: [
        {
          id: `conf_${Date.now()}`,
          reportId: `rep_${Date.now()}`,
          userId: currentUser.id,
          username: currentUser.username,
          type: 'confirm',
          createdAt: new Date().toISOString(),
          userReputation: currentUser.reputation
        }
      ],
      flags: [],
      flaggedCount: 0,
      isDemo: false
    };

    const { score, level } = calculateConfidence(fallbackReport);
    fallbackReport.confidenceScore = score;
    fallbackReport.confidence = level;

    // Immediately update local state & broadcast to other tabs
    setReports((prev) => [fallbackReport, ...prev]);
    broadcastSync('NEW_REPORT', fallbackReport);

    setCurrentUser((prev) => {
      const newRep = prev.reputation + 15;
      return {
        ...prev,
        reputation: newRep,
        reputationTitle: getReputationTier(newRep),
        reportsCount: prev.reportsCount + 1
      };
    });

    setToastMessage({
      title: '✅ Rapport publicerad',
      body: 'Din incidentrapport är nu synlig för alla pendlare i realtid.',
      type: 'success'
    });

    // If backend is active, try to sync
    if (!isStandaloneMode) {
      try {
        const payload = {
          ...reportData,
          userId: currentUser.id,
          username: currentUser.username,
          userReputation: currentUser.reputation
        };
        const res = await fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const created: Report = await res.json();
          setReports((prev) => prev.map((r) => (r.id === fallbackReport.id ? created : r)));
          broadcastSync('UPDATE_REPORT', created);
          return created;
        }
      } catch (err) {
        console.warn('Backend sync failed, saved locally', err);
      }
    }

    return fallbackReport;
  };

  // Confirm / Reject with local calculation and backend sync
  const confirmReport = async (reportId: string, type: 'confirm' | 'reject') => {
    let updatedReport: Report | null = null;

    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          if (r.confirmations.some((c) => c.userId === currentUser.id)) return r;
          const updatedConf = [
            ...r.confirmations,
            {
              id: `conf_${Date.now()}`,
              reportId: r.id,
              userId: currentUser.id,
              username: currentUser.username,
              type,
              createdAt: new Date().toISOString(),
              userReputation: currentUser.reputation
            }
          ];
          const newConfCount = type === 'confirm' ? r.confirmationsCount + 1 : r.confirmationsCount;
          const newRejCount = type === 'reject' ? r.rejectionsCount + 1 : r.rejectionsCount;
          const repToUpdate = {
            ...r,
            confirmations: updatedConf,
            confirmationsCount: newConfCount,
            rejectionsCount: newRejCount,
            status: newRejCount >= 4 ? ('lost' as const) : r.status
          };
          const { score, level } = calculateConfidence(repToUpdate);
          repToUpdate.confidenceScore = score;
          repToUpdate.confidence = level;
          updatedReport = repToUpdate;
          return repToUpdate;
        }
        return r;
      })
    );

    if (updatedReport) {
      broadcastSync('UPDATE_REPORT', updatedReport);
    }

    setCurrentUser((prev) => {
      const newRep = prev.reputation + 5;
      return {
        ...prev,
        reputation: newRep,
        reputationTitle: getReputationTier(newRep),
        confirmationsCount: prev.confirmationsCount + 1
      };
    });

    setToastMessage({
      title: type === 'confirm' ? '🟢 Bekräftelse registrerad' : '🔴 Avvisning registrerad',
      body: 'Tack för att du hjälper till att hålla informationen aktuell.',
      type: 'info'
    });

    if (!isStandaloneMode) {
      try {
        await fetch(`/api/reports/${reportId}/confirm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser.id,
            username: currentUser.username,
            type,
            userReputation: currentUser.reputation
          })
        });
      } catch (err) {
        console.warn('Backend sync failed, saved locally', err);
      }
    }
  };

  // Flag Report
  const flagReport = async (reportId: string, reason: 'spam' | 'falsk_info' | 'olampligt' | 'annat', comment?: string) => {
    let updatedReport: Report | null = null;
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const flags = [
            ...r.flags,
            {
              id: `flag_${Date.now()}`,
              reportId: r.id,
              userId: currentUser.id,
              reason,
              createdAt: new Date().toISOString(),
              comment
            }
          ];
          const rep = {
            ...r,
            flags,
            flaggedCount: flags.length,
            status: flags.length >= 3 ? ('avvisad' as const) : r.status
          };
          updatedReport = rep;
          return rep;
        }
        return r;
      })
    );

    if (updatedReport) {
      broadcastSync('UPDATE_REPORT', updatedReport);
    }

    setToastMessage({
      title: '⚠️ Rapporten anmäld',
      body: 'Tack! Vårt granskningsteam har mottagit anmälan.',
      type: 'info'
    });

    if (!isStandaloneMode) {
      try {
        await fetch(`/api/reports/${reportId}/flag`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser.id,
            reason,
            comment
          })
        });
      } catch {}
    }
  };

  // Update Status
  const updateReportStatus = async (reportId: string, status: Report['status']) => {
    setReports((prev) => {
      const updated = prev.map((r) => (r.id === reportId ? { ...r, status } : r));
      const target = updated.find((r) => r.id === reportId);
      if (target) broadcastSync('UPDATE_REPORT', target);
      return updated;
    });

    if (!isStandaloneMode) {
      try {
        await fetch(`/api/reports/${reportId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
      } catch {}
    }
  };

  // Delete Report
  const deleteReport = async (reportId: string) => {
    setReports((prev) => prev.filter((r) => r.id !== reportId));
    broadcastSync('DELETE_REPORT', reportId);
    setToastMessage({
      title: '🗑️ Rapport raderad',
      body: 'Rapporten har tagits bort från systemet.',
      type: 'info'
    });

    if (!isStandaloneMode) {
      try {
        await fetch(`/api/reports/${reportId}`, { method: 'DELETE' });
      } catch {}
    }
  };

  // Save Category
  const saveCategory = async (category: CategoryDefinition) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === category.id);
      const updated = exists ? prev.map((c) => (c.id === category.id ? category : c)) : [...prev, category];
      broadcastSync('SET_CATEGORIES', updated);
      return updated;
    });

    if (!isStandaloneMode) {
      try {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(category)
        });
        if (res.ok) {
          const updatedCats = await res.json();
          setCategories(updatedCats);
        }
      } catch {}
    }
  };

  // Standalone / GitHub Pages Utilities
  const clearAllReports = () => {
    setReports([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_REPORTS_KEY);
    } catch {}
    broadcastSync('SET_REPORTS', []);
    setToastMessage({
      title: '🧹 Databas rensad',
      body: 'Alla rapporter har rensats. Redo för skarp drift.',
      type: 'success'
    });
  };

  const resetDemoReports = () => {
    const fresh = getFreshDemoReports();
    setReports(fresh);
    broadcastSync('SET_REPORTS', fresh);
    setToastMessage({
      title: '🔄 Demodata återställd',
      body: 'Färska exempelincidenter för Stockholms kollektivtrafik har laddats in.',
      type: 'info'
    });
  };

  const importReports = (newReports: Report[]) => {
    if (!Array.isArray(newReports)) return;
    setReports(newReports);
    broadcastSync('SET_REPORTS', newReports);
    setToastMessage({
      title: '📥 Data importerad',
      body: `${newReports.length} rapporter har lästs in i systemet.`,
      type: 'success'
    });
  };

  const exportDatabase = () => {
    const payload = {
      system: 'KollektivAlert Stockholm',
      version: '3.0',
      exportedAt: new Date().toISOString(),
      reportCount: reports.length,
      categories,
      reports
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kollektivalert_stockholm_db_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToastMessage({
      title: '💾 Databas exporterad',
      body: 'Hela händelsedatabasen har laddats ned som JSON.',
      type: 'success'
    });
  };

  const simulateIncident = () => {
    const randomStation = stations[Math.floor(Math.random() * stations.length)];
    const primaryLineId = randomStation.lineIds[0] || 'tb_green_17';
    const foundLine = lines.find((l) => l.id === primaryLineId);
    const transportType = randomStation.transportTypes[0] || 'tunnelbana';

    const simRep: Report = {
      id: `rep_sim_${Date.now()}`,
      userId: 'usr_community_sim',
      username: 'Pendlare_Sthlm',
      userReputation: 90,
      category: 'drift',
      subcategoryId: 'forsening',
      subcategoryName: 'Försening / Inställd avgång',
      severity: 'medium',
      location: {
        transportType,
        operator: 'SL',
        city: 'Stockholm',
        country: 'Sverige',
        lineId: primaryLineId,
        lineName: foundLine?.name || 'Grön linje',
        lineColor: foundLine?.color || '#10B981',
        locationType: 'station',
        stationId: randomStation.id,
        stationName: randomStation.name,
        stationArea: 'perrong'
      },
      comment: `Simulerad händelse: Försening ca 10 min pga växelfel vid ${randomStation.name}.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      status: 'aktiv',
      confidence: 'ej_verifierad',
      confidenceScore: 45,
      confirmationsCount: 1,
      rejectionsCount: 0,
      confirmations: [],
      flags: [],
      flaggedCount: 0,
      isDemo: true
    };
    setReports((prev) => [simRep, ...prev]);
    broadcastSync('NEW_REPORT', simRep);
    setToastMessage({
      title: `⚡ Ny händelse vid ${randomStation.name}`,
      body: simRep.comment || '',
      type: 'alert'
    });
  };

  // Favorites
  const toggleFavoriteStation = (stationId: string) => {
    setCurrentUser((prev) => {
      const exists = prev.favoriteStations.includes(stationId);
      const updated = exists
        ? prev.favoriteStations.filter((s) => s !== stationId)
        : [...prev.favoriteStations, stationId];
      return { ...prev, favoriteStations: updated };
    });
  };

  const toggleFavoriteLine = (lineId: string) => {
    setCurrentUser((prev) => {
      const exists = prev.favoriteLines.includes(lineId);
      const updated = exists
        ? prev.favoriteLines.filter((l) => l !== lineId)
        : [...prev.favoriteLines, lineId];
      return { ...prev, favoriteLines: updated };
    });
  };

  const isStationFavorite = (stationId: string) => currentUser.favoriteStations.includes(stationId);
  const isLineFavorite = (lineId: string) => currentUser.favoriteLines.includes(lineId);

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        currentUser,
        setCurrentUser,
        switchUserRole,
        reports,
        categories,
        stations,
        lines,
        hierarchy,
        isConnected,
        isStandaloneMode,
        activeCity,
        setActiveCity,
        activeTab,
        setActiveTab,
        isReportModalOpen,
        setIsReportModalOpen,
        preselectedStationId,
        setPreselectedStationId,
        isLegalModalOpen,
        setIsLegalModalOpen,
        legalModalTab,
        setLegalModalTab,
        selectedReportForDetail,
        setSelectedReportForDetail,
        toastMessage,
        setToastMessage,
        createReport,
        confirmReport,
        flagReport,
        updateReportStatus,
        deleteReport,
        saveCategory,
        toggleFavoriteStation,
        toggleFavoriteLine,
        isStationFavorite,
        isLineFavorite,
        clearAllReports,
        resetDemoReports,
        importReports,
        exportDatabase,
        simulateIncident
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
