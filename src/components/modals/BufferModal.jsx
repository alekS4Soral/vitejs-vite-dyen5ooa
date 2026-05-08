import { Database, Terminal, X, Edit2 } from 'lucide-react';

export function BufferModal({ 
  closeModals, t, textMainHex, textMutedHex, shapePrimary, shapeSecondary, 
  bufferTasks, newTaskInput, setNewTaskInput, createNewTask, 
  isBufferReversed, setIsBufferReversed, 
  startEditNode, editingNodeId, editInputValue, setEditInputValue, handleEditKeyDown, saveEditNode, moveTask 
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col font-mono bg-[var(--bg-base)] transition-colors duration-300">
      <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-header)] flex justify-between items-center mt-safe shrink-0">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5" style={{ color: textMutedHex }} />
          <div>
            <div className="text-xs tracking-widest uppercase font-bold" style={{ color: textMainHex }}>{t('buffer')}</div>
          </div>
        </div>
        <button onClick={closeModals} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] transition-all ${shapeSecondary}`} style={{ color: textMainHex }}>
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-panel)] flex items-center gap-3 shrink-0">
        <Terminal className="w-4 h-4" style={{ color: 'var(--os-accent-1)' }} />
        <input 
          type="text" 
          value={newTaskInput}
          onChange={(e) => setNewTaskInput(e.target.value)}
          onKeyDown={createNewTask}
          placeholder={`${t('inject')} (Enter)`}
          className="bg-transparent border-none outline-none text-sm md:text-base w-full font-mono placeholder-[var(--text-muted)]"
          style={{ color: textMainHex }}
        />
        <button 
          onClick={() => setIsBufferReversed(!isBufferReversed)}
          className={`px-3 py-1.5 border transition-all ${shapeSecondary} ${isBufferReversed ? 'border-accent' : 'border-[var(--border-strong)]'}`}
          style={{ 
            color: isBufferReversed ? 'var(--os-accent-text)' : textMutedHex,
            background: isBufferReversed ? 'var(--os-accent-bg)' : 'transparent'
          }}
        >
          {isBufferReversed ? 'NEW' : 'OLD'}
        </button>
      </div>
      
      <div className="p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 content-start flex-1">
        {(isBufferReversed ? [...bufferTasks].reverse() : bufferTasks).map(task => (
          <div key={task.id} className={`bg-[var(--bg-panel)] border border-[var(--border-strong)] p-4 flex flex-col justify-between transition-all ${shapePrimary}`}>
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="text-[9px] font-mono" style={{ color: textMutedHex }}>{task.id}</div>
                <button onClick={() => startEditNode(task)} className="p-1" style={{ color: textMutedHex }}><Edit2 className="w-3 h-3"/></button>
              </div>
              {editingNodeId === task.id ? (
                <input 
                  autoFocus value={editInputValue} onChange={(e) => setEditInputValue(e.target.value)} onKeyDown={handleEditKeyDown} onBlur={saveEditNode}
                  className="bg-transparent border-b border-[var(--border-strong)] outline-none text-sm w-full font-mono"
                  style={{ color: textMainHex }}
                />
              ) : (
                <div className="text-sm" style={{ color: textMainHex }}>{task.title}</div>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-[var(--border-color)]">
              <button onClick={() => moveTask(task.id, 'CRYO')} className={`text-[9px] md:text-[10px] uppercase px-4 py-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] transition-all ${shapeSecondary}`} style={{ color: textMainHex }}>{t('cryo')}</button>
              <button onClick={() => { moveTask(task.id, 'ACTIVE_RAM'); closeModals(); }} className={`text-[9px] md:text-[10px] uppercase px-4 py-2 border border-transparent font-bold active:opacity-80 transition-all ${shapeSecondary}`} style={{ background: 'var(--os-accent-bg)', color: 'var(--os-accent-text)' }}>{t('ram')}</button>
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