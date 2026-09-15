import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User as UserIcon, Phone, ShieldCheck, ArrowLeft, CheckCircle2, AlertCircle, Sparkles, RefreshCw, KeyRound, Store } from 'lucide-react';
import { loginUser, registerUser, verifyEmailCode, generateVerificationCode } from '../services/authService';
import { User, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'verify';
  initialEmail?: string;
  onSuccess?: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  initialEmail = '',
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'verify'>(initialMode);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState(initialEmail);
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerRole, setRegisterRole] = useState<UserRole>('user');

  // Verification state
  const [verifyEmail, setVerifyEmail] = useState(initialEmail);
  const [verifyCode, setVerifyCode] = useState('');
  const [activeCodePreview, setActiveCodePreview] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);

  // Status state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    if (initialEmail) {
      setLoginEmail(initialEmail);
      setVerifyEmail(initialEmail);
    }
  }, [initialMode, initialEmail, isOpen]);

  // Resend timer countdown
  useEffect(() => {
    let interval: any;
    if (mode === 'verify' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, resendTimer]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await loginUser(loginEmail, loginPassword);
      setSuccessMsg('با موفقیت وارد شدید.');
      setTimeout(() => {
        onSuccess?.(user);
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err?.message || 'خطا در ورود به حساب');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !registerEmail.trim() || !registerPassword || !registerPhone.trim()) {
      setError('لطفاً تمامی فیلدهای الزامی را تکمیل نمایید.');
      return;
    }

    if (registerPassword.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد.');
      return;
    }

    setLoading(true);
    try {
      const { user, verificationCode } = await registerUser({
        fullName,
        email: registerEmail,
        password: registerPassword,
        phone: registerPhone,
        role: registerRole,
      });

      setVerifyEmail(user.email);
      setActiveCodePreview(verificationCode);
      setResendTimer(60);
      setMode('verify');
      setSuccessMsg('ثبت نام اولیه انجام شد. کد تایید به ایمیل شما ارسال گردید.');
    } catch (err: any) {
      setError(err?.message || 'خطا در ثبت نام');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (verifyCode.trim().length !== 6) {
      setError('لطفاً کد تایید ۶ رقمی را به صورت کامل وارد کنید.');
      return;
    }

    setLoading(true);
    const isOk = verifyEmailCode(verifyEmail, verifyCode.trim());

    if (isOk) {
      setSuccessMsg('ایمیل شما با موفقیت تایید و حساب کاربری فعال شد!');
      setTimeout(() => {
        onSuccess?.({
          id: 'active',
          fullName,
          email: verifyEmail,
          phone: registerPhone,
          role: registerRole,
          isEmailVerified: true,
          createdAt: new Date().toISOString(),
        });
        onClose();
      }, 900);
    } else {
      setError('کد تایید وارد شده نامعتبر است یا منقضی شده است.');
    }
    setLoading(false);
  };

  const handleResendCode = () => {
    if (resendTimer > 0) return;
    const newCode = generateVerificationCode(verifyEmail);
    setActiveCodePreview(newCode);
    setResendTimer(60);
    setSuccessMsg('کد تایید جدید مجدداً ارسال گردید.');
  };

  const fillQuickAdmin = () => {
    setLoginEmail('admin@spman.ir');
    setLoginPassword('admin123456');
  };

  const fillQuickStoreOwner = () => {
    setLoginEmail('ali@spman.ir');
    setLoginPassword('user123456');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0c0d14] border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-right">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header with Close */}
        <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {mode === 'login' && 'ورود به حساب کاربری'}
                {mode === 'register' && 'ثبت نام کاربر جدید'}
                {mode === 'verify' && 'تایید آدرس ایمیل'}
              </h3>
              <p className="text-[11px] text-zinc-400">سامانه جامع اسپرت من (spman.ir)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers for Login / Register */}
        {mode !== 'verify' && (
          <div className="grid grid-cols-2 p-1.5 bg-white/5 mx-6 mt-4 rounded-xl border border-white/5 text-xs font-bold">
            <button
              onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ورود به حساب
            </button>
            <button
              onClick={() => { setMode('register'); setError(null); setSuccessMsg(null); }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ثبت نام جدید
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 relative z-10 space-y-4">
          
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ============================================================= */}
          {/* 1. LOGIN FORM */}
          {/* ============================================================= */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>آدرس ایمیل</span>
                </label>
                <input
                  type="email"
                  required
                  dir="ltr"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#141724] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 text-left font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>رمز عبور</span>
                </label>
                <input
                  type="password"
                  required
                  dir="ltr"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#141724] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 text-left font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'در حال بررسی...' : 'ورود به پنل کاربری'}
              </button>

              {/* Demo Accounts Helper */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                <div className="text-[11px] text-zinc-500 text-center font-medium">اکانت‌های پیش‌فرض تست سریع:</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={fillQuickAdmin}
                    className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-amber-400 transition-colors font-mono text-center"
                  >
                    👑 مدیر (Admin)
                  </button>
                  <button
                    type="button"
                    onClick={fillQuickStoreOwner}
                    className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-zinc-300 transition-colors font-mono text-center"
                  >
                    🏪 فروشگاه‌دار
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ============================================================= */}
          {/* 2. REGISTER FORM */}
          {/* ============================================================= */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>نام و نام خانوادگی</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: علی رضایی"
                  className="w-full bg-[#141724] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>ایمیل (جهت تایید)</span>
                  </label>
                  <input
                    type="email"
                    required
                    dir="ltr"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-[#141724] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 text-left font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>شماره موبایل</span>
                  </label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    placeholder="09123456789"
                    className="w-full bg-[#141724] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 text-left font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>رمز عبور (حداقل ۶ کاراکتر)</span>
                </label>
                <input
                  type="password"
                  required
                  dir="ltr"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#141724] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 text-left font-mono"
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-medium text-zinc-300">نوع حساب کاربری:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegisterRole('user')}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-center ${
                      registerRole === 'user'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-400 font-bold'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    ورزشکار / کاربر عادی
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegisterRole('store_owner')}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-center ${
                      registerRole === 'store_owner'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-400 font-bold'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    🏪 مالک فروشگاه ورزشی
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'در حال ثبت اطلاعات...' : 'ثبت نام و دریافت کد تایید ایمیل'}
              </button>
            </form>
          )}

          {/* ============================================================= */}
          {/* 3. EMAIL VERIFICATION FORM (کد تایید ۶ رقمی) */}
          {/* ============================================================= */}
          {mode === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
                  <Mail className="w-6 h-6 animate-pulse" />
                </div>
                <div className="text-xs font-bold text-white">کد تایید ۶ رقمی به ایمیل زیر ارسال شد:</div>
                <div className="text-xs font-mono text-amber-400 font-bold dir-ltr">{verifyEmail}</div>
              </div>

              {/* Simulated Email Delivery Helper / Sandbox badge */}
              {activeCodePreview && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      کد تایید ایمیل (شبیه‌ساز آنی):
                    </span>
                    <button
                      type="button"
                      onClick={() => setVerifyCode(activeCodePreview)}
                      className="text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded font-bold hover:brightness-110"
                    >
                      درج خودکار کد
                    </button>
                  </div>
                  <div className="text-center font-mono text-xl tracking-[0.3em] font-black text-white py-1">
                    {activeCodePreview}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300 text-center block">
                  کد ۶ رقمی را وارد کنید:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  dir="ltr"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full bg-[#141724] border border-amber-500/40 rounded-xl px-4 py-3 text-lg text-amber-400 font-mono tracking-[0.4em] text-center focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading || verifyCode.length !== 6}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-xs hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'در حال اعتبارسنجی...' : 'تایید نهایی ایمیل و ورود'}
              </button>

              <div className="flex items-center justify-between text-xs text-zinc-400 pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="hover:text-white transition-colors"
                >
                  بازگشت به ورود
                </button>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendTimer > 0}
                  className={`flex items-center gap-1 font-medium ${
                    resendTimer > 0 ? 'text-zinc-600' : 'text-amber-400 hover:text-amber-300'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resendTimer > 0 ? '' : 'animate-spin'}`} />
                  <span>
                    {resendTimer > 0 ? `ارسال مجدد (${resendTimer} ثانیه)` : 'ارسال مجدد کد تایید'}
                  </span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
