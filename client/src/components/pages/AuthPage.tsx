import React, { useState } from 'react';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { useApp } from '../../context/AppContext';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export const AuthPage: React.FC<{ initialMode?: 'login' | 'register' }> = ({ initialMode = 'login' }) => {
  const { setCurrentPage } = useApp();
  const { isLoaded: signInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: signUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!signInLoaded) return;
        const result = await signIn.create({
          identifier: email,
          password: password,
        });

        if (result.status === 'complete') {
          await setSignInActive({ session: result.createdSessionId });
          setCurrentPage('dashboard');
        } else {
          console.log('Login result:', result);
          setError('ស្ថានភាពចូលប្រើប្រាស់មិនទាន់រួចរាល់');
        }
      } else {
        if (!signUpLoaded) return;
        if (password !== confirmPassword) {
          throw new Error('ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ');
        }
        if (!firstName || !lastName) {
          throw new Error('សូមបញ្ចូលនាមត្រកូល និងនាមខ្លួន');
        }

        const result = await signUp.create({
          firstName,
          lastName,
          emailAddress: email,
          password,
        });

        if (result.status === 'complete') {
          await setSignUpActive({ session: result.createdSessionId });
          setCurrentPage('dashboard');
        } else if (result.status === 'missing_requirements' || result.unverifiedFields?.includes('email_address')) {
          await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
          setPendingVerification(true);
        } else {
          await setSignUpActive({ session: result.createdSessionId });
          setCurrentPage('dashboard');
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      const msg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || 'មានបញ្ហាក្នុងការភ្ជាប់';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpLoaded) return;
    setLoading(true);
    setError('');

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === 'complete') {
        await setSignUpActive({ session: completeSignUp.createdSessionId });
        setCurrentPage('dashboard');
      } else {
        setError('លេខកូដផ្ទៀងផ្ទាត់មិនត្រឹមត្រូវ');
      }
    } catch (err: any) {
      const msg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || 'ការផ្ទៀងផ្ទាត់បានបរាជ័យ';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    try {
      if (mode === 'login') {
        if (!signInLoaded) return;
        await signIn.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: window.location.origin,
          redirectUrlComplete: window.location.origin,
        });
      } else {
        if (!signUpLoaded) return;
        await signUp.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: window.location.origin,
          redirectUrlComplete: window.location.origin,
        });
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || 'Google login failed');
    }
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden flex w-full bg-white font-sans">

      {/* Left Panel - Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#133363] overflow-hidden flex-col justify-center items-center">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-full h-full">
          <div className="absolute right-12 top-1/4 grid grid-cols-2 gap-1.5 opacity-20">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white"></div>
            ))}
          </div>
          <svg className="absolute bottom-12 right-12 w-24 h-24 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="7 13 2 13 2 18"></polyline>
            <polyline points="13 18 18 18 18 13"></polyline>
            <polyline points="13 7 18 7 18 2"></polyline>
            <polyline points="7 2 2 2 2 7"></polyline>
          </svg>
        </div>

        <div className="relative z-10 w-full max-w-[80%] mx-auto p-8 lg:p-12">
          <h1 className="text-4xl lg:text-[3.25rem] leading-[1.1] font-black text-white tracking-tight mb-3">
            WELLCOME TO<br />
            <span className="text-white">PASSKRU</span>
          </h1>
          <p className="text-blue-100/90 text-base lg:text-lg max-w-md font-medium tracking-wide">
            Master the National Teacher Exam with AI
          </p>
        </div>

        {/* Image Placeholder approximating mockup styling */}
        <div className="absolute bottom-0 left-0 w-3/4 h-[70%]">
          <img src="/landing.jpeg" alt="Students" className="w-full h-full object-cover object-top opacity-50 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#133363] via-[#133363]/40 to-transparent"></div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative h-full overflow-y-auto lg:overflow-hidden">

        <div className="w-full max-w-[480px] my-auto py-2">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center cursor-pointer mb-1" onClick={() => setCurrentPage('landing')}>
            <img src="/PassKru.svg" alt="PassKru Logo" className="h-10 sm:h-12 w-auto" onError={(e) => (e.currentTarget.src = '/PassKru.svg')} />
          </div>

          {/* Titles */}
          <div className="text-center mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-1">
              {pendingVerification ? 'ផ្ទៀងផ្ទាត់អ៊ីមែល' : (mode === 'login' ? 'ចូលប្រើប្រាស់' : 'បង្កើតគណនី')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {pendingVerification ? `សូមបញ្ចូលលេខកូដដែលបានផ្ញើទៅ ${email}` : 'ចូលរួមជាមួយយើងដើម្បីអនាគតរបស់អ្នក'}
            </p>
          </div>

          {error && (
            <div className="mb-3 p-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-medium text-center">
              {error}
            </div>
          )}

          {pendingVerification ? (
            <form onSubmit={handleVerifyEmail} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">លេខកូដផ្ទៀងផ្ទាត់ (6 ខ្ទង់)</label>
                <input
                  type="text"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-4 py-2.5 text-center text-lg font-bold tracking-widest rounded-xl bg-[#f0f4f8] focus:outline-none focus:ring-2 focus:ring-[#0f3360]/20 focus:bg-white transition"
                  placeholder="123456"
                />
              </div>

              <div className="pt-2">
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-[#0a1e3a] hover:bg-[#133363] text-white py-2.5 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition disabled:opacity-70 cursor-pointer shadow-sm"
                >
                  {loading ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'ផ្ទៀងផ្ទាត់ និងចូលប្រើ'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setPendingVerification(false)}
                  className="text-xs text-slate-500 hover:text-slate-700 underline cursor-pointer"
                >
                  ត្រឡប់ទៅការចុះឈ្មោះវិញ
                </button>
              </div>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">

                {/* Registration Only Fields */}
                {mode === 'register' && (
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">នាមត្រកូល</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-[#f0f4f8] focus:outline-none focus:ring-2 focus:ring-[#0f3360]/20 focus:bg-white transition" placeholder="នាមត្រកូល" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">នាមខ្លួន</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-[#f0f4f8] focus:outline-none focus:ring-2 focus:ring-[#0f3360]/20 focus:bg-white transition" placeholder="នាមខ្លួន" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Field (Both) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">អុីមែល</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-[#f0f4f8] focus:outline-none focus:ring-2 focus:ring-[#0f3360]/20 focus:bg-white transition" placeholder="name@example.com" />
                  </div>
                </div>

                {/* Password Field (Both) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ពាក្យសម្ងាត់</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-9 pr-10 py-2 text-sm rounded-xl bg-[#f0f4f8] focus:outline-none focus:ring-2 focus:ring-[#0f3360]/20 focus:bg-white transition tracking-widest placeholder:tracking-normal" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer">
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field (Register Only) */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">បញ្ជាក់ពាក្យសម្ងាត់</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      </div>
                      <input type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-9 pr-10 py-2 text-sm rounded-xl bg-[#f0f4f8] focus:outline-none focus:ring-2 focus:ring-[#0f3360]/20 focus:bg-white transition tracking-widest placeholder:tracking-normal" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer">
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Terms checkbox (Register Only) */}
                {mode === 'register' && (
                  <div className="flex items-center pt-0.5">
                    <input id="terms" type="checkbox" required className="w-3.5 h-3.5 rounded border-slate-300 text-[#0f3360] focus:ring-[#0f3360] cursor-pointer" />
                    <label htmlFor="terms" className="ml-2 text-xs text-slate-600 font-medium cursor-pointer">
                      ខ្ញុំយល់ព្រមតាម <span className="text-[#0f3360] font-bold">លក្ខខណ្ឌប្រើប្រាស់</span>
                    </label>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-1.5">
                  <button disabled={loading} type="submit" className="w-full bg-[#0a1e3a] hover:bg-[#133363] text-white py-2.5 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition disabled:opacity-70 cursor-pointer shadow-sm">
                    {loading ? 'កំពុងដំណើរការ...' : (mode === 'login' ? 'ចូលគណនី' : 'ចុះឈ្មោះ')}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </form>

              {/* Social Divider */}
              <div className="relative my-3 sm:my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-slate-400">
                    {mode === 'login' ? 'ឬចូលគណនីជាមួយ' : 'ឬចុះឈ្មោះជាមួយ'}
                  </span>
                </div>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2 sm:py-2.5 rounded-xl text-sm font-semibold flex justify-center items-center gap-2.5 transition cursor-pointer shadow-2xs"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /><path d="M1 1h22v22H1z" fill="none" /></svg>
                Google
              </button>

              {/* Toggle Mode Link */}
              <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm font-medium">
                {mode === 'login' ? (
                  <span className="text-slate-500">
                    មិនទាន់មានគណនីមែនទេ?{' '}
                    <button type="button" onClick={() => setMode('register')} className="text-[#0f3360] font-bold hover:underline cursor-pointer">ចុះឈ្មោះឥឡូវនេះ</button>
                  </span>
                ) : (
                  <span className="text-slate-500">
                    មានគណនីរួចហើយ?{' '}
                    <button type="button" onClick={() => setMode('login')} className="text-[#0f3360] font-bold hover:underline cursor-pointer">ចូលប្រើប្រាស់</button>
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
