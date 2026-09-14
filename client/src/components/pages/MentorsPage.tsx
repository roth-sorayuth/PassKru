import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '@clerk/clerk-react';
import { getMentors, createBooking } from '../../services/mentorService';
import { Mentor } from '../../types';
import { PageShell, PageHero, PageBody, FilterBar } from '../common/PageLayout';
import {
  Users,
  CheckCircle2,
  Send,
  Calendar,
  CalendarDays,
  X,
  Loader2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Check,
  LogIn,
  RefreshCw,
  Search
} from 'lucide-react';




/** Format Date to YYYY-MM-DD local timezone */
const toIsoDate = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const defaultSessionDate = (): string => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toIsoDate(d);
};

/** Normalize Telegram link/handle */
const buildTelegramUrl = (handle?: string): string | null => {
  const cleaned = (handle || '')
    .trim()
    .replace(/^https?:\/\/(www\.)?(t\.me|telegram\.me)\//i, '')
    .replace(/^@+/, '')
    .replace(/\/+$/, '');
  return cleaned ? `https://t.me/${cleaned}` : null;
};

const telegramDisplayHandle = (handle?: string): string => {
  const cleaned = (handle || '')
    .trim()
    .replace(/^https?:\/\/(www\.)?(t\.me|telegram\.me)\//i, '')
    .replace(/^@+/, '')
    .replace(/\/+$/, '');
  return cleaned ? `@${cleaned}` : '';
};

export const MentorsPage: React.FC = () => {
  const { lang } = useLanguage();
  const { isSignedIn, user } = useUser();

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [expandedBioIds, setExpandedBioIds] = useState<Record<string | number, boolean>>({});

  const toggleBioExpand = (mId: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedBioIds((prev) => ({
      ...prev,
      [mId]: !prev[mId],
    }));
  };

  const [activeModalMentor, setActiveModalMentor] = useState<Mentor | null>(null);
  const [selectedDate, setSelectedDate] = useState(defaultSessionDate);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('14:00 - 15:00 PM');
  const [consultationNote, setConsultationNote] = useState('');
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);


  const timeSlots = [
    { time: '09:00 - 10:00 AM', label: { km: 'ព្រឹក (09:00 - 10:00)', en: 'Morning' } },
    { time: '14:00 - 15:00 PM', label: { km: 'រសៀល (14:00 - 15:00)', en: 'Afternoon' } },
    { time: '18:00 - 19:00 PM', label: { km: 'ល្ងាច (18:00 - 19:00)', en: 'Evening' } },
    { time: '19:30 - 20:30 PM', label: { km: 'យប់ (19:30 - 20:30)', en: 'Night' } }
  ];

  // Fetch mentors from backend API (filtered by search/subject for the cards grid)
  const fetchMentorsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMentors();

      if (res?.success && Array.isArray(res.mentors)) {
        setMentors(res.mentors);
      } else {
        setMentors([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch mentors from backend:', err);
      setError(
        err?.message ||
          (lang === 'km'
            ? 'មិនអាចទាញទិន្នន័យគ្រូបង្វឹកបានទេ។ សូមពិនិត្យការតភ្ជាប់ internet ហើយព្យាយាមម្តងទៀត។'
            : 'Could not load mentors from the server. Please check your connection and try again.')
      );
      setMentors([]);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMentorsData();
    }, 200);

    return () => clearTimeout(timer);
  }, [fetchMentorsData]);

  // Modal close on Escape key
  useEffect(() => {
    if (!activeModalMentor) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModalMentor(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeModalMentor]);

  // Helper field accessors
  const getMentorName = (m: Mentor): string => {
    if (m.firstName || m.lastName) {
      return `${m.firstName || ''} ${m.lastName || ''}`.trim();
    }
    if (typeof m.name === 'object' && m.name) {
      return m.name[lang] || m.name.km || m.name.en || '';
    }
    return String(m.name || (lang === 'km' ? 'គ្រូបង្វឹកឆ្នើម' : 'Master Mentor'));
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
      return Number(m.rating).toFixed(1);
    }
    return '5.0';
  };

  const getSubjectLabel = (s: any): string => {
    if (typeof s === 'object' && s !== null) {
      return s[lang] || s.km || s.en || '';
    }
    return String(s || '');
  };

  const subjects = [
    { id: 'all', label: { km: 'គ្រប់មុខវិជ្ជា', en: 'All Subjects' } },
    { id: 'pedagogy', label: { km: 'គរុកោសល្យ & ចិត្តវិទ្យា', en: 'Pedagogy & Psychology' } },
    { id: 'khmer', label: { km: 'អក្សរសាស្ត្រខ្មែរ', en: 'Khmer Literature' } },
    { id: 'math', label: { km: 'គណិតវិទ្យា & STEM', en: 'Math & STEM' } },
    { id: 'culture', label: { km: 'វប្បធម៌ទូទៅ', en: 'General Culture' } },
  ];

  // Filter & Sort mentors
  const filteredMentors = useMemo(() => {
    let result = [...mentors];

    // Filter by subject
    if (selectedSubject !== 'all') {
      result = result.filter((mentor) => {
        const list = Array.isArray(mentor.subjects) ? mentor.subjects : [];
        return list.some((s: any) => {
          const en = (typeof s === 'object' ? s.en : String(s || '')).toLowerCase();
          const km = (typeof s === 'object' ? s.km : String(s || '')).toLowerCase();
          if (selectedSubject === 'pedagogy') {
            return (
              en.includes('pedagog') ||
              km.includes('គរុកោសល្យ') ||
              en.includes('psycholog') ||
              km.includes('ចិត្តវិទ្យា') ||
              en.includes('teaching') ||
              km.includes('បង្រៀន')
            );
          }
          if (selectedSubject === 'khmer') {
            return (
              en.includes('khmer') ||
              km.includes('ខ្មែរ') ||
              en.includes('literature') ||
              km.includes('អក្សរសាស្ត្រ') ||
              km.includes('តែងសេចក្តី') ||
              en.includes('essay')
            );
          }
          if (selectedSubject === 'math') {
            return en.includes('math') || km.includes('គណិត') || en.includes('stem');
          }
          if (selectedSubject === 'culture') {
            return en.includes('culture') || km.includes('វប្បធម៌');
          }
          return en.includes(selectedSubject) || km.includes(selectedSubject);
        });
      });
    }

    // Filter by search query (name, title, bio, or subject tags)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((mentor) => {
        const name = getMentorName(mentor).toLowerCase();
        const title = getMentorTitle(mentor).toLowerCase();
        const bio = getMentorBio(mentor).toLowerCase();
        const subjectsMatch = (Array.isArray(mentor.subjects) ? mentor.subjects : []).some((s: any) => {
          const en = (typeof s === 'object' ? s.en : String(s || '')).toLowerCase();
          const km = (typeof s === 'object' ? s.km : String(s || '')).toLowerCase();
          return en.includes(q) || km.includes(q);
        });
        return name.includes(q) || title.includes(q) || bio.includes(q) || subjectsMatch;
      });
    }

    // Sort: highest rated first
    result.sort((a, b) => Number(b.rating || 5) - Number(a.rating || 5));
    return result;
  }, [mentors, selectedSubject, searchQuery, lang]);

  const handleOpenMentor = (mentor: Mentor) => {
    setActiveModalMentor(mentor);
    setShowBookingSuccess(false);
    setBookingError(null);
    setConsultationNote('');
  };

  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    const mentorId = activeModalMentor?.mentorId || activeModalMentor?.id;
    if (!mentorId) return;

    if (!isSignedIn) {
      setBookingError(
        lang === 'km'
          ? 'សូមចូលគណនីរបស់អ្នកជាមុនសិន ដើម្បីកក់ការពិគ្រោះយោបល់។'
          : 'Please sign in to your account first to request a consultation.'
      );
      return;
    }

    setBookingLoading(true);
    setBookingError(null);
    try {
      await createBooking(mentorId, {
        sessionDate: selectedDate,
        timeSlot: selectedTimeSlot,
        note: consultationNote.trim() || undefined,
      });
      setShowBookingSuccess(true);
      setTimeout(() => {
        setShowBookingSuccess(false);
        setActiveModalMentor(null);
      }, 2600);
    } catch (err: any) {
      console.error('Failed to book consultation:', err);
      setBookingError(
        err?.message ||
          (lang === 'km'
            ? 'មិនអាចផ្ញើសំណើបានទេ សូមព្យាយាមម្តងទៀត។'
            : 'Could not send your request. Please try again.')
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const handleJoinTelegram = (username?: string) => {
    const url = buildTelegramUrl(username);
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const hasActiveFilters = searchQuery.trim().length > 0 || selectedSubject !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSubject('all');
  };

  return (
    <PageShell>
      <PageHero
        title={lang === 'km' ? 'ពិគ្រោះយោបល់ និងរៀនពីគ្រូបង្វឹកជើងចាស់' : 'Consult with Verified Teacher Mentors'}
        description={
          lang === 'km'
            ? 'ជួបផ្ទាល់ជាមួយសាស្ត្រាចារ្យ NIE, RTTC និងអតីតបេក្ខជនឆ្នើម ដើម្បីទទួលការណែនាំយុទ្ធសាស្ត្រប្រឡង ពិនិត្យតែងសេចក្តី និងចូលរួមក្រុមសិក្សា Telegram។'
            : 'Connect with former NIE gold medalists, RTTC teacher trainers, and pedagogical masters to review your exam tactics and join subject study channels.'
        }
      />

      <PageBody>
        <FilterBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          placeholder={
            lang === 'km'
              ? 'ស្វែងរកគ្រូបង្វឹកតាមឈ្មោះ ឯកទេស ឬមុខវិជ្ជា...'
              : 'Search mentors by name, specialty, or subject...'
          }
          clearSearchLabel={lang === 'km' ? 'សម្អាតការស្វែងរក' : 'Clear search'}
          count={{
            icon: Users,
            label: `${filteredMentors.length} ${lang === 'km' ? 'គ្រូបង្វឹក' : filteredMentors.length === 1 ? 'Mentor' : 'Mentors'}`,
          }}
          pills={subjects.map((sub) => ({ id: sub.id, label: sub.label[lang] || sub.label.km }))}
          activePill={selectedSubject}
          onPillChange={setSelectedSubject}
          reset={{ label: lang === 'km' ? 'សម្អាតតម្រង' : 'Reset', onClick: clearFilters, visible: hasActiveFilters }}
        />

        {/* API Error Banner */}
        {!loading && error && (
          <div className="p-5 bg-red-50 border border-red-200 rounded-3xl flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-red-800">
                {lang === 'km' ? 'មានបញ្ហាក្នុងការភ្ជាប់ Backend' : 'Backend Connection Error'}
              </p>
              <p className="text-xs text-red-600 mt-0.5 leading-relaxed">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => fetchMentorsData()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition cursor-pointer shrink-0 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'ព្យាយាមម្តងទៀត' : 'Retry'}</span>
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 animate-pulse shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-200 shrink-0" />
                  <div className="space-y-2 flex-1 pt-1">
                    <div className="h-5 bg-slate-200 rounded w-3/4" />
                    <div className="h-3.5 bg-slate-100 rounded w-1/2" />
                    <div className="h-4 bg-slate-100 rounded-full w-1/3 mt-2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3.5 bg-slate-100 rounded w-full" />
                  <div className="h-3.5 bg-slate-100 rounded w-5/6" />
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-24 bg-slate-100 rounded-full" />
                  <div className="h-6 w-20 bg-slate-100 rounded-full" />
                </div>
                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <div className="h-4 bg-slate-100 rounded" />
                  <div className="h-4 bg-slate-100 rounded" />
                </div>
                <div className="h-11 bg-slate-200 rounded-2xl" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredMentors.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4 shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {hasActiveFilters
                ? (lang === 'km' ? 'រកមិនឃើញគ្រូបង្វឹកដែលត្រូវនឹងលក្ខខណ្ឌ' : 'No Mentors Match Your Search')
                : (lang === 'km' ? 'មិនទាន់មានគ្រូបង្វឹកនៅឡើយទេ' : 'No Mentors Available')}
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              {hasActiveFilters
                ? (lang === 'km'
                    ? 'សូមសាកល្បងផ្លាស់ប្តូរពាក្យគន្លឹះ ឬជ្រើសរើសមុខវិជ្ជាផ្សេងទៀត។'
                    : 'Try adjusting your search keywords or clearing active filters.')
                : (lang === 'km'
                    ? 'មិនទាន់មានគ្រូបង្វឹកដែលបានអនុម័តនៅពេលនេះទេ។ សូមពិនិត្យមើលម្តងទៀតនៅពេលក្រោយ។'
                    : 'No approved mentors at the moment. Please check back later.')}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0f3360] hover:bg-[#0b2446] text-white font-bold text-xs transition cursor-pointer shadow-sm"
              >
                <X className="w-3.5 h-3.5" />
                <span>{lang === 'km' ? 'សម្អាតការស្វែងរក' : 'Clear Filters'}</span>
              </button>
            )}
          </div>
        )}

        {/* Mentors Cards Grid */}
        {!loading && filteredMentors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredMentors.map((mentor, idx) => {
              const mId = mentor.mentorId || mentor.id;
              const name = getMentorName(mentor);
              const title = getMentorTitle(mentor);
              const bio = getMentorBio(mentor);
              const avatar = getMentorAvatar(mentor);
              const subjectsList = Array.isArray(mentor.subjects) ? mentor.subjects : [];
              const visibleSubjects = subjectsList.slice(0, 3);
              const extraSubjects = subjectsList.length - visibleSubjects.length;
              const isExpanded = !!expandedBioIds[mId];

              return (
                <motion.div
                  key={mId}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  onClick={() => handleOpenMentor(mentor)}
                  className="bg-white rounded-[28px] border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer"
                >
                  {/* Card Top: 50% Height Full-width Picture */}
                  <div className="relative w-full h-64 sm:h-72 bg-slate-100 overflow-hidden shrink-0">
                    <img
                      src={avatar}
                      alt={name}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </div>

                  {/* Card Body: Info & Bio */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div className="flex-1 flex flex-col">
                      {/* Name & Title */}
                      <div className="min-h-[44px]">
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight truncate group-hover:text-[#0f3360] transition">
                          {name}
                        </h3>
                        <p className="text-xs font-semibold text-blue-600 line-clamp-1 mt-0.5">
                          {title}
                        </p>
                      </div>

                      {/* Bio excerpt (2 lines, expandable on click) */}
                      <div
                        onClick={(e) => toggleBioExpand(mId, e)}
                        className="mt-2.5 cursor-pointer group/bio"
                        title={lang === 'km' ? 'ចុចដើម្បីមើលបន្ថែម' : 'Click to see more'}
                      >
                        <p
                          className={`text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal transition-all duration-200 ${
                            isExpanded ? '' : 'line-clamp-2'
                          }`}
                        >
                          {bio}
                        </p>
                        {bio && bio.length > 60 && (
                          <button
                            type="button"
                            onClick={(e) => toggleBioExpand(mId, e)}
                            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline mt-1 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>
                              {isExpanded
                                ? (lang === 'km' ? 'មើលតិច' : 'See less')
                                : (lang === 'km' ? 'មើលបន្ថែម...' : 'See more...')}
                            </span>
                          </button>
                        )}
                      </div>

                      {/* Subject Tags - positioned near the underline */}
                      <div className="mt-auto pt-3 flex flex-wrap gap-1.5 pb-2.5">
                        {visibleSubjects.map((s, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-semibold shrink-0"
                          >
                            {getSubjectLabel(s)}
                          </span>
                        ))}
                        {extraSubjects > 0 && (
                          <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[11px] font-semibold shrink-0">
                            +{extraSubjects}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Bottom: Action Button */}
                    <div className="pt-3.5 border-t border-slate-100">
                      {/* Primary Book Session Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenMentor(mentor);
                        }}
                        className="w-full py-2.5 px-4 rounded-2xl bg-[#0f3360] hover:bg-[#0b2446] text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 group/btn cursor-pointer"
                      >
                        <span>{lang === 'km' ? 'កក់ការពិគ្រោះយោបល់' : 'Book Consultation'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </PageBody>

      {/* Interactive Consultation Booking Modal */}
      <AnimatePresence>
        {activeModalMentor && (
          <div
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
            onClick={() => setActiveModalMentor(null)}
            role="presentation"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              role="dialog"
              aria-modal="true"
              aria-label={getMentorName(activeModalMentor)}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl sm:rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200/90 flex flex-col"
            >
              {/* Modal Sticky Header */}
              <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100 px-5 sm:px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={getMentorAvatar(activeModalMentor)}
                    alt={getMentorName(activeModalMentor)}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                      {getMentorName(activeModalMentor)}
                    </h3>
                    <p className="text-xs text-blue-600 font-semibold truncate">
                      {getMentorTitle(activeModalMentor)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalMentor(null)}
                  aria-label={lang === 'km' ? 'បិទ' : 'Close'}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-5 sm:p-7 space-y-5 sm:space-y-6">
                {/* Bio & Credentials */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    {lang === 'km' ? 'អំពីគ្រូបង្វឹក & ឯកទេស' : 'About & Expertise'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {getMentorBio(activeModalMentor)}
                  </p>

                  {/* Subjects chips */}
                  {Array.isArray(activeModalMentor.subjects) && activeModalMentor.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {activeModalMentor.subjects.map((s, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold"
                        >
                          {getSubjectLabel(s)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Telegram Community Card */}
                {activeModalMentor.socialTelegram && buildTelegramUrl(activeModalMentor.socialTelegram) && (
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 flex items-center justify-center shrink-0 text-blue-600">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.673c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.414z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {lang === 'km' ? 'ក្រុមសិក្សា Telegram ផ្លូវការ' : 'Official Study Channel'}
                        </p>
                        <p className="text-[11px] text-blue-600 font-medium truncate">
                          {telegramDisplayHandle(activeModalMentor.socialTelegram)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleJoinTelegram(activeModalMentor.socialTelegram)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-[#0f3360] hover:bg-[#0b2446] text-white transition cursor-pointer shadow-sm shrink-0"
                    >
                      <span>{lang === 'km' ? 'ចូលរួម' : 'Join'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Booking Form Section */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    {lang === 'km' ? 'ស្នើសុំការពិគ្រោះយោបល់ ១ទល់១' : 'Book 1-on-1 Consultation'}
                  </h4>

                  {showBookingSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-6 text-center space-y-2"
                    >
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <h5 className="text-sm font-extrabold text-emerald-900">
                        {lang === 'km' ? 'ការស្នើសុំត្រូវបានផ្ញើជោគជ័យ!' : 'Consultation Request Sent!'}
                      </h5>
                      <p className="text-xs text-emerald-700 max-w-sm mx-auto leading-relaxed">
                        {lang === 'km'
                          ? `លោកគ្រូ/អ្នកគ្រូ ${getMentorName(activeModalMentor)} នឹងពិនិត្យនិងឆ្លើយតបការណាត់ជួបរបស់អ្នកតាមរយៈប្រព័ន្ធ។`
                          : `${getMentorName(activeModalMentor)} will review your consultation request and confirm your session shortly.`}
                      </p>
                    </motion.div>
                  ) : (
                    <form
                      onSubmit={handleBookConsultation}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4"
                    >
                      {/* Date Picker */}
                      <div className="space-y-1.5">
                        <label htmlFor="mentor-date-input" className="block text-xs font-bold text-slate-700">
                          {lang === 'km' ? 'កាលបរិច្ឆេទណាត់ជួប' : 'Preferred Date'}
                        </label>
                        <div className="relative">
                          <CalendarDays className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            id="mentor-date-input"
                            type="date"
                            value={selectedDate}
                            min={toIsoDate(new Date())}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full pl-10 pr-3 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f3360]/20 focus:border-[#0f3360] transition"
                          />
                        </div>
                      </div>

                      {/* Time Slots */}
                      <div className="space-y-1.5">
                        <span className="block text-xs font-bold text-slate-700">
                          {lang === 'km' ? 'ម៉ោងពិគ្រោះយោបល់' : 'Preferred Time Slot'}
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {timeSlots.map((slot) => {
                            const active = selectedTimeSlot === slot.time;
                            return (
                              <button
                                type="button"
                                key={slot.time}
                                aria-pressed={active}
                                onClick={() => setSelectedTimeSlot(slot.time)}
                                className={`p-2 sm:p-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition cursor-pointer border text-left flex items-center justify-between ${
                                  active
                                    ? 'bg-[#0f3360] text-white border-[#0f3360] shadow-sm'
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
                                }`}
                              >
                                <span>{slot.time}</span>
                                {active && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Question / Note */}
                      <div className="space-y-1.5">
                        <label htmlFor="mentor-note-input" className="block text-xs font-bold text-slate-700">
                          {lang === 'km' ? 'ប្រធានបទ ឬសំណួរចង់ពិគ្រោះ' : 'Topic or Question You Need Help With'}
                        </label>
                        <textarea
                          id="mentor-note-input"
                          rows={3}
                          value={consultationNote}
                          onChange={(e) => setConsultationNote(e.target.value)}
                          placeholder={
                            lang === 'km'
                              ? 'ឧទាហរណ៍៖ គន្លឹះតែងសេចក្តីគរុកោសល្យ NIE, ការដោះស្រាយវិញ្ញាសាគណិត...'
                              : 'e.g., Pedagogical essay structure, STEM exam shortcuts...'
                          }
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f3360]/20 focus:border-[#0f3360] font-medium resize-none transition"
                        />
                      </div>

                      {/* Error Alert */}
                      {bookingError && (
                        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{bookingError}</span>
                        </div>
                      )}

                      {/* Submit button */}
                      <div className="space-y-2 pt-1">
                        <button
                          type="submit"
                          disabled={bookingLoading}
                          className="w-full py-3 rounded-2xl bg-[#0f3360] hover:bg-[#0b2446] text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#0f3360]/30"
                        >
                          {bookingLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>{lang === 'km' ? 'កំពុងផ្ញើសំណើ...' : 'Sending Request...'}</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>{lang === 'km' ? 'បញ្ជាក់ការស្នើសុំណាត់ជួប' : 'Confirm Consultation Request'}</span>
                            </>
                          )}
                        </button>

                        {!isSignedIn && (
                          <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200 text-center">
                            {lang === 'km'
                              ? 'ចំណាំ៖ សូមចូលគណនីរបស់អ្នកដើម្បីអាចផ្ញើសំណើបានដោយរលូន។'
                              : 'Note: You must be signed in to submit this consultation request.'}
                          </p>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageShell>
  );
};
