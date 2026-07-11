import React from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatContainerProps {
  messages: Message[];
}

export default function ChatContainer({ messages }: ChatContainerProps) {
  return (
    <div className="flex-1 overflow-y-auto border border-zinc-800 bg-zinc-950 p-4 rounded-xl space-y-4 font-mono min-h-[300px] max-h-[500px]">
      {messages.length === 0 && (
        <p className="text-zinc-600 text-center text-sm mt-12">[ VAZI AI SYSTEM READY - DISPATCH INSTRUCTION UNIT ]</p>
      )}
      {messages.map((m, idx) => (
        <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[85%] rounded-lg p-3 text-sm leading-relaxed ${
            m.role === 'user' ? 'bg-zinc-800 text-white' : 'bg-zinc-900 text-amber-400 border border-zinc-800'
          }`}>
            <span className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-50">
              {m.role === 'user' ? '► USER' : '⚡ VAZI_ORCHESTRATOR'}
            </span>
            <p className="whitespace-pre-wrap">{m.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
