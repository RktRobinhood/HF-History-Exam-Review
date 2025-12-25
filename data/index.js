
import { emne0_entries, emne0_sources, emne0_exams } from './emne0.js';
import { emne1_part1_entries } from './emne1_part1.js';
import { emne1_part2_entries } from './emne1_part2.js';
import { emne1_part3_entries } from './emne1_part3.js';
import { emne1_part4_entries } from './emne1_part4.js';
import { emne1_pdf_entries } from './emne1_pdf_questions.js';
import { emne1_pdf_batch2_entries } from './emne1_pdf_batch2.js';
import { emne1_entries, emne1_sources, emne1_exams } from './emne1.js';
import { emne2_entries, emne2_sources, emne2_exams } from './emne2.js';
import { emne2_part1_entries } from './emne2_part1.js';
import { emne2_history_overview_entries } from './emne2_history_overview.js';
import { emne2_image_analysis_entries } from './emne2_image_analysis.js';
import { emne2_good_society_entries } from './emne2_good_society.js';
import { emne2_grundlov_1849_entries } from './emne2_grundlov_1849.js';
import { emne2_demography_entries } from './emne2_demography.js';
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
  ...emne1_part1_entries,
  ...emne1_part2_entries,
  ...emne1_part3_entries,
  ...emne1_part4_entries,
  ...emne1_pdf_entries,
  ...emne1_pdf_batch2_entries,
  ...emne1_entries,
  ...emne2_entries,
  ...emne2_part1_entries,
  ...emne2_history_overview_entries,
  ...emne2_image_analysis_entries,
  ...emne2_good_society_entries,
  ...emne2_grundlov_1849_entries,
  ...emne2_demography_entries,
  ...emne3_entries,
  ...emne4_entries,
];

export const PRIMARY_SOURCES = [
  ...emne0_sources,
  ...emne1_sources,
  ...emne2_sources,
  ...emne3_sources,
  ...emne4_sources,
];

export const EXAM_INTERPRETATIONS = [
  ...emne0_exams,
  ...emne1_exams,
  ...emne2_exams,
  ...emne3_exams,
  ...emne4_exams,
];
