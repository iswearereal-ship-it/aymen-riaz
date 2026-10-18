import { ColoringTemplate } from '../types';

export const COLORING_TEMPLATES: ColoringTemplate[] = [
  {
    id: 'queen-aymen',
    title: 'Queen Aymen Riaz 👑',
    description: 'The royal glam portrait with sparkling diamond tiara and pearl necklace',
    category: 'Royal Portrait',
    svgData: `
      <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#262626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <!-- Background decorative arch -->
        <path d="M 80 480 C 80 160, 420 160, 420 480" stroke="#f472b6" stroke-width="2" stroke-dasharray="6,6" fill="none"/>
        <circle cx="250" cy="120" r="14" stroke="#fbbf24" stroke-width="2.5" fill="none"/>
        <!-- Tiara / Crown -->
        <path d="M 180 150 L 200 90 L 225 130 L 250 75 L 275 130 L 300 90 L 320 150 Z" stroke="#e11d48" stroke-width="3" fill="none"/>
        <circle cx="200" cy="85" r="4" stroke="#e11d48" fill="none"/>
        <circle cx="250" cy="68" r="5" stroke="#e11d48" fill="none"/>
        <circle cx="300" cy="85" r="4" stroke="#e11d48" fill="none"/>
        <path d="M 195 140 Q 250 155 305 140" stroke="#e11d48" stroke-width="2.5"/>
        
        <!-- Hair -->
        <path d="M 170 180 C 130 220, 110 320, 140 440 C 150 480, 180 450, 170 410 C 160 360, 170 290, 190 250" stroke="#1f2937" stroke-width="3.5" fill="none"/>
        <path d="M 330 180 C 370 220, 390 320, 360 440 C 350 480, 320 450, 330 410 C 340 360, 330 290, 310 250" stroke="#1f2937" stroke-width="3.5" fill="none"/>
        <path d="M 180 160 C 210 130, 290 130, 320 160 C 310 190, 310 210, 320 230 C 290 210, 210 210, 180 230 Z" stroke="#1f2937" stroke-width="3" fill="none"/>

        <!-- Face contour -->
        <path d="M 190 210 C 190 290, 220 330, 250 330 C 280 330, 310 290, 310 210" stroke="#1f2937" stroke-width="3" fill="none"/>
        
        <!-- Eyebrows -->
        <path d="M 205 215 Q 220 205 235 215" stroke="#1f2937" stroke-width="3"/>
        <path d="M 265 215 Q 280 205 295 215" stroke="#1f2937" stroke-width="3"/>

        <!-- Eyes -->
        <path d="M 205 230 Q 220 220 235 230 Q 220 240 205 230 Z" stroke="#1f2937" stroke-width="2.5" fill="none"/>
        <circle cx="220" cy="230" r="4" stroke="#1f2937" fill="#1f2937"/>
        <path d="M 200 225 L 195 220" stroke="#1f2937" stroke-width="2"/>
        <path d="M 240 225 L 245 220" stroke="#1f2937" stroke-width="2"/>

        <path d="M 265 230 Q 280 220 295 230 Q 280 240 265 230 Z" stroke="#1f2937" stroke-width="2.5" fill="none"/>
        <circle cx="280" cy="230" r="4" stroke="#1f2937" fill="#1f2937"/>
        <path d="M 260 225 L 255 220" stroke="#1f2937" stroke-width="2"/>
        <path d="M 300 225 L 305 220" stroke="#1f2937" stroke-width="2"/>

        <!-- Nose -->
        <path d="M 248 240 L 246 265 Q 250 270 254 265" stroke="#1f2937" stroke-width="2.5"/>

        <!-- Lips -->
        <path d="M 230 290 Q 240 282 250 287 Q 260 282 270 290 Q 250 310 230 290 Z" stroke="#e11d48" stroke-width="3" fill="none"/>
        <path d="M 230 290 Q 250 295 270 290" stroke="#e11d48" stroke-width="2"/>

        <!-- Earrings -->
        <path d="M 185 245 L 180 270 L 185 285 L 190 270 Z" stroke="#fbbf24" stroke-width="2" fill="none"/>
        <path d="M 315 245 L 310 270 L 315 285 L 320 270 Z" stroke="#fbbf24" stroke-width="2" fill="none"/>

        <!-- Neck & Pearl Necklace -->
        <path d="M 225 330 L 220 370" stroke="#1f2937" stroke-width="2.5"/>
        <path d="M 275 330 L 280 370" stroke="#1f2937" stroke-width="2.5"/>
        <path d="M 215 365 Q 250 390 285 365" stroke="#ec4899" stroke-width="3" stroke-dasharray="1,8" stroke-linecap="round"/>
        <path d="M 205 385 Q 250 415 295 385" stroke="#ec4899" stroke-width="3" stroke-dasharray="1,8" stroke-linecap="round"/>

        <!-- Royal Dress / Shoulders -->
        <path d="M 220 370 C 170 380, 110 420, 80 500" stroke="#1f2937" stroke-width="3.5" fill="none"/>
        <path d="M 280 370 C 330 380, 390 420, 420 500" stroke="#1f2937" stroke-width="3.5" fill="none"/>
        <path d="M 220 370 Q 250 420 280 370" stroke="#1f2937" stroke-width="3" fill="none"/>
        <path d="M 200 440 Q 250 460 300 440" stroke="#f43f5e" stroke-width="2.5" fill="none"/>

        <!-- Sparkles around -->
        <path d="M 120 120 L 125 105 L 130 120 L 145 125 L 130 130 L 125 145 L 120 130 L 105 125 Z" stroke="#ec4899" stroke-width="2" fill="none"/>
        <path d="M 370 120 L 375 105 L 380 120 L 395 125 L 380 130 L 375 145 L 370 130 L 355 125 Z" stroke="#ec4899" stroke-width="2" fill="none"/>
      </svg>
    `
  },
  {
    id: 'barbie-sunglasses',
    title: 'Sassy Barbie Diva 🕶️',
    description: 'Trendy look with retro sunglasses, heart earrings, and sleek bob hair',
    category: 'Fashion Glam',
    svgData: `
      <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#262626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <!-- Big Hair Volume -->
        <path d="M 120 280 C 100 130, 200 60, 250 60 C 300 60, 400 130, 380 280 C 360 360, 390 440, 370 480 L 330 480 C 330 400, 330 350, 310 320" stroke="#1f2937" stroke-width="3.5" fill="none"/>
        <path d="M 120 280 C 140 360, 110 440, 130 480 L 170 480 C 170 400, 170 350, 190 320" stroke="#1f2937" stroke-width="3.5" fill="none"/>
        
        <!-- Face -->
        <path d="M 180 180 C 180 320, 220 360, 250 360 C 280 360, 320 320, 320 180" stroke="#1f2937" stroke-width="3" fill="none"/>

        <!-- Iconic Heart Sunglasses -->
        <path d="M 160 210 C 160 180, 200 170, 225 195 C 250 170, 290 180, 290 210 C 290 240, 225 270, 225 270 C 225 270, 160 240, 160 210 Z" stroke="#db2777" stroke-width="3.5" fill="none"/>
        <path d="M 275 195 C 300 170, 340 180, 340 210 C 340 240, 275 270, 275 270 C 275 270, 210 240, 210 210 C 210 180, 250 170, 275 195 Z" stroke="#db2777" stroke-width="3.5" fill="none"/>
        <path d="M 235 210 L 265 210" stroke="#db2777" stroke-width="3"/>
        <!-- Glasses reflection lines -->
        <line x1="180" y1="205" x2="200" y2="235" stroke="#ec4899" stroke-width="2"/>
        <line x1="300" y1="205" x2="320" y2="235" stroke="#ec4899" stroke-width="2"/>

        <!-- Nose -->
        <path d="M 248 275 L 246 295 Q 250 300 254 295" stroke="#1f2937" stroke-width="2.5"/>

        <!-- Sassy Smile -->
        <path d="M 225 320 Q 250 345 275 320 Q 250 330 225 320 Z" stroke="#e11d48" stroke-width="3" fill="none"/>

        <!-- Heart Dangle Earrings -->
        <path d="M 155 280 L 155 300" stroke="#fbbf24" stroke-width="2"/>
        <path d="M 155 315 C 145 300, 135 310, 155 330 C 175 310, 165 300, 155 315 Z" stroke="#fbbf24" stroke-width="2" fill="none"/>

        <path d="M 345 280 L 345 300" stroke="#fbbf24" stroke-width="2"/>
        <path d="M 345 315 C 335 300, 325 310, 345 330 C 365 310, 355 300, 345 315 Z" stroke="#fbbf24" stroke-width="2" fill="none"/>

        <!-- Neck & Fashion Collar -->
        <path d="M 225 360 L 220 400" stroke="#1f2937" stroke-width="2.5"/>
        <path d="M 275 360 L 280 400" stroke="#1f2937" stroke-width="2.5"/>
        <path d="M 220 400 L 160 430 L 120 500" stroke="#1f2937" stroke-width="3.5" fill="none"/>
        <path d="M 280 400 L 340 430 L 380 500" stroke="#1f2937" stroke-width="3.5" fill="none"/>
        <path d="M 220 400 L 250 440 L 280 400" stroke="#db2777" stroke-width="3" fill="none"/>
        <!-- Star badges -->
        <polygon points="175,445 178,455 188,455 180,461 183,471 175,465 167,471 170,461 162,455 172,455" stroke="#f59e0b" stroke-width="1.5" fill="none"/>
      </svg>
    `
  },
  {
    id: 'butterfly-princess',
    title: 'Butterfly Glamour Wings 🦋',
    description: 'Dreamy butterfly wings, crystal gown, and floating stardust',
    category: 'Fairytale',
    svgData: `
      <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#262626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <!-- Giant Butterfly Wings in Background -->
        <path d="M 220 250 C 140 120, 40 100, 40 220 C 40 300, 140 330, 220 280" stroke="#ec4899" stroke-width="3.5" fill="none"/>
        <path d="M 220 280 C 130 330, 80 420, 160 450 C 210 470, 230 380, 230 320" stroke="#ec4899" stroke-width="3.5" fill="none"/>

        <path d="M 280 250 C 360 120, 460 100, 460 220 C 460 300, 360 330, 280 280" stroke="#ec4899" stroke-width="3.5" fill="none"/>
        <path d="M 280 280 C 370 330, 420 420, 340 450 C 290 470, 270 380, 270 320" stroke="#ec4899" stroke-width="3.5" fill="none"/>

        <!-- Wing decorative filigree -->
        <circle cx="120" cy="200" r="22" stroke="#f472b6" stroke-width="2" fill="none"/>
        <circle cx="380" cy="200" r="22" stroke="#f472b6" stroke-width="2" fill="none"/>
        <path d="M 100 240 C 140 230, 160 260, 200 255" stroke="#f472b6" stroke-width="2"/>
        <path d="M 400 240 C 360 230, 340 260, 300 255" stroke="#f472b6" stroke-width="2"/>

        <!-- Figure Silhouette / Princess Gown -->
        <circle cx="250" cy="150" r="40" stroke="#1f2937" stroke-width="3" fill="none"/>
        <path d="M 230 135 Q 250 120 270 135" stroke="#f59e0b" stroke-width="3"/> <!-- tiara band -->
        <polygon points="250,110 242,128 258,128" stroke="#f59e0b" stroke-width="2" fill="none"/>
        
        <path d="M 240 190 L 235 240 L 265 240 L 260 190 Z" stroke="#1f2937" stroke-width="2.5" fill="none"/>
        
        <!-- Ballerina / Princess Gown -->
        <path d="M 235 240 C 180 320, 130 420, 100 480 L 400 480 C 370 420, 320 320, 265 240 Z" stroke="#1f2937" stroke-width="3.5" fill="none"/>
        <path d="M 160 480 Q 250 400 340 480" stroke="#db2777" stroke-width="2.5" fill="none"/>
        <path d="M 130 440 Q 250 350 370 440" stroke="#db2777" stroke-width="2.5" fill="none"/>

        <!-- Sparkle Stars -->
        <path d="M 250 40 L 253 55 L 268 58 L 253 61 L 250 76 L 247 61 L 232 58 L 247 55 Z" stroke="#f59e0b" stroke-width="2" fill="none"/>
      </svg>
    `
  },
  {
    id: 'luxury-accessories',
    title: 'Barbie Glam Luxuries 💎',
    description: 'Iconic Barbie perfume, diamond ring, high heel, and lipstick',
    category: 'Accessories',
    svgData: `
      <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#262626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <!-- Perfume Bottle (Center Left) -->
        <rect x="80" y="190" width="150" height="190" rx="20" stroke="#e11d48" stroke-width="3.5" fill="none"/>
        <rect x="125" y="150" width="60" height="40" rx="6" stroke="#f59e0b" stroke-width="3" fill="none"/>
        <polygon points="155,100 135,150 175,150" stroke="#e11d48" stroke-width="3" fill="none"/>
        <!-- Perfume Label -->
        <rect x="105" y="240" width="100" height="90" rx="10" stroke="#e11d48" stroke-width="2" stroke-dasharray="4,4" fill="none"/>
        <path d="M 125 285 Q 155 265 185 285" stroke="#db2777" stroke-width="2.5"/>
        <text x="155" y="310" text-anchor="middle" font-size="12" font-family="sans-serif" font-weight="bold" fill="#db2777" stroke="none">AYMEN</text>

        <!-- High Heel Shoe (Right) -->
        <path d="M 280 340 C 310 330, 370 280, 400 240 L 430 250 C 390 320, 360 380, 270 380 L 260 380 L 260 350 Z" stroke="#1f2937" stroke-width="3.5" fill="none"/>
        <path d="M 400 240 L 440 240" stroke="#1f2937" stroke-width="3"/>
        <line x1="420" y1="250" x2="415" y2="380" stroke="#1f2937" stroke-width="4"/> <!-- stiletto heel -->

        <!-- Lipstick (Bottom Center) -->
        <rect x="230" y="390" width="50" height="90" rx="8" stroke="#1f2937" stroke-width="3" fill="none"/>
        <path d="M 238 390 L 238 340 L 272 340 L 272 390" stroke="#f59e0b" stroke-width="2.5" fill="none"/>
        <path d="M 242 340 L 242 290 L 268 310 L 268 340 Z" stroke="#e11d48" stroke-width="3" fill="none"/>

        <!-- Big Diamond Ring (Top Right) -->
        <circle cx="360" cy="120" r="45" stroke="#f59e0b" stroke-width="5" fill="none"/>
        <polygon points="360,40 330,75 390,75" stroke="#0284c7" stroke-width="3" fill="none"/>
        <line x1="330" y1="75" x2="390" y2="75" stroke="#0284c7" stroke-width="3"/>
        <polygon points="360,40 345,75 375,75" stroke="#0284c7" stroke-width="2" fill="none"/>

        <!-- Sparkles & Hearts -->
        <path d="M 60 90 C 45 70, 30 85, 60 115 C 90 85, 75 70, 60 90 Z" stroke="#ec4899" stroke-width="2" fill="none"/>
        <path d="M 430 80 C 415 60, 400 75, 430 105 C 460 75, 445 60, 430 80 Z" stroke="#ec4899" stroke-width="2" fill="none"/>
      </svg>
    `
  }
];

export const BARBIE_COLOR_PALETTE = [
  { name: 'Hot Barbie Pink', hex: '#ec4899' },
  { name: 'Bubblegum Pink', hex: '#f472b6' },
  { name: 'Princess Blush', hex: '#fbcfe8' },
  { name: 'Crimson Rose', hex: '#e11d48' },
  { name: 'Royal Gold', hex: '#f59e0b' },
  { name: 'Glitter Champagne', hex: '#fde047' },
  { name: 'Lavender Chic', hex: '#c084fc' },
  { name: 'Deep Violet', hex: '#7c3aed' },
  { name: 'Baby Blue', hex: '#38bdf8' },
  { name: 'Emerald Glam', hex: '#10b981' },
  { name: 'Pearl White', hex: '#ffffff' },
  { name: 'Velvet Noir', hex: '#18181b' },
  { name: 'Peach Glow', hex: '#fb923c' },
  { name: 'Caramel Bronze', hex: '#b45309' },
  { name: 'Skin Tone Light', hex: '#fed7aa' },
  { name: 'Skin Tone Glow', hex: '#fdba74' },
];

export const STAMP_LIST = [
  { id: 'crown', icon: '👑', label: 'Queen Tiara' },
  { id: 'sparkles', icon: '✨', label: 'Glitter' },
  { id: 'heart', icon: '💖', label: 'Sparkle Heart' },
  { id: 'diamond', icon: '💎', label: 'Diamond' },
  { id: 'kiss', icon: '💋', label: 'Lipstick Kiss' },
  { id: 'bow', icon: '🎀', label: 'Barbie Bow' },
  { id: 'star', icon: '⭐', label: 'Star' },
  { id: 'fire', icon: '🔥', label: 'Jalan Fire' },
];
