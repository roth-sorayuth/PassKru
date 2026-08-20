import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Search,
  Filter,
  FileText,
  Download,
  Play,
  Layers,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Bookmark,
  Calendar,
  ExternalLink,
  X,
  Eye,
  Award,
  ArrowRight
} from 'lucide-react';

interface ResourceItem {
  id: string;
  title: { km: string; en: string };
  subject: string;
  subjectLabel: { km: string; en: string };
  category: string;
  categoryLabel?: { km: string; en: string };
  year: number;
  pages: number;
  fileSize: string;
  description: { km: string; en: string };
  readContent?: {
    chapters: { title: { km: string; en: string }; content: { km: string; en: string } }[];
    keyFormulas?: string[];
    relatedQuizId?: string;
  };
}

export const LearningPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { setCurrentPage, startQuizById } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeReaderResource, setActiveReaderResource] = useState<ResourceItem | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const subjects = [
    { id: 'all', label: { km: 'គ្រប់មុខវិជ្ជា', en: 'All Subjects' } },
    { id: 'pedagogy', label: { km: 'គរុកោសល្យ & ចិត្តវិទ្យា', en: 'Pedagogy & Psychology' } },
    { id: 'culture', label: { km: 'វប្បធម៌ទូទៅ', en: 'General Culture' } },
    { id: 'khmer', label: { km: 'អក្សរសាស្ត្រខ្មែរ', en: 'Khmer Literature' } },
    { id: 'math', label: { km: 'គណិតវិទ្យា', en: 'Mathematics' } },
    { id: 'science', label: { km: 'វិទ្យាសាស្ត្រ (រូប/គីមី/ជីវៈ)', en: 'Sciences' } },
  ];

  const categories = [
    { id: 'all', label: { km: 'គ្រប់ប្រភេទ', en: 'All Resource Types' } },
    { id: 'past-papers', label: { km: 'វិញ្ញាសាចាស់ៗ (Past Papers)', en: 'Past Papers' } },
    { id: 'theory', label: { km: 'សង្ខេបទ្រឹស្តី (Theory Notes)', en: 'Theory Summaries' } },
    { id: 'methodology', label: { km: 'វិធីសាស្ត្របង្រៀន (Methodology)', en: 'Methodology' } },
    { id: 'formulas', label: { km: 'រូបមន្ត & គន្លឹះកាត់ (Formulas)', en: 'Formulas & Cheatsheets' } },
  ];

  const learningResources: ResourceItem[] = [
    {
      id: 'res-01',
      title: {
        km: 'សង្ខេបទ្រឹស្តីគរុកោសល្យទូទៅ & ចិត្តវិទ្យាអប់រំ (Piaget, Vygotsky, Bloom)',
        en: 'Comprehensive Summary: General Pedagogy & Educational Psychology'
      },
      subject: 'pedagogy',
      subjectLabel: { km: 'គរុកោសល្យ', en: 'Pedagogy' },
      category: 'theory',
      categoryLabel: { km: 'សង្ខេបទ្រឹស្តី', en: 'Theory Notes' },
      year: 2025,
      pages: 36,
      fileSize: '4.2 MB',
      description: {
        km: 'ប្រមូលផ្តុំទ្រឹស្តីស្នូលទាំង ៥ របស់គរុកោសល្យសម័យទំនើប និងការអនុវត្តក្នុងការបង្រៀនជាក់ស្តែង។',
        en: 'Core pedagogical models, cognitive stages, and classroom management techniques.'
      },
      readContent: {
        chapters: [
          {
            title: {
              km: 'ជំពូកទី ១៖ ដំណាក់កាលអភិវឌ្ឍន៍បញ្ញារបស់ Jean Piaget',
              en: 'Chapter 1: Piaget’s Stages of Cognitive Development'
            },
            content: {
              km: 'Jean Piaget បានបែងចែកការលូតលាស់បញ្ញារបស់កុមារជា ៤ ដំណាក់កាលធំៗ៖\n1. ដំណាក់កាលឥន្ទ្រិយ-ចលករ (Sensorimotor: 0-2 ឆ្នាំ)៖ កុមាររៀនតាមរយៈញាណ និងចលនាដឹងពី Object Permanence។\n2. ដំណាក់កាលមុនប្រតិបត្តិការ (Preoperational: 2-7 ឆ្នាំ)៖ កុមារចាប់ផ្តើមប្រើភាសា និមិត្តសញ្ញា ប៉ុន្តែមានគំនិតអាត្មានិយម (Egocentrism)។\n3. ដំណាក់កាលប្រតិបត្តិការជាក់ស្តែង (Concrete Operational: 7-11 ឆ្នាំ)៖ ចាប់ផ្តើមចេះគិតបែបឡូហ្ស៊ិកលើវត្ថុជាក់ស្តែង និងចេះរក្សាទំហំ/បរិមាណ (Conservation)។\n4. ដំណាក់កាលប្រតិបត្តិការអរូបី (Formal Operational: 12 ឆ្នាំឡើង)៖ អាចគិតបែបអរូបី ទស្សនវិជ្ជា និងសម្មតិកម្ម។',
              en: 'Piaget identified four distinct stages:\n1. Sensorimotor (0-2 yrs): Sensory interaction & object permanence.\n2. Preoperational (2-7 yrs): Symbolic thinking & egocentric perspective.\n3. Concrete Operational (7-11 yrs): Logical thought on tangible objects & conservation.\n4. Formal Operational (12+ yrs): Abstract reasoning & hypothesis testing.'
            }
          },
          {
            title: {
              km: 'ជំពូកទី ២៖ ទ្រឹស្តីសង្គមវប្បធម៌របស់ Lev Vygotsky & ZPD',
              en: 'Chapter 2: Vygotsky’s Sociocultural Theory & ZPD'
            },
            content: {
              km: 'តំបន់អភិវឌ្ឍន៍ប្រហាក់ប្រហែល (Zone of Proximal Development - ZPD) គឺជាគម្លាតរវាងអ្វីដែលសិស្សអាចធ្វើបានដោយខ្លួនឯង និងអ្វីដែលសិស្សអាចធ្វើបានដោយមានជំនួយពីអ្នកមានចំណេះដឹងជាង (MKO - More Knowledgeable Other) តាមរយៈការជ្រោមជ្រែង (Scaffolding)។',
              en: 'The Zone of Proximal Development (ZPD) is the distance between what a learner can do without help and what they can achieve with guidance from a More Knowledgeable Other (MKO) through Scaffolding.'
            }
          }
        ],
        relatedQuizId: 'quiz-ped-01'
      }
    },
    {
      id: 'res-02',
      title: {
        km: 'វិញ្ញាសាវប្បធម៌ទូទៅ NIE ២០២៥ (មានចម្លើយពន្យល់លម្អិត)',
        en: 'NIE General Culture & Knowledge Past Paper 2025 (With Full Solution)'
      },
      subject: 'culture',
      subjectLabel: { km: 'វប្បធម៌ទូទៅ', en: 'General Culture' },
      category: 'past-papers',
      categoryLabel: { km: 'វិញ្ញាសាចាស់ៗ', en: 'Past Papers' },
      year: 2025,
      pages: 18,
      fileSize: '2.8 MB',
      description: {
        km: 'សំណួរពហុជ្រើសរើស ៤០ សំណួរ រួមទាំងសំណួរសរសេរ និងគន្លឹះចម្លើយផ្លូវការ។',
        en: '40 MCQs and essay questions with verified answer keys.'
      },
      readContent: {
        chapters: [
          {
            title: {
              km: 'ផ្នែកទី ១៖ ប្រវត្តិសាស្ត្រ និងអារ្យធម៌ខ្មែរ',
              en: 'Section 1: Khmer History and Civilization'
            },
            content: {
              km: 'ប្រាសាទអង្គរវត្តត្រូវបានកសាងឡើងក្នុងរាជ្យព្រះបាទសូរ្យវរ្ម័នទី២ នៅដើមសតវត្សរ៍ទី១២ ឧទ្ទិសថ្វាយព្រះវិស្ណុក្នុងព្រហ្មញ្ញសាសនា។ ចំណែកប្រាសាទបាយ័ន ត្រូវបានកសាងឡើងដោយព្រះបាទជ័យវរ្ម័នទី៧ នៅចុងសតវត្សរ៍ទី១២ ឧទ្ទិសថ្វាយព្រះពុទ្ធសាសនាមហាយាន។',
              en: 'Angkor Wat was constructed during the reign of King Suryavarman II in the early 12th century, dedicated to Vishnu. Bayon Temple was built by King Jayavarman VII in the late 12th century for Mahayana Buddhism.'
            }
          }
        ],
        relatedQuizId: 'quiz-cult-01'
      }
    },
    {
      id: 'res-03',
      title: {
        km: 'កម្រងក្បួនតែងសេចក្តីគរុកោសល្យ និងវិភាគអក្សរសិល្ប៍ខ្មែរ',
        en: 'Pedagogical Essay Writing Formulas & Khmer Literature Analysis'
      },
      subject: 'khmer',
      subjectLabel: { km: 'អក្សរសាស្ត្រខ្មែរ', en: 'Khmer Literature' },
      category: 'methodology',
      categoryLabel: { km: 'វិធីសាស្ត្របង្រៀន', en: 'Methodology' },
      year: 2024,
      pages: 24,
      fileSize: '3.1 MB',
      description: {
        km: 'ទម្រង់តែងសេចក្តីបែបពន្យល់ ពិភាក្សា និងប្រៀបធៀប សម្រាប់បេក្ខជនប្រឡងគ្រូ។',
        en: 'Structured frameworks for explanatory, argumentative, and comparative pedagogical essays.'
      },
      readContent: {
        chapters: [
          {
            title: {
              km: 'ក្បួនតែងសេចក្តីបែបពន្យល់ (Explanatory Essay)',
              en: 'Explanatory Essay Structure'
            },
            content: {
              km: 'រចនាសម្ព័ន្ធស្នូល៖\n១. ផ្តើមសេចក្តី៖ លំនាំបញ្ហា -> ចំណូលបញ្ហា -> ចំណោទបញ្ហា\n២. តួសេចក្តី៖ ពន្យល់ពាក្យគន្លឹះ -> បកស្រាយន័យប្រធាន -> លើកឧទាហរណ៍ជាក់ស្តែង (សង្គម ឬ អក្សរសិល្ប៍) -> សរុបន័យ\n៣. បញ្ចប់សេចក្តី៖ វាយតម្លៃប្រធាន -> មតិផ្ទាល់ខ្លួនទាក់ទងនឹងវិជ្ជាជីវៈគ្រូបង្រៀន។',
              en: 'Core Structure:\n1. Introduction: Hook -> Theme introduction -> Thesis question\n2. Body: Keyword explanation -> In-depth interpretation -> Concrete examples -> Intermediate conclusion\n3. Conclusion: Topic appraisal -> Personal teacher perspective.'
            }
          }
        ]
      }
    },
    {
      id: 'res-04',
      title: {
        km: 'កម្រងរូបមន្តផ្លូវកាត់គណិតវិទ្យាថ្នាក់ទី១២ សម្រាប់វិញ្ញាសា MCQ NIE',
        en: 'Grade 12 Mathematics Shortcut Formulas for NIE Entrance MCQ'
      },
      subject: 'math',
      subjectLabel: { km: 'គណិតវិទ្យា', en: 'Mathematics' },
      category: 'formulas',
      categoryLabel: { km: 'រូបមន្ត & គន្លឹះកាត់', en: 'Formulas' },
      year: 2025,
      pages: 16,
      fileSize: '1.9 MB',
      description: {
        km: 'រូបមន្តលីមីត ដេរីវេ អាំងតេក្រាល កុំផ្លិច និងប្រូបាប សម្រាប់គណនាក្នុងរយៈពេលខ្លី។',
        en: 'Comprehensive formulas for limits, integrals, complex numbers, and probability.'
      },
      readContent: {
        chapters: [
          {
            title: {
              km: 'រូបមន្តលីមីតរាងមិនកំណត់ 0/0 និង ∞/∞',
              en: 'Indeterminate Limits Shortcut Formulas'
            },
            content: {
              km: '• វិធាន L’Hôpital: lim (x->a) [f(x)/g(x)] = lim (x->a) [f\'(x)/g\'(x)]\n• lim (x->0) [sin(ax)/bx] = a/b\n• lim (x->0) [(1 - cos(ax))/x^2] = a^2 / 2\n• lim (x->0) [tan(ax)/bx] = a/b',
              en: '• L’Hôpital’s Rule: lim (x->a) [f(x)/g(x)] = lim (x->a) [f\'(x)/g\'(x)]\n• lim (x->0) [sin(ax)/bx] = a/b\n• lim (x->0) [(1 - cos(ax))/x^2] = a^2 / 2'
            }
          }
        ]
      }
    },
    {
      id: 'res-05',
      title: {
        km: 'ច្បាប់ស្តីពីការអប់រំ និងក្រមសីលធម៌វិជ្ជាជីវៈគ្រូបង្រៀនកម្ពុជា',
        en: 'Cambodian Education Law & Teacher Professional Code of Conduct'
      },
      subject: 'pedagogy',
      subjectLabel: { km: 'ច្បាប់អប់រំ', en: 'Education Law' },
      category: 'theory',
      categoryLabel: { km: 'សង្ខេបទ្រឹស្តី', en: 'Theory Notes' },
      year: 2024,
      pages: 28,
      fileSize: '2.5 MB',
      description: {
        km: 'សង្ខេបមាត្រាសំខាន់ៗនៃច្បាប់អប់រំឆ្នាំ ២០០៧ និងស្តង់ដារវិជ្ជាជីវៈគ្រូបង្រៀន។',
        en: 'Key provisions of the 2007 Education Law and teacher standards in Cambodia.'
      },
      readContent: {
        chapters: [
          {
            title: {
              km: 'មាត្រាគន្លឹះនៃច្បាប់ស្តីពីការអប់រំ ២០០៧',
              en: 'Key Articles of 2007 Education Law'
            },
            content: {
              km: '• មាត្រា ៣១៖ ពលរដ្ឋកម្ពុជាគ្រប់រូបមានសិទ្ធិទទួលបានការអប់រំប្រកបដោយគុណភាពយ៉ាងតិច ៩ ឆ្នាំ នៅក្នុងគ្រឹះស្ថានអប់រំសាធារណៈដោយឥតបង់ថ្លៃ។\n• មាត្រា ៣៥៖ សិទ្ធិ និងកាតព្វកិច្ចរបស់អ្នករៀន និងការគោរពវិន័យសាលា។',
              en: '• Article 31: Every Cambodian citizen has the right to access at least 9 years of free, quality basic education in public institutions.\n• Article 35: Rights and duties of learners.'
            }
          }
        ]
      }
    }
  ];

  const filteredResources = learningResources.filter(res => {
    const matchesSubject = selectedSubject === 'all' || res.subject === selectedSubject;
    const matchesCategory = selectedCategory === 'all' || res.category === selectedCategory;
    const titleStr = res.title?.[lang] || res.title?.km || '';
    const descStr = res.description?.[lang] || res.description?.km || '';
    const matchesSearch =
      titleStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      descStr.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesCategory && matchesSearch;
  });

  const handleDownloadPdf = (res: ResourceItem) => {
    const title = res.title?.[lang] || res.title?.km || 'Document';
    setDownloadToast(lang === 'km' ? `បានទាញយកឯកសារ៖ "${title}" (PDF)` : `Downloaded: "${title}" (PDF)`);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Toast Notification */}
      {downloadToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{downloadToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <BookOpen className="w-4 h-4" />
          <span>{lang === 'km' ? 'បណ្ណាល័យឌីជីថល & ឯកសារសិក្សា' : 'Digital Learning & Study Resources'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          {lang === 'km' ? 'មេរៀន ឯកសារ និងវិញ្ញាសាត្រៀមប្រឡង' : 'Teacher Preparation Study Materials'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          {lang === 'km'
            ? 'ចុចលើឯកសារណាមួយដើម្បីអានសង្ខេបមេរៀនភ្លាមៗ ទាញយក PDF ឬចាប់ផ្តើមហ្វឹកហាត់លំហាត់ពាក់ព័ន្ធ។'
            : 'Click any resource to read full summary notes, download official PDFs, or launch targeted practice.'}
        </p>
      </div>

      {/* 3 Clickable Feature Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setCurrentPage('past-papers')}
          className="p-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-sm hover:shadow-md transition cursor-pointer space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-105 transition">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base">{lang === 'km' ? 'បណ្តុំវិញ្ញាសាចាស់ៗ ២០១៨-២០២៥' : 'Past Examination Papers'}</h3>
          <p className="text-xs text-indigo-100 flex items-center gap-1">
            <span>{lang === 'km' ? 'មើលវិញ្ញាសា និងចម្លើយពន្យល់' : 'Browse with solution keys'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </p>
        </div>

        <div
          onClick={() => setCurrentPage('flashcards')}
          className="p-5 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-sm hover:shadow-md transition cursor-pointer space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-105 transition">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base">{lang === 'km' ? 'បណ្ណចងចាំ Flashcards' : 'Pedagogy Flashcards'}</h3>
          <p className="text-xs text-amber-100 flex items-center gap-1">
            <span>{lang === 'km' ? 'ទន្ទេញពាក្យគន្លឹះ និងទ្រឹស្តី' : 'Memorize core concepts fast'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </p>
        </div>

        <div
          onClick={() => setCurrentPage('practice')}
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm hover:shadow-md transition cursor-pointer space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-105 transition">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base">{lang === 'km' ? 'អនុវត្តលំហាត់តាមប្រធានបទ' : 'Interactive Topic Practice'}</h3>
          <p className="text-xs text-emerald-100 flex items-center gap-1">
            <span>{lang === 'km' ? 'ផ្ទៀងផ្ទាត់ចម្លើយភ្លាមៗ' : 'Instant check & feedback'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>

          {/* Subject Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full md:w-auto">
            {subjects.map(subj => (
              <button
                key={subj.id}
                onClick={() => setSelectedSubject(subj.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedSubject === subj.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {subj.label[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-t border-slate-100 pt-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {cat.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map(res => (
          <div
            key={res.id}
            onClick={() => setActiveReaderResource(res)}
            className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs hover:border-indigo-400 hover:shadow-md transition cursor-pointer space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {res.subjectLabel?.[lang] || res.subjectLabel?.km || ''}
                  </span>
                  {res.categoryLabel && (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {res.categoryLabel?.[lang] || res.categoryLabel?.km || ''}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500 font-medium">{res.year}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition">
                {res.title?.[lang] || res.title?.km || ''}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                {res.description?.[lang] || res.description?.km || ''}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                {res.pages} {lang === 'km' ? 'ទំព័រ' : 'pages'} • {res.fileSize}
              </span>

              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => setActiveReaderResource(res)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold transition cursor-pointer flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{lang === 'km' ? 'អានមេរៀន' : 'Read Notes'}</span>
                </button>
                <button
                  onClick={() => handleDownloadPdf(res)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-500 text-slate-700 font-semibold transition cursor-pointer flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Document & Notes Reader Modal */}
      {activeReaderResource && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700">
                    {activeReaderResource.subjectLabel?.[lang] || activeReaderResource.subjectLabel?.km || ''}
                  </span>
                  <span className="text-xs text-slate-400">{activeReaderResource.year}</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {activeReaderResource.title?.[lang] || activeReaderResource.title?.km || ''}
                </h3>
              </div>
              <button
                onClick={() => setActiveReaderResource(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chapters Content */}
            <div className="space-y-4">
              {activeReaderResource.readContent?.chapters?.map((ch, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="text-sm font-bold text-indigo-900">{ch.title?.[lang] || ch.title?.km || ''}</h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                    {ch.content?.[lang] || ch.content?.km || ''}
                  </p>
                </div>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => handleDownloadPdf(activeReaderResource)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'km' ? 'ទាញយកឯកសារ PDF ពេញលេញ' : 'Download Complete PDF'}</span>
              </button>

              <button
                onClick={() => {
                  const qId = activeReaderResource.readContent?.relatedQuizId || 'quiz-ped-01';
                  setActiveReaderResource(null);
                  startQuizById(qId);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{lang === 'km' ? 'ធ្វើលំហាត់ពាក់ព័ន្ធ' : 'Practice Related Quiz'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
