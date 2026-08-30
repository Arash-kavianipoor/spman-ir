import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Store } from '../types';

interface IranInteractiveMapProps {
  stores: Store[];
  activeStoreId?: string;
  onSelectStore: (store: Store) => void;
  onOpenStoreDetail: (store: Store) => void;
  onOpenMapModal: (store: Store) => void;
  mapType: 'dark' | 'satellite' | 'street';
  selectedRegionCenter?: { lat: number; lng: number; zoom: number; id: string } | null;
}

export const IranInteractiveMap: React.FC<IranInteractiveMapProps> = ({
  stores,
  activeStoreId,
  onSelectStore,
  onOpenStoreDetail,
  onOpenMapModal,
  mapType,
  selectedRegionCenter,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Iran center coordinates
    const iranCenter: L.LatLngExpression = [32.4279, 53.6880];
    const initialZoom = window.innerWidth < 640 ? 5 : 5.8;

    const map = L.map(mapContainerRef.current, {
      center: iranCenter,
      zoom: initialZoom,
      minZoom: 4,
      maxZoom: 19,
      zoomControl: false,
    });

    // Add zoom control at bottom-left
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when mapType changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let tileUrl = '';
    let attribution = '';

    if (mapType === 'dark') {
      // CartoDB Dark Matter
      tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      attribution = '&copy; <a href="https://carto.com/">CARTO</a>';
    } else if (mapType === 'satellite') {
      // Esri Satellite
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri';
    } else {
      // OpenStreetMap standard
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    }

    const newTileLayer = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [mapType]);

  // Render & Update Markers for ALL stores across Iran
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

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

      // Clean & Compact Pin Icon (Teardrop shape with glowing store marker)
      const pinColor = isSelected
        ? '#f59e0b' // Amber 500
        : store.featured
        ? '#ea580c' // Orange 600
        : '#eab308'; // Yellow 500

      const customHtml = `
        <div class="relative flex flex-col items-center justify-center cursor-pointer group transform transition-transform duration-200 hover:scale-135 hover:z-50">
          <div class="relative w-8 h-10 flex items-center justify-center filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
            <!-- Teardrop Pin SVG -->
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

      // Mouse Hover Tooltip (Showing Store Name, Phone Number, City)
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

      // Click listener
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
  }, [stores, activeStoreId, onSelectStore, onOpenStoreDetail, onOpenMapModal]);

  // Handle Region Flying or Center updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedRegionCenter) return;

    map.flyTo(
      [selectedRegionCenter.lat, selectedRegionCenter.lng],
      selectedRegionCenter.zoom,
      {
        duration: 1.5,
        easeLinearity: 0.25,
      }
    );
  }, [selectedRegionCenter]);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
