import React from 'react';
import { X, Calendar, Clock } from 'lucide-react';

export function TemporalFluxModal({ tasks, onClose, shapePrimary, shapeSecondary, textMainHex, textMutedHex }) {
  // Собираем только задачи с датами и сортируем их от ближайших к дальним
  const scheduledTasks = tasks
    .filter(t => t.scheduledDate)
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

  // Группировка задач по неделям для снижения когнитивной нагрузки
  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - yearStart) / 8.64e7) + 1) / 7);
  };

  const weeks = scheduledTasks.reduce((acc, task) => {
    const week = getWeekNumber(task.scheduledDate);
    if (!acc[week]) acc[week] = [];
    acc[week].push(task);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex flex-col font-mono bg-[var(--bg-base)]">
      {/* Шапка модалки */}
      <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-header)] flex justify-between items-center mt-safe shrink-0">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5" style={{ color: 'var(--os-accent-2)' }} />
          <div className="text-xs tracking-widest uppercase font-bold" style={{ color: textMainHex }}>Temporal_Flux_Stream</div>
        </div>
        <button onClick={onClose} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] ${shapeSecondary}`}>
          <X className="w-4 h-4" style={{ color: textMainHex }} />
        </button>
      </div>

      {/* Содержимое ленты */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-8 custom-scrollbar">
        {Object.keys(weeks).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30 gap-4">
            <Clock className="w-12 h-12" />
            <div className="text-[10px] uppercase tracking-[0.4em]">No_Temporal_Data_Detected</div>
          </div>
        ) : (
          Object.keys(weeks).map(weekNum => (
            <div key={weekNum} className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black opacity-30 tracking-[0.3em]">WEEK_{weekNum}</span>
                <div className="h-[1px] flex-1 bg-[var(--border-color)] opacity-20"></div>
              </div>
              
              <div className="flex flex-col gap-2">
                {weeks[weekNum].map(task => (
                  <div key={task.id} 
                    className={`p-4 bg-[var(--bg-panel)] border-l-4 border border-[var(--border-strong)] flex justify-between items-center ${shapeSecondary}`}
                    style={{ borderLeftColor: task.state === 'ACTIVE_RAM' ? 'var(--os-accent-1)' : (task.state === 'BUFFER' ? 'var(--os-accent-2)' : '#475569') }}
                  >
                    <div className="flex flex-col min-w-0 flex-1 pr-4">
                      <span className="text-[8px] opacity-50 uppercase tracking-tighter mb-1" style={{ color: textMutedHex }}>
                        {task.scheduledDate} // {task.scheduledTime || 'NO_TIME'}
                      </span>
                      <span className="text-xs font-bold uppercase truncate" style={{ color: textMainHex }}>
                        {task.title}
                      </span>
                    </div>
                    <div className={`text-[8px] px-2 py-1 bg-[var(--bg-base)] border border-[var(--border-strong)] uppercase shrink-0 ${shapeSecondary}`} style={{ color: textMutedHex }}>
                      {task.state}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}