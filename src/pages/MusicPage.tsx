import React, { useState, useEffect, useMemo } from 'react';
import { Song, Album, ReleaseType, MusicEra } from '../types';
import { getSongs, getAlbums } from '../services/firestore';
import { BrandImage } from '../components/common/BrandImage';
import { 
  Music, 
  Disc3, 
  Search, 
  Filter, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  Play, 
  ExternalLink,
  Calendar,
  Tag,
  Radio
} from 'lucide-react';
import { AudioWaveform } from '../components/common/AudioWaveform';

interface MusicPageProps {
  onSelectSong: (slug: string) => void;
  onSelectAlbum: (slug: string) => void;
}

export const MusicPage: React.FC<MusicPageProps> = ({ onSelectSong, onSelectAlbum }) => {
  const [activeTab, setActiveTab] = useState<'songs' | 'albums'>('songs');
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 24;

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [songsData, albumsData] = await Promise.all([
          getSongs(true),
          getAlbums(true)
        ]);
        setSongs(songsData);
        setAlbums(albumsData);
      } catch (err) {
        console.error('Error fetching music data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute unique filter options
  const years = useMemo(() => {
    const songYears = songs.map(s => s.releaseYear);
    const albumYears = albums.map(a => a.releaseYear);
    return Array.from(new Set([...songYears, ...albumYears])).sort((a, b) => b - a);
  }, [songs, albums]);

  const genres = useMemo(() => {
    const songGenres = songs.map(s => s.genre);
    const albumGenres = albums.map(a => a.genre);
    return Array.from(new Set([...songGenres, ...albumGenres])).filter(Boolean);
  }, [songs, albums]);

  const eras = useMemo(() => {
    return [
      'Bandana Era (2000-2012)',
      'The Rebirth & Rise (2013-2015)',
      'After The Storm (2016-2017)',
      'Reign & Dominance (2018)',
      'The Gift & International (2019-2021)',
      'Global Icon & GOG/SAFA (2022-Present)'
    ];
  }, []);

  // Filtered Songs
  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
      const matchesSearch = 
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (song.featuredArtists && song.featuredArtists.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (song.producer && song.producer.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (song.albumTitle && song.albumTitle.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = selectedType === 'all' || song.releaseType === selectedType;
      const matchesEra = selectedEra === 'all' || song.era === selectedEra;
      const matchesYear = selectedYear === 'all' || song.releaseYear.toString() === selectedYear;
      const matchesGenre = selectedGenre === 'all' || song.genre.toLowerCase().includes(selectedGenre.toLowerCase());

      return matchesSearch && matchesType && matchesEra && matchesYear && matchesGenre;
    });
  }, [songs, searchQuery, selectedType, selectedEra, selectedYear, selectedGenre]);

  // Filtered Albums
  const filteredAlbums = useMemo(() => {
    return albums.filter(album => {
      const matchesSearch = 
        album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (album.label && album.label.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (album.description && album.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesEra = selectedEra === 'all' || album.era === selectedEra;
      const matchesYear = selectedYear === 'all' || album.releaseYear.toString() === selectedYear;
      const matchesGenre = selectedGenre === 'all' || album.genre.toLowerCase().includes(selectedGenre.toLowerCase());

      return matchesSearch && matchesEra && matchesYear && matchesGenre;
    });
  }, [albums, searchQuery, selectedEra, selectedYear, selectedGenre]);

  const displayedSongs = filteredSongs.slice(0, page * ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-10">
      
      {/* Header & Title */}
      <div className="space-y-4 text-center md:text-left border-b border-[#332720] pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1512] border border-[#D4820A]/40 text-xs font-semibold uppercase tracking-wider text-[#F2A93C]">
          <AudioWaveform active={true} />
          <span>The Definitive Discography (2004–2026)</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black text-white font-heading">
          Music & Archival Discography
        </h1>
        
        <p className="text-sm sm:text-base text-[#A89F91] max-w-3xl leading-relaxed">
          Explore the catalogue of Ghanaian Dancehall King Shatta Wale. Every record includes factual release data, production credits, lyrical contexts, and verified outbound links to official streaming platforms.
        </p>

        {/* Tab Selector: Songs vs Albums */}
        <div className="flex items-center gap-3 pt-4">
          <button
            id="tab-songs-btn"
            onClick={() => { setActiveTab('songs'); setPage(1); }}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'songs'
                ? 'bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black shadow-md'
                : 'bg-[#1A1512] text-[#F5EFE6] hover:bg-[#261E18] border border-[#332720]'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Singles & Tracks ({filteredSongs.length})</span>
          </button>

          <button
            id="tab-albums-btn"
            onClick={() => { setActiveTab('albums'); setPage(1); }}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'albums'
                ? 'bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black shadow-md'
                : 'bg-[#1A1512] text-[#F5EFE6] hover:bg-[#261E18] border border-[#332720]'
            }`}
          >
            <Disc3 className="w-4 h-4" />
            <span>Studio Albums & Landmark EPs ({filteredAlbums.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-5 rounded-xl bg-[#14100E] border border-[#332720] space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          
          {/* Keyword Search */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-[#C9A24B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, producer, collaborator..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#1A1512] border border-[#332720] focus:border-[#D4820A] text-sm text-[#F5EFE6] placeholder-[#A89F91]/60 outline-none transition-colors"
            />
          </div>

          {/* Release Type Filter (Only for songs) */}
          {activeTab === 'songs' && (
            <div className="lg:col-span-2">
              <select
                value={selectedType}
                onChange={(e) => { setSelectedType(e.target.value); setPage(1); }}
                className="w-full px-3 py-2.5 rounded-lg bg-[#1A1512] border border-[#332720] focus:border-[#D4820A] text-xs font-semibold text-[#F5EFE6] outline-none"
              >
                <option value="all">All Release Types</option>
                <option value="single">Singles</option>
                <option value="collaboration">Collaborations</option>
                <option value="album">Album Cuts</option>
                <option value="freestyle">Freestyles / Dubs</option>
              </select>
            </div>
          )}

          {/* Era Filter */}
          <div className={activeTab === 'songs' ? "lg:col-span-3" : "lg:col-span-4"}>
            <select
              value={selectedEra}
              onChange={(e) => { setSelectedEra(e.target.value); setPage(1); }}
              className="w-full px-3 py-2.5 rounded-lg bg-[#1A1512] border border-[#332720] focus:border-[#D4820A] text-xs font-semibold text-[#F5EFE6] outline-none"
            >
              <option value="all">All Eras (2000–Present)</option>
              {eras.map(era => (
                <option key={era} value={era}>{era}</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className={activeTab === 'songs' ? "lg:col-span-2" : "lg:col-span-2"}>
            <select
              value={selectedYear}
              onChange={(e) => { setSelectedYear(e.target.value); setPage(1); }}
              className="w-full px-3 py-2.5 rounded-lg bg-[#1A1512] border border-[#332720] focus:border-[#D4820A] text-xs font-semibold text-[#F5EFE6] outline-none"
            >
              <option value="all">All Years</option>
              {years.map(yr => (
                <option key={yr} value={yr.toString()}>{yr}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <div className="lg:col-span-1 flex items-center">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedEra('all');
                setSelectedYear('all');
                setSelectedGenre('all');
                setPage(1);
              }}
              className="w-full py-2.5 px-2 rounded-lg bg-[#1A1512] hover:bg-[#261E18] text-[#A89F91] hover:text-white border border-[#332720] text-xs font-semibold transition-colors"
            >
              Reset
            </button>
          </div>

        </div>

        {/* Active Filter Chips */}
        {(selectedType !== 'all' || selectedEra !== 'all' || selectedYear !== 'all' || searchQuery) && (
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#332720]/40 text-xs text-[#A89F91]">
            <span>Active filters:</span>
            {searchQuery && (
              <span className="px-2 py-0.5 rounded bg-[#1A1512] border border-[#332720] text-[#F2A93C]">
                Query: "{searchQuery}"
              </span>
            )}
            {selectedType !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-[#1A1512] border border-[#332720] text-[#F2A93C]">
                Type: {selectedType}
              </span>
            )}
            {selectedEra !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-[#1A1512] border border-[#332720] text-[#F2A93C]">
                Era: {selectedEra}
              </span>
            )}
            {selectedYear !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-[#1A1512] border border-[#332720] text-[#F2A93C]">
                Year: {selectedYear}
              </span>
            )}
          </div>
        )}

      </div>

      {/* Content View: SONGS */}
      {activeTab === 'songs' && (
        <div className="space-y-8">
          {displayedSongs.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-[#14100E] border border-[#332720] space-y-3">
              <Music className="w-10 h-10 text-[#D4820A]/40 mx-auto" />
              <h3 className="text-lg font-bold text-white font-heading">No Tracks Found</h3>
              <p className="text-xs text-[#A89F91]">Try clearing your search query or selecting another era filter.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {displayedSongs.map((song) => (
                  <div
                    key={song.id}
                    onClick={() => onSelectSong(song.slug)}
                    className="group cursor-pointer rounded-xl bg-[#1A1512] border border-[#332720] hover:border-[#D4820A]/60 overflow-hidden transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Box */}
                      <div className="relative aspect-square bg-black overflow-hidden">
                        <BrandImage
                          src={song.coverArtUrl}
                          alt={song.title}
                          title={song.title}
                          credit={song.credit}
                          source={song.source}
                          aspectRatio="square"
                          category="Track"
                          showCreditBadge={false}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1512] via-transparent to-transparent opacity-80 pointer-events-none" />
                        
                        <div className="absolute top-2.5 left-2.5 flex gap-1.5 pointer-events-none">
                          <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-bold text-[#F2A93C] border border-[#332720]">
                            {song.releaseYear}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#D4820A]/90 text-[10px] font-bold text-black uppercase">
                            {song.releaseType}
                          </span>
                        </div>

                        {song.featured && (
                          <div className="absolute top-2.5 right-2.5 p-1 rounded-full bg-[#C9A24B] text-black shadow pointer-events-none" title="Featured Milestone Track">
                            <Sparkles className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4 space-y-1.5">
                        <h3 className="text-base font-bold text-white group-hover:text-[#F2A93C] transition-colors font-heading line-clamp-1">
                          {song.title}
                        </h3>
                        <p className="text-xs text-[#A89F91] line-clamp-1">
                          {song.artist}
                        </p>
                        {song.producer && (
                          <p className="text-[11px] text-[#A89F91]/70 line-clamp-1">
                            Prod: {song.producer}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-2 border-t border-[#332720]/60 flex items-center justify-between text-xs text-[#C9A24B]">
                      <span className="truncate max-w-[120px]">{song.genre}</span>
                      <span className="font-semibold group-hover:underline flex items-center gap-1">
                        Archival Specs <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination / Load More */}
              {displayedSongs.length < filteredSongs.length && (
                <div className="text-center pt-6">
                  <button
                    onClick={() => setPage(p => p + 1)}
                    className="px-8 py-3 rounded-xl bg-[#1A1512] hover:bg-[#261E18] border border-[#332720] hover:border-[#D4820A] text-xs font-bold uppercase tracking-wider text-[#F5EFE6] transition-colors"
                  >
                    Load More Tracks ({filteredSongs.length - displayedSongs.length} Remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Content View: ALBUMS */}
      {activeTab === 'albums' && (
        <div className="space-y-8">
          {filteredAlbums.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-[#14100E] border border-[#332720] space-y-3">
              <Disc3 className="w-10 h-10 text-[#D4820A]/40 mx-auto" />
              <h3 className="text-lg font-bold text-white font-heading">No Albums Found</h3>
              <p className="text-xs text-[#A89F91]">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlbums.map((album) => (
                <div
                  key={album.id}
                  onClick={() => onSelectAlbum(album.slug)}
                  className="group cursor-pointer rounded-xl bg-[#1A1512] border border-[#332720] hover:border-[#D4820A] p-6 transition-all hover:-translate-y-1 shadow-xl flex flex-col justify-between space-y-4"
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
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-xs font-bold text-[#F2A93C] border border-[#332720] pointer-events-none">
                        {album.releaseYear}
                      </div>
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#D4820A] text-xs font-bold text-black uppercase pointer-events-none">
                        {album.totalTracks} Tracks
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-[#C9A24B] font-bold uppercase tracking-wider block">
                        {album.genre}
                      </span>
                      <h3 className="text-2xl font-bold text-white group-hover:text-[#F2A93C] transition-colors font-heading mt-0.5">
                        {album.title}
                      </h3>
                      {album.label && (
                        <p className="text-xs text-[#A89F91] mt-0.5">
                          Label: {album.label}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-[#F5EFE6]/70 line-clamp-3 leading-relaxed">
                      {album.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#332720] flex items-center justify-between text-xs text-[#C9A24B]">
                    <span>{album.tracklist?.length || album.totalTracks} Tracklist Items</span>
                    <span className="font-semibold group-hover:underline flex items-center gap-1">
                      View Album Archive <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
