import { Settings, X } from 'lucide-react';
import { ICON_MAP, DAEMON_COLORS } from '../../config/constants';

export function SettingsModal({
  closeModals, t, textMainHex, textMutedHex, shapePrimary, shapeSecondary,
  colorStyle, setColorStyle, accent1, setAccent1, accent2, setAccent2,
  uiShape, setUiShape, glowLevel, setGlowLevel, colorMode, setColorMode,
  terminology, setTerminology, daemons, updateDaemonConfig
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col font-mono bg-[var(--bg-base)] transition-colors duration-300">
      <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-header)] flex justify-between items-center mt-safe shrink-0">
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5" style={{ color: textMutedHex }} />
          <div className="text-xs tracking-widest uppercase font-bold" style={{ color: textMainHex }}>{t('settings')}</div>
        </div>
        <button onClick={closeModals} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] transition-all ${shapeSecondary}`} style={{ color: textMainHex }}>
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-4 overflow-y-auto flex flex-col gap-8 flex-1">
        
        <div className="flex flex-col gap-4">
          <div className="text-[10px] uppercase tracking-widest border-b border-[var(--border-color)] pb-1" style={{ color: textMutedHex }}>GLOBAL_CONFIG</div>

          {/* Управление цветовым стилем: Flat / Gradient */}
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase" style={{ color: textMainHex }}>Color Protocol</span>
            <div className="flex gap-2">
              <button onClick={() => setColorStyle('flat')} className={`px-3 py-1 text-xs border transition-colors ${colorStyle === 'flat' ? 'border-accent' : 'border-[var(--border-strong)]'}`} style={{ color: colorStyle === 'flat' ? 'var(--os-accent-1)' : textMutedHex }}>FLAT</button>
              <button onClick={() => setColorStyle('gradient')} className={`px-3 py-1 text-xs border transition-colors ${colorStyle === 'gradient' ? 'border-accent' : 'border-[var(--border-strong)]'}`} style={{ color: colorStyle === 'gradient' ? 'var(--os-accent-1)' : textMutedHex }}>GRADIENT</button>
            </div>
          </div>

          {/* Выбор кастомного цвета (палитра) */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs uppercase" style={{ color: textMainHex }}>Accent Node(s)</span>
            <div className="flex gap-3">
              <input type="color" value={accent1} onChange={(e) => setAccent1(e.target.value)} className="w-8 h-8 rounded-sm cursor-pointer" />
              {colorStyle === 'gradient' && (
                <input type="color" value={accent2} onChange={(e) => setAccent2(e.target.value)} className="w-8 h-8 rounded-sm cursor-pointer" />
              )}
            </div>
          </div>

          {/* Визуальный выбор геометрии */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs uppercase" style={{ color: textMainHex }}>Geometry</span>
            <div className="flex gap-4">
              <button onClick={() => setUiShape('diag')} className={`transition-all ${uiShape === 'diag' ? 'text-[var(--os-accent-1)] drop-shadow-[0_0_8px_var(--os-accent-1)] scale-110' : 'text-[var(--text-muted)] opacity-50 hover:opacity-100 hover:scale-105'}`}>
                <div className="w-6 h-6 border-2 rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm border-current"></div>
              </button>
              <button onClick={() => setUiShape('sharp')} className={`transition-all ${uiShape === 'sharp' ? 'text-[var(--os-accent-1)] drop-shadow-[0_0_8px_var(--os-accent-1)] scale-110' : 'text-[var(--text-muted)] opacity-50 hover:opacity-100 hover:scale-105'}`}>
                <div className="w-6 h-6 border-2 rounded-none border-current"></div>
              </button>
              <button onClick={() => setUiShape('soft')} className={`transition-all ${uiShape === 'soft' ? 'text-[var(--os-accent-1)] drop-shadow-[0_0_8px_var(--os-accent-1)] scale-110' : 'text-[var(--text-muted)] opacity-50 hover:opacity-100 hover:scale-105'}`}>
                <div className="w-6 h-6 border-2 rounded-full border-current"></div>
              </button>
            </div>
          </div>
          
          {/* Управление свечением (Glow Level) */}
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex justify-between items-center text-xs uppercase" style={{ color: textMainHex }}>
              <span>Glow Intensity</span>
              <span style={{ color: 'var(--os-accent-1)' }}>{glowLevel}%</span>
            </div>
            <input 
              type="range" min="0" max="100" step="5"
              value={glowLevel} onChange={(e) => setGlowLevel(Number(e.target.value))}
              className="w-full cursor-pointer h-1.5 bg-[var(--border-strong)] rounded-full appearance-none outline-none"
            />
          </div>

          <div className="flex items-center justify-between mt-4 border-t border-[var(--border-color)] pt-4">
            <span className="text-xs uppercase" style={{ color: textMainHex }}>Mode</span>
            <div className="flex gap-2">
              <button onClick={() => setColorMode('dark')} className={`px-3 py-1 text-xs border transition-colors ${colorMode === 'dark' ? 'border-accent' : 'border-[var(--border-strong)]'}`} style={{ color: colorMode === 'dark' ? 'var(--os-accent-1)' : textMutedHex }}>DARK</button>
              <button onClick={() => setColorMode('light')} className={`px-3 py-1 text-xs border transition-colors ${colorMode === 'light' ? 'border-accent' : 'border-[var(--border-strong)]'}`} style={{ color: colorMode === 'light' ? 'var(--os-accent-1)' : textMutedHex }}>LIGHT</button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs uppercase" style={{ color: textMainHex }}>Terminology</span>
            <div className="flex gap-2">
              <button onClick={() => setTerminology('system')} className={`px-3 py-1 text-xs border transition-colors ${terminology === 'system' ? 'border-accent' : 'border-[var(--border-strong)]'}`} style={{ color: terminology === 'system' ? 'var(--os-accent-1)' : textMutedHex }}>SYSTEM</button>
              <button onClick={() => setTerminology('human')} className={`px-3 py-1 text-xs border transition-colors ${terminology === 'human' ? 'border-accent' : 'border-[var(--border-strong)]'}`} style={{ color: terminology === 'human' ? 'var(--os-accent-1)' : textMutedHex }}>HUMAN</button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-[10px] uppercase tracking-widest border-b border-[var(--border-color)] pb-1" style={{ color: textMutedHex }}>DAEMONS_CONFIG</div>
          
          {Object.keys(daemons).map(key => {
            const d = daemons[key];
            const CurrentIcon = ICON_MAP[d.iconName] || ICON_MAP['SquareActivity'];
            
            return (
              <div key={key} className={`bg-[var(--bg-panel)] p-3 border border-[var(--border-strong)] flex flex-col gap-3 transition-all ${shapePrimary}`}>
                <div className="flex items-center gap-2 mb-1">
                  <CurrentIcon className="w-4 h-4" style={{ color: DAEMON_COLORS[key] }}/>
                  <input 
                    value={d.label} onChange={(e) => updateDaemonConfig(key, 'label', e.target.value)}
                    className="bg-transparent border-b border-[var(--border-strong)] outline-none text-xs font-bold w-full uppercase"
                    style={{ color: textMainHex }}
                  />
                </div>
                
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-[9px] mb-1 font-bold tracking-widest uppercase" style={{ color: 'var(--os-accent-1)' }}>ICON SELECTOR</span>
                  <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {Object.keys(ICON_MAP).map(iName => {
                      const IconComp = ICON_MAP[iName];
                      const isSelected = d.iconName === iName;
                      return (
                        <button
                          key={iName}
                          onClick={() => updateDaemonConfig(key, 'iconName', iName)}
                          className={`p-1.5 border shrink-0 transition-all ${isSelected ? 'border-accent bg-[var(--bg-button-active)]' : 'border-[var(--border-strong)] bg-[var(--bg-button)] opacity-50'} ${shapeSecondary}`}
                        >
                          <IconComp className="w-4 h-4" style={{ color: isSelected ? DAEMON_COLORS[key] : textMutedHex }} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 mt-1">
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[9px] mb-1 truncate" style={{ color: textMutedHex }}>MAX VALUE</span>
                    <input type="number" value={d.max} onChange={(e) => updateDaemonConfig(key, 'max', e.target.value === '' ? '' : Number(e.target.value))} className="w-full bg-[var(--bg-button)] border border-[var(--border-strong)] p-1.5 text-xs outline-none rounded-sm" style={{ color: textMainHex }} />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[9px] mb-1 truncate" style={{ color: textMutedHex }}>STEP (+ per click)</span>
                    <input type="number" value={d.step} onChange={(e) => updateDaemonConfig(key, 'step', e.target.value === '' ? '' : Number(e.target.value))} className="w-full bg-[var(--bg-button)] border border-[var(--border-strong)] p-1.5 text-xs outline-none rounded-sm" style={{ color: textMainHex }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
      <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-header)] shrink-0 mb-safe">
        <button onClick={closeModals} className={`w-full py-4 bg-[var(--bg-button)] border border-[var(--border-strong)] font-bold tracking-widest uppercase active:bg-[var(--bg-button-active)] transition-all ${shapePrimary}`} style={{ color: textMainHex }}>
          CLOSE
        </button>
      </div>
    </div>
  );
}