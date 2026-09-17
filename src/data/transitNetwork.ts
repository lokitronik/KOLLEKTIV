import { Station, TransitLine, TransportType } from '../types';

export interface TransportNetworkHierarchy {
  country: string;
  countryCode: string;
  cities: {
    id: string;
    name: string;
    operators: {
      id: string;
      name: string;
      isDefault: boolean;
      transportTypes: TransportType[];
    }[];
  }[];
}

export const TRANSIT_HIERARCHY: TransportNetworkHierarchy = {
  country: 'Sverige',
  countryCode: 'SE',
  cities: [
    {
      id: 'stockholm',
      name: 'Stockholm',
      operators: [
        {
          id: 'sl',
          name: 'SL (Storstockholms Lokaltrafik)',
          isDefault: true,
          transportTypes: [
            'tunnelbana',
            'pendeltag',
            'tvarbanan',
            'sparvag',
            'roslagsbanan',
            'saltsjobanan',
            'buss'
          ]
        }
      ]
    },
    {
      id: 'goteborg',
      name: 'Göteborg',
      operators: [
        {
          id: 'vasttrafik',
          name: 'Västtrafik',
          isDefault: false,
          transportTypes: ['sparvag', 'buss', 'pendeltag']
        }
      ]
    },
    {
      id: 'malmo',
      name: 'Malmö / Skåne',
      operators: [
        {
          id: 'skanetrafiken',
          name: 'Skånetrafiken',
          isDefault: false,
          transportTypes: ['pendeltag', 'buss']
        }
      ]
    }
  ]
};

export const TRANSIT_LINES: TransitLine[] = [
  // Tunnelbana - Grön Linje
  {
    id: 'tb_green_17',
    name: 'Tunnelbana 17 (Grön)',
    code: 'T17',
    transportType: 'tunnelbana',
    color: '#10B981',
    textColor: '#FFFFFF',
    operator: 'SL',
    stations: [
      'hasselby_strand', 'hasselby_gard', 'vallingby', 'blackeberg', 'angbyplan',
      'akeshov', 'brommaplan', 'alvik', 'kristineberg', 'thorildsplan',
      'fridhemsplan', 'st_eriksplan', 'odenplan', 'radmansgatan', 'hotorget',
      't_centralen', 'gamla_stan', 'slussen', 'medborgarplatsen', 'skanstull',
      'gullmarsplan', 'skarmarbrink', 'hammarbyhojden', 'bjorkhagen', 'karrtorp',
      'bagarmossen', 'skarpnack'
    ],
    directions: [
      { from: 'Åkeshov / Hässelby strand', to: 'Skarpnäck' },
      { from: 'Skarpnäck', to: 'Åkeshov / Hässelby strand' }
    ]
  },
  {
    id: 'tb_green_18',
    name: 'Tunnelbana 18 (Grön)',
    code: 'T18',
    transportType: 'tunnelbana',
    color: '#10B981',
    textColor: '#FFFFFF',
    operator: 'SL',
    stations: [
      'hasselby_strand', 'hasselby_gard', 'vallingby', 'blackeberg', 'angbyplan',
      'akeshov', 'brommaplan', 'alvik', 'kristineberg', 'thorildsplan',
      'fridhemsplan', 'st_eriksplan', 'odenplan', 'radmansgatan', 'hotorget',
      't_centralen', 'gamla_stan', 'slussen', 'medborgarplatsen', 'skanstull',
      'gullmarsplan', 'skarmarbrink', 'blasut', 'sandsborg', 'skogskyrkogarden',
      'tallkrogen', 'gubbangen', 'hokarangen', 'farsta', 'farsta_strand'
    ],
    directions: [
      { from: 'Hässelby strand / Alvik', to: 'Farsta strand' },
      { from: 'Farsta strand', to: 'Alvik / Hässelby strand' }
    ]
  },
  {
    id: 'tb_green_19',
    name: 'Tunnelbana 19 (Grön)',
    code: 'T19',
    transportType: 'tunnelbana',
    color: '#10B981',
    textColor: '#FFFFFF',
    operator: 'SL',
    stations: [
      'hasselby_strand', 'hasselby_gard', 'vallingby', 'blackeberg', 'angbyplan',
      'akeshov', 'brommaplan', 'alvik', 'kristineberg', 'thorildsplan',
      'fridhemsplan', 'st_eriksplan', 'odenplan', 'radmansgatan', 'hotorget',
      't_centralen', 'gamla_stan', 'slussen', 'medborgarplatsen', 'skanstull',
      'gullmarsplan', 'globen', 'enskede_gard', 'sockenplan', 'svedmyra',
      'stureby', 'bandhagen', 'hogdalen', 'ragsved', 'hagsatra'
    ],
    directions: [
      { from: 'Hässelby strand', to: 'Hagsätra' },
      { from: 'Hagsätra', to: 'Hässelby strand' }
    ]
  },

  // Tunnelbana - Röd Linje
  {
    id: 'tb_red_13',
    name: 'Tunnelbana 13 (Röd)',
    code: 'T13',
    transportType: 'tunnelbana',
    color: '#EF4444',
    textColor: '#FFFFFF',
    operator: 'SL',
    stations: [
      'ropsten', 'gardet', 'karlaplan', 'ostermalmstorg', 't_centralen',
      'gamla_stan', 'slussen', 'mariatorget', 'zinkensdamm', 'hornstull',
      'liljeholmen', 'aspudden', 'ornsberg', 'axelsberg', 'malarhojden',
      'bredang', 'satra', 'skarholmen', 'varberg', 'varby_gard',
      'masmo', 'fittja', 'alby', 'hallunda', 'norsborg'
    ],
    directions: [
      { from: 'Ropsten', to: 'Norsborg' },
      { from: 'Norsborg', to: 'Ropsten' }
    ]
  },
  {
    id: 'tb_red_14',
    name: 'Tunnelbana 14 (Röd)',
    code: 'T14',
    transportType: 'tunnelbana',
    color: '#EF4444',
    textColor: '#FFFFFF',
    operator: 'SL',
    stations: [
      'morby_centrum', 'danderyds_sjukhus', 'bergshamra', 'universitetet',
      'tekniska_hogskolan', 'stadion', 'ostermalmstorg', 't_centralen',
      'gamla_stan', 'slussen', 'mariatorget', 'zinkensdamm', 'hornstull',
      'liljeholmen', 'midsommarkransen', 'telefonplan', 'hagerstensasen',
      'vastertorp', 'fruangen'
    ],
    directions: [
      { from: 'Mörby centrum', to: 'Fruängen' },
      { from: 'Fruängen', to: 'Mörby centrum' }
    ]
  },

  // Tunnelbana - Blå Linje
  {
    id: 'tb_blue_10',
    name: 'Tunnelbana 10 (Blå)',
    code: 'T10',
    transportType: 'tunnelbana',
    color: '#2563EB',
    textColor: '#FFFFFF',
    operator: 'SL',
    stations: [
      'hjulsta', 'tensta', 'rinkeby', 'rissne', 'duvbo', 'sundbyberg_c',
      'solna_strand', 'huvudsta', 'vastra_skogen', 'stadshagen',
      'fridhemsplan', 'radhuset', 't_centralen', 'kungstradgarden'
    ],
    directions: [
      { from: 'Hjulsta', to: 'Kungsträdgården' },
      { from: 'Kungsträdgården', to: 'Hjulsta' }
    ]
  },
  {
    id: 'tb_blue_11',
    name: 'Tunnelbana 11 (Blå)',
    code: 'T11',
    transportType: 'tunnelbana',
    color: '#2563EB',
    textColor: '#FFFFFF',
    operator: 'SL',
    stations: [
      'akalla', 'husby', 'kista', 'hallonbergen', 'nackrosen', 'solna_centrum',
      'vastra_skogen', 'stadshagen', 'fridhemsplan', 'radhuset',
      't_centralen', 'kungstradgarden'
    ],
    directions: [
      { from: 'Akalla', to: 'Kungsträdgården' },
      { from: 'Kungsträdgården', to: 'Akalla' }
    ]
  },

  // Pendeltåg
  {
    id: 'pendel_40',
    name: 'Pendeltåg 40 (Uppsala - Södertälje)',
    code: 'J40',
    transportType: 'pendeltag',
    color: '#EC4899',
    textColor: '#FFFFFF',
    operator: 'SL',
    stations: [
      'uppsala_c', 'knivsta', 'arlanda_c', 'marsta', 'upplands_vasby', 'rotebro', 'sollentuna',
      'helenelund', 'ulriksdal', 'solna_station', 'odenplan', 'stockholm_city', 'stockholm_sodra',
      'arstaberg', 'alvsjo', 'stuvsta', 'huddinge', 'flemingsberg',
      'tullinge', 'tumba', 'ronninge', 'ostertalje', 'sodertalje_c'
    ],
    directions: [
      { from: 'Uppsala / Arlanda C', to: 'Södertälje centrum' },
      { from: 'Södertälje centrum', to: 'Uppsala / Arlanda C' }
    ]
  },
  {
    id: 'pendel_43',
    name: 'Pendeltåg 43 (Bålsta - Nynäshamn)',
    code: 'J43',
    transportType: 'pendeltag',
    color: '#EC4899',
    textColor: '#FFFFFF',
    operator: 'SL',
    stations: [
      'balsta', 'bro', 'kungsangen', 'kallhall', 'jakobsberg', 'barkarby', 'spanga',
      'sundbyberg_c', 'odenplan', 'stockholm_city', 'stockholm_sodra',
      'arstaberg', 'alvsjo', 'farsta_strand', 'handen', 'vasterhaninge',
      'nynashamn'
    ],
    directions: [
      { from: 'Bålsta / Kungsängen', to: 'Nynäshamn' },
      { from: 'Nynäshamn', to: 'Bålsta / Kungsängen' }
    ]
  },

  // Tvärbanan
  {
    id: 'tvarbanan_30',
    name: 'Tvärbanan 30 (Solna station - Sickla)',
    code: 'L30',
    transportType: 'tvarbanan',
    color: '#F97316',
    textColor: '#FFFFFF',
    operator: 'SL',
    stations: [
      'solna_station', 'solna_centrum', 'solna_business_park', 'sundbyberg_c',
      'ballsta_bro', 'karlsbodavagen', 'norra_ulvsunda', 'johannesfred',
      'alvik', 'alviks_strand', 'stora_essingen', 'grondal', 'trekanten',
      'liljeholmen', 'arstadal', 'arstaberg', 'arstafaltet', 'valla_torg',
      'linde', 'globen', 'gullmarsplan', 'martensdal', 'luma',
      'sickla_kaj', 'sickla_udde', 'sickla'
    ],
    directions: [
      { from: 'Solna station', to: 'Sickla' },
      { from: 'Sickla', to: 'Solna station' }
    ]
  },
  {
    id: 'tvarbanan_31',
    name: 'Tvärbanan 31 (Bromma flygplats - Alviks strand)',
    code: 'L31',
    transportType: 'tvarbanan',
    color: '#F97316',
    textColor: '#FFFFFF',
    operator: 'SL',
    stations: [
      'bromma_flygplats', 'bromma_blocks', 'norra_ulvsunda', 'johannesfred',
      'alvik', 'alviks_strand'
    ],
    directions: [
      { from: 'Bromma flygplats', to: 'Alviks strand' },
      { from: 'Alviks strand', to: 'Bromma flygplats' }
    ]
  },

  // Roslagsbanan
  {
    id: 'roslagsbanan_27',
    name: 'Roslagsbanan 27/28/29 (Östra station - Kårsta / Österskär)',
    code: 'L27-29',
    transportType: 'roslagsbanan',
    color: '#8B5CF6',
    textColor: '#FFFFFF',
    operator: 'SL',
    stations: [
      'stockholms_ostra', 'universitetet', 'morby_roslag', 'djursholms_osby',
      'roslags_nasby', 'taby_centrum', 'akersberga', 'osterskar',
      'vallentuna', 'karsta', 'nasbypark'
    ],
    directions: [
      { from: 'Stockholms östra', to: 'Kårsta / Österskär / Näsbypark' },
      { from: 'Kårsta / Österskär / Näsbypark', to: 'Stockholms östra' }
    ]
  },

  // Saltsjöbanan
  {
    id: 'saltsjobanan_25',
    name: 'Saltsjöbanan 25/26 (Slussen - Saltsjöbaden / Solsidan)',
    code: 'L25-26',
    transportType: 'saltsjobanan',
    color: '#06B6D4',
    textColor: '#FFFFFF',
    operator: 'SL',
    stations: [
      'slussen', 'henriksdal', 'sickla', 'saltsjo_jarla', 'saltsjo_duvnas',
      'fisksatra', 'igelboda', 'saltsjobaden', 'solsidan'
    ],
    directions: [
      { from: 'Slussen / Sickla', to: 'Saltsjöbaden / Solsidan' },
      { from: 'Saltsjöbaden / Solsidan', to: 'Slussen / Sickla' }
    ]
  },

  // Lidingöbanan
  {
    id: 'lidingobanan_21',
    name: 'Lidingöbanan 21 (Ropsten - Gåshaga brygga)',
    code: 'L21',
    transportType: 'sparvag',
    color: '#EAB308',
    textColor: '#FFFFFF',
    operator: 'SL',
    stations: [
      'ropsten', 'torsvik', 'baggeby', 'bodal', 'larsberg', 'aga', 'skarsatra',
      'kottla', 'hogberga', 'brevik', 'kappala', 'talludden', 'gashaga', 'gashaga_brygga'
    ],
    directions: [
      { from: 'Ropsten', to: 'Gåshaga brygga' },
      { from: 'Gåshaga brygga', to: 'Ropsten' }
    ]
  },

  // Nockebybanan
  {
    id: 'nockebybanan_12',
    name: 'Nockebybanan 12 (Alvik - Nockeby)',
    code: 'L12',
    transportType: 'sparvag',
    color: '#A855F7',
    textColor: '#FFFFFF',
    operator: 'SL',
    stations: [
      'alvik', 'alleparken', 'klovervagen', 'smedslatten', 'alstensgatan', 
      'alstens_gard', 'sannadal', 'hoglandet', 'olovslund', 'nockeby_torg', 'nockeby'
    ],
    directions: [
      { from: 'Alvik', to: 'Nockeby' },
      { from: 'Nockeby', to: 'Alvik' }
    ]
  },

  // Stombussar
  {
    id: 'bus_4',
    name: 'Buss 4 (Radiohuset - Gullmarsplan)',
    code: 'B4',
    transportType: 'buss',
    color: '#0284C7',
    textColor: '#FFFFFF',
    operator: 'SL',
    stations: [
      'radiohuset', 'odenplan', 'st_eriksplan', 'fridhemsplan',
      'hornstull', 'stockholm_sodra', 'gullmarsplan'
    ],
    directions: [
      { from: 'Radiohuset', to: 'Gullmarsplan' },
      { from: 'Gullmarsplan', to: 'Radiohuset' }
    ]
  }
];

export const STATIONS: Station[] = [
  // --- CENTRAL CORE HUB ---
  {
    id: 't_centralen',
    name: 'T-Centralen',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_17', 'tb_green_18', 'tb_green_19', 'tb_red_13', 'tb_red_14', 'tb_blue_10', 'tb_blue_11'],
    coordinates: { lat: 59.3314, lng: 18.0604, svgX: 680, svgY: 480 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'trappa', 'uppgang', 'hiss'],
    entrances: [
      { id: 'tcent_sergel', name: 'Uppgång Sergels torg', streetName: 'Sergels torg' },
      { id: 'tcent_vasa', name: 'Uppgång Vasagatan / Centralstationen', streetName: 'Vasagatan 14' },
      { id: 'tcent_klara', name: 'Uppgång Klarabergsgatan', streetName: 'Klarabergsgatan 35' },
      { id: 'tcent_drottning', name: 'Uppgång Drottninggatan', streetName: 'Drottninggatan 48' },
      { id: 'tcent_gren', name: 'Uppgång Grenadjären (Blå linjen)', streetName: 'Klarabergsviadukten' }
    ]
  },
  {
    id: 'stockholm_city',
    name: 'Stockholm City',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_40', 'pendel_43'],
    coordinates: { lat: 59.3308, lng: 18.0588, svgX: 670, svgY: 495 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'trappa', 'uppgang', 'hiss'],
    entrances: [
      { id: 'sc_klara', name: 'Uppgång Klarabergsviadukten', streetName: 'Klarabergsviadukten' },
      { id: 'sc_vasa', name: 'Uppgång Vasagatan', streetName: 'Vasagatan 20' },
      { id: 'sc_sergel', name: 'Uppgång Sergels torg', streetName: 'Sergelgången' }
    ]
  },
  {
    id: 'gamla_stan',
    name: 'Gamla stan',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_17', 'tb_green_18', 'tb_green_19', 'tb_red_13', 'tb_red_14'],
    coordinates: { lat: 59.3235, lng: 18.0673, svgX: 700, svgY: 535 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'trappa', 'uppgang'],
    entrances: [
      { id: 'gs_munk', name: 'Uppgång Munkbroleden', streetName: 'Munkbron' },
      { id: 'gs_korn', name: 'Uppgång Kornhamnstorg', streetName: 'Mälartorget' }
    ]
  },
  {
    id: 'slussen',
    name: 'Slussen',
    transportTypes: ['tunnelbana', 'saltsjobanan', 'buss'],
    lineIds: ['tb_green_17', 'tb_green_18', 'tb_green_19', 'tb_red_13', 'tb_red_14', 'saltsjobanan_25'],
    coordinates: { lat: 59.3197, lng: 18.0722, svgX: 720, svgY: 570 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'trappa', 'uppgang', 'hiss'],
    entrances: [
      { id: 'sluss_ryss', name: 'Uppgång Ryssgården', streetName: 'Ryssgården / Södermalmstorg' },
      { id: 'sluss_kat', name: 'Uppgång Katarinavägen', streetName: 'Katarinavägen' },
      { id: 'sluss_guld', name: 'Uppgång Guldgränd / Saltsjöbanan', streetName: 'Guldgränd' }
    ]
  },
  {
    id: 'kungstradgarden',
    name: 'Kungsträdgården',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_blue_10', 'tb_blue_11'],
    coordinates: { lat: 59.3308, lng: 18.0725, svgX: 730, svgY: 485 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'trappa', 'uppgang'],
    entrances: [
      { id: 'ktg_arsenals', name: 'Uppgång Arsenalsgatan', streetName: 'Arsenalsgatan 10' },
      { id: 'ktg_galleria', name: 'Uppgång Regeringsgatan / Gallerian', streetName: 'Regeringsgatan 29' }
    ]
  },
  {
    id: 'radhuset',
    name: 'Rådhuset',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_blue_10', 'tb_blue_11'],
    coordinates: { lat: 59.3305, lng: 18.0435, svgX: 610, svgY: 480 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'trappa', 'uppgang'],
    entrances: [
      { id: 'radh_scheele', name: 'Uppgång Scheelegatan / Bergsgatan', streetName: 'Scheelegatan 1' },
      { id: 'radh_kungsholms', name: 'Uppgång Kungsholmsgatan', streetName: 'Kungsholmsgatan 27' }
    ]
  },
  {
    id: 'fridhemsplan',
    name: 'Fridhemsplan',
    transportTypes: ['tunnelbana', 'buss'],
    lineIds: ['tb_green_17', 'tb_green_18', 'tb_green_19', 'tb_blue_10', 'tb_blue_11', 'bus_4'],
    coordinates: { lat: 59.3328, lng: 18.0298, svgX: 540, svgY: 460 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'trappa', 'uppgang', 'hiss'],
    entrances: [
      { id: 'frid_fleming', name: 'Uppgång Fleminggatan', streetName: 'Fleminggatan 60' },
      { id: 'frid_drottning', name: 'Uppgång Drottningholmsvägen', streetName: 'Drottningholmsvägen 14' },
      { id: 'frid_eriks', name: 'Uppgång S:t Eriksgatan', streetName: 'S:t Eriksgatan 35' }
    ]
  },

  // --- GREEN LINE NORTH/WEST ---
  {
    id: 'st_eriksplan',
    name: 'S:t Eriksplan',
    transportTypes: ['tunnelbana', 'buss'],
    lineIds: ['tb_green_17', 'tb_green_18', 'tb_green_19', 'bus_4'],
    coordinates: { lat: 59.3392, lng: 18.0381, svgX: 580, svgY: 410 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'uppgang'],
    entrances: [{ id: 'ste_plan', name: 'Uppgång S:t Eriksplan', streetName: 'S:t Eriksplan 1' }]
  },
  {
    id: 'odenplan',
    name: 'Odenplan',
    transportTypes: ['tunnelbana', 'pendeltag', 'buss'],
    lineIds: ['tb_green_17', 'tb_green_18', 'tb_green_19', 'pendel_40', 'pendel_43', 'bus_4'],
    coordinates: { lat: 59.3429, lng: 18.0498, svgX: 630, svgY: 380 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'trappa', 'uppgang', 'hiss'],
    entrances: [
      { id: 'oden_vanadis', name: 'Uppgång Vanadisvägen', streetName: 'Vanadisvägen 9' },
      { id: 'oden_karlberg', name: 'Uppgång Karlbergsvägen', streetName: 'Karlbergsvägen 2' },
      { id: 'oden_odengatan', name: 'Uppgång Odengatan / Dalagatan', streetName: 'Odengatan 70' }
    ]
  },
  {
    id: 'radmansgatan',
    name: 'Rådmansgatan',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_17', 'tb_green_18', 'tb_green_19'],
    coordinates: { lat: 59.3398, lng: 18.0583, svgX: 650, svgY: 415 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'rad_tegn', name: 'Uppgång Tegnérgatan', streetName: 'Sveavägen 70' }]
  },
  {
    id: 'hotorget',
    name: 'Hötorget',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_17', 'tb_green_18', 'tb_green_19'],
    coordinates: { lat: 59.3355, lng: 18.0619, svgX: 665, svgY: 445 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'ho_svea', name: 'Uppgång Kungsgatan', streetName: 'Kungsgatan 41' }]
  },
  {
    id: 'thorildsplan',
    name: 'Thorildsplan',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_17', 'tb_green_18', 'tb_green_19'],
    coordinates: { lat: 59.3315, lng: 18.0145, svgX: 470, svgY: 460 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'thor_drott', name: 'Uppgång Drottningholmsvägen' }]
  },
  {
    id: 'kristineberg',
    name: 'Kristineberg',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_17', 'tb_green_18', 'tb_green_19'],
    coordinates: { lat: 59.3326, lng: 18.0036, svgX: 410, svgY: 460 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'krist_drott', name: 'Uppgång Nordenflychtsvägen' }]
  },
  {
    id: 'alvik',
    name: 'Alvik',
    transportTypes: ['tunnelbana', 'tvarbanan', 'sparvag'],
    lineIds: ['tb_green_17', 'tb_green_18', 'tb_green_19', 'tvarbanan_30', 'tvarbanan_31', 'nockebybanan_12'],
    coordinates: { lat: 59.3333, lng: 17.9819, svgX: 350, svgY: 460 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'trappa', 'uppgang', 'hiss'],
    entrances: [{ id: 'alv_torg', name: 'Uppgång Alviks torg', streetName: 'Alviks torg' }]
  },
  {
    id: 'brommaplan',
    name: 'Brommaplan',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_17', 'tb_green_18', 'tb_green_19'],
    coordinates: { lat: 59.3382, lng: 17.9392, svgX: 280, svgY: 440 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'bp_torg', name: 'Uppgång Brommaplan' }]
  },
  {
    id: 'akeshov',
    name: 'Åkeshov',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_17', 'tb_green_18', 'tb_green_19'],
    coordinates: { lat: 59.3423, lng: 17.9248, svgX: 230, svgY: 420 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'ake_gard', name: 'Uppgång Åkeshovs gårdsväg' }]
  },
  {
    id: 'angbyplan',
    name: 'Ängbyplan',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_17', 'tb_green_18', 'tb_green_19'],
    coordinates: { lat: 59.3418, lng: 17.9071, svgX: 190, svgY: 400 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'angby_torg', name: 'Uppgång Färjestadsvägen' }]
  },
  {
    id: 'blackeberg',
    name: 'Blackeberg',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_17', 'tb_green_18', 'tb_green_19'],
    coordinates: { lat: 59.3482, lng: 17.8839, svgX: 150, svgY: 380 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'black_torg', name: 'Uppgång Blackebergs torg' }]
  },
  {
    id: 'vallingby',
    name: 'Vällingby',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_17', 'tb_green_18', 'tb_green_19'],
    coordinates: { lat: 59.3628, lng: 17.8732, svgX: 120, svgY: 340 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'uppgang'],
    entrances: [{ id: 'val_centrum', name: 'Uppgång Vällingby Centrum' }]
  },
  {
    id: 'hasselby_gard',
    name: 'Hässelby gård',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_17', 'tb_green_18', 'tb_green_19'],
    coordinates: { lat: 59.3664, lng: 17.8631, svgX: 90, svgY: 300 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'hg_torg', name: 'Uppgång Hässelby torg' }]
  },
  {
    id: 'hasselby_strand',
    name: 'Hässelby strand',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_17', 'tb_green_18', 'tb_green_19'],
    coordinates: { lat: 59.3614, lng: 17.8322, svgX: 60, svgY: 260 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'hs_torg', name: 'Uppgång Fyrspannsgatan' }]
  },

  // --- GREEN LINE SOUTH BRANCHES ---
  {
    id: 'medborgarplatsen',
    name: 'Medborgarplatsen',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_17', 'tb_green_18', 'tb_green_19'],
    coordinates: { lat: 59.3148, lng: 18.0734, svgX: 730, svgY: 610 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'medb_torg', name: 'Uppgång Medborgarplatsen', streetName: 'Folkungagatan' }]
  },
  {
    id: 'skanstull',
    name: 'Skanstull',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_17', 'tb_green_18', 'tb_green_19'],
    coordinates: { lat: 59.3078, lng: 18.0761, svgX: 740, svgY: 650 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'skan_ring', name: 'Uppgång Ringen Centrum', streetName: 'Götgatan 100' }]
  },
  {
    id: 'gullmarsplan',
    name: 'Gullmarsplan',
    transportTypes: ['tunnelbana', 'tvarbanan', 'buss'],
    lineIds: ['tb_green_17', 'tb_green_18', 'tb_green_19', 'tvarbanan_30', 'bus_4'],
    coordinates: { lat: 59.2995, lng: 18.0805, svgX: 750, svgY: 700 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'trappa', 'uppgang', 'hiss'],
    entrances: [
      { id: 'gull_term', name: 'Uppgång Bussterminalen', streetName: 'Gullmarsplan Terminal' },
      { id: 'gull_globen', name: 'Uppgång mot Globen' }
    ]
  },
  {
    id: 'skarmarbrink',
    name: 'Skärmarbrink',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_17', 'tb_green_18'],
    coordinates: { lat: 59.2954, lng: 18.0898, svgX: 790, svgY: 730 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'skarm_pelarg', name: 'Uppgång Pelargatan' }]
  },
  {
    id: 'hammarbyhojden',
    name: 'Hammarbyhöjden',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_17'],
    coordinates: { lat: 59.2934, lng: 18.1034, svgX: 840, svgY: 750 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'hh_torg', name: 'Uppgång Tidaholmsplan' }]
  },
  {
    id: 'bjorkhagen',
    name: 'Björkhagen',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_17'],
    coordinates: { lat: 59.2911, lng: 18.1156, svgX: 880, svgY: 770 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'bjork_plan', name: 'Uppgång Björkhagsplan' }]
  },
  {
    id: 'karrtorp',
    name: 'Kärrtorp',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_17'],
    coordinates: { lat: 59.2842, lng: 18.1147, svgX: 910, svgY: 800 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'karr_torg', name: 'Uppgång Kärrtorpsplan' }]
  },
  {
    id: 'bagarmossen',
    name: 'Bagarmossen',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_17'],
    coordinates: { lat: 59.2762, lng: 18.1314, svgX: 940, svgY: 835 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'bag_torg', name: 'Uppgång Bagarmossens torg' }]
  },
  {
    id: 'skarpnack',
    name: 'Skarpnäck',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_17'],
    coordinates: { lat: 59.2667, lng: 18.1339, svgX: 970, svgY: 870 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'skarp_alle', name: 'Uppgång Skarpnäcks Allé' }]
  },
  {
    id: 'blasut',
    name: 'Blåsut',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_18'],
    coordinates: { lat: 59.2905, lng: 18.0906, svgX: 790, svgY: 770 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'blas_torg', name: 'Uppgång Hållnäsgatan' }]
  },
  {
    id: 'sandsborg',
    name: 'Sandsborg',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_18'],
    coordinates: { lat: 59.2858, lng: 18.0917, svgX: 790, svgY: 805 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'sand_torg', name: 'Uppgång Sandsborgsplan' }]
  },
  {
    id: 'skogskyrkogarden',
    name: 'Skogskyrkogården',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_18'],
    coordinates: { lat: 59.2789, lng: 18.0953, svgX: 790, svgY: 840 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'skog_torg', name: 'Uppgång Sockenvägen' }]
  },
  {
    id: 'tallkrogen',
    name: 'Tallkrogen',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_18'],
    coordinates: { lat: 59.2711, lng: 18.0833, svgX: 790, svgY: 875 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'tall_torg', name: 'Uppgång Victor Balcks väg' }]
  },
  {
    id: 'gubbangen',
    name: 'Gubbängen',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_18'],
    coordinates: { lat: 59.2636, lng: 18.0811, svgX: 790, svgY: 910 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'gubb_torg', name: 'Uppgång Gubbängstorget' }]
  },
  {
    id: 'hokarangen',
    name: 'Hökarängen',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_18'],
    coordinates: { lat: 59.2575, lng: 18.0825, svgX: 790, svgY: 945 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'hok_torg', name: 'Uppgång Örbyleden' }]
  },
  {
    id: 'farsta',
    name: 'Farsta',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_18'],
    coordinates: { lat: 59.2433, lng: 18.0903, svgX: 790, svgY: 980 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'far_centrum', name: 'Uppgång Farsta Centrum' }]
  },
  {
    id: 'farsta_strand',
    name: 'Farsta strand',
    transportTypes: ['tunnelbana', 'pendeltag'],
    lineIds: ['tb_green_18', 'pendel_43'],
    coordinates: { lat: 59.2361, lng: 18.0997, svgX: 790, svgY: 1015 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang', 'hiss'],
    entrances: [{ id: 'fs_torg', name: 'Uppgång Stieg Trenters torg' }]
  },
  {
    id: 'globen',
    name: 'Globen',
    transportTypes: ['tunnelbana', 'tvarbanan'],
    lineIds: ['tb_green_19', 'tvarbanan_30'],
    coordinates: { lat: 59.2942, lng: 18.0781, svgX: 720, svgY: 745 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'glob_arenan', name: 'Uppgång Avicii Arena / Globen Shopping' }]
  },
  {
    id: 'enskede_gard',
    name: 'Enskede gård',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_19'],
    coordinates: { lat: 59.2894, lng: 18.0706, svgX: 710, svgY: 780 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'eg_torg', name: 'Uppgång Palmfeltsvägen' }]
  },
  {
    id: 'sockenplan',
    name: 'Sockenplan',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_19'],
    coordinates: { lat: 59.2831, lng: 18.0697, svgX: 700, svgY: 815 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'sock_torg', name: 'Uppgång Sockenplan' }]
  },
  {
    id: 'svedmyra',
    name: 'Svedmyra',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_19'],
    coordinates: { lat: 59.2778, lng: 18.0692, svgX: 690, svgY: 850 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'sved_torg', name: 'Uppgång Tussmötevägen' }]
  },
  {
    id: 'stureby',
    name: 'Stureby',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_19'],
    coordinates: { lat: 59.2736, lng: 18.0558, svgX: 675, svgY: 885 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'stur_torg', name: 'Uppgång Sågverksgatan' }]
  },
  {
    id: 'bandhagen',
    name: 'Bandhagen',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_19'],
    coordinates: { lat: 59.2700, lng: 18.0497, svgX: 660, svgY: 920 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'band_torg', name: 'Uppgång Bandhagsplan' }]
  },
  {
    id: 'hogdalen',
    name: 'Högdalen',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_19'],
    coordinates: { lat: 59.2633, lng: 18.0419, svgX: 645, svgY: 955 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'hog_torg', name: 'Uppgång Högdalen Centrum' }]
  },
  {
    id: 'ragsved',
    name: 'Rågsved',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_19'],
    coordinates: { lat: 59.2567, lng: 18.0289, svgX: 630, svgY: 990 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'rag_torg', name: 'Uppgång Rågsveds torg' }]
  },
  {
    id: 'hagsatra',
    name: 'Hagsätra',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_green_19'],
    coordinates: { lat: 59.2625, lng: 18.0125, svgX: 615, svgY: 1025 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'hag_torg', name: 'Uppgång Hagsätra torg' }]
  },

  // --- RED LINE NORTH ---
  {
    id: 'ostermalmstorg',
    name: 'Östermalmstorg',
    transportTypes: ['tunnelbana', 'buss'],
    lineIds: ['tb_red_13', 'tb_red_14'],
    coordinates: { lat: 59.3361, lng: 18.0753, svgX: 740, svgY: 440 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'uppgang'],
    entrances: [
      { id: 'ost_sture', name: 'Uppgång Stureplan / Birger Jarlsgatan', streetName: 'Birger Jarlsgatan 18' },
      { id: 'ost_torg', name: 'Uppgång Östermalmstorg', streetName: 'Nybrogatan 28' }
    ]
  },
  {
    id: 'stadion',
    name: 'Stadion',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_14'],
    coordinates: { lat: 59.3429, lng: 18.0822, svgX: 760, svgY: 380 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'stad_valhall', name: 'Uppgång Valhallavägen' }]
  },
  {
    id: 'tekniska_hogskolan',
    name: 'Tekniska högskolan',
    transportTypes: ['tunnelbana', 'roslagsbanan'],
    lineIds: ['tb_red_14', 'roslagsbanan_27'],
    coordinates: { lat: 59.3468, lng: 18.0712, svgX: 760, svgY: 320 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'trappa', 'uppgang'],
    entrances: [
      { id: 'kth_valhall', name: 'Uppgång Valhallavägen / KTH', streetName: 'Drottning Kristinas väg' },
      { id: 'kth_roslag', name: 'Uppgång Östra station / Roslagsbanan', streetName: 'Valhallavägen 75' }
    ]
  },
  {
    id: 'universitetet',
    name: 'Universitetet',
    transportTypes: ['tunnelbana', 'roslagsbanan'],
    lineIds: ['tb_red_14', 'roslagsbanan_27'],
    coordinates: { lat: 59.3653, lng: 18.0558, svgX: 760, svgY: 240 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'univ_frescati', name: 'Uppgång Frescati / Universitetet' }]
  },
  {
    id: 'bergshamra',
    name: 'Bergshamra',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_14'],
    coordinates: { lat: 59.3811, lng: 18.0367, svgX: 760, svgY: 180 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'berg_torg', name: 'Uppgång Bergshamra torg' }]
  },
  {
    id: 'danderyds_sjukhus',
    name: 'Danderyds sjukhus',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_14'],
    coordinates: { lat: 59.3917, lng: 18.0417, svgX: 760, svgY: 130 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'biljetthall', 'uppgang'],
    entrances: [{ id: 'dand_term', name: 'Uppgång Bussterminal / Sjukhus' }]
  },
  {
    id: 'morby_centrum',
    name: 'Mörby centrum',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_14'],
    coordinates: { lat: 59.3981, lng: 18.0361, svgX: 760, svgY: 80 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'morby_galleria', name: 'Uppgång Mörby Centrum Gallerian' }]
  },
  {
    id: 'karlaplan',
    name: 'Karlaplan',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_13'],
    coordinates: { lat: 59.3392, lng: 18.0903, svgX: 820, svgY: 410 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'karl_torg', name: 'Uppgång Karlaplan' }]
  },
  {
    id: 'gardet',
    name: 'Gärdet',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_13'],
    coordinates: { lat: 59.3469, lng: 18.0994, svgX: 860, svgY: 370 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'gard_torg', name: 'Uppgång Brantingsgatan' }]
  },
  {
    id: 'ropsten',
    name: 'Ropsten',
    transportTypes: ['tunnelbana', 'sparvag'],
    lineIds: ['tb_red_13', 'lidingobanan_21'],
    coordinates: { lat: 59.3575, lng: 18.1022, svgX: 900, svgY: 330 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'uppgang', 'hiss'],
    entrances: [
      { id: 'rop_term', name: 'Uppgång Lidingöbanan / Bussterminal' },
      { id: 'rop_hjorth', name: 'Uppgång Hjorthagen' }
    ]
  },

  // --- RED LINE SOUTH ---
  {
    id: 'mariatorget',
    name: 'Mariatorget',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_13', 'tb_red_14'],
    coordinates: { lat: 59.3178, lng: 18.0628, svgX: 670, svgY: 575 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'maria_swed', name: 'Uppgång Swedenborgsgatan' }]
  },
  {
    id: 'zinkensdamm',
    name: 'Zinkensdamm',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_13', 'tb_red_14'],
    coordinates: { lat: 59.3175, lng: 18.0505, svgX: 620, svgY: 575 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'zink_ring', name: 'Uppgång Ringvägen / Hornsgatan' }]
  },
  {
    id: 'hornstull',
    name: 'Hornstull',
    transportTypes: ['tunnelbana', 'buss'],
    lineIds: ['tb_red_13', 'tb_red_14', 'bus_4'],
    coordinates: { lat: 59.3158, lng: 18.0345, svgX: 570, svgY: 575 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'uppgang'],
    entrances: [{ id: 'horn_torg', name: 'Uppgång Hornstulls strand', streetName: 'Långholmsgatan 20' }]
  },
  {
    id: 'liljeholmen',
    name: 'Liljeholmen',
    transportTypes: ['tunnelbana', 'tvarbanan'],
    lineIds: ['tb_red_13', 'tb_red_14', 'tvarbanan_30'],
    coordinates: { lat: 59.3108, lng: 18.0234, svgX: 510, svgY: 600 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'trappa', 'uppgang', 'hiss'],
    entrances: [
      { id: 'lilje_torg', name: 'Uppgång Liljeholmstorget', streetName: 'Liljeholmstorget 5' },
      { id: 'lilje_nybo', name: 'Uppgång Nybohovshissen' }
    ]
  },
  {
    id: 'midsommarkransen',
    name: 'Midsommarkransen',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_14'],
    coordinates: { lat: 59.3014, lng: 18.0125, svgX: 470, svgY: 640 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'midsomm_torg', name: 'Uppgång Svandammsvägen' }]
  },
  {
    id: 'telefonplan',
    name: 'Telefonplan',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_14'],
    coordinates: { lat: 59.2981, lng: 17.9972, svgX: 440, svgY: 675 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'tele_torg', name: 'Uppgång Telefonplan / Konstfack' }]
  },
  {
    id: 'hagerstensasen',
    name: 'Hägerstensåsen',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_14'],
    coordinates: { lat: 59.2953, lng: 17.9786, svgX: 410, svgY: 710 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'hager_torg', name: 'Uppgång Sedelvägen' }]
  },
  {
    id: 'vastertorp',
    name: 'Västertorp',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_14'],
    coordinates: { lat: 59.2911, lng: 17.9667, svgX: 380, svgY: 745 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'vast_torg', name: 'Uppgång Västertorps torg' }]
  },
  {
    id: 'fruangen',
    name: 'Fruängen',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_14'],
    coordinates: { lat: 59.2858, lng: 17.9653, svgX: 350, svgY: 780 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'fru_torg', name: 'Uppgång Fruängens Centrum' }]
  },
  {
    id: 'aspudden',
    name: 'Aspudden',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_13'],
    coordinates: { lat: 59.3067, lng: 18.0017, svgX: 460, svgY: 615 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'asp_torg', name: 'Uppgång Schlytersvägen' }]
  },
  {
    id: 'ornsberg',
    name: 'Örnsberg',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_13'],
    coordinates: { lat: 59.3056, lng: 17.9894, svgX: 420, svgY: 625 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'orns_torg', name: 'Uppgång Jakobsdalsvägen' }]
  },
  {
    id: 'axelsberg',
    name: 'Axelsberg',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_13'],
    coordinates: { lat: 59.3042, lng: 17.9753, svgX: 380, svgY: 635 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'axel_torg', name: 'Uppgång Axelsbergs torg' }]
  },
  {
    id: 'malarhojden',
    name: 'Mälarhöjden',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_13'],
    coordinates: { lat: 59.3011, lng: 17.9567, svgX: 340, svgY: 645 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'malar_torg', name: 'Uppgång Hägerstensvägen' }]
  },
  {
    id: 'bredang',
    name: 'Bredäng',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_13'],
    coordinates: { lat: 59.2950, lng: 17.9333, svgX: 300, svgY: 655 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'bred_torg', name: 'Uppgång Bredängs torg' }]
  },
  {
    id: 'satra',
    name: 'Sätra',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_13'],
    coordinates: { lat: 59.2853, lng: 17.9214, svgX: 260, svgY: 670 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'satra_torg', name: 'Uppgång Sätra Centrum' }]
  },
  {
    id: 'skarholmen',
    name: 'Skärholmen',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_13'],
    coordinates: { lat: 59.2756, lng: 17.9069, svgX: 220, svgY: 690 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'uppgang'],
    entrances: [{ id: 'skar_torg', name: 'Uppgång Skärholmen Centrum' }]
  },
  {
    id: 'varberg',
    name: 'Vårberg',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_13'],
    coordinates: { lat: 59.2758, lng: 17.8906, svgX: 180, svgY: 715 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'varb_torg', name: 'Uppgång Vårbergs torg' }]
  },
  {
    id: 'varby_gard',
    name: 'Vårby gård',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_13'],
    coordinates: { lat: 59.2650, lng: 17.8842, svgX: 150, svgY: 745 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'varby_torg', name: 'Uppgång Vårby torg' }]
  },
  {
    id: 'masmo',
    name: 'Masmo',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_13'],
    coordinates: { lat: 59.2497, lng: 17.8808, svgX: 130, svgY: 780 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'masmo_torg', name: 'Uppgång Solhagavägen' }]
  },
  {
    id: 'fittja',
    name: 'Fittja',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_13'],
    coordinates: { lat: 59.2478, lng: 17.8606, svgX: 110, svgY: 815 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'fittja_torg', name: 'Uppgång Fittja Centrum' }]
  },
  {
    id: 'alby',
    name: 'Alby',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_13'],
    coordinates: { lat: 59.2394, lng: 17.8453, svgX: 90, svgY: 850 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'alby_torg', name: 'Uppgång Alby Centrum' }]
  },
  {
    id: 'hallunda',
    name: 'Hallunda',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_13'],
    coordinates: { lat: 59.2436, lng: 17.8286, svgX: 70, svgY: 885 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'hall_torg', name: 'Uppgång Hallunda Centrum' }]
  },
  {
    id: 'norsborg',
    name: 'Norsborg',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_red_13'],
    coordinates: { lat: 59.2439, lng: 17.8136, svgX: 50, svgY: 920 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'nors_torg', name: 'Uppgång Norsborgs torg' }]
  },

  // --- BLUE LINE NORTH BRANCHES ---
  {
    id: 'stadshagen',
    name: 'Stadshagen',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_blue_10', 'tb_blue_11'],
    coordinates: { lat: 59.3372, lng: 18.0169, svgX: 500, svgY: 410 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'stadh_sankt', name: 'Uppgång S:t Görans sjukhus' }]
  },
  {
    id: 'vastra_skogen',
    name: 'Västra skogen',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_blue_10', 'tb_blue_11'],
    coordinates: { lat: 59.3475, lng: 18.0039, svgX: 470, svgY: 345 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'uppgang'],
    entrances: [{ id: 'vsk_torg', name: 'Uppgång Johan Enbergs väg' }]
  },
  {
    id: 'solna_centrum',
    name: 'Solna centrum',
    transportTypes: ['tunnelbana', 'tvarbanan'],
    lineIds: ['tb_blue_11', 'tvarbanan_30'],
    coordinates: { lat: 59.3598, lng: 18.0003, svgX: 470, svgY: 275 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'uppgang'],
    entrances: [
      { id: 'solna_c_rasunda', name: 'Uppgång Råsundavägen' },
      { id: 'solna_c_mall', name: 'Uppgång Solna Centrum Gallerian' }
    ]
  },
  {
    id: 'nackrosen',
    name: 'Näckrosen',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_blue_11'],
    coordinates: { lat: 59.3672, lng: 17.9839, svgX: 470, svgY: 215 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'nack_torg', name: 'Uppgång Filmstaden / Råsunda' }]
  },
  {
    id: 'hallonbergen',
    name: 'Hallonbergen',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_blue_11'],
    coordinates: { lat: 59.3753, lng: 17.9689, svgX: 470, svgY: 160 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'hallon_torg', name: 'Uppgång Hallonbergen Centrum' }]
  },
  {
    id: 'kista',
    name: 'Kista',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_blue_11'],
    coordinates: { lat: 59.4032, lng: 17.9428, svgX: 470, svgY: 110 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'biljetthall', 'uppgang'],
    entrances: [{ id: 'kista_mall', name: 'Uppgång Kista Galleria', streetName: 'Danmarksgatan' }]
  },
  {
    id: 'husby',
    name: 'Husby',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_blue_11'],
    coordinates: { lat: 59.4097, lng: 17.9267, svgX: 470, svgY: 65 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'husby_torg', name: 'Uppgång Husby Centrum' }]
  },
  {
    id: 'akalla',
    name: 'Akalla',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_blue_11'],
    coordinates: { lat: 59.4147, lng: 17.9172, svgX: 470, svgY: 25 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'akalla_torg', name: 'Uppgång Akalla torg', streetName: 'Sibeliusgången' }]
  },
  {
    id: 'huvudsta',
    name: 'Huvudsta',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_blue_10'],
    coordinates: { lat: 59.3497, lng: 17.9864, svgX: 410, svgY: 345 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'huv_torg', name: 'Uppgång Huvudsta Centrum' }]
  },
  {
    id: 'solna_strand',
    name: 'Solna strand',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_blue_10'],
    coordinates: { lat: 59.3547, lng: 17.9739, svgX: 360, svgY: 345 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'solstr_torg', name: 'Uppgång Korta gatan' }]
  },
  {
    id: 'sundbyberg_c',
    name: 'Sundbybergs centrum',
    transportTypes: ['tunnelbana', 'pendeltag', 'tvarbanan'],
    lineIds: ['tb_blue_10', 'pendel_43', 'tvarbanan_30'],
    coordinates: { lat: 59.3614, lng: 17.9678, svgX: 300, svgY: 320 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'trappa', 'uppgang', 'hiss'],
    entrances: [
      { id: 'sumpan_jarnvag', name: 'Uppgång Järnvägsgatan / Pendeltåg' },
      { id: 'sumpan_lands', name: 'Uppgång Landsvägen / Torget' }
    ]
  },
  {
    id: 'duvbo',
    name: 'Duvbo',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_blue_10'],
    coordinates: { lat: 59.3678, lng: 17.9642, svgX: 250, svgY: 280 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'duv_torg', name: 'Uppgång Tulegatan' }]
  },
  {
    id: 'rissne',
    name: 'Rissne',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_blue_10'],
    coordinates: { lat: 59.3756, lng: 17.9403, svgX: 200, svgY: 240 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'riss_torg', name: 'Uppgång Rissne torg' }]
  },
  {
    id: 'rinkeby',
    name: 'Rinkeby',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_blue_10'],
    coordinates: { lat: 59.3881, lng: 17.9289, svgX: 160, svgY: 200 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'rink_torg', name: 'Uppgång Rinkebytorget' }]
  },
  {
    id: 'tensta',
    name: 'Tensta',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_blue_10'],
    coordinates: { lat: 59.3947, lng: 17.9014, svgX: 120, svgY: 160 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'ten_torg', name: 'Uppgång Tensta Centrum' }]
  },
  {
    id: 'hjulsta',
    name: 'Hjulsta',
    transportTypes: ['tunnelbana'],
    lineIds: ['tb_blue_10'],
    coordinates: { lat: 59.4003, lng: 17.8872, svgX: 80, svgY: 120 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'hjul_torg', name: 'Uppgång Hjulstatorget' }]
  },

  // --- PENDELTÅG SPECIFIC STATIONS ---
  {
    id: 'stockholm_sodra',
    name: 'Stockholm Södra',
    transportTypes: ['pendeltag', 'buss'],
    lineIds: ['pendel_40', 'pendel_43', 'bus_4'],
    coordinates: { lat: 59.3142, lng: 18.0645, svgX: 640, svgY: 620 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'uppgang'],
    entrances: [
      { id: 'sthlm_sod_swed', name: 'Uppgång Swedenborgsgatan' },
      { id: 'sthlm_sod_rosen', name: 'Uppgång Rosenlundsgatan' }
    ]
  },
  {
    id: 'arstaberg',
    name: 'Årstaberg',
    transportTypes: ['pendeltag', 'tvarbanan'],
    lineIds: ['pendel_40', 'pendel_43', 'tvarbanan_30'],
    coordinates: { lat: 59.2997, lng: 18.0305, svgX: 580, svgY: 670 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'uppgang'],
    entrances: [{ id: 'arst_torg', name: 'Uppgång Årstabergsvägen' }]
  },
  {
    id: 'alvsjo',
    name: 'Älvsjö',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_40', 'pendel_43'],
    coordinates: { lat: 59.2785, lng: 18.0069, svgX: 560, svgY: 740 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'uppgang'],
    entrances: [
      { id: 'alv_massa', name: 'Uppgång Stockholmsmässan' },
      { id: 'alvsjo_torg', name: 'Uppgång Älvsjö torg' }
    ]
  },
  {
    id: 'flemingsberg',
    name: 'Flemingsberg',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_40'],
    coordinates: { lat: 59.2197, lng: 17.9403, svgX: 530, svgY: 880 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'flem_sjukhus', name: 'Uppgång Karolinska Universitetssjukhuset Huddinge' }]
  },
  {
    id: 'tumba',
    name: 'Tumba',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_40'],
    coordinates: { lat: 59.1997, lng: 17.8333, svgX: 500, svgY: 960 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'tumba_torg', name: 'Uppgång Tumba Centrum' }]
  },
  {
    id: 'sodertalje_c',
    name: 'Södertälje centrum',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_40'],
    coordinates: { lat: 59.1964, lng: 17.6272, svgX: 470, svgY: 1040 },
    zone: 'C',
    areas: ['sparrar', 'perrong', 'biljetthall', 'uppgang'],
    entrances: [{ id: 'sod_torg', name: 'Uppgång Stationsplan' }]
  },
  {
    id: 'handen',
    name: 'Handen',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_43'],
    coordinates: { lat: 59.1672, lng: 18.1408, svgX: 620, svgY: 880 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'hand_centrum', name: 'Uppgång Haninge Centrum' }]
  },
  {
    id: 'vasterhaninge',
    name: 'Västerhaninge',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_43'],
    coordinates: { lat: 59.1231, lng: 18.1067, svgX: 630, svgY: 960 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'vh_torg', name: 'Uppgång Tungelstavägen' }]
  },
  {
    id: 'nynashamn',
    name: 'Nynäshamn',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_43'],
    coordinates: { lat: 58.9039, lng: 17.9483, svgX: 640, svgY: 1040 },
    zone: 'C',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'nyn_farja', name: 'Uppgång Färjeterminalen / Gotland' }]
  },
  // --- PENDELTÅG SPECIFIC STATIONS ---
  {
    id: 'spanga',
    name: 'Spånga',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_43'],
    coordinates: { lat: 59.3828, lng: 17.8981, svgX: 270, svgY: 270 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'trappa', 'uppgang', 'hiss'],
    entrances: [
      { id: 'spang_torg', name: 'Uppgång Spånga torg / Bussterminal', streetName: 'Spånga Stationsväg' },
      { id: 'spang_brom', name: 'Uppgång Bromstensvägen', streetName: 'Bromstensvägen' }
    ]
  },
  {
    id: 'barkarby',
    name: 'Barkarby',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_43'],
    coordinates: { lat: 59.4128, lng: 17.8864, svgX: 245, svgY: 230 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'biljetthall', 'trappa', 'uppgang', 'hiss'],
    entrances: [
      { id: 'bark_stn', name: 'Uppgång Barkarby station / Veddesta', streetName: 'Veddestavägen' },
      { id: 'bark_staden', name: 'Uppgång Barkarbystaden', streetName: 'Enköpingsvägen' }
    ]
  },
  {
    id: 'jakobsberg',
    name: 'Jakobsberg',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_43'],
    coordinates: { lat: 59.4239, lng: 17.8344, svgX: 220, svgY: 190 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'biljetthall', 'uppgang'],
    entrances: [{ id: 'jak_torg', name: 'Uppgång Jakobsbergs Centrum' }]
  },
  {
    id: 'kallhall',
    name: 'Kallhäll',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_43'],
    coordinates: { lat: 59.4561, lng: 17.8092, svgX: 190, svgY: 150 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'biljetthall', 'uppgang'],
    entrances: [
      { id: 'kall_c', name: 'Uppgång Kallhälls Centrum', streetName: 'Gjutarplan' },
      { id: 'kall_bolinder', name: 'Uppgång Bolinders plan', streetName: 'Bolindervägen' }
    ]
  },
  {
    id: 'kungsangen',
    name: 'Kungsängen',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_43'],
    coordinates: { lat: 59.4789, lng: 17.7533, svgX: 160, svgY: 110 },
    zone: 'C',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'kungs_torg', name: 'Uppgång Kungsängens torg' }]
  },
  {
    id: 'bro',
    name: 'Bro',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_43'],
    coordinates: { lat: 59.5161, lng: 17.6361, svgX: 135, svgY: 75 },
    zone: 'C',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'bro_torg', name: 'Uppgång Stationsvägen / Bro Centrum', streetName: 'Stationsvägen' }]
  },
  {
    id: 'balsta',
    name: 'Bålsta',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_43'],
    coordinates: { lat: 59.5678, lng: 17.5297, svgX: 110, svgY: 40 },
    zone: 'C',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'bal_torg', name: 'Uppgång Bålsta Centrum' }]
  },
  {
    id: 'solna_station',
    name: 'Solna station',
    transportTypes: ['pendeltag', 'tvarbanan'],
    lineIds: ['pendel_40', 'tvarbanan_30'],
    coordinates: { lat: 59.3644, lng: 18.0105, svgX: 580, svgY: 270 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'uppgang', 'hiss'],
    entrances: [
      { id: 'solna_st_friends', name: 'Uppgång Strawberry Arena / Westfield Mall of Scandinavia' },
      { id: 'solna_st_hagalund', name: 'Uppgång Hagalund' }
    ]
  },
  {
    id: 'ulriksdal',
    name: 'Ulriksdal',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_40'],
    coordinates: { lat: 59.3789, lng: 18.0019, svgX: 580, svgY: 235 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'ulr_stn', name: 'Uppgång Ritorp / Kolonnvägen' }]
  },
  {
    id: 'helenelund',
    name: 'Helenelund',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_40'],
    coordinates: { lat: 59.4089, lng: 17.9622, svgX: 580, svgY: 205 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'helen_torg', name: 'Uppgång Helenelunds torg / Svalgången' }]
  },
  {
    id: 'sollentuna',
    name: 'Sollentuna',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_40'],
    coordinates: { lat: 59.4283, lng: 17.9508, svgX: 580, svgY: 175 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'soll_centrum', name: 'Uppgång Sollentuna Centrum' }]
  },
  {
    id: 'rotebro',
    name: 'Rotebro',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_40'],
    coordinates: { lat: 59.4756, lng: 17.9156, svgX: 580, svgY: 140 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'rote_torg', name: 'Uppgång Rotebro torg' }]
  },
  {
    id: 'upplands_vasby',
    name: 'Upplands Väsby',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_40'],
    coordinates: { lat: 59.5208, lng: 17.9022, svgX: 580, svgY: 110 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'vasby_torg', name: 'Uppgång Väsby Centrum' }]
  },
  {
    id: 'marsta',
    name: 'Märsta',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_40'],
    coordinates: { lat: 59.6214, lng: 17.8611, svgX: 580, svgY: 80 },
    zone: 'C',
    areas: ['sparrar', 'perrong', 'biljetthall', 'uppgang'],
    entrances: [{ id: 'marsta_stn', name: 'Uppgång Stationsgatan / Märsta Centrum' }]
  },
  {
    id: 'arlanda_c',
    name: 'Arlanda Central',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_40'],
    coordinates: { lat: 59.6497, lng: 17.9289, svgX: 580, svgY: 55 },
    zone: 'C',
    areas: ['sparrar', 'perrong', 'biljetthall', 'uppgang', 'hiss'],
    entrances: [{ id: 'arl_skycity', name: 'Uppgång SkyCity / Terminal 4 & 5' }]
  },
  {
    id: 'knivsta',
    name: 'Knivsta',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_40'],
    coordinates: { lat: 59.7258, lng: 17.7889, svgX: 580, svgY: 30 },
    zone: 'C',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'kniv_c', name: 'Uppgång Knivsta Station' }]
  },
  {
    id: 'uppsala_c',
    name: 'Uppsala C',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_40'],
    coordinates: { lat: 59.8586, lng: 17.6467, svgX: 580, svgY: 10 },
    zone: 'C',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'upp_central', name: 'Uppgång Stadshuset / Resecentrum' }]
  },
  {
    id: 'stuvsta',
    name: 'Stuvsta',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_40'],
    coordinates: { lat: 59.2575, lng: 17.9953, svgX: 550, svgY: 780 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'stuv_torg', name: 'Uppgång Stuvsta torg' }]
  },
  {
    id: 'huddinge',
    name: 'Huddinge',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_40'],
    coordinates: { lat: 59.2361, lng: 17.9819, svgX: 540, svgY: 825 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'uppgang'],
    entrances: [{ id: 'hudd_c', name: 'Uppgång Huddinge Centrum' }]
  },
  {
    id: 'tullinge',
    name: 'Tullinge',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_40'],
    coordinates: { lat: 59.2081, lng: 17.9042, svgX: 515, svgY: 915 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'tull_torg', name: 'Uppgång Tullinge torg' }]
  },
  {
    id: 'ronninge',
    name: 'Rönninge',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_40'],
    coordinates: { lat: 59.1939, lng: 17.7511, svgX: 490, svgY: 1000 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'ronn_torg', name: 'Uppgång Rönninge torg' }]
  },
  {
    id: 'ostertalje',
    name: 'Östertälje',
    transportTypes: ['pendeltag'],
    lineIds: ['pendel_40'],
    coordinates: { lat: 59.1911, lng: 17.6694, svgX: 480, svgY: 1040 },
    zone: 'C',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'ostert_torg', name: 'Uppgång Gröndalsvägen' }]
  },
  {
    id: 'stockholms_ostra',
    name: 'Stockholms östra',
    transportTypes: ['roslagsbanan'],
    lineIds: ['roslagsbanan_27'],
    coordinates: { lat: 59.3468, lng: 18.0712, svgX: 780, svgY: 320 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'biljetthall', 'uppgang'],
    entrances: [{ id: 'so_torg', name: 'Uppgång Valhallavägen / Östra station' }]
  },
  {
    id: 'djursholms_osby',
    name: 'Djursholms Ösby',
    transportTypes: ['roslagsbanan'],
    lineIds: ['roslagsbanan_27'],
    coordinates: { lat: 59.3981, lng: 18.0736, svgX: 820, svgY: 200 },
    zone: 'B',
    areas: ['perrong', 'uppgang'],
    entrances: [{ id: 'osby_torg', name: 'Uppgång Vendevägen' }]
  },
  {
    id: 'taby_centrum',
    name: 'Täby centrum',
    transportTypes: ['roslagsbanan'],
    lineIds: ['roslagsbanan_27'],
    coordinates: { lat: 59.4447, lng: 18.0719, svgX: 840, svgY: 130 },
    zone: 'B',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'taby_mall', name: 'Uppgång Täby Centrum Gallerian' }]
  },
  {
    id: 'akersberga',
    name: 'Åkersberga',
    transportTypes: ['roslagsbanan'],
    lineIds: ['roslagsbanan_27'],
    coordinates: { lat: 59.4897, lng: 18.2981, svgX: 920, svgY: 70 },
    zone: 'C',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'akers_torg', name: 'Uppgång Stationsvägen' }]
  },
  {
    id: 'osterskar',
    name: 'Österskär',
    transportTypes: ['roslagsbanan'],
    lineIds: ['roslagsbanan_27'],
    coordinates: { lat: 59.4797, lng: 18.3189, svgX: 960, svgY: 60 },
    zone: 'C',
    areas: ['perrong', 'uppgang'],
    entrances: [{ id: 'ostersk_hamn', name: 'Uppgång Generalshagen' }]
  },
  {
    id: 'vallentuna',
    name: 'Vallentuna',
    transportTypes: ['roslagsbanan'],
    lineIds: ['roslagsbanan_27'],
    coordinates: { lat: 59.5342, lng: 18.0758, svgX: 840, svgY: 50 },
    zone: 'C',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'vall_torg', name: 'Uppgång Vallentuna Centrum' }]
  },
  {
    id: 'karsta',
    name: 'Kårsta',
    transportTypes: ['roslagsbanan'],
    lineIds: ['roslagsbanan_27'],
    coordinates: { lat: 59.6547, lng: 18.2433, svgX: 880, svgY: 15 },
    zone: 'C',
    areas: ['perrong', 'uppgang'],
    entrances: [{ id: 'karsta_vagen', name: 'Uppgång Kårsta torg' }]
  },
  {
    id: 'saltsjobaden',
    name: 'Saltsjöbaden',
    transportTypes: ['saltsjobanan'],
    lineIds: ['saltsjobanan_25'],
    coordinates: { lat: 59.2789, lng: 18.3156, svgX: 1040, svgY: 710 },
    zone: 'B',
    areas: ['perrong', 'uppgang'],
    entrances: [{ id: 'sb_grand', name: 'Uppgång Grand Hotel / Hotellviken' }]
  },
  {
    id: 'fisksatra',
    name: 'Fisksätra',
    transportTypes: ['saltsjobanan'],
    lineIds: ['saltsjobanan_25'],
    coordinates: { lat: 59.2942, lng: 18.2567, svgX: 960, svgY: 690 },
    zone: 'B',
    areas: ['perrong', 'uppgang'],
    entrances: [{ id: 'fisk_torg', name: 'Uppgång Fisksätra torg' }]
  },
  // --- LIDINGÖBANAN (L21) ---
  {
    id: 'torsvik',
    name: 'Torsvik',
    transportTypes: ['sparvag'],
    lineIds: ['lidingobanan_21'],
    coordinates: { lat: 59.3583, lng: 18.1250, svgX: 940, svgY: 330 },
    zone: 'B',
    areas: ['perrong'],
    entrances: [{ id: 'tors_torg', name: 'Uppgång Torsviks torg' }]
  },
  {
    id: 'baggeby',
    name: 'Baggeby',
    transportTypes: ['sparvag'],
    lineIds: ['lidingobanan_21'],
    coordinates: { lat: 59.3556, lng: 18.1361, svgX: 975, svgY: 330 },
    zone: 'B',
    areas: ['perrong'],
    entrances: [{ id: 'bagg_torg', name: 'Uppgång Baggeby torg' }]
  },
  {
    id: 'bodal',
    name: 'Bodal',
    transportTypes: ['sparvag'],
    lineIds: ['lidingobanan_21'],
    coordinates: { lat: 59.3528, lng: 18.1472, svgX: 1010, svgY: 330 },
    zone: 'B',
    areas: ['perrong'],
    entrances: [{ id: 'bodal_vagen', name: 'Uppgång Bodalsvägen' }]
  },
  {
    id: 'larsberg',
    name: 'Larsberg',
    transportTypes: ['sparvag'],
    lineIds: ['lidingobanan_21'],
    coordinates: { lat: 59.3500, lng: 18.1583, svgX: 1045, svgY: 335 },
    zone: 'B',
    areas: ['perrong'],
    entrances: [{ id: 'lars_torg', name: 'Uppgång Larsbergstorget' }]
  },
  {
    id: 'aga',
    name: 'AGA',
    transportTypes: ['sparvag'],
    lineIds: ['lidingobanan_21'],
    coordinates: { lat: 59.3472, lng: 18.1694, svgX: 1080, svgY: 345 },
    zone: 'B',
    areas: ['perrong'],
    entrances: [{ id: 'aga_depa', name: 'Uppgång AGA Depå / Södra Kungsvägen' }]
  },
  {
    id: 'skarsatra',
    name: 'Skärsätra',
    transportTypes: ['sparvag'],
    lineIds: ['lidingobanan_21'],
    coordinates: { lat: 59.3444, lng: 18.1780, svgX: 1115, svgY: 355 },
    zone: 'B',
    areas: ['perrong'],
    entrances: [{ id: 'skarsatra_torg', name: 'Uppgång Skärsätra torg' }]
  },
  {
    id: 'kottla',
    name: 'Kottla',
    transportTypes: ['sparvag'],
    lineIds: ['lidingobanan_21'],
    coordinates: { lat: 59.3440, lng: 18.1880, svgX: 1150, svgY: 365 },
    zone: 'B',
    areas: ['perrong'],
    entrances: [{ id: 'kott_sjo', name: 'Uppgång Kottlasjön / Södra Kungsvägen' }]
  },
  {
    id: 'hogberga',
    name: 'Högberga',
    transportTypes: ['sparvag'],
    lineIds: ['lidingobanan_21'],
    coordinates: { lat: 59.3430, lng: 18.1980, svgX: 1185, svgY: 375 },
    zone: 'B',
    areas: ['perrong'],
    entrances: [{ id: 'hog_vagen', name: 'Uppgång Högbergavägen' }]
  },
  {
    id: 'brevik',
    name: 'Brevik',
    transportTypes: ['sparvag'],
    lineIds: ['lidingobanan_21'],
    coordinates: { lat: 59.3450, lng: 18.2080, svgX: 1220, svgY: 380 },
    zone: 'B',
    areas: ['perrong'],
    entrances: [{ id: 'brev_brygg', name: 'Uppgång Breviks brygga' }]
  },
  {
    id: 'kappala',
    name: 'Käppala',
    transportTypes: ['sparvag'],
    lineIds: ['lidingobanan_21'],
    coordinates: { lat: 59.3510, lng: 18.2150, svgX: 1255, svgY: 380 },
    zone: 'B',
    areas: ['perrong'],
    entrances: [{ id: 'kapp_skola', name: 'Uppgång Järnvägsallén' }]
  },
  {
    id: 'talludden',
    name: 'Talludden',
    transportTypes: ['sparvag'],
    lineIds: ['lidingobanan_21'],
    coordinates: { lat: 59.3530, lng: 18.2190, svgX: 1290, svgY: 380 },
    zone: 'B',
    areas: ['perrong'],
    entrances: [{ id: 'tall_strand', name: 'Uppgång Talluddsvägen' }]
  },
  {
    id: 'gashaga',
    name: 'Gåshaga',
    transportTypes: ['sparvag'],
    lineIds: ['lidingobanan_21'],
    coordinates: { lat: 59.3550, lng: 18.2210, svgX: 1325, svgY: 380 },
    zone: 'B',
    areas: ['perrong'],
    entrances: [{ id: 'gash_omr', name: 'Uppgång Gåshaga Gård' }]
  },
  {
    id: 'gashaga_brygga',
    name: 'Gåshaga brygga',
    transportTypes: ['sparvag'],
    lineIds: ['lidingobanan_21'],
    coordinates: { lat: 59.3564, lng: 18.2236, svgX: 1360, svgY: 380 },
    zone: 'B',
    areas: ['perrong'],
    entrances: [{ id: 'gash_farja', name: 'Uppgång Skärgårdsbåtarna / Gåshaga brygga' }]
  },
  // --- NOCKEBYBANAN (L12) ---
  {
    id: 'alleparken',
    name: 'Alléparken',
    transportTypes: ['sparvag'],
    lineIds: ['nockebybanan_12'],
    coordinates: { lat: 59.3290, lng: 17.9730, svgX: 330, svgY: 468 },
    zone: 'A',
    areas: ['perrong'],
    entrances: [{ id: 'alle_vag', name: 'Uppgång Alléparken' }]
  },
  {
    id: 'klovervagen',
    name: 'Klövervägen',
    transportTypes: ['sparvag'],
    lineIds: ['nockebybanan_12'],
    coordinates: { lat: 59.3280, lng: 17.9650, svgX: 310, svgY: 474 },
    zone: 'A',
    areas: ['perrong'],
    entrances: [{ id: 'klov_vag', name: 'Uppgång Klövervägen' }]
  },
  {
    id: 'smedslatten',
    name: 'Smedslätten',
    transportTypes: ['sparvag'],
    lineIds: ['nockebybanan_12'],
    coordinates: { lat: 59.3260, lng: 17.9550, svgX: 290, svgY: 480 },
    zone: 'A',
    areas: ['perrong'],
    entrances: [{ id: 'smeds_torg', name: 'Uppgång Smedslättstorget' }]
  },
  {
    id: 'alstensgatan',
    name: 'Ålstensgatan',
    transportTypes: ['sparvag'],
    lineIds: ['nockebybanan_12'],
    coordinates: { lat: 59.3240, lng: 17.9470, svgX: 270, svgY: 486 },
    zone: 'A',
    areas: ['perrong'],
    entrances: [{ id: 'alst_gat', name: 'Uppgång Ålstensgatan' }]
  },
  {
    id: 'alstens_gard',
    name: 'Ålstens gård',
    transportTypes: ['sparvag'],
    lineIds: ['nockebybanan_12'],
    coordinates: { lat: 59.3220, lng: 17.9400, svgX: 250, svgY: 492 },
    zone: 'A',
    areas: ['perrong'],
    entrances: [{ id: 'alst_gard', name: 'Uppgång Ålstens gård' }]
  },
  {
    id: 'sannadal',
    name: 'Sannadal',
    transportTypes: ['sparvag'],
    lineIds: ['nockebybanan_12'],
    coordinates: { lat: 59.3210, lng: 17.9330, svgX: 230, svgY: 498 },
    zone: 'A',
    areas: ['perrong'],
    entrances: [{ id: 'sann_vag', name: 'Uppgång Sannadalsvägen' }]
  },
  {
    id: 'hoglandet',
    name: 'Höglandet',
    transportTypes: ['sparvag'],
    lineIds: ['nockebybanan_12'],
    coordinates: { lat: 59.3220, lng: 17.9270, svgX: 210, svgY: 504 },
    zone: 'A',
    areas: ['perrong'],
    entrances: [{ id: 'hogl_vag', name: 'Uppgång Höglandstorget' }]
  },
  {
    id: 'olovslund',
    name: 'Olovslund',
    transportTypes: ['sparvag'],
    lineIds: ['nockebybanan_12'],
    coordinates: { lat: 59.3230, lng: 17.9220, svgX: 190, svgY: 508 },
    zone: 'A',
    areas: ['perrong'],
    entrances: [{ id: 'olov_torg', name: 'Uppgång Olovslundsskolan' }]
  },
  {
    id: 'nockeby_torg',
    name: 'Nockeby torg',
    transportTypes: ['sparvag'],
    lineIds: ['nockebybanan_12'],
    coordinates: { lat: 59.3240, lng: 17.9180, svgX: 170, svgY: 510 },
    zone: 'A',
    areas: ['perrong'],
    entrances: [{ id: 'nock_torg_1', name: 'Uppgång Nockeby torg' }]
  },
  {
    id: 'nockeby',
    name: 'Nockeby',
    transportTypes: ['sparvag'],
    lineIds: ['nockebybanan_12'],
    coordinates: { lat: 59.3242, lng: 17.9172, svgX: 150, svgY: 510 },
    zone: 'A',
    areas: ['perrong'],
    entrances: [{ id: 'nock_torg', name: 'Uppgång Nockebyhallen' }]
  },

  // --- TVÄRBANAN (L30 & L31) ---
  {
    id: 'solna_business_park',
    name: 'Solna Business Park',
    transportTypes: ['tvarbanan'],
    lineIds: ['tvarbanan_30'],
    coordinates: { lat: 59.3581, lng: 17.9867, svgX: 380, svgY: 295 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'sbp_svetsar', name: 'Uppgång Svetsarvägen / Smidesvägen' }]
  },
  {
    id: 'ballsta_bro',
    name: 'Bällsta bro',
    transportTypes: ['tvarbanan'],
    lineIds: ['tvarbanan_30'],
    coordinates: { lat: 59.3622, lng: 17.9622, svgX: 290, svgY: 355 },
    zone: 'A',
    areas: ['perrong', 'uppgang'],
    entrances: [{ id: 'bb_bro', name: 'Uppgång Bällsta bro / Landsvägen' }]
  },
  {
    id: 'karlsbodavagen',
    name: 'Karlsbodavägen',
    transportTypes: ['tvarbanan'],
    lineIds: ['tvarbanan_30'],
    coordinates: { lat: 59.3564, lng: 17.9619, svgX: 295, svgY: 385 },
    zone: 'A',
    areas: ['perrong', 'uppgang'],
    entrances: [{ id: 'karls_vag', name: 'Uppgång Karlsbodavägen' }]
  },
  {
    id: 'norra_ulvsunda',
    name: 'Norra Ulvsunda',
    transportTypes: ['tvarbanan'],
    lineIds: ['tvarbanan_30', 'tvarbanan_31'],
    coordinates: { lat: 59.3528, lng: 17.9656, svgX: 305, svgY: 415 },
    zone: 'A',
    areas: ['perrong', 'uppgang'],
    entrances: [{ id: 'nu_kungs', name: 'Uppgång Ulvsundavägen' }]
  },
  {
    id: 'johannesfred',
    name: 'Johannesfred',
    transportTypes: ['tvarbanan'],
    lineIds: ['tvarbanan_30', 'tvarbanan_31'],
    coordinates: { lat: 59.3456, lng: 17.9739, svgX: 325, svgY: 440 },
    zone: 'A',
    areas: ['perrong', 'uppgang'],
    entrances: [{ id: 'johan_vagen', name: 'Uppgång Johannesfredsvägen' }]
  },
  {
    id: 'alviks_strand',
    name: 'Alviks strand',
    transportTypes: ['tvarbanan'],
    lineIds: ['tvarbanan_30', 'tvarbanan_31'],
    coordinates: { lat: 59.3292, lng: 17.9881, svgX: 380, svgY: 490 },
    zone: 'A',
    areas: ['perrong', 'uppgang'],
    entrances: [{ id: 'as_gustav', name: 'Uppgång Gustavslundsvägen' }]
  },
  {
    id: 'stora_essingen',
    name: 'Stora Essingen',
    transportTypes: ['tvarbanan'],
    lineIds: ['tvarbanan_30'],
    coordinates: { lat: 59.3208, lng: 17.9897, svgX: 410, svgY: 520 },
    zone: 'A',
    areas: ['perrong', 'uppgang'],
    entrances: [{ id: 'se_torg', name: 'Uppgång Essingetorget / Badstrandsvägen' }]
  },
  {
    id: 'grondal',
    name: 'Gröndal',
    transportTypes: ['tvarbanan'],
    lineIds: ['tvarbanan_30'],
    coordinates: { lat: 59.3161, lng: 18.0089, svgX: 445, svgY: 545 },
    zone: 'A',
    areas: ['perrong', 'uppgang'],
    entrances: [{ id: 'gron_torg', name: 'Uppgång Gröndalsvägen' }]
  },
  {
    id: 'trekanten',
    name: 'Trekanten',
    transportTypes: ['tvarbanan'],
    lineIds: ['tvarbanan_30'],
    coordinates: { lat: 59.3142, lng: 18.0167, svgX: 475, svgY: 570 },
    zone: 'A',
    areas: ['perrong', 'uppgang'],
    entrances: [{ id: 'trek_sjoo', name: 'Uppgång Lövholmsvägen / Trekanten' }]
  },
  {
    id: 'arstadal',
    name: 'Årstadal',
    transportTypes: ['tvarbanan'],
    lineIds: ['tvarbanan_30'],
    coordinates: { lat: 59.3081, lng: 18.0311, svgX: 545, svgY: 635 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'ad_sjovik', name: 'Uppgång Sjövikstorget / Årstavägen' }]
  },
  {
    id: 'arstafaltet',
    name: 'Årstafältet',
    transportTypes: ['tvarbanan'],
    lineIds: ['tvarbanan_30'],
    coordinates: { lat: 59.2972, lng: 18.0489, svgX: 625, svgY: 695 },
    zone: 'A',
    areas: ['perrong', 'uppgang'],
    entrances: [{ id: 'af_faltet', name: 'Uppgång Årstafältet / Ottsjövägen' }]
  },
  {
    id: 'valla_torg',
    name: 'Valla torg',
    transportTypes: ['tvarbanan'],
    lineIds: ['tvarbanan_30'],
    coordinates: { lat: 59.2953, lng: 18.0567, svgX: 660, svgY: 715 },
    zone: 'A',
    areas: ['perrong', 'uppgang'],
    entrances: [{ id: 'vt_torg', name: 'Uppgång Valla torg / Sandfjärdsgatan' }]
  },
  {
    id: 'linde',
    name: 'Linde',
    transportTypes: ['tvarbanan'],
    lineIds: ['tvarbanan_30'],
    coordinates: { lat: 59.2947, lng: 18.0667, svgX: 690, svgY: 730 },
    zone: 'A',
    areas: ['perrong', 'uppgang'],
    entrances: [{ id: 'li_boliden', name: 'Uppgång Bolidensvägen' }]
  },
  {
    id: 'martensdal',
    name: 'Mårtensdal',
    transportTypes: ['tvarbanan'],
    lineIds: ['tvarbanan_30'],
    coordinates: { lat: 59.3031, lng: 18.0892, svgX: 775, svgY: 695 },
    zone: 'A',
    areas: ['perrong', 'uppgang'],
    entrances: [{ id: 'md_alle', name: 'Uppgång Hammarby Fabriksväg' }]
  },
  {
    id: 'luma',
    name: 'Luma',
    transportTypes: ['tvarbanan'],
    lineIds: ['tvarbanan_30'],
    coordinates: { lat: 59.3039, lng: 18.0989, svgX: 800, svgY: 690 },
    zone: 'A',
    areas: ['perrong', 'uppgang'],
    entrances: [{ id: 'luma_torg', name: 'Uppgång Lumaparken / Kölnagatan' }]
  },
  {
    id: 'sickla_kaj',
    name: 'Sickla kaj',
    transportTypes: ['tvarbanan'],
    lineIds: ['tvarbanan_30'],
    coordinates: { lat: 59.3039, lng: 18.1067, svgX: 825, svgY: 685 },
    zone: 'A',
    areas: ['perrong', 'uppgang'],
    entrances: [{ id: 'sk_kaj', name: 'Uppgång Hammarby Allé / Lugnets Allé' }]
  },
  {
    id: 'sickla_udde',
    name: 'Sickla udde',
    transportTypes: ['tvarbanan'],
    lineIds: ['tvarbanan_30'],
    coordinates: { lat: 59.3047, lng: 18.1156, svgX: 850, svgY: 678 },
    zone: 'A',
    areas: ['perrong', 'uppgang'],
    entrances: [{ id: 'su_udde', name: 'Uppgång Sickla Kanalgata' }]
  },
  {
    id: 'sickla',
    name: 'Sickla',
    transportTypes: ['tvarbanan', 'saltsjobanan'],
    lineIds: ['tvarbanan_30', 'saltsjobanan_25'],
    coordinates: { lat: 59.3056, lng: 18.1256, svgX: 875, svgY: 670 },
    zone: 'A',
    areas: ['sparrar', 'perrong', 'uppgang'],
    entrances: [{ id: 'sick_galleria', name: 'Uppgång Sickla Köpkvarter / Stationshuset' }]
  },
  {
    id: 'bromma_flygplats',
    name: 'Bromma flygplats',
    transportTypes: ['tvarbanan'],
    lineIds: ['tvarbanan_31'],
    coordinates: { lat: 59.3547, lng: 17.9467, svgX: 235, svgY: 400 },
    zone: 'A',
    areas: ['perrong', 'uppgang'],
    entrances: [{ id: 'bf_terminal', name: 'Uppgång Bromma Flygplats Terminal' }]
  },
  {
    id: 'bromma_blocks',
    name: 'Bromma Blocks',
    transportTypes: ['tvarbanan'],
    lineIds: ['tvarbanan_31'],
    coordinates: { lat: 59.3533, lng: 17.9556, svgX: 270, svgY: 408 },
    zone: 'A',
    areas: ['perrong', 'uppgang'],
    entrances: [{ id: 'bb_mall', name: 'Uppgång Bromma Blocks Gallerian' }]
  }
];

export function getStationById(id?: string): Station | undefined {
  if (!id) return undefined;
  return STATIONS.find((s) => s.id === id);
}

export function getLineById(id?: string): TransitLine | undefined {
  if (!id) return undefined;
  return TRANSIT_LINES.find((l) => l.id === id);
}
