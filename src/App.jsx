import React, { useState, useEffect } from 'react';
import { Power, ShieldAlert, Cpu, Snowflake, Zap, Terminal, Database, Activity, CheckSquare, Square, Pause, X, Battery, Droplet, SquareActivity, Archive, Settings, Edit2, RotateCcw, BookOpen, Heart, Target, Coffee, Star, Flame, Wind, ArrowUpDown } from 'lucide-react';
import { DICT, DEFAULT_TASKS, DEFAULT_LOG, ICON_MAP, DAEMON_COLORS, DAEMONS_INIT, SHAPES } from './config/constants';
import { useSystemConfig } from './hooks/useSystemConfig';
import { useDaemons } from './hooks/useDaemons';
import { useCoreMemory } from './hooks/useCoreMemory';
import { SafeModeScreen } from './components/screens/SafeModeScreen';
import { ManualModal } from './components/modals/ManualModal';
import { ArchiveModal } from './components/modals/ArchiveModal';
import { BufferModal } from './components/modals/BufferModal';
import { SettingsModal } from './components/modals/SettingsModal';

export default function App() {
  const { colorMode, setColorMode, terminology, setTerminology, uiShape, setUiShape, colorStyle, setColorStyle, accent1, setAccent1, accent2, setAccent2, glowLevel, setGlowLevel } = useSystemConfig();
  const { daemons, interactDaemon, updateDaemonConfig } = useDaemons();
  const { tasks, setTasks, renderLog, setRenderLog, systemState, setSystemState, activeColliderTask, setActiveColliderTask, moveTask, restoreFromArchive, startCompilation, exitCompilation, finishCompilation, toggleSubtask, deleteSubtask, updateProgress } = useCoreMemory();

  const isDark = colorMode === 'dark';
  const textMainHex = isDark ? '#d4d4d8' : '#27272a';
  const textMutedHex = isDark ? '#71717a' : '#52525b';

  // Разрешение геометрии (теперь без тотального свечения)
  const shapePrimary = SHAPES[uiShape]?.primary || SHAPES.diag.primary;
  const shapeSecondary = SHAPES[uiShape]?.secondary || SHAPES.diag.secondary;

  const hexToRgb = (hex) => {
    let r = 0, g = 0, b = 0;
    if (hex && hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16); g = parseInt(hex[2] + hex[2], 16); b = parseInt(hex[3] + hex[3], 16);
    } else if (hex && hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16); g = parseInt(hex.substring(3, 5), 16); b = parseInt(hex.substring(5, 7), 16);
    }
    return `${r}, ${g}, ${b}`;
  };

  // Жесткая инъекция стилей
  const cssVariables = `
    :root {
      --os-accent-1: ${accent1};
      --os-accent-2: ${accent2};
      --os-accent-bg: ${colorStyle === 'gradient' ? `linear-gradient(135deg, ${accent1}, ${accent2})` : accent1};
      --os-accent-text: var(--bg-base);
      --bg-base: ${isDark ? '#0c0c0e' : '#e4e4e7'};
      --bg-header: ${isDark ? '#141417' : '#d4d4d8'};
      --bg-panel: ${isDark ? '#18181b' : '#f4f4f5'};
      --border-color: ${isDark ? 'rgba(63, 63, 70, 0.4)' : 'rgba(161, 161, 170, 0.5)'};
      --border-strong: ${isDark ? '#27272a' : '#a1a1aa'};
      --text-main: ${textMainHex};
      --text-muted: ${textMutedHex};
      --bg-button: ${isDark ? '#18181b' : '#d4d4d8'};
      --bg-button-active: ${isDark ? '#27272a' : '#a1a1aa'};
      
      --os-glow-level: ${glowLevel};
      --os-accent-rgb: ${hexToRgb(accent1)};
      
      color-scheme: ${isDark ? 'dark' : 'light'};
    }
    body {
      background-color: var(--bg-base);
      color: var(--text-main);
    }
    
    /* Точечное свечение только для акцентных элементов */
    .glow-accent { 
      box-shadow: 0 0 calc(var(--os-glow-level) * 0.4px) rgba(var(--os-accent-rgb), calc(var(--os-glow-level) / 100)); 
    }
    
    /* Логика обводок (Flat vs Gradient) */
    .is-flat .border-accent {
        border-color: var(--os-accent-1) !important;
    }
    .is-gradient .border-accent {
        border-color: transparent !important;
        position: relative;
    }
    .is-gradient .border-accent::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        padding: 1.5px; /* Толщина градиентной рамки */
        background: var(--os-accent-bg);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
        z-index: 1;
    }
    
    input[type="range"] { accent-color: var(--os-accent-1); }
    input[type="color"] { -webkit-appearance: none; border: none; padding: 0; background: transparent; }
    input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
    input[type="color"]::-webkit-color-swatch { border: 1px solid var(--border-strong); border-radius: 4px; }
    
    /* Новые анимации для фона и линий фокуса */
    @keyframes ambient-breathe {
      0%, 100% { opacity: 0.2; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.1); }
    }
    
    /* Синхронизированный выброс энергии: Ядро */
    @keyframes core-beat {
      0%, 100% { opacity: 0.3; filter: drop-shadow(0 0 2px var(--os-accent-1)); transform: scale(0.95); }
      15% { opacity: 1; filter: drop-shadow(0 0 25px var(--os-accent-1)); transform: scale(1.15); }
      40% { opacity: 0.5; filter: drop-shadow(0 0 8px var(--os-accent-1)); transform: scale(1); }
    }

    /* Выстрел влево */
    @keyframes beam-left {
      0%, 10% { transform: translateX(100%); opacity: 0; }
      15% { opacity: 1; }
      55%, 100% { transform: translateX(-100%); opacity: 0; }
    }

    /* Выстрел вправо */
    @keyframes beam-right {
      0%, 10% { transform: translateX(-100%); opacity: 0; }
      15% { opacity: 1; }
      55%, 100% { transform: translateX(100%); opacity: 0; }
    }

    .bg-ambient {
      background: radial-gradient(circle at 50% 50%, rgba(var(--os-accent-rgb), 0.15), transparent 70%);
      animation: ambient-breathe 8s ease-in-out infinite;
    }
    
    .energy-core {
      animation: core-beat 3s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
    }

    .energy-beam-left {
      background: linear-gradient(270deg, var(--os-accent-1) 0%, rgba(var(--os-accent-rgb), 0.5) 20%, transparent 100%);
      animation: beam-left 3s cubic-bezier(0.2, 0, 0.2, 1) infinite;
    }

    .energy-beam-right {
      background: linear-gradient(90deg, var(--os-accent-1) 0%, rgba(var(--os-accent-rgb), 0.5) 20%, transparent 100%);
      animation: beam-right 3s cubic-bezier(0.2, 0, 0.2, 1) infinite;
    }

    @keyframes subtask-fade {
      0%, 100% { opacity: 1; filter: blur(0px); }
      50% { opacity: 0.5; filter: blur(0.5px); }
    }
    .is-fading {
      animation: subtask-fade 4.5s ease-in-out infinite;
      cursor: grab;
      display: inline-block;
      will-change: opacity, filter;
    }
    .is-fading:active {
      cursor: grabbing;
      opacity: 0.8 !important; /* При захвате фиксируем яркость */
      filter: blur(0px) !important;
    }
  `;

  const StyleInjection = () => <style>{cssVariables}</style>;
  const t = (key) => DICT[terminology][key];

  // --- UI СТЕЙТЫ МОДАЛОК ---
  const [isBufferOpen, setIsBufferOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isBufferReversed, setIsBufferReversed] = useState(true);
  
  const [newTaskInput, setNewTaskInput] = useState('');
  const [devNullInput, setDevNullInput] = useState('');
  const [isDevNullFading, setIsDevNullFading] = useState(false);

  const handleDevNull = (e) => {
    if (e.key === 'Enter' && devNullInput.trim() && !isDevNullFading) {
      setIsDevNullFading(true);
      setTimeout(() => {
        setDevNullInput('');
        setIsDevNullFading(false);
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }, 1200);
    }
  };
  
  const [newSubtaskInput, setNewSubtaskInput] = useState('');
  // Стейты для редактирования саброутин в рендере
  const [isSubtasksEditMode, setIsSubtasksEditMode] = useState(false);
  const [editingSubtaskId, setEditingSubtaskId] = useState(null);
  const [editSubtaskValue, setEditSubtaskValue] = useState('');
  const [draggedSubtaskId, setDraggedSubtaskId] = useState(null);
  const [editingNodeId, setEditingNodeId] = useState(null);
  const [editInputValue, setEditInputValue] = useState('');

  // Перехват системной кнопки "Назад"
  useEffect(() => {
    const handlePopState = () => {
      setIsBufferOpen(false); setIsLogOpen(false); setIsSettingsOpen(false); setIsManualOpen(false);
    };
    if (isBufferOpen || isLogOpen || isSettingsOpen || isManualOpen) {
      window.history.pushState({ modal: true }, '');
    }
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isBufferOpen, isLogOpen, isSettingsOpen, isManualOpen]);

  const closeModals = () => { window.history.back(); };

  // --- ЛОГИКА ЗАДАЧ ---

  const createNewTask = (e) => {
    if (e.key === 'Enter' && newTaskInput.trim()) {
      const newTask = {
        id: `n-${Math.floor(Math.random() * 9000) + 1000}`,
        title: newTaskInput.trim(),
        state: 'BUFFER',
        weight: Math.floor(Math.random() * 40) + 10,
        progress: 0,
        subtasks: []
      };
      setTasks(prev => [...prev, newTask]);
      setNewTaskInput('');
    }
  };

  const startEditNode = (task) => {
    setEditingNodeId(task.id);
    setEditInputValue(task.title);
  };

  const saveEditNode = () => {
    if (editInputValue.trim()) {
      setTasks(prev => prev.map(t => t.id === editingNodeId ? { ...t, title: editInputValue.trim() } : t));
    }
    setEditingNodeId(null);
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') saveEditNode();
    if (e.key === 'Escape') setEditingNodeId(null);
  };

  // --- ЛОГИКА РЕНДЕРА (ФОКУСА) ---
  const createSubtask = (e) => {
    if (e.key === 'Enter' && newSubtaskInput.trim()) {
      setActiveColliderTask(prev => ({
        ...prev,
        subtasks: [...(prev.subtasks || []), { id: `s-${Date.now()}`, text: newSubtaskInput.trim(), done: false }]
      }));
      setNewSubtaskInput('');
    }
  };

  // --- ЛОГИКА РЕДАКТИРОВАНИЯ И СОРТИРОВКИ ПОДЗАДАЧ ---
  const startEditSubtask = (subtask) => {
    if (!isSubtasksEditMode) return;
    setEditingSubtaskId(subtask.id);
    setEditSubtaskValue(subtask.text);
  };

  const saveEditSubtask = () => {
    if (editSubtaskValue.trim()) {
      setActiveColliderTask(prev => ({
        ...prev,
        subtasks: prev.subtasks.map(s => s.id === editingSubtaskId ? { ...s, text: editSubtaskValue.trim() } : s)
      }));
    }
    setEditingSubtaskId(null);
  };

  const handleSubtaskEditKeyDown = (e) => {
    if (e.key === 'Enter') saveEditSubtask();
    if (e.key === 'Escape') setEditingSubtaskId(null);
  };

  const handleDragStart = (e, id) => {
    setDraggedSubtaskId(id);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { if (e.target) e.target.style.opacity = '0.5'; }, 0);
  };

  const handleDragEnd = (e) => {
    if (e.target) e.target.style.opacity = '1';
    setDraggedSubtaskId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (!draggedSubtaskId || draggedSubtaskId === targetId) return;

    setActiveColliderTask(prev => {
      const subtasks = [...(prev.subtasks || [])];
      const draggedIdx = subtasks.findIndex(s => s.id === draggedSubtaskId);
      const targetIdx = subtasks.findIndex(s => s.id === targetId);
      
      if (draggedIdx === -1 || targetIdx === -1) return prev;

      const [draggedItem] = subtasks.splice(draggedIdx, 1);
      subtasks.splice(targetIdx, 0, draggedItem);
      
      return { ...prev, subtasks };
    });
  };

  const activeTasks = tasks.filter(t => t.state === 'ACTIVE_RAM');
  const cryoTasks = tasks.filter(t => t.state === 'CRYO');
  const bufferTasks = tasks.filter(t => t.state === 'BUFFER');

// --- ЭКРАН ГИБЕРНАЦИИ ---
if (systemState === 'SAFE_MODE') {
  return (
    <SafeModeScreen 
      setSystemState={setSystemState}
      t={t}
      textMainHex={textMainHex}
      shapePrimary={shapePrimary}
      colorStyle={colorStyle}
    >
      <StyleInjection />
    </SafeModeScreen>
  );
}

  // --- ЭКРАН ФОКУСА (РЕНДЕР) ---
  if (systemState === 'COMPILING') {
    return (
      <div className={`min-h-[100dvh] bg-[var(--bg-base)] flex flex-col items-center justify-center font-mono p-4 md:p-8 transition-colors duration-300 relative overflow-hidden ${colorStyle === 'gradient' ? 'is-gradient' : 'is-flat'}`}>
        <div className="absolute inset-0 bg-ambient pointer-events-none"></div>
        <StyleInjection />
        
        <div className="flex items-center justify-center w-full max-w-3xl mb-8 gap-4 md:gap-8 relative z-10">
          {/* Левый отвод энергии */}
          <div className="h-[2px] flex-1 relative overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(var(--os-accent-rgb), 0.15)' }}>
            <div className="absolute inset-0 w-full h-full energy-beam-left"></div>
          </div>
          
          {/* Центральное ядро пульса */}
          <Activity className="w-10 h-10 md:w-12 md:h-12 energy-core shrink-0" style={{ color: 'var(--os-accent-1)' }} />
          
          {/* Правый отвод энергии */}
          <div className="h-[2px] flex-1 relative overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(var(--os-accent-rgb), 0.15)' }}>
            <div className="absolute inset-0 w-full h-full energy-beam-right"></div>
          </div>
        </div>
        
        <div className={`bg-[var(--bg-panel)] border border-[var(--border-strong)] p-6 w-full max-w-2xl relative z-10 ${shapePrimary}`}>
          <div className="text-[10px] md:text-xs tracking-widest mb-3 uppercase flex justify-between" style={{ color: textMutedHex }}>
            <span>[ {activeColliderTask?.id} ] {t('compile')}</span>
            <span style={{ color: 'var(--os-accent-1)' }}>{activeColliderTask?.progress}%</span>
          </div>
          <div className="text-lg md:text-2xl tracking-wide mb-6" style={{ color: textMainHex }}>{activeColliderTask?.title}</div>
          
          <div className="w-full h-1 mb-4 relative bg-[var(--bg-button)] rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full transition-all duration-300 glow-accent" style={{ background: 'var(--os-accent-bg)', width: `${activeColliderTask?.progress}%` }} />
          </div>
          
          <div className="flex gap-2 mb-8 text-[10px] md:text-xs">
            <button onClick={() => updateProgress(-10)} className={`px-3 py-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] ${shapeSecondary}`} style={{ color: textMainHex }}>-10%</button>
            <button onClick={() => updateProgress(10)} className={`px-3 py-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] ${shapeSecondary}`} style={{ color: textMainHex }}>+10%</button>
            <button onClick={() => updateProgress(100 - activeColliderTask.progress)} className={`px-3 py-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] ml-auto ${shapeSecondary}`} style={{ color: textMainHex }}>MAX</button>
          </div>

          <div className="mb-8 border-l-2 border-[var(--border-strong)] pl-4 flex flex-col gap-3 relative">
          {activeColliderTask?.subtasks?.length > 0 && (
              <button 
                onClick={() => setIsSubtasksEditMode(!isSubtasksEditMode)} 
                /* Зафиксировали ширину и высоту (w-6 h-6), запретили сжатие/растяжение (shrink-0) */
                className={`absolute -left-[30px] top-[-2px] w-6 h-6 flex items-center justify-center shrink-0 bg-[var(--bg-base)] border transition-all z-10 ${isSubtasksEditMode ? 'border-accent' : 'border-[var(--border-strong)]'}`}
                style={{ color: isSubtasksEditMode ? 'var(--os-accent-1)' : textMutedHex, borderRadius: '4px' }}
                title="Режим пересборки узлов"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            )}

            {activeColliderTask?.subtasks?.map(sub => (
              <div 
                key={sub.id} 
                draggable={isSubtasksEditMode}
                onDragStart={(e) => handleDragStart(e, sub.id)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, sub.id)}
                /* Добавлен items-center и p-2 для режима редактирования, чтобы элементы стояли ровно */
                className={`flex items-start gap-3 text-left transition-transform ${isSubtasksEditMode ? 'p-2 bg-[var(--bg-panel)] border border-[var(--border-strong)] border-dashed cursor-grab active:cursor-grabbing items-center' : ''}`}
                style={{ borderTopColor: draggedSubtaskId && draggedSubtaskId !== sub.id ? 'var(--border-strong)' : '' }}
              >
                {/* Контроллер перетаскивания */}
                {isSubtasksEditMode && (
                  <div className="shrink-0 flex items-center justify-center" style={{ color: textMutedHex }}>
                    <ArrowUpDown className="w-4 h-4 opacity-70" />
                  </div>
                )}

                {/* Статичный чекбокс */}
                <div className="mt-0.5 cursor-pointer shrink-0" onClick={() => !isSubtasksEditMode && toggleSubtask(sub.id)}>
                  {sub.done ? <CheckSquare className="w-4 h-4" style={{ color: 'var(--os-accent-1)' }} /> : <Square className="w-4 h-4" style={{ color: textMutedHex }} />}
                </div>

                {/* Текст саброутины. Класс покачивания перенесен во внутренний div */}
                <div className={`flex-1 cursor-text w-full min-w-0`} onClick={() => startEditSubtask(sub)}>
                  {editingSubtaskId === sub.id ? (
                    <input 
                      autoFocus
                      value={editSubtaskValue}
                      onChange={(e) => setEditSubtaskValue(e.target.value)}
                      onKeyDown={handleSubtaskEditKeyDown}
                      onBlur={saveEditSubtask}
                      className="bg-transparent border-b border-[var(--border-strong)] outline-none text-sm w-full font-mono"
                      style={{ color: textMainHex }}
                    />
                  ) : (
                    <div className={`${isSubtasksEditMode ? 'is-fading' : ''}`}>
                      <div className="text-sm break-words" style={{ color: sub.done && !isSubtasksEditMode ? textMutedHex : textMainHex, textDecoration: sub.done && !isSubtasksEditMode ? 'line-through' : 'none' }}>
                        {sub.text}
                      </div>
                    </div>
                  )}
                </div>

                {/* НОВАЯ КНОПКА: Удалить подзадачу (вынесена вправо с помощью ml-auto) */}
                {isSubtasksEditMode && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteSubtask(sub.id); }}
                    className="shrink-0 p-1.5 ml-auto text-red-500/60 hover:text-red-500 hover:bg-red-500/10 rounded transition-all"
                    title="Удалить подзадачу"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            
            <div className="flex items-center gap-2 mt-2">
              <span style={{ color: textMutedHex }}>&gt;</span>
              <input 
                type="text" 
                value={newSubtaskInput}
                onChange={(e) => setNewSubtaskInput(e.target.value)}
                onKeyDown={createSubtask}
                placeholder="..."
                className="bg-transparent border-none outline-none text-sm w-full font-mono placeholder-[var(--text-muted)]"
                style={{ color: textMainHex }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-10 pt-6 border-t border-[var(--border-strong)]">
            <div className="flex gap-2">
              <button onClick={() => exitCompilation('ACTIVE_RAM')} className={`flex-1 text-[10px] md:text-xs uppercase bg-[var(--bg-button)] border border-[var(--border-strong)] px-3 py-3 active:bg-[var(--bg-button-active)] flex items-center justify-center gap-2 ${shapePrimary}`} style={{ color: textMainHex }}>
                <RotateCcw className="w-3 h-3" /> {terminology === 'system' ? 'BACK' : 'НАЗАД'}
              </button>
              <button onClick={() => exitCompilation('CRYO')} className={`flex-1 text-[10px] md:text-xs uppercase bg-[var(--bg-panel)] border border-[var(--border-strong)] px-3 py-3 active:bg-[var(--bg-button-active)] flex items-center justify-center gap-2 ${shapePrimary}`} style={{ color: 'var(--os-accent-1)' }}>
                <Snowflake className="w-3 h-3" /> {t('cryo')}
              </button>
            </div>
            <button onClick={finishCompilation} className={`text-xs uppercase font-bold tracking-widest px-6 py-3 flex items-center justify-center gap-2 active:opacity-80 transition-opacity glow-accent ${shapeSecondary}`} style={{ background: 'var(--os-accent-bg)', color: 'var(--os-accent-text)' }}>
              <Zap className="w-4 h-4" /> FINISH
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- ГЛАВНЫЙ ЭКРАН ---
  return (
    <div className={`h-[100dvh] bg-[var(--bg-base)] text-[var(--text-main)] font-mono flex flex-col overflow-hidden transition-colors duration-300 ${colorStyle === 'gradient' ? 'is-gradient' : 'is-flat'}`}>
      <StyleInjection />
      <header className="flex-shrink-0 bg-[var(--bg-header)] border-b border-[var(--border-color)] p-4 pb-3 z-10 relative mt-safe transition-colors duration-300">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <Terminal className="w-4 h-4 md:w-5 md:h-5" style={{ color: textMutedHex }} />
            <div className="text-xs md:text-sm tracking-widest font-bold uppercase" style={{ color: textMainHex }}>ColdCache<span style={{ color: 'var(--os-accent-1)' }}>.OS</span></div>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={() => setIsManualOpen(true)} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] ${shapeSecondary}`} style={{ color: textMutedHex }}>
              <BookOpen className="w-3 h-3" />
            </button>
            <button onClick={() => setIsLogOpen(true)} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] relative ${shapeSecondary}`} style={{ color: textMutedHex }}>
              <Archive className="w-3 h-3" />
              {renderLog.length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full glow-accent" style={{ background: 'var(--os-accent-bg)' }}></span>}
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] ${shapeSecondary}`} style={{ color: textMutedHex }}>
              <Settings className="w-3 h-3" />
            </button>
            <button onClick={() => setSystemState('SAFE_MODE')} className={`p-2 border border-red-900/30 text-red-500 active:bg-red-900/20 bg-red-900/10 ${shapeSecondary}`}>
              <ShieldAlert className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {Object.entries(daemons).map(([key, data]) => {
            const Icon = ICON_MAP[data.iconName] || ICON_MAP['SquareActivity'];
            const color = DAEMON_COLORS[key];
            const isDone = data.current >= data.max;
            
            return (
              <button key={key} onClick={() => interactDaemon(key)} className={`bg-[var(--bg-panel)] border border-[var(--border-color)] p-2 md:p-3 relative overflow-hidden text-left active:opacity-70 transition-all ${shapePrimary}`}>
                <div className="absolute bottom-0 left-0 h-full transition-all duration-300 opacity-20" style={{ backgroundColor: color, width: `${Math.min(100, (data.current / data.max) * 100)}%` }} />
                <div className="relative z-10 flex flex-col gap-1 md:flex-row md:justify-between md:items-center">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <Icon className="w-3 h-3 md:w-4 md:h-4" style={{ color: isDone ? color : textMutedHex }} />
                    <span className="text-[8px] md:text-[9px] uppercase tracking-widest truncate" style={{ color: isDone ? color : textMutedHex }}>{data.label}</span>
                  </div>
                  <span className="text-[10px]" style={{ color: isDone ? color : textMainHex, fontWeight: isDone ? 'bold' : 'normal' }}>
                    {data.current}/{data.max}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-6 overflow-y-auto relative">
        
        <button onClick={() => setIsBufferOpen(true)} className={`w-full py-4 flex items-center justify-center gap-3 bg-[var(--bg-panel)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] uppercase tracking-widest text-xs font-bold transition-all ${shapePrimary}`} style={{ color: textMainHex }}>
          <Database className="w-4 h-4" style={{ color: 'var(--os-accent-1)' }} />
          {t('buffer')}
          {bufferTasks.length > 0 && <span className="px-2 py-0.5 rounded-sm bg-[var(--bg-button)] text-[10px] ml-2">{bufferTasks.length}</span>}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-safe">
          <section className="lg:col-span-8 flex flex-col gap-4">
            
            <div className="flex items-center gap-2 border-b border-[var(--border-strong)] pb-2">
              <Cpu className="w-4 h-4" style={{ color: textMainHex }} />
              <h2 className="uppercase tracking-widest text-xs font-semibold m-0" style={{ color: textMainHex }}>{t('ram')}</h2>
              <span className="ml-auto text-[10px]" style={{ color: textMutedHex }}>СЛОТЫ: {activeTasks.length}/2</span>
            </div>
            
            <div className="grid gap-4">
              {activeTasks.map(task => (
                <div key={task.id} className={`bg-[var(--bg-panel)] border border-[var(--border-strong)] p-4 md:p-5 relative flex flex-col gap-4 transition-all glow-accent ${shapePrimary}`}>
                  <div className="absolute top-0 left-0 h-0.5 transition-all glow-accent" style={{ background: 'var(--os-accent-bg)', width: `${task.progress}%` }} />
                  
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="text-[10px] tracking-widest mb-1.5" style={{ color: textMutedHex }}>{task.id}</div>
                      {editingNodeId === task.id ? (
                        <input 
                          autoFocus
                          value={editInputValue}
                          onChange={(e) => setEditInputValue(e.target.value)}
                          onKeyDown={handleEditKeyDown}
                          onBlur={saveEditNode}
                          className="bg-transparent border-b border-[var(--border-strong)] outline-none text-sm md:text-base w-full font-mono"
                          style={{ color: textMainHex }}
                        />
                      ) : (
                        <div className="text-sm md:text-base font-semibold break-words pr-2" style={{ color: textMainHex }}>{task.title}</div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className={`text-[10px] px-2 py-1 bg-[var(--bg-button)] border border-[var(--border-strong)] ${shapeSecondary}`} style={{ color: 'var(--os-accent-1)' }}>{task.progress}%</div>
                      {editingNodeId !== task.id && (
                        <button onClick={() => startEditNode(task)} className="p-1 active:opacity-70" style={{ color: textMutedHex }}><Edit2 className="w-3 h-3"/></button>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2 border-t border-[var(--border-color)] pt-4">
                    <button onClick={() => moveTask(task.id, 'CRYO')} className={`text-[10px] uppercase px-3 py-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] flex items-center gap-1.5 transition-all ${shapeSecondary}`} style={{ color: textMainHex }}>
                      <Snowflake className="w-3 h-3" /> {t('cryo')}
                    </button>
                    <button onClick={() => startCompilation(task)} className={`text-[10px] md:text-xs uppercase px-6 py-2.5 font-bold tracking-widest flex items-center gap-2 active:opacity-80 transition-all ${shapeSecondary}`} style={{ background: 'var(--os-accent-bg)', color: 'var(--os-accent-text)' }}>
                      <Zap className="w-3 h-3" /> {t('render')}
                    </button>
                  </div>
                </div>
              ))}
              {activeTasks.length === 0 && (
                <div className={`h-24 border border-[var(--border-color)] border-dashed flex items-center justify-center text-[10px] uppercase tracking-widest ${shapePrimary}`} style={{ color: textMutedHex }}>{t('emptyMem')}</div>
              )}
            </div>
          </section>

          <section className="lg:col-span-4 flex flex-col gap-4">
            
            <div className="flex items-center gap-2 border-b border-[var(--border-strong)] pb-2">
              <Snowflake className="w-4 h-4" style={{ color: textMutedHex }} />
              <h2 className="uppercase tracking-widest text-xs font-semibold m-0" style={{ color: textMutedHex }}>{t('cryo')}</h2>
            </div>
            
            <div className="flex flex-col gap-2">
              {cryoTasks.map(task => (
                <div key={task.id} className={`bg-[var(--bg-panel)] border border-[var(--border-color)] p-3 opacity-70 active:opacity-100 transition-all ${shapePrimary}`}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] tracking-widest" style={{ color: textMutedHex }}>{task.id}</span>
                    <button onClick={() => startEditNode(task)} className="p-1" style={{ color: textMutedHex }}><Edit2 className="w-3 h-3"/></button>
                  </div>
                  {editingNodeId === task.id ? (
                     <input 
                       autoFocus value={editInputValue} onChange={(e) => setEditInputValue(e.target.value)} onKeyDown={handleEditKeyDown} onBlur={saveEditNode}
                       className="bg-transparent border-b border-[var(--border-strong)] outline-none text-xs w-full font-mono mb-3"
                       style={{ color: textMainHex }}
                     />
                  ) : (
                    <div className="text-xs md:text-sm mb-3 opacity-80" style={{ color: textMainHex }}>{task.title}</div>
                  )}
                  
                  <div className="flex justify-between border-t border-[var(--border-color)] pt-2 items-center">
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
        </div>

        {/* Пространственный буфер, чтобы Dev/null не перекрывал Крио-задачи */}
        <div className="h-28 shrink-0 pointer-events-none"></div>

        {/* --- DEV/NULL КОНСОЛЬ (СБРОС МУСОРА) --- */}
        <style>{`
          @keyframes dissolve {
            0% { filter: blur(0); opacity: 1; transform: translateY(0) scale(1); }
            100% { filter: blur(6px); opacity: 0; transform: translateY(-10px) scale(0.95); }
          }
          .dev-null-fade {
            animation: dissolve 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
        `}</style>
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
      </main>

     {/* --- МОДАЛКА БУФЕРА --- */}
     {isBufferOpen && (
        <BufferModal
          closeModals={closeModals}
          t={t}
          textMainHex={textMainHex}
          textMutedHex={textMutedHex}
          shapePrimary={shapePrimary}
          shapeSecondary={shapeSecondary}
          bufferTasks={bufferTasks}
          newTaskInput={newTaskInput}
          setNewTaskInput={setNewTaskInput}
          createNewTask={createNewTask}
          isBufferReversed={isBufferReversed}
          setIsBufferReversed={setIsBufferReversed}
          startEditNode={startEditNode}
          editingNodeId={editingNodeId}
          editInputValue={editInputValue}
          setEditInputValue={setEditInputValue}
          handleEditKeyDown={handleEditKeyDown}
          saveEditNode={saveEditNode}
          moveTask={moveTask}
        />
      )}

{/* --- МОДАЛКА АРХИВА --- */}
{isLogOpen && (
        <ArchiveModal
          closeModals={closeModals}
          t={t}
          textMainHex={textMainHex}
          textMutedHex={textMutedHex}
          shapePrimary={shapePrimary}
          shapeSecondary={shapeSecondary}
          renderLog={renderLog}
          restoreFromArchive={restoreFromArchive}
        />
      )}

      {/* --- МОДАЛКА НАСТРОЕК --- */}
      {isSettingsOpen && (
        <SettingsModal
          closeModals={closeModals}
          t={t}
          textMainHex={textMainHex}
          textMutedHex={textMutedHex}
          shapePrimary={shapePrimary}
          shapeSecondary={shapeSecondary}
          colorStyle={colorStyle}
          setColorStyle={setColorStyle}
          accent1={accent1}
          setAccent1={setAccent1}
          accent2={accent2}
          setAccent2={setAccent2}
          uiShape={uiShape}
          setUiShape={setUiShape}
          glowLevel={glowLevel}
          setGlowLevel={setGlowLevel}
          colorMode={colorMode}
          setColorMode={setColorMode}
          terminology={terminology}
          setTerminology={setTerminology}
          daemons={daemons}
          updateDaemonConfig={updateDaemonConfig}
        />
      )}

{/* --- МОДАЛКА МАНУАЛА --- */}
{isManualOpen && (
        <ManualModal 
          closeModals={closeModals} 
          t={t} 
          textMainHex={textMainHex} 
          textMutedHex={textMutedHex} 
          shapePrimary={shapePrimary} 
          shapeSecondary={shapeSecondary} 
        />
      )}

    </div>
  );
}