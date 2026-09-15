import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Store } from '../types';
import { MapPin, Navigation, RefreshCw, Phone, ArrowUpRight, ExternalLink } from 'lucide-react';

interface IranInteractiveMapProps {
  stores: Store[];
  activeStoreId?: string;
  onSelectStore: (store: Store) => void;
  onOpenStoreDetail: (store: Store) => void;
  onOpenMapModal: (store: Store) => void;
  mapType?: 'dark' | 'satellite' | 'street';
  selectedRegionCenter?: { lat: number; lng: number; zoom: number; id: string } | null;
}

export const IranInteractiveMap: React.FC<IranInteractiveMapProps> = ({
  stores,
  activeStoreId,
  onSelectStore,
  onOpenStoreDetail,
  onOpenMapModal,
  selectedRegionCenter,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [hasMapError, setHasMapError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  // Initialize Map safely inside try-catch using ONLY OpenStreetMap
  useEffect(() => {
    setHasMapError(false);
    if (!mapContainerRef.current) return;

    try {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Iran center coordinates
      const iranCenter: L.LatLngExpression = [32.4279, 53.6880];
      const initialZoom = window.innerWidth < 640 ? 5 : 5.8;

      const map = L.map(mapContainerRef.current, {
        center: iranCenter,
        zoom: initialZoom,
        minZoom: 4,
        maxZoom: 19,
        zoomControl: false,
        scrollWheelZoom: true,
      });

      // Add zoom control at bottom-left
      L.control.zoom({ position: 'bottomleft' }).addTo(map);

      // ONLY 100% Free OpenStreetMap tile server - NO API key required EVER
      const osmTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
      });

      osmTileLayer.addTo(map);
      tileLayerRef.current = osmTileLayer;

      mapInstanceRef.current = map;

      const timer1 = setTimeout(() => {
        try { map.invalidateSize(); } catch {}
      }, 200);
      const timer2 = setTimeout(() => {
        try { map.invalidateSize(); } catch {}
      }, 600);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } catch (err) {
      console.warn('IranInteractiveMap initialization error:', err);
      setHasMapError(true);
    }

    return () => {
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      } catch {}
    };
  }, [retryCount]);

  // Render & Update Markers for ALL stores across Iran
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || hasMapError) return;

    try {
      // Clear previous markers
      Object.keys(markersRef.current).forEach((key) => {
        const marker = markersRef.current[key];
        if (marker) {
          marker.remove();
        }
      });
      markersRef.current = {};

      stores.forEach((store) => {
        const isSelected = store.id === activeStoreId;

        const customHtml = `
          <div class="relative flex flex-col items-center justify-center cursor-pointer group transform transition-transform duration-200 hover:scale-125 hover:z-50">
            <div class="relative w-8 h-10 flex items-center justify-center filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
              <svg viewBox="0 0 32 42" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 11.25 14.25 24.75 15.15 25.6a1.18 1.18 0 001.7 0C17.75 40.75 32 27.25 32 16 32 7.163 24.837 0 16 0z" 
                      fill="${isSelected ? '#f59e0b' : store.featured ? '#ea580c' : '#181b2a'}" 
                      stroke="${isSelected ? '#fef08a' : '#f59e0b'}" 
                      stroke-width="2"/>
                <circle cx="16" cy="15" r="7.5" fill="${isSelected ? '#000000' : '#f59e0b'}" />
                <circle cx="16" cy="15" r="3.5" fill="${isSelected ? '#f59e0b' : '#181b2a'}" />
              </svg>
              ${
                isSelected
                  ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping"></div>'
                  : ''
              }
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: customHtml,
          className: 'custom-compact-pin',
          iconSize: [32, 42],
          iconAnchor: [16, 42],
          popupAnchor: [0, -42],
          tooltipAnchor: [0, -42],
        });

        const marker = L.marker([store.coordinates.lat, store.coordinates.lng], {
          icon: customIcon,
          title: store.name,
        }).addTo(map);

        // Mouse Hover Tooltip
        const tooltipHtml = `
          <div style="direction: rtl; text-align: right; min-width: 170px;" class="space-y-1">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
              <strong style="color: #fbbf24; font-size: 12px;">${store.name}</strong>
              ${store.featured ? '<span style="background: #f59e0b; color: #000; font-size: 9px; font-weight: 900; padding: 1px 4px; border-radius: 4px;">ویژه</span>' : ''}
            </div>
            <div style="font-size: 10px; color: #d4d4d8;">📍 ${store.city} (${store.area})</div>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; padding-top: 4px; margin-top: 4px; border-top: 1px solid rgba(255,255,255,0.15);">
              <span style="color: #a1a1aa; font-size: 10px;">شماره تماس:</span>
              <span style="font-family: monospace; font-weight: bold; color: #fef08a; direction: ltr;">${store.phones.mobile1 || store.phones.landline || '-'}</span>
            </div>
            <div style="font-size: 9px; color: #f59e0b; text-align: center; padding-top: 2px;">👈 کلیک جهت مشاهده جزئیات و مسیریابی</div>
          </div>
        `;

        marker.bindTooltip(tooltipHtml, {
          direction: 'top',
          offset: [0, -38],
          opacity: 1,
          className: 'custom-leaflet-tooltip',
        });

        // Custom Popup HTML (On Click)
        const popupContent = document.createElement('div');
        popupContent.className = 'p-1 space-y-2';
        popupContent.innerHTML = `
          <div class="flex items-start gap-3">
            <img src="${store.images[0]}" alt="${store.name}" class="w-14 h-14 rounded-xl object-cover border border-amber-500/30" />
            <div class="space-y-0.5">
              <h4 class="font-black text-xs text-white">${store.name}</h4>
              <div class="text-[10px] text-amber-400 font-bold">${store.city} - ${store.area}</div>
              <div class="text-[10px] text-zinc-300 line-clamp-1">${store.category}</div>
            </div>
          </div>
          <div class="text-[10px] text-zinc-400 leading-snug border-t border-white/10 pt-1.5">
            📍 ${store.address}
          </div>
          <div class="flex items-center justify-between pt-1 border-t border-white/10 text-[11px]">
            <span class="font-mono text-amber-300 font-bold dir-ltr">${store.phones.mobile1 || ''}</span>
            <div class="flex items-center gap-1.5">
              <button id="popup-btn-detail-${store.id}" class="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] cursor-pointer">
                پروفایل و عکس‌ها
              </button>
              <button id="popup-btn-nav-${store.id}" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-[10px] cursor-pointer">
                مسیریابی
              </button>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, { maxWidth: 280 });

        marker.on('click', () => {
          onSelectStore(store);
        });

        marker.on('popupopen', () => {
          const detailBtn = document.getElementById(`popup-btn-detail-${store.id}`);
          if (detailBtn) {
            detailBtn.onclick = () => onOpenStoreDetail(store);
          }
          const navBtn = document.getElementById(`popup-btn-nav-${store.id}`);
          if (navBtn) {
            navBtn.onclick = () => onOpenMapModal(store);
          }
        });

        markersRef.current[store.id] = marker;
      });
    } catch (err) {
      console.warn('Marker rendering error:', err);
    }
  }, [stores, activeStoreId, onSelectStore, onOpenStoreDetail, onOpenMapModal, hasMapError]);

  // Handle Region Flying or Center updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedRegionCenter || hasMapError) return;

    try {
      map.flyTo(
        [selectedRegionCenter.lat, selectedRegionCenter.lng],
        selectedRegionCenter.zoom,
        {
          duration: 1.5,
          easeLinearity: 0.25,
        }
      );
    } catch {}
  }, [selectedRegionCenter, hasMapError]);

  // Fallback UI if map initialization fails
  if (hasMapError) {
    return (
      <div className="relative w-full h-full min-h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-amber-500/20 bg-gradient-to-b from-[#12141f] to-[#07080b] p-6 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">سامانه نقشه OpenStreetMap</h4>
                <p className="text-xs text-zinc-400">موقعیت دقیق فروشگاه‌های ورزشی</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRetryCount((c) => c + 1)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>بارگذاری مجدد</span>
            </button>
          </div>

          {/* Fallback Stores List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-1">
            {stores.map((s) => (
              <div
                key={s.id}
                onClick={() => onSelectStore(s)}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between gap-3 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 font-black text-xs">
                    📍
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white truncate">{s.name}</div>
                    <div className="text-[10px] text-zinc-400 truncate">{s.city} • {s.category}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenStoreDetail(s);
                  }}
                  className="px-2 py-1 rounded-lg bg-amber-500/15 text-amber-300 text-[10px] hover:bg-amber-500 hover:text-black transition-colors shrink-0"
                >
                  مشاهده
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-zinc-400 text-center pt-2">
          تمام فروشگاه‌ها به صورت مستقیم از طریق فهرست و دکمه‌های مسیریابی قابل دسترسی هستند.
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#090b12]">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
