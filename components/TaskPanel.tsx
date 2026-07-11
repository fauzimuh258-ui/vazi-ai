import React from 'react';

export interface Task {
  id: string;
  title: string;
  status: 'PENDING' | 'ROUTED' | 'DONE' | 'FAILED';
  agent?: string;
}

interface TaskPanelProps {
  tasks: Task[];
}

export default function TaskPanel({ tasks }: TaskPanelProps) {
  return (
    <div className="border border-zinc-800 bg-zinc-950 p-4 rounded-xl font-mono w-full md:w-80">
      <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-3 border-b border-zinc-800 pb-2">
        [ SUBSYSTEM TASK BUFFER ]
      </h3>
      {tasks.length === 0 ? (
        <p className="text-zinc-600 text-xs">[ No structured runtime processes ]</p>
      ) : (
        <div className="space-y-2">
          {tasks.map((t) => (
            <div key={t.id} className="bg-zinc-900 border border-zinc-800 p-2.5 rounded text-xs flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="text-white truncate font-medium max-w-[150px]">{t.title}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  t.status === 'DONE'
                    ? 'bg-emerald-950 text-emerald-400'
                    : t.status === 'ROUTED'
                    ? 'bg-blue-950 text-blue-400'
                    : t.status === 'FAILED'
                    ? 'bg-rose-950 text-rose-400'
                    : 'bg-amber-950 text-amber-400'
                }`}>
                  {t.status}
                </span>
              </div>
              {t.agent && <span className="text-[10px] text-zinc-500 font-mono">NODE: {t.agent.toUpperCase()}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
