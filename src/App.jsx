import React, { useState, useEffect } from 'react';
import { Power, ShieldAlert, Cpu, Snowflake, Zap, Terminal, Calendar, Database, Activity, CheckSquare, Square, Pause, X, Battery, Droplet, SquareActivity, Archive, Settings, Edit2, RotateCcw, BookOpen, Heart, Target, Coffee, Star, Flame, Wind, ArrowUpDown } from 'lucide-react';
import { DICT, DEFAULT_TASKS, DEFAULT_LOG, ICON_MAP, DAEMON_COLORS, DAEMONS_INIT, SHAPES } from './config/constants';
import { useSystemConfig } from './hooks/useSystemConfig';
import { useDaemons } from './hooks/useDaemons';
import { useCoreMemory } from './hooks/useCoreMemory';
import { SafeModeScreen } from './components/screens/SafeModeScreen';
import { ManualModal } from './components/modals/ManualModal';
import { ArchiveModal } from './components/modals/ArchiveModal';
import { BufferModal } from './components/modals/BufferModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { SystemHeader } from './components/layout/SystemHeader';
import { ActiveRamPanel } from './components/layout/ActiveRamPanel';
import { CryoStoragePanel } from './components/layout/CryoStoragePanel';
import { CompilingScreen } from './components/screens/CompilingScreen';
import { DevNullConsole } from './components/layout/DevNullConsole';
import { StyleInjection } from './components/StyleInjection';
import { TemporalFlux } from './components/layout/TemporalFlux';
import { TemporalFluxModal } from './components/modals/TemporalFluxModal';
import { ScheduleModal } from './components/modals/ScheduleModal';

export default function App() {
  const { isReady, colorMode, setColorMode, terminology, setTerminology, uiShape, setUiShape, colorStyle, setColorStyle, accent1, setAccent1, accent2, setAccent2, glowLevel, setGlowLevel } = useSystemConfig();
  const { daemons, interactDaemon, updateDaemonConfig } = useDaemons();
  const { tasks, setTasks, renderLog, setRenderLog, systemState, setSystemState, activeColliderTask, setActiveColliderTask, moveTask, restoreFromArchive, startCompilation, exitCompilation, finishCompilation, toggleSubtask, deleteSubtask, updateProgress, updateTaskSchedule } = useCoreMemory();

  const isDark = colorMode === 'dark';
  const textMainHex = isDark ? '#d4d4d8' : '#27272a';
  const textMutedHex = isDark ? '#71717a' : '#52525b';

  // Разрешение геометрии (теперь без тотального свечения)
  const shapePrimary = SHAPES[uiShape]?.primary || SHAPES.diag.primary;
  const shapeSecondary = SHAPES[uiShape]?.secondary || SHAPES.diag.secondary;

  const t = (key) => DICT[terminology][key];

  // --- UI СТЕЙТЫ МОДАЛОК ---
  const [isBufferOpen, setIsBufferOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isBufferReversed, setIsBufferReversed] = useState(true);
  
  const [isTemporalOpen, setIsTemporalOpen] = useState(false);
  const [schedulingTask, setSchedulingTask] = useState(null); // Это для меню даты

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

// --- БАРЬЕР ЗАГРУЗКИ ПРОТОКОЛОВ ---
if (!isReady) {
  return (
    <div className="h-[100dvh] bg-[#0c0c0e] text-[#06b6d4] flex items-center justify-center font-mono text-sm tracking-widest uppercase">
      Инициализация протоколов...
    </div>
  );
}

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
      <StyleInjection 
  accent1={accent1} 
  accent2={accent2} 
  colorStyle={colorStyle} 
  glowLevel={glowLevel} 
  isDark={isDark} 
  textMainHex={textMainHex} 
  textMutedHex={textMutedHex} 
/>
    </SafeModeScreen>
  );
}

  // --- ЭКРАН ФОКУСА (РЕНДЕР) ---
  if (systemState === 'COMPILING') {
    return (
      <CompilingScreen
        activeColliderTask={activeColliderTask}
        textMainHex={textMainHex}
        textMutedHex={textMutedHex}
        shapePrimary={shapePrimary}
        shapeSecondary={shapeSecondary}
        t={t}
        terminology={terminology}
        colorStyle={colorStyle}
        finishCompilation={finishCompilation}
        exitCompilation={exitCompilation}
        updateProgress={updateProgress}
        newSubtaskInput={newSubtaskInput}
        setNewSubtaskInput={setNewSubtaskInput}
        createSubtask={createSubtask}
        toggleSubtask={toggleSubtask}
        deleteSubtask={deleteSubtask}
        isSubtasksEditMode={isSubtasksEditMode}
        setIsSubtasksEditMode={setIsSubtasksEditMode}
        startEditSubtask={startEditSubtask}
        editingSubtaskId={editingSubtaskId}
        editSubtaskValue={editSubtaskValue}
        setEditSubtaskValue={setEditSubtaskValue}
        saveEditSubtask={saveEditSubtask}
        handleSubtaskEditKeyDown={handleSubtaskEditKeyDown}
        draggedSubtaskId={draggedSubtaskId}
        handleDragStart={handleDragStart}
        handleDragEnd={handleDragEnd}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        onScheduleTask={(task) => setSchedulingTask(task)}
      >
        <StyleInjection 
          accent1={accent1} accent2={accent2} colorStyle={colorStyle} 
          glowLevel={glowLevel} isDark={isDark} textMainHex={textMainHex} 
          textMutedHex={textMutedHex} 
        />
      </CompilingScreen>
    );
  }

  // --- ГЛАВНЫЙ ЭКРАН ---
  return (
    <div className={`h-[100dvh] bg-[var(--bg-base)] text-[var(--text-main)] font-mono flex flex-col overflow-hidden transition-colors duration-300 ${colorStyle === 'gradient' ? 'is-gradient' : 'is-flat'}`}>
      <StyleInjection 
  accent1={accent1} 
  accent2={accent2} 
  colorStyle={colorStyle} 
  glowLevel={glowLevel} 
  isDark={isDark} 
  textMainHex={textMainHex} 
  textMutedHex={textMutedHex} 
/>
      <SystemHeader 
        textMainHex={textMainHex}
        textMutedHex={textMutedHex}
        shapePrimary={shapePrimary}
        shapeSecondary={shapeSecondary}
        setIsManualOpen={setIsManualOpen}
        setIsLogOpen={setIsLogOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        setSystemState={setSystemState}
        renderLog={renderLog}
        daemons={daemons}
        interactDaemon={interactDaemon}
      />

      <main className="flex-1 p-4 flex flex-col gap-6 overflow-y-auto relative">
        
      <div className="flex gap-4 shrink-0">
  <button onClick={() => setIsBufferOpen(true)} className={`flex-1 py-4 flex items-center justify-center gap-3 bg-[var(--bg-panel)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] uppercase tracking-widest text-xs font-bold transition-all ${shapePrimary}`} style={{ color: textMainHex }}>
    <Database className="w-4 h-4" style={{ color: 'var(--os-accent-1)' }} />
    {t('buffer')}
    {bufferTasks.length > 0 && <span className="px-2 py-0.5 rounded-sm bg-[var(--bg-button)] text-[10px] ml-2">{bufferTasks.length}</span>}
  </button>

  <button onClick={() => setIsTemporalOpen(true)} className={`flex-1 py-4 flex items-center justify-center gap-3 bg-[var(--bg-panel)] border border-[var(--border-strong)] active:bg-[var(--bg-button-active)] uppercase tracking-widest text-xs font-bold transition-all ${shapePrimary}`} style={{ color: textMainHex }}>
    <Calendar className="w-4 h-4" style={{ color: 'var(--os-accent-2)' }} />
    TEMPORAL_FLUX
  </button>
</div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-safe">
          <ActiveRamPanel 
            t={t}
            textMainHex={textMainHex}
            textMutedHex={textMutedHex}
            shapePrimary={shapePrimary}
            shapeSecondary={shapeSecondary}
            activeTasks={activeTasks}
            editingNodeId={editingNodeId}
            editInputValue={editInputValue}
            setEditInputValue={setEditInputValue}
            handleEditKeyDown={handleEditKeyDown}
            saveEditNode={saveEditNode}
            startEditNode={startEditNode}
            moveTask={moveTask}
            startCompilation={startCompilation}
            onScheduleTask={(task) => setSchedulingTask(task)}
          />

          <CryoStoragePanel 
            t={t}
            textMainHex={textMainHex}
            textMutedHex={textMutedHex}
            shapePrimary={shapePrimary}
            shapeSecondary={shapeSecondary}
            cryoTasks={cryoTasks}
            editingNodeId={editingNodeId}
            editInputValue={editInputValue}
            setEditInputValue={setEditInputValue}
            handleEditKeyDown={handleEditKeyDown}
            saveEditNode={saveEditNode}
            startEditNode={startEditNode}
            moveTask={moveTask}
            setTasks={setTasks}
            onScheduleTask={(task) => setSchedulingTask(task)}
          />
        </div>

        {/* Пространственный буфер, чтобы Dev/null не перекрывал Крио-задачи */}
        <div className="h-28 shrink-0 pointer-events-none"></div>

{/* --- DEV/NULL КОНСОЛЬ (СБРОС МУСОРА) --- */}
<DevNullConsole 
  t={t}
  textMutedHex={textMutedHex}
  shapePrimary={shapePrimary}
  isDevNullFading={isDevNullFading}
  devNullInput={devNullInput}
  setDevNullInput={setDevNullInput}
  handleDevNull={handleDevNull}
/>
</main>

{/* --- МОДАЛКА КАЛЕНДАРЯ --- */}
{isTemporalOpen && (
  <TemporalFluxModal
    tasks={tasks}
    onClose={() => setIsTemporalOpen(false)}
    shapePrimary={shapePrimary}
    shapeSecondary={shapeSecondary}
    textMainHex={textMainHex}
    textMutedHex={textMutedHex}
  />
)}

{/* --- МЕНЮ НАЗНАЧЕНИЯ ДАТЫ --- */}
{schedulingTask && (
  <ScheduleModal
    task={schedulingTask}
    onClose={() => setSchedulingTask(null)}
    onSave={updateTaskSchedule}
    shapePrimary={shapePrimary}
    textMainHex={textMainHex}
    textMutedHex={textMutedHex}
  />
)}

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
          onScheduleTask={(task) => setSchedulingTask(task)}
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