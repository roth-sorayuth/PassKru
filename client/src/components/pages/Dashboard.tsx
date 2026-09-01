import React from 'react';
import { TrendingUp } from 'lucide-react';

import { CountdownCard } from '../dashboard/CountdownCard';
import { OverallProgressCard } from '../dashboard/OverallProgressCard';
import { ExamReadinessCard } from '../dashboard/ExamReadinessCard';
import { SubjectDonutChart } from '../dashboard/SubjectDonutChart';
import { AIInsightCard } from '../dashboard/AIInsightCard';
import { StreakCard } from '../dashboard/StreakCard';
import { ResourceUsageCard } from '../dashboard/ResourceUsageCard';
import { StudyTimeDistributionCard } from '../dashboard/StudyTimeDistributionCard';

// ---------------------------------------------------------------------------
// Mock Data (Static frontend demonstration)
// ---------------------------------------------------------------------------

const COUNTDOWN_DATA = {
  days: 75,
  hours: 14,
  minutes: 30,
};

const OVERALL_PROGRESS = {
  percent: 68,
  lessonsCompleted: 63,
  remaining: 32,
};

const EXAM_READINESS = {
  score: 75,
  maxScore: 100,
  statusLabel: 'ឱកាសជាប់ប្រឡងខ្ពស់',
};

const SUBJECT_DONUTS = [
  { percent: 75, label: 'គណិតវិទ្យា', completed: 15, total: 20, color: '#0a3263' },
  { percent: 40, label: 'រូបវិទ្យា',   completed: 8,  total: 20, color: '#5c3818' },
  { percent: 90, label: 'វប្បធម៌ទូទៅ', completed: 18, total: 20, color: '#0d7652' },
];

const AI_INSIGHT = {
  accuracy: 82,
  weeklyChange: 5,
  weakAreas: [
    { subject: 'គរុកោសល្យ', topic: 'វិធីសាស្ត្របង្រៀន', color: '#ef4444' },
    { subject: 'ប្រវត្តិវិទ្យា', topic: 'ប្រវត្តិសាស្ត្រទំនើប', color: '#b45309' },
  ],
};

const STREAK_DATA = {
  streakDays: 12,
  activeDayIndices: [0, 1, 2, 3], // Mon-Thu
};

const RESOURCES = [
  { label: 'វីដេអូ',       percent: 75, color: '#0a3263' },
  { label: 'កម្រងសំណួរ', percent: 50, color: '#5c3818' },
  { label: 'ឯកសារអាន',   percent: 45, color: '#0d7652' },
];

const STUDY_TIME_SUBJECTS = [
  { label: 'គណិតវិទ្យា', percent: 50, hours: 62, color: '#0a3263', strokeOffset: 0     },
  { label: 'រូបវិទ្យា',   percent: 30, hours: 37, color: '#5c3818', strokeOffset: 119.3 },
  { label: 'វប្បធម៌ទូទៅ', percent: 20, hours: 25, color: '#0d7652', strokeOffset: 167   },
];

// ---------------------------------------------------------------------------

export const Dashboard: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fadeIn max-w-[1400px] mx-auto text-slate-800">

      {/* ─── Section 1: សង្ខេបសកម្មភាព ─── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#0a3263]" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#0a2540]">
            សង្ខេបសកម្មភាព
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <CountdownCard
            days={COUNTDOWN_DATA.days}
            hours={COUNTDOWN_DATA.hours}
            minutes={COUNTDOWN_DATA.minutes}
          />
          <OverallProgressCard
            percent={OVERALL_PROGRESS.percent}
            lessonsCompleted={OVERALL_PROGRESS.lessonsCompleted}
            remaining={OVERALL_PROGRESS.remaining}
          />
          <ExamReadinessCard
            score={EXAM_READINESS.score}
            maxScore={EXAM_READINESS.maxScore}
            statusLabel={EXAM_READINESS.statusLabel}
          />
        </div>
      </div>

      {/* ─── Section 2: ទិន្នន័យវាយតម្លៃ និងការអនុវត្ត ─── */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0a2540]">
          ទិន្នន័យវាយតម្លៃ និងការអនុវត្ត
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Subject knowledge donuts — 8 cols */}
          <div className="md:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-[#0a2540]">ចំណេះដឹងតាមមុខវិជ្ជា</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-2 text-center">
              {SUBJECT_DONUTS.map((s) => (
                <SubjectDonutChart key={s.label} {...s} />
              ))}
            </div>
          </div>

          {/* AI Insight — 4 cols */}
          <AIInsightCard
            accuracy={AI_INSIGHT.accuracy}
            weeklyChange={AI_INSIGHT.weeklyChange}
            weakAreas={AI_INSIGHT.weakAreas}
          />
        </div>
      </div>

      {/* ─── Section 3: សកម្មភាព និងឥរិយាបថនៃការសិក្សា ─── */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0a2540]">
          សកម្មភាព និងឥរិយាបថនៃការសិក្សា
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StreakCard
            streakDays={STREAK_DATA.streakDays}
            activeDayIndices={STREAK_DATA.activeDayIndices}
          />
          <ResourceUsageCard resources={RESOURCES} />
          <StudyTimeDistributionCard subjects={STUDY_TIME_SUBJECTS} />
        </div>
      </div>

    </div>
  );
};
