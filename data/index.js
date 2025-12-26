import { emne0_entries, emne0_sources, emne0_exams } from './emne0.js';
import { emne1_entries, emne1_sources, emne1_exams } from './emne1.js';
import { emne2_entries, emne2_sources, emne2_exams } from './emne2.js';
import { emne3_entries, emne3_sources, emne3_exams } from './emne3.js';
import { emne4_entries, emne4_sources, emne4_exams } from './emne4.js';

export const TOPICS = [
  { id: '0', title: 'Historisk Metode & Teori', description: 'Kildekritik, billedanalyse og historiebrug.' },
  { id: '1', title: 'Identitetsdannelse & Samfundstyper', description: 'Fra landsbyfællesskab til industrisamfund og socialstat.' },
  { id: '2', title: 'Det Gode Samfund', description: 'Landboreformer, demokrati og den politiske kamp.' },
  { id: '3', title: 'Nazisme & Holocaust', description: 'Totalitære ideologier og krigens rædsler.' },
  { id: '4', title: 'Kulturmøder', description: 'Dansk identitet og globalisering.' },
];

export const HISTORY_ENTRIES = [
  ...emne0_entries,
  ...emne1_entries,
  ...emne2_entries,
  ...emne3_entries,
  ...emne4_entries,
];

// Master Source assessment with multi-stage inquiry
export const PRIMARY_SOURCES = [
  // --- EMNE 1 SOURCES ---
  {
    id: 's1_mindeblad', topicId: '1', title: 'Mindeblad: Børneopdragelse (ca. 1900)',
    text: '"Man havde blot at lystre! Der var ikke andet at gøre, sådan som ingen børn havde noget at skulle have sagt i hjemmene på den tid... Far ville have fred og ro, når han kom hjem efter en lang arbejdsdag."',
    questions: [
      { question: 'Hvilket samfund og familietype beskriver kilden?', options: ['Den autoritære arbejderfamilie under industrialiseringen', 'Det moderne parforhold', 'Enevældens adel', 'Senmoderniteten'], correctAnswer: 'Den autoritære arbejderfamilie under industrialiseringen' },
      { question: 'Hvad fortæller kilden om farens rolle?', options: ['Han var den ubestridte autoritet hvis behov dikterede hjemmets ro', 'Han var omsorgsfuld og legesyg', 'Han hjalp med madlavningen', 'Han var aldrig hjemme'], correctAnswer: 'Han var den ubestridte autoritet hvis behov dikterede hjemmets ro' },
      { question: 'Vurdér kildens troværdighed som "beretning".', options: ['Den er en erindring (skrevet efterfølgende) og kan være farvet af følelser', 'Den er en objektiv statistik', 'Den er en lovtekst og derfor 100% sand', 'Den kan slet ikke bruges'], correctAnswer: 'Den er en erindring (skrevet efterfølgende) og kan være farvet af følelser' }
    ]
  },
  // --- EMNE 2 SOURCES ---
  {
    id: 's2_locke_civil', topicId: '2', title: 'John Locke: Two Treatises of Government (1689)',
    text: '"Formålet med loven er ikke at afskaffe eller begrænse friheden, men at bevare og udvide den... For i alle tilstande af skabte væsener, der er i stand til love, hvor der ingen lov er, er der ingen frihed."',
    questions: [
      { question: 'Hvad er Lockes syn på forholdet mellem lov og frihed?', options: ['Loven er en forudsætning for frihed, da den beskytter individet', 'Lov og frihed er modsætninger', 'Man skal afskaffe alle love for at være fri', 'Kun kongen må have frihed'], correctAnswer: 'Loven er en forudsætning for frihed, da den beskytter individet' },
      { question: 'Hvilken politisk strømning lagde Locke grunden til?', options: ['Liberalismen', 'Nazismen', 'Absolutismen', 'Kommunismen'], correctAnswer: 'Liberalismen' },
      { question: 'Hvad ville Locke mene om en enevældig konge uden love?', options: ['At han er en tyran der krænker naturretten', 'At han er guds gave', 'At han er nødvendig for orden', 'Det havde han ingen holdning til'], correctAnswer: 'At han er en tyran der krænker naturretten' }
    ]
  },
  // --- EMNE 3 SOURCES ---
  {
    id: 's3_suchomel_treblinka', topicId: '3', title: 'Franz Suchomel (SS) om Treblinka',
    text: '"Menneskene faldt ud som kartofler... Det forfærdede og chokerede os naturligvis. Vi gik tilbage og satte os på vore kufferter, og så græd vi som gamle kvinder... Jorden slog pukler på grund af gasarterne fra ligene."',
    questions: [
      { question: 'Hvilken effekt har Suchomels sprogbrug ("kartofler")?', options: ['Det viser en dehumanisering af ofrene', 'Det viser han var sulten', 'Det beskriver deres vægt præcist', 'Det er en teknisk term for fanger'], correctAnswer: 'Det viser en dehumanisering af ofrene' },
      { question: 'Hvad fortæller kilden om gerningsmændenes reaktion?', options: ['De følte afsky i starten men fortsatte alligevel deres arbejde', 'De nægtede at udføre ordren', 'De var stolte og glade', 'De hjalp fangerne med at flygte'], correctAnswer: 'De følte afsky i starten men fortsatte alligevel deres arbejde' },
      { question: 'Hvordan kan kilden bruges til at forklare "bureaukratisk massemord"?', options: ['Den viser hvordan drab blev en industriel proces der overvældede individets moral', 'Den viser at teknologien var dårlig', 'Den viser at alt var tilfældigt', 'Den viser at der ikke var nogen ledelse'], correctAnswer: 'Den viser hvordan drab blev en industriel proces der overvældede individets moral' }
    ]
  },
  // --- EMNE 4 SOURCES ---
  {
    id: 's4_piak_1999', topicId: '4', title: 'Pia Kjærsgaard (DF): Årsmødetale (1999)',
    text: '"Nutidens indvandrere er for det meste mennesker fra den tredje verden og hovedsagelig muslimer, som ikke har nogen som helst vilje til at blive en del af danskheden. De kommer med bagagen fuld af mandschauvinisme og kvindeundertrykkelse."',
    questions: [
      { question: 'Hvad er kildens primære "tendens"?', options: ['Stærkt kritisk over for muslimsk indvandring og kulturel mangfoldighed', 'Neutral og beskrivende', 'Positiv over for globalisering', 'Videnskabelig og statistisk'], correctAnswer: 'Stærkt kritisk over for muslimsk indvandring og kulturel mangfoldighed' },
      { question: 'Hvilket argument bruger afsenderen for at begrænse indvandring?', options: ['At den truer den nationale kultur og værdier ("danskheden")', 'At det er for dyrt', 'At der mangler huse', 'At vi skal spare på maden'], correctAnswer: 'At den truer den nationale kultur og værdier ("danskheden")' },
      { question: 'Hvem er kildens tiltænkte målgruppe?', options: ['DF-vælgere og den brede danske befolkning', 'Udenlandske politikere', 'Forskere på universitetet', 'Indvandrere selv'], correctAnswer: 'DF-vælgere og den brede danske befolkning' }
    ]
  }
];

export const EXAM_INTERPRETATIONS = [
  ...emne0_exams,
  ...emne1_exams,
  ...emne2_exams,
  ...emne3_exams,
  ...emne4_exams,
];