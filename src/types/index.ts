export type ContentStatus = 'draft' | 'published';

export type ReleaseType = 'single' | 'album' | 'ep' | 'mixtape' | 'collaboration' | 'freestyle';

export type MusicEra = 
  | 'Bandana Era (2000-2012)'
  | 'The Rebirth & Rise (2013-2015)'
  | 'After The Storm (2016-2017)'
  | 'Reign & Dominance (2018)'
  | 'The Gift & International (2019-2021)'
  | 'Global Icon & GOG/SAFA (2022-Present)';

export interface ExternalLinks {
  youtube?: string;
  spotify?: string;
  appleMusic?: string;
  audiomack?: string;
  boomplay?: string;
  tidal?: string;
}

export interface Song {
  id: string;
  slug: string;
  title: string;
  artist: string;
  featuredArtists?: string[];
  releaseYear: number;
  releaseDate?: string;
  releaseType: ReleaseType;
  albumTitle?: string;
  albumSlug?: string;
  coverArtUrl: string;
  producer?: string;
  genre: string;
  era: MusicEra;
  duration?: string;
  bpm?: number;
  key?: string;
  description: string;
  storyBehindTrack?: string;
  notableLyricsSnippet?: string;
  externalLinks: ExternalLinks;
  featured?: boolean;
  status: ContentStatus;
  credit?: string;
  source?: string;
  createdAt: number;
  updatedAt: number;
}

export interface TracklistItem {
  trackNumber: number;
  title: string;
  duration?: string;
  featuredArtists?: string[];
  songSlug?: string;
}

export interface Album {
  id: string;
  slug: string;
  title: string;
  releaseYear: number;
  releaseDate?: string;
  releaseType: ReleaseType;
  coverArtUrl: string;
  label?: string;
  executiveProducer?: string;
  totalTracks: number;
  genre: string;
  era: MusicEra;
  description: string;
  tracklist: TracklistItem[];
  chartMilestones?: string[];
  externalLinks: ExternalLinks;
  featured?: boolean;
  status: ContentStatus;
  credit?: string;
  source?: string;
  createdAt: number;
  updatedAt: number;
}

export interface TimelineEvent {
  id: string;
  year: number;
  exactDate?: string;
  title: string;
  era: MusicEra;
  category: 'Career Breakthrough' | 'Album Release' | 'Award' | 'Concert' | 'International Landmark' | 'Cultural Impact';
  summary: string;
  description: string;
  imageUrl?: string;
  linkedSongTitle?: string;
  linkedSongSlug?: string;
  linkedAlbumTitle?: string;
  linkedAlbumSlug?: string;
  credit?: string;
  source: string;
  featured?: boolean;
  status: ContentStatus;
  createdAt: number;
  updatedAt: number;
}

export interface Achievement {
  id: string;
  year: number;
  title: string;
  awardBody: string;
  category: string;
  won: boolean;
  workNominated?: string;
  description: string;
  impactLevel: 'National' | 'Continental' | 'Global' | 'Historic Record';
  imageUrl?: string;
  credit?: string;
  source?: string;
  sourceUrl?: string;
  sourceName?: string;
  featured?: boolean;
  status: ContentStatus;
  createdAt: number;
  updatedAt: number;
}

export interface SiteSettings {
  id?: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroBackgroundImageUrl?: string;
  heroBackgroundCredit?: string;
  heroBackgroundSource?: string;
  introQuote: string;
  introAuthor: string;
  featuredSongId?: string;
  featuredAlbumId?: string;
  announcementText?: string;
  announcementActive?: boolean;
  stats: {
    totalSongsArchived: number;
    careerYears: number;
    majorAwardsWon: number;
    historicConcertAttendance: string;
  };
  customLogoUrl?: string;
  customLogoCredit?: string;
  customLogoSource?: string;
  customLogoAlt?: string;
  updatedAt: number;
}
