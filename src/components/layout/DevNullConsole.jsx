import { Wind } from 'lucide-react';

export function DevNullConsole({ 
  shapePrimary, isDevNullFading, devNullInput, setDevNullInput, handleDevNull 
}) {
  return (
    <div className={`fixed bottom-6 right-6 left-6 md:left-auto md:w-80 z-40 bg-[var(--bg-header)] border border-[var(--border-strong)] p-3 transition-all ${shapePrimary}`}>
      <div className="flex items-center gap-2 text-[var(--text-muted)]">
        <Wind className="w-4 h-4 shrink-0" />
        <input 
          type="text" 
          value={devNullInput}
          onChange={(e) => { if (!isDevNullFading) setDevNullInput(e.target.value) }}
          onKeyDown={handleDevNull}
          placeholder="/dev/null (сброс мыслей)..."
          className={`bg-transparent border-none outline-none text-[10px] md:text-xs w-full font-mono placeholder-[var(--text-muted)] text-[var(--text-muted)] ${isDevNullFading ? 'dev-null-fade' : ''}`}
        />
      </div>
    </div>
  );
}