import React, { useState } from 'react';
import { SM4LYFLogo } from './SM4LYFLogo';
import { Disc3, Music2, Camera, Calendar, Award, Sparkles, Image as ImageIcon, ShieldCheck } from 'lucide-react';

export type BrandImageFallbackType = 
  | 'album'
  | 'song'
  | 'gallery'
  | 'timeline'
  | 'achievement'
  | 'hero'
  | 'avatar'
  | 'general';

export interface BrandImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide' | 'banner' | 'auto';
  fallbackType?: BrandImageFallbackType;
  title?: string;
  subtitle?: string;
  year?: number | string;
  category?: string;
  credit?: string;
  source?: string;
  showCreditBadge?: boolean;
  onClick?: () => void;
  priority?: boolean;
}

export const BrandImage: React.FC<BrandImageProps> = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  aspectRatio = 'square',
  fallbackType = 'album',
  title,
  subtitle,
  year,
  category,
  credit,
  source,
  showCreditBadge = false,
  onClick,
  priority = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check if src is valid (not empty, not generic unsplash)
  const isGenericOrEmpty = !src || src.trim() === '' || src.includes('unsplash.com/photo-');
  const shouldUseFallback = hasError || isGenericOrEmpty;

  const aspectRatioClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    wide: 'aspect-[16/9]',
    banner: 'aspect-[21/9]',
    auto: '',
  }[aspectRatio];

  const getFallbackIcon = () => {
    switch (fallbackType) {
      case 'album':
        return <Disc3 className="w-6 h-6 text-[#D4820A]" />;
      case 'song':
        return <Music2 className="w-6 h-6 text-[#D4820A]" />;
      case 'gallery':
        return <Camera className="w-6 h-6 text-[#D4820A]" />;
      case 'timeline':
        return <Calendar className="w-6 h-6 text-[#D4820A]" />;
      case 'achievement':
        return <Award className="w-6 h-6 text-[#D4820A]" />;
      case 'hero':
        return <Sparkles className="w-8 h-8 text-[#D4820A]" />;
      default:
        return <ImageIcon className="w-6 h-6 text-[#D4820A]" />;
    }
  };

  const getFallbackLabel = () => {
    switch (fallbackType) {
      case 'album':
        return 'ALBUM ARCHIVE';
      case 'song':
        return 'OFFICIAL TRACK';
      case 'gallery':
        return 'PHOTOGRAPHIC ARCHIVE';
      case 'timeline':
        return 'HISTORIC MILESTONE';
      case 'achievement':
        return 'OFFICIAL CITATION';
      case 'hero':
        return 'SM4LYF LEGACY ARCHIVE';
      default:
        return 'SM4LYF ARCHIVE';
    }
  };

  return (
    <div
      className={`relative overflow-hidden group bg-[#0D0B0A] ${aspectRatioClass} ${className}`}
      onClick={onClick}
    >
      {shouldUseFallback ? (
        /* Stylized Dark Gold-on-Black Fallback Card */
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#16120E] via-[#0E0C0A] to-[#080706] border border-[#2E231B] flex flex-col items-center justify-center p-4 text-center select-none">
          {/* Subtle concentric vinyl record groove rings */}
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none flex items-center justify-center">
            <svg viewBox="0 0 400 400" className="w-full h-full animate-spin-slow">
              <circle cx="200" cy="200" r="190" stroke="#F2A93C" strokeWidth="1.5" fill="none" strokeDasharray="4 6" />
              <circle cx="200" cy="200" r="160" stroke="#F2A93C" strokeWidth="1" fill="none" />
              <circle cx="200" cy="200" r="130" stroke="#F2A93C" strokeWidth="1.5" fill="none" strokeDasharray="8 8" />
              <circle cx="200" cy="200" r="100" stroke="#F2A93C" strokeWidth="1" fill="none" />
              <circle cx="200" cy="200" r="70" stroke="#F2A93C" strokeWidth="2" fill="none" strokeDasharray="3 5" />
              <circle cx="200" cy="200" r="40" stroke="#F2A93C" strokeWidth="1.5" fill="none" />
            </svg>
          </div>

          {/* Subtle Golden Radial Glow */}
          <div className="absolute inset-0 bg-radial-gradient from-[#D4820A]/10 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Foreground Emblem & Content */}
          <div className="relative z-10 flex flex-col items-center justify-center max-w-[88%] space-y-2">
            {/* SM4LYF Gold Emblem */}
            <div className="transform group-hover:scale-105 transition-transform duration-300">
              <SM4LYFLogo size={aspectRatio === 'banner' || aspectRatio === 'wide' ? 'sm' : 'md'} showText={false} />
            </div>

            {/* Archival Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1F1813] border border-[#D4820A]/30 text-[#C9A24B] text-[10px] font-bold uppercase tracking-widest">
              {getFallbackIcon()}
              <span>{getFallbackLabel()}</span>
            </div>

            {/* Title & Subtitle if provided */}
            {title && (
              <div className="space-y-0.5">
                <p className="text-white font-extrabold text-xs sm:text-sm font-heading line-clamp-1 tracking-tight">
                  {title}
                </p>
                {(subtitle || year || category) && (
                  <p className="text-[#A89F91] text-[10px] line-clamp-1 font-medium">
                    {category && <span className="text-[#E5A63F]">{category} • </span>}
                    {subtitle || (year ? `Released ${year}` : 'Curated Archival Asset')}
                  </p>
                )}
              </div>
            )}

            {/* Subtle Audio Waveform Decorator */}
            <div className="flex items-center gap-1 pt-1 opacity-70">
              <div className="w-1 h-2 rounded-full bg-[#D4820A]/60 animate-pulse" />
              <div className="w-1 h-3.5 rounded-full bg-[#F2A93C]/80" />
              <div className="w-1 h-5 rounded-full bg-[#FFF2D6]" />
              <div className="w-1 h-3 rounded-full bg-[#F2A93C]/80" />
              <div className="w-1 h-1.5 rounded-full bg-[#D4820A]/60 animate-pulse" />
            </div>

            {/* Source / Status footer notice */}
            <div className="pt-1">
              <span className="text-[9px] text-[#786D61] tracking-wider uppercase font-semibold">
                Official Artwork Sourcing in Progress
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Real Image Display with smooth transition and error fallback */
        <>
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            loading={priority ? 'eager' : 'lazy'}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover transition-all duration-500 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } ${imgClassName}`}
          />
          {/* Subtle bottom vignette to ensure text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity" />
        </>
      )}

      {/* Credit & Source Attribution Tag */}
      {(credit || source) && (showCreditBadge || credit) && (
        <div className="absolute bottom-2 right-2 z-10 max-w-[90%] pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-[#332720]/80 text-[10px] text-[#F5EFE6]/90 shadow-lg truncate">
            {credit ? (
              <>
                <Camera className="w-3 h-3 text-[#C9A24B] shrink-0" />
                <span className="truncate">Credit: <strong className="text-white font-medium">{credit}</strong></span>
              </>
            ) : source ? (
              <>
                <ShieldCheck className="w-3 h-3 text-[#C9A24B] shrink-0" />
                <span className="truncate">{source}</span>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
