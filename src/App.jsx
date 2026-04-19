import React, { useState, useEffect } from 'react';
import { Power, ShieldAlert, Cpu, Snowflake, Zap, Terminal, Database, Activity, CheckSquare, Square, Pause, X, Battery, Droplet, SquareActivity, Archive, Settings, Edit2, RotateCcw, BookOpen } from 'lucide-react';

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

// Иконки не сохраняем в localStorage, держим их статично для 3 слотов
const DAEMON_ICONS = { d1: SquareActivity, d2: Droplet, d3: Battery };
const DAEMON_COLORS = { d1: '#a3e635', d2: '#22d3ee', d3: '#f97316' };

const DAEMONS_INIT = {
  d1: { label: 'KINEMATICS', current: 0, max: 10000, step: 1000 },
  d2: { label: 'COOLANT', current: 0, max: 2000, step: 250 },
  d3: { label: 'HARDWARE', current: 0, max: 1, step: 1 }
};

const THEMES = {
  cyan: { name: 'Cyan Core', accent: '#06b6d4', accentDim: 'rgba(6, 182, 212, 0.15)' },
  green: { name: 'Matrix Green', accent: '#22c55e', accentDim: 'rgba(34, 197, 94, 0.15)' },
  purple: { name: 'Deep Purple', accent: '#a855f7', accentDim: 'rgba(168, 85, 247, 0.15)' },
  amber: { name: 'Amber Glow', accent: '#f59e0b', accentDim: 'rgba(245, 158, 11, 0.15)' },
};

const diagRadius = "rounded-tl-2xl rounded-br-2xl rounded-tr-sm rounded-bl-sm";
const diagRadiusReverse = "rounded-tr-2xl rounded-bl-2xl rounded-tl-sm rounded-br-sm";

export default function App() {
  // --- МОДУЛИ ПАМЯТИ ---
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('cc_tasks')) || DEFAULT_TASKS);
  const [renderLog, setRenderLog] = useState(() => JSON.parse(localStorage.getItem('cc_log')) || DEFAULT_LOG);
  
  // КРИТИЧЕСКИЙ ФИКС: Сохраняем состояние гиперфокуса
  const [systemState, setSystemState] = useState(() => localStorage.getItem('cc_state') || 'NORMAL'); 
  const [activeColliderTask, setActiveColliderTask] = useState(() => JSON.parse(localStorage.getItem('cc_active_task')) || null);

  const [daemons, setDaemons] = useState(() => {
    const saved = localStorage.getItem('cc_daemons');
    const lastDate = localStorage.getItem('cc_date');
    const today = new Date().toDateString();
    
    if (lastDate !== today) {
      localStorage.setItem('cc_date', today);
      return DAEMONS_INIT; // Новый день - сброс
    }
    return saved ? JSON.parse(saved) : DAEMONS_INIT;
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

  // Движок CSS переменных
  useEffect(() => {
    const root = document.documentElement;
    const isDark = colorMode === 'dark';
    
    root.style.setProperty('--os-accent', THEMES[currentTheme].accent);
    root.style.setProperty('--os-accent-dim', THEMES[currentTheme].accentDim);
    
    root.style.setProperty('--bg-base', isDark ? '#0c0c0e' : '#e4e4e7');
    root.style.setProperty('--bg-header', isDark ? '#141417' : '#d4d4d8');
    root.style.setProperty('--bg-panel', isDark ? '#18181b' : '#f4f4f5');
    root.style.setProperty('--border-color', isDark ? 'rgba(63, 63, 70, 0.4)' : 'rgba(161, 161, 170, 0.5)');
    root.style.setProperty('--border-strong', isDark ? '#27272a' : '#a1a1aa');
    root.style.setProperty('--text-main', isDark ? '#d4d4d8' : '#27272a');
    root.style.setProperty('--text-muted', isDark ? '#71717a' : '#52525b');
    root.style.setProperty('--bg-button', isDark ? '#18181b' : '#d4d4d8');
    root.style.setProperty('--bg-button-active', isDark ? '#27272a' : '#a1a1aa');
  }, [currentTheme, colorMode]);

  const t = (key) => DICT[terminology][key];

  // --- UI СТЕЙТЫ МОДАЛОК ---
  const [isBufferOpen, setIsBufferOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  
  const [newTaskInput, setNewTaskInput] = useState('');
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
      <div className="min-h-[100dvh] bg-[var(--bg-base)] flex flex-col items-center justify-center font-mono text-[var(--text-muted)] p-4">
        <Power className="w-16 h-16 mb-8 opacity-50 animate-pulse" style={{ color: 'var(--text-main)' }} />
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
        <Activity className="w-10 h-10 mb-6 animate-pulse opacity-50" style={{ color: 'var(--os-accent)' }} />
        
        <div className={`bg-[var(--bg-panel)] border border-[var(--border-strong)] p-6 w-full max-w-2xl relative shadow-2xl ${diagRadius}`}>
          <div className="text-[10px] md:text-xs tracking-widest mb-3 uppercase flex justify-between text-[var(--text-muted)]">
            <span>[ {activeColliderTask?.id} ] {t('compile')}</span>
            <span style={{ color: 'var(--os-accent)' }}>{activeColliderTask?.progress}%</span>
          </div>
          <div className="text-lg md:text-2xl tracking-wide mb-6 text-[var(--text-main)]">{activeColliderTask?.title}</div>
          
          <div className="w-full h-1 mb-4 relative bg-[var(--bg-button)] rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full transition-all duration-300" style={{ backgroundColor: 'var(--os-accent)', width: `${activeColliderTask?.progress}%` }} />
          </div>
          
          <div className="flex gap-2 mb-8 text-[10px] md:text-xs">
            <button onClick={() => updateProgress(-10)} className={`px-3 py-2 bg-[var(--bg-button)] border border-[var(--border-strong)] text-[var(--text-main)] active:bg-[var(--bg-button-active)] ${diagRadiusReverse}`}>-10%</button>
            <button onClick={() => updateProgress(10)} className={`px-3 py-2 bg-[var(--bg-button)] border border-[var(--border-strong)] text-[var(--text-main)] active:bg-[var(--bg-button-active)] ${diagRadiusReverse}`}>+10%</button>
            <button onClick={() => updateProgress(100 - activeColliderTask.progress)} className={`px-3 py-2 bg-[var(--bg-button)] border border-[var(--border-strong)] text-[var(--text-main)] active:bg-[var(--bg-button-active)] ml-auto ${diagRadiusReverse}`}>MAX</button>
          </div>

          <div className="mb-8 border-l-2 border-[var(--border-strong)] pl-4 flex flex-col gap-3">
            {activeColliderTask?.subtasks?.map(sub => (
              <button key={sub.id} onClick={() => toggleSubtask(sub.id)} className="flex items-start gap-3 text-left">
                <div className="mt-0.5">
                  {sub.done ? <CheckSquare className="w-4 h-4" style={{ color: 'var(--os-accent)' }} /> : <Square className="w-4 h-4 text-[var(--text-muted)]" />}
                </div>
                <span className={`text-sm ${sub.done ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-main)]'}`}>{sub.text}</span>
              </button>
            ))}
            
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[var(--text-muted)]">&gt;</span>
              <input 
                type="text" 
                value={newSubtaskInput}
                onChange={(e) => setNewSubtaskInput(e.target.value)}
                onKeyDown={createSubtask}
                placeholder="..."
                className="bg-transparent border-none outline-none text-sm w-full font-mono text-[var(--text-main)] placeholder-[var(--text-muted)]"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-10 pt-6 border-t border-[var(--border-strong)]">
            <div className="flex gap-2">
              <button onClick={() => exitCompilation('ACTIVE_RAM')} className={`flex-1 text-[10px] md:text-xs uppercase bg-[var(--bg-button)] border border-[var(--border-strong)] text-[var(--text-main)] px-3 py-3 active:bg-[var(--bg-button-active)] flex items-center justify-center gap-2 ${diagRadius}`}>
                <Pause className="w-3 h-3" /> {t('ram')}
              </button>
              <button onClick={() => exitCompilation('CRYO')} className={`flex-1 text-[10px] md:text-xs uppercase bg-[var(--bg-panel)] border border-[var(--border-strong)] px-3 py-3 active:bg-[var(--bg-button-active)] flex items-center justify-center gap-2 ${diagRadius}`} style={{ color: 'var(--os-accent)' }}>
                <Snowflake className="w-3 h-3" /> {t('cryo')}
              </button>
            </div>
            <button onClick={finishCompilation} className={`text-xs uppercase font-bold tracking-widest px-6 py-3 flex items-center justify-center gap-2 active:opacity-80 transition-opacity ${diagRadiusReverse}`} style={{ backgroundColor: 'var(--os-accent)', color: colorMode === 'dark' ? '#000' : '#fff' }}>
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
      <header className="flex-shrink-0 bg-[var(--bg-header)] border-b border-[var(--border-color)] p-4 pb-3 z-10 relative mt-safe transition-colors duration-300">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <Terminal className="w-4 h-4 md:w-5 md:h-5 text-[var(--text-muted)]" />
            <div className="text-xs md:text-sm tracking-widest font-bold uppercase text-[var(--text-main)]">ColdCache<span style={{ color: 'var(--os-accent)' }}>.OS</span></div>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={() => setIsManualOpen(true)} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] text-[var(--text-muted)] active:bg-[var(--bg-button-active)] ${diagRadiusReverse}`}>
              <BookOpen className="w-3 h-3" />
            </button>
            <button onClick={() => setIsLogOpen(true)} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] text-[var(--text-muted)] active:bg-[var(--bg-button-active)] relative ${diagRadiusReverse}`}>
              <Archive className="w-3 h-3" />
              {renderLog.length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--os-accent)' }}></span>}
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] text-[var(--text-muted)] active:bg-[var(--bg-button-active)] ${diagRadiusReverse}`}>
              <Settings className="w-3 h-3" />
            </button>
            <button onClick={() => setSystemState('SAFE_MODE')} className={`p-2 border border-red-900/30 text-red-500 active:bg-red-900/20 bg-red-900/10 ${diagRadiusReverse}`}>
              <ShieldAlert className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {Object.entries(daemons).map(([key, data]) => {
            const Icon = DAEMON_ICONS[key];
            const color = DAEMON_COLORS[key];
            const isDone = data.current >= data.max;
            
            return (
              <button key={key} onClick={() => interactDaemon(key)} className={`bg-[var(--bg-panel)] border border-[var(--border-color)] p-2 md:p-3 relative overflow-hidden text-left active:opacity-70 transition-opacity ${diagRadius}`}>
                <div className="absolute bottom-0 left-0 h-full transition-all duration-300 opacity-20" style={{ backgroundColor: isDone ? color : 'transparent', width: `${Math.min(100, (data.current / data.max) * 100)}%` }} />
                <div className="relative z-10 flex flex-col gap-1 md:flex-row md:justify-between md:items-center">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <Icon className="w-3 h-3 md:w-4 md:h-4" style={{ color: isDone ? color : 'var(--text-muted)' }} />
                    <span className="text-[8px] md:text-[9px] uppercase tracking-widest truncate" style={{ color: isDone ? color : 'var(--text-muted)' }}>{data.label}</span>
                  </div>
                  <span className="text-[10px]" style={{ color: isDone ? color : 'var(--text-main)', fontWeight: isDone ? 'bold' : 'normal' }}>
                    {data.current}/{data.max}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-6 overflow-y-auto relative">
        
        {/* НОВАЯ ПОЗИЦИЯ КНОПКИ БУФЕРА */}
        <button onClick={() => setIsBufferOpen(true)} className={`w-full py-4 flex items-center justify-center gap-3 bg-[var(--bg-panel)] border border-[var(--border-strong)] text-[var(--text-main)] active:bg-[var(--bg-button-active)] uppercase tracking-widest text-xs font-bold shadow-sm ${diagRadius}`}>
          <Database className="w-4 h-4" style={{ color: 'var(--os-accent)' }} />
          {t('buffer')}
          {bufferTasks.length > 0 && <span className="px-2 py-0.5 rounded-sm bg-[var(--bg-button)] text-[10px] ml-2">{bufferTasks.length}</span>}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-safe">
          <section className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-[var(--border-strong)] pb-2 text-[var(--text-main)]">
              <Cpu className="w-4 h-4" />
              <h2 className="uppercase tracking-widest text-xs font-semibold">{t('ram')}</h2>
              <span className="ml-auto text-[10px] text-[var(--text-muted)]">СЛОТЫ: {activeTasks.length}/2</span>
            </div>
            <div className="grid gap-4">
              {activeTasks.map(task => (
                <div key={task.id} className={`bg-[var(--bg-panel)] border border-[var(--border-strong)] p-4 md:p-5 relative flex flex-col gap-4 shadow-sm ${diagRadius}`}>
                  <div className="absolute top-0 left-0 h-0.5 transition-all" style={{ backgroundColor: 'var(--os-accent)', width: `${task.progress}%` }} />
                  
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="text-[10px] tracking-widest mb-1.5 text-[var(--text-muted)]">{task.id}</div>
                      {editingNodeId === task.id ? (
                        <input 
                          autoFocus
                          value={editInputValue}
                          onChange={(e) => setEditInputValue(e.target.value)}
                          onKeyDown={handleEditKeyDown}
                          onBlur={saveEditNode}
                          className="bg-transparent border-b border-[var(--border-strong)] outline-none text-sm md:text-base w-full font-mono text-[var(--text-main)]"
                        />
                      ) : (
                        <div className="text-sm md:text-base font-semibold text-[var(--text-main)] break-words pr-2">{task.title}</div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className={`text-[10px] px-2 py-1 bg-[var(--bg-button)] border border-[var(--border-strong)] ${diagRadiusReverse}`} style={{ color: 'var(--os-accent)' }}>{task.progress}%</div>
                      {editingNodeId !== task.id && (
                        <button onClick={() => startEditNode(task)} className="p-1 text-[var(--text-muted)] active:text-[var(--text-main)]"><Edit2 className="w-3 h-3"/></button>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2 border-t border-[var(--border-color)] pt-4">
                    <button onClick={() => moveTask(task.id, 'CRYO')} className={`text-[10px] uppercase px-3 py-2 bg-[var(--bg-button)] border border-[var(--border-strong)] text-[var(--text-main)] active:bg-[var(--bg-button-active)] flex items-center gap-1.5 ${diagRadiusReverse}`}>
                      <Snowflake className="w-3 h-3" /> {t('cryo')}
                    </button>
                    <button onClick={() => startCompilation(task)} className={`text-[10px] md:text-xs uppercase px-6 py-2.5 font-bold tracking-widest flex items-center gap-2 active:opacity-80 ${diagRadiusReverse}`} style={{ backgroundColor: 'var(--os-accent)', color: colorMode === 'dark' ? '#000' : '#fff' }}>
                      <Zap className="w-3 h-3" /> {t('render')}
                    </button>
                  </div>
                </div>
              ))}
              {activeTasks.length === 0 && (
                <div className={`h-24 border border-[var(--border-color)] border-dashed flex items-center justify-center text-[10px] uppercase tracking-widest text-[var(--text-muted)] ${diagRadius}`}>{t('emptyMem')}</div>
              )}
            </div>
          </section>

          <section className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-[var(--border-strong)] pb-2 text-[var(--text-muted)]">
              <Snowflake className="w-4 h-4" />
              <h2 className="uppercase tracking-widest text-xs font-semibold">{t('cryo')}</h2>
            </div>
            <div className="flex flex-col gap-2">
              {cryoTasks.map(task => (
                <div key={task.id} className={`bg-[var(--bg-panel)] border border-[var(--border-color)] p-3 opacity-70 active:opacity-100 transition-opacity ${diagRadius}`}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] tracking-widest text-[var(--text-muted)]">{task.id}</span>
                    <button onClick={() => startEditNode(task)} className="p-1 text-[var(--text-muted)]"><Edit2 className="w-3 h-3"/></button>
                  </div>
                  {editingNodeId === task.id ? (
                     <input 
                       autoFocus value={editInputValue} onChange={(e) => setEditInputValue(e.target.value)} onKeyDown={handleEditKeyDown} onBlur={saveEditNode}
                       className="bg-transparent border-b border-[var(--border-strong)] outline-none text-xs w-full font-mono text-[var(--text-main)] mb-3"
                     />
                  ) : (
                    <div className="text-xs md:text-sm text-[var(--text-main)] mb-3 opacity-80">{task.title}</div>
                  )}
                  
                  <div className="flex justify-between border-t border-[var(--border-color)] pt-2 items-center">
                    <button onClick={() => setTasks(prev => prev.filter(t => t.id !== task.id))} className="text-[10px] uppercase py-1 text-[var(--text-muted)] hover:text-red-500">{t('drop')}</button>
                    <button onClick={() => moveTask(task.id, 'ACTIVE_RAM')} className={`text-[10px] uppercase bg-[var(--bg-button)] border border-[var(--border-strong)] text-[var(--text-main)] px-3 py-1 active:bg-[var(--bg-button-active)] ${diagRadiusReverse}`}>
                      {t('ram')}
                    </button>
                  </div>
                </div>
              ))}
              {cryoTasks.length === 0 && <div className="h-12 flex items-center text-[10px] uppercase tracking-widest text-[var(--text-muted)]">{t('emptyCryo')}</div>}
            </div>
          </section>
        </div>
      </main>

      {/* --- МОДАЛКА БУФЕРА --- */}
      {isBufferOpen && (
        <div className="fixed inset-0 z-50 flex flex-col font-mono bg-[var(--bg-base)] text-[var(--text-main)] transition-colors duration-300">
          <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-header)] flex justify-between items-center mt-safe shrink-0">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-[var(--text-muted)]" />
              <div>
                <div className="text-xs tracking-widest uppercase font-bold text-[var(--text-main)]">{t('buffer')}</div>
              </div>
            </div>
            <button onClick={closeModals} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] text-[var(--text-main)] active:bg-[var(--bg-button-active)] ${diagRadiusReverse}`}>
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
              className="bg-transparent border-none outline-none text-sm md:text-base w-full font-mono text-[var(--text-main)] placeholder-[var(--text-muted)]"
            />
          </div>
          
          <div className="p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 content-start flex-1">
            {bufferTasks.map(task => (
              <div key={task.id} className={`bg-[var(--bg-panel)] border border-[var(--border-strong)] p-4 flex flex-col justify-between ${diagRadius}`}>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-[9px] font-mono text-[var(--text-muted)]">{task.id}</div>
                    <button onClick={() => startEditNode(task)} className="p-1 text-[var(--text-muted)]"><Edit2 className="w-3 h-3"/></button>
                  </div>
                  {editingNodeId === task.id ? (
                    <input 
                      autoFocus value={editInputValue} onChange={(e) => setEditInputValue(e.target.value)} onKeyDown={handleEditKeyDown} onBlur={saveEditNode}
                      className="bg-transparent border-b border-[var(--border-strong)] outline-none text-sm w-full font-mono text-[var(--text-main)]"
                    />
                  ) : (
                    <div className="text-sm text-[var(--text-main)]">{task.title}</div>
                  )}
                </div>
                <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-[var(--border-color)]">
                  <button onClick={() => moveTask(task.id, 'CRYO')} className={`text-[9px] md:text-[10px] uppercase px-4 py-2 bg-[var(--bg-button)] border border-[var(--border-strong)] text-[var(--text-main)] active:bg-[var(--bg-button-active)] ${diagRadiusReverse}`}>{t('cryo')}</button>
                  <button onClick={() => { moveTask(task.id, 'ACTIVE_RAM'); closeModals(); }} className={`text-[9px] md:text-[10px] uppercase px-4 py-2 border border-[var(--border-strong)] font-bold active:opacity-80 ${diagRadiusReverse}`} style={{ backgroundColor: 'var(--os-accent)', color: colorMode === 'dark' ? '#000' : '#fff' }}>{t('ram')}</button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-header)] shrink-0 mb-safe">
            <button onClick={closeModals} className={`w-full py-4 bg-[var(--bg-button)] border border-[var(--border-strong)] text-[var(--text-main)] font-bold tracking-widest uppercase active:bg-[var(--bg-button-active)] ${diagRadius}`}>
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* --- МОДАЛКА АРХИВА --- */}
      {isLogOpen && (
        <div className="fixed inset-0 z-50 flex flex-col font-mono bg-[var(--bg-base)] text-[var(--text-main)] transition-colors duration-300">
          <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-header)] flex justify-between items-center mt-safe shrink-0">
            <div className="flex items-center gap-3">
              <Archive className="w-5 h-5 text-[var(--text-muted)]" />
              <div>
                <div className="text-xs tracking-widest uppercase font-bold text-[var(--text-main)]">{t('archive')}</div>
                <div className="text-[9px] tracking-widest" style={{ color: 'var(--os-accent)' }}>DATA: {totalRenderedData} MB</div>
              </div>
            </div>
            <button onClick={closeModals} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] text-[var(--text-main)] active:bg-[var(--bg-button-active)] ${diagRadiusReverse}`}>
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto flex flex-col gap-3 flex-1 content-start">
            {renderLog.map((task, idx) => (
              <div key={idx} className={`bg-[var(--bg-panel)] border border-[var(--border-strong)] p-3 flex justify-between items-center gap-4 ${diagRadius}`}>
                <div className="flex-1">
                  <div className="text-[9px] mb-1 font-mono flex gap-2 text-[var(--text-muted)]">
                    <span>{task.completedAt}</span>
                    <span style={{ color: 'var(--os-accent)' }}>[{task.id}]</span>
                  </div>
                  <div className="text-sm font-semibold text-[var(--text-main)]">{task.title}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => restoreFromArchive(task.id)} className="p-2 text-[var(--text-muted)] bg-[var(--bg-button)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] rounded-sm" title="Restore to Cryo">
                    <RotateCcw className="w-3 h-3" />
                  </button>
                  <div className={`text-[10px] px-2 py-1 bg-[var(--bg-button)] border border-[var(--border-strong)] font-bold text-[var(--text-muted)] ${diagRadiusReverse}`}>
                    +{task.weight}MB
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-header)] shrink-0 mb-safe">
            <button onClick={closeModals} className={`w-full py-4 bg-[var(--bg-button)] border border-[var(--border-strong)] text-[var(--text-main)] font-bold tracking-widest uppercase active:bg-[var(--bg-button-active)] ${diagRadius}`}>
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* --- МОДАЛКА НАСТРОЕК (НОВАЯ) --- */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex flex-col font-mono bg-[var(--bg-base)] text-[var(--text-main)] transition-colors duration-300">
          <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-header)] flex justify-between items-center mt-safe shrink-0">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-[var(--text-muted)]" />
              <div className="text-xs tracking-widest uppercase font-bold text-[var(--text-main)]">{t('settings')}</div>
            </div>
            <button onClick={closeModals} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] text-[var(--text-main)] active:bg-[var(--bg-button-active)] ${diagRadiusReverse}`}>
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto flex flex-col gap-8 flex-1">
            
            {/* Глобальные параметры */}
            <div className="flex flex-col gap-4">
              <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border-color)] pb-1">GLOBAL_CONFIG</div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase">Color Scheme</span>
                <div className="flex gap-2">
                  {Object.keys(THEMES).map(tKey => (
                    <button key={tKey} onClick={() => setCurrentTheme(tKey)} className={`w-6 h-6 rounded-full border-2 ${currentTheme === tKey ? 'border-[var(--text-main)]' : 'border-transparent'}`} style={{ backgroundColor: THEMES[tKey].accent }} />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-xs uppercase">Mode</span>
                <div className="flex gap-2">
                  <button onClick={() => setColorMode('dark')} className={`px-3 py-1 text-xs border ${colorMode === 'dark' ? 'border-[var(--os-accent)] text-[var(--os-accent)]' : 'border-[var(--border-strong)] text-[var(--text-muted)]'}`}>DARK</button>
                  <button onClick={() => setColorMode('light')} className={`px-3 py-1 text-xs border ${colorMode === 'light' ? 'border-[var(--os-accent)] text-[var(--os-accent)]' : 'border-[var(--border-strong)] text-[var(--text-muted)]'}`}>LIGHT</button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-xs uppercase">Terminology</span>
                <div className="flex gap-2">
                  <button onClick={() => setTerminology('system')} className={`px-3 py-1 text-xs border ${terminology === 'system' ? 'border-[var(--os-accent)] text-[var(--os-accent)]' : 'border-[var(--border-strong)] text-[var(--text-muted)]'}`}>SYSTEM</button>
                  <button onClick={() => setTerminology('human')} className={`px-3 py-1 text-xs border ${terminology === 'human' ? 'border-[var(--os-accent)] text-[var(--os-accent)]' : 'border-[var(--border-strong)] text-[var(--text-muted)]'}`}>HUMAN</button>
                </div>
              </div>
            </div>

            {/* Конструктор демонов */}
            <div className="flex flex-col gap-4">
              <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border-color)] pb-1">DAEMONS_CONFIG</div>
              
              {Object.keys(daemons).map(key => {
                const Icon = DAEMON_ICONS[key];
                const d = daemons[key];
                return (
                  <div key={key} className={`bg-[var(--bg-panel)] p-3 border border-[var(--border-strong)] flex flex-col gap-3 ${diagRadius}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4" style={{ color: DAEMON_COLORS[key] }}/>
                      <input 
                        value={d.label} onChange={(e) => updateDaemonConfig(key, 'label', e.target.value)}
                        className="bg-transparent border-b border-[var(--border-strong)] outline-none text-xs font-bold w-full text-[var(--text-main)] uppercase"
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-col flex-1">
                        <span className="text-[9px] text-[var(--text-muted)] mb-1">MAX VALUE</span>
                        <input type="number" value={d.max} onChange={(e) => updateDaemonConfig(key, 'max', Number(e.target.value))} className="bg-[var(--bg-button)] border border-[var(--border-strong)] p-1 text-xs text-[var(--text-main)] outline-none" />
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-[9px] text-[var(--text-muted)] mb-1">STEP (+ per click)</span>
                        <input type="number" value={d.step} onChange={(e) => updateDaemonConfig(key, 'step', Number(e.target.value))} className="bg-[var(--bg-button)] border border-[var(--border-strong)] p-1 text-xs text-[var(--text-main)] outline-none" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
          <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-header)] shrink-0 mb-safe">
            <button onClick={closeModals} className={`w-full py-4 bg-[var(--bg-button)] border border-[var(--border-strong)] text-[var(--text-main)] font-bold tracking-widest uppercase active:bg-[var(--bg-button-active)] ${diagRadius}`}>
              APPLY & CLOSE
            </button>
          </div>
        </div>
      )}

      {/* --- МОДАЛКА МАНУАЛА --- */}
      {isManualOpen && (
        <div className="fixed inset-0 z-50 flex flex-col font-mono bg-[var(--bg-base)] text-[var(--text-main)] transition-colors duration-300">
          <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-header)] flex justify-between items-center mt-safe shrink-0">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-[var(--text-muted)]" />
              <div className="text-xs tracking-widest uppercase font-bold text-[var(--text-main)]">{t('manual')}</div>
            </div>
            <button onClick={closeModals} className={`p-2 bg-[var(--bg-button)] border border-[var(--border-strong)] text-[var(--text-main)] active:bg-[var(--bg-button-active)] ${diagRadiusReverse}`}>
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto flex flex-col gap-6 flex-1 text-sm leading-relaxed">
            <p>Добро пожаловать в <strong>ColdCache.OS</strong>. Это терминал управления когнитивной нагрузкой.</p>
            
            <div className="flex flex-col gap-2">
              <div className="font-bold text-[var(--os-accent)]">1. {t('buffer')} (Буфер)</div>
              <p className="text-[var(--text-muted)]">Место для сброса хаоса. Возникла мысль или задача? Быстро записывай её сюда и закрывай терминал. Не держи в голове.</p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="font-bold text-[var(--os-accent)]">2. {t('ram')} (Слоты фокуса)</div>
              <p className="text-[var(--text-muted)]">То, что ты делаешь прямо сейчас. Жесткий лимит — 2 слота. Если пытаешься взять третью задачу, система не даст этого сделать, пока не освободишь память.</p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="font-bold text-[var(--os-accent)]">3. {t('cryo')} (Отложенное)</div>
              <p className="text-[var(--text-muted)]">Задачи, которые нужно сделать, но не сегодня или не сейчас. Замораживай их здесь, чтобы они не мозолили глаза в фокусе.</p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="font-bold text-[var(--os-accent)]">4. {t('render')} (Гиперфокус)</div>
              <p className="text-[var(--text-muted)]">Когда нажимаешь эту кнопку, задача разворачивается на весь экран. Внутри можно создать чек-лист микро-шагов. Если свернуть приложение, состояние рендера сохранится.</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="font-bold text-[var(--os-accent)]">5. Daemons (Трекеры)</div>
              <p className="text-[var(--text-muted)]">Три верхние плашки для отслеживания рутины (шаги, вода, что угодно). Настраиваются индивидуально через меню параметров.</p>
            </div>
          </div>
          
          <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-header)] shrink-0 mb-safe">
            <button onClick={closeModals} className={`w-full py-4 bg-[var(--bg-button)] border border-[var(--border-strong)] text-[var(--text-main)] font-bold tracking-widest uppercase active:bg-[var(--bg-button-active)] ${diagRadius}`}>
              ПОНЯТНО
            </button>
          </div>
        </div>
      )}

    </div>
  );
}