import React, { useState, useEffect } from 'react';
import { UserPlus, FileText, Bot, FileQuestion, ArrowRight } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

export const PublicLandingPage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const { lang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-900 font-sans antialiased flex flex-col selection:bg-blue-600 selection:text-white scroll-smooth overflow-x-hidden">
      {/* Scroll Progress Bar at the Top */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0f3360] via-[#3b82f6] to-[#4ade80] origin-left z-50 pointer-events-none"
        style={{ scaleX }}
      />

      {/* Header - Fixed so it always stays visible when scrolling down */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200 py-0'
            : 'bg-white/85 backdrop-blur-md border-b border-slate-200/60 py-1'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => setCurrentPage('landing')}
          >
            <img src="/PassKru.svg" alt="PassKru Logo" className="h-10 w-auto" />
            <p className="text-3xl font-extrabold text-[#0f3360] tracking-tight">PassKru</p>
          </motion.div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-bold text-slate-600">
            <a
              href="#"
              className="text-[#0f3360] border-b-2 border-[#0f3360] pb-1 transition-colors hover:text-[#0f3360]"
            >
              {lang === 'km' ? 'ទំព័រដើម' : 'Home'}
            </a>
            <a
              href="#features"
              className="hover:text-[#0f3360] transition-colors pb-1 hover:border-b-2 hover:border-[#0f3360]"
            >
              {lang === 'km' ? 'លក្ខណៈពិសេស' : 'Features'}
            </a>
            <a
              href="#how-to-use"
              className="hover:text-[#0f3360] transition-colors pb-1 hover:border-b-2 hover:border-[#0f3360]"
            >
              {lang === 'km' ? 'របៀបប្រើប្រាស់' : 'How It Works'}
              {lang === 'km' ? 'របៀបប្រើប្រាស់' : 'How to Use'}
            </a>
            <a
              href="#contact"
              className="hover:text-[#0f3360] transition-colors pb-1 hover:border-b-2 hover:border-[#0f3360]"
            >
              {lang === 'km' ? 'ទំនាក់ទំនង' : 'Contact'}
            </a>
          </nav>

          {/* Buttons and Icons */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setCurrentPage('login')}
              className="px-6 py-2.5 text-sm font-bold text-white bg-[#0f3360] hover:bg-[#0a2342] rounded-lg transition shadow-sm cursor-pointer"
            >
              {lang === 'km' ? 'ចូលប្រើប្រាស់' : 'Sign In'}
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-10 h-10 rounded-full border border-[#0f3360] flex items-center justify-center text-[#0f3360] cursor-pointer hover:bg-slate-100 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        {/* 1. Hero Section */}
        <section className="flex flex-col lg:flex-row items-center pt-16 pb-20 gap-12 lg:gap-8">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex-1 space-y-8 lg:pr-10"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold leading-[1.3] text-[#111827]">
              {lang === 'km' ? 'ត្រៀមប្រឡងគ្រូបង្រៀន' : 'Prepare for the Teacher Exam'}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0f3360] to-[#2563eb]">
                {lang === 'km' ? 'នៅកន្លែងតែមួយ' : 'All in One Place'}
              </span>
              {lang === 'km' ? (
                <>
                  ត្រៀមប្រឡងគ្រូបង្រៀន<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0f3360] to-[#2563eb]">
                    នៅកន្លែងតែមួយ
                  </span>
                </>
              ) : (
                <>
                  Prepare for the Teacher Exam<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0f3360] to-[#2563eb]">
                    All in One Place
                  </span>
                </>
              )}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg font-medium">
              {lang === 'km'
                ? 'PassKru ជួយអ្នកស្វែងរកព័ត៌មានផ្លូវការ រៀនពីវិញ្ញាសាចាស់ អនុវត្តតេស្ត និងទទួលបានផែនការសិក្សាដែលសមស្របនឹងអ្នក'
                : 'PassKru helps you find official exam information, study from past papers, take practice tests, and get a study plan tailored to you'}
                : 'PassKru helps you find official exam information, study from past papers, take practice tests, and get a tailored study plan'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.03, translateY: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentPage('register')}
                className="px-8 py-3.5 rounded-lg bg-[#0f3360] hover:bg-[#0a2342] text-white font-bold text-sm transition shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{lang === 'km' ? 'ចាប់ផ្តើមត្រៀមប្រឡង' : 'Start Preparing'}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, translateY: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentPage('login')}
                className="px-8 py-3.5 rounded-lg bg-white border-2 border-[#0f3360] text-[#0f3360] hover:bg-slate-50 font-bold text-sm transition shadow-sm hover:shadow cursor-pointer"
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
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white/50 backdrop-blur-sm border border-slate-200 group">
              <img
                src="/landing.jpeg"
                alt="Study Group"
                className="w-full h-[380px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </section>

        {/* 2. Main Features Section */}
        <section id="features" className="pt-16 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
              {lang === 'km' ? 'លក្ខណៈពិសេសចម្បង' : 'Key Features'}
            </h2>
            <div className="w-16 h-1 bg-[#0f3360] rounded-full mx-auto mt-4" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4 hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-[#1e40af] flex items-center justify-center text-white shadow-inner mt-2 transition-transform duration-300 hover:rotate-6 hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>
              </div>
              <h3 className="text-[19px] font-bold text-slate-900 pt-2">{lang === 'km' ? 'ព័ត៌មានប្រឡង' : 'Exam Information'}</h3>
              <p className="text-[14px] text-slate-500 font-medium leading-relaxed pb-2">
                {lang === 'km'
                  ? 'ព័ត៌មានប្រកាស ការលំហាត់ លក្ខខណ្ឌ និងកាលបរិច្ឆេទសំខាន់ៗ'
                  : 'Announcements, requirements, conditions and important dates'}
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
              className="bg-white rounded-[24px] p-8 shadow-[0_4px_50px_-15px_rgba(74,222,128,0.3)] border border-green-50 flex flex-col items-center text-center space-y-4 hover:shadow-[0_8px_50px_-10px_rgba(74,222,128,0.5)] transition-all relative overflow-hidden"
            >
              <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-green-200/20 rounded-full blur-3xl pointer-events-none" />
              <div className="w-16 h-16 rounded-full bg-[#4ade80] flex items-center justify-center text-white shadow-inner relative z-10 mt-2 transition-transform duration-300 hover:rotate-6 hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
              </div>
              <h3 className="text-[19px] font-bold text-slate-900 pt-2 relative z-10">{lang === 'km' ? 'រៀន និងអនុវត្ត' : 'Learn & Practice'}</h3>
              <p className="text-[14px] text-slate-500 font-medium leading-relaxed pb-2 relative z-10">
                {lang === 'km'
                  ? 'វិញ្ញាសាចាស់ សំណួរអនុវត្ត Quiz Flashcards និងប្រឡងសាកល្បង'
                  : 'Past papers, practice quizzes, flashcards, and mock exams'}
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
              className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4 hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-[#92400e] flex items-center justify-center text-white shadow-inner mt-2 transition-transform duration-300 hover:rotate-6 hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>
              </div>
              <h3 className="text-[19px] font-bold text-slate-900 pt-2">{lang === 'km' ? 'វគ្គសិក្សាផ្ទាល់ខ្លួន' : 'Personalized Course'}</h3>
              <p className="text-[14px] text-slate-500 font-medium leading-relaxed pb-2">
                {lang === 'km'
                  ? 'AI ជួយបង្កើតវគ្គសិក្សាផ្អែកលើចំណុចខ្សោយ និងសមត្ថភាពរបស់អ្នក'
                  : 'AI builds a course from your weak areas and ability — no exam date required'}
                  ? 'AI ជួយរៀបចំផែនការសិក្សាផ្អែកលើពេលវេលា និងសមត្ថភាពរបស់អ្នក'
                  : 'AI builds personalized study schedules tailored to your pace and goals'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* 3. How to Use Section */}
        <section id="how-to-use" className="pt-16 pb-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-20 space-y-3"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f3360]">
              {lang === 'km' ? 'របៀបប្រើប្រាស់' : 'How to Use'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium max-w-xl mx-auto">
              {lang === 'km'
                ? 'ជំហានសាមញ្ញ និងមានរបៀបរៀបរយឆ្ពោះទៅរកភាពជោគជ័យក្នុងការប្រឡង។ អនុវត្តតាមជំហានទាំងនេះដើម្បីបង្កើនទំនុកចិត្ត និងចំណេះដឹងរបស់អ្នក។'
                : 'Simple, structured steps toward exam success. Follow these steps to build confidence and readiness.'}
            </p>
          </motion.div>

          <div className="relative max-w-6xl mx-auto">
            {/* SVG Connected Dashed Line with drawing animation */}
            <svg
              className="hidden md:block absolute top-0 left-0 w-full h-36 pointer-events-none z-0"
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

            {/* 4 Steps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-4 relative z-10">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -6 }}
                className="flex flex-col items-center text-center cursor-default"
              >
                <div className="w-16 h-16 rounded-full bg-[#0f3360] flex items-center justify-center text-white shadow-xl mb-6 ring-8 ring-[#f8faff] transition-transform duration-300 hover:scale-110">
                  <UserPlus className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[#0f3360] mb-3">
                  {lang === 'km' ? 'បង្កើតគណនី' : 'Create Account'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium max-w-[220px]">
                  {lang === 'km'
                    ? 'ការចុះឈ្មោះរហ័ស និងងាយស្រួលដើម្បីចាប់ផ្តើមដំណើររបស់អ្នក។ រក្សាទុកវឌ្ឍនភាពរបស់អ្នក និងចូលប្រើប្រាស់ធនធានផ្ទាល់ខ្លួន។'
                    : 'Quick and easy sign-up to start your learning path. Track progress and access personalized tools.'}
                </p>
              </motion.div>

              {/* Step 2 (Staggered Down) */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -6 }}
                className="flex flex-col items-center text-center md:mt-14 cursor-default"
              >
                <div className="w-16 h-16 rounded-full bg-[#854d0e] flex items-center justify-center text-white shadow-xl mb-6 ring-8 ring-[#f8faff] transition-transform duration-300 hover:scale-110">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[#0f3360] mb-3">
                  {lang === 'km' ? 'មើលវិញ្ញាសា' : 'Browse Papers'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium max-w-[220px]">
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
                className="flex flex-col items-center text-center cursor-default"
              >
                <div className="w-16 h-16 rounded-full bg-[#0f3360] flex items-center justify-center text-white shadow-xl mb-6 ring-8 ring-[#f8faff] transition-transform duration-300 hover:scale-110">
                  <Bot className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[#0f3360] mb-3">
                  {lang === 'km' ? 'បង្កើតផែនការសិក្សាជាមួយ AI' : 'AI Study Plan'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium max-w-[220px]">
                  {lang === 'km'
                    ? 'អនុញ្ញាតឱ្យ AI របស់យើងបង្កើតកាលវិភាគផ្ទាល់ខ្លួនដែលស្របតាមគោលដៅ និងពេលវេលាសិក្សារបស់អ្នក។'
                    : 'Let AI generate a customized schedule tailored to your available hours and target exam.'}
                </p>
              </motion.div>

              {/* Step 4 (Staggered Down) */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -6 }}
                className="flex flex-col items-center text-center md:mt-14 cursor-default"
              >
                <div className="w-16 h-16 rounded-full bg-[#854d0e] flex items-center justify-center text-white shadow-xl mb-6 ring-8 ring-[#f8faff] transition-transform duration-300 hover:scale-110">
                  <FileQuestion className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[#0f3360] mb-3">
                  {lang === 'km' ? 'ការប្រឡងសាកល្បងផ្ទាល់' : 'Live Mock Exams'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium max-w-[220px]">
                  {lang === 'km'
                    ? 'តេស្តសមត្ថភាពរបស់អ្នកជាមួយនឹងការប្រឡងសាកល្បង និងទទួលបានមតិកែលម្អភ្លាមៗដើម្បីដឹងពីចំណុចដែលត្រូវកែលម្អ។'
                    : 'Test your knowledge with real-time simulated exams and instant feedback.'}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 4. Contact Section with interactive entrance */}
        <section id="contact" className="pt-16 pb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="bg-[#0f3360] rounded-[32px] overflow-hidden relative shadow-2xl"
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
                className="p-10 lg:p-16 text-white flex flex-col justify-center"
              >
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">{lang === 'km' ? 'ទំនាក់ទំនងមកកាន់យើងខ្ញុំ' : 'Get in Touch With Us'}</h2>
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
                  {lang === 'km' ? 'ទំនាក់ទំនងមកកាន់យើងខ្ញុំ' : 'Get in Touch With Us'}
                </h2>
                <p className="text-blue-100 mb-10 text-lg leading-relaxed">
                  {lang === 'km'
                    ? 'ប្រសិនបើអ្នកមានចម្ងល់ ឬត្រូវការជំនួយទាក់ទងនឹងការប្រើប្រាស់ PassKru សូមកុំស្ទាក់ស្ទើរក្នុងការទាក់ទងមកយើងខ្ញុំ។ ក្រុមការងារយើងខ្ញុំតែងតែរង់ចាំជួយអ្នកជានិច្ច!'
                    : "If you have any questions or need help using PassKru, don't hesitate to reach out. Our team is always ready to help!"}
                </p>

                <div className="space-y-6">
                  <motion.div
                    whileHover={{ x: 6 }}
                    className="flex items-center gap-4 cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    </div>
                    <div>
                      <p className="text-sm text-blue-200">{lang === 'km' ? 'លេខទូរស័ព្ទ' : 'Phone Number'}</p>
                      <p className="font-bold text-lg">+855 12 345 678</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 6 }}
                    className="flex items-center gap-4 cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                    </div>
                    <div>
                      <p className="text-sm text-blue-200">{lang === 'km' ? 'អុីមែល' : 'Email'}</p>
                      <p className="font-bold text-lg">support@passkru.com</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 6 }}
                    className="flex items-center gap-4 cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                    </div>
                    <div>
                      <p className="text-sm text-blue-200">{lang === 'km' ? 'ទីតាំង' : 'Location'}</p>
                      <p className="font-bold text-lg">{lang === 'km' ? 'រាជធានីភ្នំពេញ, កម្ពុជា' : 'Phnom Penh, Cambodia'}</p>
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
                className="flex items-center justify-center lg:justify-end p-6 lg:p-12"
              >
                <div className="bg-white p-7 sm:p-8 rounded-[24px] w-full max-w-[420px] shadow-xl">
                  <h3 className="text-xl font-bold text-slate-900 mb-5">{lang === 'km' ? 'ផ្ញើសារមកកាន់យើង' : 'Send Us a Message'}</h3>
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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
      <footer className="bg-[#0f3360] text-blue-50 mt-auto pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Column 1: Logo & Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 select-none">
                <div className="bg-white p-1.5 rounded-lg flex items-center justify-center w-10 h-10">
                  <img src="/PassKru.svg" alt="PassKru Logo" className="h-6 w-auto" />
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
            <div className="space-y-6">
              <h4 className="font-black text-white tracking-widest text-[13px] uppercase">{lang === 'km' ? 'សម្រាប់អ្នក' : 'For You'}</h4>
              <ul className="space-y-3 text-sm text-blue-200">
                <li><a href="#" className="hover:text-white transition">{lang === 'km' ? 'ទំព័រដើម' : 'Home'}</a></li>
                <li><a href="#features" className="hover:text-white transition">{lang === 'km' ? 'លក្ខណៈពិសេស' : 'Features'}</a></li>
                <li><a href="#how-to-use" className="hover:text-white transition">{lang === 'km' ? 'របៀបប្រើប្រាស់' : 'How It Works'}</a></li>
                <li><a href="#how-to-use" className="hover:text-white transition">{lang === 'km' ? 'របៀបប្រើប្រាស់' : 'How to Use'}</a></li>
                <li><a href="#contact" className="hover:text-white transition">{lang === 'km' ? 'ទំនាក់ទំនង' : 'Contact'}</a></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-6">
              <h4 className="font-black text-white tracking-widest text-[13px] uppercase">{lang === 'km' ? 'សម្រាប់បេក្ខជន' : 'For Candidates'}</h4>
              <ul className="space-y-3 text-sm text-blue-200">
                <li><a href="#" className="hover:text-white transition">{lang === 'km' ? 'របៀបចុះឈ្មោះប្រឡង' : 'How to Register'}</a></li>
                <li><a href="#how-to-use" className="hover:text-white transition">{lang === 'km' ? 'របៀបប្រើប្រាស់ PassKru' : 'How to Use PassKru'}</a></li>
                <li><a href="#" className="hover:text-white transition">{lang === 'km' ? 'សំណួរដែលសួរញឹកញាប់' : 'FAQs'}</a></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="space-y-6">
              <h4 className="font-black text-white tracking-widest text-[13px] uppercase">{lang === 'km' ? 'ទំនាក់ទំនង' : 'Contact'}</h4>
              <ul className="space-y-3 text-sm text-blue-200">
                <li><a href="#" className="hover:text-white transition">Telegram &middot; @passkru_support</a></li>
                <li><a href="#" className="hover:text-white transition">hello@passkru.com</a></li>
                <li><a href="#" className="hover:text-white transition">passkru.com</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom border and copyright */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-blue-300">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
              <span>&copy; {new Date().getFullYear()} PassKru Co., Ltd. &middot; PassKru - KH</span>
              <div className="flex gap-4">
                <a href="#" className="hover:text-white transition">Terms</a>
                <a href="#" className="hover:text-white transition">Privacy</a>
                <a href="#" className="hover:text-white transition">Cookies</a>
              </div>
            </div>
            <div className="font-medium text-[#4ade80] italic">
              {lang === 'km' ? 'ប្រឡងជាប់ទាំងអស់គ្នា!' : 'Best of luck to all candidates!'}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
