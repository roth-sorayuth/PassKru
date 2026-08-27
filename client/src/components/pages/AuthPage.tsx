import React, { useState } from 'react';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../utils/api';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

function getPasswordStrength(password: string) {
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  let label: 'Weak' | 'Medium' | 'Strong' = 'Weak';
  if (score >= 4) label = 'Strong';
  else if (score >= 3) label = 'Medium';
  return { checks, score, label };
}

export const AuthPage: React.FC<{ initialMode?: 'login' | 'register' }> = ({
  initialMode = 'login',
}) => {
  const { setCurrentPage } = useApp();
  const { isLoaded: signInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: signUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);

  const [forgotMode, setForgotMode] = useState(false);
  const [resetStep, setResetStep] = useState<'email' | 'code' | 'password'>('email');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const getActiveSignUp = () => {
    // @ts-ignore
    return window.Clerk?.client?.signUp || signUp;
  };

  const getActiveSignIn = () => {
    // @ts-ignore
    return window.Clerk?.client?.signIn || signIn;
  };

  // Sync Clerk user → Supabase/DB (same as your console test)
  const syncUserToDatabase = async () => {
    try {
      await api('/users/me');
      // if your backend uses /auth/me instead, use:
      // await api('/auth/me');
    } catch (err) {
      console.error('Failed to sync user to database:', err);
    }
  };

  const PasswordHints = ({
    strength,
  }: {
    strength: ReturnType<typeof getPasswordStrength> | null;
  }) => {
    if (!strength) return null;
    return (
      <div className="mt-1.5 space-y-1">
        <p
          className={`text-xs font-bold ${
            strength.label === 'Strong'
              ? 'text-green-600'
              : strength.label === 'Medium'
                ? 'text-amber-600'
                : 'text-red-500'
          }`}
        >
          Strength: {strength.label}
        </p>
        <ul className="text-[11px] text-slate-500 space-y-0.5">
          <li className={strength.checks.length ? 'text-green-600' : ''}>
            • At least 8 characters
          </li>
          <li className={strength.checks.upper ? 'text-green-600' : ''}>
            • One uppercase letter
          </li>
          <li className={strength.checks.lower ? 'text-green-600' : ''}>
            • One lowercase letter
          </li>
          <li className={strength.checks.number ? 'text-green-600' : ''}>
            • One number
          </li>
        </ul>
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!signInLoaded) return;
        const activeSignIn = getActiveSignIn();
        if (!activeSignIn) return;

        const result = await activeSignIn.create({
          identifier: email.trim(),
          password,
        });

        if (result.status === 'complete') {
          await setSignInActive({ session: result.createdSessionId });
          await syncUserToDatabase();
          setCurrentPage('dashboard');
        } else {
          setError('ស្ថានភាពចូលប្រើប្រាស់មិនទាន់រួចរាល់');
        }
      } else {
        if (!signUpLoaded) return;
        const activeSignUp = getActiveSignUp();
        if (!activeSignUp) return;

        if (password !== confirmPassword) {
          throw new Error('ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ');
        }
        if (!firstName.trim() || !lastName.trim()) {
          throw new Error('សូមបញ្ចូលនាមត្រកូល និងនាមខ្លួន');
        }
        if (password.length < 8) {
          throw new Error('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោច 8 តួអក្សរ');
        }

        const result = await activeSignUp.create({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          emailAddress: email.trim(),
          password,
        });

        if (result.status === 'complete' && result.createdSessionId) {
          await setSignUpActive({ session: result.createdSessionId });
          await syncUserToDatabase();
          setCurrentPage('dashboard');
        } else {
          await activeSignUp.prepareEmailAddressVerification({ strategy: 'email_code' });
          setPendingVerification(true);
          setVerificationCode('');
          setInfo('លេខកូដត្រូវបានផ្ញើទៅអុីមែលរបស់អ្នក — កុំ refresh ទំព័រ');
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(
        err.errors?.[0]?.longMessage ||
          err.errors?.[0]?.message ||
          err.message ||
          'មានបញ្ហាក្នុងការភ្ជាប់'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    const code = verificationCode.replace(/\s/g, '').trim();
    if (!code || code.length < 4) {
      setError('សូមបញ្ចូលលេខកូដឱ្យបានត្រឹមត្រូវ');
      setLoading(false);
      return;
    }

    try {
      const activeSignUp = getActiveSignUp();
      if (!activeSignUp) {
        setError('Sign up session lost. Please register again (do not refresh).');
        setLoading(false);
        return;
      }

      let result: any;

      try {
        result = await activeSignUp.attemptEmailAddressVerification({ code });
      } catch (err1: any) {
        try {
          result = await activeSignUp.attemptVerification({
            strategy: 'email_code',
            code,
          });
        } catch (err2: any) {
          if (activeSignUp.verifications?.emailAddress?.attempt) {
            result = await activeSignUp.verifications.emailAddress.attempt({ code });
          } else {
            throw err2 || err1;
          }
        }
      }

      if (result?.status === 'complete' && result.createdSessionId) {
        await setSignUpActive({ session: result.createdSessionId });
        await syncUserToDatabase();
        setCurrentPage('dashboard');
        return;
      }

      if (result?.createdSessionId) {
        await setSignUpActive({ session: result.createdSessionId });
        await syncUserToDatabase();
        setCurrentPage('dashboard');
        return;
      }

      setError(`Not complete (status: ${result?.status || 'unknown'}). Try resend code.`);
    } catch (err: any) {
      console.error('Verify error:', err);
      const clerkMsg =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        '';

      if (/expired/i.test(clerkMsg)) {
        setError('លេខកូដផុតកំណត់ — ចុចផ្ញើម្តងទៀត');
      } else if (/incorrect|invalid|code/i.test(clerkMsg)) {
        setError(
          (clerkMsg || 'លេខកូដមិនត្រឹមត្រូវ') +
            ' — ប្រើលេខកូដថ្មីបំផុត ឬចុចផ្ញើម្តងទៀត'
        );
      } else {
        setError(clerkMsg || 'លេខកូដមិនត្រឹមត្រូវ');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendSignUpCode = async () => {
    setLoading(true);
    setError('');
    setInfo('');
    try {
      const activeSignUp = getActiveSignUp();
      if (!activeSignUp) {
        setError('Session lost. Please register again.');
        return;
      }
      await activeSignUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setVerificationCode('');
      setInfo('លេខកូដថ្មីត្រូវបានផ្ញើ — ប្រើតែលេខកូដថ្មី');
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || 'Could not resend code');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInLoaded) return;
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const activeSignIn = getActiveSignIn();
      if (!activeSignIn) return;

      await activeSignIn.create({
        strategy: 'reset_password_email_code',
        identifier: email.trim(),
      });
      setResetStep('code');
      setResetCode('');
      setInfo('លេខកូដត្រូវបានផ្ញើទៅអុីមែល');
    } catch (err: any) {
      setError(
        err.errors?.[0]?.longMessage ||
          err.errors?.[0]?.message ||
          err.message ||
          'Failed to send reset code'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInLoaded) return;
    setError('');
    setInfo('');
    setLoading(true);

    const code = resetCode.replace(/\s/g, '').trim();
    if (!code) {
      setError('សូមបញ្ចូលលេខកូដ');
      setLoading(false);
      return;
    }

    try {
      const activeSignIn = getActiveSignIn();
      if (!activeSignIn) return;

      await activeSignIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
      });

      setResetStep('password');
      setNewPassword('');
      setConfirmNewPassword('');
      setInfo('លេខកូដត្រឹមត្រូវ — បញ្ចូលពាក្យសម្ងាត់ថ្មី');
    } catch (err: any) {
      const msg =
        err.errors?.[0]?.longMessage ||
        err.errors?.[0]?.message ||
        err.message ||
        '';

      if (/code|incorrect|invalid|expired/i.test(msg)) {
        setError(msg || 'លេខកូដមិនត្រឹមត្រូវ');
      } else {
        setResetStep('password');
        setInfo('បញ្ចូលពាក្យសម្ងាត់ថ្មី');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInLoaded) return;
    setError('');
    setInfo('');
    setLoading(true);

    try {
      if (newPassword !== confirmNewPassword) {
        throw new Error('ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ');
      }
      if (newPassword.length < 8) {
        throw new Error('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោច 8 តួអក្សរ');
      }

      const activeSignIn = getActiveSignIn();
      if (!activeSignIn) return;

      let result: any;
      try {
        result = await activeSignIn.resetPassword({ password: newPassword });
      } catch {
        result = await activeSignIn.attemptFirstFactor({
          strategy: 'reset_password_email_code',
          code: resetCode.replace(/\s/g, '').trim(),
          password: newPassword,
        });
      }

      if (result.status === 'complete' || result.createdSessionId) {
        await setSignInActive({ session: result.createdSessionId });
        await syncUserToDatabase();
        setCurrentPage('dashboard');
      } else {
        setError('Could not reset password');
      }
    } catch (err: any) {
      setError(
        err.errors?.[0]?.longMessage ||
          err.errors?.[0]?.message ||
          err.message ||
          'Reset failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    try {
      if (mode === 'login') {
        if (!signInLoaded) return;
        const activeSignIn = getActiveSignIn();
        if (!activeSignIn) return;
        await activeSignIn.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: window.location.origin,
          redirectUrlComplete: window.location.origin,
        });
      } else {
        if (!signUpLoaded) return;
        const activeSignUp = getActiveSignUp();
        if (!activeSignUp) return;
        await activeSignUp.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: window.location.origin,
          redirectUrlComplete: window.location.origin,
        });
      }
    } catch (err: any) {
      setError(
        err.errors?.[0]?.longMessage ||
          err.errors?.[0]?.message ||
          err.message ||
          'Google login failed'
      );
    }
  };

  const passwordStrength = password ? getPasswordStrength(password) : null;
  const newPasswordStrength = newPassword ? getPasswordStrength(newPassword) : null;

  return (
    <div className="h-screen max-h-screen overflow-hidden flex w-full bg-white font-sans">
      <div className="hidden lg:flex w-1/2 relative bg-[#133363] overflow-hidden flex-col justify-center items-center">
        <div className="relative z-10 w-full max-w-[80%] mx-auto p-8 lg:p-12">
          <h1 className="text-4xl lg:text-[3.25rem] leading-[1.1] font-black text-white tracking-tight mb-3">
            WELLCOME TO
            <br />
            PASSKRU
          </h1>
          <p className="text-blue-100/90 text-base lg:text-lg max-w-md font-medium">
            Master the National Teacher Exam with AI
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-3/4 h-[70%]">
          <img
            src="/landing.jpeg"
            alt="Students"
            className="w-full h-full object-cover object-top opacity-50 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#133363] via-[#133363]/40 to-transparent" />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative h-full overflow-y-auto">
        <div className="w-full max-w-[480px] my-auto py-2">
          <div
            className="flex flex-col items-center cursor-pointer mb-1"
            onClick={() => setCurrentPage('landing')}
          >
            <img src="/PassKru.svg" alt="PassKru Logo" className="h-10 sm:h-12 w-auto" />
          </div>

          <div className="text-center mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-1">
              {forgotMode
                ? resetStep === 'email'
                  ? 'ភ្លេចពាក្យសម្ងាត់'
                  : resetStep === 'code'
                    ? 'ផ្ទៀងផ្ទាត់លេខកូដ'
                    : 'ពាក្យសម្ងាត់ថ្មី'
                : pendingVerification
                  ? 'ផ្ទៀងផ្ទាត់អ៊ីមែល'
                  : mode === 'login'
                    ? 'ចូលប្រើប្រាស់'
                    : 'បង្កើតគណនី'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {forgotMode
                ? resetStep === 'email'
                  ? 'បញ្ចូលអុីមែលដើម្បីទទួលលេខកូដ'
                  : resetStep === 'code'
                    ? `បញ្ចូលលេខកូដដែលបានផ្ញើទៅ ${email}`
                    : 'បង្កើតពាក្យសម្ងាត់ថ្មី (យ៉ាងហោច 8 តួ)'
                : pendingVerification
                  ? `សូមបញ្ចូលលេខកូដដែលបានផ្ញើទៅ ${email}`
                  : 'ចូលរួមជាមួយយើងដើម្បីអនាគតរបស់អ្នក'}
            </p>
          </div>

          {error && (
            <div className="mb-3 p-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-medium text-center">
              {error}
            </div>
          )}
          {info && !error && (
            <div className="mb-3 p-2.5 bg-green-50 text-green-700 border border-green-100 rounded-xl text-xs font-medium text-center">
              {info}
            </div>
          )}

          {forgotMode ? (
            <>
              {resetStep === 'email' && (
                <form onSubmit={handleForgotSendCode} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">អុីមែល</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#f0f4f8] focus:outline-none focus:ring-2 focus:ring-[#0f3360]/20"
                      placeholder="name@example.com"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0a1e3a] hover:bg-[#133363] text-white py-2.5 rounded-xl text-sm font-bold disabled:opacity-70"
                  >
                    {loading ? 'កំពុងផ្ញើ...' : 'ផ្ញើលេខកូដ'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotMode(false);
                      setError('');
                      setInfo('');
                      setResetStep('email');
                    }}
                    className="w-full text-xs text-slate-500 underline"
                  >
                    ត្រឡប់ទៅចូលគណនី
                  </button>
                </form>
              )}

              {resetStep === 'code' && (
                <form onSubmit={handleForgotVerifyCode} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      លេខកូដ (6 ខ្ទង់)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      required
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value.replace(/\s/g, ''))}
                      className="w-full px-4 py-2.5 text-center text-lg font-bold tracking-widest rounded-xl bg-[#f0f4f8] focus:outline-none focus:ring-2 focus:ring-[#0f3360]/20"
                      placeholder="123456"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0a1e3a] hover:bg-[#133363] text-white py-2.5 rounded-xl text-sm font-bold disabled:opacity-70"
                  >
                    {loading ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'ផ្ទៀងផ្ទាត់លេខកូដ'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setResetStep('email');
                      setError('');
                      setInfo('');
                    }}
                    className="w-full text-xs text-slate-500 underline"
                  >
                    ត្រឡប់ក្រោយ
                  </button>
                </form>
              )}

              {resetStep === 'password' && (
                <form onSubmit={handleForgotSetPassword} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ពាក្យសម្ងាត់ថ្មី
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2.5 pr-10 text-sm rounded-xl bg-[#f0f4f8] focus:outline-none focus:ring-2 focus:ring-[#0f3360]/20"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
                      >
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <PasswordHints strength={newPasswordStrength} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      បញ្ជាក់ពាក្យសម្ងាត់ថ្មី
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmNewPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full px-4 py-2.5 pr-10 text-sm rounded-xl bg-[#f0f4f8] focus:outline-none focus:ring-2 focus:ring-[#0f3360]/20"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
                      >
                        {showConfirmNewPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0a1e3a] hover:bg-[#133363] text-white py-2.5 rounded-xl text-sm font-bold disabled:opacity-70"
                  >
                    {loading ? 'កំពុងកំណត់...' : 'រក្សាទុកពាក្យសម្ងាត់ថ្មី'}
                  </button>
                </form>
              )}
            </>
          ) : pendingVerification ? (
            <form onSubmit={handleVerifyEmail} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  លេខកូដផ្ទៀងផ្ទាត់ (6 ខ្ទង់)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\s/g, ''))}
                  className="w-full px-4 py-2.5 text-center text-lg font-bold tracking-widest rounded-xl bg-[#f0f4f8] focus:outline-none focus:ring-2 focus:ring-[#0f3360]/20"
                  placeholder="123456"
                />
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-[#0a1e3a] hover:bg-[#133363] text-white py-2.5 rounded-xl text-sm font-bold flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {loading ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'ផ្ទៀងផ្ទាត់ និងចូលប្រើ'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleResendSignUpCode}
                className="w-full text-xs text-[#0f3360] font-bold hover:underline"
              >
                ផ្ញើលេខកូដម្តងទៀត
              </button>
              <button
                type="button"
                onClick={() => {
                  setPendingVerification(false);
                  setError('');
                  setInfo('');
                }}
                className="w-full text-xs text-slate-500 underline"
              >
                ត្រឡប់ទៅការចុះឈ្មោះវិញ
              </button>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
                {mode === 'register' && (
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">នាមត្រកូល</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-[#f0f4f8] focus:outline-none focus:ring-2 focus:ring-[#0f3360]/20"
                        placeholder="នាមត្រកូល"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">នាមខ្លួន</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-[#f0f4f8] focus:outline-none focus:ring-2 focus:ring-[#0f3360]/20"
                        placeholder="នាមខ្លួន"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">អុីមែល</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-[#f0f4f8] focus:outline-none focus:ring-2 focus:ring-[#0f3360]/20"
                    placeholder="name@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ពាក្យសម្ងាត់</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 text-sm rounded-xl bg-[#f0f4f8] focus:outline-none focus:ring-2 focus:ring-[#0f3360]/20"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {mode === 'register' && <PasswordHints strength={passwordStrength} />}
                  {mode === 'login' && (
                    <div className="text-right mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setForgotMode(true);
                          setError('');
                          setInfo('');
                          setResetStep('email');
                        }}
                        className="text-xs text-[#0f3360] font-bold hover:underline"
                      >
                        ភ្លេចពាក្យសម្ងាត់?
                      </button>
                    </div>
                  )}
                </div>

                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      បញ្ជាក់ពាក្យសម្ងាត់
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 pr-10 text-sm rounded-xl bg-[#f0f4f8] focus:outline-none focus:ring-2 focus:ring-[#0f3360]/20"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {mode === 'register' && (
                  <div className="flex items-center pt-0.5">
                    <input
                      id="terms"
                      type="checkbox"
                      required
                      className="w-3.5 h-3.5 rounded border-slate-300 text-[#0f3360]"
                    />
                    <label htmlFor="terms" className="ml-2 text-xs text-slate-600 font-medium">
                      ខ្ញុំយល់ព្រមតាម{' '}
                      <span className="text-[#0f3360] font-bold">លក្ខខណ្ឌប្រើប្រាស់</span>
                    </label>
                  </div>
                )}

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-[#0a1e3a] hover:bg-[#133363] text-white py-2.5 rounded-xl text-sm font-bold flex justify-center items-center gap-2 disabled:opacity-70"
                >
                  {loading
                    ? 'កំពុងដំណើរការ...'
                    : mode === 'login'
                      ? 'ចូលគណនី'
                      : 'ចុះឈ្មោះ'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              <div className="relative my-3 sm:my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-slate-400">
                    {mode === 'login' ? 'ឬចូលគណនីជាមួយ' : 'ឬចុះឈ្មោះជាមួយ'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 shadow-xs transition cursor-pointer"
              >
                <GoogleIcon className="w-5 h-5 shrink-0" />
                <span>Google</span>
              </button>

              <div className="mt-3 text-center text-xs font-medium text-slate-500">
                {mode === 'login' ? (
                  <>
                    មិនទាន់មានគណនីមែនទេ?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="text-[#0f3360] font-bold hover:underline"
                    >
                      ចុះឈ្មោះឥឡូវនេះ
                    </button>
                  </>
                ) : (
                  <>
                    មានគណនីរួចហើយ?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-[#0f3360] font-bold hover:underline"
                    >
                      ចូលប្រើប្រាស់
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};