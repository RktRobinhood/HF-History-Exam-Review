
import { Topic, HistoryEntry } from '../types';

export const TOPICS: Topic[] = [
  { id: '1', title: 'Identitetsdannelse & Samfundstyper', description: 'De tre samfundstyper: Traditionel, Moderne og Senmoderne.' },
  { id: '2', title: 'Det Gode Samfund', description: 'Fra Enevælde til Demokrati, Landboreformer og Industrialisering.' },
  { id: '3', title: 'Nazisme, Holocaust & Kold Krig', description: '3. Rige, ideologiernes kamp og efterkrigstiden.' },
  { id: '4', title: 'Kulturmøder', description: 'Globalisering, indvandring og kulturelle strategier i Danmark.' },
];

export const HISTORY_ENTRIES: HistoryEntry[] = [
  // TOPIC 1
  {
    id: 't1_1',
    topicId: '1',
    type: 'term',
    title: 'Traditionssamfundet (Myren)',
    description: 'Et samfund præget af feudalisme, landsbyfællesskab og religion. Individet følger i forældrenes fodspor ("myren" i tuen). Fokus på overlevelse og tradition.',
    tags: ['Sociologi', 'Tradition'],
    questions: [
      {
        id: 'q1',
        question: 'Hvilken arketype bruges ofte til at beskrive mennesket i det traditionelle samfund?',
        options: ['Sneglen', 'Kamæleonen', 'Myren', 'Løven'],
        correctAnswer: 'Myren',
        explanation: 'Individet ses som en del af en større helhed, hvor man gør det samme som generationerne før en.'
      }
    ]
  },
  {
    id: 't1_2',
    topicId: '1',
    type: 'term',
    title: 'Det Moderne Samfund (Sneglen)',
    description: 'Industrisamfundet. Urbanisering, kernefamilie og industrialisering. Individet har sit hjem med sig ("sneglen"), men følger faste normer.',
    tags: ['Industri', 'Moderne'],
    questions: []
  },
  {
    id: 't1_3',
    topicId: '1',
    type: 'term',
    title: 'Det Senmoderne Samfund (Kamæleonen)',
    description: 'Informationssamfundet. Globalisering, øget refleksivitet og formbar identitet. Individet tilpasser sig konteksten som en kamæleon.',
    tags: ['Senmoderne', 'Globalisering'],
    questions: []
  },

  // TOPIC 2
  {
    id: 't2_1',
    topicId: '2',
    type: 'event',
    title: 'Enevældens Indførelse i Danmark',
    date: '1660',
    description: 'Frederik 3. indførte enevælden, hvilket centraliserede magten hos kongen og svækkede adelen.',
    tags: ['Magt', 'Politik'],
    questions: [
      {
        id: 'q2',
        question: 'Hvornår blev enevælden indført i Danmark?',
        options: ['1849', '1660', '1788', '1536'],
        correctAnswer: '1660'
      }
    ]
  },
  {
    id: 't2_2',
    topicId: '2',
    type: 'event',
    title: 'Stavnsbåndets Løsning',
    date: '1788',
    description: 'En del af landboreformerne, der gav bønderne personlig frihed og muliggjorde effektiviseringen af landbruget.',
    tags: ['Landboreformer', 'Frihed'],
    questions: []
  },
  {
    id: 't2_3',
    topicId: '2',
    type: 'event',
    title: 'Danmarks Riges Grundlov',
    date: '5. juni 1849',
    description: 'Afslutningen på enevælden og indførelsen af konstitutionelt monarki og demokrati (dog med begrænset valgret).',
    tags: ['Demokrati', 'Politik'],
    questions: []
  },

  // TOPIC 3
  {
    id: 't3_1',
    topicId: '3',
    type: 'term',
    title: 'Holocaust',
    description: 'Systematisk statsligt organiseret forfølgelse og drab på ca. 6 millioner europæiske jøder samt andre minoritetsgrupper udført af Nazi-Tyskland (1941-1945).',
    tags: ['Krig', 'Folkedrab'],
    questions: []
  },
  {
    id: 't3_2',
    topicId: '3',
    type: 'event',
    title: 'Berlinmurens Fald',
    date: '9. november 1989',
    description: 'Symboliserede afslutningen på Den Kolde Krig og delingen af Europa mellem øst og vest.',
    tags: ['Kold Krig', 'Europa'],
    questions: [
      {
        id: 'q3',
        question: 'Hvornår faldt Berlinmuren?',
        options: ['1945', '1961', '1989', '1991'],
        correctAnswer: '1989'
      }
    ]
  },

  // TOPIC 4
  {
    id: 't4_1',
    topicId: '4',
    type: 'event',
    title: 'Udlændingeloven af 1983',
    date: '1983',
    description: 'Beskrevet som en af verdens mest "menneskevenlige" love på det tidspunkt. Gav retskrav på asyl og familiesammenføring.',
    tags: ['Indvandring', 'Politik'],
    questions: []
  },
  {
    id: 't4_2',
    topicId: '4',
    type: 'term',
    title: 'Hofstedes Løgmodel',
    description: 'En model til at forstå kultur gennem forskellige lag: Symboler, Helte, Ritualer og inderst: Værdier.',
    tags: ['Kultur', 'Teori'],
    questions: []
  }
];
