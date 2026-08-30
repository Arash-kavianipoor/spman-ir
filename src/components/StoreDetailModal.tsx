import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Smartphone, 
  Globe, 
  Send, 
  Instagram, 
  MessageCircle, 
  Clock, 
  Star, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Navigation,
  ExternalLink,
  Share2,
  Check
} from 'lucide-react';
import { Store } from '../types';

interface StoreDetailModalProps {
  store: Store | null;
  onClose: () => void;
  onOpenMap: (store: Store) => void;
}

export const StoreDetailModal: React.FC<StoreDetailModalProps> = ({ store, onClose, onOpenMap }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!store) return null;

  const images = Array.isArray(store.images) && store.images.length > 0
    ? store.images
    : [
        'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000',
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000',
      ];

  const handleShare = () => {
    const url = `${window.location.origin}/#store-${store.id}`;
    if (navigator.share) {
      navigator.share({
        title: store.name,
        text: `مشاهده مشخصات ${store.name} در سامانه spman.ir`,
        url: url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#0f1119] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#141724] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">{store.name}</h2>
              <span className="text-xs text-amber-400 font-medium">
                {store.city} ({store.area}) • {store.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
              title="اشتراک‌گذاری فروشگاه"
            >
              {copiedLink ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* 3 Photos Gallery Showcase */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black/60 border border-white/10">
              <img
                src={images[selectedPhotoIndex]}
                alt={`${store.name} عکس ${selectedPhotoIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/10">
                عکس {selectedPhotoIndex + 1} از ۳ (تصاویر اختصاصی فروشگاه)
              </div>
            </div>

            {/* 3 Thumbnails */}
            <div className="grid grid-cols-3 gap-3">
              {images.slice(0, 3).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${
                    selectedPhotoIndex === idx
                      ? 'border-amber-400 scale-[1.02] shadow-lg shadow-amber-500/20'
                      : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1.5 text-[10px] bg-black/70 px-1.5 py-0.5 rounded text-white font-mono">
                    عکس {idx + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Store Description & Highlights */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
            <h3 className="text-base font-bold text-amber-300">درباره فروشگاه و خدمات:</h3>
            <p className="text-sm text-zinc-200 leading-relaxed font-normal">
              {store.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-white/10 text-xs text-zinc-300">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>ساعات کاری: {store.workingHours}</span>
              </div>
              {store.rating && (
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>امتیاز رضایت مشتریان: {store.rating} از ۵ ({store.reviewCount || 40} نظر)</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Details & Phones */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" />
              <span>راه‌های ارتباطی و تماس مستقیم:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {store.phones.mobile1 && (
                <a
                  href={`tel:${store.phones.mobile1}`}
                  className="bg-amber-500/10 hover:bg-amber-500 hover:text-black border border-amber-500/30 p-3 rounded-2xl text-center transition-all group"
                >
                  <span className="block text-[11px] text-zinc-400 group-hover:text-black mb-1">شماره همراه اول (موبایل ۱)</span>
                  <span className="text-sm font-bold text-amber-300 group-hover:text-black font-mono dir-ltr block">{store.phones.mobile1}</span>
                </a>
              )}

              {store.phones.mobile2 && (
                <a
                  href={`tel:${store.phones.mobile2}`}
                  className="bg-white/5 hover:bg-white/15 border border-white/10 p-3 rounded-2xl text-center transition-all group"
                >
                  <span className="block text-[11px] text-zinc-400 mb-1">شماره همراه دوم (موبایل ۲)</span>
                  <span className="text-sm font-bold text-white font-mono dir-ltr block">{store.phones.mobile2}</span>
                </a>
              )}

              {store.phones.landline && (
                <a
                  href={`tel:${store.phones.landline}`}
                  className="bg-white/5 hover:bg-white/15 border border-white/10 p-3 rounded-2xl text-center transition-all group"
                >
                  <span className="block text-[11px] text-zinc-400 mb-1">تلفن ثابت فروشگاه</span>
                  <span className="text-sm font-bold text-white font-mono dir-ltr block">{store.phones.landline}</span>
                </a>
              )}
            </div>

            {/* Social Channels */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {store.social.whatsapp && (
                <a
                  href={store.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>پیام در واتساپ</span>
                </a>
              )}

              {store.social.telegram && (
                <a
                  href={store.social.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-sky-600/20 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/30 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>کانال تلگرام</span>
                </a>
              )}

              {store.social.instagram && (
                <a
                  href={store.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-pink-600/20 hover:bg-gradient-to-r hover:from-amber-500 hover:to-pink-600 text-pink-300 hover:text-white border border-pink-500/30 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  <Instagram className="w-4 h-4" />
                  <span>صفحه اینستاگرام</span>
                </a>
              )}

              {store.website && (
                <a
                  href={store.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-amber-600/20 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/30 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  <Globe className="w-4 h-4" />
                  <span>وب‌سایت رسمی فروشگاه</span>
                </a>
              )}
            </div>
          </div>

          {/* Location & Map Trigger */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>موقعیت مکانی و آدرس دقیق:</span>
              </div>
              <p className="text-xs text-zinc-300 max-w-lg">{store.address}</p>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenMap(store);
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer shrink-0"
            >
              <Navigation className="w-4 h-4" />
              <span>مشاهده نقشه زنده گوگل مپ</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
