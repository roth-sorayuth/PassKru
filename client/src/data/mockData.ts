import { Announcement, Question, Quiz, MockExam, PastPaper, Flashcard, StudyTask, WeakArea, Mentor, AppNotification } from '../types';

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-2026-01',
    title: {
      km: 'សេចក្តីជូនដំណឹងស្តីពីការប្រឡងជ្រើសរើសគ្រូបង្រៀនក្របខណ្ឌរដ្ឋ ឆ្នាំ២០២៦ (កម្រិតឧត្តម មូលដ្ឋាន បឋម)',
      en: 'Official Announcement on National Teacher Recruitment Examination 2026 (Upper Secondary, Lower Secondary, Primary)'
    },
    category: 'recruitment',
    date: '2026-08-15',
    isUrgent: true,
    summary: {
      km: 'ក្រសួងអប់រំ យុវជន និងកីឡា ប្រកាសជ្រើសរើសគរុសិស្ស-និស្សិតគ្រូចំនួន ២,១៥០ នាក់ សម្រាប់បណ្តុះបណ្តាលនៅទូទាំងប្រទេស។',
      en: 'MoEYS announces the recruitment of 2,150 teacher trainees across Cambodia for the upcoming academic year.'
    },
    content: {
      km: `ក្រសួងអប់រំ យុវជន និងកីឡា មានកិត្តិយសសូមជម្រាបជូនសាធារណជន និងបេក្ខជនទាំងអស់ឱ្យបានជ្រាបថា ក្រសួងនឹងរៀបចំការប្រឡងប្រជែងជ្រើសរើសគរុសិស្ស-និស្សិតគ្រូ សម្រាប់ឆ្នាំសិក្សា ២០២៦-២០២៧។

១. ចំនួនក្របខណ្ឌជ្រើសរើសសរុប៖ ២,១៥០ កន្លែង
- គ្រូមធ្យមសិក្សាទុតិយភូមិ (កម្រិតឧត្តម): ៦៥០ នាក់
- គ្រូមធ្យមសិក្សាបឋមភូមិ (កម្រិតមូលដ្ឋាន): ៧៥០ នាក់
- គ្រូបឋមសិក្សា (កម្រិតបឋម): ៥៥០ នាក់
- គ្រូមត្តេយ្យសិក្សា: ២០០ នាក់

២. កាលបរិច្ឆេទដាក់ពាក្យ៖ ចាប់ពីថ្ងៃទី ០១ ខែកញ្ញា ដល់ថ្ងៃទី ៣០ ខែកញ្ញា ឆ្នាំ២០២៦
៣. កាលបរិច្ឆេទប្រឡងជាក់ស្តែង៖ ថ្ងៃទី ២៥ និង ២៦ ខែតុលា ឆ្នាំ២០២៦
៤. ទីកន្លែងទទួលពាក្យ៖ មន្ទីរអប់រំ យុវជន និងកីឡា រាជធានី-ខេត្តសាមី ឬតាមប្រព័ន្ធអនឡាញផ្លូវការ។`,
      en: `The Ministry of Education, Youth and Sport (MoEYS) officially announces the competitive examination for teacher candidates for 2026-2027.

1. Total positions: 2,150 seats
- Upper Secondary Teachers: 650
- Lower Secondary Teachers: 750
- Primary Teachers: 550
- Preschool Teachers: 200

2. Application Period: Sep 1 to Sep 30, 2026
3. Examination Date: Oct 25-26, 2026
4. Submission: Provincial Departments of Education or MoEYS portal.`
    },
    targetExam: ['nie', 'rttc', 'pttc', 'kindergarten'],
    attachedPdfs: [
      { name: 'MoEYS_Recruitment_Announcement_2026_Official.pdf', size: '2.4 MB', pages: 8 },
      { name: 'Guideline_For_Application_Form_Filled.pdf', size: '1.1 MB', pages: 4 }
    ],
    importantDates: [
      { label: { km: 'បើកទទួលពាក្យ', en: 'Applications Open' }, date: '01 កញ្ញា 2026' },
      { label: { km: 'ផុតកំណត់ទទួលពាក្យ', en: 'Application Deadline' }, date: '30 កញ្ញា 2026' },
      { label: { km: 'សម័យប្រឡង', en: 'Examination Date' }, date: '25-26 តុលា 2026' },
      { label: { km: 'ប្រកាសលទ្ធផលផ្លូវការ', en: 'Official Results' }, date: '15 វិច្ឆិកា 2026' }
    ]
  },
  {
    id: 'ann-2026-02',
    title: {
      km: 'កាលវិភាគ និងវិញ្ញាសាកំណត់សម្រាប់ការប្រឡងគ្រូកម្រិតឧត្តម ឆ្នាំ២០២៦',
      en: 'Exam Schedule & Prescribed Subjects for Upper Secondary Teacher Examination 2026'
    },
    category: 'schedule',
    date: '2026-08-10',
    isUrgent: false,
    summary: {
      km: 'សេចក្តីលម្អិតអំពីវិញ្ញាសាវប្បធម៌ទូទៅ (MCQ & សរសេរ) និងវិញ្ញាសាឯកទេសតាមជំនាញនីមួយៗ។',
      en: 'Detailed structure for General Culture, Pedagogy, and Specialized Subject Papers for Upper Secondary entrance.'
    },
    content: {
      km: `គណៈកម្មការរៀបចំការប្រឡង សូមជូនដំណឹងអំពីកាលវិភាគ និងទម្រង់វិញ្ញាសាដូចខាងក្រោម៖
- ព្រឹក ថ្ងៃទី១៖ វិញ្ញាសាវប្បធម៌ទូទៅ និងចំណេះដឹងគរុកោសល្យ (រយៈពេល ២ម៉ោង)
- រសៀល ថ្ងៃទី១៖ វិញ្ញាសាភាសាបរទេស (អង់គ្លេស ឬ បារាំង - រយៈពេល ១ម៉ោង ៣០នាទី)
- ព្រឹក ថ្ងៃទី២៖ វិញ្ញាសាឯកទេសទី១ តាមមុខវិជ្ជាជ្រើសរើស (រយៈពេល ៣ម៉ោង)
- រសៀល ថ្ងៃទី២៖ វិញ្ញាសាឯកទេសទី២ ឬ សម្ភាសន៍គរុកោសល្យផ្ទាល់មាត់។`,
      en: `Examination schedule breakdown for Upper Secondary teachers:
- Day 1 AM: General Culture & Pedagogy (2 Hours)
- Day 1 PM: Foreign Language (1.5 Hours)
- Day 2 AM: Major Specialization 1 (3 Hours)
- Day 2 PM: Major Specialization 2 / Oral Pedagogical Interview.`
    },
    targetExam: ['nie'],
    attachedPdfs: [
      { name: 'Teacher_Recruitment_Curriculum_Standard_2026.pdf', size: '3.8 MB', pages: 14 }
    ]
  },
  {
    id: 'ann-2026-03',
    title: {
      km: 'គោលការណ៍លើកទឹកចិត្ត និងផ្តល់អាទិភាពសម្រាប់បេក្ខជននារី និងបេក្ខជនមកពីតំបន់ដាច់ស្រយាល',
      en: 'Priority & Incentive Policy for Female Candidates and Remote Area Applicants'
    },
    category: 'guideline',
    date: '2026-08-05',
    isUrgent: false,
    summary: {
      km: 'ការបូកពិន្ទុអាទិភាព និងកូតាពិសេសសម្រាប់បេក្ខជនចុះកិច្ចសន្យាបម្រើការងារនៅតំបន់ជួបការលំបាក។',
      en: 'Incentive points and quota allocations for female candidates and those committing to hardship zones.'
    },
    content: {
      km: `ដើម្បីលើកកម្ពស់សមធម៌ក្នុងការអប់រំ និងបំពេញកង្វះគ្រូបង្រៀននៅជនបទ៖
១. បេក្ខជនជាស្ត្រី ទទួលបានការលើកទឹកចិត្តបូកពិន្ទុបន្ថែម ០.៥ ពិន្ទុ
២. បេក្ខជនដែលស្ម័គ្រចិត្តបម្រើការងារនៅតំបន់ដាច់ស្រយាលយ៉ាងតិច ៥ឆ្នាំ ទទួលបានកូតាប្រឡងក្នុងកម្រិតពិន្ទុពិសេស
៣. ជនជាតិដើមភាគតិចទទួលបានការពិចារណាជាអាទិភាពចម្បង។`,
      en: `To promote equity and address rural teacher shortages:
1. Female candidates receive 0.5 incentive score bonus
2. Applicants committing to 5-year remote service get quota priority
3. Indigenous applicants receive specialized priority consideration.`
    },
    targetExam: ['nie', 'rttc', 'pttc', 'kindergarten'],
  }
];

export const mockQuestions: Question[] = [
  {
    id: 'q-ped-01',
    subject: 'General Culture',
    subjectKm: 'វប្បធម៌ទូទៅ',
    topic: 'Cambodian Intangible Cultural Heritage',
    topicKm: 'បេតិកភណ្ឌវប្បធម៌អរូបីកម្ពុជា',
    year: 2025,
    difficulty: 'medium',
    question: {
      km: 'តើ "ល្ខោនខោលវត្តស្វាយអណ្តែត" ត្រូវបានអង្គការយូណេស្កូ (UNESCO) ចុះបញ្ជីជាសម្បត្តិបេតិកភណ្ឌវប្បធម៌អរូបីនៃមនុស្សជាតិ ក្នុងឆ្នាំណា?',
      en: 'In which year was Cambodia\'s "Lakhon Khol Wat Svay Andet" officially inscribed on the UNESCO Intangible Cultural Heritage List?'
    },
    options: [
      { id: 'a', text: { km: 'ឆ្នាំ ២០០៣', en: 'Year 2003' } },
      { id: 'b', text: { km: 'ឆ្នាំ ២០១៥', en: 'Year 2015' } },
      { id: 'c', text: { km: 'ឆ្នាំ ២០១៨', en: 'Year 2018' } },
      { id: 'd', text: { km: 'ឆ្នាំ ២០២២', en: 'Year 2022' } }
    ],
    correctAnswerId: 'c',
    explanation: {
      km: 'ល្ខោនខោលវត្តស្វាយអណ្តែត ត្រូវបានចុះក្នុងបញ្ជីបេតិកភណ្ឌវប្បធម៌អរូបីនៃមនុស្សជាតិដែលត្រូវការការសង្គ្រោះបន្ទាន់របស់ UNESCO នៅថ្ងៃទី ២៨ ខែវិច្ឆិកា ឆ្នាំ២០១៨ នៅទីក្រុងព័រល្វី សាធារណរដ្ឋម៉ូរីស។',
      en: 'Lakhon Khol of Wat Svay Andet was officially inscribed onto the UNESCO List of Intangible Cultural Heritage in Need of Urgent Safeguarding on November 28, 2018.'
    },
    reference: 'ឯកសារបេតិកភណ្ឌវប្បធម៌ជាតិ ក្រសួងវប្បធម៌ និងវិចិត្រសិល្បៈ'
  },
  {
    id: 'q-ped-02',
    subject: 'General Culture',
    subjectKm: 'វប្បធម៌ទូទៅ',
    topic: 'Cambodian National Symbols',
    topicKm: 'និមិត្តរូបជាតិនៃព្រះរាជាណាចក្រកម្ពុជា',
    year: 2024,
    difficulty: 'easy',
    question: {
      km: 'តើផ្កាអ្វីដែលត្រូវបានកំណត់ជានិមិត្តរូបផ្កាតំណាងជាតិនៃព្រះរាជាណាចក្រកម្ពុជា តាមព្រះរាជក្រឹត្យឆ្នាំ ២០០៥?',
      en: 'Which flower was officially decreed as the national flower of the Kingdom of Cambodia by Royal Decree in 2005?'
    },
    options: [
      { id: 'a', text: { km: 'ផ្កាឈូក (Lotus)', en: 'Lotus' } },
      { id: 'b', text: { km: 'ផ្ការំដួល (Rumduol)', en: 'Rumduol (Mitrella mesnyi)' } },
      { id: 'c', text: { km: 'ផ្កាម្លិះ (Jasmine)', en: 'Jasmine' } },
      { id: 'd', text: { km: 'ផ្កាចំប៉ី (Frangipani)', en: 'Frangipani' } }
    ],
    correctAnswerId: 'b',
    explanation: {
      km: 'ផ្ការំដួល (Mitrella mesnyi) ត្រូវបានប្រកាសជានិមិត្តរូបផ្កាតំណាងជាតិនៃព្រះរាជាណាចក្រកម្ពុជា ដោយព្រះរាជក្រឹត្យកាលពីថ្ងៃទី ២១ ខែមីនា ឆ្នាំ២០០៥ ដោយសារក្លិនក្រអូបឈ្ងុយឈ្ងប់ និងភាពស្រស់ស្អាតថ្លៃថ្នូរ។',
      en: 'The Rumduol flower (Mitrella mesnyi) was designated as the national flower of Cambodia by Royal Decree on March 21, 2005, celebrating its elegant fragrance and traditional heritage.'
    },
    reference: 'ព្រះរាជក្រឹត្យស្តីពីការកំណត់និមិត្តរូបជាតិនៃព្រះរាជាណាចក្រកម្ពុជា ឆ្នាំ២០០៥'
  },
  {
    id: 'q-gen-01',
    subject: 'General Culture',
    subjectKm: 'វប្បធម៌ទូទៅ',
    topic: 'Cambodian History & Heritage',
    topicKm: 'ប្រវត្តិសាស្ត្រ និងបេតិកភណ្ឌកម្ពុជា',
    year: 2024,
    difficulty: 'easy',
    question: {
      km: 'តើប្រាសាទកោះកេរ ត្រូវបានអង្គការយូណេស្កូ (UNESCO) ចុះបញ្ជីជាសម្បត្តិបេតិកភណ្ឌពិភពលោកជាផ្លូវការនៅក្នុងឆ្នាំណា?',
      en: 'In which year was the Koh Ker temple complex officially inscribed onto the UNESCO World Heritage List?'
    },
    options: [
      { id: 'a', text: { km: 'ឆ្នាំ ២០០៨', en: 'Year 2008' } },
      { id: 'b', text: { km: 'ឆ្នាំ ២០១៧', en: 'Year 2017' } },
      { id: 'c', text: { km: 'ឆ្នាំ ២០២៣', en: 'Year 2023' } },
      { id: 'd', text: { km: 'ឆ្នាំ ២០២១', en: 'Year 2021' } }
    ],
    correctAnswerId: 'c',
    explanation: {
      km: 'រមណីយដ្ឋានប្រាសាទកោះកេរ ត្រូវបានចុះបញ្ជីជាបេតិកភណ្ឌពិភពលោករបស់ UNESCO នៅថ្ងៃទី ១៧ ខែកញ្ញា ឆ្នាំ២០២៣ នៅទីក្រុងរីយ៉ាដ ប្រទេសអារ៉ាប៊ីសាអូឌីត។',
      en: 'The Koh Ker archaeological site was inscribed onto the UNESCO World Heritage List on September 17, 2023, during the 45th World Heritage Committee session in Riyadh.'
    },
    reference: 'ឯកសារចំណេះដឹងទូទៅ និងបេតិកភណ្ឌជាតិ ក្រសួងវប្បធម៌'
  },
  {
    id: 'q-gen-02',
    subject: 'General Culture',
    subjectKm: 'វប្បធម៌ទូទៅ',
    topic: 'Cambodian Education Law & SDGs',
    topicKm: 'ច្បាប់ស្តីពីការអប់រំ និងគោលដៅអភិវឌ្ឍន៍ប្រកបដោយចីរភាព',
    year: 2025,
    difficulty: 'medium',
    question: {
      km: 'យោងតាមច្បាប់ស្តីពីការអប់រំនៃព្រះរាជាណាចក្រកម្ពុជា តើរដ្ឋធានាការផ្តល់ការអប់រំជាមូលដ្ឋានឥតគិតថ្លៃកម្រិតប៉ុន្មានឆ្នាំដល់កុមារកម្ពុជាគ្រប់រូប?',
      en: 'According to the Education Law of Cambodia, how many years of free basic education does the State guarantee for every Cambodian child?'
    },
    options: [
      { id: 'a', text: { km: '៦ ឆ្នាំ (បឋមសិក្សា)', en: '6 Years (Primary Education only)' } },
      { id: 'b', text: { km: '៩ ឆ្នាំ (បឋមសិក្សា និងអនុវិទ្យាល័យ)', en: '9 Years (Primary and Lower Secondary Education)' } },
      { id: 'c', text: { km: '១២ ឆ្នាំ (ដល់ចប់ទុតិយភូមិ)', en: '12 Years (Through Upper Secondary)' } },
      { id: 'd', text: { km: '៣ ឆ្នាំ (មត្តេយ្យដល់បឋម)', en: '3 Years (Early childhood only)' } }
    ],
    correctAnswerId: 'b',
    explanation: {
      km: 'មាត្រា ៣១ នៃរដ្ឋធម្មនុញ្ញ និងច្បាប់ស្តីពីការអប់រំ បានចែងថារដ្ឋត្រូវធានាការអប់រំជាមូលដ្ឋានដោយឥតគិតថ្លៃយ៉ាងតិច ៩ ឆ្នាំ (ពីថ្នាក់ទី១ ដល់ថ្នាក់ទី៩) ដល់ពលរដ្ឋកម្ពុជាគ្រប់រូប។',
      en: 'Article 31 of the Education Law mandates a minimum of 9 years of free basic education (Grade 1 through Grade 9) provided by public schools.'
    },
    reference: 'ច្បាប់ស្តីពីការអប់រំ ឆ្នាំ២០០៧ មាត្រា ៣១'
  },
  {
    id: 'q-kh-01',
    subject: 'Khmer Literature',
    subjectKm: 'អក្សរសាស្ត្រខ្មែរ',
    topic: 'Poetry & Literary Analysis',
    topicKm: 'កាព្យសាស្ត្រ និងវិភាគអក្សរសិល្ប៍',
    year: 2024,
    difficulty: 'hard',
    question: {
      km: 'នៅក្នុងកម្រងកាព្យបុរាណខ្មែរ "កាកី" និពន្ធដោយព្រះបាទអង្គឌួង តើកាព្យប្រភេទណាដែលត្រូវបានប្រើប្រាស់ជាចម្បងក្នុងការតែងនិពន្ធ?',
      en: 'In the classic Khmer literary epic "Kakei" written by King Ang Duong, which poetic meter is predominantly employed?'
    },
    options: [
      { id: 'a', text: { km: 'មេពាក្យ ៤ (បទកាកគតិ)', en: 'Kak-Kati Meter (4-word rhyme structure)' } },
      { id: 'b', text: { km: 'មេពាក្យ ៧ (បទពំនោល និងបទព្រហ្មគីតិ)', en: 'Bram-Poun Meter (7-word / Brahmagit meter)' } },
      { id: 'c', text: { km: 'មេពាក្យ ៨ (បទពាក្យ ៨)', en: 'Standard Octameter (8-word rhyme structure)' } },
      { id: 'd', text: { km: 'បទភុជង្គលីលា (ពាក្យ ៦)', en: 'Phuchong Leela Meter (6-word rhyme structure)' } }
    ],
    correctAnswerId: 'b',
    explanation: {
      km: 'រឿងកាកី និពន្ធឡើងដោយប្រើកម្រងកាព្យចម្រុះជាពិសេស "បទព្រហ្មគីតិ" (ពាក្យ ៧) និងបទពំនោល ដែលបង្ហាញពីភាពរលូន និងសោភ័ណភាពខ្ពស់នៃអក្សរសាស្ត្រសម័យឧដុង្គ។',
      en: 'The literary masterpiece Kakei utilizes classical poetic forms, principally Brahmagit and associated 7-syllable rhyming schemes.'
    },
    reference: 'ប្រវត្តិអក្សរសាស្ត្រខ្មែរ សម័យឧដុង្គ'
  },
  {
    id: 'q-math-01',
    subject: 'Mathematics',
    subjectKm: 'គណិតវិទ្យា',
    topic: 'Probability & Functions',
    topicKm: 'ប្រូបាប និងអនុគមន៍',
    year: 2025,
    difficulty: 'medium',
    question: {
      km: 'គេបោះគ្រាប់ឡុកឡាក់ស្មើដៃមួយចំនួន ២ ដង។ តើប្រូបាបដើម្បីទទួលបានផលបូកនៃគ្រាប់ទាំងពីរស្មើនឹង ៧ គឺជាប៉ុន្មាន?',
      en: 'A fair six-sided die is rolled twice. What is the probability that the sum of the numbers obtained is equal to 7?'
    },
    options: [
      { id: 'a', text: { km: '1/6', en: '1/6' } },
      { id: 'b', text: { km: '1/12', en: '1/12' } },
      { id: 'c', text: { km: '5/36', en: '5/36' } },
      { id: 'd', text: { km: '7/36', en: '7/36' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'ករណីអាចកើតមានសរុប = 6 x 6 = 36។ ករណីស្របដែលផលបូកស្មើ ៧ រួមមាន (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) សរុបមាន 6 ករណី។ ដូច្នេះ P = 6/36 = 1/6។',
      en: 'Total sample space = 36 outcomes. Favorable outcomes summing to 7 are: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. Probability = 6/36 = 1/6.'
    },
    reference: 'គណិតវិទ្យាថ្នាក់ទី១២ - ជំពូកប្រូបាប'
  }
];

// =============================================================================
// SUBJECT-SPECIFIC QUESTION SETS (FOR QUIZZES & MOCK EXAMS)
// =============================================================================

export const mathQuestionsSet1: Question[] = [
  {
    id: 'q-math-s1-01',
    subject: 'Mathematics',
    subjectKm: 'គណិតវិទ្យា',
    topic: 'Probability & Outcomes',
    topicKm: 'ប្រូបាប និងករណីស្រប',
    year: 2025,
    difficulty: 'medium',
    question: {
      km: 'គេបោះគ្រាប់ឡុកឡាក់ស្មើដៃមួយចំនួន ២ ដង។ តើប្រូបាបដើម្បីទទួលបានផលបូកនៃគ្រាប់ទាំងពីរស្មើនឹង ៧ គឺជាប៉ុន្មាន?',
      en: 'A fair six-sided die is rolled twice. What is the probability that the sum of the numbers obtained is equal to 7?'
    },
    options: [
      { id: 'a', text: { km: '1/6', en: '1/6' } },
      { id: 'b', text: { km: '1/12', en: '1/12' } },
      { id: 'c', text: { km: '5/36', en: '5/36' } },
      { id: 'd', text: { km: '7/36', en: '7/36' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'ករណីអាចកើតមានសរុប = 6 x 6 = 36។ ករណីស្របដែលផលបូកស្មើ ៧ រួមមាន (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) សរុប 6 ករណី។ ដូច្នេះ P = 6/36 = 1/6។',
      en: 'Total outcomes = 36. Favorable outcomes summing to 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 outcomes. P = 6/36 = 1/6.'
    }
  },
  {
    id: 'q-math-s1-02',
    subject: 'Mathematics',
    subjectKm: 'គណិតវិទ្យា',
    topic: 'Derivatives & Calculus',
    topicKm: 'ដេរីវេនៃអនុគមន៍',
    year: 2025,
    difficulty: 'hard',
    question: {
      km: 'គណនាដេរីវេនៃអនុគមន៍ f(x) = x³ - 3x² + 4x - 5 ត្រង់ចំណុច x = 2។',
      en: 'Calculate the derivative of the function f(x) = x³ - 3x² + 4x - 5 at x = 2.'
    },
    options: [
      { id: 'a', text: { km: 'f\'(2) = 4', en: 'f\'(2) = 4' } },
      { id: 'b', text: { km: 'f\'(2) = 2', en: 'f\'(2) = 2' } },
      { id: 'c', text: { km: 'f\'(2) = 8', en: 'f\'(2) = 8' } },
      { id: 'd', text: { km: 'f\'(2) = 0', en: 'f\'(2) = 0' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'f\'(x) = 3x² - 6x + 4។ ជំនួស x = 2 គេបាន f\'(2) = 3(2)² - 6(2) + 4 = 12 - 12 + 4 = 4។',
      en: 'f\'(x) = 3x² - 6x + 4. Substituting x = 2 gives f\'(2) = 3(4) - 12 + 4 = 4.'
    }
  },
  {
    id: 'q-math-s1-03',
    subject: 'Mathematics',
    subjectKm: 'គណិតវិទ្យា',
    topic: 'Definite Integrals',
    topicKm: 'អាំងតេក្រាលកំណត់',
    year: 2025,
    difficulty: 'hard',
    question: {
      km: 'គណនាអាំងតេក្រាលកំណត់ ∫₀² (2x + 3) dx។',
      en: 'Evaluate the definite integral ∫₀² (2x + 3) dx.'
    },
    options: [
      { id: 'a', text: { km: '10', en: '10' } },
      { id: 'b', text: { km: '8', en: '8' } },
      { id: 'c', text: { km: '12', en: '12' } },
      { id: 'd', text: { km: '14', en: '14' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'ព្រីមីទីវ F(x) = x² + 3x។ F(2) - F(0) = (2² + 3(2)) - 0 = 4 + 6 = 10។',
      en: 'F(x) = x² + 3x. F(2) - F(0) = (4 + 6) - 0 = 10.'
    }
  },
  {
    id: 'q-math-s1-04',
    subject: 'Mathematics',
    subjectKm: 'គណិតវិទ្យា',
    topic: 'Pythagorean Geometry',
    topicKm: 'ធរណីមាត្រត្រីកោណកែង',
    year: 2024,
    difficulty: 'easy',
    question: {
      km: 'ក្នុងត្រីកោណកែង ABC ដែលកែងត្រង់ B មានជ្រុង AB = 3 cm និង BC = 4 cm។ តើប្រវែងអ៊ីប៉ូតេនុស AC ស្មើប៉ុន្មាន?',
      en: 'In right-angled triangle ABC with right angle at B, AB = 3 cm and BC = 4 cm. What is the length of hypotenuse AC?'
    },
    options: [
      { id: 'a', text: { km: '5 cm', en: '5 cm' } },
      { id: 'b', text: { km: '7 cm', en: '7 cm' } },
      { id: 'c', text: { km: '6 cm', en: '6 cm' } },
      { id: 'd', text: { km: '25 cm', en: '25 cm' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'តាមទ្រឹស្តីបទពីតាក័រ AC² = AB² + BC² = 3² + 4² = 9 + 16 = 25 ➔ AC = √25 = 5 cm។',
      en: 'By Pythagorean theorem: AC = √(3² + 4²) = √(9 + 16) = √25 = 5 cm.'
    }
  },
  {
    id: 'q-math-s1-05',
    subject: 'Mathematics',
    subjectKm: 'គណិតវិទ្យា',
    topic: 'Logarithmic Equations',
    topicKm: 'សមីការឡូការីត',
    year: 2025,
    difficulty: 'medium',
    question: {
      km: 'ដោះស្រាយសមីការ log₂(x) + log₂(x - 2) = 3 ក្នុងសំណុំចំនួនពិត។',
      en: 'Solve the logarithmic equation log₂(x) + log₂(x - 2) = 3 for real values of x.'
    },
    options: [
      { id: 'a', text: { km: 'x = 4', en: 'x = 4' } },
      { id: 'b', text: { km: 'x = 2', en: 'x = 2' } },
      { id: 'c', text: { km: 'x = -2', en: 'x = -2' } },
      { id: 'd', text: { km: 'x = 8', en: 'x = 8' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'លក្ខខណ្ឌ x > 2។ log₂[x(x-2)] = 3 ➔ x² - 2x = 2³ = 8 ➔ x² - 2x - 8 = 0 ➔ (x-4)(x+2)=0 ➔ x = 4 (ព្រោះ x > 2)។',
      en: 'Condition x > 2. log₂[x(x-2)] = 3 => x(x-2) = 8 => x² - 2x - 8 = 0 => (x-4)(x+2)=0. Since x > 2, x = 4.'
    }
  }
];

export const mathQuestionsSet2: Question[] = [
  {
    id: 'q-math-s2-01',
    subject: 'Mathematics',
    subjectKm: 'គណិតវិទ្យា',
    topic: 'Trigonometric Limits',
    topicKm: 'លីមីតត្រីកោណមាត្រ',
    year: 2025,
    difficulty: 'medium',
    question: {
      km: 'គណនាលីមីត lim_{x → 0} (sin(3x) / x)។',
      en: 'Evaluate the limit lim_{x → 0} (sin(3x) / x).'
    },
    options: [
      { id: 'a', text: { km: '3', en: '3' } },
      { id: 'b', text: { km: '1', en: '1' } },
      { id: 'c', text: { km: '0', en: '0' } },
      { id: 'd', text: { km: '1/3', en: '1/3' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'lim_{x → 0} (sin(3x) / (3x)) * 3 = 1 * 3 = 3។',
      en: 'lim_{x → 0} 3 * (sin(3x) / 3x) = 3 * 1 = 3.'
    }
  },
  {
    id: 'q-math-s2-02',
    subject: 'Mathematics',
    subjectKm: 'គណិតវិទ្យា',
    topic: 'Circle Geometry',
    topicKm: 'ផ្ទៃក្រឡារង្វង់',
    year: 2024,
    difficulty: 'easy',
    question: {
      km: 'គណនាផ្ទៃក្រឡារបស់រង្វង់ដែលមានកាំ r = 7 cm (យក π ≈ 22/7)។',
      en: 'Calculate the area of a circle with radius r = 7 cm (take π ≈ 22/7).'
    },
    options: [
      { id: 'a', text: { km: '154 cm²', en: '154 cm²' } },
      { id: 'b', text: { km: '44 cm²', en: '44 cm²' } },
      { id: 'c', text: { km: '308 cm²', en: '308 cm²' } },
      { id: 'd', text: { km: '49 cm²', en: '49 cm²' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'A = π * r² = (22/7) * 7² = (22/7) * 49 = 22 * 7 = 154 cm²។',
      en: 'Area A = π r² = (22/7) * 49 = 154 cm².'
    }
  },
  {
    id: 'q-math-s2-03',
    subject: 'Mathematics',
    subjectKm: 'គណិតវិទ្យា',
    topic: 'Parabola Optimization',
    topicKm: 'តម្លៃអតិបរមានៃប៉ារ៉ាបូល',
    year: 2025,
    difficulty: 'medium',
    question: {
      km: 'រកតម្លៃអតិបរមានៃអនុគមន៍ f(x) = -x² + 6x - 5។',
      en: 'Find the maximum value of the function f(x) = -x² + 6x - 5.'
    },
    options: [
      { id: 'a', text: { km: '4', en: '4' } },
      { id: 'b', text: { km: '3', en: '3' } },
      { id: 'c', text: { km: '5', en: '5' } },
      { id: 'd', text: { km: '9', en: '9' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'x_vertex = -b/(2a) = -6 / (-2) = 3។ f(3) = -(3)² + 6(3) - 5 = -9 + 18 - 5 = 4។',
      en: 'Vertex x = -b/(2a) = 3. f(3) = -9 + 18 - 5 = 4.'
    }
  },
  {
    id: 'q-math-s2-04',
    subject: 'Mathematics',
    subjectKm: 'គណិតវិទ្យា',
    topic: 'Permutations & Combinations',
    topicKm: 'ចម្រាស់ និងបន្សំ',
    year: 2025,
    difficulty: 'medium',
    question: {
      km: 'ក្នុងថ្នាក់មួយមានសិស្ស ២០ នាក់។ តើមានប៉ុន្មានវិធីក្នុងការជ្រើសរើសប្រធានថ្នាក់ ១នាក់ និងអនុប្រធានថ្នាក់ ១នាក់?',
      en: 'In a class of 20 students, how many ways can a monitor and assistant monitor be selected?'
    },
    options: [
      { id: 'a', text: { km: '380 វិធី', en: '380 ways' } },
      { id: 'b', text: { km: '190 វិធី', en: '190 ways' } },
      { id: 'c', text: { km: '400 វិធី', en: '400 ways' } },
      { id: 'd', text: { km: '40 វិធី', en: '40 ways' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'ជ្រើសរើសប្រធានមាន ២០ ជម្រើស ជ្រើសរើសអនុប្រធានមាន ១៩ ជម្រើស ➔ ២០ x ១៩ = ៣៨០ វិធី។',
      en: 'P(20, 2) = 20 * 19 = 380 ways.'
    }
  },
  {
    id: 'q-math-s2-05',
    subject: 'Mathematics',
    subjectKm: 'គណិតវិទ្យា',
    topic: 'Systems of Equations',
    topicKm: 'ប្រព័ន្ធសមីការលីនេអ៊ែរ',
    year: 2024,
    difficulty: 'easy',
    question: {
      km: 'ដោះស្រាយប្រព័ន្ធសមីការ 2x + y = 7 និង x - y = 2។',
      en: 'Solve the system of equations 2x + y = 7 and x - y = 2.'
    },
    options: [
      { id: 'a', text: { km: 'x = 3, y = 1', en: 'x = 3, y = 1' } },
      { id: 'b', text: { km: 'x = 2, y = 3', en: 'x = 2, y = 3' } },
      { id: 'c', text: { km: 'x = 4, y = -1', en: 'x = 4, y = -1' } },
      { id: 'd', text: { km: 'x = 1, y = 5', en: 'x = 1, y = 5' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'បូកសមីការទាំងពីរ ➔ 3x = 9 ➔ x = 3។ ជំនួសក្នុង x - y = 2 ➔ 3 - y = 2 ➔ y = 1។',
      en: 'Adding equations gives 3x = 9 => x = 3. Then y = 3 - 2 = 1.'
    }
  }
];

export const physicsQuestionsSet1: Question[] = [
  {
    id: 'q-phy-s1-01',
    subject: 'Physics',
    subjectKm: 'រូបវិទ្យា',
    topic: 'Newton\'s Laws of Motion',
    topicKm: 'ច្បាប់ទី២ ញូតុន',
    year: 2025,
    difficulty: 'medium',
    question: {
      km: 'យោងតាមច្បាប់ទី២ ញូតុន (F = m * a) ប្រសិនបើកម្លាំង F = 20 N មានអំពើលើវត្ថុមានម៉ាស់ m = 4 kg តើវាមានសំទុះ a ប៉ុន្មាន?',
      en: 'According to Newton\'s 2nd Law (F = m * a), if a force F = 20 N acts on an object of mass m = 4 kg, what is its acceleration a?'
    },
    options: [
      { id: 'a', text: { km: '5 m/s²', en: '5 m/s²' } },
      { id: 'b', text: { km: '80 m/s²', en: '80 m/s²' } },
      { id: 'c', text: { km: '4 m/s²', en: '4 m/s²' } },
      { id: 'd', text: { km: '16 m/s²', en: '16 m/s²' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'a = F / m = 20 N / 4 kg = 5 m/s²។',
      en: 'a = F / m = 20 / 4 = 5 m/s².'
    }
  },
  {
    id: 'q-phy-s1-02',
    subject: 'Physics',
    subjectKm: 'រូបវិទ្យា',
    topic: 'Ohm\'s Law Electrical Circuits',
    topicKm: 'ច្បាប់អូម និងសៀគ្វីអគ្គិសនី',
    year: 2024,
    difficulty: 'easy',
    question: {
      km: 'តើច្បាប់អូម (Ohm\'s Law) សម្រាប់សៀគ្វីអគ្គិសនីមានរូបមន្តយ៉ាងដូចម្តេច?',
      en: 'What is the mathematical expression for Ohm\'s Law in electric circuits?'
    },
    options: [
      { id: 'a', text: { km: 'V = I * R', en: 'V = I * R' } },
      { id: 'b', text: { km: 'I = V * R', en: 'I = V * R' } },
      { id: 'c', text: { km: 'R = V * I', en: 'R = V * I' } },
      { id: 'd', text: { km: 'P = V * R', en: 'P = V * R' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'ច្បាប់អូមចែងថា តង់ស្យុង V ស្មើនឹង ចរន្ត I គុណនឹង រេស៊ីស្តង់ R (V = I * R)។',
      en: 'Ohm\'s Law states Voltage V equals Current I times Resistance R (V = I * R).'
    }
  },
  {
    id: 'q-phy-s1-03',
    subject: 'Physics',
    subjectKm: 'រូបវិទ្យា',
    topic: 'Kinetic Energy',
    topicKm: 'ថាមពលស៊ីនេទិច',
    year: 2025,
    difficulty: 'medium',
    question: {
      km: 'គណនាថាមពលស៊ីនេទិច (Kinetic Energy) នៃរថយន្តម៉ាស់ m = 1000 kg កំពុងផ្លាស់ទីដោយល្បឿន v = 10 m/s។',
      en: 'Calculate the kinetic energy of a car with mass m = 1000 kg moving at velocity v = 10 m/s.'
    },
    options: [
      { id: 'a', text: { km: '50,000 J', en: '50,000 J' } },
      { id: 'b', text: { km: '100,000 J', en: '100,000 J' } },
      { id: 'c', text: { km: '10,000 J', en: '10,000 J' } },
      { id: 'd', text: { km: '5,000 J', en: '5,000 J' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'Eₖ = (1/2) * m * v² = 0.5 * 1000 * (10)² = 500 * 100 = 50,000 Joules។',
      en: 'Ek = 0.5 * 1000 * 100 = 50,000 J.'
    }
  },
  {
    id: 'q-phy-s1-04',
    subject: 'Physics',
    subjectKm: 'រូបវិទ្យា',
    topic: 'Speed of Light',
    topicKm: 'ល្បឿនពន្លឺ',
    year: 2024,
    difficulty: 'easy',
    question: {
      km: 'តើល្បឿនពន្លឺក្នុងសុញ្ញកាសមានតម្លៃប្រហែលប៉ុន្មាន?',
      en: 'What is the approximate speed of light in a vacuum?'
    },
    options: [
      { id: 'a', text: { km: '3 * 10⁸ m/s', en: '3 * 10⁸ m/s' } },
      { id: 'b', text: { km: '3 * 10⁵ m/s', en: '3 * 10⁵ m/s' } },
      { id: 'c', text: { km: '300 m/s', en: '300 m/s' } },
      { id: 'd', text: { km: '3 * 10¹⁰ m/s', en: '3 * 10¹⁰ m/s' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'ល្បឿនពន្លឺក្នុងសុញ្ញកាស c ≈ 3 x 10⁸ m/s (ឬ 300,000 km/s)។',
      en: 'Speed of light c ≈ 3 * 10⁸ m/s.'
    }
  },
  {
    id: 'q-phy-s1-05',
    subject: 'Physics',
    subjectKm: 'រូបវិទ្យា',
    topic: 'Wave Motion Equation',
    topicKm: 'ទំនាក់ទំនងរលក',
    year: 2025,
    difficulty: 'medium',
    question: {
      km: 'តើល្បឿនរលក v ទំនាក់ទំនងជាមួយប្រេកង់ f និងប្រវែងរលក λ យ៉ាងដូចម្តេច?',
      en: 'How is wave speed v related to frequency f and wavelength λ?'
    },
    options: [
      { id: 'a', text: { km: 'v = f * λ', en: 'v = f * λ' } },
      { id: 'b', text: { km: 'v = f / λ', en: 'v = f / λ' } },
      { id: 'c', text: { km: 'v = λ / f', en: 'v = λ / f' } },
      { id: 'd', text: { km: 'v = f + λ', en: 'v = f + λ' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'រូបមន្តល្បឿនរលក v = f * λ (ប្រេកង់ គុណនឹង ប្រវែងរលក)។',
      en: 'Wave equation: v = f * λ.'
    }
  }
];

export const physicsQuestionsSet2: Question[] = [
  {
    id: 'q-phy-s2-01',
    subject: 'Physics',
    subjectKm: 'រូបវិទ្យា',
    topic: 'Conservation of Energy',
    topicKm: 'ច្បាប់រក្សាថាមពល',
    year: 2025,
    difficulty: 'medium',
    question: {
      km: 'យោងតាមច្បាប់រក្សាថាមពល ថាមពលសរុបនៃប្រព័ន្ធបិទជិតមួយមានលក្ខណៈយ៉ាងដូចម្តេច?',
      en: 'According to the Law of Conservation of Energy, what happens to the total energy of an isolated system?'
    },
    options: [
      { id: 'a', text: { km: 'មិនអាចកើតឡើង ឬបាត់បង់ទេ គឺគ្រាន់តែប្លែងទម្រង់', en: 'Cannot be created or destroyed, only transformed' } },
      { id: 'b', text: { km: 'ថយចុះបន្តិចម្តងៗតាមពេលវេលា', en: 'Gradually decreases over time' } },
      { id: 'c', text: { km: 'កើនឡើងជានិច្ចដោយស្វ័យប្រវត្តិ', en: 'Increases automatically' } },
      { id: 'd', text: { km: 'ប្រែប្រួលទៅតាមសីតុណ្ហភាពខាងក្រៅ', en: 'Varies with external temperature' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'ថាមពលមិនអាចបង្កើតថ្មី ឬបំផ្លាញចោលបានទេ គឺវាគ្រាន់តែផ្លាស់ប្តូរពីទម្រង់មួយទៅទម្រង់មួយទៀតប៉ុណ្ណោះ។',
      en: 'Energy can neither be created nor destroyed, only converted from one form to another.'
    }
  },
  {
    id: 'q-phy-s2-02',
    subject: 'Physics',
    subjectKm: 'រូបវិទ្យា',
    topic: 'Pressure Units SI',
    topicKm: 'ឯកតាសម្ពាធ',
    year: 2024,
    difficulty: 'easy',
    question: {
      km: 'តើឯកតាអន្តរជាតិ (SI Unit) នៃសម្ពាធ (Pressure) គឺជាអ្វី?',
      en: 'What is the SI unit of pressure?'
    },
    options: [
      { id: 'a', text: { km: 'ប៉ាស្កាល់ (Pascal / Pa)', en: 'Pascal (Pa)' } },
      { id: 'b', text: { km: 'ញូតុន (Newton / N)', en: 'Newton (N)' } },
      { id: 'c', text: { km: 'ស៊ូល (Joule / J)', en: 'Joule (J)' } },
      { id: 'd', text: { km: 'វ៉ាត់ (Watt / W)', en: 'Watt (W)' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'ឯកតាសម្ពាធ SI គឺ Pascal (Pa) ដែល 1 Pa = 1 N/m²។',
      en: 'SI unit of pressure is Pascal (Pa), equivalent to 1 N/m².'
    }
  },
  {
    id: 'q-phy-s2-03',
    subject: 'Physics',
    subjectKm: 'រូបវិទ្យា',
    topic: 'Mechanical Work',
    topicKm: 'ការងារមេកានិច',
    year: 2025,
    difficulty: 'medium',
    question: {
      km: 'គណនាការងារ (Work) ធ្វើដោយកម្លាំង F = 50 N រុញវត្ថុឱ្យផ្លាស់ទីបានចម្ងាយ d = 4 m តាមទិសដៅកម្លាំង។',
      en: 'Calculate the mechanical work done by a force of 50 N moving an object by 4 m in the force\'s direction.'
    },
    options: [
      { id: 'a', text: { km: '200 J', en: '200 J' } },
      { id: 'b', text: { km: '12.5 J', en: '12.5 J' } },
      { id: 'c', text: { km: '54 J', en: '54 J' } },
      { id: 'd', text: { km: '100 J', en: '100 J' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'W = F * d = 50 N * 4 m = 200 Joules (J)។',
      en: 'Work W = F * d = 50 * 4 = 200 J.'
    }
  },
  {
    id: 'q-phy-s2-04',
    subject: 'Physics',
    subjectKm: 'រូបវិទ្យា',
    topic: 'Optics & Lenses',
    topicKm: 'អុបទិច និងកញ្ចក់ប៉ោង',
    year: 2025,
    difficulty: 'hard',
    question: {
      km: 'តើកញ្ចក់ប៉ោង (Convex Lens) បង្កើតរូបភាពយ៉ាងដូចម្តេចសម្រាប់វត្ថុនៅចម្ងាយឆ្ងាយជាង ២ដងនៃប្រវែងកវចម្ងាយ (d > 2f)?',
      en: 'What type of image is formed by a convex lens when an object is placed at a distance d > 2f?'
    },
    options: [
      { id: 'a', text: { km: 'រូបភាពពិត ត្រឡប់ក្បាល និងតូចជាងវត្ថុ', en: 'Real, inverted, and diminished image' } },
      { id: 'b', text: { km: 'រូបភាពនិម្មិត ឈរក្បាល និងធំជាងវត្ថុ', en: 'Virtual, upright, and enlarged image' } },
      { id: 'c', text: { km: 'រូបភាពពិត ត្រឡប់ក្បាល និងធំជាងវត្ថុ', en: 'Real, inverted, and enlarged image' } },
      { id: 'd', text: { km: 'គ្មានរូបភាពកើតឡើងទេ', en: 'No image is formed' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'នៅពេល d > 2f កញ្ចក់ប៉ោងបង្កើតរូបភាពពិត ត្រឡប់ក្បាល និងមានទំហំតូចជាងវត្ថុដើម នៅចន្លោះ f និង 2f។',
      en: 'For d > 2f, a convex lens forms a real, inverted, and diminished image between f and 2f.'
    }
  },
  {
    id: 'q-phy-s2-05',
    subject: 'Physics',
    subjectKm: 'រូបវិទ្យា',
    topic: 'Total Internal Reflection',
    topicKm: 'ការឆ្លុះបញ្ចាំងពេញលេញ',
    year: 2025,
    difficulty: 'hard',
    question: {
      km: 'តើបាតុភូតឆ្លុះបញ្ចាំងពេញលេញ (Total Internal Reflection) កើតឡើងនៅពេលណា?',
      en: 'Under what condition does Total Internal Reflection occur?'
    },
    options: [
      { id: 'a', text: { km: 'នៅពេលពន្លឺធ្វើដំណើរពីមជ្ឈដ្ឋានកកខ្លាំងទៅមជ្ឈដ្ឋានស្តើង ហើយមុំចងកោងធំជាងមុំប្រដេញ', en: 'Light travels from denser to rarer medium with incident angle exceeding critical angle' } },
      { id: 'b', text: { km: 'នៅពេលពន្លឺធ្វើដំណើរពីមជ្ឈដ្ឋានស្តើងទៅកក', en: 'Light travels from rarer to denser medium' } },
      { id: 'c', text: { km: 'នៅពេលមុំចងកោងស្មើនឹង ០ ដឺក្រេ', en: 'Incident angle is 0 degrees' } },
      { id: 'd', text: { km: 'កើតឡើងតែក្នុងសុញ្ញកាសប៉ុណ្ណោះ', en: 'Occurs exclusively in vacuum' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'ការឆ្លុះបញ្ចាំងពេញលេញទាមទារពន្លឺដើរពីមជ្ឈដ្ឋានមានសន្ទស្សន៍បត់ធំទៅតូច ហើយមុំចងកោងធំជាងមុំប្រដេញ (Critical Angle)។',
      en: 'Total internal reflection requires light moving from higher to lower refractive index at an angle greater than critical angle.'
    }
  }
];

export const khmerQuestionsSet1: Question[] = [
  {
    id: 'q-kh-s1-01',
    subject: 'Khmer Literature',
    subjectKm: 'ភាសាខ្មែរ',
    topic: 'Classical Khmer Poetics',
    topicKm: 'កាព្យសាស្ត្រខ្មែរ',
    year: 2024,
    difficulty: 'medium',
    question: {
      km: 'នៅក្នុងកម្រងកាព្យបុរាណខ្មែរ "កាកី" និពន្ធដោយព្រះបាទអង្គឌួង តើកាព្យប្រភេទណាដែលត្រូវបានប្រើប្រាស់ជាចម្បង?',
      en: 'In the classical Khmer epic "Kakei" by King Ang Duong, which poetic meter is predominantly used?'
    },
    options: [
      { id: 'a', text: { km: 'បទព្រហ្មគីតិ (មេពាក្យ ៧)', en: 'Brahmagit Meter (7-syllable rhyme)' } },
      { id: 'b', text: { km: 'បទកាកគតិ (មេពាក្យ ៤)', en: 'Kak-Kati Meter (4-syllable rhyme)' } },
      { id: 'c', text: { km: 'បទពាក្យ ៨', en: 'Octameter (8-syllable rhyme)' } },
      { id: 'd', text: { km: 'បទភុជង្គលីលា (មេពាក្យ ៦)', en: 'Phuchong Leela Meter (6-syllable rhyme)' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'រឿងកាកី និពន្ធឡើងដោយប្រើកម្រងកាព្យចម្រុះជាពិសេស "បទព្រហ្មគីតិ" (ពាក្យ ៧) ដែលបង្ហាញពីសោភ័ណភាពខ្ពស់នៃអក្សរសាស្ត្រសម័យឧដុង្គ។',
      en: 'The literary epic Kakei principally employs Brahmagit 7-syllable poetic meters.'
    }
  },
  {
    id: 'q-kh-s1-02',
    subject: 'Khmer Literature',
    subjectKm: 'ភាសាខ្មែរ',
    topic: 'Tum Teav Novel Analysis',
    topicKm: 'វិភាគរឿងទុំទាវ',
    year: 2025,
    difficulty: 'hard',
    question: {
      km: 'នៅក្នុងរឿង «ទុំទាវ» របស់ព្រះបទុមត្ថេរ សោម តើទំនាស់ស្នូល (Core Conflict) ដ៏ជ្រាលជ្រៅបំផុតគឺជាអ្វី?',
      en: 'In the classic masterpiece "Tum Teav" by Preah Botumthera Som, what is the core thematic conflict?'
    },
    options: [
      { id: 'a', text: { km: 'ទំនាស់សិទ្ធិសេរីភាពស្នេហាយុវជន ប្រឆាំងអំណាចសក្តិភូមិ «នំមិនធំជាងកញ្ជើ»', en: 'Conflict of youth love freedom against feudal authority' } },
      { id: 'b', text: { km: 'ទំនាស់ដណ្តើមដីធ្លីរវាងអាណាខេត្ត', en: 'Territorial dispute between provinces' } },
      { id: 'c', text: { km: 'ទំនាស់រវាងជំនឿសាសនា', en: 'Religious disputes' } },
      { id: 'd', text: { km: 'ទំនាស់រវាងឈ្មួញ និងកសិករ', en: 'Commercial clash between merchants and farmers' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'ទំនាស់ស្នូលគឺការតស៊ូសេរីភាពក្នុងជម្រើសគូស្រកររបស់ទុំទាវ ប្រឆាំងនឹងអំណាចផ្តាច់ការមាតាសក្តិភូមិ។',
      en: 'Core conflict is the struggle for freedom of marriage choice against oppressive feudal traditions.'
    }
  },
  {
    id: 'q-kh-s1-03',
    subject: 'Khmer Literature',
    subjectKm: 'ភាសាខ្មែរ',
    topic: 'Abstract Noun Prefixes',
    topicKm: 'នាមអរូប និងបុព្វបទខ្មែរ',
    year: 2024,
    difficulty: 'easy',
    question: {
      km: 'តើនាមអរូប (Abstract Noun) ក្នុងភាសាខ្មែរ ជាទូទៅបង្កើតឡើងដោយបន្ថែមបុព្វបទអ្វីពីមុខកិរិយា ឬគុណនាម?',
      en: 'In Khmer grammar, abstract nouns are typically formed by adding which prefix before verbs or adjectives?'
    },
    options: [
      { id: 'a', text: { km: '«ការ-» ឬ «ភាព-»', en: 'Prefixes "Kar-" or "Pheap-"' } },
      { id: 'b', text: { km: '«អ្នក-» ឬ «ជន-»', en: 'Prefixes "Neak-" or "Chon-"' } },
      { id: 'c', text: { km: '«សេចក្តី-» តែមួយគត់', en: 'Prefix "Sechkdei-" only' } },
      { id: 'd', text: { km: '«ប្រព័ន្ធ-»', en: 'Prefix "Propan-"' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'នាមអរូបបង្កើតឡើងដោយដាក់បុព្វបទ «ការ-» ពីមុខកិរិយាសព្ទ (ឧ. ការសិក្សា) ឬ «ភាព-» ពីមុខគុណនាម (ឧ. ភាពស្មោះត្រង់)។',
      en: 'Abstract nouns use "Kar-" before verbs or "Pheap-" before adjectives.'
    }
  },
  {
    id: 'q-kh-s1-04',
    subject: 'Khmer Literature',
    subjectKm: 'ភាសាខ្មែរ',
    topic: 'Modern Khmer Novels',
    topicKm: 'អក្សរសិល្ប៍ទំនើប កុលាបប៉ៃលិន',
    year: 2024,
    difficulty: 'easy',
    question: {
      km: 'តើអ្នកនិពន្ធរឿង «កុលាបប៉ៃលិន» ដ៏ល្បីល្បាញក្នុងអក្សរសិល្ប៍ទំនើប គឺជាអ្នកណា?',
      en: 'Who is the celebrated author of the modern Khmer novel "Kulap Pailin"?'
    },
    options: [
      { id: 'a', text: { km: 'លោក ញ៉ុក ថែម', en: 'Nhok Thaem' } },
      { id: 'b', text: { km: 'លោក ឌឿក អាំ', en: 'Duek Am' } },
      { id: 'c', text: { km: 'លោក រីម គីន', en: 'Rim Kin' } },
      { id: 'd', text: { km: 'លោក ស៊ិន ឌីកា', en: 'Sin Dika' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'រឿងកុលាបប៉ៃលិន ត្រូវបានតែងនិពន្ធឡើងដោយលោក ញ៉ុក ថែម នៅក្នុងឆ្នាំ ១៩៣៦-១៩៤៣។',
      en: 'Kulap Pailin was written by prominent Cambodian author Nhok Thaem.'
    }
  },
  {
    id: 'q-kh-s1-05',
    subject: 'Khmer Literature',
    subjectKm: 'ភាសាខ្មែរ',
    topic: 'Kak-Kati Poetic Structure',
    topicKm: 'រចនាសម្ព័ន្ធបទកាកគតិ',
    year: 2025,
    difficulty: 'medium',
    question: {
      km: 'តើ «បទកាកគតិ» ក្នុងកាព្យខ្មែរ មួយល្បះមានប៉ុន្មានឃ្លា ហើយឃ្លានីមួយៗមានប៉ុន្មានពាក្យ?',
      en: 'In Khmer poetics, how many lines make up one stanza of a "Kak-Kati" meter, and how many words per line?'
    },
    options: [
      { id: 'a', text: { km: 'មួយល្បះមាន ៧ ឃ្លា, ឃ្លានីមួយៗមាន ៤ ពាក្យ', en: '7 lines per stanza, 4 words per line' } },
      { id: 'b', text: { km: 'មួយល្បះមាន ៤ ឃ្លា, ឃ្លានីមួយៗមាន ៧ ពាក្យ', en: '4 lines per stanza, 7 words per line' } },
      { id: 'c', text: { km: 'មួយល្បះមាន ៦ ឃ្លា, ឃ្លានីមួយៗមាន ៦ ពាក្យ', en: '6 lines per stanza, 6 words per line' } },
      { id: 'd', text: { km: 'មួយល្បះមាន ៥ ឃ្លា, ឃ្លានីមួយៗមាន ៥ ពាក្យ', en: '5 lines per stanza, 5 words per line' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'បទកាកគតិ មួយល្បះមាន ៧ ឃ្លា ហើយឃ្លានីមួយៗមាន ៤ ពាក្យ (សរុប ២៨ ពាក្យក្នុងមួយល្បះ)។',
      en: 'Kak-Kati meter has 7 lines per stanza with 4 syllables/words per line.'
    }
  }
];

export const khmerQuestionsSet2: Question[] = [
  {
    id: 'q-kh-s2-01',
    subject: 'Khmer Literature',
    subjectKm: 'ភាសាខ្មែរ',
    topic: 'Modern Khmer Prose & Realism',
    topicKm: 'អក្សរសិល្ប៍ប្រាកដនិយម',
    year: 2025,
    difficulty: 'medium',
    question: {
      km: 'តើអ្នកនិពន្ធរឿង «សូផាត» (១៩៣៨) ដែលជារឿងប្រលោមលោកទំនើបដំបូងគេ គឺជាអ្នកណា?',
      en: 'Who is the author of "Sophat" (1938), considered the first modern Cambodian prose novel?'
    },
    options: [
      { id: 'a', text: { km: 'លោក រីម គីន (Rim Kin)', en: 'Rim Kin' } },
      { id: 'b', text: { km: 'លោក ញ៉ុក ថែម', en: 'Nhok Thaem' } },
      { id: 'c', text: { km: 'លោក ស៊ុន ស៊ាង', en: 'Sun Seang' } },
      { id: 'd', text: { km: 'លោក ប៉ែន ប៊ុនថន', en: 'Pen Bunthon' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'រឿងសូផាត តែងដោយលោក រីម គីន ក្នុងឆ្នាំ ១៩៣៨ ត្រូវបានទទួលស្គាល់ជារឿងប្រលោមលោកទំនើបបែបប្រាកដនិយមដំបូងបង្អស់។',
      en: 'Novel Sophat was written by Rim Kin in 1938 as Cambodia\'s landmark modern prose novel.'
    }
  },
  {
    id: 'q-kh-s2-02',
    subject: 'Khmer Literature',
    subjectKm: 'ភាសាខ្មែរ',
    topic: 'Transitive Verbs Grammar',
    topicKm: 'កិរិយាសព្ទសកម្ម ក្នុងវេយ្យាករណ៍',
    year: 2024,
    difficulty: 'easy',
    question: {
      km: 'តើ «កិរិយាសព្ទសកម្ម (Transitive Verb)» ក្នុងប្រយោគខ្មែរ មានលក្ខណៈសម្គាល់យ៉ាងដូចម្តេច?',
      en: 'How is a Transitive Verb identified in Khmer sentence structure?'
    },
    options: [
      { id: 'a', text: { km: 'ជាកិរិយាដែលត្រូវការកម្មបទផ្ទាល់ (Object) មកទទួលអំពើ', en: 'Requires a direct object to complete its meaning' } },
      { id: 'b', text: { km: 'ជាកិរិយាដែលមិនត្រូវការកម្មបទមកទទួលអំពើឡើយ', en: 'Does not require any object' } },
      { id: 'c', text: { km: 'ជាកិរិយាដែលបញ្ជាក់តែទីកន្លែង', en: 'Expresses location only' } },
      { id: 'd', text: { km: 'ជាកិរិយាដែលប្រើតែជាមួយប្រយោគសំណួរ', en: 'Used exclusively in interrogative sentences' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'កិរិយាសព្ទសកម្ម (ឧ. ញ៉ាំ, សរសេរ, មើល) ទាមទារកម្មបទមកទទួលអំពើទើបប្រយោគមានន័យពេញលេញ។',
      en: 'Transitive verbs require a direct object to receive the action.'
    }
  },
  {
    id: 'q-kh-s2-03',
    subject: 'Khmer Literature',
    subjectKm: 'ភាសាខ្មែរ',
    topic: 'Early Grade Reading EGRA',
    topicKm: 'វិធីសាស្ត្របង្រៀនអំណានដំបូង (EGRA)',
    year: 2025,
    difficulty: 'medium',
    question: {
      km: 'តើកញ្ចប់វិធីសាស្ត្របង្រៀនអំណានដំបូង (EGRA) ភាសាខ្មែរ ផ្អែកលើសមាសភាគគ្រឹះសំខាន់ៗចំនួនប៉ុន្មាន?',
      en: 'The Early Grade Reading Assessment (EGRA) pedagogy package for Khmer relies on how many core components?'
    },
    options: [
      { id: 'a', text: { km: '៥ សមាសភាគសំខាន់ (ការស្តាប់, សូរ, អក្សរ, អានរហ័ស, យល់ន័យ)', en: '5 Core Components' } },
      { id: 'b', text: { km: '៣ សមាសភាគ', en: '3 Components' } },
      { id: 'c', text: { km: '៧ សមាសភាគ', en: '7 Components' } },
      { id: 'd', text: { km: '២ សមាសភាគ', en: '2 Components' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'EGRA ផ្អែកលើ ៥ សមាសភាគ៖ ការយល់ដឹងតាមសូរ, ទំនាក់ទំនងសូរនិងអក្សរ, វាក្យសព្ទ, ការអានដោយរលូន, និងការយល់ន័យអត្ថបទ។',
      en: 'EGRA framework incorporates 5 core reading components.'
    }
  },
  {
    id: 'q-kh-s2-04',
    subject: 'Khmer Literature',
    subjectKm: 'ភាសាខ្មែរ',
    topic: 'Puthom-Yam Poetics',
    topicKm: 'រចនាសម្ព័ន្ធបទបឋមយ៉ាម',
    year: 2025,
    difficulty: 'hard',
    question: {
      km: 'តើ «បទបឋមយ៉ាម» ក្នុងកាព្យខ្មែរ ត្រូវបានគេស្គាល់តាមទម្រង់មេពាក្យប៉ុន្មានពាក្យក្នុងមួយឃ្លា?',
      en: 'What is the characteristic syllable count per line in the Khmer poetic meter "Puthom-Yam"?'
    },
    options: [
      { id: 'a', text: { km: 'មេពាក្យ ៦ (៦ ពាក្យក្នុងមួយឃ្លា)', en: '6-syllable meter (6 words per line)' } },
      { id: 'b', text: { km: 'មេពាក្យ ៤ (៤ ពាក្យក្នុងមួយឃ្លា)', en: '4-syllable meter' } },
      { id: 'c', text: { km: 'មេពាក្យ ៨ (៨ ពាក្យក្នុងមួយឃ្លា)', en: '8-syllable meter' } },
      { id: 'd', text: { km: 'មេពាក្យ ៧ (៧ ពាក្យក្នុងមួយឃ្លា)', en: '7-syllable meter' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'បទបឋមយ៉ាម ជាកាព្យមេពាក្យ ៦ (៦ ពាក្យក្នុងមួយឃ្លា) មានចង្វាក់ពីរោះរលូន។',
      en: 'Puthom-Yam meter uses a 6-syllable structure per line.'
    }
  },
  {
    id: 'q-kh-s2-05',
    subject: 'Khmer Literature',
    subjectKm: 'ភាសាខ្មែរ',
    topic: 'Spelling & Orthography Rules',
    topicKm: 'អក្ខរាវិរុទ្ធ និងវចនានុក្រមជួនណាត',
    year: 2024,
    difficulty: 'medium',
    question: {
      km: 'យោងតាមក្បួនអក្ខរាវិរុទ្ធខ្មែរផ្លូវការ ផ្អែកលើវចនានុក្រមសម្តេចសង្ឃរាជ ជួន ណាត តើពាក្យ «អក្ខរាវិរុទ្ធ» មានន័យដូចម្តេច?',
      en: 'Based on Samdach Chhoun Nath\'s official Khmer dictionary, what does the term "Orthography/Akhoraviruth" mean?'
    },
    options: [
      { id: 'a', text: { km: 'ការសរសេរអក្សរឱ្យបានត្រឹមត្រូវឥតមានឆ្គង', en: 'Writing words correctly without spelling error' } },
      { id: 'b', text: { km: 'ការសរសេរកាព្យ', en: 'Composing poetry' } },
      { id: 'c', text: { km: 'ការបកប្រែភាសាបរទេស', en: 'Translating foreign languages' } },
      { id: 'd', text: { km: 'ការអានអត្ថបទឱ្យបានរហ័ស', en: 'Speed reading' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'អក្ខរាវិរុទ្ធ មកពី អក្ខរា (អក្សរ) + អវិរុទ្ធ (មិនខុស) ប្រែថា «ការសរសេរអក្សរឱ្យត្រឹមត្រូវ»។',
      en: 'Akhoraviruth literally translates to correct spelling without errors.'
    }
  }
];

export const englishQuestionsSet1: Question[] = [
  {
    id: 'q-eng-s1-01',
    subject: 'English',
    subjectKm: 'ភាសាអង់គ្លេស',
    topic: 'Conditional Sentences',
    topicKm: 'ប្រយោគលក្ខខណ្ឌ (Conditionals)',
    year: 2025,
    difficulty: 'medium',
    question: {
      km: 'Choose the correct form: "If I _______ more time, I would complete the full exam analysis."',
      en: 'Choose the correct form: "If I _______ more time, I would complete the full exam analysis."'
    },
    options: [
      { id: 'a', text: { km: 'had', en: 'had' } },
      { id: 'b', text: { km: 'have', en: 'have' } },
      { id: 'c', text: { km: 'will have', en: 'will have' } },
      { id: 'd', text: { km: 'have had', en: 'have had' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'Second Conditional (If + Past Simple, would + base verb) ប្រើសម្រាប់ស្ថានភាពសន្មតបច្ចុប្បន្ន។ ដូច្នេះត្រូវប្រើ "had"។',
      en: 'Second Conditional requires Past Simple in the if-clause (had) paired with would + infinitive.'
    }
  },
  {
    id: 'q-eng-s1-02',
    subject: 'English',
    subjectKm: 'ភាសាអង់គ្លេស',
    topic: 'Vocabulary & Synonyms',
    topicKm: 'វាក្យសព្ទ និងពាក្យន័យដូច',
    year: 2024,
    difficulty: 'easy',
    question: {
      km: 'Select the best synonym for the word "COMPREHENSIVE":',
      en: 'Select the best synonym for the word "COMPREHENSIVE":'
    },
    options: [
      { id: 'a', text: { km: 'Thorough and complete', en: 'Thorough and complete' } },
      { id: 'b', text: { km: 'Brief and concise', en: 'Brief and concise' } },
      { id: 'c', text: { km: 'Difficult and hard', en: 'Difficult and hard' } },
      { id: 'd', text: { km: 'Temporary and short', en: 'Temporary and short' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: '"Comprehensive" ប្រែថា "បរិបូរណ៍, សព្វជ្រុងជ្រោយ" ន័យដូចគ្នា "Thorough and complete"។',
      en: '"Comprehensive" means including or dealing with all aspects; thorough.'
    }
  },
  {
    id: 'q-eng-s1-03',
    subject: 'English',
    subjectKm: 'ភាសាអង់គ្លេស',
    topic: 'Passive Voice Transformations',
    topicKm: 'ប្រយោគអកម្ម (Passive Voice)',
    year: 2025,
    difficulty: 'medium',
    question: {
      km: 'Identify the correct Passive Voice for: "The teacher evaluates student progress daily."',
      en: 'Identify the correct Passive Voice for: "The teacher evaluates student progress daily."'
    },
    options: [
      { id: 'a', text: { km: 'Student progress is evaluated daily by the teacher.', en: 'Student progress is evaluated daily by the teacher.' } },
      { id: 'b', text: { km: 'Student progress was evaluated daily by the teacher.', en: 'Student progress was evaluated daily by the teacher.' } },
      { id: 'c', text: { km: 'Student progress evaluates daily by teacher.', en: 'Student progress evaluates daily by teacher.' } },
      { id: 'd', text: { km: 'The teacher is evaluated student progress daily.', en: 'The teacher is evaluated student progress daily.' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'Present Simple Active (evaluates) ផ្លាស់ប្តូរទៅជា Present Simple Passive (is evaluated)។',
      en: 'Present simple passive uses is/are + past participle (is evaluated).'
    }
  },
  {
    id: 'q-eng-s1-04',
    subject: 'English',
    subjectKm: 'ភាសាអង់គ្លេស',
    topic: 'Prepositions of Time',
    topicKm: 'ធ្នាប់ពេលវេលា (Prepositions)',
    year: 2024,
    difficulty: 'easy',
    question: {
      km: 'Choose the correct preposition: "Cambodia officially joined ASEAN _______ April 30, 1999."',
      en: 'Choose the correct preposition: "Cambodia officially joined ASEAN _______ April 30, 1999."'
    },
    options: [
      { id: 'a', text: { km: 'on', en: 'on' } },
      { id: 'b', text: { km: 'in', en: 'in' } },
      { id: 'c', text: { km: 'at', en: 'at' } },
      { id: 'd', text: { km: 'by', en: 'by' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'ប្រើប្រាស់ធ្នាប់ "on" សម្រាប់កាលបរិច្ឆេទជាក់លាក់ដែលមាន ថ្ងៃ ខែ និង ឆ្នាំ (Specific Date)។',
      en: 'Use "on" for specific calendar dates.'
    }
  },
  {
    id: 'q-eng-s1-05',
    subject: 'English',
    subjectKm: 'ភាសាអង់គ្លេស',
    topic: 'Subject-Verb Agreement',
    topicKm: 'កិរិយាសព្ទស្របតាមប្រធាន',
    year: 2025,
    difficulty: 'hard',
    question: {
      km: 'Complete the sentence: "Neither the principal nor the teachers _______ present at yesterday\'s meeting."',
      en: 'Complete the sentence: "Neither the principal nor the teachers _______ present at yesterday\'s meeting."'
    },
    options: [
      { id: 'a', text: { km: 'were', en: 'were' } },
      { id: 'b', text: { km: 'was', en: 'was' } },
      { id: 'c', text: { km: 'is', en: 'is' } },
      { id: 'd', text: { km: 'are', en: 'are' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'នៅពេលប្រើ "Neither... nor...", កិរិយាសព្ទស្របតាមប្រធានដែលជិតវាបំផុត (teachers ជានាមពហុវចនៈ ➔ ប្រើ "were" សម្រាប់កាលអតីត)។',
      en: 'With "neither... nor", verb agrees with the subject closest to it (teachers => plural verb "were").'
    }
  }
];

export const englishQuestionsSet2: Question[] = [
  {
    id: 'q-eng-s2-01',
    subject: 'English',
    subjectKm: 'ភាសាអង់គ្លេស',
    topic: 'Future Perfect Continuous',
    topicKm: 'កាល Future Perfect Continuous',
    year: 2025,
    difficulty: 'hard',
    question: {
      km: 'Choose the correct tense: "By next October, teacher candidates _______ for 12 months."',
      en: 'Choose the correct tense: "By next October, teacher candidates _______ for 12 months."'
    },
    options: [
      { id: 'a', text: { km: 'will have been studying', en: 'will have been studying' } },
      { id: 'b', text: { km: 'will study', en: 'will study' } },
      { id: 'c', text: { km: 'have studied', en: 'have studied' } },
      { id: 'd', text: { km: 'are studying', en: 'are studying' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'ប្រើ Future Perfect Continuous (will have been + V-ing) សម្រាប់សកម្មភាពបន្តរហូតដល់ចំណុចពេលណាមួយក្នុងអនាគត។',
      en: 'Future Perfect Continuous indicates ongoing duration up to a specific future reference point.'
    }
  },
  {
    id: 'q-eng-s2-02',
    subject: 'English',
    subjectKm: 'ភាសាអង់គ្លេស',
    topic: 'Vocabulary Antonyms',
    topicKm: 'ពាក្យន័យផ្ទុយ (Antonyms)',
    year: 2024,
    difficulty: 'medium',
    question: {
      km: 'Select the best antonym for the word "RIGOROUS":',
      en: 'Select the best antonym for the word "RIGOROUS":'
    },
    options: [
      { id: 'a', text: { km: 'Lax and lenient', en: 'Lax and lenient' } },
      { id: 'b', text: { km: 'Strict and demanding', en: 'Strict and demanding' } },
      { id: 'c', text: { km: 'Accurate and precise', en: 'Accurate and precise' } },
      { id: 'd', text: { km: 'Complex and hard', en: 'Complex and hard' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: '"Rigorous" ប្រែថា "ម៉ត់ចត់, តឹងរ៉ឹង" ន័យផ្ទុយគឺ "Lax and lenient" (ធូររលុង, យោគយល់)។',
      en: 'Antonym of rigorous (strict) is lax/lenient.'
    }
  },
  {
    id: 'q-eng-s2-03',
    subject: 'English',
    subjectKm: 'ភាសាអង់គ្លេស',
    topic: 'Reported Speech',
    topicKm: 'ប្រយោគរាយការណ៍ (Reported Speech)',
    year: 2025,
    difficulty: 'medium',
    question: {
      km: 'Identify the correct reported speech: She said, "I am preparing my lesson plan now."',
      en: 'Identify the correct reported speech: She said, "I am preparing my lesson plan now."'
    },
    options: [
      { id: 'a', text: { km: 'She said that she was preparing her lesson plan then.', en: 'She said that she was preparing her lesson plan then.' } },
      { id: 'b', text: { km: 'She said that I am preparing my lesson plan now.', en: 'She said that I am preparing my lesson plan now.' } },
      { id: 'c', text: { km: 'She said she is preparing her lesson plan then.', en: 'She said she is preparing her lesson plan then.' } },
      { id: 'd', text: { km: 'She told she was preparing lesson plan.', en: 'She told she was preparing lesson plan.' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'Present Continuous (am preparing) ប្តូរទៅជា Past Continuous (was preparing) ហើយ "now" ប្តូរទៅជា "then"។',
      en: 'In indirect speech: am preparing -> was preparing, now -> then.'
    }
  },
  {
    id: 'q-eng-s2-04',
    subject: 'English',
    subjectKm: 'ភាសាអង់គ្លេស',
    topic: 'Idiomatic Expressions',
    topicKm: 'សំនួនវោហារ (Idioms)',
    year: 2024,
    difficulty: 'medium',
    question: {
      km: 'What does the idiom "to break the ice" mean?',
      en: 'What does the idiom "to break the ice" mean?'
    },
    options: [
      { id: 'a', text: { km: 'To initiate conversation in a social setting', en: 'To initiate conversation in a social setting' } },
      { id: 'b', text: { km: 'To freeze water completely', en: 'To freeze water completely' } },
      { id: 'c', text: { km: 'To destroy something valuable', en: 'To destroy something valuable' } },
      { id: 'd', text: { km: 'To arrive late for an exam', en: 'To arrive late for an exam' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'សំនួន "break the ice" មានន័យថា បង្កើតបរិយាកាសស្និទ្ធស្នាល និងចាប់ផ្តើមសន្ទនាគ្នាជាលើកដំបូង។',
      en: '"To break the ice" means to ease tension and start conversation.'
    }
  },
  {
    id: 'q-eng-s2-05',
    subject: 'English',
    subjectKm: 'ភាសាអង់គ្លេស',
    topic: 'Relative Pronouns Possessive',
    topicKm: 'ឈ្នាប់ប្រយោគ (Relative Pronouns)',
    year: 2025,
    difficulty: 'hard',
    question: {
      km: 'Complete the sentence: "The candidate _______ essay received top marks was awarded a scholarship."',
      en: 'Complete the sentence: "The candidate _______ essay received top marks was awarded a scholarship."'
    },
    options: [
      { id: 'a', text: { km: 'whose', en: 'whose' } },
      { id: 'b', text: { km: 'who', en: 'who' } },
      { id: 'c', text: { km: 'whom', en: 'whom' } },
      { id: 'd', text: { km: 'which', en: 'which' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'ប្រើ "whose" សម្រាប់បញ្ជាក់កម្មសិទ្ធិ (essay របស់ candidate)។',
      en: 'Use possessive relative pronoun "whose" for ownership.'
    }
  }
];

export const genCultureQuestionsSet2: Question[] = [
  {
    id: 'q-r2-01',
    subject: 'General Culture & Law',
    subjectKm: 'វប្បធម៌ទូទៅ និងច្បាប់',
    topic: 'International Law & ICJ Verdict 1962',
    topicKm: 'ច្បាប់អន្តរជាតិ និងសាលក្រមតុលាការឡាអេ ១៩៦២',
    year: 2026,
    difficulty: 'hard',
    question: {
      km: 'យោងតាមសេចក្តីសម្រេចជាប្រវត្តិសាស្ត្ររបស់តុលាការយុត្តិធម៌អន្តរជាតិ (ICJ) ក្រុងឡាអេ ថ្ងៃទី ១៥ ខែមិថុនា ឆ្នាំ ១៩៦២ តើភស្តុតាង និងមូលដ្ឋានច្បាប់អន្តរជាតិដ៏សំខាន់បំផុតណា ដែលតុលាការបានយកមកសំអាងក្នុងការកាត់ក្តីប្រគល់ប្រាសាទព្រះវិហារមកឱ្យកម្ពុជា?',
      en: 'According to the landmark International Court of Justice (ICJ) judgment of June 15, 1962, which primary international legal ground led the court to adjudicate the Temple of Preah Vihear to Cambodia?'
    },
    options: [
      { id: 'a', text: { km: 'ផែនទីឧបសម្ព័ន្ធទី១ (Annex I map - ដងរែក) ដែលគូសដោយគណៈកម្មការចម្រុះបារាំង-សៀម និងគោលការណ៍ច្បាប់ Estoppel', en: 'Annex I Map drawn by Franco-Siamese Mixed Commission and the Estoppel doctrine' } },
      { id: 'b', text: { km: 'គោលការណ៍ខ្សែបន្ទាត់បែងចែកទឹក (Watershed line) សុទ្ធសាធ', en: 'Strict watershed line principle' } },
      { id: 'c', text: { km: 'សន្ធិសញ្ញាក្រុងបាងកក ឆ្នាំ១៨៦៣ រវាងបារាំង និងសៀម', en: '1863 Bangkok Treaty between France and Siam' } },
      { id: 'd', text: { km: 'កិច្ចព្រមព្រៀងសន្តិភាពទីក្រុងប៉ារីស ឆ្នាំ១៩៩១', en: '1991 Paris Peace Agreements' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'តុលាការយុត្តិធម៌អន្តរជាតិ (ICJ) បានសំអាងជាចម្បងលើផែនទី Annex I (ផែនទីដងរែក) ដែលភាគីសៀមបានទទួលយកដោយមិនជំទាស់អស់រយៈពេលរាប់សិបឆ្នាំ ស្របតាមគោលការណ៍ Estoppel (Qui tacet consentire videtur)។',
      en: 'The ICJ relied principally on the Annex I Map, finding that Siam had accepted and held it without protest for over 50 years, invoking the principle of estoppel/acquiescence.'
    },
    reference: 'សាលក្រមតុលាការយុត្តិធម៌អន្តរជាតិ (ICJ) ថ្ងៃទី ១៥ ខែមិថុនា ឆ្នាំ ១៩៦២'
  },
  {
    id: 'q-r2-02',
    subject: 'General Culture & Law',
    subjectKm: 'វប្បធម៌ទូទៅ និងច្បាប់',
    topic: 'Constitution & Education Law Framework',
    topicKm: 'ក្របខណ្ឌរដ្ឋធម្មនុញ្ញ និងច្បាប់ស្តីពីការអប់រំ',
    year: 2026,
    difficulty: 'hard',
    question: {
      km: 'យោងតាមរដ្ឋធម្មនុញ្ញនៃព្រះរាជាណាចក្រកម្ពុជា (មាត្រា ៦៥ និង ៦៨) និងច្បាប់ស្តីពីការអប់រំ តើក្របខណ្ឌកាតព្វកិច្ចច្បាប់នៃការអប់រំជាមូលដ្ឋានសម្រាប់ពលរដ្ឋគ្រប់រូបត្រូវបានកំណត់កម្រិតអប្បបរមាយ៉ាងដូចម្តេច?',
      en: 'Under Articles 65 & 68 of the Cambodian Constitution and Education Law, what mandatory baseline education guarantee is legally established for all citizens?'
    },
    options: [
      { id: 'a', text: { km: 'រដ្ឋធានាការអប់រំជាមូលដ្ឋានដោយឥតបង់ថ្លៃរយៈពេល ៩ ឆ្នាំ (ចាប់ពីថ្នាក់ទី១ ដល់ថ្នាក់ទី៩) នៅក្នុងសាលារៀនសាធារណៈ', en: 'State guarantees 9 years of free basic education (Grades 1–9) in public schools' } },
      { id: 'b', text: { km: 'រដ្ឋធានាការអប់រំឥតបង់ថ្លៃ ១២ ឆ្នាំ រហូតដល់ចប់ថ្នាក់ទុតិយភូមិ', en: 'State guarantees 12 years of free education through high school' } },
      { id: 'c', text: { km: 'រដ្ឋធានាការអប់រំបឋមសិក្សា ៦ ឆ្នាំ ប៉ុណ្ណោះ', en: 'State guarantees 6 years of primary education only' } },
      { id: 'd', text: { km: 'រដ្ឋធានាការអប់រំឥតបង់ថ្លៃរហូតដល់កម្រិតបរិញ្ញាបត្រ', en: 'State guarantees free education up to Bachelor degree' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'មាត្រា ៦៨ នៃរដ្ឋធម្មនុញ្ញ និងមាត្រា ៣១ នៃច្បាប់ស្តីពីការអប់រំ ចែងថា រដ្ឋត្រូវផ្តល់ការអប់រំជាមូលដ្ឋានដោយឥតគិតថ្លៃរយៈពេល ៩ ឆ្នាំ នៅក្នុងសាលារៀនសាធារណៈ។',
      en: 'Article 68 of the Constitution mandates 9 years of free basic education in public schools.'
    },
    reference: 'រដ្ឋធម្មនុញ្ញនៃព្រះរាជាណាចក្រកម្ពុជា មាត្រា ៦៨'
  },
  {
    id: 'q-r2-03',
    subject: 'General Culture & Economics',
    subjectKm: 'វប្បធម៌ទូទៅ និងសេដ្ឋកិច្ច',
    topic: 'Pentagonal Strategy Phase 1 Core Pillars',
    topicKm: 'យុទ្ធសាស្ត្របញ្ចកោណ ដំណាក់កាលទី១ (មុំទាំង៥)',
    year: 2026,
    difficulty: 'hard',
    question: {
      km: 'នៅក្នុង «យុទ្ធសាស្ត្របញ្ចកោណ-ដំណាក់កាលទី១» របស់រាជរដ្ឋាភិបាលកម្ពុជា នីតិកាលទី៧ តើអាទិភាពគន្លឹះទាំង ៥ ដែលត្រូវបានកំណត់ដើម្បីធានាចក្ខុវិស័យកម្ពុជា ឆ្នាំ២០៥០ មានអ្វីខ្លះ?',
      en: 'In the Pentagonal Strategy - Phase 1 of the 7th Legislature, which 5 core priorities are established to realize Cambodia\'s Vision 2050?'
    },
    options: [
      { id: 'a', text: { km: 'មនុស្ស, ផ្លូវ, ទឹក, ភ្លើង, និង បច្ចេកវិទ្យា', en: 'People, Roads, Water, Electricity, and Technology' } },
      { id: 'b', text: { km: 'កសិកម្ម, ឧស្សាហកម្ម, ទេសចរណ៍, ពាណិជ្ជកម្ម, និង ធនធានទឹក', en: 'Agriculture, Industry, Tourism, Commerce, and Water Resources' } },
      { id: 'c', text: { km: 'សន្តិសុខ, សណ្តាប់ធ្នាប់, អប់រំ, សុខាភិបាល, និង ហេដ្ឋារចនាសម្ព័ន្ធ', en: 'Security, Order, Education, Health, and Infrastructure' } },
      { id: 'd', text: { km: 'ធនធានមនុស្ស, ច្បាប់, បរិស្ថាន, ថាមពល, និង វិនិយោគ', en: 'Human Capital, Law, Environment, Energy, and Investment' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'រាជរដ្ឋាភិបាលបានបន្ថែមអាទិភាពទី៥ «បច្ចេកវិទ្យា» លើអាទិភាពដើមទាំង៤ (មនុស្ស ផ្លូវ ទឹក ភ្លើង) ដើម្បីឆ្លើយតបនឹងបដិវត្តន៍ឧស្សាហកម្ម ៤.០ និងសេដ្ឋកិច្ចឌីជីថល។',
      en: 'The 5 key priorities under Pentagonal Strategy Phase 1 are "People, Roads, Water, Electricity, and Technology".'
    },
    reference: 'ឯកសារយុទ្ធសាស្ត្របញ្ចកោណ-ដំណាក់កាលទី១ រាជរដ្ឋាភិបាលកម្ពុជា'
  },
  {
    id: 'q-r2-04',
    subject: 'General Culture & Environment',
    subjectKm: 'វប្បធម៌ទូទៅ និងបរិស្ថាន',
    topic: 'Tonle Sap Biosphere Reserve & Ecology',
    topicKm: 'តំបន់បម្រុងជីវមណ្ឌលបឹងទន្លេសាប និងបរិស្ថាន',
    year: 2026,
    difficulty: 'hard',
    question: {
      km: 'តើបឹងទន្លេសាបត្រូវបានអង្គការ UNESCO ចុះបញ្ជីជា «តំបន់បម្រុងជីវមណ្ឌលពិភពលោក (Biosphere Reserve)» នៅក្នុងឆ្នាំណា ហើយមានតំបន់ស្នូល (Core Zones) ចំនួនប៉ុន្មាន?',
      en: 'In which year was Tonle Sap designated as a UNESCO Biosphere Reserve, and how many core ecological protection zones does it contain?'
    },
    options: [
      { id: 'a', text: { km: 'ឆ្នាំ ១៩៩៧ មានតំបន់ស្នូលចំនួន ៣ (ព្រែកទាល់, ស្ទឹងសែន, និង ក្បាលតោ)', en: 'Year 1997 with 3 Core Zones (Prek Toal, Stung Sen, and Boeng Chhmar/Kbal Toal)' } },
      { id: 'b', text: { km: 'ឆ្នាំ ២០០៤ មានតំបន់ស្នូលចំនួន ៥', en: 'Year 2004 with 5 Core Zones' } },
      { id: 'c', text: { km: 'ឆ្នាំ ២០១០ មានតំបន់ស្នូលចំនួន ២', en: 'Year 2010 with 2 Core Zones' } },
      { id: 'd', text: { km: 'ឆ្នាំ ១៩៩២ មានតំបន់ស្នូលចំនួន ៤', en: 'Year 1992 with 4 Core Zones' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'បឹងទន្លេសាបត្រូវ UNESCO ប្រកាសជា Biosphere Reserve ឆ្នាំ១៩៩៧ ដោយមានតំបន់ស្នូលការពារ ៣ គឺ បឹងឆ្មារ/ព្រែកទាល់ ស្ទឹងសែន និងក្បាលតោ។',
      en: 'Tonle Sap was recognized as a UNESCO Biosphere Reserve in 1997, featuring 3 core conservation zones.'
    },
    reference: 'ព្រះរាជក្រឹត្យស្តីពីការបង្កើតតំបន់បម្រុងជីវមណ្ឌលបឹងទន្លេសាប'
  },
  {
    id: 'q-r2-05',
    subject: 'General Culture & Law',
    subjectKm: 'វប្បធម៌ទូទៅ និងច្បាប់',
    topic: 'Civil Service Statute Framework',
    topicKm: 'ច្បាប់ស្តីពីលក្ខន្តិកៈរួមមន្ត្រីរាជការស៊ីវិល',
    year: 2026,
    difficulty: 'hard',
    question: {
      km: 'យោងតាមច្បាប់ស្តីពីលក្ខន្តិកៈរួមមន្ត្រីរាជការស៊ីវិលនៃព្រះរាជាណាចក្រកម្ពុជា តើមន្ត្រីរាជការស៊ីវិលត្រូវទទួលបានការវាយតម្លៃ និងតម្លើងថ្នាក់/កម្រិតតាមរយៈពេលកំណត់ជាទៀងទាត់ប៉ុន្មានឆ្នាំម្តង?',
      en: 'According to the Common Statute of Civil Servants of Cambodia, how often are civil servants systematically evaluated for step promotion?'
    },
    options: [
      { id: 'a', text: { km: 'រៀងរាល់ ២ ឆ្នាំម្តង (ឬ ១ ឆ្នាំម្តងសម្រាប់ករណីពិសេសមានប័ណ្ណសរសើរ)', en: 'Every 2 years (or 1 year for exceptional commendation)' } },
      { id: 'b', text: { km: 'រៀងរាល់ ៥ ឆ្នាំម្តង', en: 'Every 5 years' } },
      { id: 'c', text: { km: 'រៀងរាល់ ៣ ឆ្នាំម្តង', en: 'Every 3 years' } },
      { id: 'd', text: { km: 'មិនមានកំណត់រយៈពេលទៀងទាត់ឡើយ', en: 'No fixed statutory interval' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'លក្ខន្តិកៈមន្ត្រីរាជការស៊ីវិល កំណត់ការតម្លើងថ្នាក់ជាទៀងទាត់រៀងរាល់ ២ ឆ្នាំម្តង តាមកម្រិតថ្នាក់កំណត់។',
      en: 'The Civil Service Statute mandates step promotion evaluation every 2 years.'
    },
    reference: 'ច្បាប់ស្តីពីលក្ខន្តិកៈរួមមន្ត្រីរាជការស៊ីវិល ឆ្នាំ១៩៩៤'
  },
  {
    id: 'q-r2-06',
    subject: 'General Culture & Pedagogy',
    subjectKm: 'វប្បធម៌ទូទៅ និងការគិតកម្រិតខ្ពស់',
    topic: 'Bloom\'s Revised Taxonomy HOTS Analysis',
    topicKm: 'ការវិភាគបំណិនគិតកម្រិតខ្ពស់ (HOTS)',
    year: 2026,
    difficulty: 'hard',
    question: {
      km: 'នៅពេលគ្រូបង្រៀនតម្រូវឱ្យសិស្ស «ប្រៀបធៀប និងវិនិច្ឆ័យពីគុណសម្បត្តិ និងគុណវិបត្តិនៃការអនុវត្តថាមពលកកើតឡើងវិញនៅកម្ពុជា ដោយផ្អែកលើទិន្នន័យជាក់ស្តែង» តើសកម្មភាពនេះស្ថិតក្នុងកម្រិតការគិតកម្រិតខ្ពស់ណាខ្លះនៃ Bloom\'s Revised Taxonomy?',
      en: 'When a teacher tasks students to "critique and assess the merits and demerits of renewable energy adoption in Cambodia based on empirical data", which higher-order cognitive domains of Bloom\'s Revised Taxonomy are mobilized?'
    },
    options: [
      { id: 'a', text: { km: 'ការវិភាគ (Analyzing) និង ការវាយតម្លៃ (Evaluating)', en: 'Analyzing and Evaluating' } },
      { id: 'b', text: { km: 'ការចងចាំ (Remembering) និង ការយល់ដឹង (Understanding)', en: 'Remembering and Understanding' } },
      { id: 'c', text: { km: 'ការអនុវត្ត (Applying) សុទ្ធសាធ', en: 'Applying exclusively' } },
      { id: 'd', text: { km: 'ការបង្កើតថ្មី (Creating) ដោយមិនឆ្លងកាត់ការវិភាគ', en: 'Creating without prior analytical scrutiny' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'ការប្រៀបធៀបទិន្នន័យ និងបំបែកធាតុផ្សំជាសកម្មភាព «ការវិភាគ (Analyzing)» ចំណែកការវិនិច្ឆ័យថ្លឹងថ្លែងគុណសម្បត្តិគុណវិបត្តិ ដើម្បីធ្វើការសន្និដ្ឋានជាសកម្មភាព «ការវាយតម្លៃ (Evaluating)»។',
      en: 'Breaking down empirical data represents Analyzing, while judging merits/demerits against defined criteria represents Evaluating—both core Higher-Order Thinking Skills (HOTS).'
    },
    reference: 'ក្របខណ្ឌទ្រឹស្តី Bloom\'s Revised Taxonomy ក្នុងការវាយតម្លៃការសិក្សា'
  },
  {
    id: 'q-r2-07',
    subject: 'General Culture & Assessment',
    subjectKm: 'វប្បធម៌ទូទៅ និងរង្វាយតម្លៃ',
    topic: 'Item Difficulty & Discrimination Psychometrics',
    topicKm: 'សន្ទស្សន៍លំបាក និងសន្ទស្សន៍រើសអើងនៃសំណួរ (Item Analysis)',
    year: 2026,
    difficulty: 'hard',
    question: {
      km: 'ក្នុងការវិភាគគុណភាពវិញ្ញាសាប្រឡង (Item Analysis) ប្រសិនបើសំណួរមួយមានសន្ទស្សន៍លំបាក P = 0.50 និងសន្ទស្សន៍រើសអើង D = 0.45 តើសំណួរនោះត្រូវបានវាយតម្លៃគុណភាពបច្ចេកទេសយ៉ាងដូចម្តេច?',
      en: 'In exam item analysis, if a test item exhibits a difficulty index of P = 0.50 and a discrimination index of D = 0.45, how is the quality of this item evaluated?'
    },
    options: [
      { id: 'a', text: { km: 'ជាសំណួរគំរូដ៏ល្អឥតខ្ចោះ (Excellent Item) ដែលមានកម្រិតលំបាកមធ្យមសមស្រប និងសមត្ថភាពបែងចែកសិស្សពូកែនិងខ្សោយបានខ្ពស់', en: 'An excellent item with optimal medium difficulty and high discrimination between high and low achievers' } },
      { id: 'b', text: { km: 'ជាសំណួរដែលងាយពេក ត្រូវកែសម្រួល ឬលុបចោល', en: 'An excessively easy item that should be discarded' } },
      { id: 'c', text: { km: 'ជាសំណួរដែលពិបាកខ្លាំងពេក គ្មានសិស្សណាឆ្លើយត្រូវ', en: 'An excessively difficult item where no student answered correctly' } },
      { id: 'd', text: { km: 'ជាសំណួរដែលមានបញ្ហាអវិជ្ជមានក្នុងការបែងចែកសមត្ថភាពសិស្ស', en: 'A defective item exhibiting negative discrimination' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'សន្ទស្សន៍លំបាក P = 0.50 បង្ហាញថាសំណួរមានកម្រិតលំបាកល្មមសមស្របបំផុត (ផ្តល់ Variance អតិបរមា) ហើយសន្ទស្សន៍រើសអើង D >= 0.40 ត្រូវបានចាត់ទុកជាសំណួរល្អឥតខ្ចោះ (Excellent item) ក្នុងការវាស់ស្ទង់បែងចែកសមត្ថភាពពិតរបស់បេក្ខជន។',
      en: 'A difficulty of P = 0.50 maximizes test score variance, while a discrimination index of D >= 0.40 is psychometrically categorized as an excellent discriminator.'
    },
    reference: 'សៀវភៅណែនាំរង្វាយតម្លៃលទ្ធផលសិក្សារបស់សិស្ស ក្រសួងអប់រំ យុវជន និងកីឡា'
  }
];

export const genCultureQuestionsSet1: Question[] = mockQuestions;

// =============================================================================
// MOCK QUIZZES ARRAY (MAPS DISTINCT SUBJECT QUESTION SETS)
// =============================================================================

export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-nie-math-01',
    title: {
      km: 'កម្រងសំណួរ ឯកទេសគណិតវិទ្យា វិញ្ញាសាទី ១',
      en: 'Mathematics Specialization Quiz Set 1'
    },
    subject: 'Mathematics',
    subjectKm: 'គណិតវិទ្យា',
    topic: 'Functions, Algebra & Calculus',
    topicKm: 'អនុគមន៍ ពិជគណិត និងប្រូបាប',
    targetExam: ['nie', 'rttc', 'pttc'],
    questionsCount: 20,
    durationMinutes: 15,
    difficulty: 'hard',
    questions: mathQuestionsSet1
  },
  {
    id: 'quiz-nie-math-02',
    title: {
      km: 'កម្រងសំណួរ ឯកទេសគណិតវិទ្យា វិញ្ញាសាទី ២',
      en: 'Mathematics Specialization Quiz Set 2'
    },
    subject: 'Mathematics',
    subjectKm: 'គណិតវិទ្យា',
    topic: 'Advanced Geometry & Calculus',
    topicKm: 'ធរណីមាត្រ និងគណនាអាំងតេក្រាល',
    targetExam: ['nie', 'rttc', 'pttc'],
    questionsCount: 20,
    durationMinutes: 15,
    difficulty: 'hard',
    questions: mathQuestionsSet2
  },
  {
    id: 'quiz-rttc-sci-01',
    title: {
      km: 'កម្រងសំណួរ ឯកទេសរូបវិទ្យា វិញ្ញាសាទី ១',
      en: 'Physics Specialization Quiz Set 1'
    },
    subject: 'Physics',
    subjectKm: 'រូបវិទ្យា',
    topic: 'Mechanics, Waves & Thermodynamics',
    topicKm: 'មេកានិច រលក និងអគ្គិសនី',
    targetExam: ['nie', 'rttc'],
    questionsCount: 20,
    durationMinutes: 15,
    difficulty: 'hard',
    questions: physicsQuestionsSet1
  },
  {
    id: 'quiz-rttc-sci-02',
    title: {
      km: 'កម្រងសំណួរ ឯកទេសរូបវិទ្យា វិញ្ញាសាទី ២',
      en: 'Physics Specialization Quiz Set 2'
    },
    subject: 'Physics',
    subjectKm: 'រូបវិទ្យា',
    topic: 'Conservation of Energy & Optics',
    topicKm: 'ច្បាប់រក្សាថាមពល និងអុបទិច',
    targetExam: ['nie', 'rttc'],
    questionsCount: 20,
    durationMinutes: 15,
    difficulty: 'hard',
    questions: physicsQuestionsSet2
  },
  {
    id: 'quiz-nie-khmer-01',
    title: {
      km: 'កម្រងសំណួរ ភាសាខ្មែរ/អក្សរសាស្ត្រ វិញ្ញាសាទី ១',
      en: 'Khmer Language Quiz Set 1'
    },
    subject: 'Khmer Literature',
    subjectKm: 'ភាសាខ្មែរ',
    topic: 'Khmer Grammar, Composition & Literature',
    topicKm: 'វេយ្យាករណ៍ខ្មែរ កាព្យ និងតែងសេចក្តី',
    targetExam: ['nie', 'rttc', 'pttc'],
    questionsCount: 20,
    durationMinutes: 15,
    difficulty: 'medium',
    questions: khmerQuestionsSet1
  },
  {
    id: 'quiz-nie-khmer-02',
    title: {
      km: 'កម្រងសំណួរ ភាសាខ្មែរ/អក្សរសាស្ត្រ វិញ្ញាសាទី ២',
      en: 'Khmer Language Quiz Set 2'
    },
    subject: 'Khmer Literature',
    subjectKm: 'ភាសាខ្មែរ',
    topic: 'Modern Prose, EGRA & Grammar',
    topicKm: 'អក្សរសិល្ប៍ប្រាកដនិយម និង EGRA',
    targetExam: ['nie', 'rttc', 'pttc'],
    questionsCount: 20,
    durationMinutes: 15,
    difficulty: 'medium',
    questions: khmerQuestionsSet2
  },
  {
    id: 'quiz-eng-set-01',
    title: {
      km: 'កម្រងសំណួរ ភាសាអង់គ្លេស វិញ្ញាសាទី ១',
      en: 'English Language Quiz Set 1'
    },
    subject: 'English',
    subjectKm: 'ភាសាអង់គ្លេស',
    topic: 'English Grammar, Tenses & Comprehension',
    topicKm: 'វេយ្យាករណ៍អង់គ្លេស និងការអានយល់អត្ថបទ',
    targetExam: ['nie', 'rttc', 'pttc'],
    questionsCount: 20,
    durationMinutes: 12,
    difficulty: 'medium',
    questions: englishQuestionsSet1
  },
  {
    id: 'quiz-eng-set-02',
    title: {
      km: 'កម្រងសំណួរ ភាសាអង់គ្លេស វិញ្ញាសាទី ២',
      en: 'English Language Quiz Set 2'
    },
    subject: 'English',
    subjectKm: 'ភាសាអង់គ្លេស',
    topic: 'Advanced Tenses, Idioms & Reported Speech',
    topicKm: 'កាលកម្រិតខ្ពស់ សំនួន និងប្រយោគរាយការណ៍',
    targetExam: ['nie', 'rttc', 'pttc'],
    questionsCount: 20,
    durationMinutes: 12,
    difficulty: 'medium',
    questions: englishQuestionsSet2
  },
  {
    id: 'quiz-ped-01',
    title: {
      km: 'កម្រងសំណួរ វប្បធម៌ទូទៅ វិញ្ញាសាទី ១',
      en: 'General Culture Quiz Set 1'
    },
    subject: 'General Culture',
    subjectKm: 'វប្បធម៌ទូទៅ',
    topic: 'Cambodian Heritage, Constitution & Society',
    topicKm: 'បេតិកភណ្ឌ រដ្ឋធម្មនុញ្ញ និងសង្គមកម្ពុជា',
    targetExam: ['nie', 'rttc', 'pttc'],
    questionsCount: 20,
    durationMinutes: 10,
    difficulty: 'medium',
    questions: genCultureQuestionsSet1
  },
  {
    id: 'quiz-gen-02',
    title: {
      km: 'កម្រងសំណួរ វប្បធម៌ទូទៅ វិញ្ញាសាទី ២',
      en: 'General Culture Quiz Set 2'
    },
    subject: 'General Culture',
    subjectKm: 'វប្បធម៌ទូទៅ',
    topic: 'National Heritage & Educational Framework',
    topicKm: 'បេតិកភណ្ឌជាតិ និងក្របខណ្ឌអប់រំ',
    targetExam: ['nie', 'rttc', 'pttc', 'kindergarten'],
    questionsCount: 20,
    durationMinutes: 10,
    difficulty: 'easy',
    questions: genCultureQuestionsSet2
  }
];

export const mockExams: MockExam[] = [
  // ================= MOCK EXAM SET 1 =================
  {
    id: 'mock-nie-2026-r1',
    title: {
      km: 'វិញ្ញាសាប្រឡងសាកល្បង ឈុតទី ១',
      en: 'Mock Exam Set 1'
    },
    description: {
      km: 'វិញ្ញាសាប្រឡងសាកល្បង ឈុតទី ១ (គ្រប់មុខវិជ្ជាកំណត់ពេល ៤៥ នាទី)។',
      en: 'Mock Exam Set 1 full subject examination paper (45 minutes).'
    },
    targetExam: 'nie',
    subject: 'General Culture',
    subjectKm: 'វប្បធម៌ទូទៅ',
    year: 2026,
    durationMinutes: 45,
    totalMarks: 50,
    passingMarks: 25,
    round: 1,
    difficulty: 'medium',
    instructions: {
      km: [
        'វិញ្ញាសាសាកល្បងនេះមានរយៈពេលកំណត់ ៤៥ នាទី។',
        'សូមជ្រើសរើសចម្លើយត្រឹមត្រូវបំផុតតែមួយគត់សម្រាប់សំណួរនីមួយៗ។',
        'អ្នកអាចដាក់ចំណាំ (Mark for Review) លើសំណួរដែលមិនទាន់ច្បាស់ ដើម្បីត្រឡប់មកពិនិត្យវិញ។',
        'នៅពេលអស់ម៉ោង ប្រព័ន្ធនឹងប្រគល់វិញ្ញាសាដោយស្វ័យប្រវត្តិ។',
        'ពិន្ទុជាប់កម្រិតស្តង់ដារគឺ ២៥/៥០ ពិន្ទុ (៥០%)។'
      ],
      en: [
        'Mock exam time limit is 45 minutes.',
        'Select the single best answer for each question.',
        'Use "Mark for Review" for questions you want to double-check later.',
        'When time expires, your answers are submitted automatically.',
        'Passing qualifying threshold is 25/50 marks (50%).'
      ]
    },
    questions: [
      ...mockQuestions,
      {
        id: 'q-mock-04',
        subject: 'General Culture',
        subjectKm: 'វប្បធម៌ទូទៅ',
        topic: 'ASEAN & Regional Affairs',
        topicKm: 'អាស៊ាន និងកិច្ចការតំបន់',
        difficulty: 'medium',
        question: {
          km: 'តើប្រទេសកម្ពុជាបានចូលជាសមាជិកពេញសិទ្ធិនៃសមាគមប្រជាជាតិអាស៊ីអាគ្នេយ៍ (ASEAN) នៅថ្ងៃខែឆ្នាំណា?',
          en: 'On what date did Cambodia officially become a full member of the Association of Southeast Asian Nations (ASEAN)?'
        },
        options: [
          { id: 'a', text: { km: 'ថ្ងៃទី ៣០ ខែមេសា ឆ្នាំ ១៩៩៩', en: 'April 30, 1999' } },
          { id: 'b', text: { km: 'ថ្ងៃទី ០៨ ខែសីហា ឆ្នាំ ១៩៦៧', en: 'August 8, 1967' } },
          { id: 'c', text: { km: 'ថ្ងៃទី ២៣ ខែតុលា ឆ្នាំ ១៩៩១', en: 'October 23, 1991' } },
          { id: 'd', text: { km: 'ថ្ងៃទី ០១ ខែមករា ឆ្នាំ ២០០០', en: 'January 1, 2000' } }
        ],
        correctAnswerId: 'a',
        explanation: {
          km: 'កម្ពុជាបានចូលជាសមាជិកទី ១០ នៃអាស៊ានជាផ្លូវការនៅថ្ងៃទី ៣០ ខែមេសា ឆ្នាំ ១៩៩៩ នៅទីក្រុងហាណូយ ប្រទេសវៀតណាម។',
          en: 'Cambodia was officially admitted as the 10th member of ASEAN on April 30, 1999, in Hanoi, Vietnam.'
        }
      },
      {
        id: 'q-mock-05',
        subject: 'General Culture',
        subjectKm: 'វប្បធម៌ទូទៅ',
        topic: 'Cambodian Modern Architecture & History',
        topicKm: 'ស្ថាបត្យកម្មសម័យទំនើប និងប្រវត្តិសាស្ត្រ',
        difficulty: 'medium',
        question: {
          km: 'តើស្ថាបត្យករខ្មែរដ៏ឆ្នើមរូបណា ដែលជាអ្នកគូរប្លង់ស្ថាបត្យកម្មវិមានឯករាជ្យ និងពហុកីឡដ្ឋានជាតិអូឡាំពិក នៅរាជធានីភ្នំពេញ?',
          en: 'Which celebrated Cambodian architect designed the Independence Monument and National Olympic Stadium in Phnom Penh?'
        },
        options: [
          { id: 'a', text: { km: 'លោកបណ្ឌិត វណ្ណ មូលីវណ្ណ (Vann Molyvann)', en: 'Dr. Vann Molyvann' } },
          { id: 'b', text: { km: 'លោក ហង់ ជុនណារ៉ុន', en: 'Dr. Hang Chuon Naron' } },
          { id: 'c', text: { km: 'លោក ជូក ម៉េងហួត', en: 'Mr. Chhouk Menghuot' } },
          { id: 'd', text: { km: 'លោក ឡឹក សាវ៉ាត', en: 'Mr. Lek Savath' } }
        ],
        correctAnswerId: 'a',
        explanation: {
          km: 'លោកបណ្ឌិត វណ្ណ មូលីវណ្ណ (១៩២៦ - ២០១៧) គឺជាស្ថាបត្យករជាន់ខ្ពស់ដ៏ល្បីល្បាញ ដែលបានបង្កើតស្នាដៃស្ថាបត្យកម្មបែប «ស្ថាបត្យកម្មខ្មែរថ្មី» ដ៏លេចធ្លោរួមមាន វិមានឯករាជ្យ ពហុកីឡដ្ឋានជាតិអូឡាំពិក និងសាលសន្និសីទចតុមុខ។',
          en: 'Dr. Vann Molyvann (1926-2017) was Cambodia\'s most renowned architect who pioneered the New Khmer Architecture movement, designing landmarks including the Independence Monument and National Olympic Stadium.'
        }
      }
    ]
  },

  // ================= MOCK EXAM SET 2 =================
  {
    id: 'mock-nie-2026-r2',
    title: {
      km: 'វិញ្ញាសាប្រឡងសាកល្បង ឈុតទី ២',
      en: 'Mock Exam Set 2'
    },
    description: {
      km: 'វិញ្ញាសាប្រឡងសាកល្បង ឈុតទី ២ (គ្រប់មុខវិជ្ជាកំណត់ពេល ៦០ នាទី)។',
      en: 'Mock Exam Set 2 full subject examination paper (60 minutes).'
    },
    targetExam: 'nie',
    subject: 'General Culture & Advanced Specialization',
    subjectKm: 'វប្បធម៌ទូទៅ និងឯកទេសស៊ីជម្រៅ',
    year: 2026,
    durationMinutes: 60,
    totalMarks: 50,
    passingMarks: 30,
    round: 2,
    difficulty: 'hard',
    instructions: {
      km: [
        'វិញ្ញាសាសាកល្បង ឈុតទី ២ នេះមានកម្រិតលំបាកខ្ពស់ និងមានរយៈពេលកំណត់ ៦០ នាទី។',
        'សំណួរទាមទារការគិតវិភាគស៊ីជម្រៅ ផ្អែកលើទឡ្ហីករណ៍ច្បាប់ និងគរុកោសល្យជាន់ខ្ពស់។',
        'ពិន្ទុជាប់កម្រិតស្តង់ដារគឺ ៣០/៥០ ពិន្ទុ (៦០%)។',
        'សូមអានសំណួរ និងជម្រើសនីមួយៗឱ្យបានម៉ត់ចត់មុននឹងសម្រេចចិត្តឆ្លើយ។'
      ],
      en: [
        'Mock Exam Set 2 contains advanced higher-difficulty questions with a 60-minute duration.',
        'Questions require rigorous multi-step analysis, legal reasoning, and higher-order evaluation.',
        'Qualifying threshold is 30/50 marks (60%).',
        'Read each scenario and set of options thoroughly before finalizing your choice.'
      ]
    },
    questions: genCultureQuestionsSet2
  },

  // ================= RTTC ROUND 1 =================
  {
    id: 'mock-rttc-2026-r1',
    title: {
      km: 'វិញ្ញាសាប្រឡងសាកល្បង ជុំទី ១',
      en: 'Mock Exam - Round 1'
    },
    description: {
      km: 'វិញ្ញាសាប្រឡងសាកល្បងជុំទី ១ (ជម្រុះបឋម / កម្រិតមធ្យម) កំណត់ពេល ៤០ នាទី។',
      en: 'Round 1 preliminary simulation (40 minutes).'
    },
    targetExam: 'rttc',
    subject: 'General Culture',
    subjectKm: 'វប្បធម៌ទូទៅ',
    year: 2026,
    durationMinutes: 40,
    totalMarks: 50,
    passingMarks: 25,
    round: 1,
    difficulty: 'medium',
    instructions: {
      km: [
        'វិញ្ញាសាជុំទី ១ នេះមានរយៈពេលកំណត់ ៤០ នាទី (កម្រិតមធ្យម)។',
        'សូមជ្រើសរើសចម្លើយត្រឹមត្រូវបំផុតតែមួយគត់សម្រាប់សំណួរនីមួយៗ។',
        'ពិន្ទុជាប់កម្រិតស្តង់ដារគឺ ២៥/៥០ ពិន្ទុ (៥០%)។'
      ],
      en: [
        'Round 1 time limit is 40 minutes (Medium difficulty).',
        'Select the single best answer for each question.',
        'Passing qualifying threshold is 25/50 marks (50%).'
      ]
    },
    questions: mockQuestions
  },

  // ================= RTTC ROUND 2 =================
  {
    id: 'mock-rttc-2026-r2',
    title: {
      km: 'វិញ្ញាសាប្រឡងសាកល្បង ជុំទី ២ (កម្រិតពិបាក)',
      en: 'Mock Exam - Round 2 (Hard)'
    },
    description: {
      km: 'វិញ្ញាសាប្រឡងសាកល្បងជុំទី ២ (ផ្តាច់ព្រ័ត្រស៊ីជម្រៅ / កម្រិតពិបាក) កំណត់ពេល ៦០ នាទី។',
      en: 'Round 2 advanced examination focusing on analytical depth and complex problem solving.'
    },
    targetExam: 'rttc',
    subject: 'General Culture & Specialization',
    subjectKm: 'វប្បធម៌ទូទៅ និងឯកទេស',
    year: 2026,
    durationMinutes: 60,
    totalMarks: 50,
    passingMarks: 30,
    round: 2,
    difficulty: 'hard',
    instructions: {
      km: [
        'វិញ្ញាសាជុំទី ២ នេះមានកម្រិតលំបាកខ្ពស់ (ពិបាក) និងមានរយៈពេលកំណត់ ៦០ នាទី។',
        'សំណួរតម្រូវឱ្យមានការវិភាគស៊ីជម្រៅលើខ្លឹមសារឯកទេស។',
        'ពិន្ទុជាប់កម្រិតស្តង់ដារជុំទី ២ គឺ ៣០/៥០ ពិន្ទុ (៦០%)។'
      ],
      en: [
        'Round 2 contains advanced higher-difficulty questions with a 60-minute duration.',
        'Passing qualifying threshold is 30/50 marks (60%).'
      ]
    },
    questions: genCultureQuestionsSet2
  },

  // ================= PTTC ROUND 1 =================
  {
    id: 'mock-pttc-2026-r1',
    title: {
      km: 'វិញ្ញាសាប្រឡងសាកល្បង ជុំទី ១',
      en: 'Mock Exam - Round 1'
    },
    description: {
      km: 'វិញ្ញាសាប្រឡងសាកល្បងជុំទី ១ (ជម្រុះបឋម / កម្រិតមធ្យម) កំណត់ពេល ៤០ នាទី។',
      en: 'Round 1 preliminary simulation (40 minutes).'
    },
    targetExam: 'pttc',
    subject: 'General Knowledge',
    subjectKm: 'ចំណេះដឹងទូទៅ',
    year: 2026,
    durationMinutes: 40,
    totalMarks: 50,
    passingMarks: 25,
    round: 1,
    difficulty: 'medium',
    instructions: {
      km: [
        'វិញ្ញាសាជុំទី ១ នេះមានរយៈពេលកំណត់ ៤០ នាទី។',
        'សូមជ្រើសរើសចម្លើយត្រឹមត្រូវបំផុតតែមួយគត់សម្រាប់សំណួរនីមួយៗ។',
        'ពិន្ទុជាប់កម្រិតស្តង់ដារគឺ ២៥/៥០ ពិន្ទុ (៥០%)។'
      ],
      en: [
        'Round 1 time limit is 40 minutes.',
        'Select the single best answer for each question.',
        'Passing qualifying threshold is 25/50 marks (50%).'
      ]
    },
    questions: mockQuestions
  },

  // ================= PTTC ROUND 2 =================
  {
    id: 'mock-pttc-2026-r2',
    title: {
      km: 'វិញ្ញាសាប្រឡងសាកល្បង ជុំទី ២ (កម្រិតពិបាក)',
      en: 'Mock Exam - Round 2 (Hard)'
    },
    description: {
      km: 'វិញ្ញាសាប្រឡងសាកល្បងជុំទី ២ (ផ្តាច់ព្រ័ត្រស៊ីជម្រៅ / កម្រិតពិបាក) កំណត់ពេល ៦០ នាទី។',
      en: 'Round 2 advanced simulation with challenging scenarios.'
    },
    targetExam: 'pttc',
    subject: 'Primary Pedagogy & Assessment',
    subjectKm: 'គរុកោសល្យបឋម និងរង្វាយតម្លៃ',
    year: 2026,
    durationMinutes: 60,
    totalMarks: 50,
    passingMarks: 30,
    round: 2,
    difficulty: 'hard',
    instructions: {
      km: [
        'វិញ្ញាសាជុំទី ២ នេះមានកម្រិតលំបាកខ្ពស់ (ពិបាក) និងមានរយៈពេលកំណត់ ៦០ នាទី។',
        'ពិន្ទុជាប់កម្រិតស្តង់ដារជុំទី ២ គឺ ៣០/៥០ ពិន្ទុ (៦០%)។'
      ],
      en: [
        'Round 2 contains advanced higher-difficulty questions with a 60-minute duration.',
        'Passing qualifying threshold is 30/50 marks (60%).'
      ]
    },
    questions: genCultureQuestionsSet2
  }
];

export const mockPastPapers: PastPaper[] = [
  {
    id: 'pp-2025-nie-cult',
    title: {
      km: 'វិញ្ញាសាវប្បធម៌ទូទៅ និងគរុកោសល្យ កម្រិតឧត្តម ឆ្នាំ២០២៥ (មានចម្លើយពន្យល់)',
      en: 'General Culture & Pedagogy Exam Paper 2025 (Upper Secondary - With Detailed Solutions)'
    },
    targetExam: 'nie',
    subject: 'General Culture & Pedagogy',
    subjectKm: 'វប្បធម៌ទូទៅ និងគរុកោសល្យ',
    year: 2025,
    session: 'សម័យប្រឡង៖ តុលា ២០២៥',
    fileSize: '3.4 MB',
    hasAnswerKey: true,
    totalQuestions: 40,
    questions: mockQuestions
  },
  {
    id: 'pp-2024-nie-math',
    title: {
      km: 'វិញ្ញាសាឯកទេសគណិតវិទ្យា ជ្រើសរើសគ្រូមធ្យមទុតិយភូមិ ឆ្នាំ២០២៤',
      en: 'Mathematics Major Specialization Exam Paper 2024 (Upper Secondary)'
    },
    targetExam: 'nie',
    subject: 'Mathematics',
    subjectKm: 'គណិតវិទ្យា',
    year: 2024,
    session: 'សម័យប្រឡង៖ វិច្ឆិកា ២០២៤',
    fileSize: '4.2 MB',
    hasAnswerKey: true,
    totalQuestions: 25,
    questions: mockQuestions
  },
  {
    id: 'pp-2024-rttc-khmer',
    title: {
      km: 'វិញ្ញាសាអក្សរសាស្ត្រខ្មែរ និងវិធីសាស្ត្របង្រៀន កម្រិតមូលដ្ឋាន ឆ្នាំ២០២៤',
      en: 'Khmer Literature & Teaching Methodology Paper 2024 (Lower Secondary)'
    },
    targetExam: 'rttc',
    subject: 'Khmer Literature',
    subjectKm: 'អក្សរសាស្ត្រខ្មែរ',
    year: 2024,
    session: 'សម័យប្រឡង៖ តុលា ២០២៤',
    fileSize: '2.8 MB',
    hasAnswerKey: true,
    totalQuestions: 30,
    questions: mockQuestions
  },
  {
    id: 'pp-2023-pttc-ped',
    title: {
      km: 'វិញ្ញាសាចិត្តវិទ្យា និងគរុកោសល្យបឋមសិក្សា ឆ្នាំ២០២៣',
      en: 'Primary Pedagogy & Child Psychology Paper 2023'
    },
    targetExam: 'pttc',
    subject: 'Pedagogy & Psychology',
    subjectKm: 'គរុកោសល្យ និងចិត្តវិទ្យា',
    year: 2023,
    session: 'សម័យប្រឡង៖ វិច្ឆិកា ២០២៣',
    fileSize: '3.1 MB',
    hasAnswerKey: true,
    totalQuestions: 35,
    questions: mockQuestions
  }
];

export const mockFlashcards: Flashcard[] = [
  // =========================================================================
  // 1. GENERAL CULTURE (វប្បធម៌ទូទៅ)
  // =========================================================================
  {
    id: 'fc-01',
    subject: 'General Culture',
    subjectKm: 'វប្បធម៌ទូទៅ',
    category: 'Intangible Heritage',
    front: {
      km: 'តើក្បាច់គុនល្បុក្កតោ (Kun Lbokator) ត្រូវបានចុះបញ្ជីជាបេតិកភណ្ឌវប្បធម៌អរូបីនៃមនុស្សជាតិនៅឆ្នាំណា?',
      en: 'In which year was Cambodia\'s Kun Lbokator officially inscribed on the UNESCO Intangible Cultural Heritage List?'
    },
    back: {
      km: 'ឆ្នាំ ២០២២ (ថ្ងៃទី ២៩ ខែវិច្ឆិកា ឆ្នាំ២០២២) — ត្រូវបានទទួលស្គាល់ជាផ្លូវការនៅទីក្រុងរ៉ាបាត ប្រទេសម៉ារ៉ុក។',
      en: 'Year 2022 (November 29, 2022) — Officially inscribed in Rabat, Morocco.'
    },
    hint: {
      km: 'ក្បាច់គុនបុរាណខ្មែរអាយុកាលរាប់ពាន់ឆ្នាំ',
      en: 'Millennia-old traditional Khmer martial art'
    },
    difficulty: 'medium'
  },
  {
    id: 'fc-02',
    subject: 'General Culture',
    subjectKm: 'វប្បធម៌ទូទៅ',
    category: 'National Symbols',
    front: {
      km: 'តើសត្វព្រៃអ្វីដែលត្រូវបានកំណត់ជានិមិត្តរូបសត្វថនិកសត្វតំណាងជាតិនៃប្រទេសកម្ពុជា?',
      en: 'Which wild mammal is officially designated as the national mammal of Cambodia?'
    },
    back: {
      km: 'សត្វគោព្រៃ (Kouprey - Bos sauveli) — ត្រូវបានកំណត់តាមព្រះរាជក្រឹត្យឆ្នាំ ២០០៥ ជានិមិត្តរូបសត្វថនិកសត្វតំណាងជាតិ។',
      en: 'The Kouprey (Bos sauveli) — Designated as the national mammal of Cambodia by Royal Decree in 2005.'
    },
    hint: {
      km: 'សត្វគោព្រៃកម្រដែលមានស្នែងកោងស្រួច',
      en: 'Rare wild forest ox known for its distinct curved horns'
    },
    difficulty: 'easy'
  },
  {
    id: 'fc-03',
    subject: 'General Culture',
    subjectKm: 'វប្បធម៌ទូទៅ',
    category: 'Cambodian Constitution',
    front: {
      km: 'យោងតាមរដ្ឋធម្មនុញ្ញកម្ពុជា តើបាវចនាជាតិនៃព្រះរាជាណាចក្រកម្ពុជាគឺជាអ្វី?',
      en: 'According to the Cambodian Constitution, what is the national motto of the Kingdom of Cambodia?'
    },
    back: {
      km: '"ជាតិ សាសនា ព្រះមហាក្សត្រ"',
      en: '"Nation, Religion, King"'
    },
    hint: {
      km: 'មាន ៣ ពាក្យស្នូល',
      en: 'Three primary pillars'
    },
    difficulty: 'easy'
  },
  {
    id: 'fc-04',
    subject: 'General Culture',
    subjectKm: 'វប្បធម៌ទូទៅ',
    category: 'World Heritage',
    front: {
      km: 'តើប្រាសាទព្រះវិហារត្រូវបានចុះក្នុងបញ្ជីបេតិកភណ្ឌពិភពលោករបស់ UNESCO នៅឆ្នាំណា?',
      en: 'In which year was Preah Vihear Temple inscribed on the UNESCO World Heritage List?'
    },
    back: {
      km: 'ឆ្នាំ ២០០៨ (ថ្ងៃទី ០៧ ខែកក្កដា ឆ្នាំ២០០៨) នៅទីក្រុងកេបិច ប្រទេសកាណាដា។',
      en: 'Year 2008 (July 7, 2008) in Quebec City, Canada.'
    },
    hint: {
      km: 'ប្រាសាទបុរាណលើខ្នងភ្នំដងរែក',
      en: 'Ancient temple situated atop the Dangrek Mountains'
    },
    difficulty: 'medium'
  },
  {
    id: 'fc-05',
    subject: 'General Culture',
    subjectKm: 'វប្បធម៌ទូទៅ',
    category: 'Intangible Heritage',
    front: {
      km: 'តើរបាំព្រះរាជទ្រព្យកម្ពុជាត្រូវបានចុះបញ្ជីជាបេតិកភណ្ឌវប្បធម៌អរូបីនៃមនុស្សជាតិនៅឆ្នាំណា?',
      en: 'In which year was the Royal Ballet of Cambodia inscribed on the UNESCO Intangible Cultural Heritage List?'
    },
    back: {
      km: 'ឆ្នាំ ២០០៣ (ថ្ងៃទី ០៧ ខែវិច្ឆិកា ឆ្នាំ២០០៣) — ជាស្នាដៃឯកផ្នែកផ្ទាល់មាត់និងអរូបីនៃមនុស្សជាតិ។',
      en: 'Year 2003 (November 7, 2003) — Masterpiece of the Oral and Intangible Heritage of Humanity.'
    },
    hint: {
      km: 'របាំបុរាណខ្មែរដ៏វិចិត្រ',
      en: 'Classical Khmer court dance'
    },
    difficulty: 'medium'
  },
  {
    id: 'fc-06',
    subject: 'General Culture',
    subjectKm: 'វប្បធម៌ទូទៅ',
    category: 'Geography & Environment',
    front: {
      km: 'តើបឹងទន្លេសាបមានសារៈសំខាន់យ៉ាងណាសម្រាប់ប្រព័ន្ធអេកូឡូស៊ី និងជីវភាពប្រជាជនកម្ពុជា?',
      en: 'What is the significance of the Tonle Sap Lake for Cambodia\'s ecosystem and livelihoods?'
    },
    back: {
      km: 'ជាបឹងទឹកសាបធំជាងគេនៅអាស៊ីអាគ្នេយ៍ ជាប្រភពត្រីទឹកសាប និងប្រព័ន្ធធារាសាស្ត្រកសិកម្មដ៏សំខាន់ និងជាតំបន់បំរុងជីវមណ្ឌលពិភពលោក (UNESCO Biosphere Reserve 1997)។',
      en: 'Largest freshwater lake in SE Asia, vital source of freshwater fisheries, agricultural irrigation, and designated UNESCO Biosphere Reserve in 1997.'
    },
    hint: {
      km: 'បឹងទឹកសាបធំជាងគេនៅអាស៊ីអាគ្នេយ៍',
      en: 'Largest freshwater lake in Southeast Asia'
    },
    difficulty: 'easy'
  },

  // =========================================================================
  // 2. MATHEMATICS (គណិតវិទ្យា / គណិត)
  // =========================================================================
  {
    id: 'fc-math-01',
    subject: 'Mathematics',
    subjectKm: 'គណិតវិទ្យា',
    category: 'Calculus - Derivatives',
    front: {
      km: 'តើរូបមន្តដេរីវេនៃផលគុណ (u · v)\' និងផលចែក (u / v)\' ស្មើនឹងអ្វី?',
      en: 'What are the derivative product rule (u · v)\' and quotient rule (u / v)\'?'
    },
    back: {
      km: '• (u · v)\' = u\'v + uv\'\n• (u / v)\' = (u\'v - uv\') / v²  (ដែល v ≠ 0)',
      en: '• (u · v)\' = u\'v + uv\'\n• (u / v)\' = (u\'v - uv\') / v²  (where v ≠ 0)'
    },
    hint: {
      km: 'ផលបូកដេរីវេ និងផលដកដេរីវេចែកនឹងការេភាគបែង',
      en: 'Derivative sum for product, quotient requires denominator squared'
    },
    difficulty: 'easy'
  },
  {
    id: 'fc-math-02',
    subject: 'Mathematics',
    subjectKm: 'គណិតវិទ្យា',
    category: 'Calculus - Integrals',
    front: {
      km: 'តើរូបមន្តព្រីមីទីវ (អាំងតេក្រាលមិនកំណត់) នៃ ∫ xⁿ dx ស្មើនឹងអ្វី?',
      en: 'What is the standard indefinite integral ∫ xⁿ dx?'
    },
    back: {
      km: '∫ xⁿ dx = [xⁿ⁺¹ / (n + 1)] + C  (ចំពោះ n ≠ -1)\nបើ n = -1: ∫ (1/x) dx = ln|x| + C',
      en: '∫ xⁿ dx = [xⁿ⁺¹ / (n + 1)] + C  (for n ≠ -1)\nIf n = -1: ∫ (1/x) dx = ln|x| + C'
    },
    hint: {
      km: 'ស្វ័យគុណកើន ១ រួចចែកនឹងស្វ័យគុណថ្មី',
      en: 'Increase power by 1 and divide by the new power'
    },
    difficulty: 'easy'
  },
  {
    id: 'fc-math-03',
    subject: 'Mathematics',
    subjectKm: 'គណិតវិទ្យា',
    category: 'Trigonometry & Limits',
    front: {
      km: 'តើលីមីតសំខាន់ lim (x→0) [sin(x) / x] ស្មើនឹងតម្លៃប៉ុន្មាន?',
      en: 'What is the value of the fundamental trigonometric limit lim (x→0) [sin(x) / x]?'
    },
    back: {
      km: 'lim (x→0) [sin(x) / x] = 1  (ដែល x គិតជា រ៉ាដ្យង់ - Radians)',
      en: 'lim (x→0) [sin(x) / x] = 1  (where x is measured in radians)'
    },
    hint: {
      km: 'ជាចំនួនគត់វិជ្ជមានតូចបំផុត',
      en: 'Smallest positive integer'
    },
    difficulty: 'easy'
  },
  {
    id: 'fc-math-04',
    subject: 'Mathematics',
    subjectKm: 'គណិតវិទ្យា',
    category: 'Algebra - Quadratic Formula',
    front: {
      km: 'សម្រាប់សមីការដឺក្រេទីពីរ ax² + bx + c = 0 (a ≠ 0), តើរូបមន្តឌីស្គ្រីមីណង់ Δ និងឫស x គឺជាអ្វី?',
      en: 'For quadratic equation ax² + bx + c = 0 (a ≠ 0), what are discriminant Δ and roots x?'
    },
    back: {
      km: '• Δ = b² - 4ac\n• បើ Δ > 0: មានឫសពីរផ្សេងគ្នា x = (-b ± √Δ) / (2a)\n• បើ Δ = 0: មានឫសឌុប x = -b / (2a)\n• បើ Δ < 0: គ្មានឫសក្នុង ℝ (មានឫសកុំផ្លិច)',
      en: '• Δ = b² - 4ac\n• If Δ > 0: two distinct real roots x = (-b ± √Δ) / (2a)\n• If Δ = 0: one double root x = -b / (2a)\n• If Δ < 0: no real roots (two complex roots)'
    },
    hint: {
      km: 'Δ = b² - 4ac',
      en: 'Δ = b² - 4ac'
    },
    difficulty: 'easy'
  },
  {
    id: 'fc-math-05',
    subject: 'Mathematics',
    subjectKm: 'គណិតវិទ្យា',
    category: 'Geometry',
    front: {
      km: 'តើទ្រឹស្តីបទពីតាករ (Pythagorean Theorem) ចែងដូចម្តេចក្នុងត្រីកោណកែង?',
      en: 'What does the Pythagorean Theorem state in a right-angled triangle?'
    },
    back: {
      km: 'ក្នុងត្រីកោណកែង ការេនៃអ៊ីប៉ូតេនុសស្មើនឹងផលបូកការេនៃជ្រុងជាប់មុំកែង៖\nc² = a² + b²',
      en: 'In a right-angled triangle, the square of hypotenuse equals sum of squares of legs:\nc² = a² + b²'
    },
    hint: {
      km: 'អ៊ីប៉ូតេនុសស្មើឫសការេនៃផលបូកការេជ្រុងពីរទៀត',
      en: 'c² = a² + b²'
    },
    difficulty: 'easy'
  },
  {
    id: 'fc-math-06',
    subject: 'Mathematics',
    subjectKm: 'គណិតវិទ្យា',
    category: 'Didactics / EGMA',
    front: {
      km: 'តើជំនាញស្នូលទាំង ៤ ក្នុងវិធីសាស្ត្របង្រៀនគណិតវិទ្យាថ្នាក់ដំបូង (EGMA) មានអ្វីខ្លះ?',
      en: 'What are the 4 core foundational skills in Early Grade Mathematics Assessment (EGMA)?'
    },
    back: {
      km: '១. ការស្គាល់លេខ និងការរាប់ (Number Identification & Counting)\n២. ការប្រៀបធៀបបរិមាណ (Quantity Discrimination)\n៣. លំនាំចំនួន (Missing Number / Patterns)\n៤. ការគណនាបូក ដក ក្នុងចិត្ត (Addition & Subtraction Mental Math)',
      en: '1. Number Identification & Counting\n2. Quantity Discrimination\n3. Number Patterns / Sequences\n4. Basic Addition & Subtraction (Mental Math)'
    },
    hint: {
      km: 'ការស្គាល់លេខ ការប្រៀបធៀប លំនាំ និងការគណនា',
      en: 'Recognition, comparison, pattern, and basic operations'
    },
    difficulty: 'medium'
  },

  // =========================================================================
  // 3. KHMER LITERATURE & LANGUAGE (អក្សរសាស្ត្រខ្មែរ / ភាសាខ្មែរ)
  // =========================================================================
  {
    id: 'fc-khmer-01',
    subject: 'Khmer Literature',
    subjectKm: 'អក្សរសាស្ត្រខ្មែរ',
    category: 'Khmer Grammar',
    front: {
      km: 'តើព្យញ្ជនៈខ្មែរមានប៉ុន្មានតួ? ហើយចែកចេញជាប៉ុន្មានពួក?',
      en: 'How many consonants are there in Khmer? How are they categorized?'
    },
    back: {
      km: 'ព្យញ្ជនៈខ្មែរមាន ៣៣ តួ ចែកជា ២ ពួក៖\n• ពួក អ (អឃោសៈ)៖ ក ខ ច ឆ ដ ឋ ណ ត ថ ប ផ ស ហ ឡ អ (១៥ តួ)\n• ពួក អ៊ (ឃោសៈ)៖ គ ឃ ង ជ ឈ ញ ឌ ឍ ណ ធ ភ ម យ រ ល វ (១៨ តួ)',
      en: 'There are 33 Khmer consonants divided into 2 groups:\n• Series "Or" (Voiceless): 15 consonants\n• Series "Our" (Voiced): 18 consonants'
    },
    hint: {
      km: '៣៣ តួ ចែកជាពួក អ និងពួក អ៊',
      en: '33 consonants divided into series A and O'
    },
    difficulty: 'easy'
  },
  {
    id: 'fc-khmer-02',
    subject: 'Khmer Literature',
    subjectKm: 'អក្សរសាស្ត្រខ្មែរ',
    category: 'Khmer Novels',
    front: {
      km: 'តើនរណាជាអ្នកនិពន្ធប្រលោមលោក "កុលាបប៉ៃលិន"? ហើយនិពន្ធនៅឆ្នាំណា?',
      en: 'Who is the author of the famous Khmer novel "Koularb Pailin" and when was it written?'
    },
    back: {
      km: 'និពន្ធដោយលោក ញ៉ុក ថែម ក្នុងឆ្នាំ ១៩៣៦ (បោះពុម្ពឆ្នាំ ១៩៤៣)។ តួអង្គឯកគឺ ចៅចិត្រ និង ឃុននារី។',
      en: 'Written by Nhok Them in 1936 (published in 1943). The protagonist couple is Chao Chet and Khun Neary.'
    },
    hint: {
      km: 'អ្នកនិពន្ធល្បីល្បាញមកពីខេត្តបាត់ដំបង',
      en: 'Renowned author from Battambang province'
    },
    difficulty: 'medium'
  },
  {
    id: 'fc-khmer-03',
    subject: 'Khmer Literature',
    subjectKm: 'អក្សរសាស្ត្រខ្មែរ',
    category: 'Classical Literature',
    front: {
      km: 'តើនរណាជាអ្នកនិពន្ធរឿង "ទុំទាវ" បែបកំណាព្យពាក្យ ៧? ហើយនិពន្ធនៅឆ្នាំណា?',
      en: 'Who composed the famous verse version of "Tum Teav" and in which year?'
    },
    back: {
      km: 'និពន្ធដោយ ព្រះភិក្ខុ សោម (ភិក្ខុសោម) ក្នុងឆ្នាំ ១៩១៥ នៃ គ.ស.។ រឿងនេះឆ្លុះបញ្ចាំងពីសេចក្ដីស្នេហាបរិសុទ្ធនិងទំនៀមទម្លាប់សង្គមខ្មែរជំនាន់ដើម។',
      en: 'Composed by Venerable Som (Preah Bhikkhu Som) in 1915 AD. It portrays pure love confronting traditional feudal constraints.'
    },
    hint: {
      km: 'ព្រះសង្ឃមួយអង្គគង់នៅវត្តកំពង់ព្រៅ',
      en: 'A monk from Kampong Preah monastery'
    },
    difficulty: 'medium'
  },
  {
    id: 'fc-khmer-04',
    subject: 'Khmer Literature',
    subjectKm: 'អក្សរសាស្ត្រខ្មែរ',
    category: 'Pedagogy / EGRA',
    front: {
      km: 'តើសមាសភាគស្នូលទាំង ៥ នៃវិធីសាស្ត្របង្រៀនអំណានដំបូង (EGRA) មានអ្វីខ្លះ?',
      en: 'What are the 5 core components of Early Grade Reading Assessment (EGRA)?'
    },
    back: {
      km: '១. ការយល់ដឹងអំពីសូរសំឡេង (Phonemic Awareness)\n២. អក្សរ និងសំឡេង (Phonics / Letter-Sound)\n៣. ភាពស្ទាត់ក្នុងការអាន (Fluency)\n៤. ពាក្យសព្ទ (Vocabulary)\n៥. ការយល់ន័យអត្ថបទ (Comprehension)',
      en: '1. Phonemic Awareness\n2. Phonics (Letter-Sound Correspondence)\n3. Reading Fluency\n4. Vocabulary\n5. Reading Comprehension'
    },
    hint: {
      km: 'សូរ, អក្សរ, ភាពស្ទាត់, ពាក្យសព្ទ, ការយល់ន័យ',
      en: 'Sound, letters, fluency, vocabulary, and comprehension'
    },
    difficulty: 'medium'
  },

  // =========================================================================
  // 4. PHYSICS (រូបវិទ្យា)
  // =========================================================================
  {
    id: 'fc-phys-01',
    subject: 'Physics',
    subjectKm: 'រូបវិទ្យា',
    category: 'Classical Mechanics',
    front: {
      km: 'តើច្បាប់ញូតុនទី ២ (Newton\'s 2nd Law) មានរូបមន្តយ៉ាងដូចម្តេច?',
      en: 'What is the formula for Newton\'s Second Law of Motion?'
    },
    back: {
      km: 'F⃗ = m · a⃗  (ឬ ∑F = ma)\nដែល៖\n• F: កម្លាំងសរុប (គិតជា ញូតុន - N)\n• m: ម៉ាសអង្គធាតុ (គិតជា គីឡូក្រាម - kg)\n• a: សំទុះ (គិតជា m/s²)',
      en: 'F⃗ = m · a⃗  (or ∑F = ma)\nWhere:\n• F: Net force (in Newtons, N)\n• m: Mass (in kilograms, kg)\n• a: Acceleration (in m/s²)'
    },
    hint: {
      km: 'កម្លាំងស្មើនឹងម៉ាសគុណសំទុះ',
      en: 'Force equals mass times acceleration'
    },
    difficulty: 'easy'
  },
  {
    id: 'fc-phys-02',
    subject: 'Physics',
    subjectKm: 'រូបវិទ្យា',
    category: 'Energy & Work',
    front: {
      km: 'តើរូបមន្តថាមពលស៊ីនេទិច (Kinetic Energy) និងថាមពលប៉ូតង់ស្យែលទំនាញដី (Gravitational Potential Energy) ស្មើនឹងអ្វី?',
      en: 'What are the formulas for Kinetic Energy and Gravitational Potential Energy?'
    },
    back: {
      km: '• ថាមពលស៊ីនេទិច៖ E_k = (1/2) · m · v²\n• ថាមពលប៉ូតង់ស្យែលទំនាញដី៖ E_p = m · g · h\n(ឯកតាថាមពលគិតជា ហ្ស៊ូល - Joules, J)',
      en: '• Kinetic Energy: E_k = (1/2) · m · v²\n• Gravitational Potential Energy: E_p = m · g · h\n(Energy unit in Joules, J)'
    },
    hint: {
      km: 'កន្លះ mv ការេ និង mgh',
      en: 'Half m v squared and m g h'
    },
    difficulty: 'easy'
  },
  {
    id: 'fc-phys-03',
    subject: 'Physics',
    subjectKm: 'រូបវិទ្យា',
    category: 'Electricity',
    front: {
      km: 'តើច្បាប់អូម (Ohm\'s Law) សម្រាប់កំណាត់សៀគ្វីមានរូបមន្តយ៉ាងដូចម្តេច?',
      en: 'What is the formula for Ohm\'s Law in an electric circuit?'
    },
    back: {
      km: 'U = R · I  (ឬ I = U / R)\nដែល៖\n• U: ផលសងប៉ូតង់ស្យែល ឬ តង់ស្យុង (គិតជា វ៉ុល - V)\n• I: អាំងតង់ស៊ីតេចរន្ត (គិតជា អំពែ - A)\n• R: រេស៊ីស្តង់ (គិតជា អូម - Ω)',
      en: 'U = R · I  (or I = U / R)\nWhere:\n• U: Voltage / Potential Difference (Volts, V)\n• I: Current (Amperes, A)\n• R: Resistance (Ohms, Ω)'
    },
    hint: {
      km: 'តង់ស្យុងស្មើនឹងរេស៊ីស្តង់គុណអាំងតង់ស៊ីតេ',
      en: 'Voltage equals resistance times current'
    },
    difficulty: 'easy'
  },
  {
    id: 'fc-phys-04',
    subject: 'Physics',
    subjectKm: 'រូបវិទ្យា',
    category: 'Wave & Optics',
    front: {
      km: 'តើរូបមន្តល្បឿនរលក v ទំនាក់ទំនងរវាងជំហានរលក λ និងប្រេកង់ f ស្មើនឹងអ្វី?',
      en: 'What is the wave speed formula relating wavelength λ and frequency f?'
    },
    back: {
      km: 'v = λ · f  (ឬ v = λ / T)\nដែល៖\n• v: ល្បឿនរលក (m/s)\n• λ: ជំហានរលក (m)\n• f: ប្រេកង់ (Hz)\n• T: ខួប (s) ដែល f = 1/T',
      en: 'v = λ · f  (or v = λ / T)\nWhere:\n• v: Wave velocity (m/s)\n• λ: Wavelength (m)\n• f: Frequency (Hz)\n• T: Period (s) where f = 1/T'
    },
    hint: {
      km: 'ល្បឿនស្មើនឹងជំហានរលកគុណនឹងប្រេកង់',
      en: 'Velocity equals wavelength times frequency'
    },
    difficulty: 'easy'
  },

  // =========================================================================
  // 5. CHEMISTRY (គីមីវិទ្យា)
  // =========================================================================
  {
    id: 'fc-chem-01',
    subject: 'Chemistry',
    subjectKm: 'គីមីវិទ្យា',
    category: 'Stoichiometry',
    front: {
      km: 'តើរូបមន្តគណនាចំនួនម៉ូល (n) តាមម៉ាស មាឌឧស្ម័ន និងកំហាប់ស្មើនឹងអ្វី?',
      en: 'What are the formulas to calculate number of moles (n)?'
    },
    back: {
      km: '• តាមម៉ាស៖ n = m / M  (m ជាម៉ាសគិតជា g, M ជាម៉ាសម៉ូល g/mol)\n• តាមកំហាប់សូលុយស្យុង៖ n = C · V  (C គិតជា mol/L, V គិតជា L)\n• តាមមាឌឧស្ម័ន (លក្ខខណ្ឌធម្មតា STP)៖ n = V / 22.4',
      en: '• By mass: n = m / M\n• By solution concentration: n = C · V\n• By gas volume at STP: n = V / 22.4'
    },
    hint: {
      km: 'm លើ M, C គុណ V, V លើ 22.4',
      en: 'm over M, C times V, V over 22.4'
    },
    difficulty: 'easy'
  },
  {
    id: 'fc-chem-02',
    subject: 'Chemistry',
    subjectKm: 'គីមីវិទ្យា',
    category: 'Acids & Bases',
    front: {
      km: 'តើ pH កំណត់ដោយរូបមន្តអ្វី? ហើយកម្រិត pH នៃមជ្ឈដ្ឋានអាស៊ីត បាស និងណឺតស្មើនឹងប៉ុន្មាន?',
      en: 'How is pH defined and what are the pH values for acidic, neutral, and basic media?'
    },
    back: {
      km: '• រូបមន្ត៖ pH = -log[H₃O⁺]\n• មជ្ឈដ្ឋានអាស៊ីត៖ pH < 7 ([H₃O⁺] > 10⁻⁷ M)\n• មជ្ឈដ្ឋានណឺត៖ pH = 7 ([H₃O⁺] = 10⁻⁷ M នៅសីតុណ្ហភាព 25°C)\n• មជ្ឈដ្ឋានបាស៖ pH > 7 ([H₃O⁺] < 10⁻⁷ M)',
      en: '• Formula: pH = -log[H₃O⁺]\n• Acidic: pH < 7\n• Neutral: pH = 7 (at 25°C)\n• Basic / Alkaline: pH > 7'
    },
    hint: {
      km: 'pH = -log[H₃O⁺], ៧ ជាចំណុចណឺត',
      en: 'pH = -log[H3O+], 7 is neutral'
    },
    difficulty: 'easy'
  },

  // =========================================================================
  // 6. BIOLOGY (ជីវវិទ្យា)
  // =========================================================================
  {
    id: 'fc-bio-01',
    subject: 'Biology',
    subjectKm: 'ជីវវិទ្យា',
    category: 'Plant Physiology',
    front: {
      km: 'តើសមីការទូទៅនៃដំណើររស្មីសំយោគ (Photosynthesis) សរសេរយ៉ាងដូចម្តេច?',
      en: 'What is the overall chemical equation for photosynthesis?'
    },
    back: {
      km: '6CO₂ + 6H₂O + ថាមពលពន្លឺ → C₆H₁₂O₆ (គ្លុយកូស) + 6O₂\nដំណើរការនេះកើតឡើងក្នុងក្លរ៉ូប្លាស (Chloroplast) នៃកោសិកាដើមរុក្ខជាតិ។',
      en: '6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ (Glucose) + 6O₂\nOccurs within chloroplasts of photosynthetic plant cells.'
    },
    hint: {
      km: 'ឧស្ម័នកាបូនិច + ទឹក + ពន្លឺ បង្កើតបានគ្លុយកូស និងអុកស៊ីសែន',
      en: 'Carbon dioxide + water + light yields glucose and oxygen'
    },
    difficulty: 'easy'
  },
  {
    id: 'fc-bio-02',
    subject: 'Biology',
    subjectKm: 'ជីវវិទ្យា',
    category: 'Genetics',
    front: {
      km: 'តើម៉ូលេគុល ADN ផ្សំឡើងពីបាសអាសូតចំនួនប៉ុន្មានប្រភេទ? ហើយភ្ជាប់គ្នាតាមគោលការណ៍អ្វី?',
      en: 'How many types of nitrogenous bases make up DNA, and what is the base-pairing rule?'
    },
    back: {
      km: 'មាន ៤ ប្រភេទ៖ Adenine (A), Thymine (T), Cytosine (C), Guanine (G)។\nគោលការណ៍បំពេញបន្ថែម៖\n• A ភ្ជាប់ជាមួយ T ដោយសម្ព័ន្ធអ៊ីដ្រូសែន ២ (A = T)\n• C ភ្ជាប់ជាមួយ G ដោយសម្ព័ន្ធអ៊ីដ្រូសែន ៣ (C ≡ G)',
      en: '4 bases: Adenine (A), Thymine (T), Cytosine (C), Guanine (G).\nComplementary Base Pairing Rule:\n• A pairs with T via 2 hydrogen bonds (A = T)\n• C pairs with G via 3 hydrogen bonds (C ≡ G)'
    },
    hint: {
      km: 'បាស A, T, C, G ភ្ជាប់គ្នាតាមគោលការណ៍បំពេញបន្ថែម',
      en: 'Bases A, T, C, G via complementary pairing'
    },
    difficulty: 'easy'
  },

  // =========================================================================
  // 7. PEDAGOGY & METHODOLOGY (គរុកោសល្យ និងវិធីសាស្ត្របង្រៀន)
  // =========================================================================
  {
    id: 'fc-ped-01',
    subject: 'Pedagogy',
    subjectKm: 'គរុកោសល្យ',
    category: 'Teaching Methodology',
    front: {
      km: 'តើវិធីសាស្ត្របង្រៀនបែបសិស្សមជ្ឈមណ្ឌល (Student-Centered Approach) មានលក្ខណៈសំខាន់អ្វីខ្លះ?',
      en: 'What are the core characteristics of the Student-Centered Teaching Approach?'
    },
    back: {
      km: '• សិស្សជាតួអង្គសកម្មក្នុងការកសាងចំណេះដឹងតាមរយៈការធ្វើ ការពិសោធ ការពិភាក្សា និងដោះស្រាយបញ្ហាជាក់ស្ដែង\n• គ្រូដើរតួជាអ្នកសម្របសម្រួល (Facilitator) និងជាអ្នកណែនាំ\n• លើកកម្ពស់ការត្រិះរិះពិចារណា (Critical Thinking) និងកិច្ចសហការជាក្រុម (Collaboration)',
      en: '• Students actively construct knowledge via discovery, hands-on practice, and problem solving\n• Teacher acts as facilitator and guide\n• Fosters critical thinking, autonomous learning, and teamwork'
    },
    hint: {
      km: 'សិស្សជាតួអង្គសកម្ម គ្រូជាអ្នកសម្របសម្រួល',
      en: 'Students are active learners; teacher is facilitator'
    },
    difficulty: 'easy'
  },
  {
    id: 'fc-ped-02',
    subject: 'Pedagogy',
    subjectKm: 'គរុកោសល្យ',
    category: 'Lesson Planning',
    front: {
      km: 'តើកិច្ចតែងការបង្រៀនតាមលំនាំ ៥ ជំហានរបស់ក្រសួងអប់រំ យុវជន និងកីឡា រួមមានជំហានអ្វីខ្លះ?',
      en: 'What are the 5 standard steps in MoEYS lesson plan methodology?'
    },
    back: {
      km: 'ជំហានទី ១៖ ជំហានរដ្ឋបាលថ្នាក់ (ពិនិត្យអនាម័យ វត្តមាន និងសណ្តាប់ធ្នាប់)\nជំហានទី ២៖ រំលឹកមេរៀនចាស់ (ឬត្រួតពិនិត្យកិច្ចការចាស់)\nជំហានទី ៣៖ មេរៀនថ្មី (ដំណើរការបង្រៀន និងរៀន)\nជំហានទី ៤៖ ពង្រឹងចំណេះដឹង (សង្ខេប សំណួរវាស់ស្ទង់សមត្ថភាព)\nជំហានទី ៥៖ បណ្តាំផ្ញើ ឬកិច្ចការផ្ទះ (ដាក់កិច្ចការស្រាវជ្រាវ និងអនាម័យពេលចេញ)',
      en: 'Step 1: Classroom Management & Attendance\nStep 2: Review of Previous Lesson / Homework\nStep 3: New Lesson Presentation & Activities\nStep 4: Knowledge Consolidation / Assessment\nStep 5: Homework & Follow-up Guidance'
    },
    hint: {
      km: 'រដ្ឋបាល, មេរៀនចាស់, មេរៀនថ្មី, ពង្រឹង, កិច្ចការផ្ទះ',
      en: 'Administration, review, new lesson, consolidation, homework'
    },
    difficulty: 'medium'
  },
  {
    id: 'fc-ped-03',
    subject: 'Pedagogy',
    subjectKm: 'គរុកោសល្យ',
    category: 'Educational Psychology',
    front: {
      km: 'យោងតាមទ្រឹស្តីការលូតលាស់ពុទ្ធិបញ្ញារបស់លោក Jean Piaget តើមានប៉ុន្មានដំណាក់កាល?',
      en: 'According to Jean Piaget\'s cognitive development theory, how many stages are there?'
    },
    back: {
      km: 'មាន ៤ ដំណាក់កាលធំៗ៖\n១. ដំណាក់កាលឥន្ទ្រីយចលករ (Sensorimotor: ០-២ ឆ្នាំ)\n២. ដំណាក់កាលប្រតិបត្តិការមុនហេតុផល (Preoperational: ២-៧ ឆ្នាំ)\n៣. ដំណាក់កាលប្រតិបត្តិការជាក់ស្តែង (Concrete Operational: ៧-១១ ឆ្នាំ)\n៤. ដំណាក់កាលប្រតិបត្តិការផ្លូវការ (Formal Operational: ១១ ឆ្នាំឡើង)',
      en: '4 major stages:\n1. Sensorimotor (0–2 years)\n2. Preoperational (2–7 years)\n3. Concrete Operational (7–11 years)\n4. Formal Operational (11+ years)'
    },
    hint: {
      km: '៤ ដំណាក់កាល៖ ឥន្ទ្រីយចលករ, មុនហេតុផល, ជាក់ស្តែង, ផ្លូវការ',
      en: 'Sensorimotor, Preoperational, Concrete, Formal'
    },
    difficulty: 'medium'
  },

  // =========================================================================
  // 8. HISTORY & GEOGRAPHY (ប្រវត្តិវិទ្យា និងភូមិវិទ្យា)
  // =========================================================================
  {
    id: 'fc-hist-01',
    subject: 'History',
    subjectKm: 'ប្រវត្តិវិទ្យា',
    category: 'Angkor Era',
    front: {
      km: 'តើសម័យអង្គរនៃប្រវត្តិសាស្ត្រខ្មែរចាប់ផ្តើមនៅឆ្នាំណា? ដោយព្រះមហាក្សត្រអង្គណា?',
      en: 'In which year did the Angkor period begin, and under which King?'
    },
    back: {
      km: 'ចាប់ផ្តើមនៅឆ្នាំ ៨០២ នៃ គ.ស. ដោយ ព្រះបាទជ័យវរ្ម័នទី ២ នៅលើភ្នំមហេន្ទ្របព៌ត (ភ្នំគូលែន) តាមរយៈព្រះរាជពិធីទេវរាជ។',
      en: 'Began in 802 AD under King Jayavarman II atop Mount Mahendraparvata (Phnom Kulen) with the Devaraja ritual.'
    },
    hint: {
      km: 'ឆ្នាំ ៨០២ លើភ្នំគូលែន',
      en: 'Year 802 AD on Phnom Kulen'
    },
    difficulty: 'easy'
  },
  {
    id: 'fc-geo-01',
    subject: 'Geography',
    subjectKm: 'ភូមិវិទ្យា',
    category: 'Cambodian Geography',
    front: {
      km: 'តើភ្នំណាដែលខ្ពស់ជាងគេបំផុតនៅក្នុងព្រះរាជាណាចក្រកម្ពុជា? ហើយមានកម្ពស់ប៉ុន្មានម៉ែត្រ?',
      en: 'Which is the highest mountain in Cambodia and what is its altitude?'
    },
    back: {
      km: 'ភ្នំឱរ៉ាល់ (Phnom Aural) មានកម្ពស់ ១៨១៣ ម៉ែត្រ ស្ថិតក្នុងជួរភ្នំក្រវាញ (ខេត្តកំពង់ស្ពឺជាប់ពោធិ៍សាត់)។',
      en: 'Phnom Aural, with an elevation of 1,813 meters, located in the Cardamom Mountain range.'
    },
    hint: {
      km: 'កម្ពស់ ១៨១៣ ម៉ែត្រ ក្នុងខេត្តកំពង់ស្ពឺ',
      en: '1,813 meters in Kampong Speu province'
    },
    difficulty: 'easy'
  },

  // =========================================================================
  // 9. ENGLISH (ភាសាអង់គ្លេស)
  // =========================================================================
  {
    id: 'fc-eng-01',
    subject: 'English',
    subjectKm: 'ភាសាអង់គ្លេស',
    category: 'English Grammar',
    front: {
      km: 'តើកាល Present Perfect Tense មានទម្រង់យ៉ាងដូចម្តេច? ហើយប្រើនៅពេលណា?',
      en: 'What is the structure of the Present Perfect Tense and when is it used?'
    },
    back: {
      km: '• Structure: Subject + have / has + Past Participle (V3)\n• Usage: សកម្មភាពដែលបានកើតឡើងក្នុងអតីតកាល ប៉ុន្តែមានលទ្ធផល ឬឥទ្ធិពលមកដល់បច្ចុប្បន្ន ឬបទពិសោធន៍ជីវិត (e.g., "I have studied English for 5 years.")',
      en: '• Structure: Subject + have / has + Past Participle (V3)\n• Usage: Expresses actions completed at an unspecified past time that connect to the present or life experiences.'
    },
    hint: {
      km: 'have/has + V3',
      en: 'have/has + V3'
    },
    difficulty: 'easy'
  }
];

export const mockStudyTasks: StudyTask[] = [
  {
    id: 'task-01',
    title: {
      km: 'អានសង្ខេប៖ ទ្រឹស្តីចិត្តវិទ្យាអប់រំ Piaget & Vygotsky',
      en: 'Read Summary: Piaget & Vygotsky Learning Theories'
    },
    subject: 'Pedagogy & Psychology',
    subjectKm: 'គរុកោសល្យ និងចិត្តវិទ្យា',
    topic: 'Cognitive Development',
    estimatedMinutes: 25,
    completed: true,
    type: 'read',
    targetAction: 'learning'
  },
  {
    id: 'task-02',
    title: {
      km: 'ធ្វើកម្រងសំណួរអនុវត្ត៖ វិធីសាស្ត្របង្រៀនសកម្ម (១០ សំណួរ)',
      en: 'Practice Quiz: Active Teaching Methodology (10 Qs)'
    },
    subject: 'Pedagogy & Psychology',
    subjectKm: 'គរុកោសល្យ និងចិត្តវិទ្យា',
    topic: 'Instructional Techniques',
    estimatedMinutes: 15,
    completed: false,
    type: 'quiz',
    targetAction: 'quiz'
  },
  {
    id: 'task-03',
    title: {
      km: 'វិញ្ញាសាចាស់៖ វប្បធម៌ទូទៅ កម្រិតឧត្តម ២០២៤ (ផ្នែកទី ១)',
      en: 'Past Paper: General Culture 2024 (Upper Secondary - Section 1)'
    },
    subject: 'General Culture',
    subjectKm: 'វប្បធម៌ទូទៅ',
    topic: 'Cambodian Constitution & History',
    estimatedMinutes: 30,
    completed: false,
    type: 'practice',
    targetAction: 'past-papers'
  },
  {
    id: 'task-04',
    title: {
      km: 'រំលឹកបណ្ណចងចាំ Flashcards (១៥ បណ្ណ)',
      en: 'Review Flashcards: Pedagogical Terms (15 cards)'
    },
    subject: 'Pedagogy',
    subjectKm: 'គរុកោសល្យ',
    topic: 'Key Terminology',
    estimatedMinutes: 10,
    completed: false,
    type: 'read',
    targetAction: 'flashcards'
  }
];

export const mockWeakAreas: WeakArea[] = [
  {
    id: 'weak-01',
    subject: 'Educational Psychology',
    subjectKm: 'ចិត្តវិទ្យាអប់រំ',
    topic: 'Cognitive & Behavioral Developmental Theories',
    topicKm: 'ទ្រឹស្តីនៃការលូតលាស់ផ្នែកបញ្ញា និងអាកប្បកិរិយា',
    accuracyRate: 42,
    priority: 'high',
    failedQuestionsCount: 14,
    recommendation: {
      km: 'សូមអានជំពូកទី ៣ (ទ្រឹស្តី Piaget និង Vygotsky) ឡើងវិញ និងធ្វើកម្រងសំណួរអនុវត្ត ១០ សំណួរដើម្បីពង្រឹងការចងចាំ។',
      en: 'Review Chapter 3 (Piaget & Vygotsky Comparative Framework) and complete 10 targeted practice questions.'
    },
    actionQuizId: 'quiz-psy-01'
  },
  {
    id: 'weak-02',
    subject: 'Education Law & Ethics',
    subjectKm: 'ច្បាប់អប់រំ និងក្រមសីលធម៌វិជ្ជាជីវៈគ្រូ',
    topic: 'Teacher Professional Standards & MoEYS Regulations',
    topicKm: 'ស្តង់ដារវិជ្ជាជីវៈគ្រូបង្រៀន និងបទបញ្ជាផ្ទៃក្នុង',
    accuracyRate: 52,
    priority: 'high',
    failedQuestionsCount: 11,
    recommendation: {
      km: 'ពិនិត្យមាត្រាសំខាន់ៗនៃច្បាប់ស្តីពីការអប់រំឆ្នាំ ២០០៧ និងស្តង់ដារគ្រូបង្រៀនកម្ពុជា។',
      en: 'Review key provisions in the 2007 Education Law and Teacher Professional Code of Conduct.'
    },
    actionQuizId: 'quiz-gen-01'
  },
  {
    id: 'weak-03',
    subject: 'General Culture',
    subjectKm: 'វប្បធម៌ទូទៅ',
    topic: 'ASEAN & Modern Cambodian History (1953-Present)',
    topicKm: 'កិច្ចការអាស៊ាន និងប្រវត្តិសាស្ត្រកម្ពុជាសម័យទំនើប',
    accuracyRate: 64,
    priority: 'medium',
    failedQuestionsCount: 8,
    recommendation: {
      km: 'ទន្ទេញកាលបរិច្ឆេទព្រឹត្តិការណ៍សំខាន់ៗនៃអាស៊ាន និងការចុះបញ្ជីសម្បត្តិបេតិកភណ្ឌពិភពលោក។',
      en: 'Memorize key timeline dates for ASEAN summits, Cambodia membership, and UNESCO heritage sites.'
    },
    actionQuizId: 'quiz-gen-01'
  }
];

export const mockMentors: Mentor[] = [
  {
    id: 'mentor-01',
    name: { km: 'សាស្ត្រាចារ្យ ប៊ុន ថន', en: 'Prof. Bun Thorn' },
    title: { km: 'សាស្ត្រាចារ្យជាន់ខ្ពស់ & អ្នកឯកទេសគរុកោសល្យ', en: 'Senior Lecturer & Pedagogy Specialist' },
    role: { km: 'បណ្តុះបណ្តាលគរុសិស្សជាង ១២ ឆ្នាំ', en: '12+ Years Training Teacher Candidates' },
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    subjects: [
      { km: 'គរុកោសល្យទូទៅ', en: 'General Pedagogy' },
      { km: 'ចិត្តវិទ្យាអប់រំ', en: 'Educational Psychology' },
      { km: 'វិធីសាស្ត្របង្រៀន', en: 'Teaching Methods' }
    ],
    experienceYears: 14,
    rating: 4.95,
    reviewsCount: 184,
    studentsTrained: 1250,
    availability: { km: 'រៀងរាល់ល្ងាច និងចុងសប្តាហ៍ (Online)', en: 'Weekday Evenings & Weekends (Online)' },
    bio: {
      km: 'អតីតគរុសិស្សឆ្នើម និងជាអ្នកនិពន្ធសៀវភៅគន្លឹះត្រៀមប្រឡងគ្រូ។ បានជួយសិស្សជាង ១,២០០ នាក់ឱ្យប្រឡងជាប់ក្របខណ្ឌរដ្ឋដោយជោគជ័យ។',
      en: 'Former top candidate and author of teacher exam prep guides. Has mentored over 1,200 candidates to pass state teacher exams.'
    },
    badges: [
      { km: 'គ្រូបង្វឹកឆ្នើម', en: 'Top Rated' },
      { km: 'មេដាយមាសគរុកោសល្យ', en: 'Pedagogy Gold Medalist' },
      { km: 'ការឆ្លើយតបរហ័ស', en: 'Fast Response' }
    ],
    hourlyRate: 'ឥតគិតថ្លៃ / សហគមន៍',
    socialTelegram: '@bunthorn_passkru'
  },
  {
    id: 'mentor-02',
    name: { km: 'អ្នកគ្រូ ចាន់ សុគន្ធា', en: 'Ms. Chan Sokunthea' },
    title: { km: 'គ្រូឧទ្ទេសជាន់ខ្ពស់រាជធានីភ្នំពេញ & ឯកទេសអក្សរសាស្ត្រខ្មែរ', en: 'Senior Phnom Penh Trainer & Khmer Major Specialist' },
    role: { km: 'ជំនាញវិញ្ញាសាអក្សរសាស្ត្រ និងវប្បធម៌ទូទៅ', en: 'Khmer Literature & General Culture Expert' },
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    subjects: [
      { km: 'អក្សរសាស្ត្រខ្មែរ', en: 'Khmer Literature' },
      { km: 'វប្បធម៌ទូទៅ', en: 'General Culture' },
      { km: 'តែងសេចក្តីគរុកោសល្យ', en: 'Pedagogical Essay' }
    ],
    experienceYears: 9,
    rating: 4.88,
    reviewsCount: 132,
    studentsTrained: 890,
    availability: { km: 'ចុងសប្តាហ៍ (សៅរ៍-អាទិត្យ)', en: 'Weekends (Sat-Sun)' },
    bio: {
      km: 'ជំនាញបង្រៀនក្បួនតែងសេចក្តី វិភាគអក្សរសិល្ប៍ និងគន្លឹះដោះស្រាយវិញ្ញាសាវប្បធម៌ទូទៅឱ្យចំគោលដៅពិន្ទុខ្ពស់។',
      en: 'Specializes in essay composition formulas, literature analysis, and high-scoring strategies for general culture exams.'
    },
    badges: [
      { km: 'ឯកទេសតែងសេចក្តី', en: 'Essay Expert' },
      { km: 'គ្រូឧទ្ទេសឆ្នើម', en: 'Master Trainer' }
    ],
    hourlyRate: 'ឥតគិតថ្លៃ / ក្រុមពិភាក្សា',
    socialTelegram: '@sokunthea_kru'
  },
  {
    id: 'mentor-03',
    name: { km: 'លោកគ្រូ កែវ វិបុល', en: 'Mr. Keo Vibul' },
    title: { km: 'គ្រូឧទ្ទេសគណិតវិទ្យា និងវិទ្យាសាស្ត្រ', en: 'STEM & Mathematics Trainer' },
    role: { km: 'ជំនាញវិញ្ញាសាគណិត និងរូបវិទ្យា', en: 'Mathematics & Science Exam Trainer' },
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    subjects: [
      { km: 'គណិតវិទ្យា', en: 'Mathematics' },
      { km: 'រូបវិទ្យា', en: 'Physics' },
      { km: 'លំហាត់តក្កវិទ្យា', en: 'Logic Tests' }
    ],
    experienceYears: 11,
    rating: 4.92,
    reviewsCount: 145,
    studentsTrained: 960,
    availability: { km: 'ច័ន្ទ-ពុធ-សុក្រ ម៉ោង ៧-៩ យប់', en: 'Mon-Wed-Fri 7-9 PM' },
    bio: {
      km: 'ជួយសម្រួលរូបមន្ត និងវិធីសាស្ត្រគណនាផ្លូវកាត់សម្រាប់វិញ្ញាសា MCQ និងសំណួរសរសេរគណិតវិទ្យា។',
      en: 'Provides shortcut solving methods and step-by-step clarity for math and science state exam papers.'
    },
    badges: [
      { km: 'STEM Master', en: 'STEM Master' },
      { km: 'ការគណនារហ័ស', en: 'Speed Solver' }
    ],
    hourlyRate: 'ឥតគិតថ្លៃ / ការពិគ្រោះយោបល់',
    socialTelegram: '@vibul_math'
  }
];

export const mockNotifications: AppNotification[] = [
  {
    id: 'notif-01',
    title: {
      km: 'សេចក្តីប្រកាសប្រឡងគ្រូ ២០២៦ ចេញជាផ្លូវការហើយ!',
      en: 'Official 2026 National Teacher Exam Announcement Released!'
    },
    message: {
      km: 'ក្រសួងអប់រំបានប្រកាសជ្រើសរើស ២,១៥០ កន្លែង។ សូមពិនិត្យកាលវិភាគ និងលក្ខខណ្ឌដាក់ពាក្យ។',
      en: 'MoEYS officially released 2,150 quota seats. Check application dates and eligibility now.'
    },
    category: 'announcement',
    timestamp: '២ ម៉ោងមុន',
    isRead: false,
    actionUrl: 'exam-info'
  },
  {
    id: 'notif-02',
    title: {
      km: 'រំលឹកកិច្ចការសិក្សាថ្ងៃនេះ៖ វិធីសាស្ត្របង្រៀនសកម្ម',
      en: "Today's Study Plan Reminder: Active Teaching Methods"
    },
    message: {
      km: 'អ្នកមាន ២ កិច្ចការដែលមិនទាន់បានបញ្ចប់ក្នុងកាលវិភាគថ្ងៃនេះ។ សូមបន្តការខិតខំ!',
      en: 'You have 2 pending tasks in your daily plan. Keep up your 12-day streak!'
    },
    category: 'reminder',
    timestamp: '៥ ម៉ោងមុន',
    isRead: false,
    actionUrl: 'study-plan'
  },
  {
    id: 'notif-03',
    title: {
      km: 'លទ្ធផល Mock Exam របស់អ្នកបានរួចរាល់',
      en: 'Your Mock Exam Diagnostic Report is Ready'
    },
    message: {
      km: 'អ្នកទទួលបាន ៤២/៥០ ពិន្ទុ (៨៤%) លើវិញ្ញាសាវប្បធម៌ទូទៅ។ ចំណុចខ្សោយ៖ ចិត្តវិទ្យាអប់រំ។',
      en: 'You scored 42/50 (84%) on General Culture. Recommended focus: Educational Psychology.'
    },
    category: 'result',
    timestamp: 'ម្សិលមិញ',
    isRead: true,
    actionUrl: 'progress'
  }
];
