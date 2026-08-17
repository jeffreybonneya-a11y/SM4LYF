import React from 'react';
import { SM4LYFLogo } from './SM4LYFLogo';
import { ExternalLink, ShieldCheck, Music, Disc3, Radio, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer id="main-footer" className="bg-[#0D0A08] border-t border-[#332720] text-[#A89F91] pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#332720]/70">
          
          {/* Brand & Logo Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-4">
              <SM4LYFLogo size="md" />
              <div>
                <h3 className="text-lg font-black text-white tracking-wider font-heading">
                  SM4LYF LEGACY
                </h3>
                <p className="text-xs text-[#C9A24B] uppercase tracking-widest font-semibold">
                  Digital Archive & Cultural Museum
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#A89F91] leading-relaxed max-w-md pt-2">
              Preserving and documenting the musical milestones, historical discography, 
              concert records, and pan-African cultural impact of Charles Nii Armah Mensah Jr. (Shatta Wale).
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-[#1A1512] text-[#C9A24B] border border-[#332720]">
                Street → Music → Energy → King → Legacy
              </span>
            </div>
          </div>

          {/* Archive Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5EFE6] font-heading">
              Archival Collections
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/music')}
                  className="hover:text-[#F2A93C] transition-colors flex items-center gap-1.5"
                >
                  <span>Discography & Singles</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/timeline')}
                  className="hover:text-[#F2A93C] transition-colors flex items-center gap-1.5"
                >
                  <span>Career Timeline (2004–Present)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/achievements')}
                  className="hover:text-[#F2A93C] transition-colors flex items-center gap-1.5"
                >
                  <span>Awards & Chart Milestones</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-[#F2A93C] transition-colors flex items-center gap-1.5"
                >
                  <span>Story & Cultural Context</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Official External Portals */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5EFE6] font-heading">
              Official Artist Channels
            </h4>
            <p className="text-xs text-[#A89F91]">
              Listen and support the artist directly on verified streaming services:
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="https://www.youtube.com/@shattawalenima"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded bg-[#1A1512] hover:bg-[#261E18] text-[#F5EFE6] hover:text-[#F2A93C] border border-[#332720] text-xs flex items-center justify-between transition-colors"
              >
                <span>YouTube</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#C9A24B]" />
              </a>
              <a
                href="https://open.spotify.com/artist/1eXZlHfg6h1P5iVv5Gg3iC"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded bg-[#1A1512] hover:bg-[#261E18] text-[#F5EFE6] hover:text-[#F2A93C] border border-[#332720] text-xs flex items-center justify-between transition-colors"
              >
                <span>Spotify</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#C9A24B]" />
              </a>
              <a
                href="https://music.apple.com/artist/shatta-wale/652033008"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded bg-[#1A1512] hover:bg-[#261E18] text-[#F5EFE6] hover:text-[#F2A93C] border border-[#332720] text-xs flex items-center justify-between transition-colors"
              >
                <span>Apple Music</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#C9A24B]" />
              </a>
              <a
                href="https://audiomack.com/shattawale"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded bg-[#1A1512] hover:bg-[#261E18] text-[#F5EFE6] hover:text-[#F2A93C] border border-[#332720] text-xs flex items-center justify-between transition-colors"
              >
                <span>Audiomack</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#C9A24B]" />
              </a>
            </div>
          </div>
        </div>

        {/* Mandatory Independent Legal Disclaimer */}
        <div className="pt-8 pb-4 space-y-4">
          <div className="p-4 rounded-xl bg-[#14100E] border border-[#332720] text-xs text-[#A89F91] leading-relaxed">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#C9A24B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#F5EFE6] block mb-1">Archival Transparency & Copyright Notice:</strong>
                <p>
                  SM4LYF Legacy is an independent, fan-created digital archive documenting the music and career of Shatta Wale. 
                  It is not an official Shatta Wale, Shatta Movement, or SM4LYF property, and is not affiliated with or endorsed by 
                  Shatta Wale or his management unless explicitly stated.
                </p>
                <p className="mt-1 text-[11px] text-[#A89F91]/80">
                  No copyrighted audio files are hosted, mirrored, or downloaded on this application. All discography records provide metadata and direct outbound links to verified streaming and retailer platforms.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A89F91] pt-2">
            <p>© {new Date().getFullYear()} SM4LYF Legacy. Dedicated to the preservation of African Dancehall heritage.</p>
            <div className="flex items-center gap-4">
              <button onClick={() => onNavigate('/about')} className="hover:text-[#F2A93C] transition-colors">
                Archive Methodology
              </button>
              <span>•</span>
              <button onClick={() => onNavigate('/admin/login')} className="hover:text-[#F2A93C] transition-colors">
                Curator Portal
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
