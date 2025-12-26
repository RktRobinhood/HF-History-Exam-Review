export const EXAM_SETS = [
  {
    id: 'ep_holocaust_deep',
    topicId: '3',
    title: 'Jødeudryddelsen – Motiv og Ansvar',
    description: 'En dybdegående analyse af Wansee-protokollen vs. moderne historiefaglige forklaringer (Goldhagen vs. Aly).',
    sources: [
      {
        id: 's_wansee',
        title: 'Wansee-protokollen (20. jan 1942)',
        text: 'Hemmelig rigssag! Under passende ledelse skal jøderne i løbet af den endelige løsning nu på formålstjenlig måde indsættes i arbejde i Øst. I store arbejdskolonner, med mænd og kvinder adskilt, skal de arbejdsdygtige jøder føres til disse områder under vejbygning, hvorved en stor del utvivlsomt vil udgå ved naturligt frafald. De, som eventuelt bliver tilbage, må behandles i overensstemmelse hermed, da de repræsenterer en naturlig elite...',
        analysis: 'Kilden er et levn (primær). Læg mærke til eufemismerne som "naturligt frafald" (død ved udmattelse) og "behandles i overensstemmelse hermed" (likvidering). Det viser det systematiske statslige planlægningsniveau.'
      },
      {
        id: 's_goldhagen',
        title: 'Daniel Goldhagen: Hitlers villige bødler (1996)',
        text: 'De mænd, der udførte drabene, vidste, at de ikke var tvunget til det. De valgte villigt at slagte jødiske mænd, kvinder og børn. De almindelige tyskere så verden sådan, at nedslagtningen var en objektiv nødvendighed. Det var deres eliminatoriske antisemitisme, der drev værket.',
        analysis: 'Goldhagen repræsenterer en intentionalistisk tese. Han fokuserer på aktørernes (almindelige tyskeres) mentalitet og had som den primære drivkraft.'
      },
      {
        id: 's_aly',
        title: 'Götz Aly: Hitlers folkestat (2005)',
        text: 'Jødeforfølgelserne gav tyskerne betydelige indtægter. Allerede i 1938 indkasserede staten en milliard guldmark gennem en bod... Krigen kunne finansieres samtidig med at den tyske befolknings levestandard blev opretholdt. "Ariseringen" var en enorm mobilisering af materielle værdier.',
        analysis: 'Aly repræsenterer en funktionalistisk/materialistisk tese. Han ser Holocaust som et middel til økonomisk stabilisering af regimet.'
      }
    ],
    questions: [
      {
        type: 'mcq',
        question: 'Hvad er den vigtigste kildekritiske pointe ved at kalde Wansee-protokollen for et "levn"?',
        options: [
          'At den er en direkte rest af selve den nazistiske planlægning',
          'At den fortæller sandheden om alle tyskere',
          'At den er skrevet af en historiker efter krigen',
          'At den er upålidelig fordi den bruger svære ord'
        ],
        correctAnswer: 'At den er en direkte rest af selve den nazistiske planlægning'
      },
      {
        type: 'matching',
        question: 'Match historikeren/dokumentet med den korrekte historiefaglige forklaring:',
        pairs: [
          { item: 'Wansee-protokollen', match: 'Bureaukratisk logistik og statslig koordinering' },
          { item: 'Daniel Goldhagen', match: 'Eliminatorisk antisemitisme hos jævne tyskere' },
          { item: 'Götz Aly', match: 'Økonomisk plyndring og finansiering af velfærd' }
        ]
      },
      {
        type: 'mcq',
        question: 'Hvilken betydning tillægger Götz Aly de økonomiske faktorer i jødeforfølgelsen?',
        options: [
          'De var afgørende for at bevare tyskernes opbakning til regimet',
          'De var helt irrelevante for folkedrabet',
          'De skyldtes en fejl i bankvæsenet',
          'De blev først vigtige efter krigens afslutning'
        ],
        correctAnswer: 'De var afgørende for at bevare tyskernes opbakning til regimet'
      }
    ]
  },
  {
    id: 'ep_1849_democracy',
    topicId: '2',
    title: 'Grundloven 1849 – Fra Enevælde til Demokrati',
    description: 'Analyse af Junigrundloven, Orla Lehmann og magtens tredeling.',
    sources: [
      {
        id: 's_lehmann',
        title: 'Orla Lehmann: Casino-talen (1848)',
        text: 'Vi kræve en Ministerforandring! Vi kræve en fri forfatning! Vi erklære, at vi ikke ville lade os kue af nogen Magt, men ville forsvare vor Ret og vor Frihed! Kongen skal ledes af mænd, der har folkets tillid.',
        analysis: 'Kilden viser det national-liberale borgerskabs pres på kongen. Det er en kilde med stærk tendens.'
      },
      {
        id: 's_grundlov',
        title: 'Junigrundloven (5. juni 1849)',
        text: '§ 2: Den lovgivende Magt er hos Kongen og Rigsdagen i Forening. Den udøvende Magt er hos Kongen. Den dømmende Magt er hos Domstolene. (...) § 83: Alle Indvaanere have Ret til at forene sig i Selskaber... uden foregaaende Tilladelse.',
        analysis: 'Dokumentet cementerer magtens tredeling og borgerlige frihedsrettigheder.'
      }
    ],
    questions: [
      {
        type: 'matching',
        question: 'Match paragrafen/begrebet med den korrekte magtinstans:',
        pairs: [
          { item: 'Lovgivende magt', match: 'Kongen og Rigsdagen i forening' },
          { item: 'Udøvende magt', match: 'Kongen (og hans ministre)' },
          { item: 'Dømmende magt', match: 'Domstolene' }
        ]
      },
      {
        type: 'mcq',
        question: 'Hvilken gruppe var udelukket fra stemmeret i 1849 (de "7 F\'er")?',
        options: [
          'Fruentimmere, folkehold, fattige, fremmede, forbrydere, fjolser og fallenter',
          'Kun kvinder og børn',
          'Kun dem der boede i byerne',
          'Alle der ikke ejede en hest'
        ],
        correctAnswer: 'Fruentimmere, folkehold, fattige, fremmede, forbrydere, fjolser og fallenter'
      }
    ]
  },
  {
    id: 'ep_1864_trauma',
    topicId: '2',
    title: '1864 og det Nationale Chok',
    description: 'Nederlaget ved Dybbøl og dets betydning for dansk identitet.',
    sources: [
      {
        id: 's_de_meza',
        title: 'General de Meza om rømningen af Dannevirke (1864)',
        text: 'At holde Dannevirke vil betyde hærens totale udslettelse. Vi må rømme nu for at redde Danmark senere. Det er en tung men nødvendig beslutning.',
        analysis: 'En militær vurdering der førte til politisk raseri. Viser konflikten mellem militær realisme og politisk idealisme.'
      },
      {
        id: 's_identitet',
        title: 'Hvad udad tabes, skal indad vindes (Motto efter 1864)',
        text: 'Efter tabet af hertugdømmerne i 1864 skiftede det danske fokus fra stormagtsdrømme til indre opbygning. Hedens opdyrkning og højskolernes fremvækst blev en del af genopretningen.',
        analysis: 'Viser skiftet fra krig og territorium til kultur og selvstændighed som nationale værdier.'
      }
    ],
    questions: [
      {
        type: 'mcq',
        question: 'Hvad blev den langsigtede politiske konsekvens af nederlaget i 1864?',
        options: [
          'Danmark førte en mere forsigtig neutralitetspolitik og blev en småstat',
          'Danmark erobrede Slesvig tilbage straks efter',
          'Enevælden blev genindført som straf',
          'Man holdt op med at bruge det danske flag'
        ],
        correctAnswer: 'Danmark førte en mere forsigtig neutralitetspolitik og blev en småstat'
      }
    ]
  },
  {
    id: 'ep_industrial_social',
    topicId: '1',
    title: 'Industrialiseringen og Arbejderbevægelsen',
    description: 'Arbejderfamiliens vilkår og kampen for rettigheder.',
    sources: [
      {
        id: 's_bolig',
        title: 'Lægeberetning om boligforhold i København (1885)',
        text: 'I disse kældre bor 8-10 mennesker i ét rum. Fugten driver ned af væggene, og lugten er ubeskrivelig. Børnene dør af tæring før de fylder fem.',
        analysis: 'Oversigtskilde der viser de usunde levevilkår i industrialiseringens byer og den sociale ulighed.'
      },
      {
        id: 's_september',
        title: 'Septemberforliget (1899) – Uddrag',
        text: 'Arbejdsgiverne anerkender arbejdernes ret til at organisere sig, mod at arbejderne anerkender arbejdsgiverens ret til at lede og fordele arbejdet.',
        analysis: 'Arbejdsmarkedets grundlov – et centralt kompromis der skabte varig stabilitet i det danske samfund.'
      }
    ],
    questions: [
      {
        type: 'matching',
        question: 'Match begrebet med dets betydning i industrisamfundet:',
        pairs: [
          { item: 'Urbanisering', match: 'Flytning fra land til by' },
          { item: 'Septemberforliget', match: 'Kompromis mellem LO og DA' },
          { item: 'Organiseringsret', match: 'Retten til at danne fagforeninger' }
        ]
      }
    ]
  },
  {
    id: 'ep_welfare_state',
    topicId: '2',
    title: 'Velfærdsstaten og Retsprincippet',
    description: 'Steinckes socialreform og skiftet fra almisse til ret.',
    sources: [
      {
        id: 's_steincke',
        title: 'K.K. Steincke: Social reform (1933)',
        text: 'Det er ikke længere et spørgsmål om barmhjertighed, men om retfærdighed. Borgeren skal have krav på hjælp, når livet bliver svært, uden at miste sine borgerlige rettigheder.',
        analysis: 'Kernen i retsprincippet. Velfærd er en rettighed, ikke en gave fra rige filantroper.'
      },
      {
        id: 's_kansler',
        title: 'Kanslergadeforliget (1933) – Oversigt',
        text: 'En bred politisk aftale der sikrede landbruget støtte og arbejderne social sikkerhed. Det lagde grundstenen til den moderne velfærdsstat.',
        analysis: 'En strategisk politisk aftale (kompromis) under den økonomiske verdenskrise.'
      }
    ],
    questions: [
      {
        type: 'mcq',
        question: 'Hvad var den største ændring med Steinckes reform i 1933?',
        options: [
          'Hjælp blev en juridisk ret frem for et tilfældigt skøn (almisse)',
          'Hjælpen blev sat ned for at spare penge',
          'Alle fik gratis biler af staten',
          'Kirken skulle nu stå for al velfærd'
        ],
        correctAnswer: 'Hjælp blev en juridisk ret frem for et tilfældigt skøn (almisse)'
      }
    ]
  }
];
