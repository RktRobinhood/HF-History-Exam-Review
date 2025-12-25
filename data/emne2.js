export const emne2_entries = [
  { id: 't2_1', topicId: '2', type: 'event', title: 'Grundloven af 1849', date: '1849', description: 'Danmark går fra enevælde til konstitutionelt monarki. Magten deles.', questions: [{ question: 'Hvilken styreform afløste Grundloven?', options: ['Demokrati', 'Enevælde', 'Diktatur', 'Anarki'], correctAnswer: 'Enevælde' }] },
  { id: 't2_2', topicId: '2', type: 'concept', title: 'Magtens tredeling', description: 'Princippet om at adskille den lovgivende, udøvende og dømmende magt for at undgå tyranni.', questions: [{ question: 'Hvem udtænkte princippet om magtens tredeling?', options: ['Montesquieu', 'Holberg', 'Struensee', 'Christian 4.'], correctAnswer: 'Montesquieu' }] }
];

export const emne2_sources = [
  {
    id: 's2_1',
    topicId: '2',
    title: 'Udrag fra Junigrundloven (1849)',
    text: '"§ 2. Den lovgivende Magt er hos Kongen og Rigsdagen i Forening. Den udøvende Magt er hos Kongen. Den dømmende Magt er hos Domstolene."',
    questions: [
      {
        question: 'Hvor ser vi tydeligst bruddet med enevælden i denne tekst?',
        options: ['I § 2, hvor magten deles', 'Ved at den er på dansk', 'Ved at Kongen nævnes', 'I § 81'],
        correctAnswer: 'I § 2, hvor magten deles'
      }
    ]
  },
  {
    id: 'ps2_original',
    topicId: '2',
    title: 'Stavnsbåndets ophævelse (1787)',
    text: 'Billedet viser en "lykkelig" bonde, der træder på pisken og åget.',
    questions: [
      { question: 'Hvad symboliserer "pisken"?', options: ['Godsejerens ret til at straffe', 'En gave', 'Leg med dyr', 'Rigdom'], correctAnswer: 'Godsejerens ret til at straffe' }
    ]
  }
];

export const emne2_exams = [
  {
    id: 'e2_1',
    topicId: '2',
    examQuestion: 'Vurdér betydningen af de politiske ideologier i 1800-tallets Danmark.',
    subtext: [
      { question: 'Hvad skal du gøre når du "vurderer"?', options: ['Sige din mening', 'Opstille argumenter for og imod', 'Lave en liste', 'Beskrive en bonde'], correctAnswer: 'Opstille argumenter for og imod' }
    ]
  }
];