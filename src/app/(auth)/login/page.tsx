'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MagnifyingGlass, WarningCircle } from '@phosphor-icons/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 500);
      }
    } catch (err: any) {
      setError('Terjadi kesalahan sistem. Coba lagi nanti.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-secondary/5 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
            <div className="w-12 h-12 flex items-center justify-center bg-primary text-on-primary rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-105">
              <MagnifyingGlass weight="bold" className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
              NawaSearch
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Admin Login</h2>
          <p className="text-muted-foreground font-medium text-sm mt-2">Masuk untuk mengelola data barang temuan</p>
        </div>

        <div className="bg-card p-8 rounded-3xl shadow-premium border border-border relative z-10">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-destructive text-sm font-semibold p-4 rounded-xl border border-red-100 flex items-center gap-2">
                <WarningCircle weight="fill" className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2 ml-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nawasearch.com"
                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2 ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-on-primary font-bold uppercase tracking-wider text-sm py-4 rounded-xl shadow-md hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 outline-none focus-visible:ring-4 focus-visible:ring-primary/30 cursor-pointer mt-2"
            >
              {loading ? 'MEMPROSES...' : 'MASUK SEKARANG'}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Powered by NAWASENA
        </p>
      </div>
    </div>
  );
}
