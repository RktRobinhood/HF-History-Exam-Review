
export const emne2_social_control_entries = [
  { id: 'sc_1', topicId: '2', type: 'concept', title: 'Åndssvageforsorgen', description: 'Statslig institution der tog sig af "de uønskede". Målet var isolation og forhindring af forplantning.', questions: [
    { question: 'Hvad var hovedformålet med anstalterne i 1920erne?', options: ['At isolere de "åndssvage" så de ikke kunne føre deres gener videre', 'At give dem en gratis uddannelse', 'At lære dem at danse', 'At gøre dem til konger'], correctAnswer: 'At isolere de "åndssvage" så de ikke kunne føre deres gener videre' }
  ]},
  { id: 'sc_2', topicId: '2', type: 'concept', title: 'Sprogø & Livø', description: 'Isolationsøer. Sprogø var for "moralsk defekte" kvinder, Livø for asociale mænd.', questions: [
    { question: 'Hvem blev sendt til Sprogø?', options: ['Letlevende kvinder der blev vurderet som moralsk defekte', 'Krigere', 'Præster', 'Rige folk'], correctAnswer: 'Letlevende kvinder der blev vurderet som moralsk defekte' },
    { question: 'Hvorfor valgte man øer til formålet?', options: ['De naturlige havstrømme fungerede som fængselsmure', 'Der var bedre vejr', 'Det var tættere på jernbanen', 'Der var ingen årsag'], correctAnswer: 'De naturlige havstrømme fungerede som fængselsmure' }
  ]},
  { id: 'sc_3', topicId: '2', type: 'event', title: 'Sterilisationsloven af 1929', date: '1929', description: 'Europas første lov om frivillig sterilisation. Ofte koblet til udskrivning fra anstalt.', questions: [
    { question: 'Hvad var "frivilligheden" i 1929-loven ofte baseret på?', options: ['At man kun kunne komme ud af anstalten hvis man lod sig sterilisere', 'At man fik penge for det', 'At man fik lov at rejse til Amerika', 'Der var ingen betingelser'], correctAnswer: 'At man kun kunne komme ud af anstalten hvis man lod sig sterilisere' }
  ]},
  { id: 'sc_4', topicId: '2', type: 'event', title: 'Sterilisationsloven af 1934', date: '1934', description: 'Indførelse af muligheden for tvangssterilisation af samfundsmæssige hensyn.', questions: [
    { question: 'Hvad var den store ændring i 1934-loven?', options: ['Mulighed for tvangssterilisation uden samtykke', 'Loven blev ophævet', 'Man fik lov at gifte sig', 'Kun mænd måtte steriliseres'], correctAnswer: 'Mulighed for tvangssterilisation uden samtykke' }
  ]}
];

export const emne2_social_control_sources = [
  {
    id: 's2_farlig_seks',
    topicId: '2',
    title: 'Farlig Seksualitet (Rigsarkivet)',
    text: 'I starten af 1900-tallet var der forskellige normer for kvinder og mænds seksuelle adfærd. Den "gode" pige var stadig dydig og ydmyg, og hun indlod sig ikke i seksuelle forhold før ægteskabet. Hvis hun var seksuelt udfaren, risikerede hun at blive stemplet som "moralsk defekt" og anbragt under åndssvageforsorgen. Mandlig seksualitet blev derimod betegnet som stærk og vanskelig at tæmme, og man så i højere grad gennem fingre med mænds aktive sexliv før ægteskabet.',
    questions: [
      { question: 'Hvad betød det at blive stemplet som "moralsk defekt"?', options: ['At man blev anset for mindrebegavet pga. sin seksualitet', 'At man var meget klog', 'At man fik en medalje', 'At man skulle være præst'], correctAnswer: 'At man blev anset for mindrebegavet pga. sin seksualitet' },
      { question: 'Hvordan adskilte kønsnormerne sig for mænd og kvinder?', options: ['Mænds sexliv blev accepteret, mens kvinder skulle være dydige', 'Kvinder havde mere frihed', 'Der var ingen forskel', 'Mænd blev sendt til Sprogø'], correctAnswer: 'Mænds sexliv blev accepteret, mens kvinder skulle være dydige' }
    ]
  },
  {
    id: 's2_bank_mikkelsen',
    topicId: '2',
    title: 'Niels Erik Bank-Mikkelsen (1959)',
    text: 'I 1959 revolutionerede Bank-Mikkelsen åndssvageforsorgen ved at lancere ideen om normalisering. De åndssvage skulle have en tilværelse så nær det normale som muligt, herunder ret til eget tøj, privatliv og afskaffelse af tvangsindgreb.',
    questions: [
      { question: 'Hvad betyder "normalisering" i denne sammenhæng?', options: ['At de åndssvage skal behandles som ligeværdige borgere', 'At alle skal være ens', 'At de skal sendes hjem uden hjælp', 'At de skal i fængsel'], correctAnswer: 'At de åndssvage skal behandles som ligeværdige borgere' }
    ]
  }
];
