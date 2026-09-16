import type { Metadata } from 'next';
import { Outfit, Work_Sans } from 'next/font/google';
import './globals.css';

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-mono', // We use this as a secondary font alias for now
});

export const metadata: Metadata = {
  title: 'NawaSearch | Pusat Kehilangan',
  description: 'Sistem informasi barang hilang dan ditemukan di sekolah, terintegrasi dengan NAWASENA.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning className={`${outfit.variable} ${workSans.variable}`}>
      <head>
      </head>
      <body className="font-sans bg-background text-foreground antialiased min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}