'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import ItemCard from '@/components/items/ItemCard';
import Navbar from '@/components/shared/Navbar';
import { MagnifyingGlass, Package } from '@phosphor-icons/react';

const CATEGORIES = ['Semua', 'Elektronik', 'Atribut', 'Alat Tulis', 'Dompet/Kunci', 'Lainnya'];

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      
      let query = supabase
        .from('items')
        .select('*')
        .eq('status', 'Tersedia')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      if (activeCategory !== 'Semua') {
        query = query.eq('category', activeCategory);
      }

      const { data, error } = await query;
      
      if (!error) {
        setItems(data || []);
      }
      setLoading(false);
    };

    const delayDebounceFn = setTimeout(() => {
      fetchItems();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-32 md:pt-40 pb-24 md:pb-32">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-20 animate-fade-in-up">
          <div className="inline-block px-3 py-1 bg-primary/10 rounded-full mb-6 border border-primary/20">
            <span className="text-xs font-bold text-primary tracking-wide">Pusat Informasi Kehilangan</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 tracking-tight leading-tight">
            Temukan Barangmu <br className="hidden sm:block" />
            <span className="text-gradient">Cepat & Mudah.</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm md:text-base font-medium leading-relaxed">
            Pusat informasi barang temuan di area sekolah.
            Kehilangan sesuatu? Cari di sini sekarang atau laporkan barang yang kamu temukan.
          </p>
        </div>

        {/* Search & Filter Section */}
        <div className="glass p-4 rounded-2xl shadow-soft mb-12 sticky top-24 z-40 animate-fade-in-up border border-border" style={{ animationDelay: '0.1s' }}>
          <div className="relative mb-4">
            <MagnifyingGlass weight="bold" className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input 
              type="text"
              placeholder="Cari barang hilang (contoh: Kunci Motor, Dompet)..."
              className="w-full bg-background border border-border rounded-xl py-4 pl-14 pr-6 text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all text-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  activeCategory === cat 
                    ? 'bg-primary text-on-primary shadow-sm' 
                    : 'bg-background text-muted-foreground hover:bg-muted hover:text-foreground border border-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Item Grid Section */}
        <div className="mb-8 flex justify-between items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {loading ? 'Sinkronisasi Data...' : `Barang Temuan (${items.length})`}
          </h2>
          {!loading && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-600">Live</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[22rem] bg-card rounded-2xl border border-border shadow-soft animate-pulse flex flex-col overflow-hidden">
                 <div className="w-full h-52 bg-muted" />
                 <div className="p-5 flex flex-col gap-4 flex-grow">
                   <div className="h-5 bg-muted w-3/4 rounded-md" />
                   <div className="mt-auto h-4 bg-muted w-1/2 rounded-md" />
                 </div>
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-24 bg-card rounded-2xl border border-border animate-fade-in-up">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
              <Package weight="duotone" className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Barang Tidak Ditemukan</h3>
            <p className="text-muted-foreground text-sm font-medium max-w-sm mx-auto">
              Sepertinya barang yang kamu cari belum ada di daftar kami. Coba gunakan kata kunci lain atau pilih kategori Semua.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}