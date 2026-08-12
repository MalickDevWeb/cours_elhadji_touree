import { useState, useEffect } from 'react';
import { AppPalette, DEFAULT_PALETTE, applyThemePalette, loadSavedThemePalette } from '../utils/themeEngine';
import { extractPaletteFromImageSrc } from '../utils/colorExtractor';

export function useDynamicTheme(logoUrl?: string) {
  const [currentPalette, setCurrentPalette] = useState<AppPalette>(() => loadSavedThemePalette());
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    applyThemePalette(currentPalette);
  }, [currentPalette]);

  useEffect(() => {
    if (logoUrl) {
      const saved = localStorage.getItem('ecole221_theme_palette');
      if (!saved) {
        extractPaletteFromImageSrc(logoUrl).then((extracted) => {
          setPalette(extracted);
        }).catch(() => {});
      }
    }
  }, [logoUrl]);

  const setPalette = (newPalette: AppPalette) => {
    setCurrentPalette(newPalette);
    applyThemePalette(newPalette);
  };

  const analyzeLogoAndApply = async (imageSrc: string) => {
    setIsAnalyzing(true);
    try {
      const extracted = await extractPaletteFromImageSrc(imageSrc);
      setPalette(extracted);
      return extracted;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetToDefault = () => {
    setPalette(DEFAULT_PALETTE);
  };

  return { currentPalette, isAnalyzing, setPalette, analyzeLogoAndApply, resetToDefault };
}
