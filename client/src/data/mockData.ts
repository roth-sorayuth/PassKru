import { Announcement, Question, Quiz, MockExam, PastPaper, Flashcard, StudyTask, WeakArea, Mentor, AppNotification } from '../types';
import { englishQuizzes } from './englishQuizData';

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

export const mockQuizzes: Quiz[] = [
  ...englishQuizzes,
  {
    id: 'quiz-ped-01',
    title: {
      km: 'កម្រងសំណួរវប្បធម៌ទូទៅ និងចំណេះដឹងជាតិ',
      en: 'Cambodian General Culture & National Knowledge Quiz'
    },
    subject: 'General Culture',
    subjectKm: 'វប្បធម៌ទូទៅ',
    topic: 'Cambodian Heritage, Constitution & Society',
    topicKm: 'បេតិកភណ្ឌ រដ្ឋធម្មនុញ្ញ និងសង្គមកម្ពុជា',
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
      km: 'កម្រងសំណួរវប្បធម៌ទូទៅ និងសមាហរណកម្មអាស៊ាន',
      en: 'General Culture & ASEAN Integration Quiz'
    },
    subject: 'General Culture',
    subjectKm: 'វប្បធម៌ទូទៅ',
    topic: 'National Landmarks & Regional Affairs',
    topicKm: 'បេតិកភណ្ឌជាតិ និងកិច្ចការអាស៊ាន',
    targetExam: ['pttc', 'kindergarten', 'rttc'],
    questionsCount: 5,
    durationMinutes: 12,
    difficulty: 'hard',
    questions: mockQuestions
  }
];

export const mockQuestionsRound2: Question[] = [
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
      { id: 'b', text: { km: 'រដ្ឋធានាការអប់រំកម្រិតឧត្តមសិក្សាដោយឥតបង់ថ្លៃសម្រាប់គ្រប់សិស្ស', en: 'State guarantees free higher education for all students' } },
      { id: 'c', text: { km: 'រដ្ឋកំណត់កាតព្វកិច្ចឱ្យកុមាររៀនត្រឹមថ្នាក់ទី ៦ (៦ឆ្នាំ) ប៉ុណ្ណោះ', en: 'State mandates only 6 years of primary schooling' } },
      { id: 'd', text: { km: 'រដ្ឋផ្តល់អាហារូបករណ៍ ១០០% សម្រាប់តែកម្រិតមធ្យមសិក្សាទុតិយភូមិ', en: 'State only provides 100% scholarships at upper secondary level' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'មាត្រា ៦៨ នៃរដ្ឋធម្មនុញ្ញ ចែងច្បាស់ថា «រដ្ឋធានាផ្តល់ការអប់រំជាមូលដ្ឋានរយៈពេល ៩ឆ្នាំ ដោយឥតបង់ថ្លៃនៅក្នុងសាលាសាធារណៈ» (ថ្នាក់ទី ១ ដល់ទី ៩)។',
      en: 'Article 68 explicitly decrees: "The State shall provide free primary and secondary education to all citizens in public schools. Citizens shall receive education for at least nine years."'
    },
    reference: 'រដ្ឋធម្មនុញ្ញនៃព្រះរាជាណាចក្រកម្ពុជា (មាត្រា ៦៨)'
  },
  {
    id: 'q-r2-03',
    subject: 'General Culture & Applied Knowledge',
    subjectKm: 'វប្បធម៌ទូទៅ និងចំណេះដឹងអនុវត្ត',
    topic: 'Classroom Action Research Cycle',
    topicKm: 'វដ្តស្រាវជ្រាវប្រតិបត្តិក្នុងថ្នាក់រៀន (Action Research)',
    year: 2026,
    difficulty: 'hard',
    question: {
      km: 'នៅក្នុងការអនុវត្តការស្រាវជ្រាវប្រតិបត្តិក្នុងថ្នាក់រៀន (Action Research) ដើម្បីកែលម្អការបង្រៀន តើជំហានវិលជុំជាប្រព័ន្ធ (Action Research Spiral Cycle) របស់ Kemmis & McTaggart ត្រូវអនុវត្តតាមលំដាប់លំដោយត្រឹមត្រូវណា?',
      en: 'In implementing Classroom Action Research to improve instructional practices, what is the correct sequence of the Kemmis & McTaggart Action Research Spiral Cycle?'
    },
    options: [
      { id: 'a', text: { km: 'រៀបចំផែនការ (Plan) ➔ អនុវត្តសកម្មភាព (Act) ➔ សង្កេតតាមដាន (Observe) ➔ ឆ្លុះបញ្ចាំងពិចារណា (Reflect)', en: 'Plan ➔ Act ➔ Observe ➔ Reflect' } },
      { id: 'b', text: { km: 'សង្កេត (Observe) ➔ ឆ្លុះបញ្ចាំង (Reflect) ➔ រៀបចំផែនការ (Plan) ➔ វាយតម្លៃពិន្ទុ (Score)', en: 'Observe ➔ Reflect ➔ Plan ➔ Score' } },
      { id: 'c', text: { km: 'អនុវត្តសកម្មភាព (Act) ➔ រៀបចំផែនការ (Plan) ➔ សង្កេត (Observe) ➔ សន្និដ្ឋាន (Conclude)', en: 'Act ➔ Plan ➔ Observe ➔ Conclude' } },
      { id: 'd', text: { km: 'ធ្វើតេស្តសិស្ស (Test) ➔ កត់ត្រា (Record) ➔ ដាក់ពិន័យ (Penalize) ➔ រៀបចំឡើងវិញ (Reset)', en: 'Test ➔ Record ➔ Penalize ➔ Reset' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'វដ្តស្រាវជ្រាវប្រតិបត្តិ (Action Research Spiral) របស់ Kemmis & McTaggart រួមមាន ៤ ដំណាក់កាលបន្តបន្ទាប់គ្នា៖ Plan (រៀបចំផែនការ) ➔ Act (អនុវត្ត) ➔ Observe (សង្កេតប្រមូលភស្តុតាង) ➔ Reflect (ឆ្លុះបញ្ចាំងវាយតម្លៃ ដើម្បីបន្តវដ្តថ្មី)។',
      en: 'The Kemmis & McTaggart action research spiral comprises four continuous iterative phases: Plan ➔ Act ➔ Observe ➔ Reflect.'
    },
    reference: 'សៀវភៅណែនាំស្តីពីការស្រាវជ្រាវប្រតិបត្តិក្នុងថ្នាក់រៀន ក្រសួងអប់រំ យុវជន និងកីឡា'
  },
  {
    id: 'q-r2-04',
    subject: 'General Culture & Policy',
    subjectKm: 'វប្បធម៌ទូទៅ និងគោលនយោបាយ',
    topic: 'Cambodia National Qualifications Framework (CNQF)',
    topicKm: 'ក្របខណ្ឌគុណវុឌ្ឍិជាតិកម្ពុជា (CNQF)',
    year: 2026,
    difficulty: 'hard',
    question: {
      km: 'នៅក្នុងក្របខណ្ឌគុណវុឌ្ឍិជាតិកម្ពុជា (CNQF) ដែលផ្សារភ្ជាប់ជាមួយក្របខណ្ឌយោងគុណវុឌ្ឍិអាស៊ាន (AQRF) តើកម្រិតសញ្ញាបត្របរិញ្ញាបត្រ (Bachelor\'s Degree) ស្ថិតនៅក្នុងកម្រិតគុណវុឌ្ឍិទីប៉ុន្មាន?',
      en: 'In the Cambodia National Qualifications Framework (CNQF) aligned with ASEAN Qualifications Reference Framework (AQRF), at which qualification level is the Bachelor\'s Degree classified?'
    },
    options: [
      { id: 'a', text: { km: 'កម្រិតទី ៦ (Level 6)', en: 'Level 6' } },
      { id: 'b', text: { km: 'កម្រិតទី ៤ (Level 4)', en: 'Level 4' } },
      { id: 'c', text: { km: 'កម្រិតទី ៥ (Level 5)', en: 'Level 5' } },
      { id: 'd', text: { km: 'កម្រិតទី ៨ (Level 8)', en: 'Level 8' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'ក្របខណ្ឌ CNQF មាន ៨ កម្រិត៖ កម្រិត ៥ (បរិញ្ញាបត្ររង / Associate), កម្រិត ៦ (បរិញ្ញាបត្រ / Bachelor), កម្រិត ៧ (បរិញ្ញាបត្រជាន់ខ្ពស់ / Master), និងកម្រិត ៨ (បណ្ឌិត / Doctorate)។',
      en: 'The CNQF has 8 levels: Level 5 is Associate Degree, Level 6 is Bachelor\'s Degree, Level 7 is Master\'s Degree, and Level 8 is Doctoral Degree.'
    },
    reference: 'អនុក្រឹត្យស្តីពីក្របខណ្ឌគុណវុឌ្ឍិជាតិកម្ពុជា (CNQF)'
  },
  {
    id: 'q-r2-05',
    subject: 'General Culture & Literature',
    subjectKm: 'វប្បធម៌ទូទៅ និងអក្សរសាស្ត្រ',
    topic: 'Tum Teav Core Conflict & Feudal Realities',
    topicKm: 'វិភាគទំនាស់ស្នូលរឿងទុំទាវ និងតថភាពសង្គម',
    year: 2026,
    difficulty: 'hard',
    question: {
      km: 'នៅក្នុងរឿង «ទុំទាវ» របស់ព្រះបទុមត្ថេរ សោម (១៩១៥) តើទំនាស់ស្នូល (Core Conflict) ដ៏ជ្រាលជ្រៅបំផុតដែលឆ្លុះបញ្ចាំងពីសង្គមខ្មែរសម័យកាលនោះ គឺជាអ្វី?',
      en: 'In the literary masterpiece "Tum Teav" by Preah Botumthera Som (1915), what is the central thematic conflict that mirrors the socio-historical reality of the era?'
    },
    options: [
      { id: 'a', text: { km: 'ទំនាស់រវាងសិទ្ធិសេរីភាពស្នេហាបុគ្គល និងប្រព័ន្ធអំណាចសក្តិភូមិគ្រួសារនិយម «នំមិនធំជាងកញ្ជើ»', en: 'Conflict between individual freedom of love and feudal patriarchal authority ("the cake cannot be bigger than the basket")' } },
      { id: 'b', text: { km: 'ទំនាស់ដណ្តើមអំណាចរវាងអាណាខេត្តត្បូងឃ្មុំ និងព្រះរាជវាំងឧដុង្គ', en: 'Territorial rivalry between Tboung Khmum and Oudong Palace' } },
      { id: 'c', text: { km: 'ទំនាស់រវាងសាសនាព្រាហ្មណ៍ និងព្រះពុទ្ធសាសនា', en: 'Theological dispute between Brahmanism and Buddhism' } },
      { id: 'd', text: { km: 'ទំនាស់សេដ្ឋកិច្ចរវាងឈ្មួញបរទេស និងកសិករក្នុងស្រុក', en: 'Commercial clash between foreign merchants and local peasantry' } }
    ],
    correctAnswerId: 'a',
    explanation: {
      km: 'ទំនាស់ស្នូលដ៏សំខាន់ក្នុងរឿងទុំទាវ គឺការតស៊ូដណ្តើមសិទ្ធិសេរីភាពក្នុងជម្រើសគូស្រកររបស់យុវជន (ទុំ និងទាវ) ប្រឆាំងនឹងអំណាចផ្តាច់ការមាតា និងសង្គមសក្តិភូមិ (យាយផាន់ និងអរជូន) ដែលប្រកាន់ទស្សនៈ «នំមិនធំជាងកញ្ជើ»។',
      en: 'The fundamental conflict is the heroic struggle of young lovers for autonomy and genuine love against tyrannical parental control and feudal oppressive traditions ("Num Min Thom Cheang Kanchheu").'
    },
    reference: 'ការសិក្សាវិភាគអក្សរសាស្ត្រខ្មែរ - រឿងទុំទាវ ក្រសួងអប់រំ យុវជន និងកីឡា'
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

export const mockExams: MockExam[] = [
  // ================= ROUND 1 (PRELIMINARY / MEDIUM) =================
  {
    id: 'mock-nie-2026-r1',
    title: {
      km: 'វិញ្ញាសាប្រឡងសាកល្បង ជុំទី ១',
      en: 'Mock Exam - Round 1'
    },
    description: {
      km: 'វិញ្ញាសាប្រឡងសាកល្បងជុំទី ១ (ជម្រុះបឋម / កម្រិតមធ្យម) កំណត់ពេល ៤៥ នាទី។',
      en: 'Round 1 preliminary qualifying simulation covering core knowledge (45 minutes).'
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
        'វិញ្ញាសាជុំទី ១ នេះមានរយៈពេលកំណត់ ៤៥ នាទី (កម្រិតមធ្យម)។',
        'សូមជ្រើសរើសចម្លើយត្រឹមត្រូវបំផុតតែមួយគត់សម្រាប់សំណួរនីមួយៗ។',
        'អ្នកអាចដាក់ចំណាំ (Mark for Review) លើសំណួរដែលមិនទាន់ច្បាស់ ដើម្បីត្រឡប់មកពិនិត្យវិញ។',
        'នៅពេលអស់ម៉ោង ប្រព័ន្ធនឹងប្រគល់វិញ្ញាសាដោយស្វ័យប្រវត្តិ។',
        'ពិន្ទុជាប់កម្រិតស្តង់ដារគឺ ២៥/៥០ ពិន្ទុ (៥០%)។'
      ],
      en: [
        'Round 1 time limit is 45 minutes (Medium difficulty).',
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

  // ================= ROUND 2 (ADVANCED SPECIALIZATION & ANALYSIS / HARDER) =================
  {
    id: 'mock-nie-2026-r2',
    title: {
      km: 'វិញ្ញាសាប្រឡងសាកល្បង ជុំទី ២ (កម្រិតពិបាក)',
      en: 'Mock Exam - Round 2 (Hard)'
    },
    description: {
      km: 'វិញ្ញាសាប្រឡងសាកល្បងជុំទី ២ (ផ្តាច់ព្រ័ត្រស៊ីជម្រៅ / កម្រិតពិបាក) កំណត់ពេល ៦០ នាទី។',
      en: 'Round 2 advanced simulation with higher difficulty, focusing on deep legal analysis and complex problem solving.'
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
        'វិញ្ញាសាជុំទី ២ នេះមានកម្រិតលំបាកខ្ពស់ (ពិបាក) និងមានរយៈពេលកំណត់ ៦០ នាទី។',
        'សំណួរទាមទារការគិតវិភាគស៊ីជម្រៅ ផ្អែកលើទឡ្ហីករណ៍ច្បាប់ និងគរុកោសល្យជាន់ខ្ពស់។',
        'ពិន្ទុជាប់កម្រិតស្តង់ដារជុំទី ២ គឺ ៣០/៥០ ពិន្ទុ (៦០%)។',
        'សូមអានសំណួរ និងជម្រើសនីមួយៗឱ្យបានម៉ត់ចត់មុននឹងសម្រេចចិត្តឆ្លើយ។'
      ],
      en: [
        'Round 2 contains advanced higher-difficulty questions with a 60-minute duration.',
        'Questions require rigorous multi-step analysis, legal reasoning, and higher-order evaluation.',
        'Round 2 qualifying threshold is 30/50 marks (60%).',
        'Read each scenario and set of options thoroughly before finalizing your choice.'
      ]
    },
    questions: mockQuestionsRound2
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
    questions: mockQuestionsRound2
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
    questions: mockQuestionsRound2
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
