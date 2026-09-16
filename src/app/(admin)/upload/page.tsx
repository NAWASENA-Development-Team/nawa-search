'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Toast from '@/components/shared/Toast';
import { Package, Camera, Image as ImageIcon, X } from '@phosphor-icons/react';

const CATEGORIES = ['Elektronik', 'Atribut', 'Alat Tulis', 'Dompet/Kunci', 'Lainnya'];

export default function AdminUploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const triggerInput = (id: string) => {
    document.getElementById(id)?.click();
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
    } catch (err) {
      console.error('Error access camera:', err);
      alert('Gagal mengakses kamera. Pastikan izin kamera sudah diberikan.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const takePhoto = () => {
    const video = document.getElementById('camera-view') as HTMLVideoElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const photoFile = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
          setFile(photoFile);
          setPreview(URL.createObjectURL(photoFile));
          stopCamera();
        }
      }, 'image/jpeg', 0.8);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const location = formData.get('location') as string;
    const description = formData.get('description') as string;

    try {
      let image_url = '';

      if (file) {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `nawa-${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('item-image')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Gagal masuk bucket:', uploadError.message);
          alert('Gagal upload gambar ke storage.');
          setLoading(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from('item-image')
          .getPublicUrl(fileName);

        image_url = urlData.publicUrl;
      }

      const { error } = await supabase.from('items').insert([{
        title,
        category,
        location_found: location,
        description,
        image_url,
        status: 'Tersedia',
        is_notified: false
      }]);

      if (error) throw error;
      
      setToast({ message: 'Barang Berhasil Diinput!', type: 'success' });
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err: any) {
      console.error(err);
      setToast({ message: 'Gagal: ' + err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background pt-32 pb-24 px-6 transition-colors duration-300">
      <Navbar />
      
      <div className="max-w-2xl mx-auto bg-card rounded-3xl p-8 md:p-12 shadow-soft animate-fade-in-up border border-border">
        <header className="mb-10 text-center">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Package weight="duotone" className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-3">Input Barang Temuan</h1>
          <p className="text-sm font-medium text-muted-foreground">Pastikan data yang diinput sudah sesuai dengan barang aslinya.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Upload Foto Section */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Foto Barang</label>
            
            {preview ? (
              <div className="relative h-72 w-full rounded-2xl overflow-hidden shadow-sm group border border-border">
                <img src={preview} alt="Preview" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button 
                  type="button"
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm text-foreground w-10 h-10 rounded-full shadow-sm flex items-center justify-center hover:bg-destructive hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                >
                  <X weight="bold" className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={startCamera}
                  className="h-40 bg-background border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5 transition-all group outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                >
                  <div className="w-12 h-12 bg-card rounded-xl flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform text-primary border border-border">
                    <Camera weight="duotone" className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">Kamera</p>
                </button>

                <button
                  type="button"
                  onClick={() => triggerInput('file-input')}
                  className="h-40 bg-background border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5 transition-all group outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                >
                  <div className="w-12 h-12 bg-card rounded-xl flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform text-primary border border-border">
                    <ImageIcon weight="duotone" className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">Galeri</p>
                </button>
              </div>
            )}

            <input id="camera-input" type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
            <input id="file-input" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Nama Barang</label>
              <input name="title" type="text" placeholder="Contoh: Kunci Motor Honda" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all text-foreground placeholder:text-muted-foreground" required />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Kategori</label>
              <select name="category" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all text-foreground appearance-none" required>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Lokasi Penemuan</label>
              <input name="location" type="text" placeholder="Contoh: Kantin Depan" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all text-foreground placeholder:text-muted-foreground" required />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Deskripsi Ciri-ciri</label>
              <textarea name="description" rows={3} placeholder="Jelaskan detail barang..." className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all text-foreground placeholder:text-muted-foreground"></textarea>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-sm tracking-wide hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md disabled:opacity-50 disabled:active:scale-100 outline-none focus-visible:ring-4 focus-visible:ring-primary/30 cursor-pointer mt-4"
          >
            {loading ? 'MENYIMPAN DATA...' : 'SIMPAN & BROADCAST'}
          </button>
        </form>
      </div>

      {/* Camera Overlay */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6">
          <div className="relative w-full max-w-lg h-[80vh] rounded-3xl overflow-hidden shadow-2xl bg-black">
            <video
              id="camera-view"
              autoPlay
              playsInline
              ref={(el) => {
                if (el && stream) el.srcObject = stream;
              }}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute bottom-10 inset-x-0 flex justify-center items-center gap-10 px-8">
              <button onClick={stopCamera} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white">
                <X weight="bold" className="w-6 h-6" />
              </button>
              
              <button onClick={takePhoto} className="w-20 h-20 rounded-full bg-white p-1 shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-white/50">
                <div className="w-full h-full rounded-full border-[6px] border-black/80" />
              </button>

              <div className="w-12" />
            </div>
          </div>
        </div>
      )}

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