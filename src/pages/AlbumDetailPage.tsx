import React, { useState, useEffect } from 'react';
import { Album } from '../types';
import { getAlbumBySlug } from '../services/firestore';
import { BrandImage } from '../components/common/BrandImage';
import { 
  ArrowLeft, 
  Disc3, 
  Calendar, 
  Music, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  ArrowRight,
  Award,
  Play,
  Camera
} from 'lucide-react';
import { AudioWaveform } from '../components/common/AudioWaveform';

interface AlbumDetailPageProps {
  slug: string;
  onBack: () => void;
  onSelectSong: (slug: string) => void;
}

export const AlbumDetailPage: React.FC<AlbumDetailPageProps> = ({ slug, onBack, onSelectSong }) => {
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const found = await getAlbumBySlug(slug);
        setAlbum(found);
      } catch (err) {
        console.error('Error fetching album details:', err);
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
        <p className="text-sm text-[#A89F91]">Loading Album Archive...</p>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center space-y-4">
        <Disc3 className="w-12 h-12 text-[#D4820A]/40 mx-auto" />
        <h2 className="text-2xl font-bold text-white font-heading">Album Not Found</h2>
        <p className="text-sm text-[#A89F91]">The requested album record could not be found.</p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-lg bg-[#1A1512] hover:bg-[#261E18] text-[#F2A93C] border border-[#332720] text-xs font-bold uppercase tracking-wider"
        >
          Return to Discography
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-12">
      
      {/* Back Button */}
      <button
        id="album-detail-back-btn"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A89F91] hover:text-[#F2A93C] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Music Archive</span>
      </button>

      {/* Album Hero Block */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start bg-[#14100E] border border-[#332720] rounded-2xl p-6 sm:p-8 shadow-2xl">
        
        {/* Cover Art */}
        <div className="md:col-span-5 relative aspect-square rounded-xl bg-black overflow-hidden border border-[#332720]">
          <BrandImage
            src={album.coverArtUrl}
            alt={album.title}
            title={album.title}
            credit={album.credit}
            source={album.source}
            aspectRatio="square"
            category="Album Cover"
            showCreditBadge={true}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-xs font-bold text-[#F2A93C] border border-[#332720] pointer-events-none">
            {album.releaseYear}
          </div>
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#D4820A] text-xs font-bold text-black uppercase pointer-events-none">
            {album.totalTracks} Tracks
          </div>
        </div>

        {/* Album Metadata */}
        <div className="md:col-span-7 space-y-5">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A24B]">
              {album.era}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white font-heading leading-tight">
              {album.title}
            </h1>
            <p className="text-sm text-[#A89F91]">
              Shatta Wale • {album.genre}
            </p>
          </div>

          <p className="text-sm text-[#F5EFE6]/90 leading-relaxed">
            {album.description}
          </p>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {album.label && (
              <div className="p-2.5 rounded bg-[#1A1512] border border-[#332720]">
                <span className="text-[10px] uppercase tracking-wider text-[#A89F91] block">Label</span>
                <span className="text-xs font-bold text-white truncate block">{album.label}</span>
              </div>
            )}
            {album.executiveProducer && (
              <div className="p-2.5 rounded bg-[#1A1512] border border-[#332720]">
                <span className="text-[10px] uppercase tracking-wider text-[#A89F91] block">Exec Producer</span>
                <span className="text-xs font-bold text-white truncate block">{album.executiveProducer}</span>
              </div>
            )}
            {album.releaseDate && (
              <div className="p-2.5 rounded bg-[#1A1512] border border-[#332720]">
                <span className="text-[10px] uppercase tracking-wider text-[#A89F91] block">Release Date</span>
                <span className="text-xs font-bold text-white truncate block">{album.releaseDate}</span>
              </div>
            )}
          </div>

          {/* Streaming Links */}
          <div className="pt-3 border-t border-[#332720] space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#C9A24B] font-bold block">
              Official Album Streaming Outlets
            </span>
            <div className="flex flex-wrap gap-2.5">
              {album.externalLinks.spotify && (
                <a
                  href={album.externalLinks.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-[#1DB954]/20 hover:bg-[#1DB954] text-white hover:text-black border border-[#1DB954]/40 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <span>Spotify</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}
              {album.externalLinks.appleMusic && (
                <a
                  href={album.externalLinks.appleMusic}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-[#FA243C]/20 hover:bg-[#FA243C] text-white border border-[#FA243C]/40 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <span>Apple Music</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}
              {album.externalLinks.youtube && (
                <a
                  href={album.externalLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-[#CC0000]/20 hover:bg-[#CC0000] text-white border border-[#CC0000]/40 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <span>YouTube</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}
              {album.externalLinks.boomplay && (
                <a
                  href={album.externalLinks.boomplay}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-[#00B4D8]/20 hover:bg-[#00B4D8] text-white border border-[#00B4D8]/40 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <span>Boomplay</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Chart Milestones & Tracklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left: Tracklist */}
        <div className="md:col-span-7 space-y-4">
          <h2 className="text-xl font-bold text-white font-heading flex items-center justify-between">
            <span>Archival Tracklist ({album.tracklist?.length || album.totalTracks})</span>
            <AudioWaveform active={true} />
          </h2>

          <div className="bg-[#1A1512] border border-[#332720] rounded-xl divide-y divide-[#332720]/60 overflow-hidden shadow-lg">
            {album.tracklist && album.tracklist.length > 0 ? (
              album.tracklist.map((track) => (
                <div
                  key={track.trackNumber}
                  onClick={() => track.songSlug && onSelectSong(track.songSlug)}
                  className={`p-4 flex items-center justify-between transition-colors ${
                    track.songSlug
                      ? 'cursor-pointer hover:bg-[#261E18] group'
                      : 'hover:bg-[#1A1512]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="w-6 text-center text-xs font-bold text-[#A89F91]">
                      {track.trackNumber.toString().padStart(2, '0')}
                    </span>
                    <div>
                      <h4 className={`text-sm font-bold truncate font-heading ${
                        track.songSlug ? 'text-white group-hover:text-[#F2A93C]' : 'text-white'
                      }`}>
                        {track.title}
                      </h4>
                      {track.featuredArtists && (
                        <p className="text-xs text-[#A89F91]">
                          ft. {track.featuredArtists.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {track.duration && (
                      <span className="text-xs text-[#A89F91]">{track.duration}</span>
                    )}
                    {track.songSlug && (
                      <span className="text-xs text-[#C9A24B] group-hover:text-[#F2A93C] font-semibold hidden sm:inline">
                        Song Details →
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-[#A89F91]">
                Full tracklist catalog records currently loaded.
              </div>
            )}
          </div>
        </div>

        {/* Right: Chart Milestones & Sourcing */}
        <div className="md:col-span-5 space-y-6">
          {album.chartMilestones && album.chartMilestones.length > 0 && (
            <div className="p-6 rounded-xl bg-[#14100E] border border-[#332720] space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#C9A24B] flex items-center gap-2">
                <Award className="w-4 h-4 text-[#D4820A]" />
                <span>Historic Milestones</span>
              </h3>
              <ul className="space-y-2 text-xs text-[#F5EFE6]/90">
                {album.chartMilestones.map((m, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#D4820A] mt-0.5 font-bold">★</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {album.source && (
            <div className="p-4 rounded-xl bg-[#0D0A08] border border-[#332720] text-xs text-[#A89F91] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#C9A24B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Archival Sourcing Record:</strong>
                <span>{album.source}</span>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
