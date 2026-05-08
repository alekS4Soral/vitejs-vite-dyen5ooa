import { Trash2 } from 'lucide-react';

export function DevNullConsole({ 
  t, textMutedHex, shapePrimary, isDevNullFading, 
  devNullInput, setDevNullInput, handleDrop 
}) {
  return (
    <div 
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={`mt-10 mb-20 p-8 border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center gap-4 relative overflow-hidden ${isDevNullFading ? 'border-red-500 bg-red-500/10 scale-95 opacity-50' : 'border-[var(--border-color)] opacity-30 hover:opacity-60'} ${shapePrimary}`}
    >
      <Trash2 className={`w-8 h-8 ${isDevNullFading ? 'animate-bounce text-red-500' : ''}`} style={{ color: textMutedHex }} />
      <div className="text-[10px] tracking-[0.5em] uppercase font-bold" style={{ color: textMutedHex }}>Dev/null</div>
      <input 
        type="text"
        value={devNullInput}
        onChange={(e) => setEditInputValue(e.target.value)} // Здесь может быть лог или просто поле
        readOnly
        placeholder="Drop nodes here to terminate"
        className="bg-transparent border-none outline-none text-[9px] text-center w-full uppercase tracking-widest pointer-events-none"
      />
    </div>
  );
}