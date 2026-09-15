import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { ZoomIn, ZoomOut, Compass, MousePointerClick, RefreshCw, MapPin, Move } from 'lucide-react';

interface LocationPickerMapProps {
  lat: number;
  lng: number;
  onLocationChange?: (lat: number, lng: number) => void;
  onChangeLocation?: (lat: number, lng: number) => void;
  city?: string;
  area?: string;
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  lat,
  lng,
  onLocationChange,
  onChangeLocation,
  city,
  area,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const isUserInteractingRef = useRef<boolean>(false);

  // Safe handler callback supporting either prop name
  const notifyChangeRef = useRef<(newLat: number, newLng: number) => void>(() => {});
  useEffect(() => {
    notifyChangeRef.current = (newLat: number, newLng: number) => {
      if (typeof onLocationChange === 'function') {
        onLocationChange(newLat, newLng);
      }
      if (typeof onChangeLocation === 'function') {
        onChangeLocation(newLat, newLng);
      }
    };
  }, [onLocationChange, onChangeLocation]);

  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({ lat, lng });
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [hasMapError, setHasMapError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  // Initialize Leaflet Map safely in try-catch with OpenStreetMap (100% Free, NO API Key)
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
        zoom: 15,
        minZoom: 4,
        maxZoom: 19,
        zoomControl: false,
        scrollWheelZoom: true,
      });

      // ONLY pure OpenStreetMap tiles
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
      });

      osmLayer.addTo(map);
      tileLayerRef.current = osmLayer;

      mapInstanceRef.current = map;

      // Event listeners for dragging map & picking coordinates
      map.on('movestart', () => {
        isUserInteractingRef.current = true;
        setIsMoving(true);
      });

      map.on('move', () => {
        const center = map.getCenter();
        setCurrentCoords({ lat: center.lat, lng: center.lng });
      });

      map.on('moveend', () => {
        const center = map.getCenter();
        setCurrentCoords({ lat: center.lat, lng: center.lng });
        setIsMoving(false);
        notifyChangeRef.current(center.lat, center.lng);
        isUserInteractingRef.current = false;
      });

      // Click to center
      map.on('click', (e: L.LeafletMouseEvent) => {
        map.panTo(e.latlng, { animate: true, duration: 0.3 });
      });

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
      console.warn('LocationPickerMap init error:', err);
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

  // Sync map center when coordinates change from outside
  useEffect(() => {
    if (isUserInteractingRef.current || hasMapError) return;

    const map = mapInstanceRef.current;
    if (!map) return;

    try {
      const center = map.getCenter();
      const distance = Math.hypot(center.lat - lat, center.lng - lng);

      if (distance > 0.0001) {
        map.panTo([lat, lng], { animate: true, duration: 0.3 });
        setCurrentCoords({ lat, lng });
      }
    } catch {}
  }, [lat, lng, hasMapError]);

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
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([lat, lng], 16, { animate: true });
      }
    } catch {}
  }, [lat, lng]);

  if (hasMapError) {
    return (
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] min-h-[300px] rounded-2xl overflow-hidden border border-amber-500/20 bg-gradient-to-b from-[#12141f] to-[#0a0c14] p-6 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <MapPin className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-bold text-white">سامانه نقشه انتخاب موقعیت</h4>
          <p className="text-xs text-zinc-400">می‌توانید مختصات را مستقیماً در کادرهای بالا وارد کنید یا نقشه را مجدداً بارگذاری فرمایید.</p>
        </div>
        <button
          type="button"
          onClick={() => setRetryCount((c) => c + 1)}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
        >
          <RefreshCw className="w-4 h-4" />
          <span>بارگذاری مجدد نقشه</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] min-h-[350px] rounded-2xl overflow-hidden border border-white/15 bg-[#0a0c14] shadow-inner select-none">
      
      {/* Leaflet Map DOM Canvas */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full z-0 cursor-grab active:cursor-grabbing"
      />

      {/* CENTER PIN */}
      <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
        
        {/* Container anchored to exact center */}
        <div className="relative flex flex-col items-center justify-end -mt-12">
          
          {/* Status Tooltip Tag */}
          <div 
            className={`mb-1.5 whitespace-nowrap bg-black/90 text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-500/40 shadow-2xl flex items-center gap-1.5 transition-all duration-200 ${
              isMoving 
                ? 'scale-110 -translate-y-3 bg-amber-500 text-black border-white' 
                : 'scale-100 translate-y-0'
            }`}
          >
            {isMoving ? (
              <>
                <Move className="w-3.5 h-3.5 animate-spin" />
                <span>در حال تنظیم موقعیت...</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>موقعیت انتخاب شد</span>
              </>
            )}
          </div>

          {/* Ground Ring on exact center */}
          <div 
            className={`absolute bottom-0 w-8 h-3 rounded-full transition-all duration-200 ${
              isMoving 
                ? 'bg-amber-400/20 scale-150 blur-[4px]' 
                : 'bg-amber-500/50 scale-100 blur-[2px]'
            }`}
          />

          {/* High Quality SVG Pin with Dynamic Float & Bounce */}
          <div 
            className={`relative w-12 h-14 transition-transform duration-200 ease-out filter drop-shadow-[0_10px_16px_rgba(0,0,0,0.8)] ${
              isMoving ? '-translate-y-4 scale-115' : 'translate-y-0 scale-100'
            }`}
          >
            <svg viewBox="0 0 32 42" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M16 0C7.163 0 0 7.163 0 16C0 26.5 14.2 40.8 14.8 41.4C15.4 42 16.6 42 17.2 41.4C17.8 40.8 32 26.5 32 16C32 7.163 24.837 0 16 0Z" 
                fill="url(#centerPinGradSmooth)" 
                stroke="#ffffff" 
                strokeWidth="1.8"
              />
              <circle cx="16" cy="15" r="7.5" fill="#090a0f" stroke="#fbbf24" strokeWidth="1.8" />
              <circle cx="16" cy="15" r="3.5" fill="#fbbf24" />
              <defs>
                <linearGradient id="centerPinGradSmooth" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Crosshair Center Point */}
          <div className="w-2 h-2 rounded-full bg-amber-400 border border-black -mt-1 shadow-sm"></div>
        </div>
      </div>

      {/* Top Banner Guide */}
      <div className="absolute top-3 right-3 left-3 sm:left-auto z-30 pointer-events-none">
        <div className="bg-black/85 backdrop-blur-md border border-amber-500/30 text-white px-3.5 py-1.5 rounded-xl shadow-xl flex items-center gap-2 text-xs">
          <MousePointerClick className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-medium text-[11px] sm:text-xs">
            نقشه را با موس <strong className="text-amber-400">جابجا کنید</strong> تا پین روی مکان فروشگاه تنظیم شود | <strong className="text-zinc-300">اسکرول = زوم</strong>
          </span>
        </div>
      </div>

      {/* Live Coordinates Pill (Top Left) */}
      <div className="absolute top-3 left-3 z-30 hidden sm:flex items-center gap-2 bg-black/85 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-xl text-[11px] text-zinc-300 shadow-lg">
        <span className="text-amber-400 font-mono font-bold">{currentCoords.lat.toFixed(5)}, {currentCoords.lng.toFixed(5)}</span>
      </div>

      {/* Map Control Buttons: Zoom In/Out & Recenter */}
      <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-1.5">
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
          title="مرکز کردن روی مختصات فعلی"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Attribution tag */}
      <div className="absolute bottom-2 left-2 z-30 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded-lg text-[9px] text-zinc-400">
          OpenStreetMap &copy;
        </div>
      </div>

    </div>
  );
};
