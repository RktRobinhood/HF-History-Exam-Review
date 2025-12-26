
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
import { emne2_velfaerd_debat_entries } from './emne2_velfaerd_debat.js';
import { emne2_kongeloven_1665_entries } from './emne2_kongeloven_1665.js';
import { emne2_systemskifte_war_entries } from './emne2_systemskifte_war.js';
import { emne2_social_realism_entries } from './emne2_social_realism.js';
import { emne2_unemployment_30s_entries } from './emne2_unemployment_30s.js';
import { emne2_enlightenment_entries } from './emne2_enlightenment.js';
import { emne2_difficult_democracy_entries } from './emne2_difficult_democracy.js';
import { emne2_welfare_timeline_entries } from './emne2_welfare_timeline.js';
import { emne2_exam_concepts_entries } from './emne2_exam_concepts.js';
import { emne2_social_control_entries, emne2_social_control_sources } from './emne2_social_control.js';
import { emne3_entries, emne3_sources, emne3_exams } from './emne3.js';
import { emne3_hitler_youth_entries } from './emne3_hitler_youth.js';
import { emne3_nuremberg_entries } from './emne3_nuremberg.js';
import { emne3_holocaust_deep_sources } from './emne3_holocaust_deep.js';
import { emne3_ideology_entries } from './emne3_ideology_radicalization.js';
import { emne3_stanton_entries } from './emne3_stanton_stages.js';
import { emne3_postwar_entries } from './emne3_postwar_continuity.js';
import { emne3_ks_exam_logic } from './emne3_ks_exam_trainer.js';
import { emne4_entries, emne4_sources, emne4_exams } from './emne4.js';
import { emne4_globalization_entries } from './emne4_globalization.js';
import { emne4_immigration_entries } from './emne4_immigration_debate.js';
import { emne4_pia_k_sources } from './emne4_pia_k_source.js';
import { emne4_reintoft_sources } from './emne4_reintoft_source.js';

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
  ...emne2_velfaerd_debat_entries,
  ...emne2_kongeloven_1665_entries,
  ...emne2_systemskifte_war_entries,
  ...emne2_social_realism_entries,
  ...emne2_unemployment_30s_entries,
  ...emne2_enlightenment_entries,
  ...emne2_difficult_democracy_entries,
  ...emne2_welfare_timeline_entries,
  ...emne2_exam_concepts_entries,
  ...emne2_social_control_entries,
  ...emne3_entries,
  ...emne3_hitler_youth_entries,
  ...emne3_nuremberg_entries,
  ...emne3_ideology_entries,
  ...emne3_stanton_entries,
  ...emne3_postwar_entries,
  ...emne4_entries,
  ...emne4_globalization_entries,
  ...emne4_immigration_entries,
];

export const PRIMARY_SOURCES = [
  ...emne0_sources,
  ...emne1_sources,
  ...emne2_sources,
  ...emne2_social_control_sources,
  ...emne3_sources,
  ...emne3_holocaust_deep_sources,
  ...emne4_sources,
  ...emne4_pia_k_sources,
  ...emne4_reintoft_sources,
];

export const EXAM_INTERPRETATIONS = [
  ...emne0_exams,
  ...emne1_exams,
  ...emne2_exams,
  ...emne3_exams,
  ...emne3_ks_exam_logic,
  ...emne4_exams,
];
