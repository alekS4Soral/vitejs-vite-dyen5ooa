import { SquareActivity, Droplet, Battery, Activity, Cpu, Snowflake, Zap, Terminal, Database, Archive, Heart, Target, Coffee, Star, Flame } from 'lucide-react';

export const DICT = {
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
    emptyCryo: 'Отсек пуст',
    temporal: 'Temporal_Flux',
    overload: 'SYSTEM_OVERLOAD',
    overloadMsg: 'Active RAM is full. Cannot move task:',
    overloadPrompt: 'Would you like to move it to CRYO storage instead?',
    moveToCryo: 'Move_To_Cryo',
    cancel: 'Cancel',
    streamMode: 'Stream',
    matrixMode: 'Matrix'
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
    emptyCryo: 'Список пуст',
    temporal: 'Календарь',
    overload: 'Лимит фокуса',
    overloadMsg: 'Слоты фокуса заполнены. Невозможно добавить:',
    overloadPrompt: 'Хотите отложить эту задачу на потом?',
    moveToCryo: 'Отложить',
    cancel: 'Отмена',
    streamMode: 'Ближайшие',
    matrixMode: 'Сетка'
  }
};

export const DEFAULT_TASKS = [];
export const DEFAULT_LOG = [];

export const ICON_MAP = {
  SquareActivity, Droplet, Battery, Activity, Cpu, Snowflake, Zap, Terminal, Database, Archive, Heart, Target, Coffee, Star, Flame
};

export const DAEMON_COLORS = { d1: '#a3e635', d2: '#22d3ee', d3: '#f97316' };

export const DAEMONS_INIT = {
  d1: { label: 'KINEMATICS', current: 0, max: 10000, step: 1000, iconName: 'SquareActivity' },
  d2: { label: 'COOLANT', current: 0, max: 2000, step: 250, iconName: 'Droplet' },
  d3: { label: 'HARDWARE', current: 0, max: 1, step: 1, iconName: 'Battery' }
};

export const SHAPES = {
  diag: { name: 'Tech', primary: 'rounded-tl-2xl rounded-br-2xl rounded-tr-sm rounded-bl-sm', secondary: 'rounded-tr-2xl rounded-bl-2xl rounded-tl-sm rounded-br-sm' },
  sharp: { name: 'Strict', primary: 'rounded-none', secondary: 'rounded-none' },
  soft: { name: 'Bio', primary: 'rounded-2xl', secondary: 'rounded-xl' }
};