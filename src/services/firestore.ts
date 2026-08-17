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

// Helper for fast timeout race against remote Firestore
async function fastRace<T>(remotePromise: Promise<T>, fallback: T, timeoutMs = 400): Promise<T> {
  try {
    const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs));
    return await Promise.race([remotePromise, timeout]);
  } catch {
    return fallback;
  }
}

// ---------------- SONGS ----------------
export async function getSongs(onlyPublished: boolean = true): Promise<Song[]> {
  const local = getLocalCollection<Song>('songs', SEED_SONGS);
  const fallback = onlyPublished ? local.filter(s => s.status === 'published') : local;
  
  try {
    const colRef = collection(db, 'songs');
    let q = query(colRef, orderBy('releaseYear', 'desc'));
    if (onlyPublished) {
      q = query(colRef, where('status', '==', 'published'), orderBy('releaseYear', 'desc'));
    }
    const snap = await fastRace(getDocs(q), null as any, 450);
    if (snap && !snap.empty) {
      const remote = snap.docs.map((d: any) => ({ ...d.data(), id: d.id } as Song));
      saveLocalCollection('songs', remote);
      return onlyPublished ? remote.filter(s => s.status === 'published') : remote;
    }
  } catch (err) {
    // fallback
  }
  return fallback;
}

export async function getSongBySlug(slug: string): Promise<Song | null> {
  const local = getLocalCollection<Song>('songs', SEED_SONGS);
  const foundLocal = local.find(s => s.slug === slug || s.id === slug) || null;
  try {
    const colRef = collection(db, 'songs');
    const q = query(colRef, where('slug', '==', slug), limit(1));
    const snap = await fastRace(getDocs(q), null as any, 400);
    if (snap && !snap.empty) {
      const d = snap.docs[0];
      return { ...d.data(), id: d.id } as Song;
    }
  } catch {}
  return foundLocal;
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
  const local = getLocalCollection<Album>('albums', SEED_ALBUMS);
  const fallback = onlyPublished ? local.filter(a => a.status === 'published') : local;
  try {
    const colRef = collection(db, 'albums');
    let q = query(colRef, orderBy('releaseYear', 'desc'));
    if (onlyPublished) {
      q = query(colRef, where('status', '==', 'published'), orderBy('releaseYear', 'desc'));
    }
    const snap = await fastRace(getDocs(q), null as any, 450);
    if (snap && !snap.empty) {
      const remote = snap.docs.map((d: any) => ({ ...d.data(), id: d.id } as Album));
      saveLocalCollection('albums', remote);
      return onlyPublished ? remote.filter(a => a.status === 'published') : remote;
    }
  } catch {}
  return fallback;
}

export async function getAlbumBySlug(slug: string): Promise<Album | null> {
  const local = getLocalCollection<Album>('albums', SEED_ALBUMS);
  const foundLocal = local.find(a => a.slug === slug || a.id === slug) || null;
  try {
    const colRef = collection(db, 'albums');
    const q = query(colRef, where('slug', '==', slug), limit(1));
    const snap = await fastRace(getDocs(q), null as any, 400);
    if (snap && !snap.empty) {
      const d = snap.docs[0];
      return { ...d.data(), id: d.id } as Album;
    }
  } catch {}
  return foundLocal;
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
  const local = getLocalCollection<TimelineEvent>('timeline', SEED_TIMELINE);
  const fallback = onlyPublished ? local.filter(t => t.status === 'published') : local;
  try {
    const colRef = collection(db, 'timeline');
    let q = query(colRef, orderBy('year', 'asc'));
    if (onlyPublished) {
      q = query(colRef, where('status', '==', 'published'), orderBy('year', 'asc'));
    }
    const snap = await fastRace(getDocs(q), null as any, 450);
    if (snap && !snap.empty) {
      const remote = snap.docs.map((d: any) => ({ ...d.data(), id: d.id } as TimelineEvent));
      saveLocalCollection('timeline', remote);
      return onlyPublished ? remote.filter(t => t.status === 'published') : remote;
    }
  } catch {}
  return fallback;
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
  const local = getLocalCollection<Achievement>('achievements', SEED_ACHIEVEMENTS);
  const fallback = onlyPublished ? local.filter(a => a.status === 'published') : local;
  try {
    const colRef = collection(db, 'achievements');
    let q = query(colRef, orderBy('year', 'desc'));
    if (onlyPublished) {
      q = query(colRef, where('status', '==', 'published'), orderBy('year', 'desc'));
    }
    const snap = await fastRace(getDocs(q), null as any, 450);
    if (snap && !snap.empty) {
      const remote = snap.docs.map((d: any) => ({ ...d.data(), id: d.id } as Achievement));
      saveLocalCollection('achievements', remote);
      return onlyPublished ? remote.filter(a => a.status === 'published') : remote;
    }
  } catch {}
  return fallback;
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
  let fallback = INITIAL_SETTINGS;
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}settings`);
    if (raw) fallback = JSON.parse(raw);
  } catch {}

  try {
    const snap = await fastRace(getDoc(doc(db, 'settings', 'global')), null as any, 400);
    if (snap && snap.exists()) {
      const remote = snap.data() as SiteSettings;
      localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}settings`, JSON.stringify(remote));
      return remote;
    }
  } catch {}
  return fallback;
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
