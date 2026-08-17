import React, { useState, useEffect, useMemo } from 'react';
import { Achievement } from '../types';
import { getAchievements } from '../services/firestore';
import { 
  Award, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  Globe, 
  Calendar, 
  CheckCircle2,
  TrendingUp,
  Flame
} from 'lucide-react';

export const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImpact, setSelectedImpact] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getAchievements(true);
        setAchievements(data);
      } catch (e) {
        console.error('Error fetching achievements:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const impacts = ['Global', 'Continental', 'National', 'Historic Record'];

  const filteredAchievements = useMemo(() => {
    return achievements.filter(item => {
      const matchImpact = selectedImpact === 'all' || item.impactLevel === selectedImpact;
      const matchQuery = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.awardBody.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchImpact && matchQuery;
    });
  }, [achievements, selectedImpact, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 space-y-12">
      
      {/* Header */}
      <div className="space-y-4 text-center md:text-left border-b border-[#332720] pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1512] border border-[#D4820A]/40 text-xs font-semibold uppercase tracking-wider text-[#F2A93C]">
          <Award className="w-3.5 h-3.5 text-[#D4820A]" />
          <span>Verified Honours & Chart Accolades</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black text-white font-heading">
          Achievements, Awards & Milestones
        </h1>
        
        <p className="text-sm sm:text-base text-[#A89F91] max-w-3xl leading-relaxed">
          A meticulously curated registry documenting Shatta Wale's international chart positions, 
          pan-African awards, civic citations, and verified music industry breakthroughs.
        </p>

        {/* Filters */}
        <div className="pt-4 flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search awards, bodies, records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[#1A1512] border border-[#332720] focus:border-[#D4820A] text-xs text-[#F5EFE6] placeholder-[#A89F91]/60 outline-none w-full sm:w-64"
          />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedImpact('all')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                selectedImpact === 'all'
                  ? 'bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black shadow-md'
                  : 'bg-[#1A1512] text-[#F5EFE6] hover:bg-[#261E18] border border-[#332720]'
              }`}
            >
              All Levels
            </button>
            {impacts.map(imp => (
              <button
                key={imp}
                onClick={() => setSelectedImpact(imp)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedImpact === imp
                    ? 'bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black shadow-md'
                    : 'bg-[#1A1512] text-[#F5EFE6] hover:bg-[#261E18] border border-[#332720]'
                }`}
              >
                {imp}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Honors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAchievements.map((item) => (
          <div
            key={item.id}
            className="p-6 sm:p-7 rounded-2xl bg-[#14100E] border border-[#332720] hover:border-[#D4820A]/60 transition-all hover:shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Year & Impact Level */}
              <div className="flex items-center justify-between gap-2 border-b border-[#332720]/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-[#F2A93C] font-heading">
                    {item.year}
                  </span>
                  <span className="text-xs text-[#A89F91]">
                    • {item.awardBody}
                  </span>
                </div>

                <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                  item.impactLevel === 'Global'
                    ? 'bg-[#C9A24B]/20 text-[#F2A93C] border border-[#C9A24B]/40'
                    : item.impactLevel === 'Continental'
                    ? 'bg-[#D4820A]/20 text-[#D4820A] border border-[#D4820A]/40'
                    : 'bg-[#1A1512] text-[#A89F91] border border-[#332720]'
                }`}>
                  {item.impactLevel}
                </span>
              </div>

              {/* Title & Category */}
              <div>
                <h3 className="text-xl font-bold text-white font-heading leading-snug">
                  {item.title}
                </h3>
                <span className="text-xs text-[#C9A24B] font-semibold mt-0.5 block">
                  Category: {item.category}
                </span>
                {item.workNominated && (
                  <span className="text-xs text-[#A89F91] mt-0.5 block">
                    Recognized Work: <strong className="text-white">{item.workNominated}</strong>
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#F5EFE6]/80 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Sourcing / Citation Link */}
            {item.sourceName && (
              <div className="pt-3 border-t border-[#332720]/60 flex items-center justify-between text-xs text-[#A89F91]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C9A24B]" />
                  <span className="truncate max-w-[200px]">Source: {item.sourceName}</span>
                </div>
                {item.sourceUrl && (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F2A93C] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
