'use client';

import { useEffect } from 'react';
import { CheckCircle, WarningCircle, Info } from '@phosphor-icons/react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const Icon = type === 'success' ? CheckCircle : type === 'error' ? WarningCircle : Info;
  const colorClass = type === 'success' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 
                     type === 'error' ? 'text-destructive bg-red-50 border-red-200' : 
                     'text-blue-600 bg-blue-50 border-blue-200';

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] animate-fade-in-up">
      <div className="bg-card px-5 py-3 rounded-xl shadow-premium border border-border flex items-center gap-3 min-w-[300px]">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${colorClass}`}>
          <Icon weight="fill" className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground tracking-tight leading-none mb-1">
            {type === 'success' ? 'BERHASIL' : type === 'error' ? 'GAGAL' : 'INFORMASI'}
          </p>
          <p className="text-xs font-semibold text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}
