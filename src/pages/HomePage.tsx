import React, { useState, useEffect } from 'react';
import { SM4LYFLogo } from '../components/common/SM4LYFLogo';
import { AudioWaveform } from '../components/common/AudioWaveform';
import { BrandImage } from '../components/common/BrandImage';
import { 
  Music, 
  Disc3, 
  Clock, 
  Award, 
  ArrowRight, 
  Play, 
  Sparkles, 
  Flame,
  Quote,
  Trophy,
  Star
} from 'lucide-react';
import { Song, Album, TimelineEvent, Achievement, SiteSettings } from '../types';
import { 
  getSongs, 
  getAlbums, 
  getTimeline, 
  getAchievements, 
  getSiteSettings 
} from '../services/firestore';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onSelectSong: (slug: string) => void;
  onSelectAlbum: (slug: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectSong, onSelectAlbum }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [featuredSongs, setFeaturedSongs] = useState<Song[]>([]);
  const [featuredAlbums, setFeaturedAlbums] = useState<Album[]>([]);
  const [timelinePreview, setTimelinePreview] = useState<TimelineEvent[]>([]);
  const [achievementsPreview, setAchievementsPreview] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [sets, songs, albums, tl, achs] = await Promise.all([
          getSiteSettings(),
          getSongs(true),
          getAlbums(true),
          getTimeline(true),
          getAchievements(true)
        ]);

        setSettings(sets);
        setFeaturedSongs(songs.filter(s => s.featured).slice(0, 6));
        setFeaturedAlbums(albums.slice(0, 4));
        setTimelinePreview(tl.filter(t => t.featured).slice(0, 4));
        setAchievementsPreview(achs.filter(a => a.featured).slice(0, 4));
      } catch (e) {
        console.error('Failed to load homepage data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        
        {/* Sourced Hero Background Image if configured */}
        {settings?.heroBackgroundImageUrl && (
          <div className="absolute inset-0 z-0 pointer-events-none opacity-25">
            <img
              src={settings.heroBackgroundImageUrl}
              alt="Shatta Wale Archival Hero"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/60" />
            {settings.heroBackgroundCredit && (
              <div className="absolute bottom-4 right-4 z-10 text-[10px] text-[#A89F91] bg-black/70 px-2 py-1 rounded border border-[#332720]/60 pointer-events-auto">
                Photo: {settings.heroBackgroundCredit}
              </div>
            )}
          </div>
        )}

        {/* Ambient Stage Lights & Gold Radiance */}
        <div className="absolute inset-0 bg-radial-at-c from-[#24170E]/70 via-[#0A0A0A] to-[#0A0A0A] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#D4820A]/20 to-[#F2A93C]/10 blur-[130px] rounded-full pointer-events-none" />
        
        {/* Subtle Vinyl Ring Pattern in Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-[#332720]/20 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-[#332720]/10 rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-7 z-10">
          
          {/* Authentic SM4LYF Emblem */}
          <div className="inline-flex flex-col items-center animate-fade-in">
            <SM4LYFLogo size="hero" showText={false} animated />
          </div>

          {/* Project Identity Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1512] border border-[#D4820A]/40 text-xs font-semibold tracking-wider text-[#F2A93C] uppercase shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#D4820A]" />
            <span>Independent Fan-Curated Digital Archive</span>
          </div>

          {/* Main Hero Project Headline */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white font-heading uppercase leading-[1.05]">
              {settings?.heroHeadline || "SM4LYF LEGACY"}
            </h1>
            <p className="text-lg sm:text-2xl md:text-3xl font-extrabold text-[#F2A93C] font-heading tracking-wide uppercase">
              A DIGITAL ARCHIVE OF THE DANCEHALL KING'S LEGACY
            </p>
          </div>

          {/* Contextual description */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#F5EFE6]/80 font-normal leading-relaxed">
            {settings?.heroSubheadline || "Preserving the monumental discography, historical milestones, global collaborations, and cultural movement of Ghanaian Dancehall icon Shatta Wale."}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              id="hero-explore-music-btn"
              onClick={() => onNavigate('/music')}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black font-extrabold text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-xl hover:brightness-110 active:scale-95 transition-all"
            >
              <Music className="w-4 h-4" />
              <span>Explore Discography</span>
            </button>

            <button
              id="hero-view-timeline-btn"
              onClick={() => onNavigate('/timeline')}
              className="px-7 py-3.5 rounded-xl bg-[#1A1512] text-[#F5EFE6] hover:text-[#F2A93C] border border-[#332720] hover:border-[#D4820A]/60 font-bold text-sm uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-md"
            >
              <Clock className="w-4 h-4 text-[#C9A24B]" />
              <span>Career Timeline</span>
            </button>
          </div>

          {/* Emotional Arc Indicator */}
          <div className="pt-8 flex items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-[#A89F91] tracking-widest uppercase flex-wrap">
            <span>Street</span>
            <span className="text-[#D4820A]">→</span>
            <span>Music</span>
            <span className="text-[#D4820A]">→</span>
            <span>Energy</span>
            <span className="text-[#D4820A]">→</span>
            <span className="text-white font-bold">King</span>
            <span className="text-[#D4820A]">→</span>
            <span className="text-[#F2A93C] font-bold">Legacy</span>
          </div>

        </div>
      </section>

      {/* 2. INTRO STATEMENT & CURATORIAL QUOTE */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-[#14100E] border border-[#332720] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4820A]/5 blur-3xl rounded-full" />
          <Quote className="w-12 h-12 text-[#D4820A]/20 absolute top-6 left-6" />
          
          <div className="relative z-10 space-y-4 max-w-3xl mx-auto text-center">
            <p className="text-lg sm:text-2xl font-light text-[#F5EFE6] leading-relaxed italic font-serif">
              "{settings?.introQuote || "Dancehall in Africa cannot be spoken about without acknowledging the voice of the streets that became the voice of the continent."}"
            </p>
            <div className="pt-2">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C9A24B] font-bold block">
                — {settings?.introAuthor || "SM4LYF Archival Project"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LEGACY STATS PANEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="p-6 rounded-xl bg-[#1A1512] border border-[#332720] flex flex-col items-center text-center space-y-2">
            <Music className="w-6 h-6 text-[#D4820A]" />
            <span className="text-3xl sm:text-4xl font-black text-white font-heading">
              {settings?.stats.totalSongsArchived || '1000'}+
            </span>
            <span className="text-xs uppercase tracking-wider text-[#A89F91] font-semibold">
              Tracks Released
            </span>
          </div>

          <div className="p-6 rounded-xl bg-[#1A1512] border border-[#332720] flex flex-col items-center text-center space-y-2">
            <Clock className="w-6 h-6 text-[#C9A24B]" />
            <span className="text-3xl sm:text-4xl font-black text-white font-heading">
              {settings?.stats.careerYears || '22'}+
            </span>
            <span className="text-xs uppercase tracking-wider text-[#A89F91] font-semibold">
              Years in Music (2004–Present)
            </span>
          </div>

          <div className="p-6 rounded-xl bg-[#1A1512] border border-[#332720] flex flex-col items-center text-center space-y-2">
            <Award className="w-6 h-6 text-[#F2A93C]" />
            <span className="text-3xl sm:text-4xl font-black text-white font-heading">
              {settings?.stats.majorAwardsWon || '118'}+
            </span>
            <span className="text-xs uppercase tracking-wider text-[#A89F91] font-semibold">
              Awards & Citations
            </span>
          </div>

          <div className="p-6 rounded-xl bg-[#1A1512] border border-[#332720] flex flex-col items-center text-center space-y-2">
            <Flame className="w-6 h-6 text-[#D4820A]" />
            <span className="text-3xl sm:text-4xl font-black text-white font-heading">
              {settings?.stats.historicConcertAttendance || '20,000+'}
            </span>
            <span className="text-xs uppercase tracking-wider text-[#A89F91] font-semibold">
              Record Arena Crowds
            </span>
          </div>

        </div>
      </section>

      {/* 4. FEATURED MUSIC & DISCOGRAPHY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#332720] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4820A]">
              <AudioWaveform active={true} />
              <span>Pioneering Anthems</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-heading mt-1">
              Featured Discography
            </h2>
          </div>

          <button
            onClick={() => onNavigate('/music')}
            className="text-sm font-semibold text-[#F2A93C] hover:text-white flex items-center gap-1.5 transition-colors self-start md:self-auto"
          >
            <span>View Full Archive ({featuredSongs.length + 10}+ Tracks)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Songs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSongs.map((song) => (
            <div
              key={song.id}
              onClick={() => onSelectSong(song.slug)}
              className="group cursor-pointer rounded-xl bg-[#1A1512] border border-[#332720] hover:border-[#D4820A]/60 overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-2xl flex flex-col"
            >
              {/* Cover Art Box */}
              <div className="relative aspect-video sm:aspect-square bg-black overflow-hidden">
                <BrandImage
                  src={song.coverArtUrl}
                  alt={song.title}
                  title={song.title}
                  credit={song.credit}
                  source={song.source}
                  aspectRatio="square"
                  category="Song Cover"
                  showCreditBadge={false}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1512] via-transparent to-transparent opacity-80 pointer-events-none" />
                
                {/* Year & Type Badges */}
                <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
                  <span className="px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-[11px] font-bold text-[#F2A93C] border border-[#332720]">
                    {song.releaseYear}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#D4820A]/90 text-[11px] font-bold text-black uppercase">
                    {song.releaseType}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 p-2 rounded-full bg-[#D4820A] text-black shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <Play className="w-4 h-4 fill-current" />
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#F2A93C] transition-colors font-heading line-clamp-1">
                    {song.title}
                  </h3>
                  <p className="text-xs text-[#A89F91] line-clamp-1 mt-0.5">
                    {song.artist}
                  </p>
                </div>

                <p className="text-xs text-[#F5EFE6]/70 line-clamp-2 leading-relaxed">
                  {song.description}
                </p>

                <div className="pt-3 border-t border-[#332720]/60 flex items-center justify-between text-xs text-[#C9A24B]">
                  <span>{song.genre}</span>
                  <span className="font-semibold group-hover:underline flex items-center gap-1">
                    View Archival Specs <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. LANDMARK ALBUMS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#332720] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A24B]">
              Discographic Masterpieces
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-heading mt-1">
              Studio Albums & Landmark Projects
            </h2>
          </div>

          <button
            onClick={() => onNavigate('/music')}
            className="text-sm font-semibold text-[#F2A93C] hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span>View All Albums</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredAlbums.map((album) => (
            <div
              key={album.id}
              onClick={() => onSelectAlbum(album.slug)}
              className="group cursor-pointer rounded-xl bg-[#1A1512] border border-[#332720] hover:border-[#D4820A] p-5 transition-all hover:-translate-y-1 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="relative aspect-square rounded-lg bg-black overflow-hidden border border-[#332720]">
                  <BrandImage
                    src={album.coverArtUrl}
                    alt={album.title}
                    title={album.title}
                    credit={album.credit}
                    source={album.source}
                    aspectRatio="square"
                    category="Album"
                    showCreditBadge={false}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-[#F2A93C] pointer-events-none">
                    {album.totalTracks} Tracks
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-[#D4820A] font-bold uppercase tracking-wider block">
                    {album.releaseYear} • {album.genre}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#F2A93C] transition-colors font-heading">
                    {album.title}
                  </h3>
                </div>

                <p className="text-xs text-[#A89F91] line-clamp-3 leading-relaxed">
                  {album.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#332720] flex items-center justify-between text-xs text-[#C9A24B]">
                <span>{album.label || 'SM Empire'}</span>
                <span className="font-semibold group-hover:text-[#F2A93C]">Explore Tracklist →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TIMELINE & MILESTONES TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-[#1A1512] via-[#14100E] to-[#0A0A0A] border border-[#332720] space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4820A]">
                Historical Trajectory
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-heading mt-1">
                Career Era Milestones
              </h2>
            </div>

            <button
              onClick={() => onNavigate('/timeline')}
              className="px-5 py-2.5 rounded-lg bg-[#D4820A] hover:bg-[#F2A93C] text-black font-bold text-xs uppercase tracking-wider transition-colors self-start md:self-auto"
            >
              Full Interactive Timeline (2004–2026)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {timelinePreview.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate('/timeline')}
                className="cursor-pointer p-5 rounded-xl bg-[#0A0A0A]/60 border border-[#332720] hover:border-[#D4820A]/60 transition-all hover:bg-[#1A1512]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-black text-[#F2A93C] font-heading">
                    {item.year}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#1A1512] text-[#C9A24B] border border-[#332720]">
                    {item.category}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white font-heading leading-snug line-clamp-2">
                  {item.title}
                </h4>

                <p className="text-xs text-[#A89F91] line-clamp-3 mt-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. LEGACY & CULTURAL HONORS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#332720] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A24B]">
              Historic Accolades
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-heading mt-1">
              Legacy, Honors & Citations
            </h2>
          </div>

          <button
            onClick={() => onNavigate('/achievements')}
            className="text-sm font-semibold text-[#F2A93C] hover:text-white flex items-center gap-1.5 transition-colors self-start md:self-auto"
          >
            <span>Explore All Awards & Citations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievementsPreview.map((ach) => (
            <div
              key={ach.id}
              onClick={() => onNavigate('/achievements')}
              className="group cursor-pointer rounded-xl bg-[#1A1512] border border-[#332720] hover:border-[#D4820A] p-5 transition-all hover:-translate-y-1 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#0A0A0A] text-[#F2A93C] border border-[#332720]">
                    {ach.year}
                  </span>
                  <Trophy className="w-4 h-4 text-[#D4820A]" />
                </div>

                <div>
                  <span className="text-[11px] text-[#A89F91] uppercase tracking-wider block">
                    {ach.organization}
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-[#F2A93C] transition-colors font-heading mt-0.5">
                    {ach.title}
                  </h4>
                </div>

                <p className="text-xs text-[#F5EFE6]/70 line-clamp-3 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#332720]/60 flex items-center justify-between text-xs text-[#C9A24B]">
                <span className="capitalize">{ach.category}</span>
                <span className="font-semibold group-hover:text-[#F2A93C] flex items-center gap-1">
                  View Citation →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
