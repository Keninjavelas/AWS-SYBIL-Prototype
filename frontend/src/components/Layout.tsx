import React, { ReactNode } from 'react';
import Terminal from './Terminal'; // Keep the Terminal on the right
import { Activity } from 'lucide-react';

// Define Props Interface
interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-mono">
      
      {/* LEFT: Context Panel */}
      <div className="w-64 border-r border-slate-800 flex flex-col p-6 bg-slate-900/50">
        <h1 className="text-2xl font-bold tracking-tighter text-cyan-400 mb-1">S.Y.B.I.L.</h1>
        <p className="text-xs text-slate-500 mb-8">v4.0 // PROTOTYPE</p>

        <div className="space-y-6">
          <div>
            <label className="text-xs text-slate-500 uppercase">Role</label>
            <div className="font-bold text-slate-200">Senior Backend Eng</div>
          </div>
          <div>
            <label className="text-xs text-slate-500 uppercase">Scenario</label>
            <div className="font-bold text-red-500">Friday Deploy</div>
          </div>
          <div>
             <label className="text-xs text-slate-500 uppercase">Status</label>
             <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold">
                <Activity size={12} /> LIVE
             </div>
          </div>
        </div>
      </div>

      {/* MIDDLE: Intelligence (This is where Dashboard goes now) */}
      <div className="flex-1 overflow-y-auto bg-slate-950 relative">
        {children}
      </div>

      {/* RIGHT: Action */}
      <div className="w-[450px] border-l border-slate-800 bg-slate-900/30">
        <Terminal />
      </div>
    </div>
  );
}