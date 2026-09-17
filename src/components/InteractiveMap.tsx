import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  MapPin, 
  Star, 
  PlusCircle, 
  Search,
  CheckCircle2,
  X,
  Navigation,
  Compass,
  Layers,
  SlidersHorizontal,
  Info,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Crosshair,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Station } from '../types';
import { getLocalizedText } from '../utils/confidence';
import { ReportCard } from './ReportCard';
import { GeographicMap } from './map/GeographicMap';

// Region presets for quick 1-click navigation
const REGIONS = [
  { id: 'city', name: '🎯 T-Centralen / City', zoom: 1.6, x: -70, y: 70, stationId: 't_centralen' },
  { id: 'norro', name: '🔵 Norrort (Solna/Kista)', zoom: 1.45, x: 120, y: 280, stationId: 'solna_station' },
  { id: 'vaster', name: '🟢 Västerort (Bromma)', zoom: 1.4, x: 300, y: 120, stationId: 'alvik' },
  { id: 'soder', name: '🔴 Söder & Liljeholmen', zoom: 1.5, x: -30, y: -120, stationId: 'slussen' },
  { id: 'lidingo', name: '🟡 Lidingö (L21)', zoom: 1.45, x: -500, y: 170, stationId: 'ropsten' },
  { id: 'nacka', name: '🟣 Nacka & Hammarby', zoom: 1.5, x: -300, y: -160, stationId: 'sickla' },
  { id: 'overview', name: '🗺️ Hela Regionen', zoom: 1.0, x: 0, y: 0, stationId: 't_centralen' }
];

export const InteractiveMap: React.FC = () => {
  const { 
    stations, 
    lines, 
    reports, 
    categories, 
    lang, 
    t,
    isStationFavorite, 
    toggleFavoriteStation,
    setIsReportModalOpen,
    setPreselectedStationId
  } = useApp();

  // Mode: Geographic (Real Leaflet map) vs Schematic (SL subway network diagram)
  const [viewMode, setViewMode] = useState<'geographic' | 'schematic'>('geographic');

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width: 1200,
    height: 800
  });

  // Track container dimensions with ResizeObserver so the SVG is 100% full-bleed
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setContainerSize({ width, height });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Zoom and Pan state (centered on network origin 575, 550)
  const [zoom, setZoom] = useState<number>(1.25);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Touch gesture pinch-to-zoom tracking
  const touchStateRef = useRef<{
    initialDistance: number;
    initialZoom: number;
    initialPan: { x: number; y: number };
    startTouchCenter: { x: number; y: number };
  } | null>(null);

  // Label density mode: 'smart' (LOD adaptive: key hubs at overview, all at zoom/focus), 'all' (always all), 'none' (clean dots)
  const [labelMode, setLabelMode] = useState<'smart' | 'all' | 'none'>('smart');

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLineGroup, setSelectedLineGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeStationDetail, setActiveStationDetail] = useState<Station | null>(null);
  const [hoveredStation, setHoveredStation] = useState<Station | null>(null);

  // Active reports filter
  const activeReports = useMemo(() => {
    return reports.filter((r) => {
      if (r.status !== 'aktiv') return false;
      if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
      return true;
    });
  }, [reports, selectedCategory]);

  // Station incident counts map
  const stationIncidentCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const rep of activeReports) {
      if (rep.location.stationId) {
        map[rep.location.stationId] = (map[rep.location.stationId] || 0) + 1;
      }
      if (rep.location.fromStationId) {
        map[rep.location.fromStationId] = (map[rep.location.fromStationId] || 0) + 1;
      }
      if (rep.location.toStationId) {
        map[rep.location.toStationId] = (map[rep.location.toStationId] || 0) + 1;
      }
    }
    return map;
  }, [activeReports]);

  // Filtered stations based on search query
  const searchMatchedStations = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return stations.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [stations, searchQuery]);

  // Major hubs list for prominent level-of-detail rendering
  const majorHubIds = useMemo(() => new Set([
    't_centralen', 'stockholm_city', 'slussen', 'odenplan', 'fridhemsplan',
    'gullmarsplan', 'liljeholmen', 'alvik', 'solna_station', 'sundbyberg_c',
    'ropsten', 'tekniska_hogskolan', 'arstaberg', 'alvsjo', 'sickla',
    'gamla_stan', 'ostermalmstorg', 'kista', 'morby_c', 'farsta_strand',
    'skarpnack', 'hasselby_strand', 'akalla', 'hjulsta', 'norsborg', 'fruangen'
  ]), []);

  // Smooth focus on station
  const focusStation = useCallback((st: Station, customZoom = 1.7) => {
    setActiveStationDetail(st);
    setZoom(customZoom);
    // World coordinates: center is (575, 550)
    // Offset pan so st.coordinates.svgX / svgY is in center of viewport
    const offsetX = (575 - st.coordinates.svgX) * customZoom;
    const offsetY = (550 - st.coordinates.svgY) * customZoom;
    setPan({ x: offsetX, y: offsetY });
  }, []);

  // Fly to region preset
  const jumpToRegion = (region: typeof REGIONS[0]) => {
    setZoom(region.zoom);
    setPan({ x: region.x * region.zoom, y: region.y * region.zoom });
    if (region.stationId) {
      const st = stations.find((s) => s.id === region.stationId);
      if (st) {
        setActiveStationDetail(st);
      }
    }
  };

  // Auto-fit whole network to screen
  const fitToScreen = useCallback(() => {
    const scaleFactor = Math.min(
      containerSize.width / 1100,
      containerSize.height / 1000
    ) * 1.15;
    setZoom(Number(Math.max(0.75, Math.min(scaleFactor, 1.6)).toFixed(2)));
    setPan({ x: 0, y: 0 });
  }, [containerSize]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Wheel zoom handler: Zoom at pointer location
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left - containerSize.width / 2;
    const mouseY = e.clientY - rect.top - containerSize.height / 2;

    const zoomFactor = e.deltaY < 0 ? 1.14 : 0.88;
    setZoom((prevZoom) => {
      const nextZoom = Math.min(Math.max(prevZoom * zoomFactor, 0.45), 3.5);
      const zoomRatio = nextZoom / prevZoom;

      setPan((prevPan) => ({
        x: mouseX - (mouseX - prevPan.x) * zoomRatio,
        y: mouseY - (mouseY - prevPan.y) * zoomRatio
      }));

      return Number(nextZoom.toFixed(3));
    });
  };

  // Touch Handlers for 1-finger pan and 2-finger pinch zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;

      touchStateRef.current = {
        initialDistance: distance,
        initialZoom: zoom,
        initialPan: { ...pan },
        startTouchCenter: { x: centerX, y: centerY }
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      setPan({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y });
    } else if (e.touches.length === 2 && touchStateRef.current) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      const scale = currentDistance / touchStateRef.current.initialDistance;
      
      const newZoom = Math.min(Math.max(touchStateRef.current.initialZoom * scale, 0.45), 3.5);
      setZoom(Number(newZoom.toFixed(3)));

      const currentCenterX = (touch1.clientX + touch2.clientX) / 2;
      const currentCenterY = (touch1.clientY + touch2.clientY) / 2;
      const dx = currentCenterX - touchStateRef.current.startTouchCenter.x;
      const dy = currentCenterY - touchStateRef.current.startTouchCenter.y;

      setPan({
        x: touchStateRef.current.initialPan.x + dx,
        y: touchStateRef.current.initialPan.y + dy
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStateRef.current = null;
  };

  // Double click to zoom in at point
  const handleDoubleClick = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = e.clientX - rect.left - containerSize.width / 2;
    const mouseY = e.clientY - rect.top - containerSize.height / 2;
    setZoom((prevZoom) => {
      const nextZoom = Math.min(prevZoom * 1.35, 3.5);
      const zoomRatio = nextZoom / prevZoom;
      setPan((prevPan) => ({
        x: mouseX - (mouseX - prevPan.x) * zoomRatio,
        y: mouseY - (mouseY - prevPan.y) * zoomRatio
      }));
      return Number(nextZoom.toFixed(3));
    });
  };

  // Open report modal pre-filled with this station
  const handleReportHere = (station: Station) => {
    setPreselectedStationId(station.id);
    setIsReportModalOpen(true);
  };

  // Decide if a station's label should be rendered based on zoom, importance and selection
  const shouldRenderLabel = (st: Station, isMajor: boolean, hasIncidents: boolean, isSelectedOrHovered: boolean) => {
    if (labelMode === 'none') return isSelectedOrHovered || hasIncidents;
    if (labelMode === 'all') return true;
    
    // 'smart' harmonious mode:
    // 1. Always show selected station, hovered station, or station with active incident
    if (isSelectedOrHovered || hasIncidents) return true;
    
    // 2. If filtering by a specific line, show all stations on that line
    if (selectedLineGroup !== 'all' && isStationInLineGroup(st)) return true;
    
    // 3. At low zoom (< 1.15), only display major hubs so map breathes and doesn't clutter
    if (zoom < 1.15) {
      return isMajor;
    }
    
    // 4. At medium zoom (1.15 - 1.5), display all major hubs and key transfer stations
    if (zoom < 1.5) {
      return isMajor || st.lineIds.length > 1 || st.transportTypes.length > 1;
    }
    
    // 5. At high zoom (>= 1.5), show all station names cleanly with ample room
    return true;
  };

  // Helper to check if a station belongs to active line filter
  const isStationInLineGroup = useCallback((st: Station) => {
    if (selectedLineGroup === 'all') return true;
    if (selectedLineGroup === 'tb_green') return st.lineIds.some((l) => l.startsWith('tb_green'));
    if (selectedLineGroup === 'tb_red') return st.lineIds.some((l) => l.startsWith('tb_red'));
    if (selectedLineGroup === 'tb_blue') return st.lineIds.some((l) => l.startsWith('tb_blue'));
    if (selectedLineGroup === 'pendel') return st.lineIds.some((l) => l.startsWith('pendel'));
    if (selectedLineGroup === 'tram_local') return st.lineIds.some((l) => 
      l.startsWith('tvarbanan') || l.startsWith('roslag') || l.startsWith('saltsjo') || l.startsWith('lidingo') || l.startsWith('nockeby') || l.startsWith('bus')
    );
    return true;
  }, [selectedLineGroup]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full bg-[#020617] overflow-hidden select-none flex flex-col touch-none transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen' : 'h-[calc(100vh-100px)] min-h-[580px]'
      }`}
    >
      {/* Top Header Floating Search & Line Switcher */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-col gap-2 max-w-2xl mx-auto pointer-events-auto">
        {/* Search Bar & Quick Toggles */}
        <div className="flex items-center gap-2 bg-slate-900/95 backdrop-blur-md p-1.5 px-3 rounded-2xl border border-slate-800 shadow-2xl">
          <Search className="w-4 h-4 text-emerald-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Sök station, bytespunkt eller linje (t.ex. Odenplan, T14, Tvärbanan)..."
            className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-400 outline-none font-medium py-1"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="h-4 w-px bg-slate-800 mx-1 shrink-0" />

          {/* Quick Create Report Button */}
          <button
            onClick={() => {
              setPreselectedStationId(null);
              setIsReportModalOpen(true);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-extrabold shadow-sm active:scale-95 transition-all shrink-0"
            title="Rapportera incident eller kontroll"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rapportera</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-0.5 shrink-0" />

          {/* Map Presentation Mode Switcher */}
          <div className="flex items-center bg-slate-950/90 p-0.5 rounded-xl border border-slate-800 shrink-0 text-[11px] font-bold">
            <button
              onClick={() => setViewMode('geographic')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'geographic'
                  ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={lang === 'es' ? 'Mapa Geográfico Real de Estocolmo' : 'Geografisk karta'}
            >
              <span>🌍</span>
              <span className="hidden sm:inline">{lang === 'es' ? 'Mapa Real' : 'Karta'}</span>
            </button>
            <button
              onClick={() => setViewMode('schematic')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'schematic'
                  ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={lang === 'es' ? 'Diagrama de Red SL' : 'SL Linjeschema'}
            >
              <span>🚇</span>
              <span className="hidden sm:inline">{lang === 'es' ? 'Esquema' : 'Diagram'}</span>
            </button>
          </div>
        </div>

        {/* Quick Search Suggestions Dropdown */}
        {searchMatchedStations.length > 0 && (
          <div className="bg-slate-900/98 backdrop-blur-lg border border-slate-800 rounded-2xl shadow-2xl p-2 max-h-56 overflow-y-auto space-y-1 divide-y divide-slate-800/50">
            {searchMatchedStations.map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  focusStation(st, 1.7);
                  setSearchQuery('');
                }}
                className="w-full text-left p-2 hover:bg-slate-800/80 rounded-xl flex items-center justify-between text-xs text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">{st.name}</span>
                    <span className="text-[10px] text-slate-400">Zon {st.zone} • {st.entrances.length} uppgångar</span>
                  </div>
                </div>
                {stationIncidentCounts[st.id] ? (
                  <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full border border-red-500/30 font-bold animate-pulse">
                    {stationIncidentCounts[st.id]} incident(er)
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-medium">Normal drift</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Line Groups Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-[11px] font-bold">
          <button
            onClick={() => setSelectedLineGroup('all')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all shadow-sm ${
              selectedLineGroup === 'all'
                ? 'bg-slate-100 text-slate-950 font-extrabold'
                : 'bg-slate-900/90 backdrop-blur-md text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            Hela SL-Nätet
          </button>
          <button
            onClick={() => setSelectedLineGroup('tb_green')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all shadow-sm ${
              selectedLineGroup === 'tb_green'
                ? 'bg-emerald-500 text-white font-extrabold shadow-emerald-900/40 shadow-md'
                : 'bg-slate-900/90 backdrop-blur-md text-emerald-400 hover:text-white border border-slate-800'
            }`}
          >
            Grön (T17–19)
          </button>
          <button
            onClick={() => setSelectedLineGroup('tb_red')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all shadow-sm ${
              selectedLineGroup === 'tb_red'
                ? 'bg-rose-600 text-white font-extrabold shadow-rose-900/40 shadow-md'
                : 'bg-slate-900/90 backdrop-blur-md text-rose-400 hover:text-white border border-slate-800'
            }`}
          >
            Röd (T13–14)
          </button>
          <button
            onClick={() => setSelectedLineGroup('tb_blue')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all shadow-sm ${
              selectedLineGroup === 'tb_blue'
                ? 'bg-blue-600 text-white font-extrabold shadow-blue-900/40 shadow-md'
                : 'bg-slate-900/90 backdrop-blur-md text-blue-400 hover:text-white border border-slate-800'
            }`}
          >
            Blå (T10–11)
          </button>
          <button
            onClick={() => setSelectedLineGroup('pendel')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all shadow-sm ${
              selectedLineGroup === 'pendel'
                ? 'bg-pink-500 text-white font-extrabold shadow-pink-900/40 shadow-md'
                : 'bg-slate-900/90 backdrop-blur-md text-pink-400 hover:text-white border border-slate-800'
            }`}
          >
            Pendeltåg (J40–43)
          </button>
          <button
            onClick={() => setSelectedLineGroup('tram_local')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all shadow-sm ${
              selectedLineGroup === 'tram_local'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-amber-900/40 shadow-md'
                : 'bg-slate-900/90 backdrop-blur-md text-amber-400 hover:text-white border border-slate-800'
            }`}
          >
            Tvärbanan / Lokalbanor
          </button>
        </div>

        {/* Visually Clear Report Options & Incident Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {lang === 'es' ? 'Todas las incidencias' : 'Alla incidenter'} ({reports.filter((r) => r.status === 'aktiv').length})
          </button>
          {categories.map((cat) => {
            const count = reports.filter((r) => r.status === 'aktiv' && r.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'text-white shadow-md ring-2 ring-white/50 scale-105'
                    : 'bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-750'
                }`}
                style={
                  isSelected
                    ? { backgroundColor: cat.color }
                    : undefined
                }
              >
                <span 
                  className="w-2 h-2 rounded-full inline-block" 
                  style={{ backgroundColor: cat.color }} 
                />
                <span>{getLocalizedText(cat.name, lang, cat.id)}</span>
                {count > 0 && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-black/40 text-white' : 'bg-slate-700 text-slate-200'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Category Active Reports Floating Bar */}
        {selectedCategory !== 'all' && (
          <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-800 p-2.5 shadow-2xl space-y-2 animate-in slide-in-from-top-2 duration-150 max-h-48 overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between text-xs font-bold px-1">
              <span className="text-white flex items-center gap-1.5">
                <span 
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: categories.find((c) => c.id === selectedCategory)?.color }}
                />
                <span>{getLocalizedText(categories.find((c) => c.id === selectedCategory)?.name, lang, selectedCategory)}</span>
                <span className="text-slate-400 font-normal">({activeReports.length} {lang === 'es' ? 'activas' : lang === 'en' ? 'active' : 'aktiva'})</span>
              </span>
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-[10px] text-slate-400 hover:text-white hover:underline"
              >
                {lang === 'es' ? 'Limpiar filtro' : lang === 'en' ? 'Clear filter' : 'Rensa filter'}
              </button>
            </div>

            {activeReports.length > 0 ? (
              <div className="space-y-1.5">
                {activeReports.map((rep) => {
                  const targetStation = stations.find((s) => s.id === rep.location.stationId || s.id === rep.location.fromStationId);
                  return (
                    <div
                      key={rep.id}
                      onClick={() => {
                        if (targetStation) {
                          focusStation(targetStation, 1.8);
                        }
                      }}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/60 cursor-pointer text-xs transition-colors group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div 
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: rep.location.lineColor || '#10B981' }}
                        />
                        <div className="truncate">
                          <span className="font-bold text-white group-hover:text-emerald-300">
                            {rep.location.stationName || rep.location.fromStationName || 'Station'}
                          </span>
                          <span className="text-slate-400 text-[11px] ml-1.5">
                            · {rep.subcategoryName}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold shrink-0 ml-2">
                        Visa på karta →
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-slate-400 p-2 text-center">
                {lang === 'es' 
                  ? 'No hay incidencias activas en esta categoría en este momento.' 
                  : lang === 'en'
                  ? 'No active reports in this category right now.'
                  : 'Inga aktiva rapporter i denna kategori just nu.'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Jump Region Bar (Bottom Center) */}
      <div className="absolute bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-full border border-slate-800 shadow-2xl pointer-events-auto max-w-[95vw] overflow-x-auto no-scrollbar">
        {REGIONS.map((reg) => (
          <button
            key={reg.id}
            onClick={() => jumpToRegion(reg)}
            className="px-3 py-1 rounded-full text-[11px] font-bold text-slate-300 hover:text-white hover:bg-slate-800 whitespace-nowrap transition-all active:scale-95"
          >
            {reg.name}
          </button>
        ))}
      </div>

      {/* Main Map Presentation: Geographic (Real OpenStreetMap Leaflet) or Schematic (SL SVG Network Diagram) */}
      {viewMode === 'geographic' ? (
        <GeographicMap
          stations={stations}
          lines={lines}
          reports={reports}
          selectedCategory={selectedCategory}
          selectedLineGroup={selectedLineGroup}
          activeStation={activeStationDetail}
          onSelectStation={(st) => setActiveStationDetail(st)}
          onReportHere={handleReportHere}
          lang={lang}
        />
      ) : (
        <>
          {/* Floating Zoom & Map Tool Controls (Right side) */}
      <div className="absolute right-3.5 bottom-28 sm:bottom-24 z-20 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={() => {
            setZoom((z) => {
              const next = Math.min(Number((z + 0.25).toFixed(2)), 3.5);
              return next;
            });
          }}
          className="w-10 h-10 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 flex items-center justify-center shadow-2xl transition-all active:scale-90"
          title="Zooma in (+)"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Zoom Level Indicator */}
        <div className="text-[10px] font-extrabold text-slate-400 text-center py-0.5 bg-slate-900/80 rounded-lg border border-slate-800">
          {Math.round(zoom * 100)}%
        </div>

        <button
          onClick={() => {
            setZoom((z) => {
              const next = Math.max(Number((z - 0.25).toFixed(2)), 0.45);
              return next;
            });
          }}
          className="w-10 h-10 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 flex items-center justify-center shadow-2xl transition-all active:scale-90"
          title="Zooma ut (-)"
        >
          <Minus className="w-4 h-4" />
        </button>

        {/* Center on T-Centralen */}
        <button
          onClick={() => jumpToRegion(REGIONS[0])}
          className="w-10 h-10 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl transition-all text-[11px] font-black tracking-tighter active:scale-90"
          title="Centrera T-Centralen"
        >
          T-C
        </button>

        {/* Fit to screen */}
        <button
          onClick={fitToScreen}
          className="w-10 h-10 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center shadow-2xl transition-all active:scale-90"
          title="Passa till skärm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="w-10 h-10 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center shadow-2xl transition-all active:scale-90"
          title={isFullscreen ? 'Lämna helskärm' : 'Helskärmskarta'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Toggle Label Density */}
        <button
          onClick={() => {
            setLabelMode((prev) => (prev === 'smart' ? 'all' : prev === 'all' ? 'none' : 'smart'));
          }}
          className={`w-10 h-10 rounded-2xl border backdrop-blur-md flex items-center justify-center shadow-2xl transition-all active:scale-90 ${
            labelMode === 'all'
              ? 'bg-purple-600 text-white border-purple-500'
              : labelMode === 'smart'
              ? 'bg-slate-900/95 text-emerald-400 border-slate-800 hover:bg-slate-800'
              : 'bg-slate-900/95 text-slate-500 border-slate-800 hover:bg-slate-800'
          }`}
          title={`Etikettläge: ${labelMode === 'smart' ? 'Smart (Knutpunkter)' : labelMode === 'all' ? 'Alla namn' : 'Dolda namn'}`}
        >
          {labelMode === 'all' ? <Eye className="w-4 h-4" /> : labelMode === 'smart' ? <Sparkles className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>

      {/* Map Hint / Instruction Badge */}
      <div className="absolute top-24 left-3.5 z-10 pointer-events-none hidden md:flex items-center gap-2 bg-slate-900/70 backdrop-blur-sm border border-slate-800/80 px-3 py-1.5 rounded-xl text-[11px] text-slate-400">
        <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>
          {lang === 'es'
            ? 'Rueda/pellizco para hacer zoom • Arrastra para moverte • Pulsa en cualquier estación'
            : lang === 'en'
            ? 'Scroll/pinch to zoom • Drag to pan • Tap any station to view status'
            : 'Scrolla/nyp för att zooma • Dra för att panorera • Klicka på valfri station'}
        </span>
      </div>

      {/* Interactive Full-Bleed Map Canvas */}
      <div
        className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleClick}
      >
        <svg
          viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}
          className="w-full h-full block"
          style={{ willChange: 'transform' }}
        >
          <defs>
            {/* Station glowing halo */}
            <filter id="glowHalo" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Infinite Background Fill */}
          <rect width={containerSize.width} height={containerSize.height} fill="#020617" />

          {/* Dynamic Transform Group: Center of screen (width/2, height/2) + pan, scaled around network center (575, 550) */}
          <g
            id="map-world"
            transform={`translate(${containerSize.width / 2 + pan.x}, ${containerSize.height / 2 + pan.y}) scale(${zoom}) translate(-575, -550)`}
          >
            {/* Subtle Stockholm Waterways & Archipelago Background (Mälaren, Saltsjön, Riddarfjärden, Lilla Värtan) */}
            <g opacity="0.35" fill="#082f49" stroke="#0369a1" strokeWidth="0.5">
              {/* Lake Mälaren / Riddarfjärden / Strömmen */}
              <path d="M -200 490 Q 200 520, 480 500 T 700 550 T 950 560 T 1400 520 L 1400 620 Q 1000 640, 700 600 T 400 560 T -200 560 Z" />
              {/* Saltsjön & Lilla Värtan towards Lidingö & Nacka */}
              <path d="M 690 510 Q 820 470, 920 410 T 1200 370 L 1380 430 Q 1050 490, 850 540 Z" />
              {/* Brunnsviken & Edsviken / Norrort waterways */}
              <path d="M 680 180 Q 720 250, 700 320 T 640 370 L 610 350 Q 660 270, 640 200 Z" />
            </g>

            {/* Harmonious Canvas Grid */}
            <g stroke="#0f172a" strokeWidth="1" strokeDasharray="3,12" opacity="0.6">
              {[-600, -300, 0, 300, 575, 850, 1150, 1450, 1750].map((x) => (
                <line key={`gx-${x}`} x1={x} y1="-800" x2={x} y2="1900" />
              ))}
              {[-600, -300, 0, 275, 550, 825, 1100, 1400, 1700].map((y) => (
                <line key={`gy-${y}`} x1="-800" y1={y} x2="1950" y2={y} />
              ))}
            </g>

            {/* ======================================================== */}
            {/* --- TRANSIT LINE TRACES (Complete SL Topology) --- */}
            {/* ======================================================== */}

            {/* 1. GRÖN LINJE TRUNK & BRANCHES (#10B981) */}
            {(selectedLineGroup === 'all' || selectedLineGroup === 'tb_green') && (
              <g id="line-green" stroke="#10B981" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.95">
                {/* Western Trunk: Hässelby strand -> Gullmarsplan */}
                <path d="M 60 260 L 90 300 L 120 340 L 150 380 L 190 400 L 230 420 L 280 440 L 350 460 L 410 460 L 470 460 L 540 460 L 580 410 L 630 380 L 650 415 L 665 445 L 680 480 L 700 535 L 720 570 L 730 610 L 740 650 L 750 700" />
                
                {/* Branch 17: Gullmarsplan -> Skärmarbrink -> Skarpnäck */}
                <path d="M 750 700 L 790 730 L 840 750 L 880 770 L 910 800 L 940 835 L 970 870" />
                
                {/* Branch 18: Gullmarsplan -> Skärmarbrink -> Farsta strand */}
                <path d="M 790 730 L 790 770 L 790 805 L 790 840 L 790 875 L 790 910 L 790 945 L 790 980 L 790 1015" />
                
                {/* Branch 19: Gullmarsplan -> Globen -> Hagsätra */}
                <path d="M 750 700 L 720 745 L 710 780 L 700 815 L 690 850 L 675 885 L 660 920 L 645 955 L 630 990 L 615 1025" />
              </g>
            )}

            {/* 2. RÖD LINJE TRUNK & BRANCHES (#EF4444) */}
            {(selectedLineGroup === 'all' || selectedLineGroup === 'tb_red') && (
              <g id="line-red" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.95">
                {/* Branch 14 North: Mörby centrum -> Östermalmstorg */}
                <path d="M 760 80 L 760 130 L 760 180 L 760 240 L 760 320 L 760 380 L 740 440" />

                {/* Branch 13 North: Ropsten -> Östermalmstorg */}
                <path d="M 900 330 L 860 370 L 820 410 L 740 440" />

                {/* Central Shared Trunk: Östermalmstorg -> Liljeholmen */}
                <path d="M 740 440 L 680 480 L 700 535 L 720 570 L 670 575 L 620 575 L 570 575 L 510 600" />

                {/* Branch 14 South: Liljeholmen -> Fruängen */}
                <path d="M 510 600 L 470 640 L 440 675 L 410 710 L 380 745 L 350 780" />

                {/* Branch 13 South: Liljeholmen -> Norsborg */}
                <path d="M 510 600 L 460 615 L 420 625 L 380 635 L 340 645 L 300 655 L 260 670 L 220 690 L 180 715 L 150 745 L 130 780 L 110 815 L 90 850 L 70 885 L 50 920" />
              </g>
            )}

            {/* 3. BLÅ LINJE TRUNK & BRANCHES (#2563EB) */}
            {(selectedLineGroup === 'all' || selectedLineGroup === 'tb_blue') && (
              <g id="line-blue" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.95">
                {/* Kungsträdgården -> Västra skogen */}
                <path d="M 730 485 L 680 480 L 610 480 L 540 460 L 500 410 L 470 345" />

                {/* Branch 11: Västra skogen -> Akalla */}
                <path d="M 470 345 L 470 275 L 470 215 L 470 160 L 470 110 L 470 65 L 470 25" />

                {/* Branch 10: Västra skogen -> Hjulsta */}
                <path d="M 470 345 L 410 345 L 360 345 L 300 320 L 250 280 L 200 240 L 160 200 L 120 160 L 80 120" />
              </g>
            )}

            {/* 4. PENDELTÅG (#EC4899) */}
            {(selectedLineGroup === 'all' || selectedLineGroup === 'pendel') && (
              <g id="line-pendel" stroke="#EC4899" strokeWidth="5.5" strokeDasharray="8,4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.95">
                {/* North Line 40: Uppsala / Märsta / Arlanda -> Odenplan */}
                <path d="M 580 10 L 580 30 L 580 55 L 580 80 L 580 110 L 580 140 L 580 175 L 580 205 L 580 235 L 580 270 L 630 380" />

                {/* Northwest Line 43: Bålsta -> Bro -> Kungsängen -> Kallhäll -> Jakobsberg -> Barkarby -> Spånga -> Sundbyberg -> Odenplan */}
                <path d="M 110 40 L 135 75 L 160 110 L 190 150 L 220 190 L 245 230 L 270 270 L 300 320 L 630 380" />

                {/* City Tunnel & Trunk: Odenplan -> Älvsjö */}
                <path d="M 630 380 L 670 495 L 640 620 L 580 670 L 560 740" />

                {/* Southwest Branch 40: Älvsjö -> Södertälje C */}
                <path d="M 560 740 L 550 780 L 540 825 L 530 870 L 515 915 L 500 960 L 490 1000 L 480 1040 L 470 1075" />

                {/* Southeast Branch 43: Älvsjö -> Farsta strand -> Nynäshamn */}
                <path d="M 560 740 L 790 1015 L 620 880 L 630 960 L 640 1040" />
              </g>
            )}

            {/* 5. TVÄRBANAN (#F97316) */}
            {(selectedLineGroup === 'all' || selectedLineGroup === 'tram_local') && (
              <g id="line-tvarbanan" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.95">
                {/* Line 30: Solna station -> Sickla */}
                <path d="M 580 270 L 470 275 L 380 295 L 300 320 L 290 355 L 295 385 L 305 415 L 325 440 L 350 460 L 380 490 L 410 520 L 445 545 L 475 570 L 510 600 L 545 635 L 580 670 L 625 695 L 660 715 L 690 730 L 720 745 L 750 700 L 775 695 L 800 690 L 825 685 L 850 678 L 875 670" />
                
                {/* Line 31 Branch: Bromma Flygplats -> Bromma Blocks -> Norra Ulvsunda */}
                <path d="M 235 400 L 270 408 L 305 415" strokeDasharray="5,2.5" />
              </g>
            )}

            {/* 6. ROSLAGSBANAN (#8B5CF6) */}
            {(selectedLineGroup === 'all' || selectedLineGroup === 'tram_local') && (
              <g id="line-roslag" stroke="#8B5CF6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9">
                <path d="M 780 320 L 760 240 L 820 200 L 840 130 L 840 50 L 880 15" />
                <path d="M 840 130 L 920 70 L 960 60" />
              </g>
            )}

            {/* 8. SALTSJÖBANAN (#06B6D4) */}
            {(selectedLineGroup === 'all' || selectedLineGroup === 'tram_local') && (
              <path
                d="M 720 570 L 860 670 L 960 690 L 1040 710"
                stroke="#06B6D4"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.9"
              />
            )}

            {/* 9. LIDINGÖBANAN (#EAB308) */}
            {(selectedLineGroup === 'all' || selectedLineGroup === 'tram_local') && (
              <path
                d="M 900 330 L 940 330 L 975 330 L 1010 330 L 1045 335 L 1080 345 L 1115 355 L 1150 365 L 1185 375 L 1220 380 L 1255 380 L 1290 380 L 1325 380 L 1360 380"
                stroke="#EAB308"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.95"
              />
            )}

            {/* 10. NOCKEBYBANAN (#A855F7) */}
            {(selectedLineGroup === 'all' || selectedLineGroup === 'tram_local') && (
              <path
                d="M 350 460 L 330 468 L 310 474 L 290 480 L 270 486 L 250 492 L 230 498 L 210 504 L 190 508 L 170 510 L 150 510"
                stroke="#A855F7"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.95"
              />
            )}

            {/* ======================================================== */}
            {/* --- STATIONS NODES & CLEAR LABELS --- */}
            {/* ======================================================== */}
            {stations.map((st) => {
              const hasIncidents = !!stationIncidentCounts[st.id];
              const incidentCount = stationIncidentCounts[st.id] || 0;
              const isSelected = activeStationDetail?.id === st.id;
              const isHovered = hoveredStation?.id === st.id;
              const isFav = isStationFavorite(st.id);
              const isMajor = majorHubIds.has(st.id);
              const inActiveLine = isStationInLineGroup(st);
              const showLabel = shouldRenderLabel(st, isMajor, hasIncidents, isSelected || isHovered);

              return (
                <g
                  key={st.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    focusStation(st, Math.max(zoom, 1.5));
                  }}
                  onMouseEnter={() => setHoveredStation(st)}
                  onMouseLeave={() => setHoveredStation(null)}
                  opacity={inActiveLine ? 1 : 0.25}
                  className="cursor-pointer group transition-opacity duration-200"
                >
                  {/* Generous invisible Hitbox for easy touch/click */}
                  <circle
                    cx={st.coordinates.svgX}
                    cy={st.coordinates.svgY}
                    r="18"
                    fill="transparent"
                    pointerEvents="all"
                  />

                  {/* Selected Pulse Ring */}
                  {isSelected && (
                    <circle
                      cx={st.coordinates.svgX}
                      cy={st.coordinates.svgY}
                      r="24"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3.5"
                      className="animate-ping"
                      opacity="0.75"
                    />
                  )}

                  {/* Incident Alert Halo */}
                  {hasIncidents && (
                    <circle
                      cx={st.coordinates.svgX}
                      cy={st.coordinates.svgY}
                      r="20"
                      fill="#EF4444"
                      opacity="0.4"
                      className="animate-ping"
                    />
                  )}

                  {/* Major Interchange Station Pill/Capsule */}
                  {isMajor ? (
                    <rect
                      x={st.coordinates.svgX - 9}
                      y={st.coordinates.svgY - 9}
                      width="18"
                      height="18"
                      rx="9"
                      fill={hasIncidents ? '#EF4444' : isSelected ? '#10B981' : '#FFFFFF'}
                      stroke="#020617"
                      strokeWidth="3.5"
                      className="transition-transform group-hover:scale-125 origin-center shadow-lg"
                    />
                  ) : (
                    <circle
                      cx={st.coordinates.svgX}
                      cy={st.coordinates.svgY}
                      r={hasIncidents ? '7' : isSelected ? '6.5' : '5'}
                      fill={hasIncidents ? '#EF4444' : isSelected ? '#10B981' : '#FFFFFF'}
                      stroke="#020617"
                      strokeWidth="2.5"
                      className="transition-transform group-hover:scale-125 origin-center"
                    />
                  )}

                  {/* Incident Badge Counter */}
                  {hasIncidents && (
                    <g>
                      <circle
                        cx={st.coordinates.svgX + 9}
                        cy={st.coordinates.svgY - 9}
                        r="7"
                        fill="#EF4444"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                      <text
                        x={st.coordinates.svgX + 9}
                        y={st.coordinates.svgY - 6.5}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="8.5"
                        fontWeight="bold"
                      >
                        {incidentCount}
                      </text>
                    </g>
                  )}

                  {/* High-Legibility Station Label with Dark Outline Halo */}
                  {showLabel && (
                    <text
                      x={st.coordinates.svgX + (isMajor ? 13 : 9)}
                      y={st.coordinates.svgY + 3.5}
                      fill={
                        hasIncidents
                          ? '#FCA5A5'
                          : isSelected
                          ? '#34D399'
                          : isHovered
                          ? '#6EE7B7'
                          : isMajor
                          ? '#FFFFFF'
                          : '#E2E8F0'
                      }
                      fontSize={isMajor ? '12' : '10'}
                      fontWeight={isMajor || isSelected ? '800' : '600'}
                      stroke="#020617"
                      strokeWidth="3.5"
                      paintOrder="stroke fill"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-colors group-hover:fill-emerald-400 select-none pointer-events-none drop-shadow-md"
                    >
                      {st.name} {isFav && '★'}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
        </>
      )}

      {/* Station Bottom Sheet Detail Popup */}
      {activeStationDetail && (
        <div className="absolute bottom-3 left-3 right-3 max-w-lg mx-auto z-30 bg-slate-900/98 backdrop-blur-xl border border-slate-700/90 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
          <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white tracking-tight">
                  {activeStationDetail.name}
                </span>
                <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-700">
                  Zon {activeStationDetail.zone}
                </span>
                <button
                  onClick={() => toggleFavoriteStation(activeStationDetail.id)}
                  className={`p-1 rounded-full text-xs transition-colors ${
                    isStationFavorite(activeStationDetail.id)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-500 hover:text-amber-400'
                  }`}
                  title="Spara som favorit"
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
              </div>

              {/* Connected Lines */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {activeStationDetail.lineIds.map((lId) => {
                  const line = lines.find((l) => l.id === lId);
                  if (!line) return null;
                  return (
                    <span
                      key={lId}
                      className="text-[10px] font-bold px-2 py-0.5 rounded text-white shadow-sm"
                      style={{ backgroundColor: line.color }}
                    >
                      {line.code || line.name}
                    </span>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setActiveStationDetail(null)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Active Incidents list */}
          <div className="py-2.5 max-h-44 overflow-y-auto space-y-2">
            {reports.filter((r) => r.status === 'aktiv' && (r.location.stationId === activeStationDetail.id || r.location.fromStationId === activeStationDetail.id || r.location.toStationId === activeStationDetail.id)).length > 0 ? (
              reports
                .filter((r) => r.status === 'aktiv' && (r.location.stationId === activeStationDetail.id || r.location.fromStationId === activeStationDetail.id || r.location.toStationId === activeStationDetail.id))
                .map((r) => <ReportCard key={r.id} report={r} compact />)
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Inga aktiva incidenter rapporterade för {activeStationDetail.name} just nu. Normal drift.</span>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
            <div className="text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">
                {activeStationDetail.entrances.length}
              </span>{' '}
              registrerade uppgångar
            </div>

            <button
              onClick={() => handleReportHere(activeStationDetail)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Rapportera här</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
