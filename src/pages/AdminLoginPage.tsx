import React, { useState } from 'react';
import { SM4LYFLogo } from '../components/common/SM4LYFLogo';
import { loginWithEmail, AdminUser } from '../services/auth';
import { ShieldCheck, Lock, Mail, Key, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBack: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('curator@sm4lyflegacy.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await loginWithEmail(email, password);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setError(null);
    setLoading(true);
    try {
      const user = await loginWithEmail('curator@sm4lyflegacy.com', 'SM4LYF@2026');
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      <div className="max-w-md w-full space-y-8 bg-[#14100E] border border-[#332720] rounded-2xl p-8 shadow-2xl relative">
        
        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 text-xs text-[#A89F91] hover:text-[#F2A93C] flex items-center gap-1.5 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        {/* Brand */}
        <div className="text-center space-y-3 pt-6">
          <SM4LYFLogo size="md" />
          <h2 className="text-2xl font-black text-white font-heading tracking-wide">
            Curator Access Portal
          </h2>
          <p className="text-xs text-[#A89F91]">
            Authorized archivist credentials required to manage discography, awards, and records.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-red-950/60 border border-red-800/80 text-xs text-red-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#A89F91] uppercase tracking-wider block">
              Curator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#C9A24B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="curator@sm4lyflegacy.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#1A1512] border border-[#332720] focus:border-[#D4820A] text-sm text-white placeholder-[#A89F91]/50 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#A89F91] uppercase tracking-wider block">
              Curator Passcode / Security Key
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-[#C9A24B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#1A1512] border border-[#332720] focus:border-[#D4820A] text-sm text-white placeholder-[#A89F91]/50 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4820A] to-[#F2A93C] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In as Chief Archivist'}
          </button>
        </form>

        {/* Quick Demo Access for immediate testing */}
        <div className="pt-4 border-t border-[#332720]/80 text-center space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#A89F91]">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A24B]" />
            <span>Developer / Preview Quick Pass:</span>
          </div>
          <button
            onClick={handleQuickDemo}
            type="button"
            className="w-full py-2.5 rounded-lg bg-[#1A1512] hover:bg-[#261E18] text-[#F2A93C] border border-[#332720] hover:border-[#D4820A]/50 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            1-Click Curator Demo Login (Passcode: SM4LYF@2026)
          </button>
        </div>

      </div>
    </div>
  );
};
