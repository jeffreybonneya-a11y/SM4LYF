import React, { useState, useEffect } from 'react';
import { getSiteSettings } from '../../services/firestore';

interface SM4LYFLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  showText?: boolean;
  animated?: boolean;
  src?: string;
  alt?: string;
}

export const SM4LYFLogo: React.FC<SM4LYFLogoProps> = ({
  size = 'md',
  className = '',
  showText = true,
  animated = false,
  src,
  alt = 'Shatta Movement / SM4LYF Brand Asset',
}) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(src || null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (src) {
      setLogoUrl(src);
      setImageError(false);
      return;
    }

    // Try to load customLogoUrl from site settings or local storage
    async function fetchLogo() {
      try {
        const settings = await getSiteSettings();
        if (settings?.customLogoUrl && settings.customLogoUrl.trim() !== '') {
          setLogoUrl(settings.customLogoUrl);
          setImageError(false);
        }
      } catch (err) {
        // graceful fallback to default
      }
    }
    fetchLogo();
  }, [src]);

  const sizeMap = {
    xs: { box: 'h-6 w-auto max-w-[80px]', iconSize: 22, text: 'text-[10px]' },
    sm: { box: 'h-8 w-auto max-w-[110px]', iconSize: 28, text: 'text-xs' },
    md: { box: 'h-12 w-auto max-w-[150px]', iconSize: 42, text: 'text-sm' },
    lg: { box: 'h-16 w-auto max-w-[200px]', iconSize: 58, text: 'text-base' },
    xl: { box: 'h-24 w-auto max-w-[280px]', iconSize: 84, text: 'text-xl' },
    hero: { box: 'h-32 sm:h-40 w-auto max-w-[380px]', iconSize: 120, text: 'text-3xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
      {/* Authentic Referenced Brand Graphic or Typographic Mark */}
      {logoUrl && !imageError ? (
        <img
          src={logoUrl}
          alt={alt}
          onError={() => setImageError(true)}
          className={`${currentSize.box} object-contain transition-all duration-300 ${
            animated ? 'hover:scale-105' : ''
          }`}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      ) : (
        /* Authentic Typographic Emblem representing the SM4LYF Project */
        <div
          className={`flex items-center justify-center font-heading font-black tracking-wider text-white transition-all duration-300 ${
            animated ? 'hover:scale-105' : ''
          }`}
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-b from-[#1E1712] to-[#120D0A] border border-[#D4820A]/50 shadow-[0_2px_12px_rgba(212,130,10,0.25)]">
            <span
              className="text-[#F2A93C] font-black uppercase tracking-widest font-heading drop-shadow-md"
              style={{
                fontSize: size === 'xs' ? '11px' : size === 'sm' ? '13px' : size === 'md' ? '17px' : size === 'lg' ? '22px' : size === 'xl' ? '30px' : '40px',
                letterSpacing: '0.18em'
              }}
            >
              SM4LYF
            </span>
          </div>
        </div>
      )}

      {/* Project Subtitle / Identification */}
      {showText && (
        <div className="mt-1 flex flex-col items-center">
          <span
            className={`font-black tracking-[0.2em] ${currentSize.text} text-[#F5EFE6] uppercase font-heading`}
          >
            SM4LYF
          </span>
          {size !== 'xs' && size !== 'sm' && (
            <span className="text-[9px] uppercase tracking-[0.32em] text-[#C9A24B]/90 font-bold -mt-0.5">
              LEGACY ARCHIVE
            </span>
          )}
        </div>
      )}
    </div>
  );
};

