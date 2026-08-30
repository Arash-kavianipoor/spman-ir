import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { ZoomIn, ZoomOut, Compass, MousePointerClick, Move, Check, Navigation } from 'lucide-react';

interface LocationPickerMapProps {
  lat: number;
  lng: number;
  onChangeLocation: (lat: number, lng: number) => void;
  city?: string;
  area?: string;
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  lat,
  lng,
  onChangeLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'dark'>('streets');
  const [isMoving, setIsMoving] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: lat || 35.6812,
    lng: lng || 51.3995,
  });

  const isUserInteractingRef = useRef(false);
  const onChangeLocationRef = useRef(onChangeLocation);
  onChangeLocationRef.current = onChangeLocation;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialLat = lat || 35.6812;
    const initialLng = lng || 51.3995;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 16,
      minZoom: 4,
      maxZoom: 19,
      zoomControl: false,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
      dragging: true,
      inertia: true,
      inertiaDeceleration: 3000,
    });

    // When map starts moving (panning, scrolling, zooming)
    map.on('movestart', () => {
      isUserInteractingRef.current = true;
      setIsMoving(true);
    });

    // When map is moving: update local coordinate display without triggering heavy parent re-renders
    map.on('move', () => {
      const center = map.getCenter();
      setCurrentCoords({
        lat: parseFloat(center.lat.toFixed(6)),
        lng: parseFloat(center.lng.toFixed(6)),
      });
    });

    // When map stops moving (drag end / scroll zoom end / pan end)
    map.on('moveend', () => {
      setIsMoving(false);
      const center = map.getCenter();
      const finalLat = parseFloat(center.lat.toFixed(6));
      const finalLng = parseFloat(center.lng.toFixed(6));
      
      setCurrentCoords({ lat: finalLat, lng: finalLng });
      
      // Notify parent form only when movement finishes cleanly
      onChangeLocationRef.current(finalLat, finalLng);
      
      setTimeout(() => {
        isUserInteractingRef.current = false;
      }, 100);
    });

    // Click anywhere on map to pan smoothly to that spot
    map.on('click', (e: L.LeafletMouseEvent) => {
      map.panTo(e.latlng, { animate: true, duration: 0.35 });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when mapStyle changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let tileUrl = '';
    let attribution = '';

    if (mapStyle === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      attribution = '&copy; <a href="https://carto.com/">CARTO</a>';
    } else if (mapStyle === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri';
    } else {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    }

    const newTileLayer = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [mapStyle]);

  // Sync map center when coordinates change from outside (GPS button, Presets, Step buttons)
  useEffect(() => {
    // If the change came from the user moving the map, do not re-pan
    if (isUserInteractingRef.current) return;

    const map = mapInstanceRef.current;
    if (!map) return;

    const center = map.getCenter();
    const distance = Math.hypot(center.lat - lat, center.lng - lng);

    if (distance > 0.0001) {
      map.panTo([lat, lng], { animate: true, duration: 0.3 });
      setCurrentCoords({ lat, lng });
    }
  }, [lat, lng]);

  const handleZoomIn = useCallback(() => {
    mapInstanceRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    mapInstanceRef.current?.zoomOut();
  }, []);

  const handleRecenter = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 16, { animate: true });
    }
  }, [lat, lng]);

  return (
    <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] min-h-[350px] rounded-2xl overflow-hidden border border-white/15 bg-[#0a0c14] shadow-inner select-none">
      
      {/* Leaflet Map DOM Canvas */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full z-0 cursor-grab active:cursor-grabbing"
      />

      {/* ========================================================================= */}
      {/* CENTER PIN (SNAPP / GOOGLE MAPS / UBER STYLE ULTRA SMOOTH PIN) */}
      {/* ========================================================================= */}
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

          {/* Glowing Target Ground Ring on exact center */}
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

      {/* Map Style Selector (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 z-30 flex items-center gap-1 bg-black/80 backdrop-blur-md p-1 rounded-xl border border-white/15 text-[11px]">
        <button
          type="button"
          onClick={() => setMapStyle('streets')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
            mapStyle === 'streets'
              ? 'bg-amber-500 text-black font-bold shadow-sm'
              : 'text-zinc-300 hover:text-white'
          }`}
        >
          خیابان
        </button>
        <button
          type="button"
          onClick={() => setMapStyle('satellite')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
            mapStyle === 'satellite'
              ? 'bg-amber-500 text-black font-bold shadow-sm'
              : 'text-zinc-300 hover:text-white'
          }`}
        >
          ماهواره‌ای
        </button>
        <button
          type="button"
          onClick={() => setMapStyle('dark')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
            mapStyle === 'dark'
              ? 'bg-amber-500 text-black font-bold shadow-sm'
              : 'text-zinc-300 hover:text-white'
          }`}
        >
          نقشه روشن
        </button>
      </div>

    </div>
  );
};
