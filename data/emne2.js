
export const emne2_entries = [
  { id: 't2_1', topicId: '2', type: 'event', title: 'Grundloven af 1849', date: '1849', description: 'Danmark går fra enevælde til konstitutionelt monarki. Magten deles.', questions: [{ question: 'Hvilken styreform afløste Grundloven?', options: ['Demokrati', 'Enevælde', 'Diktatur', 'Anarki'], correctAnswer: 'Enevælde' }] },
  { id: 't2_2', topicId: '2', type: 'concept', title: 'Magtens tredeling', description: 'Princippet om at adskille den lovgivende, udøvende og dømmende magt for at undgå tyranni.', questions: [{ question: 'Hvem udtænkte princippet om magtens tredeling?', options: ['Montesquieu', 'Holberg', 'Struensee', 'Christian 4.'], correctAnswer: 'Montesquieu' }] }
];

export const emne2_sources = [
  {
    id: 's2_enevaelde_doc',
    topicId: '2',
    title: 'Kongeloven (1665) - Enevældens Grundlov',
    text: '2. Danmarks og Norges enevoldsarvekonge skal herefter være og af alle undersåtter holdes og agtes for det ypperste og højeste hoved her på jorden over alle menneskelige love, der intet andet hoved og dommer kender over sig hverken i gejstlige eller verdslige sager uden Gud alene.\n\n3. Kongen skal derfor også alene have højeste magt og myndighed til at gøre love og forordninger efter sin egen gode vilje og velbehag, at forklare, forandre, formere, formindske, ja også ligefrem at ophæve forrige af ham selv eller hans forfædre udgivne love – denne Kongelov alene undtaget. (...)\n\n17. Men kongen skal aldeles ikke give nogen ed eller forpligtelse (…) fra sig, mundtlig eller skriftlig, eftersom han som en fri og ubunden enevoldskonge ikke kan bindes af sine undersåtter.',
    questions: [
      {
        question: 'Hvad legitimerer kongens magt i denne kilde?',
        options: ['Gud alene (Guddommelig ret)', 'En kontrakt med folket', 'Valg i Rigsrådet', 'Militær sag'],
        correctAnswer: 'Gud alene (Guddommelig ret)'
      },
      {
        question: 'Hvad er det kildekritiske perspektiv på dette dokument?',
        options: ['Det er en normativ kilde (lov), der viser det officielle magtgrundlag', 'Det er en personlig dagbog fra kongen', 'Det er en kritik af enevælden', 'Det er en avisartikel'],
        correctAnswer: 'Det er en normativ kilde (lov), der viser det officielle magtgrundlag'
      }
    ]
  },
  {
    id: 's2_junigrundloven',
    topicId: '2',
    title: 'Junigrundloven (1849) - Uddrag',
    text: '§ 1. Regeringsformen er indskrænket monarkisk. Kongemagten er arvelig.\n\n§ 2. Den lovgivende magt er hos kongen og rigsdagen i forening. Den udøvende magt er hos kongen. Den dømmende magt er hos domstolene.\n\n§ 35. Valgret til Folketinget har enhver uberygtet mand, som har indfødsret, når han har fyldt sit 30. år, medmindre han:\na) uden at have egen husstand står i privat tjenesteforhold;\nb) nyder eller har nydt understøttelse af fattigvæsenet, som ikke er enten eftergivet eller tilbagebetalt;\nc) er ude af rådighed over sit bo;\ d) ikke har haft fast bopæl i et år i den valgkreds...',
    questions: [
      {
        question: 'Hvad betyder "indskrænket monarkisk" i § 1?',
        options: ['At kongens magt er begrænset af forfatningen (Konstitutionelt monarki)', 'At kongen slet ingen magt har', 'At der kun er én konge', 'At kongen kun må bestemme i København'],
        correctAnswer: 'At kongens magt er begrænset af forfatningen (Konstitutionelt monarki)'
      },
      {
        question: 'Hvorfor var tjenestefolk og fattige udelukket fra valgretten i § 35?',
        options: ['Fordi de mentes at være i et afhængighedsforhold til deres husbond/staten', 'Fordi de ikke kunne læse', 'Fordi de var for unge', 'Fordi de boede i byerne'],
        correctAnswer: 'Fordi de mentes at være i et afhængighedsforhold til deres husbond/staten'
      }
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
