import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Standard Brand SVG (Lion Mountains, Sierra Leone Green-White-Blue, Heart & Crown)
const brandSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#022c22"/>
    </linearGradient>
    <linearGradient id="saloneGreen" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="saloneBlue" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background rounded rect -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  
  <!-- Outer subtle border ring -->
  <rect x="8" y="8" width="496" height="496" rx="104" fill="none" stroke="#10b981" stroke-width="4" stroke-opacity="0.3"/>

  <!-- Sierra Leone Flag Stripes in stylized arched ribbon -->
  <path d="M 60 410 C 160 380, 352 380, 452 410" stroke="url(#saloneGreen)" stroke-width="12" stroke-linecap="round" fill="none" opacity="0.9"/>
  <path d="M 60 430 C 160 400, 352 400, 452 430" stroke="#f8fafc" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.8"/>
  <path d="M 60 450 C 160 420, 352 420, 452 450" stroke="url(#saloneBlue)" stroke-width="12" stroke-linecap="round" fill="none" opacity="0.9"/>

  <!-- Lion Mountains Silhouette -->
  <path d="M 64 360 L 170 230 L 256 310 L 360 190 L 448 360 Z" fill="#0f172a" opacity="0.75" filter="url(#shadow)"/>
  <path d="M 96 360 L 180 250 L 256 320 L 350 210 L 420 360 Z" fill="#064e3b" opacity="0.6"/>

  <!-- Romantic Heart Emblem in Centre -->
  <path d="M 256 370 C 256 370 140 290 140 210 C 140 160 180 120 230 120 C 248 120 266 128 276 142 C 286 128 304 120 322 120 C 372 120 412 160 412 210 C 412 290 296 370 296 370 Z" 
        fill="url(#saloneGreen)" filter="url(#shadow)" opacity="0.95"/>
  <path d="M 256 340 C 256 340 165 275 165 210 C 165 175 192 145 228 145 C 243 145 257 153 266 165 C 275 153 289 145 304 145 C 340 145 367 175 367 210 C 367 275 276 340 276 340 Z" 
        fill="none" stroke="#ffffff" stroke-width="6" opacity="0.85"/>

  <!-- Gold Royal Crown on Top of Heart representing Lion Kings & Queens -->
  <path d="M 226 135 L 238 95 L 256 112 L 274 95 L 286 135 Z" fill="url(#goldGrad)" filter="url(#shadow)"/>
  <circle cx="238" cy="92" r="5" fill="#fef08a"/>
  <circle cx="256" cy="108" r="5" fill="#fef08a"/>
  <circle cx="274" cy="92" r="5" fill="#fef08a"/>

  <!-- Stylized "SC" Monogram text -->
  <text x="256" y="248" font-family="'Outfit', 'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="44" fill="#ffffff" text-anchor="middle" letter-spacing="2">SALONE</text>
  <text x="256" y="286" font-family="'Outfit', 'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="28" fill="#fde047" text-anchor="middle" letter-spacing="3">CONNECT</text>
</svg>`;

// 2. Maskable SVG with 15% safe padding
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="mBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#022c22"/>
    </linearGradient>
    <linearGradient id="mSaloneGreen" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="mGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
  </defs>

  <!-- Full-bleed background for maskable icon -->
  <rect width="512" height="512" fill="url(#mBgGrad)"/>

  <!-- Safe Zone content centered in 75% scale -->
  <g transform="translate(64, 64) scale(0.75)">
    <!-- Mountain ridge -->
    <path d="M 64 360 L 170 230 L 256 310 L 360 190 L 448 360 Z" fill="#0f172a" opacity="0.8"/>
    <path d="M 96 360 L 180 250 L 256 320 L 350 210 L 420 360 Z" fill="#064e3b" opacity="0.6"/>

    <!-- Heart -->
    <path d="M 256 370 C 256 370 140 290 140 210 C 140 160 180 120 230 120 C 248 120 266 128 276 142 C 286 128 304 120 322 120 C 372 120 412 160 412 210 C 412 290 296 370 296 370 Z" 
          fill="url(#mSaloneGreen)"/>
    
    <!-- Crown -->
    <path d="M 226 135 L 238 95 L 256 112 L 274 95 L 286 135 Z" fill="url(#mGoldGrad)"/>
    <circle cx="238" cy="92" r="5" fill="#fef08a"/>
    <circle cx="256" cy="108" r="5" fill="#fef08a"/>
    <circle cx="274" cy="92" r="5" fill="#fef08a"/>

    <text x="256" y="248" font-family="'Outfit', 'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="44" fill="#ffffff" text-anchor="middle" letter-spacing="2">SALONE</text>
    <text x="256" y="286" font-family="'Outfit', 'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="28" fill="#fde047" text-anchor="middle" letter-spacing="3">CONNECT</text>
  </g>
</svg>`;

// Write icon.svg
fs.writeFileSync(path.join(publicDir, 'icon.svg'), brandSvg, 'utf8');
console.log('Saved public/icon.svg');

async function renderIcons() {
  const brandBuffer = Buffer.from(brandSvg);
  const maskableBuffer = Buffer.from(maskableSvg);

  // 192x192 PNG
  await sharp(brandBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Generated pwa-192x192.png');

  // 512x512 PNG
  await sharp(brandBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Generated pwa-512x512.png');

  // 512x512 Maskable PNG
  await sharp(maskableBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Generated pwa-maskable-512x512.png');

  // 180x180 Apple Touch Icon PNG
  await sharp(brandBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // 64x64 favicon
  await sharp(brandBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Generated favicon.ico');
}

renderIcons().catch((err) => {
  console.error('Error rendering icons:', err);
  process.exit(1);
});
