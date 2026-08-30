import React from 'react';
import { X, MapPin, Navigation, ExternalLink, Phone, Smartphone, Copy, Check } from 'lucide-react';
import { Store } from '../types';

interface StoreMapModalProps {
  store: Store | null;
  onClose: () => void;
}

export const StoreMapModal: React.FC<StoreMapModalProps> = ({ store, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!store) return null;

  const { lat, lng } = store.coordinates;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=fa&z=16&output=embed`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const wazeUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
  const neshanUrl = `https://neshan.org/maps/@${lat},${lng},16z`;
  const baladUrl = `https://balad.ir/location?latitude=${lat}&longitude=${lng}`;

  const copyCoordinates = () => {
    navigator.clipboard.writeText(`${lat}, ${lng}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#10121a] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-5 bg-[#151824] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">{store.name}</h3>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                <span>{store.city} ({store.area})</span>
                <span>•</span>
                <span className="text-amber-400 font-mono dir-ltr">
                  مختصات: {lat.toFixed(4)}, {lng.toFixed(4)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Map & Info */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Live Google Maps Iframe */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-inner">
            <iframe
              title={`نقشه زنده ${store.name}`}
              src={mapEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>

          {/* Quick Coordinate & Address Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Address & Working Hours */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-zinc-400 block mb-1">آدرس فروشگاه:</span>
                  <p className="text-sm text-white font-medium leading-relaxed">{store.address}</p>
                </div>
              </div>

              {store.workingHours && (
                <div className="text-xs text-zinc-400 pt-2 border-t border-white/10">
                  <span className="font-semibold text-zinc-300">ساعات کاری: </span>
                  {store.workingHours}
                </div>
              )}
            </div>

            {/* Coordinates & Direct Quick Navigation Apps */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-zinc-400">مختصات جغرافیایی (JSON Lat, Lng):</span>
                  <button
                    onClick={copyCoordinates}
                    className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'کپی شد' : 'کپی مختصات'}</span>
                  </button>
                </div>
                <div className="bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 dir-ltr text-center">
                  lat: {lat} , lng: {lng}
                </div>
              </div>

              {/* Navigation App Buttons */}
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <span className="text-[11px] text-zinc-400 font-semibold block">مسیریابی در اپلیکیشن‌های نقشه:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 rounded-xl py-2 text-xs font-bold transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>گوگل مپ</span>
                  </a>
                  <a
                    href={wazeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-white border border-sky-500/30 rounded-xl py-2 text-xs font-bold transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>ویز (Waze)</span>
                  </a>
                  <a
                    href={neshanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/30 rounded-xl py-2 text-xs font-bold transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>نشان</span>
                  </a>
                  <a
                    href={baladUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-xl py-2 text-xs font-bold transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>بلد</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Direct Phone Dialing Bar */}
          <div className="bg-black/40 border border-amber-500/20 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-amber-300 font-bold">
              <Phone className="w-4 h-4" />
              <span>شماره‌های تماس جهت هماهنگی حضوری:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
              {store.phones.mobile1 && (
                <a
                  href={`tel:${store.phones.mobile1}`}
                  className="bg-amber-500 text-black font-bold px-3 py-1.5 rounded-xl hover:bg-amber-400 transition-colors dir-ltr"
                >
                  موبایل ۱: {store.phones.mobile1}
                </a>
              )}
              {store.phones.mobile2 && (
                <a
                  href={`tel:${store.phones.mobile2}`}
                  className="bg-white/10 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-white/20 transition-colors dir-ltr"
                >
                  موبایل ۲: {store.phones.mobile2}
                </a>
              )}
              {store.phones.landline && (
                <a
                  href={`tel:${store.phones.landline}`}
                  className="bg-white/10 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-white/20 transition-colors dir-ltr"
                >
                  ثابت: {store.phones.landline}
                </a>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
