export type Language = 'sv' | 'en' | 'es';

export const TRANSLATIONS = {
  sv: {
    appName: 'KollektivAlert',
    tagline: 'Samhällsrapportering i realtid för kollektivtrafiken',
    disclaimer: 'Rapporter skapas av användare och kan vara felaktiga eller inaktuella. Ej officiell SL-information.',
    demoDataNotice: 'DRIFTLÄGE AKTIVT',
    
    // Nav
    navMap: 'Karta',
    navFeed: 'Rapporter',
    navFavorites: 'Favoriter',
    navStats: 'Statistik',
    navProfile: 'Profil',
    navAdmin: 'Admin',
    btnReport: '+ Rapportera',
    
    // Statuses
    statusActive: 'Aktiv',
    statusResolved: 'Löst',
    statusExpired: 'Utgången',
    
    // Confidence
    confHigh: 'Hög tillförlitlighet',
    confMedium: 'Osäker',
    confLow: 'Ej verifierad',
    
    // Questions
    isStillActive: 'Är detta fortfarande aktuellt?',
    btnYesStillHere: 'Ja, jag ser det',
    btnNoLongerHere: 'Nej, inte längre / Löst',
    alreadyVoted: 'Du har redan bekräftat denna rapport',
    
    // Confirmations
    confirmations: 'bekräftelser',
    refutations: 'avvisningar',
    reportedAgo: 'Rapporterad för',
    minAgo: 'min sedan',
    hourAgo: 'tim sedan',
    justNow: 'just nu',
    
    // Report Wizard Flow
    wizardTitle: 'Rapportera incident',
    step1Title: 'Steg 1 — Vad händer?',
    step1Subtitle: 'Välj incidentkategori',
    step2Title: 'Steg 2 — Vad exakt?',
    step2Subtitle: 'Specificera händelsetyp',
    step3Title: 'Var händer det?',
    step3Subtitle: 'Välj transportslag och plats',
    step4Title: 'Steg 4 — Kommentar',
    step4Subtitle: 'Valfri detaljbeskrivning',
    step5Title: 'Steg 5 — Granska & Publicera',
    
    // Location choices
    locTypeStation: 'På en station',
    locTypeInVehicle: 'I ett fordon (tåg/buss)',
    locTypeBetween: 'Mellan två stationer',
    locTypeBusStop: 'Vid en busshållplats',
    
    // Station areas
    areaSpärrar: 'Spärrar',
    areaPerrong: 'Perrong',
    areaBiljetthall: 'Biljetthall',
    areaTrappa: 'Trappa / Rulltrappa',
    areaUppgang: 'Uppgång / Entré',
    areaHiss: 'Hiss',
    areaAnnan: 'Annan plats på stationen',
    
    // Fields
    selectTransport: 'Välj transportslag',
    selectLine: 'Välj linje',
    selectStation: 'Välj station',
    selectEntrance: 'Välj uppgång / entré',
    selectDirection: 'Välj färdriktning',
    selectFromStation: 'Från station',
    selectToStation: 'Till station',
    commentPlaceholder: 'T.ex. Problem vid spärrarna, väntetid ca 10 min...',
    publishButton: 'Publicera rapport',
    cancel: 'Avbryt',
    back: 'Tillbaka',
    next: 'Nästa',
    
    // Filters
    filterAll: 'Alla',
    filterTransport: 'Transportslag',
    filterCategory: 'Kategori',
    filterTime: 'Tidsintervall',
    filterLast5Min: 'Senaste 5 min',
    filterLast15Min: 'Senaste 15 min',
    filterLastHour: 'Senaste timmen',
    filterToday: 'Idag',
    searchPlaceholder: 'Sök station, linje (t.ex. Odenplan, Blå linje)...',
    
    // Feed
    latestReports: 'Senaste rapporter',
    noReportsFound: 'Inga aktiva rapporter matchar dina filter',
    feedEmptyTitle: 'Inga aktiva incidenter',
    feedEmptyDesc: 'Kollektivtrafiken flyter på normalt och inga incidenter eller störningar har rapporterats in ännu.',
    reportIncidentBtn: 'Rapportera en händelse',
    
    // Favorites
    favoritesTitle: 'Mina sparade stationer & linjer',
    favoriteStations: 'Stationer',
    favoriteLines: 'Linjer',
    noFavorites: 'Du har inga sparade favoriter ännu. Tryck på stjärnan vid en station för att bevaka den.',
    addFavorite: 'Lägg till favorit',
    
    // Stats
    statsTitle: 'Statistik & Analys',
    statsDisclaimer: 'Aggregerade data utan personuppgifter för ökad överblick.',
    incidents30Days: 'Incidenter senaste 30 dagarna',
    mostFrequentCategory: 'Mest frekventa kategori',
    peakIncidentHours: 'Tid på dygnet med flest incidenter',
    activeIncidentsRightNow: 'Aktiva incidenter just nu',
    
    // Profile
    profileTitle: 'Min Pendlareprofil',
    reputationScore: 'Förtroendepoäng',
    reputationLevel: 'Nivå',
    accuracyRate: 'Träffsäkerhet',
    totalReportsCreated: 'Skapade rapporter',
    totalConfirmationsGiven: 'Gjorda bekräftelser',
    accountAge: 'Konto skapat',
    privacySection: 'Integritet & GDPR',
    btnExportData: 'Exportera mina data (JSON)',
    btnDeleteAccount: 'Radera mitt konto',
    legalDisclaimer: 'Villkor & Integritetspolicy',
    
    // Moderation
    flagReport: 'Rapportera olämpligt innehåll',
    flagReasonSpam: 'Spam / Skräppost',
    flagReasonFalse: 'Falsk information',
    flagReasonInappropriate: 'Olämpligt språk eller trakasseri',
    flagReasonOther: 'Annat',
    flagSuccess: 'Tack! Rapporten har skickats till granskning.',
    
    // Admin
    adminDashboard: 'Administrationspanel',
    adminReports: 'Rapporthantering',
    adminCategories: 'Kategorier & Livslängd',
    adminUsers: 'Användare & Rykte',
    adminModerationQueue: 'Granskningskö'
  },
  en: {
    appName: 'TransitAlert',
    tagline: 'Real-time community reporting for public transit',
    disclaimer: 'Reports are created by users and may be inaccurate or outdated. Not an official transit operator service.',
    demoDataNotice: 'LIVE SYNC ACTIVE',
    
    // Nav
    navMap: 'Map',
    navFeed: 'Feed',
    navFavorites: 'Favorites',
    navStats: 'Analytics',
    navProfile: 'Profile',
    navAdmin: 'Admin',
    btnReport: '+ Report',
    
    // Statuses
    statusActive: 'Active',
    statusResolved: 'Resolved',
    statusExpired: 'Expired',
    
    // Confidence
    confHigh: 'High Reliability',
    confMedium: 'Uncertain',
    confLow: 'Unverified',
    
    // Questions
    isStillActive: 'Is this still active right now?',
    btnYesStillHere: 'Yes, I see it',
    btnNoLongerHere: 'No, no longer / Resolved',
    alreadyVoted: 'You have already confirmed this report',
    
    // Confirmations
    confirmations: 'confirmations',
    refutations: 'refutations',
    reportedAgo: 'Reported',
    minAgo: 'min ago',
    hourAgo: 'h ago',
    justNow: 'just now',
    
    // Report Wizard Flow
    wizardTitle: 'Report Incident',
    step1Title: 'Step 1 — What happened?',
    step1Subtitle: 'Select category',
    step2Title: 'Step 2 — What exactly?',
    step2Subtitle: 'Specify incident type',
    step3Title: 'Where did it happen?',
    step3Subtitle: 'Choose transit mode & location',
    step4Title: 'Step 4 — Comment',
    step4Subtitle: 'Optional details',
    step5Title: 'Step 5 — Review & Publish',
    
    // Location choices
    locTypeStation: 'At a station',
    locTypeInVehicle: 'Inside a vehicle (train/bus)',
    locTypeBetween: 'Between two stations',
    locTypeBusStop: 'At a bus stop',
    
    // Station areas
    areaSpärrar: 'Barriers / Turnstiles',
    areaPerrong: 'Platform',
    areaBiljetthall: 'Ticket Hall',
    areaTrappa: 'Stairs / Escalators',
    areaUppgang: 'Entrance / Exit',
    areaHiss: 'Elevator',
    areaAnnan: 'Other station area',
    
    // Fields
    selectTransport: 'Select transit type',
    selectLine: 'Select line',
    selectStation: 'Select station',
    selectEntrance: 'Select entrance/exit',
    selectDirection: 'Select direction',
    selectFromStation: 'From station',
    selectToStation: 'To station',
    commentPlaceholder: 'E.g. Issue at the turnstiles, delays approx 10 mins...',
    publishButton: 'Publish Report',
    cancel: 'Cancel',
    back: 'Back',
    next: 'Next',
    
    // Filters
    filterAll: 'All',
    filterTransport: 'Transit Mode',
    filterCategory: 'Category',
    filterTime: 'Time Window',
    filterLast5Min: 'Last 5 min',
    filterLast15Min: 'Last 15 min',
    filterLastHour: 'Last hour',
    filterToday: 'Today',
    searchPlaceholder: 'Search station, line (e.g. Odenplan, Green line)...',
    
    // Feed
    latestReports: 'Latest Reports',
    noReportsFound: 'No active reports match your filters',
    feedEmptyTitle: 'No active incidents',
    feedEmptyDesc: 'Transit is running smoothly. No passengers or staff have reported any disruptions yet.',
    reportIncidentBtn: 'Report an incident',
    
    // Favorites
    favoritesTitle: 'My Saved Stations & Lines',
    favoriteStations: 'Stations',
    favoriteLines: 'Lines',
    noFavorites: 'No favorites saved yet. Tap the star on any station to watch it.',
    addFavorite: 'Add favorite',
    
    // Stats
    statsTitle: 'Analytics & Insights',
    statsDisclaimer: 'Aggregated statistical metrics with zero personal identifiable info.',
    incidents30Days: 'Incidents in the last 30 days',
    mostFrequentCategory: 'Most frequent category',
    peakIncidentHours: 'Peak incident time window',
    activeIncidentsRightNow: 'Active incidents right now',
    
    // Profile
    profileTitle: 'My Commuter Profile',
    reputationScore: 'Trust Score',
    reputationLevel: 'Tier',
    accuracyRate: 'Accuracy',
    totalReportsCreated: 'Reports created',
    totalConfirmationsGiven: 'Confirmations submitted',
    accountAge: 'Member since',
    privacySection: 'Privacy & GDPR',
    btnExportData: 'Export my data (JSON)',
    btnDeleteAccount: 'Delete my account',
    legalDisclaimer: 'Terms & Privacy Policy',
    
    // Moderation
    flagReport: 'Report inappropriate content',
    flagReasonSpam: 'Spam',
    flagReasonFalse: 'False information',
    flagReasonInappropriate: 'Inappropriate language or harassment',
    flagReasonOther: 'Other',
    flagSuccess: 'Thank you! Report submitted for moderation review.',
    
    // Admin
    adminDashboard: 'Admin Dashboard',
    adminReports: 'Report Management',
    adminCategories: 'Categories & Expiry Rules',
    adminUsers: 'Users & Trust Scores',
    adminModerationQueue: 'Moderation Queue'
  },
  es: {
    appName: 'KollektivAlert',
    tagline: 'Información comunitaria en tiempo real para el transporte público',
    disclaimer: 'Los informes son creados por los usuarios y pueden estar desactualizados. No es un servicio oficial de SL.',
    demoDataNotice: 'EN VIVO Y OPERATIVO',
    
    // Nav
    navMap: 'Mapa',
    navFeed: 'Reportes',
    navFavorites: 'Favoritos',
    navStats: 'Estadísticas',
    navProfile: 'Perfil',
    navAdmin: 'Admin',
    btnReport: '+ Rapportera',
    
    // Statuses
    statusActive: 'Activo',
    statusResolved: 'Resuelto',
    statusExpired: 'Caducado',
    
    // Confidence
    confHigh: 'Hög tillförlitlighet',
    confMedium: 'Osäker',
    confLow: 'Ej verifierad',
    
    // Questions
    isStillActive: '¿Sigue esto ocurriendo ahora?',
    btnYesStillHere: 'Ja, jag ser det (Sí, lo veo)',
    btnNoLongerHere: 'Nej, inte längre / Löst (Ya no / Resuelto)',
    alreadyVoted: 'Ya has emitido tu confirmación sobre este reporte',
    
    // Confirmations
    confirmations: 'confirmaciones',
    refutations: 'rechazos',
    reportedAgo: 'Reportado hace',
    minAgo: 'min',
    hourAgo: 'h',
    justNow: 'justo ahora',
    
    // Report Wizard Flow
    wizardTitle: 'Rapportera incidens',
    step1Title: 'Paso 1 — Vad händer? (¿Qué ocurre?)',
    step1Subtitle: 'Selecciona la categoría',
    step2Title: 'Paso 2 — Vad exakt? (¿Qué exactamente?)',
    step2Subtitle: 'Selecciona el tipo concreto de incidencia',
    step3Title: 'Paso 3 — Var? (¿Dónde?)',
    step3Subtitle: 'Transporte, línea y ubicación estructurada',
    step4Title: 'Paso 4 — Kommentar',
    step4Subtitle: 'Descripción opcional',
    step5Title: 'Paso 5 — Publicera rapport',
    
    // Location choices
    locTypeStation: 'En una estación',
    locTypeInVehicle: 'Dentro de un vehículo (tren/bus)',
    locTypeBetween: 'Entre dos estaciones',
    locTypeBusStop: 'En una parada de autobús',
    
    // Station areas
    areaSpärrar: 'Spärrar (Barreras/Torniquetes)',
    areaPerrong: 'Perrong (Andén)',
    areaBiljetthall: 'Biljetthall (Vestíbulo)',
    areaTrappa: 'Trappa / Rulltrappa (Escaleras)',
    areaUppgang: 'Uppgång (Salida/Entrada)',
    areaHiss: 'Hiss (Ascensor)',
    areaAnnan: 'Annan plats (Otro lugar en la estación)',
    
    // Fields
    selectTransport: 'Selecciona transporte',
    selectLine: 'Selecciona línea',
    selectStation: 'Selecciona estación',
    selectEntrance: 'Selecciona salida / uppgång',
    selectDirection: 'Selecciona dirección',
    selectFromStation: 'Estación de origen',
    selectToStation: 'Estación siguiente',
    commentPlaceholder: 'Ej: Problemas en las barreras, rulltrappa stängd...',
    publishButton: 'Publicera rapport',
    cancel: 'Cancelar',
    back: 'Atrás',
    next: 'Siguiente',
    
    // Filters
    filterAll: 'Todo',
    filterTransport: 'Transporte',
    filterCategory: 'Categoría',
    filterTime: 'Tiempo',
    filterLast5Min: 'Últimos 5 min',
    filterLast15Min: 'Últimos 15 min',
    filterLastHour: 'Última hora',
    filterToday: 'Hoy',
    searchPlaceholder: 'Buscar estación, línea (ej: Odenplan, Grön linje)...',
    
    // Feed
    latestReports: 'Senaste rapporter (Últimos reportes)',
    noReportsFound: 'No hay reportes activos que coincidan con los filtros',
    feedEmptyTitle: 'No hay incidencias activas',
    feedEmptyDesc: 'El transporte público opera con normalidad. Ningún usuario ha registrado incidencias o retrasos por el momento.',
    reportIncidentBtn: 'Registrar nueva incidencia',
    
    // Favorites
    favoritesTitle: 'Mis estaciones y líneas guardadas',
    favoriteStations: 'Estaciones',
    favoriteLines: 'Líneas',
    noFavorites: 'Aún no tienes favoritos guardados. Pulsa la estrella en una estación para monitorearla.',
    addFavorite: 'Añadir favorito',
    
    // Stats
    statsTitle: 'Estadísticas y Análisis',
    statsDisclaimer: 'Datos agregados sin información personal del usuario.',
    incidents30Days: 'Incidencias últimos 30 días',
    mostFrequentCategory: 'Categoría más frecuente',
    peakIncidentHours: 'Horario con más incidencias',
    activeIncidentsRightNow: 'Incidencias activas en este momento',
    
    // Profile
    profileTitle: 'Mi Perfil de Pasajero',
    reputationScore: 'Puntuación de confianza',
    reputationLevel: 'Nivel',
    accuracyRate: 'Precisión',
    totalReportsCreated: 'Reportes creados',
    totalConfirmationsGiven: 'Confirmaciones realizadas',
    accountAge: 'Antigüedad de cuenta',
    privacySection: 'Privacidad y GDPR',
    btnExportData: 'Exportar mis datos (JSON)',
    btnDeleteAccount: 'Eliminar mi cuenta',
    legalDisclaimer: 'Términos y Política de Privacidad',
    
    // Moderation
    flagReport: 'Denunciar reporte',
    flagReasonSpam: 'Spam',
    flagReasonFalse: 'Falsk information (Información falsa)',
    flagReasonInappropriate: 'Olämpligt innehåll (Contenido inapropiado)',
    flagReasonOther: 'Annat (Otro)',
    flagSuccess: 'Gracias. El reporte ha sido enviado al equipo de moderación.',
    
    // Admin
    adminDashboard: 'Panel de Administración',
    adminReports: 'Gestión de Reportes',
    adminCategories: 'Categorías y Caducidad',
    adminUsers: 'Usuarios y Reputación',
    adminModerationQueue: 'Cola de Moderación'
  }
};
