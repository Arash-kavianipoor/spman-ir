import React from 'react';
import { Phone, MapPin, Globe, Shield, Heart, ArrowUp } from 'lucide-react';
import { ADMIN_PHONE, SITE_DOMAIN } from '../data/storeService';

interface FooterProps {
  onNavigate?: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
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
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Brand & About */}
          <div className="lg:col-span-5 space-y-4">
            <div 
              onClick={(e) => handleLinkClick(e, 'about')}
              className="flex items-center gap-3 cursor-pointer group inline-flex"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/30 to-orange-500/30 p-[1px] border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-all">
                <div className="w-full h-full bg-[#0d0f17] rounded-[15px] p-1.5 flex items-center justify-center overflow-hidden">
                  <img
                    src="/logo-compact.png"
                    alt="لوگوی اسپرت من"
                    className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div>
                <span className="text-xl font-black text-white block group-hover:text-amber-400 transition-colors">
                  spman<span className="text-amber-400">.ir</span>
                </span>
                <span className="text-[11px] text-zinc-400 font-medium block">
                  Sport Man Iran • سامانه جامع اسپرت من
                </span>
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed font-normal text-xs sm:text-sm">
              سامانه جامع و تخصصی معرفی فروشگاه‌های لوازم و تجهیزات ورزشی در سراسر کشور. هدف ما اتصال مستقیم ورزشکاران و علاقه‌مندان به معتبرترین فروشگاه‌های تجهیزات بدنسازی، دوچرخه، دمبل، کش ورزشی، بارفیکس و پوشاک ورزشی همراه با نقشه زنده گوگل، گالری ۳ تصویر و خطوط تماس مستقیم است.
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

          {/* Direct Actions */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white">خدمات و ثبت نام</h4>
            <div className="space-y-2">
              <a
                href="#register"
                className="block text-center py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black border border-amber-500/30 text-xs font-bold transition-all"
              >
                ثبت فروشگاه در سایت
              </a>
              <button
                onClick={(e) => handleLinkClick(e, 'about')}
                className="w-full text-center py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-amber-400 hover:text-white border border-amber-500/20 text-xs font-bold transition-all cursor-pointer"
              >
                صفحه اختصاصی درباره ما
              </button>
              <a
                href="#contact"
                className="block text-center py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-medium transition-all"
              >
                تماس با مدیریت ({ADMIN_PHONE})
              </a>
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
