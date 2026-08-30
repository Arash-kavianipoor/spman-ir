import React, { useState, useMemo, useRef } from 'react';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Search, 
  Filter, 
  Compass, 
  Layers, 
  Globe, 
  SlidersHorizontal, 
  RotateCcw, 
  ExternalLink, 
  ChevronRight, 
  ArrowLeft, 
  ArrowDown,
  LocateFixed, 
  Building2, 
  Sparkles, 
  MessageCircle, 
  Send, 
  Instagram, 
  PlusCircle, 
  Eye,
  Crosshair,
  Map as MapIcon,
  X,
  Store as StoreIcon,
  Smartphone
} from 'lucide-react';
import { Store } from '../types';
import { ADMIN_PHONE } from '../data/storeService';
import { IranInteractiveMap } from './IranInteractiveMap';

interface StoresMapPageProps {
  stores: Store[];
  onBackToHome: () => void;
  onOpenStoreDetail: (store: Store) => void;
  onOpenMapModal: (store: Store) => void;
  onGoToRegister: () => void;
}

// Preset geographic centers for major Iran hubs & national view
const IRAN_REGIONS = [
  { id: 'iran', label: 'کل کشور ایران', lat: 32.4279, lng: 53.6880, zoom: 5.5 },
  { id: 'tehran', label: 'تهران و حومه', lat: 35.6892, lng: 51.3890, zoom: 12 },
  { id: 'moniriyeh', label: 'راسته منیریه تهران', lat: 35.6845, lng: 51.4012, zoom: 16 },
  { id: 'esfahan', label: 'اصفهان (چهارباغ/نظر)', lat: 32.6546, lng: 51.6680, zoom: 13 },
  { id: 'shiraz', label: 'شیراز (زند/عفیف‌آباد)', lat: 29.5918, lng: 52.5837, zoom: 13 },
  { id: 'mashhad', label: 'مشهد (سجاد/احمدآباد)', lat: 36.2972, lng: 59.6067, zoom: 13 },
  { id: 'karaj', label: 'کرج (گوهردشت/مطهری)', lat: 35.8400, lng: 50.9391, zoom: 13 },
  { id: 'tabriz', label: 'تبریز (شهناز/ولیعصر)', lat: 38.0962, lng: 46.2738, zoom: 13 },
];

export const StoresMapPage: React.FC<StoresMapPageProps> = ({
  stores,
  onBackToHome,
  onOpenStoreDetail,
  onOpenMapModal,
  onGoToRegister,
}) => {
  // Ref for smooth scroll down to filter section
  const filterSectionRef = useRef<HTMLDivElement>(null);

  // Search and Primary Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Feature filters
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(false);
  const [hasWhatsappOnly, setHasWhatsappOnly] = useState<boolean>(false);
  const [hasInstagramOnly, setHasInstagramOnly] = useState<boolean>(false);
  const [hasWebsiteOnly, setHasWebsiteOnly] = useState<boolean>(false);

  // Map state
  const [activeStoreId, setActiveStoreId] = useState<string>(stores[0]?.id || '');
  const [selectedRegion, setSelectedRegion] = useState(IRAN_REGIONS[0]);
  const [mapType, setMapType] = useState<'dark' | 'satellite' | 'street'>('dark');
  const [geoLocating, setGeoLocating] = useState<boolean>(false);

  const categoryOptions = [
    { id: 'all', label: 'همه رسته‌های ورزشی', keyword: '' },
    { id: 'bicycle', label: 'دوچرخه و اکسسوری', keyword: 'دوچرخه' },
    { id: 'dumbbell', label: 'دمبل، وزنه و هالتر', keyword: 'دمبل' },
    { id: 'band', label: 'کش ورزشی و پاورباند', keyword: 'کش' },
    { id: 'barfix', label: 'میله بارفیکس و پارالل', keyword: 'بارفیکس' },
    { id: 'wrist', label: 'تقویت مچ و گریپر', keyword: 'مچ' },
    { id: 'bodybuilding', label: 'دستگاه‌های بدنسازی', keyword: 'بدنسازی' },
    { id: 'yoga', label: 'مت یوگا و پیلاتس', keyword: 'یوگا' },
  ];

  // Unique cities list
  const cities = useMemo(() => {
    return Array.from(new Set(stores.map((s) => s.city)));
  }, [stores]);

  // Filtered stores
  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        term === '' ||
        store.name.toLowerCase().includes(term) ||
        store.category.toLowerCase().includes(term) ||
        store.address.toLowerCase().includes(term) ||
        store.city.toLowerCase().includes(term) ||
        store.area.toLowerCase().includes(term);

      const matchesCity = selectedCity === 'all' || store.city === selectedCity;

      const matchesCategory =
        selectedCategory === 'all' ||
        store.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        store.description.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchesFeatured = !featuredOnly || Boolean(store.featured);
      const matchesWhatsapp = !hasWhatsappOnly || Boolean(store.social?.whatsapp);
      const matchesInstagram = !hasInstagramOnly || Boolean(store.social?.instagram);
      const matchesWebsite = !hasWebsiteOnly || Boolean(store.website);

      return (
        matchesSearch &&
        matchesCity &&
        matchesCategory &&
        matchesFeatured &&
        matchesWhatsapp &&
        matchesInstagram &&
        matchesWebsite
      );
    });
  }, [
    stores,
    searchTerm,
    selectedCity,
    selectedCategory,
    featuredOnly,
    hasWhatsappOnly,
    hasInstagramOnly,
    hasWebsiteOnly,
  ]);

  // Active Store
  const activeStore = useMemo(() => {
    return (
      filteredStores.find((s) => s.id === activeStoreId) ||
      filteredStores[0] ||
      stores[0]
    );
  }, [filteredStores, activeStoreId, stores]);

  // Handle region select
  const handleSelectRegion = (region: typeof IRAN_REGIONS[0]) => {
    setSelectedRegion(region);
    if (region.id === 'tehran') {
      setSelectedCity('تهران');
    } else if (region.id === 'esfahan') {
      setSelectedCity('اصفهان');
    } else if (region.id === 'shiraz') {
      setSelectedCity('شیراز');
    } else if (region.id === 'mashhad') {
      setSelectedCity('مشهد');
    } else if (region.id === 'karaj') {
      setSelectedCity('کرج');
    } else if (region.id === 'tabriz') {
      setSelectedCity('تبریز');
    } else if (region.id === 'iran') {
      setSelectedCity('all');
    }
  };

  // Handle store click in list
  const handleSelectStoreFromList = (store: Store) => {
    setActiveStoreId(store.id);
    setSelectedRegion({
      id: `store_${store.id}`,
      label: store.name,
      lat: store.coordinates.lat,
      lng: store.coordinates.lng,
      zoom: 16,
    });
  };

  // Detect GPS
  const handleDetectUserLocation = () => {
    if ('geolocation' in navigator) {
      setGeoLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setGeoLocating(false);
          setSelectedRegion({
            id: 'user_pos',
            label: 'موقعیت شما',
            lat,
            lng,
            zoom: 14,
          });
        },
        () => {
          setGeoLocating(false);
          alert('امکان دریافت موقعیت مکانی از مرورگر میسر نشد.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert('مرورگر شما از قابلیت مکان‌یابی پشتیبانی نمی‌کند.');
    }
  };

  // Scroll down to filters
  const scrollToFilters = () => {
    if (filterSectionRef.current) {
      filterSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reset Filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCity('all');
    setSelectedCategory('all');
    setFeaturedOnly(false);
    setHasWhatsappOnly(false);
    setHasInstagramOnly(false);
    setHasWebsiteOnly(false);
    setSelectedRegion(IRAN_REGIONS[0]);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm.trim() !== '') count++;
    if (selectedCity !== 'all') count++;
    if (selectedCategory !== 'all') count++;
    if (featuredOnly) count++;
    if (hasWhatsappOnly) count++;
    if (hasInstagramOnly) count++;
    if (hasWebsiteOnly) count++;
    return count;
  }, [searchTerm, selectedCity, selectedCategory, featuredOnly, hasWhatsappOnly, hasInstagramOnly, hasWebsiteOnly]);

  return (
    <div className="min-h-screen bg-[#07080c] text-zinc-100 pb-20">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: FULL-WIDTH INTERACTIVE MAP OF IRAN WITH ALL STORE PINS */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-gradient-to-b from-[#0c0e17] via-[#090a12] to-[#07080c] border-b border-white/10 pt-4 pb-8">
        
        {/* Navigation Breadcrumb Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <button
                onClick={onBackToHome}
                className="hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>صفحه اصلی</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 rotate-180 text-zinc-600" />
              <span className="text-amber-400 font-bold">نقشه سراسری و زنده فروشگاه‌های ورزشی ایران</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onGoToRegister}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>ثبت فروشگاه در نقشه</span>
              </button>
              <button
                onClick={onBackToHome}
                className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>بازگشت</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Hero Title & Information */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 mb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <Globe className="w-3.5 h-3.5" />
                <span>سامانه ملی نقشه‌نگاری و مکانیابی فروشگاه‌های ورزشی</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                نقشه کل کشور ایران و تمام مراکز فروش تجهیزات ورزشی
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-3xl leading-relaxed">
                تمام لوکیشن‌ها و فروشگاه‌های ثبت‌شده در سراسر ایران به صورت همزمان روی نقشه زیر پین شده‌اند. روی هر نشانگر لمس کنید تا مشخصات، عکس و شماره تماس را مشاهده نمایید.
              </p>
            </div>

            {/* Live Count & Layer Selector */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-black/60 border border-white/15 px-3.5 py-2 rounded-2xl flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-[10px] text-zinc-400">تمام نقاط فعال</div>
                  <div className="text-sm font-black text-white font-mono">{stores.length} فروشگاه روی نقشه</div>
                </div>
              </div>

              {/* Map Layer Mode */}
              <div className="flex bg-black/60 border border-white/15 p-1 rounded-2xl">
                <button
                  onClick={() => setMapType('dark')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mapType === 'dark' ? 'bg-amber-500 text-black shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  حالت مدرن
                </button>
                <button
                  onClick={() => setMapType('street')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mapType === 'street' ? 'bg-amber-500 text-black shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  خیابانی
                </button>
                <button
                  onClick={() => setMapType('satellite')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mapType === 'satellite' ? 'bg-amber-500 text-black shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  ماهواره‌ای
                </button>
              </div>
            </div>
          </div>

          {/* Quick Region Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-zinc-400 text-[11px] font-bold shrink-0 flex items-center gap-1">
              <Crosshair className="w-3.5 h-3.5 text-amber-400" />
              <span>فوکوس سریع روی منطقه:</span>
            </span>

            {IRAN_REGIONS.map((region) => {
              const isSelected = selectedRegion.id === region.id;
              return (
                <button
                  key={region.id}
                  onClick={() => handleSelectRegion(region)}
                  className={`px-3 py-1.5 rounded-xl border text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 border-amber-400 text-black font-bold shadow'
                      : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                  }`}
                >
                  {region.label}
                </button>
              );
            })}

            <button
              onClick={handleDetectUserLocation}
              disabled={geoLocating}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/30 text-[11px] font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <LocateFixed className="w-3.5 h-3.5" />
              <span>{geoLocating ? 'در حال اتصال...' : 'نزدیک من (GPS)'}</span>
            </button>
          </div>
        </div>

        {/* Grand Hero Map Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[480px] sm:h-[580px] w-full rounded-3xl overflow-hidden shadow-2xl relative border border-amber-500/30 ring-1 ring-amber-500/20">
            <IranInteractiveMap
              stores={filteredStores}
              activeStoreId={activeStoreId}
              onSelectStore={(s) => setActiveStoreId(s.id)}
              onOpenStoreDetail={onOpenStoreDetail}
              onOpenMapModal={onOpenMapModal}
              mapType={mapType}
              selectedRegionCenter={selectedRegion}
            />

            {/* Floating Quick Action Overlay on Map Bottom */}
            <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex items-center justify-between">
              <div className="bg-black/80 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-xl text-xs text-zinc-300 pointer-events-auto flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>نمایش همزمان تمام <strong className="text-amber-400 font-bold">{stores.length}</strong> موقعیت مکانی فعال در نقشه ایران</span>
              </div>

              <button
                onClick={scrollToFilters}
                className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-2xl pointer-events-auto cursor-pointer transition-all hover:scale-105"
              >
                <span>مشاهده فیلترهای حرفه‌ای و لیست</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. ADVANCED FILTERS & DIRECTORY SECTION (AFTER SCROLL) */}
      {/* ========================================================================= */}
      <section ref={filterSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>فیلترهای اختصاصی و هوشمند فروشگاه‌ها</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-white">
              جستجو و فیلتر پیشرفته در میان فروشگاه‌های ورزشی
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              بر اساس استان، راسته بازار، نوع تجهیزات (دمبل، دوچرخه، کش، بارفیکس و...) یا امکانات شبکه‌های اجتماعی جستجو کنید.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-amber-400 border border-white/10 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>حذف فیلترها ({activeFiltersCount})</span>
              </button>
            )}
            <div className="bg-[#10131e] border border-amber-500/20 px-3.5 py-2 rounded-xl text-xs text-amber-300 font-mono font-bold">
              {filteredStores.length} نتیجه منطبق
            </div>
          </div>
        </div>

        {/* Filter Controls Box */}
        <div className="bg-[#0f1118] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <label className="block text-[11px] font-bold text-zinc-400 mb-1.5">جستجوی متنی:</label>
              <div className="relative">
                <Search className="w-4 h-4 text-amber-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="نام فروشگاه، راسته، محله، دوچرخه، دمبل..."
                  className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl pr-10 pl-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* City Dropdown */}
            <div className="md:col-span-4">
              <label className="block text-[11px] font-bold text-zinc-400 mb-1.5">استان و شهر:</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="all">تمام شهرهای ایران ({stores.length} فروشگاه)</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city} ({stores.filter((s) => s.city === city).length} فروشگاه)
                  </option>
                ))}
              </select>
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-4">
              <label className="block text-[11px] font-bold text-zinc-400 mb-1.5">رسته و کالای تخصصی:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat.id} value={cat.keyword || 'all'}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Feature Badges & Checkboxes */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/10 text-xs">
            <span className="text-[11px] text-zinc-400 font-bold">فیلترهای تکمیلی:</span>
            
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer text-zinc-300 border border-white/5">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => setFeaturedOnly(e.target.checked)}
                className="accent-amber-500 rounded"
              />
              <span>⭐ فروشگاه‌های برگزیده و دارای تندیس</span>
            </label>

            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer text-zinc-300 border border-white/5">
              <input
                type="checkbox"
                checked={hasWhatsappOnly}
                onChange={(e) => setHasWhatsappOnly(e.target.checked)}
                className="accent-amber-500 rounded"
              />
              <span>💬 دارای پشتیبانی واتساپ</span>
            </label>

            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer text-zinc-300 border border-white/5">
              <input
                type="checkbox"
                checked={hasInstagramOnly}
                onChange={(e) => setHasInstagramOnly(e.target.checked)}
                className="accent-amber-500 rounded"
              />
              <span>📸 پیج رسمی اینستاگرام</span>
            </label>

            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer text-zinc-300 border border-white/5">
              <input
                type="checkbox"
                checked={hasWebsiteOnly}
                onChange={(e) => setHasWebsiteOnly(e.target.checked)}
                className="accent-amber-500 rounded"
              />
              <span>🌐 وب‌سایت خرید آنلاین</span>
            </label>
          </div>

        </div>

        {/* Directory Grid of Stores */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>فروشگاه‌های منطبق با فیلتر شما:</span>
            </h3>
            <span className="text-xs text-zinc-400 font-mono">
              {filteredStores.length} مورد یافت شد
            </span>
          </div>

          {filteredStores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredStores.map((store) => {
                const isSelected = activeStoreId === store.id;
                return (
                  <div
                    key={store.id}
                    className={`bg-[#0f1118] border rounded-2xl p-5 shadow-xl transition-all space-y-4 flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-500/80 ring-1 ring-amber-500/40 bg-[#141724]'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Top: Image & Basic Info */}
                    <div className="space-y-3">
                      <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-white/10 group">
                        <img
                          src={store.images[0]}
                          alt={store.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <span className="text-[10px] bg-black/80 backdrop-blur-md text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                            {store.city}
                          </span>
                        </div>
                        {store.featured && (
                          <div className="absolute top-2 left-2">
                            <span className="text-[10px] bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black px-2 py-0.5 rounded-full">
                              ⭐ برگزیده
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-black text-white">{store.name}</h4>
                          <span className="text-[11px] text-zinc-400">{store.area}</span>
                        </div>
                        <p className="text-xs text-amber-400/90 font-medium line-clamp-1">{store.category}</p>
                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{store.address}</p>
                      </div>
                    </div>

                    {/* Phones Clean Bar */}
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      {store.phones.mobile1 && (
                        <a
                          href={`tel:${store.phones.mobile1}`}
                          className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/20 text-xs transition-all font-mono font-bold"
                        >
                          <div className="flex items-center gap-1.5 font-sans text-[11px]">
                            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                            <span>تماس همراه:</span>
                          </div>
                          <span className="dir-ltr">{store.phones.mobile1}</span>
                        </a>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => handleSelectStoreFromList(store)}
                        className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        title="نمایش روی نقشه بالا"
                      >
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>فوکوس در نقشه</span>
                      </button>

                      <button
                        onClick={() => onOpenStoreDetail(store)}
                        className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>مشاهده ۳ عکس</span>
                      </button>
                    </div>

                    {/* Navigation Bar */}
                    <button
                      onClick={() => onOpenMapModal(store)}
                      className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>مسیریابی در ویز، بلد و گوگل مپ</span>
                    </button>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#0f1118] border border-white/10 rounded-3xl p-12 text-center space-y-4">
              <StoreIcon className="w-12 h-12 text-zinc-600 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">فروشگاهی با این مشخصات یافت نشد</h4>
                <p className="text-xs text-zinc-400">لطفاً فیلترها را تغییر دهید یا دکمه زیر را برای بازنشانی لمس کنید.</p>
              </div>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-amber-500 text-black text-xs font-bold rounded-xl"
              >
                پاکسازی تمام فیلترها
              </button>
            </div>
          )}
        </div>

        {/* Direct Admin Registration Banner */}
        <div className="bg-gradient-to-r from-amber-500/15 via-[#121522] to-orange-500/15 border border-amber-500/30 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-right">
            <h4 className="text-base font-bold text-white">فروشگاه ورزشی دارید و در نقشه بالا حضور ندارید؟</h4>
            <p className="text-xs text-zinc-300">
              ثبت مشخصات، ۳ عکس، لوکیشن جغرافیایی و شماره تماس رایگان می‌باشد.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoToRegister}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow transition-all cursor-pointer"
            >
              ثبت مشخصات در نقشه
            </button>
            <a
              href={`tel:${ADMIN_PHONE}`}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs dir-ltr"
            >
              {ADMIN_PHONE}
            </a>
          </div>
        </div>

      </section>

    </div>
  );
};
