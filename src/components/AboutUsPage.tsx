import React from 'react';
import { 
  ShieldCheck, 
  Target, 
  Users, 
  MapPin, 
  Phone, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Activity,
  Award,
  Zap,
  Globe2,
  Share2
} from 'lucide-react';
import { ADMIN_PHONE, SITE_DOMAIN } from '../data/storeService';

interface AboutUsPageProps {
  onBackToHome: () => void;
  onGoToRegister: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({
  onBackToHome,
  onGoToRegister,
}) => {
  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs sm:text-sm font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 rotate-180" />
            <span>بازگشت به صفحه اصلی</span>
          </button>

          <span className="text-xs text-amber-400 font-mono font-bold tracking-wider">
            SPORTMAN.IR • درباره ما
          </span>
        </div>

        {/* Top Hero Section with Full-Res Original High Quality Logo */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#131726] to-[#0d0f18] border border-white/10 p-8 sm:p-14 text-center overflow-hidden shadow-2xl space-y-8">
          
          {/* Subtle Background Glows */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 right-10 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Full-Res Original Master Logo */}
          <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
            <div className="relative flex items-center justify-center">
              <img
                src="/logo-full.png"
                alt="لوگوی رسمی اسپرت من (Sport Man)"
                className="w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 object-contain filter drop-shadow-[0_12px_32px_rgba(245,158,11,0.4)] hover:scale-105 transition-transform duration-300"
                loading="eager"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <Award className="w-4 h-4" />
                <span>درباره پلتفرم تخصصی اسپرت من (spman.ir)</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                اسپرت من؛ پل ارتباطی ورزشکاران و فروشگاه‌های معتبر ورزشی
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
                جامع‌ترین بانک اطلاعاتی، نقشه زنده ماهواره‌ای و مرجع آنلاین برای دسترسی آسان به فروشگاه‌های لوازم، پوشاک و تجهیزات تخصصی ورزشی در سراسر ایران.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 block font-mono">۱۰۰٪</span>
              <span className="text-xs text-zinc-400 mt-1 block">اطلاعات تایید شده</span>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 block font-mono">زنده</span>
              <span className="text-xs text-zinc-400 mt-1 block">مسیریابی دقیق گوگل‌مپ</span>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 block font-mono">مستقیم</span>
              <span className="text-xs text-zinc-400 mt-1 block">بدون واسطه و کمیسیون</span>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 block font-mono">سراسری</span>
              <span className="text-xs text-zinc-400 mt-1 block">پوشش استان‌ها و شهرها</span>
            </div>
          </div>

        </div>

        {/* Core Mission & Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission */}
          <div className="p-8 rounded-3xl bg-[#0f121d] border border-white/10 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">هدف و ماموریت ما</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              پلتفرم <strong className="text-amber-400 font-bold">اسپرت من (spman.ir)</strong> با هدف از میان برداشتن واسطه‌ها و تسهیل دسترسی ورزشکاران، مربیان و مدیران باشگاه‌ها به برترین تامین‌کنندگان تجهیزات ورزشی راه‌اندازی شده است. ما بستری شفاف و مدرن فراهم کرده‌ایم تا هر شخص بتواند نزدیک‌ترین و مجهزترین فروشگاه‌ها را بر روی نقشه مشاهده و مستقیماً ارتباط برقرار کند.
            </p>
          </div>

          {/* Core Values */}
          <div className="p-8 rounded-3xl bg-[#0f121d] border border-white/10 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">تضمین اصالت و شفافیت</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              تمامی فروشگاه‌های ثبت‌شده در این سامانه دارای گالری تصاویر واقعی از محیط فروشگاه و کالاها، خطوط تماس ثابت و همراه معتبر، و مشخصات جغرافیایی تایید شده هستند تا خریداران با خیالی آسوده و آگاهی کامل نسبت به انتخاب مقصد خرید خود اقدام نمایند.
            </p>
          </div>

        </div>

        {/* Feature Highlights */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-white">چرا اسپرت من؟</h2>
            <p className="text-xs sm:text-sm text-zinc-400">مزایای منحصر‌به‌فرد پلتفرم برای خریداران و صاحبان کسب‌وکار</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-[#0c0e17] border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">نقشه تعاملی و هوشمند</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                مشاهده آنلاین موقعیت دقیق بر روی نقشه ماهواره‌ای به همراه امکان مسیریابی بلادرنگ با گوگل‌مپ و نشان.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c0e17] border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">ارتباط مستقیم و بی‌واسطه</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                دسترسی فوری به تلفن‌های تماس، شماره واتس‌اپ و شبکه‌های اجتماعی فروشگاه‌ها بدون پرداخت هیچ‌گونه کارمزد.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c0e17] border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">ثبت آسان فروشگاه‌ها</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                فروشگاه‌داران سراسر کشور می‌توانند در کمتر از ۲ دقیقه مشخصات و مکان فروشگاه خود را جهت معرفی رایگان ثبت نمایند.
              </p>
            </div>

          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 text-black flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center sm:text-right">
            <h3 className="text-2xl sm:text-3xl font-black">صاحب فروشگاه ورزشی هستید؟</h3>
            <p className="text-sm font-medium text-black/80 max-w-lg">
              همین حالا فروشگاه خود را به هزاران ورزشکار و مشتری مشتاق در شهر خود معرفی کنید.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onGoToRegister}
              className="px-6 py-3 rounded-2xl bg-black text-white hover:bg-zinc-900 font-extrabold text-sm transition-all shadow-lg cursor-pointer"
            >
              ثبت رایگان فروشگاه
            </button>
            <a
              href={`tel:${ADMIN_PHONE}`}
              className="px-5 py-3 rounded-2xl bg-black/10 hover:bg-black/20 text-black border border-black/20 font-bold text-sm transition-all"
            >
              تماس با مدیر ({ADMIN_PHONE})
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
