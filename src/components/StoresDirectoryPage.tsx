import React, { useState, useMemo } from 'react';
import { 
  Store as StoreIcon, 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  Navigation, 
  MessageCircle, 
  Send, 
  Instagram, 
  Globe, 
  Star, 
  Sparkles, 
  RotateCcw, 
  Grid, 
  List, 
  Map as MapIcon, 
  Check, 
  ChevronDown, 
  ChevronRight, 
  ArrowLeft, 
  Clock, 
  ShieldCheck, 
  SlidersHorizontal,
  X,
  ExternalLink,
  PlusCircle
} from 'lucide-react';
import { Store } from '../types';
import { ADMIN_PHONE } from '../data/storeService';
import { StoreCard } from './StoreCard';

interface StoresDirectoryPageProps {
  stores: Store[];
  onBackToHome: () => void;
  onOpenMap: (store: Store) => void;
  onOpenDetail: (store: Store) => void;
  onGoToRegister: () => void;
  initialCategoryFilter?: string;
}

export const StoresDirectoryPage: React.FC<StoresDirectoryPageProps> = ({
  stores,
  onBackToHome,
  onOpenMap,
  onOpenDetail,
  onGoToRegister,
  initialCategoryFilter = '',
}) => {
  // Search and Primary Filters
  const [searchTerm, setSearchTerm] = useState<string>(initialCategoryFilter);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'reviews' | 'name'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');

  // Advanced Category Filter (Multi-select)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Feature Toggles Filter
  const [filterFeaturedOnly, setFilterFeaturedOnly] = useState<boolean>(false);
  const [filterHasWhatsapp, setFilterHasWhatsapp] = useState<boolean>(false);
  const [filterHasTelegram, setFilterHasTelegram] = useState<boolean>(false);
  const [filterHasInstagram, setFilterHasInstagram] = useState<boolean>(false);
  const [filterHasWebsite, setFilterHasWebsite] = useState<boolean>(false);

  // Mobile Filter Drawer
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Map view selected store
  const [activeMapStoreId, setActiveMapStoreId] = useState<string>(stores[0]?.id || '');

  // Category tags options
  const categoryOptions = [
    { id: 'gym', label: 'باشگاه‌های ورزشی و فیتنس', keyword: 'باشگاه' },
    { id: 'supplement', label: 'فروشگاه‌های مکمل ورزشی', keyword: 'مکمل' },
    { id: 'bicycle', label: 'دوچرخه و لوازم جانبی', keyword: 'دوچرخه' },
    { id: 'dumbbell', label: 'دمبل، وزنه و هالتر', keyword: 'دمبل' },
    { id: 'band', label: 'کش ورزشی، پاورباند و مینی‌لوپ', keyword: 'کش' },
    { id: 'barfix', label: 'میله بارفیکس و پارالل', keyword: 'بارفیکس' },
    { id: 'wrist', label: 'تقویت مچ، گریپر و ساعد', keyword: 'مچ' },
    { id: 'bodybuilding', label: 'دستگاه‌های بدنسازی و سیم‌کش', keyword: 'بدنسازی' },
    { id: 'crossfit', label: 'کراس‌فیت، تی‌آر‌ایکس و بتل‌روپ', keyword: 'کراس' },
    { id: 'yoga', label: 'مت یوگا، پیلاتس و فوم‌رولر', keyword: 'یوگا' },
    { id: 'apparel', label: 'پوشاک، کفش و ساک ورزشی', keyword: 'پوشاک' },
  ];

  // Derive unique cities and areas
  const cities = useMemo(() => {
    return Array.from(new Set(stores.map((s) => s.city)));
  }, [stores]);

  const areas = useMemo(() => {
    if (selectedCity === 'all') {
      return Array.from(new Set(stores.map((s) => s.area)));
    }
    return Array.from(new Set(stores.filter((s) => s.city === selectedCity).map((s) => s.area)));
  }, [stores, selectedCity]);

  // Handle category toggle
  const toggleCategory = (keyword: string) => {
    setSelectedCategories((prev) =>
      prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCity('all');
    setSelectedArea('all');
    setSortBy('newest');
    setSelectedCategories([]);
    setFilterFeaturedOnly(false);
    setFilterHasWhatsapp(false);
    setFilterHasTelegram(false);
    setFilterHasInstagram(false);
    setFilterHasWebsite(false);
  };

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm.trim() !== '') count++;
    if (selectedCity !== 'all') count++;
    if (selectedArea !== 'all') count++;
    if (selectedCategories.length > 0) count += selectedCategories.length;
    if (filterFeaturedOnly) count++;
    if (filterHasWhatsapp) count++;
    if (filterHasTelegram) count++;
    if (filterHasInstagram) count++;
    if (filterHasWebsite) count++;
    return count;
  }, [
    searchTerm,
    selectedCity,
    selectedArea,
    selectedCategories,
    filterFeaturedOnly,
    filterHasWhatsapp,
    filterHasTelegram,
    filterHasInstagram,
    filterHasWebsite,
  ]);

  // Filter and Sort Engine
  const filteredAndSortedStores = useMemo(() => {
    return stores
      .filter((store) => {
        // Keyword Search
        const term = searchTerm.toLowerCase().trim();
        const matchesSearch =
          term === '' ||
          store.name.toLowerCase().includes(term) ||
          store.category.toLowerCase().includes(term) ||
          store.description.toLowerCase().includes(term) ||
          store.address.toLowerCase().includes(term) ||
          store.city.toLowerCase().includes(term) ||
          store.area.toLowerCase().includes(term) ||
          (store.manager && store.manager.toLowerCase().includes(term));

        // City Filter
        const matchesCity = selectedCity === 'all' || store.city === selectedCity;

        // Area Filter
        const matchesArea = selectedArea === 'all' || store.area === selectedArea;

        // Multi Categories Filter
        const matchesCategories =
          selectedCategories.length === 0 ||
          selectedCategories.some(
            (cat) =>
              store.category.toLowerCase().includes(cat.toLowerCase()) ||
              store.description.toLowerCase().includes(cat.toLowerCase()) ||
              store.name.toLowerCase().includes(cat.toLowerCase())
          );

        // Feature Filters
        const matchesFeatured = !filterFeaturedOnly || Boolean(store.featured);
        const matchesWhatsapp = !filterHasWhatsapp || Boolean(store.social?.whatsapp);
        const matchesTelegram = !filterHasTelegram || Boolean(store.social?.telegram);
        const matchesInstagram = !filterHasInstagram || Boolean(store.social?.instagram);
        const matchesWebsite = !filterHasWebsite || Boolean(store.website);

        return (
          matchesSearch &&
          matchesCity &&
          matchesArea &&
          matchesCategories &&
          matchesFeatured &&
          matchesWhatsapp &&
          matchesTelegram &&
          matchesInstagram &&
          matchesWebsite
        );
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === 'reviews') {
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name, 'fa');
        }
        // newest default (by id or order)
        return b.id.localeCompare(a.id);
      });
  }, [
    stores,
    searchTerm,
    selectedCity,
    selectedArea,
    selectedCategories,
    filterFeaturedOnly,
    filterHasWhatsapp,
    filterHasTelegram,
    filterHasInstagram,
    filterHasWebsite,
    sortBy,
  ]);

  const activeMapStore =
    stores.find((s) => s.id === activeMapStoreId) || filteredAndSortedStores[0] || stores[0];

  const mapEmbedUrl = activeMapStore
    ? `https://maps.google.com/maps?q=${activeMapStore.coordinates.lat},${activeMapStore.coordinates.lng}&hl=fa&z=15&output=embed`
    : '';

  return (
    <div className="min-h-screen bg-[#07080c] text-zinc-100 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Breadcrumb & Return Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <button
              onClick={onBackToHome}
              className="hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>صفحه اصلی</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 rotate-180 text-zinc-600" />
            <span className="text-amber-400 font-bold">بانک اطلاعات و جستجوی پیشرفته فروشگاه‌ها</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoToRegister}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>ثبت رایگان فروشگاه شما</span>
            </button>
            <button
              onClick={onBackToHome}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>بازگشت به خانه</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Page Hero & Search Header */}
        <div className="bg-gradient-to-br from-[#121520] via-[#0d0f17] to-[#08090f] border border-amber-500/20 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <SlidersHorizontal className="w-4 h-4" />
              <span>موتور جستجو و فیلتر پیشرفته فروشگاه‌های ورزشی کشور</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              بانک تخصصی فروشگاه‌های ورزشی ایران
            </h1>
            
            <p className="text-xs sm:text-sm text-zinc-300 max-w-3xl leading-relaxed">
              فروشگاه‌های معتبر دوچرخه، دمبل‌های بدنسازی، کش‌های ورزشی، بارفیکس، تقویت مچ و تجهیزات تناسب اندام را بر اساس شهر، منطقه، امکانات ارتباطی و رده‌بندی فیلتر و جستجو کنید.
            </p>
          </div>

          {/* Quick Search Input Bar */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
            <div className="md:col-span-8 relative">
              <Search className="w-5 h-5 text-amber-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="جستجوی نام فروشگاه، نام مدیر، نام برند، کالا (دوچرخه، دمبل، کش...) یا آدرس..."
                className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-2xl pr-12 pl-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none transition-all shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="md:col-span-4 flex items-center gap-2">
              {/* City Quick Dropdown */}
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedArea('all');
                }}
                className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white focus:outline-none cursor-pointer"
              >
                <option value="all">تمام شهرهای ایران</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city} ({stores.filter((s) => s.city === city).length} فروشگاه)
                  </option>
                ))}
              </select>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden p-3.5 bg-amber-500 text-black font-bold rounded-2xl flex items-center justify-center gap-2 shrink-0 shadow"
              >
                <Filter className="w-5 h-5" />
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 bg-black text-amber-400 rounded-full text-[10px] flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Popular Fast Tag Chips */}
          <div className="relative z-10 flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
            <span className="text-zinc-400 text-[11px] font-bold shrink-0">فیلترهای سریع:</span>
            {categoryOptions.map((cat) => {
              const isSelected = selectedCategories.includes(cat.keyword);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.keyword)}
                  className={`px-3 py-1.5 rounded-xl border text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 border-amber-400 text-black font-bold shadow'
                      : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

        </div>

        {/* Main Content Layout: Advanced Filter Sidebar + Results Directory */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Left Sidebar: Advanced Filters */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-28 bg-[#0f1118] border border-white/10 rounded-3xl p-5 shadow-xl">
            
            {/* Filter Header & Clear Action */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Filter className="w-4 h-4 text-amber-400" />
                <span>فیلترهای پیشرفته</span>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-[10px] font-mono">
                    {activeFiltersCount}
                  </span>
                )}
              </div>

              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-zinc-400 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>پاکسازی</span>
                </button>
              )}
            </div>

            {/* 1. City and Region Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-200 block">استان و شهر:</label>
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                <button
                  onClick={() => {
                    setSelectedCity('all');
                    setSelectedArea('all');
                  }}
                  className={`w-full text-right px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                    selectedCity === 'all'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : 'text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  <span>همه شهرها</span>
                  <span className="text-[10px] font-mono text-zinc-400">{stores.length}</span>
                </button>
                {cities.map((city) => {
                  const count = stores.filter((s) => s.city === city).length;
                  return (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setSelectedArea('all');
                      }}
                      className={`w-full text-right px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                        selectedCity === city
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                          : 'text-zinc-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{city}</span>
                      <span className="text-[10px] font-mono text-zinc-400">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Neighborhood / Area Selection */}
            {areas.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-white/10">
                <label className="text-xs font-bold text-zinc-200 block">محله و راسته بازار:</label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="all">تمامی مناطق و محله‌ها</option>
                  {areas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 3. Specialty Equipment Categories Multi-Select */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <label className="text-xs font-bold text-zinc-200 block">دسته‌بندی تجهیزات:</label>
              <div className="space-y-2">
                {categoryOptions.map((cat) => {
                  const isChecked = selectedCategories.includes(cat.keyword);
                  return (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2.5 text-xs text-zinc-300 hover:text-white cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCategory(cat.keyword)}
                        className="w-4 h-4 rounded border-white/20 bg-black/40 text-amber-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-amber-500"
                      />
                      <span>{cat.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 4. Amenities & Connectivity Filters */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <label className="text-xs font-bold text-zinc-200 block">امکانات و ارتباطات:</label>
              <div className="space-y-2 text-xs text-zinc-300">
                
                <label className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>فروشگاه‌های برگزیده و ویژه</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={filterFeaturedOnly}
                    onChange={(e) => setFilterFeaturedOnly(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>دارای پشتیبانی واتساپ</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={filterHasWhatsapp}
                    onChange={(e) => setFilterHasWhatsapp(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <Instagram className="w-3.5 h-3.5 text-pink-400" />
                    <span>دارای پیج اینستاگرام</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={filterHasInstagram}
                    onChange={(e) => setFilterHasInstagram(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <Send className="w-3.5 h-3.5 text-sky-400" />
                    <span>دارای کانال تلگرام</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={filterHasTelegram}
                    onChange={(e) => setFilterHasTelegram(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    <span>دارای وب‌سایت اختصاصی</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={filterHasWebsite}
                    onChange={(e) => setFilterHasWebsite(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                </label>

              </div>
            </div>

            {/* Direct Admin Call in Sidebar */}
            <div className="pt-3 border-t border-white/10 space-y-2 text-center">
              <span className="text-[11px] text-zinc-400 block">نیاز به راهنمایی یا ثبت سریع دارید؟</span>
              <a
                href={`tel:${ADMIN_PHONE}`}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 font-mono dir-ltr"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{ADMIN_PHONE}</span>
              </a>
            </div>

          </aside>

          {/* Main Results Column */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Control Bar: Results Count + Sort + View Switcher */}
            <div className="bg-[#0f1118] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow">
              
              {/* Count & Active Summary */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400">
                  نمایش <strong className="text-amber-400 font-bold text-sm font-mono">{filteredAndSortedStores.length}</strong> فروشگاه از مجموع <span className="font-mono">{stores.length}</span>
                </span>
                {selectedCity !== 'all' && (
                  <span className="text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                    شهر: {selectedCity}
                  </span>
                )}
                {selectedCategories.length > 0 && (
                  <span className="text-[11px] bg-white/10 text-zinc-300 px-2 py-0.5 rounded-full">
                    {selectedCategories.length} فیلتر رسته
                  </span>
                )}
              </div>

              {/* Controls: Sorting & View Mode */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                
                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-zinc-400 shrink-0">مرتب‌سازی:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="newest">جدیدترین‌ها</option>
                    <option value="rating">بالاترین امتیاز</option>
                    <option value="reviews">بیشترین دیدگاه</option>
                    <option value="name">الفبا (نام فروشگاه)</option>
                  </select>
                </div>

                {/* View Switcher Buttons */}
                <div className="flex items-center gap-1 bg-black/50 border border-white/10 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode('grid')}
                    title="نمای شبکه‌ای"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'grid' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    title="نمای فشرده لیستی"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'list' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    title="نمای نقشه تعاملی"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'map' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <MapIcon className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

            {/* 1. GRID VIEW MODE */}
            {viewMode === 'grid' && (
              <>
                {filteredAndSortedStores.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredAndSortedStores.map((store) => (
                      <StoreCard
                        key={store.id}
                        store={store}
                        onOpenMap={onOpenMap}
                        onOpenDetail={onOpenDetail}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyStoreState onReset={resetFilters} />
                )}
              </>
            )}

            {/* 2. LIST VIEW MODE */}
            {viewMode === 'list' && (
              <>
                {filteredAndSortedStores.length > 0 ? (
                  <div className="space-y-4">
                    {filteredAndSortedStores.map((store) => (
                      <div
                        key={store.id}
                        className="bg-[#10121a] border border-white/10 hover:border-amber-500/40 rounded-3xl p-5 transition-all shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
                      >
                        {/* Thumbnail & Title */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-black/60 border border-white/10 shrink-0 relative">
                            <img
                              src={store.images[0]}
                              alt={store.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-sm text-amber-400 text-[9px] px-1.5 py-0.5 rounded font-mono">
                              ۳ عکس
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3
                                onClick={() => onOpenDetail(store)}
                                className="text-base font-bold text-white group-hover:text-amber-400 transition-colors cursor-pointer"
                              >
                                {store.name}
                              </h3>
                              <span className="text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/25 px-2.5 py-0.5 rounded-full font-bold">
                                {store.city} - {store.area}
                              </span>
                              {store.featured && (
                                <span className="text-[10px] bg-gradient-to-r from-amber-500 to-orange-500 text-black px-2 py-0.5 rounded-full font-black">
                                  ویژه
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-zinc-400 line-clamp-1">{store.category}</p>
                            
                            <div className="flex items-center gap-2 text-xs text-zinc-300">
                              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className="line-clamp-1 text-zinc-400 text-[11px]">{store.address}</span>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-amber-300 font-mono pt-1">
                              {store.phones.mobile1 && (
                                <a href={`tel:${store.phones.mobile1}`} className="hover:underline dir-ltr">
                                  {store.phones.mobile1}
                                </a>
                              )}
                              {store.phones.landline && (
                                <span className="text-zinc-500 dir-ltr hidden sm:inline">
                                  ثابت: {store.phones.landline}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Fast Action Buttons */}
                        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                          <button
                            onClick={() => onOpenMap(store)}
                            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>مسیریابی زنده</span>
                          </button>

                          <button
                            onClick={() => onOpenDetail(store)}
                            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 text-xs font-medium transition-all cursor-pointer"
                          >
                            <span>مشاهده پروفایل و ۳ عکس</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyStoreState onReset={resetFilters} />
                )}
              </>
            )}

            {/* 3. SPLIT MAP VIEW MODE */}
            {viewMode === 'map' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0f1118] border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl">
                
                {/* Store Cards Scroll List */}
                <div className="lg:col-span-5 space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  <span className="text-xs font-bold text-zinc-400 block px-1">
                    انتخاب فروشگاه برای مشاهده در نقشه زنده:
                  </span>
                  {filteredAndSortedStores.map((store) => (
                    <div
                      key={store.id}
                      onClick={() => setActiveMapStoreId(store.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        activeMapStore?.id === store.id
                          ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg'
                          : 'bg-black/30 border-white/5 text-zinc-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold">{store.name}</h4>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full shrink-0">
                          {store.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="line-clamp-1">{store.address}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-amber-300 font-mono dir-ltr">{store.phones.mobile1}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenDetail(store);
                          }}
                          className="text-[11px] text-zinc-400 hover:text-amber-400"
                        >
                          پروفایل کامل &larr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live Google Map Container */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-inner">
                    {activeMapStore && (
                      <iframe
                        title={`نقشه ${activeMapStore.name}`}
                        src={mapEmbedUrl}
                        className="w-full h-full border-0"
                        loading="lazy"
                        allowFullScreen
                      />
                    )}
                  </div>

                  {activeMapStore && (
                    <div className="bg-black/50 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">{activeMapStore.name}</h4>
                        <p className="text-xs text-zinc-400">{activeMapStore.address}</p>
                        <div className="text-xs text-amber-400 font-mono dir-ltr">
                          مختصات: {activeMapStore.coordinates.lat}, {activeMapStore.coordinates.lng}
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenMap(activeMapStore)}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow cursor-pointer shrink-0"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>مسیریابی در ویز و گوگل</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            )}

          </main>

        </div>

      </div>

      {/* Mobile Filter Drawer Overlay */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full sm:max-w-lg bg-[#11131c] border border-amber-500/30 rounded-t-3xl sm:rounded-3xl p-6 space-y-5 max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Filter className="w-5 h-5 text-amber-400" />
                <span>فیلترهای پیشرفته فروشگاه‌ها</span>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300">انتخاب شهر:</label>
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedArea('all');
                }}
                className="w-full bg-black/50 border border-white/15 rounded-xl p-3 text-sm text-white"
              >
                <option value="all">تمام شهرهای ایران</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city} ({stores.filter((s) => s.city === city).length} فروشگاه)
                  </option>
                ))}
              </select>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300">دسته‌بندی‌ها:</label>
              <div className="grid grid-cols-2 gap-2">
                {categoryOptions.map((cat) => {
                  const isChecked = selectedCategories.includes(cat.keyword);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.keyword)}
                      className={`p-2.5 rounded-xl border text-xs text-right transition-all ${
                        isChecked
                          ? 'bg-amber-500 text-black font-bold border-amber-400'
                          : 'bg-white/5 border-white/10 text-zinc-300'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Bottom */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 bg-amber-500 text-black font-bold rounded-xl text-sm"
              >
                مشاهده {filteredAndSortedStores.length} فروشگاه
              </button>
              <button
                onClick={resetFilters}
                className="px-4 py-3 bg-white/10 text-zinc-300 rounded-xl text-sm"
              >
                پاکسازی
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

interface EmptyStoreStateProps {
  onReset: () => void;
}

const EmptyStoreState: React.FC<EmptyStoreStateProps> = ({ onReset }) => {
  return (
    <div className="text-center py-16 bg-[#11131c] border border-white/10 rounded-3xl p-8 space-y-4 max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
        <Search className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-white">فروشگاهی با این شرایط فیلتر یافت نشد</h3>
      <p className="text-xs text-zinc-400 leading-relaxed">
        می‌توانید فیلترهای اعمال‌شده را ریست کنید یا با شماره مدیریت (<span className="text-amber-400 font-mono">{ADMIN_PHONE}</span>) تماس بگیرید تا فروشگاه ورزشی جدید ثبت گردد.
      </p>
      <button
        onClick={onReset}
        className="px-5 py-2.5 bg-amber-500 text-black text-xs font-bold rounded-xl hover:bg-amber-400 transition-all cursor-pointer"
      >
        پاکسازی تمام فیلترها
      </button>
    </div>
  );
};
