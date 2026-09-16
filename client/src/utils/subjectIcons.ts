import React from 'react';
import {
  History,
  Calculator,
  BookOpen,
  Landmark,
  Languages,
  FlaskConical,
  Atom,
  Dna,
  Compass,
  Laptop,
  GraduationCap,
  Globe,
  Activity,
  Scale,
  FileText,
  type LucideIcon,
} from 'lucide-react';

export interface SubjectTheme {
  icon: LucideIcon;
  bg: string;
  text: string;
  border?: string;
  hoverBg: string;
  badgeTone?: string;
}

const DEFAULT_THEME: SubjectTheme = {
  icon: FileText,
  bg: 'bg-white',
  text: 'text-[#0a3263]',
  border: 'border-slate-200',
  hoverBg: 'group-hover:border-[#0a3263]',
  badgeTone: 'bg-slate-100 text-slate-700',
};

/**
 * Normalizes subject names by removing extra spaces, colons, and diacritical marks if needed,
 * converting to lower-case for English keywords.
 */
const normalizeSubjectName = (name?: string): string => {
  if (!name) return '';
  return name.trim().toLowerCase().replace(/[:：\s]+/g, ' ');
};

/**
 * Resolves a tailored SubjectTheme containing the icon and clean white background
 * with subject-specific icon accent colors.
 */
export const getSubjectTheme = (subjectName?: string): SubjectTheme => {
  const norm = normalizeSubjectName(subjectName);
  if (!norm) return DEFAULT_THEME;

  // 1. History (ប្រវត្តិវិទ្យា / ប្រវត្តិសាស្ត្រ)
  if (norm.includes('ប្រវត្តិ') || norm.includes('histor')) {
    return {
      icon: History,
      bg: 'bg-white',
      text: 'text-amber-600',
      border: 'border-slate-200',
      hoverBg: 'group-hover:border-amber-400 group-hover:bg-amber-50/50',
      badgeTone: 'bg-amber-50 text-amber-800',
    };
  }

  // 2. Mathematics (គណិតវិទ្យា)
  if (norm.includes('គណិត') || norm.includes('math') || norm.includes('ពិជគណិត') || norm.includes('ធរណីមាត្រ')) {
    return {
      icon: Calculator,
      bg: 'bg-white',
      text: 'text-blue-600',
      border: 'border-slate-200',
      hoverBg: 'group-hover:border-blue-400 group-hover:bg-blue-50/50',
      badgeTone: 'bg-blue-50 text-blue-700',
    };
  }

  // 3. Khmer Literature / Language (ភាសាខ្មែរ / អក្សរសាស្ត្រខ្មែរ)
  if (norm.includes('ខ្មែរ') || norm.includes('khmer') || norm.includes('តែងសេចក្តី')) {
    return {
      icon: BookOpen,
      bg: 'bg-white',
      text: 'text-emerald-600',
      border: 'border-slate-200',
      hoverBg: 'group-hover:border-emerald-400 group-hover:bg-emerald-50/50',
      badgeTone: 'bg-emerald-50 text-emerald-700',
    };
  }

  // 4. General Culture (វប្បធម៌ទូទៅ / ចំណេះដឹងទូទៅ)
  if (norm.includes('វប្បធម៌') || norm.includes('culture') || norm.includes('ចំណេះដឹងទូទៅ') || norm.includes('អារ្យធម៌')) {
    return {
      icon: Landmark,
      bg: 'bg-white',
      text: 'text-orange-600',
      border: 'border-slate-200',
      hoverBg: 'group-hover:border-orange-400 group-hover:bg-orange-50/50',
      badgeTone: 'bg-orange-50 text-orange-800',
    };
  }

  // 5. English Language (ភាសាអង់គ្លេស)
  if (norm.includes('អង់គ្លេស') || norm.includes('english')) {
    return {
      icon: Languages,
      bg: 'bg-white',
      text: 'text-indigo-600',
      border: 'border-slate-200',
      hoverBg: 'group-hover:border-indigo-400 group-hover:bg-indigo-50/50',
      badgeTone: 'bg-indigo-50 text-indigo-700',
    };
  }

  // 6. Chemistry (គីមីវិទ្យា)
  if (norm.includes('គីមី') || norm.includes('chem')) {
    return {
      icon: FlaskConical,
      bg: 'bg-white',
      text: 'text-purple-600',
      border: 'border-slate-200',
      hoverBg: 'group-hover:border-purple-400 group-hover:bg-purple-50/50',
      badgeTone: 'bg-purple-50 text-purple-700',
    };
  }

  // 7. Physics (រូបវិទ្យា)
  if (norm.includes('រូប') || norm.includes('physic')) {
    return {
      icon: Atom,
      bg: 'bg-white',
      text: 'text-rose-600',
      border: 'border-slate-200',
      hoverBg: 'group-hover:border-rose-400 group-hover:bg-rose-50/50',
      badgeTone: 'bg-rose-50 text-rose-700',
    };
  }

  // 8. Biology (ជីវវិទ្យា / ជីវ:វិទ្យា)
  if (norm.includes('ជីវ') || norm.includes('bio')) {
    return {
      icon: Dna,
      bg: 'bg-white',
      text: 'text-teal-600',
      border: 'border-slate-200',
      hoverBg: 'group-hover:border-teal-400 group-hover:bg-teal-50/50',
      badgeTone: 'bg-teal-50 text-teal-700',
    };
  }

  // 9. Geography (ភូមិវិទ្យា / ភូមិសាស្ត្រ)
  if (norm.includes('ភូមិ') || norm.includes('geograph') || norm.includes('geo')) {
    return {
      icon: Compass,
      bg: 'bg-white',
      text: 'text-cyan-600',
      border: 'border-slate-200',
      hoverBg: 'group-hover:border-cyan-400 group-hover:bg-cyan-50/50',
      badgeTone: 'bg-cyan-50 text-cyan-700',
    };
  }

  // 10. ICT / Computer (ICT / ព័ត៌មានវិទ្យា / កុំព្យូទ័រ)
  if (norm.includes('ict') || norm.includes('ព័ត៌មានវិទ្យា') || norm.includes('កុំព្យូទ័រ') || norm.includes('បច្ចេកវិទ្យា') || norm.includes('computer')) {
    return {
      icon: Laptop,
      bg: 'bg-white',
      text: 'text-violet-600',
      border: 'border-slate-200',
      hoverBg: 'group-hover:border-violet-400 group-hover:bg-violet-50/50',
      badgeTone: 'bg-violet-50 text-violet-700',
    };
  }

  // 11. Pedagogy / Teaching (គរុកោសល្យ / វិធីសាស្ត្របង្រៀន)
  if (norm.includes('គរុកោសល្យ') || norm.includes('បង្រៀន') || norm.includes('pedagog')) {
    return {
      icon: GraduationCap,
      bg: 'bg-white',
      text: 'text-sky-600',
      border: 'border-slate-200',
      hoverBg: 'group-hover:border-sky-400 group-hover:bg-sky-50/50',
      badgeTone: 'bg-sky-50 text-sky-700',
    };
  }

  // 12. Earth & Environmental Science (ផែនដី / បរិស្ថានវិទ្យា)
  if (norm.includes('ផែនដី') || norm.includes('បរិស្ថាន') || norm.includes('earth')) {
    return {
      icon: Globe,
      bg: 'bg-white',
      text: 'text-emerald-600',
      border: 'border-slate-200',
      hoverBg: 'group-hover:border-emerald-400 group-hover:bg-emerald-50/50',
      badgeTone: 'bg-emerald-50 text-emerald-700',
    };
  }

  // 13. Physical Education & Sport (អប់រំកាយ / កីឡា)
  if (norm.includes('អប់រំកាយ') || norm.includes('កីឡា') || norm.includes('sport')) {
    return {
      icon: Activity,
      bg: 'bg-white',
      text: 'text-red-600',
      border: 'border-slate-200',
      hoverBg: 'group-hover:border-red-400 group-hover:bg-red-50/50',
      badgeTone: 'bg-red-50 text-red-700',
    };
  }

  // 14. Civics & Ethics (សីលធម៌ / ពលរដ្ឋ)
  if (norm.includes('សីលធម៌') || norm.includes('ពលរដ្ឋ') || norm.includes('civic') || norm.includes('moral')) {
    return {
      icon: Scale,
      bg: 'bg-white',
      text: 'text-amber-600',
      border: 'border-slate-200',
      hoverBg: 'group-hover:border-amber-400 group-hover:bg-amber-50/50',
      badgeTone: 'bg-amber-50 text-amber-800',
    };
  }

  // 15. French (ភាសាបារាំង)
  if (norm.includes('បារាំង') || norm.includes('french')) {
    return {
      icon: Languages,
      bg: 'bg-white',
      text: 'text-blue-600',
      border: 'border-slate-200',
      hoverBg: 'group-hover:border-blue-400 group-hover:bg-blue-50/50',
      badgeTone: 'bg-blue-50 text-blue-700',
    };
  }

  // 16. Economics (សេដ្ឋកិច្ច)
  if (norm.includes('សេដ្ឋកិច្ច') || norm.includes('econom')) {
    return {
      icon: Landmark,
      bg: 'bg-white',
      text: 'text-emerald-600',
      border: 'border-slate-200',
      hoverBg: 'group-hover:border-emerald-400 group-hover:bg-emerald-50/50',
      badgeTone: 'bg-emerald-50 text-emerald-700',
    };
  }

  return DEFAULT_THEME;
};

/**
 * Returns the icon component corresponding to the subject name.
 */
export const getSubjectIcon = (subjectName?: string): LucideIcon => {
  return getSubjectTheme(subjectName).icon;
};
