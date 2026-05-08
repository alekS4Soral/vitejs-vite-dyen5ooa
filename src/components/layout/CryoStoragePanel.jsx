import { Snowflake, Edit2, Clock, Trash2 } from 'lucide-react';

export function CryoStoragePanel({
  t, textMainHex, textMutedHex, shapePrimary, shapeSecondary,
  cryoTasks, editingNodeId, editInputValue, setEditInputValue,
  handleEditKeyDown, saveEditNode, startEditNode, moveTask, setTasks, onScheduleTask
}) {
  return (
    <section className="lg:col-span-4 flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-[var(--border-strong)] pb-2">
        <Snowflake className="w-4 h-4" style={{ color: textMutedHex }} />
        <h2 className="uppercase tracking-widest text-xs font-semibold m-0" style={{ color: textMutedHex }}>{t('cryo')}</h2>
      </div>
      
      <div className="flex flex-col gap-2">
        {cryoTasks.map(task => (
          <div key={task.id} className={`bg-[var(--bg-panel)] border border-[var(--border-color)] p-3 opacity-70 hover:opacity-100 transition-all ${shapePrimary}`}>
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              {editingNodeId === task.id ? (
                 <input 
                   autoFocus value={editInputValue} onChange={(e) => setEditInputValue(e.target.value)} onKeyDown={handleEditKeyDown} onBlur={saveEditNode}
                   className="bg-transparent border-b border-[var(--border-strong)] outline-none text-xs w-full font-mono mb-3"
                   style={{ color: textMainHex }}
                 />
              ) : (
                <div className="mb-3">
                  <div className="text-xs md:text-sm font-semibold truncate" style={{ color: textMainHex }}>{task.title}</div>
                  {task.scheduledDate && (
                    <div className="text-[9px] mt-2 font-bold tracking-widest uppercase" style={{ color: 'var(--os-accent-2)' }}>
                      T-FLUX: {task.scheduledDate} {task.scheduledTime}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-1 shrink-0">
              <button 
                onClick={() => onScheduleTask(task)} 
                className="p-1 hover:text-[var(--os-accent-1)] opacity-50 hover:opacity-100 transition-all"
              >
                <Clock className="w-3 h-3"/>
              </button>
              <button onClick={() => startEditNode(task)} className="p-1 opacity-50 hover:opacity-100 transition-all" style={{ color: textMainHex }}>
                <Edit2 className="w-3 h-3"/>
              </button>
            </div>
          </div>
          
          <div className="flex justify-between border-t border-[var(--border-color)] pt-2 items-center mt-1">
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