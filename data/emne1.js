export const emne1_entries = [
  // --- TRADITIONEL IDENTITET (LARS RASMUSSEN & BONDESAMFUNDET) ---
  { id: 't1_1', topicId: '1', type: 'concept', title: 'Det Feudale Samfund', description: 'Stændersamfund baseret på jord og pligt.', questions: [{ question: 'Hvad var magtgrundlaget i feudalsamfundet?', options: ['Penge', 'Jord', 'Internettet', 'Våben'], correctAnswer: 'Jord' }] },
  { id: 't1_b1', topicId: '1', type: 'concept', title: 'Nærestanden', description: 'Bønder og håndværkere i det feudale samfund.', questions: [{ question: 'Hvem udgjorde nærestanden?', options: ['Adel', 'Bønder/Håndværkere', 'Gejstlige', 'Konger'], correctAnswer: 'Bønder/Håndværkere' }] },
  { id: 't1_b2', topicId: '1', type: 'concept', title: 'Patriarkatet i Bondesamfundet', description: 'Faderen som enevældig hersker over husstanden.', questions: [{ question: 'Hvilken magt havde husbonden i 1800-tallet?', options: ['Absolut autoritet over børn og tyende', 'Han delte magten med konen', 'Han var underlagt børnene', 'Han havde ingen magt'], correctAnswer: 'Absolut autoritet over børn og tyende' }] },
  { id: 't1_lars_1', topicId: '1', type: 'concept', title: 'Lars Rasmussens opvækst', description: 'En kilde til livet som barn af en fæstebonde på Falster i 1840erne.', questions: [
    { question: 'Hvor sov Lars Rasmussen som barn?', options: ['I stuen sammen med hele familien', 'I sit eget værelse', 'I stalden', 'På loftet'], correctAnswer: 'I stuen sammen med hele familien' },
    { question: 'Hvem delte Lars seng med?', options: ['Sin farmor', 'Sin søster', 'En karl', 'Alene'], correctAnswer: 'Sin farmor' }
  ]},
  { id: 't1_disciplin', topicId: '1', type: 'concept', title: 'Fysisk afstraffelse (Riset/Kæppen)', description: 'Normal pædagogisk metode i det traditionelle samfund.', questions: [
    { question: 'Hvordan reagerede faderen på "næsvished"?', options: ['Med fysisk straf (kæppen eller riset)', 'Med en kammeratlig samtale', 'Ved at give barnet penge', 'Han ignorerede det'], correctAnswer: 'Med fysisk straf (kæppen eller riset)' },
    { question: 'Hvad betyder faderens citat: "I gamle Dage hed det: De Unge skal man lære, og de gamle skal man ære"?', options: ['At der var et strengt hierarki mellem generationerne', 'At unge vidste mest', 'At alle var lige', 'At man ikke skulle gå i skole'], correctAnswer: 'At der var et strengt hierarki mellem generationerne' }
  ]},
  { id: 't1_mother_role', topicId: '1', type: 'concept', title: 'Moderens rolle i 1840', description: 'Lars Rasmussens mor beskrives som from og fredelig.', questions: [
    { question: 'Hvordan adskilte moderens opdragelse sig fra faderens?', options: ['Hun slog ikke gerne og mente man ikke måtte slå i vrede', 'Hun var strengere end faderen', 'Hun bestemte over faderen', 'Hun var aldrig hjemme'], correctAnswer: 'Hun slog ikke gerne og mente man ikke måtte slå i vrede' },
    { question: 'Hvad gjorde Lars når han var "i klemme" hos faderen?', options: ['Han hviskede fortroligt til sin moder', 'Han løb sin vej', 'Han slog igen', 'Han bad faderen om undskyldning'], correctAnswer: 'Han hviskede fortroligt til sin moder' }
  ]},

  // --- INDUSTRIALISERING & URBANISERING (BOLIGER & JERNBANE) ---
  { id: 't1_rail_map', topicId: '1', type: 'event', title: 'Jernbaneudviklingen 1875-1900', date: '1875-1900', description: 'Infrastrukturens betydning for det moderne Danmark.', questions: [
    { question: 'Hvad er den største forskel på jernbanenettet i 1875 og 1900?', options: ['I 1900 var hele landet forbundet i et tæt netværk', 'Der var færre baner i 1900', 'Jernbanen blev nedlagt', 'Kun København havde tog i 1900'], correctAnswer: 'I 1900 var hele landet forbundet i et tæt netværk' },
    { question: 'Hvordan påvirkede jernbanen urbaniseringen?', options: ['Den muliggjorde hurtig transport af folk og varer til byerne', 'Den gjorde at folk blev på landet', 'Den stoppede væksten', 'Den var kun for de rige'], correctAnswer: 'Den muliggjorde hurtig transport af folk og varer til byerne' }
  ]},
  { id: 't1_housing_detail', topicId: '1', type: 'concept', title: 'Arbejderboligen i Sundevedsgade', description: 'Levevilkår på Vesterbro omkring 1900.', questions: [
    { question: 'Var der eget toilet (WC) i lejlighederne i Sundevedsgade i 1880?', options: ['Nej, det blev først installeret senere', 'Ja, i alle rum', 'Kun på 4. sal', 'Ja, men kun til koldt vand'], correctAnswer: 'Nej, det blev først installeret senere' },
    { question: 'Hvem boede typisk i disse lejligheder?', options: ['Arbejderfamilier med mange børn på få kvadratmeter', 'Rige direktører', 'Enlige studerende', 'Kun mænd'], correctAnswer: 'Arbejderfamilier med mange børn på få kvadratmeter' },
    { question: 'Hvad var "køkkentrappen" et symbol på?', options: ['Klasseskel og praktisk adgang for bude og tyende', 'En flugtvej ved brand', 'Et sted man dyrkede motion', 'En pyntegenstand'], correctAnswer: 'Klasseskel og praktisk adgang for bude og tyende' }
  ]},

  // --- MODERNITET & DET SENMODERNE (1950+ OG GIDDENS) ---
  { id: 't1_gender_1950', topicId: '1', type: 'concept', title: 'Kønsroller i 1950 (Klinket Porcelæn)', description: 'Normer for ægteskab og kvinders opofrelse.', questions: [
    { question: 'Hvad er budskabet i kilden "Klinket Porcelæn"?', options: ['At kvinden forventes at tilgive utroskab for familiens skyld', 'At kvinder skal gå fra deres mænd med det samme', 'At porcelæn er meget dyrt', 'At mænd altid er trofaste'], correctAnswer: 'At kvinden forventes at tilgive utroskab for familiens skyld' },
    { question: 'Hvorfor blev kvinderne ofte i dårlige ægteskaber i 1950erne?', options: ['Økonomisk afhængighed og sociale normer om pligt', 'Fordi de ikke måtte skilles ifølge loven', 'Fordi de var ligeglade', 'Fordi mændene var rige'], correctAnswer: 'Økonomisk afhængighed og sociale normer om pligt' }
  ]},
  { id: 't1_giddens_late', topicId: '1', type: 'concept', title: 'Det Senmoderne Identitetsvalg', description: 'Giddens teorier om selvet som et projekt.', questions: [
    { question: 'Hvad betyder "aftraditionalisering"?', options: ['At faste normer og traditioner ikke længere dikterer vores livsvalg', 'At vi holder op med at fejre jul', 'At alt bliver som i gamle dage', 'At vi får flere traditioner'], correctAnswer: 'At faste normer og traditioner ikke længere dikterer vores livsvalg' },
    { question: 'Hvad er "valgbiografien"?', options: ['At vi selv er ansvarlige for at skabe vores livshistorie gennem valg', 'En bog om en politiker', 'At man skal stemme til valg', 'Staten bestemmer ens fremtid'], correctAnswer: 'At we selv er ansvarlige for at skabe vores livshistorie gennem valg' }
  ]},

  // --- ADDITIONAL PERSISTENT DATA ---
  { id: 't1_urban_stats', topicId: '1', type: 'event', title: 'Urbaniserings-eksplosionen', date: '1870-1910', description: 'Københavns befolkning fordobles på få årtier.', questions: [
    { question: 'Hvad skete der med byerne under industrialiseringen?', options: ['De voksede voldsomt pga. vandring fra land til by', 'De skrumpede ind', 'Folk flyttede til udlandet', 'Byerne blev forbudt'], correctAnswer: 'De voksede voldsomt pga. vandring fra land til by' }
  ]},
  { id: 't1_proletar_id', topicId: '1', type: 'concept', title: 'Proletar-identitet', description: 'Arbejderklassens opståen og fælles kamp.', questions: [
    { question: 'Hvad definerer en proletar?', options: ['En person der kun ejer sin arbejdskraft', 'En rig landejer', 'En person uden tøj', 'En konge'], correctAnswer: 'En person der kun ejer sin arbejdskraft' }
  ]},
  { id: 't1_social_state', topicId: '1', type: 'event', title: 'Kanslergadeforliget', date: '1933', description: 'Grundstenen til den moderne velfærdsstat.', questions: [
    { question: 'Hvad var formålet med Kanslergadeforliget?', options: ['At løse krisen i 1930erne og skabe social tryghed', 'At starte en krig', 'At bygge en jernbane', 'At vælge en ny konge'], correctAnswer: 'At løse krisen i 1930erne og skabe social tryghed' }
  ]}
];

export const emne1_sources = [
  {
    id: 's1_lars_full',
    topicId: '1',
    title: 'Søn af en Fæstebonde (1837-1845)',
    text: '"Naar Faderen sagde: ”Kom” saa hed det ikke ”Ja, jeg kommer ret straks!” ... men saa kom han øjeblikkelig. Naar Faderen sagde: ”Ti” saa sagde han ikke et Muk. (...) Naar Børnene viste sig ”kæphøje”, saa regnede det ned over deres syndige Hoveder. (...) Han holdt ikke af, at der blev kælet for meget for Børnene."',
    questions: [
      { question: 'Hvad fortæller kilden om autoritetsforholdet?', options: ['Faderen var en ubestridt autoritet baseret på frygt', 'Forholdet var demokratisk', 'Moderen bestemte alt', 'Børnene var i centrum'], correctAnswer: 'Faderen var en ubestridt autoritet baseret på frygt' },
      { question: 'Hvilket menneskesyn præger opdragelsen?', options: ['Barnet er født syndigt og skal tugtes', 'Barnet er født frit', 'Barnet er klogere end de voksne', 'Der er ingen disciplin'], correctAnswer: 'Barnet er født syndigt og skal tugtes' },
      { question: 'Hvad betyder "kæphøje" i denne kontekst?', options: ['At børnene var stolte eller udfordrende', 'At de legede med kæppe', 'At de var høje af vækst', 'At de var syge'], correctAnswer: 'At børnene var stolte eller udfordrende' }
    ]
  },
  {
    id: 's1_klinket_porcelain',
    topicId: '1',
    title: 'Klinket Porcelæn (1950)',
    text: '"Hvis en Hustru elsker sin Mand og bliver svigtet... saa falder Tilgivelsen. Hun ofrer stadig sine Kræfter... som om hun beholdes af Medlidenhed, Pligt eller maaske Ret. Porcelænet er itu, og klinket porcelæn er aldrig saa smukt som nyt."',
    questions: [
      { question: 'Hvad symboliserer porcelænet?', options: ['Ægteskabet og tilliden', 'Køkkenudstyr', 'Rigdom', 'At man er fattig'], correctAnswer: 'Ægteskabet og tilliden' },
      { question: 'Hvilken samfundsnorm beskrives her?', options: ['At kvinden skal opretholde facaden og familien for enhver pris', 'At kvinder skal skilles hurtigt', 'At mænd altid er trofaste', 'At det er godt at knuse tallerkener'], correctAnswer: 'At kvinden skal opretholde facaden og familien for enhver pris' }
    ]
  }
];

export const emne1_exams = [
  {
    id: 'e1_exam_identity',
    topicId: '1',
    examQuestion: 'Diskutér hvordan individets identitet har ændret sig fra det traditionelle til det senmoderne samfund.',
    subtext: [
      { question: 'Hvilken sociolog skal du bruge til at forklare det senmoderne?', options: ['Anthony Giddens', 'Karl Marx', 'Napoleon', 'Lars Rasmussen'], correctAnswer: 'Anthony Giddens' },
      { question: 'Hvad er den vigtigste forskel på identitet før og nu?', options: ['Før var den givet af tradition - nu er den et valg/projekt', 'Der er ingen forskel', 'Før havde man ingen identitet', 'Nu er vi mere ens'], correctAnswer: 'Før var den givet af tradition - nu er den et valg/projekt' }
    ]
  }
];