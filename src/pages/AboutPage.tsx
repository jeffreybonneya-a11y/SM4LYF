import React from 'react';
import { SM4LYFLogo } from '../components/common/SM4LYFLogo';
import { ShieldCheck, Music, Heart, BookOpen, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4 border-b border-[#332720] pb-10">
        <div className="inline-flex flex-col items-center mb-2">
          <SM4LYFLogo size="lg" animated />
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white font-heading">
          The SM4LYF Legacy Project
        </h1>

        <p className="text-sm sm:text-base text-[#A89F91] max-w-2xl mx-auto leading-relaxed">
          An open digital archive, cultural documentation center, and living museum honoring the musical innovation and historical legacy of Ghanaian Dancehall pioneer Shatta Wale.
        </p>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#14100E] border-2 border-[#D4820A]/40 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[#D4820A]" />
          <h2 className="text-lg font-bold text-white font-heading">
            Official Independence & Transparency Notice
          </h2>
        </div>

        <p className="text-sm text-[#F5EFE6] leading-relaxed">
          <strong>SM4LYF Legacy</strong> is an independent, fan-created digital archive documenting the music and career of Shatta Wale. It is not an official Shatta Wale, Shatta Movement, or SM4LYF property, and is not affiliated with or endorsed by Shatta Wale or his management unless explicitly stated.
        </p>

        <p className="text-xs text-[#A89F91] leading-relaxed pt-2 border-t border-[#332720]">
          This archive is strictly non-commercial and adheres to copyright-safe architecture. No audio files or copyrighted musical recordings are hosted or stored on this server. All discography cards link directly out to verified artist channels on Spotify, Apple Music, YouTube, Audiomack, and Boomplay.
        </p>
      </div>

      {/* Mission & Purpose */}
      <div className="space-y-8">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white font-heading">
            Archival Mission
          </h2>
          <p className="text-sm text-[#A89F91] leading-relaxed">
            African contemporary music history moves fast. Without meticulous digital preservation, historic milestones—such as the early 2000s Bandana breakthrough, the 2013 rebirth of the Shatta Movement, the landmark 20,000 capacity Reign concert at Fantasy Dome, and the transatlantic Beyoncé collaboration on <em>The Lion King: The Gift</em>—risk becoming fragmented across ephemeral social feeds.
          </p>
          <p className="text-sm text-[#A89F91] leading-relaxed">
            <strong>SM4LYF Legacy</strong> establishes a structured, permanent record for musicologists, cultural historians, and millions of worldwide Shatta Movement fans.
          </p>
        </div>

        {/* Curatorial Principles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-[#1A1512] border border-[#332720] space-y-2">
            <div className="flex items-center gap-2 text-[#D4820A] text-sm font-bold font-heading">
              <CheckCircle2 className="w-4 h-4" />
              <span>1. Factual Integrity</span>
            </div>
            <p className="text-xs text-[#A89F91] leading-relaxed">
              Every single award, chart position, release date, and concert attendance number is cross-referenced with official records, newspaper archives, or verified streaming catalogues.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#1A1512] border border-[#332720] space-y-2">
            <div className="flex items-center gap-2 text-[#C9A24B] text-sm font-bold font-heading">
              <CheckCircle2 className="w-4 h-4" />
              <span>2. Audio Copyright Safety</span>
            </div>
            <p className="text-xs text-[#A89F91] leading-relaxed">
              We never host or distribute audio. Fans are directed to legal streaming stores to ensure that royalties and streaming metrics flow directly to the creator.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#1A1512] border border-[#332720] space-y-2">
            <div className="flex items-center gap-2 text-[#F2A93C] text-sm font-bold font-heading">
              <CheckCircle2 className="w-4 h-4" />
              <span>3. Visual Attribution</span>
            </div>
            <p className="text-xs text-[#A89F91] leading-relaxed">
              Photographs, stage footage, and music video stills are credited with documented photographer, agency, or directorial attribution wherever available.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#1A1512] border border-[#332720] space-y-2">
            <div className="flex items-center gap-2 text-[#D4820A] text-sm font-bold font-heading">
              <CheckCircle2 className="w-4 h-4" />
              <span>4. Living Community Catalog</span>
            </div>
            <p className="text-xs text-[#A89F91] leading-relaxed">
              Authorized archivist administrators can continuously update, annotate, and enrich track stories and historical citations via the protected Curator Portal.
            </p>
          </div>
        </div>

        {/* Emotional Arc Summary */}
        <div className="p-6 rounded-xl bg-[#14100E] border border-[#332720] text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C9A24B]">
            The Archival Narrative
          </span>
          <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex-wrap">
            <span>Street</span>
            <span className="text-[#D4820A]">→</span>
            <span>Music</span>
            <span className="text-[#D4820A]">→</span>
            <span>Energy</span>
            <span className="text-[#D4820A]">→</span>
            <span>King</span>
            <span className="text-[#D4820A]">→</span>
            <span className="text-[#F2A93C]">Legacy</span>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <button
            onClick={() => onNavigate('/music')}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all inline-flex items-center gap-2"
          >
            <span>Explore the Music Archive</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
