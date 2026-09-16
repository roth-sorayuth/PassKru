import React from 'react';
import { motion } from 'motion/react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import rayuthAvatar from './asset/Rayuth.jpg';
import eychheanAvatar from './asset/Eychhean.jpg';
import layheangAvatar from './asset/Layheang.JPG';
import nolly from './asset/Nolly.jpg';
import LyHim from './asset/Lyhim.jpg'
import seyha from './asset/Seyha.jpg'

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  quote: string;
  category: string;
  avatar: string;
  socials?: {
    portfolio?: string;
    github?: string;
    linkedin?: string;
  };
}

export const teamMembers: TeamMember[] = [
  {
    id: 'PassKru1',
    name: 'Roth Sorayuth',
    role: 'ស្ថាបនិក & ប្រធានផ្នែកបច្ចេកទេស (Founder)',
    quote: '“ដឹកនាំការសម្រេចចិត្តសំខាន់ៗរបស់គម្រោង ចូលរួមអភិវឌ្ឍប្រព័ន្ធ Full-Stack និងផ្តល់ការគាំទ្រផ្នែកបច្ចេកទេសដល់ក្រុម។”',
    category: 'PassKru Core',
    avatar: rayuthAvatar,
    socials: {
      portfolio: 'https://passkru.com',
      github: 'https://github.com/roth-sorayuth',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'PassKru2',
    name: 'Rin LayHeang',
    role: 'ប្រធានផ្នែកហិរញ្ញវត្ថុ និងការចំណាយ (Co-Founder) ',
    quote: '“រៀបចំ និងគ្រប់គ្រងរចនាសម្ព័ន្ធចំណាយរបស់គម្រោងយ៉ាងច្បាស់លាស់ រួមមានការកំណត់តម្លៃ ចំណាយប្រតិបត្តិការ និងការរៀបចំផែនការហិរញ្ញវត្ថុ។”',
    category: 'Outreach',
    avatar: layheangAvatar,
    socials: {
      portfolio: 'https://rinlayheang.me',
      github: 'https://github.com/RinLayheang',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'PassKru3',
    name: 'So ChanNolly',
    role: 'អ្នកអភិវឌ្ឍន៍ផ្នែក Backend (Co-Founder)',
    quote: '“យើងប្តេជ្ញាលើកកម្ពស់សមភាពក្នុងការទទួលបានចំណេះដឹង និងបច្ចេកវិទ្យា ធានាថាគ្រប់និស្សិតគ្រប់រូបអាចរៀបចំខ្លួនបានយ៉ាងជឿជាក់។”',
    category: 'Leadership',
    avatar: nolly,
    socials: {
      portfolio: 'https://passkru.com',
      github: 'https://github.com/ChanNolly-So',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'PassKru4',
    name: 'Yun Eychhean',
    role: 'UI/UX និង Frontend Developer (Co-founder)',
    quote: '“រចនា និងអភិវឌ្ឍចំណុចប្រទាក់អ្នកប្រើ (UI/UX) ឱ្យមានភាពទាក់ទាញ ងាយស្រួលប្រើ និងមានភាព Responsive។”',
    category: 'Product UX',
    avatar: eychheanAvatar,
    socials: {
      portfolio: 'https://passkru.com',
      github: 'https://github.com/yuneychhean',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'PassKru5',
    name: 'Yoeung Seyha',
    role: 'អ្នកឯកទេសកម្មវិធីសិក្សា & វិញ្ញាសា (Curriculum)',
    quote: '“ការរៀបចំវិញ្ញាសាផ្អែកលើស្តង់ដារក្រសួងអប់រំ និងវប្បធម៌ទូទៅជាក់ស្តែង ជួយឱ្យបេក្ខជនធ្លាប់បានដឹងការប្រឡងប្រកួតប្រជែងគ្រប់វិញ្ញាសា។”',
    category: 'Pedagogy',
    avatar: seyha,
    socials: {
      portfolio: 'https://passkru.com',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'PassKru6',
    name: 'Ly Him',
    role: 'អ្នករចនាក្រាហ្វិក និង 3D',
    quote: '“ខ្ញុំចូលចិត្តបង្កើតការរចនាដែលមានភាពច្នៃប្រឌិត ទាក់ទាញ និងមានអត្ថន័យ តាមរយៈ Graphic Design និង 3D Design ដើម្បីបម្លែងគំនិតទៅជារូបភាពដែលគួរឱ្យចាប់អារម្មណ៍។”',
    category: 'Graphic & 3D Design',
    avatar: LyHim,
    socials: {
      portfolio: 'https://passkru.com',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
  },
  
];

export const TeamSection: React.FC = () => {
  const { lang } = useLanguage();

  return (
    <section id="team" className="pt-12 sm:pt-16 pb-16 sm:pb-24 scroll-mt-20 sm:scroll-mt-24">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3"
      >
        {/* Pill Badge */}
        <div className="inline-flex items-center px-4 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold shadow-xs">
          <span>{lang === 'km' ? 'ក្រុមការងារ និងថ្នាក់ដឹកនាំ' : 'Team & Leadership'}</span>
        </div>

        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-extrabold text-[#0f3360] tracking-tight">
          {lang === 'km' ? 'ជួបជាមួយក្រុមការងារនៅពីក្រោយ PassKru' : 'Meet the brains behind PassKru'}
        </h2>

        {/* Subtitle */}
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium max-w-2xl mx-auto pt-1">
          {lang === 'km'
            ? 'ជួបជាមួយអ្នកជំនាញអប់រំ វប្បធម៌ទូទៅ និងវិស្វករបច្ចេកវិទ្យា ដែលប្តេជ្ញាចិត្តជួយលោកអ្នកឆ្ពោះទៅកាន់ជោគជ័យក្នុងការប្រឡង។'
            : 'Meet the educators, pedagogy experts, and engineers committed to guiding you toward exam success.'}
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
        {teamMembers.map((member, idx) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-white rounded-[20px] sm:rounded-[24px] p-5 sm:p-6 lg:p-7 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Top Member Info */}
            <div>
              <div className="flex items-center gap-3.5 sm:gap-4">
                {/* Avatar with ring */}
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-slate-100 shadow-sm bg-slate-100">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = parent.querySelector('.avatar-fallback');
                        if (fallback) fallback.classList.remove('hidden');
                      }
                    }}
                  />
                  {/* Fallback initials ONLY if image fails to load */}
                  <div className="avatar-fallback hidden absolute inset-0 bg-[#0f3360] text-white font-bold text-xs sm:text-sm flex items-center justify-center select-none">
                    {member.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                </div>

                {/* Name & Role */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-[16px] sm:text-[17px] font-bold text-slate-900 tracking-tight truncate">
                    {member.name}
                  </h3>
                  <p className="text-[11.5px] sm:text-[12.5px] font-semibold text-blue-600 mt-0.5 leading-snug line-clamp-2">
                    {member.role}
                  </p>
                </div>
              </div>

              {/* Quote */}
              <p className="text-[13px] sm:text-[13.5px] leading-relaxed text-slate-600 mt-4 sm:mt-5 mb-5 sm:mb-6 font-normal">
                {member.quote}
              </p>
            </div>

            {/* Bottom Category Tag & Socials */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
              <span className="text-xs font-semibold text-slate-400 select-none">
                {member.category}
              </span>

              {/* Social / Link Icons */}
              <div className="flex items-center gap-1.5">
                {/* Portfolio Website */}
                <a
                  href={member.socials?.portfolio || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} Portfolio`}
                  title="Portfolio"
                  className="w-7 h-7 rounded-lg bg-slate-100/90 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                </a>

                {/* GitHub */}
                <a
                  href={member.socials?.github || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on GitHub`}
                  title="GitHub"
                  className="w-7 h-7 rounded-lg bg-slate-100/90 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href={member.socials?.linkedin || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on LinkedIn`}
                  title="LinkedIn"
                  className="w-7 h-7 rounded-lg bg-slate-100/90 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors font-bold text-[11px] leading-none"
                >
                  in
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
