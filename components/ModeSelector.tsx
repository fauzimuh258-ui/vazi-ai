import React from 'react';

interface ModeSelectorProps {
  currentMode: 'chat' | 'task' | 'orchestrate';
  setMode: (mode: 'chat' | 'task' | 'orchestrate') => void;
}

export default function ModeSelector({ currentMode, setMode }: ModeSelectorProps) {
  const modes = [
    { id: 'chat', label: 'Personal Chat' },
    { id: 'task', label: 'Task Matrix' },
    { id: 'orchestrate', label: 'Auto-Orchestrator' }
  ] as const;

  return (
    <div className="flex bg-zinc-900 p-1.5 rounded-lg border border-zinc-800 w-full max-w-md mx-auto mb-6">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          className={`flex-1 py-2 text-sm font-mono rounded-md font-medium transition-all ${
            currentMode === m.id
              ? 'bg-amber-500 text-black shadow-lg font-bold'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
