'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Toast from '@/components/shared/Toast';
import { MapPin, ArrowLeft, Warning, CheckCircle, Image as ImageIcon } from '@phosphor-icons/react';

export default function ItemDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      const { data } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single();
      
      setItem(data);
      setLoading(false);
    };

    fetchDetail();
  }, [id]);

  const handleClaim = async () => {
    if (!item) return;
    
    setClaiming(true);
    try {
      const { error } = await supabase
        .from('items')
        .update({ status: 'Menunggu Persetujuan' })
        .eq('id', id);

      if (error) throw error;

      const message = `Halo GENESIS, saya ingin mengklaim barang berikut:\n\n` +
                      `Nama Barang: ${item.title}\n` +
                      `Lokasi: ${item.location_found}\n` +
                      `ID Barang: ${id}\n\n` +
                      `Saya akan segera ke ruang OSIS untuk verifikasi.`;
      
      const whatsappUrl = `https://wa.me/6285178233161?text=${encodeURIComponent(message)}`;

      setItem({ ...item, status: 'Menunggu Persetujuan' });
      window.open(whatsappUrl, '_blank');
      setToast({ message: 'Proses Klaim Berhasil!', type: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ message: 'Gagal memproses klaim.', type: 'error' });
    } finally {
      setClaiming(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-muted-foreground font-semibold flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        Memuat data...
      </div>
    </div>
  );
  
  if (!item) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <div className="text-destructive font-bold text-lg">Barang tidak ditemukan.</div>
      <Link href="/" className="text-primary hover:underline font-semibold text-sm">Kembali ke Beranda</Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-background pt-32 pb-24 px-6 transition-colors duration-300">
      <Navbar />
      
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
          <button className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-10 group cursor-pointer">
            <ArrowLeft weight="bold" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Kembali ke Beranda
          </button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Image Section */}
          <div className="relative h-[400px] md:h-[500px] w-full rounded-3xl overflow-hidden shadow-soft animate-fade-in-up border border-border bg-muted">
            {item.image_url ? (
              <Image 
                src={item.image_url} 
                alt={item.title} 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover" 
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                <ImageIcon weight="regular" className="w-12 h-12 opacity-50" />
                <span className="text-base font-medium">No Image</span>
              </div>
            )}
            
            <div className="absolute top-6 right-6 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-border">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {item.status}
              </span>
            </div>
          </div>

          {/* Info Section */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-8 tracking-tight leading-tight">
              {item.title}
            </h1>

            <div className="space-y-6 mb-12">
              <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Lokasi Penemuan</p>
                <p className="text-lg font-bold text-foreground flex items-center gap-3">
                  <span className="p-2 bg-primary/10 rounded-lg text-primary">
                    <MapPin weight="fill" className="w-5 h-5" />
                  </span>
                  {item.location_found}
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Ciri-ciri & Deskripsi</p>
                <p className="text-sm font-medium text-foreground leading-relaxed whitespace-pre-wrap">
                  {item.description || 'Tidak ada deskripsi tambahan untuk barang ini.'}
                </p>
              </div>
            </div>

            {/* Action Card */}
            {item.status === 'Tersedia' ? (
              <div className="bg-foreground text-background p-8 rounded-3xl shadow-premium relative overflow-hidden group border border-foreground/10">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2 tracking-tight">Barang Milikmu?</h3>
                  <p className="text-background/70 text-sm mb-8 font-medium">Klik tombol di bawah untuk proses verifikasi via WhatsApp ke GENESIS.</p>
                  
                  <button 
                    onClick={handleClaim}
                    disabled={claiming}
                    className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md disabled:opacity-50 disabled:active:scale-100 outline-none focus-visible:ring-4 focus-visible:ring-primary/30 cursor-pointer"
                  >
                    {claiming ? 'MEMPROSES...' : 'KLAIM SEKARANG'}
                  </button>
                  <p className="text-xs text-center text-background/50 mt-5 font-semibold uppercase tracking-widest">Wajib verifikasi di Ruang OSIS</p>
                </div>
              </div>
            ) : item.status === 'Menunggu Persetujuan' ? (
              <div className="bg-amber-50 border border-amber-200 p-8 rounded-3xl text-center shadow-sm animate-pulse">
                <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mb-4">
                  <Warning weight="fill" className="w-6 h-6" />
                </div>
                <p className="text-amber-800 font-bold text-xl mb-2">Sedang Diverifikasi</p>
                <p className="text-sm text-amber-700/80 font-medium leading-relaxed max-w-sm mx-auto">
                  Seseorang sedang mengklaim barang ini. Status akan berubah jika verifikasi gagal atau selesai.
                </p>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl text-center shadow-sm">
                <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                  <CheckCircle weight="fill" className="w-6 h-6" />
                </div>
                <p className="text-emerald-800 font-bold text-xl mb-2">Berhasil Diklaim</p>
                <p className="text-sm text-emerald-700/80 font-medium">Barang ini sudah kembali ke pemiliknya.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </main>
  );
}