import { Cpu, Edit2, Snowflake, Zap } from 'lucide-react';

export function ActiveRamPanel({
  t, textMainHex, textMutedHex, shapePrimary, shapeSecondary,
  activeTasks, editingNodeId, editInputValue, setEditInputValue,
  handleEditKeyDown, saveEditNode, startEditNode, moveTask, startCompilation
}) {
  return (
    <section className="lg:col-span-8 flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-[var(--border-strong)] pb-2">
        <Cpu className="w-4 h-4" style={{ color: textMainHex }} />
        <h2 className="uppercase tracking-widest text-xs font-semibold m-0" style={{ color: textMainHex }}>{t('ram')}</h2>
        <span className="ml-auto text-[10px]" style={{ color: textMutedHex }}>СЛОТЫ: {activeTasks.length}/2</span>
      </div>
      
      <div className="grid gap-4">
        {activeTasks.map(task => (
          <div key={task.id} className={`bg-[var(--bg-panel)] border border-[var(--border-strong)] p-4 md:p-5 relative flex flex-col gap-4 transition-all glow-accent ${shapePrimary}`}>
            <div className="absolute top-0 left-0 h-0.5 transition-all glow-accent" style={{ background: 'var(--os-accent-bg)', width: `${task.progress}%` }} />
            
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="text-[10px] tracking-widest mb-1.5" style={{ color: textMutedHex }}>{task.id}</div>
                {editingNodeId === task.id ? (
                  <input 
                    autoFocus
                    value={editInputValue}
                    onChange={(e) => setEditInputValue(e.target.value)}
                    onKeyDown={handleEditKeyDown}
                    onBlur={saveEditNode}
                    className="bg-transparent border-b border-[var(--border-strong)] outline-none text-sm md:text-base w-full font-mono"
                    style={{ color: textMainHex }}
                  />
                ) : (
                  <div className="text-sm md:text-base font-semibold break-words pr-2" style={{ color: textMainHex }}>{task.title}</div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className={`text-[10px] px-2 py-1 bg-[var(--bg-button)] border border-[var(--border-strong)] ${shapeSecondary}`} style={{ color: 'var(--os-accent-1)' }}>{task.progress}%</div>
                {editingNodeId !== task.id && (
                  <button onClick={() => startEditNode(task)} className="p-1 active:opacity-70" style={{ color: textMutedHex }}><Edit2 className="w-3 h-3"/></button>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mt-2 border-t border-[var(--border-color)] pt-4">
              <button onClick={() => moveTask(task.id, 'CRYO')} className={`text-[10px] uppercase px-3 py-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] flex items-center gap-1.5 transition-all ${shapeSecondary}`} style={{ color: textMainHex }}>
                <Snowflake className="w-3 h-3" /> {t('cryo')}
              </button>
              <button onClick={() => startCompilation(task)} className={`text-[10px] md:text-xs uppercase px-6 py-2.5 font-bold tracking-widest flex items-center gap-2 active:opacity-80 transition-all ${shapeSecondary}`} style={{ background: 'var(--os-accent-bg)', color: 'var(--os-accent-text)' }}>
                <Zap className="w-3 h-3" /> {t('render')}
              </button>
            </div>
          </div>
        ))}
        {activeTasks.length === 0 && (
          <div className={`h-24 border border-[var(--border-color)] border-dashed flex items-center justify-center text-[10px] uppercase tracking-widest ${shapePrimary}`} style={{ color: textMutedHex }}>{t('emptyMem')}</div>
        )}
      </div>
    </section>
  );
}