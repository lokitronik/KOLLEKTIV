import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import L from 'leaflet';
import { 
  Station, 
  TransitLine, 
  Report, 
  TransportType 
} from '../../types';
import { 
  Crosshair, 
  Layers, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Compass, 
  MapPin, 
  AlertTriangle,
  Flame,
  CheckCircle2,
  PlusCircle,
  Star
} from 'lucide-react';

interface GeographicMapProps {
  stations: Station[];
  lines: TransitLine[];
  reports: Report[];
  selectedCategory: string;
  selectedLineGroup: string;
  activeStation: Station | null;
  onSelectStation: (station: Station | null) => void;
  onReportHere: (station: Station) => void;
  lang: string;
}

// Tile layers configurations (100% free, public, no API key, no watermarks)
interface TileConfig {
  id: 'dark' | 'light' | 'streets';
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
  maxNativeZoom?: number;
  subdomains?: string;
}

const TILE_LAYERS: Record<'dark' | 'light' | 'streets', TileConfig> = {
  dark: {
    id: 'dark',
    name: 'Mörk (Taktisk)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Kartdata &copy; Esri &mdash; OpenStreetMap',
    maxZoom: 19,
    maxNativeZoom: 16
  },
  light: {
    id: 'light',
    name: 'Ljus (Ren)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Kartdata &copy; Esri &mdash; OpenStreetMap',
    maxZoom: 19,
    maxNativeZoom: 16
  },
  streets: {
    id: 'streets',
    name: 'OpenStreetMap (Gator)',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> bidragsgivare',
    maxZoom: 19,
    maxNativeZoom: 19
  }
};

// Stockholm Central coordinates
const STOCKHOLM_CENTER: [number, number] = [59.3326, 18.0649];

export const GeographicMap: React.FC<GeographicMapProps> = ({
  stations,
  lines,
  reports,
  selectedCategory,
  selectedLineGroup,
  activeStation,
  onSelectStation,
  onReportHere,
  lang
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const linesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const stationsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [currentTileTheme, setCurrentTileTheme] = useState<'dark' | 'light' | 'streets'>('dark');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearestStation, setNearestStation] = useState<{ station: Station; distanceMeters: number } | null>(null);
  const [mapZoom, setMapZoom] = useState<number>(12);

  // Active reports map per station
  const stationReportsMap = useMemo(() => {
    const map = new Map<string, Report[]>();
    for (const r of reports) {
      if (r.status !== 'aktiv') continue;
      if (selectedCategory !== 'all' && r.category !== selectedCategory) continue;

      const addRep = (stId?: string) => {
        if (!stId) return;
        const current = map.get(stId) || [];
        current.push(r);
        map.set(stId, current);
      };

      addRep(r.location.stationId);
      addRep(r.location.fromStationId);
      addRep(r.location.toStationId);
    }
    return map;
  }, [reports, selectedCategory]);

  // Stations lookup map
  const stationsById = useMemo(() => {
    const map = new Map<string, Station>();
    for (const st of stations) {
      map.set(st.id, st);
    }
    return map;
  }, [stations]);

  // Filter lines based on selected line group
  const filteredLines = useMemo(() => {
    if (selectedLineGroup === 'all') return lines;
    return lines.filter((line) => {
      if (selectedLineGroup === 'tb_green') return line.id.startsWith('tb_green');
      if (selectedLineGroup === 'tb_red') return line.id.startsWith('tb_red');
      if (selectedLineGroup === 'tb_blue') return line.id.startsWith('tb_blue');
      if (selectedLineGroup === 'pendel') return line.id.startsWith('pendel');
      if (selectedLineGroup === 'tram_local') {
        return (
          line.id.startsWith('tvarbanan') ||
          line.id.startsWith('roslag') ||
          line.id.startsWith('saltsjo') ||
          line.id.startsWith('lidingo') ||
          line.id.startsWith('nockeby') ||
          line.id.startsWith('bus')
        );
      }
      return true;
    });
  }, [lines, selectedLineGroup]);

  // Filter stations based on selected line group
  const filteredStations = useMemo(() => {
    if (selectedLineGroup === 'all') return stations;
    const allowedStationIds = new Set<string>();
    filteredLines.forEach((l) => l.stations.forEach((sid) => allowedStationIds.add(sid)));
    return stations.filter((s) => allowedStationIds.has(s.id));
  }, [stations, filteredLines, selectedLineGroup]);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: STOCKHOLM_CENTER,
      zoom: 12,
      minZoom: 9,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: true
    });

    // Add initial tile layer
    const initCfg = TILE_LAYERS[currentTileTheme];
    const initialTile = L.tileLayer(initCfg.url, {
      attribution: initCfg.attribution,
      maxZoom: initCfg.maxZoom,
      maxNativeZoom: initCfg.maxNativeZoom || 19,
      ...(initCfg.subdomains ? { subdomains: initCfg.subdomains } : {})
    }).addTo(map);

    tileLayerRef.current = initialTile;

    // Layer groups for dynamic redraws
    linesLayerGroupRef.current = L.layerGroup().addTo(map);
    stationsLayerGroupRef.current = L.layerGroup().addTo(map);

    map.on('zoomend', () => {
      setMapZoom(map.getZoom());
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Handle Tile Layer Switching
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const cfg = TILE_LAYERS[currentTileTheme];
    const newLayer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxZoom: cfg.maxZoom,
      maxNativeZoom: cfg.maxNativeZoom || 19,
      ...(cfg.subdomains ? { subdomains: cfg.subdomains } : {})
    }).addTo(map);

    // Keep tiles at the bottom
    newLayer.bringToBack();
    tileLayerRef.current = newLayer;
  }, [currentTileTheme]);

  // Helper: Get symbol for transport type
  const getTransportBadge = (type: TransportType) => {
    switch (type) {
      case 'tunnelbana': return 'T';
      case 'pendeltag': return 'J';
      case 'tvarbanan':
      case 'sparvag': return 'L';
      case 'saltsjobanan': return 'S';
      case 'roslagsbanan': return 'R';
      case 'buss': return 'B';
      default: return 'T';
    }
  };

  // Helper: Get primary color for station
  const getStationColor = (station: Station) => {
    for (const lid of station.lineIds) {
      const lineObj = lines.find((l) => l.id === lid);
      if (lineObj) return lineObj.color;
    }
    if (station.transportTypes.includes('tunnelbana')) return '#10B981';
    if (station.transportTypes.includes('pendeltag')) return '#EC4899';
    if (station.transportTypes.includes('tvarbanan')) return '#F97316';
    return '#3B82F6';
  };

  // 3. Render Transit Lines (Polylines)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const linesGroup = linesLayerGroupRef.current;
    if (!map || !linesGroup) return;

    linesGroup.clearLayers();

    filteredLines.forEach((line) => {
      // Gather coordinates in sequence
      const latLngs: [number, number][] = [];
      line.stations.forEach((stId) => {
        const st = stationsById.get(stId);
        if (st && st.coordinates && st.coordinates.lat && st.coordinates.lng) {
          latLngs.push([st.coordinates.lat, st.coordinates.lng]);
        }
      });

      if (latLngs.length < 2) return;

      // Glow casing line for dark mode readability
      const haloLine = L.polyline(latLngs, {
        color: line.color,
        weight: 7,
        opacity: currentTileTheme === 'dark' ? 0.35 : 0.25,
        lineCap: 'round',
        lineJoin: 'round',
        interactive: false
      });

      // Core crisp line
      const mainLine = L.polyline(latLngs, {
        color: line.color,
        weight: 3.8,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      });

      // Tooltip on line hover
      mainLine.bindTooltip(
        `<div class="flex items-center gap-1.5 font-bold text-xs">
          <span class="w-2.5 h-2.5 rounded-full inline-block" style="background-color: ${line.color}"></span>
          <span>${line.name}</span>
        </div>`,
        { sticky: true, className: 'leaflet-tooltip' }
      );

      mainLine.on('mouseover', () => {
        mainLine.setStyle({ weight: 6, opacity: 1 });
      });
      mainLine.on('mouseout', () => {
        mainLine.setStyle({ weight: 3.8, opacity: 0.95 });
      });

      linesGroup.addLayer(haloLine);
      linesGroup.addLayer(mainLine);
    });
  }, [filteredLines, stationsById, currentTileTheme]);

  // 4. Render Station Markers (Custom HTML divIcon)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const stationsGroup = stationsLayerGroupRef.current;
    if (!map || !stationsGroup) return;

    stationsGroup.clearLayers();

    filteredStations.forEach((station) => {
      const { lat, lng } = station.coordinates;
      if (!lat || !lng) return;

      const activeIncidents = stationReportsMap.get(station.id) || [];
      const hasIncidents = activeIncidents.length > 0;
      const isSelected = activeStation?.id === station.id;
      const primaryColor = getStationColor(station);
      const badgeLetter = getTransportBadge(station.transportTypes[0]);

      // Determine size and visibility based on zoom and incidents
      const isMajor = [
        't_centralen', 'stockholm_city', 'slussen', 'odenplan', 'fridhemsplan',
        'gullmarsplan', 'liljeholmen', 'alvik', 'solna_station', 'sundbyberg_c'
      ].includes(station.id);

      // Custom HTML Marker
      let markerHtml = '';

      if (hasIncidents) {
        // High Alert Incident Radar Marker
        markerHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group" style="width: 38px; height: 38px;">
            <!-- Radar ping halo -->
            <div class="absolute inset-0 rounded-full bg-rose-500/40 animate-ping-slow"></div>
            <div class="absolute -inset-1 rounded-full bg-rose-500/20 blur-sm"></div>
            
            <!-- Central Badge -->
            <div class="relative w-8 h-8 rounded-full bg-slate-900 border-2 border-rose-500 flex items-center justify-center shadow-lg shadow-rose-950/60 transform group-hover:scale-110 transition-transform">
              <span class="text-rose-400 font-black text-xs">⚠️</span>
              <!-- Counter badge -->
              <span class="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[9px] font-black border border-slate-900 shadow">
                ${activeIncidents.length}
              </span>
            </div>
          </div>
        `;
      } else if (isMajor || mapZoom >= 13 || isSelected) {
        // Prominent Station Badge
        markerHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group" style="width: 28px; height: 28px;">
            ${isSelected ? '<div class="absolute -inset-2 rounded-full bg-emerald-400/30 animate-pulse"></div>' : ''}
            <div class="w-6 h-6 rounded-full bg-slate-900 border-2 flex items-center justify-center shadow-md transform group-hover:scale-125 transition-transform" style="border-color: ${isSelected ? '#34d399' : primaryColor}">
              <span class="text-[10px] font-black" style="color: ${isSelected ? '#34d399' : primaryColor}">${badgeLetter}</span>
            </div>
          </div>
        `;
      } else {
        // Small sleek node for clean zoom view
        markerHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group" style="width: 16px; height: 16px;">
            <div class="w-3 h-3 rounded-full bg-white border border-slate-900 shadow-sm group-hover:scale-150 transition-transform" style="background-color: ${primaryColor}"></div>
          </div>
        `;
      }

      const icon = L.divIcon({
        className: 'custom-station-icon',
        html: markerHtml,
        iconSize: hasIncidents ? [38, 38] : isMajor || mapZoom >= 13 ? [28, 28] : [16, 16],
        iconAnchor: hasIncidents ? [19, 19] : isMajor || mapZoom >= 13 ? [14, 14] : [8, 8]
      });

      const marker = L.marker([lat, lng], { icon });

      // Interactive Station Tooltip
      const linesBadges = station.lineIds.map((lid) => {
        const l = lines.find((x) => x.id === lid);
        return `<span class="px-1.5 py-0.5 rounded text-[9px] font-bold text-white" style="background-color: ${l?.color || '#475569'}">${l?.code || lid}</span>`;
      }).join(' ');

      const incidentNotice = hasIncidents 
        ? `<div class="mt-1 pt-1 border-t border-rose-500/30 text-rose-400 text-[10px] font-bold flex items-center gap-1">
            <span>🚨 ${activeIncidents.length} ${lang === 'es' ? 'incidencia(s) activa(s)' : lang === 'en' ? 'active incident(s)' : 'aktiva rapporter'}</span>
          </div>`
        : '';

      marker.bindTooltip(`
        <div class="p-1 space-y-1">
          <div class="flex items-center justify-between gap-3">
            <span class="font-extrabold text-white text-xs">${station.name}</span>
            <span class="text-[9px] text-slate-400 font-semibold uppercase">Zon ${station.zone}</span>
          </div>
          <div class="flex flex-wrap gap-1">${linesBadges}</div>
          ${incidentNotice}
        </div>
      `, {
        direction: 'top',
        offset: [0, hasIncidents ? -16 : -10],
        className: 'leaflet-tooltip'
      });

      // Click on marker
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onSelectStation(station);
        map.panTo([lat, lng], { animate: true, duration: 0.5 });
      });

      stationsGroup.addLayer(marker);
    });
  }, [filteredStations, stationReportsMap, activeStation, mapZoom, lines, lang, onSelectStation]);

  // 5. Center map on active station if selected from outside
  useEffect(() => {
    if (!activeStation || !mapInstanceRef.current) return;
    const { lat, lng } = activeStation.coordinates;
    if (lat && lng) {
      mapInstanceRef.current.flyTo([lat, lng], Math.max(mapInstanceRef.current.getZoom(), 14), {
        duration: 0.8
      });
    }
  }, [activeStation]);

  const [geoNotice, setGeoNotice] = useState<string | null>(null);

  // 6. User Geolocation Feature ("Min position")
  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoNotice(lang === 'es' ? 'Geolocalización no soportada en este navegador.' : 'Geolokalisering stöds inte i din webbläsare.');
      setTimeout(() => setGeoNotice(null), 4000);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const userLatLng: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(userLatLng);

        const map = mapInstanceRef.current;
        if (!map) return;

        // Add or update pulsating user marker
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng(userLatLng);
        } else {
          const userIcon = L.divIcon({
            className: 'user-geo-icon',
            html: `
              <div class="relative flex items-center justify-center" style="width: 32px; height: 32px;">
                <div class="absolute inset-0 rounded-full bg-blue-500/30 animate-ping"></div>
                <div class="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-xl flex items-center justify-center">
                  <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          userMarkerRef.current = L.marker(userLatLng, { icon: userIcon }).addTo(map);
          userMarkerRef.current.bindTooltip(
            `<span class="font-bold text-blue-400 text-xs">${lang === 'es' ? 'Tu ubicación' : 'Du är här'}</span>`,
            { permanent: true, direction: 'top', offset: [0, -14] }
          );
        }

        // Find nearest station
        let nearest: { station: Station; distanceMeters: number } | null = null;
        for (const st of stations) {
          if (!st.coordinates.lat || !st.coordinates.lng) continue;
          const d = map.distance(userLatLng, [st.coordinates.lat, st.coordinates.lng]);
          if (!nearest || d < nearest.distanceMeters) {
            nearest = { station: st, distanceMeters: Math.round(d) };
          }
        }

        if (nearest) {
          setNearestStation(nearest);
        }

        map.flyTo(userLatLng, 15, { duration: 1 });
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err.message);
        // Fallback smooth fly to central Stockholm
        mapInstanceRef.current?.flyTo(STOCKHOLM_CENTER, 14);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [stations, lang]);

  return (
    <div className="relative w-full h-full flex-1">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0 outline-none" />

      {/* Floating Floating On-Map Controls (Right Side) */}
      <div className="absolute right-3.5 top-20 z-10 flex flex-col gap-2 pointer-events-auto">
        {/* Zoom In */}
        <button
          onClick={() => mapInstanceRef.current?.zoomIn()}
          className="w-10 h-10 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 backdrop-blur-md flex items-center justify-center shadow-xl transition-all active:scale-90"
          title={lang === 'es' ? 'Acercar (+)' : 'Zooma in (+)'}
        >
          <span className="text-lg font-bold leading-none">+</span>
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => mapInstanceRef.current?.zoomOut()}
          className="w-10 h-10 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 backdrop-blur-md flex items-center justify-center shadow-xl transition-all active:scale-90"
          title={lang === 'es' ? 'Alejar (-)' : 'Zooma ut (-)'}
        >
          <span className="text-lg font-bold leading-none">−</span>
        </button>

        {/* Geolocation Button ("Min position") */}
        <button
          onClick={handleLocateMe}
          disabled={isLocating}
          className={`w-10 h-10 rounded-2xl border backdrop-blur-md flex items-center justify-center shadow-xl transition-all active:scale-90 ${
            userLocation 
              ? 'bg-blue-600 text-white border-blue-500 shadow-blue-950/50' 
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-700/80'
          }`}
          title={lang === 'es' ? 'Mi ubicación GPS' : 'Hitta min position (GPS)'}
        >
          <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin text-emerald-400' : ''}`} />
        </button>

        {/* Reset to T-Centralen / Stockholm City Center */}
        <button
          onClick={() => {
            mapInstanceRef.current?.flyTo(STOCKHOLM_CENTER, 13, { duration: 0.8 });
          }}
          className="w-10 h-10 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xl transition-all text-[11px] font-black tracking-tighter active:scale-90 shadow-emerald-950/50"
          title={lang === 'es' ? 'Centrar en Estocolmo Central' : 'Centrera T-Centralen'}
        >
          T-C
        </button>

        {/* Tile Theme Switcher (Dark / Light / Streets) */}
        <button
          onClick={() => {
            setCurrentTileTheme((prev) => (prev === 'dark' ? 'streets' : prev === 'streets' ? 'light' : 'dark'));
          }}
          className="w-10 h-10 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md flex items-center justify-center shadow-xl transition-all active:scale-90"
          title={`Kartstil: ${TILE_LAYERS[currentTileTheme].name}`}
        >
          <Layers className="w-4 h-4 text-emerald-400" />
        </button>
      </div>

      {/* Nearest Station Notification Pill when GPS located */}
      {nearestStation && (
        <div className="absolute top-20 left-3.5 z-10 hidden sm:flex items-center gap-2 bg-slate-900/90 border border-emerald-500/40 px-3.5 py-2 rounded-2xl backdrop-blur-md shadow-2xl text-xs text-slate-200 animate-fadeIn">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-slate-400 text-[10px] block">
              {lang === 'es' ? 'Estación más cercana:' : 'Närmaste SL-station:'}
            </span>
            <button
              onClick={() => onSelectStation(nearestStation.station)}
              className="font-bold text-white hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
            >
              <span>{nearestStation.station.name}</span>
              <span className="text-emerald-400 font-mono text-[11px]">({nearestStation.distanceMeters} m)</span>
            </button>
          </div>
        </div>
      )}

      {/* Geolocation notification message if any */}
      {geoNotice && (
        <div className="absolute top-20 left-3.5 z-10 flex items-center gap-2 bg-slate-900/95 border border-amber-500/50 px-3.5 py-2 rounded-2xl backdrop-blur-md shadow-2xl text-xs text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{geoNotice}</span>
        </div>
      )}

      {/* Map Legend Banner (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-10 hidden md:flex items-center gap-3 bg-slate-900/85 backdrop-blur-md border border-slate-800 px-3.5 py-1.5 rounded-2xl text-[11px] text-slate-400 shadow-xl">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
          <span>Tunnelbana</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block"></span>
          <span>Pendeltåg</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span>
          <span>Tvärbanan</span>
        </div>
        <div className="flex items-center gap-1.5 text-rose-400 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block"></span>
          <span>Aktiv rapport</span>
        </div>
      </div>
    </div>
  );
};
