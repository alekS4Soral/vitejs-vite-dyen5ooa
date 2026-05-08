import { useState, useEffect } from 'react';
import { DEFAULT_TASKS, DEFAULT_LOG } from '../config/constants';

export function useCoreMemory() {
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('cc_tasks')) || DEFAULT_TASKS);
  const [renderLog, setRenderLog] = useState(() => JSON.parse(localStorage.getItem('cc_log')) || DEFAULT_LOG);
  const [systemState, setSystemState] = useState(() => localStorage.getItem('cc_state') || 'NORMAL'); 
  const [activeColliderTask, setActiveColliderTask] = useState(() => JSON.parse(localStorage.getItem('cc_active_task')) || null);
  const [ramOverflowTask, setRamOverflowTask] = useState(null);

  useEffect(() => { localStorage.setItem('cc_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('cc_log', JSON.stringify(renderLog)); }, [renderLog]);
  useEffect(() => { localStorage.setItem('cc_state', systemState); }, [systemState]);
  useEffect(() => { localStorage.setItem('cc_active_task', JSON.stringify(activeColliderTask)); }, [activeColliderTask]);

  const moveTask = (taskId, targetState) => {
    setTasks(prev => {
      const activeRamCount = prev.filter(t => t.state === 'ACTIVE_RAM').length;
       
      // Check for overflow
      const targetTask = prev.find(t => t.id === taskId);
      if (targetTask && targetState === 'ACTIVE_RAM' && targetTask.state !== 'ACTIVE_RAM' && activeRamCount >= 2) {
        setRamOverflowTask(targetTask);
        return prev;
      }
      
      return prev.map(task => {
        if (task.id === taskId) {
          return { ...task, state: targetState };
        }
        return task;
      });
    });
  };

  // Новая функция для планирования
  const updateTaskSchedule = (taskId, date, time) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, scheduledDate: date, scheduledTime: time } : task
    ));
    setActiveColliderTask(prev => 
      prev && prev.id === taskId ? { ...prev, scheduledDate: date, scheduledTime: time } : prev
    );
  };
  
  const restoreFromArchive = (taskId) => {
    const taskToRestore = renderLog.find(t => t.id === taskId);
    if (taskToRestore) {
      setRenderLog(prev => prev.filter(t => t.id !== taskId));
      setTasks(prev => [...prev, { ...taskToRestore, state: 'CRYO', progress: 0, subtasks: [] }]);
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

  const toggleSubtask = (subId) => {
    setActiveColliderTask(prev => {
      const updatedSubtasks = prev.subtasks.map(s => s.id === subId ? { ...s, done: !s.done } : s);
      const doneCount = updatedSubtasks.filter(s => s.done).length;
      const newProgress = updatedSubtasks.length > 0 ? Math.round((doneCount / updatedSubtasks.length) * 100) : prev.progress;
      return { ...prev, subtasks: updatedSubtasks, progress: newProgress };
    });
  };

  const deleteSubtask = (subId) => {
    setActiveColliderTask(prev => {
      const updatedSubtasks = prev.subtasks.filter(s => s.id !== subId);
      const doneCount = updatedSubtasks.filter(s => s.done).length;
      const newProgress = updatedSubtasks.length > 0 ? Math.round((doneCount / updatedSubtasks.length) * 100) : prev.progress;
      return { ...prev, subtasks: updatedSubtasks, progress: newProgress };
    });
  };

  const updateProgress = (amount) => {
    setActiveColliderTask(prev => ({ ...prev, progress: Math.min(100, Math.max(0, prev.progress + amount)) }));
  };

  return {
    tasks, setTasks, renderLog, setRenderLog, systemState, setSystemState, activeColliderTask, setActiveColliderTask,
    moveTask, restoreFromArchive, startCompilation, exitCompilation, finishCompilation, toggleSubtask, deleteSubtask, updateProgress, updateTaskSchedule,
    ramOverflowTask, setRamOverflowTask
  };
}