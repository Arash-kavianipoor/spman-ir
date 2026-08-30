import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Smartphone, 
  Globe, 
  Send, 
  Instagram, 
  MessageCircle, 
  Clock, 
  Star, 
  ChevronRight, 
  ChevronLeft, 
  Navigation,
  ExternalLink,
  Info,
  CheckCircle2
} from 'lucide-react';
import { Store } from '../types';

interface StoreCardProps {
  store: Store;
  onOpenMap: (store: Store) => void;
  onOpenDetail: (store: Store) => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, onOpenMap, onOpenDetail }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Guarantee at least 3 image slots
  const storeImages = Array.isArray(store.images) && store.images.length > 0
    ? store.images
    : [
        'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000',
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000',
      ];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % storeImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + storeImages.length) % storeImages.length);
  };

  return (
    <article className="group bg-[#11131b] border border-white/10 hover:border-amber-500/50 rounded-3xl overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col h-full">
      
      {/* 3-Photo Interactive Gallery Header */}
      <div className="relative aspect-[16/10] bg-black/60 overflow-hidden">
        
        {/* Main Photo Display */}
        <img
          src={storeImages[currentImageIndex]}
          alt={`${store.name} - تصویر شماره ${currentImageIndex + 1}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#11131b] via-transparent to-black/60 pointer-events-none" />

        {/* 3 Photos Indicator Pills / Selector */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            {storeImages.slice(0, 3).map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(idx);
                }}
                className={`transition-all rounded-full ${
                  currentImageIndex === idx
                    ? 'w-6 h-2 bg-amber-400'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
                title={`تصویر ${idx + 1} از ۳`}
              />
            ))}
            <span className="text-[10px] text-zinc-300 mr-1 font-mono">
              {currentImageIndex + 1}/۳
            </span>
          </div>

          {/* City Badge */}
          <span className="bg-amber-500/90 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-md">
            {store.city} • {store.area}
          </span>
        </div>

        {/* Next / Prev Image Chevrons */}
        {storeImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="تصویر قبلی"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              aria-label="تصویر بعدی"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Featured Tag */}
        {store.featured && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[11px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            فروشگاه تایید شده SPMAN
          </div>
        )}
      </div>

      {/* Store Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Title & Category */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 
              onClick={() => onOpenDetail(store)}
              className="text-lg sm:text-xl font-bold text-white hover:text-amber-400 cursor-pointer transition-colors leading-snug"
            >
              {store.name}
            </h3>
            {store.rating && (
              <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg text-amber-400 text-xs font-bold shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{store.rating}</span>
              </div>
            )}
          </div>
          
          <div className="text-xs text-amber-400/90 font-medium">
            تخصص: {store.category}
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed font-normal">
            {store.description}
          </p>
        </div>

        {/* Address */}
        <div className="bg-black/30 border border-white/5 rounded-2xl p-3 space-y-2">
          <div className="flex items-start gap-2 text-xs text-zinc-300">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{store.address}</span>
          </div>

          {store.workingHours && (
            <div className="flex items-center gap-2 text-[11px] text-zinc-400 pt-1 border-t border-white/5">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>ساعات کاری: {store.workingHours}</span>
            </div>
          )}
        </div>

        {/* Phone Numbers Clean & Structured Section */}
        <div className="space-y-2 pt-1 border-t border-white/5">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>شماره‌های تماس و سفارش:</span>
            </span>
            <span className="text-[10px] text-amber-400/80">لمس جهت تماس</span>
          </div>

          <div className="space-y-1.5">
            {/* Primary Mobile (Featured) */}
            {store.phones.mobile1 && (
              <a
                href={`tel:${store.phones.mobile1}`}
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 border border-amber-500/25 hover:border-amber-500 text-amber-300 hover:text-black transition-all group/phone"
                title={`تماس مستقیم با ${store.name}`}
              >
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <Smartphone className="w-3.5 h-3.5 text-amber-400 group-hover/phone:text-black shrink-0" />
                  <span className="text-zinc-300 group-hover/phone:text-black text-[11px]">همراه (اصلی):</span>
                </div>
                <span className="font-mono text-xs font-bold dir-ltr tracking-wider group-hover/phone:text-black">
                  {store.phones.mobile1}
                </span>
              </a>
            )}

            {/* Secondary Numbers Row (Mobile 2 & Landline) */}
            {(store.phones.mobile2 || store.phones.landline) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {/* Mobile 2 */}
                {store.phones.mobile2 && (
                  <a
                    href={`tel:${store.phones.mobile2}`}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-300 hover:text-white transition-all text-xs"
                    title="موبایل پشتیبان"
                  >
                    <span className="text-[10px] text-zinc-400">همراه ۲:</span>
                    <span className="font-mono text-[11px] dir-ltr text-zinc-200">
                      {store.phones.mobile2}
                    </span>
                  </a>
                )}

                {/* Landline */}
                {store.phones.landline && (
                  <a
                    href={`tel:${store.phones.landline}`}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-300 hover:text-white transition-all text-xs"
                    title="تلفن ثابت"
                  >
                    <span className="text-[10px] text-zinc-400">تلفن ثابت:</span>
                    <span className="font-mono text-[11px] dir-ltr text-zinc-200">
                      {store.phones.landline}
                    </span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Social & Digital Links */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            {store.social.whatsapp && (
              <a
                href={store.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/20 flex items-center justify-center transition-all"
                title="ارتباط در واتساپ"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            )}
            {store.social.telegram && (
              <a
                href={store.social.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-white border border-sky-500/20 flex items-center justify-center transition-all"
                title="کانال یا ارتباط در تلگرام"
              >
                <Send className="w-4 h-4" />
              </a>
            )}
            {store.social.instagram && (
              <a
                href={store.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-pink-500/10 hover:bg-gradient-to-tr hover:from-amber-500 hover:to-pink-600 text-pink-400 hover:text-white border border-pink-500/20 flex items-center justify-center transition-all"
                title="صفحه اینستاگرام فروشگاه"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {store.website && (
              <a
                href={store.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black border border-amber-500/20 flex items-center justify-center transition-all"
                title="مشاهده وب‌سایت اینترنتی"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Action Buttons: Live Google Map & Full Details */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenMap(store)}
              className="w-8 h-8 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-black border border-amber-500/30 flex items-center justify-center transition-all cursor-pointer"
              title="مشاهده موقعیت روی نقشه و مسیریابی"
              aria-label="مشاهده موقعیت روی نقشه"
            >
              <MapPin className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenDetail(store)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>جزئیات</span>
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </article>
  );
};
