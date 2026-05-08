import { Terminal, BookOpen, Archive, Settings, ShieldAlert } from 'lucide-react';
import { ICON_MAP, DAEMON_COLORS } from '../../config/constants';

export function SystemHeader({ 
  textMainHex, textMutedHex, shapePrimary, shapeSecondary,
  setIsManualOpen, setIsLogOpen, setIsSettingsOpen, setSystemState,
  renderLog, daemons, interactDaemon
}) {
  return (
    <header className="flex-shrink-0 bg-[var(--bg-header)] border-b border-[var(--border-color)] p-4 pb-3 z-10 relative mt-safe transition-colors duration-300">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 md:w-5 md:h-5" style={{ color: textMutedHex }} />
          <div className="text-xs md:text-sm tracking-widest font-bold uppercase" style={{ color: textMainHex }}>ColdCache<span style={{ color: 'var(--os-accent-1)' }}>.OS</span></div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => setIsManualOpen(true)} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] ${shapeSecondary}`} style={{ color: textMutedHex }}>
            <BookOpen className="w-3 h-3" />
          </button>
          <button onClick={() => setIsLogOpen(true)} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] relative ${shapeSecondary}`} style={{ color: textMutedHex }}>
            <Archive className="w-3 h-3" />
            {renderLog.length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full glow-accent" style={{ background: 'var(--os-accent-bg)' }}></span>}
          </button>
          <button onClick={() => setIsSettingsOpen(true)} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] ${shapeSecondary}`} style={{ color: textMutedHex }}>
            <Settings className="w-3 h-3" />
          </button>
          <button onClick={() => setSystemState('SAFE_MODE')} className={`p-2 border border-red-900/30 text-red-500 active:bg-red-900/20 bg-red-900/10 ${shapeSecondary}`}>
            <ShieldAlert className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {Object.entries(daemons).map(([key, data]) => {
          const Icon = ICON_MAP[data.iconName] || ICON_MAP['SquareActivity'];
          const color = DAEMON_COLORS[key];
          const isDone = data.current >= data.max;
          
          return (
            <button key={key} onClick={() => interactDaemon(key)} className={`bg-[var(--bg-panel)] border border-[var(--border-color)] p-2 md:p-3 relative overflow-hidden text-left active:opacity-70 transition-all ${shapePrimary}`}>
              <div className="absolute bottom-0 left-0 h-full transition-all duration-300 opacity-20" style={{ backgroundColor: color, width: `${Math.min(100, (data.current / data.max) * 100)}%` }} />
              <div className="relative z-10 flex flex-col gap-1 md:flex-row md:justify-between md:items-center">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Icon className="w-3 h-3 md:w-4 md:h-4" style={{ color: isDone ? color : textMutedHex }} />
                  <span className="text-[8px] md:text-[9px] uppercase tracking-widest truncate" style={{ color: isDone ? color : textMutedHex }}>{data.label}</span>
                </div>
                <span className="text-[10px]" style={{ color: isDone ? color : textMainHex, fontWeight: isDone ? 'bold' : 'normal' }}>
                  {data.current}/{data.max}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </header>
  );
}