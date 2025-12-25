
export const TOPICS = [
  { id: '0', title: 'Historisk Metode & Teori', description: 'Kildekritik, årsagsforklaringer og historiebrug.' },
  { id: '1', title: 'Identitetsdannelse & Samfundstyper', description: 'Fra landsbyfællesskab til industrisamfund og socialstat.' },
  { id: '2', title: 'Det Gode Samfund', description: 'Landboreformer, demokrati og den politiske kamp.' },
  { id: '3', title: 'Nazisme & Holocaust', description: 'Totalitære ideologier og krigens rædsler.' },
  { id: '4', title: 'Kulturmøder', description: 'Dansk identitet og globalisering.' },
];

export const HISTORY_ENTRIES = [
  // --- TOPIC 0: METODE ---
  {
    id: 'm1', topicId: '0', type: 'concept', title: 'Primær vs. Sekundær Kilde',
    description: 'En primær kilde er det tidligst bevarede udtryk for en begivenhed. En sekundær kilde bygger på en anden kilde.',
    questions: [
      { question: 'Hvad er den vigtigste forskel på en primær og sekundær kilde?', options: ['Primær er skrevet af en historiker', 'Primær er den tidligste kilde til begivenheden', 'Sekundær er altid mere troværdig', 'Primær er altid en lovtekst'], correctAnswer: 'Primær er den tidligste kilde til begivenheden' }
    ]
  },
  {
    id: 'm2', topicId: '0', type: 'concept', title: 'Repræsentativitet',
    description: 'Undersøgelse af om en kilde afspejler en bredere tendens eller kun et enkelt individs holdning.',
    questions: [
      { question: 'Hvorfor er repræsentativitet svært i ældre historie?', options: ['Fordi alle kunne skrive', 'Fordi det kun var eliten (overklassen) der efterlod skriftlige kilder', 'Fordi kilderne er for lange', 'Fordi der er for mange kilder'], correctAnswer: 'Fordi det kun var eliten (overklassen) der efterlod skriftlige kilder' }
    ]
  },
  {
    id: 'm3', topicId: '0', type: 'concept', title: 'Drivkræfter: Økonomien',
    description: 'Ifølge Karl Marx er de materielle forhold (produktionsmidlerne) den primære drivkraft i historien.',
    questions: [
      { question: 'Hvem forbindes med teorien om at økonomien er historiens motor?', options: ['Adolf Hitler', 'Karl Marx', 'Thorvald Stauning', 'Frederik 3.'], correctAnswer: 'Karl Marx' }
    ]
  },

  // --- TOPIC 1: IDENTITET & SAMFUND ---
  {
    id: 't1_b1', topicId: '1', type: 'concept', title: 'Nærestanden',
    description: 'Håndværkere og bønder i det feudale samfund, der producerede "næringen" til alle samfundets stænder.',
    questions: [
      { question: 'Hvilke grupper udgjorde "nærestanden" i det feudale Danmark?', options: ['Adel og gejstlige', 'Bønder og håndværkere', 'Kongen og hans mænd', 'Kun selvejergårdmænd'], correctAnswer: 'Bønder og håndværkere' }
    ]
  },
  {
    id: 't1_b2', topicId: '1', type: 'concept', title: 'Husbond',
    description: 'Det ubetingede overhoved i bondehusstanden. Havde det sidste ord og revselsesret over tyende og børn.',
    questions: [
      { question: 'Hvilken rolle havde "Husbonden" i 1700-tallets bondefamilie?', options: ['Han var demokratisk valgt', 'Han var det ubetingede overhoved med revselsesret', 'Han stod kun for madlavningen', 'Han var underlagt konens beslutninger'], correctAnswer: 'Han var det ubetingede overhoved med revselsesret' }
    ]
  },
  {
    id: 't1_a1', topicId: '1', type: 'concept', title: 'Ufaglærte Arbejdere (1870+)',
    description: 'Indvandrere fra landet til byerne, der fik det hårde arbejde uden krav om kvalifikationer.',
    questions: [
      { question: 'Hvad skete der med indvandringen til byerne i 1870erne?', options: ['Den stoppede helt', 'Den tog rigtig fart, og man begyndte at tale om en arbejderklasse', 'Folk flyttede fra by til land', 'Kun adelen flyttede til København'], correctAnswer: 'Den tog rigtig fart, og man begyndte at tale om en arbejderklasse' }
    ]
  },
  {
    id: 't1_s1', topicId: '1', type: 'event', title: '48 timers arbejdsugen', date: '1919',
    description: 'En vigtig milepæl i arbejderbevægelsens kamp, der gav mere fritid til familien.',
    questions: [
      { question: 'Hvornår blev 48-timers arbejdsugen kæmpet igennem?', options: ['1849', '1919', '1960', '1788'], correctAnswer: '1919' }
    ]
  },
  {
    id: 't1_mod1', topicId: '1', type: 'concept', title: 'P-pillen og Kvindens Identitet',
    description: 'Introduceret i 1960erne. Gav kvinder kontrol over fødsler og muliggjorde fast tilknytning til arbejdsmarkedet.',
    questions: [
      { question: 'Hvilken betydning havde prævention (f.eks. p-pillen) for 1960ernes kvinder?', options: ['Ingen betydning', 'Den gjorde dem mindre økonomisk uafhængige', 'Den gav kontrol over børneantal og muliggjorde karriere', 'Den blev forbudt i 1960'], correctAnswer: 'Den gav kontrol over børneantal og muliggjorde karriere' }
    ]
  }
];

export const PRIMARY_SOURCES = [
  {
    id: 'ps1', topicId: '1', title: 'Mindeblad: Børneopdragelse (ca. 1900)',
    text: '"Man havde blot at lystre! Der var ikke andet at gøre, sådan som ingen børn havde noget at skulle have sagt i hjemmene på den tid... Far ville have fred og ro, når han kom hjem efter en lang arbejdsdag."',
    questions: [
      { question: 'Hvilken familietype beskriver denne kilde?', options: ['Den senmoderne familie', 'Den autoritære arbejderfamilie under industrialiseringen', 'Den feudale adelsfamilie', 'Et kollektiv i 1970erne'], correctAnswer: 'Den autoritære arbejderfamilie under industrialiseringen', explanation: 'Beskrivelsen af lystring og farens behov for ro efter fabriksarbejde er typisk for perioden.' },
      { question: 'Hvis du skal vurdere kildens troværdighed, hvad er så vigtigt?', options: ['At forfatteren er et barn', 'At det er en erindring (skrevet efter begivenhederne)', 'At den er trykt i en avis', 'At den er skrevet på computer'], correctAnswer: 'At det er en erindring (skrevet efter begivenhederne)', explanation: 'Erindringer kan være præget af efterrationalisering, selvom de er førstehåndsberetninger.' }
    ]
  },
  {
    id: 'ps2', topicId: '2', title: 'Stavnsbåndets ophævelse (Satirisk stik 1787)',
    text: 'Billedet viser en "lykkelig" bonde, der træder på pisken og åget (symboler på hoveri).',
    questions: [
      { question: 'Hvad symboliserer "pisken" i kilder fra 1700-tallet?', options: ['Godsejerens ret til at straffe og tvinge til hoveri', 'Bonden der leger med sine dyr', 'Et tegn på rigdom', 'En gave fra kongen'], correctAnswer: 'Godsejerens ret til at straffe og tvinge til hoveri' }
    ]
  }
];

export const EXAM_INTERPRETATIONS = [
  {
    id: 'ei1', topicId: '1',
    examQuestion: 'Analysér udviklingen i familiemønstre fra 1950 til 2000.',
    subtext: [
      { question: 'Hvad er den "skjulte" faglige forventning her?', options: ['At du nævner hvad man spiste til aftensmad', 'At du forklarer skiftet fra husmor-idealet til den udearbejdende kvinde', 'At du kun taler om Grundloven', 'At du nævner navnene på alle kongerne'], correctAnswer: 'At du forklarer skiftet fra husmor-idealet til den udearbejdende kvinde' },
      { question: 'Hvilket begreb vil give dig en højere karakter (10/12)?', options: ['"Den gode gamle tid"', '"Kønsarbejdsdeling"', '"Landbrug"', '"Hyggen"'], correctAnswer: '"Kønsarbejdsdeling"', explanation: 'Brug af præcise sociologiske begreber viser overblik.' }
    ]
  }
];
