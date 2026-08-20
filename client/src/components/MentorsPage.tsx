import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { mockMentors } from '../data/mockData';
import { Mentor } from '../types';
import {
  Users,
  Star,
  Clock,
  Award,
  Search,
  Filter,
  CheckCircle2,
  Send,
  Calendar,
  MessageCircle,
  ExternalLink,
  X,
  Sparkles,
  Check
} from 'lucide-react';

export const MentorsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { selectedMentor, setSelectedMentor } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [activeModalMentor, setActiveModalMentor] = useState<Mentor | null>(null);
  const [selectedDate, setSelectedDate] = useState('2026-08-25');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('14:00 - 15:00');
  const [consultationNote, setConsultationNote] = useState('');
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [telegramJoinSuccess, setTelegramJoinSuccess] = useState(false);

  const subjects = [
    { id: 'all', label: { km: 'គ្រប់មុខវិជ្ជា', en: 'All Subjects' } },
    { id: 'pedagogy', label: { km: 'គរុកោសល្យ & ចិត្តវិទ្យា', en: 'Pedagogy & Psychology' } },
    { id: 'khmer', label: { km: 'អក្សរសាស្ត្រខ្មែរ', en: 'Khmer Literature' } },
    { id: 'math', label: { km: 'គណិតវិទ្យា & STEM', en: 'Math & STEM' } },
  ];

  const timeSlots = [
    '09:00 - 10:00 AM',
    '14:00 - 15:00 PM',
    '18:00 - 19:00 PM',
    '19:30 - 20:30 PM'
  ];

  const filteredMentors = mockMentors.filter(mentor => {
    const nameStr = mentor.name?.[lang] || mentor.name?.km || '';
    const titleStr = mentor.title?.[lang] || mentor.title?.km || '';
    const matchesSearch =
      nameStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      titleStr.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleOpenMentor = (mentor: Mentor) => {
    setActiveModalMentor(mentor);
    setShowBookingSuccess(false);
    setConsultationNote('');
  };

  const handleBookConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    setShowBookingSuccess(true);
    setTimeout(() => {
      setShowBookingSuccess(false);
      setActiveModalMentor(null);
    }, 2800);
  };

  const handleJoinTelegram = (username: string) => {
    setTelegramJoinSuccess(true);
    setTimeout(() => setTelegramJoinSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <Users className="w-4 h-4" />
          <span>{lang === 'km' ? 'បណ្តាញគ្រូបង្វឹក & គរុសិស្សឆ្នើម' : 'Verified Mentors & Master Educators'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          {lang === 'km' ? 'ពិគ្រោះយោបល់ជាមួយគ្រូបង្វឹកជើងចាស់' : 'Consult with Verified Teacher Mentors'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          {lang === 'km'
            ? 'ចុចលើប្រវត្តិរូបគ្រូណាមួយដើម្បីមើលសមិទ្ធផល ចូលរួមក្រុមតេឡេក្រាម ឬស្នើសុំណាត់ជួបពិគ្រោះយោបល់ ១ទល់១។'
            : 'Click any mentor to inspect credentials, join subject Telegram study channels, or request a 1-on-1 coaching session.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={lang === 'km' ? 'ស្វែងរកគ្រូបង្វឹកតាមឈ្មោះ...' : 'Search mentors by name...'}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full sm:w-auto">
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
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map(mentor => (
          <div
            key={mentor.id}
            onClick={() => handleOpenMentor(mentor)}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs hover:border-indigo-400 hover:shadow-md transition cursor-pointer space-y-5 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={mentor.avatar}
                  alt={mentor.name?.[lang] || mentor.name?.km || ''}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-xs shrink-0 group-hover:scale-105 transition"
                />
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{mentor.rating}</span>
                    <span className="text-slate-400 font-normal">({mentor.reviewsCount})</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 truncate group-hover:text-indigo-600 transition">
                    {mentor.name?.[lang] || mentor.name?.km || ''}
                  </h3>
                  <p className="text-xs text-indigo-600 font-semibold truncate">
                    {mentor.title?.[lang] || mentor.title?.km || ''}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {mentor.bio?.[lang] || mentor.bio?.km || ''}
              </p>

              {/* Subjects & Badges */}
              <div className="flex flex-wrap gap-1">
                {mentor.subjects?.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
                    {s?.[lang] || s?.km || ''}
                  </span>
                ))}
              </div>

              {/* Experience & Availability */}
              <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{mentor.experienceYears} {lang === 'km' ? 'ឆ្នាំបទពិសោធន៍បង្រៀន' : 'years experience'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-slate-600 font-medium">{mentor.availability?.[lang] || mentor.availability?.km || ''}</span>
                </div>
              </div>
            </div>

            <button
              onClick={e => {
                e.stopPropagation();
                handleOpenMentor(mentor);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 group-hover:bg-indigo-600 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>{lang === 'km' ? 'មើលប្រវត្តិ & ណាត់ជួប' : 'View Profile & Connect'}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Mentor Profile & Booking Modal */}
      {activeModalMentor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={activeModalMentor.avatar}
                  alt={activeModalMentor.name?.[lang] || activeModalMentor.name?.km || ''}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                />
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">{activeModalMentor.name?.[lang] || activeModalMentor.name?.km || ''}</h3>
                  <p className="text-xs text-indigo-600 font-semibold">{activeModalMentor.title?.[lang] || activeModalMentor.title?.km || ''}</p>
                  <div className="flex items-center gap-1 text-xs text-amber-500 mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold">{activeModalMentor.rating}</span>
                    <span className="text-slate-400">({activeModalMentor.reviewsCount} {lang === 'km' ? 'ការវាយតម្លៃ' : 'reviews'})</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveModalMentor(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">{lang === 'km' ? 'ជីវប្រវត្តិ & សមិទ្ធផល' : 'Biography & Credentials'}</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {activeModalMentor.bio?.[lang] || activeModalMentor.bio?.km || ''}
              </p>
            </div>

            {/* Badges & Statistics */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-1">
                <span className="text-xs text-slate-500 font-medium">{lang === 'km' ? 'គរុសិស្សបានបណ្តុះបណ្តាល' : 'Candidates Mentored'}</span>
                <p className="text-lg font-black text-indigo-700">{activeModalMentor.studentsTrained}+</p>
              </div>
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1">
                <span className="text-xs text-slate-500 font-medium">{lang === 'km' ? 'កម្រៃពិគ្រោះយោបល់' : 'Consultation Fee'}</span>
                <p className="text-xs font-bold text-emerald-700">{activeModalMentor.hourlyRate}</p>
              </div>
            </div>

            {/* Telegram Channel / Community */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-blue-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-blue-900">{lang === 'km' ? 'ក្រុមពិភាក្សា Telegram ផ្លូវការ' : 'Official Telegram Support'}</p>
                  <p className="text-[11px] text-blue-700">{activeModalMentor.socialTelegram}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleJoinTelegram(activeModalMentor.socialTelegram)}
                className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer shadow-xs"
              >
                {telegramJoinSuccess ? (lang === 'km' ? 'បានភ្ជាប់!' : 'Connected!') : (lang === 'km' ? 'ចូលរួម' : 'Join')}
              </button>
            </div>

            {/* Interactive Booking Form */}
            <form onSubmit={handleBookConsultation} className="space-y-4 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>{lang === 'km' ? 'កក់កាលវិភាគពិគ្រោះយោបល់' : 'Book 1-on-1 Consultation Session'}</span>
              </h4>

              {/* Time Slots */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">{lang === 'km' ? 'ជ្រើសរើសម៉ោង' : 'Select Time Slot'}</label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map(slot => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        selectedTimeSlot === slot
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note / Question */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">{lang === 'km' ? 'ប្រធានបទ ឬសំណួរដែលចង់ពិគ្រោះ' : 'Topic or question you need help with'}</label>
                <input
                  type="text"
                  value={consultationNote}
                  onChange={e => setConsultationNote(e.target.value)}
                  placeholder={lang === 'km' ? 'ឧទាហរណ៍៖ គន្លឹះតែងសេចក្តីគរុកោសល្យ NIE...' : 'e.g., Pedagogical Essay Strategy...'}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                />
              </div>

              {/* Booking Success Toast or Button */}
              {showBookingSuccess ? (
                <div className="p-4 bg-emerald-100 text-emerald-900 rounded-2xl text-center font-bold text-xs flex items-center justify-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'km' ? 'ការស្នើសុំពិគ្រោះយោបល់ត្រូវបានផ្ញើជោគជ័យ!' : 'Consultation request sent successfully!'}</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{lang === 'km' ? 'បញ្ជាក់ការស្នើសុំណាត់ជួប' : 'Confirm Consultation Request'}</span>
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
