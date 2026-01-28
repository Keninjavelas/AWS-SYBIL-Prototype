import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface LogEntry {
  id: string;
  timestamp: string;
  type: string;    // e.g. "SYS", "NET", "AUTH"
  message: string; // The actual text content
}

interface TerminalContextType {
  logs: LogEntry[];
  addLog: (text: string) => void;
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

export const TerminalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>([
    // Initial static logs (No timestamp, visible in your screenshot)
    { id: 'init-1', timestamp: '', type: 'SYS', message: 'S.Y.B.I.L. KERNEL v4.0.2 LOADED' },
    { id: 'init-2', timestamp: '', type: 'NET', message: 'SECURE UPLINK ESTABLISHED' },
    { id: 'init-3', timestamp: '', type: 'SYS', message: 'AWAITING TRIBUNAL INPUT...' },
  ]);

  const addLog = (text: string) => {
    const now = new Date();
    // Create a cool digital timestamp
    const timeString = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
    
    // --- THE FIX: ROBUST PARSING LOGIC ---
    // 1. Default assumption: It's a system message
    let type = 'SYS';
    let message = text;

    // 2. Check for [TAG] at the start
    // Regex matches "[ANYTHING] " followed by text
    const match = text.match(/^\[(.*?)\]\s*(.*)$/);
    
    if (match && match[2]) {
      type = match[1];      // The content inside []
      message = match[2];   // The text after ]
    } else if (match) {
        // Edge case: Log was just "[TAG]" with no text
        type = match[1];
        message = "";
    }

    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: timeString,
      type,
      message
    };

    // Keep only the last 50 logs to prevent lag
    setLogs(prev => [...prev.slice(-49), newLog]);
  };

  return (
    <TerminalContext.Provider value={{ logs, addLog }}>
      {children}
    </TerminalContext.Provider>
  );
};

export const useTerminal = () => {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error('useTerminal must be used within a TerminalProvider');
  }
  return context;
};