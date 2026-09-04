import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getMentors, createBooking } from '../../services/mentorService';
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
  CalendarDays,
  MessageCircle,
  X,
  Loader2,
  RefreshCw,
  AlertCircle,
  BadgeCheck,
  ExternalLink,
  ArrowRight,
  Wallet,
  Sparkles
} from 'lucide-react';

/** Local YYYY-MM-DD (avoids the UTC shift of toISOString on evening timezones). */
const toIsoDate = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const defaultSessionDate = (): string => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toIsoDate(d);
};

/**
 * Normalises whatever the mentor profile stores in socialTelegram
 * ("@handle", "handle", or a full t.me URL) into a real Telegram link.
 */
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

/** Small section heading used to break the profile modal into scannable blocks. */
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-2">
    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 shrink-0">{children}</h4>
    <span className="h-px flex-1 bg-slate-100" />
  </div>
);

export const MentorsPage: React.FC = () => {
  const { lang } = useLanguage();

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [activeModalMentor, setActiveModalMentor] = useState<Mentor | null>(null);
  const [selectedDate, setSelectedDate] = useState(defaultSessionDate);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('14:00 - 15:00 PM');
  const [consultationNote, setConsultationNote] = useState('');
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

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

  // Close the profile modal on Escape.
  useEffect(() => {
    if (!activeModalMentor) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModalMentor(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeModalMentor]);

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
      return Number(m.rating).toFixed(1);
    }
    return '5.0';
  };

  const getReviewsCount = (m: Mentor): number => Number(m.reviewsCount || 0);

  /**
   * The moderation status lives on the API payload but not (yet) on the shared
   * Mentor type, so it is read defensively here. The public listing only
   * returns approved profiles — the badge is shown only when the field
   * actually says so, never inferred.
   */
  const isVerifiedMentor = (m: Mentor): boolean =>
    (m as Mentor & { status?: string }).status === 'approved';

  const getSubjectLabel = (s: any): string => {
    if (typeof s === 'object' && s !== null) {
      return s[lang] || s.km || s.en || '';
    }
    return String(s || '');
  };

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
      }, 2800);
    } catch (err: any) {
      console.error('Failed to book consultation:', err);
      setBookingError(err?.message || (lang === 'km' ? 'មិនអាចផ្ញើសំណើបានទេ សូមព្យាយាមម្តងទៀត' : 'Could not send your request. Please try again.'));
    } finally {
      setBookingLoading(false);
    }
  };

  /** Opens the mentor's real Telegram profile/channel in a new tab. */
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

  /** Rating / reviews treatment shared by the card and the modal header. */
  const RatingBlock: React.FC<{ mentor: Mentor }> = ({ mentor }) => {
    const reviews = getReviewsCount(mentor);
    if (reviews <= 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-semibold">
          <Sparkles className="w-3 h-3" />
          {lang === 'km' ? 'គ្រូបង្វឹកថ្មី' : 'New mentor'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px]">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-bold">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          {getMentorRating(mentor)}
        </span>
        <span className="text-slate-400 font-medium">
          {reviews} {lang === 'km' ? 'ការវាយតម្លៃ' : reviews === 1 ? 'review' : 'reviews'}
        </span>
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a3263]/[0.06] border border-[#0a3263]/20 text-[#0a3263] text-xs font-semibold">
          <Users className="w-3.5 h-3.5" />
          <span>{lang === 'km' ? 'បណ្តាញគ្រូបង្វឹក & គរុសិស្សឆ្នើម' : 'Verified Mentors & Master Educators'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {lang === 'km' ? 'ពិគ្រោះយោបល់ជាមួយគ្រូបង្វឹកជើងចាស់' : 'Consult with Verified Teacher Mentors'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {lang === 'km'
            ? 'ចុចលើប្រវត្តិរូបគ្រូណាមួយដើម្បីមើលសមិទ្ធផល ចូលរួមក្រុមតេឡេក្រាម ឬស្នើសុំណាត់ជួបពិគ្រោះយោបល់ ១ទល់១។'
            : 'Click any mentor to inspect credentials, join subject Telegram study channels, or request a 1-on-1 coaching session.'}
        </p>
      </div>

      {/* Search + Subject Filter control group */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1 min-w-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={lang === 'km' ? 'ស្វែងរកគ្រូបង្វឹកតាមឈ្មោះ ឬមុខវិជ្ជា...' : 'Search mentors by name or subject...'}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0a3263]/15 focus:border-[#0a3263] transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label={lang === 'km' ? 'សម្អាតការស្វែងរក' : 'Clear search'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => fetchMentorsData()}
              title={lang === 'km' ? 'ធ្វើបច្ចុប្បន្នភាព' : 'Refresh'}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-bold hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{lang === 'km' ? 'ធ្វើបច្ចុប្បន្នភាព' : 'Refresh'}</span>
            </button>
          </div>

          <div className="-mx-1 px-1 overflow-x-auto">
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 w-max">
              {subjects.map(subj => (
                <button
                  key={subj.id}
                  type="button"
                  onClick={() => setSelectedSubject(subj.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedSubject === subj.id
                      ? 'bg-[#0a3263] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  {subj.label[lang]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-5 py-2.5 border-t border-slate-100 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500 font-medium">
            {loading
              ? (lang === 'km' ? 'កំពុងទាញយក...' : 'Loading mentors...')
              : lang === 'km'
                ? `គ្រូបង្វឹក ${mentors.length} នាក់`
                : `${mentors.length} ${mentors.length === 1 ? 'mentor' : 'mentors'} available`}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-bold text-[#0a3263] hover:text-[#082447] transition cursor-pointer shrink-0"
            >
              {lang === 'km' ? 'សម្អាតតម្រង' : 'Clear filters'}
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeleton State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4 animate-pulse">
              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-slate-200 shrink-0" />
                <div className="space-y-2 flex-1 pt-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-4 bg-slate-100 rounded-full w-2/5 mt-2.5" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-4/5" />
              </div>
              <div className="flex gap-1.5">
                <div className="h-5 w-20 bg-slate-100 rounded-full" />
                <div className="h-5 w-16 bg-slate-100 rounded-full" />
              </div>
              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                <div className="h-3 bg-slate-100 rounded" />
                <div className="h-3 bg-slate-100 rounded" />
              </div>
              <div className="h-10 bg-slate-200 rounded-xl" />
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
          <p className="text-xs text-red-600 max-w-sm mx-auto break-words">{error}</p>
          <button
            onClick={() => fetchMentorsData()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
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
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            {lang === 'km'
              ? 'សូមសាកល្បងស្វែងរកជាមួយពាក្យគន្លឹះផ្សេង ឬប្តូរមុខវិជ្ជា។'
              : 'Try searching with different keywords or switch the subject filter.'}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0a3263] hover:bg-[#082447] text-white font-bold text-xs shadow-xs transition cursor-pointer"
            >
              {lang === 'km' ? 'សម្អាតតម្រង' : 'Clear filters'}
            </button>
          )}
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
            const availability = getMentorAvailability(mentor);
            const verified = isVerifiedMentor(mentor);
            const subjectList = Array.isArray(mentor.subjects) ? mentor.subjects : [];
            const visibleSubjects = subjectList.slice(0, 3);
            const extraSubjects = subjectList.length - visibleSubjects.length;

            return (
              <div
                key={mId}
                onClick={() => handleOpenMentor(mentor)}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-md transition cursor-pointer p-5 flex flex-col group"
              >
                {/* Identity: name and specialty lead */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={avatar}
                    alt={name}
                    loading="lazy"
                    className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h3 className="text-[15px] font-extrabold text-slate-900 truncate group-hover:text-[#0a3263] transition">
                        {name}
                      </h3>
                      {verified && (
                        <span
                          title={lang === 'km' ? 'ប្រវត្តិរូបបានផ្ទៀងផ្ទាត់' : 'Verified mentor profile'}
                          className="shrink-0 inline-flex text-[#0a3263]"
                        >
                          <BadgeCheck className="w-4 h-4" />
                          <span className="sr-only">{lang === 'km' ? 'បានផ្ទៀងផ្ទាត់' : 'Verified'}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                      {title}
                    </p>
                    <div className="mt-2">
                      <RatingBlock mentor={mentor} />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-4">
                  {bio}
                </p>

                {/* Subjects */}
                {visibleSubjects.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {visibleSubjects.map((s, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-semibold"
                      >
                        {getSubjectLabel(s)}
                      </span>
                    ))}
                    {extraSubjects > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-[11px] font-semibold">
                        +{extraSubjects}
                      </span>
                    )}
                  </div>
                )}

                {/* Experience & Availability */}
                <div className="mt-auto pt-4">
                  <div className="pt-3.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-600 min-w-0">
                      <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        <span className="font-bold text-slate-800">{mentor.experienceYears || 0}</span>{' '}
                        {lang === 'km' ? 'ឆ្នាំបទពិសោធន៍' : 'yrs experience'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 min-w-0">
                      <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate font-medium">{availability}</span>
                    </div>
                  </div>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleOpenMentor(mentor);
                    }}
                    className="mt-4 w-full py-2.5 rounded-xl bg-[#0a3263] hover:bg-[#082447] text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#0a3263]/30"
                  >
                    <span>{lang === 'km' ? 'មើលប្រវត្តិ & ណាត់ជួប' : 'View Profile & Connect'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mentor Profile & Booking Modal */}
      {activeModalMentor && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
          onClick={() => setActiveModalMentor(null)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={getMentorName(activeModalMentor)}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-scaleUp"
          >
            {/* Sticky identity header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xs border-b border-slate-100 px-5 sm:px-7 py-4 flex items-start justify-between gap-3 rounded-t-3xl">
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={getMentorAvatar(activeModalMentor)}
                  alt={getMentorName(activeModalMentor)}
                  className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
                      {getMentorName(activeModalMentor)}
                    </h3>
                    {isVerifiedMentor(activeModalMentor) && (
                      <span
                        title={lang === 'km' ? 'ប្រវត្តិរូបបានផ្ទៀងផ្ទាត់' : 'Verified mentor profile'}
                        className="shrink-0 inline-flex text-[#0a3263]"
                      >
                        <BadgeCheck className="w-4 h-4" />
                        <span className="sr-only">{lang === 'km' ? 'បានផ្ទៀងផ្ទាត់' : 'Verified'}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium truncate">{getMentorTitle(activeModalMentor)}</p>
                  <div className="mt-1.5">
                    <RatingBlock mentor={activeModalMentor} />
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveModalMentor(null)}
                aria-label={lang === 'km' ? 'បិទ' : 'Close'}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 sm:px-7 py-5 space-y-6">
              {/* At a glance */}
              <section className="space-y-2.5">
                <SectionLabel>{lang === 'km' ? 'ទិន្នន័យសង្ខេប' : 'At a glance'}</SectionLabel>
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <Users className="w-4 h-4 text-[#0a3263]" />
                    <p className="text-base font-black text-slate-900 leading-none">
                      {activeModalMentor.studentsTrained || 0}+
                    </p>
                    <span className="block text-[10px] text-slate-500 font-medium leading-tight">
                      {lang === 'km' ? 'គរុសិស្សបានបណ្តុះបណ្តាល' : 'Candidates mentored'}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <Award className="w-4 h-4 text-indigo-500" />
                    <p className="text-base font-black text-slate-900 leading-none">
                      {activeModalMentor.experienceYears || 0}
                    </p>
                    <span className="block text-[10px] text-slate-500 font-medium leading-tight">
                      {lang === 'km' ? 'ឆ្នាំបទពិសោធន៍' : 'Years experience'}
                    </span>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 space-y-1">
                    <Wallet className="w-4 h-4 text-emerald-600" />
                    <p className="text-sm font-black text-emerald-800 leading-none truncate">
                      {activeModalMentor.hourlyRate || (lang === 'km' ? 'ឥតគិតថ្លៃ' : 'Free')}
                    </p>
                    <span className="block text-[10px] text-slate-500 font-medium leading-tight">
                      {lang === 'km' ? 'កម្រៃពិគ្រោះយោបល់' : 'Consultation fee'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600 pt-0.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="font-medium">{getMentorAvailability(activeModalMentor)}</span>
                </div>
              </section>

              {/* Bio + subjects */}
              <section className="space-y-2.5">
                <SectionLabel>{lang === 'km' ? 'ជីវប្រវត្តិ & សមិទ្ធផល' : 'Biography & credentials'}</SectionLabel>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {getMentorBio(activeModalMentor)}
                </p>
                {Array.isArray(activeModalMentor.subjects) && activeModalMentor.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeModalMentor.subjects.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold"
                      >
                        {getSubjectLabel(s)}
                      </span>
                    ))}
                  </div>
                )}
              </section>

              {/* Telegram */}
              {activeModalMentor.socialTelegram && buildTelegramUrl(activeModalMentor.socialTelegram) && (
                <section className="space-y-2.5">
                  <SectionLabel>{lang === 'km' ? 'ទំនាក់ទំនង' : 'Direct contact'}</SectionLabel>
                  <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-9 h-9 rounded-xl bg-blue-600/10 flex items-center justify-center shrink-0">
                        <MessageCircle className="w-4.5 h-4.5 text-blue-600" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-blue-900 truncate">
                          {lang === 'km' ? 'ក្រុមពិភាក្សា Telegram ផ្លូវការ' : 'Official Telegram channel'}
                        </p>
                        <p className="text-[11px] text-blue-700 truncate">
                          {telegramDisplayHandle(activeModalMentor.socialTelegram)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleJoinTelegram(activeModalMentor.socialTelegram)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer shadow-xs shrink-0"
                    >
                      <span>{lang === 'km' ? 'បើក' : 'Open'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </section>
              )}

              {/* Booking */}
              <section className="space-y-2.5">
                <SectionLabel>{lang === 'km' ? 'ណាត់ជួបពិគ្រោះយោបល់' : 'Book a session'}</SectionLabel>

                {showBookingSuccess ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center space-y-2 animate-fadeIn">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h5 className="text-sm font-bold text-emerald-900">
                      {lang === 'km' ? 'ការស្នើសុំត្រូវបានផ្ញើជោគជ័យ!' : 'Consultation request sent!'}
                    </h5>
                    <p className="text-xs text-emerald-700">
                      {lang === 'km'
                        ? `${getMentorName(activeModalMentor)} នឹងបញ្ជាក់ការណាត់ជួបរបស់អ្នកឆាប់ៗនេះ។`
                        : `${getMentorName(activeModalMentor)} will confirm your session shortly.`}
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleBookConsultation}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-4"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                      <Calendar className="w-4 h-4 text-[#0a3263]" />
                      <span>{lang === 'km' ? 'កក់កាលវិភាគ ១ទល់១' : 'Request a 1-on-1 consultation'}</span>
                    </div>

                    {/* Date */}
                    <div className="space-y-1.5">
                      <label htmlFor="mentor-session-date" className="block text-[11px] font-bold text-slate-600">
                        {lang === 'km' ? 'ជ្រើសរើសកាលបរិច្ឆេទ' : 'Preferred date'}
                      </label>
                      <div className="relative">
                        <CalendarDays className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="mentor-session-date"
                          type="date"
                          value={selectedDate}
                          min={toIsoDate(new Date())}
                          onChange={e => setSelectedDate(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a3263]/15 focus:border-[#0a3263] transition"
                        />
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div className="space-y-1.5">
                      <span className="block text-[11px] font-bold text-slate-600">
                        {lang === 'km' ? 'ជ្រើសរើសម៉ោង' : 'Preferred time slot'}
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map(slot => {
                          const active = selectedTimeSlot === slot;
                          return (
                            <button
                              type="button"
                              key={slot}
                              aria-pressed={active}
                              onClick={() => setSelectedTimeSlot(slot)}
                              className={`px-2 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition cursor-pointer border ${
                                active
                                  ? 'bg-[#0a3263] text-white border-[#0a3263] shadow-2xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Note / Question */}
                    <div className="space-y-1.5">
                      <label htmlFor="mentor-consultation-note" className="block text-[11px] font-bold text-slate-600">
                        {lang === 'km' ? 'ប្រធានបទ ឬសំណួរដែលចង់ពិគ្រោះ' : 'Topic or question you need help with'}
                      </label>
                      <textarea
                        id="mentor-consultation-note"
                        rows={2}
                        value={consultationNote}
                        onChange={e => setConsultationNote(e.target.value)}
                        placeholder={lang === 'km' ? 'ឧទាហរណ៍៖ គន្លឹះតែងសេចក្តីគរុកោសល្យ NIE...' : 'e.g., Pedagogical Essay Strategy...'}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a3263]/15 focus:border-[#0a3263] font-medium resize-none transition"
                      />
                    </div>

                    {/* Booking Error */}
                    {bookingError && (
                      <div
                        role="alert"
                        className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold flex items-start gap-2"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
                        <span className="break-words">{bookingError}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <button
                        type="submit"
                        disabled={bookingLoading}
                        className="w-full py-3 rounded-xl bg-[#0a3263] hover:bg-[#082447] text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#0a3263]/30"
                      >
                        {bookingLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{lang === 'km' ? 'កំពុងផ្ញើសំណើ...' : 'Sending request...'}</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>{lang === 'km' ? 'បញ្ជាក់ការស្នើសុំណាត់ជួប' : 'Confirm consultation request'}</span>
                          </>
                        )}
                      </button>
                      <p className="text-[10px] text-slate-400 text-center leading-tight">
                        {lang === 'km'
                          ? 'សំណើនេះត្រូវផ្ញើទៅគ្រូបង្វឹក ហើយត្រូវរង់ចាំការបញ្ជាក់។'
                          : 'This sends a request — the mentor still needs to confirm the session.'}
                      </p>
                    </div>
                  </form>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
