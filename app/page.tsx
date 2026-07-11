'use client';

import React, { useState } from 'react';
import ModeSelector from '@/components/ModeSelector';
import ChatContainer from '@/components/ChatContainer';
import TaskPanel, { Task } from '@/components/TaskPanel';

export default function VaziDashboard() {
  const [mode, setMode] = useState<'chat' | 'task' | 'orchestrate'>('chat');
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmitPipeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    let updatedTaskList = taskList;
    let newTaskId: string | null = null;

    if (mode === 'orchestrate') {
      newTaskId = Math.random().toString();
      const newTask: Task = { id: newTaskId, title: input, status: 'ROUTED', agent: 'Orchestrator Core (gpt-oss-120b)' };
      updatedTaskList = [...taskList, newTask];
      setTaskList(updatedTaskList);
    }

    try {
      const response = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, mode, taskList: updatedTaskList })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Pipeline resolution execution sequence failure.');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);

      if (mode === 'orchestrate' && newTaskId) {
        const doneId = newTaskId;
        setTaskList(prev => prev.map(t => t.id === doneId ? { ...t, status: 'DONE' } : t));
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `[CRITICAL FAULT] Native pipeline error: ${err.message}` }]);

      if (mode === 'orchestrate' && newTaskId) {
        const failedId = newTaskId;
        setTaskList(prev => prev.map(t => t.id === failedId ? { ...t, status: 'FAILED' } : t));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-zinc-100 min-h-screen w-full font-mono flex flex-col p-4 md:p-8 antialiased">
      <header className="border-b border-zinc-800 pb-4 mb-6 max-w-6xl w-full mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-wider text-amber-500">VAZI AI // PERSONAL ORCHESTRATION COGNITIVE EDGE</h1>
          <p className="text-xs text-zinc-500 mt-1">Multi-Agent Task Extraction Node [Model: gpt-oss-120b]</p>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto flex flex-col gap-6">
        <ModeSelector currentMode={mode} setMode={setMode} />

        <div className="flex flex-col md:flex-row gap-6 items-start flex-1">
          <div className="flex-1 w-full flex flex-col gap-4 min-h-[450px]">
            <ChatContainer messages={messages} />
            
            <form onSubmit={handleSubmitPipeline} className="flex gap-2 w-full mt-auto">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={mode === 'orchestrate' ? "Input composite directive sequence..." : "Enter directive parameters..."}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-zinc-100 placeholder-zinc-700 font-mono"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 text-black disabled:text-zinc-600 px-6 py-3 rounded-lg text-sm font-bold tracking-wider transition-all"
              >
                {loading ? 'PROCESSING...' : 'DISPATCH'}
              </button>
            </form>
          </div>

          <TaskPanel tasks={taskList} />
        </div>
      </main>
    </div>
  );
}
