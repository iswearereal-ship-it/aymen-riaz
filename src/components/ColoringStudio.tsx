import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Paintbrush,
  Sparkles,
  RotateCcw,
  RotateCw,
  Trash2,
  Download,
  Upload,
  Eraser,
  Palette,
  Check,
  Flame,
  RefreshCw,
  Plus,
  SlidersHorizontal,
  FileImage
} from 'lucide-react';
import { COLORING_TEMPLATES, BARBIE_COLOR_PALETTE, STAMP_LIST } from '../data/coloringTemplates';
import { ColoringTemplate } from '../types';
import { sfx } from '../utils/audio';
import { processAndCompressImage, convertToSketchOutline, storage } from '../utils/imageStorage';
import confetti from 'canvas-confetti';

interface ColoringStudioProps {
  onGoToFinale: () => void;
}

type ToolMode = 'brush' | 'neon' | 'bucket' | 'eraser' | 'stamp';

export const ColoringStudio: React.FC<ColoringStudioProps> = ({ onGoToFinale }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Template slots: 4 default slots plus any user added extra slots
  const [templateSlots, setTemplateSlots] = useState<ColoringTemplate[]>(() => {
    const extraSlots = storage.getJSON<ColoringTemplate[]>('aymen_extra_template_slots', []);
    return [...COLORING_TEMPLATES, ...extraSlots];
  });

  const [activeSlotId, setActiveSlotId] = useState<string>(() => {
    return COLORING_TEMPLATES[0].id;
  });

  // Persistent photo map per slot: slotId -> compressedImageData
  const [customPhotosBySlot, setCustomPhotosBySlot] = useState<Record<string, string>>(() => {
    return storage.getJSON<Record<string, string>>('aymen_custom_photos_by_slot', {});
  });

  // Photo mode per slot: 'sketch' (coloring outline) | 'photo' (original picture)
  const [photoModeBySlot, setPhotoModeBySlot] = useState<Record<string, 'sketch' | 'photo'>>(() => {
    return storage.getJSON<Record<string, 'sketch' | 'photo'>>('aymen_photo_modes_by_slot', {});
  });

  // Saved drawing states per slot so switching templates does not wipe user's artwork
  const [savedDrawingsBySlot, setSavedDrawingsBySlot] = useState<Record<string, string>>({});

  const [activeTool, setActiveTool] = useState<ToolMode>('brush');
  const [activeColor, setActiveColor] = useState<string>('#ec4899');
  const [brushSize, setBrushSize] = useState<number>(10);
  const [activeStamp, setActiveStamp] = useState<string>('👑');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [artistName, setArtistName] = useState<string>('Queen Bestie');
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [isConvertingSketch, setIsConvertingSketch] = useState<boolean>(false);

  // Active template object
  const currentTemplate = templateSlots.find((t) => t.id === activeSlotId) || templateSlots[0];
  const currentCustomPhoto = customPhotosBySlot[activeSlotId] || null;
  const currentPhotoMode = photoModeBySlot[activeSlotId] || 'photo';

  // Save current canvas state to history and slot cache
  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    setHistory((prev) => {
      const next = prev.slice(0, historyIndex + 1);
      return [...next, dataUrl];
    });
    setHistoryIndex((prev) => prev + 1);

    // Cache drawing for this slot
    setSavedDrawingsBySlot((prev) => ({
      ...prev,
      [activeSlotId]: dataUrl,
    }));
  }, [historyIndex, activeSlotId]);

  // Load a background onto the canvas
  const renderTemplateToCanvas = useCallback(
    async (slot: ColoringTemplate, photoSrc: string | null, mode: 'sketch' | 'photo') => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Check if user already drew something on this slot in current session
      if (savedDrawingsBySlot[slot.id]) {
        const cachedImg = new Image();
        cachedImg.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(cachedImg, 0, 0);
          setHistory([savedDrawingsBySlot[slot.id]]);
          setHistoryIndex(0);
        };
        cachedImg.src = savedDrawingsBySlot[slot.id];
        return;
      }

      // Reset canvas with pure white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (photoSrc) {
        let finalSrc = photoSrc;
        if (mode === 'sketch') {
          setIsConvertingSketch(true);
          finalSrc = await convertToSketchOutline(photoSrc);
          setIsConvertingSketch(false);
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.95;
          const x = (canvas.width - img.width * scale) / 2;
          const y = (canvas.height - img.height * scale) / 2;
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          const initDataUrl = canvas.toDataURL('image/png');
          setHistory([initDataUrl]);
          setHistoryIndex(0);
        };
        img.src = finalSrc;
        return;
      }

      // Render default SVG
      if (slot.svgData) {
        const img = new Image();
        const svgBlob = new Blob([slot.svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);
          const initDataUrl = canvas.toDataURL('image/png');
          setHistory([initDataUrl]);
          setHistoryIndex(0);
        };
        img.src = url;
      } else {
        const initDataUrl = canvas.toDataURL('image/png');
        setHistory([initDataUrl]);
        setHistoryIndex(0);
      }
    },
    [savedDrawingsBySlot]
  );

  // Initialize canvas and watch active template changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 600;
      canvas.height = 600;
      renderTemplateToCanvas(currentTemplate, currentCustomPhoto, currentPhotoMode);
    }
  }, [activeSlotId, currentCustomPhoto, currentPhotoMode]);

  // Handle uploading picture for a specific slot
  const handleSlotPhotoUpload = async (slotId: string, file: File) => {
    try {
      sfx.playSparkle();
      const compressed = await processAndCompressImage(file, 600, 0.82);

      const nextPhotos = {
        ...customPhotosBySlot,
        [slotId]: compressed,
      };
      setCustomPhotosBySlot(nextPhotos);
      storage.setJSON('aymen_custom_photos_by_slot', nextPhotos);

      // Clear any previous drawings for this slot so new photo is crisp
      setSavedDrawingsBySlot((prev) => {
        const copy = { ...prev };
        delete copy[slotId];
        return copy;
      });

      // Switch to this slot
      setActiveSlotId(slotId);
      setSaveToast("Aymen ki photo iss drawing slot me permanently save ho gayi! 📸✨");
      setTimeout(() => setSaveToast(null), 3500);
    } catch (err) {
      console.error('Failed to upload photo for slot:', err);
    }
  };

  // Reset a specific slot to default Barbie line art
  const handleResetSlot = (slotId: string) => {
    sfx.playPop();
    const nextPhotos = { ...customPhotosBySlot };
    delete nextPhotos[slotId];
    setCustomPhotosBySlot(nextPhotos);
    storage.setJSON('aymen_custom_photos_by_slot', nextPhotos);

    setSavedDrawingsBySlot((prev) => {
      const copy = { ...prev };
      delete copy[slotId];
      return copy;
    });

    setSaveToast("Original Barbie art wapis aa gayi! 🌸");
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Toggle between Outline Sketch and Original Photo mode
  const togglePhotoMode = (mode: 'sketch' | 'photo') => {
    sfx.playPop();
    const nextModes = {
      ...photoModeBySlot,
      [activeSlotId]: mode,
    };
    setPhotoModeBySlot(nextModes);
    storage.setJSON('aymen_photo_modes_by_slot', nextModes);

    // Clear session cached drawing to reload fresh outline or photo
    setSavedDrawingsBySlot((prev) => {
      const copy = { ...prev };
      delete copy[activeSlotId];
      return copy;
    });
  };

  // Add a brand new drawing slot for another picture
  const handleAddNewSlot = () => {
    sfx.playSparkle();
    const newSlotNumber = templateSlots.length + 1;
    const newSlotId = `aymen-custom-${Date.now()}`;
    const newSlot: ColoringTemplate = {
      id: newSlotId,
      title: `Aymen Special #${newSlotNumber} 📸`,
      description: 'Custom picture drawing slot',
      category: 'My Personal Album',
    };

    const nextSlots = [...templateSlots, newSlot];
    setTemplateSlots(nextSlots);
    const extraSlots = nextSlots.filter((s) => !COLORING_TEMPLATES.some((def) => def.id === s.id));
    storage.setJSON('aymen_extra_template_slots', extraSlots);

    setActiveSlotId(newSlotId);
    setSaveToast("Naya drawing slot create ho gaya! Ab apni photo lagao! 💖");
    setTimeout(() => setSaveToast(null), 3500);
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      sfx.playPop();
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      restoreCanvasState(history[nextIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      sfx.playPop();
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      restoreCanvasState(history[nextIndex]);
    }
  };

  const restoreCanvasState = (dataUrl: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = dataUrl;
  };

  // Get mouse/touch coordinates relative to canvas
  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: Math.round((clientX - rect.left) * scaleX),
      y: Math.round((clientY - rect.top) * scaleY),
    };
  };

  // Flood fill algorithm
  const floodFill = (startX: number, startY: number, fillColorHex: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    const r = parseInt(fillColorHex.slice(1, 3), 16);
    const g = parseInt(fillColorHex.slice(3, 5), 16);
    const b = parseInt(fillColorHex.slice(5, 7), 16);
    const fillR = r, fillG = g, fillB = b, fillA = 255;

    const startIndex = (startY * canvas.width + startX) * 4;
    const targetR = data[startIndex];
    const targetG = data[startIndex + 1];
    const targetB = data[startIndex + 2];
    const targetA = data[startIndex + 3];

    if (
      Math.abs(targetR - fillR) < 10 &&
      Math.abs(targetG - fillG) < 10 &&
      Math.abs(targetB - fillB) < 10
    ) {
      return;
    }

    if (targetR < 45 && targetG < 45 && targetB < 45) {
      return;
    }

    const matchTarget = (idx: number) => {
      const dr = Math.abs(data[idx] - targetR);
      const dg = Math.abs(data[idx + 1] - targetG);
      const db = Math.abs(data[idx + 2] - targetB);
      const da = Math.abs(data[idx + 3] - targetA);
      return dr + dg + db + da < 50;
    };

    const queue: [number, number][] = [[startX, startY]];
    const visited = new Uint8Array(canvas.width * canvas.height);

    while (queue.length > 0) {
      const [x, y] = queue.pop()!;
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
      const pos = y * canvas.width + x;
      if (visited[pos]) continue;
      visited[pos] = 1;

      const idx = pos * 4;
      if (matchTarget(idx)) {
        data[idx] = fillR;
        data[idx + 1] = fillG;
        data[idx + 2] = fillB;
        data[idx + 3] = fillA;

        if (x > 0) queue.push([x - 1, y]);
        if (x < canvas.width - 1) queue.push([x + 1, y]);
        if (y > 0) queue.push([x, y - 1]);
        if (y < canvas.height - 1) queue.push([x, y + 1]);
      }
    }

    ctx.putImageData(imgData, 0, 0);
    sfx.playSparkle();
    saveState();
  };

  // Stamp icon onto canvas
  const applyStamp = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.font = `${brushSize * 3 + 20}px "Outfit", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(activeStamp, x, y);
    ctx.restore();

    sfx.playPop();
    saveState();
  };

  // Drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const { x, y } = getCanvasCoordinates(e);

    if (activeTool === 'bucket') {
      floodFill(x, y, activeColor);
      return;
    }

    if (activeTool === 'stamp') {
      applyStamp(x, y);
      return;
    }

    setIsDrawing(true);
    setLastPos({ x, y });
    drawStroke(x, y, x, y);
  };

  const drawStroke = (x1: number, y1: number, x2: number, y2: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (activeTool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = brushSize * 2;
      ctx.shadowBlur = 0;
    } else if (activeTool === 'neon') {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = brushSize;
      ctx.shadowColor = activeColor;
      ctx.shadowBlur = 14;
    } else {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = brushSize;
      ctx.shadowBlur = 0;
    }

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  const continueDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPos) return;
    e.preventDefault();
    const { x, y } = getCanvasCoordinates(e);
    drawStroke(lastPos.x, lastPos.y, x, y);
    setLastPos({ x, y });
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setLastPos(null);
      saveState();
    }
  };

  // Clear current drawing
  const handleClear = () => {
    sfx.playPop();
    setSavedDrawingsBySlot((prev) => {
      const copy = { ...prev };
      delete copy[activeSlotId];
      return copy;
    });
    renderTemplateToCanvas(currentTemplate, currentCustomPhoto, currentPhotoMode);
  };

  // Download artwork with royal Barbie frame
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const exportCanvas = document.createElement('canvas');
    const borderPadding = 40;
    const footerHeight = 70;
    exportCanvas.width = canvas.width + borderPadding * 2;
    exportCanvas.height = canvas.height + borderPadding * 2 + footerHeight;

    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, exportCanvas.width, exportCanvas.height);
    grad.addColorStop(0, '#fdf2f8');
    grad.addColorStop(0.5, '#fce7f3');
    grad.addColorStop(1, '#fbcfe8');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;
    ctx.strokeRect(15, 15, exportCanvas.width - 30, exportCanvas.height - 30);
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 2;
    ctx.strokeRect(22, 22, exportCanvas.width - 44, exportCanvas.height - 44);

    ctx.drawImage(canvas, borderPadding, borderPadding);

    ctx.fillStyle = '#db2777';
    ctx.font = 'bold 22px "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ AYMEN RIAZ · QUEEN OF GLAM ✨', exportCanvas.width / 2, canvas.height + borderPadding + 36);

    ctx.fillStyle = '#4b5563';
    ctx.font = '14px "Outfit", sans-serif';
    ctx.fillText(`Masterpiece colored with love by: ${artistName} 💕`, exportCanvas.width / 2, canvas.height + borderPadding + 62);

    const link = document.createElement('a');
    link.download = `Aymen_Riaz_${currentTemplate.title.replace(/\s+/g, '_')}_${Date.now()}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();

    sfx.playFanfare();
    confetti({
      particleCount: 70,
      spread: 60,
      colors: ['#ec4899', '#f43f5e', '#fbbf24'],
    });

    setSaveToast("Masterpiece Downloaded! Aymen ki dostiyan dekh kar jalengi! 🔥");
    setTimeout(() => setSaveToast(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-pink-600 mb-1">
            <Sparkles className="w-4 h-4" />
            Aymen's Multi-Photo Studio
          </div>
          <h2 className="text-2xl md:text-3xl font-serif-glam font-bold text-slate-900">
            Aymen Riaz Coloring & Drawing Studio 🎨
          </h2>
          <p className="text-sm text-slate-600">
            Aymen Riaz ki pictures select karo, sketch ya original mode choose karo, aur maze se rang bharo!
          </p>
        </div>

        {/* Action button leading to finale */}
        <div className="flex items-center gap-3">
          <button
            onClick={onGoToFinale}
            className="flex items-center gap-2 py-2.5 px-5 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-bold text-sm shadow-md shadow-pink-200 active:scale-95 transition-all cursor-pointer"
          >
            <Flame className="w-4 h-4 text-amber-300" />
            Go to Dhamaka Finish 💥
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Template Slots List (Clean view without change buttons) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider text-pink-700">
                Aymen's Looks ({templateSlots.length})
              </span>
            </div>

            <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
              {templateSlots.map((tmpl) => {
                const hasCustomPhoto = Boolean(customPhotosBySlot[tmpl.id]);
                const isActive = activeSlotId === tmpl.id;

                return (
                  <button
                    key={tmpl.id}
                    onClick={() => {
                      sfx.playPop();
                      setActiveSlotId(tmpl.id);
                    }}
                    className={`w-full text-left p-3 rounded-2xl transition-all border cursor-pointer ${
                      isActive
                        ? 'bg-pink-50/80 border-pink-300 text-pink-900 shadow-xs'
                        : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-sm flex items-center justify-between">
                      <span className="truncate pr-1">{tmpl.title}</span>
                      {isActive && <Check className="w-4 h-4 text-pink-600 shrink-0" />}
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {tmpl.description}
                    </p>

                    {hasCustomPhoto && (
                      <span className="inline-block mt-2 text-[10px] font-bold text-pink-600 bg-pink-100/80 px-2 py-0.5 rounded-full">
                        👑 Queen Aymen Special
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sassy Bestie Signature input */}
          <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block text-pink-700">
              Artist Stamp (Your Name)
            </span>
            <input
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="e.g. Fatima / Queen Bestie"
              className="w-full text-sm px-3 py-2 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/30"
            />
            <p className="text-[11px] text-slate-500">
              Ye naam downloaded portrait par show hoga!
            </p>
          </div>
        </div>

        {/* Center: The Coloring Canvas */}
        <div className="lg:col-span-6 flex flex-col items-center">
          
          {/* Active Photo Mode Switcher if a custom photo is present */}
          {currentCustomPhoto && (
            <div className="w-full flex items-center justify-between bg-gradient-to-r from-pink-100 via-rose-50 to-pink-100 border border-pink-200 rounded-2xl p-2.5 mb-3 shadow-xs">
              <span className="text-xs font-bold text-pink-800 flex items-center gap-1.5">
                <FileImage className="w-3.5 h-3.5 text-pink-600" />
                Photo Display Style:
              </span>

              <div className="flex items-center gap-1 bg-white/80 p-0.5 rounded-xl border border-pink-200">
                <button
                  onClick={() => togglePhotoMode('sketch')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    currentPhotoMode === 'sketch'
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Outline Sketch ✏️
                </button>
                <button
                  onClick={() => togglePhotoMode('photo')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    currentPhotoMode === 'photo'
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Original Photo 📸
                </button>
              </div>
            </div>
          )}

          {/* Canvas Floating Top Toolbar */}
          <div className="w-full flex items-center justify-between bg-white/90 backdrop-blur-sm border border-pink-200 rounded-2xl p-2 mb-3 shadow-xs">
            <div className="flex items-center gap-1">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                title="Undo"
                className="p-2 rounded-xl text-slate-600 hover:bg-pink-50 hover:text-pink-600 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                title="Redo"
                className="p-2 rounded-xl text-slate-600 hover:bg-pink-50 hover:text-pink-600 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleClear}
                title="Clear Artwork"
                className="p-2 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Brush Size Slider */}
            <div className="flex items-center gap-2 px-2">
              <span className="text-xs text-slate-500 font-medium">Size:</span>
              <input
                type="range"
                min="3"
                max="32"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-20 md:w-28 accent-pink-500 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-pink-600 w-5">
                {brushSize}
              </span>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-medium text-xs transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Save Pic
            </button>
          </div>

          {/* Canvas Viewport Frame */}
          <div className="relative w-full max-w-[540px] aspect-square rounded-3xl p-3 bg-gradient-to-tr from-pink-300 via-rose-200 to-pink-200 shadow-xl border-4 border-white flex items-center justify-center">
            {isConvertingSketch ? (
              <div className="flex flex-col items-center justify-center text-pink-700 bg-white/90 rounded-2xl w-full h-full">
                <Sparkles className="w-8 h-8 animate-spin mb-2" />
                <span className="text-xs font-bold">Creating Coloring Outline...</span>
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={continueDrawing}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={continueDrawing}
                onTouchEnd={stopDrawing}
                className="w-full h-full bg-white rounded-2xl shadow-inner cursor-crosshair touch-none"
              />
            )}

            {/* Watermark badge on canvas bottom-right */}
            <div className="absolute bottom-5 right-5 pointer-events-none px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-xs text-[10px] font-bold text-pink-600 border border-pink-200">
              👑 Aymen Riaz VIP
            </div>
          </div>

          {/* Toast Notification */}
          {saveToast && (
            <div className="mt-3 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-medium shadow-lg animate-bounce">
              {saveToast}
            </div>
          )}
        </div>

        {/* Right Side: Tools, Color Palette & Stamps */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Tool Modes */}
          <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block text-pink-700">
              Drawing Instruments
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sfx.playPop();
                  setActiveTool('brush');
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  activeTool === 'brush'
                    ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-pink-50/50'
                }`}
              >
                <Paintbrush className="w-4 h-4" />
                Soft Brush
              </button>

              <button
                onClick={() => {
                  sfx.playSparkle();
                  setActiveTool('neon');
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  activeTool === 'neon'
                    ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-pink-50/50'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Glitter Glow
              </button>

              <button
                onClick={() => {
                  sfx.playPop();
                  setActiveTool('bucket');
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  activeTool === 'bucket'
                    ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-pink-50/50'
                }`}
              >
                <Palette className="w-4 h-4" />
                Fill Bucket
              </button>

              <button
                onClick={() => {
                  sfx.playPop();
                  setActiveTool('eraser');
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  activeTool === 'eraser'
                    ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-pink-50/50'
                }`}
              >
                <Eraser className="w-4 h-4" />
                Eraser
              </button>
            </div>
          </div>

          {/* Barbie Palette Swatches */}
          <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider text-pink-700">
                Barbie Glam Shades
              </span>
              <label className="flex items-center gap-1 text-[11px] font-medium text-pink-600 cursor-pointer">
                <span>Custom:</span>
                <input
                  type="color"
                  value={activeColor}
                  onChange={(e) => setActiveColor(e.target.value)}
                  className="w-5 h-5 rounded-full cursor-pointer border-0 p-0"
                />
              </label>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {BARBIE_COLOR_PALETTE.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => {
                    sfx.playPop();
                    setActiveColor(color.hex);
                    if (activeTool === 'eraser') setActiveTool('brush');
                  }}
                  title={color.name}
                  className={`w-full aspect-square rounded-xl transition-transform active:scale-90 border-2 relative flex items-center justify-center cursor-pointer ${
                    activeColor === color.hex
                      ? 'border-pink-600 scale-105 shadow-md shadow-pink-200'
                      : 'border-slate-200 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {activeColor === color.hex && (
                    <Check
                      className={`w-3.5 h-3.5 ${
                        color.hex === '#ffffff' || color.hex === '#fde047' || color.hex === '#fed7aa'
                          ? 'text-slate-900'
                          : 'text-white'
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Glamour Stamps */}
          <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block text-pink-700">
              Glamour Stickers / Stamps
            </span>

            <div className="grid grid-cols-4 gap-2">
              {STAMP_LIST.map((st) => (
                <button
                  key={st.id}
                  onClick={() => {
                    sfx.playPop();
                    setActiveStamp(st.icon);
                    setActiveTool('stamp');
                  }}
                  title={st.label}
                  className={`aspect-square text-lg flex items-center justify-center rounded-xl border transition-all cursor-pointer ${
                    activeTool === 'stamp' && activeStamp === st.icon
                      ? 'bg-pink-100 border-pink-400 scale-105 shadow-xs'
                      : 'border-slate-100 hover:bg-pink-50/50'
                  }`}
                >
                  {st.icon}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">
              Select stamp and tap on canvas to place!
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
