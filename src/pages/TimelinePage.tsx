import React, { useState, useEffect, useMemo } from 'react';
import { TimelineEvent, MusicEra } from '../types';
import { getTimeline } from '../services/firestore';
import { BrandImage } from '../components/common/BrandImage';
import { 
  Clock, 
  Sparkles, 
  Calendar, 
  ExternalLink, 
  ShieldCheck, 
  Music, 
  Disc3, 
  Award, 
  ChevronRight, 
  Layers,
  ArrowRight,
  Camera
} from 'lucide-react';
import { AudioWaveform } from '../components/common/AudioWaveform';

interface TimelinePageProps {
  onSelectSong: (slug: string) => void;
  onSelectAlbum: (slug: string) => void;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({ onSelectSong, onSelectAlbum }) => {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const events = await getTimeline(true);
        setTimeline(events);
      } catch (e) {
        console.error('Error fetching timeline events:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const eras = [
    'Bandana Era (2000-2012)',
    'The Rebirth & Rise (2013-2015)',
    'After The Storm (2016-2017)',
    'Reign & Dominance (2018)',
    'The Gift & International (2019-2021)',
    'Global Icon & GOG/SAFA (2022-Present)'
  ];

  const categories = [
    'Career Breakthrough',
    'Album Release',
    'Award',
    'Concert',
    'International Landmark',
    'Cultural Impact'
  ];

  const filteredTimeline = useMemo(() => {
    return timeline.filter(event => {
      const matchEra = selectedEra === 'all' || event.era === selectedEra;
      const matchCat = selectedCategory === 'all' || event.category === selectedCategory;
      return matchEra && matchCat;
    });
  }, [timeline, selectedEra, selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 space-y-12">
      
      {/* Header */}
      <div className="space-y-4 text-center md:text-left border-b border-[#332720] pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1512] border border-[#D4820A]/40 text-xs font-semibold uppercase tracking-wider text-[#F2A93C]">
          <Clock className="w-3.5 h-3.5 text-[#D4820A]" />
          <span>Historical Career Chronology (2004–2026)</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black text-white font-heading">
          The Living Timeline
        </h1>
        
        <p className="text-sm sm:text-base text-[#A89F91] max-w-3xl leading-relaxed">
          An authenticated chronological documentation tracing the evolution from Bandana to Shatta Wale, 
          the foundation of the Shatta Movement empire, sold-out arena records, and global landmark partnerships.
        </p>

        {/* Filters */}
        <div className="pt-4 flex flex-wrap gap-3 items-center">
          <div className="w-full sm:w-auto">
            <select
              value={selectedEra}
              onChange={(e) => setSelectedEra(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-lg bg-[#1A1512] border border-[#332720] focus:border-[#D4820A] text-xs font-semibold text-[#F5EFE6] outline-none"
            >
              <option value="all">All Eras (2000–Present)</option>
              {eras.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-lg bg-[#1A1512] border border-[#332720] focus:border-[#D4820A] text-xs font-semibold text-[#F5EFE6] outline-none"
            >
              <option value="all">All Event Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {(selectedEra !== 'all' || selectedCategory !== 'all') && (
            <button
              onClick={() => { setSelectedEra('all'); setSelectedCategory('all'); }}
              className="px-3 py-2 text-xs font-semibold text-[#F2A93C] hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Interactive Timeline Body */}
      <div className="relative border-l-2 border-[#332720] ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
        {filteredTimeline.map((item, index) => (
          <div
            key={item.id}
            className="relative group animate-fade-in"
          >
            {/* Timeline Dot Indicator */}
            <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-[#1A1512] border-2 border-[#D4820A] group-hover:border-[#F2A93C] group-hover:scale-110 transition-all flex items-center justify-center shadow-lg">
              <div className="w-2 h-2 rounded-full bg-[#F2A93C]" />
            </div>

            {/* Event Card */}
            <div className="rounded-2xl bg-[#14100E] border border-[#332720] hover:border-[#D4820A]/60 p-6 sm:p-8 transition-all hover:shadow-2xl space-y-5">
              
              {/* Card Header Meta */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#332720]/60 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-[#F2A93C] font-heading">
                    {item.year}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-[#1A1512] text-xs font-bold text-[#C9A24B] border border-[#332720]">
                    {item.category}
                  </span>
                </div>

                <span className="text-xs text-[#A89F91] uppercase tracking-wider font-semibold">
                  {item.era.split('(')[0]}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-white font-heading leading-snug">
                {item.title}
              </h3>

              {/* Media Preview if attached */}
              {item.imageUrl && (
                <div className="relative aspect-video sm:aspect-21/9 rounded-xl overflow-hidden bg-black border border-[#332720]">
                  <BrandImage
                    src={item.imageUrl}
                    alt={item.title}
                    title={item.title}
                    credit={item.credit}
                    source={item.source}
                    category={item.category || "Historical Document"}
                    aspectRatio="video"
                    showCreditBadge={true}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Summary & Description */}
              <div className="space-y-3">
                <p className="text-sm sm:text-base text-[#F5EFE6] leading-relaxed font-medium">
                  {item.summary}
                </p>
                <p className="text-xs sm:text-sm text-[#A89F91] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Linked Discography or Album */}
              {(item.linkedSongSlug || item.linkedAlbumSlug) && (
                <div className="pt-2 flex flex-wrap gap-3">
                  {item.linkedSongSlug && (
                    <button
                      onClick={() => onSelectSong(item.linkedSongSlug!)}
                      className="px-3.5 py-2 rounded-lg bg-[#1A1512] hover:bg-[#261E18] border border-[#332720] text-xs font-bold text-[#F2A93C] flex items-center gap-1.5 transition-colors"
                    >
                      <Music className="w-3.5 h-3.5 text-[#D4820A]" />
                      <span>Explore Linked Song: {item.linkedSongTitle || 'Track Record'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {item.linkedAlbumSlug && (
                    <button
                      onClick={() => onSelectAlbum(item.linkedAlbumSlug!)}
                      className="px-3.5 py-2 rounded-lg bg-[#1A1512] hover:bg-[#261E18] border border-[#332720] text-xs font-bold text-[#C9A24B] flex items-center gap-1.5 transition-colors"
                    >
                      <Disc3 className="w-3.5 h-3.5 text-[#D4820A]" />
                      <span>Explore Linked Album: {item.linkedAlbumTitle || 'Album Record'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* Sourcing Verification */}
              {item.source && (
                <div className="pt-3 border-t border-[#332720]/60 flex items-start gap-2 text-[11px] text-[#A89F91]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C9A24B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Historical Reference:</strong> {item.source}
                  </div>
                </div>
              )}

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
