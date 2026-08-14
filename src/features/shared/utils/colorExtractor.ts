import { AppPalette, DEFAULT_PALETTE } from './themeEngine';

function rgbToHex(r: number, g: number, b: number): string {
  const toH = (n: number) => Math.min(255, Math.max(0, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toH(r)}${toH(g)}${toH(b)}`;
}

export function extractPaletteFromImageSrc(imageSrc: string): Promise<AppPalette> {
  return new Promise((resolve) => {
    if (!imageSrc) return resolve(DEFAULT_PALETTE);

    const img = new Image();
    if (!imageSrc.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(DEFAULT_PALETTE);
        ctx.drawImage(img, 0, 0, 64, 64);
        const data = ctx.getImageData(0, 0, 64, 64).data;

        const colorCounts: Record<string, { count: number; r: number; g: number; b: number }> = {};
        let fallbackR = 2, fallbackG = 132, fallbackB = 199;
        let maxCount = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
          if (a < 128) continue; // transparent
          if (r > 245 && g > 245 && b > 245) continue; // white background
          if (r < 10 && g < 10 && b < 10) continue; // pure black

          const qr = Math.floor(r / 16) * 16;
          const qg = Math.floor(g / 16) * 16;
          const qb = Math.floor(b / 16) * 16;
          const key = `${qr},${qg},${qb}`;

          const isChromatic = Math.max(r, g, b) - Math.min(r, g, b) > 20;
          const weight = isChromatic ? 4 : 1;

          if (!colorCounts[key]) colorCounts[key] = { count: 0, r, g, b };
          colorCounts[key].count += weight;

          if (colorCounts[key].count > maxCount) {
            maxCount = colorCounts[key].count;
            fallbackR = r;
            fallbackG = g;
            fallbackB = b;
          }
        }

        const pR = fallbackR, pG = fallbackG, pB = fallbackB;
        const primaryHex = rgbToHex(pR, pG, pB);
        const primaryHover = rgbToHex(pR * 0.75, pG * 0.75, pB * 0.75);
        const primaryLight = rgbToHex(
          Math.min(255, 240 + pR * 0.08),
          Math.min(255, 245 + pG * 0.08),
          Math.min(255, 250 + pB * 0.08)
        );
        const darkNav = rgbToHex(Math.max(10, pR * 0.3), Math.max(15, pG * 0.3), Math.max(30, pB * 0.3 + 20));
        const accent = rgbToHex(245, 158, 11);
        const bgTint = '#f8fafc';

        resolve({
          primary: primaryHex,
          primaryHover,
          primaryLight,
          secondary: '#0f172a',
          accent,
          darkNav,
          bgTint,
          description: `Palette dynamique extraite du logo (${primaryHex})`,
        });
      } catch {
        resolve(DEFAULT_PALETTE);
      }
    };

    img.onerror = () => resolve(DEFAULT_PALETTE);
    img.src = imageSrc;
  });
}
