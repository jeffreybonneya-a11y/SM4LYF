import React, { useState, useEffect } from 'react';
import { AdminUser, logoutAdmin } from '../services/auth';
import { 
  Song, 
  Album, 
  TimelineEvent, 
  Achievement, 
  SiteSettings,
  ContentStatus,
  ReleaseType,
  MusicEra
} from '../types';
import { 
  getSongs, 
  saveSong, 
  deleteSong,
  getAlbums, 
  saveAlbum, 
  deleteAlbum,
  getTimeline, 
  saveTimelineEvent, 
  deleteTimelineEvent,
  getAchievements, 
  saveAchievement, 
  deleteAchievement,
  getSiteSettings, 
  saveSiteSettings,
  seedAllDatabaseRecords
} from '../services/firestore';
import { 
  ShieldCheck, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  Database, 
  Music, 
  Disc3, 
  Clock, 
  Award, 
  Image as ImageIcon, 
  Settings as SettingsIcon, 
  Check, 
  X, 
  Sparkles, 
  RefreshCw,
  Eye
} from 'lucide-react';
import { SM4LYFLogo } from '../components/common/SM4LYFLogo';
import { ImageUploadDropzone } from '../components/common/ImageUploadDropzone';
import { BrandImage } from '../components/common/BrandImage';

interface AdminDashboardPageProps {
  adminUser: AdminUser;
  onLogout: () => void;
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ 
  adminUser, 
  onLogout,
  onNavigate 
}) => {
  const [activeTab, setActiveTab] = useState<'songs' | 'albums' | 'timeline' | 'achievements' | 'settings' | 'seeder'>('songs');
  
  // Data states
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const [loading, setLoading] = useState(true);
  const [seedingStatus, setSeedingStatus] = useState<string | null>(null);

  // Editing Modals state
  const [editingSong, setEditingSong] = useState<Partial<Song> | null>(null);
  const [editingAlbum, setEditingAlbum] = useState<Partial<Album> | null>(null);
  const [editingTimeline, setEditingTimeline] = useState<Partial<TimelineEvent> | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<Partial<Achievement> | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [s, a, t, ach, set] = await Promise.all([
        getSongs(false),
        getAlbums(false),
        getTimeline(false),
        getAchievements(false),
        getSiteSettings()
      ]);
      setSongs(s);
      setAlbums(a);
      setTimeline(t);
      setAchievements(ach);
      setSettings(set);
    } catch (e) {
      console.error('Error loading admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  // --- SONGS HANDLERS ---
  const handleToggleSongStatus = async (song: Song) => {
    const updated: Song = {
      ...song,
      status: song.status === 'published' ? 'draft' : 'published',
      updatedAt: Date.now()
    };
    await saveSong(updated);
    setSongs(songs.map(s => s.id === song.id ? updated : s));
  };

  const handleToggleSongFeatured = async (song: Song) => {
    const updated: Song = {
      ...song,
      featured: !song.featured,
      updatedAt: Date.now()
    };
    await saveSong(updated);
    setSongs(songs.map(s => s.id === song.id ? updated : s));
  };

  const handleDeleteSong = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this track archival record?')) return;
    await deleteSong(id);
    setSongs(songs.filter(s => s.id !== id));
  };

  const handleSaveSongForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSong || !editingSong.title) return;
    
    const slug = editingSong.slug || editingSong.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const finalSong: Song = {
      id: editingSong.id || `song-${Date.now()}`,
      slug: slug,
      title: editingSong.title,
      artist: editingSong.artist || 'Shatta Wale',
      releaseYear: Number(editingSong.releaseYear) || new Date().getFullYear(),
      releaseType: (editingSong.releaseType as ReleaseType) || 'single',
      genre: editingSong.genre || 'Dancehall',
      era: (editingSong.era as MusicEra) || 'Global Icon & GOG/SAFA (2022-Present)',
      coverArtUrl: editingSong.coverArtUrl || '',
      credit: editingSong.credit || '',
      source: editingSong.source || 'Shatta Movement Archival Records',
      producer: editingSong.producer || '',
      description: editingSong.description || '',
      storyBehindTrack: editingSong.storyBehindTrack || '',
      notableLyricsSnippet: editingSong.notableLyricsSnippet || '',
      albumTitle: editingSong.albumTitle || '',
      externalLinks: editingSong.externalLinks || {},
      status: (editingSong.status as ContentStatus) || 'published',
      featured: Boolean(editingSong.featured),
      createdAt: editingSong.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    await saveSong(finalSong);
    await loadAllData();
    setEditingSong(null);
  };

  // --- ALBUMS HANDLERS ---
  const handleToggleAlbumStatus = async (album: Album) => {
    const updated: Album = {
      ...album,
      status: album.status === 'published' ? 'draft' : 'published',
      updatedAt: Date.now()
    };
    await saveAlbum(updated);
    setAlbums(albums.map(a => a.id === album.id ? updated : a));
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this album archive?')) return;
    await deleteAlbum(id);
    setAlbums(albums.filter(a => a.id !== id));
  };

  const handleSaveAlbumForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlbum || !editingAlbum.title) return;

    const slug = editingAlbum.slug || editingAlbum.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const finalAlbum: Album = {
      id: editingAlbum.id || `album-${Date.now()}`,
      slug: slug,
      title: editingAlbum.title,
      releaseYear: Number(editingAlbum.releaseYear) || new Date().getFullYear(),
      releaseType: (editingAlbum.releaseType as ReleaseType) || 'album',
      genre: editingAlbum.genre || 'Dancehall / Reggae',
      era: (editingAlbum.era as MusicEra) || 'Global Icon & GOG/SAFA (2022-Present)',
      coverArtUrl: editingAlbum.coverArtUrl || '',
      credit: editingAlbum.credit || '',
      source: editingAlbum.source || 'Official Album Press Release',
      label: editingAlbum.label || 'Shatta Movement Empire',
      executiveProducer: editingAlbum.executiveProducer || 'Charles Nii Armah Mensah Jr.',
      releaseDate: editingAlbum.releaseDate || '',
      description: editingAlbum.description || '',
      totalTracks: Number(editingAlbum.totalTracks) || 10,
      tracklist: editingAlbum.tracklist || [],
      chartMilestones: editingAlbum.chartMilestones || [],
      externalLinks: editingAlbum.externalLinks || {},
      status: (editingAlbum.status as ContentStatus) || 'published',
      featured: Boolean(editingAlbum.featured),
      createdAt: editingAlbum.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    await saveAlbum(finalAlbum);
    await loadAllData();
    setEditingAlbum(null);
  };

  // --- TIMELINE HANDLERS ---
  const handleToggleTimelineStatus = async (item: TimelineEvent) => {
    const updated: TimelineEvent = {
      ...item,
      status: item.status === 'published' ? 'draft' : 'published',
      updatedAt: Date.now()
    };
    await saveTimelineEvent(updated);
    setTimeline(timeline.map(t => t.id === item.id ? updated : t));
  };

  const handleDeleteTimeline = async (id: string) => {
    if (!window.confirm('Delete this historical timeline milestone?')) return;
    await deleteTimelineEvent(id);
    setTimeline(timeline.filter(t => t.id !== id));
  };

  const handleSaveTimelineForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTimeline || !editingTimeline.title) return;

    const finalTimeline: TimelineEvent = {
      id: editingTimeline.id || `timeline-${Date.now()}`,
      year: Number(editingTimeline.year) || 2024,
      title: editingTimeline.title,
      category: editingTimeline.category || 'Career Breakthrough',
      era: (editingTimeline.era as MusicEra) || 'Global Icon & GOG/SAFA (2022-Present)',
      summary: editingTimeline.summary || '',
      description: editingTimeline.description || '',
      imageUrl: editingTimeline.imageUrl || '',
      credit: editingTimeline.credit || '',
      source: editingTimeline.source || 'Historical Archival Documentation',
      linkedSongSlug: editingTimeline.linkedSongSlug || undefined,
      linkedAlbumSlug: editingTimeline.linkedAlbumSlug || undefined,
      status: (editingTimeline.status as ContentStatus) || 'published',
      featured: Boolean(editingTimeline.featured),
      createdAt: editingTimeline.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    await saveTimelineEvent(finalTimeline);
    await loadAllData();
    setEditingTimeline(null);
  };

  // --- ACHIEVEMENTS HANDLERS ---
  const handleToggleAchievementStatus = async (item: Achievement) => {
    const updated: Achievement = {
      ...item,
      status: item.status === 'published' ? 'draft' : 'published',
      updatedAt: Date.now()
    };
    await saveAchievement(updated);
    setAchievements(achievements.map(a => a.id === item.id ? updated : a));
  };

  const handleDeleteAchievement = async (id: string) => {
    if (!window.confirm('Delete this achievement record?')) return;
    await deleteAchievement(id);
    setAchievements(achievements.filter(a => a.id !== id));
  };

  const handleSaveAchievementForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAchievement || !editingAchievement.title) return;

    const finalAchievement: Achievement = {
      id: editingAchievement.id || `ach-${Date.now()}`,
      year: Number(editingAchievement.year) || 2024,
      title: editingAchievement.title,
      awardBody: editingAchievement.awardBody || 'Industry Honors',
      category: editingAchievement.category || 'Music Citation',
      won: editingAchievement.won !== undefined ? Boolean(editingAchievement.won) : true,
      impactLevel: (editingAchievement.impactLevel as any) || 'Global',
      workNominated: editingAchievement.workNominated || '',
      description: editingAchievement.description || '',
      imageUrl: editingAchievement.imageUrl || '',
      credit: editingAchievement.credit || '',
      source: editingAchievement.source || '',
      sourceName: editingAchievement.sourceName || 'Verified Citation',
      sourceUrl: editingAchievement.sourceUrl || '',
      status: (editingAchievement.status as ContentStatus) || 'published',
      featured: Boolean(editingAchievement.featured),
      createdAt: editingAchievement.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    await saveAchievement(finalAchievement);
    await loadAllData();
    setEditingAchievement(null);
  };

  // Database Seed Action
  const handleRunSeeder = async () => {
    setSeedingStatus('Seeding verified historical discography to Firestore...');
    const res = await seedAllDatabaseRecords();
    setSeedingStatus(res.message);
    await loadAllData();
  };

  // Save Site Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    await saveSiteSettings(settings);
    alert('Site settings & branding imagery saved successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 space-y-8">
      
      {/* Admin Top Header */}
      <div className="p-6 rounded-2xl bg-[#14100E] border border-[#332720] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <SM4LYFLogo size="sm" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white font-heading">
                Curator Dashboard & Archive Management
              </h1>
              <span className="px-2 py-0.5 rounded bg-[#D4820A]/20 text-[#F2A93C] text-[10px] font-bold uppercase border border-[#D4820A]/40">
                {adminUser.role}
              </span>
            </div>
            <p className="text-xs text-[#A89F91]">
              Logged in as <strong className="text-white">{adminUser.email}</strong> • Verified Firebase Backend Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="px-3.5 py-2 rounded-lg bg-[#1A1512] hover:bg-[#261E18] text-[#F5EFE6] border border-[#332720] text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#C9A24B]" />
            <span>View Live Site</span>
          </button>

          <button
            onClick={async () => {
              await logoutAdmin();
              onLogout();
            }}
            className="px-3.5 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/60 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#332720] pb-3">
        <button
          onClick={() => setActiveTab('songs')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'songs'
              ? 'bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black shadow-md'
              : 'bg-[#1A1512] text-[#F5EFE6] hover:bg-[#261E18] border border-[#332720]'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>Songs & Tracks ({songs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('albums')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'albums'
              ? 'bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black shadow-md'
              : 'bg-[#1A1512] text-[#F5EFE6] hover:bg-[#261E18] border border-[#332720]'
          }`}
        >
          <Disc3 className="w-4 h-4" />
          <span>Albums ({albums.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'timeline'
              ? 'bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black shadow-md'
              : 'bg-[#1A1512] text-[#F5EFE6] hover:bg-[#261E18] border border-[#332720]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Timeline ({timeline.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'achievements'
              ? 'bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black shadow-md'
              : 'bg-[#1A1512] text-[#F5EFE6] hover:bg-[#261E18] border border-[#332720]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Honors ({achievements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'settings'
              ? 'bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black shadow-md'
              : 'bg-[#1A1512] text-[#F5EFE6] hover:bg-[#261E18] border border-[#332720]'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Site Settings & Hero</span>
        </button>

        <button
          onClick={() => setActiveTab('seeder')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'seeder'
              ? 'bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black shadow-md'
              : 'bg-[#1A1512] text-[#F5EFE6] hover:bg-[#261E18] border border-[#332720]'
          }`}
        >
          <Database className="w-4 h-4 text-[#C9A24B]" />
          <span>Sync & Seeder</span>
        </button>
      </div>

      {/* TAB 1: SONGS */}
      {activeTab === 'songs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-heading">
                Track & Discography Catalog
              </h2>
              <p className="text-xs text-[#A89F91]">Manage track entries, production details, and cover artwork with mandatory image sourcing.</p>
            </div>
            <button
              onClick={() => setEditingSong({
                title: '',
                artist: 'Shatta Wale',
                releaseYear: new Date().getFullYear(),
                releaseType: 'single',
                genre: 'Dancehall',
                era: 'Global Icon & GOG/SAFA (2022-Present)',
                coverArtUrl: '',
                credit: '',
                source: 'Shatta Movement Archival Records',
                status: 'published',
                featured: false,
                externalLinks: {}
              })}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add Archival Song</span>
            </button>
          </div>

          {/* Songs Table */}
          <div className="bg-[#14100E] border border-[#332720] rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#F5EFE6]">
                <thead className="bg-[#1A1512] border-b border-[#332720] text-[#A89F91] uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3.5">Track / Artwork</th>
                    <th className="p-3.5">Year / Era</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Credit / Sourcing</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Featured</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#332720]/60">
                  {songs.map((song) => (
                    <tr key={song.id} className="hover:bg-[#1A1512]/60">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded overflow-hidden shrink-0 border border-[#332720]">
                            <BrandImage
                              src={song.coverArtUrl}
                              alt=""
                              title={song.title}
                              credit={song.credit}
                              category="Track"
                              showCreditBadge={false}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-white block text-sm font-heading">{song.title}</span>
                            <span className="text-[#A89F91] text-[11px]">{song.artist}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-white block">{song.releaseYear}</span>
                        <span className="text-[10px] text-[#C9A24B]">{song.era.split('(')[0]}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-[#1A1512] border border-[#332720] uppercase font-bold text-[10px]">
                          {song.releaseType}
                        </span>
                      </td>
                      <td className="p-3.5 max-w-[200px]">
                        <span className="text-white text-[11px] block truncate font-medium">{song.credit || 'No photographer/art credit'}</span>
                        <span className="text-[#A89F91] text-[10px] block truncate">{song.source || 'Shatta Movement Records'}</span>
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleToggleSongStatus(song)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                            song.status === 'published'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {song.status}
                        </button>
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleToggleSongFeatured(song)}
                          className={`p-1.5 rounded transition-colors ${
                            song.featured ? 'text-[#F2A93C] bg-[#D4820A]/20' : 'text-[#A89F91] hover:text-white'
                          }`}
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => setEditingSong(song)}
                          className="p-1.5 rounded bg-[#1A1512] hover:bg-[#261E18] text-[#F2A93C] border border-[#332720]"
                          title="Edit Song"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSong(song.id)}
                          className="p-1.5 rounded bg-[#1A1512] hover:bg-red-950 text-red-400 border border-[#332720]"
                          title="Delete Song"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALBUMS */}
      {activeTab === 'albums' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-heading">
                Studio Albums & Extended Plays
              </h2>
              <p className="text-xs text-[#A89F91]">Manage album releases, tracklists, and verified cover artwork.</p>
            </div>
            <button
              onClick={() => setEditingAlbum({
                title: '',
                releaseYear: new Date().getFullYear(),
                releaseType: 'album',
                genre: 'Dancehall / Reggae',
                era: 'Global Icon & GOG/SAFA (2022-Present)',
                coverArtUrl: '',
                credit: '',
                source: 'Official Album Artwork',
                label: 'Shatta Movement Empire',
                totalTracks: 10,
                status: 'published',
                featured: false
              })}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add Studio Album</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div key={album.id} className="p-5 rounded-xl bg-[#14100E] border border-[#332720] space-y-4 flex flex-col justify-between shadow-lg">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[#332720]">
                      <BrandImage
                        src={album.coverArtUrl}
                        alt=""
                        title={album.title}
                        credit={album.credit}
                        category="Album"
                        showCreditBadge={false}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-heading">{album.title}</h3>
                      <span className="text-xs text-[#D4820A] font-semibold">{album.releaseYear} • {album.totalTracks} Tracks</span>
                      <p className="text-[11px] text-[#A89F91]">{album.label}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#A89F91] line-clamp-2">{album.description}</p>
                  <p className="text-[10px] text-[#F5EFE6]/60 truncate">Source: {album.source || 'Official Record'}</p>
                </div>

                <div className="pt-3 border-t border-[#332720] flex items-center justify-between">
                  <button
                    onClick={() => handleToggleAlbumStatus(album)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      album.status === 'published'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {album.status}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingAlbum(album)}
                      className="p-1.5 rounded bg-[#1A1512] hover:bg-[#261E18] text-[#F2A93C] border border-[#332720]"
                      title="Edit Album"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAlbum(album.id)}
                      className="p-1.5 rounded bg-[#1A1512] hover:bg-red-950 text-red-400 border border-[#332720]"
                      title="Delete Album"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-heading">
                Historical Chronology & Career Milestones
              </h2>
              <p className="text-xs text-[#A89F91]">Add or edit historical events from 2004 to present day with documented references.</p>
            </div>
            <button
              onClick={() => setEditingTimeline({
                year: new Date().getFullYear(),
                title: '',
                category: 'Career Breakthrough',
                era: 'Global Icon & GOG/SAFA (2022-Present)',
                summary: '',
                description: '',
                imageUrl: '',
                credit: '',
                source: 'Historical Archival Record',
                status: 'published'
              })}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add Timeline Milestone</span>
            </button>
          </div>

          <div className="space-y-3">
            {timeline.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 rounded-xl bg-[#14100E] border border-[#332720] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 text-center shrink-0">
                    <span className="text-xl font-black text-[#F2A93C] font-heading block">{item.year}</span>
                    <span className="text-[10px] text-[#A89F91] uppercase">{item.category.split(' ')[0]}</span>
                  </div>
                  {item.imageUrl && (
                    <div className="w-16 h-12 rounded overflow-hidden shrink-0 border border-[#332720] hidden sm:block">
                      <BrandImage
                        src={item.imageUrl}
                        alt=""
                        title={item.title}
                        credit={item.credit}
                        showCreditBadge={false}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-base font-bold text-white font-heading">{item.title}</h3>
                    <p className="text-xs text-[#A89F91] line-clamp-1">{item.summary}</p>
                    {item.source && <p className="text-[10px] text-[#C9A24B] mt-0.5">Ref: {item.source}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleToggleTimelineStatus(item)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.status === 'published'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {item.status}
                  </button>
                  <button
                    onClick={() => setEditingTimeline(item)}
                    className="p-1.5 rounded bg-[#1A1512] hover:bg-[#261E18] text-[#F2A93C] border border-[#332720]"
                    title="Edit Milestone"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTimeline(item.id)}
                    className="p-1.5 rounded bg-[#1A1512] hover:bg-red-950 text-red-400 border border-[#332720]"
                    title="Delete Milestone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ACHIEVEMENTS */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-heading">
                Honors, Awards & Verified Citations
              </h2>
              <p className="text-xs text-[#A89F91]">Manage global, continental, and national accolades with primary source citation URLs.</p>
            </div>
            <button
              onClick={() => setEditingAchievement({
                year: new Date().getFullYear(),
                title: '',
                awardBody: '',
                category: '',
                impactLevel: 'Global',
                description: '',
                sourceName: 'Official Citation',
                sourceUrl: '',
                status: 'published'
              })}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add Honor Record</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((item) => (
              <div key={item.id} className="p-5 rounded-xl bg-[#14100E] border border-[#332720] space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-[#F2A93C] font-heading">{item.year} • {item.awardBody}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#1A1512] border border-[#332720] text-[#C9A24B]">
                      {item.impactLevel}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white font-heading">{item.title}</h3>
                  <p className="text-xs text-[#A89F91]">{item.description}</p>
                  {item.sourceName && (
                    <p className="text-[11px] text-[#F5EFE6]/70 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#D4820A]" />
                      <span>{item.sourceName}</span>
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-[#332720] flex items-center justify-between">
                  <button
                    onClick={() => handleToggleAchievementStatus(item)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.status === 'published'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {item.status}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingAchievement(item)}
                      className="p-1.5 rounded bg-[#1A1512] hover:bg-[#261E18] text-[#F2A93C] border border-[#332720]"
                      title="Edit Honor Record"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAchievement(item.id)}
                      className="p-1.5 rounded bg-[#1A1512] hover:bg-red-950 text-red-400 border border-[#332720]"
                      title="Delete Honor Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SETTINGS & BRAND HERO UPLOAD */}
      {activeTab === 'settings' && settings && (
        <form onSubmit={handleSaveSettings} className="p-8 rounded-2xl bg-[#14100E] border border-[#332720] space-y-6 max-w-4xl">
          <div>
            <h2 className="text-xl font-bold text-white font-heading">
              Visual Branding & Archival Site Configuration
            </h2>
            <p className="text-xs text-[#A89F91]">Manage official referenced brand assets (logos, emblems), homepage hero imagery, curator statement, and archive statistics.</p>
          </div>

          <div className="space-y-6 text-xs">
            {/* 1. OFFICIAL BRAND ASSET & LOGO MANAGER */}
            <div className="p-6 rounded-2xl bg-[#1A1512] border-2 border-[#D4820A]/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <label className="text-[#F2A93C] uppercase font-black tracking-wide text-sm flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#D4820A]" />
                  <span>Official SM4LYF / Shatta Movement Brand Asset & Logo</span>
                </label>
                <span className="px-2.5 py-0.5 rounded-full bg-[#241B15] text-[#C9A24B] border border-[#D4820A]/30 text-[10px] font-bold">
                  Referenced Brand Mark
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#120D0A] border border-[#332720] text-xs text-[#A89F91] space-y-2 leading-relaxed">
                <p className="text-[#F5EFE6] font-semibold">
                  Official Brand Verification Policy & Guidelines:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-[#A89F91]">
                  <li>Do not use AI-generated, redrawn, or unofficial fan variations.</li>
                  <li>Upload only authentic vector (SVG) or transparent high-res PNG/WebP files directly sourced from official portals.</li>
                  <li>Official sources to verify: <a href="https://www.shattamovementgh.com/" target="_blank" rel="noreferrer" className="text-[#F2A93C] underline hover:text-white">shattamovementgh.com</a> &bull; <a href="https://shattawale.com.gh/" target="_blank" rel="noreferrer" className="text-[#F2A93C] underline hover:text-white">shattawale.com.gh</a></li>
                  <li>Original brand emblem designed by Epixode for Shatta Movement Empire.</li>
                </ul>
              </div>

              {/* Upload Dropzone for Official Logo */}
              <ImageUploadDropzone
                currentImageUrl={settings.customLogoUrl}
                currentCredit={settings.customLogoCredit || "Designed by Epixode / Shatta Movement Empire"}
                currentSource={settings.customLogoSource || "Official Shatta Movement Portals"}
                folder="branding"
                label="Official SM4LYF Logo File (PNG / SVG / WebP)"
                onImageSelected={(url, credit, source) => {
                  setSettings({
                    ...settings,
                    customLogoUrl: url,
                    customLogoCredit: credit,
                    customLogoSource: source
                  });
                }}
              />

              {/* Live Preview across UI contexts */}
              {settings.customLogoUrl && (
                <div className="pt-2 border-t border-[#332720]/80 space-y-2">
                  <p className="text-[11px] font-bold text-[#F5EFE6] uppercase tracking-wider">
                    Live UI Preview (Navbar, Footer, and Hero Layouts):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#0D0B09] border border-[#2E231B]">
                    <div className="flex flex-col items-center justify-center p-3 bg-[#14100E] rounded-lg border border-[#2E231B] text-center space-y-2">
                      <span className="text-[10px] text-[#786D61] uppercase font-bold">Navbar (sm)</span>
                      <img src={settings.customLogoUrl} alt="Navbar preview" className="h-8 object-contain" />
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 bg-[#14100E] rounded-lg border border-[#2E231B] text-center space-y-2">
                      <span className="text-[10px] text-[#786D61] uppercase font-bold">Footer (md)</span>
                      <img src={settings.customLogoUrl} alt="Footer preview" className="h-12 object-contain" />
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 bg-[#14100E] rounded-lg border border-[#2E231B] text-center space-y-2">
                      <span className="text-[10px] text-[#786D61] uppercase font-bold">Hero (lg/xl)</span>
                      <img src={settings.customLogoUrl} alt="Hero preview" className="h-16 object-contain" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hero Background Image Upload Component */}
            <div className="p-5 rounded-xl bg-[#1A1512] border border-[#332720] space-y-3">
              <label className="text-[#F2A93C] uppercase font-bold block text-sm flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#D4820A]" />
                <span>Homepage Hero Background Artwork & Photography</span>
              </label>
              <p className="text-[#A89F91]">
                Upload or select the high-resolution background artwork displayed in the landing hero section.
              </p>
              
              <ImageUploadDropzone
                currentImageUrl={settings.heroBackgroundImageUrl}
                currentCredit={settings.heroBackgroundCredit}
                currentSource={settings.heroBackgroundSource}
                folder="hero"
                label="Hero Background Photo"
                onImageSelected={(url, credit, source) => {
                  setSettings({
                    ...settings,
                    heroBackgroundImageUrl: url,
                    heroBackgroundCredit: credit,
                    heroBackgroundSource: source
                  });
                }}
              />
            </div>

            <div>
              <label className="text-[#A89F91] uppercase font-bold block mb-1">Hero Main Headline</label>
              <input
                type="text"
                value={settings.heroHeadline}
                onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#1A1512] border border-[#332720] focus:border-[#D4820A] text-white"
              />
            </div>

            <div>
              <label className="text-[#A89F91] uppercase font-bold block mb-1">Hero Subheadline</label>
              <textarea
                rows={2}
                value={settings.heroSubheadline}
                onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#1A1512] border border-[#332720] focus:border-[#D4820A] text-white"
              />
            </div>

            <div>
              <label className="text-[#A89F91] uppercase font-bold block mb-1">Curatorial Intro Quote</label>
              <textarea
                rows={2}
                value={settings.introQuote}
                onChange={(e) => setSettings({ ...settings, introQuote: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#1A1512] border border-[#332720] focus:border-[#D4820A] text-white"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="text-[#A89F91] uppercase font-bold block mb-1">Total Tracks Stat</label>
                <input
                  type="number"
                  value={settings.stats.totalSongsArchived}
                  onChange={(e) => setSettings({ ...settings, stats: { ...settings.stats, totalSongsArchived: Number(e.target.value) } })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white font-bold"
                />
              </div>
              <div>
                <label className="text-[#A89F91] uppercase font-bold block mb-1">Career Years</label>
                <input
                  type="number"
                  value={settings.stats.careerYears}
                  onChange={(e) => setSettings({ ...settings, stats: { ...settings.stats, careerYears: Number(e.target.value) } })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white font-bold"
                />
              </div>
              <div>
                <label className="text-[#A89F91] uppercase font-bold block mb-1">Major Awards</label>
                <input
                  type="number"
                  value={settings.stats.majorAwardsWon}
                  onChange={(e) => setSettings({ ...settings, stats: { ...settings.stats, majorAwardsWon: Number(e.target.value) } })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white font-bold"
                />
              </div>
              <div>
                <label className="text-[#A89F91] uppercase font-bold block mb-1">Crowd Record</label>
                <input
                  type="text"
                  value={settings.stats.historicConcertAttendance}
                  onChange={(e) => setSettings({ ...settings, stats: { ...settings.stats, historicConcertAttendance: e.target.value } })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white font-bold"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black font-extrabold text-xs uppercase tracking-wider shadow hover:brightness-110"
          >
            Save Site Settings & Visual Brand
          </button>
        </form>
      )}

      {/* TAB 6: DATABASE SEEDER */}
      {activeTab === 'seeder' && (
        <div className="p-8 rounded-2xl bg-[#14100E] border border-[#332720] space-y-6 max-w-3xl">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-[#D4820A]" />
            <div>
              <h2 className="text-xl font-bold text-white font-heading">
                Firestore Database Synchronization & Seeder
              </h2>
              <p className="text-xs text-[#A89F91]">
                Initialize or refresh your connected Firestore database with verified historical archival records.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#1A1512] border border-[#332720] text-xs text-[#F5EFE6] space-y-2">
            <p className="font-bold text-[#F2A93C]">Verified Database Schema Contents:</p>
            <ul className="list-disc list-inside space-y-1 text-[#A89F91]">
              <li>Complete landmark Studio Albums (After The Storm, Reign, Wonder Boy, MAALI, SAFA)</li>
              <li>Breakthrough Singles & Collaborations (Already w/ Beyoncé, Dancehall King, Kakai, Gringo, My Level)</li>
              <li>Historical Career Timeline (Bandana 2004 through 2026)</li>
              <li>International & National Awards (Billboard, IRAWMA, VGMA, AFRIMA, Key to Worcester)</li>
            </ul>
          </div>

          {seedingStatus && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-200 font-medium">
              {seedingStatus}
            </div>
          )}

          <button
            onClick={handleRunSeeder}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black font-extrabold text-xs uppercase tracking-wider shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Seed Verified Archive to Firestore</span>
          </button>
        </div>
      )}

      {/* --- EDIT / CREATE MODALS --- */}

      {/* 1. SONG MODAL */}
      {editingSong && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
          <div className="bg-[#14100E] border border-[#332720] rounded-2xl max-w-2xl w-full p-6 sm:p-8 my-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#332720] pb-4">
              <h3 className="text-xl font-bold text-white font-heading">
                {editingSong.id ? 'Edit Archival Track' : 'Add New Song Record'}
              </h3>
              <button
                onClick={() => setEditingSong(null)}
                className="p-1 rounded bg-[#1A1512] hover:bg-[#D4820A] text-white hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSongForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#A89F91] uppercase font-bold block mb-1">Song Title *</label>
                  <input
                    type="text"
                    required
                    value={editingSong.title || ''}
                    onChange={(e) => setEditingSong({ ...editingSong, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                  />
                </div>

                <div>
                  <label className="text-[#A89F91] uppercase font-bold block mb-1">Artist *</label>
                  <input
                    type="text"
                    required
                    value={editingSong.artist || 'Shatta Wale'}
                    onChange={(e) => setEditingSong({ ...editingSong, artist: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                  />
                </div>

                <div>
                  <label className="text-[#A89F91] uppercase font-bold block mb-1">Release Year</label>
                  <input
                    type="number"
                    value={editingSong.releaseYear || 2024}
                    onChange={(e) => setEditingSong({ ...editingSong, releaseYear: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                  />
                </div>

                <div>
                  <label className="text-[#A89F91] uppercase font-bold block mb-1">Release Type</label>
                  <select
                    value={editingSong.releaseType || 'single'}
                    onChange={(e) => setEditingSong({ ...editingSong, releaseType: e.target.value as ReleaseType })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                  >
                    <option value="single">Single</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="album">Album Cut</option>
                    <option value="freestyle">Freestyle</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#A89F91] uppercase font-bold block mb-1">Era</label>
                  <select
                    value={editingSong.era || 'Global Icon & GOG/SAFA (2022-Present)'}
                    onChange={(e) => setEditingSong({ ...editingSong, era: e.target.value as MusicEra })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                  >
                    <option value="Bandana Era (2000-2012)">Bandana Era (2000-2012)</option>
                    <option value="The Rebirth & Rise (2013-2015)">The Rebirth & Rise (2013-2015)</option>
                    <option value="After The Storm (2016-2017)">After The Storm (2016-2017)</option>
                    <option value="Reign & Dominance (2018)">Reign & Dominance (2018)</option>
                    <option value="The Gift & International (2019-2021)">The Gift & International (2019-2021)</option>
                    <option value="Global Icon & GOG/SAFA (2022-Present)">Global Icon & GOG/SAFA (2022-Present)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#A89F91] uppercase font-bold block mb-1">Genre</label>
                  <input
                    type="text"
                    value={editingSong.genre || 'Dancehall'}
                    onChange={(e) => setEditingSong({ ...editingSong, genre: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                  />
                </div>
              </div>

              {/* Artwork Uploader with Credit and Source */}
              <div className="pt-2">
                <ImageUploadDropzone
                  currentImageUrl={editingSong.coverArtUrl}
                  currentCredit={editingSong.credit}
                  currentSource={editingSong.source}
                  folder="songs"
                  label="Song Cover Art / Single Artwork"
                  onImageSelected={(url, credit, source) => {
                    setEditingSong({
                      ...editingSong,
                      coverArtUrl: url,
                      credit: credit,
                      source: source
                    });
                  }}
                />
              </div>

              <div>
                <label className="text-[#A89F91] uppercase font-bold block mb-1">Producer</label>
                <input
                  type="text"
                  value={editingSong.producer || ''}
                  onChange={(e) => setEditingSong({ ...editingSong, producer: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                />
              </div>

              <div>
                <label className="text-[#A89F91] uppercase font-bold block mb-1">Description / Archival Context</label>
                <textarea
                  rows={2}
                  value={editingSong.description || ''}
                  onChange={(e) => setEditingSong({ ...editingSong, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                />
              </div>

              <div>
                <label className="text-[#A89F91] uppercase font-bold block mb-1">Notable Lyrics Snippet</label>
                <input
                  type="text"
                  value={editingSong.notableLyricsSnippet || ''}
                  onChange={(e) => setEditingSong({ ...editingSong, notableLyricsSnippet: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[#A89F91] uppercase font-bold block mb-1">Spotify URL</label>
                  <input
                    type="url"
                    value={editingSong.externalLinks?.spotify || ''}
                    onChange={(e) => setEditingSong({
                      ...editingSong,
                      externalLinks: { ...editingSong.externalLinks, spotify: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                  />
                </div>
                <div>
                  <label className="text-[#A89F91] uppercase font-bold block mb-1">YouTube URL</label>
                  <input
                    type="url"
                    value={editingSong.externalLinks?.youtube || ''}
                    onChange={(e) => setEditingSong({
                      ...editingSong,
                      externalLinks: { ...editingSong.externalLinks, youtube: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#332720]">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingSong.status === 'published'}
                      onChange={(e) => setEditingSong({ ...editingSong, status: e.target.checked ? 'published' : 'draft' })}
                      className="rounded bg-[#1A1512]"
                    />
                    <span className="text-white font-bold">Published</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingSong.featured)}
                      onChange={(e) => setEditingSong({ ...editingSong, featured: e.target.checked })}
                      className="rounded bg-[#1A1512]"
                    />
                    <span className="text-[#F2A93C] font-bold">Featured Track</span>
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingSong(null)}
                    className="px-4 py-2 rounded-lg bg-[#1A1512] text-[#A89F91] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black font-bold uppercase tracking-wider"
                  >
                    Save Track Record
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. ALBUM MODAL */}
      {editingAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
          <div className="bg-[#14100E] border border-[#332720] rounded-2xl max-w-2xl w-full p-6 sm:p-8 my-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#332720] pb-4">
              <h3 className="text-xl font-bold text-white font-heading">
                {editingAlbum.id ? 'Edit Studio Album Record' : 'Add New Studio Album'}
              </h3>
              <button
                onClick={() => setEditingAlbum(null)}
                className="p-1 rounded bg-[#1A1512] hover:bg-[#D4820A] text-white hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAlbumForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#A89F91] uppercase font-bold block mb-1">Album Title *</label>
                  <input
                    type="text"
                    required
                    value={editingAlbum.title || ''}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                  />
                </div>

                <div>
                  <label className="text-[#A89F91] uppercase font-bold block mb-1">Release Year *</label>
                  <input
                    type="number"
                    required
                    value={editingAlbum.releaseYear || 2024}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, releaseYear: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                  />
                </div>

                <div>
                  <label className="text-[#A89F91] uppercase font-bold block mb-1">Record Label</label>
                  <input
                    type="text"
                    value={editingAlbum.label || 'Shatta Movement Empire'}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, label: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                  />
                </div>

                <div>
                  <label className="text-[#A89F91] uppercase font-bold block mb-1">Total Tracks</label>
                  <input
                    type="number"
                    value={editingAlbum.totalTracks || 10}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, totalTracks: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                  />
                </div>
              </div>

              {/* Album Cover Art Dropzone with attribution */}
              <div className="pt-2">
                <ImageUploadDropzone
                  currentImageUrl={editingAlbum.coverArtUrl}
                  currentCredit={editingAlbum.credit}
                  currentSource={editingAlbum.source}
                  folder="albums"
                  label="Official Album Artwork"
                  onImageSelected={(url, credit, source) => {
                    setEditingAlbum({
                      ...editingAlbum,
                      coverArtUrl: url,
                      credit: credit,
                      source: source
                    });
                  }}
                />
              </div>

              <div>
                <label className="text-[#A89F91] uppercase font-bold block mb-1">Album Description & Context</label>
                <textarea
                  rows={3}
                  value={editingAlbum.description || ''}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#332720]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAlbum.status === 'published'}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, status: e.target.checked ? 'published' : 'draft' })}
                    className="rounded bg-[#1A1512]"
                  />
                  <span className="text-white font-bold">Published</span>
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingAlbum(null)}
                    className="px-4 py-2 rounded-lg bg-[#1A1512] text-[#A89F91] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black font-bold uppercase tracking-wider"
                  >
                    Save Album Record
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. TIMELINE MODAL */}
      {editingTimeline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
          <div className="bg-[#14100E] border border-[#332720] rounded-2xl max-w-2xl w-full p-6 sm:p-8 my-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#332720] pb-4">
              <h3 className="text-xl font-bold text-white font-heading">
                {editingTimeline.id ? 'Edit Timeline Milestone' : 'Add New Historical Milestone'}
              </h3>
              <button
                onClick={() => setEditingTimeline(null)}
                className="p-1 rounded bg-[#1A1512] hover:bg-[#D4820A] text-white hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTimelineForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#A89F91] uppercase font-bold block mb-1">Year *</label>
                  <input
                    type="number"
                    required
                    value={editingTimeline.year || 2024}
                    onChange={(e) => setEditingTimeline({ ...editingTimeline, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                  />
                </div>

                <div>
                  <label className="text-[#A89F91] uppercase font-bold block mb-1">Category</label>
                  <select
                    value={editingTimeline.category || 'Career Breakthrough'}
                    onChange={(e) => setEditingTimeline({ ...editingTimeline, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                  >
                    <option value="Career Breakthrough">Career Breakthrough</option>
                    <option value="Album Release">Album Release</option>
                    <option value="Award">Award</option>
                    <option value="Concert">Concert</option>
                    <option value="International Landmark">International Landmark</option>
                    <option value="Cultural Impact">Cultural Impact</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#A89F91] uppercase font-bold block mb-1">Milestone Headline *</label>
                <input
                  type="text"
                  required
                  value={editingTimeline.title || ''}
                  onChange={(e) => setEditingTimeline({ ...editingTimeline, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                />
              </div>

              {/* Timeline Media Upload */}
              <div className="pt-2">
                <ImageUploadDropzone
                  currentImageUrl={editingTimeline.imageUrl}
                  currentCredit={editingTimeline.credit}
                  currentSource={editingTimeline.source}
                  folder="timeline"
                  label="Documentary Photo / Media Preview"
                  onImageSelected={(url, credit, source) => {
                    setEditingTimeline({
                      ...editingTimeline,
                      imageUrl: url,
                      credit: credit,
                      source: source
                    });
                  }}
                />
              </div>

              <div>
                <label className="text-[#A89F91] uppercase font-bold block mb-1">Summary (1-2 sentences)</label>
                <input
                  type="text"
                  value={editingTimeline.summary || ''}
                  onChange={(e) => setEditingTimeline({ ...editingTimeline, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                />
              </div>

              <div>
                <label className="text-[#A89F91] uppercase font-bold block mb-1">Detailed Historical Context</label>
                <textarea
                  rows={3}
                  value={editingTimeline.description || ''}
                  onChange={(e) => setEditingTimeline({ ...editingTimeline, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#332720]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingTimeline.status === 'published'}
                    onChange={(e) => setEditingTimeline({ ...editingTimeline, status: e.target.checked ? 'published' : 'draft' })}
                    className="rounded bg-[#1A1512]"
                  />
                  <span className="text-white font-bold">Published</span>
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingTimeline(null)}
                    className="px-4 py-2 rounded-lg bg-[#1A1512] text-[#A89F91] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black font-bold uppercase tracking-wider"
                  >
                    Save Milestone
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. ACHIEVEMENT MODAL */}
      {editingAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
          <div className="bg-[#14100E] border border-[#332720] rounded-2xl max-w-2xl w-full p-6 sm:p-8 my-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#332720] pb-4">
              <h3 className="text-xl font-bold text-white font-heading">
                {editingAchievement.id ? 'Edit Honor Record' : 'Add New Accolade'}
              </h3>
              <button
                onClick={() => setEditingAchievement(null)}
                className="p-1 rounded bg-[#1A1512] hover:bg-[#D4820A] text-white hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAchievementForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#A89F91] uppercase font-bold block mb-1">Award Title *</label>
                  <input
                    type="text"
                    required
                    value={editingAchievement.title || ''}
                    onChange={(e) => setEditingAchievement({ ...editingAchievement, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                  />
                </div>

                <div>
                  <label className="text-[#A89F91] uppercase font-bold block mb-1">Award Body *</label>
                  <input
                    type="text"
                    required
                    value={editingAchievement.awardBody || ''}
                    onChange={(e) => setEditingAchievement({ ...editingAchievement, awardBody: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                  />
                </div>

                <div>
                  <label className="text-[#A89F91] uppercase font-bold block mb-1">Year *</label>
                  <input
                    type="number"
                    required
                    value={editingAchievement.year || 2024}
                    onChange={(e) => setEditingAchievement({ ...editingAchievement, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                  />
                </div>

                <div>
                  <label className="text-[#A89F91] uppercase font-bold block mb-1">Impact Level</label>
                  <select
                    value={editingAchievement.impactLevel || 'Global'}
                    onChange={(e) => setEditingAchievement({ ...editingAchievement, impactLevel: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                  >
                    <option value="Global">Global</option>
                    <option value="Continental">Continental</option>
                    <option value="National">National</option>
                    <option value="Historic Record">Historic Record</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#A89F91] uppercase font-bold block mb-1">Nominated / Recognized Work</label>
                <input
                  type="text"
                  value={editingAchievement.workNominated || ''}
                  onChange={(e) => setEditingAchievement({ ...editingAchievement, workNominated: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                />
              </div>

              <div>
                <label className="text-[#A89F91] uppercase font-bold block mb-1">Description & Milestone Citation</label>
                <textarea
                  rows={2}
                  value={editingAchievement.description || ''}
                  onChange={(e) => setEditingAchievement({ ...editingAchievement, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#A89F91] uppercase font-bold block mb-1">Verification Source Name</label>
                  <input
                    type="text"
                    value={editingAchievement.sourceName || ''}
                    onChange={(e) => setEditingAchievement({ ...editingAchievement, sourceName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                  />
                </div>

                <div>
                  <label className="text-[#A89F91] uppercase font-bold block mb-1">Verification Source URL</label>
                  <input
                    type="url"
                    value={editingAchievement.sourceUrl || ''}
                    onChange={(e) => setEditingAchievement({ ...editingAchievement, sourceUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#332720]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAchievement.status === 'published'}
                    onChange={(e) => setEditingAchievement({ ...editingAchievement, status: e.target.checked ? 'published' : 'draft' })}
                    className="rounded bg-[#1A1512]"
                  />
                  <span className="text-white font-bold">Published</span>
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingAchievement(null)}
                    className="px-4 py-2 rounded-lg bg-[#1A1512] text-[#A89F91] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black font-bold uppercase tracking-wider"
                  >
                    Save Honor Record
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
