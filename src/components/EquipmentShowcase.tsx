import React, { useState } from 'react';
import { Dumbbell, Sparkles, Check, ArrowLeft, Filter, Tag } from 'lucide-react';
import { EquipmentItem } from '../types';

interface EquipmentShowcaseProps {
  items: EquipmentItem[];
  onSelectCategory: (keyword: string) => void;
}

export const EquipmentShowcase: React.FC<EquipmentShowcaseProps> = ({ items, onSelectCategory }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(items.map((i) => i.category)))];

  const filteredItems = activeFilter === 'all'
    ? items
    : items.filter((i) => i.category === activeFilter);

  return (
    <section id="equipment" className="py-16 bg-[#0c0d14] relative overflow-hidden border-t border-b border-white/5">
      
      {/* Ambience glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>راهنمای معرفی و بررسی ملزومات ورزشی</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              تجهیزات و لوازم ورزشی منتخب
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl font-normal">
              آشنایی با برترین اقلام ورزشی از جمله دوچرخه، دمبل، کش ورزشی، بارفیکس، دستگاه تقویت مچ و لوازم جانبی با مشخصات کامل
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all font-medium ${
                  activeFilter === cat
                    ? 'bg-amber-500 text-black font-bold shadow-md'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'همه تجهیزات' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="group bg-[#13151f] border border-white/10 hover:border-amber-500/40 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:shadow-amber-500/10"
            >
              
              {/* Photo & Badge */}
              <div className="relative aspect-[4/3] bg-black/60 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13151f] via-transparent to-black/40" />

                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-amber-300 border border-white/10 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Tag className="w-3 h-3 text-amber-400" />
                  <span>{item.category}</span>
                </div>

                <div className="absolute bottom-3 left-3 bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-md shadow">
                  {item.popularity}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="space-y-1.5 pt-3 border-t border-white/5">
                  {item.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Find in Stores Button */}
                <button
                  onClick={() => onSelectCategory(item.title.split(' ')[0])}
                  className="w-full mt-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-amber-500 text-zinc-300 hover:text-black border border-white/10 hover:border-transparent text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>یافتن فروشگاه‌های این کالا</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
