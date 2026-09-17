import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  AlertTriangle, 
  Construction, 
  TrainTrack, 
  Building2, 
  Users, 
  HelpCircle,
  MapPin,
  Train,
  Bus,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Flame,
  Volume2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_CATEGORIES } from '../data/categories';
import { CategoryDefinition, CategoryId, LocationType, StationArea, TransportType } from '../types';
import { getLocalizedText } from '../utils/confidence';

export const ReportModal: React.FC = () => {
  const { 
    isReportModalOpen, 
    setIsReportModalOpen, 
    preselectedStationId,
    categories, 
    stations, 
    lines, 
    createReport,
    lang,
    t,
    currentUser
  } = useApp();

  // Wizard Step (1 to 5)
  const [step, setStep] = useState<number>(1);

  // Use rich fallback categories if context categories is empty or lacks subcategories
  const effectiveCategories = useMemo(() => {
    if (categories && categories.length > 0 && categories.some(c => c.subcategories?.length > 0)) {
      return categories;
    }
    return INITIAL_CATEGORIES;
  }, [categories]);

  // Form State
  const [categoryId, setCategoryId] = useState<CategoryId>('drift');
  const [subcategoryId, setSubcategoryId] = useState<string>('sparrproblem');
  const [subcategoryName, setSubcategoryName] = useState<string>('Spärrar ur funktion / Köer');
  
  const [transportType, setTransportType] = useState<TransportType>('tunnelbana');
  const [lineId, setLineId] = useState<string>('tb_green');
  const [locationType, setLocationType] = useState<LocationType>('station');
  
  const [stationId, setStationId] = useState<string>('odenplan');
  const [stationSearchQuery, setStationSearchQuery] = useState<string>('');
  const [stationArea, setStationArea] = useState<StationArea>('sparrar');
  const [entranceExitId, setEntranceExitId] = useState<string>('');
  
  const [fromStationId, setFromStationId] = useState<string>('radhuset');
  const [toStationId, setToStationId] = useState<string>('t_centralen');
  const [direction, setDirection] = useState<string>('Mot Kungsträdgården');
  const [stopName, setStopName] = useState<string>('');

  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Quick Preset Tags
  const QUICK_TAGS = useMemo(() => {
    if (lang === 'es') {
      return ['+10 min retraso', 'Gran aglomeración', 'Fuera de servicio', 'Personal de seguridad presente', 'Acceso cortado', 'Ascensor averiado'];
    }
    if (lang === 'en') {
      return ['+10 min delay', 'Heavy crowding', 'Out of service', 'Security/Police on site', 'Access blocked', 'Elevator broken'];
    }
    return ['+10 min försening', 'Stora köer / Trängsel', 'Ur funktion', 'Ordningsvakter på plats', 'Avstängd uppgång', 'Hiss trasig'];
  }, [lang]);

  // Sync / Reset on open
  useEffect(() => {
    if (isReportModalOpen) {
      if (preselectedStationId) {
        const found = stations.find((s) => s.id === preselectedStationId);
        if (found) {
          setStationId(found.id);
          if (found.lineIds.length > 0) {
            setLineId(found.lineIds[0]);
            const l = lines.find((line) => line.id === found.lineIds[0]);
            if (l) setTransportType(l.transportType);
          }
        }
      }
    }
  }, [isReportModalOpen, preselectedStationId, stations, lines]);

  if (!isReportModalOpen) return null;

  const currentCategory = effectiveCategories.find((c) => c.id === categoryId) || effectiveCategories[0];
  const currentLine = lines.find((l) => l.id === lineId) || lines[0];
  const selectedStation = stations.find((s) => s.id === stationId) || stations[0];
  const selectedEntrance = selectedStation?.entrances?.find((e) => e.id === entranceExitId);

  // Filter stations based on line or search
  const filteredStations = stations.filter((st) => {
    if (stationSearchQuery.trim()) {
      return st.name.toLowerCase().includes(stationSearchQuery.toLowerCase());
    }
    if (lineId && currentLine) {
      return currentLine.stations.includes(st.id) || st.lineIds.includes(lineId);
    }
    return true;
  });

  // Category Icon mapper
  const renderCategoryIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'AlertTriangle':
        return <AlertTriangle className={className} />;
      case 'Construction':
        return <Construction className={className} />;
      case 'TrainTrack':
        return <TrainTrack className={className} />;
      case 'Building2':
        return <Building2 className={className} />;
      case 'Users':
        return <Users className={className} />;
      default:
        return <HelpCircle className={className} />;
    }
  };

  const handleSelectCategory = (catId: CategoryId) => {
    setCategoryId(catId);
    const cat = effectiveCategories.find((c) => c.id === catId);
    if (cat && cat.subcategories && cat.subcategories.length > 0) {
      setSubcategoryId(cat.subcategories[0].id);
      setSubcategoryName(getLocalizedText(cat.subcategories[0].name, lang, cat.subcategories[0].id));
    }
    setStep(2);
  };

  const handleSelectSubcategory = (subId: string, subName: string) => {
    setSubcategoryId(subId);
    setSubcategoryName(subName);
    setStep(3);
  };

  const handleSelectTransport = (tt: TransportType) => {
    setTransportType(tt);
    const matchLines = lines.filter((l) => l.transportType === tt);
    if (matchLines.length > 0) {
      setLineId(matchLines[0].id);
      if (matchLines[0].stations.length > 0) {
        setStationId(matchLines[0].stations[0]);
      }
    }
  };

  const handleSelectLine = (lId: string) => {
    setLineId(lId);
    const l = lines.find((line) => line.id === lId);
    if (l && l.stations.length > 0) {
      if (!l.stations.includes(stationId)) {
        setStationId(l.stations[0]);
      }
    }
  };

  const handleAddTagToComment = (tag: string) => {
    if (comment.includes(tag)) return;
    setComment((prev) => (prev.trim() ? `${prev.trim()}, ${tag}` : tag));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const fromSt = stations.find((s) => s.id === fromStationId);
      const toSt = stations.find((s) => s.id === toStationId);

      await createReport({
        category: categoryId,
        subcategoryId,
        subcategoryName,
        location: {
          transportType,
          operator: 'SL',
          city: 'Stockholm',
          country: 'Sverige',
          lineId: currentLine?.id,
          lineName: currentLine?.name,
          lineColor: currentLine?.color,
          locationType,
          stationId: locationType === 'station' ? selectedStation?.id : undefined,
          stationName: locationType === 'station' ? selectedStation?.name : undefined,
          stationArea: locationType === 'station' ? stationArea : undefined,
          entranceExitId: locationType === 'station' && entranceExitId ? entranceExitId : undefined,
          entranceExitName: locationType === 'station' && selectedEntrance ? selectedEntrance.name : undefined,
          fromStationId: locationType !== 'station' ? fromStationId : undefined,
          fromStationName: locationType !== 'station' ? fromSt?.name : undefined,
          toStationId: locationType !== 'station' ? toStationId : undefined,
          toStationName: locationType !== 'station' ? toSt?.name : undefined,
          direction: locationType !== 'station' ? direction : undefined,
          stopName: locationType === 'bus_stop' ? stopName : undefined
        },
        comment: comment.trim() || undefined
      });

      setIsReportModalOpen(false);
    } catch (err) {
      console.error('Failed to submit report', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step names translation
  const STEP_TITLES = [
    { num: 1, title: lang === 'es' ? 'Categoría' : lang === 'en' ? 'Category' : 'Kategori' },
    { num: 2, title: lang === 'es' ? 'Incidencia' : lang === 'en' ? 'Incident' : 'Händelse' },
    { num: 3, title: lang === 'es' ? 'Ubicación' : lang === 'en' ? 'Location' : 'Plats' },
    { num: 4, title: lang === 'es' ? 'Detalles' : lang === 'en' ? 'Details' : 'Detaljer' },
    { num: 5, title: lang === 'es' ? 'Publicar' : lang === 'en' ? 'Publish' : 'Publicera' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header with Step Wizard Indicator */}
        <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/30">
              {step}
            </span>
            <div className="font-extrabold text-sm sm:text-base text-white">
              {step === 1 && (lang === 'es' ? '¿Qué está ocurriendo?' : lang === 'en' ? 'What is happening?' : 'Vad händer?')}
              {step === 2 && (lang === 'es' ? 'Especifica la incidencia' : lang === 'en' ? 'Specify the incident' : 'Specificera incidenten')}
              {step === 3 && (lang === 'es' ? '¿Dónde ocurre?' : lang === 'en' ? 'Where is it happening?' : 'Var sker det?')}
              {step === 4 && (lang === 'es' ? 'Detalles u observaciones' : lang === 'en' ? 'Details & notes' : 'Observation & Kommentar')}
              {step === 5 && (lang === 'es' ? 'Revisar y publicar' : lang === 'en' ? 'Review & publish' : 'Granska & Publicera')}
            </div>
          </div>

          <button
            onClick={() => setIsReportModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Breadcrumbs */}
        <div className="grid grid-cols-5 border-b border-slate-800 bg-slate-950/60 text-[10px] font-bold">
          {STEP_TITLES.map((st) => {
            const isActive = step === st.num;
            const isDone = step > st.num;
            return (
              <button
                key={st.num}
                onClick={() => setStep(st.num)}
                className={`py-2 px-1 text-center transition-all border-b-2 flex items-center justify-center gap-1 ${
                  isActive
                    ? 'border-emerald-400 text-emerald-300 bg-emerald-950/20 font-black'
                    : isDone
                    ? 'border-emerald-600/60 text-slate-300 hover:text-white hover:bg-slate-800/40'
                    : 'border-transparent text-slate-500 hover:text-slate-400'
                }`}
              >
                {isDone ? <Check className="w-3 h-3 text-emerald-400" /> : <span>{st.num}.</span>}
                <span className="truncate hidden sm:inline">{st.title}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 text-slate-200 space-y-4">
          
          {/* ========================================================= */}
          {/* STEP 1: CATEGORY SELECTION */}
          {/* ========================================================= */}
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 font-medium">
                {lang === 'es' 
                  ? 'Selecciona la categoría principal de la incidencia:' 
                  : lang === 'en' 
                  ? 'Select the primary incident category:' 
                  : 'Välj den kategori som bäst beskriver det du observerar:'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {effectiveCategories.map((cat) => {
                  const isSelected = categoryId === cat.id;
                  const catTitle = getLocalizedText(cat.name, lang, cat.id);
                  const subCount = Array.isArray(cat.subcategories) ? cat.subcategories.length : 0;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.id as CategoryId)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left group active:scale-[0.98] ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-950/30 text-white ring-1 ring-emerald-500'
                          : 'border-slate-800 bg-slate-800/70 hover:bg-slate-800 hover:border-slate-700 text-slate-200'
                      }`}
                    >
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md transition-transform group-hover:scale-105"
                        style={{ backgroundColor: cat.color }}
                      >
                        {renderCategoryIcon(cat.icon, 'w-5 h-5')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold text-xs sm:text-sm text-slate-100 group-hover:text-white truncate">
                          {catTitle}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {subCount} {lang === 'es' ? 'opciones' : lang === 'en' ? 'options' : 'val'}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: SUBCATEGORY SELECTION */}
          {/* ========================================================= */}
          {step === 2 && currentCategory && (
            <div className="space-y-3">
              {/* Category Breadcrumb */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: currentCategory.color }} 
                  />
                  <span className="text-slate-400">{lang === 'es' ? 'Categoría:' : lang === 'en' ? 'Category:' : 'Kategori:'}</span>
                  <span className="font-bold text-white">
                    {getLocalizedText(currentCategory.name, lang, currentCategory.id)}
                  </span>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-[11px] text-emerald-400 hover:underline font-semibold"
                >
                  {lang === 'es' ? 'Cambiar' : lang === 'en' ? 'Change' : 'Ändra'}
                </button>
              </div>

              <p className="text-xs text-slate-400 font-medium">
                {lang === 'es' ? 'Selecciona el tipo exacto de reporte:' : lang === 'en' ? 'Select the exact issue:' : 'Specificera vad som händer:'}
              </p>

              {/* Subcategories Grid */}
              <div className="grid grid-cols-1 gap-2">
                {(currentCategory.subcategories || []).map((sub) => {
                  const name = getLocalizedText(sub.name, lang, sub.id);
                  const isSelected = subcategoryId === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleSelectSubcategory(sub.id, name)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all group ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-950/40 text-white ring-1 ring-emerald-500/50'
                          : 'border-slate-800 bg-slate-800/70 hover:bg-slate-800 hover:border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-emerald-400 bg-emerald-500 text-slate-950' : 'border-slate-600'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="font-bold text-xs sm:text-sm">{name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {sub.severity === 'critical' && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                            {lang === 'es' ? 'Crítico' : lang === 'en' ? 'Critical' : 'Akut'}
                          </span>
                        )}
                        {sub.severity === 'high' && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            {lang === 'es' ? 'Alto' : lang === 'en' ? 'High' : 'Hög'}
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: STRUCTURED TRANSIT LOCATION SELECTION */}
          {/* ========================================================= */}
          {step === 3 && (
            <div className="space-y-4 text-xs sm:text-sm">
              {/* Location Type Selector */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                  1. {lang === 'es' ? '¿Dónde ocurre la incidencia?' : lang === 'en' ? 'Where is it located?' : 'Var sker incidenten?'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { id: 'station', label: lang === 'es' ? 'En estación' : lang === 'en' ? 'At station' : 'På station' },
                    { id: 'in_vehicle', label: lang === 'es' ? 'En el vehículo' : lang === 'en' ? 'In vehicle' : 'I fordon' },
                    { id: 'between_stations', label: lang === 'es' ? 'Entre estaciones' : lang === 'en' ? 'Between stations' : 'Mellan stationer' },
                    { id: 'bus_stop', label: lang === 'es' ? 'En parada' : lang === 'en' ? 'Bus stop' : 'Busshållplats' }
                  ].map((lt) => (
                    <button
                      key={lt.id}
                      type="button"
                      onClick={() => setLocationType(lt.id as LocationType)}
                      className={`p-2 rounded-xl border text-center font-bold text-xs transition-all ${
                        locationType === lt.id
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-sm'
                          : 'border-slate-800 bg-slate-800/80 text-slate-300 hover:bg-slate-750'
                      }`}
                    >
                      {lt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transport Modes Buttons */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                  2. {lang === 'es' ? 'Medio de transporte' : lang === 'en' ? 'Transport mode' : 'Transportslag'}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {[
                    { id: 'tunnelbana', label: '🚇 Metro', name: 'Tunnelbana' },
                    { id: 'pendeltag', label: '🚆 Cercanías', name: 'Pendeltåg' },
                    { id: 'tvarbanan', label: '🚋 Tvärbanan', name: 'Tvärbanan' },
                    { id: 'sparvag', label: '🚊 Spårvagn', name: 'Spårvagn' },
                    { id: 'roslagsbanan', label: '🚈 Roslagsb.', name: 'Roslagsbanan' },
                    { id: 'buss', label: '🚌 Buss', name: 'Buss' }
                  ].map((tm) => (
                    <button
                      key={tm.id}
                      type="button"
                      onClick={() => handleSelectTransport(tm.id as TransportType)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        transportType === tm.id
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-extrabold ring-1 ring-emerald-500/40'
                          : 'border-slate-800 bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-750'
                      }`}
                    >
                      <div className="text-[11px] font-bold">{tm.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Selector Pills */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                  3. {lang === 'es' ? 'Línea' : lang === 'en' ? 'Line' : 'Linje'}
                </label>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {lines
                    .filter((l) => l.transportType === transportType || (transportType === 'sparvag' && (l.transportType === 'sparvag' || l.id.includes('banan'))))
                    .map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => handleSelectLine(l.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                          lineId === l.id
                            ? 'border-white text-white shadow-md scale-105'
                            : 'border-slate-800 bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                        style={lineId === l.id ? { backgroundColor: l.color } : undefined}
                      >
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                        <span>{l.code || l.name}</span>
                      </button>
                    ))}
                </div>
              </div>

              {/* Station Selection */}
              {locationType === 'station' && (
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                        4. {lang === 'es' ? 'Seleccionar Estación' : lang === 'en' ? 'Select Station' : 'Välj Station'}
                      </label>
                      <span className="text-[10px] text-slate-500">
                        {filteredStations.length} {lang === 'es' ? 'estaciones' : 'stationer'}
                      </span>
                    </div>

                    {/* Quick Search */}
                    <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 mb-2 focus-within:border-emerald-500">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={stationSearchQuery}
                        onChange={(e) => setStationSearchQuery(e.target.value)}
                        placeholder={lang === 'es' ? 'Buscar estación (ej. T-Centralen, Slussen)...' : 'Sök station (t.ex. Odenplan)...'}
                        className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none"
                      />
                      {stationSearchQuery && (
                        <button onClick={() => setStationSearchQuery('')} className="text-slate-400 hover:text-white">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Quick Hub Station Chips */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1.5 no-scrollbar mb-1.5">
                      {['t_centralen', 'slussen', 'odenplan', 'fridhemsplan', 'gullmarsplan', 'liljeholmen', 'alvik'].map((hId) => {
                        const st = stations.find((s) => s.id === hId);
                        if (!st) return null;
                        const isSel = stationId === st.id;
                        return (
                          <button
                            key={hId}
                            type="button"
                            onClick={() => {
                              setStationId(st.id);
                              setEntranceExitId('');
                            }}
                            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all border ${
                              isSel
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                            }`}
                          >
                            {st.name}
                          </button>
                        );
                      })}
                    </div>

                    {/* Station Dropdown */}
                    <select
                      value={stationId}
                      onChange={(e) => {
                        setStationId(e.target.value);
                        setEntranceExitId('');
                      }}
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-extrabold focus:border-emerald-500 outline-none"
                    >
                      {filteredStations.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name} (Zon {st.zone})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Station Area Specifics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                        5. {lang === 'es' ? 'Zona de la estación' : lang === 'en' ? 'Station area' : 'Plats på stationen'}
                      </label>
                      <select
                        value={stationArea}
                        onChange={(e) => setStationArea(e.target.value as StationArea)}
                        className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-emerald-500 outline-none"
                      >
                        <option value="sparrar">🎟️ {lang === 'es' ? 'Torniquetes / Barreras' : 'Spärrar / Biljettkontroll'}</option>
                        <option value="perrong">🚉 {lang === 'es' ? 'Andén' : 'Perrong / Spår'}</option>
                        <option value="biljetthall">🏢 {lang === 'es' ? 'Vestíbulo' : 'Biljetthall'}</option>
                        <option value="trappa">🪜 {lang === 'es' ? 'Escaleras mecánicas' : 'Rulltrappa / Trappa'}</option>
                        <option value="hiss">🛗 {lang === 'es' ? 'Ascensor' : 'Hiss (Tillgänglighet)'}</option>
                        <option value="uppgang">🚪 {lang === 'es' ? 'Entrada / Salida' : 'Uppgång / Entré'}</option>
                        <option value="annan">📍 {lang === 'es' ? 'Otra zona' : 'Annan plats'}</option>
                      </select>
                    </div>

                    {selectedStation && selectedStation.entrances && selectedStation.entrances.length > 0 && (
                      <div>
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                          {lang === 'es' ? 'Salida / Acceso específico' : 'Specifik uppgång (valfritt)'}
                        </label>
                        <select
                          value={entranceExitId}
                          onChange={(e) => setEntranceExitId(e.target.value)}
                          className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-emerald-500 outline-none"
                        >
                          <option value="">-- {lang === 'es' ? 'Toda la estación' : 'Hela stationen'} --</option>
                          {selectedStation.entrances.map((ent) => (
                            <option key={ent.id} value={ent.id}>
                              {ent.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* In Vehicle or Between Stations */}
              {(locationType === 'in_vehicle' || locationType === 'between_stations') && (
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        {lang === 'es' ? 'Desde la estación' : 'Från station'}
                      </label>
                      <select
                        value={fromStationId}
                        onChange={(e) => setFromStationId(e.target.value)}
                        className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                      >
                        {stations.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        {lang === 'es' ? 'Hacia la estación' : 'Till station'}
                      </label>
                      <select
                        value={toStationId}
                        onChange={(e) => setToStationId(e.target.value)}
                        className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                      >
                        {stations.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      {lang === 'es' ? 'Dirección del viaje' : 'Färdriktning'}
                    </label>
                    <input
                      type="text"
                      value={direction}
                      onChange={(e) => setDirection(e.target.value)}
                      placeholder="T.ex. Mot Kungsträdgården, Mot Hässelby..."
                      className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Bus Stop */}
              {locationType === 'bus_stop' && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {lang === 'es' ? 'Nombre de la parada' : 'Hållplatsnamn'}
                  </label>
                  <input
                    type="text"
                    value={stopName}
                    onChange={(e) => setStopName(e.target.value)}
                    placeholder="T.ex. Odenplan läge B, Fridhemsplan..."
                    className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 4: COMMENT & FAST QUICK-TAGS */}
          {/* ========================================================= */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {lang === 'es' ? 'Añadir etiquetas rápidas con 1 toque:' : lang === 'en' ? 'Quick tags:' : 'Snabbtaggar med 1 klick:'}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddTagToComment(tag)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-bold text-slate-200 transition-all active:scale-95"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {lang === 'es' ? 'Descripción u observación (opcional):' : lang === 'en' ? 'Additional notes (optional):' : 'Observation eller kommentar (valfritt):'}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={lang === 'es' ? 'Ej. Problemas en los torniquetes, tiempo de espera aprox 10 min...' : t('commentPlaceholder')}
                  rows={4}
                  maxLength={250}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs sm:text-sm focus:border-emerald-500 outline-none resize-none"
                />
                <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                  <span>{lang === 'es' ? 'La información precisa ayuda a toda la comunidad.' : 'Konstruktiv information hjälper andra resenärer.'}</span>
                  <span>{comment.length}/250</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 5: REVIEW & 1-CLICK PUBLISH */}
          {/* ========================================================= */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-3 shadow-inner">
                {/* Category & Subcategory */}
                <div className="flex items-center gap-2">
                  <span 
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: currentCategory?.color || '#10B981' }}
                  />
                  <span className="font-bold text-slate-200 text-sm">
                    {getLocalizedText(currentCategory?.name, lang, currentCategory?.id)}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-emerald-400 font-extrabold text-sm">
                    {subcategoryName}
                  </span>
                </div>

                {/* Location Details */}
                <div className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-700/60">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{currentLine?.name}</span>
                  </div>

                  {locationType === 'station' && (
                    <div className="pl-5 text-slate-400">
                      <span className="font-semibold text-slate-200">📍 {selectedStation?.name}</span>
                      {selectedEntrance && (
                        <span> · 🚪 {selectedEntrance.name}</span>
                      )}
                      <span className="capitalize"> ({stationArea})</span>
                    </div>
                  )}

                  {(locationType === 'in_vehicle' || locationType === 'between_stations') && (
                    <div className="pl-5 text-slate-400">
                      <span>🚇 {stations.find((s) => s.id === fromStationId)?.name}</span>
                      <span> → {stations.find((s) => s.id === toStationId)?.name}</span>
                      {direction && <span> ({direction})</span>}
                    </div>
                  )}

                  {locationType === 'bus_stop' && (
                    <div className="pl-5 text-slate-400">
                      <span>🚏 {stopName || 'Hållplats'}</span>
                    </div>
                  )}
                </div>

                {comment && (
                  <div className="text-xs bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/60 text-slate-300 italic">
                    "{comment}"
                  </div>
                )}
              </div>

              {/* Confidence Points Highlight */}
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">{lang === 'es' ? 'Publicación en tiempo real' : 'Realtidspublicering'}</div>
                  <div className="text-[11px] text-emerald-400/80 mt-0.5">
                    {lang === 'es' 
                      ? 'Tu reporte se transmitirá inmediatamente a todos los pasajeros y otorgará +15 puntos de reputación al confirmarse.' 
                      : 'Rapporten visas direkt på kartan och genererar +15 förtroendepoäng vid bekräftelse.'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{lang === 'es' ? 'Atrás' : t('back')}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsReportModalOpen(false)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              {lang === 'es' ? 'Cancelar' : t('cancel')}
            </button>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
            >
              <span>{lang === 'es' ? 'Siguiente' : t('next')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 active:scale-95 transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isSubmitting ? (lang === 'es' ? 'Publicando...' : 'Publicerar...') : (lang === 'es' ? 'Publicar Reporte' : t('publishButton'))}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
