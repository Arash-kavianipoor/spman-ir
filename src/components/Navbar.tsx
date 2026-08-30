import React, { useState } from 'react';
import { Phone, Menu, X } from 'lucide-react';
import { ADMIN_PHONE } from '../data/storeService';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  // Ultra-concise & minimal navigation links
  const navItems = [
    { id: 'hero', label: 'خانه' },
    { id: 'stores', label: 'فروشگاه‌ها' },
    { id: 'map-view', label: 'نقشه' },
    { id: 'register', label: 'ثبت' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#07080b]/92 backdrop-blur-xl border-b border-white/10 transition-all select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* 1. Left Brand / Logo: اسپرت من (Sport Man) with Compact Optimized Logo */}
          <div 
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Optimized Compact Logo Image */}
            <div className="relative flex items-center justify-center">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500/40 via-white/10 to-orange-500/40 p-[1.5px] shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 group-hover:scale-105 transition-all duration-300">
                <div className="w-full h-full bg-[#0d0f17] rounded-[14px] p-1.5 flex items-center justify-center overflow-hidden relative">
                  <img
                    src="/logo-compact.png"
                    alt="لوگوی اسپرت من"
                    className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                    loading="eager"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-[#07080b] shadow-[0_0_8px_#f59e0b] animate-pulse" />
            </div>

            {/* Brand Typography (اسپرت من) */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  اسپرت من
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 tracking-wider">
                  PRO
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono tracking-[0.2em] uppercase -mt-0.5 group-hover:text-zinc-300 transition-colors">
                SPORTMAN.IR
              </span>
            </div>
          </div>

          {/* 2. Center Ultra-Minimal Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navItems.map((item) => {
              const isActive = activeSection === item.id || 
                (item.id === 'hero' && activeSection === 'home') ||
                (item.id === 'stores' && activeSection === 'stores-page') ||
                (item.id === 'map-view' && activeSection === 'map-page');

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1.5 transition-colors cursor-pointer text-sm ${
                    isActive
                      ? 'text-amber-400 font-bold'
                      : 'text-zinc-300 hover:text-white font-medium'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* 3. Right Action Pill Button (تماس) */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${ADMIN_PHONE}`}
              className="px-5 py-2 rounded-full bg-[#1c1f2a] hover:bg-amber-500 hover:text-black border border-white/10 hover:border-amber-400 text-white text-xs font-semibold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>تماس با ما</span>
            </a>
          </div>

          {/* Mobile Hamburger Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={`tel:${ADMIN_PHONE}`}
              className="p-2 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20"
              title="تماس"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-300 hover:text-white"
              aria-label="منو"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#090b10] border-b border-white/10 px-4 py-4 space-y-1 text-sm text-zinc-200 shadow-2xl">
          {navItems.map((item) => {
            const isActive = activeSection === item.id ||
              (item.id === 'hero' && activeSection === 'home') ||
              (item.id === 'stores' && activeSection === 'stores-page') ||
              (item.id === 'map-view' && activeSection === 'map-page');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-right py-2.5 px-3 rounded-xl flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-black font-bold'
                    : 'hover:bg-white/5 text-zinc-300'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-white/10">
            <a
              href={`tel:${ADMIN_PHONE}`}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-black py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-black"
            >
              <Phone className="w-4 h-4" />
              تماس: {ADMIN_PHONE}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
