import React, { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';

export function ScheduleModal({ task, onClose, onSave, shapePrimary, textMainHex, textMutedHex }) {
  const [date, setDate] = useState(task.scheduledDate || '');
  const [time, setTime] = useState(task.scheduledTime || '');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-xs bg-[var(--bg-panel)] border border-[var(--os-accent-1)] p-4 shadow-[0_0_20px_rgba(6,182,212,0.2)] ${shapePrimary}`}>
        <div className="flex justify-between items-center mb-4 border-b border-[var(--border-color)] pb-2">
          <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: textMainHex }}>Schedule_Task</span>
          <button onClick={onClose}><X className="w-4 h-4" style={{ color: textMutedHex }} /></button>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] uppercase opacity-50" style={{ color: textMainHex }}>Select_Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} 
              className="bg-[var(--bg-base)] border border-[var(--border-strong)] p-2 text-xs outline-none" style={{ color: textMainHex }} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] uppercase opacity-50" style={{ color: textMainHex }}>Select_Time</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} 
              className="bg-[var(--bg-base)] border border-[var(--border-strong)] p-2 text-xs outline-none" style={{ color: textMainHex }} />
          </div>
          <button 
            onClick={() => { onSave(task.id, date, time); onClose(); }}
            className={`w-full py-3 bg-[var(--os-accent-1)] text-black font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all ${shapePrimary}`}
          >
            Apply_Temporal_Link
          </button>
        </div>
      </div>
    </div>
  );
}