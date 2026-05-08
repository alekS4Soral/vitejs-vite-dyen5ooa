import { useState, useEffect } from 'react';

export function useSystemConfig() {
  const [colorMode, setColorMode] = useState(() => localStorage.getItem('cc_mode') || 'dark');
  const [terminology, setTerminology] = useState(() => localStorage.getItem('cc_term') || 'system');
  const [uiShape, setUiShape] = useState(() => localStorage.getItem('cc_shape') || 'diag');
  const [colorStyle, setColorStyle] = useState(() => localStorage.getItem('cc_color_style') || 'flat');
  const [accent1, setAccent1] = useState(() => localStorage.getItem('cc_accent1') || '#06b6d4');
  const [accent2, setAccent2] = useState(() => localStorage.getItem('cc_accent2') || '#a855f7');
  const [glowLevel, setGlowLevel] = useState(() => Number(localStorage.getItem('cc_glow')) || 20);

  useEffect(() => { localStorage.setItem('cc_mode', colorMode); }, [colorMode]);
  useEffect(() => { localStorage.setItem('cc_term', terminology); }, [terminology]);
  useEffect(() => { localStorage.setItem('cc_shape', uiShape); }, [uiShape]);
  useEffect(() => { localStorage.setItem('cc_color_style', colorStyle); }, [colorStyle]);
  useEffect(() => { localStorage.setItem('cc_accent1', accent1); }, [accent1]);
  useEffect(() => { localStorage.setItem('cc_accent2', accent2); }, [accent2]);
  useEffect(() => { localStorage.setItem('cc_glow', glowLevel); }, [glowLevel]);

  return {
    colorMode, setColorMode,
    terminology, setTerminology,
    uiShape, setUiShape,
    colorStyle, setColorStyle,
    accent1, setAccent1,
    accent2, setAccent2,
    glowLevel, setGlowLevel
  };
}