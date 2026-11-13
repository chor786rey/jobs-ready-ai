import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// JobReady AI Logo based on user branding:
// Dark Obsidian Squircle (#0C1017)
// Circular gauge: Golden-Amber Arc (#F5A623) + Slate-Charcoal Arc (#2B3340)
// Dynamic Career Growth Zig-Zag Arrow pointing up-right into the target opening

const createSvg = (size, isMaskable = false) => {
  const scale = size / 512;
  const padding = isMaskable ? 50 : 0;
  const contentScale = isMaskable ? (512 - padding * 2) / 512 : 1;
  const rx = isMaskable ? 0 : 140;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFB319" />
        <stop offset="100%" stop-color="#F59E0B" />
      </linearGradient>
    </defs>

    <!-- Squircle Canvas -->
    <rect width="512" height="512" rx="${rx}" fill="#0C1017" />

    <!-- Scaled inner content (ensures safe area for maskable Android icons) -->
    <g transform="translate(${isMaskable ? padding : 0}, ${isMaskable ? padding : 0}) scale(${contentScale})">
      <!-- Muted Dark Slate Arc in upper right (milestone gauge track) -->
      <path d="M 336.5 127.1 A 152 152 0 0 1 402.8 216.7" 
            fill="none" 
            stroke="#2B3340" 
            stroke-width="34" 
            stroke-linecap="round" />
            
      <!-- Vibrant Golden-Amber Arc (career readiness loop) -->
      <path d="M 400.6 303 A 152 152 0 1 1 303 111.4" 
            fill="none" 
            stroke="url(#goldGrad)" 
            stroke-width="34" 
            stroke-linecap="round" />
            
      <!-- Dynamic Career Growth Zig-Zag Arrow Shaft -->
      <path d="M 204 300 L 244 264 L 272 292 L 292 248" 
            fill="none" 
            stroke="url(#goldGrad)" 
            stroke-width="32" 
            stroke-linecap="round" 
            stroke-linejoin="round" />
            
      <!-- Career Acceleration Arrowhead pointing up-right -->
      <path d="M 314 204 L 264 228 L 290 248 L 318 262 Z" 
            fill="url(#goldGrad)" 
            stroke="url(#goldGrad)" 
            stroke-width="4" 
            stroke-linejoin="round" />
    </g>
  </svg>`;
};

async function generateAllIcons() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write base SVGs
  const svgContent = createSvg(512, false);
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);
  fs.writeFileSync(path.join(publicDir, 'pwa-icon.svg'), svgContent);

  // Generate PNG 192x192
  await sharp(Buffer.from(createSvg(192, false)))
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // Generate PNG 512x512
  await sharp(Buffer.from(createSvg(512, false)))
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // Generate Maskable 512x512
  await sharp(Buffer.from(createSvg(512, true)))
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // Generate Apple Touch Icon 180x180
  await sharp(Buffer.from(createSvg(180, false)))
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Favicon PNG 64x64
  await sharp(Buffer.from(createSvg(64, false)))
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  console.log('All icons generated successfully with the new brand logo in /public!');
}

generateAllIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
