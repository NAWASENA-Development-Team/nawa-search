'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { MagnifyingGlass, UserCircle, Plus } from '@phosphor-icons/react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 animate-fade-in-up">
      <div className="glass px-6 py-4 rounded-2xl shadow-soft flex justify-between items-center border border-border">
        <Link href="/" className="flex items-center gap-3 group outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
          <div className="w-10 h-10 flex items-center justify-center bg-primary text-on-primary rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-105">
            <MagnifyingGlass weight="bold" className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            NawaSearch
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link 
                href="/dashboard" 
                className="hidden sm:flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
              >
                <UserCircle weight="fill" className="w-5 h-5" />
                Admin
              </Link>
              <button 
                onClick={handleLogout}
                className="text-sm font-semibold text-destructive hover:text-red-700 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2 py-1"
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              href="/login" 
              className="hidden sm:block text-sm font-semibold text-muted-foreground hover:text-primary transition-colors px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
            >
              Login
            </Link>
          )}
          
          <Link href="/upload" className="outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
            <button className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:bg-opacity-90 active:scale-95 transition-all duration-200 cursor-pointer">
              <Plus weight="bold" className="w-4 h-4" />
              <span className="hidden sm:inline">Lapor Temuan</span>
              <span className="sm:hidden">Lapor</span>
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}