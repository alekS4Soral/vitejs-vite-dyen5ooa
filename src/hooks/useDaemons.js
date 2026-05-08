import { useState, useEffect } from 'react';
import { DAEMONS_INIT } from '../config/constants';

export function useDaemons() {
  const [daemons, setDaemons] = useState(() => {
    const saved = localStorage.getItem('cc_daemons');
    const lastDate = localStorage.getItem('cc_date');
    const today = new Date().toDateString();
    
    if (lastDate !== today) {
      localStorage.setItem('cc_date', today);
      return DAEMONS_INIT; 
    }

    if (saved) {
      const parsed = JSON.parse(saved);
      const restored = { ...DAEMONS_INIT };
      Object.keys(parsed).forEach(key => {
        if (restored[key]) {
          restored[key] = {
            ...restored[key],
            current: parsed[key].current || 0,
            label: parsed[key].label || DAEMONS_INIT[key].label,
            max: parsed[key].max || DAEMONS_INIT[key].max,
            step: parsed[key].step || DAEMONS_INIT[key].step,
            iconName: parsed[key].iconName || DAEMONS_INIT[key].iconName
          };
        }
      });
      return restored;
    }
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