import { Activity, Zap, Edit2, CheckSquare, Square, RotateCcw, Snowflake, ArrowUpDown, X, Clock } from 'lucide-react';

export function CompilingScreen({ 
  activeColliderTask, textMainHex, textMutedHex, shapePrimary, shapeSecondary,
  t, terminology, colorStyle, finishCompilation, exitCompilation, updateProgress, 
  newSubtaskInput, setNewSubtaskInput, createSubtask, toggleSubtask, deleteSubtask,
  isSubtasksEditMode, setIsSubtasksEditMode, startEditSubtask, editingSubtaskId,
  editSubtaskValue, setEditSubtaskValue, saveEditSubtask, handleSubtaskEditKeyDown,
  draggedSubtaskId, handleDragStart, handleDragEnd, handleDragOver, handleDrop,
  onScheduleTask, children 
}) {
  if (!activeColliderTask) return null;

  return (
    <div className={`min-h-[100dvh] bg-[var(--bg-base)] flex flex-col items-center justify-center font-mono p-4 md:p-8 transition-colors duration-300 relative overflow-hidden ${colorStyle === 'gradient' ? 'is-gradient' : 'is-flat'}`}>
      <div className="absolute inset-0 bg-ambient pointer-events-none"></div>
      
      {/* Инъекция стилей */}
      {children}
      
      <div className="flex items-center justify-center w-full max-w-3xl mb-8 gap-4 md:gap-8 relative z-10">
        <div className="h-[2px] flex-1 relative overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(var(--os-accent-rgb), 0.15)' }}>
          <div className="absolute inset-0 w-full h-full energy-beam-left"></div>
        </div>
        
        <Activity className="w-10 h-10 md:w-12 md:h-12 energy-core shrink-0" style={{ color: 'var(--os-accent-1)' }} />
        
        <div className="h-[2px] flex-1 relative overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(var(--os-accent-rgb), 0.15)' }}>
          <div className="absolute inset-0 w-full h-full energy-beam-right"></div>
        </div>
      </div>
      
      <div className={`bg-[var(--bg-panel)] border border-[var(--border-strong)] p-6 w-full max-w-2xl relative z-10 ${shapePrimary}`}>
        <div className="text-[10px] md:text-xs tracking-widest mb-3 uppercase flex justify-between" style={{ color: textMutedHex }}>
          <div className="flex items-center gap-2">
            <span>[ {activeColliderTask.id} ] {t('compile')}</span>
            <button 
              onClick={() => onScheduleTask && onScheduleTask(activeColliderTask)} 
              className="p-1 hover:text-[var(--os-accent-1)] transition-colors opacity-70 hover:opacity-100"
            >
              <Clock className="w-3 h-3" />
            </button>
          </div>
          <span style={{ color: 'var(--os-accent-1)' }}>{activeColliderTask.progress}%</span>
        </div>
        <div className="text-lg md:text-2xl tracking-wide font-bold" style={{ color: textMainHex }}>{activeColliderTask.title}</div>
        {activeColliderTask.scheduledDate && (
          <div className="text-[10px] mt-1 mb-4 font-bold tracking-widest uppercase" style={{ color: 'var(--os-accent-2)' }}>
            T-FLUX: {activeColliderTask.scheduledDate} {activeColliderTask.scheduledTime}
          </div>
        )}
        <div className={`w-full h-1 mb-4 relative bg-[var(--bg-button)] rounded-full overflow-hidden ${!activeColliderTask.scheduledDate ? 'mt-6' : ''}`}>
          <div className="absolute top-0 left-0 h-full transition-all duration-300 glow-accent" style={{ background: 'var(--os-accent-bg)', width: `${activeColliderTask.progress}%` }} />
        </div>
        
        <div className="flex gap-2 mb-8 text-[10px] md:text-xs">
          <button onClick={() => updateProgress(-10)} className={`px-3 py-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] ${shapeSecondary}`} style={{ color: textMainHex }}>-10%</button>
          <button onClick={() => updateProgress(10)} className={`px-3 py-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] ${shapeSecondary}`} style={{ color: textMainHex }}>+10%</button>
          <button onClick={() => updateProgress(100 - activeColliderTask.progress)} className={`px-3 py-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] ml-auto ${shapeSecondary}`} style={{ color: textMainHex }}>MAX</button>
        </div>

        <div className="mb-8 border-l-2 border-[var(--border-strong)] pl-4 flex flex-col gap-3 relative">
          {activeColliderTask.subtasks?.length > 0 && (
            <button 
              onClick={() => setIsSubtasksEditMode(!isSubtasksEditMode)} 
              className={`absolute -left-[30px] top-[-2px] w-6 h-6 flex items-center justify-center shrink-0 bg-[var(--bg-base)] border transition-all z-10 ${isSubtasksEditMode ? 'border-accent' : 'border-[var(--border-strong)]'}`}
              style={{ color: isSubtasksEditMode ? 'var(--os-accent-1)' : textMutedHex, borderRadius: '4px' }}
            >
              <Edit2 className="w-3 h-3" />
            </button>
          )}

          {activeColliderTask.subtasks?.map(sub => (
            <div 
              key={sub.id} 
              draggable={isSubtasksEditMode}
              onDragStart={(e) => handleDragStart(e, sub.id)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, sub.id)}
              className={`flex items-start gap-3 text-left transition-transform ${isSubtasksEditMode ? 'p-2 bg-[var(--bg-panel)] border border-[var(--border-strong)] border-dashed cursor-grab active:cursor-grabbing items-center' : ''}`}
            >
              {isSubtasksEditMode && <ArrowUpDown className="w-4 h-4 opacity-70 shrink-0" style={{ color: textMutedHex }} />}
              
              <div className="mt-0.5 cursor-pointer shrink-0" onClick={() => !isSubtasksEditMode && toggleSubtask(sub.id)}>
                {sub.done ? <CheckSquare className="w-4 h-4" style={{ color: 'var(--os-accent-1)' }} /> : <Square className="w-4 h-4" style={{ color: textMutedHex }} />}
              </div>

              <div className="flex-1 cursor-text min-w-0" onClick={() => startEditSubtask(sub)}>
                {editingSubtaskId === sub.id ? (
                  <input autoFocus value={editSubtaskValue} onChange={(e) => setEditSubtaskValue(e.target.value)} onKeyDown={handleSubtaskEditKeyDown} onBlur={saveEditSubtask} className="bg-transparent border-b border-[var(--border-strong)] outline-none text-sm w-full font-mono" style={{ color: textMainHex }} />
                ) : (
                  <div className={`text-sm break-words ${sub.done && !isSubtasksEditMode ? 'line-through' : ''} ${isSubtasksEditMode ? 'is-fading' : ''}`} style={{ color: sub.done && !isSubtasksEditMode ? textMutedHex : textMainHex }}>
                    {sub.text}
                  </div>
                )}
              </div>

              {isSubtasksEditMode && (
                <button onClick={(e) => { e.stopPropagation(); deleteSubtask(sub.id); }} className="ml-auto text-red-500/60 hover:text-red-500"><X className="w-4 h-4" /></button>
              )}
            </div>
          ))}
          
          <div className="flex items-center gap-2 mt-2">
            <span style={{ color: textMutedHex }}>&gt;</span>
            <input value={newSubtaskInput} onChange={(e) => setNewSubtaskInput(e.target.value)} onKeyDown={createSubtask} placeholder="..." className="bg-transparent border-none outline-none text-sm w-full font-mono placeholder-[var(--text-muted)]" style={{ color: textMainHex }} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-10 pt-6 border-t border-[var(--border-strong)]">
          <div className="flex gap-2">
            <button onClick={() => exitCompilation('ACTIVE_RAM')} className={`flex-1 text-[10px] md:text-xs uppercase bg-[var(--bg-button)] border border-[var(--border-strong)] px-3 py-3 flex items-center justify-center gap-2 ${shapePrimary}`} style={{ color: textMainHex }}>
              <RotateCcw className="w-3 h-3" /> {terminology === 'system' ? 'BACK' : 'НАЗАД'}
            </button>
            <button onClick={() => exitCompilation('CRYO')} className={`flex-1 text-[10px] md:text-xs uppercase bg-[var(--bg-panel)] border border-[var(--border-strong)] px-3 py-3 flex items-center justify-center gap-2 ${shapePrimary}`} style={{ color: 'var(--os-accent-1)' }}>
              <Snowflake className="w-3 h-3" /> {t('cryo')}
            </button>
          </div>
          <button onClick={finishCompilation} className={`text-xs uppercase font-bold tracking-widest px-6 py-3 flex items-center justify-center gap-2 glow-accent ${shapeSecondary}`} style={{ background: 'var(--os-accent-bg)', color: 'var(--os-accent-text)' }}>
            <Zap className="w-4 h-4" /> FINISH
          </button>
        </div>
      </div>
    </div>
  );
}