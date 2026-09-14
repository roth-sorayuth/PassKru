import { Announcement, StudyTask, WeakArea, Mentor, AppNotification } from '../types';

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
