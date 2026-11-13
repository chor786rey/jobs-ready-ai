import React from 'react';
import { Smartphone, ShieldCheck, Share2, DollarSign, Laptop, Facebook, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Logo } from './Logo';
import { auth, googleProvider, signInWithPopup, fbSignOut } from '../lib/firebase';

interface HeaderProps {
  onOpenAndroidCenter: () => void;
  onOpenPricing: () => void;
  onOpenMarketing: () => void;
  isRecruiterMode: boolean;
  onToggleRecruiterMode: () => void;
  isAndroidFrameMode: boolean;
  onToggleAndroidFrameMode: () => void;
  currentUser?: any;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAndroidCenter,
  onOpenPricing,
  onOpenMarketing,
  isRecruiterMode,
  onToggleRecruiterMode,
  isAndroidFrameMode,
  onToggleAndroidFrameMode,
  currentUser,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.warn('Google Sign-in prompt:', err?.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2B3340]/90 bg-[#0C1017]/92 backdrop-blur-xl px-3 sm:px-6 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Brand Logo & Wordmark */}
        <div
          className="flex items-center gap-3 cursor-pointer shrink-0 group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="relative flex items-center justify-center rounded-xl ring-1 ring-[#FFB319]/25 shadow-lg shadow-black/40 transition-transform duration-200 group-hover:scale-105">
            <Logo size={38} />
          </div>
          <div className="leading-tight">
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#F4F1EA] whitespace-nowrap">
              JobReady <span className="luxury-gold-text">AI</span>
            </span>
            <p className="hidden md:block text-[11px] font-medium text-[#949EB0] whitespace-nowrap">
              696969 Marketing · <span className="text-[#F7D07A]">Abhinandan Pandey</span>
            </p>
          </div>
        </div>

        {/* Luxury Utility Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <a
            href="https://www.facebook.com/share/1CE62Y7JGU/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 rounded-lg bg-[#131924] hover:bg-[#1D2533] border border-[#2B3340] hover:border-[#FFB319]/35 px-2.5 py-1.5 text-xs font-semibold text-[#C6CCD8] hover:text-[#F7D07A] transition whitespace-nowrap shrink-0"
            title="Official Facebook Page: 696969 Marketing"
          >
            <Facebook className="h-3.5 w-3.5 text-[#FFB319]" />
            <span className="hidden xl:inline">Community</span>
          </a>

          <button
            type="button"
            onClick={onToggleAndroidFrameMode}
            className={`hidden lg:flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition border whitespace-nowrap shrink-0 ${
              isAndroidFrameMode
                ? 'bg-[#FFB319]/12 text-[#F7D07A] border-[#FFB319]/40'
                : 'bg-[#131924] text-[#C6CCD8] border-[#2B3340] hover:border-[#FFB319]/30 hover:text-white'
            }`}
            title="Toggle Android Device Frame Preview"
          >
            {isAndroidFrameMode ? (
              <>
                <Laptop className="h-3.5 w-3.5 text-[#FFB319]" />
                <span>Desktop View</span>
              </>
            ) : (
              <>
                <Smartphone className="h-3.5 w-3.5 text-[#FFB319]" />
                <span>Android Frame</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onToggleRecruiterMode}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition border whitespace-nowrap shrink-0 ${
              isRecruiterMode
                ? 'bg-[#FFB319]/15 text-[#F7D07A] border-[#FFB319]/45'
                : 'bg-[#131924] text-[#C6CCD8] border-[#2B3340] hover:border-[#FFB319]/30 hover:text-white'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#FFB319]" />
            <span className="hidden sm:inline">{isRecruiterMode ? 'Recruiter Mode' : 'Candidate Mode'}</span>
            <span className="sm:hidden">{isRecruiterMode ? 'HR' : 'User'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenMarketing}
            className="flex items-center gap-1.5 rounded-lg bg-[#131924] border border-[#2B3340] hover:border-[#FFB319]/30 px-2.5 py-1.5 text-xs font-semibold text-[#C6CCD8] hover:text-white transition whitespace-nowrap shrink-0"
            title="Growth & Launch Marketing Kit"
          >
            <Share2 className="h-3.5 w-3.5 text-[#FFB319]" />
            <span className="hidden md:inline">Launch Kit</span>
          </button>

          <button
            type="button"
            onClick={onOpenPricing}
            className="flex items-center gap-1 rounded-lg bg-[#FFB319]/10 hover:bg-[#FFB319]/18 border border-[#FFB319]/35 px-2.5 py-1.5 text-xs font-bold text-[#F7D07A] transition whitespace-nowrap shrink-0"
          >
            <DollarSign className="h-3.5 w-3.5 text-[#FFB319]" />
            <span>Plans</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-[#131924] border border-[#2B3340] rounded-lg px-2 py-1 shrink-0">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Avatar" className="h-5 w-5 rounded-full object-cover ring-1 ring-[#FFB319]/40" />
              ) : (
                <UserIcon className="h-4 w-4 text-[#FFB319]" />
              )}
              <span className="hidden lg:inline text-[11px] font-semibold text-[#E5E8EE] truncate max-w-[100px]">
                {currentUser.displayName || currentUser.email?.split('@')[0]}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="p-1 text-[#949EB0] hover:text-rose-400 transition"
                title="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSignIn}
              className="flex items-center gap-1 rounded-lg bg-[#131924] hover:bg-[#1D2533] border border-[#2B3340] hover:border-[#FFB319]/35 px-2.5 py-1.5 text-xs font-semibold text-[#E5E8EE] transition whitespace-nowrap shrink-0"
              title="Sign in with Google Firebase Auth"
            >
              <LogIn className="h-3.5 w-3.5 text-[#FFB319]" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (isInstallable) {
                install();
              } else {
                onOpenAndroidCenter();
              }
            }}
            className="luxury-gold-btn flex items-center gap-1.5 rounded-lg px-3 sm:px-3.5 py-1.5 text-xs font-extrabold transition active:scale-95 whitespace-nowrap shrink-0"
            title="Launch on Android / Install PWA"
          >
            <Smartphone className="h-3.5 w-3.5 text-[#0C1017]" />
            <span>{isInstalled ? 'Android App' : 'Get App'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
