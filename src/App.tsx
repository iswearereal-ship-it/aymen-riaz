/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PuzzleGame } from './components/PuzzleGame';
import { ColoringStudio } from './components/ColoringStudio';
import { JalanMeter } from './components/JalanMeter';
import { GrandFinale } from './components/GrandFinale';
import { PhotoLockerModal } from './components/PhotoLockerModal';
import { ActiveTab } from './types';
import { sfx } from './utils/audio';
import { Sparkles, Heart, Lock, ShieldCheck } from 'lucide-react';
import { fetchServerPhotos, savePhotosToServer, storage } from './utils/imageStorage';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('puzzle');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPuzzleUnlocked, setIsPuzzleUnlocked] = useState<boolean>(false);
  const [isLockerOpen, setIsLockerOpen] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Sync photos between server disk and client on startup
  useEffect(() => {
    async function syncStorage() {
      try {
        const serverData = await fetchServerPhotos();
        if (serverData && (serverData.puzzlePhoto || serverData.finalePhoto || serverData.slotPhotos)) {
          // Server has data, update client localStorage
          if (serverData.puzzlePhoto) storage.set('aymen_puzzle_photo', serverData.puzzlePhoto);
          if (serverData.finalePhoto) storage.set('aymen_finale_photo', serverData.finalePhoto);
          if (serverData.slotPhotos) storage.setJSON('aymen_custom_photos_by_slot', serverData.slotPhotos);
          setRefreshKey((k) => k + 1);
        } else {
          // If server empty but client had local photos, automatically upload to server
          const localPuzzle = storage.get('aymen_puzzle_photo', '');
          const localFinale = storage.get('aymen_finale_photo', '');
          const localSlots = storage.getJSON<Record<string, string>>('aymen_custom_photos_by_slot', {});

          if (localPuzzle || localFinale || Object.keys(localSlots).length > 0) {
            await savePhotosToServer({
              puzzlePhoto: localPuzzle,
              finalePhoto: localFinale,
              slotPhotos: localSlots,
            });
          }
        }
      } catch (err) {
        console.warn('Sync failed:', err);
      }
    }
    syncStorage();
  }, []);

  const handlePuzzleUnlocked = () => {
    setIsPuzzleUnlocked(true);
    setTimeout(() => {
      setActiveTab('coloring');
    }, 1200);
  };

  const handlePhotosUpdated = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div key={refreshKey} className="min-h-screen flex flex-col bg-gradient-to-b from-rose-50/60 via-pink-50/40 to-rose-100/40 text-slate-800 relative selection:bg-pink-300 selection:text-pink-900">
      
      {/* Background Floating Ambient Sparkles (CSS only, no layout shifts) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <div className="absolute top-12 left-10 text-pink-300 text-xl animate-sparkle">✨</div>
        <div className="absolute top-1/4 right-14 text-pink-400 text-2xl animate-sparkle" style={{ animationDelay: '1s' }}>💖</div>
        <div className="absolute bottom-1/3 left-16 text-rose-300 text-lg animate-sparkle" style={{ animationDelay: '2s' }}>💎</div>
        <div className="absolute bottom-20 right-20 text-pink-400 text-xl animate-sparkle" style={{ animationDelay: '1.5s' }}>👑</div>
      </div>

      {/* Top Navbar adhering to Top Bar Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        isPuzzleUnlocked={isPuzzleUnlocked}
      />

      {/* Main Content Area */}
      <main className="flex-1 z-10">
        {activeTab === 'puzzle' && (
          <PuzzleGame
            onUnlockSuccess={handlePuzzleUnlocked}
            isUnlocked={isPuzzleUnlocked}
          />
        )}

        {activeTab === 'coloring' && (
          <ColoringStudio
            onGoToFinale={() => {
              sfx.playSparkle();
              setActiveTab('finale');
            }}
          />
        )}

        {activeTab === 'meter' && <JalanMeter />}

        {activeTab === 'finale' && (
          <GrandFinale
            onBackToStudio={() => {
              sfx.playPop();
              setActiveTab('coloring');
            }}
          />
        )}
      </main>

      {/* Photo Locker Modal for Aymen */}
      <PhotoLockerModal
        isOpen={isLockerOpen}
        onClose={() => setIsLockerOpen(false)}
        onPhotosUpdated={handlePhotosUpdated}
      />

      {/* Tasteful Clean Footer */}
      <footer className="mt-auto border-t border-pink-200/60 bg-white/60 backdrop-blur-xs py-5 px-4 text-center z-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium text-pink-700">
            <span>Queen Aymen Riaz VIP Edition</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              Barbie Pink World <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick button to open Photo Locker */}
            <button
              onClick={() => {
                sfx.playPop();
                setIsLockerOpen(true);
              }}
              className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-pink-100/70 hover:bg-pink-100 text-pink-700 font-bold text-[11px] border border-pink-200 cursor-pointer transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Lock / Set Photos</span>
            </button>

            <span className="text-slate-400 hidden md:inline">
              Dostiyon ke dil pe bijliyan girana humara shouq hai 💅
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
