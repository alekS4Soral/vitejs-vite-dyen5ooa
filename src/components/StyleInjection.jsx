export function StyleInjection({ accent1, accent2, colorStyle, glowLevel, isDark, textMainHex, textMutedHex }) {
  
    const hexToRgb = (hex) => {
      let r = 0, g = 0, b = 0;
      if (hex && hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16); g = parseInt(hex[2] + hex[2], 16); b = parseInt(hex[3] + hex[3], 16);
      } else if (hex && hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16); g = parseInt(hex.substring(3, 5), 16); b = parseInt(hex.substring(5, 7), 16);
      }
      return `${r}, ${g}, ${b}`;
    };
  
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
      body { background-color: var(--bg-base); color: var(--text-main); }
      
      .glow-accent { box-shadow: 0 0 calc(var(--os-glow-level) * 0.4px) rgba(var(--os-accent-rgb), calc(var(--os-glow-level) / 100)); }
      
      .is-flat .border-accent { border-color: var(--os-accent-1) !important; }
      .is-gradient .border-accent { border-color: transparent !important; position: relative; }
      .is-gradient .border-accent::after {
          content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1.5px;
          background: var(--os-accent-bg); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; z-index: 1;
      }
      
      input[type="range"] { accent-color: var(--os-accent-1); }
      input[type="color"] { -webkit-appearance: none; border: none; padding: 0; background: transparent; }
      input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
      input[type="color"]::-webkit-color-swatch { border: 1px solid var(--border-strong); border-radius: 4px; }
      
      @keyframes ambient-breathe { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } }
      @keyframes core-beat { 0%, 100% { opacity: 0.3; filter: drop-shadow(0 0 2px var(--os-accent-1)); transform: scale(0.95); } 15% { opacity: 1; filter: drop-shadow(0 0 25px var(--os-accent-1)); transform: scale(1.15); } 40% { opacity: 0.5; filter: drop-shadow(0 0 8px var(--os-accent-1)); transform: scale(1); } }
      @keyframes beam-left { 0%, 10% { transform: translateX(100%); opacity: 0; } 15% { opacity: 1; } 55%, 100% { transform: translateX(-100%); opacity: 0; } }
      @keyframes beam-right { 0%, 10% { transform: translateX(-100%); opacity: 0; } 15% { opacity: 1; } 55%, 100% { transform: translateX(100%); opacity: 0; } }
      
      .bg-ambient { background: radial-gradient(circle at 50% 50%, rgba(var(--os-accent-rgb), 0.15), transparent 70%); animation: ambient-breathe 8s ease-in-out infinite; }
      .energy-core { animation: core-beat 3s cubic-bezier(0.1, 0.8, 0.3, 1) infinite; }
      .energy-beam-left { background: linear-gradient(270deg, var(--os-accent-1) 0%, rgba(var(--os-accent-rgb), 0.5) 20%, transparent 100%); animation: beam-left 3s cubic-bezier(0.2, 0, 0.2, 1) infinite; }
      .energy-beam-right { background: linear-gradient(90deg, var(--os-accent-1) 0%, rgba(var(--os-accent-rgb), 0.5) 20%, transparent 100%); animation: beam-right 3s cubic-bezier(0.2, 0, 0.2, 1) infinite; }
  
      @keyframes subtask-fade { 0%, 100% { opacity: 1; filter: blur(0px); } 50% { opacity: 0.5; filter: blur(0.5px); } }
      .is-fading { animation: subtask-fade 4.5s ease-in-out infinite; cursor: grab; display: inline-block; will-change: opacity, filter; }
      .is-fading:active { cursor: grabbing; opacity: 0.8 !important; filter: blur(0px) !important; }
  
      /* Анимация растворения для Dev/null */
      @keyframes dissolve { 0% { filter: blur(0); opacity: 1; transform: translateY(0) scale(1); } 100% { filter: blur(6px); opacity: 0; transform: translateY(-10px) scale(0.95); } }
      .dev-null-fade { animation: dissolve 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
    `;
  
    return <style dangerouslySetInnerHTML={{ __html: cssVariables }} />;
  }