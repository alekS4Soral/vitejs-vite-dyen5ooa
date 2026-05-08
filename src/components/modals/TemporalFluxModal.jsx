import React, { useState } from 'react';
import { X, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export function TemporalFluxModal({ tasks, moveTask, onClose, shapePrimary, shapeSecondary, textMainHex, textMutedHex, t }) {
  const [mode, setMode] = useState('STREAM');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  // Собираем только задачи с датами и сортируем их от ближайших к дальним
  const scheduledTasks = tasks
    .filter(t => t.scheduledDate)
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

  const getStateColor = (state) => {
    if (state === 'ACTIVE_RAM') return 'var(--os-accent-1)';
    if (state === 'BUFFER') return 'var(--os-accent-2)';
    return '#475569';
  };

  // --- ЛОГИКА STREAM ---
  const getMonthAndWeek = (dateString) => {
    const d = new Date(dateString);
    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const date = d.getDate();
    const weekOfMonth = Math.ceil(date / 7);
    return `${month} / WEEK ${weekOfMonth}`;
  };

  const streamGroups = scheduledTasks.reduce((acc, task) => {
    const key = getMonthAndWeek(task.scheduledDate);
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {});

  // --- ЛОГИКА MATRIX ---
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); 
    const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Monday starts
    
    const days = [];
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
       const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
       const tasksForDay = scheduledTasks.filter(t => t.scheduledDate === dateStr);
       days.push({ day: i, dateStr, tasks: tasksForDay });
    }
    return days;
  };

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const matrixDays = getDaysInMonth();
  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <div className="fixed inset-0 z-50 flex flex-col font-mono bg-[var(--bg-base)]">
      {/* Шапка модалки */}
      <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-header)] flex justify-between items-center mt-safe shrink-0">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5" style={{ color: 'var(--os-accent-2)' }} />
          <div className="hidden sm:block text-xs tracking-widest uppercase font-bold" style={{ color: textMainHex }}>{t('temporal')}</div>
        </div>

        <div className={`flex bg-[var(--bg-base)] border border-[var(--border-strong)] p-1 text-[9px] sm:text-[10px] font-bold ${shapeSecondary}`}>
          <button 
            onClick={() => setMode('STREAM')}
            className={`px-3 py-1 uppercase tracking-widest transition-all ${shapeSecondary} ${mode === 'STREAM' ? 'bg-[var(--bg-button)]' : 'opacity-50 hover:opacity-80'}`}
            style={{ color: mode === 'STREAM' ? 'var(--os-accent-1)' : textMainHex }}
          >
            {t('streamMode') || 'Stream'}
          </button>
          <button 
            onClick={() => setMode('MATRIX')}
            className={`px-3 py-1 uppercase tracking-widest transition-all ${shapeSecondary} ${mode === 'MATRIX' ? 'bg-[var(--bg-button)]' : 'opacity-50 hover:opacity-80'}`}
            style={{ color: mode === 'MATRIX' ? 'var(--os-accent-1)' : textMainHex }}
          >
            {t('matrixMode') || 'Matrix'}
          </button>
        </div>

        <button onClick={onClose} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] ${shapeSecondary}`}>
          <X className="w-4 h-4" style={{ color: textMainHex }} />
        </button>
      </div>

      {/* Содержимое */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-8 custom-scrollbar">
        
        {mode === 'STREAM' ? (
          Object.keys(streamGroups).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-30 gap-4">
              <Clock className="w-12 h-12" />
              <div className="text-[10px] uppercase tracking-[0.4em]">No_Temporal_Data_Detected</div>
            </div>
          ) : (
            Object.keys(streamGroups).map(weekGroup => (
              <div key={weekGroup} className="flex flex-col gap-3 max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black opacity-40 tracking-[0.3em]" style={{ color: textMainHex }}>{weekGroup}</span>
                  <div className="h-[1px] flex-1 bg-[var(--border-color)] opacity-20"></div>
                </div>
                
                <div className="flex flex-col gap-2">
                  {streamGroups[weekGroup].map(task => (
                    <div key={task.id} 
                      className={`p-3 sm:p-4 bg-[var(--bg-panel)] border-l-4 border border-[var(--border-strong)] flex justify-between items-center ${shapeSecondary}`}
                      style={{ borderLeftColor: getStateColor(task.state) }}
                    >
                      <div className="flex flex-col min-w-0 flex-1 pr-4">
                        <span className="text-[8px] sm:text-[9px] opacity-60 uppercase tracking-widest mb-1 font-bold flex gap-2 items-center" style={{ color: textMutedHex }}>
                          <span style={{ color: 'var(--os-accent-2)' }}>[{task.scheduledDate}]</span>
                          <span>{task.scheduledTime || 'NO_TIME'}</span>
                        </span>
                        <span className="text-xs sm:text-sm font-semibold uppercase truncate" style={{ color: textMainHex }}>
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
          )
        ) : (
          /* РЕЖИМ MATRIX */
          <div className="flex flex-col h-full max-w-4xl mx-auto w-full gap-2 sm:gap-4">
            <div className="flex justify-between items-center px-2 py-2 sm:py-4 border-b border-[var(--border-color)] shrink-0">
              <button onClick={() => changeMonth(-1)} className={`p-2 border border-[var(--border-strong)] hover:bg-[var(--bg-button)] transition-all ${shapeSecondary}`} style={{ color: textMainHex }}><ChevronLeft className="w-4 h-4" /></button>
              <div className="text-sm font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--os-accent-1)' }}>
                {currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              <button onClick={() => changeMonth(1)} className={`p-2 border border-[var(--border-strong)] hover:bg-[var(--bg-button)] transition-all ${shapeSecondary}`} style={{ color: textMainHex }}><ChevronRight className="w-4 h-4" /></button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 sm:gap-2 shrink-0">
              {weekDays.map(day => (
                <div key={day} className="text-center text-[9px] py-1 sm:py-2 uppercase opacity-50 font-bold" style={{ color: textMainHex }}>
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1 sm:gap-2 flex-1 min-h-0 auto-rows-fr pb-4">
              {matrixDays.map((md, idx) => (
                <div key={idx} 
                  onClick={() => md && md.tasks.length > 0 && setSelectedDay(md)}
                  className={`min-h-0 p-1 sm:p-2 border border-[var(--border-strong)] bg-[var(--bg-panel)] flex flex-col gap-1 overflow-hidden ${md ? '' : 'opacity-10'} ${md && md.tasks.length > 0 ? 'cursor-pointer hover:border-[var(--os-accent-2)] transition-all' : ''} ${shapeSecondary}`}
                >
                  {md ? (
                    <>
                      <div className="text-[10px] font-bold opacity-70 leading-none" style={{ color: textMainHex }}>{md.day}</div>
                      {md.tasks.length > 0 && (
                        <div className={`mt-auto text-[8px] sm:text-[10px] font-bold py-1 px-0.5 bg-[var(--bg-base)] border border-[var(--border-strong)] text-center tracking-widest truncate flex items-center justify-center ${shapeSecondary}`} style={{ color: 'var(--os-accent-2)' }}>
                          <span>{md.tasks.length}</span><span className="hidden sm:inline ml-1">TASK{md.tasks.length !== 1 ? 'S' : ''}</span>
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Модалка деталей дня */}
      {selectedDay && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md bg-[var(--bg-panel)] border border-[var(--border-strong)] p-6 flex flex-col gap-6 max-h-[80vh] overflow-y-auto custom-scrollbar ${shapePrimary}`}>
            <div className="flex items-center justify-between border-b border-[var(--border-strong)] pb-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5" style={{ color: 'var(--os-accent-2)' }} />
                <div className="text-sm tracking-widest font-bold uppercase" style={{ color: textMainHex }}>{selectedDay.dateStr}</div>
              </div>
              <button onClick={() => setSelectedDay(null)} className="p-1 hover:text-[var(--os-accent-1)] transition-colors opacity-70 hover:opacity-100"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="flex flex-col gap-3">
              {selectedDay.tasks.map(t => {
                const task = tasks.find(x => x.id === t.id) || t;
                return (
                <div key={task.id} className={`p-3 bg-[var(--bg-base)] border-l-4 border border-[var(--border-strong)] flex flex-col gap-3 ${shapeSecondary}`} style={{ borderLeftColor: getStateColor(task.state) }}>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-sm font-semibold truncate" style={{ color: textMainHex }}>{task.title}</span>
                    <span className="text-[8px] px-2 py-0.5 border border-[var(--border-strong)] uppercase shrink-0 bg-[var(--bg-panel)]" style={{ color: textMutedHex }}>{task.state}</span>
                  </div>
                  {(task.scheduledTime) && (
                     <div className="text-[10px] font-bold tracking-widest uppercase opacity-70" style={{ color: 'var(--os-accent-2)' }}>
                        {task.scheduledTime}
                     </div>
                  )}
                  
                  <div className="flex gap-2 mt-2 pt-3 border-t border-[var(--border-color)]">
                    <button 
                      onClick={() => moveTask && moveTask(task.id, 'ACTIVE_RAM')} 
                      className={`flex-1 px-2 py-1.5 text-[9px] uppercase border border-[var(--border-color)] hover:bg-[var(--bg-button)] active:bg-[var(--bg-button-active)] transition-colors`}
                      style={{ color: 'var(--os-accent-1)' }}
                    >
                      MOVE TO RAM
                    </button>
                    <button 
                      onClick={() => moveTask && moveTask(task.id, 'CRYO')} 
                      className={`flex-1 px-2 py-1.5 text-[9px] uppercase border border-[var(--border-color)] hover:bg-[var(--bg-button)] active:bg-[var(--bg-button-active)] transition-colors`}
                      style={{ color: textMainHex }}
                    >
                      MOVE TO CRYO
                    </button>
                  </div>
                </div>
              );})}
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}