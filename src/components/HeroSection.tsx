import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  Store, 
  Dumbbell, 
  Sparkles, 
  Phone, 
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  Compass,
  Zap,
  Globe,
  Flame,
  Activity
} from 'lucide-react';
import { ADMIN_PHONE } from '../data/storeService';

// Slide 1: Cycling
import heroCyclistImage from '../assets/images/cyclist_hero_velmont_1788013387338.jpg';
import motionCyclistCardImage from '../assets/images/cyclist_motion_card_1788013401900.jpg';

// Slide 2: Female Yoga / Stretching
import heroFemaleStretchingImage from '../assets/images/female_stretching_mat_1788014368101.jpg';
import motionStretchingCardImage from '../assets/images/stretching_action_bw_1788014395455.jpg';

// Slide 3: Male Bodybuilder / Dumbbell
import heroMaleBodybuilderImage from '../assets/images/male_bodybuilder_dumbbell_1788014381969.jpg';
import motionBodybuildingCardImage from '../assets/images/bodybuilding_action_bw_1788014408431.jpg';

interface HeroSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  availableCities: string[];
  totalStores: number;
  onExploreClick: () => void;
  onRegisterClick: () => void;
  onOpenMapClick?: () => void;
}

interface SlideData {
  id: number;
  category: string;
  eyebrow: string[];
  title: string;
  subtitle: string;
  bgImage: string;
  cardImage: string;
  cardLabel: string;
  sportTag: string;
  accentColor: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    category: 'دوچرخه‌سواری و سرعت',
    eyebrow: ['اسپرت من', 'مرجع تخصصی ورزش', 'و دوچرخه‌سواری ایران'],
    title: 'قدرت و سرعت\nدر مسیرهای بی‌پایان\nبا اسپرت من',
    subtitle: 'مرجع تخصصی دسترسی به معتبرترین فروشگاه‌های دوچرخه و تجهیزات ورزشی سراسر ایران همراه با نقشه زنده و ارتباط مستقیم.',
    bgImage: heroCyclistImage,
    cardImage: motionCyclistCardImage,
    cardLabel: 'CYCLING PRO SERIES',
    sportTag: 'دوچرخه و جاده',
    accentColor: '#f59e0b',
  },
  {
    id: 2,
    category: 'یوگا، پیلاتس و انعطاف‌پذیری',
    eyebrow: ['اسپرت من', 'هنر آرامش، تمرکز', 'و انعطاف‌پذیری بدنی'],
    title: 'انعطاف و آرامش\nهنر تسلط بر بدن\nبا تجهیزات استاندارد',
    subtitle: 'مجموعه‌ای کامل از مت‌های ورزشی ضدلغزش، کش‌های پیلاتس و ملزومات تناسب اندام بانوان و آقایان با تضمین اصالت.',
    bgImage: heroFemaleStretchingImage,
    cardImage: motionStretchingCardImage,
    cardLabel: 'YOGA & PILATES PRO',
    sportTag: 'پیلاتس و تشک ورزشی',
    accentColor: '#fbbf24',
  },
  {
    id: 3,
    category: 'بدنسازی و پرورش اندام',
    eyebrow: ['اسپرت من', 'نهایت توان و استقامت', 'در اوج تمرکز عضلانی'],
    title: 'نهایت استقامت\nساخت عضلات پولادین\nبا وزنه و دمبل‌های اصل',
    subtitle: 'انواع دمبل‌های متغیر، هالتر، وزنه‌های باشگاهی و اکسسوری‌های بدنسازی همراه با ارتباط مستقیم با واردکنندگان و تولیدی‌ها.',
    bgImage: heroMaleBodybuilderImage,
    cardImage: motionBodybuildingCardImage,
    cardLabel: 'HEAVY WEIGHT POWER',
    sportTag: 'بدنسازی و وزنه',
    accentColor: '#ea580c',
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchTerm,
  onSearchChange,
  selectedCity,
  onCityChange,
  availableCities,
  totalStores,
  onExploreClick,
  onRegisterClick,
  onOpenMapClick,
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto slide timer (6 seconds)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const activeSlide = slides[currentSlide];

  return (
    <section 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full min-h-[780px] lg:min-h-[880px] bg-[#07080b] text-white overflow-hidden select-none"
    >
      
      {/* ========================================================================= */}
      {/* 1. BACKGROUND CAROUSEL LAYERS WITH SMOOTH CROSSFADE & AMBER GLOW */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {slides.map((slide, index) => {
          const isSelected = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isSelected ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Full-width edge-to-edge Hero Image positioned higher up for complete view */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={slide.bgImage}
                  alt={slide.category}
                  className="w-full h-full object-cover object-[center_12%] sm:object-[center_16%] lg:object-[68%_14%] opacity-85 sm:opacity-92 filter contrast-110 brightness-95 transform scale-100 transition-all duration-1000"
                />
              </div>

              {/* Dynamic warm accent glow matching the slide category */}
              <div 
                className="absolute bottom-0 right-0 w-[600px] h-[380px] blur-[110px] opacity-45 transition-colors duration-1000"
                style={{
                  background: `radial-gradient(circle, ${slide.accentColor} 0%, transparent 70%)`
                }}
              />
            </div>
          );
        })}

        {/* Global Dark Vignettes & Gradients for full-width legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080b] via-[#07080b]/85 md:via-[#07080b]/55 to-transparent z-1" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-transparent to-[#07080b]/35 z-1" />
        <div className="absolute bottom-0 right-1/4 w-[550px] h-[260px] bg-amber-500/15 blur-[120px] z-1" />
      </div>

      {/* ========================================================================= */}
      {/* 2. HERO CONTENT LAYER */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-16 flex flex-col justify-between min-h-[780px] lg:min-h-[880px]">
        
        {/* Main Grid: Left Headline & Right Floating Carousel Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
          
          {/* Left Column: Eyebrow + Huge Display Typography + Action Buttons */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Top Left Tagline & Category Pill */}
            <div className="space-y-3">
              <div className="text-[11px] sm:text-xs font-bold tracking-[0.12em] text-zinc-300 leading-relaxed transition-all duration-500">
                {activeSlide.eyebrow[0]}<br />
                {activeSlide.eyebrow[1]}<br />
                {activeSlide.eyebrow[2]}
              </div>
              
              {/* Minimalist Pill Indicator with Category Tag */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-4 rounded-full border border-amber-500/60 flex items-center px-1">
                  <div 
                    className="w-2 h-2 rounded-full transition-all duration-300"
                    style={{ backgroundColor: activeSlide.accentColor }}
                  />
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-amber-400">
                  {activeSlide.sportTag}
                </span>
              </div>
            </div>

            {/* Massive Display Title (Animated with slide transition) */}
            <div className="space-y-3 min-h-[140px] sm:min-h-[190px] flex flex-col justify-center">
              <h1 className="text-4xl sm:text-6xl lg:text-[74px] font-black text-white tracking-tight leading-[1.14] drop-shadow-md whitespace-pre-line transition-all duration-500">
                {activeSlide.title}
              </h1>

              {/* Persian Contextual Tagline */}
              <p className="text-xs sm:text-sm text-zinc-300 font-normal max-w-lg leading-relaxed pt-2 transition-all duration-500">
                {activeSlide.subtitle}
              </p>
            </div>

            {/* CTA Buttons & Search Trigger */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Amber Pill Button */}
              <button
                onClick={onExploreClick}
                className="px-8 py-3.5 rounded-full bg-[#c25e00] hover:bg-[#d97706] active:bg-[#b45309] text-white font-bold text-sm sm:text-base tracking-wide transition-all shadow-lg shadow-amber-900/30 hover:scale-105 cursor-pointer flex items-center gap-2"
              >
                <span>مشاهده فروشگاه‌ها</span>
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Quick Search & Filter Trigger */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-zinc-200 hover:text-white text-xs sm:text-sm font-medium flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>جستجوی سریع کالا و فروشگاه</span>
              </button>
            </div>

            {/* Carousel Navigation Arrows & Quick Selectors */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handlePrevSlide}
                className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer"
                title="اسلاید قبلی"
                aria-label="اسلاید قبلی"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentSlide
                        ? 'w-8 bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                        : 'w-2 bg-white/25 hover:bg-white/50'
                    }`}
                    title={s.category}
                  />
                ))}
              </div>

              <button
                onClick={handleNextSlide}
                className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer"
                title="اسلاید بعدی"
                aria-label="اسلاید بعدی"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-[10px] text-zinc-500 font-mono mr-2">
                0{currentSlide + 1} / 0{slides.length}
              </span>
            </div>

          </div>

          {/* Right Column: Floating Monochrome Motion Action Card + Pagination Slider */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center pt-8 lg:pt-0">
            <div className="w-60 sm:w-72 space-y-3">
              
              {/* Rounded Floating Preview Card */}
              <div 
                onClick={handleNextSlide}
                className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur-md bg-black/40 group cursor-pointer"
                title="کلیک جهت تعویض اسلاید"
              >
                <img
                  src={activeSlide.cardImage}
                  alt={activeSlide.cardLabel}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter grayscale contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-2 left-3 text-[9px] font-black px-2 py-0.5 rounded bg-amber-500 text-black">
                  PRO
                </div>
                <div className="absolute bottom-2.5 right-3 text-[10px] text-amber-300 font-mono tracking-wider font-bold">
                  {activeSlide.cardLabel}
                </div>
              </div>

              {/* Interactive Pagination Slider 01 ━━━━━━━ 03 */}
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 px-1">
                <span>01</span>
                <div className="flex-1 mx-3 h-[3px] bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-500 rounded-full"
                    style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                  />
                </div>
                <span>0{slides.length}</span>
              </div>

              {/* Thumbnails fast switcher */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {slides.map((s, idx) => (
                  <div
                    key={s.id}
                    onClick={() => setCurrentSlide(idx)}
                    className={`relative rounded-lg overflow-hidden border cursor-pointer aspect-video transition-all ${
                      idx === currentSlide
                        ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                        : 'border-white/10 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={s.cardImage} alt="" className="w-full h-full object-cover filter grayscale" />
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. BOTTOM SECTION: LABELS, STATS CARDS & BRAND BADGES */}
        {/* ========================================================================= */}
        <div className="space-y-6 pt-10">
          
          {/* Top Label Row with Separator Line */}
          <div className="border-t border-white/10 pt-3 flex items-center justify-between text-xs text-zinc-400 font-medium">
            <div className="flex items-center gap-8">
              <span className="hover:text-amber-400 cursor-pointer transition-colors">ویژگی‌های برتر</span>
              <span className="hover:text-amber-400 cursor-pointer transition-colors">رشته‌های ورزشی</span>
            </div>
            <div>
              <span className="hover:text-amber-400 cursor-pointer transition-colors">تجهیزات و سرعت</span>
            </div>
          </div>

          {/* Bottom Row: 2 Glass Stat Cards + Trust Badges on the Amber Glow */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
            
            {/* 2 Frosted Glass Metric Cards */}
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Card 1 */}
              <div className="bg-[#12131b]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 w-36 sm:w-44 shadow-2xl">
                <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight font-sans">
                  ۱۰۰٪
                </div>
                <div className="text-[11px] sm:text-xs text-zinc-300 font-medium mt-1">
                  تضمین اصالت کالا
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-[#12131b]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 w-36 sm:w-44 shadow-2xl">
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
                  {totalStores > 0 ? `${totalStores}+` : '۱۵۰+'}
                </div>
                <div className="text-[11px] sm:text-xs text-zinc-300 font-medium mt-1">
                  فروشگاه معتبر فعال
                </div>
              </div>

            </div>

            {/* Bottom Right Brand Badges / Trust Pillars */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-bold tracking-wider text-zinc-200/90 pt-2 lg:pt-0">
              
              {/* Badge 1 */}
              <div className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
                <div className="w-3.5 h-3.5 border-t-2 border-r-2 border-amber-400 transform rotate-45" />
                <span className="text-xs font-bold text-zinc-200">سراسر ایران</span>
              </div>

              {/* Badge 2 */}
              <div className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
                <div className="w-3.5 h-3.5 rounded-full border border-amber-400 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </div>
                <span className="text-xs font-bold text-zinc-200">ارتباط مستقیم</span>
              </div>

              {/* Badge 3 */}
              <div className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-400 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                </div>
                <span className="text-xs font-bold text-zinc-200">تنوع تجهیزات</span>
              </div>

              {/* Badge 4 */}
              <div className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
                <div className="w-3.5 h-3.5 flex items-center justify-center">
                  <span className="text-[11px] font-black text-amber-400">✳</span>
                </div>
                <span className="text-xs font-bold text-zinc-200">پشتیبانی ۲۴ ساعته</span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* QUICK SEARCH & FILTER MODAL */}
      {/* ========================================================================= */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f1118] border border-white/15 rounded-3xl p-6 max-w-xl w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Search className="w-4 h-4" />
                <span>جستجوی فروشگاه‌های ورزشی ایران</span>
              </div>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="text-zinc-400 hover:text-white text-xs px-2 py-1 bg-white/5 rounded-lg cursor-pointer"
              >
                بستن (ESC)
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-amber-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="نام فروشگاه، راسته، دوچرخه، دمبل، کش، بارفیکس..."
                className="w-full bg-black/60 border border-white/15 rounded-xl pr-10 pl-3 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                autoFocus
              />
            </div>

            {/* Cities Filter */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-400">انتخاب شهر:</span>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                <button
                  onClick={() => onCityChange('all')}
                  className={`px-3 py-1 rounded-xl text-xs cursor-pointer ${
                    selectedCity === 'all' ? 'bg-amber-500 text-black font-bold' : 'bg-white/5 text-zinc-300'
                  }`}
                >
                  همه شهرها
                </button>
                {availableCities.map((c) => (
                  <button
                    key={c}
                    onClick={() => onCityChange(c)}
                    className={`px-3 py-1 rounded-xl text-xs cursor-pointer ${
                      selectedCity === c ? 'bg-amber-500 text-black font-bold' : 'bg-white/5 text-zinc-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  setSearchModalOpen(false);
                  onExploreClick();
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs cursor-pointer"
              >
                مشاهده نتایج جستجو
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
