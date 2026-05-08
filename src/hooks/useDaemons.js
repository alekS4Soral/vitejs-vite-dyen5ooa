import { useState, useEffect } from 'react';
import { DAEMONS_INIT } from '../config/constants';

export function useDaemons() {
  const [daemons, setDaemons] = useState(() => {
    const saved = localStorage.getItem('cc_daemons');
    const lastDate = localStorage.getItem('cc_date');
    const today = new Date().toDateString();

    // Функция для слияния сохраненных настроек с дефолтными
    const mergeWithSaved = (parsedSaved, resetCurrent = false) => {
      const result = { ...DAEMONS_INIT };
      Object.keys(parsedSaved).forEach(key => {
        if (result[key]) {
          result[key] = {
            ...result[key],
            label: parsedSaved[key].label || DAEMONS_INIT[key].label,
            max: parsedSaved[key].max || DAEMONS_INIT[key].max,
            step: parsedSaved[key].step || DAEMONS_INIT[key].step,
            iconName: parsedSaved[key].iconName || DAEMONS_INIT[key].iconName,
            // Если требуется сброс (смена дня), ставим 0, иначе берем сохраненное
            current: resetCurrent ? 0 : (parsedSaved[key].current || 0)
          };
        }
      });
      return result;
    };

    if (lastDate !== today) {
      localStorage.setItem('cc_date', today);
      if (saved) return mergeWithSaved(JSON.parse(saved), true); // Сбрасываем только прогресс
      return DAEMONS_INIT;
    }

    if (saved) return mergeWithSaved(JSON.parse(saved), false); // Ничего не сбрасываем
    return DAEMONS_INIT;
  });

  useEffect(() => { localStorage.setItem('cc_daemons', JSON.stringify(daemons)); }, [daemons]);

  const interactDaemon = (key) => {
    setDaemons(prev => {
      const daemon = prev[key];
      if (daemon.current >= daemon.max) return { ...prev, [key]: { ...daemon, current: 0 } };
      return { ...prev, [key]: { ...daemon, current: Math.min(daemon.max, daemon.current + Number(daemon.step)) } };
    });
  };

  const updateDaemonConfig = (key, field, value) => {
    setDaemons(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  return { daemons, interactDaemon, updateDaemonConfig };
}