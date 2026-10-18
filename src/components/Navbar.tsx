import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { ActiveTab } from '../types';
import { sfx } from '../utils/audio';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  isPuzzleUnlocked: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isMuted,
  setIsMuted,
  isPuzzleUnlocked,
}) => {
  const [showCopiedToast, setShowCopiedToast] = React.useState<boolean>(false);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    sfx.setMuted(next);
    if (!next) {
      sfx.playSparkle();
    }
  };

  const handleNavClick = (tab: ActiveTab) => {
    sfx.playPop();
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-pink-100 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 md:px-8 py-3.5">
        
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => handleNavClick('puzzle')}
          className="text-lg md:text-xl font-serif-glam font-extrabold tracking-tight text-pink-700 whitespace-nowrap shrink-0 flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <span>Aymen Riaz</span>
          <span className="text-amber-500">👑</span>
        </button>

        {/* Zone 2: 4 single-line text navigation links */}
        <nav className="flex items-center gap-4 md:gap-7 text-xs md:text-sm font-medium text-slate-600 overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleNavClick('puzzle')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'puzzle'
                ? 'text-pink-600 font-bold border-b-2 border-pink-500'
                : 'hover:text-slate-900'
            }`}
          >
            VIP Puzzle
          </button>

          <button
            onClick={() => handleNavClick('coloring')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'coloring'
                ? 'text-pink-600 font-bold border-b-2 border-pink-500'
                : 'hover:text-slate-900'
            }`}
          >
            Coloring Studio
          </button>

          <button
            onClick={() => handleNavClick('meter')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'meter'
                ? 'text-pink-600 font-bold border-b-2 border-pink-500'
                : 'hover:text-slate-900'
            }`}
          >
            Jalan Meter 🔥
          </button>

          <button
            onClick={() => handleNavClick('finale')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'finale'
                ? 'text-pink-600 font-bold border-b-2 border-pink-500'
                : 'hover:text-slate-900'
            }`}
          >
            Grand Finale 💥
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 shrink-0 relative">
          <button
            onClick={() => {
              sfx.playSparkle();
              navigator.clipboard.writeText(window.location.href);
              setShowCopiedToast(true);
              setTimeout(() => setShowCopiedToast(false), 3000);
            }}
            title="Copy App Link"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Share Link</span>
            <span>🔗</span>
          </button>

          {showCopiedToast && (
            <div className="absolute top-10 right-0 z-50 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap animate-bounce">
              👑 Link Copied! Send to besties 🔥
            </div>
          )}

          <button
            onClick={toggleSound}
            title={isMuted ? 'Turn on Sound FX' : 'Mute Sound FX'}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-pink-200 text-pink-700 bg-pink-50 hover:bg-pink-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-pink-600 animate-pulse" />
                <span className="hidden sm:inline">Audio</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
