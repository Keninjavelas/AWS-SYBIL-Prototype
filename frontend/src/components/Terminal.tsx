import React, { useEffect, useRef } from 'react';
import { useTerminal, LogEntry } from '../context/TerminalContext';

const Terminal: React.FC = () => {
  const { logs } = useTerminal();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Helper to color-code the tags
  const getTagColor = (type: string) => {
    switch (type) {
      case 'ERR': return 'text-red-500';
      case 'AUTH': return 'text-orange-500';
      case 'NET': return 'text-emerald-500';
      case 'MEM': return 'text-purple-400';
      case 'RES': return 'text-yellow-400';
      default: return 'text-cyan-500'; // SYS and others
    }
  };

  return (
    <div className="h-full flex flex-col font-mono text-xs p-4 overflow-hidden relative">
        {/* Terminal Header */}
        <div className="flex justify-between items-center mb-4 opacity-50 border-b border-slate-800 pb-2">
            <span>// COMMAND UPLINK //</span>
            <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
        </div>

        {/* Logs Container */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {logs.map((log: LogEntry) => (
                <div key={log.id} className="flex gap-3 animate-in fade-in duration-300">
                    {/* Timestamp (Hidden for init logs) */}
                    {log.timestamp && (
                        <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                    )}
                    
                    {/* Tag */}
                    <span className={`font-bold shrink-0 ${getTagColor(log.type)}`}>
                        [{log.type}]
                    </span>
                    
                    {/* Message - FORCE TEXT COLOR HERE */}
                    <span className="text-sybil-text break-words opacity-90">
                        {log.message}
                    </span>
                </div>
            ))}
            <div ref={bottomRef} />
        </div>

        {/* Blinking Cursor Footer */}
        <div className="mt-4 pt-2 border-t border-slate-800 flex items-center gap-2 text-emerald-500/50">
            <span>$</span>
            <span className="w-2 h-4 bg-emerald-500 animate-pulse"></span>
            <span className="ml-auto text-[10px] tracking-widest uppercase opacity-40">Listening on PORT 8000</span>
        </div>
    </div>
  );
};

export default Terminal;