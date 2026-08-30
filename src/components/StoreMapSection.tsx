import React, { useState } from 'react';
import { MapPin, Navigation, Phone, ExternalLink, Compass } from 'lucide-react';
import { Store } from '../types';

interface StoreMapSectionProps {
  stores: Store[];
  onSelectStore: (store: Store) => void;
  onOpenMapModal: (store: Store) => void;
  onGoToFullMap?: () => void;
}

export const StoreMapSection: React.FC<StoreMapSectionProps> = ({ stores, onSelectStore, onOpenMapModal, onGoToFullMap }) => {
  const [activeStoreId, setActiveStoreId] = useState<string>(stores[0]?.id || '');

  const activeStore = stores.find((s) => s.id === activeStoreId) || stores[0];

  if (!activeStore) return null;

  const { lat, lng } = activeStore.coordinates;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=fa&z=15&output=embed`;

  return (
    <section id="map-view" className="py-16 bg-[#090a0f] border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
              <Compass className="w-3.5 h-3.5" />
              <span>موقعیت مکانی زنده روی نقشه گوگل</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              نقشه تعاملی فروشگاه‌های ورزشی
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl font-normal">
              با انتخاب هر فروشگاه، موقعیت دقیق جغرافیایی، نقشه زنده و اطلاعات تماس آن به‌صورت پویا نمایش داده می‌شود.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onGoToFullMap && (
              <button
                onClick={onGoToFullMap}
                className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <span>ورود به نقشه سراسری کشور و فیلترها</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
            <div className="text-xs text-zinc-400 font-mono bg-white/5 px-3 py-2 rounded-xl">
              {stores.length} نقطه فعال
            </div>
          </div>
        </div>

        {/* Split View: Store List on Side & Live Google Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#11131b] border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl">
          
          {/* Store List Column */}
          <div className="lg:col-span-4 space-y-3 max-h-[500px] overflow-y-auto pr-1">
            <span className="text-xs font-bold text-zinc-400 block px-1">انتخاب فروشگاه برای نمایش روی نقشه:</span>
            {stores.map((store) => (
              <div
                key={store.id}
                onClick={() => setActiveStoreId(store.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  activeStoreId === store.id
                    ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg'
                    : 'bg-black/30 border-white/5 text-zinc-300 hover:bg-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold leading-tight">{store.name}</h4>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full shrink-0 font-medium">
                    {store.city}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                  <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">{store.area} - {store.address}</span>
                </div>
                <div className="text-[10px] text-amber-400/90 font-mono dir-ltr">
                  lat: {store.coordinates.lat}, lng: {store.coordinates.lng}
                </div>
              </div>
            ))}
          </div>

          {/* Live Google Map Frame & Info */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
            
            {/* Live Map Iframe */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-inner">
              <iframe
                title={`نقشه ${activeStore.name}`}
                src={mapEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>

            {/* Active Store Bar */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">{activeStore.name}</h4>
                <p className="text-xs text-zinc-400">{activeStore.address}</p>
                <div className="flex items-center gap-3 text-xs text-zinc-300 pt-1 font-mono">
                  {activeStore.phones.mobile1 && (
                    <span className="dir-ltr text-amber-300">موبایل: {activeStore.phones.mobile1}</span>
                  )}
                  {activeStore.phones.landline && (
                    <span className="dir-ltr text-zinc-400">تلفن: {activeStore.phones.landline}</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onOpenMapModal(activeStore)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow transition-all cursor-pointer shrink-0"
              >
                <Navigation className="w-4 h-4" />
                <span>مسیریابی تمام‌صفحه و اپلیکیشن‌ها</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
