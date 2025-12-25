
import { Topic, HistoryEntry } from '../types';

/**
 * TOPICS: The 4 main pillars of the history exam curriculum.
 */
export const TOPICS: Topic[] = [
  { id: '1', title: '1. Identitetsdannelse & Samfundstyper', description: 'Fra det traditionelle landsbyfællesskab til det senmoderne informationssamfund.' },
  { id: '2', title: '2. Det Gode Samfund', description: 'Den politiske kamp fra enevælde, gennem landboreformer, til det moderne demokrati.' },
  { id: '3', title: '3. Nazisme, Holocaust & Kold Krig', description: 'De totalitære ideologier, krigens rædsler og stormagtsbalancen efter 1945.' },
  { id: '4', title: '4. Kulturmøder', description: 'Dansk identitet i en globaliseret verden og historiske perspektiver på indvandring.' },
];

/**
 * HISTORY_ENTRIES: This is your "Database". 
 * When you get more readings, add objects here following this format.
 * 
 * TYPES:
 * - 'event': Specific historical occurrences with dates.
 * - 'term': Key concepts, theories, or sociological markers.
 * - 'concept': Broader historical trends.
 */
export const HISTORY_ENTRIES: HistoryEntry[] = [
  // --- TOPIC 1: IDENTITETSDANNELSE ---
  {
    id: 't1_traditional',
    topicId: '1',
    type: 'term',
    title: 'Traditionssamfundet (Myren)',
    description: 'Et samfund baseret på landbrug og landsbyfællesskab. Religion styrede hverdagen, og man fulgte i sine forældres fodspor.',
    tags: ['Sociologi', 'Tradition', 'David Riesman'],
    questions: [
      {
        id: 'q1_1',
        question: 'Hvilket dyr bruger sociologen David Riesman som metafor for mennesket i det traditionelle samfund?',
        options: ['Sneglen', 'Kamæleonen', 'Myren', 'Løven'],
        correctAnswer: 'Myren',
        explanation: 'Individet er en del af en større helhed, hvor man gør det samme som generationerne før en.'
      }
    ]
  },
  {
    id: 't1_modern',
    topicId: '1',
    type: 'term',
    title: 'Det Moderne Samfund (Sneglen)',
    description: 'Industrisamfundet. Folk flyttede til byerne (urbanisering). Kernefamilien blev central, og man blev "indre-styret" af faste normer.',
    tags: ['Industri', 'Urbanisering', 'Moderne'],
    questions: []
  },
  {
    id: 't1_late_modern',
    topicId: '1',
    type: 'term',
    title: 'Det Senmoderne Samfund (Kamæleonen)',
    description: 'Det nuværende informationssamfund. Præget af globalisering, øget refleksivitet og en formbar identitet, der tilpasses situationen.',
    tags: ['Globalisering', 'Refleksivitet', 'Giddens'],
    questions: []
  },

  // --- TOPIC 2: DET GODE SAMFUND ---
  {
    id: 't2_absolutism',
    topicId: '2',
    type: 'event',
    title: 'Enevældens Indførelse',
    date: '1660',
    description: 'Frederik 3. indførte enevælden, hvilket centraliserede magten hos kongen og svækkede adelens indflydelse.',
    tags: ['Magt', 'Politik', 'Absolutisme'],
    questions: [
      {
        id: 'q2_1',
        question: 'Hvornår blev enevælden indført i Danmark?',
        options: ['1536', '1660', '1788', '1849'],
        correctAnswer: '1660'
      }
    ]
  },
  {
    id: 't2_reforms',
    topicId: '2',
    type: 'event',
    title: 'Stavnsbåndets Løsning',
    date: '1788',
    description: 'En del af de store landboreformer. Gav bønderne frihed til at flytte og banede vejen for et frit arbejdsmarked.',
    tags: ['Frihed', 'Landboreformer', 'Landbrug'],
    questions: []
  },
  {
    id: 't2_constitution',
    topicId: '2',
    type: 'event',
    title: 'Grundlovens Indførelse',
    date: '5. juni 1849',
    description: 'Afslutningen på enevælden. Danmark fik sit første (begrænsede) demokrati med magtens tredeling.',
    tags: ['Demokrati', 'Grundlov', 'Politik'],
    questions: [
      {
        id: 'q2_2',
        question: 'Hvad markerede Grundloven af 1849 i dansk historie?',
        options: ['Enevældens begyndelse', 'Stavnsbåndets indførelse', 'Afslutningen på enevælden', 'Industrialiseringen'],
        correctAnswer: 'Afslutningen på enevælden'
      }
    ]
  },

  // --- TOPIC 3: NAZISME & KOLD KRIG ---
  {
    id: 't3_holocaust',
    topicId: '3',
    type: 'term',
    title: 'Holocaust',
    description: 'Det systematiske folkedrab på ca. 6 millioner jøder under 2. verdenskrig, planlagt og udført af Nazi-Tyskland.',
    tags: ['Folkedrab', '2. Verdenskrig', 'Nazisme'],
    questions: []
  },
  {
    id: 't3_wall',
    topicId: '3',
    type: 'event',
    title: 'Berlinmurens Fald',
    date: '1989',
    description: 'Symboliserede afslutningen på Den Kolde Krig og jerntæppets fald i Europa.',
    tags: ['Kold Krig', 'Europa', 'Tyskland'],
    questions: [
      {
        id: 'q3_1',
        question: 'Hvilket år faldt Berlinmuren?',
        options: ['1961', '1985', '1989', '1991'],
        correctAnswer: '1989'
      }
    ]
  },

  // --- TOPIC 4: KULTURMØDER ---
  {
    id: 't4_loegmodel',
    topicId: '4',
    type: 'term',
    title: 'Hofstedes Løgmodel',
    description: 'En model til at forstå kultur i lag: Symboler, Helte, Ritualer og de inderste Værdier.',
    tags: ['Kulturteori', 'Teori'],
    questions: [
      {
        id: 'q4_1',
        question: 'Hvad er det inderste lag i Hofstedes løgmodel?',
        options: ['Symboler', 'Ritualer', 'Helte', 'Værdier'],
        correctAnswer: 'Værdier',
        explanation: 'Værdier er de sværeste at se og de sværeste at ændre i en kultur.'
      }
    ]
  },
  {
    id: 't4_immigration_law',
    topicId: '4',
    type: 'event',
    title: 'Udlændingeloven af 1983',
    date: '1983',
    description: 'En historisk liberal lov, der gav flygtninge retskrav på asyl og familiesammenføring i Danmark.',
    tags: ['Indvandring', 'Lovgivning', 'Politik'],
    questions: []
  }
];
