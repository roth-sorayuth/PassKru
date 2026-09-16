import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  FileText,
  Bot,
  FileQuestion,
  ArrowRight,
  Check,
  Megaphone,
  BookOpen,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { TeamSection } from '../landing/TeamSection';
import { SEOHead } from '../common/SEOHead';

export const PublicLandingPage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const { lang } = useLanguage();
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sectionIds = ['hero', 'features', 'how-to-use', 'pricing', 'team', 'contact'];

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Bottom of page detection -> highlight contact
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 70) {
        setActiveSection('contact');
        return;
      }

      // Top of page
      if (window.scrollY < 120) {
        setActiveSection('hero');
        return;
      }

      // Find which section is currently active
      const offset = 180;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offset) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'hero', href: '#hero', label: lang === 'km' ? 'ទំព័រដើម' : 'Home' },
    { id: 'features', href: '#features', label: lang === 'km' ? 'លក្ខណៈពិសេស' : 'Features' },
    { id: 'how-to-use', href: '#how-to-use', label: lang === 'km' ? 'របៀបប្រើប្រាស់' : 'How It Works' },
    { id: 'pricing', href: '#pricing', label: lang === 'km' ? 'គម្រោងសមាជិក' : 'Pricing' },
    { id: 'team', href: '#team', label: lang === 'km' ? 'ក្រុមការងារ' : 'Team' },
    { id: 'contact', href: '#contact', label: lang === 'km' ? 'ទំនាក់ទំនង' : 'Contact' },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-900 font-sans antialiased flex flex-col selection:bg-blue-600 selection:text-white scroll-smooth overflow-x-hidden">

      {/* Header - Fixed so it always stays visible when scrolling down */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200 py-0'
            : 'bg-white/85 backdrop-blur-md border-b border-slate-200/60 py-1'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none"
            onClick={() => setCurrentPage('landing')}
          >
            <img
              src="/PassKru.svg"
              alt="PassKru Logo"
              className="h-8 sm:h-9 md:h-10 w-auto shrink-0 object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== window.location.origin + '/PassKru-logo.svg') {
                  target.src = '/PassKru-logo.svg';
                }
              }}
            />
            <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0f3360] tracking-tight">PassKru</p>
          </motion.div>

          {/* Desktop Navigation Menu (hidden on mobile and tablet < lg) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[15px] font-bold">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.id);
                  }}
                  className={`transition-all duration-200 pb-1 border-b-2 ${
                    isActive
                      ? 'text-[#0f3360] border-[#0f3360]'
                      : 'text-slate-600 border-transparent hover:text-[#0f3360] hover:border-[#0f3360]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setCurrentPage('login')}
              className="px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-[#0f3360] hover:bg-[#0a2342] rounded-lg transition shadow-sm cursor-pointer"
            >
              {lang === 'km' ? 'ចូលប្រើប្រាស់' : 'Sign In'}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <SEOHead
        title={lang === 'km' ? 'PassKru - វេទិកាត្រៀមប្រឡងគ្រូបង្រៀនក្របខណ្ឌរដ្ឋ' : 'PassKru - All-in-One Teacher Exam Platform'}
        description={
          lang === 'km'
            ? 'PassKru ជួយអ្នកស្វែងរកព័ត៌មានផ្លូវការ រៀនពីវិញ្ញាសាចាស់ៗ អនុវត្តតេស្ត និងទទួលបានផែនការសិក្សាត្រៀមប្រឡងគ្រូបង្រៀនក្របខណ្ឌ (NIE, RTTC, PTTC, គ្រូមត្តេយ្យ)។'
            : 'PassKru helps Cambodian candidates prepare for National Teacher Recruitment Exams with past papers, mock quizzes, and expert mentoring.'
        }
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'តើ PassKru ជាអ្វី?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'PassKru គឺជាវេទិកាអប់រំ និងត្រៀមប្រឡងគ្រូបង្រៀនក្របខណ្ឌរដ្ឋដំបូងគេនៅកម្ពុជា ដែលផ្តោតលើការប្រឡងគ្រូវិទ្យាល័យ (NIE) គ្រូអនុវិទ្យាល័យ (RTTC) គ្រូបឋម (PTTC) និងគ្រូមត្តេយ្យ។'
              }
            },
            {
              '@type': 'Question',
              'name': 'តើខ្ញុំអាចទាញយកវិញ្ញាសាចាស់ៗបានដោយរបៀបណា?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'អ្នកអាចចូលទៅកាន់ទំព័រ «បណ្តុំវិញ្ញាសា» ដើម្បីទាញយក និងមើលវិញ្ញាសាប្រឡងពីឆ្នាំ ២០១៨ ដល់ ២០២៥ គ្រប់មុខវិជ្ជាដោយសេរី។'
              }
            }
          ]
        }}
      />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        {/* 1. Hero Section */}
        <section id="hero" className="flex flex-col lg:flex-row items-center pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 gap-10 lg:gap-8 scroll-mt-24">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex-1 space-y-6 sm:space-y-8 lg:pr-10 w-full"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold leading-[1.25] sm:leading-[1.3] text-[#111827]">
              {lang === 'km' ? 'ត្រៀមប្រឡងគ្រូបង្រៀន' : 'Prepare for the Teacher Exam'}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0f3360] to-[#2563eb]">
                {lang === 'km' ? 'នៅកន្លែងតែមួយ' : 'All in One Place'}
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg font-medium">
              {lang === 'km'
                ? 'PassKru ជួយអ្នកស្វែងរកព័ត៌មានផ្លូវការ រៀនពីវិញ្ញាសាចាស់ អនុវត្តតេស្ត និងទទួលបានផែនការសិក្សាដែលសមស្របនឹងអ្នក'
                : 'PassKru helps you find official exam information, study from past papers, take practice tests, and get a tailored study plan'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03, translateY: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentPage('register')}
                className="w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-xl sm:rounded-lg bg-[#0f3360] hover:bg-[#0a2342] text-white font-bold text-sm transition shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{lang === 'km' ? 'ចាប់ផ្តើមត្រៀមប្រឡង' : 'Start Preparing'}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, translateY: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentPage('register')}
                className="w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-xl sm:rounded-lg bg-white border-2 border-[#0f3360] text-[#0f3360] hover:bg-slate-50 font-bold text-sm transition shadow-sm hover:shadow cursor-pointer flex items-center justify-center"
              >
                {lang === 'km' ? 'មើលព័ត៌មានប្រឡង' : 'View Exam Info'}
              </motion.button>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex-1 w-full relative"
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-white/50 backdrop-blur-sm border border-slate-200 group">
              <img
                src="/landing.jpeg"
                alt="Study Group"
                className="w-full h-[240px] sm:h-[320px] md:h-[380px] lg:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </section>

        {/* 2. Main Features Section */}
        <section id="features" className="pt-12 sm:pt-16 pb-16 sm:pb-20 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight">
              {lang === 'km' ? 'លក្ខណៈពិសេសចម្បង' : 'Key Features'}
            </h2>
            <div className="w-16 h-1 bg-[#0f3360] rounded-full mx-auto mt-3 sm:mt-4" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white rounded-[20px] sm:rounded-[24px] p-6 sm:p-7 lg:p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4 hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1e40af] flex items-center justify-center text-white shadow-inner mt-1 sm:mt-2 transition-transform duration-300 hover:rotate-6 hover:scale-110">
                <Megaphone className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-[18px] sm:text-[19px] font-bold text-slate-900 pt-1 sm:pt-2">{lang === 'km' ? 'ព័ត៌មានប្រឡង' : 'Exam Information'}</h3>
              <p className="text-[13.5px] sm:text-[14px] text-slate-500 font-medium leading-relaxed pb-2">
                {lang === 'km'
                  ? 'ព័ត៌មានប្រកាស ការលំហាត់ លក្ខខណ្ឌ និងកាលបរិច្ឆេទសំខាន់ៗ'
                  : 'Official announcements, conditions, criteria and important schedules'}
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white rounded-[20px] sm:rounded-[24px] p-6 sm:p-7 lg:p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4 hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#4ade80] flex items-center justify-center text-white shadow-inner mt-1 sm:mt-2 transition-transform duration-300 hover:rotate-6 hover:scale-110">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-[18px] sm:text-[19px] font-bold text-slate-900 pt-1 sm:pt-2">{lang === 'km' ? 'រៀន និងអនុវត្ត' : 'Learn & Practice'}</h3>
              <p className="text-[13.5px] sm:text-[14px] text-slate-500 font-medium leading-relaxed pb-2">
                {lang === 'km'
                  ? 'វិញ្ញាសាចាស់ សំណួរអនុវត្ត Quiz Flashcards និងប្រឡងសាកល្បង'
                  : 'Past exam papers, quizzes, mock tests and flashcard practice'}
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white rounded-[20px] sm:rounded-[24px] p-6 sm:p-7 lg:p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4 hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#92400e] flex items-center justify-center text-white shadow-inner mt-1 sm:mt-2 transition-transform duration-300 hover:rotate-6 hover:scale-110">
                <Calendar className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-[18px] sm:text-[19px] font-bold text-slate-900 pt-1 sm:pt-2">{lang === 'km' ? 'វគ្គសិក្សាផ្ទាល់ខ្លួន' : 'Personalized Course'}</h3>
              <p className="text-[13.5px] sm:text-[14px] text-slate-500 font-medium leading-relaxed pb-2">
                {lang === 'km'
                  ? 'AI ជួយរៀបចំផែនការសិក្សាផ្អែកលើពេលវេលា និងសមត្ថភាពរបស់អ្នក'
                  : 'AI builds personalized study schedules tailored to your pace and goals'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* 3. How to Use Section */}
        <section id="how-to-use" className="pt-12 sm:pt-16 pb-16 sm:pb-24 relative scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 lg:mb-20 space-y-3"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0f3360]">
              {lang === 'km' ? 'របៀបប្រើប្រាស់' : 'How to Use'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium max-w-xl mx-auto">
              {lang === 'km'
                ? 'ជំហានសាមញ្ញ និងមានរបៀបរៀបរយឆ្ពោះទៅរកភាពជោគជ័យក្នុងការប្រឡង។ អនុវត្តតាមជំហានទាំងនេះដើម្បីបង្កើនទំនុកចិត្ត និងចំណេះដឹងរបស់អ្នក។'
                : 'Simple, structured steps toward exam success. Follow these steps to build confidence and readiness.'}
            </p>
          </motion.div>

          <div className="relative max-w-6xl mx-auto">
            {/* SVG Connected Dashed Line with drawing animation (desktop only) */}
            <svg
              className="hidden lg:block absolute top-0 left-0 w-full h-36 pointer-events-none z-0"
              preserveAspectRatio="none"
              viewBox="0 0 1000 120"
            >
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                d="M 125 32 L 375 88 L 625 32 L 875 88"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="2.5"
                strokeDasharray="6 6"
              />
            </svg>

            {/* 4 Steps Grid: 1 col on mobile, 2 cols on tablet, 4 cols on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 relative z-10">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -6 }}
                className="flex flex-col items-center text-center cursor-default p-2 sm:p-3"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0f3360] flex items-center justify-center text-white shadow-xl mb-4 sm:mb-6 ring-6 sm:ring-8 ring-[#f8faff] transition-transform duration-300 hover:scale-110">
                  <UserPlus className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#0f3360] mb-2 sm:mb-3">
                  {lang === 'km' ? 'បង្កើតគណនី' : 'Create Account'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium max-w-[240px]">
                  {lang === 'km'
                    ? 'ការចុះឈ្មោះរហ័ស និងងាយស្រួលដើម្បីចាប់ផ្តើមដំណើររបស់អ្នក។ រក្សាទុកវឌ្ឍនភាពរបស់អ្នក និងចូលប្រើប្រាស់ធនធានផ្ទាល់ខ្លួន។'
                    : 'Quick and easy sign-up to start your learning path. Track progress and access personalized tools.'}
                </p>
              </motion.div>

              {/* Step 2 (Staggered Down on desktop) */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -6 }}
                className="flex flex-col items-center text-center lg:mt-14 cursor-default p-2 sm:p-3"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#854d0e] flex items-center justify-center text-white shadow-xl mb-4 sm:mb-6 ring-6 sm:ring-8 ring-[#f8faff] transition-transform duration-300 hover:scale-110">
                  <FileText className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#0f3360] mb-2 sm:mb-3">
                  {lang === 'km' ? 'មើលវិញ្ញាសា' : 'Browse Papers'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium max-w-[240px]">
                  {lang === 'km'
                    ? 'ចូលមើលវិញ្ញាសាប្រឡងចាស់ៗ និងឯកសារសិក្សាជាច្រើនដែលត្រូវបានរៀបចំយ៉ាងល្អតាមមុខវិជ្ជា និងឆ្នាំ។'
                    : 'Access categorized past examination papers and materials by subject and year.'}
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -6 }}
                className="flex flex-col items-center text-center cursor-default p-2 sm:p-3"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0f3360] flex items-center justify-center text-white shadow-xl mb-4 sm:mb-6 ring-6 sm:ring-8 ring-[#f8faff] transition-transform duration-300 hover:scale-110">
                  <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#0f3360] mb-2 sm:mb-3">
                  {lang === 'km' ? 'បង្កើតផែនការសិក្សាជាមួយ AI' : 'AI Study Plan'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium max-w-[240px]">
                  {lang === 'km'
                    ? 'អនុញ្ញាតឱ្យ AI របស់យើងបង្កើតកាលវិភាគផ្ទាល់ខ្លួនដែលស្របតាមគោលដៅ និងពេលវេលាសិក្សារបស់អ្នក។'
                    : 'Let AI generate a customized schedule tailored to your available hours and target exam.'}
                </p>
              </motion.div>

              {/* Step 4 (Staggered Down on desktop) */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -6 }}
                className="flex flex-col items-center text-center lg:mt-14 cursor-default p-2 sm:p-3"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#854d0e] flex items-center justify-center text-white shadow-xl mb-4 sm:mb-6 ring-6 sm:ring-8 ring-[#f8faff] transition-transform duration-300 hover:scale-110">
                  <FileQuestion className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#0f3360] mb-2 sm:mb-3">
                  {lang === 'km' ? 'ការប្រឡងសាកល្បងផ្ទាល់' : 'Live Mock Exams'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium max-w-[240px]">
                  {lang === 'km'
                    ? 'តេស្តសមត្ថភាពរបស់អ្នកជាមួយនឹងការប្រឡងសាកល្បង និងទទួលបានមតិកែលម្អភ្លាមៗដើម្បីដឹងពីចំណុចដែលត្រូវកែលម្អ។'
                    : 'Test your knowledge with real-time simulated exams and instant feedback.'}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 4. Pricing Section */}
        <section id="pricing" className="pt-12 sm:pt-16 pb-16 sm:pb-24 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight">
              {lang === 'km' ? 'គម្រោងសមាជិក' : 'Subscription Plans'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium max-w-xl mx-auto">
              {lang === 'km'
                ? 'ជ្រើសរើសគម្រោងដែលស័ក្តិសមបំផុតសម្រាប់ការត្រៀមប្រឡងរបស់អ្នក'
                : 'Choose the plan that best fits your teacher exam preparation'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-[20px] sm:rounded-[24px] p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col"
            >
              <h3 className="text-lg font-bold text-slate-900">{lang === 'km' ? 'ឥតគិតថ្លៃ' : 'Free'}</h3>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                {lang === 'km' ? 'ចាប់ផ្តើមត្រៀមប្រឡងភ្លាមៗ' : 'Everything to get started'}
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-[#111827]">{lang === 'km' ? '0$' : '$0'}</span>
                <span className="text-sm text-slate-400">/{lang === 'km' ? 'ខែ' : 'mo'}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {(lang === 'km'
                  ? ['ព័ត៌មានប្រឡង និងសេចក្តីប្រកាស', 'វិញ្ញាសាចាស់ និងលំហាត់ត្រៀម', 'វគ្គសិក្សាដោយ AI (មូលដ្ឋាន)']
                  : ['Exam info and announcements', 'Past papers and preparation materials', 'AI-generated course (basic)']
                ).map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentPage('register')}
                className="w-full py-3 rounded-xl border-2 border-[#0f3360] text-[#0f3360] font-bold text-sm hover:bg-slate-50 transition cursor-pointer"
              >
                {lang === 'km' ? 'ចាប់ផ្តើមឥឡូវនេះ' : 'Get started free'}
              </motion.button>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#0f3360] rounded-[20px] sm:rounded-[24px] p-6 sm:p-8 shadow-xl flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />
              <h3 className="text-lg font-bold text-white relative z-10">{lang === 'km' ? 'Premium' : 'Premium'}</h3>
              <p className="text-xs text-blue-200 mt-1 mb-5 relative z-10">
                {lang === 'km' ? 'សម្រាប់អ្នកដែលចង់ជោគជ័យលឿន' : 'For candidates who want the fastest path to passing'}
              </p>
              <div className="flex items-baseline gap-1 mb-6 relative z-10">
                <span className="text-4xl font-extrabold text-white">{lang === 'km' ? '2.49$' : '$2.49'}</span>
                <span className="text-sm text-blue-200">/{lang === 'km' ? 'ខែ' : 'mo'}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1 relative z-10">
                {(lang === 'km'
                  ? ['ការបង្កើតវគ្គសិក្សាដោយ AI គ្មានដែនកំណត់', 'ប្រឡងសាកល្បង Mock Exam គ្រប់ក្របខណ្ឌ', 'ការវិភាគចំណុចខ្សោយលម្អិត']
                  : ['Unlimited AI course generation', 'Full access to every mock exam', 'Detailed weak-area analytics']
                ).map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5 text-sm text-blue-100">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentPage('register')}
                className="w-full py-3 rounded-xl bg-white text-[#0f3360] font-bold text-sm hover:bg-blue-50 transition cursor-pointer shadow-md relative z-10"
              >
                {lang === 'km' ? 'ជ្រើសរើស Premium' : 'Get Premium'}
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* 5. Team Section - Meet the brains behind PassKru */}
        <TeamSection />

        {/* 6. Contact Section with interactive entrance */}
        <section id="contact" className="pt-12 sm:pt-16 pb-16 sm:pb-24 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="bg-[#0f3360] rounded-[24px] sm:rounded-[32px] overflow-hidden relative shadow-2xl"
          >
            {/* Decorative animated glow circles */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 relative z-10">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="p-6 sm:p-10 lg:p-14 xl:p-16 text-white flex flex-col justify-center"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4 sm:mb-6">{lang === 'km' ? 'ទំនាក់ទំនងមកកាន់យើងខ្ញុំ' : 'Get in Touch With Us'}</h2>
                <p className="text-blue-100 mb-8 sm:mb-10 text-base sm:text-lg leading-relaxed">
                  {lang === 'km'
                    ? 'ប្រសិនបើអ្នកមានចម្ងល់ ឬត្រូវការជំនួយទាក់ទងនឹងការប្រើប្រាស់ PassKru សូមកុំស្ទាក់ស្ទើរក្នុងការទាក់ទងមកយើងខ្ញុំ។ ក្រុមការងារយើងខ្ញុំតែងតែរង់ចាំជួយអ្នកជានិច្ច!'
                    : "If you have any questions or need help using PassKru, don't hesitate to reach out. Our team is always ready to help!"}
                </p>

                <div className="space-y-5 sm:space-y-6">
                  <motion.div
                    whileHover={{ x: 6 }}
                    className="flex items-center gap-3.5 sm:gap-4 cursor-pointer"
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-blue-200">{lang === 'km' ? 'លេខទូរស័ព្ទ' : 'Phone Number'}</p>
                      <p className="font-bold text-base sm:text-lg">+855 12 345 678</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 6 }}
                    className="flex items-center gap-3.5 sm:gap-4 cursor-pointer"
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-blue-200">{lang === 'km' ? 'អុីមែល' : 'Email'}</p>
                      <p className="font-bold text-base sm:text-lg">support@passkru.com</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 6 }}
                    className="flex items-center gap-3.5 sm:gap-4 cursor-pointer"
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-blue-200">{lang === 'km' ? 'ទីតាំង' : 'Location'}</p>
                      <p className="font-bold text-base sm:text-lg">{lang === 'km' ? 'រាជធានីភ្នំពេញ, កម្ពុជា' : 'Phnom Penh, Cambodia'}</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="flex items-center justify-center lg:justify-end p-4 sm:p-6 lg:p-10 xl:p-12"
              >
                <div className="bg-white p-5 sm:p-7 lg:p-8 rounded-[20px] sm:rounded-[24px] w-full max-w-[420px] shadow-xl">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-5">{lang === 'km' ? 'ផ្ញើសារមកកាន់យើង' : 'Send Us a Message'}</h3>
                  <form className="space-y-3.5 sm:space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                      <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">{lang === 'km' ? 'ឈ្មោះរបស់អ្នក' : 'Your Name'}</label>
                      <input type="text" className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0f3360] focus:bg-white transition" placeholder={lang === 'km' ? 'បញ្ចូលឈ្មោះរបស់អ្នក' : 'Enter your name'} />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">{lang === 'km' ? 'អុីមែលរបស់អ្នក' : 'Your Email'}</label>
                      <input type="email" className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0f3360] focus:bg-white transition" placeholder={lang === 'km' ? 'បញ្ចូលអុីមែលរបស់អ្នក' : 'Enter your email'} />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">{lang === 'km' ? 'សាររបស់អ្នក' : 'Your Message'}</label>
                      <textarea rows={3} className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0f3360] focus:bg-white transition resize-none" placeholder={lang === 'km' ? 'សរសេរសាររបស់អ្នកនៅទីនេះ...' : 'Write your message here...'}></textarea>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-3 bg-[#0f3360] hover:bg-[#0a2342] text-white rounded-xl font-bold text-sm transition shadow-md hover:shadow-lg mt-2 cursor-pointer"
                    >
                      {lang === 'km' ? 'ផ្ញើសារ' : 'Send Message'}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0f3360] text-blue-50 mt-auto pt-12 sm:pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-10 sm:mb-12">
            {/* Column 1: Logo & Info */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2.5 select-none">
                <div className="bg-white p-1.5 rounded-lg flex items-center justify-center w-10 h-10 shrink-0">
                  <img
                    src="/PassKru.svg"
                    alt="PassKru Logo"
                    className="h-6 w-auto shrink-0 object-contain"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== window.location.origin + '/PassKru-logo.svg') {
                        target.src = '/PassKru-logo.svg';
                      }
                    }}
                  />
                </div>
                <span className="font-extrabold text-2xl text-white tracking-tight">PassKru</span>
              </div>
              <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
                {lang === 'km'
                  ? 'PassKru ជួយអ្នកស្វែងរកព័ត៌មានផ្លូវការ រៀនពីវិញ្ញាសាចាស់ និងអនុវត្តតេស្ត។'
                  : 'PassKru helps you find official information, study from past papers, and take practice tests.'} <span className="text-[#fbbf24] italic">Made in Cambodia</span>
              </p>
              <div className="flex gap-3">
                <motion.a whileHover={{ scale: 1.15 }} href="#" className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0f3360] transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                </motion.a>
                <motion.a whileHover={{ scale: 1.15 }} href="#" className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0f3360] transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.888-.662 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                </motion.a>
                <motion.a whileHover={{ scale: 1.15 }} href="#" className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0f3360] transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                </motion.a>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4 sm:space-y-6">
              <h4 className="font-black text-white tracking-widest text-[13px] uppercase">{lang === 'km' ? 'សម្រាប់អ្នក' : 'For You'}</h4>
              <ul className="space-y-2.5 sm:space-y-3 text-sm text-blue-200">
                <li><a href="#" className="hover:text-white transition">{lang === 'km' ? 'ទំព័រដើម' : 'Home'}</a></li>
                <li><a href="#features" className="hover:text-white transition">{lang === 'km' ? 'លក្ខណៈពិសេស' : 'Features'}</a></li>
                <li><a href="#how-to-use" className="hover:text-white transition">{lang === 'km' ? 'របៀបប្រើប្រាស់' : 'How It Works'}</a></li>
                <li><a href="#pricing" className="hover:text-white transition">{lang === 'km' ? 'គម្រោងសមាជិកភាព' : 'Pricing'}</a></li>
                <li><a href="#team" className="hover:text-white transition">{lang === 'km' ? 'ក្រុមការងារ' : 'Team'}</a></li>
                <li><a href="#contact" className="hover:text-white transition">{lang === 'km' ? 'ទំនាក់ទំនង' : 'Contact'}</a></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-4 sm:space-y-6">
              <h4 className="font-black text-white tracking-widest text-[13px] uppercase">{lang === 'km' ? 'សម្រាប់បេក្ខជន' : 'For Candidates'}</h4>
              <ul className="space-y-2.5 sm:space-y-3 text-sm text-blue-200">
                <li><a href="#" className="hover:text-white transition">{lang === 'km' ? 'របៀបចុះឈ្មោះប្រឡង' : 'How to Register'}</a></li>
                <li><a href="#how-to-use" className="hover:text-white transition">{lang === 'km' ? 'របៀបប្រើប្រាស់ PassKru' : 'How to Use PassKru'}</a></li>
                <li><a href="#" className="hover:text-white transition">{lang === 'km' ? 'សំណួរដែលសួរញឹកញាប់' : 'FAQs'}</a></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="space-y-4 sm:space-y-6">
              <h4 className="font-black text-white tracking-widest text-[13px] uppercase">{lang === 'km' ? 'ទំនាក់ទំនង' : 'Contact'}</h4>
              <ul className="space-y-2.5 sm:space-y-3 text-sm text-blue-200">
                <li><a href="#" className="hover:text-white transition">Telegram &middot; @passkru_support</a></li>
                <li><a href="#" className="hover:text-white transition">hello@passkru.com</a></li>
                <li><a href="#" className="hover:text-white transition">passkru.com</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom border and copyright */}
          <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-300">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <span>&copy; {new Date().getFullYear()} PassKru Co., Ltd. &middot; PassKru - KH</span>
              <div className="flex gap-4">
                <a href="#" className="hover:text-white transition">Terms</a>
                <a href="#" className="hover:text-white transition">Privacy</a>
                <a href="#" className="hover:text-white transition">Cookies</a>
              </div>
            </div>
            <div className="font-medium text-[#4ade80] italic text-center sm:text-right">
              {lang === 'km' ? 'ប្រឡងជាប់ទាំងអស់គ្នា!' : 'Best of luck to all candidates!'}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
