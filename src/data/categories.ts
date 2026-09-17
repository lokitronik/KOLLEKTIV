import { CategoryDefinition } from '../types';

export const INITIAL_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'sakerhet',
    name: {
      sv: 'Säkerhet',
      en: 'Safety & Security',
      es: 'Seguridad'
    },
    icon: 'AlertTriangle',
    color: '#EF4444', // red-500
    bgColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    defaultExpiryMinutes: 45,
    subcategories: [
      {
        id: 'brak_konflikt',
        name: { sv: 'Bråk / Konflikt', en: 'Fight / Altercation', es: 'Pelea / Conflicto' },
        severity: 'high',
        defaultExpiryMinutes: 30
      },
      {
        id: 'personskada',
        name: { sv: 'Personskada / Sjukdom', en: 'Injured Person / Medical', es: 'Persona herida / Médica' },
        severity: 'critical',
        defaultExpiryMinutes: 45
      },
      {
        id: 'nodlage',
        name: { sv: 'Nödläge / Evakuering', en: 'Emergency / Evacuation', es: 'Emergencia / Evacuación' },
        severity: 'critical',
        defaultExpiryMinutes: 60
      },
      {
        id: 'polis',
        name: { sv: 'Polisinsats / Ordningsvakt', en: 'Police / Security Staff', es: 'Policía / Seguridad' },
        severity: 'medium',
        defaultExpiryMinutes: 45
      },
      {
        id: 'ambulans',
        name: { sv: 'Ambulans på plats', en: 'Ambulance on Site', es: 'Ambulancia en el lugar' },
        severity: 'high',
        defaultExpiryMinutes: 45
      },
      {
        id: 'farligt_beteende',
        name: { sv: 'Farligt / Otryggt beteende', en: 'Hazardous / Unsafe Behavior', es: 'Comportamiento peligroso' },
        severity: 'medium',
        defaultExpiryMinutes: 40
      }
    ]
  },
  {
    id: 'drift',
    name: {
      sv: 'Drift & Trafik',
      en: 'Operations & Traffic',
      es: 'Operaciones y Tráfico'
    },
    icon: 'Construction',
    color: '#F59E0B', // amber-500
    bgColor: '#FFFBEB',
    borderColor: '#FCD34D',
    defaultExpiryMinutes: 120,
    subcategories: [
      {
        id: 'forsening',
        name: { sv: 'Kraftig försening', en: 'Major Delay', es: 'Retraso importante' },
        severity: 'medium',
        defaultExpiryMinutes: 90
      },
      {
        id: 'stilla_tag',
        name: { sv: 'Stilla tåg på spår', en: 'Train Stopped on Track', es: 'Tren parado en vía' },
        severity: 'high',
        defaultExpiryMinutes: 60
      },
      {
        id: 'installd_avgång',
        name: { sv: 'Inställd avgång / Buss', en: 'Cancelled Departure / Bus', es: 'Salida / Autobús cancelado' },
        severity: 'medium',
        defaultExpiryMinutes: 90
      },
      {
        id: 'stangd_station',
        name: { sv: 'Stängd station', en: 'Station Closed', es: 'Estación cerrada' },
        severity: 'critical',
        defaultExpiryMinutes: 240
      },
      {
        id: 'stangd_uppgang',
        name: { sv: 'Stängd uppgång / Entré', en: 'Closed Entrance / Exit', es: 'Entrada / Salida cerrada' },
        severity: 'medium',
        defaultExpiryMinutes: 180
      },
      {
        id: 'rulltrappa_ur_funktion',
        name: { sv: 'Rulltrappa ur funktion', en: 'Escalator Out of Order', es: 'Escalera mecánica averiada' },
        severity: 'low',
        defaultExpiryMinutes: 360
      },
      {
        id: 'hiss_ur_funktion',
        name: { sv: 'Hiss ur funktion (tillgänglighet)', en: 'Elevator Out of Order', es: 'Ascensor fuera de servicio' },
        severity: 'medium',
        defaultExpiryMinutes: 360
      },
      {
        id: 'sparrproblem',
        name: { sv: 'Spärrar ur funktion / Köer', en: 'Ticket Barrier Glitch / Queues', es: 'Problemas en torniquetes / barreras' },
        severity: 'low',
        defaultExpiryMinutes: 120
      }
    ]
  },
  {
    id: 'fordon',
    name: {
      sv: 'Fordon',
      en: 'Vehicle Issues',
      es: 'Vehículo'
    },
    icon: 'TrainTrack',
    color: '#3B82F6', // blue-500
    bgColor: '#EFF6FF',
    borderColor: '#93C5FD',
    defaultExpiryMinutes: 60,
    subcategories: [
      {
        id: 'problem_i_tag',
        name: { sv: 'Tekniskt problem i tåget', en: 'Issue Inside Train', es: 'Problema en el tren' },
        severity: 'medium',
        defaultExpiryMinutes: 45
      },
      {
        id: 'problem_i_buss',
        name: { sv: 'Problem i bussen', en: 'Issue Inside Bus', es: 'Problema en el autobús' },
        severity: 'medium',
        defaultExpiryMinutes: 45
      },
      {
        id: 'fordon_stoppat',
        name: { sv: 'Fordon stillastående', en: 'Vehicle Halted / Break', es: 'Vehículo detenido' },
        severity: 'high',
        defaultExpiryMinutes: 30
      },
      {
        id: 'extrem_trangsel',
        name: { sv: 'Extrem trängsel / Fullpackat', en: 'Extreme Overcrowding', es: 'Vehículo excesivamente lleno' },
        severity: 'low',
        defaultExpiryMinutes: 45
      },
      {
        id: 'annat_fordonsproblem',
        name: { sv: 'Annat fordonsproblem', en: 'Other Vehicle Issue', es: 'Otro problema en vehículo' },
        severity: 'low',
        defaultExpiryMinutes: 60
      }
    ]
  },
  {
    id: 'station',
    name: {
      sv: 'Station & Miljö',
      en: 'Station & Facilities',
      es: 'Estación e Instalaciones'
    },
    icon: 'Building2',
    color: '#8B5CF6', // purple-500
    bgColor: '#F5F3FF',
    borderColor: '#C4B5FD',
    defaultExpiryMinutes: 120,
    subcategories: [
      {
        id: 'biljetthall_ko',
        name: { sv: 'Extrem kö i biljetthall', en: 'Extreme Queues in Ticket Hall', es: 'Colas en el vestíbulo' },
        severity: 'low',
        defaultExpiryMinutes: 60
      },
      {
        id: 'perrong_trangsel',
        name: { sv: 'Trängsel på perrong', en: 'Overcrowded Platform', es: 'Andén saturado' },
        severity: 'medium',
        defaultExpiryMinutes: 45
      },
      {
        id: 'smuts_nedskrapning',
        name: { sv: 'Spill / Nedskräpning / Rengöring', en: 'Spill / Cleaning Needed', es: 'Limpieza necesaria' },
        severity: 'low',
        defaultExpiryMinutes: 120
      },
      {
        id: 'fel_pa_skyltar',
        name: { sv: 'Informationsskyltar ur funktion', en: 'Display Screens Offline', es: 'Pantallas informativas apagadas' },
        severity: 'low',
        defaultExpiryMinutes: 180
      }
    ]
  },
  {
    id: 'aktivitet',
    name: {
      sv: 'Aktivitet & Närvaro',
      en: 'Activity & Presence',
      es: 'Actividad y Presencia'
    },
    icon: 'Users',
    color: '#10B981', // emerald-500
    bgColor: '#ECFDF5',
    borderColor: '#6EE7B7',
    defaultExpiryMinutes: 45,
    subcategories: [
      {
        id: 'biljettkontroll',
        name: { sv: 'Biljettkontroll observerad', en: 'Ticket Inspection Observed', es: 'Control de billetes observado' },
        severity: 'low',
        defaultExpiryMinutes: 45
      },
      {
        id: 'trygghetsvardar',
        name: { sv: 'Trygghetsvärdar / Ordningsvakter', en: 'Safety Hosts / Marshals', es: 'Personal de seguridad / Auxiliares' },
        severity: 'low',
        defaultExpiryMinutes: 60
      },
      {
        id: 'evenemangsfolkmassa',
        name: { sv: 'Evenemangsaktivitet / Match / Konsert', en: 'Event Activity / Concert / Sports', es: 'Evento / Concierto / Partido' },
        severity: 'low',
        defaultExpiryMinutes: 120
      },
      {
        id: 'allman_observation',
        name: { sv: 'Allmän närvaro / Observation', en: 'General Presence / Observation', es: 'Observación general' },
        severity: 'low',
        defaultExpiryMinutes: 45
      }
    ]
  },
  {
    id: 'annat',
    name: {
      sv: 'Annat',
      en: 'Other',
      es: 'Otro'
    },
    icon: 'HelpCircle',
    color: '#6B7280', // gray-500
    bgColor: '#F9FAFB',
    borderColor: '#D1D5DB',
    defaultExpiryMinutes: 60,
    subcategories: [
      {
        id: 'hittegods',
        name: { sv: 'Upphittat föremål / Hittegods', en: 'Lost & Found Item', es: 'Objeto perdido / encontrado' },
        severity: 'low',
        defaultExpiryMinutes: 180
      },
      {
        id: 'vaderpaverkan',
        name: { sv: 'Väderpåverkan (Halka, Snö, Regn)', en: 'Weather (Ice, Snow, Water)', es: 'Afección meteorológica (hielo, nieve)' },
        severity: 'medium',
        defaultExpiryMinutes: 120
      },
      {
        id: 'ovrigt',
        name: { sv: 'Övrig beskrivning', en: 'Other Description', es: 'Otra descripción' },
        severity: 'low',
        defaultExpiryMinutes: 60
      }
    ]
  }
];
