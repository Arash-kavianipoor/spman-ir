import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StoreCard } from './components/StoreCard';
import { StoreMapModal } from './components/StoreMapModal';
import { StoreDetailModal } from './components/StoreDetailModal';
import { StoreMapSection } from './components/StoreMapSection';
import { EquipmentShowcase } from './components/EquipmentShowcase';
import { StoreRegisterForm } from './components/StoreRegisterForm';
import { ContactAdminSection } from './components/ContactAdminSection';
import { StoresDirectoryPage } from './components/StoresDirectoryPage';
import { StoresMapPage } from './components/StoresMapPage';
import { AboutUsPage } from './components/AboutUsPage';
import { Footer } from './components/Footer';
import { SEOHead } from './components/SEOHead';
import { fetchStores, fetchEquipment, ADMIN_PHONE } from './data/storeService';
import { Store, EquipmentItem } from './types';
import { Store as StoreIcon, Filter, Layers, CheckCircle2, Phone, Search, SlidersHorizontal, ArrowLeft, Sparkles, MapPin } from 'lucide-react';

export default function App() {
  const [stores, setStores] = useState<Store[]>([]);
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // View Routing: 'home' | 'stores-page' | 'map-page' | 'about-page'
  const [currentView, setCurrentView] = useState<'home' | 'stores-page' | 'map-page' | 'about-page'>('home');
  const [categoryFilterForDirectory, setCategoryFilterForDirectory] = useState<string>('');

  // Search and Filter States for Home Page Preview
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Modals
  const [mapModalStore, setMapModalStore] = useState<Store | null>(null);
  const [detailModalStore, setDetailModalStore] = useState<Store | null>(null);

  // Fetch dynamic data from JSON folder
  useEffect(() => {
    async function loadData() {
      try {
        const [storesData, equipmentData] = await Promise.all([
          fetchStores(),
          fetchEquipment(),
        ]);
        setStores(storesData);
        setEquipment(equipmentData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Available unique cities for filtering
  const availableCities = Array.from(new Set(stores.map((s) => s.city)));

  // Filtered stores for Home Section
  const filteredStores = stores.filter((store) => {
    const matchesSearch = 
      searchTerm.trim() === '' ||
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.area.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = selectedCity === 'all' || store.city === selectedCity;

    return matchesSearch && matchesCity;
  });

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'about' || sectionId === 'about-page') {
      setCurrentView('about-page');
      setActiveSection('about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'stores-page' || sectionId === 'stores') {
      setCurrentView('stores-page');
      setActiveSection('stores');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'map-page' || sectionId === 'map-view') {
      setCurrentView('map-page');
      setActiveSection('map-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Switch to Home if we are on dedicated page and clicking another section
    if (currentView !== 'home') {
      setCurrentView('home');
    }

    setActiveSection(sectionId);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (sectionId === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  const handleFilterByCategory = (keyword: string) => {
    setCategoryFilterForDirectory(keyword);
    setCurrentView('stores-page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col font-['Vazirmatn',sans-serif]">
      
      {/* SEO & Structured Data Synchronization */}
      <SEOHead stores={stores} equipment={equipment} activeStore={detailModalStore} />

      {/* Top Navbar */}
      <Navbar 
        onNavigate={handleNavigate} 
        activeSection={
          currentView === 'stores-page' 
            ? 'stores' 
            : currentView === 'map-page'
            ? 'map-view'
            : activeSection
        } 
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* VIEW 1: DEDICATED STORES PAGE WITH ADVANCED FILTERS */}
        {currentView === 'stores-page' ? (
          <StoresDirectoryPage
            stores={stores}
            onBackToHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenMap={(s) => setMapModalStore(s)}
            onOpenDetail={(s) => setDetailModalStore(s)}
            onGoToRegister={() => {
              setCurrentView('home');
              handleNavigate('register');
            }}
            initialCategoryFilter={categoryFilterForDirectory}
          />
        ) : currentView === 'map-page' ? (
          /* VIEW 2: DEDICATED MAP PAGE OF IRAN & PROFESSIONAL FILTERS */
          <StoresMapPage
            stores={stores}
            onBackToHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenStoreDetail={(s) => setDetailModalStore(s)}
            onOpenMapModal={(s) => setMapModalStore(s)}
            onGoToRegister={() => {
              setCurrentView('home');
              handleNavigate('register');
            }}
          />
        ) : currentView === 'about-page' ? (
          /* VIEW 3: DEDICATED ABOUT US PAGE WITH ORIGINAL HIGH-RES LOGO */
          <AboutUsPage
            onBackToHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoToRegister={() => {
              setCurrentView('home');
              handleNavigate('register');
            }}
          />
        ) : (
          /* VIEW 4: HOME PAGE & FULL OVERVIEW */
          <>
            {/* 1. Hero Section */}
            <div id="hero">
              <HeroSection
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
                availableCities={availableCities}
                totalStores={stores.length}
                onExploreClick={() => {
                  setCurrentView('stores-page');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onRegisterClick={() => handleNavigate('register')}
              />
            </div>

            {/* 2. Stores Showcase & Direct Access to Dedicated Filter Page */}
            <section id="stores" className="py-16 bg-[#0a0b12] relative overflow-hidden">
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                
                {/* Section Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                      <StoreIcon className="w-4 h-4" />
                      <span>فهرست فروشگاه‌های ثبت شده در فایل داینامیک</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                      فروشگاه‌های معتبر لوازم ورزشی
                    </h2>
                    <p className="text-sm text-zinc-400 max-w-xl font-normal">
                      همراه با ۳ عکس اختصاصی، شماره‌های تماس موبایل و ثابت، نقشه زنده گوگل و آدرس دقیق
                    </p>
                  </div>

                  {/* Dedicated Page Action CTA Button */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        setCurrentView('stores-page');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer hover:scale-[1.02]"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                      <span>ورود به صفحه جستجو و فیلتر پیشرفته</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* If Stores Found */}
                {filteredStores.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {filteredStores.slice(0, 6).map((store) => (
                      <StoreCard
                        key={store.id}
                        store={store}
                        onOpenMap={(s) => setMapModalStore(s)}
                        onOpenDetail={(s) => setDetailModalStore(s)}
                      />
                    ))}
                  </div>
                ) : (
                  /* Empty State */
                  <div className="text-center py-16 bg-[#11131c] border border-white/10 rounded-3xl p-8 space-y-4 max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                      <Search className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-white">فروشگاهی با این مشخصات یافت نشد</h3>
                    <p className="text-xs text-zinc-400">
                      می‌توانید فیلتر جستجو را پاک کنید یا وارد صفحه جستجوی پیشرفته شوید.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCity('all');
                      }}
                      className="px-4 py-2 bg-amber-500 text-black text-xs font-bold rounded-xl hover:bg-amber-400 transition-all cursor-pointer"
                    >
                      نمایش تمام فروشگاه‌ها
                    </button>
                  </div>
                )}

                {/* View All Stores Banner */}
                {stores.length > 6 && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => {
                        setCurrentView('stores-page');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-amber-400/50 rounded-2xl text-white font-bold text-sm transition-all shadow cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>مشاهده همه {stores.length} فروشگاه در صفحه جستجو و فیلتر پیشرفته</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                )}

              </div>
            </section>

            {/* 3. Interactive Map View Section */}
            {stores.length > 0 && (
              <StoreMapSection
                stores={stores}
                onSelectStore={(s) => setDetailModalStore(s)}
                onOpenMapModal={(s) => setMapModalStore(s)}
                onGoToFullMap={() => handleNavigate('map-page')}
              />
            )}

            {/* 4. Equipment Showcase Section */}
            {equipment.length > 0 && (
              <EquipmentShowcase
                items={equipment}
                onSelectCategory={handleFilterByCategory}
              />
            )}

            {/* 5. Store Registration Form Section */}
            <StoreRegisterForm />

            {/* 6. Contact Admin Hotline Section */}
            <ContactAdminSection />
          </>
        )}

      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Live Google Maps Modal */}
      {mapModalStore && (
        <StoreMapModal
          store={mapModalStore}
          onClose={() => setMapModalStore(null)}
        />
      )}

      {/* Store Full Details Modal */}
      {detailModalStore && (
        <StoreDetailModal
          store={detailModalStore}
          onClose={() => setDetailModalStore(null)}
          onOpenMap={(s) => setMapModalStore(s)}
        />
      )}

    </div>
  );
}
