import { Announcement, Question, Quiz, MockExam, PastPaper, Flashcard, StudyTask, WeakArea, Mentor, AppNotification } from '../types';

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-2026-01',
    title: {
      km: 'សេចក្តីជូនដំណឹងស្តីពីការប្រឡងជ្រើសរើសគ្រូបង្រៀនក្របខណ្ឌរដ្ឋ ឆ្នាំ២០២៦ (NIE, RTTC, PTTC)',
      en: 'Official Announcement on National Teacher Recruitment Examination 2026 (NIE, RTTC, PTTC)'
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
- គ្រូមធ្យមសិក្សាទុតិយភូមិ (NIE): ៦៥០ នាក់
- គ្រូមធ្យមសិក្សាបឋមភូមិ (RTTC): ៧៥០ នាក់
- គ្រូបឋមសិក្សា (PTTC): ៥៥០ នាក់
- គ្រូមត្តេយ្យសិក្សា: ២០០ នាក់

២. កាលបរិច្ឆេទដាក់ពាក្យ៖ ចាប់ពីថ្ងៃទី ០១ ខែកញ្ញា ដល់ថ្ងៃទី ៣០ ខែកញ្ញា ឆ្នាំ២០២៦
៣. កាលបរិច្ឆេទប្រឡងជាក់ស្តែង៖ ថ្ងៃទី ២៥ និង ២៦ ខែតុលា ឆ្នាំ២០២៦
៤. ទីកន្លែងទទួលពាក្យ៖ មន្ទីរអប់រំ យុវជន និងកីឡា រាជធានី-ខេត្តសាមី ឬតាមប្រព័ន្ធអនឡាញផ្លូវការ។`,
      en: `The Ministry of Education, Youth and Sport (MoEYS) officially announces the competitive examination for teacher candidates for 2026-2027.

1. Total positions: 2,150 seats
- NIE Upper Secondary Teachers: 650
- RTTC Lower Secondary Teachers: 750
- PTTC Primary Teachers: 550
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
      km: 'កាលវិភាគ និងវិញ្ញាសាកំណត់សម្រាប់ការប្រឡងចូលវិទ្យាស្ថានជាតិអប់រំ (NIE) ឆ្នាំ២០២៦',
      en: 'Exam Schedule & Prescribed Subjects for National Institute of Education (NIE) 2026'
    },
    category: 'schedule',
    date: '2026-08-10',
    isUrgent: false,
    summary: {
      km: 'សេចក្តីលម្អិតអំពីវិញ្ញាសាវប្បធម៌ទូទៅ (MCQ & សរសេរ) និងវិញ្ញាសាឯកទេសតាមជំនាញនីមួយៗ។',
      en: 'Detailed structure for General Culture, Pedagogy, and Specialized Subject Papers for NIE entrance.'
    },
    content: {
      km: `វិទ្យាស្ថានជាតិអប់រំ (NIE) សូមជូនដំណឹងអំពីកាលវិភាគ និងទម្រង់វិញ្ញាសាដូចខាងក្រោម៖
- ព្រឹក ថ្ងៃទី១៖ វិញ្ញាសាវប្បធម៌ទូទៅ និងចំណេះដឹងគរុកោសល្យ (រយៈពេល ២ម៉ោង)
- រសៀល ថ្ងៃទី១៖ វិញ្ញាសាភាសាបរទេស (អង់គ្លេស ឬ បារាំង - រយៈពេល ១ម៉ោង ៣០នាទី)
- ព្រឹក ថ្ងៃទី២៖ វិញ្ញាសាឯកទេសទី១ តាមមុខវិជ្ជាជ្រើសរើស (រយៈពេល ៣ម៉ោង)
- រសៀល ថ្ងៃទី២៖ វិញ្ញាសាឯកទេសទី២ ឬ សម្ភាសន៍គរុកោសល្យផ្ទាល់មាត់។`,
      en: `National Institute of Education schedule breakdown:
- Day 1 AM: General Culture & Pedagogy (2 Hours)
- Day 1 PM: Foreign Language (1.5 Hours)
- Day 2 AM: Major Specialization 1 (3 Hours)
- Day 2 PM: Major Specialization 2 / Oral Pedagogical Interview.`
    },
    targetExam: ['nie'],
    attachedPdfs: [
      { name: 'NIE_Subjects_and_Curriculum_Standard_2026.pdf', size: '3.8 MB', pages: 14 }
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
    subject: 'Pedagogy & Psychology',
    subjectKm: 'គរុកោសល្យ និងចិត្តវិទ្យា',
    topic: 'Constructivist Learning & Piaget',
    topicKm: 'ទ្រឹស្តីស្ថាបនានិយម និង Piaget',
    year: 2025,
    difficulty: 'medium',
    question: {
      km: 'យោងតាមទ្រឹស្តីនៃការលូតលាស់ផ្នែកបញ្ញារបស់ Jean Piaget តើដំណាក់កាលណាដែលកុមារចាប់ផ្តើមមានសមត្ថភាពគិតបែបអរូបី និងការសន្និដ្ឋានបែបតក្កវិជ្ជាវិទ្យាសាស្ត្រ?',
      en: 'According to Jean Piaget\'s theory of cognitive development, in which stage do learners develop the ability to think abstractly and use systematic hypothetical-deductive reasoning?'
    },
    options: [
      { id: 'a', text: { km: 'ដំណាក់កាលញាណ-ចលកា (Sensorimotor Stage)', en: 'Sensorimotor Stage (0-2 years)' } },
      { id: 'b', text: { km: 'ដំណាក់កាលប្រតិបត្តិការជាក់ស្តែង (Concrete Operational Stage)', en: 'Concrete Operational Stage (7-11 years)' } },
      { id: 'c', text: { km: 'ដំណាក់កាលប្រតិបត្តិការផ្លូវការ (Formal Operational Stage)', en: 'Formal Operational Stage (11+ years)' } },
      { id: 'd', text: { km: 'ដំណាក់កាលមុនប្រតិបត្តិការ (Preoperational Stage)', en: 'Preoperational Stage (2-7 years)' } }
    ],
    correctAnswerId: 'c',
    explanation: {
      km: 'ដំណាក់កាលប្រតិបត្តិការផ្លូវការ (Formal Operational Stage - ចាប់ពីអាយុ ១១-១២ ឆ្នាំឡើងទៅ) គឺជាដំណាក់កាលដែលសិស្សអាចគិតបែបអរូបី ពិចារណាលើទ្រឹស្តី សម្មតិកម្ម និងហេតុផលតក្កវិជ្ជាបានដោយមិនចាំបាច់មានវត្ថុជាក់ស្តែងនៅចំពោះមុខឡើយ។',
      en: 'The Formal Operational Stage (11+ years) is characterized by abstract reasoning, hypothetical thinking, and systematic problem solving.'
    },
    reference: 'សៀវភៅចិត្តវិទ្យាអប់រំ - ក្រសួងអប់រំ យុវជន និងកីឡា ទំព័រ ៤៨'
  },
  {
    id: 'q-ped-02',
    subject: 'Pedagogy & Psychology',
    subjectKm: 'គរុកោសល្យ និងចិត្តវិទ្យា',
    topic: 'Student-Centered Learning',
    topicKm: 'វិធីសាស្ត្របង្រៀនផ្តោតលើសិស្សជាមជ្ឈមណ្ឌល',
    year: 2024,
    difficulty: 'easy',
    question: {
      km: 'តើគោលការណ៍គ្រឹះសំខាន់បំផុតនៃ "វិធីសាស្ត្របង្រៀនបែបសកម្ម និងផ្តោតលើសិស្សជាមជ្ឈមណ្ឌល (Student-Centered Learning)" គឺជាអ្វី?',
      en: 'What is the core principle of active, student-centered teaching methodology?'
    },
    options: [
      { id: 'a', text: { km: 'គ្រូជាអ្នកបញ្ជូនចំណេះដឹងទាំងស្រុង ហើយសិស្សគ្រាន់តែស្តាប់ និងកត់ត្រា', en: 'Teacher is the sole source of information; students passively listen and take notes' } },
      { id: 'b', text: { km: 'សិស្សចូលរួមយ៉ាងសកម្មក្នុងការស្រាវជ្រាវ ពិភាក្សា និងកសាងចំណេះដឹងដោយខ្លួនឯង ដោយមានគ្រូជាអ្នកសម្របសម្រួល', en: 'Students actively participate, explore, discuss, and construct knowledge with teacher as facilitator' } },
      { id: 'c', text: { km: 'ផ្តោតលើការទន្ទេញចាំឱ្យបានច្រើនដើម្បីឆ្លើយសំណួរប្រឡង', en: 'Focus exclusively on rote memorization for high test scores' } },
      { id: 'd', text: { km: 'គ្រូកំណត់សកម្មភាពទាំងអស់ដោយគ្មានការពិគ្រោះយោបល់ជាមួយសិស្ស', en: 'Teacher dictates all classroom activities without student collaboration' } }
    ],
    correctAnswerId: 'b',
    explanation: {
      km: 'វិធីសាស្ត្រផ្តោតលើសិស្សជាមជ្ឈមណ្ឌល ផ្តល់តម្លៃលើការចូលរួមយ៉ាងសកម្មរបស់សិស្សក្នុងការរៀន ការត្រិះរិះពិចារណា និងការអនុវត្តជាក់ស្តែង ដោយគ្រូដើរតួជាអ្នកសម្របសម្រួល (Facilitator) និងជាអ្នកណែនាំ។',
      en: 'Student-centered learning emphasizes learner autonomy, active investigation, and constructive engagement with the educator acting as a facilitator.'
    },
    reference: 'វិធីសាស្ត្របង្រៀនគរុកោសល្យទូទៅ NIE - ជំពូកទី ៣'
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

export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-ped-01',
    title: {
      km: 'កម្រងសំណួរគរុកោសល្យ និងវិធីសាស្ត្របង្រៀនសកម្ម',
      en: 'Pedagogy & Active Teaching Methods Quiz'
    },
    subject: 'Pedagogy & Psychology',
    subjectKm: 'គរុកោសល្យ និងចិត្តវិទ្យា',
    topic: 'Student-Centered Teaching & Evaluation',
    topicKm: 'ការបង្រៀនផ្តោតលើសិស្ស និងការវាយតម្លៃ',
    targetExam: ['nie', 'rttc', 'pttc'],
    questionsCount: 5,
    durationMinutes: 10,
    difficulty: 'medium',
    questions: mockQuestions
  },
  {
    id: 'quiz-gen-01',
    title: {
      km: 'កម្រងសំណួរវប្បធម៌ទូទៅ និងច្បាប់អប់រំកម្ពុជា',
      en: 'Cambodian General Culture & Education Law Quiz'
    },
    subject: 'General Culture',
    subjectKm: 'វប្បធម៌ទូទៅ',
    topic: 'National Heritage & Educational Framework',
    topicKm: 'បេតិកភណ្ឌជាតិ និងក្របខណ្ឌអប់រំ',
    targetExam: ['nie', 'rttc', 'pttc', 'kindergarten'],
    questionsCount: 5,
    durationMinutes: 10,
    difficulty: 'easy',
    questions: mockQuestions
  },
  {
    id: 'quiz-psy-01',
    title: {
      km: 'កម្រងសំណួរចិត្តវិទ្យាអភិវឌ្ឍន៍កុមារ និងការគ្រប់គ្រងថ្នាក់រៀន',
      en: 'Child Developmental Psychology & Classroom Management'
    },
    subject: 'Pedagogy & Psychology',
    subjectKm: 'គរុកោសល្យ និងចិត្តវិទ្យា',
    topic: 'Developmental Milestones & Behavior',
    topicKm: 'ដំណាក់កាលលូតលាស់ និងការដោះស្រាយអាកប្បកិរិយា',
    targetExam: ['pttc', 'kindergarten', 'rttc'],
    questionsCount: 5,
    durationMinutes: 12,
    difficulty: 'hard',
    questions: mockQuestions
  }
];

export const mockExams: MockExam[] = [
  {
    id: 'mock-nie-2026-01',
    title: {
      km: 'វិញ្ញាសាប្រឡងសាកល្បង NIE វប្បធម៌ទូទៅ និងគរុកោសល្យ (កម្រិតពេញលេញ)',
      en: 'NIE Full Simulation: General Culture & Pedagogical Aptitude'
    },
    description: {
      km: 'វិញ្ញាសាពេញលេញស្តង់ដារវិទ្យាស្ថានជាតិអប់រំ (NIE) សម្រាប់បេក្ខជនគ្រូមធ្យមទុតិយភូមិ (១២+២ / បរិញ្ញាបត្រ+១)។',
      en: 'Standard full-length simulation for Upper Secondary Teacher candidates at National Institute of Education.'
    },
    targetExam: 'nie',
    subject: 'General Culture & Pedagogy',
    subjectKm: 'វប្បធម៌ទូទៅ និងគរុកោសល្យ',
    year: 2026,
    durationMinutes: 45,
    totalMarks: 50,
    passingMarks: 25,
    instructions: {
      km: [
        'វិញ្ញាសានេះមានរយៈពេលកំណត់ ៤៥ នាទី។',
        'សូមជ្រើសរើសចម្លើយត្រឹមត្រូវបំផុតតែមួយគត់សម្រាប់សំណួរនីមួយៗ។',
        'អ្នកអាចដាក់ចំណាំ (Mark for Review) លើសំណួរដែលមិនទាន់ច្បាស់ ដើម្បីត្រឡប់មកពិនិត្យវិញ។',
        'នៅពេលអស់ម៉ោង ប្រព័ន្ធនឹងប្រគល់វិញ្ញាសាដោយស្វ័យប្រវត្តិ។',
        'ពិន្ទុជាប់កម្រិតស្តង់ដារគឺ ២៥/៥០ ពិន្ទុ (៥០%)។'
      ],
      en: [
        'Time limit is 45 minutes.',
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
        subject: 'Pedagogy & Psychology',
        subjectKm: 'គរុកោសល្យ និងចិត្តវិទ្យា',
        topic: 'Formative Assessment',
        topicKm: 'ការវាយតម្លៃអភិវឌ្ឍ (Formative Assessment)',
        difficulty: 'medium',
        question: {
          km: 'តើអ្វីជាគោលបំណងចម្បងនៃ "ការវាយតម្លៃអភិវឌ្ឍ (Formative Assessment)" នៅក្នុងថ្នាក់រៀន?',
          en: 'What is the primary purpose of formative assessment in the instructional process?'
        },
        options: [
          { id: 'a', text: { km: 'ដើម្បីផ្តល់ចំណាត់ថ្នាក់ចុងឆ្នាំដល់សិស្ស', en: 'To assign final end-of-year ranks and grades' } },
          { id: 'b', text: { km: 'ដើម្បីតាមដានដំណើរការរៀន និងកែលម្អវិធីសាស្ត្របង្រៀនក្នុងពេលកំពុងបង្រៀន', en: 'To monitor ongoing learning and adjust teaching strategies during instruction' } },
          { id: 'c', text: { km: 'ដើម្បីដាក់ទណ្ឌកម្មសិស្សដែលខ្សោយ', en: 'To penalize underperforming students' } },
          { id: 'd', text: { km: 'ដើម្បីប្រៀបធៀបសាលារៀនមួយជាមួយសាលារៀនមួយទៀត', en: 'To rank institutional performance across schools' } }
        ],
        correctAnswerId: 'b',
        explanation: {
          km: 'ការវាយតម្លៃអភិវឌ្ឍ (Formative Assessment) ធ្វើឡើងជាប្រចាំអំឡុងពេលបង្រៀន ដើម្បីដឹងពីការយល់ដឹងរបស់សិស្ស និងកែសម្រួលសកម្មភាពរៀនភ្លាមៗ មិនមែនដើម្បីដាក់ពិន្ទុសម្រេចចុងក្រោយឡើយ។',
          en: 'Formative assessment is conducted during the learning process to check student understanding, provide timely feedback, and adapt instructional approaches.'
        }
      }
    ]
  },
  {
    id: 'mock-rttc-2026-01',
    title: {
      km: 'វិញ្ញាសាប្រឡងសាកល្បង RTTC គរុកោសល្យមធ្យមបឋមភូមិ',
      en: 'RTTC Simulation: Lower Secondary Pedagogy & General Knowledge'
    },
    description: {
      km: 'វិញ្ញាសាគំរូសម្រាប់បេក្ខជនគ្រូមធ្យមបឋមភូមិ (១២+២) នៅតាមបណ្តាមជ្ឈមណ្ឌលគរុកោសល្យភូមិភាគ។',
      en: 'Comprehensive mock examination for Regional Teacher Training Center (RTTC) candidates.'
    },
    targetExam: 'rttc',
    subject: 'Pedagogy & Lower Secondary Methods',
    subjectKm: 'គរុកោសល្យ និងវិធីសាស្ត្របង្រៀនអនុវិទ្យាល័យ',
    year: 2026,
    durationMinutes: 40,
    totalMarks: 50,
    passingMarks: 25,
    instructions: {
      km: [
        'វិញ្ញាសានេះមានរយៈពេលកំណត់ ៤០ នាទី។',
        'សូមជ្រើសរើសចម្លើយត្រឹមត្រូវបំផុតតែមួយគត់សម្រាប់សំណួរនីមួយៗ។',
        'ពិន្ទុជាប់កម្រិតស្តង់ដារគឺ ២៥/៥០ ពិន្ទុ (៥០%)។'
      ],
      en: [
        'Time limit is 40 minutes.',
        'Select the single best answer for each question.',
        'Passing qualifying threshold is 25/50 marks (50%).'
      ]
    },
    questions: mockQuestions
  }
];

export const mockPastPapers: PastPaper[] = [
  {
    id: 'pp-2025-nie-cult',
    title: {
      km: 'វិញ្ញាសាវប្បធម៌ទូទៅ និងគរុកោសល្យ NIE ឆ្នាំ២០២៥ (មានចម្លើយពន្យល់)',
      en: 'NIE General Culture & Pedagogy Exam Paper 2025 (With Detailed Solutions)'
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
      km: 'វិញ្ញាសាឯកទេសគណិតវិទ្យា ជ្រើសរើសគ្រូមធ្យមទុតិយភូមិ NIE ឆ្នាំ២០២៤',
      en: 'NIE Mathematics Major Specialization Exam Paper 2024'
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
      km: 'វិញ្ញាសាអក្សរសាស្ត្រខ្មែរ និងវិធីសាស្ត្របង្រៀន RTTC ឆ្នាំ២០២៤',
      en: 'RTTC Khmer Literature & Teaching Methodology Paper 2024'
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
      km: 'វិញ្ញាសាចិត្តវិទ្យា និងគរុកោសល្យបឋមសិក្សា PTTC ឆ្នាំ២០២៣',
      en: 'PTTC Primary Pedagogy & Child Psychology Paper 2023'
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
  {
    id: 'fc-01',
    subject: 'Educational Psychology',
    subjectKm: 'ចិត្តវិទ្យាអប់រំ',
    category: 'Theorists',
    front: {
      km: 'តំបន់អភិវឌ្ឍន៍ប្រហាក់ប្រហែល (Zone of Proximal Development - ZPD) ជាទ្រឹស្តីរបស់អ្នកប្រាជ្ញរូបណា?',
      en: 'Who formulated the concept of "Zone of Proximal Development (ZPD)"?'
    },
    back: {
      km: 'Lev Vygotsky (ឡេវ វីហ្កតស្គី) — សំដៅលើគម្លាតរវាងអ្វីដែលកុមារអាចធ្វើបានដោយឯករាជ្យ និងអ្វីដែលកុមារអាចធ្វើបានដោយមានការណែនាំពីមនុស្សចាស់ ឬមិត្តភក្តិដែលពូកែជាង (Scaffolding)។',
      en: 'Lev Vygotsky — It defines the distance between actual developmental level determined by independent problem solving and the level of potential development under adult guidance.'
    },
    hint: {
      km: 'ទ្រឹស្តីស្ថាបនានិយមសង្គម (Social Constructivism)',
      en: 'Social Constructivism theorist from Russia'
    },
    difficulty: 'medium'
  },
  {
    id: 'fc-02',
    subject: 'Pedagogy',
    subjectKm: 'គរុកោសល្យ',
    category: 'Bloom\'s Taxonomy',
    front: {
      km: 'រៀបរាប់កម្រិតទាំង ៦ នៃចំណាត់ថ្នាក់ Bloom\'s Taxonomy កែសម្រួលថ្មី (ពីទាបទៅខ្ពស់)',
      en: 'Name the 6 cognitive levels of Revised Bloom\'s Taxonomy in order (lowest to highest)'
    },
    back: {
      km: '១. ចងចាំ (Remembering) \n២. យល់ដឹង (Understanding) \n៣. អនុវត្ត (Applying) \n៤. វិភាគ (Analyzing) \n៥. វាយតម្លៃ (Evaluating) \n៦. បង្កើតថ្មី/ច្នៃប្រឌិត (Creating)',
      en: '1. Remember \n2. Understand \n3. Apply \n4. Analyze \n5. Evaluate \n6. Create'
    },
    hint: {
      km: 'ចាប់ផ្តើមពីការចងចាំរហូតដល់ការបង្កើតថ្មី',
      en: 'From basic recall to highest cognitive synthesis'
    },
    difficulty: 'hard'
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
      km: 'វិញ្ញាសាចាស់៖ វប្បធម៌ទូទៅ NIE ២០២៤ (ផ្នែកទី ១)',
      en: 'Past Paper: NIE General Culture 2024 (Section 1)'
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
    title: { km: 'សាស្ត្រាចារ្យជាន់ខ្ពស់ NIE & អ្នកឯកទេសគរុកោសល្យ', en: 'Senior NIE Lecturer & Pedagogy Specialist' },
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
      km: 'អតីតនិស្សិតឆ្នើម NIE និងជាអ្នកនិពន្ធសៀវភៅគន្លឹះត្រៀមប្រឡងគ្រូ។ បានជួយសិស្សជាង ១,២០០ នាក់ឱ្យប្រឡងជាប់ក្របខណ្ឌរដ្ឋដោយជោគជ័យ។',
      en: 'Former top NIE graduate and author of teacher exam prep guides. Has mentored over 1,200 candidates to pass state teacher exams.'
    },
    badges: [
      { km: 'គ្រូបង្វឹកឆ្នើម', en: 'Top Rated' },
      { km: 'NIE Gold Medalist', en: 'NIE Gold Medalist' },
      { km: 'ការឆ្លើយតបរហ័ស', en: 'Fast Response' }
    ],
    hourlyRate: 'ឥតគិតថ្លៃ / សហគមន៍',
    socialTelegram: '@bunthorn_passkru'
  },
  {
    id: 'mentor-02',
    name: { km: 'អ្នកគ្រូ ចាន់ សុគន្ធា', en: 'Ms. Chan Sokunthea' },
    title: { km: 'គ្រូឧទ្ទេស RTTC រាជធានីភ្នំពេញ & ឯកទេសអក្សរសាស្ត្រខ្មែរ', en: 'RTTC Phnom Penh Trainer & Khmer Major Specialist' },
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
      { km: 'RTTC Master', en: 'RTTC Master' }
    ],
    hourlyRate: 'ឥតគិតថ្លៃ / ក្រុមពិភាក្សា',
    socialTelegram: '@sokunthea_kru'
  },
  {
    id: 'mentor-03',
    name: { km: 'លោកគ្រូ កែវ វិបុល', en: 'Mr. Keo Vibul' },
    title: { km: 'គ្រូឧទ្ទេសគណិតវិទ្យា និងវិទ្យាសាស្ត្រ NIE/PTTC', en: 'NIE/PTTC STEM & Mathematics Trainer' },
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
