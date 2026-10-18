import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, RotateCcw, Zap, ArrowRight, Eye, CheckCircle2, Upload, RefreshCw } from 'lucide-react';
import { sfx } from '../utils/audio';
import { processAndCompressImage, storage } from '../utils/imageStorage';

const DEFAULT_PUZZLE_IMG = '/src/assets/images/aymen_puzzle_artwork_1792326397202.jpg';

interface PuzzleGameProps {
  onUnlockSuccess: () => void;
  isUnlocked: boolean;
}

export const PuzzleGame: React.FC<PuzzleGameProps> = ({ onUnlockSuccess, isUnlocked }) => {
  // Solved state
  const solvedState = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const [board, setBoard] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [moves, setMoves] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  const [puzzleImage, setPuzzleImage] = useState<string>(() => {
    return storage.get('aymen_puzzle_photo', DEFAULT_PUZZLE_IMG);
  });
  const [isCustomPhoto, setIsCustomPhoto] = useState<boolean>(() => {
    return Boolean(storage.get('aymen_puzzle_photo', ''));
  });
  const [sassyMessage, setSassyMessage] = useState<string>("Solve Aymen's VIP puzzle to unlock the Glam World! 👑");

  // Format seconds to mm:ss
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !won) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, won]);

  // Check if current board is solved
  const checkVictory = useCallback((currentBoard: number[]) => {
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] !== solvedState[i]) return false;
    }
    return true;
  }, []);

  // Shuffle board safely ensuring it is solvable
  const shuffleBoard = () => {
    sfx.playPop();
    const newBoard = [...solvedState];
    // Perform 30 valid moves from solved state to guarantee solvability
    let emptyIdx = 8;
    for (let k = 0; k < 35; k++) {
      const row = Math.floor(emptyIdx / 3);
      const col = emptyIdx % 3;
      const neighbors: number[] = [];
      if (row > 0) neighbors.push(emptyIdx - 3); // top
      if (row < 2) neighbors.push(emptyIdx + 3); // bottom
      if (col > 0) neighbors.push(emptyIdx - 1); // left
      if (col < 2) neighbors.push(emptyIdx + 1); // right

      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      newBoard[emptyIdx] = newBoard[randomNeighbor];
      newBoard[randomNeighbor] = 8;
      emptyIdx = randomNeighbor;
    }

    setBoard(newBoard);
    setMoves(0);
    setSeconds(0);
    setIsPlaying(true);
    setWon(false);
    setSassyMessage("Dekhtay hain kitna dimagh hai tumhare paas! 💅");
  };

  // Move tile if adjacent to empty slot
  const handleTileClick = (index: number) => {
    if (won) return;
    const tileVal = board[index];
    if (tileVal === 8) return; // clicked empty tile

    const emptyIndex = board.indexOf(8);
    const row = Math.floor(index / 3);
    const col = index % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    const isAdjacent =
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      sfx.playPop();
      const nextBoard = [...board];
      nextBoard[emptyIndex] = tileVal;
      nextBoard[index] = 8;
      setBoard(nextBoard);
      setMoves((m) => m + 1);

      if (!isPlaying) setIsPlaying(true);

      // Check win
      if (checkVictory(nextBoard)) {
        triggerWin();
      }
    } else {
      sfx.playSassy();
    }
  };

  const triggerWin = () => {
    setWon(true);
    setIsPlaying(false);
    sfx.playFanfare();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ec4899', '#f43f5e', '#fbbf24', '#ffffff', '#c084fc']
    });
    setSassyMessage("👑 OHO! Tumne Aymen Riaz ka secret VIP Pass unlock kar lia!");
    onUnlockSuccess();
  };

  // Quick auto-solve for impatient friends
  const handleAutoUnlock = () => {
    sfx.playSparkle();
    setBoard([...solvedState]);
    setSassyMessage("Hahaha haar maan li na? Chalain Aymen Riaz ne maaf kia! VIP Pass Unlocked! ✨");
    triggerWin();
  };

  // Initial auto shuffle on mount if not unlocked
  useEffect(() => {
    if (!isUnlocked && moves === 0 && !isPlaying && !won) {
      shuffleBoard();
    }
  }, []);

  // Handle custom photo upload for puzzle
  const handlePuzzlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      sfx.playSparkle();
      const compressed = await processAndCompressImage(file, 600, 0.85);
      storage.set('aymen_puzzle_photo', compressed);
      setPuzzleImage(compressed);
      setIsCustomPhoto(true);
      setSassyMessage("Aymen ki apni photo lag gayi! Ab dekho doston se solve hoti hai ya nahi! 👑");
      // Reshuffle with new photo
      shuffleBoard();
    } catch (err) {
      console.error('Error processing image:', err);
    }
  };

  const handleResetPuzzlePhoto = () => {
    sfx.playPop();
    storage.set('aymen_puzzle_photo', '');
    setPuzzleImage(DEFAULT_PUZZLE_IMG);
    setIsCustomPhoto(false);
    setSassyMessage("Default Barbie glam puzzle wapis aa gayi! ✨");
    shuffleBoard();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold tracking-wide uppercase mb-3">
          <Sparkles className="w-4 h-4 text-pink-500" />
          Aymen Riaz VIP Gatekeeper
        </div>
        <h2 className="text-3xl md:text-4xl font-serif-glam font-bold text-slate-900 tracking-tight mb-2">
          Crack The Glamour Mystery 💖
        </h2>
        <p className="text-sm md:text-base text-slate-600 max-w-lg mx-auto">
          {isCustomPhoto 
            ? "Aymen Riaz ki real picture ka puzzle solve karo taakay coloring studio unlock ho!"
            : "Aymen Riaz ki VIP coloring lounge me aane ke liye ye pyari si Barbie puzzle solve karo!"}
        </p>
      </div>

      {/* Sassy Quote Box */}
      <div className="bg-white/80 backdrop-blur-sm border border-pink-200/80 rounded-2xl p-4 shadow-sm mb-6 text-center max-w-lg mx-auto">
        <p className="text-pink-600 font-medium italic text-sm">
          "{sassyMessage}"
        </p>
      </div>

      {/* Game Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: Controls & Stats */}
        <div className="md:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-pink-600">
              Game Stats
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-pink-50/60 p-3 rounded-xl border border-pink-100">
                <span className="text-xs text-slate-500 block">Moves</span>
                <span className="text-2xl font-bold font-mono text-slate-800">{moves}</span>
              </div>
              <div className="bg-pink-50/60 p-3 rounded-xl border border-pink-100">
                <span className="text-xs text-slate-500 block">Time</span>
                <span className="text-2xl font-bold font-mono text-slate-800">{formatTime(seconds)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={shuffleBoard}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 font-medium text-sm transition-colors border border-pink-200 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Shuffle Again
              </button>

              <button
                onClick={() => setShowPreview(!showPreview)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-pink-50/50 text-slate-700 font-medium text-sm transition-colors border border-slate-200 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-pink-500" />
                {showPreview ? 'Hide Target Pic' : 'Peek Target Pic'}
              </button>

              <button
                onClick={handleAutoUnlock}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-medium text-sm transition-all shadow-sm shadow-pink-200 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                VIP Fast-Pass (Auto Crack)
              </button>
            </div>
          </div>

          {/* Reference Thumbnail */}
          {showPreview && (
            <div className="bg-white rounded-2xl p-4 border border-pink-200 shadow-sm transition-all">
              <span className="text-xs font-semibold text-pink-700 block mb-2">Original Goal Preview:</span>
              <img
                src={puzzleImage}
                alt="Puzzle goal"
                className="w-full h-44 object-cover rounded-xl border border-pink-100"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>

        {/* Right: The 3x3 Puzzle Grid */}
        <div className="md:col-span-8 flex flex-col items-center">
          <div className="relative p-3 bg-gradient-to-b from-pink-200 to-pink-300 rounded-3xl shadow-xl shadow-pink-200/50 border-4 border-white max-w-[420px] w-full aspect-square">
            <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full h-full bg-pink-50/40 rounded-2xl p-2 relative overflow-hidden">
              {board.map((tileVal, idx) => {
                if (tileVal === 8 && !won) {
                  // Empty slot
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="w-full h-full rounded-xl bg-pink-100/50 border-2 border-dashed border-pink-300/80 flex items-center justify-center text-pink-300 text-xs font-semibold"
                    >
                      Empty
                    </div>
                  );
                }

                // Tile position in original image (0..8)
                const originalRow = Math.floor(tileVal / 3);
                const originalCol = tileVal % 3;

                const bgX = originalCol * 50;
                const bgY = originalRow * 50;

                return (
                  <button
                    key={`tile-${tileVal}`}
                    onClick={() => handleTileClick(idx)}
                    disabled={won}
                    className="relative w-full h-full rounded-xl overflow-hidden shadow-md active:scale-95 transition-transform duration-100 focus:outline-none focus:ring-2 focus:ring-pink-400 group cursor-pointer"
                    style={{
                      backgroundImage: `url(${puzzleImage})`,
                      backgroundSize: '300% 300%',
                      backgroundPosition: `${bgX}% ${bgY}%`,
                    }}
                  >
                    {/* Subtle numbering */}
                    <span className="absolute top-1 left-1.5 px-1.5 py-0.5 rounded-md bg-black/40 text-[10px] font-bold text-white backdrop-blur-xs font-mono">
                      {tileVal + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Victory Overlay if Won */}
            {won && (
              <div className="absolute inset-0 bg-pink-900/60 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-6 text-center text-white animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-300 to-yellow-400 flex items-center justify-center mb-3 shadow-lg shadow-yellow-500/50 animate-bounce">
                  <Trophy className="w-8 h-8 text-amber-900" />
                </div>
                <h4 className="text-2xl font-serif-glam font-bold mb-1">
                  Access Granted! 👑
                </h4>
                <p className="text-xs text-pink-100 mb-5 max-w-xs">
                  Aymen Riaz is impressed! Now head over to the VIP Coloring Studio to create your masterpiece!
                </p>
                <button
                  onClick={onUnlockSuccess}
                  className="flex items-center gap-2 py-3 px-6 rounded-full bg-white text-pink-600 font-bold text-sm shadow-xl hover:bg-pink-50 active:scale-95 transition-all"
                >
                  Enter Coloring Studio <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Quick status bar */}
          <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Solvable Guarantee
            </span>
            <span>·</span>
            <span>Click tiles next to the empty slot</span>
          </div>
        </div>
      </div>
    </div>
  );
};
