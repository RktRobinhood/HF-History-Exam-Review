
import { emne0_entries, emne0_sources } from './emne0.js';
import { emne1_entries, emne1_sources } from './emne1.js';
import { emne2_entries, emne2_sources } from './emne2.js';
import { emne3_entries, emne3_sources } from './emne3.js';
import { emne4_entries, emne4_sources } from './emne4.js';
import { sources_holocaust_deep } from './sources_holocaust_deep.js';
import { ep_holocaust_deep } from './exam_holocaust_deep.js';

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
  ...emne4_entries
];

export const PRIMARY_SOURCES = [
  ...emne0_sources,
  ...emne1_sources,
  ...emne2_sources,
  ...emne3_sources,
  ...emne4_sources,
  ...sources_holocaust_deep
];

export const EXAM_SETS = [
  ep_holocaust_deep
];
