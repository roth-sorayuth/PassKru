import React from 'react';
import { useApp } from '../../context/AppContext';

export const PublicLandingPage: React.FC = () => {
  const { setCurrentPage, setLoginModalOpen, setRegisterModalOpen } = useApp();

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-900 font-sans antialiased flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => setCurrentPage('landing')}>
            <img src="/PassKru.svg" alt="PassKru Logo" className="h-10 w-auto" />
            <p className="text-3xl font-extrabold text-[#0f3360] tracking-tight">PassKru</p>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-bold text-slate-600">
            <a href="#" className="text-[#0f3360] border-b-2 border-[#0f3360] pb-1">ទំព័រដើម</a>
            <a href="#features" className="hover:text-[#0f3360] transition pb-1">លក្ខណៈពិសេស</a>
            <a href="#contact" className="hover:text-[#0f3360] transition pb-1">ទំនាក់ទំនង</a>
          </nav>

          {/* Buttons and Icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLoginModalOpen(true)}
              className="px-6 py-2.5 text-sm font-bold text-white bg-[#0f3360] hover:bg-[#0a2342] rounded-lg transition shadow-sm cursor-pointer"
            >
              ចូលប្រើប្រាស់
            </button>

            <div className="w-10 h-10 rounded-full border border-[#0f3360] flex items-center justify-center text-[#0f3360] cursor-pointer hover:bg-slate-100 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </div>
          </div>
        </div>
      </header>

      {/* Landing Info Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center pt-16 pb-24 gap-12 lg:gap-8">
          {/* Left Content */}
          <div className="flex-1 space-y-8 lg:pr-10">
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold leading-[1.3] text-[#111827]">
              ត្រៀមប្រឡងគ្រូបង្រៀន<br />នៅកន្លែងតែមួយ
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg font-medium">
              PassKru ជួយអ្នកស្វែងរកព័ត៌មានផ្លូវការ រៀនពី<br />
              វិញ្ញាសាចាស់ អនុវត្តតេស្ត និងទទួលបានផែនការ<br />
              សិក្សាដែលសមស្របនឹងអ្នក
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => setRegisterModalOpen(true)}
                className="px-8 py-3.5 rounded-lg bg-[#0f3360] hover:bg-[#0a2342] text-white font-bold text-sm transition shadow-md cursor-pointer"
              >
                ចាប់ផ្តើមត្រៀមប្រឡង
              </button>
              <button
                onClick={() => setLoginModalOpen(true)}
                className="px-8 py-3.5 rounded-lg bg-white border-2 border-[#0f3360] text-[#0f3360] hover:bg-slate-50 font-bold text-sm transition cursor-pointer"
              >
                មើលព័ត៌មានប្រឡង
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 w-full relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white/50 backdrop-blur-sm border border-slate-200">
              <img
                src="/landing.jpeg"
                alt="Study Group"
                className="w-full h-[380px] object-cover"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="pt-10 pb-16">
          <h2 className="text-2xl font-extrabold text-center text-[#111827] mb-12">
            លក្ខណៈពិសេសចម្បង
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4 hover:shadow-md transition">
              <div className="w-16 h-16 rounded-full bg-[#1e40af] flex items-center justify-center text-white shadow-inner mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>
              </div>
              <h3 className="text-[19px] font-bold text-slate-900 pt-2">ព័ត៌មានប្រឡង</h3>
              <p className="text-[14px] text-slate-500 font-medium leading-relaxed pb-2">
                ព័ត៌មានប្រកាស ការលំហាត់ លក្ខខណ្ឌ<br />
                និងកាលបរិច្ឆេទសំខាន់ៗ
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_50px_-15px_rgba(74,222,128,0.3)] border border-green-50 flex flex-col items-center text-center space-y-4 hover:shadow-[0_4px_50px_-15px_rgba(74,222,128,0.4)] transition relative overflow-hidden">
              <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-green-200/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="w-16 h-16 rounded-full bg-[#4ade80] flex items-center justify-center text-white shadow-inner relative z-10 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
              </div>
              <h3 className="text-[19px] font-bold text-slate-900 pt-2 relative z-10">រៀន និងអនុវត្ត</h3>
              <p className="text-[14px] text-slate-500 font-medium leading-relaxed pb-2 relative z-10">
                វិញ្ញាសាចាស់ សំណួរអនុវត្ត Quiz<br />
                Flashcards និងប្រឡងសាកល្បង
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4 hover:shadow-md transition">
              <div className="w-16 h-16 rounded-full bg-[#92400e] flex items-center justify-center text-white shadow-inner mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>
              </div>
              <h3 className="text-[19px] font-bold text-slate-900 pt-2">ផែនការសិក្សាផ្ទាល់ខ្លួន</h3>
              <p className="text-[14px] text-slate-500 font-medium leading-relaxed pb-2">
                AI ជួយរៀបចំផែនការសិក្សាផ្អែកលើ<br />
                ពេលវេលា និងសមត្ថភាពរបស់អ្នក
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="pt-16 pb-24">
          <div className="bg-[#0f3360] rounded-[32px] overflow-hidden relative shadow-2xl">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 relative z-10">
              {/* Contact Info */}
              <div className="p-10 lg:p-16 text-white flex flex-col justify-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">ទំនាក់ទំនងមកកាន់យើងខ្ញុំ</h2>
                <p className="text-blue-100 mb-10 text-lg leading-relaxed">
                  ប្រសិនបើអ្នកមានចម្ងល់ ឬត្រូវការជំនួយទាក់ទងនឹងការប្រើប្រាស់ PassKru សូមកុំស្ទាក់ស្ទើរក្នុងការទាក់ទងមកយើងខ្ញុំ។ ក្រុមការងារយើងខ្ញុំតែងតែរង់ចាំជួយអ្នកជានិច្ច!
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    </div>
                    <div>
                      <p className="text-sm text-blue-200">លេខទូរស័ព្ទ</p>
                      <p className="font-bold text-lg">+855 12 345 678</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                    </div>
                    <div>
                      <p className="text-sm text-blue-200">អុីមែល</p>
                      <p className="font-bold text-lg">support@passkru.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                    </div>
                    <div>
                      <p className="text-sm text-blue-200">ទីតាំង</p>
                      <p className="font-bold text-lg">រាជធានីភ្នំពេញ, កម្ពុជា</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="flex items-center justify-center lg:justify-end p-6 lg:p-12">
                <div className="bg-white p-7 sm:p-8 rounded-[24px] w-full max-w-[420px] shadow-xl">
                  <h3 className="text-xl font-bold text-slate-900 mb-5">ផ្ញើសារមកកាន់យើង</h3>
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                      <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">ឈ្មោះរបស់អ្នក</label>
                      <input type="text" className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0f3360] focus:bg-white transition" placeholder="បញ្ចូលឈ្មោះរបស់អ្នក" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">អុីមែលរបស់អ្នក</label>
                      <input type="email" className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0f3360] focus:bg-white transition" placeholder="បញ្ចូលអុីមែលរបស់អ្នក" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">សាររបស់អ្នក</label>
                      <textarea rows={3} className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0f3360] focus:bg-white transition resize-none" placeholder="សរសេរសាររបស់អ្នកនៅទីនេះ..."></textarea>
                    </div>
                    <button type="submit" className="w-full py-3 bg-[#0f3360] hover:bg-[#0a2342] text-white rounded-xl font-bold text-sm transition shadow-md hover:shadow-lg mt-2">
                      ផ្ញើសារ
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
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
                PassKru ជួយអ្នកស្វែងរកព័ត៌មានផ្លូវការ រៀនពីវិញ្ញាសាចាស់ និងអនុវត្តតេស្ត។ <span className="text-[#fbbf24] italic">Made in Cambodia</span>
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0f3360] hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0f3360] hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.888-.662 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0f3360] hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                </a>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              <h4 className="font-black text-white tracking-widest text-[13px] uppercase">សម្រាប់អ្នក</h4>
              <ul className="space-y-3 text-sm text-blue-200">
                <li><a href="#" className="hover:text-white transition">ទំព័រដើម</a></li>
                <li><a href="#" className="hover:text-white transition">ព័ត៌មានប្រឡង</a></li>
                <li><a href="#" className="hover:text-white transition">វិញ្ញាសា</a></li>
                <li><a href="#" className="hover:text-white transition">រៀន និងអនុវត្ត</a></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-6">
              <h4 className="font-black text-white tracking-widest text-[13px] uppercase">សម្រាប់បេក្ខជន</h4>
              <ul className="space-y-3 text-sm text-blue-200">
                <li><a href="#" className="hover:text-white transition">របៀបចុះឈ្មោះប្រឡង</a></li>
                <li><a href="#" className="hover:text-white transition">របៀបប្រើប្រាស់ PassKru</a></li>
                <li><a href="#" className="hover:text-white transition">សំណួរដែលសួរញឹកញាប់</a></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="space-y-6">
              <h4 className="font-black text-white tracking-widest text-[13px] uppercase">ទំនាក់ទំនង</h4>
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
              ប្រឡងជាប់ទាំងអស់គ្នា!
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
