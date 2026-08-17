import React, { useState, useEffect, useMemo } from 'react';
import { Song, Album, TimelineEvent, Achievement } from '../types';
import { getSongs, getAlbums, getTimeline, getAchievements } from '../services/firestore';
import { 
  Search, 
  Music, 
  Disc3, 
  Clock, 
  Award, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';
import { BrandImage } from '../components/common/BrandImage';

interface SearchPageProps {
  onSelectSong: (slug: string) => void;
  onSelectAlbum: (slug: string) => void;
  onNavigate: (path: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onSelectSong, onSelectAlbum, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'songs' | 'albums' | 'timeline' | 'achievements'>('all');
  
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        const [s, a, t, ach] = await Promise.all([
          getSongs(true),
          getAlbums(true),
          getTimeline(true),
          getAchievements(true)
        ]);
        setSongs(s);
        setAlbums(a);
        setTimeline(t);
        setAchievements(ach);
      } catch (err) {
        console.error('Search data load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  const lowerQuery = query.toLowerCase().trim();

  // Search Results Calculations
  const filteredSongs = useMemo(() => {
    if (!lowerQuery) return songs;
    return songs.filter(s => 
      s.title.toLowerCase().includes(lowerQuery) ||
      s.artist.toLowerCase().includes(lowerQuery) ||
      s.genre.toLowerCase().includes(lowerQuery) ||
      (s.producer && s.producer.toLowerCase().includes(lowerQuery)) ||
      (s.storyBehindTrack && s.storyBehindTrack.toLowerCase().includes(lowerQuery))
    );
  }, [songs, lowerQuery]);

  const filteredAlbums = useMemo(() => {
    if (!lowerQuery) return albums;
    return albums.filter(a => 
      a.title.toLowerCase().includes(lowerQuery) ||
      a.description.toLowerCase().includes(lowerQuery) ||
      a.genre.toLowerCase().includes(lowerQuery)
    );
  }, [albums, lowerQuery]);

  const filteredTimeline = useMemo(() => {
    if (!lowerQuery) return timeline;
    return timeline.filter(t => 
      t.title.toLowerCase().includes(lowerQuery) ||
      t.summary.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.year.toString().includes(lowerQuery)
    );
  }, [timeline, lowerQuery]);

  const filteredAchievements = useMemo(() => {
    if (!lowerQuery) return achievements;
    return achievements.filter(ach => 
      ach.title.toLowerCase().includes(lowerQuery) ||
      ach.organization.toLowerCase().includes(lowerQuery) ||
      ach.description.toLowerCase().includes(lowerQuery) ||
      ach.category.toLowerCase().includes(lowerQuery)
    );
  }, [achievements, lowerQuery]);

  const totalResults = 
    filteredSongs.length + 
    filteredAlbums.length + 
    filteredTimeline.length + 
    filteredAchievements.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 space-y-10">
      
      {/* Header & Global Search Bar */}
      <div className="space-y-6 text-center md:text-left border-b border-[#332720] pb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4820A]">
            Archival Search Engine
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-heading mt-1">
            Search The Legacy Records
          </h1>
        </div>

        {/* Big Search Input */}
        <div className="relative max-w-3xl">
          <Search className="w-5 h-5 text-[#C9A24B] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search across all songs, albums, timeline events, and awards..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#14100E] border-2 border-[#332720] focus:border-[#D4820A] text-base text-white placeholder-[#A89F91]/70 outline-none shadow-xl transition-colors"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black shadow-md'
                : 'bg-[#1A1512] text-[#F5EFE6] hover:bg-[#261E18] border border-[#332720]'
            }`}
          >
            All Results ({totalResults})
          </button>

          <button
            onClick={() => setActiveTab('songs')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'songs'
                ? 'bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black shadow-md'
                : 'bg-[#1A1512] text-[#F5EFE6] hover:bg-[#261E18] border border-[#332720]'
            }`}
          >
            Songs ({filteredSongs.length})
          </button>

          <button
            onClick={() => setActiveTab('albums')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'albums'
                ? 'bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black shadow-md'
                : 'bg-[#1A1512] text-[#F5EFE6] hover:bg-[#261E18] border border-[#332720]'
            }`}
          >
            Albums ({filteredAlbums.length})
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'timeline'
                ? 'bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black shadow-md'
                : 'bg-[#1A1512] text-[#F5EFE6] hover:bg-[#261E18] border border-[#332720]'
            }`}
          >
            Timeline ({filteredTimeline.length})
          </button>

          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'achievements'
                ? 'bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black shadow-md'
                : 'bg-[#1A1512] text-[#F5EFE6] hover:bg-[#261E18] border border-[#332720]'
            }`}
          >
            Honors ({filteredAchievements.length})
          </button>
        </div>
      </div>

      {/* Results Content */}
      <div className="space-y-10">
        
        {/* Songs Section */}
        {(activeTab === 'all' || activeTab === 'songs') && filteredSongs.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <Music className="w-4 h-4 text-[#D4820A]" />
              <span>Matching Song Records ({filteredSongs.length})</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSongs.slice(0, activeTab === 'all' ? 6 : 50).map(song => (
                <div
                  key={song.id}
                  onClick={() => onSelectSong(song.slug)}
                  className="group cursor-pointer p-4 rounded-xl bg-[#1A1512] hover:bg-[#241C16] border border-[#332720] hover:border-[#D4820A]/60 flex items-center gap-3.5 transition-all"
                >
                  <div className="w-14 h-14 rounded overflow-hidden shrink-0 border border-[#332720]">
                    <BrandImage
                      src={song.coverArtUrl}
                      alt={song.title}
                      title={song.title}
                      credit={song.credit}
                      category="Track"
                      showCreditBadge={false}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white group-hover:text-[#F2A93C] font-heading truncate">
                      {song.title}
                    </h4>
                    <p className="text-xs text-[#A89F91] truncate">
                      {song.artist} ({song.releaseYear})
                    </p>
                    <span className="text-[10px] text-[#C9A24B] uppercase font-semibold">
                      {song.genre}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#A89F91] group-hover:text-[#F2A93C] shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Albums Section */}
        {(activeTab === 'all' || activeTab === 'albums') && filteredAlbums.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <Disc3 className="w-4 h-4 text-[#D4820A]" />
              <span>Matching Album Records ({filteredAlbums.length})</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAlbums.map(album => (
                <div
                  key={album.id}
                  onClick={() => onSelectAlbum(album.slug)}
                  className="group cursor-pointer p-4 rounded-xl bg-[#1A1512] hover:bg-[#241C16] border border-[#332720] hover:border-[#D4820A]/60 flex items-center gap-4 transition-all"
                >
                  <div className="w-16 h-16 rounded overflow-hidden shrink-0 border border-[#332720]">
                    <BrandImage
                      src={album.coverArtUrl}
                      alt={album.title}
                      title={album.title}
                      credit={album.credit}
                      category="Album"
                      showCreditBadge={false}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-white group-hover:text-[#F2A93C] font-heading truncate">
                      {album.title}
                    </h4>
                    <p className="text-xs text-[#A89F91]">
                      {album.releaseYear} • {album.totalTracks} Tracks
                    </p>
                    <p className="text-xs text-[#C9A24B] truncate">
                      {album.genre}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#A89F91] group-hover:text-[#F2A93C] shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline Events */}
        {(activeTab === 'all' || activeTab === 'timeline') && filteredTimeline.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4820A]" />
              <span>Career Milestones ({filteredTimeline.length})</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTimeline.slice(0, activeTab === 'all' ? 4 : 50).map(tl => (
                <div
                  key={tl.id}
                  onClick={() => onNavigate('/timeline')}
                  className="cursor-pointer p-4 rounded-xl bg-[#1A1512] hover:bg-[#241C16] border border-[#332720] hover:border-[#D4820A]/60 transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#F2A93C] font-heading">{tl.year}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 text-[#A89F91]">{tl.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white font-heading line-clamp-1">{tl.title}</h4>
                  <p className="text-xs text-[#A89F91] line-clamp-2">{tl.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Section */}
        {(activeTab === 'all' || activeTab === 'achievements') && filteredAchievements.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <Award className="w-4 h-4 text-[#D4820A]" />
              <span>Awards & Honors ({filteredAchievements.length})</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAchievements.slice(0, activeTab === 'all' ? 4 : 50).map(ach => (
                <div
                  key={ach.id}
                  onClick={() => onNavigate('/achievements')}
                  className="cursor-pointer p-4 rounded-xl bg-[#1A1512] hover:bg-[#241C16] border border-[#332720] hover:border-[#D4820A]/60 transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#F2A93C] font-heading">{ach.year} • {ach.organization}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 text-[#C9A24B]">{ach.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white font-heading">{ach.title}</h4>
                  <p className="text-xs text-[#A89F91] line-clamp-2">{ach.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {totalResults === 0 && (
          <div className="py-20 text-center rounded-2xl bg-[#14100E] border border-[#332720] space-y-3">
            <Search className="w-10 h-10 text-[#D4820A]/40 mx-auto" />
            <h3 className="text-xl font-bold text-white font-heading">No Records Matched</h3>
            <p className="text-xs text-[#A89F91]">Try searching for terms like "Beyoncé", "Reign", "Gringo", "2018", or "IRAWMA".</p>
          </div>
        )}

      </div>

    </div>
  );
};
