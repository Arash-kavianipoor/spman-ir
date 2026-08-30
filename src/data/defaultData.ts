import { Store, EquipmentItem } from '../types';

export const INITIAL_STORES: Store[] = [
  {
    id: "store-1",
    name: "فروشگاه ورزشی المپیک اسپرت (مرکزی)",
    slug: "olympic-sport-center",
    category: "تجهیزات بدنسازی، دمبل و دوچرخه",
    city: "تهران",
    area: "میدان منیریه",
    address: "تهران، خیابان ولیعصر، میدان منیریه، ابتدای خیابان ابوسعید، پلاک ۱۲۴",
    phones: {
      mobile1: "09121112233",
      mobile2: "09351112233",
      landline: "02155389012"
    },
    coordinates: {
      lat: 35.6812,
      lng: 51.3995
    },
    social: {
      whatsapp: "https://wa.me/989121112233",
      telegram: "https://t.me/olympicsport_ir",
      instagram: "https://instagram.com/olympic_sports_iran"
    },
    website: "https://olympicsport.ir",
    images: [
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "مرکز پخش و توزیع تخصصی انواع دمبل متغیر و ثابت، میله هالتر، کش ورزشی پاورباند، میله بارفیکس چندمنظوره، دستگاه تقویت مچ و تجهیزات حرفه‌ای بدنسازی با ارسال سراسری.",
    workingHours: "شنبه تا پنج‌شنبه: ۹:۳۰ الی ۲۱:۳۰ | جمعه: ۱۰:۰۰ الی ۱۶:۰۰",
    featured: true,
    rating: 4.9,
    reviewCount: 142
  },
  {
    id: "store-2",
    name: "فروشگاه تخصصی دوچرخه و اقلام دوچرخه‌سواری جاینت استور",
    slug: "giant-bicycle-store",
    category: "دوچرخه، اقلام دوچرخه‌سواری و قطعات",
    city: "تهران",
    area: "خیابان شریعتی",
    address: "تهران، خیابان شریعتی، بالاتر از پل رومی، نرسیده به میدان قدس، پلاک ۱۸۲۰",
    phones: {
      mobile1: "09122223344",
      mobile2: "09192223344",
      landline: "02122718899"
    },
    coordinates: {
      lat: 35.7953,
      lng: 51.4312
    },
    social: {
      whatsapp: "https://wa.me/989122223344",
      telegram: "https://t.me/giant_shariati",
      instagram: "https://instagram.com/giant_shariati_tehran"
    },
    website: "https://giantstore-tehran.com",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "نمایندگی رسمی دوچرخه‌های کورسی، کوهستان، شهری و برقی. عرضه انواع اقلام دوچرخه‌سواری شامل کلاه ایمنی استاندارد، دستکش ژله‌ای، عینک یووی۴۰۰، چراغ‌های شارژی و قمقمه تخصصی.",
    workingHours: "همه روزه: ۱۰:۰۰ الی ۲۲:۰۰",
    featured: true,
    rating: 4.8,
    reviewCount: 98
  },
  {
    id: "store-3",
    name: "فروشگاه تجهیزات تناسب اندام پاور جیم",
    slug: "power-gym-shiraz",
    category: "دمبل، کش ورزشی، بارفیکس و کراس‌فیت",
    city: "شیراز",
    area: "بلوار ستارخان",
    address: "شیراز، بلوار ستارخان، نبش کوچه ۸، مجتمع تجاری ستاره، طبقه همکف، واحد ۱۲",
    phones: {
      mobile1: "09173334455",
      mobile2: "09303334455",
      landline: "07136284455"
    },
    coordinates: {
      lat: 29.6385,
      lng: 52.5026
    },
    social: {
      whatsapp: "https://wa.me/989173334455",
      telegram: "https://t.me/powergym_shiraz",
      instagram: "https://instagram.com/powergym.shiraz"
    },
    website: "https://powergymshiraz.ir",
    images: [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "فروش مستقیم تجهیزات تناسب اندام خانگی و باشگاهی، ست دمبل‌های شش‌ضلعی روکش‌دار، کش‌های پیلاتس لوپ و مینی‌لوپ، میله بارفیکس چندکاره، دستگاه‌های فنری تقویت مچ دست و کمربند چرم بدنسازی.",
    workingHours: "شنبه تا پنج‌شنبه: ۹:۰۰ الی ۲۱:۰۰",
    featured: true,
    rating: 4.9,
    reviewCount: 85
  },
  {
    id: "store-4",
    name: "فروشگاه کوهنوردی و ورزشی زاگرس اسپرت",
    slug: "zagros-sport-isfahan",
    category: "کوهنوردی، کمپینگ و پوشاک ورزشی",
    city: "اصفهان",
    area: "خیابان چهارباغ بالا",
    address: "اصفهان، چهارباغ بالا، روبروی مجتمع کوثر، مجتمع ورزشی زاگرس، واحد ۴",
    phones: {
      mobile1: "09134445566",
      mobile2: "09904445566",
      landline: "03136207788"
    },
    coordinates: {
      lat: 32.6375,
      lng: 51.6658
    },
    social: {
      whatsapp: "https://wa.me/989134445566",
      telegram: "https://t.me/zagros_sport_esf",
      instagram: "https://instagram.com/zagrossport.isfahan"
    },
    website: "https://zagrossport.com",
    images: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "تخصصی‌ترین هایپرورزشی مرکز کشور برای کوله‌پشتی‌های کوهنوردی، باتوم، کتونی‌های تخصصی دویدن، دستکش‌های ورزشی، قمقمه و فلاسک‌های استیل و تجهیزات تمرین در ارتفاع.",
    workingHours: "همه روزه: ۱۰:۰۰ الی ۲۱:۳۰",
    featured: false,
    rating: 4.7,
    reviewCount: 64
  },
  {
    id: "store-5",
    name: "فروشگاه مدرن ورزشی هیرمند (شعبه مشهد)",
    slug: "hirmand-sports-mashhad",
    category: "دستگاه‌های هوازی، تردمیل و یوگا",
    city: "مشهد",
    area: "بلوار سجاد",
    address: "مشهد، بلوار سجاد، بین بهار و گلستان، برج نگین، واحد تجاری ۱۰۲",
    phones: {
      mobile1: "09155556677",
      mobile2: "09015556677",
      landline: "05137661122"
    },
    coordinates: {
      lat: 36.3195,
      lng: 59.5482
    },
    social: {
      whatsapp: "https://wa.me/989155556677",
      telegram: "https://t.me/hirmand_sport_mashhad",
      instagram: "https://instagram.com/hirmand_sports"
    },
    website: "https://hirmandsports.ir",
    images: [
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "فروش انواع تردمیل‌های خانگی و باشگاهی، دوچرخه ثابت اسپینینگ، مت و فوم رولر یوگا، طناب‌های سرعتی بلبرینگی، کش‌های مقاومتی تی‌آر‌ایکس و شیکرهای بدنسازی هوشمند.",
    workingHours: "شنبه تا پنج‌شنبه: ۹:۳۰ الی ۲۲:۰۰",
    featured: true,
    rating: 4.8,
    reviewCount: 110
  },
  {
    id: "store-6",
    name: "فروشگاه رزم و ورزش البرز اسپرت",
    slug: "alborz-sport-karaj",
    category: "هنرهای رزمی، دستکش بوکس و میت",
    city: "کرج",
    area: "میدان رستاخیز گوهردشت",
    address: "کرج، گوهردشت، میدان رستاخیز، خیابان هشتم غربی، پلاک ۴۲",
    phones: {
      mobile1: "09126667788",
      mobile2: "09376667788",
      landline: "02634428800"
    },
    coordinates: {
      lat: 35.8572,
      lng: 50.9984
    },
    social: {
      whatsapp: "https://wa.me/989126667788",
      telegram: "https://t.me/alborz_sport_karaj",
      instagram: "https://instagram.com/alborz_sport_official"
    },
    website: "https://alborzs瑩sport.ir",
    images: [
      "https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "تجهیزات ورزش‌های رزمی، بوکس، تی‌آر‌ایکس، دستکش چرم اورجینال، کیسه بوکس آویز و ایستاده، میله بارفیکس و گیره‌های کششی تمرینی.",
    workingHours: "همه روزه: ۱۰:۰۰ الی ۲۱:۰۰",
    featured: false,
    rating: 4.6,
    reviewCount: 53
  },
  {
    id: "store-7",
    name: "مجموعه ورزشی و باشگاه تخصصی بدنسازی تیتان",
    slug: "titan-gym-tehran",
    category: "باشگاه‌های ورزشی (بدنسازی، فیتنس، کراس‌فیت و پیلاتس)",
    city: "تهران",
    area: "سعادت‌آباد",
    address: "تهران، سعادت‌آباد، میدان کاج، بلوار سرو غربی، مجتمع ورزشی تیتان",
    phones: {
      mobile1: "09127778899",
      mobile2: "09307778899",
      landline: "02122098877"
    },
    coordinates: {
      lat: 35.7798,
      lng: 51.3752
    },
    social: {
      whatsapp: "https://wa.me/989127778899",
      telegram: "https://t.me/titan_gym_tehran",
      instagram: "https://instagram.com/titan_gym_official"
    },
    website: "https://titangym.ir",
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "مجهزترین باشگاه بدنسازی و فیتنس VIP با جدیدترین دستگاه‌های DHZ و تکنو جیم، سالن مجزای کراس‌فیت و تی‌آر‌ایکس، بوفه سلامت، سونا و جکوزی با حضور مربیان رسمی فدراسیون و سانس‌های اختصاصی بانوان و آقایان.",
    workingHours: "بانوان: ۸:۰۰ الی ۱۴:۳۰ | آقایان: ۱۵:۰۰ الی ۲۳:۳۰",
    featured: true,
    rating: 4.9,
    reviewCount: 168
  },
  {
    id: "store-8",
    name: "داروخانه و فروشگاه تخصصی مکمل‌های ورزشی پروتئین کینگ",
    slug: "protein-king-supplements",
    category: "فروشگاه‌های مکمل ورزشی (پروتئین، کراتین، گینر و آمینو)",
    city: "تهران",
    area: "میدان منیریه",
    address: "تهران، میدان منیریه، خیابان معیری، پلاک ۸۵، فروشگاه پروتئین کینگ",
    phones: {
      mobile1: "09128889900",
      mobile2: "09368889900",
      landline: "02155390011"
    },
    coordinates: {
      lat: 35.6825,
      lng: 51.4012
    },
    social: {
      whatsapp: "https://wa.me/989128889900",
      telegram: "https://t.me/protein_king_ir",
      instagram: "https://instagram.com/protein_king_iran"
    },
    website: "https://proteinking.ir",
    images: [
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "مرکز مجاز توزیع انواع مکمل‌های اورجینال ورزشی با برچسب اصالت سازمان غذا و دارو (تی‌تک)، شامل وی ایزوله و کنسانتره، کراتین میکرونایزد، بی‌سی‌ای‌ای، گلوتامین، پمپ، مولتی ویتامین‌های ورزشی و مشاوره رایگان تغذیه ورزشی.",
    workingHours: "شنبه تا پنج‌شنبه: ۱۰:۰۰ الی ۲۲:۰۰",
    featured: true,
    rating: 4.9,
    reviewCount: 135
  }
];

export const INITIAL_EQUIPMENT: EquipmentItem[] = [
  {
    id: "eq-1",
    title: "دوچرخه‌های حرفه‌ای کوهستان و کورسی",
    category: "دوچرخه و لوازم جانبی",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1000&auto=format&fit=crop",
    description: "انواع دوچرخه‌های سبک آلومینیومی و کربنی با دنده‌های شیمانو ژاپن، ترمزهای دیسکی هیدرولیک و سیستم تعلیق پیشرفته مناسب مسیرهای شهری و آفرود کوهستانی.",
    highlights: ["بدنه سبک و مقاوم آلیاژی", "سیستم دنده‌دهی ۲۴ و ۲۷ سرعته شیمانو", "دوشاخ قفل‌شو هیدرولیک"],
    popularity: "بسیار پرطرفدار"
  },
  {
    id: "eq-2",
    title: "دمبل‌های بدنسازی متغیر و شش‌ضلعی روکش‌دار",
    category: "بدنسازی و وزنه‌برداری",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    description: "ست‌های دمبل شش‌ضلعی با روکش لاستیکی ضدضربه و ضدلغزش جهت محافظت از کف سالن و دستان ورزشکار، در وزن‌های ۱ تا ۴۰ کیلوگرم با مغزی چدن فشرده.",
    highlights: ["طراحی ارگونومیک دسته استیل عاج‌دار", "بدون بوی نامطبوع پلاستیک", "مناسب تمرینات خانگی و باشگاهی"],
    popularity: "پرفروش‌ترین ابزار قدرتی"
  },
  {
    id: "eq-3",
    title: "کش‌های ورزشی، پاورباند و مینی‌لوپ پیلاتس",
    category: "تمرینات کششی و فانکشنال",
    image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?q=80&w=1000&auto=format&fit=crop",
    description: "کش‌های لاتکس طبیعی ۱۰۰٪ ضدحساسیت با سطوح مقاومت رنگ‌بندی شده (از سبک تا فوق‌سنگین)، ایده‌آل برای تمرینات گرم‌کردن، اصلاح فرم، بارفیکس و تقویت عضلات عمقی.",
    highlights: ["لاتکس طبیعی چندلایه با دوام بالا", "ضد پارگی و پوسته پوسته شدن", "وزن سبک و قابلیت حمل آسان"],
    popularity: "محبوب مربیان بدنسازی"
  },
  {
    id: "eq-4",
    title: "میله بارفیکس چندمنظوره دیواری و لادری",
    category: "تجهیزات ژیمناستیک و کالیستنیکس",
    image: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?q=80&w=1000&auto=format&fit=crop",
    description: "میله‌های بارفیکس فولادی ضخیم با قابلیت نصب روی دیوار یا چارچوب درب، مجهز به دستگیره‌های فوم فشرده ضدتعریق جهت اجرای حرکات پول‌آپ، چین‌آپ و شکم آویزان.",
    highlights: ["تحمل وزن تا ۱۸۰ کیلوگرم", "پدهای سیلیکونی محافظ چارچوب درب", "دارای زوایای گریپ مختلف عضلانی"],
    popularity: "ضروری برای تمرین در خانه"
  },
  {
    id: "eq-5",
    title: "دستگاه تقویت مچ و پنجه (فنر و گریپر تنظیمی)",
    category: "تقویت ساعد و مچ دست",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
    description: "فنر و گریپر تقویت مچ با پیچ تنظیم درجه مقاومت از ۱۰ الی ۶۰ کیلوگرم و شمارنده مکانیکی تکرارها، مناسب ورزشکاران رشته‌های رزمی، صخره‌نوردی، بدنسازی و نوازندگان.",
    highlights: ["فنر فولادی تقویت شده ضدزنگ", "شمارنده مکانیکی با کلید ریست", "دسته ضد تعریق با طراحی ارگونومیک"],
    popularity: "ابزار همراه همیشگی"
  },
  {
    id: "eq-6",
    title: "اقلام و تجهیزات جانبی دوچرخه‌سواری",
    category: "ایمنی و پوشاک دوچرخه",
    image: "https://images.unsplash.com/photo-1559348349-86f1f65817fe?q=80&w=1000&auto=format&fit=crop",
    description: "پکیج کامل شامل کلاه‌های ایمنی دارای استاندارد CE با تهویه آیرودینامیک، دستکش‌های ژله‌ای ضدشوک، عینک‌های پولاریزه ضدباد و چراغ‌های هشدار LED شارژی ضدآب.",
    highlights: ["کلاه فوم فشرده EPS با پوسته پلی‌کربنات", "دستکش با بالشتک‌های ژل ارگونومیک", "چراغ‌های پرنور با دید ۳۶۰ درجه"],
    popularity: "ایمنی و استایل"
  },
  {
    id: "eq-7",
    title: "طناب سرعتی بلبرینگی کراس‌فیت و بوکس",
    category: "هوازی و چربی‌سوزی",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    description: "سیم بکسل روکش‌دار فوق سریع با دو عدد بلبرینگ چرخشی ۳۶۰ درجه در هر دسته، طراحی شده برای رکوردهای دابل آندر و تمرینات استقامتی شدید بوکس و کراس‌فیت.",
    highlights: ["کابل استیل ضدپیچ‌خوردگی", "بلبرینگ‌های بی‌صدا با دور چرخش بالا", "قابلیت تنظیم سریع طول کابل"],
    popularity: "چربی‌سوز فوق‌العاده"
  },
  {
    id: "eq-8",
    title: "مت و تشک ورزشی یوگا و پیلاتس (TPE دو لایه)",
    category: "یوگا، پیلاتس و ریکاوری",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1000&auto=format&fit=crop",
    description: "زیرانداز ورزشی با ضخامت ۶ و ۸ میلی‌متر از جنس TPE مرغوب ضدلغزش و سازگار با محیط زیست، با خطوط راهنمای تراز بدن (Alignment lines) جهت اجرای بی‌نقص حرکات.",
    highlights: ["عدم جذب تعریق و بوی نامطبوع", "چسبندگی عالی به انواع سطوح پارکت و سنگ", "همراه با بند حمل و کاور اختصاصی"],
    popularity: "آرامش و تمرکز"
  }
];
