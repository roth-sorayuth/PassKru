import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { GraduationCap, Phone, Mail, MapPin, Heart, ShieldCheck, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, t } = useLanguage();
  const { setCurrentPage } = useApp();

  const handleNav = (page: any) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-24 lg:pb-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Pass<span className="text-indigo-400">Kru</span>{lang === 'km' ? ' (ប៉ាសគ្រូ)' : ''}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {lang === 'km'
                ? 'វេទិកាត្រៀមប្រឡងគ្រូបង្រៀនក្របខណ្ឌរដ្ឋទូទាំងប្រទេសកម្ពុជា ជួយសិស្ស-និស្សិតកម្ពុជាឱ្យសម្រេចក្តីសុបិនក្លាយជាគ្រូបង្រៀនប្រកបដោយវិជ្ជាជីវៈខ្ពស់។'
                : 'All-in-one preparation platform helping Cambodian candidates master the National Teacher Examination for NIE, RTTC, PTTC, and Preschool.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {lang === 'km'
                  ? 'ឯកសារ និងវិញ្ញាសាផ្អែកលើស្តង់ដារ ក្រសួងអប់រំ យុវជន និងកីឡា'
                  : 'Curriculum & papers structured following official MoEYS standards'}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 tracking-wide uppercase">
              {lang === 'km' ? 'ព័ត៌មាន និងលក្ខខណ្ឌ' : 'Exam & Guidelines'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleNav('exam-info')} className="hover:text-white transition cursor-pointer">
                  {t('navExamInfo')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('requirements')} className="hover:text-white transition cursor-pointer">
                  {t('navRequirements')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('past-papers')} className="hover:text-white transition cursor-pointer">
                  {t('navPastPapers')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('practice')} className="hover:text-white transition cursor-pointer">
                  {t('navPractice')}
                </button>
              </li>
            </ul>
          </div>

          {/* Learning Tools */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 tracking-wide uppercase">
              {lang === 'km' ? 'ឧបករណ៍រៀន' : 'Learning Tools'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleNav('practice')} className="hover:text-white transition cursor-pointer">
                  {t('navPractice')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('quiz')} className="hover:text-white transition cursor-pointer">
                  {t('navQuiz')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('flashcards')} className="hover:text-white transition cursor-pointer">
                  {t('navFlashcards')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('study-plan')} className="hover:text-white transition cursor-pointer">
                  {t('navStudyPlan')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('weakness')} className="hover:text-white transition cursor-pointer">
                  {t('navWeakness')}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 tracking-wide uppercase">
              {lang === 'km' ? 'ជំនួយការសិក្សា' : 'Student Support'}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>Phnom Penh, Cambodia</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>support@passkru.edu.kh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>Telegram: @passkru_official</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 PassKru (ប៉ាសគ្រូ). {lang === 'km' ? 'រក្សាសិទ្ធិគ្រប់យ៉ាង។ វេទិកាអប់រំសម្រាប់យុវជនកម្ពុជា។' : 'All rights reserved. Dedicated to empowering Cambodian educators.'}</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>{lang === 'km' ? 'បង្កើតឡើងដោយទឹកចិត្តដើម្បីអប់រំកម្ពុជា' : 'Built with passion for Cambodian Education'}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
