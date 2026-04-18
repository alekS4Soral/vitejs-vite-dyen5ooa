import React, { useState, useEffect } from 'react';
import { Power, ShieldAlert, Cpu, Snowflake, Zap, Terminal, Database, Activity, CheckSquare, Square, Pause, X, Battery, Droplet, SquareActivity, Archive, Palette } from 'lucide-react';

// --- ИНИЦИАЛИЗАЦИЯ И СТРУКТУРЫ ДАННЫХ ---
const DEFAULT_TASKS = [];
const DEFAULT_LOG = [];

const DAEMONS_INIT = {
  steps: { label: 'KINEMATICS', current: 0, max: 10000, unit: 'stp', step: 1000, icon: SquareActivity, color: '#a3e635' },
  water: { label: 'COOLANT', current: 0, max: 2000, unit: 'ml', step: 250, icon: Droplet, color: '#22d3ee' },
  sport: { label: 'HARDWARE', current: 0, max: 1, unit: 'bool', step: 1, icon: Battery, color: '#f97316' }
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
  // --- МОДУЛЬ ЛОКАЛЬНОЙ ПАМЯТИ ---
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('coldcache_tasks');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });
  
  const [renderLog, setRenderLog] = useState(() => {
    const saved = localStorage.getItem('coldcache_log');
    return saved ? JSON.parse(saved) : DEFAULT_LOG;
  });

  const [daemons, setDaemons] = useState(() => {
    const saved = localStorage.getItem('coldcache_daemons');
    const lastDate = localStorage.getItem('coldcache_date');
    const today = new Date().toDateString();
    
    // Проверка на новые сутки (сброс кэша демонов)
    if (lastDate !== today) {
      localStorage.setItem('coldcache_date', today);
      return DAEMONS_INIT;
    }

    // Безопасная инициализация: восстанавливаем только значения (current), 
    // чтобы не сломать React-компоненты иконок из DAEMONS_INIT
    if (saved) {
      const parsed = JSON.parse(saved);
      const restored = { ...DAEMONS_INIT };
      Object.keys(parsed).forEach(key => {
        if (restored[key]) {
          restored[key] = { ...restored[key], current: parsed[key].current };
        }
      });
      return restored;
    }

    return DAEMONS_INIT;
  });

  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('coldcache_theme') || 'cyan';
  });

  useEffect(() => { localStorage.setItem('coldcache_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('coldcache_log', JSON.stringify(renderLog)); }, [renderLog]);
  useEffect(() => { 
    // Сохраняем только числовые данные демонов, отсекая графику
    const daemonsToSave = {};
    Object.keys(daemons).forEach(key => {
      daemonsToSave[key] = { current: daemons[key].current };
    });
    localStorage.setItem('coldcache_daemons', JSON.stringify(daemonsToSave)); 
  }, [daemons]);
  
  useEffect(() => { 
    localStorage.setItem('coldcache_theme', currentTheme);
    document.documentElement.style.setProperty('--os-accent', THEMES[currentTheme].accent);
    document.documentElement.style.setProperty('--os-accent-dim', THEMES[currentTheme].accentDim);
  }, [currentTheme]);

  // --- UI СТЕЙТЫ ---
  const [systemState, setSystemState] = useState('NORMAL'); 
  const [activeColliderTask, setActiveColliderTask] = useState(null);
  const [isBufferOpen, setIsBufferOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [newSubtaskInput, setNewSubtaskInput] = useState('');

  const switchTheme = () => {
    const keys = Object.keys(THEMES);
    setCurrentTheme(keys[(keys.indexOf(currentTheme) + 1) % keys.length]);
  };

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
        id: `node-${Math.floor(Math.random() * 9000) + 1000}`,
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

  const interactDaemon = (key) => {
    setDaemons(prev => {
      const daemon = prev[key];
      if (daemon.current >= daemon.max) return { ...prev, [key]: { ...daemon, current: 0 } };
      return { ...prev, [key]: { ...daemon, current: Math.min(daemon.max, daemon.current + daemon.step) } };
    });
  };

  const totalRenderedData = renderLog.reduce((sum, task) => sum + task.weight, 0);

  if (systemState === 'SAFE_MODE') {
    return (
      <div className="min-h-[100dvh] bg-[#111113] flex flex-col items-center justify-center font-mono text-zinc-600 p-4">
        <Power className="w-16 h-16 mb-8 text-zinc-800 animate-pulse" />
        <div className="tracking-[0.3em] text-center uppercase text-sm md:text-lg">Система в гибернации</div>
        <button onClick={() => setSystemState('NORMAL')} className={`mt-16 px-6 py-3 border border-zinc-800 text-zinc-500 hover:text-zinc-300 uppercase text-xs tracking-widest ${diagRadius}`}>
          Инициализировать загрузку
        </button>
      </div>
    );
  }

  if (systemState === 'COMPILING') {
    return (
      <div className="min-h-[100dvh] bg-[#0c0c0e] flex flex-col items-center justify-center font-mono p-4 md:p-8">
        <Activity className="w-10 h-10 mb-6 animate-pulse opacity-50" style={{ color: 'var(--os-accent)' }} />
        
        <div className={`bg-[#18181b] border border-zinc-800 p-6 w-full max-w-2xl relative shadow-2xl ${diagRadius}`}>
          <div className="text-[10px] md:text-xs tracking-widest mb-3 uppercase flex justify-between text-zinc-400">
            <span>[ {activeColliderTask?.id} ] ИЗОЛЯЦИЯ</span>
            <span style={{ color: 'var(--os-accent)' }}>{activeColliderTask?.progress}%</span>
          </div>
          <div className="text-lg md:text-2xl tracking-wide mb-6 text-zinc-100">{activeColliderTask?.title}</div>
          
          <div className="w-full h-1 mb-4 relative bg-zinc-900 rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full transition-all duration-300" style={{ backgroundColor: 'var(--os-accent)', width: `${activeColliderTask?.progress}%` }} />
          </div>
          
          <div className="flex gap-2 mb-8 text-[10px] md:text-xs">
            <button onClick={() => updateProgress(-10)} className={`px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 active:bg-zinc-800 ${diagRadiusReverse}`}>-10%</button>
            <button onClick={() => updateProgress(10)} className={`px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 active:bg-zinc-800 ${diagRadiusReverse}`}>+10%</button>
            <button onClick={() => updateProgress(100 - activeColliderTask.progress)} className={`px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 active:bg-zinc-800 ml-auto ${diagRadiusReverse}`}>MAX</button>
          </div>

          <div className="mb-8 border-l-2 border-zinc-800 pl-4 flex flex-col gap-3">
            <div className="text-[10px] uppercase tracking-widest text-zinc-500">Векторы исполнения:</div>
            
            {activeColliderTask?.subtasks?.map(sub => (
              <button key={sub.id} onClick={() => toggleSubtask(sub.id)} className="flex items-start gap-3 text-left">
                <div className="mt-0.5">
                  {sub.done ? <CheckSquare className="w-4 h-4" style={{ color: 'var(--os-accent)' }} /> : <Square className="w-4 h-4 text-zinc-600" />}
                </div>
                <span className={`text-sm ${sub.done ? 'text-zinc-600 line-through' : 'text-zinc-300'}`}>{sub.text}</span>
              </button>
            ))}
            
            <div className="flex items-center gap-2 mt-2">
              <span className="text-zinc-600">&gt;</span>
              <input 
                type="text" 
                value={newSubtaskInput}
                onChange={(e) => setNewSubtaskInput(e.target.value)}
                onKeyDown={createSubtask}
                placeholder="append_subtask..."
                className="bg-transparent border-none outline-none text-sm w-full font-mono text-zinc-300 placeholder-zinc-700"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-10 pt-6 border-t border-zinc-800">
            <div className="flex gap-2">
              <button onClick={() => exitCompilation('ACTIVE_RAM')} className={`flex-1 text-[10px] md:text-xs uppercase bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-3 active:bg-zinc-800 flex items-center justify-center gap-2 ${diagRadius}`}>
                <Pause className="w-3 h-3" /> В RAM
              </button>
              <button onClick={() => exitCompilation('CRYO')} className={`flex-1 text-[10px] md:text-xs uppercase bg-zinc-900/50 border border-zinc-800 text-zinc-400 px-3 py-3 active:bg-zinc-800 flex items-center justify-center gap-2 ${diagRadius}`} style={{ color: 'var(--os-accent)' }}>
                <Snowflake className="w-3 h-3" /> В Крио
              </button>
            </div>
            <button onClick={finishCompilation} className={`text-xs uppercase font-bold tracking-widest px-6 py-3 flex items-center justify-center gap-2 text-black ${diagRadiusReverse}`} style={{ backgroundColor: 'var(--os-accent)' }}>
              <Zap className="w-4 h-4" /> Завершить
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeTasks = tasks.filter(t => t.state === 'ACTIVE_RAM');
  const cryoTasks = tasks.filter(t => t.state === 'CRYO');
  const bufferTasks = tasks.filter(t => t.state === 'BUFFER');

  return (
    <div className="h-[100dvh] bg-[#0c0c0e] text-zinc-300 font-mono flex flex-col overflow-hidden">
      <header className="flex-shrink-0 bg-[#141417] border-b border-zinc-800/50 p-4 pb-3 z-10 relative">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <Terminal className="w-4 h-4 md:w-5 md:h-5 text-zinc-500" />
            <div className="text-xs md:text-sm tracking-widest font-bold uppercase text-zinc-100">ColdCache<span style={{ color: 'var(--os-accent)' }}>.OS</span></div>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={switchTheme} className={`p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 active:bg-zinc-800 ${diagRadiusReverse}`} title="Сменить акцент">
              <Palette className="w-3 h-3" />
            </button>

            <button onClick={() => setIsLogOpen(true)} className={`p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 active:bg-zinc-800 relative ${diagRadiusReverse}`} title="Архив">
              <Archive className="w-3 h-3" />
              {renderLog.length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--os-accent)' }}></span>}
            </button>
            
            <button onClick={() => setIsBufferOpen(true)} className={`flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 active:bg-zinc-800 text-[10px] uppercase tracking-widest ${diagRadiusReverse}`}>
              <Database className="w-3 h-3" />
              <span className="hidden sm:inline">Buffer</span>
              {bufferTasks.length > 0 && <span className="px-1.5 rounded-sm bg-zinc-800">{bufferTasks.length}</span>}
            </button>
            
            <button onClick={() => setSystemState('SAFE_MODE')} className={`p-2 border border-red-900/30 text-red-500 active:bg-red-900/20 bg-red-950/10 ${diagRadiusReverse}`}>
              <ShieldAlert className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {Object.entries(daemons).map(([key, data]) => {
            const Icon = data.icon;
            const isDone = data.current >= data.max;
            
            return (
              <button key={key} onClick={() => interactDaemon(key)} className={`bg-zinc-900/50 border border-zinc-800/80 p-2 md:p-3 relative overflow-hidden text-left active:opacity-70 transition-opacity ${diagRadius}`}>
                <div className="absolute bottom-0 left-0 h-full transition-all duration-300 opacity-20" style={{ backgroundColor: data.color, width: `${(data.current / data.max) * 100}%` }} />
                <div className="relative z-10 flex flex-col gap-1 md:flex-row md:justify-between md:items-center">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <Icon className="w-3 h-3 md:w-4 md:h-4" style={{ color: isDone ? data.color : '#71717a' }} />
                    <span className="text-[8px] md:text-[9px] uppercase tracking-widest truncate" style={{ color: isDone ? data.color : '#a1a1aa' }}>{data.label}</span>
                  </div>
                  <span className="text-[10px]" style={{ color: isDone ? data.color : '#52525b', fontWeight: isDone ? 'bold' : 'normal' }}>
                    {data.current}/{data.max}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </header>

      <main className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto">
        <section className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 text-zinc-300">
            <Cpu className="w-4 h-4" />
            <h2 className="uppercase tracking-widest text-xs font-semibold">Active RAM</h2>
            <span className="ml-auto text-[10px] text-zinc-500">СЛОТЫ: {activeTasks.length}/2</span>
          </div>
          <div className="grid gap-4">
            {activeTasks.map(task => (
              <div key={task.id} className={`bg-[#18181b] border border-zinc-800 p-4 md:p-5 relative flex flex-col gap-4 ${diagRadius}`}>
                <div className="absolute top-0 left-0 h-0.5 transition-all" style={{ backgroundColor: 'var(--os-accent)', width: `${task.progress}%` }} />
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="text-[10px] tracking-widest mb-1.5 text-zinc-500">{task.id}</div>
                    <div className="text-sm md:text-base font-semibold text-zinc-200">{task.title}</div>
                  </div>
                  <div className={`text-[10px] px-2 py-1 bg-zinc-900 border border-zinc-800 shrink-0 ${diagRadiusReverse}`} style={{ color: 'var(--os-accent)' }}>{task.progress}%</div>
                </div>
                <div className="flex justify-between items-center mt-2 border-t border-zinc-800/50 pt-4">
                  <button onClick={() => moveTask(task.id, 'CRYO')} className={`text-[10px] uppercase px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center gap-1.5 ${diagRadiusReverse}`}>
                    <Snowflake className="w-3 h-3" /> В Крио
                  </button>
                  <button onClick={() => startCompilation(task)} className={`text-[10px] md:text-xs uppercase px-6 py-2.5 font-bold tracking-widest flex items-center gap-2 text-black ${diagRadiusReverse}`} style={{ backgroundColor: 'var(--os-accent)' }}>
                    <Zap className="w-3 h-3" /> Рендер
                  </button>
                </div>
              </div>
            ))}
            {activeTasks.length === 0 && (
              <div className={`h-24 border border-zinc-800/50 border-dashed flex items-center justify-center text-[10px] uppercase tracking-widest text-zinc-600 ${diagRadius}`}>Память свободна</div>
            )}
          </div>
        </section>

        <section className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 text-zinc-500">
            <Snowflake className="w-4 h-4" />
            <h2 className="uppercase tracking-widest text-xs font-semibold">Cryo-Storage</h2>
          </div>
          <div className="flex flex-col gap-2">
            {cryoTasks.map(task => (
              <div key={task.id} className={`bg-[#121214] border border-zinc-800/50 p-3 opacity-60 active:opacity-100 transition-opacity ${diagRadius}`}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[9px] tracking-widest text-zinc-600">{task.id}</span>
                  <span className="text-[9px] text-zinc-600">{task.progress}%</span>
                </div>
                <div className="text-xs md:text-sm text-zinc-400 mb-3 line-through">{task.title}</div>
                <div className="flex justify-between border-t border-zinc-800/50 pt-2">
                  <button onClick={() => setTasks(prev => prev.filter(t => t.id !== task.id))} className="text-[10px] uppercase py-1 text-zinc-600 hover:text-red-500">Drop</button>
                  <button onClick={() => moveTask(task.id, 'ACTIVE_RAM')} className={`text-[10px] uppercase bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-1 ${diagRadiusReverse}`}>
                    В RAM
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {isBufferOpen && (
        <div className="fixed inset-0 z-50 flex flex-col font-mono bg-[#0c0c0e] text-zinc-300">
          <div className="p-4 border-b border-zinc-800 bg-[#141417] flex justify-between items-center mt-safe shrink-0">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-zinc-500" />
              <div>
                <div className="text-xs tracking-widest uppercase font-bold text-zinc-200">Latent Space</div>
                <div className="text-[9px] tracking-widest text-zinc-500">ИЗОЛИРОВАННАЯ СРЕДА</div>
              </div>
            </div>
            <button onClick={() => setIsBufferOpen(false)} className={`p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center gap-2 ${diagRadiusReverse}`}>
              <span className="text-[10px] uppercase tracking-widest hidden sm:inline">Закрыть</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 border-b border-zinc-800 bg-[#18181b] flex items-center gap-3 shrink-0">
            <Terminal className="w-4 h-4" style={{ color: 'var(--os-accent)' }} />
            <input 
              type="text" 
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              onKeyDown={createNewTask}
              placeholder="inject_node (нажми Enter)"
              className="bg-transparent border-none outline-none text-sm md:text-base w-full font-mono text-zinc-200 placeholder-zinc-600"
            />
          </div>
          
          <div className="p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 content-start flex-1">
            {bufferTasks.map(task => (
              <div key={task.id} className={`bg-[#18181b] border border-zinc-800 p-4 flex flex-col justify-between ${diagRadius}`}>
                <div>
                  <div className="text-[9px] mb-2 font-mono text-zinc-500">{task.id}</div>
                  <div className="text-sm text-zinc-300">{task.title}</div>
                </div>
                <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-zinc-800/50">
                  <button onClick={() => moveTask(task.id, 'CRYO')} className={`text-[9px] md:text-[10px] uppercase px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 ${diagRadiusReverse}`}>Крио</button>
                  <button onClick={() => { moveTask(task.id, 'ACTIVE_RAM'); setIsBufferOpen(false); }} className={`text-[9px] md:text-[10px] uppercase px-4 py-2 bg-zinc-800 border border-zinc-700 text-white font-bold ${diagRadiusReverse}`}>В RAM</button>
                </div>
              </div>
            ))}
            {bufferTasks.length === 0 && <div className="col-span-full h-32 flex items-center justify-center text-[10px] uppercase tracking-widest text-zinc-600">Буфер пуст</div>}
          </div>
        </div>
      )}

      {isLogOpen && (
        <div className="fixed inset-0 z-50 flex flex-col font-mono bg-[#0c0c0e] text-zinc-300">
          <div className="p-4 border-b border-zinc-800 bg-[#141417] flex justify-between items-center mt-safe shrink-0">
            <div className="flex items-center gap-3">
              <Archive className="w-5 h-5 text-zinc-500" />
              <div>
                <div className="text-xs tracking-widest uppercase font-bold text-zinc-200">Кристаллизация</div>
                <div className="text-[9px] tracking-widest" style={{ color: 'var(--os-accent)' }}>СИНТЕЗИРОВАНО: {totalRenderedData} MB</div>
              </div>
            </div>
            <button onClick={() => setIsLogOpen(false)} className={`p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center gap-2 ${diagRadiusReverse}`}>
              <span className="text-[10px] uppercase tracking-widest hidden sm:inline">Закрыть</span>
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto flex flex-col gap-3 flex-1 content-start">
            {renderLog.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-[10px] uppercase tracking-widest text-zinc-600">Архив пуст</div>
            ) : (
              renderLog.map((task, idx) => (
                <div key={idx} className={`bg-[#18181b] border border-zinc-800 p-3 flex justify-between items-center ${diagRadius}`}>
                  <div>
                    <div className="text-[9px] mb-1 font-mono flex gap-2 text-zinc-500">
                      <span>{task.completedAt}</span>
                      <span style={{ color: 'var(--os-accent)' }}>[{task.id}]</span>
                    </div>
                    <div className="text-sm font-semibold text-zinc-300">{task.title}</div>
                  </div>
                  <div className={`text-[10px] px-2 py-1 bg-zinc-900 border border-zinc-800 font-bold text-zinc-400 ${diagRadiusReverse}`}>
                    +{task.weight} MB
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}

