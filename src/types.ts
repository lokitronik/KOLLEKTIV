export type TransportType =
  | 'tunnelbana'
  | 'pendeltag'
  | 'buss'
  | 'sparvag'
  | 'tvarbanan'
  | 'roslagsbanan'
  | 'saltsjobanan'
  | 'other';

export type CategoryId =
  | 'sakerhet'
  | 'drift'
  | 'fordon'
  | 'station'
  | 'aktivitet'
  | 'annat';

export type LocationType =
  | 'station'
  | 'in_vehicle'
  | 'between_stations'
  | 'bus_stop';

export type StationArea =
  | 'sparrar'
  | 'perrong'
  | 'biljetthall'
  | 'trappa'
  | 'uppgang'
  | 'hiss'
  | 'annan';

export type ConfidenceLevel = 'hog' | 'osaker' | 'ej_verifierad';

export type ReportStatus = 'aktiv' | 'lost' | 'utgangen' | 'avvisad';

export type UserRole = 'user' | 'moderator' | 'admin';

export interface CategoryDefinition {
  id: CategoryId | string;
  name: { sv: string; en: string; es: string };
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  defaultExpiryMinutes: number;
  subcategories: {
    id: string;
    name: { sv: string; en: string; es: string };
    icon?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    defaultExpiryMinutes?: number;
  }[];
}

export interface EntranceExit {
  id: string;
  name: string;
  streetName?: string;
  accessible?: boolean;
}

export interface Station {
  id: string;
  name: string;
  transportTypes: TransportType[];
  lineIds: string[];
  coordinates: {
    lat: number;
    lng: number;
    svgX: number;
    svgY: number;
  };
  entrances: EntranceExit[];
  areas: StationArea[];
  zone: string;
}

export interface TransitLine {
  id: string;
  name: string;
  code: string;
  transportType: TransportType;
  color: string;
  textColor: string;
  operator: string;
  stations: string[]; // Station IDs in order
  directions: {
    from: string;
    to: string;
  }[];
}

export interface ReportConfirmation {
  id: string;
  reportId: string;
  userId: string;
  username: string;
  type: 'confirm' | 'reject'; // 'confirm' = Ja, jag ser det; 'reject' = Nej, inte längre / Löst
  createdAt: string;
  userReputation: number;
}

export interface ReportFlag {
  id: string;
  reportId: string;
  userId: string;
  reason: 'spam' | 'falsk_info' | 'olampligt' | 'annat';
  createdAt: string;
  comment?: string;
}

export interface StructuredLocation {
  transportType: TransportType;
  operator: string;
  city: string;
  country: string;
  lineId?: string;
  lineName?: string;
  lineColor?: string;
  locationType: LocationType;
  
  // For Station reports
  stationId?: string;
  stationName?: string;
  stationArea?: StationArea;
  entranceExitId?: string;
  entranceExitName?: string;
  
  // For in-vehicle or between stations
  direction?: string;
  currentStationId?: string;
  currentStationName?: string;
  fromStationId?: string;
  fromStationName?: string;
  toStationId?: string;
  toStationName?: string;
  
  // For bus stops
  stopName?: string;
}

export interface Report {
  id: string;
  userId: string;
  username: string;
  userReputation: number;
  
  category: CategoryId | string;
  subcategoryId: string;
  subcategoryName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  location: StructuredLocation;
  
  comment?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  
  status: ReportStatus;
  
  confidence: ConfidenceLevel;
  confidenceScore: number; // 0 - 100
  
  confirmationsCount: number;
  rejectionsCount: number;
  confirmations: ReportConfirmation[];
  
  flags: ReportFlag[];
  flaggedCount: number;
  
  isDemo?: boolean;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  role: UserRole;
  reputation: number;
  reputationTitle: string;
  createdAt: string;
  reportsCount: number;
  confirmationsCount: number;
  accurateReportsCount: number;
  refutedReportsCount: number;
  isBanned?: boolean;
  
  favoriteStations: string[];
  favoriteLines: string[];
  favoriteZones: string[];
  
  settings: {
    language: 'sv' | 'en' | 'es';
    notificationsEnabled: boolean;
    notifyOnFavorites: boolean;
    notifyOnSafetyOnly: boolean;
    mapStyle: 'schematic' | 'satellite' | 'standard';
  };
}

export interface StationStats {
  stationId: string;
  stationName: string;
  totalReports30Days: number;
  mostFrequentCategory: string;
  peakHourRange: string;
  activeCount: number;
  categoryBreakdown: { category: string; count: number; percentage: number }[];
  hourlyDistribution: { hour: number; count: number }[];
  resolutionRatePercent: number;
}
