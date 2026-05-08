import { BookOpen, X } from 'lucide-react';

export function ManualModal({ closeModals, t, textMainHex, textMutedHex, shapePrimary, shapeSecondary }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col font-mono bg-[var(--bg-base)] transition-colors duration-300">
      <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-header)] flex justify-between items-center mt-safe shrink-0">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5" style={{ color: textMutedHex }} />
          <div className="text-xs tracking-widest uppercase font-bold" style={{ color: textMainHex }}>{t('manual')}</div>
        </div>
        <button onClick={closeModals} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] transition-all ${shapeSecondary}`} style={{ color: textMainHex }}>
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-6 overflow-y-auto flex flex-col gap-6 flex-1 text-sm leading-relaxed" style={{ color: textMainHex }}>
        <p>Добро пожаловать в <strong>ColdCache.OS</strong>. Это терминал управления когнитивной нагрузкой.</p>
        
        <div className="flex flex-col gap-2">
          <div className="font-bold" style={{ color: 'var(--os-accent-1)' }}>1. {t('buffer')} (Буфер)</div>
          <p style={{ color: textMutedHex }}>Место для сброса хаоса. Возникла мысль или задача? Быстро записывай её сюда и закрывай терминал. Не держи в голове.</p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="font-bold" style={{ color: 'var(--os-accent-1)' }}>2. {t('ram')} (Слоты фокуса)</div>
          <p style={{ color: textMutedHex }}>То, что ты делаешь прямо сейчас. Жесткий лимит — 2 слота. Если пытаешься взять третью задачу, система не даст этого сделать, пока не освободишь память.</p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="font-bold" style={{ color: 'var(--os-accent-1)' }}>3. {t('cryo')} (Отложенное)</div>
          <p style={{ color: textMutedHex }}>Задачи, которые нужно сделать, но не сегодня или не сейчас. Замораживай их здесь, чтобы они не мозолили глаза в фокусе.</p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="font-bold" style={{ color: 'var(--os-accent-1)' }}>4. {t('render')} (Гиперфокус)</div>
          <p style={{ color: textMutedHex }}>Когда нажимаешь эту кнопку, задача разворачивается на весь экран. Внутри можно создать чек-лист микро-шагов. Если свернуть приложение, состояние рендера сохранится.</p>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="font-bold" style={{ color: 'var(--os-accent-1)' }}>5. Daemons (Трекеры)</div>
          <p style={{ color: textMutedHex }}>Три верхние плашки для отслеживания рутины (шаги, вода, что угодно). Настраиваются индивидуально через меню параметров.</p>
        </div>
      </div>
      
      <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-header)] shrink-0 mb-safe">
        <button onClick={closeModals} className={`w-full py-4 bg-[var(--bg-button)] border border-[var(--border-strong)] font-bold tracking-widest uppercase active:bg-[var(--bg-button-active)] transition-all ${shapePrimary}`} style={{ color: textMainHex }}>
          ПОНЯТНО
        </button>
      </div>
    </div>
  );
}