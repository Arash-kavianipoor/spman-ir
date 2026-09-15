import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { ZoomIn, ZoomOut, Compass, MapPin, RefreshCw, Navigation, ExternalLink } from 'lucide-react';

export interface SingleStoreLeafletMapProps {
  lat: number;
  lng: number;
  storeName: string;
  storeAddress?: string;
  zoom?: number;
  className?: string;
}

export const SingleStoreLeafletMap: React.FC<SingleStoreLeafletMapProps> = ({
  lat,
  lng,
  storeName,
  storeAddress,
  zoom = 16,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [hasMapError, setHasMapError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  // Initialize Leaflet Map using pure OpenStreetMap tiles (100% free, no API keys)
  useEffect(() => {
    setHasMapError(false);
    if (!mapContainerRef.current) return;

    try {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: zoom,
        minZoom: 3,
        maxZoom: 19,
        zoomControl: false,
        scrollWheelZoom: true,
        dragging: true,
      });

      // ONLY 100% Free OpenStreetMap tile server
      const osmTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
      });

      osmTileLayer.addTo(map);
      tileLayerRef.current = osmTileLayer;

      mapInstanceRef.current = map;

      // Invalidate size after layout stabilization
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
      console.warn('Map initialization error:', err);
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
  }, [lat, lng, zoom, retryCount]);

  // Update Marker and Center when lat/lng/storeName change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || hasMapError) return;

    try {
      map.panTo([lat, lng], { animate: true, duration: 0.5 });

      if (markerRef.current) {
        markerRef.current.remove();
      }

      // High quality custom Gold Pin SVG
      const customHtml = `
        <div class="relative flex flex-col items-center justify-center cursor-pointer filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]">
          <div class="relative w-10 h-12 flex items-center justify-center transform transition-transform hover:scale-110">
            <svg viewBox="0 0 32 42" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M16 0C7.163 0 0 7.163 0 16C0 26.5 14.2 40.8 14.8 41.4C15.4 42 16.6 42 17.2 41.4C17.8 40.8 32 26.5 32 16C32 7.163 24.837 0 16 0Z" 
                fill="url(#singlePinGrad)" 
                stroke="#ffffff" 
                stroke-width="1.8"
              />
              <circle cx="16" cy="15" r="7.5" fill="#090a0f" stroke="#fbbf24" stroke-width="1.8" />
              <circle cx="16" cy="15" r="3.5" fill="#fbbf24" />
              <defs>
                <linearGradient id="singlePinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#fbbf24" />
                  <stop offset="100%" stop-color="#d97706" />
                </linearGradient>
              </defs>
            </svg>
            <div class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full animate-ping"></div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'custom-single-pin',
        iconSize: [40, 48],
        iconAnchor: [20, 48],
        popupAnchor: [0, -48],
        tooltipAnchor: [0, -48],
      });

      const marker = L.marker([lat, lng], {
        icon: customIcon,
        title: storeName,
      }).addTo(map);

      const tooltipHtml = `
        <div style="direction: rtl; text-align: right; min-width: 160px;" class="space-y-1">
          <strong style="color: #fbbf24; font-size: 12px; display: block;">📍 ${storeName}</strong>
          ${storeAddress ? `<div style="font-size: 10px; color: #d4d4d8;">${storeAddress}</div>` : ''}
          <div style="font-size: 9px; color: #a1a1aa; font-family: monospace; direction: ltr; text-align: left;">
            Lat: ${lat.toFixed(5)} | Lng: ${lng.toFixed(5)}
          </div>
        </div>
      `;

      marker.bindTooltip(tooltipHtml, {
        permanent: true,
        direction: 'top',
        offset: [0, -42],
        className: 'custom-leaflet-tooltip',
      });

      markerRef.current = marker;
    } catch (err) {
      console.warn('Marker rendering error:', err);
    }
  }, [lat, lng, storeName, storeAddress, hasMapError]);

  const handleZoomIn = useCallback(() => {
    try {
      mapInstanceRef.current?.zoomIn();
    } catch {}
  }, []);

  const handleZoomOut = useCallback(() => {
    try {
      mapInstanceRef.current?.zoomOut();
    } catch {}
  }, []);

  const handleRecenter = useCallback(() => {
    try {
      mapInstanceRef.current?.setView([lat, lng], zoom, { animate: true });
    } catch {}
  }, [lat, lng, zoom]);

  // Fallback UI if map fails
  if (hasMapError) {
    return (
      <div className={`relative w-full h-full min-h-[260px] rounded-2xl overflow-hidden border border-amber-500/20 bg-gradient-to-b from-[#12141f] to-[#0a0b10] flex flex-col items-center justify-center p-6 text-center space-y-4 ${className}`}>
        
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
          <MapPin className="w-7 h-7 animate-bounce" />
        </div>

        <div className="relative z-10 space-y-1.5 max-w-md">
          <h4 className="text-base font-bold text-white">
            موقعیت مکانی فروشگاه «{storeName}»
          </h4>
          <p className="text-xs text-zinc-400">
            می‌توانید از لینک‌های مستقیم OpenStreetMap یا اپلیکیشن‌های مسیریابی زیر برای مشاهده مکان دقیق فروشگاه استفاده نمایید.
          </p>
          <div className="text-[11px] font-mono text-amber-400 dir-ltr bg-black/40 px-3 py-1 rounded-lg border border-white/5 inline-block">
            Latitude: {lat.toFixed(5)} , Longitude: {lng.toFixed(5)}
          </div>
        </div>

        {/* Direct Navigation Links */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 pt-1">
          <a
            href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>OpenStreetMap</span>
          </a>
          <a
            href={`https://neshan.org/maps/@${lat},${lng},16z`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>نشان</span>
          </a>
          <a
            href={`https://balad.ir/location?latitude=${lat}&longitude=${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/30 text-teal-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>بلد</span>
          </a>
          <button
            type="button"
            onClick={() => setRetryCount((c) => c + 1)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>تلاش مجدد</span>
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className={`relative w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-[#090b12] shadow-inner select-none ${className}`}>
      
      {/* Leaflet Container Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0 cursor-grab active:cursor-grabbing" />

      {/* Top Right Banner Tag */}
      <div className="absolute top-3 right-3 z-20 pointer-events-none">
        <div className="bg-black/85 backdrop-blur-md border border-amber-500/30 px-3 py-1 rounded-xl shadow-lg flex items-center gap-2 text-[11px] text-white">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-bold">{storeName}</span>
        </div>
      </div>

      {/* Coordinates Pill & OpenStreetMap direct link (Top Left) */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-black/85 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-xl text-[10px] text-zinc-300 shadow font-mono dir-ltr">
        <span className="text-amber-400 font-bold">{lat.toFixed(5)}, {lng.toFixed(5)}</span>
        <a
          href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300 font-sans font-bold flex items-center gap-0.5 ml-1 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20"
          title="مشاهده در OpenStreetMap"
        >
          <span>OSM</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>

      {/* Map Control Buttons: Zoom In/Out & Recenter */}
      <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-xl bg-black/80 hover:bg-amber-500 hover:text-black text-zinc-200 border border-white/15 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
          title="بزرگ‌نمایی (Zoom In)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-xl bg-black/80 hover:bg-amber-500 hover:text-black text-zinc-200 border border-white/15 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
          title="کوچک‌نمایی (Zoom Out)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleRecenter}
          className="w-8 h-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow-lg shadow-amber-500/20 transition-colors cursor-pointer"
          title="مرکز کردن روی فروشگاه"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

// Also export as LeafletStoreMap as specified in prompt
export const LeafletStoreMap = SingleStoreLeafletMap;
