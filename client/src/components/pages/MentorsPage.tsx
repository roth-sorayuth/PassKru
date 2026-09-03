import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { getMentors } from '../../services/mentorService';
import { Mentor } from '../../types';
import {
  Users,
  Star,
  Clock,
  Award,
  Search,
  CheckCircle2,
  Send,
  Calendar,
  MessageCircle,
  X,
  Loader2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const MentorsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { selectedMentor, setSelectedMentor } = useApp();

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch mentors from database API
  const fetchMentorsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMentors({
        search: searchQuery.trim() || undefined,
        subject: selectedSubject !== 'all' ? selectedSubject : undefined,
      });

      if (res?.success && Array.isArray(res.mentors)) {
        setMentors(res.mentors);
      } else {
        setMentors([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch mentors:', err);
      setError(err?.message || 'Could not load mentors from server');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedSubject]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMentorsData();
    }, 200);

    return () => clearTimeout(timer);
  }, [fetchMentorsData]);

  // Helper resolvers for mentor fields
  const getMentorName = (m: Mentor): string => {
    if (m.firstName || m.lastName) {
      return `${m.firstName || ''} ${m.lastName || ''}`.trim();
    }
    if (typeof m.name === 'object' && m.name) {
      return m.name[lang] || m.name.km || m.name.en || '';
    }
    return String(m.name || 'Master Mentor');
  };

  const getMentorTitle = (m: Mentor): string => {
    if (typeof m.title === 'object' && m.title) {
      return m.title[lang] || m.title.km || m.title.en || '';
    }
    return String(m.title || m.roleLabel || '');
  };

  const getMentorBio = (m: Mentor): string => {
    if (typeof m.bio === 'object' && m.bio) {
      return m.bio[lang] || m.bio.km || m.bio.en || '';
    }
    return String(m.bio || '');
  };

  const getMentorAvailability = (m: Mentor): string => {
    if (typeof m.availability === 'object' && m.availability) {
      return m.availability[lang] || m.availability.km || m.availability.en || '';
    }
    return String(m.availability || (lang === 'km' ? 'ចុងសប្តាហ៍ (Online)' : 'Weekends (Online)'));
  };

  const getMentorAvatar = (m: Mentor): string => {
    return (
      m.avatarUrl ||
      m.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
    );
  };

  const getMentorRating = (m: Mentor): string => {
    if (m.rating !== undefined && m.rating !== null) {
      return Number(m.rating).toFixed(2);
    }
    return '5.00';
  };

  const getSubjectLabel = (s: any): string => {
    if (typeof s === 'object' && s !== null) {
      return s[lang] || s.km || s.en || '';
    }
    return String(s || '');
  };

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

  const handleJoinTelegram = (username?: string) => {
    setTelegramJoinSuccess(true);
    setTimeout(() => setTelegramJoinSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <Users className="w-4 h-4" />
          <span>{lang === 'km' ? 'បណ្តាញគ្រូបង្វឹក & គរុសិស្សឆ្នើម (Live Database)' : 'Verified Mentors & Master Educators'}</span>
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
              placeholder={lang === 'km' ? 'ស្វែងរកគ្រូបង្វឹកតាមឈ្មោះ ឬមុខវិជ្ជា...' : 'Search mentors by name or subject...'}
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

            <button
              onClick={() => fetchMentorsData()}
              title="Refresh"
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeleton State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-200 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
              <div className="h-10 bg-slate-100 rounded-xl" />
              <div className="h-8 bg-slate-100 rounded-xl" />
              <div className="h-10 bg-slate-200 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-200 space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <h3 className="text-sm font-bold text-red-800">
            {lang === 'km' ? 'មិនអាចទាញយកទិន្នន័យគ្រូបង្វឹកបានទេ' : 'Failed to load mentors'}
          </h3>
          <p className="text-xs text-red-600">{error}</p>
          <button
            onClick={() => fetchMentorsData()}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            {lang === 'km' ? 'ព្យាយាមម្តងទៀត' : 'Try Again'}
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && mentors.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4 shadow-2xs">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {lang === 'km' ? 'រកមិនឃើញគ្រូបង្វឹកទេ' : 'No Mentors Found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {lang === 'km'
              ? 'សូមសាកល្បងស្វែងរកជាមួយពាក្យគន្លឹះផ្សេង ឬប្តូរមុខវិជ្ជា។'
              : 'Try searching with different keywords or switch the subject filter.'}
          </p>
        </div>
      )}

      {/* Mentors Grid */}
      {!loading && !error && mentors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map(mentor => {
            const mId = mentor.mentorId || mentor.id;
            const name = getMentorName(mentor);
            const title = getMentorTitle(mentor);
            const bio = getMentorBio(mentor);
            const avatar = getMentorAvatar(mentor);
            const rating = getMentorRating(mentor);
            const availability = getMentorAvailability(mentor);

            return (
              <div
                key={mId}
                onClick={() => handleOpenMentor(mentor)}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs hover:border-indigo-400 hover:shadow-md transition cursor-pointer space-y-5 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={avatar}
                      alt={name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-xs shrink-0 group-hover:scale-105 transition"
                    />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{rating}</span>
                        <span className="text-slate-400 font-normal">({mentor.reviewsCount || 0})</span>
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900 truncate group-hover:text-indigo-600 transition">
                        {name}
                      </h3>
                      <p className="text-xs text-indigo-600 font-semibold truncate">
                        {title}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {bio}
                  </p>

                  {/* Subjects */}
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(mentor.subjects) &&
                      mentor.subjects.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
                          {getSubjectLabel(s)}
                        </span>
                      ))}
                  </div>

                  {/* Experience & Availability */}
                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{mentor.experienceYears || 0} {lang === 'km' ? 'ឆ្នាំបទពិសោធន៍បង្រៀន' : 'years experience'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-slate-600 font-medium">{availability}</span>
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
            );
          })}
        </div>
      )}

      {/* Mentor Profile & Booking Modal */}
      {activeModalMentor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={getMentorAvatar(activeModalMentor)}
                  alt={getMentorName(activeModalMentor)}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                />
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">{getMentorName(activeModalMentor)}</h3>
                  <p className="text-xs text-indigo-600 font-semibold">{getMentorTitle(activeModalMentor)}</p>
                  <div className="flex items-center gap-1 text-xs text-amber-500 mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold">{getMentorRating(activeModalMentor)}</span>
                    <span className="text-slate-400">({activeModalMentor.reviewsCount || 0} {lang === 'km' ? 'ការវាយតម្លៃ' : 'reviews'})</span>
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
                {getMentorBio(activeModalMentor)}
              </p>
            </div>

            {/* Badges & Statistics */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-1">
                <span className="text-xs text-slate-500 font-medium">{lang === 'km' ? 'គរុសិស្សបានបណ្តុះបណ្តាល' : 'Candidates Mentored'}</span>
                <p className="text-lg font-black text-indigo-700">{activeModalMentor.studentsTrained || 0}+</p>
              </div>
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1">
                <span className="text-xs text-slate-500 font-medium">{lang === 'km' ? 'កម្រៃពិគ្រោះយោបល់' : 'Consultation Fee'}</span>
                <p className="text-xs font-bold text-emerald-700">{activeModalMentor.hourlyRate || (lang === 'km' ? 'ឥតគិតថ្លៃ' : 'Free')}</p>
              </div>
            </div>

            {/* Telegram Channel / Community */}
            {activeModalMentor.socialTelegram && (
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
            )}

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
