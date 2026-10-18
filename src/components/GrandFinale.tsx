import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Flame, Volume2, RotateCcw, Share2, Heart, Award, ArrowLeft, Upload, RefreshCw } from 'lucide-react';
import { sfx } from '../utils/audio';
import { processAndCompressImage, storage } from '../utils/imageStorage';

const AYMEN_VIP_PORTRAIT = '/src/assets/images/aymen_vip_queen_1792326397317.jpg';
const DHAMAKA_FINISH_IMG = '/src/assets/images/aymen_dhamaka_finish_1792326398383.jpg';

interface GrandFinaleProps {
  onBackToStudio: () => void;
}

export const GrandFinale: React.FC<GrandFinaleProps> = ({ onBackToStudio }) => {
  const [exploded, setExploded] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [customPhoto, setCustomPhoto] = useState<string>(() => {
    return storage.get('aymen_finale_photo', '');
  });
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  const sassyQuotes = [
    "Dekha? Jal gayi na saari besties! 😎🔥",
    "Nobody can match Queen Aymen Riaz's aura! 👑💅",
    "Screen phat gayi itni glam thi Aymen! 💥✨",
    "Ab dost phone band kar ke ro rahi hain! 😭💖",
  ];

  // Fire multi-stage explosion confetti
  const triggerConfettiCannons = () => {
    const end = Date.now() + 3.5 * 1000;
    const colors = ['#ec4899', '#f43f5e', '#fbbf24', '#ffffff', '#a855f7'];

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 75,
        origin: { x: 0, y: 0.7 },
        colors: colors,
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 75,
        origin: { x: 1, y: 0.7 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleClickIt = () => {
    // 1. Play dramatic buildup click
    sfx.playPop();
    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          executeDhamaka();
          return null;
        }
        sfx.playPop();
        return prev - 1;
      });
    }, 450);
  };

  const executeDhamaka = () => {
    // Screen rumble & audio blast
    setIsShaking(true);
    sfx.playExplosion();
    triggerConfettiCannons();

    setTimeout(() => {
      setExploded(true);
      setIsShaking(false);
      setQuoteIndex(Math.floor(Math.random() * sassyQuotes.length));
    }, 400);
  };

  const resetDhamaka = () => {
    sfx.playSparkle();
    setExploded(false);
    setCountdown(null);
  };

  const handleCustomPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      sfx.playSparkle();
      const compressed = await processAndCompressImage(file, 600, 0.85);
      storage.set('aymen_finale_photo', compressed);
      setCustomPhoto(compressed);
    } catch (err) {
      console.error('Error saving finale photo:', err);
    }
  };

  const handleResetFinalePhoto = () => {
    sfx.playPop();
    storage.set('aymen_finale_photo', '');
    setCustomPhoto('');
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 transition-all ${isShaking ? 'animate-blast-shake' : ''}`}>
      
      {/* Before Blast View */}
      {!exploded ? (
        <div className="flex flex-col items-center text-center">
          
          {/* Top Pill & Announcement */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
            The Ultimate Grand Climax
          </div>

          <h2 className="text-3xl md:text-5xl font-serif-glam font-extrabold text-slate-900 tracking-tight mb-2">
            Aymen Riaz VIP Finale 👑
          </h2>
          <p className="text-sm md:text-base text-slate-600 max-w-lg mb-6">
            Doston ke hosh uranay ka waqt aa gaya hai! Neeche picture dekho aur button par click karo...
          </p>

          {/* Sassy Headline above the picture as requested: "oper likha ho ga click it" */}
          <div className="mb-4 animate-bounce">
            <span className="inline-block py-2 px-6 rounded-full bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-extrabold text-lg md:text-xl tracking-wider shadow-lg shadow-pink-300">
              👇 CLICK IT! 👇
            </span>
          </div>

          {/* Glamorous Framed Picture */}
          <div className="relative group max-w-sm w-full aspect-square mb-8">
            {/* Sparkling Aura glow behind */}
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity animate-pulse" />

            <div className="relative w-full h-full rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-white p-2.5">
              <img
                src={customPhoto || AYMEN_VIP_PORTRAIT}
                alt="Queen Aymen Riaz"
                className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Watermark badge on photo */}
              <div className="absolute bottom-5 left-5 right-5 p-2 rounded-xl bg-black/50 backdrop-blur-md text-white text-xs font-bold text-center border border-white/20">
                👑 Queen Aymen Riaz · Unstoppable Glam
              </div>
            </div>
          </div>

          {/* Big Action Button */}
          <div className="space-y-4 w-full max-w-xs">
            <button
              onClick={handleClickIt}
              disabled={countdown !== null}
              className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-extrabold text-lg tracking-wide shadow-xl shadow-rose-300 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <Flame className="w-6 h-6 text-yellow-300 animate-spin" />
              <span>{countdown !== null ? `DETONATING IN ${countdown}...` : '💥 CLICK IT! 💥'}</span>
            </button>

          </div>

        </div>
      ) : (
        /* Exploded Dhamaka State ("sara kuch ak dhamaky say phat jaye or finish likha aye") */
        <div className="flex flex-col items-center text-center animate-fadeIn">
          
          {/* Top Dramatic BOOM Finish Banner */}
          <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border-4 border-rose-300 mb-6 bg-pink-100">
            <img
              src={DHAMAKA_FINISH_IMG}
              alt="Dhamaka Finish Explosion"
              className="w-full h-64 md:h-80 object-cover"
              referrerPolicy="no-referrer"
            />
            
            {/* Big Finish Overlay badge */}
            <div className="absolute inset-0 bg-gradient-to-t from-pink-950/80 via-transparent to-black/30 flex flex-col items-center justify-end pb-6 px-4">
              <h1 className="text-4xl md:text-6xl font-black text-amber-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] tracking-wider uppercase mb-1">
                💥 FINISH! 💥
              </h1>
              <p className="text-white text-sm md:text-lg font-bold drop-shadow-md">
                DHAMAKA HO GAYA! GAME OVER FOR HATERS!
              </p>
            </div>
          </div>

          {/* Sassy Victory Announcement Box */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 border-2 border-pink-200 shadow-xl max-w-xl w-full text-center space-y-4 mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-pink-100 text-pink-600 text-2xl mb-1">
              👑
            </div>

            <h3 className="text-2xl md:text-3xl font-serif-glam font-bold text-slate-900">
              "{sassyQuotes[quoteIndex]}"
            </h3>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Queen Aymen Riaz ne sab ka band baja diya! Dostiyon ke dil pe aag lag gayi aur Barbie standard hamesha ke liye set ho gaya! 💅✨
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={resetDhamaka}
                className="flex items-center gap-2 py-3 px-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                Dhamaka Phir Se Karo! 🎆
              </button>

              <button
                onClick={onBackToStudio}
                className="flex items-center gap-2 py-3 px-6 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-all active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Coloring Studio 🎨
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
