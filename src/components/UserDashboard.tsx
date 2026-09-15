import React, { useState } from 'react';
import { User, Store } from '../types';
import { getCurrentUser, logoutUser, adminUpdateUser, generateVerificationCode } from '../services/authService';
import { WebPUploadWidget } from './WebPUploadWidget';
import { 
  User as UserIcon, Mail, Phone, ShieldCheck, AlertTriangle, 
  Store as StoreIcon, Heart, Settings, LogOut, CheckCircle2, 
  PlusCircle, ShieldAlert, Sparkles, ArrowLeft, KeyRound
} from 'lucide-react';

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
  onNavigate: (section: string) => void;
  onOpenVerifyModal?: (email: string) => void;
  onOpenAdminPanel?: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  onLogout,
  onNavigate,
  onOpenVerifyModal,
  onOpenAdminPanel,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'stores' | 'security'>('profile');
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  
  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(null);

    try {
      adminUpdateUser(user.id, {
        fullName,
        phone,
        avatarUrl,
      });
      setSaveSuccess('اطلاعات پروفایل با موفقیت ذخیره شد.');
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err: any) {
      setSaveError(err?.message || 'خطا در ذخیره تغییرات');
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(null);

    if (newPassword.length < 6) {
      setSaveError('رمز عبور جدید باید حداقل ۶ کاراکتر باشد.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setSaveError('تکرار رمز عبور جدید همخوانی ندارد.');
      return;
    }

    try {
      adminUpdateUser(user.id, {
        email: user.email,
        password: newPassword,
      });
      setSaveSuccess('رمز عبور شما با موفقیت تغییر یافت.');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err: any) {
      setSaveError(err?.message || 'خطا در تغییر رمز عبور');
    }
  };

  const handleVerifyEmailClick = () => {
    generateVerificationCode(user.email);
    onOpenVerifyModal?.(user.email);
  };

  return (
    <div className="min-h-screen bg-[#07080b] text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 text-right">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#121524] via-[#0e101a] to-[#07080b] border border-white/10 p-6 sm:p-8 shadow-2xl">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* User Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-right">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400/50 bg-[#161926] shadow-xl shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-amber-400 bg-amber-500/10">
                    <UserIcon className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-amber-300 font-mono py-0.5 text-center">
                  WEBP / S3
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white">{user.fullName}</h1>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    user.role === 'admin'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : user.role === 'store_owner'
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                  }`}>
                    {user.role === 'admin' && '👑 مدیر ارشد سامانه'}
                    {user.role === 'store_owner' && '🏪 مالک فروشگاه ورزشی'}
                    {user.role === 'user' && '👤 کاربر عادی'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-zinc-400">
                  <span className="flex items-center gap-1 dir-ltr font-mono text-zinc-300">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    {user.email}
                  </span>
                  {user.phone && (
                    <span className="flex items-center gap-1 dir-ltr font-mono text-zinc-300">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      {user.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {user.role === 'admin' && (
                <button
                  onClick={onOpenAdminPanel}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>ورود به پنل مدیریت</span>
                </button>
              )}

              <button
                onClick={() => onNavigate('register')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-medium text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span>ثبت فروشگاه جدید</span>
              </button>

              <button
                onClick={onLogout}
                className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 font-medium text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>خروج از حساب</span>
              </button>
            </div>

          </div>

          {/* Email Verification Status Banner */}
          <div className="mt-6 pt-5 border-t border-white/10">
            {user.isEmailVerified ? (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-bold">آدرس ایمیل شما تایید شده و حساب در وضعیت امن قرار دارد.</span>
                </div>
                <span className="hidden sm:inline text-[11px] bg-emerald-500/20 px-2.5 py-1 rounded-lg font-mono">
                  VERIFIED
                </span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold">ایمیل شما هنوز تایید نشده است.</span>
                    <p className="text-[11px] text-zinc-300">برای فعال‌سازی کامل امکانات، کد تایید ۶ رقمی را ثبت کنید.</p>
                  </div>
                </div>

                <button
                  onClick={handleVerifyEmailClick}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow cursor-pointer whitespace-nowrap"
                >
                  تایید ایمیل با کد ۶ رقمی
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-amber-500 text-black shadow-md'
                : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>اطلاعات پروفایل و تصویر</span>
          </button>

          <button
            onClick={() => setActiveTab('stores')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'stores'
                ? 'bg-amber-500 text-black shadow-md'
                : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            <StoreIcon className="w-4 h-4" />
            <span>فروشگاه‌های من</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'security'
                ? 'bg-amber-500 text-black shadow-md'
                : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>امنیت و رمز عبور</span>
          </button>
        </div>

        {/* Global Notifications */}
        {saveSuccess && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {saveError && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 1: PROFILE & AVATAR UPLOAD (WEBP + S3) */}
        {/* ================================================================= */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Avatar Upload with ParsPack S3 */}
            <div className="lg:col-span-5 space-y-4 bg-[#0d0f17] p-6 rounded-3xl border border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>تصویر آواتار (کاهش حجم WebP + استورج پارس‌پک)</span>
              </h3>
              
              <WebPUploadWidget
                folder="avatars"
                maxDimension={800}
                quality={0.85}
                label="آپلود عکس پروفایل جدید"
                onUploadSuccess={(url) => {
                  setAvatarUrl(url);
                  adminUpdateUser(user.id, { avatarUrl: url });
                  setSaveSuccess('عکس پروفایل به WebP تبدیل و در پارس‌پک ذخیره شد.');
                }}
              />

              {avatarUrl && (
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-[11px] font-mono text-zinc-400 break-all">
                  <span className="text-amber-400 block font-bold mb-1">آدرس مستقیم در ParsPack S3:</span>
                  {avatarUrl}
                </div>
              )}
            </div>

            {/* Right: Personal Details Form */}
            <div className="lg:col-span-7 bg-[#0d0f17] p-6 rounded-3xl border border-white/10 space-y-6">
              <h3 className="text-sm font-bold text-white">مشخصات کاربری</h3>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">نام و نام خانوادگی</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#141724] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">ایمیل (غیرقابل تغییر)</label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-zinc-400 dir-ltr text-left font-mono cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">شماره موبایل</label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#141724] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white dir-ltr text-left font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow cursor-pointer"
                >
                  ذخیره تغییرات پروفایل
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: MY STORES */}
        {/* ================================================================= */}
        {activeTab === 'stores' && (
          <div className="bg-[#0d0f17] p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">فروشگاه‌های ثبت‌شده من</h3>
                <p className="text-xs text-zinc-400">مدیریت آدرس، تصاویر WebP و اطلاعات تماس فروشگاه‌های شما</p>
              </div>

              <button
                onClick={() => onNavigate('register')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow"
              >
                <PlusCircle className="w-4 h-4" />
                <span>ثبت فروشگاه ورزشی جدید</span>
              </button>
            </div>

            <div className="p-8 border border-dashed border-white/15 rounded-2xl text-center space-y-3 bg-[#11131c]">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                <StoreIcon className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-white">فروشگاه ورزشی شما پس از ثبت و تایید در اینجا نمایش داده می‌شود</div>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                تصاویر فروشگاه به صورت خودکار به فرمت کم‌حجم WebP تبدیل شده و در کلاود استورج پارس‌پک ذخیره خواهند شد.
              </p>
              <button
                onClick={() => onNavigate('register')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-amber-400 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>شروع ثبت نام فروشگاه</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: SECURITY & PASSWORD */}
        {/* ================================================================= */}
        {activeTab === 'security' && (
          <div className="max-w-xl mx-auto bg-[#0d0f17] p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>تغییر رمز عبور</span>
            </h3>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">رمز عبور جدید (حداقل ۶ کاراکتر)</label>
                <input
                  type="password"
                  required
                  dir="ltr"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#141724] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white dir-ltr font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">تکرار رمز عبور جدید</label>
                <input
                  type="password"
                  required
                  dir="ltr"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#141724] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white dir-ltr font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                بروزرسانی رمز عبور
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
