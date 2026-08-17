import React, { useState, useRef } from 'react';
import { Upload, X, Check, AlertCircle, RefreshCw, Link as LinkIcon, Image as ImageIcon, Camera, ShieldCheck, Info } from 'lucide-react';
import { uploadArchivalImage, validateImageFile, StorageFolder } from '../../services/storage';

interface ImageUploadDropzoneProps {
  value?: string;
  sourceValue?: string;
  creditValue?: string;
  onChange: (url: string, source?: string, credit?: string) => void;
  folder?: StorageFolder;
  label?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  required?: boolean;
}

export const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({
  value = '',
  sourceValue = '',
  creditValue = '',
  onChange,
  folder = 'gallery',
  label = 'Upload Archival Imagery',
  aspectRatio = 'square',
  required = false,
}) => {
  const [imageUrl, setImageUrl] = useState(value);
  const [source, setSource] = useState(sourceValue);
  const [credit, setCredit] = useState(creditValue);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setUploadError(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid image file.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const result = await uploadArchivalImage(file, folder, (progress) => {
        setUploadProgress(progress);
      });
      setImageUrl(result.downloadUrl);
      onChange(result.downloadUrl, source, credit);
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setUploadError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    onChange('', source, credit);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSourceChange = (newSource: string) => {
    setSource(newSource);
    onChange(imageUrl, newSource, credit);
  };

  const handleCreditChange = (newCredit: string) => {
    setCredit(newCredit);
    onChange(imageUrl, source, newCredit);
  };

  const handleUrlSubmit = (url: string) => {
    setImageUrl(url);
    onChange(url, source, credit);
  };

  const quickSourcePresets = [
    'Official Album/Single Cover Art (Shatta Movement Records)',
    'Wikimedia Commons (Creative Commons / Public Domain)',
    'Official Press Kit & Stills (Zylofon / SM Media)',
    'Official Music Video Thumbnail / Screen Grab',
    'Charterhouse / VGMA Official Archives',
    'Personal Rights & Verified Permission',
  ];

  return (
    <div className="space-y-3 p-4 rounded-xl bg-[#14100E] border border-[#332720] text-xs">
      <div className="flex items-center justify-between">
        <label className="text-white font-bold uppercase tracking-wider flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#D4820A]" />
          <span>{label} {required && <span className="text-red-400">*</span>}</span>
        </label>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#1A1512] p-0.5 rounded-lg border border-[#332720]">
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
              inputMode === 'upload' ? 'bg-[#D4820A] text-black' : 'text-[#A89F91] hover:text-white'
            }`}
          >
            File Upload
          </button>
          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
              inputMode === 'url' ? 'bg-[#D4820A] text-black' : 'text-[#A89F91] hover:text-white'
            }`}
          >
            Direct URL
          </button>
        </div>
      </div>

      {/* Upload Zone or Preview */}
      {imageUrl ? (
        <div className="relative rounded-lg overflow-hidden border border-[#332720] bg-black group max-h-60 flex items-center justify-center">
          <img
            src={imageUrl}
            alt="Preview"
            className="max-h-56 w-auto object-contain rounded"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-[#D4820A] text-black font-bold text-xs uppercase flex items-center gap-1 shadow"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace</span>
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="px-3 py-1.5 rounded-lg bg-red-900/80 hover:bg-red-800 text-white font-bold text-xs uppercase flex items-center gap-1 shadow"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
            <Check className="w-3 h-3" />
            <span>Image Attached</span>
          </div>
        </div>
      ) : inputMode === 'upload' ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
            isDragOver
              ? 'border-[#F2A93C] bg-[#D4820A]/10 scale-[0.99]'
              : 'border-[#332720] hover:border-[#D4820A]/50 bg-[#1A1512]/60 hover:bg-[#1A1512]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#D4820A]/20 border border-[#D4820A]/40 flex items-center justify-center text-[#F2A93C]">
              {isUploading ? (
                <RefreshCw className="w-5 h-5 animate-spin text-[#F2A93C]" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>

            {isUploading ? (
              <div className="w-full max-w-xs space-y-1.5">
                <p className="text-white font-bold text-xs">Uploading to Firebase Storage...</p>
                <div className="w-full h-1.5 bg-[#261E18] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4820A] to-[#F2A93C] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#A89F91]">{uploadProgress}% complete</span>
              </div>
            ) : (
              <>
                <p className="text-[#F5EFE6] font-semibold text-xs">
                  <span className="text-[#F2A93C] underline">Click to choose image</span> or drag and drop here
                </p>
                <p className="text-[10px] text-[#A89F91]">
                  Supports high-resolution JPEG, PNG, WebP, SVG (up to 12 MB)
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Direct URL Input */
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="url"
              placeholder="https://upload.wikimedia.org/... or verified image URL"
              value={imageUrl}
              onChange={(e) => handleUrlSubmit(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] focus:border-[#D4820A] text-white text-xs"
            />
          </div>
          <p className="text-[10px] text-[#A89F91]">
            Ensure the direct URL is hosted on Wikimedia Commons or official release platforms.
          </p>
        </div>
      )}

      {uploadError && (
        <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-[11px] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Mandatory Attribution & Source Metadata Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#332720]/60">
        <div>
          <label className="text-[#A89F91] uppercase font-bold text-[10px] block mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#D4820A]" />
            <span>Image Source / Licensing *</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Wikimedia Commons (CC BY-SA), Official SM Press Kit 2018"
            value={source}
            onChange={(e) => handleSourceChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] focus:border-[#D4820A] text-white text-xs"
          />
        </div>

        <div>
          <label className="text-[#A89F91] uppercase font-bold text-[10px] block mb-1 flex items-center gap-1">
            <Camera className="w-3 h-3 text-[#D4820A]" />
            <span>Photographer / Designer Credit</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Photo by Kwaku / SM Media Team, Art by Zylofon"
            value={credit}
            onChange={(e) => handleCreditChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#1A1512] border border-[#332720] focus:border-[#D4820A] text-white text-xs"
          />
        </div>
      </div>

      {/* Quick Presets */}
      <div>
        <span className="text-[10px] text-[#A89F91] font-semibold block mb-1">Quick Source Presets:</span>
        <div className="flex flex-wrap gap-1.5">
          {quickSourcePresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSourceChange(preset)}
              className="px-2 py-0.5 rounded bg-[#1A1512] hover:bg-[#261E18] text-[#A89F91] hover:text-[#F2A93C] border border-[#332720] text-[9px] transition-colors truncate max-w-full"
            >
              + {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Sourcing Guidelines Notice */}
      <div className="p-2.5 rounded-lg bg-[#1F1813]/60 border border-[#D4820A]/20 flex items-start gap-2 text-[10px] text-[#A89F91]">
        <Info className="w-3.5 h-3.5 text-[#D4820A] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#F2A93C]">Archival Image Sourcing Rules:</strong> Only upload images sourced from Wikimedia Commons (Creative Commons/Public Domain), official press kits, official album/single cover art, or images with documented permissions. Uncredited stock photos are strictly avoided.
        </div>
      </div>
    </div>
  );
};
