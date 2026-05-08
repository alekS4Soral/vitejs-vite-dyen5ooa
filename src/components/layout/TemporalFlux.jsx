import React from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

export function TemporalFlux({ tasks, t, shapeSecondary, textMainHex, textMutedHex }) {
  // Фильтруем задачи, у которых задана дата
  const scheduledTasks = tasks
    .filter(task => task.scheduledDate)
    .sort((a, b) => new Date(a.scheduledDate + ' ' + (a.scheduledTime || '00:00')) - new Date(b.scheduledDate + ' ' + (b.scheduledTime || '00:00')));

  const getStateColor = (state) => {
    switch (state) {
      case 'ACTIVE_RAM': return 'var(--os-accent-1)';
      case 'BUFFER': return 'var(--os-accent-2)';
      case 'CRYO': return '#64748b';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className={`flex flex-col gap-4 p-4 bg-[var(--bg-panel)] border border-[var(--border-strong)] ${shapeSecondary}`}>
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
        <CalendarIcon className="w-4 h-4" style={{ color: 'var(--os-accent-1)' }} />
        <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: textMainHex }}>
          Temporal_Flux_Interface
        </span>
      </div>

      <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {scheduledTasks.length === 0 ? (
          <div className="text-[9px] uppercase italic opacity-50" style={{ color: textMutedHex }}>
            Данные о времени отсутствуют...
          </div>
        ) : (
          scheduledTasks.map(task => (
            <div 
              key={task.id} 
              className="flex items-center gap-3 p-2 border-l-2 bg-[var(--bg-base)]/50"
              style={{ borderLeftColor: getStateColor(task.state) }}
            >
              <div className="flex flex-col min-w-[60px]">
                <span className="text-[10px] font-bold" style={{ color: textMainHex }}>
                  {task.scheduledDate.split('-').reverse().slice(0, 2).join('.')}
                </span>
                <span className="text-[9px]" style={{ color: textMutedHex }}>
                  {task.scheduledTime || '--:--'}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase truncate font-medium" style={{ color: textMainHex }}>
                  {task.title}
                </div>
                <div className="text-[8px] uppercase tracking-tighter" style={{ color: getStateColor(task.state) }}>
                  System_State: {task.state}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}