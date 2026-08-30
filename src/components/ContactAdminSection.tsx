import React from 'react';
import { Phone, MessageCircle, Send, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import { ADMIN_PHONE, ADMIN_PHONE_INTL, SITE_DOMAIN } from '../data/storeService';

export const ContactAdminSection: React.FC = () => {
  return (
    <section id="contact" className="py-16 bg-[#0e1017] border-t border-white/5 relative overflow-hidden">
      
      {/* Ambience */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-br from-[#161926] to-[#0f111a] border border-amber-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Text & Hotline */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>پشتیبانی مستقیم و اختصاصی مدیریت {SITE_DOMAIN}</span>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  ارتباط مستقیم با مدیر سامانه SPMAN
                </h2>
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
                  جهت ثبت فروشگاه جدید، به‌روزرسانی اطلاعات، ثبت تبلیغات یا مشاوره ورزشی، با شماره مستقیم مدیریت سایت در ارتباط باشید:
                </p>
              </div>

              {/* Big Phone Card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-black/50 border border-amber-500/30 p-5 rounded-2xl">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-black flex items-center justify-center font-bold shadow-lg shadow-amber-500/30 shrink-0">
                  <Phone className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs text-zinc-400 font-medium block">شماره تلفن مستقیم مدیریت:</span>
                  <a
                    href={`tel:${ADMIN_PHONE}`}
                    className="text-2xl sm:text-3xl font-black text-amber-400 hover:text-amber-300 transition-colors font-mono dir-ltr block tracking-wider"
                  >
                    {ADMIN_PHONE}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>پاسخگویی سریع همه‌روزه ۹ الی ۲۲</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400" />
                  <span>پشتیبانی در تلگرام و واتساپ</span>
                </div>
              </div>
            </div>

            {/* Quick Action Channels */}
            <div className="lg:col-span-5 flex flex-col gap-3.5">
              
              <a
                href={`tel:${ADMIN_PHONE}`}
                className="flex items-center justify-between p-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all shadow-lg shadow-amber-500/20 group"
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">برقراری تماس تلفنی مستقیم</span>
                </div>
                <span className="font-mono text-sm dir-ltr">{ADMIN_PHONE}</span>
              </a>

              <a
                href={`https://wa.me/${ADMIN_PHONE_INTL}?text=${encodeURIComponent('سلام، جهت هماهنگی و ثبت فروشگاه در سامانه spman.ir پیام می‌دهم.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white font-bold transition-all group"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">ارسال پیام به واتساپ مدیریت</span>
                </div>
                <span className="text-xs text-zinc-400 group-hover:text-white">آنلاین</span>
              </a>

              <a
                href={`https://t.me/share/url?url=${encodeURIComponent('https://spman.ir')}&text=${encodeURIComponent(`سلام و وقت بخیر، درخواست ارتباط با مدیریت سایت spman.ir (${ADMIN_PHONE})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl bg-sky-600/20 hover:bg-sky-600 border border-sky-500/30 text-sky-300 hover:text-white font-bold transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Send className="w-5 h-5" />
                  <span className="text-sm">ارتباط از طریق تلگرام</span>
                </div>
                <span className="text-xs text-zinc-400 group-hover:text-white">سریع</span>
              </a>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
