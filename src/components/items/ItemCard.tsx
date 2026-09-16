import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight, Image as ImageIcon } from '@phosphor-icons/react';

interface ItemCardProps {
  item: {
    id: string;
    title?: string;
    location_found?: string;
    status?: string;
    image_url?: string;
    category?: string;
  };
}

export default function ItemCard({ item }: ItemCardProps) {
  const title = item?.title || 'Tanpa Nama';
  const location = item?.location_found || 'Lokasi tidak diketahui';
  const status = item?.status || 'Tersedia';
  const isTersedia = status.toLowerCase() === 'tersedia';

  return (
    <div className="group flex flex-col h-full bg-card rounded-2xl shadow-soft hover:shadow-premium transition-all duration-300 overflow-hidden border border-border">
      <div className="relative h-52 w-full overflow-hidden bg-muted">
        {item.image_url ? (
          <Image 
            src={item.image_url} 
            alt={title} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
            <ImageIcon weight="regular" className="w-8 h-8 opacity-50" />
            <span className="text-sm font-medium">No Image</span>
          </div>
        )}
        
        {item.category && (
          <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border shadow-sm">
            <span className="text-xs font-semibold text-primary">{item.category}</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-4">
          <h3 className="text-base font-bold text-card-foreground leading-tight line-clamp-2">
            {title}
          </h3>
          <span className={`shrink-0 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide ${
            isTersedia ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {status}
          </span>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin weight="fill" className="w-4 h-4 shrink-0" />
            <p className="text-xs font-medium line-clamp-1">{location}</p>
          </div>
          
          <Link href={`/item/${item.id}`} className="shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
            <button className="flex items-center gap-1 text-xs font-bold text-primary hover:text-secondary transition-colors cursor-pointer group/btn">
              Detail 
              <ArrowRight weight="bold" className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}