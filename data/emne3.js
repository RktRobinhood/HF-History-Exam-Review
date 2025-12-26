
export const emne3_entries = [
  { id: 'hol_1', topicId: '3', type: 'event', title: 'Wannsee-konferencen', date: '1942', description: 'Konference i Berlin hvor man fastlagde "Den endelige løsning" på jødespørgsmålet.', questions: [
    { question: 'Hvad var formålet med Wannsee-konferencen i 1942?', options: ['At koordinere den industrielle udryddelse af Europas jøder', 'At forhandle fred med England', 'At planlægge invasionen af USA', 'At bygge jernbaner i Polen'], correctAnswer: 'At koordinere den industrielle udryddelse af Europas jøder' },
    { question: 'Hvem fik fuldmagt til at forberede "die Endlösung"?', options: ['Reinhardt Heydrich', 'Adolf Hitler personligt', 'Albert Speer', 'Joseph Goebbels'], correctAnswer: 'Reinhardt Heydrich' }
  ]},
  { id: 'hol_2', topicId: '3', type: 'concept', title: 'Gasbiler (Sonderwagen)', description: 'Tidlig metode til massemord før udryddelseslejrene blev fuldt udbygget.', questions: [
    { question: 'Hvorfor gik man væk fra skydning og over til gasbiler?', options: ['Det var for psykisk belastende for soldaterne og for synligt', 'Det var billigere', 'Det gik langsommere', 'Soldaterne løb tør for ammunition'], correctAnswer: 'Det var for psykisk belastende for soldaterne og for synligt' }
  ]},
  { id: 'hol_3', topicId: '3', type: 'concept', title: 'Auschwitz-Birkenau', description: 'Både arbejdslejr og udryddelseslejr. Centret for det industrielle massemord.', questions: [
    { question: 'Hvad var den maksimale kapacitet i Auschwitz i 1944?', options: ['Op mod 20.000 mennesker i døgnet', '1000 mennesker om ugen', '5000 mennesker om året', 'Man gassede ingen i 1944'], correctAnswer: 'Op mod 20.000 mennesker i døgnet' },
    { question: 'Hvilken gas blev brugt i Auschwitz?', options: ['Zyklon B', 'CO2', 'Lattergas', 'Sennepsgas'], correctAnswer: 'Zyklon B' }
  ]},
  { id: 'hol_4', topicId: '3', type: 'concept', title: 'I.G. Farben', description: 'Tysk kemikoncern der brugte slavearbejdere fra koncentrationslejrene.', questions: [
    { question: 'Hvilken rolle spillede I.G. Farben i Holocaust?', options: ['De nød godt af billig arbejdskraft fra fangerne', 'De var modstandsfolk', 'De byggede hospitaler', 'De havde intet med det at gøre'], correctAnswer: 'De nød godt af billig arbejdskraft fra fangerne' }
  ]}
];

export const emne3_sources = [
  {
    id: 's3_goebbels',
    topicId: '3',
    title: 'Goebbels Dagbog (13. dec. 1941)',
    text: '"Hvad angår jødespørgsmålet er Føreren fast besluttet på at gøre rent bord. Han har spået jøderne, at de - hvis de endnu en gang var årsag til en verdenskrig - ville opleve deres egen tilintetgørelse. Det var ikke nogen tom floskel. Verdenskrigem er en realitet, tilintetgørelse af jødedommen må være den nødvendige konsekvens. Dette spørgsmål bør betragtes uden nogen form for sentimentalitet."',
    questions: [
      { question: 'Hvad mener Goebbels med "uden sentimentalitet"?', options: ['At man skal dræbe koldblodigt og effektivt', 'At man skal være ked af det', 'At man skal give gaver', 'At man skal synge sange'], correctAnswer: 'At man skal dræbe koldblodigt og effektivt' },
      { question: 'Hvilket argument bruger han for udryddelsen?', options: ['At jøderne selv er skyld i verdenskrigen', 'At de er for mange', 'At de er fattige', 'At de skal flyttes til Madagaskar'], correctAnswer: 'At jøderne selv er skyld i verdenskrigen' }
    ]
  },
  {
    id: 's3_bergen_belsen',
    topicId: '3',
    title: 'Befrielsen af Bergen-Belsen (1945)',
    text: 'Da englænderne befriede koncentrationslejren Bergen-Belsen den 15. april 1945, flød det med lig overalt. På engelsk kommando blev tyske fangevogtere tvunget til at begrave ligene i massegrave for at stoppe sygdomsspredning.',
    questions: [
      { question: 'Hvad er det kildekritiske perspektiv på fotos af døde fanger i 1945?', options: ['De fungerer som uafviselige levn for Holocausts rædsler', 'De er falske billeder fra en film', 'De viser at fangerne sov', 'De viser at tyskerne passede godt på fangerne'], correctAnswer: 'De fungerer som uafviselige levn for Holocausts rædsler' }
    ]
  }
];

export const emne3_exams = [
  {
    id: 'e3_1', topicId: '3',
    examQuestion: 'Analysér årsagerne til at Holocaust kunne lade sig gøre logistisk og administrativt.',
    subtext: [
      { question: 'Hvilken faktor var afgørende for logistikken?', options: ['Det tyske bureaukrati og administrative apparat fungerede uden protest', 'Soldaterne handlede på egen hånd', 'Man brugte kun heste', 'Det skete helt tilfældigt'], correctAnswer: 'Det tyske bureaukrati og administrative apparat fungerede uden protest' }
    ]
  }
];
