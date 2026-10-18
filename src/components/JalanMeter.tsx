import React, { useState } from 'react';
import { Flame, Sparkles, Copy, Check, AlertTriangle, ShieldCheck, HeartCrack, RefreshCw } from 'lucide-react';
import { sfx } from '../utils/audio';
import confetti from 'canvas-confetti';

interface RoastResult {
  friendName: string;
  jealousyPercent: number;
  burnDegree: string;
  prescription: string;
  sassyVerdict: string;
  reactionEmoji: string;
}

export const JalanMeter: React.FC = () => {
  const [friendName, setFriendName] = useState<string>('');
  const [relation, setRelation] = useState<string>('Bestie');
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const calculateJalan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendName.trim()) return;

    setIsCalculating(true);
    setResult(null);
    sfx.playSassy();

    setTimeout(() => {
      // Calculate funny random high percentage between 88% and 100%
      const percent = Math.floor(Math.random() * 13) + 88;
      
      const roasts = [
        {
          burnDegree: '3rd Degree Barbie Fire 🔥',
          sassyVerdict: `Jab Aymen Riaz ki picture samnay aayi to ${friendName} ne screen zoom kar ke 10 dafa dekha aur deep saans li!`,
          prescription: '1x Carton of Burnol + 2x glass thanda paani for peace of mind.',
          reactionEmoji: '🔥😱'
        },
        {
          burnDegree: 'Severe Glam Shockwave ⚡',
          sassyVerdict: `${friendName} soch rahi hai: "Itni piyari Barbie vibes kahan se laayi hai Aymen?!" Dil me dhuwan nikal raha hai!`,
          prescription: 'Aymen Riaz ki tareef karein taakay sukoon mil sake.',
          reactionEmoji: '👑💅'
        },
        {
          burnDegree: '100% Extreme Hasad Alert 🚨',
          sassyVerdict: `${friendName} ne bola "theek hai bas" magar andar se aag lagi hui hai! Aymen ka standard match karna impossible hai!`,
          prescription: 'Turant 1122 fire brigade ko call karein!',
          reactionEmoji: '🚒🔥'
        },
        {
          burnDegree: 'Uncontrollable Envy Flare ✨',
          sassyVerdict: `${friendName} Aymen ke dresses aur makeup ke screenshots le kar save kar rahi hai taakay copy kar sake!`,
          prescription: 'Original is always original. Copying Aymen won\'t work!',
          reactionEmoji: '📸✨'
        }
      ];

      const chosenRoast = roasts[Math.floor(Math.random() * roasts.length)];

      setResult({
        friendName: friendName.trim(),
        jealousyPercent: percent,
        burnDegree: chosenRoast.burnDegree,
        sassyVerdict: chosenRoast.sassyVerdict,
        prescription: chosenRoast.prescription,
        reactionEmoji: chosenRoast.reactionEmoji,
      });

      setIsCalculating(false);
      sfx.playSparkle();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#f59e0b']
      });
    }, 1200);
  };

  const copyRoast = () => {
    if (!result) return;
    const text = `🚨 OFFICIAL AYMEN RIAZ JALAN REPORT 🚨\n\nFriend Name: ${result.friendName}\nRelationship: ${relation}\nJealousy Level: ${result.jealousyPercent}%\nBurn Degree: ${result.burnDegree}\nVerdict: ${result.sassyVerdict}\nDoctor's Advice: ${result.prescription}\n\n👑 Powered by Queen Aymen Riaz!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    sfx.playPop();
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-2">
          <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
          The Ultimate Sassy Meter
        </div>
        <h2 className="text-3xl md:text-4xl font-serif-glam font-bold text-slate-900 mb-2">
          Besties Jalan Calculator 🔥
        </h2>
        <p className="text-sm md:text-base text-slate-600 max-w-md mx-auto">
          Apni kisi bhi dost ka naam daalo aur check karo Aymen Riaz ko dekh kar us ke dil me kitni aag lagti hai!
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-pink-100 shadow-md mb-8">
        <form onSubmit={calculateJalan} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 text-pink-700">
              Dost Ka Naam (Bestie / Friend Name)
            </label>
            <input
              type="text"
              required
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              placeholder="e.g. Fatima, Sara, Hina, etc."
              className="w-full px-4 py-3 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/30 text-slate-800 text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 text-pink-700">
              Relationship Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['Bestie', 'Classmate', 'Cousin', 'Instagram Stalker'].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => {
                    sfx.playPop();
                    setRelation(r);
                  }}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    relation === r
                      ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-pink-50/50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isCalculating || !friendName.trim()}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-base shadow-lg shadow-pink-200 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isCalculating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Calculating Burn Temperature...
              </>
            ) : (
              <>
                <Flame className="w-5 h-5 text-amber-300" />
                Calculate Jealousy Level 🔥
              </>
            )}
          </button>
        </form>
      </div>

      {/* Result Certificate Card */}
      {result && (
        <div className="bg-gradient-to-b from-rose-50 via-pink-50 to-white rounded-3xl p-6 md:p-8 border-2 border-pink-300 shadow-xl relative overflow-hidden animate-fadeIn">
          {/* Decorative Corner Seals */}
          <div className="absolute top-3 right-3 text-2xl">
            {result.reactionEmoji}
          </div>

          <div className="text-center mb-6">
            <span className="text-xs font-bold text-pink-700 uppercase tracking-widest block mb-1">
              Official Certified Report
            </span>
            <h3 className="text-2xl font-serif-glam font-bold text-slate-900">
              {result.friendName}'s Burn Certificate
            </h3>
          </div>

          {/* Meter Bar */}
          <div className="mb-6 bg-white rounded-2xl p-4 border border-pink-100 shadow-xs">
            <div className="flex items-center justify-between text-sm font-bold mb-2">
              <span className="text-slate-700 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500" />
                Jalan Intensity:
              </span>
              <span className="text-rose-600 text-lg font-mono">
                {result.jealousyPercent}% 🔥
              </span>
            </div>
            
            <div className="w-full h-4 bg-pink-100 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-red-600 rounded-full transition-all duration-1000 animate-pulse"
                style={{ width: `${result.jealousyPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
              <span>Mild Jealousy</span>
              <span>Critical Burn</span>
              <span>100% Ashes</span>
            </div>
          </div>

          {/* Findings */}
          <div className="space-y-3 mb-6 text-sm">
            <div className="bg-white/80 p-3.5 rounded-xl border border-pink-100">
              <span className="text-xs font-bold text-slate-500 block mb-1">Status Verdict:</span>
              <p className="text-slate-800 font-medium">{result.sassyVerdict}</p>
            </div>

            <div className="bg-white/80 p-3.5 rounded-xl border border-pink-100">
              <span className="text-xs font-bold text-slate-500 block mb-1">Doctor's Prescription:</span>
              <p className="text-rose-700 font-medium">{result.prescription}</p>
            </div>
          </div>

          {/* Copy & Share Action */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={copyRoast}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Roast Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Roast to Send in WhatsApp
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
