import { Power } from 'lucide-react';

export function SafeModeScreen({ setSystemState, t, textMainHex, shapePrimary, colorStyle, children }) {
  return (
    <div className={`min-h-[100dvh] bg-[var(--bg-base)] flex flex-col items-center justify-center font-mono text-[var(--text-muted)] p-4 transition-colors duration-300 relative overflow-hidden ${colorStyle === 'gradient' ? 'is-gradient' : 'is-flat'}`}>
      <div className="absolute inset-0 bg-ambient pointer-events-none"></div>
      
      {/* Здесь будет инжектироваться наш системный CSS */}
      {children} 
      
      <Power className="w-16 h-16 mb-8 opacity-50 animate-pulse relative z-10" style={{ color: textMainHex }} />
      <div className="tracking-[0.3em] text-center uppercase text-sm md:text-lg relative z-10">{t('safeMode')}</div>
      <button onClick={() => setSystemState('NORMAL')} className={`mt-16 px-6 py-3 border border-[var(--border-strong)] text-[var(--text-muted)] active:bg-[var(--bg-panel)] uppercase text-xs tracking-widest relative z-10 ${shapePrimary}`}>
        START
      </button>
    </div>
  );
}