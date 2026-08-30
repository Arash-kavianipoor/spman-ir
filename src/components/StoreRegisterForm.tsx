import React, { useState } from 'react';
import { 
  Send, 
  MessageCircle, 
  Eye, 
  MapPin, 
  Phone, 
  Globe, 
  Instagram, 
  Sparkles,
  Navigation,
  Compass,
  LocateFixed,
  Camera,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Award,
  CreditCard,
  Building2,
  Flame,
  Check
} from 'lucide-react';
import { StoreRegistrationFormState, Store } from '../types';
import { 
  ADMIN_PHONE, 
  ADMIN_PHONE_INTL, 
  formatStoreRegistrationMessage 
} from '../data/storeService';
import { StoreCard } from './StoreCard';
import { LocationPickerMap } from './LocationPickerMap';

export const StoreRegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<StoreRegistrationFormState>({
    storeName: '',
    managerName: '',
    category: 'باشگاه‌های ورزشی (بدنسازی، فیتنس و پیلاتس)',
    plan: 'standard',
    city: 'تهران',
    area: 'میدان منیریه',
    address: '',
    mobile1: '',
    mobile2: '',
    landline: '',
    lat: '35.681200',
    lng: '51.399500',
    whatsapp: '',
    telegram: '',
    instagram: '',
    website: '',
    description: '',
    workingHours: 'شنبه تا پنج‌شنبه: ۹:۳۰ الی ۲۱:۳۰',
  });

  const [showPreview, setShowPreview] = useState(false);
  const [locatingGps, setLocatingGps] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Category presets for quick selection
  const categoryPresets = [
    'باشگاه‌های ورزشی (بدنسازی، فیتنس و پیلاتس)',
    'فروشگاه‌های مکمل ورزشی (پروتئین، کراتین و مکمل‌های مجاز)',
    'تجهیزات بدنسازی، دوچرخه، دمبل و کش ورزشی',
    'فروشگاه تخصصی دوچرخه و اقلام دوچرخه‌سواری',
    'تردمیل، دوچرخه ثابت و دستگاه‌های هوازی',
    'کوهنوردی، کمپینگ و پوشاک ورزشی',
    'ورزش‌های رزمی، بوکس و تجهیزات مبارزه‌ای',
    'پوشاک، کفش و ساک ورزشی'
  ];

  // Preset location coordinates for fast selection across major Iranian sports markets
  const locationPresets = [
    { name: 'تهران - منیریه (بورس ورزشی)', lat: '35.681200', lng: '51.399500', city: 'تهران', area: 'منیریه' },
    { name: 'تهران - شریعتی / میرداماد', lat: '35.761200', lng: '51.439800', city: 'تهران', area: 'شریعتی' },
    { name: 'شیراز - ستارخان', lat: '29.638500', lng: '52.502600', city: 'شیراز', area: 'ستارخان' },
    { name: 'اصفهان - چهارباغ بالا', lat: '32.637500', lng: '51.665800', city: 'اصفهان', area: 'چهارباغ' },
    { name: 'مشهد - بلوار سجاد', lat: '36.319500', lng: '59.548200', city: 'مشهد', area: 'سجاد' },
    { name: 'کرج - گوهردشت', lat: '35.857200', lng: '50.998400', city: 'کرج', area: 'گوهردشت' },
    { name: 'تبریز - ولیعصر', lat: '38.072200', lng: '46.345800', city: 'تبریز', area: 'ولیعصر' },
    { name: 'رشت - گلسار', lat: '37.301200', lng: '49.589400', city: 'رشت', area: 'گلسار' },
    { name: 'اهواز - کیانپارس', lat: '31.341200', lng: '48.682100', city: 'اهواز', area: 'کیانپارس' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePresetLocation = (preset: typeof locationPresets[0]) => {
    setFormData((prev) => ({
      ...prev,
      city: preset.city,
      area: preset.area,
      lat: preset.lat,
      lng: preset.lng,
    }));
    setGpsSuccess(false);
    setGpsError(null);
  };

  // Live GPS locator from device
  const handleGetGpsLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('مرورگر شما از قابلیت مکان‌یابی پشتیبانی نمی‌کند.');
      return;
    }

    setLocatingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLat = position.coords.latitude.toFixed(6);
        const currentLng = position.coords.longitude.toFixed(6);
        setFormData((prev) => ({
          ...prev,
          lat: currentLat,
          lng: currentLng,
        }));
        setLocatingGps(false);
        setGpsSuccess(true);
      },
      () => {
        setLocatingGps(false);
        setGpsError('دسترسی به موقعیت مکانی صادر نشد. می‌توانید از روی نقشه یا انتخاب شهر موقعیت را تنظیم فرمایید.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Fine-tune coordinates with mini step buttons
  const adjustCoordinate = (type: 'lat' | 'lng', delta: number) => {
    setFormData((prev) => {
      const currentVal = parseFloat(prev[type]) || (type === 'lat' ? 35.6812 : 51.3995);
      const newVal = (currentVal + delta).toFixed(6);
      return { ...prev, [type]: newVal };
    });
  };

  const sendToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const message = formatStoreRegistrationMessage(formData);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${ADMIN_PHONE_INTL}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const sendToTelegram = (e: React.FormEvent) => {
    e.preventDefault();
    const message = formatStoreRegistrationMessage(formData);
    const encodedMessage = encodeURIComponent(message);
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent('https://spman.ir')}&text=${encodedMessage}`;
    window.open(telegramUrl, '_blank');
  };

  const latNum = parseFloat(formData.lat) || 35.6812;
  const lngNum = parseFloat(formData.lng) || 51.3995;

  // Convert form data to Store object for preview
  const previewStore: Store = {
    id: 'preview-store',
    name: formData.storeName || 'نام واحد یا باشگاه ورزشی',
    slug: 'preview-store',
    category: formData.category || 'باشگاه‌ها و فروشگاه‌های ورزشی',
    city: formData.city || 'تهران',
    area: formData.area || 'مرکز',
    address: formData.address || 'آدرس وارد شده فروشگاه / باشگاه شما در اینجا قرار می‌گیرد.',
    phones: {
      mobile1: formData.mobile1 || '09120000000',
      mobile2: formData.mobile2 || '09350000000',
      landline: formData.landline || '02100000000',
    },
    coordinates: {
      lat: latNum,
      lng: lngNum,
    },
    social: {
      whatsapp: formData.whatsapp ? `https://wa.me/${formData.whatsapp}` : undefined,
      telegram: formData.telegram ? `https://t.me/${formData.telegram}` : undefined,
      instagram: formData.instagram ? `https://instagram.com/${formData.instagram}` : undefined,
    },
    website: formData.website || undefined,
    images: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000',
    ],
    description: formData.description || 'توضیحات، رشته‌ها و خدمات فروشگاه/باشگاه شما...',
    workingHours: formData.workingHours || '۹:۳۰ الی ۲۱:۳۰',
    featured: formData.plan === 'featured',
    rating: 5.0,
    reviewCount: 1,
  };

  return (
    <section id="register" className="py-16 bg-[#090a0f] relative overflow-hidden">
      
      {/* Background Lighting */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>ثبت و معرفی رسمی فروشگاه‌ها و باشگاه‌های ورزشی ایران</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            فرم ثبت اطلاعات در سامانه جامع spman.ir
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed">
            مشخصات فروشگاه، باشگاه یا نمایندگی خود را وارد کنید. تعرفه ثبت برای مدت ۱ سال بوده و <strong className="text-amber-400">پرداخت هزینه تنها پس از تایید و انتشار آگهی</strong> انجام خواهد شد.
          </p>
        </div>

        {/* PRICING & TARIFFS SECTION (1-YEAR PLANS) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-400" />
              <span>تعرفه‌های ثبت آگهی (اعتبار ۱ ساله - پرداخت پس از انتشار)</span>
            </h3>
            <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              بدون پیش‌پرداخت اولیه
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Plan 1: Standard 500,000 Tomans */}
            <div 
              onClick={() => setFormData(prev => ({ ...prev, plan: 'standard' }))}
              className={`relative rounded-3xl p-6 sm:p-7 border transition-all cursor-pointer flex flex-col justify-between ${
                formData.plan === 'standard' 
                  ? 'bg-gradient-to-b from-[#181a24] to-[#10121a] border-amber-400/80 shadow-xl shadow-amber-950/30 ring-2 ring-amber-400/20' 
                  : 'bg-[#10121a]/70 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full border-2 border-amber-400 flex items-center justify-center p-0.5">
                      {formData.plan === 'standard' && <div className="w-full h-full bg-amber-400 rounded-full" />}
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-white">آگهی استاندارد (۱ ساله)</h4>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/10 text-zinc-300">
                    مدت ۱ سال
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-white font-mono">۵۰۰,۰۰۰</span>
                    <span className="text-sm font-bold text-amber-400">تومان / سال</span>
                  </div>
                  <p className="text-xs text-emerald-400 font-medium">
                    ✓ پرداخت هزینه بعد از انتشار رسمی آگهی در سایت
                  </p>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-300 border-t border-white/10 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>درج کامل مشخصات در دایرکتوری جامع ورزشی کشور</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>نمایش و پین دقیق موقعیت مکانی روی نقشه زنده ایران</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>لینک‌های مستقیم تماس، واتساپ، تلگرام و اینستاگرام</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>اسلایدر ۳ تصویر باکیفیت از فروشگاه یا باشگاه</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 mt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, plan: 'standard' }))}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                    formData.plan === 'standard'
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'bg-white/10 text-zinc-300 hover:bg-white/15'
                  }`}
                >
                  {formData.plan === 'standard' ? 'پلن استاندارد انتخاب شد' : 'انتخاب پلن استاندارد (۵۰۰ هزار تومان)'}
                </button>
              </div>
            </div>

            {/* Plan 2: VIP / Featured 800,000 Tomans */}
            <div 
              onClick={() => setFormData(prev => ({ ...prev, plan: 'featured' }))}
              className={`relative rounded-3xl p-6 sm:p-7 border transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                formData.plan === 'featured' 
                  ? 'bg-gradient-to-b from-[#211b10] to-[#121110] border-amber-400 shadow-2xl shadow-amber-500/20 ring-2 ring-amber-400/40' 
                  : 'bg-[#121110]/70 border-amber-500/30 hover:border-amber-500/50'
              }`}
            >
              {/* Badge */}
              <div className="absolute -left-12 top-6 -rotate-45 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-[10px] py-1 px-12 shadow-md">
                پیشنهاد ویژه VIP
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full border-2 border-amber-400 flex items-center justify-center p-0.5">
                      {formData.plan === 'featured' && <div className="w-full h-full bg-amber-400 rounded-full" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base sm:text-lg font-black text-amber-400">آگهی ویژه و طلایی (۱ ساله)</h4>
                      <Award className="w-4 h-4 text-amber-400" />
                    </div>
                  </div>
                  <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300">
                    مدت ۱ سال
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">۸۰۰,۰۰۰</span>
                    <span className="text-sm font-bold text-amber-300">تومان / سال</span>
                  </div>
                  <p className="text-xs text-emerald-400 font-medium">
                    ✓ پرداخت هزینه بعد از انتشار رسمی آگهی در سایت
                  </p>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-200 border-t border-white/10 pt-4">
                  <li className="flex items-center gap-2 font-medium text-amber-200">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>نشان طلایی ویژه (VIP) روی کارت و بالای نتایج</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>نمایش در بخش فروشگاه‌های ویژه و صدر دایرکتوری شهر</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>پین متمایز و ویژه روی نقشه تعاملی کل کشور</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>تمامی امکانات پلن استاندارد + اولویت در نتایج سرچ</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 mt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, plan: 'featured' }))}
                  className={`w-full py-2.5 rounded-xl font-black text-xs transition-all ${
                    formData.plan === 'featured'
                      ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/30'
                      : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
                  }`}
                >
                  {formData.plan === 'featured' ? 'پلن ویژه انتخاب شد ⭐' : 'انتخاب پلن ویژه (۸۰۰ هزار تومان)'}
                </button>
              </div>
            </div>

          </div>

          {/* Payment Notice Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-black border border-emerald-500/30 flex items-start gap-3.5 text-xs text-zinc-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-emerald-300 font-bold block text-sm">
                شرط تسویه حساب: پرداخت پس از انتشار رسمی آگهی
              </strong>
              <p className="leading-relaxed">
                جهت اطمینان خاطر شما، ثبت اولیه در سامانه کاملاً رایگان است. پس از ارسال فرم، مشخصات توسط تیم مدیریت بررسی و منتشر می‌گردد. پس از رویت آگهی فعال در سامانه، اطلاعات پرداخت برای شما ارسال خواهد شد.
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-[#11131b] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          
          <form className="space-y-8">
            
            {/* Step 1: Basic Store Info & Categories */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2 border-b border-white/10 pb-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-black text-xs flex items-center justify-center font-bold">۱</span>
                <span>اطلاعات عمومی و دسته‌بندی فعالیت</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">نام فروشگاه / باشگاه ورزشی *</label>
                  <input
                    type="text"
                    name="storeName"
                    required
                    value={formData.storeName}
                    onChange={handleInputChange}
                    placeholder="مثال: باشگاه بدنسازی آرنولد / فروشگاه ورزشی المپیک"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">نام مدیریت یا مسئول *</label>
                  <input
                    type="text"
                    name="managerName"
                    required
                    value={formData.managerName}
                    onChange={handleInputChange}
                    placeholder="مثال: علیرضا محمدی"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Category Selection with Dropdown & Presets */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                    <span>دسته‌بندی و زمینه فعالیت *</span>
                    <span className="text-[10px] text-amber-400">شامل باشگاه‌ها و فروشگاه‌های مکمل</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-black/70 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {categoryPresets.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#11131b] text-white">
                        {cat}
                      </option>
                    ))}
                  </select>

                  {/* Fast selection chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {categoryPresets.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                        className={`text-[11px] px-3 py-1 rounded-xl transition-all border cursor-pointer ${
                          formData.category === cat
                            ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-sm'
                            : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-zinc-300">ساعات کاری و سانس‌ها</label>
                  <input
                    type="text"
                    name="workingHours"
                    value={formData.workingHours}
                    onChange={handleInputChange}
                    placeholder="مثال: بانوان: ۸ الی ۱۴ | آقایان: ۱۴:۳۰ الی ۲۳ (همه روزه)"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Contact Phones (Mobile 1, Mobile 2, Landline) */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2 border-b border-white/10 pb-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-black text-xs flex items-center justify-center font-bold">۲</span>
                <span>شماره‌های تماس (موبایل و تلفن ثابت)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">شماره موبایل ۱ (اصلی) *</label>
                  <input
                    type="tel"
                    name="mobile1"
                    required
                    value={formData.mobile1}
                    onChange={handleInputChange}
                    placeholder="مثال: 09121234567"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 font-mono dir-ltr text-right"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">شماره موبایل ۲ (اختیاری)</label>
                  <input
                    type="tel"
                    name="mobile2"
                    value={formData.mobile2}
                    onChange={handleInputChange}
                    placeholder="مثال: 09351234567"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 font-mono dir-ltr text-right"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">شماره تلفن ثابت *</label>
                  <input
                    type="tel"
                    name="landline"
                    required
                    value={formData.landline}
                    onChange={handleInputChange}
                    placeholder="مثال: 02155380000"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 font-mono dir-ltr text-right"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Interactive Live Map & Coordinates Picker */}
            <div className="space-y-5">
              <div className="border-b border-white/10 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-black text-xs flex items-center justify-center font-bold">۳</span>
                  <span>یافتن و تنظیم موقعیت زنده روی نقشه گوگل (مختصات جغرافیایی)</span>
                </h3>
                <span className="text-[11px] text-zinc-400">
                  مختصات دقیق به صورت خودکار محاسبه و به همراه پیام ارسال می‌شود
                </span>
              </div>

              {/* City, Area & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">استان / شهر *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="مثال: تهران"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">منطقه یا محله *</label>
                  <input
                    type="text"
                    name="area"
                    required
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="مثال: منیریه، تقاطع ولیعصر"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">آدرس پستی دقیق *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="مثال: تهران، میدان منیریه، ابتدای خیابان ابوسعید، پلاک ۱۲۴"
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Live Interactive Map Box */}
              <div className="bg-[#0b0c13] border border-amber-500/30 rounded-3xl p-4 sm:p-6 space-y-4">
                
                {/* Map Tools Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-amber-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white">پیدا کردن موقعیت دقیق فروشگاه / باشگاه روی نقشه</h4>
                      <p className="text-[11px] text-zinc-400">با انتخاب شهر یا دکمه موقعیت فعلی، نقشه به‌صورت زنده همگام می‌شود.</p>
                    </div>
                  </div>

                  {/* GPS Locator Button */}
                  <button
                    type="button"
                    onClick={handleGetGpsLocation}
                    disabled={locatingGps}
                    className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer shrink-0"
                  >
                    <LocateFixed className={`w-4 h-4 ${locatingGps ? 'animate-spin' : ''}`} />
                    <span>{locatingGps ? 'در حال دریافت موقعیت...' : 'ثبت با GPS موقعیت فعلی من'}</span>
                  </button>
                </div>

                {gpsSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>موقعیت مکانی دقیق شما از طریق GPS با موفقیت استخراج و تنظیم شد.</span>
                  </div>
                )}

                {gpsError && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-300 text-xs">
                    {gpsError}
                  </div>
                )}

                {/* Quick City Presets */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold text-zinc-300 block">انتخاب سریع از بورس‌های ورزشی کشور:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {locationPresets.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handlePresetLocation(preset)}
                        className="text-[11px] bg-white/5 hover:bg-amber-500 hover:text-black text-zinc-300 border border-white/10 px-3 py-1.5 rounded-xl transition-all font-medium cursor-pointer"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Draggable Pin Map with Scroll Zoom */}
                <LocationPickerMap
                  lat={latNum}
                  lng={lngNum}
                  onChangeLocation={(newLat, newLng) => {
                    setFormData((prev) => ({
                      ...prev,
                      lat: newLat.toFixed(6),
                      lng: newLng.toFixed(6),
                    }));
                  }}
                  city={formData.city}
                  area={formData.area}
                />

                {/* Numeric Coordinates Feedback Bar + Fine Tuning */}
                <div className="bg-black/60 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Values */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-zinc-400 block font-medium">مختصات عددی استخراج‌شده برای ارسال:</span>
                    <div className="flex items-center gap-3 font-mono text-xs dir-ltr text-amber-300">
                      <span className="bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl">
                        Lat: {latNum.toFixed(6)}
                      </span>
                      <span className="bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl">
                        Lng: {lngNum.toFixed(6)}
                      </span>
                    </div>
                  </div>

                  {/* Fine Tuning Controls */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] text-zinc-400">تنظیم میلی‌متری:</span>
                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
                      <button
                        type="button"
                        title="شمال"
                        onClick={() => adjustCoordinate('lat', 0.001)}
                        className="p-1.5 hover:bg-amber-500 hover:text-black rounded-lg text-zinc-300 transition-colors cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        title="جنوب"
                        onClick={() => adjustCoordinate('lat', -0.001)}
                        className="p-1.5 hover:bg-amber-500 hover:text-black rounded-lg text-zinc-300 transition-colors cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        title="شرق"
                        onClick={() => adjustCoordinate('lng', 0.001)}
                        className="p-1.5 hover:bg-amber-500 hover:text-black rounded-lg text-zinc-300 transition-colors cursor-pointer"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        title="غرب"
                        onClick={() => adjustCoordinate('lng', -0.001)}
                        className="p-1.5 hover:bg-amber-500 hover:text-black rounded-lg text-zinc-300 transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <a
                      href={`https://maps.google.com/?q=${latNum},${lngNum}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20"
                    >
                      <span>تست لینک نقشه</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                </div>

              </div>

            </div>

            {/* Step 4: WhatsApp Photo Sending Notice */}
            <div className="space-y-3 bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-black border border-emerald-500/30 rounded-3xl p-6 relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-black flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30 font-bold">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      ارسال ۳ عکس باکیفیت از فروشگاه / باشگاه در واتساپ
                    </h3>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      ارسال در چت
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                    نیازی به درج لینک عکس نیست؛ پس از فشردن دکمه ارسال فرم، <strong className="text-emerald-400">۳ تصویر افقی و باکیفیت</strong> از مجموعه ورزشی خود (شامل <span className="text-white font-medium">۱. نمای تابلو و ورودی</span>، <span className="text-white font-medium">۲. ویترین یا فضای پذیرش</span> و <span className="text-white font-medium">۳. قفسه‌های لوازم ورزشی / سالن تمرین و دستگاه‌ها</span>) را مستقیماً در چت واتساپ ارسال فرمایید تا در اسلایدر اختصاصی شما قرار گیرد.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 5: Social Media & Website */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2 border-b border-white/10 pb-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-black text-xs flex items-center justify-center font-bold">۴</span>
                <span>شبکه‌های اجتماعی و وب‌سایت (اختیاری)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">شماره یا آیدی واتساپ</label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="09121234567"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono dir-ltr text-right"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">آیدی تلگرام</label>
                  <input
                    type="text"
                    name="telegram"
                    value={formData.telegram}
                    onChange={handleInputChange}
                    placeholder="@sport_store"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono dir-ltr text-right"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">آیدی اینستاگرام</label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="@sport_gym_ir"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono dir-ltr text-right"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">آدرس وب‌سایت</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://mysport.ir"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono dir-ltr text-right"
                  />
                </div>
              </div>
            </div>

            {/* Step 6: Description */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-300">توضیحات تکمیلی، خدمات، برندها و اقلام قابل عرضه *</label>
              <textarea
                name="description"
                rows={3}
                required
                value={formData.description}
                onChange={handleInputChange}
                placeholder="توضیح دهید چه تجهیزاتی، مکمل‌هایی یا چه رشته‌ها و دستگاه‌های ورزشی در مجموعه شما وجود دارد..."
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 leading-relaxed"
              />
            </div>

            {/* Submission Action Buttons */}
            <div className="pt-6 border-t border-white/10 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. WhatsApp Button to 09128634908 */}
                <button
                  type="button"
                  onClick={sendToWhatsApp}
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/30 transition-all cursor-pointer group"
                >
                  <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>ارسال مشخصات به واتساپ مدیریت ({ADMIN_PHONE})</span>
                </button>

                {/* 2. Telegram Button to 09128634908 */}
                <button
                  type="button"
                  onClick={sendToTelegram}
                  className="w-full py-4 px-6 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl shadow-sky-600/30 transition-all cursor-pointer group"
                >
                  <Send className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>ارسال به تلگرام مدیریت ({ADMIN_PHONE})</span>
                </button>

              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 pt-2">
                <span>
                  💡 نوع تعرفه انتخابی ({formData.plan === 'featured' ? 'ویژه ۸۰۰ هزار تومن' : 'عادی ۵۰۰ هزار تومن'}) و مختصات نقشه در پیام ضمیمه می‌شود.
                </span>

                {/* Preview Button */}
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1.5 bg-white/5 border border-white/10 px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0"
                >
                  <Eye className="w-4 h-4" />
                  <span>{showPreview ? 'بستن پیش‌نمایش' : 'مشاهده پیش‌نمایش کارت در سایت'}</span>
                </button>
              </div>

            </div>

          </form>

          {/* Live Preview Card */}
          {showPreview && (
            <div className="pt-6 border-t border-white/10 space-y-4 animate-in fade-in duration-300">
              <h4 className="text-sm font-bold text-amber-400">پیش‌نمایش زنده کارت ثبت‌شده در سایت:</h4>
              <div className="max-w-md mx-auto">
                <StoreCard
                  store={previewStore}
                  onOpenMap={() => {}}
                  onOpenDetail={() => {}}
                />
              </div>
            </div>
          )}

        </div>

      </div>

    </section>
  );
};
