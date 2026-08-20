import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  GraduationCap,
  Calendar,
  Layers,
  ArrowRight,
  Download,
  Info,
  CheckSquare,
  Square
} from 'lucide-react';

export const ExamRequirementsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { setCurrentPage } = useApp();

  const [activeTab, setActiveTab] = useState<'nie' | 'rttc' | 'pttc' | 'kindergarten'>('nie');
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({
    doc1: true,
    doc2: true,
    doc3: false,
    doc4: false,
    doc5: false,
    doc6: false,
  });

  const toggleDoc = (key: string) => {
    setCheckedDocs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const completedDocsCount = Object.values(checkedDocs).filter(Boolean).length;
  const totalDocsCount = Object.keys(checkedDocs).length;
  const readinessPercent = Math.round((completedDocsCount / totalDocsCount) * 100);

  const examDetails = {
    nie: {
      title: { km: 'វិទ្យាស្ថានជាតិអប់រំ (NIE) — គ្រូមធ្យមសិក្សាទុតិយភូមិ', en: 'National Institute of Education (NIE) — Upper Secondary' },
      degreeReq: { km: 'សញ្ញាបត្របរិញ្ញាបត្រ (Bachelor Degree) ឬសមមូល ស្របតាមមុខវិជ្ជាឯកទេស', en: 'Bachelor Degree or equivalent relevant to chosen major' },
      ageLimit: { km: 'អាយុមិនលើសពី ៣៥ ឆ្នាំ (សម្រាប់បេក្ខជនក្រៅក្របខណ្ឌ) ឬ ៤០ ឆ្នាំ (សម្រាប់មន្ត្រីរាជការ)', en: 'Max 35 years old (Regular candidates) or 40 years (Civil servants)' },
      duration: { km: 'វគ្គបណ្តុះបណ្តាល ១ ឆ្នាំ នៅវិទ្យាស្ថានជាតិអប់រំ រាជធានីភ្នំពេញ', en: '1-Year pedagogical training program at NIE Phnom Penh' },
      specialties: ['អក្សរសាស្ត្រខ្មែរ', 'គណិតវិទ្យា', 'រូបវិទ្យា', 'គីមីវិទ្យា', 'ជីវវិទ្យា', 'ប្រវត្តិវិទ្យា', 'ភូមិវិទ្យា', 'ភាសាអង់គ្លេស', 'ព័ត៌មានវិទ្យា (ICT)'],
      subjectsExam: {
        km: '១. វប្បធម៌ទូទៅ (២ ម៉ោង) \n២. ភាសាបរទេស (១ ម៉ោង ៣០ នាទី) \n៣. មុខវិជ្ជាឯកទេស (៣ ម៉ោង)',
        en: '1. General Culture (2h) \n2. Foreign Language (1.5h) \n3. Specialized Subject (3h)'
      }
    },
    rttc: {
      title: { km: 'សាលាគរុកោសល្យភូមិភាគ (RTTC) — គ្រូមធ្យមសិក្សាបឋមភូមិ', en: 'Regional Teacher Training Center (RTTC) — Lower Secondary' },
      degreeReq: { km: 'សញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ (បាក់ឌុប - BacII) ឬសញ្ញាបត្រសមមូល', en: 'High School Diploma (Bac II) or equivalent' },
      ageLimit: { km: 'អាយុមិនលើសពី ២៥ ឆ្នាំ (សម្រាប់បេក្ខជនទូទៅ) ឬ ២៨ ឆ្នាំ (ជនជាតិដើមភាគតិច)', en: 'Max 25 years old (General) or 28 years (Indigenous/Remote)' },
      duration: { km: 'វគ្គបណ្តុះបណ្តាល ២ ឆ្នាំ (ប្រព័ន្ធ ១២+២)', en: '2-Year pedagogical training program (12+2 formula)' },
      specialties: ['គណិត-រូប', 'គីមី-ជីវៈ', 'អក្សរសាស្ត្រខ្មែរ-ពលរដ្ឋ', 'ប្រវត្តិ-ភូមិ', 'អង់គ្លេស-ខ្មែរ', 'កីឡា-បំណិន'],
      subjectsExam: {
        km: '១. វប្បធម៌ទូទៅ (២ ម៉ោង) \n២. មុខវិជ្ជាឯកទេសទី១ (២ ម៉ោង) \n៣. មុខវិជ្ជាឯកទេសទី២ (២ ម៉ោង)',
        en: '1. General Culture (2h) \n2. Major Subject 1 (2h) \n3. Major Subject 2 (2h)'
      }
    },
    pttc: {
      title: { km: 'សាលាគរុកោសល្យរាជធានី-ខេត្ត (PTTC) — គ្រូបឋមសិក្សា', en: 'Provincial Teacher Training Center (PTTC) — Primary' },
      degreeReq: { km: 'សញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ (បាក់ឌុប) និទ្ទេស A, B, C, D, E', en: 'High School Diploma (Bac II) Grade A to E' },
      ageLimit: { km: 'អាយុមិនលើសពី ២៥ ឆ្នាំ គិតត្រឹមថ្ងៃប្រឡង', en: 'Max 25 years old on exam date' },
      duration: { km: 'វគ្គបណ្តុះបណ្តាល ២ ឆ្នាំ (ប្រព័ន្ធ ១២+២)', en: '2-Year training program (12+2 formula)' },
      specialties: ['គរុកោសល្យបឋមសិក្សាគ្រប់មុខវិជ្ជា', 'ការបង្រៀនថ្នាក់ដំបូង (Early Grade Reading & Math)'],
      subjectsExam: {
        km: '១. វប្បធម៌ទូទៅ និងចំណេះដឹងគរុកោសល្យ (២ ម៉ោង) \n២. ភាសាខ្មែរ និងគណិតវិទ្យា (២ ម៉ោង ៣០ នាទី)',
        en: '1. General Culture & Pedagogy (2h) \n2. Khmer Language & Math (2.5h)'
      }
    },
    kindergarten: {
      title: { km: 'សាលាគរុកោសល្យមត្តេយ្យ — គ្រូមត្តេយ្យសិក្សា', en: 'Preschool Teacher Training Center — Kindergarten' },
      degreeReq: { km: 'សញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ (បាក់ឌុប)', en: 'High School Diploma (Bac II)' },
      ageLimit: { km: 'អាយុមិនលើសពី ២៥ ឆ្នាំ', en: 'Max 25 years old' },
      duration: { km: 'វគ្គបណ្តុះបណ្តាល ២ ឆ្នាំ នៅសាលាគរុកោសល្យមត្តេយ្យមជ្ឈិម', en: '2-Year training program at Central Preschool Training Center' },
      specialties: ['ចិត្តវិទ្យាកុមារតូច', 'វិធីសាស្ត្រល្បែងសិក្សា', 'សិល្បៈ និងចម្រៀងកុមារ'],
      subjectsExam: {
        km: '១. វប្បធម៌ទូទៅ (២ ម៉ោង) \n២. តែងសេចក្តីភាសាខ្មែរ (២ ម៉ោង) \n៣. វិញ្ញាសាសម្ភាសន៍ និងសម្បទាគរុកោសល្យ',
        en: '1. General Culture (2h) \n2. Khmer Essay Composition (2h) \n3. Pedagogical Aptitude Interview'
      }
    }
  };

  const cur = examDetails[activeTab];

  const requiredDocuments = [
    { key: 'doc1', label: { km: 'ពាក្យសុំចុះឈ្មោះប្រឡង (ទម្រង់បែបបទក្រសួងអប់រំ)', en: 'Official MoEYS Application Form' }, desc: { km: 'បំពេញព័ត៌មានផ្ទាល់ខ្លួន និងបិទរូបថតឱ្យបានត្រឹមត្រូវ', en: 'Filled candidate info with stamped photo' } },
    { key: 'doc2', label: { km: 'សញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ ឬ បរិញ្ញាបត្រ (ច្បាប់ចម្លងបញ្ជាក់)', en: 'Certified Copy of High School Diploma or Bachelor Degree' }, desc: { km: 'មានបញ្ជាក់ត្រាពីសាលាក្រុង/ស្រុកត្រឹមត្រូវ', en: 'Notarized by District/City Hall' } },
    { key: 'doc3', label: { km: 'សំបុត្រកំណើត ឬ សេចក្តីចម្លងសំបុត្រកំណើត', en: 'Birth Certificate (Original or Certified Copy)' }, desc: { km: 'មានត្រាបញ្ជាក់ពីមន្ត្រីអត្រានុកូលដ្ឋាន', en: 'Civil registry stamp' } },
    { key: 'doc4', label: { km: 'លិខិតថ្កោលទោស (ព្រឹត្តិបត្រថ្កោលទោសលេខ ៣)', en: 'Criminal Background Check (Record Certificate No. 3)' }, desc: { km: 'ចេញដោយក្រសួងយុត្តិធម៌ (មានសុពលភាពក្រោម ៣ ខែ)', en: 'Issued by Ministry of Justice (valid <3 months)' } },
    { key: 'doc5', label: { km: 'លិខិតបញ្ជាក់សុខភាព និងកាយសម្បទា', en: 'Medical & Physical Fitness Certificate' }, desc: { km: 'ចេញដោយមន្ទីរពេទ្យរដ្ឋមានសមត្ថកិច្ច', en: 'Issued by authorized public hospital' } },
    { key: 'doc6', label: { km: 'រូបថត ៤x៦ (ផ្ទៃខាងក្រោយពណ៌ស ចំនួន ៤ សន្លឹក)', en: 'Passport Photos 4x6 (White background, 4 copies)' }, desc: { km: 'ថតមិនលើសពី ៣ ខែ ក្នុងសម្លៀកបំពាក់សមរម្យ', en: 'Taken within last 3 months, formal attire' } },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>{lang === 'km' ? 'លក្ខខណ្ឌ និងឯកសារប្រឡងផ្លូវការ' : 'Official Eligibility & Requirements'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          {lang === 'km' ? 'លក្ខខណ្ឌជ្រើសរើសគ្រូបង្រៀនក្របខណ្ឌរដ្ឋ' : 'Requirements for Cambodian Teacher Exams'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          {lang === 'km'
            ? 'ព័ត៌មានលម្អិតអំពីកម្រិតវប្បធម៌ អាយុ កាលវិភាគ និងបញ្ជីត្រួតពិនិត្យឯកសារតម្រូវសម្រាប់បេក្ខជនទាំងអស់។'
            : 'Detailed guidelines on educational qualifications, age criteria, exam structure, and document readiness checklist.'}
        </p>
      </div>

      {/* Target Exam Category Selector */}
      <div className="flex items-center justify-center">
        <div className="bg-slate-100 p-1.5 rounded-2xl flex flex-wrap gap-1 border border-slate-200 shadow-inner">
          <button
            onClick={() => setActiveTab('nie')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'nie'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            🏛️ NIE (គ្រូវិទ្យាល័យ)
          </button>
          <button
            onClick={() => setActiveTab('rttc')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'rttc'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            🏫 RTTC (គ្រូអនុ)
          </button>
          <button
            onClick={() => setActiveTab('pttc')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'pttc'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            🎒 PTTC (គ្រូបឋម)
          </button>
          <button
            onClick={() => setActiveTab('kindergarten')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'kindergarten'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            🧸 មត្តេយ្យសិក្សា
          </button>
        </div>
      </div>

      {/* Main Requirement Details Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Eligibility Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900">{cur.title[lang]}</h2>
              <p className="text-xs text-indigo-600 font-semibold mt-1">
                {lang === 'km' ? 'ក្របខណ្ឌមន្ត្រីរាជការក្រសួងអប់រំ យុវជន និងកីឡា' : 'MoEYS Official State Teacher Cadre'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {lang === 'km' ? 'កម្រិតវប្បធម៌តម្រូវ' : 'Degree Requirement'}
                </span>
                <p className="text-sm font-bold text-slate-900">{cur.degreeReq[lang]}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {lang === 'km' ? 'លក្ខខណ្ឌអាយុ' : 'Age Eligibility'}
                </span>
                <p className="text-sm font-bold text-slate-900">{cur.ageLimit[lang]}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 sm:col-span-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {lang === 'km' ? 'រយៈពេល និងទីកន្លែងបណ្តុះបណ្តាល' : 'Training Duration & Venue'}
                </span>
                <p className="text-sm font-bold text-slate-900">{cur.duration[lang]}</p>
              </div>
            </div>

            {/* Specialties */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">
                {lang === 'km' ? 'មុខវិជ្ជាឯកទេសដែលជ្រើសរើស' : 'Available Specialization Tracks'}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {cur.specialties.map((spec, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-100">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Exam structure */}
            <div className="p-4 rounded-2xl bg-indigo-950 text-white space-y-2">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>{lang === 'km' ? 'វិញ្ញាសាកំណត់សម្រាប់ការប្រឡង' : 'Prescribed Examination Papers'}</span>
              </h3>
              <p className="text-xs text-indigo-100 whitespace-pre-line leading-relaxed">
                {cur.subjectsExam[lang]}
              </p>
            </div>
          </div>

          {/* Application Submission 4-Step Guide */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900">
              {lang === 'km' ? 'ដំណាក់កាលនៃការដាក់ពាក្យប្រឡង' : 'Application Process (Step-by-Step)'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <h4 className="font-bold text-sm text-slate-900">
                  {lang === 'km' ? 'ទាញយក & បំពេញពាក្យ' : 'Fill Application Form'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'km'
                    ? 'ទាញយកទម្រង់បែបបទ ឬទិញនៅមន្ទីរអប់រំខេត្ត រួចបំពេញព័ត៌មានផ្ទាល់ខ្លួន និងជ្រើសរើសឯកទេស។'
                    : 'Download or obtain official MoEYS application form and complete candidate details.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  2
                </div>
                <h4 className="font-bold text-sm text-slate-900">
                  {lang === 'km' ? 'រៀបចំឯកសារចម្លង' : 'Prepare Certified Documents'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'km'
                    ? 'យកសញ្ញាបត្រ សំបុត្រកំណើត និងលិខិតថ្កោលទោស ទៅបញ្ជាក់ត្រានៅសាលាក្រុង/ស្រុក។'
                    : 'Get copies of diplomas, birth certificate, and police clearance notarized.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  3
                </div>
                <h4 className="font-bold text-sm text-slate-900">
                  {lang === 'km' ? 'ដាក់ពាក្យនៅមន្ទីរអប់រំ' : 'Submit at Provincial Office'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'km'
                    ? 'ប្រគល់សំណុំឯកសារផ្ទាល់នៅមន្ទីរអប់រំ យុវជន និងកីឡា រាជធានី-ខេត្តសាមី មុនថ្ងៃ ៣០ កញ្ញា។'
                    : 'Submit physical dossier to the designated Provincial Department of Education before Sept 30.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  4
                </div>
                <h4 className="font-bold text-sm text-slate-900">
                  {lang === 'km' ? 'ទទួលប័ណ្ណសម្គាល់ខ្លួនប្រឡង' : 'Collect Candidate ID Card'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'km'
                    ? 'មកទទួលប័ណ្ណសម្គាល់ខ្លួន និងពិនិត្យលេខបន្ទប់ លេខតុប្រឡង នៅមណ្ឌលប្រឡង។'
                    : 'Collect examination roll badge and verify assigned exam room and desk.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Interactive Document Checklist */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-indigo-200 p-6 shadow-sm space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-indigo-600" />
                  <span>{lang === 'km' ? 'បញ្ជីត្រួតពិនិត្យឯកសារ' : 'Document Checklist'}</span>
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                  {readinessPercent}%
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === 'km'
                  ? 'គូសធីកលើឯកសារដែលអ្នកបានរៀបចំរួចរាល់ ដើម្បីធានាភាពគ្រប់គ្រាន់ ១០០% មុនដាក់ពាក្យ។'
                  : 'Check off prepared documents to ensure your dossier is 100% compliant before submission.'}
              </p>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${readinessPercent}%` }}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              {requiredDocuments.map(doc => (
                <div
                  key={doc.key}
                  onClick={() => toggleDoc(doc.key)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                    checkedDocs[doc.key]
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {checkedDocs[doc.key] ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p className={`text-xs font-bold leading-snug ${checkedDocs[doc.key] ? 'text-emerald-900' : 'text-slate-800'}`}>
                      {doc.label[lang]}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{doc.desc[lang]}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCurrentPage('practice')}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{lang === 'km' ? 'ចាប់ផ្តើមហ្វឹកហាត់វិញ្ញាសា' : 'Start Practicing Exam Papers'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
