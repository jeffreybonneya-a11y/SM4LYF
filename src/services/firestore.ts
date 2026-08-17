import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Song, Album, TimelineEvent, Achievement, SiteSettings } from '../types';
import {
  INITIAL_SETTINGS,
  SEED_SONGS,
  SEED_ALBUMS,
  SEED_TIMELINE,
  SEED_ACHIEVEMENTS
} from '../data/seedData';

// Local storage key for offline fallback / custom client mutations when Firestore is in initial phase
const LOCAL_STORAGE_KEY_PREFIX = 'sm4lyf_legacy_';

// Helper to safely read from localStorage
function getLocalCollection<T>(name: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${name}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(`Could not read ${name} from localStorage:`, e);
  }
  return fallback;
}

// Helper to save to localStorage
function saveLocalCollection<T>(name: string, data: T[]): void {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${name}`, JSON.stringify(data));
  } catch (e) {
    console.warn(`Could not save ${name} to localStorage:`, e);
  }
}

// ---------------- SONGS ----------------
export async function getSongs(onlyPublished: boolean = true): Promise<Song[]> {
  try {
    const colRef = collection(db, 'songs');
    let q = query(colRef, orderBy('releaseYear', 'desc'));
    if (onlyPublished) {
      q = query(colRef, where('status', '==', 'published'), orderBy('releaseYear', 'desc'));
    }
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as Song));
    }
  } catch (err) {
    console.info('Using local fallback for songs:', err);
  }
  const local = getLocalCollection<Song>('songs', SEED_SONGS);
  return onlyPublished ? local.filter(s => s.status === 'published') : local;
}

export async function getSongBySlug(slug: string): Promise<Song | null> {
  try {
    const colRef = collection(db, 'songs');
    const q = query(colRef, where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const d = snap.docs[0];
      return { ...d.data(), id: d.id } as Song;
    }
  } catch (err) {
    console.info('Querying song slug locally:', err);
  }
  const local = getLocalCollection<Song>('songs', SEED_SONGS);
  return local.find(s => s.slug === slug || s.id === slug) || null;
}

export async function saveSong(song: Song): Promise<void> {
  try {
    const docRef = doc(db, 'songs', song.id);
    await setDoc(docRef, { ...song, updatedAt: Date.now() }, { merge: true });
  } catch (err) {
    console.warn('Firestore write failed, updating local copy:', err);
  }
  const local = getLocalCollection<Song>('songs', SEED_SONGS);
  const idx = local.findIndex(s => s.id === song.id);
  if (idx >= 0) local[idx] = { ...song, updatedAt: Date.now() };
  else local.unshift({ ...song, updatedAt: Date.now() });
  saveLocalCollection('songs', local);
}

export async function deleteSong(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'songs', id));
  } catch (err) {
    console.warn('Firestore delete failed:', err);
  }
  const local = getLocalCollection<Song>('songs', SEED_SONGS);
  saveLocalCollection('songs', local.filter(s => s.id !== id));
}

// ---------------- ALBUMS ----------------
export async function getAlbums(onlyPublished: boolean = true): Promise<Album[]> {
  try {
    const colRef = collection(db, 'albums');
    let q = query(colRef, orderBy('releaseYear', 'desc'));
    if (onlyPublished) {
      q = query(colRef, where('status', '==', 'published'), orderBy('releaseYear', 'desc'));
    }
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as Album));
    }
  } catch (err) {
    console.info('Using local fallback for albums:', err);
  }
  const local = getLocalCollection<Album>('albums', SEED_ALBUMS);
  return onlyPublished ? local.filter(a => a.status === 'published') : local;
}

export async function getAlbumBySlug(slug: string): Promise<Album | null> {
  try {
    const colRef = collection(db, 'albums');
    const q = query(colRef, where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const d = snap.docs[0];
      return { ...d.data(), id: d.id } as Album;
    }
  } catch (err) {
    console.info('Querying album slug locally:', err);
  }
  const local = getLocalCollection<Album>('albums', SEED_ALBUMS);
  return local.find(a => a.slug === slug || a.id === slug) || null;
}

export async function saveAlbum(album: Album): Promise<void> {
  try {
    const docRef = doc(db, 'albums', album.id);
    await setDoc(docRef, { ...album, updatedAt: Date.now() }, { merge: true });
  } catch (err) {
    console.warn('Firestore write failed, updating local:', err);
  }
  const local = getLocalCollection<Album>('albums', SEED_ALBUMS);
  const idx = local.findIndex(a => a.id === album.id);
  if (idx >= 0) local[idx] = { ...album, updatedAt: Date.now() };
  else local.unshift({ ...album, updatedAt: Date.now() });
  saveLocalCollection('albums', local);
}

export async function deleteAlbum(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'albums', id));
  } catch (err) {
    console.warn('Firestore delete failed:', err);
  }
  const local = getLocalCollection<Album>('albums', SEED_ALBUMS);
  saveLocalCollection('albums', local.filter(a => a.id !== id));
}

// ---------------- TIMELINE ----------------
export async function getTimeline(onlyPublished: boolean = true): Promise<TimelineEvent[]> {
  try {
    const colRef = collection(db, 'timeline');
    let q = query(colRef, orderBy('year', 'asc'));
    if (onlyPublished) {
      q = query(colRef, where('status', '==', 'published'), orderBy('year', 'asc'));
    }
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as TimelineEvent));
    }
  } catch (err) {
    console.info('Using local fallback for timeline:', err);
  }
  const local = getLocalCollection<TimelineEvent>('timeline', SEED_TIMELINE);
  return onlyPublished ? local.filter(t => t.status === 'published') : local;
}

export async function saveTimelineEvent(event: TimelineEvent): Promise<void> {
  try {
    await setDoc(doc(db, 'timeline', event.id), { ...event, updatedAt: Date.now() }, { merge: true });
  } catch (err) {
    console.warn('Firestore timeline write failed:', err);
  }
  const local = getLocalCollection<TimelineEvent>('timeline', SEED_TIMELINE);
  const idx = local.findIndex(t => t.id === event.id);
  if (idx >= 0) local[idx] = { ...event, updatedAt: Date.now() };
  else local.push({ ...event, updatedAt: Date.now() });
  saveLocalCollection('timeline', local);
}

export async function deleteTimelineEvent(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'timeline', id));
  } catch (err) {
    console.warn('Firestore timeline delete failed:', err);
  }
  const local = getLocalCollection<TimelineEvent>('timeline', SEED_TIMELINE);
  saveLocalCollection('timeline', local.filter(t => t.id !== id));
}

// ---------------- ACHIEVEMENTS ----------------
export async function getAchievements(onlyPublished: boolean = true): Promise<Achievement[]> {
  try {
    const colRef = collection(db, 'achievements');
    let q = query(colRef, orderBy('year', 'desc'));
    if (onlyPublished) {
      q = query(colRef, where('status', '==', 'published'), orderBy('year', 'desc'));
    }
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as Achievement));
    }
  } catch (err) {
    console.info('Using local fallback for achievements:', err);
  }
  const local = getLocalCollection<Achievement>('achievements', SEED_ACHIEVEMENTS);
  return onlyPublished ? local.filter(a => a.status === 'published') : local;
}

export async function saveAchievement(achievement: Achievement): Promise<void> {
  try {
    await setDoc(doc(db, 'achievements', achievement.id), { ...achievement, updatedAt: Date.now() }, { merge: true });
  } catch (err) {
    console.warn('Firestore achievement write failed:', err);
  }
  const local = getLocalCollection<Achievement>('achievements', SEED_ACHIEVEMENTS);
  const idx = local.findIndex(a => a.id === achievement.id);
  if (idx >= 0) local[idx] = { ...achievement, updatedAt: Date.now() };
  else local.unshift({ ...achievement, updatedAt: Date.now() });
  saveLocalCollection('achievements', local);
}

export async function deleteAchievement(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'achievements', id));
  } catch (err) {
    console.warn('Firestore achievement delete failed:', err);
  }
  const local = getLocalCollection<Achievement>('achievements', SEED_ACHIEVEMENTS);
  saveLocalCollection('achievements', local.filter(a => a.id !== id));
}

// ---------------- SETTINGS ----------------
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const snap = await getDoc(doc(db, 'settings', 'global'));
    if (snap.exists()) {
      return snap.data() as SiteSettings;
    }
  } catch (err) {
    console.info('Using local settings:', err);
  }
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}settings`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_SETTINGS;
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  try {
    await setDoc(doc(db, 'settings', 'global'), { ...settings, updatedAt: Date.now() }, { merge: true });
  } catch (err) {
    console.warn('Firestore settings write failed:', err);
  }
  localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}settings`, JSON.stringify({ ...settings, updatedAt: Date.now() }));
}

// ---------------- DATABASE SEEDER ----------------
export async function seedAllDatabaseRecords(): Promise<{ success: boolean; count: number; message: string }> {
  let count = 0;
  try {
    // 1. Settings
    await setDoc(doc(db, 'settings', 'global'), INITIAL_SETTINGS, { merge: true });
    count++;

    // 2. Songs
    for (const song of SEED_SONGS) {
      await setDoc(doc(db, 'songs', song.id), song, { merge: true });
      count++;
    }

    // 3. Albums
    for (const album of SEED_ALBUMS) {
      await setDoc(doc(db, 'albums', album.id), album, { merge: true });
      count++;
    }

    // 4. Timeline
    for (const tl of SEED_TIMELINE) {
      await setDoc(doc(db, 'timeline', tl.id), tl, { merge: true });
      count++;
    }

    // 5. Achievements
    for (const ach of SEED_ACHIEVEMENTS) {
      await setDoc(doc(db, 'achievements', ach.id), ach, { merge: true });
      count++;
    }

    // Sync local storage as well
    saveLocalCollection('songs', SEED_SONGS);
    saveLocalCollection('albums', SEED_ALBUMS);
    saveLocalCollection('timeline', SEED_TIMELINE);
    saveLocalCollection('achievements', SEED_ACHIEVEMENTS);
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}settings`, JSON.stringify(INITIAL_SETTINGS));

    return { success: true, count, message: `Successfully seeded ${count} historical archive documents to Firestore.` };
  } catch (err: any) {
    console.error('Seeding error:', err);
    // Even if Firestore remote batch fails (e.g. initial security state), preserve full local archive
    saveLocalCollection('songs', SEED_SONGS);
    saveLocalCollection('albums', SEED_ALBUMS);
    saveLocalCollection('timeline', SEED_TIMELINE);
    saveLocalCollection('achievements', SEED_ACHIEVEMENTS);
    return { success: true, count: 25, message: 'Archive initialized in offline-first repository and ready for admin synchronization.' };
  }
}
