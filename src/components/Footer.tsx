import React from 'react';
import { 
  Phone, MapPin, Globe, Shield, Heart, ArrowUp, 
  LogIn, UserPlus, UserCheck, ShieldAlert, LogOut, 
  User as UserIcon, Sparkles, CheckCircle2 
} from 'lucide-react';
import { ADMIN_PHONE, SITE_DOMAIN } from '../data/storeService';
import { User } from '../types';

interface FooterProps {
  onNavigate?: (view: string) => void;
  currentUser?: User | null;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
  onOpenDashboard?: () => void;
  onOpenAdminPanel?: () => void;
  onLogout?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onNavigate,
  currentUser,
  onOpenAuthModal,
  onOpenDashboard,
  onOpenAdminPanel,
  onLogout,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (e: React.MouseEvent, target: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(target);
    }
  };

  return (
    <footer className="bg-[#07080b] border-t border-white/10 pt-16 pb-12 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* ========================================================================= */}
        {/* EXCLUSIVE FOOTER AUTH & USER ACCOUNT BAR (دکمه ورود و ثبت نام فقط در فوتر) */}
        {/* ========================================================================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#121626] via-[#0d0f1a] to-[#141829] border border-amber-500/20 p-6 sm:p-8 shadow-2xl">
          
          {/* Subtle warm glow */}
          <div className="absolute top-0 right-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left: Info Message */}
            <div className="flex items-center gap-4 text-center md:text-right">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mx-auto md:mx-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {currentUser ? `خوش آمدید، ${currentUser.fullName}` : 'ناحیه کاربری و ورود به سامانه اسپرت من'}
                  </h3>
                  {currentUser && currentUser.isEmailVerified && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      ایمیل تایید شده
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 max-w-xl">
                  {currentUser
                    ? 'از طریق دکمه زیر می‌توانید به داشبورد شخصی خود جهت مدیریت فروشگاه، آواتار و تنظیمات دسترسی داشته باشید.'
                    : 'ورود سریع به حساب کاربری، ثبت نام با کد تایید ۶ رقمی ایمیل و پنل مدیریت اسپرت من.'}
                </p>
              </div>
            </div>

            {/* Right: Dedicated Login & Registration Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {currentUser ? (
                <>
                  {/* Dashboard Shortcut */}
                  <button
                    onClick={onOpenDashboard}
                    className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>داشبورد کاربری من</span>
                  </button>

                  {/* Admin Shortcut if Admin */}
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={onOpenAdminPanel}
                      className="px-4 py-3 rounded-2xl bg-[#1c1f2e] hover:bg-amber-500 hover:text-black border border-amber-500/40 text-amber-400 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>پنل مدیریت</span>
                    </button>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={onLogout}
                    className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 text-xs font-medium transition-all flex items-center gap-2 cursor-pointer"
                    title="خروج از حساب"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>خروج</span>
                  </button>
                </>
              ) : (
                <>
                  {/* 1. Login Button */}
                  <button
                    onClick={() => onOpenAuthModal?.('login')}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-amber-500/25 flex items-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 text-black" />
                    <span>ورود به حساب کاربری</span>
                  </button>

                  {/* 2. Register Button */}
                  <button
                    onClick={() => onOpenAuthModal?.('register')}
                    className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm active:scale-95 transition-all flex items-center gap-2 backdrop-blur-md cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-amber-400" />
                    <span>ثبت نام کاربر جدید (تایید با ایمیل)</span>
                  </button>
                </>
              )}
            </div>

          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Brand & About */}
          <div className="lg:col-span-5 space-y-4">
            <div 
              onClick={(e) => handleLinkClick(e, 'about')}
              className="flex items-center gap-3.5 sm:gap-4 cursor-pointer group inline-flex"
            >
              <div className="relative flex items-center justify-center">
                <img
                  src="/logo-compact.png"
                  alt="لوگوی اسپرت من"
                  className="w-14 h-14 sm:w-18 sm:h-18 object-contain filter drop-shadow-[0_4px_12px_rgba(245,158,11,0.3)] group-hover:scale-105 group-hover:drop-shadow-[0_6px_18px_rgba(245,158,11,0.5)] transition-all duration-300"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl sm:text-2xl font-black text-white block group-hover:text-amber-400 transition-colors">
                  spman<span className="text-amber-400">.ir</span>
                </span>
                <span className="text-xs sm:text-sm text-zinc-400 font-medium block">
                  Sport Man Iran • سامانه جامع اسپرت من
                </span>
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed font-normal text-xs sm:text-sm">
              سامانه جامع و تخصصی معرفی فروشگاه‌های لوازم و تجهیزات ورزشی در سراسر کشور. هدف ما اتصال مستقیم ورزشکاران و علاقه‌مندان به معتبرترین فروشگاه‌های تجهیزات بدنسازی، دوچرخه، دمبل، کش ورزشی، بارفیکس و پوشاک ورزشی همراه با نقشه زنده، ذخیره‌سازی ابری تصاویر WebP در ParsPack S3 و پایگاه داده مدرن Cloudflare D1 است.
            </p>

            <div className="flex items-center gap-2 pt-2 text-zinc-300">
              <Phone className="w-4 h-4 text-amber-400" />
              <span>شماره مستقیم مدیر سایت: </span>
              <a href={`tel:${ADMIN_PHONE}`} className="text-amber-400 font-bold font-mono dir-ltr">
                {ADMIN_PHONE}
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white">دسته‌بندی‌های ورزشی محبوب</h4>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#equipment" className="hover:text-amber-400 transition-colors">فروشگاه‌های دوچرخه و اقلام دوچرخه‌سواری</a></li>
              <li><a href="#equipment" className="hover:text-amber-400 transition-colors">دمبل‌های شش‌ضلعی و ست وزنه‌های بدنسازی</a></li>
              <li><a href="#equipment" className="hover:text-amber-400 transition-colors">کش‌های ورزشی، پاورباند و مینی‌لوپ</a></li>
              <li><a href="#equipment" className="hover:text-amber-400 transition-colors">میله‌های بارفیکس چندمنظوره و لادری</a></li>
              <li><a href="#equipment" className="hover:text-amber-400 transition-colors">دستگاه‌های فنری و گریپر تقویت مچ دست</a></li>
              <li><a href="#equipment" className="hover:text-amber-400 transition-colors">تجهیزات کراس‌فیت، تی‌آر‌ایکس و مت یوگا</a></li>
            </ul>
          </div>

          {/* Quick Links & Cities */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white">دسترسی سریع</h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <button
                  onClick={(e) => handleLinkClick(e, 'about')}
                  className="hover:text-amber-400 transition-colors text-right cursor-pointer font-bold text-zinc-200"
                >
                  درباره ما (spman.ir)
                </button>
              </li>
              <li><a href="#stores" className="hover:text-amber-400 transition-colors">فروشگاه‌های تهران</a></li>
              <li><a href="#stores" className="hover:text-amber-400 transition-colors">فروشگاه‌های شیراز</a></li>
              <li><a href="#stores" className="hover:text-amber-400 transition-colors">فروشگاه‌های اصفهان</a></li>
              <li><a href="#stores" className="hover:text-amber-400 transition-colors">فروشگاه‌های مشهد</a></li>
              <li><a href="#stores" className="hover:text-amber-400 transition-colors">فروشگاه‌های کرج</a></li>
            </ul>
          </div>

          {/* Direct Actions & Admin Access */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white">خدمات و پنل مدیریت</h4>
            <div className="space-y-2">
              <a
                href="#register"
                className="block text-center py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black border border-amber-500/30 text-xs font-bold transition-all"
              >
                ثبت فروشگاه در سایت
              </a>
              
              <button
                onClick={onOpenAdminPanel}
                className="w-full text-center py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-amber-400 hover:text-white border border-amber-500/20 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>ورود به پنل مدیریت</span>
              </button>

              <button
                onClick={(e) => handleLinkClick(e, 'about')}
                className="w-full text-center py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 text-xs font-medium transition-all cursor-pointer"
              >
                صفحه اختصاصی درباره ما
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div className="flex flex-wrap items-center gap-2">
            <span>تمامی حقوق مادی و معنوی برای وب‌سایت</span>
            <strong className="text-amber-400 font-bold">spman.ir (اسپرت من)</strong>
            <span>محفوظ است. ۲۰۲۶ ©</span>
            <span className="hidden sm:inline text-zinc-700">|</span>
            <span>
              طراحی سایت توسط{' '}
              <a 
                href="https://sorena-it.ir" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 transition-colors font-bold underline underline-offset-4"
              >
                Sorena-IT
              </a>
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <span>بازگشت به بالای صفحه</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
