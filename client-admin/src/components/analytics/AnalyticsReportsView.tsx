import React from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  MapPin, 
  Download, 
  FileSpreadsheet, 
  Award, 
  BrainCircuit, 
  BookOpen,
  Calendar
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

const PROVINCE_DATA = [
  { name: 'ភ្នំពេញ', candidates: 3850, passRate: 78 },
  { name: 'កណ្តាល', candidates: 1950, passRate: 72 },
  { name: 'សៀមរាប', candidates: 1820, passRate: 70 },
  { name: 'បាត់ដំបង', candidates: 1640, passRate: 69 },
  { name: 'កំពង់ចាម', candidates: 1420, passRate: 68 },
  { name: 'តាកែវ', candidates: 1120, passRate: 65 },
  { name: 'ព្រៃវែង', candidates: 980, passRate: 64 },
];

const SUBJECT_PERFORMANCE = [
  { subject: 'គរុកោសល្យ', avgScore: 68, difficultyScore: 72 },
  { subject: 'វប្បធម៌ទូទៅ', avgScore: 75, difficultyScore: 60 },
  { subject: 'ច្បាប់អប់រំ', avgScore: 54, difficultyScore: 84 },
  { subject: 'អក្សរសាស្ត្រខ្មែរ', avgScore: 71, difficultyScore: 65 },
  { subject: 'គណិតវិទ្យា', avgScore: 62, difficultyScore: 78 },
];

const TARGET_EXAM_DISTRIBUTION = [
  { name: 'គ្រូវិទ្យាល័យ (NIE)', value: 5200, color: '#4f46e5' },
  { name: 'គ្រូអនុវិទ្យាល័យ (RTC)', value: 4100, color: '#06b6d4' },
  { name: 'គ្រូបឋមសិក្សា (PTTC)', value: 2600, color: '#10b981' },
  { name: 'គ្រូមត្តេយ្យ', value: 950, color: '#f59e0b' },
];

const MONTHLY_PRACTICE_TRENDS = [
  { month: 'មករា', quizzes: 12000, mocks: 1400 },
  { month: 'កុម្ភៈ', quizzes: 18500, mocks: 2800 },
  { month: 'មីនា', quizzes: 29000, mocks: 4900 },
  { month: 'មេសា (បច្ចុប្បន្ន)', quizzes: 41200, mocks: 7600 },
];

export const AnalyticsReportsView: React.FC<{ showEnglishLabels: boolean }> = ({ showEnglishLabels }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111317] p-5 rounded-2xl border border-white/5 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-400" />
            <span>របាយការណ៍ និងស្ថិតិវិភាគទិន្នន័យ (Reports & Analytics)</span>
          </h2>
          <p className="text-xs text-[#8E929E] mt-1">
            វិភាគប្រសិទ្ធភាពនៃការរៀន ការប្រឡងសាកល្បង និងការត្រៀមខ្លួនរបស់បេក្ខជនទូទាំងប្រទេសកម្ពុជា
          </p>
        </div>

        <button
          onClick={() => alert('ទាញយករបាយការណ៍ជោគជ័យជាទម្រង់ Excel (PassKru_National_Report_2026.xlsx)')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>ទាញយករបាយការណ៍ Excel</span>
        </button>
      </div>

      {/* Top 4 Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111317] p-4 rounded-2xl border border-white/5 shadow-xs">
          <span className="text-[11px] text-[#8E929E] font-medium">បេក្ខជនសកម្មប្រចាំខែ</span>
          <p className="text-xl font-bold text-white mt-1">12,850 នាក់</p>
          <span className="text-[10px] text-emerald-400 font-bold mt-1 block">↑ +24% ធៀបនឹងខែកន្លងទៅ</span>
        </div>

        <div className="bg-[#111317] p-4 rounded-2xl border border-white/5 shadow-xs">
          <span className="text-[11px] text-[#8E929E] font-medium">កម្រងសំណួរត្រូវបានអនុវត្ត</span>
          <p className="text-xl font-bold text-indigo-400 mt-1">100,700+ លើក</p>
          <span className="text-[10px] text-indigo-300 font-bold mt-1 block">អត្រាឆ្លើយត្រូវមធ្យម ៦៨.៤%</span>
        </div>

        <div className="bg-[#111317] p-4 rounded-2xl border border-white/5 shadow-xs">
          <span className="text-[11px] text-[#8E929E] font-medium">មុខវិជ្ជាត្រូវការជំនួយខ្លាំងជាងគេ</span>
          <p className="text-xl font-bold text-rose-400 mt-1">ច្បាប់អប់រំ</p>
          <span className="text-[10px] text-rose-300 font-semibold mt-1 block">ពិន្ទុមធ្យមត្រឹម ៥៤% ប៉ុណ្ណោះ</span>
        </div>

        <div className="bg-[#111317] p-4 rounded-2xl border border-white/5 shadow-xs">
          <span className="text-[11px] text-[#8E929E] font-medium">អត្រាជាប់សាកល្បងទូទាំងប្រទេស</span>
          <p className="text-xl font-bold text-emerald-400 mt-1">71.2%</p>
          <span className="text-[10px] text-emerald-300 font-bold mt-1 block">យោងតាម Mock Exam លើកទី ២</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Distribution */}
        <div className="bg-[#111317] p-5 rounded-2xl border border-white/5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>ការបែងចែកបេក្ខជនតាមរាជធានី-ខេត្ត</span>
            </h3>
            <span className="text-[11px] text-[#8E929E]">ចំនួនបេក្ខជន</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PROVINCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="name" stroke="#8E929E" tick={{ fontSize: 11, fill: '#8E929E' }} />
                <YAxis stroke="#8E929E" tick={{ fontSize: 11, fill: '#8E929E' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111317',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                />
                <Bar dataKey="candidates" fill="#6366f1" radius={[6, 6, 0, 0]} name="បេក្ខជន" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Performance & Weakness analysis */}
        <div className="bg-[#111317] p-5 rounded-2xl border border-white/5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-amber-400" />
              <span>ពិន្ទុមធ្យមភាគតាមមុខវិជ្ជា (%)</span>
            </h3>
            <span className="text-[11px] text-[#8E929E]">កម្រិតលទ្ធផល</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SUBJECT_PERFORMANCE} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis type="number" domain={[0, 100]} stroke="#8E929E" tick={{ fontSize: 11, fill: '#8E929E' }} />
                <YAxis dataKey="subject" type="category" stroke="#8E929E" tick={{ fontSize: 11, fill: '#8E929E' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111317',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                />
                <Bar dataKey="avgScore" fill="#10b981" radius={[0, 6, 6, 0]} name="ពិន្ទុមធ្យម %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Target Exam Level Share */}
        <div className="bg-[#111317] p-5 rounded-2xl border border-white/5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" />
            <span>សមាមាត្រកម្រិតប្រឡងគោលដៅ</span>
          </h3>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={TARGET_EXAM_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {TARGET_EXAM_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111317',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#8E929E' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Activity Trends */}
        <div className="bg-[#111317] p-5 rounded-2xl border border-white/5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>និន្នាការនៃការអនុវត្តវិញ្ញាសាប្រចាំខែ</span>
          </h3>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_PRACTICE_TRENDS} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="month" stroke="#8E929E" tick={{ fontSize: 11, fill: '#8E929E' }} />
                <YAxis stroke="#8E929E" tick={{ fontSize: 11, fill: '#8E929E' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111317',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#8E929E' }} />
                <Line type="monotone" dataKey="quizzes" stroke="#6366f1" strokeWidth={3} name="កម្រងសំណួរ (លើក)" />
                <Line type="monotone" dataKey="mocks" stroke="#f59e0b" strokeWidth={2} name="ប្រឡងសាកល្បង (នាក់)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
