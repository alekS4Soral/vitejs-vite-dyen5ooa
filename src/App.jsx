import React, { useState, useEffect } from 'react';
import { Power, ShieldAlert, Cpu, Snowflake, Zap, Terminal, Database, Activity, CheckSquare, Square, Pause, X, Battery, Droplet, SquareActivity, Archive, Settings, Edit2, RotateCcw, BookOpen, Heart, Target, Coffee, Star, Flame, Wind } from 'lucide-react';

// --- СЛОВАРИ ТЕРМИНОВ ---
const DICT = {
  system: {
    ram: 'Active RAM',
    cryo: 'Cryo-Storage',
    buffer: 'Latent Space',
    archive: 'Кристаллизация',
    safeMode: 'Система в гибернации',
    render: 'Рендер',
    compile: 'ИЗОЛЯЦИЯ',
    drop: 'Drop',
    inject: 'inject_node',
    manual: 'ReadMe',
    settings: 'Системные параметры',
    emptyMem: 'Память свободна',
    emptyCryo: 'Отсек пуст'
  },
  human: {
    ram: 'В фокусе',
    cryo: 'Отложено',
    buffer: 'Входящие задачи',
    archive: 'Выполненные',
    safeMode: 'Режим отдыха',
    render: 'Начать',
    compile: 'В ПРОЦЕССЕ',
    drop: 'Удалить',
    inject: 'Добавить задачу',
    manual: 'Как использовать',
    settings: 'Настройки',
    emptyMem: 'Нет текущих задач',
    emptyCryo: 'Список пуст'
  }
};

const DEFAULT_TASKS = [];
const DEFAULT_LOG = [];

// Карта доступных иконок для кастомизации
const ICON_MAP = {
  SquareActivity, Droplet, Battery, Activity, Cpu, Snowflake, Zap, Terminal, Database, Archive, Heart, Target, Coffee, Star, Flame
};

const DAEMON_COLORS = { d1: '#a3e635', d2: '#22d3ee', d3: '#f97316' };

const DAEMONS_INIT = {
  d1: { label: 'KINEMATICS', current: 0, max: 10000, step: 1000, iconName: 'SquareActivity' },
  d2: { label: 'COOLANT', current: 0, max: 2000, step: 250, iconName: 'Droplet' },
  d3: { label: 'HARDWARE', current: 0, max: 1, step: 1, iconName: 'Battery' }
};

const THEMES = {
  cyan: { name: 'Cyan Core', accent: '#06b6d4', accentDim: 'rgba(6, 182, 212, 0.15)', text: '#000000' },
  green: { name: 'Matrix Green', accent: '#22c55e', accentDim: 'rgba(34, 197, 94, 0.15)', text: '#000000' },
  purple: { name: 'Deep Purple', accent: '#a855f7', accentDim: 'rgba(168, 85, 247, 0.15)', text: '#ffffff' },
  amber: { name: 'Amber Glow', accent: '#f59e0b', accentDim: 'rgba(245, 158, 11, 0.15)', text: '#000000' },
};

const diagRadius = "rounded-tl-2xl rounded-br-2xl rounded-tr-sm rounded-bl-sm";
const diagRadiusReverse = "rounded-tr-2xl rounded-bl-2xl rounded-tl-sm rounded-br-sm";

export default function App() {
  // --- МОДУЛИ ПАМЯТИ ---
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('cc_tasks')) || DEFAULT_TASKS);
  const [renderLog, setRenderLog] = useState(() => JSON.parse(localStorage.getItem('cc_log')) || DEFAULT_LOG);
  
  const [systemState, setSystemState] = useState(() => localStorage.getItem('cc_state') || 'NORMAL'); 
  const [activeColliderTask, setActiveColliderTask] = useState(() => JSON.parse(localStorage.getItem('cc_active_task')) || null);

  const [daemons, setDaemons] = useState(() => {
    const saved = localStorage.getItem('cc_daemons');
    const lastDate = localStorage.getItem('cc_date');
    const today = new Date().toDateString();
    
    if (lastDate !== today) {
      localStorage.setItem('cc_date', today);
      return DAEMONS_INIT; 
    }

    if (saved) {
      const parsed = JSON.parse(saved);
      const restored = { ...DAEMONS_INIT };
      Object.keys(parsed).forEach(key => {
        if (restored[key]) {
          restored[key] = {
            ...restored[key],
            current: parsed[key].current || 0,
            label: parsed[key].label || DAEMONS_INIT[key].label,
            max: parsed[key].max || DAEMONS_INIT[key].max,
            step: parsed[key].step || DAEMONS_INIT[key].step,
            iconName: parsed[key].iconName || DAEMONS_INIT[key].iconName
          };
        }
      });
      return restored;
    }
    return DAEMONS_INIT;
  });

  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('cc_theme') || 'cyan');
  const [colorMode, setColorMode] = useState(() => localStorage.getItem('cc_mode') || 'dark');
  const [terminology, setTerminology] = useState(() => localStorage.getItem('cc_term') || 'system');

  // Синхронизация с чипом
  useEffect(() => { localStorage.setItem('cc_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('cc_log', JSON.stringify(renderLog)); }, [renderLog]);
  useEffect(() => { localStorage.setItem('cc_state', systemState); }, [systemState]);
  useEffect(() => { localStorage.setItem('cc_active_task', JSON.stringify(activeColliderTask)); }, [activeColliderTask]);
  useEffect(() => { localStorage.setItem('cc_daemons', JSON.stringify(daemons)); }, [daemons]);
  useEffect(() => { localStorage.setItem('cc_theme', currentTheme); }, [currentTheme]);
  useEffect(() => { localStorage.setItem('cc_mode', colorMode); }, [colorMode]);
  useEffect(() => { localStorage.setItem('cc_term', terminology); }, [terminology]);

  const isDark = colorMode === 'dark';
  const textMainHex = isDark ? '#d4d4d8' : '#27272a';
  const textMutedHex = isDark ? '#71717a' : '#52525b';

  // Жесткая инъекция стилей для обхода мобильных браузеров
  const cssVariables = `
    :root {
      --os-accent: ${THEMES[currentTheme].accent};
      --os-accent-dim: ${THEMES[currentTheme].accentDim};
      --os-accent-text: ${THEMES[currentTheme].text};
      --bg-base: ${isDark ? '#0c0c0e' : '#e4e4e7'};
      --bg-header: ${isDark ? '#141417' : '#d4d4d8'};
      --bg-panel: ${isDark ? '#18181b' : '#f4f4f5'};
      --border-color: ${isDark ? 'rgba(63, 63, 70, 0.4)' : 'rgba(161, 161, 170, 0.5)'};
      --border-strong: ${isDark ? '#27272a' : '#a1a1aa'};
      --text-main: ${textMainHex};
      --text-muted: ${textMutedHex};
      --bg-button: ${isDark ? '#18181b' : '#d4d4d8'};
      --bg-button-active: ${isDark ? '#27272a' : '#a1a1aa'};
      color-scheme: ${isDark ? 'dark' : 'light'};
    }
    body {
      background-color: var(--bg-base);
      color: var(--text-main);
    }
    @keyframes dissolve {
      0% { filter: blur(0); opacity: 1; transform: translateY(0) scale(1); }
      100% { filter: blur(6px); opacity: 0; transform: translateY(-10px) scale(0.95); }
    }
    .dev-null-fade {
      animation: dissolve 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
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
    // Проверяем, что нажат Enter, есть текст и анимация еще не идет
    if (e.key === 'Enter' && devNullInput.trim() && !isDevNullFading) {
      setIsDevNullFading(true);
      
      // Сама анимация длится 1.2 сек
      setTimeout(() => {
        setDevNullInput('');
        setIsDevNullFading(false);
        
        // Только теперь принудительно прячем клавиатуру
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }, 1200);
    }
  };
  const [newSubtaskInput, setNewSubtaskInput] = useState('');
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
  const moveTask = (taskId, targetState) => {
    setTasks(prev => {
      const activeRamCount = prev.filter(t => t.state === 'ACTIVE_RAM').length;
      return prev.map(task => {
        if (task.id === taskId) {
          if (targetState === 'ACTIVE_RAM' && task.state !== 'ACTIVE_RAM' && activeRamCount >= 2) return task;
          return { ...task, state: targetState };
        }
        return task;
      });
    });
  };

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

  const restoreFromArchive = (taskId) => {
    const taskToRestore = renderLog.find(t => t.id === taskId);
    if (taskToRestore) {
      setRenderLog(prev => prev.filter(t => t.id !== taskId));
      setTasks(prev => [...prev, { ...taskToRestore, state: 'CRYO', progress: 0, subtasks: [] }]);
    }
  };

  // --- ЛОГИКА РЕНДЕРА (ФОКУСА) ---
  const startCompilation = (task) => {
    setActiveColliderTask(task);
    setSystemState('COMPILING');
  };

  const exitCompilation = (targetState) => {
    setTasks(prev => prev.map(t => t.id === activeColliderTask.id ? { ...activeColliderTask, state: targetState } : t));
    setActiveColliderTask(null);
    setSystemState('NORMAL');
  };

  const finishCompilation = () => {
    const completedTask = {
      ...activeColliderTask,
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      progress: 100
    };
    setRenderLog(prev => [completedTask, ...prev]);
    setTasks(prev => prev.filter(t => t.id !== activeColliderTask.id));
    setActiveColliderTask(null);
    setSystemState('NORMAL');
  };

  const createSubtask = (e) => {
    if (e.key === 'Enter' && newSubtaskInput.trim()) {
      setActiveColliderTask(prev => ({
        ...prev,
        subtasks: [...(prev.subtasks || []), { id: `s-${Date.now()}`, text: newSubtaskInput.trim(), done: false }]
      }));
      setNewSubtaskInput('');
    }
  };

  const toggleSubtask = (subId) => {
    setActiveColliderTask(prev => {
      const updatedSubtasks = prev.subtasks.map(s => s.id === subId ? { ...s, done: !s.done } : s);
      const doneCount = updatedSubtasks.filter(s => s.done).length;
      const newProgress = updatedSubtasks.length > 0 ? Math.round((doneCount / updatedSubtasks.length) * 100) : prev.progress;
      return { ...prev, subtasks: updatedSubtasks, progress: newProgress };
    });
  };

  const updateProgress = (amount) => {
    setActiveColliderTask(prev => ({ ...prev, progress: Math.min(100, Math.max(0, prev.progress + amount)) }));
  };

  // --- ЛОГИКА ДЕМОНОВ ---
  const interactDaemon = (key) => {
    setDaemons(prev => {
      const daemon = prev[key];
      if (daemon.current >= daemon.max) return { ...prev, [key]: { ...daemon, current: 0 } };
      return { ...prev, [key]: { ...daemon, current: Math.min(daemon.max, daemon.current + Number(daemon.step)) } };
    });
  };

  const updateDaemonConfig = (key, field, value) => {
    setDaemons(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  const totalRenderedData = renderLog.reduce((sum, task) => sum + task.weight, 0);
  const activeTasks = tasks.filter(t => t.state === 'ACTIVE_RAM');
  const cryoTasks = tasks.filter(t => t.state === 'CRYO');
  const bufferTasks = tasks.filter(t => t.state === 'BUFFER');

  // --- ЭКРАН ГИБЕРНАЦИИ ---
  if (systemState === 'SAFE_MODE') {
    return (
      <div className="min-h-[100dvh] bg-[var(--bg-base)] flex flex-col items-center justify-center font-mono text-[var(--text-muted)] p-4 transition-colors duration-300">
        <StyleInjection />
        <Power className="w-16 h-16 mb-8 opacity-50 animate-pulse" style={{ color: textMainHex }} />
        <div className="tracking-[0.3em] text-center uppercase text-sm md:text-lg">{t('safeMode')}</div>
        <button onClick={() => setSystemState('NORMAL')} className={`mt-16 px-6 py-3 border border-[var(--border-strong)] text-[var(--text-muted)] active:bg-[var(--bg-panel)] uppercase text-xs tracking-widest ${diagRadius}`}>
          START
        </button>
      </div>
    );
  }

  // --- ЭКРАН ФОКУСА (РЕНДЕР) ---
  if (systemState === 'COMPILING') {
    return (
      <div className="min-h-[100dvh] bg-[var(--bg-base)] flex flex-col items-center justify-center font-mono p-4 md:p-8 transition-colors duration-300">
        <StyleInjection />
        <Activity className="w-10 h-10 mb-6 animate-pulse opacity-50" style={{ color: 'var(--os-accent)' }} />
        
        <div className={`bg-[var(--bg-panel)] border border-[var(--border-strong)] p-6 w-full max-w-2xl relative shadow-2xl ${diagRadius}`}>
          <div className="text-[10px] md:text-xs tracking-widest mb-3 uppercase flex justify-between" style={{ color: textMutedHex }}>
            <span>[ {activeColliderTask?.id} ] {t('compile')}</span>
            <span style={{ color: 'var(--os-accent)' }}>{activeColliderTask?.progress}%</span>
          </div>
          <div className="text-lg md:text-2xl tracking-wide mb-6" style={{ color: textMainHex }}>{activeColliderTask?.title}</div>
          
          <div className="w-full h-1 mb-4 relative bg-[var(--bg-button)] rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full transition-all duration-300" style={{ backgroundColor: 'var(--os-accent)', width: `${activeColliderTask?.progress}%` }} />
          </div>
          
          <div className="flex gap-2 mb-8 text-[10px] md:text-xs">
            <button onClick={() => updateProgress(-10)} className={`px-3 py-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] ${diagRadiusReverse}`} style={{ color: textMainHex }}>-10%</button>
            <button onClick={() => updateProgress(10)} className={`px-3 py-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] ${diagRadiusReverse}`} style={{ color: textMainHex }}>+10%</button>
            <button onClick={() => updateProgress(100 - activeColliderTask.progress)} className={`px-3 py-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] ml-auto ${diagRadiusReverse}`} style={{ color: textMainHex }}>MAX</button>
          </div>

          <div className="mb-8 border-l-2 border-[var(--border-strong)] pl-4 flex flex-col gap-3">
            {activeColliderTask?.subtasks?.map(sub => (
              <button key={sub.id} onClick={() => toggleSubtask(sub.id)} className="flex items-start gap-3 text-left">
                <div className="mt-0.5">
                  {sub.done ? <CheckSquare className="w-4 h-4" style={{ color: 'var(--os-accent)' }} /> : <Square className="w-4 h-4" style={{ color: textMutedHex }} />}
                </div>
                <span className="text-sm" style={{ color: sub.done ? textMutedHex : textMainHex, textDecoration: sub.done ? 'line-through' : 'none' }}>{sub.text}</span>
              </button>
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
              <button onClick={() => exitCompilation('ACTIVE_RAM')} className={`flex-1 text-[10px] md:text-xs uppercase bg-[var(--bg-button)] border border-[var(--border-strong)] px-3 py-3 active:bg-[var(--bg-button-active)] flex items-center justify-center gap-2 ${diagRadius}`} style={{ color: textMainHex }}>
                <Pause className="w-3 h-3" /> {t('ram')}
              </button>
              <button onClick={() => exitCompilation('CRYO')} className={`flex-1 text-[10px] md:text-xs uppercase bg-[var(--bg-panel)] border border-[var(--border-strong)] px-3 py-3 active:bg-[var(--bg-button-active)] flex items-center justify-center gap-2 ${diagRadius}`} style={{ color: 'var(--os-accent)' }}>
                <Snowflake className="w-3 h-3" /> {t('cryo')}
              </button>
            </div>
            <button onClick={finishCompilation} className={`text-xs uppercase font-bold tracking-widest px-6 py-3 flex items-center justify-center gap-2 active:opacity-80 transition-opacity ${diagRadiusReverse}`} style={{ backgroundColor: 'var(--os-accent)', color: 'var(--os-accent-text)' }}>
              <Zap className="w-4 h-4" /> FINISH
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- ГЛАВНЫЙ ЭКРАН ---
  return (
    <div className="h-[100dvh] bg-[var(--bg-base)] text-[var(--text-main)] font-mono flex flex-col overflow-hidden transition-colors duration-300">
      <StyleInjection />
      <header className="flex-shrink-0 bg-[var(--bg-header)] border-b border-[var(--border-color)] p-4 pb-3 z-10 relative mt-safe transition-colors duration-300">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <Terminal className="w-4 h-4 md:w-5 md:h-5" style={{ color: textMutedHex }} />
            <div className="text-xs md:text-sm tracking-widest font-bold uppercase" style={{ color: textMainHex }}>ColdCache<span style={{ color: 'var(--os-accent)' }}>.OS</span></div>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={() => setIsManualOpen(true)} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] ${diagRadiusReverse}`} style={{ color: textMutedHex }}>
              <BookOpen className="w-3 h-3" />
            </button>
            <button onClick={() => setIsLogOpen(true)} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] relative ${diagRadiusReverse}`} style={{ color: textMutedHex }}>
              <Archive className="w-3 h-3" />
              {renderLog.length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--os-accent)' }}></span>}
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] ${diagRadiusReverse}`} style={{ color: textMutedHex }}>
              <Settings className="w-3 h-3" />
            </button>
            <button onClick={() => setSystemState('SAFE_MODE')} className={`p-2 border border-red-900/30 text-red-500 active:bg-red-900/20 bg-red-900/10 ${diagRadiusReverse}`}>
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
              <button key={key} onClick={() => interactDaemon(key)} className={`bg-[var(--bg-panel)] border border-[var(--border-color)] p-2 md:p-3 relative overflow-hidden text-left active:opacity-70 transition-opacity ${diagRadius}`}>
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
        
        <button onClick={() => setIsBufferOpen(true)} className={`w-full py-4 flex items-center justify-center gap-3 bg-[var(--bg-panel)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] uppercase tracking-widest text-xs font-bold shadow-sm ${diagRadius}`} style={{ color: textMainHex }}>
          <Database className="w-4 h-4" style={{ color: 'var(--os-accent)' }} />
          {t('buffer')}
          {bufferTasks.length > 0 && <span className="px-2 py-0.5 rounded-sm bg-[var(--bg-button)] text-[10px] ml-2">{bufferTasks.length}</span>}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-safe">
          <section className="lg:col-span-8 flex flex-col gap-4">
            
            {/* АБСОЛЮТНАЯ ЗАЩИТА ОТ ИНВЕРСИИ БРАУЗЕРА */}
            <div className="flex items-center gap-2 border-b border-[var(--border-strong)] pb-2">
              <Cpu className="w-4 h-4" style={{ color: textMainHex }} />
              <h2 className="uppercase tracking-widest text-xs font-semibold m-0" style={{ color: textMainHex }}>{t('ram')}</h2>
              <span className="ml-auto text-[10px]" style={{ color: textMutedHex }}>СЛОТЫ: {activeTasks.length}/2</span>
            </div>
            
            <div className="grid gap-4">
              {activeTasks.map(task => (
                <div key={task.id} className={`bg-[var(--bg-panel)] border border-[var(--border-strong)] p-4 md:p-5 relative flex flex-col gap-4 shadow-sm ${diagRadius}`}>
                  <div className="absolute top-0 left-0 h-0.5 transition-all" style={{ backgroundColor: 'var(--os-accent)', width: `${task.progress}%` }} />
                  
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
                      <div className={`text-[10px] px-2 py-1 bg-[var(--bg-button)] border border-[var(--border-strong)] ${diagRadiusReverse}`} style={{ color: 'var(--os-accent)' }}>{task.progress}%</div>
                      {editingNodeId !== task.id && (
                        <button onClick={() => startEditNode(task)} className="p-1 active:opacity-70" style={{ color: textMutedHex }}><Edit2 className="w-3 h-3"/></button>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2 border-t border-[var(--border-color)] pt-4">
                    <button onClick={() => moveTask(task.id, 'CRYO')} className={`text-[10px] uppercase px-3 py-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] flex items-center gap-1.5 ${diagRadiusReverse}`} style={{ color: textMainHex }}>
                      <Snowflake className="w-3 h-3" /> {t('cryo')}
                    </button>
                    <button onClick={() => startCompilation(task)} className={`text-[10px] md:text-xs uppercase px-6 py-2.5 font-bold tracking-widest flex items-center gap-2 active:opacity-80 ${diagRadiusReverse}`} style={{ backgroundColor: 'var(--os-accent)', color: 'var(--os-accent-text)' }}>
                      <Zap className="w-3 h-3" /> {t('render')}
                    </button>
                  </div>
                </div>
              ))}
              {activeTasks.length === 0 && (
                <div className={`h-24 border border-[var(--border-color)] border-dashed flex items-center justify-center text-[10px] uppercase tracking-widest ${diagRadius}`} style={{ color: textMutedHex }}>{t('emptyMem')}</div>
              )}
            </div>
          </section>

          <section className="lg:col-span-4 flex flex-col gap-4">
            
            {/* АБСОЛЮТНАЯ ЗАЩИТА ОТ ИНВЕРСИИ БРАУЗЕРА */}
            <div className="flex items-center gap-2 border-b border-[var(--border-strong)] pb-2">
              <Snowflake className="w-4 h-4" style={{ color: textMutedHex }} />
              <h2 className="uppercase tracking-widest text-xs font-semibold m-0" style={{ color: textMutedHex }}>{t('cryo')}</h2>
            </div>
            
            <div className="flex flex-col gap-2">
              {cryoTasks.map(task => (
                <div key={task.id} className={`bg-[var(--bg-panel)] border border-[var(--border-color)] p-3 opacity-70 active:opacity-100 transition-opacity ${diagRadius}`}>
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
                    <button onClick={() => setTasks(prev => prev.filter(t => t.id !== task.id))} className="text-[10px] uppercase py-1 hover:text-red-500" style={{ color: textMutedHex }}>{t('drop')}</button>
                    <button onClick={() => moveTask(task.id, 'ACTIVE_RAM')} className={`text-[10px] uppercase bg-[var(--bg-button)] border border-[var(--border-strong)] px-3 py-1 active:bg-[var(--bg-button-active)] ${diagRadiusReverse}`} style={{ color: textMainHex }}>
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
        <div className={`fixed bottom-6 right-6 left-6 md:left-auto md:w-80 z-40 bg-[var(--bg-header)] border border-[var(--border-strong)] p-3 shadow-2xl ${diagRadius}`}>
          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <Wind className="w-4 h-4 shrink-0" />
            <input 
              type="text" 
              value={devNullInput}
              // Блокируем ввод символов, если идет анимация, но не выключаем само поле
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
        <div className="fixed inset-0 z-50 flex flex-col font-mono bg-[var(--bg-base)] transition-colors duration-300">
          <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-header)] flex justify-between items-center mt-safe shrink-0">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5" style={{ color: textMutedHex }} />
              <div>
                <div className="text-xs tracking-widest uppercase font-bold" style={{ color: textMainHex }}>{t('buffer')}</div>
              </div>
            </div>
            <button onClick={closeModals} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] ${diagRadiusReverse}`} style={{ color: textMainHex }}>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-panel)] flex items-center gap-3 shrink-0">
            <Terminal className="w-4 h-4" style={{ color: 'var(--os-accent)' }} />
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
          className={`px-3 py-1.5 border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] text-[10px] tracking-widest font-bold uppercase shrink-0 transition-colors ${diagRadiusReverse}`}
          style={{ 
            color: isBufferReversed ? 'var(--os-accent-text)' : textMutedHex,
            backgroundColor: isBufferReversed ? 'var(--os-accent)' : 'transparent'
          }}
        >
          {isBufferReversed ? 'NEW' : 'OLD'}
        </button>
          </div>
          
          <div className="p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 content-start flex-1">
          {(isBufferReversed ? [...bufferTasks].reverse() : bufferTasks).map(task => (
              <div key={task.id} className={`bg-[var(--bg-panel)] border border-[var(--border-strong)] p-4 flex flex-col justify-between ${diagRadius}`}>
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
                  <button onClick={() => moveTask(task.id, 'CRYO')} className={`text-[9px] md:text-[10px] uppercase px-4 py-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] ${diagRadiusReverse}`} style={{ color: textMainHex }}>{t('cryo')}</button>
                  <button onClick={() => { moveTask(task.id, 'ACTIVE_RAM'); closeModals(); }} className={`text-[9px] md:text-[10px] uppercase px-4 py-2 border border-[var(--border-strong)] font-bold active:opacity-80 ${diagRadiusReverse}`} style={{ backgroundColor: 'var(--os-accent)', color: 'var(--os-accent-text)' }}>{t('ram')}</button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-header)] shrink-0 mb-safe">
            <button onClick={closeModals} className={`w-full py-4 bg-[var(--bg-button)] border border-[var(--border-strong)] font-bold tracking-widest uppercase active:bg-[var(--bg-button-active)] ${diagRadius}`} style={{ color: textMainHex }}>
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* --- МОДАЛКА АРХИВА --- */}
      {isLogOpen && (
        <div className="fixed inset-0 z-50 flex flex-col font-mono bg-[var(--bg-base)] transition-colors duration-300">
          <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-header)] flex justify-between items-center mt-safe shrink-0">
            <div className="flex items-center gap-3">
              <Archive className="w-5 h-5" style={{ color: textMutedHex }} />
              <div>
                <div className="text-xs tracking-widest uppercase font-bold" style={{ color: textMainHex }}>{t('archive')}</div>
                <div className="text-[9px] tracking-widest" style={{ color: 'var(--os-accent)' }}>DATA: {totalRenderedData} MB</div>
              </div>
            </div>
            <button onClick={closeModals} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] ${diagRadiusReverse}`} style={{ color: textMainHex }}>
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto flex flex-col gap-3 flex-1 content-start">
            {renderLog.map((task, idx) => (
              <div key={idx} className={`bg-[var(--bg-panel)] border border-[var(--border-strong)] p-3 flex justify-between items-center gap-4 ${diagRadius}`}>
                <div className="flex-1">
                  <div className="text-[9px] mb-1 font-mono flex gap-2" style={{ color: textMutedHex }}>
                    <span>{task.completedAt}</span>
                    <span style={{ color: 'var(--os-accent)' }}>[{task.id}]</span>
                  </div>
                  <div className="text-sm font-semibold" style={{ color: textMainHex }}>{task.title}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => restoreFromArchive(task.id)} className="p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] rounded-sm" style={{ color: textMutedHex }} title="Restore to Cryo">
                    <RotateCcw className="w-3 h-3" />
                  </button>
                  <div className={`text-[10px] px-2 py-1 bg-[var(--bg-button)] border border-[var(--border-strong)] font-bold ${diagRadiusReverse}`} style={{ color: textMutedHex }}>
                    +{task.weight}MB
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-header)] shrink-0 mb-safe">
            <button onClick={closeModals} className={`w-full py-4 bg-[var(--bg-button)] border border-[var(--border-strong)] font-bold tracking-widest uppercase active:bg-[var(--bg-button-active)] ${diagRadius}`} style={{ color: textMainHex }}>
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* --- МОДАЛКА НАСТРОЕК --- */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex flex-col font-mono bg-[var(--bg-base)] transition-colors duration-300">
          <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-header)] flex justify-between items-center mt-safe shrink-0">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5" style={{ color: textMutedHex }} />
              <div className="text-xs tracking-widest uppercase font-bold" style={{ color: textMainHex }}>{t('settings')}</div>
            </div>
            <button onClick={closeModals} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] ${diagRadiusReverse}`} style={{ color: textMainHex }}>
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto flex flex-col gap-8 flex-1">
            
            <div className="flex flex-col gap-4">
              <div className="text-[10px] uppercase tracking-widest border-b border-[var(--border-color)] pb-1" style={{ color: textMutedHex }}>GLOBAL_CONFIG</div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase" style={{ color: textMainHex }}>Color Scheme</span>
                <div className="flex gap-2">
                  {Object.keys(THEMES).map(tKey => (
                    <button key={tKey} onClick={() => setCurrentTheme(tKey)} className={`w-6 h-6 rounded-full border-2 ${currentTheme === tKey ? 'border-[var(--text-main)]' : 'border-transparent'}`} style={{ backgroundColor: THEMES[tKey].accent }} />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-xs uppercase" style={{ color: textMainHex }}>Mode</span>
                <div className="flex gap-2">
                  <button onClick={() => setColorMode('dark')} className={`px-3 py-1 text-xs border ${colorMode === 'dark' ? 'border-[var(--os-accent)]' : 'border-[var(--border-strong)]'}`} style={{ color: colorMode === 'dark' ? 'var(--os-accent)' : textMutedHex }}>DARK</button>
                  <button onClick={() => setColorMode('light')} className={`px-3 py-1 text-xs border ${colorMode === 'light' ? 'border-[var(--os-accent)]' : 'border-[var(--border-strong)]'}`} style={{ color: colorMode === 'light' ? 'var(--os-accent)' : textMutedHex }}>LIGHT</button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-xs uppercase" style={{ color: textMainHex }}>Terminology</span>
                <div className="flex gap-2">
                  <button onClick={() => setTerminology('system')} className={`px-3 py-1 text-xs border ${terminology === 'system' ? 'border-[var(--os-accent)]' : 'border-[var(--border-strong)]'}`} style={{ color: terminology === 'system' ? 'var(--os-accent)' : textMutedHex }}>SYSTEM</button>
                  <button onClick={() => setTerminology('human')} className={`px-3 py-1 text-xs border ${terminology === 'human' ? 'border-[var(--os-accent)]' : 'border-[var(--border-strong)]'}`} style={{ color: terminology === 'human' ? 'var(--os-accent)' : textMutedHex }}>HUMAN</button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="text-[10px] uppercase tracking-widest border-b border-[var(--border-color)] pb-1" style={{ color: textMutedHex }}>DAEMONS_CONFIG</div>
              
              {Object.keys(daemons).map(key => {
                const d = daemons[key];
                const CurrentIcon = ICON_MAP[d.iconName] || ICON_MAP['SquareActivity'];
                
                return (
                  <div key={key} className={`bg-[var(--bg-panel)] p-3 border border-[var(--border-strong)] flex flex-col gap-3 ${diagRadius}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <CurrentIcon className="w-4 h-4" style={{ color: DAEMON_COLORS[key] }}/>
                      <input 
                        value={d.label} onChange={(e) => updateDaemonConfig(key, 'label', e.target.value)}
                        className="bg-transparent border-b border-[var(--border-strong)] outline-none text-xs font-bold w-full uppercase"
                        style={{ color: textMainHex }}
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1 mt-1">
                      {/* ДОБАВЛЕН ЗАМЕТНЫЙ ЯРЛЫК ДЛЯ ВЫБОРА ИКОНКИ */}
                      <span className="text-[9px] mb-1 font-bold tracking-widest uppercase" style={{ color: 'var(--os-accent)' }}>ICON SELECTOR</span>
                      <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {Object.keys(ICON_MAP).map(iName => {
                          const IconComp = ICON_MAP[iName];
                          const isSelected = d.iconName === iName;
                          return (
                            <button
                              key={iName}
                              onClick={() => updateDaemonConfig(key, 'iconName', iName)}
                              className={`p-1.5 border shrink-0 ${isSelected ? 'border-[var(--os-accent)] bg-[var(--bg-button-active)]' : 'border-[var(--border-strong)] bg-[var(--bg-button)] opacity-50'} ${diagRadiusReverse}`}
                            >
                              <IconComp className="w-4 h-4" style={{ color: isSelected ? DAEMON_COLORS[key] : textMutedHex }} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-1">
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-[9px] mb-1 truncate" style={{ color: textMutedHex }}>MAX VALUE</span>
                        <input type="number" value={d.max} onChange={(e) => updateDaemonConfig(key, 'max', e.target.value === '' ? '' : Number(e.target.value))} className="w-full bg-[var(--bg-button)] border border-[var(--border-strong)] p-1.5 text-xs outline-none rounded-sm" style={{ color: textMainHex }} />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-[9px] mb-1 truncate" style={{ color: textMutedHex }}>STEP (+ per click)</span>
                        <input type="number" value={d.step} onChange={(e) => updateDaemonConfig(key, 'step', e.target.value === '' ? '' : Number(e.target.value))} className="w-full bg-[var(--bg-button)] border border-[var(--border-strong)] p-1.5 text-xs outline-none rounded-sm" style={{ color: textMainHex }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
          <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-header)] shrink-0 mb-safe">
            <button onClick={closeModals} className={`w-full py-4 bg-[var(--bg-button)] border border-[var(--border-strong)] font-bold tracking-widest uppercase active:bg-[var(--bg-button-active)] ${diagRadius}`} style={{ color: textMainHex }}>
              APPLY & CLOSE
            </button>
          </div>
        </div>
      )}

      {/* --- МОДАЛКА МАНУАЛА --- */}
      {isManualOpen && (
        <div className="fixed inset-0 z-50 flex flex-col font-mono bg-[var(--bg-base)] transition-colors duration-300">
          <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-header)] flex justify-between items-center mt-safe shrink-0">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5" style={{ color: textMutedHex }} />
              <div className="text-xs tracking-widest uppercase font-bold" style={{ color: textMainHex }}>{t('manual')}</div>
            </div>
            <button onClick={closeModals} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] ${diagRadiusReverse}`} style={{ color: textMainHex }}>
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto flex flex-col gap-6 flex-1 text-sm leading-relaxed" style={{ color: textMainHex }}>
            <p>Добро пожаловать в <strong>ColdCache.OS</strong>. Это терминал управления когнитивной нагрузкой.</p>
            
            <div className="flex flex-col gap-2">
              <div className="font-bold text-[var(--os-accent)]">1. {t('buffer')} (Буфер)</div>
              <p style={{ color: textMutedHex }}>Место для сброса хаоса. Возникла мысль или задача? Быстро записывай её сюда и закрывай терминал. Не держи в голове.</p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="font-bold text-[var(--os-accent)]">2. {t('ram')} (Слоты фокуса)</div>
              <p style={{ color: textMutedHex }}>То, что ты делаешь прямо сейчас. Жесткий лимит — 2 слота. Если пытаешься взять третью задачу, система не даст этого сделать, пока не освободишь память.</p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="font-bold text-[var(--os-accent)]">3. {t('cryo')} (Отложенное)</div>
              <p style={{ color: textMutedHex }}>Задачи, которые нужно сделать, но не сегодня или не сейчас. Замораживай их здесь, чтобы они не мозолили глаза в фокусе.</p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="font-bold text-[var(--os-accent)]">4. {t('render')} (Гиперфокус)</div>
              <p style={{ color: textMutedHex }}>Когда нажимаешь эту кнопку, задача разворачивается на весь экран. Внутри можно создать чек-лист микро-шагов. Если свернуть приложение, состояние рендера сохранится.</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="font-bold text-[var(--os-accent)]">5. Daemons (Трекеры)</div>
              <p style={{ color: textMutedHex }}>Три верхние плашки для отслеживания рутины (шаги, вода, что угодно). Настраиваются индивидуально через меню параметров.</p>
            </div>
          </div>
          
          <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-header)] shrink-0 mb-safe">
            <button onClick={closeModals} className={`w-full py-4 bg-[var(--bg-button)] border border-[var(--border-strong)] font-bold tracking-widest uppercase active:bg-[var(--bg-button-active)] ${diagRadius}`} style={{ color: textMainHex }}>
              ПОНЯТНО
            </button>
          </div>
        </div>
      )}

    </div>
  );
}