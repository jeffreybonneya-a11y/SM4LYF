import React, { useState, useEffect } from 'react';
import { Song } from '../types';
import { getSongBySlug, getSongs } from '../services/firestore';
import { BrandImage } from '../components/common/BrandImage';
import { 
  ArrowLeft, 
  ExternalLink, 
  Music, 
  Calendar, 
  Disc3, 
  Layers, 
  Sparkles, 
  Clock, 
  Activity, 
  Key, 
  User, 
  ShieldCheck, 
  Quote, 
  ArrowRight,
  Youtube
} from 'lucide-react';
import { AudioWaveform } from '../components/common/AudioWaveform';

interface SongDetailPageProps {
  slug: string;
  onBack: () => void;
  onSelectSong: (slug: string) => void;
  onSelectAlbum: (slug: string) => void;
}

export const SongDetailPage: React.FC<SongDetailPageProps> = ({ 
  slug, 
  onBack, 
  onSelectSong, 
  onSelectAlbum 
}) => {
  const [song, setSong] = useState<Song | null>(null);
  const [relatedSongs, setRelatedSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const found = await getSongBySlug(slug);
        setSong(found);
        if (found) {
          const all = await getSongs(true);
          const related = all
            .filter(s => s.id !== found.id && (s.era === found.era || s.albumTitle === found.albumTitle))
            .slice(0, 3);
          setRelatedSongs(related);
        }
      } catch (e) {
        console.error('Error fetching song details:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center">
        <AudioWaveform active={true} className="justify-center mb-4" />
        <p className="text-sm text-[#A89F91]">Loading Archival Record...</p>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center space-y-4">
        <Music className="w-12 h-12 text-[#D4820A]/40 mx-auto" />
        <h2 className="text-2xl font-bold text-white font-heading">Song Record Not Found</h2>
        <p className="text-sm text-[#A89F91]">The requested archival track could not be located.</p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-lg bg-[#1A1512] hover:bg-[#261E18] text-[#F2A93C] border border-[#332720] text-xs font-bold uppercase tracking-wider"
        >
          Return to Discography
        </button>
      </div>
    );
  }

  const hasLinks = Object.values(song.externalLinks || {}).some(Boolean);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-12">
      
      {/* Back Navigation */}
      <button
        id="song-detail-back-btn"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A89F91] hover:text-[#F2A93C] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Music Archive</span>
      </button>

      {/* Main Hero Header */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start bg-[#14100E] border border-[#332720] rounded-2xl p-6 sm:p-8 shadow-2xl">
        
        {/* Cover Art Box */}
        <div className="md:col-span-5 relative aspect-square rounded-xl bg-black overflow-hidden border border-[#332720]">
          <BrandImage
            src={song.coverArtUrl}
            alt={song.title}
            title={song.title}
            credit={song.credit}
            source={song.source}
            aspectRatio="square"
            category="Song Artwork"
            showCreditBadge={true}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
            <span className="px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-xs font-bold text-[#F2A93C] border border-[#332720]">
              {song.releaseYear}
            </span>
            <span className="px-2.5 py-1 rounded bg-[#D4820A] text-xs font-bold text-black uppercase">
              {song.releaseType}
            </span>
          </div>
        </div>

        {/* Core Metadata */}
        <div className="md:col-span-7 space-y-5">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#C9A24B] uppercase tracking-widest">
                {song.era}
              </span>
              {song.featured && (
                <span className="px-2 py-0.5 rounded bg-[#C9A24B]/20 text-[#C9A24B] text-[10px] font-bold uppercase border border-[#C9A24B]/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Milestone
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white font-heading leading-tight">
              {song.title}
            </h1>

            <p className="text-base text-[#F2A93C] font-medium">
              {song.artist}
            </p>
          </div>

          {/* Album connection */}
          {song.albumTitle && (
            <div className="p-3 rounded-lg bg-[#1A1512] border border-[#332720] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Disc3 className="w-4 h-4 text-[#D4820A]" />
                <span>Featured on Album: <strong className="text-white">{song.albumTitle}</strong></span>
              </div>
              {song.albumSlug && (
                <button
                  onClick={() => onSelectAlbum(song.albumSlug!)}
                  className="text-[#F2A93C] hover:underline font-bold"
                >
                  View Album →
                </button>
              )}
            </div>
          )}

          {/* Quick Technical Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {song.producer && (
              <div className="p-2.5 rounded bg-[#1A1512] border border-[#332720]">
                <span className="text-[10px] uppercase tracking-wider text-[#A89F91] block">Production</span>
                <span className="text-xs font-bold text-white truncate block">{song.producer}</span>
              </div>
            )}
            {song.genre && (
              <div className="p-2.5 rounded bg-[#1A1512] border border-[#332720]">
                <span className="text-[10px] uppercase tracking-wider text-[#A89F91] block">Genre</span>
                <span className="text-xs font-bold text-white truncate block">{song.genre}</span>
              </div>
            )}
            {song.duration && (
              <div className="p-2.5 rounded bg-[#1A1512] border border-[#332720]">
                <span className="text-[10px] uppercase tracking-wider text-[#A89F91] block">Duration</span>
                <span className="text-xs font-bold text-white truncate block">{song.duration}</span>
              </div>
            )}
            {song.bpm && (
              <div className="p-2.5 rounded bg-[#1A1512] border border-[#332720]">
                <span className="text-[10px] uppercase tracking-wider text-[#A89F91] block">Tempo</span>
                <span className="text-xs font-bold text-white truncate block">{song.bpm} BPM</span>
              </div>
            )}
            {song.key && (
              <div className="p-2.5 rounded bg-[#1A1512] border border-[#332720]">
                <span className="text-[10px] uppercase tracking-wider text-[#A89F91] block">Musical Key</span>
                <span className="text-xs font-bold text-white truncate block">{song.key}</span>
              </div>
            )}
            {song.releaseDate && (
              <div className="p-2.5 rounded bg-[#1A1512] border border-[#332720]">
                <span className="text-[10px] uppercase tracking-wider text-[#A89F91] block">Release Date</span>
                <span className="text-xs font-bold text-white truncate block">{song.releaseDate}</span>
              </div>
            )}
          </div>

          {/* Outbound Streaming / Listen Links */}
          <div className="pt-3 border-t border-[#332720] space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#C9A24B] font-bold block">
              Official Streaming Outlets
            </span>
            
            {hasLinks ? (
              <div className="flex flex-wrap gap-2.5">
                {song.externalLinks.youtube && (
                  <a
                    href={song.externalLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-lg bg-[#CC0000]/20 hover:bg-[#CC0000] text-white border border-[#CC0000]/40 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                    <span>YouTube</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                )}

                {song.externalLinks.spotify && (
                  <a
                    href={song.externalLinks.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-lg bg-[#1DB954]/20 hover:bg-[#1DB954] text-white hover:text-black border border-[#1DB954]/40 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <span>Spotify</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                )}

                {song.externalLinks.appleMusic && (
                  <a
                    href={song.externalLinks.appleMusic}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-lg bg-[#FA243C]/20 hover:bg-[#FA243C] text-white border border-[#FA243C]/40 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <span>Apple Music</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                )}

                {song.externalLinks.audiomack && (
                  <a
                    href={song.externalLinks.audiomack}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-lg bg-[#FFA200]/20 hover:bg-[#FFA200] text-white hover:text-black border border-[#FFA200]/40 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <span>Audiomack</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                )}

                {song.externalLinks.boomplay && (
                  <a
                    href={song.externalLinks.boomplay}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-lg bg-[#00B4D8]/20 hover:bg-[#00B4D8] text-white border border-[#00B4D8]/40 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <span>Boomplay</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#A89F91] italic">
                Outbound streaming links being verified in archival directory.
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Narrative & Archival Notes */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Description & Story */}
        <div className="md:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-xl bg-[#1A1512] border border-[#332720] space-y-4">
            <h3 className="text-lg font-bold text-white font-heading">
              Archival Context & Background
            </h3>
            <p className="text-sm text-[#F5EFE6]/90 leading-relaxed">
              {song.description}
            </p>

            {song.storyBehindTrack && (
              <div className="pt-4 border-t border-[#332720] space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#F2A93C]">
                  Creation & Cultural Impact
                </h4>
                <p className="text-xs text-[#A89F91] leading-relaxed">
                  {song.storyBehindTrack}
                </p>
              </div>
            )}
          </div>

          {/* Notable Lyrics Box */}
          {song.notableLyricsSnippet && (
            <div className="p-6 rounded-xl bg-[#14100E] border border-[#332720] relative">
              <Quote className="w-8 h-8 text-[#D4820A]/20 absolute top-4 right-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9A24B] block mb-2">
                Notable Lyrical Excerpt
              </span>
              <p className="text-sm font-serif italic text-white leading-relaxed">
                "{song.notableLyricsSnippet}"
              </p>
            </div>
          )}

          {/* Factual Record Sourcing */}
          {song.source && (
            <div className="p-4 rounded-xl bg-[#0D0A08] border border-[#332720] text-xs text-[#A89F91] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#C9A24B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Archival Verification Citation:</strong>
                <span>{song.source}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Related Works */}
        <div className="md:col-span-5 space-y-4">
          <h3 className="text-base font-bold text-white font-heading flex items-center justify-between">
            <span>Related Era Tracks</span>
            <span className="text-xs text-[#C9A24B]">{song.era.split('(')[0]}</span>
          </h3>

          <div className="space-y-3">
            {relatedSongs.map(rSong => (
              <div
                key={rSong.id}
                onClick={() => onSelectSong(rSong.slug)}
                className="group cursor-pointer p-3 rounded-xl bg-[#1A1512] hover:bg-[#231B15] border border-[#332720] hover:border-[#D4820A]/60 flex items-center gap-3.5 transition-all"
              >
                <div className="w-12 h-12 rounded overflow-hidden shrink-0 border border-[#332720]">
                  <BrandImage
                    src={rSong.coverArtUrl}
                    alt={rSong.title}
                    title={rSong.title}
                    credit={rSong.credit}
                    aspectRatio="square"
                    category="Track"
                    showCreditBadge={false}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white group-hover:text-[#F2A93C] font-heading truncate">
                    {rSong.title}
                  </h4>
                  <p className="text-xs text-[#A89F91] truncate">
                    {rSong.releaseYear} • {rSong.genre}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#A89F91] group-hover:text-[#F2A93C] transition-colors shrink-0" />
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
