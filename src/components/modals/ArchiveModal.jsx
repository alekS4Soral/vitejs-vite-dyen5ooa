import { Archive, X, RotateCcw } from 'lucide-react';

export function ArchiveModal({ closeModals, t, textMainHex, textMutedHex, shapePrimary, shapeSecondary, renderLog, restoreFromArchive }) {
  
  // Подсчет веса архива теперь живет прямо внутри компонента
  const totalRenderedData = renderLog.reduce((sum, task) => sum + task.weight, 0);

  return (
    <div className="fixed inset-0 z-50 flex flex-col font-mono bg-[var(--bg-base)] transition-colors duration-300">
      <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-header)] flex justify-between items-center mt-safe shrink-0">
        <div className="flex items-center gap-3">
          <Archive className="w-5 h-5" style={{ color: textMutedHex }} />
          <div>
            <div className="text-xs tracking-widest uppercase font-bold" style={{ color: textMainHex }}>{t('archive')}</div>
            <div className="text-[9px] tracking-widest" style={{ color: 'var(--os-accent-1)' }}>DATA: {totalRenderedData} MB</div>
          </div>
        </div>
        <button onClick={closeModals} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] transition-all ${shapeSecondary}`} style={{ color: textMainHex }}>
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-4 overflow-y-auto flex flex-col gap-3 flex-1 content-start">
        {renderLog.map((task, idx) => (
          <div key={idx} className={`bg-[var(--bg-panel)] border border-[var(--border-strong)] p-3 flex justify-between items-center gap-4 transition-all ${shapePrimary}`}>
            <div className="flex-1">
              <div className="text-[9px] mb-1 font-mono flex gap-2" style={{ color: textMutedHex }}>
                <span>{task.completedAt}</span>
                <span style={{ color: 'var(--os-accent-1)' }}>[{task.id}]</span>
              </div>
              <div className="text-sm font-semibold" style={{ color: textMainHex }}>{task.title}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => restoreFromArchive(task.id)} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] transition-all ${shapeSecondary}`} style={{ color: textMutedHex }} title="Restore to Cryo">
                <RotateCcw className="w-3 h-3" />
              </button>
              <div className={`text-[10px] px-2 py-1 bg-[var(--bg-button)] border border-[var(--border-strong)] font-bold transition-all ${shapeSecondary}`} style={{ color: textMutedHex }}>
                +{task.weight}MB
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-header)] shrink-0 mb-safe">
        <button onClick={closeModals} className={`w-full py-4 bg-[var(--bg-button)] border border-[var(--border-strong)] font-bold tracking-widest uppercase active:bg-[var(--bg-button-active)] transition-all ${shapePrimary}`} style={{ color: textMainHex }}>
          CLOSE
        </button>
      </div>
    </div>
  );
}