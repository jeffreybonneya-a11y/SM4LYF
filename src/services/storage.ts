import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

export interface UploadResult {
  downloadUrl: string;
  storagePath: string;
  isFallbackDataUrl?: boolean;
}

export const MAX_IMAGE_FILE_SIZE_BYTES = 12 * 1024 * 1024; // 12 MB
export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
];

/**
 * Validate an image file before upload
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `Unsupported file format (${file.type || 'unknown'}). Please choose a JPEG, PNG, WebP, GIF, or SVG image.`,
    };
  }

  if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeMb} MB). Maximum allowed size is 12 MB.`,
    };
  }

  return { valid: true };
}

/**
 * Convert a File object to a Base64 data URL
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export type StorageFolder = 'albums' | 'songs' | 'timeline' | 'achievements' | 'hero' | 'general' | string;

/**
 * Upload an image file to Firebase Storage.
 * If Storage is unreachable (e.g. storage bucket not activated or restricted),
 * seamlessly falls back to a base64 data URL representation for live preview and local storage.
 */
export async function uploadArchivalImage(
  file: File,
  folder: StorageFolder = 'general',
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid file');
  }

  // Clean filename: remove special chars, prepend timestamp
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniqueStoragePath = `archive/${folder}/${Date.now()}_${sanitizedName}`;

  try {
    const storageRef = ref(storage, uniqueStoragePath);
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        archivalFolder: folder,
        uploadedAt: new Date().toISOString(),
      },
    });

    return await new Promise<UploadResult>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (snapshot.totalBytes > 0 && onProgress) {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            onProgress(progress);
          }
        },
        async (error) => {
          console.warn('Firebase Storage upload encounter notice:', error.message);
          // Fall back to Base64 data URL
          try {
            const base64Url = await fileToBase64(file);
            if (onProgress) onProgress(100);
            resolve({
              downloadUrl: base64Url,
              storagePath: uniqueStoragePath,
              isFallbackDataUrl: true,
            });
          } catch (b64Err) {
            reject(new Error(`Upload failed: ${error.message}`));
          }
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress) onProgress(100);
            resolve({
              downloadUrl,
              storagePath: uniqueStoragePath,
              isFallbackDataUrl: false,
            });
          } catch (urlErr: any) {
            // Fall back to Base64 data URL
            const base64Url = await fileToBase64(file);
            resolve({
              downloadUrl: base64Url,
              storagePath: uniqueStoragePath,
              isFallbackDataUrl: true,
            });
          }
        }
      );
    });
  } catch (err: any) {
    console.warn('Direct Storage access failed, using in-memory data URL fallback:', err.message);
    const base64Url = await fileToBase64(file);
    if (onProgress) onProgress(100);
    return {
      downloadUrl: base64Url,
      storagePath: uniqueStoragePath,
      isFallbackDataUrl: true,
    };
  }
}
