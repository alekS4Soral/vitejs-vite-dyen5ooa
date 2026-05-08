import { Snowflake, Edit2 } from 'lucide-react';

export function CryoStoragePanel({
  t, textMainHex, textMutedHex, shapePrimary, shapeSecondary,
  cryoTasks, editingNodeId, editInputValue, setEditInputValue,
  handleEditKeyDown, saveEditNode, startEditNode, moveTask, setTasks
}) {
  return (
    <section className="lg:col-span-4 flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-[var(--border-strong)] pb-2">
        <Snowflake className="w-4 h-4" style={{ color: textMutedHex }} />
        <h2 className="uppercase tracking-widest text-xs font-semibold m-0" style={{ color: textMutedHex }}>{t('cryo')}</h2>
      </div>
      
      <div className="flex flex-col gap-2">
        {cryoTasks.map(task => (
          <div key={task.id} className={`bg-[var(--bg-panel)] border border-[var(--border-color)] p-3 opacity-70 active:opacity-100 transition-all ${shapePrimary}`}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[9px] tracking-widest" style={{ color: textMutedHex }}>{task.id}</span>
              <button onClick={() => startEditNode(task)} className="p-1" style={{ color: textMutedHex }}><Edit2 className="w-3 h-3"/></button>
            </div>
            {editingNodeId === task.id ? (
               <input 
                 autoFocus value={editInputValue} onChange={(e) => setEditInputValue(e.target.value)} onKeyDown={handleEditKeyDown} onBlur={saveEditNode}
                 className="bg-transparent border-b border-[var(--border-strong)] outline-none text-xs w-full font-mono mb-3"
                 style={{ color: textMainHex }}
               />
            ) : (
              <div className="text-xs md:text-sm mb-3 opacity-80" style={{ color: textMainHex }}>{task.title}</div>
            )}
            
            <div className="flex justify-between border-t border-[var(--border-color)] pt-2 items-center">
              <button onClick={() => setTasks(prev => prev.filter(t => t.id !== task.id))} className="text-[10px] uppercase py-1 hover:text-red-500 transition-colors" style={{ color: textMutedHex }}>{t('drop')}</button>
              <button onClick={() => moveTask(task.id, 'ACTIVE_RAM')} className={`text-[10px] uppercase bg-[var(--bg-button)] border border-[var(--border-strong)] px-3 py-1 active:bg-[var(--bg-button-active)] transition-all ${shapeSecondary}`} style={{ color: textMainHex }}>
                {t('ram')}
              </button>
            </div>
          </div>
        ))}
        {cryoTasks.length === 0 && <div className="h-12 flex items-center text-[10px] uppercase tracking-widest" style={{ color: textMutedHex }}>{t('emptyCryo')}</div>}
      </div>
    </section>
  );
}