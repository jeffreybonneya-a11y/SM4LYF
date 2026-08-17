import React, { useState, useEffect } from 'react';
import { SM4LYFLogo } from './SM4LYFLogo';
import { 
  Music, 
  Clock, 
  Award, 
  Info, 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  Sparkles,
  Disc3
} from 'lucide-react';
import { AdminUser } from '../../services/auth';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  adminUser: AdminUser | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, adminUser }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Archive', path: '/music', icon: Music },
    { label: 'Timeline', path: '/timeline', icon: Clock },
    { label: 'Legacy & Honors', path: '/achievements', icon: Award },
    { label: 'Story', path: '/about', icon: Info },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#332720]/80 shadow-2xl py-2.5'
          : 'bg-gradient-to-b from-[#0A0A0A]/90 via-[#0A0A0A]/60 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <button
          id="nav-logo-btn"
          onClick={() => handleNavClick('/')}
          className="flex items-center gap-3 group focus:outline-none"
          aria-label="SM4LYF Legacy Homepage"
        >
          <SM4LYFLogo size="sm" showText={false} animated />
          <div className="flex flex-col items-start text-left">
            <span className="text-sm sm:text-base font-black tracking-wider text-white group-hover:text-[#F2A93C] transition-colors font-heading leading-tight">
              SM4LYF LEGACY
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.2em] text-[#C9A24B] uppercase font-semibold">
              The Shatta Wale Archive
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav id="desktop-nav" className="hidden lg:flex items-center gap-2 xl:gap-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                key={link.path}
                id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleNavClick(link.path)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 relative ${
                  isActive
                    ? 'text-[#F2A93C] bg-[#1A1512] border border-[#D4820A]/40 shadow-sm'
                    : 'text-[#F5EFE6]/80 hover:text-white hover:bg-[#1A1512]/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4820A]' : 'text-[#A89F91]'}`} />
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-[#D4820A] to-[#F2A93C] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls: Search & Admin */}
        <div className="flex items-center gap-2.5">
          {/* Global Search Button */}
          <button
            id="nav-search-btn"
            onClick={() => handleNavClick('/search')}
            className={`p-2 sm:px-3 sm:py-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 ${
              currentPath === '/search'
                ? 'bg-[#D4820A]/20 border-[#D4820A] text-[#F2A93C]'
                : 'bg-[#1A1512]/80 border-[#332720] text-[#F5EFE6] hover:border-[#D4820A]/50 hover:text-[#F2A93C]'
            }`}
            aria-label="Search Archive"
          >
            <Search className="w-4 h-4 text-[#C9A24B]" />
            <span className="hidden md:inline text-xs text-[#A89F91]">Search Archive</span>
          </button>

          {/* Admin Dashboard Portal / Status */}
          {adminUser ? (
            <button
              id="nav-admin-dashboard-btn"
              onClick={() => handleNavClick('/admin')}
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:brightness-110 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Curator Portal</span>
            </button>
          ) : (
            <button
              id="nav-admin-login-btn"
              onClick={() => handleNavClick('/admin/login')}
              className="p-2 sm:px-3 sm:py-2 rounded-lg border border-[#332720] text-xs font-semibold text-[#A89F91] hover:text-[#F2A93C] hover:border-[#D4820A]/40 transition-colors"
              title="Curator Access"
              aria-label="Admin Login"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            id="nav-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#1A1512] border border-[#332720] text-[#F5EFE6] hover:text-[#F2A93C]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="lg:hidden bg-[#0F0C0A] border-b border-[#332720] px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-2xl"
        >
          <div className="flex items-center justify-center py-2 mb-2 border-b border-[#332720]/40">
            <SM4LYFLogo size="sm" />
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                id={`mobile-nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleNavClick(link.path)}
                className={`w-full px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-[#1A1512] text-[#F2A93C] border border-[#D4820A]/50 font-bold'
                    : 'text-[#F5EFE6] hover:bg-[#1A1512]/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4820A]' : 'text-[#C9A24B]'}`} />
                  <span>{link.label}</span>
                </div>
                {isActive && <span className="text-xs text-[#D4820A]">● Active</span>}
              </button>
            );
          })}

          <div className="pt-2 border-t border-[#332720]/80">
            <button
              id="mobile-nav-search-btn"
              onClick={() => handleNavClick('/search')}
              className="w-full px-4 py-3 rounded-lg bg-[#1A1512] border border-[#332720] text-sm text-[#F5EFE6] flex items-center gap-3 font-medium"
            >
              <Search className="w-4 h-4 text-[#C9A24B]" />
              <span>Search All Discography & Records</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
