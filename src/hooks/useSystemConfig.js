import { useState, useEffect } from 'react';

// Вспомогательные функции для безопасного доступа к памяти
const safeGet = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? item : fallback;
  } catch (e) {
    // Если браузер блокирует доступ (как во фрейме StackBlitz)
    return fallback;
  }
};

const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // Игнорируем ошибку изоляции
  }
};

export function useSystemConfig() {
  const [isReady, setIsReady] = useState(false);
  
  // Инициализация через безопасное чтение
  const [colorMode, setColorMode] = useState(() => safeGet('cc_mode', 'dark'));
  const [terminology, setTerminology] = useState(() => safeGet('cc_term', 'system'));
  const [uiShape, setUiShape] = useState(() => safeGet('cc_shape', 'diag'));
  const [colorStyle, setColorStyle] = useState(() => safeGet('cc_color_style', 'flat'));
  const [accent1, setAccent1] = useState(() => safeGet('cc_accent1', '#06b6d4'));
  const [accent2, setAccent2] = useState(() => safeGet('cc_accent2', '#a855f7'));
  const [glowLevel, setGlowLevel] = useState(() => Number(safeGet('cc_glow', 20)));

  // Сохранение через безопасную запись
  useEffect(() => { safeSet('cc_mode', colorMode); }, [colorMode]);
  useEffect(() => { safeSet('cc_term', terminology); }, [terminology]);
  useEffect(() => { safeSet('cc_shape', uiShape); }, [uiShape]);
  useEffect(() => { safeSet('cc_color_style', colorStyle); }, [colorStyle]);
  useEffect(() => { safeSet('cc_accent1', accent1); }, [accent1]);
  useEffect(() => { safeSet('cc_accent2', accent2); }, [accent2]);
  useEffect(() => { safeSet('cc_glow', glowLevel); }, [glowLevel]);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return {
    isReady,
    colorMode, setColorMode,
    terminology, setTerminology,
    uiShape, setUiShape,
    colorStyle, setColorStyle,
    accent1, setAccent1,
    accent2, setAccent2,
    glowLevel, setGlowLevel
  };
}