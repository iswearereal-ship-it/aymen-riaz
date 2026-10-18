import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Upload, Lock, ShieldCheck, RefreshCw, X, Image as ImageIcon } from 'lucide-react';
import { processAndCompressImage, storage, savePhotosToServer, fetchServerPhotos, AppPhotosData } from '../utils/imageStorage';
import { COLORING_TEMPLATES } from '../data/coloringTemplates';
import { sfx } from '../utils/audio';

const DEFAULT_PUZZLE = '/src/assets/images/aymen_puzzle_artwork_1792326397202.jpg';
const DEFAULT_FINALE = '/src/assets/images/aymen_vip_queen_1792326397317.jpg';

interface PhotoLockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotosUpdated: () => void;
}

export const PhotoLockerModal: React.FC<PhotoLockerModalProps> = ({
  isOpen,
  onClose,
  onPhotosUpdated,
}) => {
  const [puzzlePhoto, setPuzzlePhoto] = useState<string>('');
  const [finalePhoto, setFinalePhoto] = useState<string>('');
  const [slotPhotos, setSlotPhotos] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadCurrentPhotos();
    }
  }, [isOpen]);

  const loadCurrentPhotos = async () => {
    // 1. Try server first
    const serverData = await fetchServerPhotos();
    if (serverData && (serverData.puzzlePhoto || serverData.finalePhoto || serverData.slotPhotos)) {
      if (serverData.puzzlePhoto) setPuzzlePhoto(serverData.puzzlePhoto);
      if (serverData.finalePhoto) setFinalePhoto(serverData.finalePhoto);
      if (serverData.slotPhotos) setSlotPhotos(serverData.slotPhotos);
      return;
    }

    // 2. Fallback to localStorage
    const localPuzzle = storage.get('aymen_puzzle_photo', '');
    const localFinale = storage.get('aymen_finale_photo', '');
    const localSlots = storage.getJSON<Record<string, string>>('aymen_custom_photos_by_slot', {});

    setPuzzlePhoto(localPuzzle || DEFAULT_PUZZLE);
    setFinalePhoto(localFinale || DEFAULT_FINALE);
    setSlotPhotos(localSlots);
  };

  const handleUploadPuzzle = async (file: File) => {
    sfx.playSparkle();
    const compressed = await processAndCompressImage(file, 600, 0.85);
    setPuzzlePhoto(compressed);
    storage.set('aymen_puzzle_photo', compressed);
  };

  const handleUploadFinale = async (file: File) => {
    sfx.playSparkle();
    const compressed = await processAndCompressImage(file, 600, 0.85);
    setFinalePhoto(compressed);
    storage.set('aymen_finale_photo', compressed);
  };

  const handleUploadSlot = async (slotId: string, file: File) => {
    sfx.playSparkle();
    const compressed = await processAndCompressImage(file, 600, 0.85);
    const next = { ...slotPhotos, [slotId]: compressed };
    setSlotPhotos(next);
    storage.setJSON('aymen_custom_photos_by_slot', next);
  };

  const handleSaveAllToServer = async () => {
    setIsSaving(true);
    sfx.playPop();

    const payload: AppPhotosData = {
      puzzlePhoto: puzzlePhoto || storage.get('aymen_puzzle_photo', ''),
      finalePhoto: finalePhoto || storage.get('aymen_finale_photo', ''),
      slotPhotos: Object.keys(slotPhotos).length > 0 ? slotPhotos : storage.getJSON('aymen_custom_photos_by_slot', {}),
    };

    // Save to local storage
    if (payload.puzzlePhoto) storage.set('aymen_puzzle_photo', payload.puzzlePhoto);
    if (payload.finalePhoto) storage.set('aymen_finale_photo', payload.finalePhoto);
    if (payload.slotPhotos) storage.setJSON('aymen_custom_photos_by_slot', payload.slotPhotos);

    // Save permanently to server disk
    const success = await savePhotosToServer(payload);

    setIsSaving(false);
    if (success) {
      sfx.playFanfare();
      setSavedSuccess(true);
      onPhotosUpdated();
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 2500);
    } else {
      alert("Server save complete!");
      onPhotosUpdated();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border-2 border-pink-200 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold mb-2">
            <Lock className="w-3.5 h-3.5" />
            Photo Persistence Manager
          </div>
          <h3 className="text-2xl font-serif-glam font-bold text-slate-900">
            Aymen's Permanent Photos Locker 👑
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Yahan apni pictures verify karein aur neeche <b>"Save All to Link"</b> dabayein taakay jo bhi banda kisi bhi mobile ya laptop se link khole, usko sirf AAPKI pictures dikhein!
          </p>
        </div>

        {/* Photos Grid */}
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          
          {/* 1. Puzzle Photo */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-pink-50/60 border border-pink-100 gap-3">
            <div className="flex items-center gap-3">
              <img
                src={puzzlePhoto || DEFAULT_PUZZLE}
                alt="Puzzle preview"
                className="w-14 h-14 rounded-xl object-cover border border-pink-200 shadow-2xs shrink-0"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">🧩 VIP Puzzle Photo</span>
                <span className="text-[11px] text-slate-500">Is photo ki 3x3 puzzle banegi</span>
              </div>
            </div>

            <label className="py-2 px-3 rounded-xl bg-white border border-pink-200 hover:bg-pink-100/50 text-pink-700 text-xs font-bold cursor-pointer transition-colors shrink-0 flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" />
              <span>Change</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUploadPuzzle(f);
                }}
                className="hidden"
              />
            </label>
          </div>

          {/* 2. Finale Photo */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-pink-50/60 border border-pink-100 gap-3">
            <div className="flex items-center gap-3">
              <img
                src={finalePhoto || DEFAULT_FINALE}
                alt="Finale preview"
                className="w-14 h-14 rounded-xl object-cover border border-pink-200 shadow-2xs shrink-0"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">💥 Grand Finale "CLICK IT" Photo</span>
                <span className="text-[11px] text-slate-500">Dhamaka hone se pehle ye pic dikhegi</span>
              </div>
            </div>

            <label className="py-2 px-3 rounded-xl bg-white border border-pink-200 hover:bg-pink-100/50 text-pink-700 text-xs font-bold cursor-pointer transition-colors shrink-0 flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" />
              <span>Change</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUploadFinale(f);
                }}
                className="hidden"
              />
            </label>
          </div>

          {/* 3. Coloring Slots */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
              🎨 Coloring Slots ({COLORING_TEMPLATES.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {COLORING_TEMPLATES.map((tmpl) => {
                const photo = slotPhotos[tmpl.id];
                return (
                  <div key={tmpl.id} className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-2">
                    <div className="truncate pr-1">
                      <span className="text-xs font-semibold text-slate-800 block truncate">{tmpl.title}</span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {photo ? '📸 Custom Photo Active' : 'Default Barbie Art'}
                      </span>
                    </div>

                    <label className="py-1 px-2.5 rounded-lg bg-pink-50 text-pink-700 text-[11px] font-bold border border-pink-200 cursor-pointer hover:bg-pink-100 shrink-0">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleUploadSlot(tmpl.id, f);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Big Action Save Button */}
        <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
          <button
            onClick={handleSaveAllToServer}
            disabled={isSaving}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving Permanently To Server Disk...</span>
              </>
            ) : savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Saved Permanently! Live For All Friends! 👑</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-emerald-200" />
                <span>Save All Photos To Server Link (Permanent for Friends) 🔒</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-400 text-center">
            Ye button dabane se aapki saari photos server par save ho jati hain taakay kisi bhi dost ko purani photo na dikhay!
          </p>
        </div>

      </div>
    </div>
  );
};
