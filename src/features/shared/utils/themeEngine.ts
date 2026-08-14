export interface AppPalette {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  darkNav: string;
  bgTint: string;
  description?: string;
}

export const DEFAULT_PALETTE: AppPalette = {
  primary: '#0284c7',
  primaryHover: '#0369a1',
  primaryLight: '#e0f2fe',
  secondary: '#0f172a',
  accent: '#f59e0b',
  darkNav: '#0f172a',
  bgTint: '#f8fafc',
  description: 'Palette officielle Soutien Scolaire Bleue Ciel',
};

export function applyThemePalette(palette: AppPalette): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  const primary = palette.primary || '#0284c7';
  const primaryHover = palette.primaryHover || primary;
  const primaryLight = palette.primaryLight || '#e0f2fe';
  const darkNav = palette.darkNav || '#0f172a';
  const accent = palette.accent || '#f59e0b';
  const bgTint = palette.bgTint || '#f8fafc';

  root.style.setProperty('--color-primary', primary);
  root.style.setProperty('--color-primary-hover', primaryHover);
  root.style.setProperty('--color-primary-light', primaryLight);
  root.style.setProperty('--color-secondary', palette.secondary || '#0f172a');
  root.style.setProperty('--color-accent', accent);
  root.style.setProperty('--color-dark-nav', darkNav);
  root.style.setProperty('--color-bg-tint', bgTint);

  // Live overrides for Tailwind CSS variables so all bg-sky-*, text-sky-*, border-sky-* adapt
  root.style.setProperty('--color-sky-50', primaryLight);
  root.style.setProperty('--color-sky-100', primaryLight);
  root.style.setProperty('--color-sky-200', primaryLight);
  root.style.setProperty('--color-sky-300', primaryLight);
  root.style.setProperty('--color-sky-400', primary);
  root.style.setProperty('--color-sky-500', primary);
  root.style.setProperty('--color-sky-600', primary);
  root.style.setProperty('--color-sky-700', primaryHover);
  root.style.setProperty('--color-sky-800', primaryHover);
  root.style.setProperty('--color-sky-900', darkNav);

  try {
    localStorage.setItem('ecole221_theme_palette', JSON.stringify(palette));
  } catch (e) {
    console.error('Storage error', e);
  }
}

export function loadSavedThemePalette(): AppPalette {
  if (typeof window === 'undefined') return DEFAULT_PALETTE;
  try {
    const saved = localStorage.getItem('ecole221_theme_palette');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load theme', e);
  }
  return DEFAULT_PALETTE;
}
